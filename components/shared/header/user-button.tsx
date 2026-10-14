import Link from 'next/link';
import { auth } from '@/auth';
import { signOutUser } from '@/lib/actions/user.actions';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserIcon } from 'lucide-react';
import { getServerTranslations } from '@/lib/i18n/server';
import { isDummyPhoneEmail } from '@/lib/constants';

const UserButton = async () => {
  const session = await auth();
  const { t } = await getServerTranslations();

  if (!session) {
    return (
      <Button asChild>
        <Link href='/sign-in'>
          <UserIcon /> {t.header.signIn}
        </Link>
      </Button>
    );
  }

  const rawName = session.user?.name?.trim();
  const isNumeric = Boolean(rawName && /^\+?\d{7,15}$/.test(rawName.replace(/\s+/g, '')));
  const hasRealName = Boolean(rawName && rawName !== 'NO_NAME' && !isNumeric);

  const firstInitial = hasRealName && rawName ? rawName.charAt(0).toUpperCase() : null;
  const displayName = hasRealName ? rawName : t.header.devotee;

  const userEmail = session.user?.email && !isDummyPhoneEmail(session.user.email)
    ? session.user.email
    : null;

  const userPhone = (session.user as any)?.phoneNumber as string | undefined;

  // Profile is complete if devotee has a real name and at least one contact channel (phone or email)
  const isProfileComplete = hasRealName && Boolean(userPhone || userEmail);

  return (
    <div className='flex gap-2 items-center'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            aria-label='User account menu'
            className='relative w-9 h-9 rounded-full flex items-center justify-center bg-primary text-on-primary hover:bg-primary/90 transition shadow-sm outline-none'
          >
            {firstInitial ? (
              <span className='font-semibold text-sm'>{firstInitial}</span>
            ) : (
              <UserIcon className='w-4 h-4 text-on-primary' />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className='w-60 bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-lg mt-2 p-1 z-50' 
          align='end' 
          forceMount
        >
          <DropdownMenuLabel className='font-normal p-2.5'>
            <div className='flex flex-col space-y-1'>
              <div className='text-sm font-semibold text-on-surface flex items-center gap-1.5'>
                <span>{displayName}</span>
                {isProfileComplete && (
                  <span className='text-[10px] bg-emerald-100 text-emerald-800 font-medium px-1.5 py-0.2 rounded-full'>
                    {t.header.verified}
                  </span>
                )}
              </div>
              
              {userEmail && (
                <div className='text-xs text-on-surface-variant leading-none truncate'>
                  {userEmail}
                </div>
              )}

              {userPhone && (
                <div className='text-xs text-on-surface-variant leading-none font-sans'>
                  +91 {userPhone.length === 10 ? `${userPhone.slice(0, 5)} ${userPhone.slice(5)}` : userPhone}
                </div>
              )}

              {!isProfileComplete && (
                <div className='pt-1'>
                  <Link 
                    href='/user/profile' 
                    className='text-xs text-primary font-medium hover:underline inline-flex items-center gap-1'
                  >
                    <span>{t.header.completeProfile}</span>
                    <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                  </Link>
                </div>
              )}
            </div>
          </DropdownMenuLabel>
          
          <div className="h-px bg-outline-variant/30 my-1"></div>

          <DropdownMenuItem className="p-0 cursor-pointer rounded-lg hover:bg-surface-container transition-colors outline-none focus:bg-surface-container">
            <Link href='/user' className='w-full px-3 py-2 text-sm text-on-surface flex items-center justify-between'>
              <span>{t.header.myAccount}</span>
              <span className="text-[10px] bg-[#E6C16A]/30 text-[#8A5A0A] font-semibold px-1.5 py-0.5 rounded">Hub</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="p-0 cursor-pointer rounded-lg hover:bg-surface-container transition-colors outline-none focus:bg-surface-container">
            <Link href='/user/orders' className='w-full px-3 py-2 text-sm text-on-surface'>
              {t.header.ordersTracking}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="p-0 cursor-pointer rounded-lg hover:bg-surface-container transition-colors outline-none focus:bg-surface-container">
            <Link href='/wishlist' className='w-full px-3 py-2 text-sm text-on-surface'>
              {t.header.wishlist}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="p-0 cursor-pointer rounded-lg hover:bg-surface-container transition-colors outline-none focus:bg-surface-container">
            <Link href='/user/addresses' className='w-full px-3 py-2 text-sm text-on-surface'>
              {t.header.savedAddresses}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="p-0 cursor-pointer rounded-lg hover:bg-surface-container transition-colors outline-none focus:bg-surface-container">
            <Link href='/user/gift-cards' className='w-full px-3 py-2 text-sm text-on-surface'>
              {t.header.giftCardsRewards}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="p-0 cursor-pointer rounded-lg hover:bg-surface-container transition-colors outline-none focus:bg-surface-container">
            <Link href='/user/profile' className='w-full px-3 py-2 text-sm text-on-surface'>
              {t.header.editProfile}
            </Link>
          </DropdownMenuItem>

          {session?.user?.role === 'admin' && (
            <DropdownMenuItem className="p-0 cursor-pointer rounded-lg hover:bg-surface-container transition-colors outline-none focus:bg-surface-container">
              <Link href='/admin/overview' className='w-full px-3 py-2 text-sm text-on-surface'>
                {t.header.adminDashboard}
              </Link>
            </DropdownMenuItem>
          )}

          <div className="h-px bg-outline-variant/30 my-1"></div>

          <DropdownMenuItem className='p-0 cursor-pointer rounded-lg hover:bg-error-container hover:text-on-error-container transition-colors outline-none focus:bg-error-container'>
            <form action={signOutUser} className='w-full'>
              <Button
                className='w-full py-2 px-3 h-auto justify-start text-sm font-normal text-error hover:text-on-error-container hover:bg-transparent'
                variant='ghost'
              >
                {t.header.signOut}
              </Button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserButton;