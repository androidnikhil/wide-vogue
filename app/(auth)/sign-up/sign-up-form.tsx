'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signUpDefaultValues } from '@/lib/constants';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Eye, EyeOff, Check, X, ShieldAlert, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

import { auth as firebaseAuth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { signIn } from 'next-auth/react';
import { checkEmailAvailability } from '@/lib/actions/user.actions';

export default function SignUpForm() {
  const [name, setName] = useState(signUpDefaultValues.name);
  const [email, setEmail] = useState(signUpDefaultValues.email);
  const [password, setPassword] = useState(signUpDefaultValues.password);
  const [confirmPassword, setConfirmPassword] = useState(signUpDefaultValues.confirmPassword);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

      // 4. Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, cleanEmail, password);
      const user = userCredential.user;

      // 5. Update Firebase Display Name
      await updateProfile(user, { displayName: name.trim() });

      // 6. Get ID Token and Sign In with NextAuth
      const idToken = await user.getIdToken();
      const response = await signIn('firebase', {
        idToken,
        redirect: false,
        callbackUrl,
      });

      if (response?.error) {
        toast.error('Account created, but automatic sign in failed. Please log in.');
        router.push('/sign-in');
      } else {
        toast.success('Account created successfully! Welcome to Madhav Shringaar.');
        router.push(callbackUrl);
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error('An account with this email already exists. Please Sign In.');
      } else if (error.code === 'auth/weak-password') {
        toast.error('Password does not meet standard security requirements.');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Please enter a valid email address.');
      } else {
        toast.error(error.message || 'Failed to create account. Please try again.');
      }
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
              <ShieldCheck className="w-3.5 h-3.5" /> Passwords match & criteria satisfied
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
            {isPending ? 'Creating Account...' : 'Sign Up'}
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