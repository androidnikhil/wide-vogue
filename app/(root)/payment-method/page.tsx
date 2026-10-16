import { Metadata } from "next";
import {auth} from "@/auth";
import { getUserById } from "@/lib/actions/user.actions";
import { getMyCart } from "@/lib/actions/cart.action";
import { redirect } from 'next/navigation';
import PaymentMethodForm from "./payment-method-form";
import CheckoutSteps from "@/components/shared/checkout-steps";

export const metadata: Metadata = {
    title: 'Select Payment Method',
    description: 'Choose your payment method',
}

const PaymentMethod = async () => {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return redirect('/sign-in?callbackUrl=/payment-method');
    }

    const cart = await getMyCart();
    if (!cart || cart.items.length === 0) {
      return redirect('/cart');
    }

    // Dynamic Zero-Payment Case:
    // If Gift Card or discounts cover 100% of order (Total = ₹0), bypass payment selection
    if (Number(cart.totalPrice) <= 0) {
      const { updateUserPaymentMethod } = await import('@/lib/actions/user.actions');
      await updateUserPaymentMethod({ type: 'GiftCard' });
      return redirect('/place-order');
    }

    let paymentMethod = cart?.paymentMethod || '';

    if (userId) {
      const user = await getUserById(userId);
      if (user.paymentMethod) {
        paymentMethod = user.paymentMethod;
      }
    }
    
    return ( 
        <>
         <CheckoutSteps current={2} />
        <PaymentMethodForm preferredPaymentMethod={paymentMethod} />
        </>
     );
}
 
export default PaymentMethod;