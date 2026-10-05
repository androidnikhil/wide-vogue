'use client';

import { useState, useTransition } from 'react';
import { applyCoupon } from '@/lib/actions/cart.action';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader, Ticket } from 'lucide-react';

export default function CouponForm({ 
  initialCode 
}: { 
  initialCode?: string | null 
}) {
  const [code, setCode] = useState(initialCode || '');
  const [isPending, startTransition] = useTransition();

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    startTransition(async () => {
      const res = await applyCoupon(code);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    });
  };

  const handleRemove = () => {
    startTransition(async () => {
      const res = await applyCoupon('');
      if (res.success) {
        setCode('');
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    });
  };

  return (
    <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 mb-4">
      <h3 className="font-semibold text-primary mb-3 flex items-center gap-2">
        <Ticket className="w-5 h-5 text-secondary" />
        Have a Promo Code?
      </h3>
      <form onSubmit={handleApply} className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          className="uppercase bg-surface focus-visible:ring-secondary"
          disabled={isPending || !!initialCode}
        />
        {initialCode ? (
          <Button 
            type="button" 
            variant="destructive" 
            onClick={handleRemove}
            disabled={isPending}
          >
            {isPending ? <Loader className="w-4 h-4 animate-spin" /> : 'Remove'}
          </Button>
        ) : (
          <Button 
            type="submit" 
            className="gold-gradient-btn text-white"
            disabled={isPending || !code}
          >
            {isPending ? <Loader className="w-4 h-4 animate-spin" /> : 'Apply'}
          </Button>
        )}
      </form>
    </div>
  );
}
