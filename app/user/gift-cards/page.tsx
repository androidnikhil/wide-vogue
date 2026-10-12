import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getUserAccountData } from '@/lib/actions/user.actions';
import GiftCardHub from './gift-card-hub';

export const metadata: Metadata = {
  title: 'Gift Cards & Bhakti Rewards | Madhav Shringaar',
  description: 'Manage your Bhakti loyalty rewards balance, redeem gift vouchers, or purchase auspicious seva cards.',
};

export default async function UserGiftCardsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/sign-in?callbackUrl=/user/gift-cards');
  }

  const user = await getUserAccountData();
  const bhaktiPoints = user?.bhaktiPoints || 0;
  const userName = user?.name || 'Devotee';
  const isAdmin = session.user.role === 'admin';

  return (
    <GiftCardHub 
      bhaktiPoints={bhaktiPoints} 
      userName={userName}
      userEmail={user?.email || session.user.email || ''}
      userPhone={user?.phoneNumber || ''}
      isAdmin={isAdmin}
    />
  );
}
