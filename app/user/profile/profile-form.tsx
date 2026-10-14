'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { updateProfile } from '@/lib/actions/user.actions';
import { updateProfileSchema } from '@/lib/validators';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { User, Mail, Phone, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';

interface ProfileFormProps {
  initialUser?: {
    name?: string | null;
    email?: string | null;
    phoneNumber?: string | null;
  };
}

const ProfileForm = ({ initialUser }: ProfileFormProps) => {
  const router = useRouter();
  const { data: session, update } = useSession();

  const currentEmail = initialUser?.email || (
    session?.user?.email && !session.user.email.endsWith('@madhavshringaar.com')
      ? session.user.email
      : ''
  );
  const isEmailLocked = Boolean(currentEmail && !currentEmail.endsWith('@madhavshringaar.com'));

  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: initialUser?.name && initialUser.name !== 'NO_NAME' ? initialUser.name : (session?.user?.name || ''),
      email: currentEmail,
      phoneNumber: initialUser?.phoneNumber || '',
    },
  });

  const onSubmit = async (values: z.infer<typeof updateProfileSchema>) => {
    const res = await updateProfile(values);

    if (!res.success) {
      return toast.error(res.message || 'Failed to update profile');
    }

    const newSession = {
      ...session,
      user: {
        ...session?.user,
        name: values.name,
        email: values.email || session?.user?.email,
      },
    };

    await update(newSession);
    toast.success('Personal information updated successfully');
    router.refresh();
  };

  return (
    <Card className="shadow-xs border border-neutral-200/80 rounded-2xl overflow-hidden bg-white">
      <CardHeader className="bg-[#FAF7F0]/60 border-b border-neutral-200/70 p-5">
        <CardTitle className="font-serif text-lg font-bold text-[#003020] flex items-center gap-2">
          <User className="w-5 h-5 text-[#0F6F74]" />
          Personal Information
        </CardTitle>
        <CardDescription className="text-xs text-neutral-500">
          Manage your verified name, mobile number, and contact email for order tracking.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Full Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-neutral-700 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-neutral-400" />
                    Devotee Full Name *
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Radhika Sharma"
                      className="rounded-xl text-sm bg-neutral-50/50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 10-Digit Mobile Number */}
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-neutral-700 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-neutral-400" />
                      10-Digit Mobile Number *
                    </span>
                    <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      SMS & WhatsApp Updates
                    </span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-xs text-neutral-500 font-medium">
                        +91
                      </span>
                      <Input
                        placeholder="9876543210"
                        maxLength={10}
                        className="pl-12 rounded-xl text-sm bg-neutral-50/50"
                        {...field}
                        value={field.value || ''}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email Address */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-neutral-700 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-neutral-400" />
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isEmailLocked}
                      placeholder="devotee@example.com"
                      className="rounded-xl text-sm bg-neutral-50/50"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  {isEmailLocked && (
                    <p className="text-[11px] text-neutral-400">
                      Primary login email is verified and locked for account safety.
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Security Footnote */}
            <div className="pt-2 flex items-center gap-2 text-xs text-neutral-500">
              <ShieldCheck className="w-4 h-4 text-[#C88A20] flex-shrink-0" />
              <span>Your personal contact information is guarded with 256-bit encryption.</span>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full bg-[#003020] hover:bg-[#002518] text-[#F3D98F] font-semibold rounded-xl h-11 shadow-xs"
            >
              {form.formState.isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving Changes...
                </span>
              ) : (
                'Save Profile Information'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;