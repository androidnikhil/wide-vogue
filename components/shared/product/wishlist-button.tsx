'use client';

import { useTransition, useState, useEffect } from 'react';
import { toggleWishlistItem, isInWishlist } from '@/lib/actions/wishlist.actions';
import { toast } from 'sonner';

export default function WishlistButton({ productId, className }: { productId: string, className?: string }) {
  const [isPending, startTransition] = useTransition();
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    // Check initial state
    const checkWishlist = async () => {
      const res = await isInWishlist(productId);
      setInWishlist(res);
    };
    checkWishlist();
  }, [productId]);

  const handleToggle = () => {
    startTransition(async () => {
      const res = await toggleWishlistItem(productId);
      if (res.success) {
        setInWishlist(!inWishlist);
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    });
  };

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleToggle();
      }}
      disabled={isPending}
      className={
        className
          ? `${className} ${inWishlist ? '!text-rose-600 !border-rose-300 !bg-rose-50/60' : ''}`
          : `absolute top-2 right-2 z-10 w-8 h-8 bg-white/90 hover:bg-white rounded-full shadow-xs active:scale-90 transition-all flex items-center justify-center ${
              inWishlist ? 'text-rose-600' : 'text-neutral-500 hover:text-rose-600'
            }`
      }
      title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
    >
      <span
        className="material-symbols-outlined text-base sm:text-lg transition-colors"
        style={{ fontVariationSettings: inWishlist ? "'FILL' 1" : "'FILL' 0" }}
      >
        favorite
      </span>
    </button>
  );
}
