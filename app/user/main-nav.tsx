'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import React from 'react';

const links = [
  {
    title: 'Account Hub',
    href: '/user',
    exact: true,
  },
  {
    title: 'Orders',
    href: '/user/orders',
  },
  {
    title: 'Saved Addresses',
    href: '/user/addresses',
  },
  {
    title: 'Profile',
    href: '/user/profile',
  },
  {
    title: 'Payments',
    href: '/user/payments',
  },
  {
    title: 'Gift Cards & Rewards',
    href: '/user/gift-cards',
  },
];

const MainNav = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
  const pathname = usePathname();
  return (
    <nav
      className={cn('flex items-center space-x-3 lg:space-x-5 overflow-x-auto py-1 scrollbar-none', className)}
      {...props}
    >
      {links.map((item) => {
        const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'text-xs lg:text-sm font-medium transition-colors whitespace-nowrap px-2.5 py-1.5 rounded-lg hover:text-[#003020] hover:bg-neutral-100',
              isActive 
                ? 'text-[#003020] bg-neutral-100 font-semibold shadow-xs' 
                : 'text-neutral-500'
            )}
          >
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
};

export default MainNav;