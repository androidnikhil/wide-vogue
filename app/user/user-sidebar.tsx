'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Package, 
  User, 
  MapPin, 
  CreditCard, 
  Gift, 
  Truck, 
  Store, 
  ChevronRight,
  Menu,
  Sparkles,
  ShieldCheck,
  Heart
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

export interface UserSidebarProps {
  userName: string;
  userEmail?: string;
  bhaktiPoints?: number;
  userRole?: string;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
}

interface NavSection {
  group: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    group: 'ACCOUNT OVERVIEW',
    items: [
      {
        title: 'Account Dashboard',
        href: '/user',
        icon: LayoutDashboard,
        exact: true,
      },
    ],
  },
  {
    group: 'MY ORDERS & WISHLIST',
    items: [
      {
        title: 'Orders & Invoices',
        href: '/user/orders',
        icon: Package,
      },
      {
        title: 'Live Tracking',
        href: '/user/tracking',
        icon: Truck,
      },
      {
        title: 'My Wishlist',
        href: '/user/wishlist',
        icon: Heart,
      },
    ],
  },
  {
    group: 'ACCOUNT SETTINGS',
    items: [
      {
        title: 'Profile Information',
        href: '/user/profile',
        icon: User,
      },
      {
        title: 'Manage Addresses',
        href: '/user/addresses',
        icon: MapPin,
      },
    ],
  },
  {
    group: 'PAYMENTS & SECURITY',
    items: [
      {
        title: 'Saved Cards & UPI',
        href: '/user/payments',
        icon: CreditCard,
      },
    ],
  },
  {
    group: 'SEVA & REWARDS',
    items: [
      {
        title: 'Gift Cards & Bhakti Rewards',
        href: '/user/gift-cards',
        icon: Gift,
      },
    ],
  },
];

// Flat list for mobile pills
const flatNavItems = navSections.flatMap((s) => s.items);

export default function UserSidebar({
  userName,
  userEmail = '',
  bhaktiPoints = 0,
  userRole = 'user',
}: UserSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Compute initials
  const initials = userName
    ? userName
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'D';

  const isLinkActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  // Find active item title for mobile header bar
  const currentActive = flatNavItems.find((item) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href)
  ) || flatNavItems[0];

  const renderNavList = (onItemClick?: () => void) => (
    <div className="space-y-6">
      {navSections.map((section) => (
        <div key={section.group} className="space-y-1.5">
          <p className="px-3 text-[10px] font-bold tracking-wider text-neutral-400 uppercase">
            {section.group}
          </p>
          <div className="space-y-1">
            {section.items.map((item) => {
              const active = isLinkActive(item.href, item.exact);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onItemClick}
                  className={cn(
                    'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all group',
                    active
                      ? 'bg-[#003020] text-[#F3D98F] font-semibold shadow-xs'
                      : 'text-neutral-600 hover:text-[#003020] hover:bg-neutral-100/80'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        'w-4 h-4 transition-colors',
                        active ? 'text-[#F3D98F]' : 'text-neutral-400 group-hover:text-[#003020]'
                      )}
                    />
                    <span>{item.title}</span>
                  </div>
                  {active && <ChevronRight className="w-3.5 h-3.5 text-[#F3D98F]/80" />}
                </Link>
              );
            })}
          </div>
        </div>
      ))}

      {/* Admin Portal Quick Access */}
      {userRole === 'admin' && (
        <div className="pt-2">
          <Link
            href="/admin/overview"
            onClick={onItemClick}
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-bold bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 transition-colors shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>Admin Dashboard</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-amber-700" />
          </Link>
        </div>
      )}

      {/* Return to Temple Store link */}
      <div className="pt-4 border-t border-neutral-200/70">
        <Link
          href="/"
          onClick={onItemClick}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs text-neutral-500 hover:text-[#003020] hover:bg-neutral-100 transition-colors"
        >
          <Store className="w-4 h-4 text-neutral-400" />
          <span>Back to Temple Store</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* =========================================================================
          DESKTOP SIDEBAR (Visible on md and above)
          ========================================================================= */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 shrink-0 space-y-4">
        {/* User Greeting Card (Flipkart Style) */}
        <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#003020] to-[#0F6F74] text-[#F3D98F] flex items-center justify-center font-bold text-base shadow-xs shrink-0 border border-[#E6C16A]/50">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[11px] text-neutral-400 block font-medium">
              Hello Devotee,
            </span>
            <h3 className="font-serif font-bold text-sm text-[#003020] truncate">
              {userName}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[11px] font-semibold text-[#C88A20] flex items-center gap-1">
                <span>🪙</span> {bhaktiPoints} Points
              </span>
              {userRole === 'admin' && (
                <span className="bg-amber-100 text-amber-900 text-[9px] font-bold px-1.5 py-0.2 rounded border border-amber-300">
                  Admin
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Menu Card */}
        <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs">
          {renderNavList()}
        </div>
      </aside>

      {/* =========================================================================
          MOBILE ACCOUNT NAVIGATION (Visible on mobile screens)
          Zero horizontal scrollbars, includes quick tap drawer + smooth pills
          ========================================================================= */}
      <div className="md:hidden w-full space-y-2 mb-4">
        {/* Mobile Header Bar with Drawer Trigger */}
        <div className="bg-white p-3 rounded-2xl border border-neutral-200/80 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#003020] to-[#0F6F74] text-[#F3D98F] flex items-center justify-center font-bold text-xs shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-neutral-400 block font-medium">Viewing Section</span>
              <p className="font-semibold text-xs text-[#003020] truncate">
                {currentActive.title}
              </p>
            </div>
          </div>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-[#003020] text-[#003020] text-xs font-semibold gap-1.5 h-8 px-3"
              >
                <Menu className="w-3.5 h-3.5" />
                <span>Account Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85vw] max-w-xs p-5 bg-white overflow-y-auto">
              <SheetHeader className="text-left pb-4 border-b border-neutral-200/70">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#003020] to-[#0F6F74] text-[#F3D98F] flex items-center justify-center font-bold text-sm shrink-0">
                    {initials}
                  </div>
                  <div>
                    <SheetTitle className="font-serif text-base text-[#003020]">
                      {userName}
                    </SheetTitle>
                    <p className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
                      <span>🪙</span> {bhaktiPoints} Bhakti Points
                    </p>
                  </div>
                </div>
              </SheetHeader>
              <div className="pt-4">
                {renderNavList(() => setMobileOpen(false))}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Clean Mobile Horizontal Pill Bar (NO scrollbar visible, zero arrows) */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-1 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {flatNavItems.map((item) => {
            const active = isLinkActive(item.href, item.exact);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 transition-colors',
                  active
                    ? 'bg-[#003020] text-[#F3D98F] font-semibold shadow-xs'
                    : 'bg-white text-neutral-600 border border-neutral-200/80 hover:bg-neutral-50'
                )}
              >
                <Icon className={cn('w-3.5 h-3.5', active ? 'text-[#F3D98F]' : 'text-neutral-400')} />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
