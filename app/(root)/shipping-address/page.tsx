import {auth} from '@/auth';
import { getMyCart } from '@/lib/actions/cart.action';
import { getUserById } from '@/lib/actions/user.actions';
import { prisma } from '@/db/prisma';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { ShippingAddress } from '@/types';
import ShippingAddressForm from './shipping-address-form';
import CheckoutSteps from '@/components/shared/checkout-steps';

export const metadata: Metadata = {
    title: 'Shipping Address'
} 
const ShippingAddressPage = async () => {
    const cart = await getMyCart();
    if(!cart || cart.items.length === 0) return redirect('/cart');

    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return redirect('/sign-in?callbackUrl=/shipping-address');
    }

    let userAddress = (cart.shippingAddress as ShippingAddress | null) || null;
    let savedAddresses: ShippingAddress[] = [];

    if (userId) {
      const user = await getUserById(userId);
      const userAddr = user.address as ShippingAddress | null;

      // Build saved addresses list
      if (Array.isArray(user.addresses)) {
        savedAddresses = [...(user.addresses as ShippingAddress[])];
      }
      if (userAddr && userAddr.streetAddress) {
        const alreadyExists = savedAddresses.some(
          (a) => a.streetAddress === userAddr.streetAddress && a.postalCode === userAddr.postalCode
        );
        if (!alreadyExists) {
          savedAddresses.unshift(userAddr);
        }
      }

      // Also fetch past order addresses if available
      try {
        const pastOrders = await prisma.order.findMany({
          where: { userId },
          select: { shippingAddress: true },
          take: 5,
          orderBy: { createdAt: 'desc' },
        });

        for (const ord of pastOrders) {
          const ordAddr = ord.shippingAddress as ShippingAddress | null;
          if (ordAddr && ordAddr.streetAddress) {
            const exists = savedAddresses.some(
              (a) => a.streetAddress === ordAddr.streetAddress && a.postalCode === ordAddr.postalCode
            );
            if (!exists) {
              savedAddresses.push(ordAddr);
            }
          }
        }
      } catch (err) {
        console.warn('Error fetching past addresses:', err);
      }

      // Determine initial form address with intelligent autofill priority
      const baseAddress = userAddress || userAddr || (savedAddresses[0] || null);

      userAddress = {
        fullName: baseAddress?.fullName || (user.name && user.name !== 'NO_NAME' ? user.name : '') || '',
        guestEmail: baseAddress?.guestEmail || (user.email && !user.email.endsWith('@madhavshringaar.com') ? user.email : '') || '',
        contactNumber: baseAddress?.contactNumber || (user.phoneNumber ? user.phoneNumber.replace(/^\+91/, '') : '') || '',
        streetAddress: baseAddress?.streetAddress || '',
        city: baseAddress?.city || '',
        state: baseAddress?.state || '',
        postalCode: baseAddress?.postalCode || '',
        country: baseAddress?.country || 'India',
        lat: baseAddress?.lat,
        lng: baseAddress?.lng,
      };
    }

    return ( 
        <>
        <CheckoutSteps current={1} />
        <ShippingAddressForm 
          address={userAddress || ({} as ShippingAddress)} 
          isGuest={!userId} 
          savedAddresses={savedAddresses}
        />
        </>
     );
}
 
export default ShippingAddressPage;