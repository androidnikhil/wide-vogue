'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signInDefaultValues } from '@/lib/constants';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { signInWithCredentials } from '@/lib/actions/user.actions';
import { useSearchParams, useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Firebase
import { auth as firebaseAuth } from '@/lib/firebase';
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  signInWithPopup, 
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  ConfirmationResult
} from 'firebase/auth';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';

const CredentialsSignInForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  // Email Auth State
  const [isEmailPending, setIsEmailPending] = useState(false);

  // Phone Auth State
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  useEffect(() => {
    // Standard robust initialization
    if (typeof window !== 'undefined' && !recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current = new RecaptchaVerifier(firebaseAuth, 'recaptcha-container', {
        size: 'invisible',
      });
    }
  }, []);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return toast.error("Please enter a valid phone number");
    
    setIsSendingOtp(true);
    try {
      const cleanPhone = phoneNumber.replace(/\\D/g, '');
      const formattedPhone = `+91${cleanPhone.slice(-10)}`; // guarantee strictly 10 digits
      
      const appVerifier = recaptchaVerifierRef.current;
      if (!appVerifier) {
        toast.error("Security check not ready. Please refresh.");
        return;
      }
      
      const confirmation = await signInWithPhoneNumber(firebaseAuth, formattedPhone, appVerifier);
      setConfirmationResult(confirmation);
      toast.success("OTP sent to your phone!");
    } catch (error: any) {
      console.error(error);
      
      if (error.code === 'auth/billing-not-enabled') {
        toast.error("Billing not enabled in Firebase. Please enable Blaze plan.");
      } else if (error.code === 'auth/invalid-app-credential') {
        toast.error("Verification failed. Please try clicking Send OTP again.");
      } else {
        toast.error(error.message || "Failed to send OTP");
      }
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !confirmationResult) return;

    setIsVerifyingOtp(true);
    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;
      const idToken = await user.getIdToken();
      
      const response = await signIn('firebase', {
        idToken,
        redirect: false,
        callbackUrl
      });

      if (response?.error) {
        toast.error("Authentication failed. Please try again.");
      } else {
        router.push(callbackUrl);
      }
    } catch (error: any) {
      console.error(error);
      toast.error("Invalid OTP. Please try again.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(firebaseAuth, provider);
      const idToken = await result.user.getIdToken();

      const response = await signIn('firebase', {
        idToken,
        redirect: false,
        callbackUrl
      });

      if (response?.error) {
        toast.error("Authentication failed.");
      } else {
        router.push(callbackUrl);
      }
    } catch (error: any) {
      console.error(error);
      toast.error("Google Sign In was cancelled or failed.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    setIsEmailPending(true);
    try {
      const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
      const idToken = await userCredential.user.getIdToken();
      
      const response = await signIn('firebase', {
        idToken,
        redirect: false,
        callbackUrl
      });

      if (response?.error) {
        toast.error("Authentication failed. Please try again.");
      } else {
        router.push(callbackUrl);
      }
    } catch (error: any) {
      console.error(error);
      if (error.code === 'auth/invalid-credential') {
        toast.error("Invalid email or password");
      } else {
        toast.error("Failed to sign in. Please try again.");
      }
    } finally {
      setIsEmailPending(false);
    }
  };

  return (
    <div className='space-y-6'>
      <div id="recaptcha-container"></div>
      <Tabs defaultValue="phone" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="phone">Login using Number</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
        </TabsList>

        {/* PHONE TAB */}
        <TabsContent value="phone">
          {!confirmationResult ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <Label htmlFor='phoneNumber'>Phone Number</Label>
                <div className="flex mt-2">
                  <div className="flex items-center justify-center px-3 border border-r-0 border-input bg-muted rounded-l-md text-sm text-muted-foreground">
                    +91
                  </div>
                  <Input
                    id='phoneNumber'
                    type='tel'
                    placeholder="9876543210"
                    className="rounded-l-none"
                    value={phoneNumber}
                    maxLength={10}
                    pattern="[6-9][0-9]{9}"
                    title="Please enter a valid 10-digit Indian mobile number"
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, ''); // only allow digits
                      setPhoneNumber(val);
                    }}
                    required
                  />
                </div>
              </div>
              <Button type="submit" disabled={isSendingOtp} className='w-full'>
                {isSendingOtp ? 'Sending OTP...' : 'Send OTP'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <Label htmlFor='otp'>Enter OTP</Label>
                <Input
                  id='otp'
                  type='text'
                  placeholder="123456"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  required
                />
              </div>
              <Button type="submit" disabled={isVerifyingOtp} className='w-full'>
                {isVerifyingOtp ? 'Verifying...' : 'Verify OTP'}
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setConfirmationResult(null)} 
                className='w-full'
              >
                Use a different number
              </Button>
            </form>
          )}
        </TabsContent>
        
        {/* EMAIL TAB */}
        <TabsContent value="email">
          <form onSubmit={handleEmailSignIn}>
            <input type='hidden' name='callbackUrl' value={callbackUrl} />
            <div className='space-y-4'>
              <div>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  name='email'
                  type='email'
                  required
                  autoComplete='email'
                  defaultValue={signInDefaultValues.email}
                />
              </div>
              <div>
                <div className="flex justify-between items-center">
                  <Label htmlFor='password'>Password</Label>
                  <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative mt-2">
                  <Input
                    id='password'
                    name='password'
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete='password'
                    defaultValue={signInDefaultValues.password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <Button disabled={isEmailPending} className='w-full' variant='default' type="submit">
                  {isEmailPending ? 'Signing In...' : 'Sign In with Email'}
                </Button>
              </div>
            </div>
          </form>
        </TabsContent>

      </Tabs>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-muted-foreground/20" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <Button 
        type="button" 
        variant="outline" 
        className="w-full flex gap-2" 
        onClick={handleGoogleSignIn}
        disabled={isGoogleLoading}
      >
        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
        {isGoogleLoading ? 'Connecting...' : 'Google'}
      </Button>

      <div className='text-sm text-center text-muted-foreground'>
        Don&apos;t have an account?{' '}
        <Link href='/sign-up' target='_self' className='link'>
          Sign Up
        </Link>
      </div>
    </div>
  );
};

// Add global type for window.recaptchaVerifier
declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}

export default CredentialsSignInForm;