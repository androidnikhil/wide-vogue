"use client";

import React, { useState } from 'react';
import { WHATSAPP_NUMBER } from '@/lib/constants';
import { useLanguage } from '@/lib/i18n/language-context';

interface WhatsAppFloatingButtonProps {
  phoneNumber?: string;
  defaultMessage?: string;
}

export default function WhatsAppFloatingButton({
  phoneNumber = WHATSAPP_NUMBER || '8755518488',
  defaultMessage,
}: WhatsAppFloatingButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { t } = useLanguage();

  const msg = defaultMessage || t.common.whatsappDefaultMsg;
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  const internationalPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
  const whatsappUrl = `https://wa.me/${internationalPhone}?text=${encodeURIComponent(msg)}`;

  return (
    <div 
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 group print:hidden select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Devotional Tooltip Pill */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Madhav Shringaar on WhatsApp"
        className={`hidden md:flex items-center gap-2 bg-white/95 backdrop-blur-md text-[#003020] px-3.5 py-2 rounded-full shadow-lg border border-[#25D366]/30 transition-all duration-300 transform ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-3 pointer-events-none'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-[#25D366] animate-ping" />
        <span className="text-xs font-semibold">{t.common.whatsappPill}</span>
      </a>

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Direct WhatsApp Support +91 87555 18488"
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 ring-4 ring-[#25D366]/20"
      >
        {/* Subtle Pulse Rings */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/30 animate-pulse pointer-events-none" />

        {/* Official WhatsApp SVG Vector */}
        <svg 
          className="w-7 h-7 fill-current relative z-10" 
          viewBox="0 0 24 24" 
          aria-hidden="true"
        >
          <path d="M12.031 2C6.495 2 2 6.495 2 12.031c0 1.956.565 3.78 1.542 5.327L2 22l4.81-1.503c1.477.886 3.208 1.393 5.061 1.393 5.536 0 10.031-4.495 10.031-10.031C21.902 6.495 17.567 2 12.031 2zm0 18.23c-1.642 0-3.175-.468-4.482-1.28l-.322-.2-3.327 1.04.996-3.197-.215-.34A8.196 8.196 0 0 1 3.83 12.03c0-4.522 3.679-8.201 8.201-8.201 4.522 0 8.201 3.679 8.201 8.201 0 4.522-3.679 8.2-8.201 8.2zm4.767-6.143c-.261-.131-1.547-.763-1.787-.85-.24-.087-.414-.131-.588.131-.174.262-.676.85-.828 1.025-.153.175-.306.196-.567.065-.262-.131-1.104-.407-2.103-1.298-.778-.693-1.303-1.55-1.455-1.812-.153-.262-.016-.403.115-.533.118-.118.262-.306.393-.459.131-.153.174-.262.262-.436.087-.175.044-.327-.022-.459-.065-.131-.588-1.417-.806-1.942-.213-.512-.429-.442-.588-.45-.152-.008-.327-.01-.502-.01s-.458.065-.698.327c-.24.262-.916.895-.916 2.182 0 1.288.938 2.531 1.069 2.706.131.175 1.846 2.82 4.473 3.954.625.27 1.113.431 1.493.552.628.2 1.2.172 1.651.104.503-.075 1.547-.632 1.765-1.243.218-.611.218-1.135.153-1.244-.065-.109-.24-.174-.502-.305z"/>
        </svg>
      </a>
    </div>
  );
}
