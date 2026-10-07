import {auth} from '@/auth';
import { getMyCart } from '@/lib/actions/cart.action';
import { getUserById } from '@/lib/actions/user.actions';
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

    let userAddress = cart.shippingAddress as ShippingAddress | null;

    let savedAddresses: ShippingAddress[] = [];

    if (userId) {
      const user = await getUserById(userId);
      if (user.address) {
        userAddress = user.address as ShippingAddress;
      }
      if (Array.isArray(user.addresses)) {
        savedAddresses = user.addresses as ShippingAddress[];
      }
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