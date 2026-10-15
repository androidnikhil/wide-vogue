import { Metadata } from 'next';
import { Suspense } from 'react';
import TrackOrderForm from './track-order-form';

export const metadata: Metadata = {
  title: 'Track Order & Shipment Status | Madhav Shringaar',
  description: 'Track your sacred Laddu Gopal poshak and shringaar parcel with live shipment updates, courier AWB tracking, and out-for-delivery status.',
  keywords: [
    'track order Madhav Shringaar',
    'Laddu Gopal poshak shipment status',
    'track Krishna dress delivery',
  ],
  alternates: {
    canonical: '/track-order',
  },
};

const TrackOrderPage = () => {
  return (
    <div className='max-w-md mx-auto my-10 bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant/30'>
      <div className="text-center mb-6">
        <h1 className='h2-bold text-primary mb-2'>Track Your Order</h1>
        <p className="text-on-surface-variant">Enter your order details below to see the current status of your shipment.</p>
      </div>
      <Suspense fallback={<div className="text-center py-4 text-xs text-neutral-500">Loading tracking form...</div>}>
        <TrackOrderForm />
      </Suspense>
    </div>
  );
};

export default TrackOrderPage;
