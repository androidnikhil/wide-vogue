'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signInDefaultValues } from '@/lib/constants';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { signInWithCredentials } from '@/lib/actions/user.actions';
import { useSearchParams, useRouter } from 'next/navigation';
import { Eye, EyeOff, ShieldAlert, Lock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  checkLoginLockout,
  recordFailedLogin,
  clearLoginAttempts,
  type LockoutCheckResult,
} from '@/lib/actions/auth-limiter.actions';

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
  const [lockoutInfo, setLockoutInfo] = useState<LockoutCheckResult | null>(null);

  // Phone Auth State
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  // Countdown timer for Resend OTP (Flipkart style)
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (confirmationResult && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [confirmationResult, resendTimer]);

  // Fully automatic silent reCAPTCHA refresher
  const initOrRefreshRecaptcha = () => {
    if (typeof window === 'undefined') return null;

    try {
      // 1. Safely clear any existing verifier instance
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
        } catch (clearErr) {
          console.warn('Recaptcha instance clear warning:', clearErr);
        }
        recaptchaVerifierRef.current = null;
      }

      // 2. Wipe DOM inside the recaptcha container to prevent "already rendered" collision
      const container = document.getElementById('recaptcha-container');
      if (container) {
        container.innerHTML = '';
      }

      // 3. Reset any global grecaptcha widget if tracked
      try {
        if ((window as any).grecaptcha && typeof (window as any).grecaptcha.reset === 'function') {
          (window as any).grecaptcha.reset();
        }
      } catch (e) {}

      // 4. Create brand new RecaptchaVerifier instance
      const verifier = new RecaptchaVerifier(firebaseAuth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          console.log('reCAPTCHA successfully verified');
        },
        'expired-callback': () => {
          console.log('reCAPTCHA token expired, auto-refreshing...');
          initOrRefreshRecaptcha();
        },
      });

      recaptchaVerifierRef.current = verifier;
      return verifier;
    } catch (err: any) {
      console.error('Error initializing fresh reCAPTCHA:', err);
      return null;
    }
  };

  useEffect(() => {
    initOrRefreshRecaptcha();

    return () => {
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
        } catch (e) {}
        recaptchaVerifierRef.current = null;
      }
      const container = document.getElementById('recaptcha-container');
      if (container) container.innerHTML = '';
    };
  }, []);

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      return toast.error("Please enter a valid 10-digit Indian mobile number");
    }
    
    setIsSendingOtp(true);
    try {
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      const formattedPhone = `+91${cleanPhone.slice(-10)}`; // strictly 10 digits
      
      // 1. Check if phone number is locked out
      const phoneLockout = await checkLoginLockout(`phone:${cleanPhone}`);
      if (phoneLockout.isLocked) {
        toast.error(phoneLockout.message || 'Account temporarily locked for 1 hour.', { duration: 6000 });
        setIsSendingOtp(false);
        return;
      }

      // Ensure clean, fresh verifier so stale/consumed tokens never poison the request
      let appVerifier = recaptchaVerifierRef.current;
      if (!appVerifier) {
        appVerifier = initOrRefreshRecaptcha();
      }
      
      if (!appVerifier) {
        toast.error("Security verification initializing. Retrying...");
        appVerifier = initOrRefreshRecaptcha();
        if (!appVerifier) {
          throw new Error("Unable to initialize security check. Please click refresh.");
        }
      }
      
      const confirmation = await signInWithPhoneNumber(firebaseAuth, formattedPhone, appVerifier);
      setConfirmationResult(confirmation);
      setResendTimer(30);
      setCanResend(false);
      toast.success("OTP sent to your phone!");
    } catch (error: any) {
      console.error('Phone OTP error:', error);
      
      // Auto-refresh reCAPTCHA immediately on error so the very next attempt succeeds
      initOrRefreshRecaptcha();

      if (error.code === 'auth/captcha-check-failed' || error.message?.includes('Hostname match not found')) {
        toast.error("Domain Authorization: Please ensure madhavshringaar.com and localhost are authorized in Firebase Console.", {
          duration: 7000,
        });
      } else if (error.code === 'auth/billing-not-enabled') {
        toast.error("Firebase billing is not enabled. Please enable the Blaze plan in Firebase Console.");
      } else if (error.code === 'auth/invalid-app-credential') {
        toast.error("Security check auto-refreshed. Please click 'Send OTP' again.");
      } else if (error.code === 'auth/too-many-requests') {
        toast.error("Too many attempts. Please wait a few moments and try again.");
      } else {
        toast.error(error.message || "Failed to send OTP. Security check refreshed, please try again.");
      }
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend || isSendingOtp) return;
    setCanResend(false);
    setResendTimer(30);
    initOrRefreshRecaptcha();
    await handleSendOtp();
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !confirmationResult) return;

    const cleanPhone = phoneNumber.replace(/\D/g, '');

    // 1. Check lockout on phone
    const phoneLockout = await checkLoginLockout(`phone:${cleanPhone}`);
    if (phoneLockout.isLocked) {
      toast.error(phoneLockout.message || 'Account temporarily locked for 1 hour.', { duration: 6000 });
      return;
    }

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
        console.error("NextAuth signIn error:", response.error);
        const failRes = await recordFailedLogin(`phone:${cleanPhone}`);
        toast.error(failRes.message, { duration: 6000 });
      } else {
        await clearLoginAttempts(`phone:${cleanPhone}`);
        toast.success("Login successful!");
        window.location.href = callbackUrl;
      }
    } catch (error: any) {
      console.error('OTP confirmation error:', error);
      const failRes = await recordFailedLogin(`phone:${cleanPhone}`);
      toast.error(failRes.message || "Invalid OTP. Please try again.", { duration: 6000 });
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
        console.error("NextAuth Google signIn error:", response.error);
        toast.error("Authentication failed.");
      } else {
        toast.success("Login successful!");
        window.location.href = callbackUrl;
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
    const email = (formData.get('email') as string || '').trim().toLowerCase();
    const password = formData.get('password') as string;

    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    setIsEmailPending(true);
    try {
      // 1. Pre-check if account is locked out for 1 hour
      const lockoutCheck = await checkLoginLockout(email);
      if (lockoutCheck.isLocked) {
        setLockoutInfo(lockoutCheck);
        toast.error(lockoutCheck.message || 'Account is locked for 1 hour due to too many failed attempts.', { duration: 6000 });
        setIsEmailPending(false);
        return;
      }

      // 2. Try Firebase Auth first
      let firebaseToken: string | null = null;
      try {
        const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
        firebaseToken = await userCredential.user.getIdToken();
      } catch (fbErr: any) {
        console.log("Firebase email sign-in attempt info:", fbErr?.code);
      }

      if (firebaseToken) {
        const response = await signIn('firebase', {
          idToken: firebaseToken,
          redirect: false,
          callbackUrl
        });

        if (response?.error) {
          const failRes = await recordFailedLogin(email);
          if (failRes.isLocked) {
            setLockoutInfo(failRes);
          }
          toast.error(failRes.message, { duration: 6000 });
        } else {
          await clearLoginAttempts(email);
          setLockoutInfo(null);
          toast.success("Login successful!");
          window.location.href = callbackUrl;
        }
      } else {
        // Fallback: Check NextAuth credentials provider (for database accounts, admins, seeded users)
        const nextAuthRes = await signIn('credentials', {
          email,
          password,
          redirect: false,
          callbackUrl
        });

        if (nextAuthRes?.ok && !nextAuthRes.error) {
          await clearLoginAttempts(email);
          setLockoutInfo(null);
          toast.success("Login successful!");
          window.location.href = callbackUrl;
        } else {
          // Authentication failed for both -> Record failed attempt
          const failRes = await recordFailedLogin(email);
          if (failRes.isLocked) {
            setLockoutInfo(failRes);
          }
          toast.error(failRes.message, { duration: 6000 });
        }
      }
    } catch (error: any) {
      console.error("Sign-in error:", error);
      const failRes = await recordFailedLogin(email);
      if (failRes.isLocked) {
        setLockoutInfo(failRes);
      }
      toast.error(failRes.message || "Failed to sign in. Please try again.", { duration: 6000 });
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
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="space-y-1 text-center sm:text-left">
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Please enter the verification code we&apos;ve sent you on{' '}
                  <span className="font-bold text-primary">+91 {phoneNumber}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmationResult(null);
                      setOtp('');
                      initOrRefreshRecaptcha();
                    }}
                    className="ml-2 text-xs font-bold text-secondary hover:underline cursor-pointer inline-flex items-center"
                  >
                    Edit
                  </button>
                </p>
              </div>

              <div>
                <Input
                  id='otp'
                  type='text'
                  inputMode='numeric'
                  placeholder="• • • • • •"
                  maxLength={6}
                  value={otp}
                  autoFocus
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="text-center font-mono text-2xl font-bold tracking-[0.4em] h-13 rounded-xl border-outline-variant/60 focus-visible:ring-secondary focus-visible:border-secondary shadow-sm"
                  required
                />
                
                {/* Flipkart-Style Resend Code Timer */}
                <div className="flex justify-end mt-2">
                  {!canResend ? (
                    <span className="text-xs text-on-surface-variant font-medium">
                      Resend code in <span className="font-bold text-primary">{resendTimer}s</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={isSendingOtp}
                      className="text-xs font-bold text-secondary hover:underline cursor-pointer disabled:opacity-50"
                    >
                      {isSendingOtp ? 'Resending...' : 'Resend code'}
                    </button>
                  )}
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isVerifyingOtp || otp.length < 6} 
                className='w-full h-12 rounded-xl gold-gradient-btn text-primary-container font-label-lg font-bold shadow-md hover:scale-[1.01] transition-all disabled:opacity-50'
              >
                {isVerifyingOtp ? 'Verifying Code...' : 'Verify'}
              </Button>
            </form>
          )}
        </TabsContent>
        
        {/* EMAIL TAB */}
        <TabsContent value="email">
          {lockoutInfo?.isLocked && (
            <div className="mb-4 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm">
                <ShieldAlert className="w-5 h-5 text-destructive shrink-0" />
                <span>Account Temporarily Locked</span>
              </div>
              <p className="text-xs leading-relaxed text-destructive/90">
                {lockoutInfo.message}
              </p>
              <div className="pt-1 flex items-center justify-between text-xs">
                <span className="font-semibold text-muted-foreground">Remaining: ~{lockoutInfo.remainingMinutes || 60} mins</span>
                <Link href="/forgot-password" className="text-primary underline font-bold hover:opacity-80">
                  Reset Password
                </Link>
              </div>
            </div>
          )}
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
                  disabled={Boolean(lockoutInfo?.isLocked)}
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
                    disabled={Boolean(lockoutInfo?.isLocked)}
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
                <Button disabled={isEmailPending || Boolean(lockoutInfo?.isLocked)} className='w-full' variant='default' type="submit">
                  {isEmailPending ? 'Signing In...' : lockoutInfo?.isLocked ? 'Account Locked (1 Hour)' : 'Sign In with Email'}
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