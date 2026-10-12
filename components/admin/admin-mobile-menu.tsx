'use client';

import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import MainNav from '@/app/admin/main-nav';
import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';
import Image from 'next/image';

export default function AdminMobileMenu({
  children
}: {
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="md:hidden flex items-center justify-center p-2 rounded-md hover:bg-surface-container transition-colors">
          <span className="material-symbols-outlined text-primary">menu</span>
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0 bg-surface border-r border-outline-variant/30 flex flex-col">
        <SheetTitle className="sr-only">Admin Navigation</SheetTitle>
        <div className='h-20 flex items-center justify-center border-b border-outline-variant/30 px-4'>
          <Link href='/' className='flex items-center justify-center w-full' onClick={() => setOpen(false)}>
            <Image
              src='/images/logo.png'
              className='h-12 w-auto object-contain'
              alt={APP_NAME}
              width={180}
              height={72}
              sizes="180px"
            />
          </Link>
        </div>
        <div className='flex-1 overflow-y-auto py-6 px-4' onClick={() => setOpen(false)}>
          <MainNav />
        </div>
        <div className='p-4 border-t border-outline-variant/30 flex justify-center'>
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}
