'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ShippingAddress } from '@/types';
import { shippingAddressSchema } from '@/lib/validators';
import { updateUserAddress, deleteUserAddress } from '@/lib/actions/user.actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { 
  MapPin, 
  Plus, 
  Trash2, 
  Home, 
  Building2, 
  Sparkles, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Loader2, 
  X,
  ShieldCheck,
  Navigation
} from 'lucide-react';
import { toast } from 'sonner';

interface ManageAddressesProps {
  addresses: ShippingAddress[];
  defaultEmail?: string;
  defaultName?: string;
  defaultPhone?: string;
}

export default function ManageAddresses({
  addresses,
  defaultEmail = '',
  defaultName = '',
  defaultPhone = '',
}: ManageAddressesProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [addressType, setAddressType] = useState<'Home' | 'Temple' | 'Work'>('Home');
  const [isLookingUpPin, setIsLookingUpPin] = useState(false);

  const form = useForm<z.infer<typeof shippingAddressSchema>>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: {
      fullName: defaultName && defaultName !== 'NO_NAME' ? defaultName : '',
      streetAddress: '',
      city: '',
      state: '',
      postalCode: '',
      contactNumber: defaultPhone || '',
      country: 'India',
      guestEmail: defaultEmail && !defaultEmail.endsWith('@madhavshringaar.com') ? defaultEmail : '',
    },
    mode: 'onTouched',
  });

  // Auto-detect city & state when 6-digit PIN is entered
  const handlePincodeChange = async (pincode: string) => {
    form.setValue('postalCode', pincode);
    if (/^\d{6}$/.test(pincode)) {
      setIsLookingUpPin(true);
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = await res.json();
        if (data?.[0]?.Status === 'Success' && data[0].PostOffice?.[0]) {
          const po = data[0].PostOffice[0];
          if (po.District) form.setValue('city', po.District, { shouldValidate: true });
          if (po.State) form.setValue('state', po.State, { shouldValidate: true });
          toast.success(`Location detected: ${po.District}, ${po.State}`);
        }
      } catch (err) {
        // Silent failover to manual input
      } finally {
        setIsLookingUpPin(false);
      }
    }
  };

  const onSubmit = async (values: z.infer<typeof shippingAddressSchema>) => {
    startTransition(async () => {
      const res = await updateUserAddress(values);
      if (res.success) {
        toast.success('Address saved successfully');
        form.reset();
        setIsFormOpen(false);
        router.refresh();
      } else {
        toast.error(res.message || 'Failed to save address');
      }
    });
  };

  const handleDelete = (index: number) => {
    if (!confirm('Are you sure you want to remove this delivery address?')) return;
    startTransition(async () => {
      const res = await deleteUserAddress(index);
      if (res.success) {
        toast.success(res.message);
        router.refresh();
      } else {
        toast.error(res.message);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs">
        <div>
          <h1 className="font-serif text-xl md:text-2xl font-bold text-[#003020] flex items-center gap-2">
            <MapPin className="w-6 h-6 text-[#0F6F74]" />
            Manage Saved Addresses
          </h1>
          <p className="text-xs md:text-sm text-neutral-500 mt-1">
            Save your home, ashram, or temple delivery locations for swift, sacred dispatches.
          </p>
        </div>

        {!isFormOpen && (
          <Button
            onClick={() => setIsFormOpen(true)}
            className="bg-[#003020] hover:bg-[#002518] text-[#F3D98F] font-semibold gap-2 rounded-xl shadow-xs self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            Add New Address
          </Button>
        )}
      </div>

      {/* Add New Address Form Accordion */}
      {isFormOpen && (
        <Card className="border-2 border-[#E6C16A]/60 shadow-md rounded-2xl overflow-hidden bg-[#FAF7F0]/40">
          <CardHeader className="bg-white border-b border-neutral-200/80 px-6 py-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-serif text-lg font-bold text-[#003020]">
                Add New Delivery Address
              </CardTitle>
              <CardDescription className="text-xs text-neutral-600">
                Please enter complete address details for seamless courier dispatch.
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFormOpen(false)}
              className="rounded-full text-neutral-400 hover:text-neutral-700"
            >
              <X className="w-5 h-5" />
            </Button>
          </CardHeader>

          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                {/* Address Type Selector */}
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-2">
                    Address Type
                  </label>
                  <div className="flex gap-2.5">
                    <button
                      type="button"
                      onClick={() => setAddressType('Home')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 border transition-all ${
                        addressType === 'Home'
                          ? 'bg-[#003020] text-[#F3D98F] border-[#003020] shadow-xs'
                          : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                      }`}
                    >
                      <Home className="w-3.5 h-3.5" />
                      Home (All Day)
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddressType('Temple')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 border transition-all ${
                        addressType === 'Temple'
                          ? 'bg-[#003020] text-[#F3D98F] border-[#003020] shadow-xs'
                          : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#E6C16A]" />
                      Temple / Ashram
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddressType('Work')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 border transition-all ${
                        addressType === 'Work'
                          ? 'bg-[#003020] text-[#F3D98F] border-[#003020] shadow-xs'
                          : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      Work (10 AM - 6 PM)
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-neutral-700">
                          Recipient Full Name *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Radhika Sharma"
                            {...field}
                            className="bg-white rounded-xl text-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 10-Digit Mobile */}
                  <FormField
                    control={form.control}
                    name="contactNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-neutral-700">
                          10-Digit Mobile Number *
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5 text-xs text-neutral-500 font-medium">
                              +91
                            </span>
                            <Input
                              placeholder="9876543210"
                              maxLength={10}
                              {...field}
                              className="pl-12 bg-white rounded-xl text-sm"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Pincode with lookup */}
                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-neutral-700 flex items-center justify-between">
                          <span>6-Digit Pincode *</span>
                          {isLookingUpPin && (
                            <span className="text-[11px] text-[#0F6F74] flex items-center gap-1 font-normal">
                              <Loader2 className="w-3 h-3 animate-spin" />
                              Detecting city...
                            </span>
                          )}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. 281121"
                            maxLength={6}
                            value={field.value}
                            onChange={(e) => handlePincodeChange(e.target.value)}
                            className="bg-white rounded-xl text-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Devotee Email */}
                  <FormField
                    control={form.control}
                    name="guestEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-neutral-700">
                          Email Address (for Dispatch Updates) *
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="devotee@example.com"
                            {...field}
                            className="bg-white rounded-xl text-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Street Address / House / Colony */}
                <FormField
                  control={form.control}
                  name="streetAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-neutral-700">
                        Flat, House No., Building, Street & Colony *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Flat 402, Shri Radhe Dham, Raman Reti Road"
                          {...field}
                          className="bg-white rounded-xl text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* City */}
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-neutral-700">
                          City / District *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Mathura / Vrindavan"
                            {...field}
                            className="bg-white rounded-xl text-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* State */}
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-neutral-700">
                          State *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Uttar Pradesh"
                            {...field}
                            className="bg-white rounded-xl text-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsFormOpen(false)}
                    className="rounded-xl border-neutral-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="bg-[#003020] hover:bg-[#002518] text-[#F3D98F] font-semibold rounded-xl min-w-[140px]"
                  >
                    {isPending ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                      </span>
                    ) : (
                      'Save Address'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* Saved Addresses List */}
      <div className="space-y-4">
        {addresses.length === 0 ? (
          <div className="bg-white rounded-2xl border border-neutral-200/80 p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#FAF7F0] text-[#0F6F74] flex items-center justify-center mx-auto">
              <MapPin className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-lg font-bold text-[#003020]">
                No Saved Addresses Yet
              </h3>
              <p className="text-xs md:text-sm text-neutral-500 max-w-md mx-auto">
                Add your home or temple delivery address to enjoy 1-click checkout and faster sacred dispatches.
              </p>
            </div>
            <Button
              onClick={() => setIsFormOpen(true)}
              className="bg-[#003020] hover:bg-[#002518] text-[#F3D98F] font-semibold gap-2 rounded-xl"
            >
              <Plus className="w-4 h-4" />
              Add First Address
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((addr, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-neutral-200/80 hover:border-[#E6C16A] p-5 shadow-xs transition-all relative flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  {/* Top Badge & Action */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#FAF7F0] border border-neutral-200 text-[#003020] text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1">
                        <Home className="w-3 h-3 text-[#0F6F74]" />
                        Address #{idx + 1}
                      </span>
                      {idx === 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold flex items-center gap-1 border border-emerald-200">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          Default Delivery
                        </span>
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(idx)}
                      disabled={isPending}
                      className="text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg h-8 w-8 transition-colors"
                      title="Delete address"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Devotee Info */}
                  <div>
                    <h3 className="font-semibold text-base text-[#003020]">
                      {addr.fullName}
                    </h3>
                    <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                      {addr.streetAddress}
                      <br />
                      {addr.city}, {addr.state} -{' '}
                      <span className="font-semibold text-[#003020]">
                        {addr.postalCode}
                      </span>
                      <br />
                      {addr.country}
                    </p>
                  </div>
                </div>

                {/* Contact Footer */}
                <div className="mt-4 pt-3 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-600">
                  <div className="flex items-center gap-1.5 font-medium text-neutral-800">
                    <Phone className="w-3.5 h-3.5 text-[#0F6F74]" />
                    +91 {addr.contactNumber}
                  </div>
                  {addr.guestEmail && (
                    <div className="flex items-center gap-1.5 text-neutral-500 truncate max-w-[200px]">
                      <Mail className="w-3.5 h-3.5 text-neutral-400" />
                      {addr.guestEmail}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Devotee Trust Footnote */}
      <div className="bg-[#FAF7F0] rounded-2xl p-4 border border-[#E6C16A]/40 flex items-center gap-3.5">
        <ShieldCheck className="w-5 h-5 text-[#C88A20] flex-shrink-0" />
        <p className="text-xs text-neutral-700 leading-relaxed">
          <strong className="text-[#003020]">Sacred Packaging Guarantee:</strong> Every Laddu Gopal Ji poshak, mukut, and shringaar item is packed in pure, sanitized, tamper-evident wrapping before handoff to trusted couriers.
        </p>
      </div>
    </div>
  );
}
