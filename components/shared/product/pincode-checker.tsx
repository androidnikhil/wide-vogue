'use client';

import { useState } from 'react';
import { MapPin, Truck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function PincodeChecker() {
  const [pincode, setPincode] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [deliveryInfo, setDeliveryInfo] = useState<{ date: string; cod: boolean } | null>(null);

  const handleCheck = () => {
    if (pincode.length !== 6 || !/^\d+$/.test(pincode)) {
      toast.error('Please enter a valid 6-digit Pincode');
      return;
    }

    setStatus('loading');

    // Simulate API call
    setTimeout(() => {
      const firstDigit = pincode.charAt(0);
      
      // Simulate unserviceable area
      if (firstDigit === '8' || firstDigit === '9') {
        setStatus('error');
        setDeliveryInfo(null);
        return;
      }

      // Simulate delivery calculation
      const days = (firstDigit === '1' || firstDigit === '2') ? 2 : (firstDigit === '3' || firstDigit === '4') ? 3 : 5;
      
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + days);
      
      const formattedDate = deliveryDate.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
      
      setDeliveryInfo({
        date: formattedDate,
        cod: firstDigit !== '7' // Simulate COD unavailable for some regions
      });
      setStatus('success');
    }, 800);
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/30 p-4 rounded-xl shadow-sm mt-6">
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="w-5 h-5 text-secondary" />
        <h3 className="font-semibold text-primary">Check Delivery Options</h3>
      </div>
      
      <div className="flex gap-2">
        <Input 
          type="text" 
          maxLength={6}
          placeholder="Enter Pincode" 
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          className="font-mono text-sm border-outline-variant/50 focus-visible:ring-secondary/20"
        />
        <Button 
          variant="outline" 
          onClick={handleCheck}
          disabled={status === 'loading'}
          className="border-secondary text-secondary hover:bg-secondary/10"
        >
          {status === 'loading' ? 'Checking...' : 'Check'}
        </Button>
      </div>

      {status === 'success' && deliveryInfo && (
        <div className="mt-4 space-y-2 text-sm bg-emerald-50 border border-emerald-100 p-3 rounded-lg">
          <div className="flex items-start gap-2 text-emerald-800">
            <Truck className="w-4 h-4 mt-0.5 shrink-0" />
            <p><span className="font-semibold">Get it by {deliveryInfo.date}</span></p>
          </div>
          <div className="flex items-start gap-2 text-emerald-800">
            <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
            <p>Cash on Delivery is <b>{deliveryInfo.cod ? 'Available' : 'Unavailable'}</b></p>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="mt-4 flex items-start gap-2 text-error text-sm bg-error/10 p-3 rounded-lg border border-error/20">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <p>Sorry, we do not deliver to this pincode at the moment.</p>
        </div>
      )}
    </div>
  );
}
