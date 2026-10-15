import { APP_NAME } from '@/lib/constants';
import Image from 'next/image';
import Link from 'next/link';
import Menu from '@/components/shared/header/menu';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getUserAccountData } from '@/lib/actions/user.actions';
import UserSidebar from './user-sidebar';

export default async function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (!session?.user) {
    redirect('/sign-in?callbackUrl=/user');
  }

  const user = await getUserAccountData();
  const userName = user?.name || session.user.name || 'Devotee';
  const userEmail = user?.email || session.user.email || '';
  const bhaktiPoints = user?.bhaktiPoints || 0;
  const userRole = session.user.role || 'user';

  return (
    <div className="min-h-screen bg-[#FAF7F0]/40 flex flex-col">
      {/* Top Header: Clean, Uncluttered, Zero Scrollbars */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 shadow-2xs">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Left: Brand Logo & Devotee Portal Subtitle */}
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 group">
                <Image
                  src="/images/logo.png"
                  width={140}
                  height={56}
                  className="h-14 w-auto object-contain group-hover:scale-102 transition-transform"
                  alt={APP_NAME}
                  priority
                />
              </Link>
              <div className="hidden sm:block border-l border-neutral-200 pl-3">
                <span className="text-[10px] uppercase font-bold text-[#C88A20] tracking-widest block">
                  Devotee Portal
                </span>
                <span className="font-serif text-xs font-semibold text-[#003020]">
                  Account Dashboard
                </span>
              </div>
            </div>

            {/* Right: Cart, Theme, User Avatar Menu */}
            <div className="flex items-center gap-3">
              <Menu />
            </div>
          </div>
        </div>
      </header>

      {/* Main Body: Flipkart-Style Sidebar + Main Content */}
      <div className="flex-1 container mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col md:flex-row gap-6 lg:gap-8 items-start">
          {/* Dedicated Left Sidebar (Desktop) / Clean Drawer & Pills (Mobile) */}
          <UserSidebar
            userName={userName}
            userEmail={userEmail}
            bhaktiPoints={bhaktiPoints}
            userRole={userRole}
          />

          {/* Right Main Content */}
          <main className="flex-1 min-w-0 w-full">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}