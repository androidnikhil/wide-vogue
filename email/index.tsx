import nodemailer from 'nodemailer';
import { render } from '@react-email/components';
import { SENDER_EMAIL, APP_NAME } from '@/lib/constants';
import { Order } from '@/types';
import dotenv from 'dotenv';
dotenv.config();

import PurchaseReceiptEmail from './purchase-receipt';
import WelcomeEmail from './welcome-email';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.hostinger.com',
  port: Number(process.env.EMAIL_PORT) || 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendPurchaseReceipt = async ({ order }: { order: Order }) => {
  try {
    const recipientEmail = 
      (order.shippingAddress as any)?.guestEmail || 
      (order.user?.email && !order.user.email.endsWith('@madhavshringaar.com') ? order.user.email : null) || 
      (order as any).guestEmail;

    if (!recipientEmail || recipientEmail.includes('@madhavshringaar.com')) {
      console.warn("No valid real email found to send purchase receipt for order:", order.id);
      return;
    }

    // Render the React email component to an HTML string
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

export const sendWelcomeEmail = async ({ name, email }: { name: string; email: string }) => {
  try {
    if (!email || email.includes('@madhavshringaar.com')) {
      // Do not send to fake/placeholder emails
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