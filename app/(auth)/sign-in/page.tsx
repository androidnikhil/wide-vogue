import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { APP_NAME } from '@/lib/constants';
import CredentialsSignInForm from './credentials-signin-form';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Sign In',
};

const SignInPage = async (props: {
  searchParams: Promise<{
    callbackUrl: string;
  }>;
}) => {
  const { callbackUrl } = await props.searchParams;

  const session = await auth();

  if (session) {
    return redirect(callbackUrl || '/');
  }

  return (
    <div className='w-full h-screen grid grid-cols-1 md:grid-cols-2'>
      {/* Left Column - Branding */}
      <div className='hidden md:flex flex-col justify-center items-center bg-primary/5 border-r p-12 relative overflow-hidden'>
        {/* Subtle decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary via-background to-background" />
        
        <div className="relative z-10 flex flex-col items-center">
          <Link href='/'>
            <Image
              src='/images/logo.png'
              className='h-32 w-auto object-contain drop-shadow-md mb-8 hover:scale-105 transition-transform duration-300'
              alt={`${APP_NAME} logo`}
              width={240}
              height={96}
              sizes="240px"
            />
          </Link>
          <h1 className="text-4xl font-bold tracking-tight mb-4 text-center">Welcome to Madhav Shringaar</h1>
          <p className="text-muted-foreground text-center max-w-md text-lg">
            Discover premium essentials for your mystic needs at Madhav Shringaar.
          </p>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className='flex items-center justify-center p-6 md:p-12 bg-background'>
        <div className='w-full max-w-md'>
          <Card className="border-0 shadow-none md:border md:shadow-sm bg-transparent md:bg-card">
            <CardHeader className='space-y-4'>
              <div className='md:hidden flex justify-center mb-4'>
                <Link href='/'>
                  <img
                    src='/images/logo.png'
                    className='h-24 w-auto object-contain'
                    alt={`${APP_NAME} logo`}
                  />
                </Link>
              </div>
              <CardTitle className='text-center text-2xl font-bold'>Sign In</CardTitle>
              <CardDescription className='text-center'>
                Access your account
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <Suspense fallback={<div>Loading...</div>}>
                <CredentialsSignInForm />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;