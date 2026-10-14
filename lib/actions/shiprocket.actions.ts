"use server";

import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { formatError } from "../utils";
import { revalidatePath } from "next/cache";
import { 
  createShiprocketAdhocOrder, 
  generateShiprocketAWB, 
  getShiprocketToken, 
  trackShiprocketShipmentByAWB,
  trackShiprocketShipmentByOrderId
} from "../shiprocket";
import { ShippingAddress } from "@/types";

/**
 * Test Shiprocket credentials and connection
 */
export async function testShiprocketConnection() {
  try {
    const session = await auth();
    if (session?.user?.role !== "admin") {
      throw new Error("Unauthorized: Admin access required");
    }

    const token = await getShiprocketToken();
    return {
      success: true,
      message: "Shiprocket connected successfully! Token authenticated.",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to authenticate with Shiprocket",
    };
  }
}

/**
 * Push an existing Order to Shiprocket to generate shipment & AWB
 */
export async function pushOrderToShiprocket(orderId: string) {
  try {
    const session = await auth();
    if (session?.user?.role !== "admin") {
      throw new Error("Unauthorized: Admin access required");
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderitems: true,
        user: true,
      },
    });

    if (!order) throw new Error("Order not found");

    const shippingAddress = order.shippingAddress as ShippingAddress;
    if (!shippingAddress) throw new Error("Shipping address not found on order");

    // Format date YYYY-MM-DD HH:mm
    const dateObj = new Date(order.createdAt);
    const orderDate = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}-${String(
      dateObj.getDate()
    ).padStart(2, "0")} ${String(dateObj.getHours()).padStart(2, "0")}:${String(dateObj.getMinutes()).padStart(2, "0")}`;

    const pickupLocation = process.env.SHIPROCKET_PICKUP_LOCATION || "Primary";

    const payload = {
      order_id: order.id,
      order_date: orderDate,
      pickup_location: pickupLocation,
      billing_customer_name: shippingAddress.fullName || order.user?.name || "Customer",
      billing_last_name: "",
      billing_address: shippingAddress.streetAddress || "Address",
      billing_city: shippingAddress.city || "City",
      billing_pincode: shippingAddress.postalCode || "110001",
      billing_state: shippingAddress.state || "State",
      billing_country: shippingAddress.country || "India",
      billing_email: order.guestEmail || order.user?.email || "info@madhavshringaar.com",
      billing_phone: shippingAddress.contactNumber || (order.user as any)?.phone || "9999999999",
      shipping_is_billing: true,
      order_items: order.orderitems.map((item) => ({
        name: item.name,
        sku: item.slug || item.productId,
        units: item.qty,
        selling_price: Number(item.price),
        discount: 0,
        tax: 0,
      })),
      payment_method: (order.paymentMethod === "CashOnDelivery" ? "COD" : "Prepaid") as "COD" | "Prepaid",
      sub_total: Number(order.totalPrice),
      length: 10,
      breadth: 10,
      height: 10,
      weight: 0.5,
    };

    const shiprocketResult = await createShiprocketAdhocOrder(payload);

    let awbCode = shiprocketResult.awb_code || null;
    const shipmentId = shiprocketResult.shipment_id;

    // If AWB is not yet assigned, try to assign courier AWB
    if (!awbCode && shipmentId) {
      try {
        const awbRes = await generateShiprocketAWB(shipmentId);
        if (awbRes?.response?.data?.awb_code) {
          awbCode = awbRes.response.data.awb_code;
        }
      } catch (awbErr) {
        console.warn("AWB auto-generation deferred (will be generated upon courier pickup assignment):", awbErr);
      }
    }

    const trackingNumber = awbCode || String(shiprocketResult.order_id || shipmentId);
    const trackingUrl = awbCode
      ? `https://shiprocket.co/tracking/${awbCode}`
      : `https://shiprocket.co/tracking/${shiprocketResult.order_id}`;

    // Update order in database with Shiprocket details
    await prisma.order.update({
      where: { id: orderId },
      data: {
        awbNumber: trackingNumber,
        trackingUrl: trackingUrl,
        status: awbCode ? "SHIPPED" : "PROCESSING",
      },
    });

    revalidatePath(`/order/${orderId}`);
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath("/admin/orders");

    return {
      success: true,
      message: `Shiprocket order created successfully! Shipment ID: ${shipmentId || trackingNumber}`,
      trackingUrl,
      awbNumber: trackingNumber,
    };
  } catch (error: any) {
    console.error("Error creating Shiprocket order:", error);
    return {
      success: false,
      message: error.message || formatError(error),
    };
  }
}

/**
 * Fetch live tracking details for an Order
 */
export async function trackOrderShipment(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        awbNumber: true,
        trackingUrl: true,
      },
    });

    if (!order || !order.awbNumber) {
      return {
        success: false,
        message: "No tracking number found for this order.",
      };
    }

    // Call Shiprocket tracking
    const trackData = await trackShiprocketShipmentByAWB(order.awbNumber);

    return {
      success: true,
      data: trackData,
      trackingUrl: order.trackingUrl || `https://shiprocket.co/tracking/${order.awbNumber}`,
    };
  } catch (error: any) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
