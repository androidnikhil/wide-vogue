import { Metadata } from 'next';
import { getMyOrders } from '@/lib/actions/order.actions';
import Pagination from '@/components/shared/pagination';
import OrdersListClient from './orders-list-client';
import { Package, Truck, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'My Orders & Deliveries | Madhav Shringaar',
  description: 'View order history, track live shipments, and download standard A4 tax invoices.',
};

const OrdersPage = async (props: {
  searchParams: Promise<{ page: string }>;
}) => {
  const { page } = await props.searchParams;

  const orders = await getMyOrders({
    page: Number(page) || 1,
  });

  return (
    <div className='w-full space-y-6 pb-12'>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs">
        <div>
          <h1 className="font-serif text-xl md:text-2xl font-bold text-[#003020] flex items-center gap-2">
            <Package className="w-6 h-6 text-[#0F6F74]" />
            Your Orders & Deliveries
          </h1>
          <p className="text-xs md:text-sm text-neutral-500 mt-1">
            Track active Shiprocket courier dispatches and download GST-compliant tax invoices.
          </p>
        </div>

        <Button
          asChild
          variant="outline"
          className="rounded-xl border-neutral-300 text-xs self-start sm:self-auto gap-2"
        >
          <Link href="/user/tracking">
            <Truck className="w-4 h-4 text-[#0F6F74]" />
            Live AWB Tracking
          </Link>
        </Button>
      </div>

      {/* Orders List */}
      <OrdersListClient orders={orders.data as any} />

      {/* Pagination */}
      {orders.totalPages > 1 && (
        <div className="pt-4 flex justify-center">
          <Pagination
            page={Number(page) || 1}
            totalPages={orders.totalPages}
          />
        </div>
      )}
    </div>
  );
};

export default OrdersPage;