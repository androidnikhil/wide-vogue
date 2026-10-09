"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CartDrawerWrapper({ cart }: { cart: any }) {
  const [isOpen, setIsOpen] = useState(false);

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

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      />
      <aside className="fixed top-0 right-0 z-[110] h-full w-full max-w-sm bg-surface shadow-2xl flex flex-col p-6 animate-in slide-in-from-right duration-300">
         <div className="flex items-center justify-between mb-6 border-b border-outline/10 pb-4">
             <h2 className="text-xl font-bold font-serif text-primary">Your Devotional Cart</h2>
             <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-surface-container rounded-full text-secondary transition-colors">
               <span className="material-symbols-outlined">close</span>
             </button>
         </div>
         
         <div className="flex-1 flex flex-col gap-4 overflow-y-auto custom-scroll pr-2">
            {cart && cart.items && cart.items.length > 0 ? (
                cart.items.map((item: any) => {
                    let itemImage = item.image || '';
                    if (itemImage.includes('sample-products')) {
                        const nameLower = item.name ? item.name.toLowerCase() : '';
                        if (nameLower.includes('poshak') || itemImage.includes('p1')) itemImage = '/images/devotional/poshak.jpg';
                        else if (nameLower.includes('mukut') || itemImage.includes('p2')) itemImage = '/images/devotional/mukut.jpg';
                        else if (nameLower.includes('bansuri') || itemImage.includes('p3')) itemImage = '/images/devotional/bansuri.jpg';
                        else if (nameLower.includes('jewel') || itemImage.includes('p4')) itemImage = '/images/devotional/jewellery.jpg';
                        else if (nameLower.includes('aasan') || itemImage.includes('p5')) itemImage = '/images/devotional/aasan.jpg';
                        else itemImage = '/images/devotional/complete_shringar.jpg';
                    }
                    return (
                      <div key={item.productId} className="p-3 bg-surface-container-low rounded-xl border border-outline/10 hover:border-secondary/40 transition-colors">
                          <div className="flex gap-3">
                              <div className="w-16 h-16 rounded-md bg-surface overflow-hidden shrink-0 border border-outline/10">
                                  <img src={itemImage} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex flex-col justify-between flex-1 overflow-hidden">
                                  <h4 className="font-bold text-primary text-sm truncate font-sans">{item.name}</h4>
                                  <div className="flex justify-between items-end mt-1">
                                      <span className="text-xs text-on-surface-variant font-medium bg-surface-container px-2 py-0.5 rounded-sm font-sans">Qty: {item.qty}</span>
                                      <span className="font-bold text-secondary text-sm font-sans">₹{item.price.toString()}</span>
                                  </div>
                              </div>
                          </div>
                      </div>
                    );
                })
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-center opacity-70">
                    <span className="material-symbols-outlined text-5xl text-outline mb-2">shopping_bag</span>
                    <p className="text-on-surface-variant text-sm font-medium font-sans">Your seva cart is empty.</p>
                </div>
            )}
         </div>

         <div className="mt-6 pt-5 border-t border-outline/20">
            <div className="flex justify-between mb-5">
               <span className="text-on-surface-variant font-medium">Subtotal</span>
               <span className="font-bold text-primary text-lg font-sans">₹{cart ? cart.itemsPrice : '0'}</span>
            </div>
            <Link href="/cart" onClick={() => setIsOpen(false)} className="w-full block text-center gold-gradient-btn text-primary-container font-bold py-3 rounded-lg shadow-md hover:-translate-y-1 transition-transform uppercase tracking-wider text-sm font-sans">
               Review Cart
            </Link>
         </div>
      </aside>
    </>
  );
}
