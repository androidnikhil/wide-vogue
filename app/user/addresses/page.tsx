import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getUserAccountData } from '@/lib/actions/user.actions';
import { ShippingAddress } from '@/types';
import ManageAddresses from './manage-addresses';

export const metadata: Metadata = {
  title: 'Manage Saved Addresses | Madhav Shringaar',
  description: 'View and manage your saved delivery addresses for sacred poshak and shringaar orders.',
};

export default async function UserAddressesPage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/sign-in?callbackUrl=/user/addresses');
  }

  const user = await getUserAccountData();

  let addresses: ShippingAddress[] = [];
  if (user && Array.isArray(user.addresses)) {
    addresses = user.addresses as unknown as ShippingAddress[];
  } else if (user?.address) {
    addresses = [user.address as unknown as ShippingAddress];
  }

  return (
    <div className="max-w-5xl mx-auto py-2">
      <ManageAddresses
        addresses={addresses}
        defaultEmail={user?.email || ''}
        defaultName={user?.name || ''}
        defaultPhone={user?.phoneNumber || ''}
      />
    </div>
  );
}
