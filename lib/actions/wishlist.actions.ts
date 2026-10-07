'use server';

import { auth } from '@/auth';
import { prisma } from '@/db/prisma';
import { revalidatePath } from 'next/cache';
import { formatError } from '../utils';

// Toggle an item in the user's wishlist
export async function toggleWishlistItem(productId: string) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return { success: false, message: 'Please sign in to manage your wishlist' };
    }

    const existingItem = await prisma.wishlist.findFirst({
      where: {
        userId,
        productId,
      },
    });

    if (existingItem) {
      await prisma.wishlist.delete({
        where: { id: existingItem.id },
      });
      revalidatePath('/wishlist');
      revalidatePath(`/product`);
      return { success: true, message: 'Removed from wishlist' };
    } else {
      await prisma.wishlist.create({
        data: {
          userId,
          productId,
        },
      });
      revalidatePath('/wishlist');
      revalidatePath(`/product`);
      return { success: true, message: 'Added to wishlist' };
    }
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Get the user's wishlist
export async function getWishlist() {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return { success: false, data: [] };
    }

    const wishlistItems = await prisma.wishlist.findMany({
      where: { userId },
      include: {
        product: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, data: wishlistItems };
  } catch (error) {
    return { success: false, data: [] };
  }
}

// Check if a specific product is in the user's wishlist
export async function isInWishlist(productId: string) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) return false;

    const item = await prisma.wishlist.findFirst({
      where: {
        userId,
        productId,
      },
    });

    return !!item;
  } catch (error) {
    return false;
  }
}
