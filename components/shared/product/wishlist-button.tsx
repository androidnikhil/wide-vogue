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
      onClick={(e) => {
        e.preventDefault(); // Prevent navigating if wrapped in a link
        handleToggle();
      }}
      disabled={isPending}
      className={className || `absolute top-2 right-2 z-10 p-1.5 bg-surface/90 hover:bg-surface rounded-full shadow-xs active:scale-90 transition-transform flex items-center justify-center ${
        inWishlist ? 'text-red-500' : 'text-on-surface-variant hover:text-secondary'
      }`}
    >
      <span
        className="material-symbols-outlined text-base transition-colors"
        style={{ fontVariationSettings: inWishlist ? "'FILL' 1" : "'FILL' 0" }}
      >
        favorite
      </span>
    </button>
  );
}
