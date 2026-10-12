'use client';

import React, { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RotateCcw, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { requestOrderReturn } from '@/lib/actions/order.actions';
import { toast } from 'sonner';

interface ReturnRequestModalProps {
  order: {
    id: string;
    isDelivered: boolean;
    deliveredAt?: string | Date | null;
    refundStatus?: string | null;
    returnReason?: string | null;
  };
}

const RETURN_REASONS = [
  'Size / Fit Issue for Kanha Ji',
  'Damaged / Defective Item Received',
  'Item Different from Description or Image',
  'Missing Item or Accessory from Set',
  'Color / Fabric Quality Not as Expected',
  'Other Devotional Reason',
];

export default function ReturnRequestModal({ order }: ReturnRequestModalProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState(RETURN_REASONS[0]);
  const [comments, setComments] = useState('');
  const [isPending, startTransition] = useTransition();

  // If return request has already been placed
  if (order.refundStatus === 'RETURN_REQUESTED') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
        <Clock className="w-3.5 h-3.5 text-amber-600" />
        Return Under Review
      </span>
    );
  }

  if (order.refundStatus === 'RETURN_APPROVED') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        Return Approved
      </span>
    );
  }

  if (order.refundStatus === 'RETURN_REJECTED') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-600 text-xs font-bold border border-neutral-200">
        <AlertCircle className="w-3.5 h-3.5 text-neutral-500" />
        Return Closed
      </span>
    );
  }

  // Check 7-day eligibility
  if (!order.isDelivered || !order.deliveredAt) {
    return null; // Not delivered yet
  }

  const deliveryTime = new Date(order.deliveredAt).getTime();
  const daysSinceDelivery = (Date.now() - deliveryTime) / (1000 * 60 * 60 * 24);

  if (daysSinceDelivery > 7) {
    return null; // 7 days passed
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) {
      toast.error('Please select a return reason');
      return;
    }

    startTransition(async () => {
      const res = await requestOrderReturn({
        orderId: order.id,
        reason,
        comments,
      });

      if (res.success) {
        toast.success(res.message);
        setOpen(false);
      } else {
        toast.error(res.message);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="rounded-xl border-amber-300 bg-amber-50/50 hover:bg-amber-100/70 text-amber-900 text-xs font-semibold gap-1.5 h-8.5 shadow-2xs"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
          Request 7-Day Return
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md rounded-2xl p-6 bg-white border border-[#E6C16A]/40">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader className="space-y-1.5">
            <DialogTitle className="font-serif text-lg text-[#003020] flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-[#C88A20]" />
              7-Day Devotional Return Request
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-600">
              Order #{order.id.slice(0, 8).toUpperCase()} • Delivered within the 7-day guarantee window.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="reason" className="text-xs font-bold text-neutral-700">
                Reason for Return *
              </Label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger className="w-full text-xs rounded-xl border-neutral-300">
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent className="rounded-xl bg-white">
                  {RETURN_REASONS.map((r, i) => (
                    <SelectItem key={i} value={r} className="text-xs">
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="comments" className="text-xs font-bold text-neutral-700">
                Additional Comments / Description (Optional)
              </Label>
              <Textarea
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Explain the reason or specify replacement size..."
                className="text-xs rounded-xl border-neutral-300 min-h-[80px]"
              />
            </div>

            <div className="bg-[#FAF7F0] border border-[#E6C16A]/40 rounded-xl p-3 text-[11px] text-neutral-600 leading-relaxed">
              ✨ <strong>Return Note:</strong> Please ensure poshak, mukut, or accessories remain unwashed and in their original sanctified packaging. Our team will review and schedule a reverse courier pickup.
            </div>
          </div>

          <DialogFooter className="pt-2 flex sm:justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
              className="rounded-xl text-xs"
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isPending}
              className="bg-[#003020] hover:bg-[#002518] text-[#F3D98F] font-bold rounded-xl text-xs px-4"
            >
              {isPending ? 'Submitting...' : 'Confirm Return Request'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
