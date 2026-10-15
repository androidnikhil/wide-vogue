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
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { processReturnRequest } from '@/lib/actions/order.actions';
import { toast } from 'sonner';

interface AdminReturnActionProps {
  order: {
    id: string;
    refundStatus?: string | null;
    returnReason?: string | null;
    returnRequestedAt?: string | Date | null;
  };
}

export default function AdminReturnAction({ order }: AdminReturnActionProps) {
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectNote, setRejectNote] = useState('');
  const [isPending, startTransition] = useTransition();

  if (!order.refundStatus) return null;

  const handleApprove = () => {
    if (!confirm('Are you sure you want to approve this return request? Customer will receive confirmation email with pickup instructions.')) {
      return;
    }

    startTransition(async () => {
      const res = await processReturnRequest({
        orderId: order.id,
        action: 'APPROVED',
      });
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    });
  };

  const handleReject = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await processReturnRequest({
        orderId: order.id,
        action: 'REJECTED',
        note: rejectNote,
      });
      if (res.success) {
        toast.success(res.message);
        setRejectOpen(false);
      } else {
        toast.error(res.message);
      }
    });
  };

  return (
    <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/70 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <RotateCcw className="w-5 h-5 text-amber-700" />
          <h4 className="font-bold text-sm text-amber-950">
            Customer Return Request ({order.refundStatus})
          </h4>
        </div>
        <span className="text-[11px] text-amber-800 font-mono">
          {order.returnRequestedAt
            ? new Date(order.returnRequestedAt).toLocaleDateString()
            : ''}
        </span>
      </div>

      <div className="text-xs text-amber-900 bg-white/80 p-3 rounded-lg border border-amber-200">
        <strong>Reason provided by buyer:</strong>
        <p className="mt-1 italic">&ldquo;{order.returnReason || 'No reason specified'}&rdquo;</p>
      </div>

      {order.refundStatus === 'RETURN_REQUESTED' && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Button
            type="button"
            size="sm"
            disabled={isPending}
            onClick={handleApprove}
            className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            {isPending ? 'Processing...' : 'Approve Return & Schedule Pickup'}
          </Button>

          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={isPending}
            onClick={() => setRejectOpen(true)}
            className="border-red-300 text-red-700 hover:bg-red-50 text-xs font-semibold rounded-lg gap-1.5"
          >
            <XCircle className="w-4 h-4" />
            Reject Return
          </Button>
        </div>
      )}

      {order.refundStatus === 'RETURN_APPROVED' && (
        <p className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Return Approved — Reverse pickup scheduled with courier.
        </p>
      )}

      {order.refundStatus === 'RETURN_REJECTED' && (
        <p className="text-xs font-semibold text-neutral-600 flex items-center gap-1.5">
          <XCircle className="w-4 h-4 text-neutral-500" />
          Return Request Rejected / Closed.
        </p>
      )}

      {/* Reject Dialog */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6 bg-white">
          <form onSubmit={handleReject} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-base text-red-700 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-600" />
                Reject Return Request
              </DialogTitle>
              <DialogDescription className="text-xs text-neutral-500">
                Please provide a reason. This explanation will be emailed to the customer.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2">
              <Label htmlFor="rejectNote" className="text-xs font-bold text-neutral-700">
                Rejection Reason / Note to Customer
              </Label>
              <Textarea
                id="rejectNote"
                required
                value={rejectNote}
                onChange={(e) => setRejectNote(e.target.value)}
                placeholder="e.g., Item return requested after policy window, or custom blessed item exempt from returns."
                className="text-xs rounded-xl border-neutral-300 min-h-[90px]"
              />
            </div>

            <DialogFooter className="pt-2 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setRejectOpen(false)}
                className="rounded-xl text-xs"
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isPending}
                className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs px-4"
              >
                {isPending ? 'Rejecting...' : 'Confirm Rejection'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
