import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getUserAccountData } from '@/lib/actions/user.actions';
import ManagePaymentsClient from './manage-payments-client';

export const metadata: Metadata = {
  title: 'Saved Payment Methods & Cards | Madhav Shringaar',
  description: 'Manage saved credit/debit cards and UPI IDs with 256-bit bank-grade encryption and RBI compliant security.',
};

export default async function UserPaymentsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/sign-in?callbackUrl=/user/payments');
  }

  const user = await getUserAccountData();
  const savedCards = Array.isArray(user?.savedCards) ? (user.savedCards as any[]) : [];
  const savedUpiIds = Array.isArray(user?.savedUpiIds) ? (user.savedUpiIds as any[]) : [];

  return (
    <ManagePaymentsClient
      savedCards={savedCards}
      savedUpiIds={savedUpiIds}
    />
  );
}
