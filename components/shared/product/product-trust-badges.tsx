'use client';

import Link from 'next/link';
import { ShieldCheck, Truck, RotateCcw, PackageCheck } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/language-context';

interface ProductTrustBadgesProps {
  isReturnable: boolean;
  returnWindowDays: number;
}

export default function ProductTrustBadges({
  isReturnable,
  returnWindowDays
}: ProductTrustBadgesProps) {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  return (
    <div className="mt-4">
      {/* Trust Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-medium text-on-surface-variant">
        <div className="flex flex-col items-center justify-center p-3 bg-surface-container-low rounded-xl text-center gap-2 border border-outline-variant/20 shadow-2xs">
          <ShieldCheck className="w-6 h-6 text-emerald-600" />
          <span>{isHindi ? '100% सुरक्षित भुगतान' : 'Secure Payments'}</span>
        </div>
        
        <div className="flex flex-col items-center justify-center p-3 bg-surface-container-low rounded-xl text-center gap-2 border border-outline-variant/20 shadow-2xs">
          {isReturnable ? (
            <>
              <RotateCcw className="w-6 h-6 text-emerald-600" />
              <span>{isHindi ? `${returnWindowDays} दिन में सहज वापसी` : `${returnWindowDays} Days Return`}</span>
            </>
          ) : (
            <>
              <RotateCcw className="w-6 h-6 text-amber-600/80" />
              <span>{isHindi ? 'विग्रह नाप अनुसार' : 'Made to Measure'}</span>
            </>
          )}
        </div>

        <div className="flex flex-col items-center justify-center p-3 bg-surface-container-low rounded-xl text-center gap-2 border border-outline-variant/20 shadow-2xs">
          <Truck className="w-6 h-6 text-secondary" />
          <span>{isHindi ? '₹999+ पर मुफ़्त डिलीवरी' : 'Free Shipping above ₹999'}</span>
        </div>

        <Link 
          href="/policies/authenticity"
          className="flex flex-col items-center justify-center p-3 bg-surface-container-low hover:bg-[#FAF7F0] rounded-xl text-center gap-1.5 border border-outline-variant/20 hover:border-[#E6C16A] transition-all group shadow-2xs"
        >
          <PackageCheck className="w-6 h-6 text-secondary group-hover:scale-105 transition-transform" />
          <span>{isHindi ? 'प्रामाणिक ब्रज हस्तशिल्प' : 'Authentic Braj Craft'}</span>
          <span className="text-[10px] text-[#0F6F74] font-semibold underline opacity-80 group-hover:opacity-100">
            {isHindi ? 'हमारा संकल्प ↗' : 'Our Promise ↗'}
          </span>
        </Link>
      </div>
    </div>
  );
}
