import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/db/prisma'; // Adjust based on your Prisma setup

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_db_id } = await req.json();

    const secret = process.env.RAZORPAY_KEY_SECRET as string;

    // 1. Verify the signature securely
    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
    }

    // 2. Mark the database Order as Paid securely
    if (order_db_id) {
      await prisma.order.update({
        where: { id: order_db_id },
        data: {
          isPaid: true,
          paidAt: new Date(),
          paymentResult: {
            id: razorpay_payment_id,
            status: 'success',
            update_time: new Date().toISOString(),
          },
        },
      });
    }

    return NextResponse.json({ success: true, message: 'Payment verified successfully' });
  } catch (error: any) {
    console.error('Razorpay Verification Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
