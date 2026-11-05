'use client';

import { useTransition } from 'react';
import { toggleProductPublished } from '@/lib/actions/product.action';
import { toast } from 'sonner';

export default function PublishToggleButton({
  id,
  isPublished,
}: {
  id: string;
  isPublished: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      const res = await toggleProductPublished(id);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer shadow-2xs select-none active:scale-95 disabled:opacity-60 ${
        isPublished
          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
          : 'bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100'
      }`}
      title={isPublished ? 'Live on website. Click to set as Draft.' : 'Draft (hidden). Click to publish live.'}
    >
      <span
        className={`w-2 h-2 rounded-full ${
          isPublished ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
        }`}
      />
      <span>{isPublished ? 'Live' : 'Draft'}</span>
    </button>
  );
}

