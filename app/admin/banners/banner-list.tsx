'use client';

import { Banner } from '@prisma/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2, Edit } from 'lucide-react';
import Link from 'next/link';

export default function BannerList({ banners }: { banners: Banner[] }) {
  if (banners.length === 0) {
    return (
      <div className="text-center py-10 bg-surface-container-low rounded-xl border border-outline-variant/30">
        <p className="text-on-surface-variant mb-4">No banners found.</p>
      </div>
    );
  }

  return (
    <div className="border border-outline-variant/30 rounded-lg overflow-hidden bg-surface-container-lowest">
      <Table>
        <TableHeader>
          <TableRow className="bg-surface-container-low">
            <TableHead>Preview</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Link URL</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {banners.map((banner) => (
            <TableRow key={banner.id}>
              <TableCell>
                <img src={banner.imageUrl} alt={banner.title} className="h-12 w-24 object-cover rounded shadow-sm" />
              </TableCell>
              <TableCell className="font-medium">{banner.title}</TableCell>
              <TableCell className="text-on-surface-variant max-w-[200px] truncate">
                {banner.linkUrl || '-'}
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${banner.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {banner.isActive ? 'Active' : 'Inactive'}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/admin/banners/${banner.id}`}>
                    <Edit className="w-4 h-4" />
                  </Link>
                </Button>
                {/* Delete button logic omitted for brevity in this example */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
