'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { trackOrderByQuery } from '@/lib/actions/order.actions';
import { Loader } from 'lucide-react';
import OrderTimeline from '@/components/shared/order/order-timeline';

const TrackOrderForm = () => {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('awb') || searchParams.get('orderId') || '';
  const [orderQuery, setOrderQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState<any>(null);

  const fetchTracking = async (q: string) => {
    if (!q.trim()) return;

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const foundOrder = await trackOrderByQuery(q);
      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        setError('Order not found. Please verify your Order ID or AWB Tracking Number.');
      }
    } catch (err) {
      setError('Unable to locate order. Please check the details entered.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      fetchTracking(initialQuery);
    }
  }, [initialQuery]);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchTracking(orderQuery);
  };

  return (
    <div>
      {!order ? (
        <form onSubmit={handleTrack} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="orderQuery">Order ID or AWB Tracking Number</Label>
            <Input
              id="orderQuery"
              placeholder="e.g. 49b55d94-244b-47f3... or AWB 1432423..."
              value={orderQuery}
              onChange={(e) => setOrderQuery(e.target.value)}
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
            <p className="font-title-lg text-primary">{order.id}</p>
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
