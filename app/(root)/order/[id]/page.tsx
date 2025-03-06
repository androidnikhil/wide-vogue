import { Metadata } from 'next';
import { getOrderById } from '@/lib/actions/order.actions';
import { notFound, redirect } from 'next/navigation';

export const metadata: Metadata = {
    title: 'Order Details',
}

const OrderDetailsPage = async (props : {
    params: Promise<{id: string;}>;
}) => {
    const { id } = await props.params;
    const order = await getOrderById(id);
    if(!order) return notFound();
    return ( 
        <>Order details</>
     );
}
 
export default OrderDetailsPage;