'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { applyBhaktiPoints } from '@/lib/actions/cart.action';
import { toast } from 'sonner';
import { LOYALTY_CONFIG } from '@/lib/loyalty.config';

export default function BhaktiPointsForm({
  availablePoints,
  appliedPoints,
}: {
  availablePoints: number;
  appliedPoints: number;
}) {
  const [points, setPoints] = useState(appliedPoints || '');
  const [isPending, startTransition] = useTransition();

  const handleApply = async () => {
    const pointsToApply = Number(points);
    if (pointsToApply > availablePoints) {
      toast.error(`You only have ${availablePoints} points.`);
      return;
    }

    startTransition(async () => {
      const res = await applyBhaktiPoints(pointsToApply);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    });
  };

  const handleRemove = async () => {
    startTransition(async () => {
      const res = await applyBhaktiPoints(0);
      if (res.success) {
        setPoints('');
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    });
  };

  // We removed the early return so users always see the loyalty program widget
  // if (availablePoints === 0 && appliedPoints === 0) return null;

  return (
    <div className="flex flex-col gap-2 p-4 bg-orange-50 border border-orange-200 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-orange-500">stars</span>
          <h3 className="font-semibold text-orange-800">Bhakti Points</h3>
        </div>
        <span className="text-sm font-medium text-orange-700">Available: {availablePoints}</span>
      </div>
      
      <p className="text-xs text-orange-600 mb-2">
        Redeem {LOYALTY_CONFIG.POINTS_FOR_DISCOUNT} points for ₹{LOYALTY_CONFIG.DISCOUNT_VALUE} off.
      </p>

      {appliedPoints > 0 ? (
        <div className="flex items-center justify-between bg-white p-2 rounded-md border border-orange-100">
          <span className="text-sm font-medium text-orange-800">
            {appliedPoints} points applied (-₹{LOYALTY_CONFIG.calculateDiscountForPoints(appliedPoints)})
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            disabled={isPending}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8"
          >
            {isPending ? '...' : 'Remove'}
          </Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Points to redeem"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            disabled={isPending}
            min="1"
            max={availablePoints}
            className="bg-white border-orange-200 focus-visible:ring-orange-500"
          />
          <Button
            type="button"
            onClick={handleApply}
            disabled={isPending || !points || Number(points) <= 0}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            {isPending ? '...' : 'Apply'}
          </Button>
        </div>
      )}
    </div>
  );
}
