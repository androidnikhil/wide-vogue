import { Metadata } from 'next';
import { getOrderById } from '@/lib/actions/order.actions';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@/auth';
import OrderDetailsTable from './order-details-table';
import { ShippingAddress } from '@/types';

export const metadata: Metadata = {
    title: 'Order Details',
}

const OrderDetailsPage = async (props : {
    params: Promise<{id: string;}>;
}) => {
    const { id } = await props.params;
    const order = await getOrderById(id);
    if(!order) return notFound();
    
    const session = await auth();

  // Redirect the user if they don't own the order
  if (order.userId !== session?.user?.id ) {
    return redirect('/unauthorized');
  }

    return ( 
        <OrderDetailsTable order={{
            ...order,
            shippingAddress: order.shippingAddress as ShippingAddress
        }}
        paypalClientId={process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'sb'}
        />
     );
}
 
export default OrderDetailsPage;