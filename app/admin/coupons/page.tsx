import { auth } from '@/auth';
import { prisma } from '@/db/prisma';
import { formatDateTime, formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata = {
  title: 'Admin - Coupons',
};

export default async function AdminCouponsPage() {
  const session = await auth();
  if (session?.user?.role !== 'admin') {
    return <div className="p-8">Unauthorized</div>;
  }

  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="h2-bold text-primary">Coupons</h1>
      </div>
      
      <div className="overflow-x-auto bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-surface-container border-b border-outline-variant/30">
            <tr>
              <th className="p-4 font-semibold">CODE</th>
              <th className="p-4 font-semibold">TYPE</th>
              <th className="p-4 font-semibold">VALUE</th>
              <th className="p-4 font-semibold">STATUS</th>
              <th className="p-4 font-semibold">USES</th>
              <th className="p-4 font-semibold">CREATED AT</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon.id} className="border-b border-outline-variant/20 hover:bg-surface transition-colors">
                <td className="p-4 font-bold text-primary">{coupon.code}</td>
                <td className="p-4 capitalize">{coupon.discountType}</td>
                <td className="p-4 font-medium">
                  {coupon.discountType === 'percentage' 
                    ? `${coupon.discountValue}%` 
                    : formatCurrency(coupon.discountValue.toString())}
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${coupon.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {coupon.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-4">{coupon.currentUses} {coupon.maxUses ? `/ ${coupon.maxUses}` : ''}</td>
                <td className="p-4">{formatDateTime(coupon.createdAt).dateOnly}</td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-on-surface-variant">
                  No coupons found. You can add them directly in your database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
