'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import React from 'react';
import { LayoutDashboard, Package, ShoppingCart, Users, Gift, Image as ImageIcon, Tag } from 'lucide-react';

const links = [
  {
    title: 'Overview',
    href: '/admin/overview',
    icon: LayoutDashboard,
  },
  {
    title: 'Products',
    href: '/admin/products',
    icon: Package,
  },
  {
    title: 'Orders',
    href: '/admin/orders',
    icon: ShoppingCart,
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: 'Gift Cards',
    href: '/admin/gift-cards',
    icon: Gift,
  },
  {
    title: 'Promo Codes',
    href: '/admin/coupons',
    icon: Tag,
  },
  {
    title: 'Banners',
    href: '/admin/banners',
    icon: ImageIcon,
  },
];

interface MainNavProps extends React.HTMLAttributes<HTMLElement> {
  isCollapsed?: boolean;
}

const MainNav = ({
  className,
  isCollapsed,
  ...props
}: MainNavProps) => {
  const pathname = usePathname();
  return (
    <nav
      className={cn('flex flex-col space-y-2', className)}
      {...props}
    >
      {links.map((item) => {
        const isActive = pathname.includes(item.href);
        const Icon = item.icon;
        
        return (
          <Link
            key={item.href}
            href={item.href}
            title={isCollapsed ? item.title : undefined}
            className={cn(
              'flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200',
              isActive 
                ? 'bg-primary/10 text-primary shadow-sm' 
                : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface',
              isCollapsed ? 'justify-center px-0' : 'justify-start'
            )}
          >
            <Icon className={cn('shrink-0', isActive ? 'text-primary' : 'text-on-surface-variant/70', isCollapsed ? 'h-5 w-5' : 'h-5 w-5 mr-3')} />
            {!isCollapsed && <span>{item.title}</span>}
          </Link>
        );
      })}
    </nav>
  );
};

export default MainNav;