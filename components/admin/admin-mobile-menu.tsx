'use client';

import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import MainNav from '@/app/admin/main-nav';
import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';

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
            <img
              src='https://lh3.googleusercontent.com/aida-public/AB6AXuCz1Fv3CrZlOOVgVq0caDYsVbk_a77C6oy6RTPfvK0_-SsHGjfQhX_4LXSy1W2MlwTdBwzc9Hkxd6hQjg_ljscUAOXCXwDveuh30AWjxZr1NBOiWHB-7hQR7AheTAFjlwGxn9gJCxthYw7srh8HwtwuPmK_fuXdbFmGvicsRGakLpVI9Vvf4JoGRKDImPg7xo9sEne6tQA-UxJ9hwedwyvBoKKBdbeEB9hu_70_JoTV8qok-ZeyTDt4xCNZQD8nfNqrmQ'
              className='h-12 w-auto object-contain'
              alt={APP_NAME}
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
