import nodemailer from 'nodemailer';
import { render } from '@react-email/components';
import { SENDER_EMAIL, APP_NAME } from '@/lib/constants';
import { Order } from '@/types';
import dotenv from 'dotenv';
dotenv.config();

import PurchaseReceiptEmail from './purchase-receipt';

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
  // Render the React email component to an HTML string
  const emailHtml = await render(<PurchaseReceiptEmail order={order} />);

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || `${APP_NAME} <${SENDER_EMAIL}>`,
    to: order.user?.email || order.shippingAddress?.guestEmail || 'customer@example.com',
    subject: `Order Confirmation ${order.id}`,
    html: emailHtml,
  });
};