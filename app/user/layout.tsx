import { APP_NAME } from '@/lib/constants';
import Image from 'next/image';
import Link from 'next/link';
import Menu from '@/components/shared/header/menu';
import MainNav from './main-nav';

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className='flex flex-col'>
        <div className='border-b container mx-auto'>
          <div className='flex items-center h-28 px-4 py-2'>
            <Link href='/' className='flex items-center gap-2 mr-8'>
              <img
                src='https://lh3.googleusercontent.com/aida-public/AB6AXuCz1Fv3CrZlOOVgVq0caDYsVbk_a77C6oy6RTPfvK0_-SsHGjfQhX_4LXSy1W2MlwTdBwzc9Hkxd6hQjg_ljscUAOXCXwDveuh30AWjxZr1NBOiWHB-7hQR7AheTAFjlwGxn9gJCxthYw7srh8HwtwuPmK_fuXdbFmGvicsRGakLpVI9Vvf4JoGRKDImPg7xo9sEne6tQA-UxJ9hwedwyvBoKKBdbeEB9hu_70_JoTV8qok-ZeyTDt4xCNZQD8nfNqrmQ'
                className='h-20 w-auto object-contain scale-125 ml-6'
                alt={APP_NAME}
              />
            </Link>
            <MainNav className='mx-6' />
            <div className='ml-auto items-center flex space-x-4'>
              <Menu />
            </div>
          </div>
        </div>

        <div className='flex-1 space-y-4 p-8 pt-6 container mx-auto'>
          {children}
        </div>
      </div>
    </>
  );
}