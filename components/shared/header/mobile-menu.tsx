'use client';

import { Menu, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import Link from 'next/link';

export default function MobileMenu() {
  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="text-primary hover:text-secondary hover:bg-transparent">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[400px] bg-surface-container-lowest">
          <SheetHeader>
            <SheetTitle className="text-left font-bold text-primary flex items-center gap-2 border-b border-outline-variant/30 pb-4">
              <span className="material-symbols-outlined text-secondary">temple_hindu</span>
              Madhav Shringaar
            </SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-4 mt-6">
            <Link href="/" className="text-lg font-medium text-on-surface hover:text-secondary">
              Home
            </Link>
            <Link href="/search?category=Poshak" className="text-lg font-medium text-on-surface hover:text-secondary">
              Poshak
            </Link>
            <Link href="/search?category=Mukut%20%26%20Bansuri" className="text-lg font-medium text-on-surface hover:text-secondary">
              Mukut & Bansuri
            </Link>
            <Link href="/search?category=Jewellery%20%26%20Mala" className="text-lg font-medium text-on-surface hover:text-secondary">
              Jewellery & Mala
            </Link>
            <Link href="/search?category=Singhasan" className="text-lg font-medium text-on-surface hover:text-secondary">
              Singhasan
            </Link>
            <Link href="/search?category=Seva%20Essentials" className="text-lg font-medium text-on-surface hover:text-secondary">
              Seva Essentials
            </Link>
            <Link href="/search?category=Festive%20Sets" className="text-lg font-medium text-secondary flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">stars</span>
              Festive Combos
            </Link>
            
            <div className="border-t border-outline-variant/30 my-4 pt-4 flex flex-col gap-4">
              <Link href="/track-order" className="text-lg font-medium text-on-surface hover:text-secondary flex items-center gap-2">
                <span className="material-symbols-outlined text-xl">local_shipping</span>
                Track Order
              </Link>
              <Link href="/wishlist" className="text-lg font-medium text-on-surface hover:text-secondary flex items-center gap-2">
                <span className="material-symbols-outlined text-xl">favorite</span>
                Wishlist
              </Link>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
