import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getOrderById } from '@/lib/actions/order.actions';
import InvoiceClient from './invoice-client';

export const metadata: Metadata = {
  title: 'Tax Invoice | Madhav Shringaar',
  description: 'Download standard A4 tax invoice for your sacred order.',
};

export default async function InvoicePage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const session = await auth();

  const order = await getOrderById(id);
  if (!order) {
    notFound();
  }

  // Verify ownership or admin access
  const isOwner = session?.user?.id === order.userId;
  const isAdmin = session?.user?.role === 'admin';

  if (!isOwner && !isAdmin) {
    redirect(`/sign-in?callbackUrl=/order/${id}/invoice`);
  }

  return <InvoiceClient order={order} />;
}
