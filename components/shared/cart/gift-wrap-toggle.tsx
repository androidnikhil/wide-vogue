'use client';

import { useTransition } from 'react';
import { toggleGiftWrap } from '@/lib/actions/cart.action';
import { Checkbox } from '@/components/ui/checkbox';
import { Gift, Loader } from 'lucide-react';
import { toast } from 'sonner';

export default function GiftWrapToggle({ isGiftWrapped }: { isGiftWrapped: boolean }) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = (checked: boolean) => {
    startTransition(async () => {
      const res = await toggleGiftWrap(checked);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    });
  };

  return (
    <div className="flex items-start space-x-3 p-4 bg-secondary/5 rounded-xl border border-secondary/20">
      {isPending ? (
        <Loader className="w-5 h-5 animate-spin text-secondary mt-0.5" />
      ) : (
        <Checkbox 
          id="gift-wrap" 
          checked={isGiftWrapped} 
          onCheckedChange={handleToggle} 
          className="mt-1 border-secondary data-[state=checked]:bg-secondary data-[state=checked]:text-on-secondary"
        />
      )}
      <div className="grid gap-1.5 leading-none">
        <label
          htmlFor="gift-wrap"
          className="text-sm font-semibold flex items-center gap-2 cursor-pointer text-on-surface"
        >
          <Gift className="w-4 h-4 text-secondary" />
          Add Gift Wrapping (+₹50)
        </label>
        <p className="text-xs text-on-surface-variant">
          Send this as a divine gift. We will wrap it in premium packaging without pricing details.
        </p>
      </div>
    </div>
  );
}
