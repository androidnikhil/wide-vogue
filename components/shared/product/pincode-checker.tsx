'use client';

import { useState } from 'react';
import { MapPin, Truck, AlertCircle, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { checkDeliveryPincode } from '@/lib/actions/pincode.actions';
import { useLanguage } from '@/lib/i18n/language-context';

export default function PincodeChecker() {
  const { t, language } = useLanguage();
  const [pincode, setPincode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    city?: string;
    district?: string;
    state?: string;
    deliveryDate?: string;
    codAvailable?: boolean;
    courierName?: string;
    estimatedDays?: number;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCheck = async () => {
    const cleanPin = pincode.trim().replace(/\D/g, '');
    if (cleanPin.length !== 6) {
      toast.error('Please enter a valid 6-digit Pincode');
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setResult(null);

    try {
      const res = await checkDeliveryPincode(cleanPin);

      if (!res.success) {
        setErrorMessage(res.message || 'Pincode not serviceable.');
        return;
      }

      setResult({
        city: res.city,
        district: res.district,
        state: res.state,
        deliveryDate: res.deliveryDate,
        codAvailable: res.codAvailable,
        courierName: res.courierName,
        estimatedDays: res.estimatedDays,
      });
    } catch {
      setErrorMessage('Could not verify delivery options right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/30 p-4 rounded-2xl shadow-xs mt-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-secondary" />
          <h3 className="font-semibold text-sm text-primary">{t.product.checkDelivery}</h3>
        </div>
        <span className="text-[10px] text-emerald-800 font-medium bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          {language === 'hi' ? 'अखिल भारतीय एक्सप्रेस' : 'Pan-India Express'}
        </span>
      </div>
      
      <div className="flex gap-2">
        <Input 
          type="text" 
          maxLength={6}
          placeholder={t.product.enterPincode}
          value={pincode}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, '').slice(0, 6);
            setPincode(val);
            if (errorMessage) setErrorMessage(null);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleCheck();
          }}
          className="font-mono text-sm border-outline-variant/50 focus-visible:ring-secondary/20"
        />
        <Button 
          variant="outline" 
          onClick={handleCheck}
          disabled={loading || pincode.length !== 6}
          className="border-[#003020] text-[#003020] hover:bg-[#003020] hover:text-[#F3D98F] transition-all font-semibold shrink-0"
        >
          {loading ? (
            <span className="flex items-center gap-1.5">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> {t.product.checking}
            </span>
          ) : (
            t.product.checkBtn
          )}
        </Button>
      </div>

      {result && (
        <div className="mt-4 space-y-2.5 text-xs bg-emerald-50/70 border border-emerald-200/80 p-3.5 rounded-xl animate-in fade-in-50 duration-300">
          <div className="flex items-start gap-2 text-emerald-950">
            <Truck className="w-4 h-4 mt-0.5 shrink-0 text-emerald-700" />
            <div>
              <p className="font-bold text-sm text-emerald-900">
                {t.product.estimatedDelivery} {result.deliveryDate}
              </p>
              <p className="text-emerald-800 text-[11px] mt-0.5">
                {t.product.deliveredTo} <strong>{result.district ? `${result.district}, ` : ''}{result.state}</strong> ({pincode})
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-emerald-200/60 text-[11px]">
            <div className="flex items-center gap-1.5 text-emerald-900">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.product.cashOnDelivery}: <strong>{result.codAvailable ? t.product.available : t.product.prepaidOnly}</strong></span>
            </div>
            <div className="flex items-center gap-1 text-emerald-800">
              <Sparkles className="w-3 h-3 text-[#C88A20]" />
              <span>{language === 'hi' ? '₹999+ पर मुफ़्त डिलीवरी' : 'Free Delivery on ₹999+'}</span>
            </div>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="mt-4 flex items-start gap-2 text-error text-xs bg-error/10 p-3 rounded-xl border border-error/20">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <p>{errorMessage}</p>
        </div>
      )}
    </div>
  );
}
