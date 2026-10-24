import { Metadata } from 'next';
import { Suspense } from 'react';
import TrackOrderForm from '@/app/(root)/track-order/track-order-form';
import { Truck, Package, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Live Order Tracking | Madhav Shringaar',
  description: 'Track your live parcel shipment and courier milestones directly within your devotee dashboard.',
};

export default function UserTrackingPage() {
  return (
    <div className="w-full space-y-6 pb-12">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-xl md:text-2xl font-bold text-[#003020] flex items-center gap-2">
            <Truck className="w-6 h-6 text-[#0F6F74]" />
            Live Shipment Tracking
          </h1>
          <p className="text-xs md:text-sm text-neutral-500 mt-1">
            Real-time courier tracking via Shiprocket. Enter your Order ID or Courier AWB number.
          </p>
        </div>

        <Button
          asChild
          variant="outline"
          className="rounded-xl border-neutral-300 text-xs self-start sm:self-auto gap-2"
        >
          <Link href="/user/orders">
            <Package className="w-4 h-4 text-[#0F6F74]" />
            View Past Orders
          </Link>
        </Button>
      </div>

      {/* Tracking Form & Results Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200/80 shadow-xs max-w-2xl">
        <Suspense fallback={<div className="text-center py-6 text-xs text-neutral-500">Loading tracking tools...</div>}>
          <TrackOrderForm />
        </Suspense>
      </div>
    </div>
  );
}
