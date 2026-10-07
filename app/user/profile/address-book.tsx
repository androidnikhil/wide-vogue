'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { deleteUserAddress } from '@/lib/actions/user.actions';
import { ShippingAddress } from '@/types';
import { useRouter } from 'next/navigation';

export default function AddressBook({ addresses }: { addresses: ShippingAddress[] }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = (index: number) => {
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
    <Card className="shadow-sm border-outline-variant/30 mt-6 bg-surface-container-lowest rounded-2xl overflow-hidden">
      <CardHeader className="bg-surface-container-low border-b border-outline-variant/30 px-6 py-4">
        <CardTitle className="flex items-center gap-2 text-lg font-bold text-primary">
          <MapPin className="w-5 h-5" />
          Address Book
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {addresses.length === 0 ? (
          <p className="text-on-surface-variant text-sm">You have no saved addresses.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {addresses.map((address, idx) => (
              <div key={idx} className="border border-outline-variant/30 p-4 rounded-xl bg-surface relative group">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-error hover:text-error hover:bg-error/10"
                  onClick={() => handleDelete(idx)}
                  disabled={isPending}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <p className="font-semibold text-on-surface">{address.fullName}</p>
                <p className="text-sm text-on-surface-variant mt-1">
                  {address.streetAddress}<br />
                  {address.city}, {address.state} {address.postalCode}<br />
                  {address.country}
                </p>
                <p className="text-sm text-secondary font-medium mt-2">
                  +91 {address.contactNumber}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
