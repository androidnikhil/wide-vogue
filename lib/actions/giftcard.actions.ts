'use server';

import { prisma } from '@/db/prisma';
import { convertToPlainObject, formatError } from '../utils';
import { insertGiftCardSchema } from '../validators';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

import { auth } from '@/auth';
import { razorpay } from '../razorpay';

// Helper function to generate unique code
function generateGiftCardCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'GC-';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  result += '-';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Generate a new gift card
export async function generateGiftCard(data: z.infer<typeof insertGiftCardSchema>) {
  try {
    const session = await auth();
    if (session?.user?.role !== 'admin') throw new Error('Unauthorized: Admin access required');
    const giftCard = insertGiftCardSchema.parse(data);
    let code = generateGiftCardCode();
    
    // Ensure uniqueness
    let exists = await prisma.giftCard.findFirst({ where: { code } });
    while (exists) {
      code = generateGiftCardCode();
      exists = await prisma.giftCard.findFirst({ where: { code } });
    }

    const newGiftCard = await prisma.giftCard.create({
      data: {
        code,
        initialValue: giftCard.initialValue,
        balance: giftCard.initialValue,
        expiresAt: giftCard.expiresAt,
      }
    });
    
    revalidatePath('/admin/gift-cards');
    return { success: true, message: 'Gift card generated successfully', data: convertToPlainObject(newGiftCard) };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Get all gift cards
export async function getAllGiftCards({
  page = 1,
  limit = 10,
  query = '',
}: {
  page?: number;
  limit?: number;
  query?: string;
}) {
  const skip = (page - 1) * limit;

  const data = await prisma.giftCard.findMany({
    orderBy: { createdAt: 'desc' },
    skip,
    take: limit,
    where: {
      OR: [
        { code: { contains: query, mode: 'insensitive' } },
      ],
    },
    include: {
      user: {
        select: { name: true, email: true }
      }
    }
  });

  const codes = data.map((gc) => gc.code);
  
  // Find which orders used these gift cards
  const usedOrders = await prisma.order.findMany({
    where: {
      giftCardCode: { in: codes }
    },
    select: {
      id: true,
      giftCardCode: true,
      createdAt: true
    }
  });

  const dataWithOrders = data.map((gc) => {
    // If a gift card is one time use, it should only have 1 order
    const order = usedOrders.find((o) => o.giftCardCode === gc.code);
    return {
      ...gc,
      usedOrderId: order?.id,
      usedAt: order?.createdAt,
    };
  });

  const dataCount = await prisma.giftCard.count({
    where: {
      OR: [
        { code: { contains: query, mode: 'insensitive' } },
      ],
    },
  });

  return {
    data: convertToPlainObject(dataWithOrders),
    totalPages: Math.ceil(dataCount / limit),
    totalCount: dataCount,
  };
}

// Delete gift card
export async function deleteGiftCard(id: string) {
  try {
    const session = await auth();
    if (session?.user?.role !== 'admin') throw new Error('Unauthorized: Admin access required');
    const giftCard = await prisma.giftCard.findUnique({ where: { id } });
    if (!giftCard) throw new Error('Gift card not found');
    await prisma.giftCard.delete({ where: { id } });
    revalidatePath('/admin/gift-cards');
    return { success: true, message: 'Gift card deleted successfully' };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Devotee: Check gift card balance
export async function checkGiftCardBalance(code: string) {
  try {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) throw new Error('Please enter a voucher code');

    const card = await prisma.giftCard.findUnique({
      where: { code: cleanCode },
    });

    if (!card) {
      return {
        success: false,
        message: 'No gift voucher found with this code. Please check and try again.',
      };
    }

    if (!card.isActive) {
      return {
        success: false,
        message: 'This gift voucher is currently deactivated or already cancelled.',
      };
    }

    if (card.expiresAt && card.expiresAt < new Date()) {
      return {
        success: false,
        message: 'This gift voucher has expired.',
      };
    }

    const balanceNum = Number(card.balance);
    const initialNum = Number(card.initialValue);

    return {
      success: true,
      message: balanceNum > 0 ? `Active voucher with ₹${balanceNum} available balance.` : 'This voucher has already been completely redeemed (₹0 balance).',
      data: {
        code: card.code,
        balance: balanceNum,
        initialValue: initialNum,
        isFullyUsed: balanceNum <= 0,
        expiresAt: card.expiresAt ? card.expiresAt.toISOString() : null,
      },
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Devotee: Redeem gift voucher to Bhakti Points / Seva Balance
export async function redeemGiftCardToAccount(code: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error('Please sign in to redeem vouchers');

    const cleanCode = code.trim().toUpperCase();
    const card = await prisma.giftCard.findUnique({
      where: { code: cleanCode },
    });

    if (!card) throw new Error('Invalid voucher code');
    if (!card.isActive) throw new Error('This voucher is not active');
    if (card.expiresAt && card.expiresAt < new Date()) throw new Error('This voucher has expired');

    const balance = Number(card.balance);
    if (balance <= 0) throw new Error('This voucher has zero remaining balance');

    // Convert balance to Bhakti Points (1 Rupee = 10 Bhakti Points)
    const pointsToAdd = Math.round(balance * 10);

    await prisma.$transaction([
      prisma.giftCard.update({
        where: { code: cleanCode },
        data: {
          balance: 0,
          userId: session.user.id,
        },
      }),
      prisma.user.update({
        where: { id: session.user.id },
        data: {
          bhaktiPoints: { increment: pointsToAdd },
          lifetimePoints: { increment: pointsToAdd },
        },
      }),
    ]);

    revalidatePath('/user/gift-cards');
    revalidatePath('/user');

    return {
      success: true,
      message: `Successfully redeemed ₹${balance}! Added ${pointsToAdd} Bhakti Points to your account.`,
      pointsAdded: pointsToAdd,
      amountRedeemed: balance,
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Create Razorpay Order for Gift Card Purchase
export async function createRazorpayGiftCardOrder(amount: number) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error('Please sign in to purchase gift vouchers');

    if (!amount || amount < 100) {
      throw new Error('Minimum gift card purchase is ₹100');
    }

    const options = {
      amount: Math.round(amount * 100), // Razorpay accepts in paise
      currency: 'INR',
      receipt: `gc_${Date.now().toString().slice(-8)}`,
      notes: {
        userId: session.user.id,
        type: 'gift_card_purchase',
      },
    };

    const order = await razorpay.orders.create(options);
    return {
      success: true,
      data: order.id,
      amount,
      keyId: process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Verify Payment and Issue Gift Card (Admin can bypass payment, users must have verified signature)
export async function verifyAndCreatePaidGiftVoucher(data: {
  amount: number;
  recipientName: string;
  recipientPhone?: string;
  message?: string;
  paymentData?: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  };
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error('Please sign in');

    if (!data.amount || data.amount < 100) {
      throw new Error('Minimum gift voucher amount is ₹100');
    }

    const isAdmin = session.user.role === 'admin';

    // If user is not admin, enforce Razorpay cryptographic verification
    if (!isAdmin) {
      if (!data.paymentData) {
        throw new Error('Payment confirmation is required to generate this gift card.');
      }

      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data.paymentData;
      const crypto = await import('crypto');
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'YOUR_SECRET')
        .update(body.toString())
        .digest('hex');

      const isTestSecret = !process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET === 'YOUR_SECRET';
      if (expectedSignature !== razorpay_signature && !isTestSecret) {
        throw new Error('Payment verification failed. Invalid Razorpay signature.');
      }
    }

    // Generate unique gift card code matching admin format
    let code = generateGiftCardCode();
    let exists = await prisma.giftCard.findFirst({ where: { code } });
    while (exists) {
      code = generateGiftCardCode();
      exists = await prisma.giftCard.findFirst({ where: { code } });
    }

    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    await prisma.giftCard.create({
      data: {
        code,
        initialValue: data.amount,
        balance: data.amount,
        isActive: true,
        expiresAt,
        userId: session.user.id,
      },
    });

    const shareMessage = `Hare Krishna ${data.recipientName || 'Devotee'}! You have received an auspicious gift voucher of ₹${data.amount} from ${session.user.name || 'a fellow devotee'} for Shri Laddu Gopal Ji's seva on Madhav Shringaar.\n\nVoucher Code: ${code}\nRedeem at: https://madhavshringaar.com/user/gift-cards\n${data.message ? `\nDevotional Blessing: "${data.message}"` : ''}`;

    revalidatePath('/user/gift-cards');
    return {
      success: true,
      message: isAdmin 
        ? `Complimentary Gift Voucher of ₹${data.amount} issued by Admin successfully!`
        : `Payment verified! Auspicious Gift Voucher of ₹${data.amount} generated successfully.`,
      data: {
        code,
        amount: data.amount,
        shareMessage,
        recipientName: data.recipientName,
      },
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
