import { Metadata } from 'next';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';
import ProfileForm from './profile-form';
import AddressBook from './address-book';
import { prisma } from '@/db/prisma';
import { ShippingAddress } from '@/types';
import Link from 'next/link';
import { MapPin, User, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Edit Profile & Account | Madhav Shringaar',
  description: 'Manage personal details, mobile number, and delivery preferences.',
};

const Profile = async () => {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/sign-in?callbackUrl=/user/profile');
  }

  const user = await prisma.user.findFirst({
    where: { id: session.user.id },
  });

  let savedAddresses: ShippingAddress[] = [];
  if (user && Array.isArray(user.addresses)) {
    savedAddresses = user.addresses as unknown as ShippingAddress[];
  }

  return (
    <SessionProvider session={session}>
      <div className='max-w-5xl mx-auto space-y-6 pb-12'>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs">
          <div>
            <h1 className="font-serif text-xl md:text-2xl font-bold text-[#003020] flex items-center gap-2">
              <User className="w-6 h-6 text-[#0F6F74]" />
              My Profile & Information
            </h1>
            <p className="text-xs md:text-sm text-neutral-500 mt-1">
              Update your registered contact number and details used for sacred dispatches.
            </p>
          </div>

          <Button
            asChild
            variant="outline"
            className="rounded-xl border-neutral-300 text-xs self-start sm:self-auto gap-1"
          >
            <Link href="/user/addresses">
              <MapPin className="w-3.5 h-3.5 text-[#0F6F74]" />
              Manage All Addresses
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </Button>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <div>
            <ProfileForm
              initialUser={{
                name: user?.name,
                email: user?.email,
                phoneNumber: user?.phoneNumber,
              }}
            />
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