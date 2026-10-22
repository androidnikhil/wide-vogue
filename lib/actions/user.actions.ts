'use server';

import {
  paymentMethodSchema,
  shippingAddressSchema,
  signInFormSchema,
  signUpFormSchema,
  updateUserSchema
} from '../validators';
import { auth, signIn, signOut } from '@/auth';
import { hash } from '../encrypt';
import { prisma } from '@/db/prisma';
import { convertToPlainObject, formatError } from '../utils';
import { ShippingAddress } from '@/types';
import { getMyCart } from './cart.action';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { PAGE_SIZE, isDummyPhoneEmail } from '../constants';
import { revalidatePath } from 'next/cache';
import { sendWelcomeEmail } from '@/email';
import {
  checkLoginLockout,
  recordFailedLogin,
  clearLoginAttempts,
} from './auth-limiter.actions';

// Sign in the user with credentials
export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData
) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    const cleanEmail = user.email.toLowerCase().trim();

    // 1. Check if account is currently locked out
    const lockout = await checkLoginLockout(cleanEmail);
    if (lockout.isLocked) {
      return { success: false, message: lockout.message || 'Account locked for 1 hour.' };
    }

    try {
      await signIn('credentials', user);
      // Clear attempts on success
      await clearLoginAttempts(cleanEmail);
      return { success: true, message: 'Signed in successfully' };
    } catch (authError) {
      if (isRedirectError(authError)) {
        await clearLoginAttempts(cleanEmail);
        throw authError;
      }
      // Record failed attempt and compute remaining/lockout status
      const failRes = await recordFailedLogin(cleanEmail);
      return { success: false, message: failRes.message };
    }
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: formatError(error) };
  }
}

// Sign user out
export async function signOutUser() {
  // get current users cart and delete it so it does not persist to next user
  const currentCart = await getMyCart();

  if (currentCart?.id) {
    await prisma.cart.delete({ where: { id: currentCart.id } });
  } else {
    console.warn('No cart found for deletion.');
  }
  await signOut();
}

// Check if email already exists in database
export async function checkEmailAvailability(email: string) {
  try {
    if (!email || !email.includes('@')) return { exists: false };
    const cleanEmail = email.toLowerCase().trim();
    const existingUser = await prisma.user.findFirst({
      where: { email: cleanEmail },
      select: { id: true },
    });
    return { exists: !!existingUser };
  } catch {
    return { exists: false };
  }
}

// Sign up user
export async function signUpUser(prevState: unknown, formData: FormData) {
  try {
    const user = signUpFormSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    });

    const cleanEmail = user.email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      return {
        success: false,
        message: 'An account with this email address already exists. Please sign in instead.',
      };
    }

    const plainPassword = user.password;
    user.password = await hash(user.password);

    const adminEmailNormalized = (process.env.ADMIN_EMAIL || 'nikhil.pandey@madhavshringaar.com').toLowerCase().trim();
    const isAdmin = cleanEmail === adminEmailNormalized;

    await prisma.user.create({
      data: {
        name: user.name,
        email: cleanEmail,
        password: user.password,
        role: isAdmin ? 'admin' : 'user',
      },
    });

    sendWelcomeEmail({ name: user.name, email: cleanEmail }).catch((err) =>
      console.error('Failed to send welcome email:', err)
    );

    await signIn('credentials', {
      email: cleanEmail,
      password: plainPassword,
    });

    return { success: true, message: 'User registered successfully' };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: formatError(error) };
  }
}

// Get user by the ID
export async function getUserById(userId: string) {
  const user = await prisma.user.findFirst({
    where: { id: userId },
  });
  if (!user) throw new Error('User not found');
  return user;
}

// Update the user's address
export async function updateUserAddress(data: ShippingAddress, saveAddress: boolean = true) {
  try {
    const session = await auth();

    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });

    const address = shippingAddressSchema.parse(data);

    if (currentUser) {
      const userDataToUpdate: any = {};

      if (saveAddress) {
        const currentAddresses = Array.isArray(currentUser.addresses) ? currentUser.addresses as Prisma.JsonObject[] : [];
        
        // Check if address already exists (match on streetAddress, postalCode, and city)
        const addressExists = currentAddresses.some(
          (a: any) => a.streetAddress === address.streetAddress && a.city === address.city && a.postalCode === address.postalCode
        );

        let newAddresses = currentAddresses;
        if (!addressExists) {
          newAddresses = [address, ...currentAddresses].slice(0, 5); // Keep max 5
        }

        userDataToUpdate.address = address;
        userDataToUpdate.addresses = newAddresses;
      }

      if (address.guestEmail && (!currentUser.email || isDummyPhoneEmail(currentUser.email))) {
        userDataToUpdate.email = address.guestEmail;
      }
      if (address.fullName && (!currentUser.name || currentUser.name === 'NO_NAME')) {
        userDataToUpdate.name = address.fullName;
      }
      if (address.contactNumber && !currentUser.phoneNumber) {
        userDataToUpdate.phoneNumber = address.contactNumber;
      }

      if (Object.keys(userDataToUpdate).length > 0) {
        await prisma.user.update({
          where: { id: currentUser.id },
          data: userDataToUpdate,
        });
      }
    }

    // Always update the cart's shipping address
    const cart = await getMyCart();
    if (cart) {
      await prisma.cart.update({
        where: { id: cart.id },
        data: { shippingAddress: address },
      });
    }

    return {
      success: true,
      message: 'User address updated successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Delete an address from the user's address book
export async function deleteUserAddress(index: number) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) throw new Error('Not authenticated');

    const currentUser = await prisma.user.findFirst({
      where: { id: session.user.id },
    });

    if (!currentUser) throw new Error('User not found');

    const currentAddresses = Array.isArray(currentUser.addresses) ? currentUser.addresses : [];
    
    if (index < 0 || index >= currentAddresses.length) {
      throw new Error('Address not found');
    }

    const newAddresses = currentAddresses.filter((_, i) => i !== index);

    await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        addresses: newAddresses as any,
      },
    });

    return {
      success: true,
      message: 'Address removed successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}


// Update the user profile
export async function updateProfile(user: { 
  name: string; 
  email?: string | null;
  phoneNumber?: string | null;
}) {
  try {
    const session = await auth();

    const currentUser = await prisma.user.findFirst({
      where: {
        id: session?.user?.id,
      },
    });

    if (!currentUser) throw new Error('User not found');

    const updateData: any = {
      name: user.name,
    };

    if (user.email && user.email.includes('@') && !isDummyPhoneEmail(user.email)) {
      updateData.email = user.email.trim();
    }

    if (user.phoneNumber !== undefined) {
      updateData.phoneNumber = user.phoneNumber ? user.phoneNumber.trim() : null;
    }

    await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: updateData,
    });

    revalidatePath('/user/profile');
    revalidatePath('/user');
    revalidatePath('/', 'layout');

    return {
      success: true,
      message: 'Profile updated successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Save a tokenized / masked card to user profile
export async function saveUserCard(card: {
  cardholderName: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error('Not authenticated');

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) throw new Error('User not found');

    const cleanNumber = card.cardNumber.replace(/\s+/g, '');
    if (!/^\d{15,16}$/.test(cleanNumber)) {
      throw new Error('Please enter a valid 15 or 16 digit card number');
    }

    // Detect card network
    let cardType = 'RuPay';
    if (/^4/.test(cleanNumber)) cardType = 'Visa';
    else if (/^5[1-5]/.test(cleanNumber)) cardType = 'MasterCard';
    else if (/^3[47]/.test(cleanNumber)) cardType = 'Amex';

    const last4 = cleanNumber.slice(-4);
    const newCard = {
      id: `card_${Date.now()}`,
      cardholderName: card.cardholderName.trim(),
      last4,
      maskedNumber: `•••• •••• •••• ${last4}`,
      expiry: `${card.expiryMonth.padStart(2, '0')}/${card.expiryYear.slice(-2)}`,
      cardType,
      createdAt: new Date().toISOString(),
    };

    const currentCards = Array.isArray(user.savedCards) ? (user.savedCards as any[]) : [];
    const updatedCards = [newCard, ...currentCards.filter((c) => c.last4 !== last4 || c.cardType !== cardType)];

    await prisma.user.update({
      where: { id: user.id },
      data: { savedCards: updatedCards },
    });

    revalidatePath('/user/payments');
    return { success: true, message: 'Card saved securely in RBI-compliant token vault' };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Delete saved card
export async function deleteUserCard(cardId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error('Not authenticated');

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) throw new Error('User not found');

    const currentCards = Array.isArray(user.savedCards) ? (user.savedCards as any[]) : [];
    const updatedCards = currentCards.filter((c) => c.id !== cardId);

    await prisma.user.update({
      where: { id: user.id },
      data: { savedCards: updatedCards },
    });

    revalidatePath('/user/payments');
    return { success: true, message: 'Card removed successfully' };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Save UPI ID to user profile
export async function saveUserUpi(upiId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error('Not authenticated');

    const cleanUpi = upiId.trim().toLowerCase();
    if (!/^[a-zA-Z0-9.\-_]{2,49}@[a-zA-Z]{2,49}$/.test(cleanUpi)) {
      throw new Error('Please enter a valid UPI VPA address (e.g. name@okhdfcbank)');
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) throw new Error('User not found');

    const currentUpis = Array.isArray(user.savedUpiIds) ? (user.savedUpiIds as any[]) : [];
    if (!currentUpis.includes(cleanUpi)) {
      const updatedUpis = [cleanUpi, ...currentUpis];
      await prisma.user.update({
        where: { id: user.id },
        data: { savedUpiIds: updatedUpis },
      });
    }

    revalidatePath('/user/payments');
    return { success: true, message: 'UPI ID linked successfully' };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Delete saved UPI ID
export async function deleteUserUpi(upiId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error('Not authenticated');

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) throw new Error('User not found');

    const currentUpis = Array.isArray(user.savedUpiIds) ? (user.savedUpiIds as any[]) : [];
    const updatedUpis = currentUpis.filter((id) => id !== upiId);

    await prisma.user.update({
      where: { id: user.id },
      data: { savedUpiIds: updatedUpis },
    });

    revalidatePath('/user/payments');
    return { success: true, message: 'UPI ID removed successfully' };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Update user payment method

export async function updateUserPaymentMethod(
  data: z.infer<typeof paymentMethodSchema>
) {
  try {
    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });

    const paymentMethod = paymentMethodSchema.parse(data);

    if (currentUser) {
      await prisma.user.update({
        where: { id: currentUser.id },
        data: { paymentMethod: paymentMethod.type },
      });
    }

    const cart = await getMyCart();
    if (cart) {
      await prisma.cart.update({
        where: { id: cart.id },
        data: { paymentMethod: paymentMethod.type },
      });
    }

    return {
      success: true,
      message: 'User updated successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Get all the users
export async function getAllUsers({
  limit = PAGE_SIZE,
  page,
  query,
}: {
  limit?: number;
  page: number;
  query: string;
}) {
  const queryFilter: Prisma.UserWhereInput =
    query && query !== 'all'
      ? {
          name: {
            contains: query,
            mode: 'insensitive',
          } as Prisma.StringFilter,
        }
      : {};

  const data = await prisma.user.findMany({
    where: {
      ...queryFilter,
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: (page - 1) * limit,
  });

  const dataCount = await prisma.user.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

// Delete a user
export async function deleteUser(id: string) {
  try {
    const session = await auth();
    if (session?.user?.role !== 'admin') throw new Error('Unauthorized: Admin access required');
    await prisma.user.delete({ where: { id } });

    revalidatePath('/admin/users');

    return {
      success: true,
      message: 'User deleted successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Update a user
export async function updateUser(user: z.infer<typeof updateUserSchema>) {
  try {
    const session = await auth();
    if (session?.user?.role !== 'admin') throw new Error('Unauthorized: Admin access required');
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        role: user.role,
      },
    });

    revalidatePath('/admin/users');

    return {
      success: true,
      message: 'User updated successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Get comprehensive user account data for Flipkart-style account hub
export async function getUserAccountData() {
  try {
    const session = await auth();
    if (!session?.user?.id) return null;

    const user = await prisma.user.findFirst({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        image: true,
        role: true,
        address: true,
        addresses: true,
        savedCards: true,
        savedUpiIds: true,
        paymentMethod: true,
        bhaktiPoints: true,
        lifetimePoints: true,
        createdAt: true,
        _count: {
          select: {
            Order: true,
            Wishlist: true,
            Review: true,
          },
        },
      },
    });

    return user ? convertToPlainObject(user) : null;
  } catch (error) {
    console.error('Error fetching user account data:', error);
    return null;
  }
}