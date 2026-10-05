import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table';
  import { deleteOrder, getAllOrders } from '@/lib/actions/order.actions';
  import { formatCurrency, formatDateTime, formatId } from '@/lib/utils';
  import { Metadata } from 'next';
  import { Button } from '@/components/ui/button';
  import Link from 'next/link';
  import Pagination from '@/components/shared/pagination';
  import DeleteDialog from '@/components/shared/delete-dialog';
  import { requireAdmin } from '@/lib/auth-guard';
  
  export const metadata: Metadata = {
    title: 'Admin Orders',
  };
  
  const AdminOrdersPage = async (props: {
    searchParams: Promise<{ page: string; query: string }>;
  }) => {
    const { page = '1', query: searchText } = await props.searchParams;
  
    await requireAdmin();
  
    const orders = await getAllOrders({
      page: Number(page),
      query: searchText,
    });
  
    return (
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <h1 className='text-3xl font-display-lg text-primary font-bold'>Orders</h1>
          {searchText && (
            <div>
              Filtered by <i>&quot;{searchText}&quot;</i>{' '}
              <Link href='/admin/orders'>
                <Button variant='outline' size='sm'>
                  Remove Filter
                </Button>
              </Link>
            </div>
          )}
        </div>
        <div className='bg-surface shadow-md rounded-2xl border border-secondary/10 overflow-hidden'>
          <Table>
            <TableHeader className="bg-surface-container/50">
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>DATE</TableHead>
                <TableHead>BUYER</TableHead>
                <TableHead>TOTAL</TableHead>
                <TableHead>PAID</TableHead>
                <TableHead>DELIVERED</TableHead>
                <TableHead>ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.data.map((order) => (
                <TableRow key={order.id} className="hover:bg-surface-container-lowest">
                  <TableCell className="font-medium font-mono text-primary">{formatId(order.id)}</TableCell>
                  <TableCell>
                    {formatDateTime(order.createdAt).dateTime}
                  </TableCell>
                  <TableCell>{order.user.name}</TableCell>
                  <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                  <TableCell>
                    {order.isPaid && order.paidAt
                      ? formatDateTime(order.paidAt).dateTime
                      : 'Not Paid'}
                  </TableCell>
                  <TableCell>
                    {order.isDelivered && order.deliveredAt
                      ? formatDateTime(order.deliveredAt).dateTime
                      : 'Not Delivered'}
                  </TableCell>
                  <TableCell>
                    <Button asChild variant='outline' size='sm'>
                      <Link href={`/order/${order.id}`}>Details</Link>
                    </Button>
                    <DeleteDialog id={order.id} action={deleteOrder} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
          {orders.totalPages > 1 && (
            <Pagination
              page={Number(page) || 1}
              totalPages={orders?.totalPages}
            />
          )}
      </div>
    );
  };
  
  export default AdminOrdersPage;