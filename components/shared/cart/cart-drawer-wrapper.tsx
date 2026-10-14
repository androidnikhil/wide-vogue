"use client";
import React, { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.action';
import { toast } from 'sonner';
import { Minus, Plus, Trash2, Loader2, ShoppingBag } from 'lucide-react';

export default function CartDrawerWrapper({ cart }: { cart: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsOpen(false); };
    
    document.addEventListener('open-cart-drawer', handleOpen);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('open-cart-drawer', handleOpen);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleIncrease = (item: any) => {
    const itemKey = `${item.productId}-${item.size || ''}`;
    setLoadingKey(itemKey);
    startTransition(async () => {
      try {
        const res = await addItemToCart(item);
        if (!res.success) {
          toast.error(res.message);
        } else {
          router.refresh();
        }
      } catch (err: any) {
        toast.error(err.message || 'Failed to update item quantity');
      } finally {
        setLoadingKey(null);
      }
    });
  };

  const handleDecrease = (item: any) => {
    const itemKey = `${item.productId}-${item.size || ''}`;
    setLoadingKey(itemKey);
    startTransition(async () => {
      try {
        const res = await removeItemFromCart(item.productId, item.size);
        if (!res.success) {
          toast.error(res.message);
        } else {
          router.refresh();
        }
      } catch (err: any) {
        toast.error(err.message || 'Failed to update item quantity');
      } finally {
        setLoadingKey(null);
      }
    });
  };

  if (!isOpen) return null;

  const totalItemCount = cart?.items?.reduce((acc: number, item: any) => acc + (item.qty || 1), 0) || 0;

  return (
    <>
      <div 
        className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
        aria-label="Close cart drawer overlay"
      />
      <aside className="fixed top-0 right-0 z-[110] h-full w-full max-w-sm bg-surface shadow-2xl flex flex-col p-6 animate-in slide-in-from-right duration-300">
         <div className="flex items-center justify-between mb-5 border-b border-outline/10 pb-4">
             <div>
               <h2 className="text-xl font-bold font-serif text-primary">Your Devotional Cart</h2>
               <p className="text-xs text-on-surface-variant font-medium">
                 {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'} in your seva cart
               </p>
             </div>
             <button 
               onClick={() => setIsOpen(false)} 
               className="p-2 hover:bg-surface-container rounded-full text-secondary transition-colors"
               aria-label="Close cart"
             >
               <span className="material-symbols-outlined">close</span>
             </button>
         </div>
         
         <div className="flex-1 flex flex-col gap-3.5 overflow-y-auto custom-scroll pr-1">
            {cart && cart.items && cart.items.length > 0 ? (
                cart.items.map((item: any) => {
                    const itemKey = `${item.productId}-${item.size || ''}`;
                    const isItemLoading = isPending && loadingKey === itemKey;

                    let itemImage = item.image || '';
                    if (itemImage.includes('sample-products')) {
                        const nameLower = item.name ? item.name.toLowerCase() : '';
                        if (nameLower.includes('poshak') || itemImage.includes('p1')) itemImage = '/images/devotional/poshak.webp';
                        else if (nameLower.includes('mukut') || itemImage.includes('p2')) itemImage = '/images/devotional/mukut.webp';
                        else if (nameLower.includes('bansuri') || itemImage.includes('p3')) itemImage = '/images/devotional/bansuri.webp';
                        else if (nameLower.includes('jewel') || itemImage.includes('p4')) itemImage = '/images/devotional/jewellery.webp';
                        else if (nameLower.includes('aasan') || itemImage.includes('p5')) itemImage = '/images/devotional/aasan.webp';
                        else itemImage = '/images/devotional/complete_shringar.webp';
                    }
                    return (
                      <div key={itemKey} className="p-3 bg-surface-container-low rounded-xl border border-outline/10 hover:border-secondary/40 transition-colors">
                          <div className="flex gap-3">
                              <div className="relative w-16 h-16 rounded-lg bg-surface overflow-hidden shrink-0 border border-outline/10 shadow-xs">
                                  <Image src={itemImage} alt={item.name} fill sizes="64px" className="object-cover" />
                              </div>
                              <div className="flex flex-col justify-between flex-1 min-w-0">
                                  <div>
                                    <h4 className="font-bold text-primary text-sm truncate font-sans">{item.name}</h4>
                                    <div className="flex items-center gap-2 mt-0.5">
                                      {item.size && (
                                        <span className="text-[10px] bg-secondary/10 text-[#8A5A0A] font-semibold px-1.5 py-0.2 rounded font-sans">
                                          Size {item.size}
                                        </span>
                                      )}
                                      <span className="font-bold text-secondary text-xs font-sans">
                                        ₹{item.price.toString()}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Quantity Controls: - Qty + */}
                                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-outline/10">
                                      <div className="flex items-center gap-1.5 bg-surface rounded-lg p-0.5 border border-outline/20">
                                          <button
                                            type="button"
                                            disabled={isPending}
                                            onClick={() => handleDecrease(item)}
                                            className="w-6 h-6 rounded flex items-center justify-center text-on-surface hover:bg-neutral-100 hover:text-red-600 disabled:opacity-40 transition-colors"
                                            aria-label={item.qty === 1 ? 'Remove item' : 'Decrease quantity'}
                                          >
                                            {item.qty === 1 ? (
                                              <Trash2 className="w-3.5 h-3.5 text-neutral-500 hover:text-red-600" />
                                            ) : (
                                              <Minus className="w-3.5 h-3.5" />
                                            )}
                                          </button>

                                          <span className="w-6 text-center text-xs font-bold text-primary font-sans">
                                            {isItemLoading ? (
                                              <Loader2 className="w-3 h-3 animate-spin mx-auto text-[#0F6F74]" />
                                            ) : (
                                              item.qty
                                            )}
                                          </span>

                                          <button
                                            type="button"
                                            disabled={isPending}
                                            onClick={() => handleIncrease(item)}
                                            className="w-6 h-6 rounded flex items-center justify-center text-on-surface hover:bg-neutral-100 hover:text-[#0F6F74] disabled:opacity-40 transition-colors"
                                            aria-label="Increase quantity"
                                          >
                                            <Plus className="w-3.5 h-3.5" />
                                          </button>
                                      </div>

                                      <span className="text-xs font-bold text-primary font-sans">
                                        ₹{(Number(item.price) * item.qty).toFixed(0)}
                                      </span>
                                  </div>
                              </div>
                          </div>
                      </div>
                    );
                })
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-12 opacity-75">
                    <ShoppingBag className="w-14 h-14 text-outline/60 mb-3" />
                    <p className="text-on-surface-variant text-sm font-medium font-sans">Your seva cart is empty.</p>
                    <button 
                      onClick={() => setIsOpen(false)}
                      className="mt-4 text-xs font-semibold text-primary hover:underline"
                    >
                      Continue Shopping →
                    </button>
                </div>
            )}
         </div>

         <div className="mt-4 pt-4 border-t border-outline/20">
            <div className="flex justify-between items-center mb-4">
               <div>
                 <span className="text-xs text-on-surface-variant font-medium block">Total Seva Value</span>
                 <span className="text-xs text-emerald-700 font-medium">Free Delivery Eligible</span>
               </div>
               <span className="font-bold text-primary text-xl font-sans">₹{cart ? cart.itemsPrice : '0'}</span>
            </div>
            <div className="space-y-2">
              <Link 
                href="/cart" 
                onClick={() => setIsOpen(false)} 
                className="w-full block text-center gold-gradient-btn text-primary-container font-bold py-3 rounded-xl shadow-md hover:-translate-y-0.5 transition-transform uppercase tracking-wider text-xs font-sans"
              >
                 Review Cart & Checkout
              </Link>
            </div>
         </div>
      </aside>
    </>
  );
}
