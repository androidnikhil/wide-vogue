'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");

    setIsSubmitting(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setIsSuccess(true);
      toast.success("Request processed successfully!");
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to send reset email. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='w-full max-w-md mx-auto mt-12'>
      <Card>
        <CardHeader className='space-y-2 text-center'>
          <CardTitle className='text-2xl font-bold'>Forgot Password</CardTitle>
          <CardDescription>
            Enter your email address and we will send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isSuccess ? (
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='john@example.com'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Note: If an account exists with this email, you will receive a password reset link.
              </p>
              <Button type='submit' className='w-full' disabled={isSubmitting}>
                {isSubmitting ? 'Sending Link...' : 'Send Reset Link'}
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="p-4 bg-green-50 text-green-700 rounded-md">
                Check your inbox! We sent a password reset link to <strong>{email}</strong>.
              </div>
            </div>
          )}
          <div className='mt-6 text-center text-sm text-muted-foreground'>
            Remembered your password?{' '}
            <Link href='/sign-in' className='text-primary hover:underline'>
              Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
