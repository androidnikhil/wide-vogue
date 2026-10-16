'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Printer, ArrowLeft } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

interface AdminThankYouClientProps {
  order: any;
}

export default function AdminThankYouClient({ order }: AdminThankYouClientProps) {
  const handlePrint = () => {
    window.print();
  };

  const cleanOrderId = `OD${order.id.replace(/-/g, '').slice(0, 16).toUpperCase()}`;
  const orderDate = formatDateTime(new Date(order.createdAt)).dateOnly;
  const address = order.shippingAddress || {};
  const customerName = address.fullName || order.user?.name || 'Customer';
  const customerCity = address.city ? `${address.city}, ${address.state || ''}` : 'India';

  return (
    <div className="space-y-4 pb-12">
      {/* Top Admin Action Bar (Hidden on Thermal Print) */}
      <div className="print:hidden flex items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs max-w-2xl mx-auto">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="rounded-xl border-neutral-300 text-xs font-semibold gap-1.5 bg-white hover:bg-neutral-50 shadow-xs text-neutral-800"
        >
          <Link href={`/admin/orders/${order.id}`}>
            <ArrowLeft className="w-3.5 h-3.5 text-[#003020]" />
            Back to Order
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-xl text-xs font-semibold gap-1.5 border-neutral-300"
          >
            <Link href={`/admin/orders/${order.id}/invoice`}>
              <Printer className="w-3.5 h-3.5" />
              Thermal Invoice
            </Link>
          </Button>

          <Button
            onClick={handlePrint}
            size="sm"
            className="bg-[#003020] hover:bg-[#002518] text-[#F3D98F] rounded-xl text-xs font-bold gap-1.5 shadow-md h-9 px-4 active:scale-95 transition-all"
          >
            <Printer className="w-4 h-4 text-[#F3D98F]" />
            Print 80mm Thank You Slip
          </Button>
        </div>
      </div>

      {/* 80mm Thermal Printer Wrapper */}
      <div className="flex justify-center">
        <div
          id="printable-thermal-note"
          className="w-[80mm] max-w-[80mm] min-w-[80mm] bg-white text-black p-3.5 print:p-2 border border-dashed border-neutral-400 print:border-none shadow-md print:shadow-none font-mono text-[11px] leading-tight select-none"
          style={{ width: '80mm' }}
        >
          <style jsx global>{`
            @media print {
              @page {
                size: 80mm auto;
                margin: 0;
              }
              body {
                margin: 0;
                padding: 0;
                background: #ffffff !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              .print\\:hidden {
                display: none !important;
              }
              #printable-thermal-note {
                width: 79mm !important;
                max-width: 79mm !important;
                margin: 0 auto !important;
                padding: 2mm !important;
                border: none !important;
                box-shadow: none !important;
              }
            }
          `}</style>

          {/* Brand Header with Logo */}
          <div className="text-center space-y-1 pb-1">
            <div className="flex justify-center pb-1">
              <Image
                src="/images/logo.png"
                alt="Madhav Shringaar"
                width={120}
                height={35}
                className="h-8 w-auto object-contain filter grayscale contrast-200"
                priority
                unoptimized
              />
            </div>
            <h1 className="text-sm font-black tracking-wider uppercase">MADHAV SHRINGAAR</h1>
            <p className="text-[9px] uppercase font-semibold text-neutral-800">Premium Handcrafted Collection</p>
            <p className="text-[8px] text-neutral-600">Noida &bull; Agra &bull; Vrindavan</p>
          </div>

          <div className="border-b border-dashed border-black my-1.5" />

          {/* Title */}
          <div className="text-center py-0.5">
            <p className="font-bold text-[11px] uppercase tracking-wide">*** THANK YOU NOTE ***</p>
          </div>

          <div className="border-b border-dashed border-black my-1.5" />

          {/* Order Details */}
          <div className="space-y-0.5 text-[9.5px]">
            <div className="flex justify-between">
              <span>Order No:</span>
              <span className="font-bold">{cleanOrderId}</span>
            </div>
            <div className="flex justify-between">
              <span>Date:</span>
              <span>{orderDate}</span>
            </div>
            <div className="flex justify-between">
              <span>Customer Name:</span>
              <span className="font-bold truncate max-w-[150px]">{customerName}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery City:</span>
              <span className="truncate max-w-[150px]">{customerCity}</span>
            </div>
          </div>

          <div className="border-b border-dashed border-black my-1.5" />

          {/* Customer Appreciation Message (Devoted yet safe from discarding/waste) */}
          <div className="py-1 space-y-1">
            <p className="font-bold text-[10px] text-neutral-900">
              Dear {customerName},
            </p>
            <p className="text-[9px] leading-tight text-neutral-900 font-sans">
              Thank you for shopping with <strong>Madhav Shringaar</strong>! We deeply appreciate your trust in our handcrafted collections. We hope these items bring joy and elegance to your home.
            </p>
          </div>

          <div className="border-b border-dashed border-black my-1.5" />

          {/* Care Instructions */}
          <div className="space-y-1 text-[8.5px] font-sans">
            <p className="font-bold uppercase tracking-wide text-center font-mono text-[9px]">
              ★ Product Care Guidelines ★
            </p>
            <ul className="space-y-1 list-none pl-0">
              <li className="flex items-start gap-1">
                <span>1.</span>
                <span><strong>Gentle Handling:</strong> Handle fine fabrics, zari and stone work with clean, dry hands.</span>
              </li>
              <li className="flex items-start gap-1">
                <span>2.</span>
                <span><strong>No Machine Wash:</strong> Do not machine wash or soak delicate garments. Use a soft dry brush for gentle dusting.</span>
              </li>
              <li className="flex items-start gap-1">
                <span>3.</span>
                <span><strong>Safe Storage:</strong> Keep wrapped in clean muslin cloth or butter paper in a moisture-free pouch.</span>
              </li>
              <li className="flex items-start gap-1">
                <span>4.</span>
                <span><strong>Accessories:</strong> Store metallic and stone accessories separately to prevent fabric snagging.</span>
              </li>
            </ul>
          </div>

          <div className="border-b border-dashed border-black my-1.5" />

          {/* Items In Order Summary */}
          <div className="space-y-1 text-[8.5px]">
            <p className="font-bold uppercase text-[9px]">Items In Your Package:</p>
            {order.orderitems?.map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between items-start gap-1 text-[8.5px]">
                <span className="truncate max-w-[195px]">
                  {idx + 1}. {item.name} {item.size ? `(${item.size})` : ''}
                </span>
                <span className="font-bold shrink-0">x{item.qty}</span>
              </div>
            ))}
          </div>

          <div className="border-b border-dashed border-black my-1.5" />

          {/* Help & Support */}
          <div className="text-center space-y-0.5 text-[8px]">
            <p className="font-bold">WhatsApp / Support: +91 79821 60480</p>
            <p>Email: info@madhavshringaar.com</p>
            <p className="font-bold">www.madhavshringaar.com</p>
            <p className="text-[7.5px] text-neutral-600 pt-0.5">
              Have feedback or need assistance? Reach out to our customer care team anytime!
            </p>
          </div>

          <div className="text-center pt-2">
            <p className="text-[7px] tracking-widest uppercase">*** THANK YOU FOR YOUR TRUST ***</p>
          </div>
        </div>
      </div>
    </div>
  );
}
