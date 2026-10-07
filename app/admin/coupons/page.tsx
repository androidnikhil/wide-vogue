import { auth } from '@/auth';
import { prisma } from '@/db/prisma';
import { formatDateTime, formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import PromoCodeGenerator from '@/components/admin/promo-code-generator';

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

  const couponCodes = coupons.map(c => c.code);
  const usedOrders = await prisma.order.findMany({
    where: { couponCode: { in: couponCodes } },
    select: { id: true, couponCode: true }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">Promo Codes</h1>
      </div>
      
      <PromoCodeGenerator />
      
      <div className="overflow-x-auto bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-surface-container/50 border-b border-outline-variant/30">
            <tr>
              <th className="p-4 font-semibold text-sm">CODE</th>
              <th className="p-4 font-semibold text-sm">DISCOUNT</th>
              <th className="p-4 font-semibold text-sm">STATUS</th>
              <th className="p-4 font-semibold text-sm">USAGE</th>
              <th className="p-4 font-semibold text-sm">USED ON ORDERS</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => {
              const ordersForCoupon = usedOrders.filter(o => o.couponCode === coupon.code);
              
              return (
                <tr key={coupon.id} className="border-b border-outline-variant/20 hover:bg-surface transition-colors">
                  <td className="p-4 font-bold text-primary font-mono">{coupon.code}</td>
                  <td className="p-4 font-medium text-sm">
                    {coupon.discountType === 'percentage' 
                      ? `${coupon.discountValue}% Off` 
                      : `${formatCurrency(coupon.discountValue.toString())} Off`}
                  </td>
                  <td className="p-4">
                    {coupon.isActive ? (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary text-on-primary shadow-sm">Active</span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-error/10 text-error">Inactive</span>
                    )}
                  </td>
                  <td className="p-4 text-sm font-medium">
                    {ordersForCoupon.length} {coupon.maxUses ? `/ ${coupon.maxUses}` : 'uses'}
                  </td>
                  <td className="p-4">
                    {ordersForCoupon.length > 0 ? (
                      <div className="flex flex-col gap-1 max-h-24 overflow-y-auto custom-scrollbar pr-2">
                        {ordersForCoupon.map(order => (
                           <Link key={order.id} href={`/admin/orders/${order.id}`} className="text-xs font-semibold text-primary hover:underline flex items-center">
                             View Order <span className="material-symbols-outlined text-[14px] ml-1">arrow_forward</span>
                           </Link>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">Not used yet</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {coupons.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-on-surface-variant">
                  No promo codes found. You can add them directly in your database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
