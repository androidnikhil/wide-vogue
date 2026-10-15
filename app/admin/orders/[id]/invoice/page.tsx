import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth-guard';
import { getOrderById } from '@/lib/actions/order.actions';
import AdminInvoiceClient from './admin-invoice-client';

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await props.params;
  const cleanId = `OD${id.replace(/-/g, '').slice(0, 16).toUpperCase()}`;
  return {
    title: `Tax Invoice ${cleanId} | Admin Portal`,
  };
}

export default async function AdminOrderInvoicePage(props: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await props.params;

  const order = await getOrderById(id);
  if (!order) notFound();

  return <AdminInvoiceClient order={order} />;
}
