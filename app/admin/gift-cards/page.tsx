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
              <TableHead>BALANCE</TableHead>
              <TableHead>INITIAL</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead>CREATED</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {giftcards.data.map((gc: any) => (
              <TableRow key={gc.id} className="hover:bg-surface-container-lowest">
                <TableCell className="font-medium font-mono text-primary">{gc.code}</TableCell>
                <TableCell>{formatCurrency(gc.balance)}</TableCell>
                <TableCell className="text-muted-foreground">{formatCurrency(gc.initialValue)}</TableCell>
                <TableCell>
                  {gc.isActive && Number(gc.balance) > 0 ? (
                    <Badge variant='secondary'>Active</Badge>
                  ) : (
                    <Badge variant='destructive'>Empty/Inactive</Badge>
                  )}
                </TableCell>
                <TableCell>{formatDateTime(gc.createdAt).dateOnly}</TableCell>
                <TableCell className="flex gap-2">
                  <ShareGiftCardModal giftCard={gc} />
                  <DeleteDialog id={gc.id} action={deleteGiftCard} />
                </TableCell>
              </TableRow>
            ))}
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
