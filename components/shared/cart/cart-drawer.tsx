"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CartDrawer({ children }: { children: React.ReactNode }) {
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
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Drawer */}
      <div className="relative w-full max-w-md h-full bg-[#FBF7EE] shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-[#0F6F74]/10 bg-white">
          <h2 className="text-2xl font-serif font-bold text-[#003020]">Your Seva Cart</h2>
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-[#E8F3EE] rounded-full transition-colors text-[#003020]">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
        
        <div className="p-6 bg-white border-t border-[#0F6F74]/10">
          <Link href="/cart" onClick={() => setIsOpen(false)} className="block w-full bg-[#003020] text-white text-center py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
            Review Cart
          </Link>
        </div>
      </div>
    </div>
  );
}