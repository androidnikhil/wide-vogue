import { Metadata } from 'next';
import TrackOrderForm from './track-order-form';

export const metadata: Metadata = {
  title: 'Track Your Order',
};

const TrackOrderPage = () => {
  return (
    <div className='max-w-md mx-auto my-10 bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant/30'>
      <div className="text-center mb-6">
        <h1 className='h2-bold text-primary mb-2'>Track Your Order</h1>
        <p className="text-on-surface-variant">Enter your order details below to see the current status of your shipment.</p>
      </div>
      <TrackOrderForm />
    </div>
  );
};

export default TrackOrderPage;
