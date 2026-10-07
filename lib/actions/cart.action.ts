'use server';

import { cookies } from 'next/headers';
import { CartItem } from '@/types';
import { convertToPlainObject, formatError, round2 } from '../utils';
import { auth } from '@/auth';
import { prisma } from '@/db/prisma';
import { cartItemSchema, insertCartSchema } from '../validators';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';

import { LOYALTY_CONFIG } from '../loyalty.config';

// Calculate cart prices
const calcPrice = (
  items: CartItem[], 
  discountPrice: number = 0, 
  isGiftWrapped: boolean = false, 
  giftCardAmount: number = 0,
  pointsToRedeem: number = 0
) => {
  const itemsPrice = round2(
      items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
    ),
    shippingPrice = round2(itemsPrice > 999 ? 0 : 50),
    taxPrice = 0,
    giftWrapFee = isGiftWrapped ? 50 : 0,
    pointsDiscount = LOYALTY_CONFIG.calculateDiscountForPoints(pointsToRedeem),
    totalPrice = round2(itemsPrice + taxPrice + shippingPrice + giftWrapFee - discountPrice - giftCardAmount - pointsDiscount);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: Math.max(0, totalPrice).toFixed(2),
  };
};

export async function addItemToCart(data: CartItem) {
  try {
    // Check for cart cookie
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if (!sessionCartId) throw new Error('Cart session not found');

    // Get session and user ID
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;


    // Get cart
    const cart = await getMyCart();

    // Parse and validate item
    const item = cartItemSchema.parse(data);

    // Find product in database
    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });
    if (!product) throw new Error('Product not found');

    if (!cart) {
      // Create new cart object
      const newCart = insertCartSchema.parse({
        userId: userId,
        items: [item],
        sessionCartId: sessionCartId,
        ...calcPrice([item]),
      });

      // Add to database
      await prisma.cart.create({
        data: newCart,
      });

      // Revalidate product page
      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: `${product.name} added to cart`,
      };
    } else {
      // Check if item is already in cart
      const existItem = (cart.items as CartItem[]).find(
        (x) => x.productId === item.productId && x.size === item.size
      );

      if (existItem) {
        // Check stock
        if (product.stock < existItem.qty + 1) {
          throw new Error('Not enough stock');
        }

        // Increase the quantity
        (cart.items as CartItem[]).find(
          (x) => x.productId === item.productId && x.size === item.size
        )!.qty = existItem.qty + 1;
      } else {
        // If item does not exist in cart
        // Check stock
        if (product.stock < 1) throw new Error('Not enough stock');

        // Add item to the cart.items
        cart.items.push(item);
      }

      // Save to database
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items as Prisma.CartUpdateitemsInput[],
          ...calcPrice(cart.items as CartItem[], Number(cart.discountPrice || 0), cart.isGiftWrapped, Number(cart.giftCardAmount || 0)),
        },
      });

      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: `${product.name} ${
          existItem ? 'updated in' : 'added to'
        } cart`,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function getMyCart() {
  // Check for cart cookie
  const sessionCartId = (await cookies()).get('sessionCartId')?.value;
  if (!sessionCartId) throw new Error('Cart session not found');

  // Get session and user ID
  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  // Get user cart from database
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
  });

  if (!cart) return undefined;

  // Convert decimals and return
  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
    discountPrice: cart.discountPrice?.toString() || "0",
    giftCardAmount: cart.giftCardAmount?.toString() || "0",
  });
}

export async function removeItemFromCart(productId: string, size?: string) {
  try {
    // Check for cart cookie
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if (!sessionCartId) throw new Error('Cart session not found');

    // Get Product
    const product = await prisma.product.findFirst({
      where: { id: productId },
    });
    if (!product) throw new Error('Product not found');

    // Get user cart
    const cart = await getMyCart();
    if (!cart) throw new Error('Cart not found');

    // Check for item
    const exist = (cart.items as CartItem[]).find(
      (x) => x.productId === productId && x.size === size
    );
    if (!exist) throw new Error('Item not found');

    // Check if only one in qty
    if (exist.qty === 1) {
      // Remove from cart
      cart.items = (cart.items as CartItem[]).filter(
        (x) => !(x.productId === exist.productId && x.size === exist.size)
      );
    } else {
      // Decrease qty
      (cart.items as CartItem[]).find((x) => x.productId === productId && x.size === size)!.qty =
        exist.qty - 1;
    }

    // Update cart in database
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: cart.items as Prisma.CartUpdateitemsInput[],
        ...calcPrice(cart.items as CartItem[], Number(cart.discountPrice || 0), cart.isGiftWrapped, Number(cart.giftCardAmount || 0)),
      },
    });

    revalidatePath(`/product/${product.slug}`);

    return {
      success: true,
      message: `${product.name} was removed from cart`,
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function applyCoupon(code: string) {
  try {
    const cart = await getMyCart();
    if (!cart) throw new Error('Cart not found');

    if (!code) {
      // Remove coupon
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          couponCode: null,
          discountPrice: 0,
          ...calcPrice(cart.items as CartItem[], 0, cart.isGiftWrapped, Number(cart.giftCardAmount || 0)),
        },
      });
      revalidatePath('/cart');
      return { success: true, message: 'Coupon removed' };
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code },
    });

    if (!coupon || !coupon.isActive) {
      throw new Error('Invalid or expired coupon');
    }

    if (coupon.expiryDate && coupon.expiryDate < new Date()) {
      throw new Error('Coupon has expired');
    }

    if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) {
      throw new Error('Coupon usage limit reached');
    }

    // Calculate discount
    const itemsPrice = (cart.items as CartItem[]).reduce(
      (acc, item) => acc + Number(item.price) * item.qty,
      0
    );

    let discountValue = 0;
    if (coupon.discountType === 'percentage') {
      discountValue = (itemsPrice * Number(coupon.discountValue)) / 100;
    } else {
      discountValue = Number(coupon.discountValue);
    }

    // Don't discount more than itemsPrice
    discountValue = Math.min(discountValue, itemsPrice);

    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        couponCode: code,
        discountPrice: discountValue,
        ...calcPrice(cart.items as CartItem[], discountValue, cart.isGiftWrapped, Number(cart.giftCardAmount || 0)),
      },
    });

    revalidatePath('/cart');
    return { success: true, message: 'Coupon applied successfully' };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function toggleGiftWrap(isGiftWrapped: boolean) {
  try {
    const cart = await getMyCart();
    if (!cart) throw new Error('Cart not found');

    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        isGiftWrapped,
        ...calcPrice(cart.items as CartItem[], Number(cart.discountPrice || 0), isGiftWrapped, Number(cart.giftCardAmount || 0)),
      },
    });

    revalidatePath('/cart');
    return { success: true, message: isGiftWrapped ? 'Gift wrap added' : 'Gift wrap removed' };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function applyGiftCard(code: string) {
  try {
    const cart = await getMyCart();
    if (!cart) throw new Error('Cart not found');

    if (!code) {
      // Remove gift card
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          giftCardCode: null,
          giftCardAmount: 0,
          ...calcPrice(cart.items as CartItem[], Number(cart.discountPrice || 0), cart.isGiftWrapped, 0, Number(cart.pointsToRedeem || 0)),
        },
      });
      revalidatePath('/cart');
      return { success: true, message: 'Gift card removed' };
    }

    const giftCard = await prisma.giftCard.findUnique({
      where: { code },
    });

    if (!giftCard || !giftCard.isActive) {
      throw new Error('Invalid or inactive gift card');
    }

    if (giftCard.expiresAt && giftCard.expiresAt < new Date()) {
      throw new Error('Gift card has expired');
    }

    if (Number(giftCard.balance) <= 0) {
      throw new Error('Gift card has no remaining balance');
    }

    // Calculate maximum amount to apply
    // Gift card cannot exceed the (itemsPrice + shipping + tax + giftWrap - discount)
    const currentPrice = calcPrice(cart.items as CartItem[], Number(cart.discountPrice || 0), cart.isGiftWrapped, 0);
    const maxApplicableAmount = Number(currentPrice.totalPrice);
    
    // We apply either the full balance or the max applicable amount
    const amountToApply = Math.min(Number(giftCard.balance), maxApplicableAmount);

    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        giftCardCode: code,
        giftCardAmount: amountToApply,
        ...calcPrice(cart.items as CartItem[], Number(cart.discountPrice || 0), cart.isGiftWrapped, amountToApply),
      },
    });

    revalidatePath('/cart');
    return { success: true, message: 'Gift card applied successfully' };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function applyBhaktiPoints(points: number) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) throw new Error('Must be logged in to use Bhakti Points');

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    if (points > user.bhaktiPoints) {
      throw new Error(`You only have ${user.bhaktiPoints} points available.`);
    }

    const cart = await getMyCart();
    if (!cart) throw new Error('Cart not found');

    // If points is 0, remove points
    if (points <= 0) {
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          pointsToRedeem: 0,
          ...calcPrice(cart.items as CartItem[], Number(cart.discountPrice || 0), cart.isGiftWrapped, Number(cart.giftCardAmount || 0), 0),
        },
      });
      revalidatePath('/cart');
      return { success: true, message: 'Bhakti Points removed' };
    }

    // Apply points
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        pointsToRedeem: points,
        ...calcPrice(cart.items as CartItem[], Number(cart.discountPrice || 0), cart.isGiftWrapped, Number(cart.giftCardAmount || 0), points),
      },
    });

    revalidatePath('/cart');
    return { success: true, message: `${points} Bhakti Points applied successfully` };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}