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
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import SignUpForm from './sign-up-form';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Sign Up',
};

const SignUpPage = async (props: {
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
    <div className='w-full max-w-md mx-auto'>
      <Card>
        <CardHeader className='space-y-4'>
          <Link href='/' className='flex-center'>
            <Image
              src='/images/logo.png'
              className='h-24 w-auto object-contain'
              alt={`${APP_NAME} logo`}
              width={240}
              height={96}
              sizes="240px"
            />
          </Link>
          <CardTitle className='text-center'>Create Account</CardTitle>
          <CardDescription className='text-center'>
            Enter your information below to sign up
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <Suspense fallback={<div>Loading...</div>}>
            <SignUpForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpPage;