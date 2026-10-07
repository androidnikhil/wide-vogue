import { Metadata } from 'next';
import { auth } from '@/auth';
import { SessionProvider } from 'next-auth/react';
import ProfileForm from './profile-form';
import AddressBook from './address-book';
import { prisma } from '@/db/prisma';
import { ShippingAddress } from '@/types';

export const metadata: Metadata = {
  title: 'User Profile',
};

const Profile = async () => {
  const session = await auth();
  
  let savedAddresses: ShippingAddress[] = [];
  if (session?.user?.id) {
    const user = await prisma.user.findFirst({
      where: { id: session.user.id },
    });
    if (user && Array.isArray(user.addresses)) {
      savedAddresses = user.addresses as ShippingAddress[];
    }
  }

  return (
    <SessionProvider session={session}>
      <div className='max-w-4xl mx-auto space-y-4'>
        <h2 className='h2-bold'>Profile</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div>
            <ProfileForm />
          </div>
          <div>
            <AddressBook addresses={savedAddresses} />
          </div>
        </div>
      </div>
    </SessionProvider>
  );
};

export default Profile;