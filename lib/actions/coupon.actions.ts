'use server';

import { prisma } from '@/db/prisma';
import { revalidatePath } from 'next/cache';
import { formatError } from '../utils';
import { auth } from '@/auth';

export async function createCoupon(data: {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  maxUses?: number;
  expiryDate?: Date;
}) {
  try {
    const session = await auth();
    if (session?.user?.role !== 'admin') throw new Error('Unauthorized: Admin access required');

    const existing = await prisma.coupon.findUnique({
      where: { code: data.code.toUpperCase() }
    });

    if (existing) {
      return { success: false, message: 'Promo code already exists' };
    }

    await prisma.coupon.create({
      data: {
        code: data.code.toUpperCase(),
        discountType: data.discountType,
        discountValue: data.discountValue,
        maxUses: data.maxUses || null,
        expiryDate: data.expiryDate || null,
      }
    });

    revalidatePath('/admin/coupons');
    return { success: true, message: 'Promo code created successfully' };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
