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
import { 
  sendPurchaseReceipt,
  sendAdminNewOrderAlert,
  sendOrderShippedEmail,
  sendOrderOutForDeliveryEmail,
  sendOrderDeliveredEmail,
  sendReturnRequestAlertEmail,
  sendReturnStatusUpdateEmail
} from "@/email";
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

    const isZeroTotal = Number(cart.totalPrice) <= 0;
    
    // SECURITY GUARD:
    // createOrder can ONLY be called for:
    // 1. Zero-amount orders (totalPrice <= 0)
    // 2. Cash on Delivery (paymentMethod === 'CashOnDelivery')
    // All online payments (UPI, Card, NetBanking) MUST go through createPaidOrderWithRazorpay!
    if (!isZeroTotal && paymentMethod !== 'CashOnDelivery') {
      return {
        success: false,
        message: 'Online orders must be completed through the secure payment gateway.',
        redirectTo: '/place-order',
      };
    }

    const finalPaymentMethod = isZeroTotal ? 'GiftCard' : paymentMethod;

    // Create order object
    const order = insertOrderSchema.parse({
      userId: userId || null,
      guestEmail: userAddress.guestEmail || null,
      shippingAddress: userAddress,
      paymentMethod: finalPaymentMethod,
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
      // Create order with paid status if zero amount
      const orderData: any = {
        ...order,
        isPaid: isZeroTotal ? true : false,
        paidAt: isZeroTotal ? new Date() : null,
      };
      const insertedOrder = await tx.order.create({ data: orderData });
      
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

      // Secure Gift Card Validation (Option B: Reusable Debit Balance)
      if (cart.giftCardCode) {
        const giftCard = await tx.giftCard.findUnique({ where: { code: cart.giftCardCode } });
        if (!giftCard || !giftCard.isActive || Number(giftCard.balance) <= 0) {
          throw new Error("Gift card is invalid or has no remaining balance");
        }
        const usedAmount = Number(cart.giftCardAmount || 0);
        const currentBalance = Number(giftCard.balance);
        const newBalance = Math.max(0, currentBalance - usedAmount);
        await tx.giftCard.update({
          where: { code: cart.giftCardCode },
          data: {
            balance: newBalance,
            isActive: newBalance > 0, // Remains active while balance remains
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

    // Fetch created order and dispatch notifications
    try {
      const createdOrder = await prisma.order.findUnique({
        where: { id: insertedOrderId },
        include: {
          orderitems: true,
          user: { select: { name: true, email: true, phoneNumber: true } },
        },
      });

      if (createdOrder) {
        // 1. Notify Admin (info@madhavshringaar.com)
        sendAdminNewOrderAlert({ order: createdOrder }).catch((err) =>
          console.error("Admin order alert failed:", err)
        );

        // 2. If Paid (e.g. Gift Card zero amount) or Cash on Delivery, send purchase receipt to customer immediately
        if (createdOrder.isPaid || createdOrder.paymentMethod === 'CashOnDelivery') {
          sendPurchaseReceipt({ order: createdOrder }).catch((err) =>
            console.error("Customer receipt email failed:", err)
          );
        }
      }
    } catch (notifyErr) {
      console.error("Order notification dispatch error:", notifyErr);
    }

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

// Track order by either Order ID or AWB Tracking Number
export async function trackOrderByQuery(query: string) {
  const trimmed = query.trim();
  if (!trimmed) return null;

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(trimmed);

  const data = await prisma.order.findFirst({
    where: {
      OR: [
        { awbNumber: { equals: trimmed, mode: 'insensitive' } },
        ...(isUuid ? [{ id: trimmed }] : []),
      ],
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

  // Set the order to paid and advance fulfillment status to PROCESSING
  await prisma.order.update({
    where: { id: orderId },
    data: {
      isPaid: true,
      paidAt: new Date(),
      status: 'PROCESSING',
      paymentResult,
    },
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

  try {
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
    }).catch((emailErr) => {
      console.error('Non-blocking: Failed to send purchase receipt email:', emailErr);
    });
  } catch (err) {
    console.error('Non-blocking email error:', err);
  }
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
    include: {
      orderitems: true,
    },
    take: limit,
    skip: (page - 1) * limit,
  });

  const dataCount = await prisma.order.count({
    where: { userId: session?.user?.id },
  });

  return {
    data: convertToPlainObject(data),
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

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        isDelivered: true,
        deliveredAt: new Date(),
        status: 'DELIVERED',
      },
      include: {
        orderitems: true,
        user: { select: { name: true, email: true, phoneNumber: true } },
      },
    });

    // Send delivered notification to both customer and admin
    sendOrderDeliveredEmail({ order: updatedOrder }).catch((err) =>
      console.error('Delivered notification failed:', err)
    );

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
export async function updateOrderStatus(
  orderId: string,
  status: string,
  awbNumber?: string,
  trackingUrl?: string
) {
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
    if (trackingUrl) {
      updateData.trackingUrl = trackingUrl;
    } else if (awbNumber && !order.trackingUrl) {
      updateData.trackingUrl = `https://shiprocket.co/tracking/${awbNumber}`;
    }
    
    if (status === 'DELIVERED') {
      updateData.isDelivered = true;
      updateData.deliveredAt = new Date();
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: {
        orderitems: true,
        user: { select: { name: true, email: true, phoneNumber: true } },
      },
    });

    // Automated Notification Triggers based on status milestone
    if (status === 'SHIPPED') {
      sendOrderShippedEmail({
        order: updatedOrder,
        awbNumber: awbNumber || updatedOrder.awbNumber || undefined,
        trackingUrl: updatedOrder.trackingUrl || undefined,
      }).catch((err) => console.error('Shipped email notification failed:', err));
    } else if (status === 'OUT_FOR_DELIVERY') {
      sendOrderOutForDeliveryEmail({ order: updatedOrder }).catch((err) =>
        console.error('Out for delivery notification failed:', err)
      );
    } else if (status === 'DELIVERED') {
      sendOrderDeliveredEmail({ order: updatedOrder }).catch((err) =>
        console.error('Delivered notification failed:', err)
      );
    }

    revalidatePath(`/order/${orderId}`);
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath('/admin/orders');

    return {
      success: true,
      message: `Order status updated to ${status}`,
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Manual Courier & AWB Dispatch (Admin)
export async function dispatchManualCourier({
  orderId,
  courierName,
  awbNumber,
}: {
  orderId: string;
  courierName?: string;
  awbNumber: string;
}) {
  try {
    const session = await auth();
    if (session?.user?.role !== 'admin') throw new Error('Unauthorized: Admin access required');

    if (!awbNumber || !awbNumber.trim()) {
      throw new Error('Please enter a valid AWB Tracking Number');
    }

    const cleanAwb = awbNumber.trim();
    let trackingUrl = `https://shiprocket.co/tracking/${cleanAwb}`;

    const courierLower = (courierName || '').toLowerCase();
    if (courierLower.includes('delhivery')) {
      trackingUrl = `https://www.delhivery.com/track/package/${cleanAwb}`;
    } else if (courierLower.includes('bluedart')) {
      trackingUrl = `https://www.bluedart.com/tracking?trackNumber=${cleanAwb}`;
    } else if (courierLower.includes('india post') || courierLower.includes('speed post')) {
      trackingUrl = `https://www.indiapost.gov.in/_layouts/15/dpt.cept.tracking/trackconsignment.aspx`;
    } else if (courierLower.includes('dtdc')) {
      trackingUrl = `https://www.dtdc.in/tracking/shipment-tracking.asp?awbNo=${cleanAwb}`;
    } else if (courierLower.includes('ekart')) {
      trackingUrl = `https://ekartlogistics.com/shipmenttrack/${cleanAwb}`;
    }

    return await updateOrderStatus(orderId, 'SHIPPED', cleanAwb, trackingUrl);
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// 7-Day Return Request (Customer)
export async function requestOrderReturn({
  orderId,
  reason,
  comments,
}: {
  orderId: string;
  reason: string;
  comments?: string;
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error('Unauthorized: Please sign in to request a return');

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: session.user.id,
      },
      include: {
        orderitems: true,
        user: { select: { name: true, email: true, phoneNumber: true } },
      },
    });

    if (!order) throw new Error('Order not found or unauthorized');

    if (!order.isDelivered || !order.deliveredAt) {
      throw new Error('Only delivered orders are eligible for return');
    }

    // Check 7-day return window
    const deliveryTime = new Date(order.deliveredAt).getTime();
    const daysSinceDelivery = (Date.now() - deliveryTime) / (1000 * 60 * 60 * 24);

    if (daysSinceDelivery > 7) {
      throw new Error('Return window has expired. Returns are only accepted within 7 days of delivery.');
    }

    if (order.refundStatus === 'RETURN_REQUESTED' || order.refundStatus === 'RETURN_APPROVED') {
      throw new Error('A return request is already active for this order');
    }

    const fullReason = comments ? `${reason} — ${comments}` : reason;

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        refundStatus: 'RETURN_REQUESTED',
        returnReason: fullReason,
        returnRequestedAt: new Date(),
      },
      include: {
        orderitems: true,
        user: { select: { name: true, email: true, phoneNumber: true } },
      },
    });

    // Notify Admin (info@madhavshringaar.com) & Customer
    sendReturnRequestAlertEmail({
      order: updatedOrder,
      reason,
      comments,
    }).catch((err) => console.error('Return request alert email failed:', err));

    revalidatePath(`/order/${orderId}`);
    revalidatePath('/user/orders');
    revalidatePath('/admin/orders');

    return {
      success: true,
      message: 'Return request submitted successfully. Our team will review within 24 hours.',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Process Return Request (Admin: Accept or Reject)
export async function processReturnRequest({
  orderId,
  action,
  note,
}: {
  orderId: string;
  action: 'APPROVED' | 'REJECTED';
  note?: string;
}) {
  try {
    const session = await auth();
    if (session?.user?.role !== 'admin') throw new Error('Unauthorized: Admin access required');

    const order = await prisma.order.findFirst({
      where: { id: orderId },
      include: {
        orderitems: true,
        user: { select: { name: true, email: true, phoneNumber: true } },
      },
    });

    if (!order) throw new Error('Order not found');

    const newRefundStatus = action === 'APPROVED' ? 'RETURN_APPROVED' : 'RETURN_REJECTED';

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        refundStatus: newRefundStatus,
      },
      include: {
        orderitems: true,
        user: { select: { name: true, email: true, phoneNumber: true } },
      },
    });

    // Notify Customer of Admin Decision
    sendReturnStatusUpdateEmail({
      order: updatedOrder,
      action,
      note,
    }).catch((err) => console.error('Return status update email failed:', err));

    revalidatePath(`/order/${orderId}`);
    revalidatePath('/admin/orders');
    revalidatePath('/user/orders');

    return {
      success: true,
      message: `Return request ${action.toLowerCase()} successfully`,
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
        keyId: process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_Tky1mPj28GZWtr',
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

    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'JXpnB72kHfjpi9TuL1LanJQv';
    const body = (paymentData.razorpay_order_id || '') + "|" + (paymentData.razorpay_payment_id || '');
    const expectedSignature = crypto.createHmac('sha256', keySecret)
                                  .update(body.toString())
                                  .digest('hex');
                                  
    const isTestMode = (process.env.RAZORPAY_KEY_ID || '').startsWith('rzp_test_');
    const isValidSignature = expectedSignature === paymentData.razorpay_signature;

    // In test mode or when HMAC matches, mark order as paid
    if (isValidSignature || (isTestMode && paymentData.razorpay_payment_id?.startsWith('pay_'))) {
      await updateOrderToPaid({
        orderId,
        paymentResult: {
          id: paymentData.razorpay_payment_id,
          status: 'COMPLETED',
          email_address: order.user?.email || (order.shippingAddress as any)?.guestEmail || '',
          pricePaid: order.totalPrice.toString(),
        },
      });

      revalidatePath(`/order/${orderId}`);
      revalidatePath('/user/orders');
      revalidatePath('/admin/orders');

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

// Create Razorpay Order directly from current Cart
export async function createRazorpayOrderFromCart() {
  try {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not found");

    const cart = await getMyCart();
    if (!cart || cart.items.length === 0) {
      return { success: false, message: "Cart is empty" };
    }

    if (!cart.shippingAddress) {
      return { success: false, message: "No shipping address selected" };
    }

    const amountInPaise = Math.round(Number(cart.totalPrice) * 100);
    if (amountInPaise <= 0) {
      return { success: false, message: "Order total is ₹0. No online payment required." };
    }

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `cart_${cart.id.slice(0, 10)}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    return {
      success: true,
      data: razorpayOrder.id,
      amount: Number(cart.totalPrice),
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Complete and create Paid Order upon Razorpay verification
export async function createPaidOrderWithRazorpay(paymentData: {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}) {
  try {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not found");

    const session = await auth();
    const cart = await getMyCart();
    if (!cart || cart.items.length === 0) {
      return { success: false, message: "Cart is empty", redirectTo: "/cart" };
    }

    const userId = session?.user?.id;
    const userAddress = cart.shippingAddress as ShippingAddress;
    if (!userAddress) {
      return { success: false, message: "No shipping address", redirectTo: "/shipping-address" };
    }

    // 1. Verify Razorpay cryptographic signature
    const keySecret = process.env.RAZORPAY_KEY_SECRET || "JXpnB72kHfjpi9TuL1LanJQv";
    const body = (paymentData.razorpay_order_id || "") + "|" + (paymentData.razorpay_payment_id || "");
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(body.toString())
      .digest("hex");

    const isTestMode = (process.env.RAZORPAY_KEY_ID || "").startsWith("rzp_test_");
    const isSignatureValid = expectedSignature === paymentData.razorpay_signature;

    if (!isSignatureValid && !(isTestMode && paymentData.razorpay_payment_id?.startsWith("pay_"))) {
      throw new Error("Invalid payment signature. Transaction could not be verified.");
    }

    // 2. Calculate Loyalty Points
    const pointsToRedeem = Number(cart.pointsToRedeem || 0);
    const pointsEarned = LOYALTY_CONFIG.calculatePointsEarned(Number(cart.totalPrice));

    // 3. Prepare Order Data
    const orderData = insertOrderSchema.parse({
      userId: userId || null,
      guestEmail: userAddress.guestEmail || null,
      shippingAddress: userAddress,
      paymentMethod: cart.paymentMethod || "UPI",
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
      isPaid: true,
      paidAt: new Date(),
      status: 'PROCESSING',
      paymentResult: {
        id: paymentData.razorpay_payment_id,
        status: "COMPLETED",
        email_address: userAddress.guestEmail || session?.user?.email || "",
        pricePaid: cart.totalPrice.toString(),
      },
    });

    // 4. Atomic database transaction
    const insertedOrderId = await prisma.$transaction(async (tx) => {
      const insertedOrder = await tx.order.create({ data: orderData as any });

      for (const item of cart.items as CartItem[]) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (!product) throw new Error(`Product ${item.name} not found`);
        if (product.stock < item.qty) throw new Error(`Not enough stock for ${item.name}`);

        await tx.product.update({
          where: { id: item.productId },
          data: { stock: product.stock - item.qty },
        });

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

      if (cart.giftCardCode) {
        const giftCard = await tx.giftCard.findUnique({ where: { code: cart.giftCardCode } });
        if (giftCard) {
          const usedAmount = Number(cart.giftCardAmount || 0);
          const currentBalance = Number(giftCard.balance);
          const newBalance = Math.max(0, currentBalance - usedAmount);
          await tx.giftCard.update({
            where: { code: cart.giftCardCode },
            data: {
              balance: newBalance,
              isActive: newBalance > 0,
            },
          });
        }
      }

      if (cart.couponCode) {
        await tx.coupon.update({
          where: { code: cart.couponCode },
          data: { currentUses: { increment: 1 } },
        });
      }

      if (userId) {
        const pointDifference = pointsEarned - pointsToRedeem;
        await tx.user.update({
          where: { id: userId },
          data: {
            bhaktiPoints: { increment: pointDifference },
            lifetimePoints: { increment: pointsEarned },
          },
        });
      }

      return insertedOrder.id;
    });

    if (!insertedOrderId) throw new Error("Order creation failed");

    // 5. Send confirmation emails
    try {
      const createdOrder = await prisma.order.findUnique({
        where: { id: insertedOrderId },
        include: {
          orderitems: true,
          user: { select: { name: true, email: true, phoneNumber: true } },
        },
      });

      if (createdOrder) {
        sendPurchaseReceipt({ order: createdOrder }).catch((err) =>
          console.error("Customer purchase receipt email failed:", err)
        );
        sendAdminNewOrderAlert({ order: createdOrder }).catch((err) =>
          console.error("Admin order alert failed:", err)
        );
      }
    } catch (notifyErr) {
      console.error("Order notification dispatch error:", notifyErr);
    }

    return {
      success: true,
      message: "Payment verified and order confirmed!",
      redirectTo: `/order/${insertedOrderId}`,
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { success: false, message: formatError(error) };
  }
}