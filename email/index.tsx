import nodemailer from 'nodemailer';
import { render } from '@react-email/components';
import { SENDER_EMAIL, ADMIN_EMAIL, APP_NAME } from '@/lib/constants';
import dotenv from 'dotenv';
dotenv.config();

import PurchaseReceiptEmail from './purchase-receipt';
import WelcomeEmail from './welcome-email';
import AdminOrderAlertEmail from './admin-order-alert';
import OrderShippedEmail from './order-shipped';
import OrderOutForDeliveryEmail from './order-out-for-delivery';
import OrderDeliveredEmail from './order-delivered';
import ReturnRequestAlertEmail from './return-request-alert';
import ReturnStatusUpdateEmail from './return-status-update';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.hostinger.com',
  port: Number(process.env.EMAIL_PORT) || 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const getRecipientEmail = (order: any): string | null => {
  const email =
    (order.shippingAddress as any)?.guestEmail ||
    (order.user?.email && !order.user.email.endsWith('@madhavshringaar.com')
      ? order.user.email
      : null) ||
    order.guestEmail;

  if (!email || email.includes('@madhavshringaar.com')) {
    return null;
  }
  return email;
};

// 1. Send Purchase / Order Confirmation to Customer (Online & COD)
export const sendPurchaseReceipt = async ({ order }: { order: any }) => {
  try {
    const recipientEmail = getRecipientEmail(order);
    if (!recipientEmail) {
      console.warn('No valid email found to send purchase receipt for order:', order.id);
      return;
    }

    const emailHtml = await render(<PurchaseReceiptEmail order={order} />);

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || `${APP_NAME} <${SENDER_EMAIL}>`,
      to: recipientEmail,
      subject: `Order Confirmation #${order.id.slice(0, 8).toUpperCase()} - ${APP_NAME}`,
      html: emailHtml,
    });
    console.log(`Purchase receipt email successfully sent to ${recipientEmail}`);
  } catch (error) {
    console.error('Failed to send purchase receipt email:', error);
  }
};

// 2. Send New Order Alert to Admin (nikhil.pandey@madhavshringaar.com)
export const sendAdminNewOrderAlert = async ({ order }: { order: any }) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || ADMIN_EMAIL || 'nikhil.pandey@madhavshringaar.com';
    const emailHtml = await render(<AdminOrderAlertEmail order={order} />);

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || `${APP_NAME} Orders <${SENDER_EMAIL}>`,
      to: adminEmail,
      subject: `🚨 New Order #${order.id.slice(0, 8).toUpperCase()} - ₹${Number(order.totalPrice).toFixed(0)} (${order.paymentMethod})`,
      html: emailHtml,
    });
    console.log(`Admin order alert successfully sent to ${adminEmail}`);
  } catch (error) {
    console.error('Failed to send admin order alert:', error);
  }
};

// 3. Welcome Email
export const sendWelcomeEmail = async ({ name, email }: { name: string; email: string }) => {
  try {
    if (!email || email.includes('@madhavshringaar.com')) {
      return;
    }

    const emailHtml = await render(<WelcomeEmail name={name} />);

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || `${APP_NAME} <${SENDER_EMAIL}>`,
      to: email,
      subject: `Welcome to Madhav Shringaar - Divine Essentials for Your Beloved Kanha`,
      html: emailHtml,
    });
    console.log(`Welcome email successfully sent to ${email}`);
  } catch (error) {
    console.error('Failed to send welcome email:', error);
  }
};

// 4. Send Order Shipped Notification to Customer
export const sendOrderShippedEmail = async ({
  order,
  awbNumber,
  trackingUrl,
}: {
  order: any;
  awbNumber?: string;
  trackingUrl?: string;
}) => {
  try {
    const recipientEmail = getRecipientEmail(order);
    if (!recipientEmail) return;

    const emailHtml = await render(
      <OrderShippedEmail
        order={order}
        awbNumber={awbNumber}
        trackingUrl={trackingUrl}
      />
    );

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || `${APP_NAME} Shipping <${SENDER_EMAIL}>`,
      to: recipientEmail,
      subject: `🚚 Your Order #${order.id.slice(0, 8).toUpperCase()} Has Shipped! - ${APP_NAME}`,
      html: emailHtml,
    });
    console.log(`Order shipped email sent to ${recipientEmail}`);
  } catch (error) {
    console.error('Failed to send order shipped email:', error);
  }
};

// 5. Send Out for Delivery Notification to Customer
export const sendOrderOutForDeliveryEmail = async ({ order }: { order: any }) => {
  try {
    const recipientEmail = getRecipientEmail(order);
    if (!recipientEmail) return;

    const emailHtml = await render(<OrderOutForDeliveryEmail order={order} />);

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || `${APP_NAME} Delivery <${SENDER_EMAIL}>`,
      to: recipientEmail,
      subject: `🛵 Out for Delivery Today: Order #${order.id.slice(0, 8).toUpperCase()} - ${APP_NAME}`,
      html: emailHtml,
    });
    console.log(`Order out for delivery email sent to ${recipientEmail}`);
  } catch (error) {
    console.error('Failed to send out for delivery email:', error);
  }
};

// 6. Send Delivered Notification to Customer & Admin
export const sendOrderDeliveredEmail = async ({ order }: { order: any }) => {
  try {
    const recipientEmail = getRecipientEmail(order);
    const adminEmail = process.env.ADMIN_EMAIL || ADMIN_EMAIL || 'nikhil.pandey@madhavshringaar.com';

    // To Customer
    if (recipientEmail) {
      const customerHtml = await render(
        <OrderDeliveredEmail order={order} isAdminNotification={false} />
      );
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || `${APP_NAME} <${SENDER_EMAIL}>`,
        to: recipientEmail,
        subject: `🌸 Order #${order.id.slice(0, 8).toUpperCase()} Delivered - Thank You!`,
        html: customerHtml,
      });
      console.log(`Order delivered email sent to customer ${recipientEmail}`);
    }

    // To Admin
    const adminHtml = await render(
      <OrderDeliveredEmail order={order} isAdminNotification={true} />
    );
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || `${APP_NAME} Delivery <${SENDER_EMAIL}>`,
      to: adminEmail,
      subject: `✅ Order #${order.id.slice(0, 8).toUpperCase()} Delivered Successfully`,
      html: adminHtml,
    });
    console.log(`Order delivered notice sent to admin ${adminEmail}`);
  } catch (error) {
    console.error('Failed to send delivered email notification:', error);
  }
};

// 7. Send Return Request Alert (To Admin & Customer confirmation)
export const sendReturnRequestAlertEmail = async ({
  order,
  reason,
  comments,
}: {
  order: any;
  reason: string;
  comments?: string;
}) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || ADMIN_EMAIL || 'nikhil.pandey@madhavshringaar.com';
    const recipientEmail = getRecipientEmail(order);

    // To Admin
    const adminHtml = await render(
      <ReturnRequestAlertEmail
        order={order}
        reason={reason}
        comments={comments}
        isAdminNotification={true}
      />
    );
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || `${APP_NAME} Returns <${SENDER_EMAIL}>`,
      to: adminEmail,
      subject: `⚠️ Return Request Generated for Order #${order.id.slice(0, 8).toUpperCase()} (${reason})`,
      html: adminHtml,
    });
    console.log(`Return request alert sent to admin ${adminEmail}`);

    // To Customer
    if (recipientEmail) {
      const customerHtml = await render(
        <ReturnRequestAlertEmail
          order={order}
          reason={reason}
          comments={comments}
          isAdminNotification={false}
        />
      );
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || `${APP_NAME} <${SENDER_EMAIL}>`,
        to: recipientEmail,
        subject: `Return Request Received for Order #${order.id.slice(0, 8).toUpperCase()}`,
        html: customerHtml,
      });
      console.log(`Return request confirmation sent to customer ${recipientEmail}`);
    }
  } catch (error) {
    console.error('Failed to send return request alert email:', error);
  }
};

// 8. Send Return Status Update (Approved / Rejected) to Customer
export const sendReturnStatusUpdateEmail = async ({
  order,
  action,
  note,
}: {
  order: any;
  action: 'APPROVED' | 'REJECTED';
  note?: string;
}) => {
  try {
    const recipientEmail = getRecipientEmail(order);
    if (!recipientEmail) return;

    const emailHtml = await render(
      <ReturnStatusUpdateEmail order={order} action={action} note={note} />
    );

    const subject =
      action === 'APPROVED'
        ? `✅ Return Request Approved - Order #${order.id.slice(0, 8).toUpperCase()}`
        : `Update on Return Request - Order #${order.id.slice(0, 8).toUpperCase()}`;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || `${APP_NAME} Returns <${SENDER_EMAIL}>`,
      to: recipientEmail,
      subject,
      html: emailHtml,
    });
    console.log(`Return status update email sent to customer ${recipientEmail}`);
  } catch (error) {
    console.error('Failed to send return status update email:', error);
  }
};