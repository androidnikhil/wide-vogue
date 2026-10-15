"use client";
import React from 'react';

import { useLanguage } from '@/lib/i18n/language-context';

export default function CartTrigger({ cartItemCount, cartPrice }: { cartItemCount: number, cartPrice: string }) {
  const { t } = useLanguage();

  return (
    <button 
      onClick={() => document.dispatchEvent(new CustomEvent('open-cart-drawer'))}
      className="flex items-center gap-2 p-2 max-sm:p-1.5 bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/50 rounded-lg text-primary transition-all duration-300 hover:-translate-y-1 hover:shadow-md active:scale-95"
      aria-label={t.cart.yourCart}
    >
      <div className="relative">
        <span className="material-symbols-outlined text-2xl max-sm:text-[22px] text-secondary transition-transform group-hover:scale-110">shopping_bag</span>
        {cartItemCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary-container text-primary-fixed rounded-full font-sans text-[10px] font-bold flex items-center justify-center animate-in zoom-in">
            {cartItemCount}
          </span>
        )}
      </div>
      <div className="hidden sm:flex flex-col text-left pr-1">
        <span className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant">{t.common.cart}</span>
        <span className="font-sans text-sm font-bold text-secondary leading-tight">₹{cartPrice}</span>
      </div>
    </button>
  );
}