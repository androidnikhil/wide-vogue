'use client';

import { useState } from 'react';
import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';
import MainNav from '@/app/admin/main-nav';
import AdminSearch from '@/components/admin/admin-search';
import AdminMobileMenu from '@/components/admin/admin-mobile-menu';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

export default function AdminShell({
  children,
  userButton,
}: {
  children: React.ReactNode;
  userButton: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-surface-container-lowest">
      {/* Sidebar Navigation (Desktop) */}
      <aside
        className={`hidden md:flex flex-col fixed inset-y-0 z-20 bg-surface border-r border-outline-variant/30 transition-all duration-300 shadow-sm ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="h-20 flex items-center justify-between border-b border-outline-variant/30 px-4 shrink-0">
          {!isCollapsed && (
            <Link href="/" className="flex items-center justify-center w-full">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCz1Fv3CrZlOOVgVq0caDYsVbk_a77C6oy6RTPfvK0_-SsHGjfQhX_4LXSy1W2MlwTdBwzc9Hkxd6hQjg_ljscUAOXCXwDveuh30AWjxZr1NBOiWHB-7hQR7AheTAFjlwGxn9gJCxthYw7srh8HwtwuPmK_fuXdbFmGvicsRGakLpVI9Vvf4JoGRKDImPg7xo9sEne6tQA-UxJ9hwedwyvBoKKBdbeEB9hu_70_JoTV8qok-ZeyTDt4xCNZQD8nfNqrmQ"
                className="h-16 w-auto object-contain"
                alt={APP_NAME}
              />
            </Link>
          )}
          {isCollapsed && (
            <Link href="/" className="flex items-center justify-center w-full">
               <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCz1Fv3CrZlOOVgVq0caDYsVbk_a77C6oy6RTPfvK0_-SsHGjfQhX_4LXSy1W2MlwTdBwzc9Hkxd6hQjg_ljscUAOXCXwDveuh30AWjxZr1NBOiWHB-7hQR7AheTAFjlwGxn9gJCxthYw7srh8HwtwuPmK_fuXdbFmGvicsRGakLpVI9Vvf4JoGRKDImPg7xo9sEne6tQA-UxJ9hwedwyvBoKKBdbeEB9hu_70_JoTV8qok-ZeyTDt4xCNZQD8nfNqrmQ"
                className="h-12 w-auto object-contain opacity-80"
                alt={APP_NAME}
              />
            </Link>
          )}
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-3 custom-scrollbar">
          <MainNav isCollapsed={isCollapsed} />
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isCollapsed ? 'md:ml-20' : 'md:ml-64'
        }`}
      >
        {/* Top Header */}
        <header className="h-20 border-b border-outline-variant/30 bg-surface/80 backdrop-blur-md flex items-center px-4 justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <AdminMobileMenu>{userButton}</AdminMobileMenu>
            
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:flex items-center justify-center w-8 h-8 rounded-md text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
            </button>
            
            <h1 className="text-lg font-bold text-primary hidden sm:block">Admin Portal</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="w-48 md:w-64">
               <AdminSearch />
            </div>
            {/* User Button Moved to Top Header! */}
            <div className="pl-2 border-l border-outline-variant/50 hidden md:block">
              {userButton}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-surface-container-lowest">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
