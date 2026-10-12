'use client';

import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import Link from 'next/link';

const menuSections = [
  { href: '/', label: 'Home' },
  { href: '/search?category=Poshak', label: 'Poshak' },
  { href: '/search?category=Mukut%20%26%20Bansuri', label: 'Mukut & Bansuri' },
  { href: '/search?category=Jewellery%20%26%20Mala', label: 'Jewellery & Mala' },
  { href: '/search?category=Singhasan', label: 'Singhasan' },
  { href: '/search?category=Seva%20Essentials', label: 'Seva Essentials' },
  { href: '/search?category=Festive%20Sets', label: 'Festive Combos', accent: true },
];

const utilityLinks = [
  { href: '/track-order', label: 'Track Order', icon: 'local_shipping' },
  { href: '/wishlist', label: 'Wishlist', icon: 'favorite' },
];

export default function MobileMenu() {
  return (
    <div className="md:flex lg:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-primary hover:text-secondary hover:bg-transparent">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[400px] bg-surface-container-lowest px-0">
          <SheetHeader className="px-3">
            <SheetTitle className="text-left font-bold text-primary flex items-center gap-2 border-b border-outline-variant/30 pb-3">
              <span className="material-symbols-outlined text-secondary">temple_hindu</span>
              Madhav Shringaar
            </SheetTitle>
          </SheetHeader>

          <div className="mt-4 flex flex-col">
            {menuSections.map((item) => (
              <div key={item.href} className="px-3">
                <Link
                  href={item.href}
                  className={`group block py-2 text-left ${item.accent ? 'text-secondary' : 'text-on-surface hover:text-secondary'}`}
                >
                  <span className="flex items-center gap-2 text-base font-normal">
                    {item.accent && (
                      <span className="material-symbols-outlined text-lg text-current">stars</span>
                    )}
                    {item.label}
                  </span>
                </Link>
                <div className="h-px w-full bg-[#C2A66A]/45" />
              </div>
            ))}

            <div className="mt-3 px-3">
              {utilityLinks.map((item) => (
                <div key={item.href}>
                  <Link
                    href={item.href}
                    className="group block py-1.5 text-left text-on-surface hover:text-secondary"
                  >
                    <span className="flex items-center gap-2 text-base font-normal">
                      <span className="material-symbols-outlined text-xl text-current">{item.icon}</span>
                      {item.label}
                    </span>
                  </Link>
                  <div className="h-px w-full bg-[#C2A66A]/45" />
                </div>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
