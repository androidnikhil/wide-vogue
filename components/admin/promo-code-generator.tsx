'use client';
import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { createCoupon } from '@/lib/actions/coupon.actions';

export default function PromoCodeGenerator() {
  const [isPending, startTransition] = useTransition();
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [maxUses, setMaxUses] = useState('');

  const handleGenerate = () => {
    if (!code || !discountValue) {
      toast.error('Code and Discount Value are required');
      return;
    }

    startTransition(async () => {
      const res = await createCoupon({
        code: code.trim(),
        discountType,
        discountValue: Number(discountValue),
        maxUses: maxUses ? Number(maxUses) : undefined,
      });

      if (res.success) {
        toast.success(res.message);
        setCode('');
        setDiscountValue('');
        setMaxUses('');
      } else {
        toast.error(res.message);
      }
    });
  };

  return (
    <Card className="mb-6 bg-surface shadow-sm border border-outline-variant/30">
      <CardHeader className="pb-3 border-b border-outline-variant/30">
        <CardTitle className="text-xl text-primary font-display-md">Create Promo Code</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div className="space-y-2">
            <label className="text-sm font-medium text-on-surface-variant">Code Name</label>
            <input
              type="text"
              placeholder="e.g. DIWALI20"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 bg-surface-container border border-outline-variant/50 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-on-surface-variant">Type</label>
            <select
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value as any)}
              className="w-full px-3 py-2 bg-surface-container border border-outline-variant/50 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount (₹)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-on-surface-variant">Value</label>
            <input
              type="number"
              min="1"
              placeholder={discountType === 'percentage' ? "20" : "500"}
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container border border-outline-variant/50 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-on-surface-variant">Max Uses (Optional)</label>
            <input
              type="number"
              min="1"
              placeholder="Unlimited"
              value={maxUses}
              onChange={(e) => setMaxUses(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container border border-outline-variant/50 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <Button 
            onClick={handleGenerate} 
            disabled={isPending}
            className="w-full"
          >
            {isPending ? 'Creating...' : 'Create Code'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
