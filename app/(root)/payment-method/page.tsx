import { Metadata } from "next";
import {auth} from "@/auth";
import { getUserById } from "@/lib/actions/user.actions";
import { getMyCart } from "@/lib/actions/cart.action";
import PaymentMethodForm from "./payment-method-form";
import CheckoutSteps from "@/components/shared/checkout-steps";

export const metadata: Metadata = {
    title: 'Select Payment Method',
    description: 'Choose your payment method',
}

const PaymentMethod = async () => {
    const session = await auth();
    const userId = session?.user?.id;

    const cart = await getMyCart();
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