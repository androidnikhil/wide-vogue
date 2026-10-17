import { Metadata } from 'next';
import { prisma } from '@/db/prisma';
import BannerList from './banner-list';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Manage Banners',
};

const BannersPage = async () => {
  let banners: any[] = [];
  try {
    banners = await prisma.banner.findMany({
      orderBy: { position: 'asc' },
    });
  } catch (error) {
    console.error('Failed to load banners:', error);
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-bold tracking-tight'>Banners CMS</h2>
        <Button asChild>
          <Link href="/admin/banners/new">
            <Plus className="w-4 h-4 mr-2" /> Add Banner
          </Link>
        </Button>
      </div>
      <BannerList banners={banners} />
    </div>
  );
};

export default BannersPage;
