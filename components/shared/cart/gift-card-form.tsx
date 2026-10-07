'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader } from 'lucide-react';
import { useState, useTransition } from 'react';
import { applyGiftCard } from '@/lib/actions/cart.action';
import { toast } from 'sonner';

export default function GiftCardForm({ initialCode }: { initialCode?: string | null }) {
  const [code, setCode] = useState(initialCode || '');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!code) return;
    
    startTransition(async () => {
      const res = await applyGiftCard(code);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    });
  };

  const handleRemove = async () => {
    startTransition(async () => {
      const res = await applyGiftCard('');
      if (res.success) {
        setCode('');
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    });
  };

  return (
    <div className='flex flex-col gap-2 mt-4'>
      <label className='font-medium text-sm text-on-surface-variant'>Have a Gift Card?</label>
      {initialCode ? (
        <div className='flex items-center justify-between p-3 border border-secondary/20 rounded-lg bg-emerald-50'>
          <span className='font-medium text-emerald-700 flex-1'>{initialCode}</span>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={handleRemove}
            disabled={isPending}
            className='text-error hover:text-error hover:bg-error/10 h-8 px-2'
          >
            {isPending ? <Loader className='w-4 h-4 animate-spin' /> : 'Remove'}
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className='flex gap-2'>
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder='GC-XXXX-XXXX'
            className='flex-1 border-secondary/20 font-mono uppercase'
            disabled={isPending}
          />
          <Button type='submit' disabled={isPending || !code} variant="outline" className='border-secondary/20 hover:bg-surface-container'>
            {isPending ? <Loader className='w-4 h-4 animate-spin' /> : 'Apply'}
          </Button>
        </form>
      )}
    </div>
  );
}
