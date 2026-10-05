'use client';

import { useRouter } from 'next/navigation';
import { useTransition, useState, useEffect } from 'react';
import { ShippingAddress } from '@/types';
import { shippingAddressSchema } from '@/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { ControllerRenderProps, useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader, MapPin, User, Building, Map, Navigation, Phone, Mail } from 'lucide-react';
import { shippingAddressDefaultValues } from '@/lib/constants';
import { toast } from 'sonner';
import { updateUserAddress } from '@/lib/actions/user.actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const ShippingAddressForm = ({ 
  address, 
  isGuest = false,
  savedAddresses = []
}: { 
  address: ShippingAddress, 
  isGuest?: boolean,
  savedAddresses?: ShippingAddress[]
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [isFetchingCity, setIsFetchingCity] = useState(false);

  const form = useForm<z.infer<typeof shippingAddressSchema>>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: { ...shippingAddressDefaultValues, ...address },
    mode: 'onChange',
  });

  const onSubmit: SubmitHandler<z.infer<typeof shippingAddressSchema>> = async (
    values
  ) => {
    startTransition(async () => {
      const res = await updateUserAddress(values);

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      router.push('/payment-method');
    });
  };

  // Auto-fill City & Country based on Pincode using India Postal API
  const handlePincodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const pincode = e.target.value;
    form.setValue('postalCode', pincode, { shouldValidate: true });

    if (pincode.length === 6 && /^\d+$/.test(pincode)) {
      setIsFetchingCity(true);
      try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = await response.json();
        
        if (data && data[0] && data[0].Status === 'Success') {
          const postOffice = data[0].PostOffice[0];
          // Set City/District, State, and Country
          form.setValue('city', postOffice.District, { shouldValidate: true });
          form.setValue('state', postOffice.State, { shouldValidate: true });
          form.setValue('country', postOffice.Country, { shouldValidate: true });
          toast.success(`Location updated to ${postOffice.District}, ${postOffice.State}`);
        } else {
          toast.error('Invalid Pincode. Please check again.');
          form.setError('postalCode', { type: 'manual', message: 'Invalid Pincode' });
        }
      } catch (err) {
        console.error('Error fetching pincode data', err);
      } finally {
        setIsFetchingCity(false);
      }
    }
  };

  // Get Current Location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setIsFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Reverse geocoding using Nominatim (OpenStreetMap)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();

          if (data && data.address) {
            const { postcode, city, state_district, county, country, state, road, suburb, neighbourhood, house_number } = data.address;
            const currentCity = city || state_district || county || '';
            const currentCountry = country || '';
            const currentState = state || '';

            const addressParts = [];
            if (house_number) addressParts.push(house_number);
            if (road) addressParts.push(road);
            if (neighbourhood) addressParts.push(neighbourhood);
            if (suburb) addressParts.push(suburb);
            const street = addressParts.join(', ');

            if (postcode) form.setValue('postalCode', postcode, { shouldValidate: true });
            if (currentCity) form.setValue('city', currentCity, { shouldValidate: true });
            if (currentState) form.setValue('state', currentState, { shouldValidate: true });
            if (currentCountry) form.setValue('country', currentCountry, { shouldValidate: true });
            if (street) form.setValue('streetAddress', street, { shouldValidate: true });
            
            form.setValue('lat', latitude);
            form.setValue('lng', longitude);

            toast.success('Location detected successfully!');
          }
        } catch (error) {
          toast.error('Could not determine address from location');
        } finally {
          setIsFetchingLocation(false);
        }
      },
      (error) => {
        toast.error('Location access denied or unavailable.');
        setIsFetchingLocation(false);
      }
    );
  };

  return (
    <div className='max-w-2xl mx-auto py-8 px-4'>
      <Card className="shadow-lg border-outline-variant/30 rounded-2xl overflow-hidden bg-surface-container-lowest">
        <CardHeader className="bg-gradient-to-r from-secondary-container/50 to-transparent border-b border-outline-variant/20 pb-6">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="h3-bold text-primary">Shipping Address</CardTitle>
              <CardDescription className="text-on-surface-variant font-body-md mt-1">
                Where should we deliver your divine items?
              </CardDescription>
            </div>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={getCurrentLocation}
              disabled={isFetchingLocation}
              className="hidden sm:flex border-secondary text-secondary hover:bg-secondary hover:text-on-secondary rounded-full shadow-sm transition-all"
            >
              {isFetchingLocation ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : <Navigation className="w-4 h-4 mr-2" />}
              Use Current Location
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {!isGuest && savedAddresses && savedAddresses.length > 0 && (
            <div className="mb-8">
              <h3 className="font-semibold text-on-surface mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-secondary" />
                Saved Addresses
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {savedAddresses.map((addr, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => form.reset(addr)}
                    className="p-3 border border-outline-variant/30 rounded-xl cursor-pointer hover:border-secondary transition-colors bg-surface-container-low"
                  >
                    <p className="font-semibold text-sm text-on-surface">{addr.fullName}</p>
                    <p className="text-xs text-on-surface-variant mt-1 truncate">{addr.streetAddress}, {addr.city}</p>
                  </div>
                ))}
              </div>
              <div className="my-6 border-b border-outline-variant/20 relative">
                <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-surface-container-lowest px-2 text-xs text-on-surface-variant">OR ENTER NEW</span>
              </div>
            </div>
          )}
          <Form {...form}>
            <form
              method='post'
              className='space-y-6'
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="space-y-5">
                {/* Full Name */}
                <FormField
                  control={form.control}
                  name='fullName'
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <FormLabel className="font-semibold text-primary">Full Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 h-5 w-5 text-secondary/70" />
                          <Input 
                            className="pl-10 h-11 rounded-xl bg-surface border-outline-variant/50 focus-visible:ring-secondary focus-visible:border-secondary shadow-sm transition-all" 
                            placeholder='Enter full name (e.g. Radhika Sharma)' 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-error font-body-sm" />
                    </FormItem>
                  )}
                />

                {/* Guest Email */}
                {isGuest && (
                  <FormField
                    control={form.control}
                    name='guestEmail'
                    render={({ field }) => (
                      <FormItem className='w-full'>
                        <FormLabel className="font-semibold text-primary">Email Address (For Order Updates)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-secondary/70" />
                            <Input 
                              type="email"
                              className="pl-10 h-11 rounded-xl bg-surface border-outline-variant/50 focus-visible:ring-secondary focus-visible:border-secondary shadow-sm transition-all" 
                              placeholder='Enter your email address' 
                              {...field}
                              value={field.value || ''}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-error font-body-sm" />
                      </FormItem>
                    )}
                  />
                )}

                {/* Contact Number */}
                <FormField
                  control={form.control}
                  name='contactNumber'
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <FormLabel className="font-semibold text-primary">Contact Number (For Delivery Agent)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-2.5 h-5 w-5 text-secondary/70" />
                          <div className="absolute left-10 top-0 bottom-0 flex items-center pr-2 border-r border-outline-variant/30 text-on-surface-variant text-sm font-medium">
                            +91
                          </div>
                          <Input 
                            className="pl-20 h-11 rounded-xl bg-surface border-outline-variant/50 focus-visible:ring-secondary focus-visible:border-secondary shadow-sm transition-all tracking-widest" 
                            placeholder='10-digit mobile number'
                            maxLength={10} 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-error font-body-sm" />
                    </FormItem>
                  )}
                />

                {/* Street Address */}
                <FormField
                  control={form.control}
                  name='streetAddress'
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <FormLabel className="font-semibold text-primary">Street Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-secondary/70" />
                          <Input 
                            className="pl-10 h-11 rounded-xl bg-surface border-outline-variant/50 focus-visible:ring-secondary focus-visible:border-secondary shadow-sm transition-all" 
                            placeholder='House No., Building, Street Area' 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-error font-body-sm" />
                    </FormItem>
                  )}
                />

                <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                  {/* Postal Code */}
                  <FormField
                    control={form.control}
                    name='postalCode'
                    render={({ field }) => (
                      <FormItem className='w-full'>
                        <FormLabel className="font-semibold text-primary flex items-center justify-between">
                          Postal Code (Pincode)
                          {isFetchingCity && <Loader className="w-3 h-3 animate-spin text-secondary" />}
                        </FormLabel>
                        <FormControl>
                          <Input 
                            className="h-11 rounded-xl bg-surface border-outline-variant/50 focus-visible:ring-secondary focus-visible:border-secondary shadow-sm transition-all tracking-widest" 
                            placeholder='6-digit pincode' 
                            maxLength={6}
                            {...field}
                            onChange={handlePincodeChange}
                          />
                        </FormControl>
                        <FormMessage className="text-error font-body-sm" />
                      </FormItem>
                    )}
                  />

                  {/* City */}
                  <FormField
                    control={form.control}
                    name='city'
                    render={({ field }) => (
                      <FormItem className='w-full'>
                        <FormLabel className="font-semibold text-primary">City / District</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Building className="absolute left-3 top-2.5 h-5 w-5 text-secondary/70" />
                            <Input 
                              className="pl-10 h-11 rounded-xl bg-surface border-outline-variant/50 focus-visible:ring-secondary focus-visible:border-secondary shadow-sm transition-all" 
                              placeholder='City' 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-error font-body-sm" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                  {/* State */}
                  <FormField
                    control={form.control}
                    name='state'
                    render={({ field }) => (
                      <FormItem className='w-full'>
                        <FormLabel className="font-semibold text-primary">State</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Map className="absolute left-3 top-2.5 h-5 w-5 text-secondary/70" />
                            <Input 
                              className="pl-10 h-11 rounded-xl bg-surface border-outline-variant/50 focus-visible:ring-secondary focus-visible:border-secondary shadow-sm transition-all" 
                              placeholder='State' 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-error font-body-sm" />
                      </FormItem>
                    )}
                  />

                {/* Country */}
                <FormField
                  control={form.control}
                  name='country'
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <FormLabel className="font-semibold text-primary">Country</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Map className="absolute left-3 top-2.5 h-5 w-5 text-secondary/70" />
                          <Input 
                            className="pl-10 h-11 rounded-xl bg-surface border-outline-variant/50 focus-visible:ring-secondary focus-visible:border-secondary shadow-sm transition-all" 
                            placeholder='Country' 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-error font-body-sm" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

              {/* Mobile Current Location Button */}
              <Button 
                type="button" 
                variant="outline" 
                onClick={getCurrentLocation}
                disabled={isFetchingLocation}
                className="w-full sm:hidden border-secondary text-secondary hover:bg-secondary hover:text-on-secondary rounded-xl shadow-sm transition-all"
              >
                {isFetchingLocation ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : <Navigation className="w-4 h-4 mr-2" />}
                Use Current Location
              </Button>

              <div className='pt-4'>
                <Button 
                  type='submit' 
                  disabled={isPending || !form.formState.isValid}
                  className="w-full h-12 rounded-xl gold-gradient-btn text-primary-container font-label-lg font-bold shadow-md hover:scale-[1.01] transition-all disabled:opacity-50 disabled:hover:scale-100"
                >
                  {isPending ? (
                    <Loader className='w-5 h-5 mr-2 animate-spin' />
                  ) : (
                    <ArrowRight className='w-5 h-5 mr-2' />
                  )}{' '}
                  Proceed to Payment
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShippingAddressForm;