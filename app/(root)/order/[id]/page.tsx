import { Metadata } from 'next';
import { getOrderById } from '@/lib/actions/order.actions';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@/auth';

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
  if (order.userId !== session?.user.id && session?.user.role !== 'admin') {
    return redirect('/unauthorized');
  }

    return ( 
        <>Order details</>
     );
}
 
export default OrderDetailsPage;