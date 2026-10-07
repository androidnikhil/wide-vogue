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

const UserButton = async () => {
  const session = await auth();

  if (!session) {
    return (
      <Button asChild>
        <Link href='/sign-in'>
          <UserIcon /> Sign In
        </Link>
      </Button>
    );
  }

  const firstInitial = session.user?.name?.charAt(0).toUpperCase() ?? 'U';

  return (
    <div className='flex gap-2 items-center'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='relative w-9 h-9 rounded-full flex items-center justify-center bg-primary text-on-primary hover:bg-primary/90 transition shadow-sm outline-none'
          >
            {firstInitial}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className='w-56 bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-lg mt-2 p-1 z-50' 
          align='end' 
          forceMount
        >
          <DropdownMenuLabel className='font-normal p-2'>
            <div className='flex flex-col space-y-1'>
              <div className='text-sm font-semibold text-on-surface'>
                {session.user?.name}
              </div>
              <div className='text-xs text-on-surface-variant leading-none'>
                {session.user?.email}
              </div>
            </div>
          </DropdownMenuLabel>
          
          <div className="h-px bg-outline-variant/30 my-1"></div>

          <DropdownMenuItem className="p-0 cursor-pointer rounded-lg hover:bg-surface-container transition-colors outline-none focus:bg-surface-container">
            <Link href='/user/profile' className='w-full px-3 py-2 text-sm text-on-surface'>
             Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="p-0 cursor-pointer rounded-lg hover:bg-surface-container transition-colors outline-none focus:bg-surface-container">
            <Link href='/user/orders' className='w-full px-3 py-2 text-sm text-on-surface'>
              Orders
            </Link>
          </DropdownMenuItem>

          {session?.user?.role === 'admin' && (
            <DropdownMenuItem className="p-0 cursor-pointer rounded-lg hover:bg-surface-container transition-colors outline-none focus:bg-surface-container">
              <Link href='/admin/overview' className='w-full px-3 py-2 text-sm text-on-surface'>
                Admin Dashboard
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
                Sign Out
              </Button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserButton;