import { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth-guard';
import { getAllGiftCards, deleteGiftCard } from '@/lib/actions/giftcard.actions';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import DeleteDialog from '@/components/shared/delete-dialog';
import Pagination from '@/components/shared/pagination';
import GiftCardGenerator from '@/components/admin/gift-card-generator';
import ShareGiftCardModal from '@/components/admin/share-gift-card-modal';
import Link from 'next/link';
import CopyButton from '@/components/shared/copy-button';

export const metadata: Metadata = {
  title: 'Admin Gift Cards',
};

const AdminGiftCardsPage = async (props: {
  searchParams: Promise<{
    page: string;
    query: string;
  }>;
}) => {
  await requireAdmin();

  const { page = '1', query: searchText } = await props.searchParams;

  const giftcards = await getAllGiftCards({ page: Number(page), query: searchText });

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-display-lg text-primary font-bold'>Gift Cards</h1>
      </div>
      
      {/* Generator Component */}
      <GiftCardGenerator />

      <div className='bg-surface shadow-md rounded-2xl border border-secondary/10 overflow-hidden'>
        <Table>
          <TableHeader className="bg-surface-container/50">
            <TableRow>
              <TableHead>CODE</TableHead>
              <TableHead>BALANCE / VALUE</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead>USAGE HISTORY</TableHead>
              <TableHead>CREATED</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {giftcards.data.map((gc: any) => {
              const balanceNum = Number(gc.balance);
              const initialNum = Number(gc.initialValue);
              const isFullyRedeemed = balanceNum <= 0;
              const isPartiallyUsed = balanceNum > 0 && balanceNum < initialNum;
              const ordersList = gc.orders || (gc.usedOrderId ? [{ id: gc.usedOrderId, createdAt: gc.usedAt }] : []);

              return (
                <TableRow key={gc.id} className="hover:bg-surface-container-lowest">
                  <TableCell className="font-medium font-mono text-primary">
                    <div className="flex items-center gap-1.5">
                      <span>{gc.code}</span>
                      <CopyButton text={gc.code} title="Copy Gift Card Code" size="xs" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className={`font-bold ${isFullyRedeemed ? 'text-muted-foreground line-through' : 'text-primary'}`}>
                        {formatCurrency(gc.balance)}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        Initial: {formatCurrency(gc.initialValue)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {isFullyRedeemed ? (
                      <Badge variant='outline' className="bg-slate-100 text-slate-700 border-slate-300">Fully Redeemed</Badge>
                    ) : isPartiallyUsed ? (
                      <Badge className="bg-amber-600 hover:bg-amber-700 text-white border-none whitespace-nowrap">
                        Partially Used ({formatCurrency(gc.balance)} left)
                      </Badge>
                    ) : gc.isActive ? (
                      <Badge className="bg-emerald-700 hover:bg-emerald-800 text-white border-none">Active (Unused)</Badge>
                    ) : (
                      <Badge variant='destructive'>Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {ordersList.length > 0 ? (
                      <div className="flex flex-col gap-1 max-w-[220px]">
                        <span className="text-xs font-semibold text-slate-700">
                          Redeemed in {ordersList.length} order{ordersList.length > 1 ? 's' : ''}:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {ordersList.map((ord: any) => (
                            <Link
                              key={ord.id}
                              href={`/admin/orders/${ord.id}`}
                              className="inline-flex items-center text-[11px] font-mono font-medium text-primary hover:underline bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200"
                            >
                              OD#{ord.id.replace(/-/g, '').slice(0, 8).toUpperCase()}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">Unused (Reusable Balance)</span>
                    )}
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <ShareGiftCardModal giftCard={gc} />
                    <DeleteDialog id={gc.id} action={deleteGiftCard} />
                  </TableCell>
                </TableRow>
              );
            })}
            {giftcards.data.length === 0 && (
                <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        No gift cards found. Generate one above.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {giftcards.totalPages > 1 && (
        <Pagination page={Number(page) || 1} totalPages={giftcards?.totalPages} />
      )}
    </div>
  );
};

export default AdminGiftCardsPage;
