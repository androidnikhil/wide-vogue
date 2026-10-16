'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signUpDefaultValues } from '@/lib/constants';
import Link from 'next/link';
import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Eye, EyeOff, Check, X, ShieldAlert, ShieldCheck, Mail, ArrowLeft, Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

import { auth as firebaseAuth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { signIn } from 'next-auth/react';
import { checkEmailAvailability } from '@/lib/actions/user.actions';
import { generateAndSendOtp, verifyOtpCode } from '@/lib/actions/otp.actions';

export default function SignUpForm() {
  const [step, setStep] = useState<'DETAILS' | 'OTP'>('DETAILS');
  const [name, setName] = useState(signUpDefaultValues.name);
  const [email, setEmail] = useState(signUpDefaultValues.email);
  const [password, setPassword] = useState(signUpDefaultValues.password);
  const [confirmPassword, setConfirmPassword] = useState(signUpDefaultValues.confirmPassword);
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  // Cooldown timer effect
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Standard password rules evaluation
  const passwordCriteria = useMemo(() => {
    return {
      minLength: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[^A-Za-z0-9]/.test(password),
    };
  }, [password]);

  const metCount = useMemo(() => {
    return Object.values(passwordCriteria).filter(Boolean).length;
  }, [passwordCriteria]);

  // Determine strength level
  const passwordStrength = useMemo(() => {
    if (!password) return { label: '', percent: 0, color: 'bg-neutral-200', textClass: 'text-neutral-500' };
    if (metCount <= 2) return { label: 'Weak', percent: 25, color: 'bg-rose-500', textClass: 'text-rose-600' };
    if (metCount === 3) return { label: 'Fair', percent: 50, color: 'bg-amber-500', textClass: 'text-amber-600' };
    if (metCount === 4) return { label: 'Good', percent: 75, color: 'bg-blue-500', textClass: 'text-blue-600' };
    return { label: 'Strong', percent: 100, color: 'bg-emerald-600', textClass: 'text-emerald-600' };
  }, [password, metCount]);

  const isPasswordStrong = metCount === 5;

  // Step 1: Send OTP to verify email exists
  const handleInitiateOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();

    // 1. Validate matching passwords
    if (password !== confirmPassword) {
      toast.error('Passwords do not match. Please re-enter your password.');
      return;
    }

    // 2. Enforce standard strong password rules
    if (!isPasswordStrong) {
      toast.error('Password is too weak. Please satisfy all 5 security conditions before proceeding.');
      return;
    }

    setIsPending(true);
    try {
      // 3. Prevent duplicate registration with same email
      const emailCheck = await checkEmailAvailability(cleanEmail);
      if (emailCheck.exists) {
        toast.error('An account with this email address already exists. Please Sign In instead.');
        setIsPending(false);
        return;
      }

      // 4. Generate and send Email OTP
      const otpRes = await generateAndSendOtp(cleanEmail, 'SIGN_UP');
      if (!otpRes.success) {
        toast.error(otpRes.message);
        setIsPending(false);
        return;
      }

      toast.success(otpRes.message);
      setStep('OTP');
      setResendCooldown(60); // 60 seconds cooldown
    } catch {
      toast.error('Unable to send verification code. Please check your internet or try again.');
    } finally {
      setIsPending(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isPending) return;
    setIsPending(true);
    try {
      const otpRes = await generateAndSendOtp(email.trim().toLowerCase(), 'SIGN_UP');
      if (otpRes.success) {
        toast.success('A fresh verification code has been sent to your email.');
        setResendCooldown(60);
      } else {
        toast.error(otpRes.message);
      }
    } catch {
      toast.error('Failed to resend code.');
    } finally {
      setIsPending(false);
    }
  };

  // Step 2: Verify OTP and finalize Registration
  const handleVerifyOtpAndRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.trim();

    if (cleanOtp.length !== 6) {
      toast.error('Please enter the complete 6-digit verification code.');
      return;
    }

    setIsPending(true);
    try {
      // 1. Verify OTP with Server
      const verifyRes = await verifyOtpCode(cleanEmail, cleanOtp);
      if (!verifyRes.success) {
        toast.error(verifyRes.message);
        setIsPending(false);
        return;
      }

      // 2. Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, cleanEmail, password);
      const user = userCredential.user;

      // 3. Update Firebase Display Name
      await updateProfile(user, { displayName: name.trim() });

      // 4. Get ID Token and Sign In with NextAuth
      const idToken = await user.getIdToken();
      const response = await signIn('firebase', {
        idToken,
        redirect: false,
        callbackUrl,
      });

      if (response?.error) {
        toast.error('Account verified, but automatic sign in failed. Please log in.');
        router.push('/sign-in');
      } else {
        toast.success('Email verified! Welcome to Madhav Shringaar.');
        router.push(callbackUrl);
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error('An account with this email already exists. Please Sign In.');
        setStep('DETAILS');
      } else {
        toast.error(error.message || 'Verification failed. Please try again.');
      }
    } finally {
      setIsPending(false);
    }
  };

  // =========================================================================
  // VIEW: Step 2 - OTP Input
  // =========================================================================
  if (step === 'OTP') {
    return (
      <form onSubmit={handleVerifyOtpAndRegister} className="space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto">
            <Mail className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-primary">Verify Your Email</h2>
          <p className="text-xs text-neutral-600 max-w-sm mx-auto">
            We have sent a 6-digit verification code to <strong className="text-neutral-900">{email}</strong>.
            Please enter it below to confirm your account.
          </p>
        </div>

        <div>
          <Label htmlFor="otp" className="text-center block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-2">
            Enter 6-Digit Code
          </Label>
          <Input
            id="otp"
            name="otp"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            autoFocus
            autoComplete="one-time-code"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="• • • • • •"
            className="text-center font-mono text-2xl tracking-[10px] h-14 font-bold border-2 focus-visible:ring-primary"
            required
          />
        </div>

        <div className="space-y-3">
          <Button
            disabled={isPending || otp.length !== 6}
            className="w-full h-11 text-base font-semibold"
            variant="default"
            type="submit"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Verifying Code...
              </span>
            ) : (
              'Verify & Create Account'
            )}
          </Button>

          <div className="flex items-center justify-between text-xs pt-1">
            <button
              type="button"
              onClick={() => setStep('DETAILS')}
              className="text-neutral-600 hover:text-neutral-900 flex items-center gap-1 font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Change email
            </button>

            <button
              type="button"
              disabled={resendCooldown > 0 || isPending}
              onClick={handleResendOtp}
              className={`font-semibold transition-colors flex items-center gap-1 ${
                resendCooldown > 0
                  ? 'text-neutral-400 cursor-not-allowed'
                  : 'text-primary hover:underline'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPending ? 'animate-spin' : ''}`} />
              {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend code'}
            </button>
          </div>
        </div>
      </form>
    );
  }

  // =========================================================================
  // VIEW: Step 1 - Form Details
  // =========================================================================
  return (
    <form onSubmit={handleInitiateOtp}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-5">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Radhe Mohan"
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            required
            className="mt-1"
          />
          <p className="text-[11px] text-neutral-500 mt-1">
            We will send a 6-digit OTP code to verify this email address.
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            {password && (
              <span className={`text-xs font-semibold ${passwordStrength.textClass}`}>
                {passwordStrength.label} Password
              </span>
            )}
          </div>
          <div className="relative mt-1">
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a strong password"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {/* Password Strength Progress Bar */}
          {password && (
            <div className="w-full bg-neutral-200 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color}`}
                style={{ width: `${passwordStrength.percent}%` }}
              />
            </div>
          )}

          {/* Standard Security Conditions Checklist */}
          <div className="mt-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200/80 space-y-1.5 text-xs text-neutral-600">
            <p className="font-semibold text-neutral-800 text-[11px] uppercase tracking-wider">
              Password Requirements:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-0.5">
              <div className="flex items-center gap-1.5">
                {passwordCriteria.minLength ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                ) : (
                  <X className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                )}
                <span className={passwordCriteria.minLength ? 'text-emerald-700 font-medium' : ''}>
                  At least 8 characters
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {passwordCriteria.hasUpper ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                ) : (
                  <X className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                )}
                <span className={passwordCriteria.hasUpper ? 'text-emerald-700 font-medium' : ''}>
                  One uppercase (A-Z)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {passwordCriteria.hasLower ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                ) : (
                  <X className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                )}
                <span className={passwordCriteria.hasLower ? 'text-emerald-700 font-medium' : ''}>
                  One lowercase (a-z)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {passwordCriteria.hasNumber ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                ) : (
                  <X className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                )}
                <span className={passwordCriteria.hasNumber ? 'text-emerald-700 font-medium' : ''}>
                  One number (0-9)
                </span>
              </div>
              <div className="flex items-center gap-1.5 sm:col-span-2">
                {passwordCriteria.hasSpecial ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                ) : (
                  <X className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                )}
                <span className={passwordCriteria.hasSpecial ? 'text-emerald-700 font-medium' : ''}>
                  One special symbol (!@#$%^&*)
                </span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative mt-1">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {confirmPassword && password !== confirmPassword && (
            <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" /> Passwords do not match
            </p>
          )}
          {confirmPassword && password === confirmPassword && isPasswordStrong && (
            <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Passwords match &amp; criteria satisfied
            </p>
          )}
        </div>

        <div>
          <Button
            disabled={isPending || !isPasswordStrong || password !== confirmPassword}
            className="w-full h-11 text-base font-semibold"
            variant="default"
            type="submit"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending Verification Code...
              </span>
            ) : (
              'Verify Email & Sign Up'
            )}
          </Button>
          {!isPasswordStrong && password.length > 0 && (
            <p className="text-[11px] text-center text-amber-700 mt-2 font-medium">
              Please fulfill all standard password conditions above to enable Sign Up.
            </p>
          )}
        </div>

        <div className="text-sm text-center text-muted-foreground pt-1">
          Already have an account?{' '}
          <Link href="/sign-in" target="_self" className="link text-primary font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </form>
  );
}