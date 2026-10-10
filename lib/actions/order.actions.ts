"use server";
import { auth } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { cookies } from "next/headers";
import { getMyCart } from "./cart.action";
import { getUserById } from "./user.actions";
import { prisma } from "@/db/prisma";
import { convertToPlainObject, formatError } from "../utils";
import { insertOrderSchema } from "../validators";
import { CartItem, PaymentResult, ShippingAddress } from "@/types";
import { paypal } from "../paypal";
import { razorpay } from "../razorpay";
import { revalidatePath } from "next/cache";
import { PAGE_SIZE } from "../constants";
import { Prisma } from "@prisma/client";
import { sendPurchaseReceipt } from "@/email";
import crypto from "crypto";

import { LOYALTY_CONFIG } from '../loyalty.config';

export async function createOrder() {
  try {
    // Check for cart cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not found");

    // Get session and user ID
    const session = await auth();
    // Get cart
    const cart = await getMyCart();
    // Check if cart and address exists
    if (!cart || cart.items.length === 0) {
      return {
        success: false,
        message: "Cart is empty",
        redirectTo: "/cart",
      };
    }

    const userId = session?.user?.id;

    let userAddress = cart.shippingAddress as ShippingAddress | null;
    let paymentMethod = cart.paymentMethod;

    if (userId) {
      const user = await getUserById(userId);
      if (user.address) userAddress = user.address as ShippingAddress;
      if (user.paymentMethod) paymentMethod = user.paymentMethod;
    }

    if (!userAddress) {
      return {
        success: false,
        message: "No shipping address",
        redirectTo: "/shipping-address",
      };
    }

    if (!paymentMethod) {
      return {
        success: false,
        message: "No payment method",
        redirectTo: "/payment-method",
      };
    }

    // Calculate Bhakti Points
    const pointsToRedeem = Number(cart.pointsToRedeem || 0);
    // You only earn points on the subtotal minus discounts, but let's keep it simple: based on itemsPrice or totalPrice
    const pointsEarned = LOYALTY_CONFIG.calculatePointsEarned(Number(cart.totalPrice));

    // Create order object
    const order = insertOrderSchema.parse({
      userId: userId || null,
      guestEmail: userAddress.guestEmail || null,
      shippingAddress: userAddress,
      paymentMethod: paymentMethod,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      couponCode: cart.couponCode || null,
      discountPrice: cart.discountPrice || 0,
      giftCardCode: cart.giftCardCode || null,
      giftCardAmount: cart.giftCardAmount || 0,
      pointsEarned: pointsEarned,
      pointsRedeemed: pointsToRedeem,
      isGiftWrapped: cart.isGiftWrapped,
      totalPrice: cart.totalPrice,
    });

    // Create a transaction to create order and order items in database
    const insertedOrderId = await prisma.$transaction(async (tx) => {
      // Create order
      const insertedOrder = await tx.order.create({ data: order as any });
      
      // Process order items securely
      for (const item of cart.items as CartItem[]) {
        // 1. Verify and deduct stock atomically
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (!product) throw new Error(`Product ${item.name} not found`);
        if (product.stock < item.qty) throw new Error(`Not enough stock for ${item.name}`);

        await tx.product.update({
          where: { id: item.productId },
          data: { stock: product.stock - item.qty }
        });

        // 2. Create Order Item
        await tx.orderItem.create({
          data: {
            productId: item.productId,
            name: item.name,
            slug: item.slug,
            qty: item.qty,
            image: item.image,
            price: item.price,
            orderId: insertedOrder.id,
          },
        });
      }
      
      // Clear cart
      await tx.cart.update({
        where: { id: cart.id },
        data: {
          items: [],
          totalPrice: 0,
          taxPrice: 0,
          shippingPrice: 0,
          itemsPrice: 0,
          couponCode: null,
          discountPrice: 0,
          giftCardCode: null,
          giftCardAmount: 0,
          pointsToRedeem: 0,
        },
      });

      // Secure Gift Card Validation
      if (cart.giftCardCode) {
        const giftCard = await tx.giftCard.findUnique({ where: { code: cart.giftCardCode } });
        if (!giftCard || !giftCard.isActive || Number(giftCard.balance) === 0) {
          throw new Error("Gift card is invalid or already used");
        }
        await tx.giftCard.update({
          where: { code: cart.giftCardCode },
          data: {
            balance: 0,
            isActive: false, // Mark as fully used
          }
        });
      }

      // Secure Coupon Validation
      if (cart.couponCode) {
        const coupon = await tx.coupon.findUnique({ where: { code: cart.couponCode } });
        if (!coupon || !coupon.isActive) throw new Error("Coupon is inactive");
        if (coupon.maxUses !== null && coupon.currentUses >= coupon.maxUses) throw new Error("Coupon usage limit reached");

        await tx.coupon.update({
          where: { code: cart.couponCode },
          data: {
            currentUses: {
              increment: 1
            }
          }
        });
      }

      // Secure Bhakti Points Validation & Updating
      if (userId) {
        const user = await tx.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error("User not found");
        if (user.bhaktiPoints < pointsToRedeem) throw new Error("Insufficient Bhakti points for this transaction");

        const pointDifference = pointsEarned - pointsToRedeem;
        await tx.user.update({
          where: { id: userId },
          data: {
            bhaktiPoints: {
              increment: pointDifference
            },
            lifetimePoints: {
              increment: pointsEarned
            }
          }
        });
      }

      return insertedOrder.id;
    });

    if (!insertedOrderId) throw new Error("Order not created");

    return {
      success: true,
      message: "Order created",
      redirectTo: `/order/${insertedOrderId}`,
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { success: false, message: formatError(error) };
  }
}

// Get order by id
export async function getOrderById(orderId: string) {
  const data = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      orderitems: true,
      user: { select: { name: true, email: true } },
    },
  });

  return convertToPlainObject(data);
}

// Create new paypal order
export async function createPayPalOrder(orderId: string) {
  try {
    // Get order from database
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });

    if (order) {
      // Create paypal order
      const paypalOrder = await paypal.createOrder(Number(order.totalPrice));

      // Update order with paypal order id
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentResult: {
            id: paypalOrder.id,
            email_address: "",
            status: "",
            pricePaid: 0,
          },
        },
      });

      return {
        success: true,
        message: "Item order created successfully",
        data: paypalOrder.id,
      };
    } else {
      throw new Error("Order not found");
    }
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Approve paypal order and update order to paid
export async function approvePayPalOrder(
  orderId: string,
  data: { orderID: string }
) {
  try {
    // Get order from database
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });

    if (!order) throw new Error("Order not found");

    const captureData = await paypal.capturePayment(data.orderID);

    if (
      !captureData ||
      captureData.id !== (order.paymentResult as PaymentResult)?.id ||
      captureData.status !== "COMPLETED"
    ) {
      throw new Error("Error in PayPal payment");
    }

    // Update order to paid
    await updateOrderToPaid({
      orderId,
      paymentResult: {
        id: captureData.id,
        status: captureData.status,
        email_address: captureData.payer.email_address,
        pricePaid:
          captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value,
      },
    });

    revalidatePath(`/order/${orderId}`);

    return {
      success: true,
      message: "Your order has been paid",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function updateOrderToPaid({
  orderId,
  paymentResult,
}: {
  orderId: string;
  paymentResult?: PaymentResult;
}) {
  // Get order from database
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      orderitems: true,
    },
  });

  if (!order) throw new Error("Order not found");

  if (order.isPaid) throw new Error("Order is already paid");

  // Transaction to update order and account for product stock
  await prisma.$transaction(async (tx) => {
    // Iterate over products and update stock
    for (const item of order.orderitems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { increment: -item.qty } },
      });
    }

    // Set the order to paid
    await tx.order.update({
      where: { id: orderId },
      data: {
        isPaid: true,
        paidAt: new Date(),
        paymentResult,
      },
    });
  });

  // Get updated order after transaction
  const updatedOrder = await prisma.order.findFirst({
    where: { id: orderId },
    include: {
      orderitems: true,
      user: { select: { name: true, email: true } },
    },
  });

  if (!updatedOrder) throw new Error('Order not found');

  sendPurchaseReceipt({
    order: {
      ...updatedOrder,
      itemsPrice: updatedOrder.itemsPrice.toString(),
      totalPrice: updatedOrder.totalPrice.toString(),
      shippingPrice: updatedOrder.shippingPrice.toString(),
      taxPrice: updatedOrder.taxPrice.toString(),
      discountPrice: updatedOrder.discountPrice.toString(),
      giftCardAmount: updatedOrder.giftCardAmount.toString(),
      shippingAddress: updatedOrder.shippingAddress as ShippingAddress,
      paymentResult: updatedOrder.paymentResult as PaymentResult,
    } as any,
  });
  
}

// Get user's orders
export async function getMyOrders({
  limit = PAGE_SIZE,
  page,
}: {
  limit?: number;
  page: number;
}) {
  const session = await auth();
  if (!session) throw new Error('User is not authorized');

  const data = await prisma.order.findMany({
    where: { userId: session?.user?.id },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: (page - 1) * limit,
  });

  const dataCount = await prisma.order.count({
    where: { userId: session?.user?.id },
  });

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

type SalesDataType = {
  month: string;
  totalSales: number;
}[];

// Get sales data and order summary
export async function getOrderSummary() {
  // Get counts for each resource
  const ordersCount = await prisma.order.count();
  const productsCount = await prisma.product.count();
  const usersCount = await prisma.user.count();

  // Calculate the total sales
  const totalSales = await prisma.order.aggregate({
    _sum: { totalPrice: true },
  });

  // Get monthly sales
  const salesDataRaw = await prisma.$queryRaw<
    Array<{ month: string; totalSales: Prisma.Decimal }>
  >`SELECT to_char("createdAt", 'MM/YY') as "month", sum("totalPrice") as "totalSales" FROM "Order" GROUP BY to_char("createdAt", 'MM/YY')`;

  const salesData: SalesDataType = salesDataRaw.map((entry) => ({
    month: entry.month,
    totalSales: Number(entry.totalSales),
  }));

  // Get latest sales
  const latestSales = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true } },
    },
    take: 6,
  });

  return {
    ordersCount,
    productsCount,
    usersCount,
    totalSales,
    latestSales,
    salesData,
  };
}

// Get All Orders
export async function getAllOrders({
  limit = PAGE_SIZE,
  page,
  query,
}: {
  limit?: number;
  page: number;
  query: string;
}) {
  const queryFilter: Prisma.OrderWhereInput =
    query && query !== 'all'
      ? {
          user: {
            name: {
              contains: query,
              mode: 'insensitive',
            } as Prisma.StringFilter,
          },
        }
      : {};

  const data = await prisma.order.findMany({
    where: {
      ...queryFilter,
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: (page - 1) * limit,
    include: { user: { select: { name: true } } },
  });

  const dataCount = await prisma.order.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

// Delete an order
export async function deleteOrder(id: string) {
  try {
    const session = await auth();
    if (session?.user?.role !== 'admin') throw new Error('Unauthorized: Admin access required');
    await prisma.order.delete({ where: { id } });

    revalidatePath('/admin/orders');

    return {
      success: true,
      message: 'Order deleted successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Update COD order to paid
export async function updateOrderToPaidCOD(orderId: string) {
  try {
    const session = await auth();
    if (session?.user?.role !== 'admin') throw new Error('Unauthorized: Admin access required');
    await updateOrderToPaid({ orderId });

    revalidatePath(`/order/${orderId}`);

    return { success: true, message: 'Order marked as paid' };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Update COD order to delivered
export async function deliverOrder(orderId: string) {
  try {
    const session = await auth();
    if (session?.user?.role !== 'admin') throw new Error('Unauthorized: Admin access required');
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });

    if (!order) throw new Error('Order not found');
    if (!order.isPaid) throw new Error('Order is not paid');

    await prisma.order.update({
      where: { id: orderId },
      data: {
        isDelivered: true,
        deliveredAt: new Date(),
        status: 'DELIVERED',
      },
    });

    revalidatePath(`/order/${orderId}`);

    return {
      success: true,
      message: 'Order has been marked delivered',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Update order status (Admin)
export async function updateOrderStatus(orderId: string, status: string, awbNumber?: string) {
  try {
    const session = await auth();
    if (session?.user?.role !== 'admin') throw new Error('Unauthorized: Admin access required');
    const order = await prisma.order.findFirst({
      where: { id: orderId },
    });

    if (!order) throw new Error('Order not found');

    const updateData: any = { status };
    if (awbNumber) {
      updateData.awbNumber = awbNumber;
    }
    
    if (status === 'DELIVERED') {
      updateData.isDelivered = true;
      updateData.deliveredAt = new Date();
    }

    await prisma.order.update({
      where: { id: orderId },
      data: updateData,
    });

    revalidatePath(`/order/${orderId}`);
    revalidatePath('/admin/orders');

    return {
      success: true,
      message: `Order status updated to ${status}`,
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Create Razorpay Order
export async function createRazorpayOrder(orderId: string) {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });

    if (order) {
      const options = {
        amount: Math.round(Number(order.totalPrice) * 100), // amount in smallest currency unit (paise)
        currency: "INR",
        receipt: order.id,
      };

      const razorpayOrder = await razorpay.orders.create(options);
      
      return {
        success: true,
        message: 'Order created successfully',
        data: razorpayOrder.id,
      };
    } else {
      throw new Error('Order not found');
    }
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Approve Razorpay Order
export async function approveRazorpayOrder(orderId: string, paymentData: { razorpay_payment_id: string, razorpay_order_id: string, razorpay_signature: string }) {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
      include: {
        user: true,
      }
    });

    if (!order) throw new Error('Order not found');

    const body = paymentData.razorpay_order_id + "|" + paymentData.razorpay_payment_id;
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'YOUR_SECRET')
                                  .update(body.toString())
                                  .digest('hex');
                                  
    if (expectedSignature === paymentData.razorpay_signature) {
      await updateOrderToPaid({
        orderId,
        paymentResult: {
          id: paymentData.razorpay_payment_id,
          status: 'COMPLETED',
          email_address: order.user?.email || '',
          pricePaid: order.totalPrice.toString(),
        },
      });

      revalidatePath(`/order/${orderId}`);

      return {
        success: true,
        message: 'Order paid successfully',
      };
    } else {
       throw new Error('Invalid signature');
    }

  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}