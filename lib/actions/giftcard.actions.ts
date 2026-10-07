'use server';

import { prisma } from '@/db/prisma';
import { convertToPlainObject, formatError } from '../utils';
import { insertGiftCardSchema } from '../validators';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

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

  const dataCount = await prisma.giftCard.count({
    where: {
      OR: [
        { code: { contains: query, mode: 'insensitive' } },
      ],
    },
  });

  return {
    data: convertToPlainObject(data),
    totalPages: Math.ceil(dataCount / limit),
    totalCount: dataCount,
  };
}

// Delete gift card
export async function deleteGiftCard(id: string) {
  try {
    const giftCard = await prisma.giftCard.findUnique({ where: { id } });
    if (!giftCard) throw new Error('Gift card not found');
    await prisma.giftCard.delete({ where: { id } });
    revalidatePath('/admin/gift-cards');
    return { success: true, message: 'Gift card deleted successfully' };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
