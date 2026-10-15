import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth-guard';
import { getOrderById } from '@/lib/actions/order.actions';
import AdminOrderClient from './admin-order-client';

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await props.params;
  const cleanId = `OD${id.replace(/-/g, '').slice(0, 16).toUpperCase()}`;
  return {
    title: `Order ${cleanId} | Admin Portal`,
  };
}

export default async function AdminOrderDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await props.params;

  const order = await getOrderById(id);
  if (!order) notFound();

  return <AdminOrderClient order={order} />;
}
