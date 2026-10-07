'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, ShieldCheck, Truck, RotateCcw, PackageCheck } from 'lucide-react';
import { toast } from 'sonner';

interface ProductTrustBadgesProps {
  isReturnable: boolean;
  returnWindowDays: number;
}

export default function ProductTrustBadges({
  isReturnable,
  returnWindowDays
}: ProductTrustBadgesProps) {
  const [pincode, setPincode] = useState('');
  const [deliveryEstimate, setDeliveryEstimate] = useState<string | null>(null);

  const checkPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length !== 6) {
      toast.error('Please enter a valid 6-digit pincode');
      return;
    }
    
    // Placeholder logic for dynamic delivery
    toast.success('Pincode verified!');
    setDeliveryEstimate('Estimated Delivery: 3-5 Business Days');
  };

  return (
    <div className="mt-6 space-y-6">
      {/* Pincode Checker (Placeholder) */}
      <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-sm">
        <h4 className="font-semibold text-sm mb-3 flex items-center gap-2 text-on-surface">
          <MapPin className="w-4 h-4 text-secondary" />
          Check Delivery Availability
        </h4>
        <form onSubmit={checkPincode} className="flex gap-2">
          <Input 
            type="number" 
            placeholder="Enter Pincode" 
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            className="bg-surface"
            maxLength={6}
          />
          <Button type="submit" variant="secondary" className="whitespace-nowrap">
            Check
          </Button>
        </form>
        {deliveryEstimate && (
          <p className="mt-3 text-sm font-medium text-emerald-600 flex items-center gap-2">
            <Truck className="w-4 h-4" />
            {deliveryEstimate}
          </p>
        )}
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 gap-3 text-xs font-medium text-on-surface-variant">
        <div className="flex flex-col items-center justify-center p-3 bg-surface-container-low rounded-lg text-center gap-2 border border-outline-variant/20">
          <ShieldCheck className="w-6 h-6 text-emerald-600" />
          <span>Secure Payments</span>
        </div>
        
        <div className="flex flex-col items-center justify-center p-3 bg-surface-container-low rounded-lg text-center gap-2 border border-outline-variant/20">
          {isReturnable ? (
            <>
              <RotateCcw className="w-6 h-6 text-emerald-600" />
              <span>{returnWindowDays} Days Return</span>
            </>
          ) : (
            <>
              <RotateCcw className="w-6 h-6 text-red-500/70" />
              <span>Non-Returnable</span>
            </>
          )}
        </div>

        <div className="flex flex-col items-center justify-center p-3 bg-surface-container-low rounded-lg text-center gap-2 border border-outline-variant/20">
          <Truck className="w-6 h-6 text-secondary" />
          <span>Free Shipping<br/>above ₹999</span>
        </div>

        <div className="flex flex-col items-center justify-center p-3 bg-surface-container-low rounded-lg text-center gap-2 border border-outline-variant/20">
          <PackageCheck className="w-6 h-6 text-secondary" />
          <span>Authentic<br/>Vrindavan Product</span>
        </div>
      </div>
    </div>
  );
}
