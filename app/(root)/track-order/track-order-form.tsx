'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getOrderById } from '@/lib/actions/order.actions';
import { Loader } from 'lucide-react';
import OrderTimeline from '@/components/shared/order/order-timeline';

const TrackOrderForm = () => {
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState<any>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) return;

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const foundOrder = await getOrderById(orderId);
      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        setError('Order not found. Please check your Order ID.');
      }
    } catch (err) {
      setError('Invalid Order ID format or order not found.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {!order ? (
        <form onSubmit={handleTrack} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="orderId">Order ID</Label>
            <Input
              id="orderId"
              placeholder="e.g. 49b55d94-244b-47f3..."
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full gold-gradient-btn text-white" disabled={loading}>
            {loading ? <Loader className="w-4 h-4 animate-spin mr-2" /> : null}
            Track Order
          </Button>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 text-center">
            <p className="text-sm text-on-surface-variant">Order Status for</p>
            <p className="font-title-lg text-primary">{orderId}</p>
          </div>
          <OrderTimeline order={order} />
          <Button variant="outline" className="w-full" onClick={() => setOrder(null)}>
            Track Another Order
          </Button>
        </div>
      )}
    </div>
  );
};

export default TrackOrderForm;
