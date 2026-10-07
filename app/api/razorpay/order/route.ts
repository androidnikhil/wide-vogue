import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { auth } from '@/auth'; // Adjust this import based on your NextAuth configuration
import { prisma } from '@/db/prisma'; // Adjust based on Prisma client location

export async function POST(req: Request) {
  try {
    // Initialize Razorpay instance securely using environment variables
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key',
      key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
    });

    // 1. Authenticate the user securely
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse the request body (e.g., cart details, total amount)
    const { amount, receipt_id } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    // 3. Create the Razorpay Order
    // amount in paisa (e.g., 50000 = ₹500)
    const options = {
      amount: amount * 100, 
      currency: 'INR',
      receipt: receipt_id || `rcpt_${Date.now()}`,
      payment_capture: 1, // Auto capture
    };

    const order = await razorpay.orders.create(options);

    // 4. Return the order details securely to the client
    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error: any) {
    console.error('Razorpay Order Error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment order.' },
      { status: 500 }
    );
  }
}
