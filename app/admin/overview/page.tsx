import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getDashboardAnalytics } from '@/lib/actions/analytics.actions';
import { getOrderSummary } from '@/lib/actions/order.actions';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { BadgeIndianRupee, CreditCard, Users, ShoppingBag } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import Charts from './charts';
import { requireAdmin } from '@/lib/auth-guard';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
};

const AdminOverviewPage = async () => {
  await requireAdmin();

  const analytics = await getDashboardAnalytics();
  const summary = await getOrderSummary(); // We use the existing one for latest sales

  return (
    <div className='space-y-6'>
      <h1 className='text-3xl font-display-lg text-primary font-bold'>Dashboard Analytics</h1>
      
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
        <Card className="shadow-sm border-secondary/20 rounded-2xl bg-surface-container-lowest">
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Revenue</CardTitle>
            <BadgeIndianRupee className="text-secondary" />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-primary'>
              {formatCurrency(analytics.totals.totalRevenue.toString())}
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-secondary/20 rounded-2xl bg-surface-container-lowest">
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Orders</CardTitle>
            <CreditCard className="text-secondary" />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-primary'>
              {analytics.totals.totalOrders}
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-secondary/20 rounded-2xl bg-surface-container-lowest">
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Customers</CardTitle>
            <Users className="text-secondary" />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-primary'>
              {analytics.totals.totalUsers}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-secondary/20 rounded-2xl bg-surface-container-lowest">
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Products Sold</CardTitle>
            <ShoppingBag className="text-secondary" />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-primary'>
              {analytics.topProducts.reduce((sum, p) => sum + p.qty, 0)}+
            </div>
          </CardContent>
        </Card>
      </div>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-7'>
        <Card className='col-span-4 shadow-sm border-secondary/20 rounded-2xl'>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Monthly sales performance</CardDescription>
          </CardHeader>
          <CardContent>
            <Charts data={{ salesData: analytics.monthlyRevenue, categoryData: analytics.categoryRevenue }} />
          </CardContent>
        </Card>
        
        <Card className='col-span-3 shadow-sm border-secondary/20 rounded-2xl'>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>Most popular items by quantity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topProducts.map((product, idx) => (
                <div key={idx} className="flex items-center justify-between border-b border-outline-variant/20 pb-2 last:border-0">
                  <div className="space-y-1 truncate pr-4">
                    <p className="text-sm font-medium leading-none truncate">{product.name}</p>
                  </div>
                  <div className="font-bold text-secondary">
                    {product.qty} sold
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-secondary/20 rounded-2xl">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>BUYER</TableHead>
                <TableHead>DATE</TableHead>
                <TableHead>TOTAL</TableHead>
                <TableHead>ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summary.latestSales.map((order) => (
                <TableRow key={order.id} className="hover:bg-surface-container/50 transition-colors">
                  <TableCell className="font-medium">
                    {order.user?.name ? order.user.name : 'Guest user'}
                  </TableCell>
                  <TableCell className="text-on-surface-variant">
                    {formatDateTime(order.createdAt).dateOnly}
                  </TableCell>
                  <TableCell className="font-semibold">{formatCurrency(order.totalPrice.toString())}</TableCell>
                  <TableCell>
                    <Link href={`/admin/orders/${order.id}`}>
                      <span className='px-3 py-1.5 text-xs font-medium text-white bg-primary rounded-md shadow-sm hover:bg-primary/90 transition-all'>Details</span>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverviewPage;