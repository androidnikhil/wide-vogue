'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Printer, ArrowLeft } from 'lucide-react';
import { formatCurrency, formatDateTime } from '@/lib/utils';

interface InvoiceClientProps {
  order: any;
}

export default function InvoiceClient({ order }: InvoiceClientProps) {
  const handlePrint = () => {
    window.print();
  };

  const cleanOrderId = `OD${order.id.replace(/-/g, '').slice(0, 16).toUpperCase()}`;
  const invoiceNumber = `INV-MS-${order.id.slice(0, 8).toUpperCase()}`;
  const orderDate = formatDateTime(new Date(order.createdAt)).dateOnly;
  const address = order.shippingAddress || {};

  const itemsTotal = Number(order.itemsPrice || 0);
  const shippingTotal = Number(order.shippingPrice || 0);
  const discountTotal = Number(order.discountPrice || 0);
  const giftCardTotal = Number(order.giftCardAmount || 0);
  const grandTotal = Number(order.totalPrice || 0);

  return (
    <div className="min-h-screen bg-neutral-100 py-6 print:py-0 print:bg-white text-neutral-900 font-sans">
      {/* Top Action Bar (Hidden when printing) */}
      <div className="max-w-4xl mx-auto mb-4 px-4 print:hidden flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-xl border-neutral-300 text-xs font-semibold gap-1.5 bg-white hover:bg-neutral-50 shadow-xs text-neutral-800"
          >
            <Link href={`/admin/orders/${order.id}`}>
              <ArrowLeft className="w-3.5 h-3.5 text-[#003020]" />
              Admin Portal
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-xs text-neutral-600 hover:text-neutral-900"
          >
            <Link href={`/order/${order.id}`}>
              Back to Order
            </Link>
          </Button>
        </div>

        <Button
          onClick={handlePrint}
          size="sm"
          className="bg-[#003020] hover:bg-[#002518] text-[#F3D98F] rounded-xl text-xs font-bold gap-1.5 shadow-md h-9 px-4 active:scale-95 transition-all"
        >
          <Printer className="w-4 h-4 text-[#F3D98F]" />
          Print / Save PDF (1-Page A4)
        </Button>
      </div>

      {/* Strict 1-Page A4 Printable Container */}
      <div className="flex justify-center">
        <div
          id="printable-invoice"
          className="w-full max-w-[210mm] bg-white rounded-xl print:rounded-none border border-neutral-200 print:border-none shadow-lg print:shadow-none p-6 print:p-0 text-neutral-900 font-sans"
        >
          <div className="space-y-3 text-xs leading-normal">
            
            {/* Header & Letterhead */}
            <div className="flex items-start justify-between gap-4 pb-2.5 border-b-2 border-[#003020]">
              <div className="space-y-0.5 max-w-md">
                <div className="flex items-center gap-2 pb-1">
                  <Image
                    src="/images/logo.png"
                    alt="Madhav Shringaar"
                    width={220}
                    height={65}
                    className="h-14 w-auto object-contain"
                    priority
                    unoptimized
                  />
                </div>
                <p className="text-[10px] text-neutral-600 leading-tight">
                  Operating Hubs: <strong>Agra & Noida</strong> (Uttar Pradesh / Delhi NCR)
                </p>
                <p className="text-[10px] text-neutral-500 leading-tight">
                  Sacred Workshop: Raman Reti Road, Vrindavan Dham, Mathura - 281121, UP, India
                </p>
                <p className="text-[10px] text-neutral-600 font-mono pt-0.5">
                  GSTIN: <strong className="text-neutral-900">09EHFPP7126A1ZE</strong> • MSME: <strong className="text-neutral-900">UDYAM-UP-01-0152376</strong>
                </p>
                <p className="text-[10px] text-neutral-600">
                  Helpline: <strong>+91 79821 60480</strong> • Email: info@madhavshringaar.com
                </p>
              </div>

              <div className="text-right space-y-0.5 shrink-0">
                <div className="inline-block px-2.5 py-0.5 bg-[#FAF7F0] border border-[#E6C16A] text-[#003020] font-serif font-bold text-[10px] tracking-wider uppercase rounded">
                  Tax Invoice / Bill of Supply
                </div>
                <div className="pt-1 text-[10px] space-y-0.5 text-neutral-700">
                  <p>Invoice No: <strong className="font-mono text-neutral-900">{invoiceNumber}</strong></p>
                  <p>Invoice Date: <strong>{orderDate}</strong></p>
                  <p>Order ID: <strong className="font-mono text-neutral-900">{cleanOrderId}</strong></p>
                  <p>Place of Supply: <strong>{address.state || 'Uttar Pradesh'}, India (09)</strong></p>
                </div>
              </div>
            </div>

            {/* Courier Delivery Instruction Strip */}
            {order.isPaid ? (
              order.paymentMethod === 'CashOnDelivery' ? (
                <div className="p-1.5 px-2.5 bg-emerald-50 border border-emerald-400 rounded-md flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-emerald-900 uppercase">✓ Cash Collected (COD Paid):</span>
                    <span className="text-[10px] text-emerald-800">Cash payment collected in full for this parcel.</span>
                  </div>
                  <div className="font-mono font-bold text-emerald-950 text-xs shrink-0 pl-2">
                    Paid: {formatCurrency(grandTotal)}
                  </div>
                </div>
              ) : (
                <div className="p-1.5 px-2.5 bg-emerald-50 border border-emerald-400 rounded-md flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-emerald-900 uppercase">✓ Prepaid Order (Paid):</span>
                    <span className="text-[10px] text-emerald-800">Paid securely via {order.paymentMethod}. Deliver parcel without collecting cash.</span>
                  </div>
                  <div className="font-mono font-bold text-emerald-950 text-xs shrink-0 pl-2">
                    Prepaid: {formatCurrency(grandTotal)}
                  </div>
                </div>
              )
            ) : order.paymentMethod === 'CashOnDelivery' ? (
              <div className="p-1.5 px-2.5 bg-amber-50 border border-amber-400 rounded-md flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-amber-900 uppercase">📦 Cash on Delivery (COD - Collect Cash):</span>
                  <span className="text-[10px] text-amber-800">Courier delivery boy must collect exact cash from recipient upon handover.</span>
                </div>
                <div className="font-mono font-bold text-amber-950 text-xs shrink-0 pl-2">
                  Collect Cash: {formatCurrency(grandTotal)}
                </div>
              </div>
            ) : (
              <div className="p-1.5 px-2.5 bg-rose-50 border border-rose-400 rounded-md flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-rose-900 uppercase">⚠️ Payment Pending / Unpaid:</span>
                  <span className="text-[10px] text-rose-800">Transaction via {order.paymentMethod} is pending verification. Do not deliver as prepaid.</span>
                </div>
                <div className="font-mono font-bold text-rose-950 text-xs shrink-0 pl-2">
                  Amount Due: {formatCurrency(grandTotal)}
                </div>
              </div>
            )}

            {/* Customer & Shipping 2-Column Info */}
            <div className="grid grid-cols-2 gap-4 bg-neutral-50/70 p-2.5 rounded-md border border-neutral-200 text-[10px]">
              <div>
                <p className="font-bold text-[#003020] uppercase tracking-wider text-[9px] mb-0.5">
                  Billed & Shipped To:
                </p>
                <p className="font-bold text-[11px] text-neutral-900">{address.fullName || order.user?.name || 'Customer'}</p>
                <p className="text-neutral-700 leading-snug">
                  {address.streetAddress}<br />
                  {address.city}, {address.state} - <strong>{address.postalCode}</strong>
                </p>
                <p className="text-neutral-800 font-semibold pt-0.5">
                  Phone: +91 {address.contactNumber}
                </p>
                {address.guestEmail && (
                  <p className="text-neutral-600 truncate">Email: {address.guestEmail}</p>
                )}
              </div>

              <div className="border-l border-neutral-200 pl-3 space-y-0.5">
                <p className="font-bold text-[#003020] uppercase tracking-wider text-[9px] mb-0.5">
                  Logistics & Dispatch:
                </p>
                <p className="flex justify-between">
                  <span className="text-neutral-500">Payment Status:</span>
                  <strong className={order.isPaid ? 'text-emerald-700 font-bold' : order.paymentMethod === 'CashOnDelivery' ? 'text-amber-800 font-bold' : 'text-rose-700 font-bold'}>
                    {order.isPaid ? 'PAID' : order.paymentMethod === 'CashOnDelivery' ? 'COD (UNPAID)' : 'PENDING / UNPAID'}
                  </strong>
                </p>
                <p className="flex justify-between">
                  <span className="text-neutral-500">Payment Mode:</span>
                  <strong>{order.paymentMethod}</strong>
                </p>
                <p className="flex justify-between">
                  <span className="text-neutral-500">Courier Partner:</span>
                  <span>{order.shippingCarrier || 'Shiprocket / Express Courier'}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-neutral-500">Tracking AWB:</span>
                  <strong className="font-mono">{order.awbNumber || 'Affixed to parcel'}</strong>
                </p>
                <p className="flex justify-between">
                  <span className="text-neutral-500">Fulfillment Hub:</span>
                  <span>Agra & Noida Dispatch Facility</span>
                </p>
              </div>
            </div>

            {/* Itemized Products Table */}
            <table className="w-full text-left text-[10px] border border-neutral-200 rounded-md overflow-hidden">
              <thead className="bg-[#003020] text-[#F3D98F] uppercase text-[9px] tracking-wider font-semibold">
                <tr>
                  <th className="py-1 px-2 w-7 text-center">#</th>
                  <th className="py-1 px-2">Description of Sacred Goods</th>
                  <th className="py-1 px-2 w-14 text-center">HSN</th>
                  <th className="py-1 px-2 w-10 text-center">Qty</th>
                  <th className="py-1 px-2 w-16 text-right">Unit Rate</th>
                  <th className="py-1 px-2 w-16 text-right">Taxable</th>
                  <th className="py-1 px-2 w-20 text-right">Total (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {order.orderitems?.map((item: any, idx: number) => {
                  const unitPrice = Number(item.price);
                  const itemTotal = unitPrice * item.qty;
                  return (
                    <tr key={idx} className="hover:bg-neutral-50/50">
                      <td className="py-1 px-2 text-center text-neutral-500">{idx + 1}</td>
                      <td className="py-1 px-2">
                        <div className="font-semibold text-neutral-900">{item.name}</div>
                        <div className="text-[9px] text-neutral-500">
                          Handcrafted Deity Seva Craft{item.size ? ` • Size: ${item.size} No.` : ''}
                        </div>
                      </td>
                      <td className="py-1 px-2 text-center text-neutral-600 font-mono text-[9px]">6204</td>
                      <td className="py-1 px-2 text-center font-bold text-neutral-900">{item.qty}</td>
                      <td className="py-1 px-2 text-right font-mono">{formatCurrency(unitPrice)}</td>
                      <td className="py-1 px-2 text-right font-mono">{formatCurrency(itemTotal)}</td>
                      <td className="py-1 px-2 text-right font-bold text-neutral-900 font-mono">
                        {formatCurrency(itemTotal)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Financial Calculation & Breakdown */}
            <div className="flex justify-end pt-0.5">
              <div className="w-60 space-y-0.5 text-[10px] text-neutral-700">
                <div className="flex justify-between">
                  <span>Items Subtotal:</span>
                  <span className="font-mono">{formatCurrency(itemsTotal)}</span>
                </div>
                {shippingTotal > 0 ? (
                  <div className="flex justify-between">
                    <span>Shipping Charges:</span>
                    <span className="font-mono">{formatCurrency(shippingTotal)}</span>
                  </div>
                ) : (
                  <div className="flex justify-between text-emerald-700">
                    <span>Shipping:</span>
                    <span className="font-semibold">FREE</span>
                  </div>
                )}
                {discountTotal > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount:</span>
                    <span className="font-mono">-{formatCurrency(discountTotal)}</span>
                  </div>
                )}
                {giftCardTotal > 0 && (
                  <div className="flex justify-between text-amber-700">
                    <span>Gift Card / Voucher:</span>
                    <span className="font-mono">-{formatCurrency(giftCardTotal)}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-500 text-[9px]">
                  <span>Integrated GST (Included):</span>
                  <span className="font-mono">{formatCurrency(order.taxPrice || 0)}</span>
                </div>
                <div className="flex justify-between items-center py-1 px-2 text-xs font-bold text-[#003020] bg-[#FAF7F0] rounded border border-[#E6C16A]/60 mt-0.5">
                  <span>Grand Total:</span>
                  <span className="font-mono text-sm">{formatCurrency(grandTotal)}</span>
                </div>
              </div>
            </div>

            {/* Legal Declaration & Authorized Signature */}
            <div className="pt-1.5 border-t border-neutral-200 flex items-center justify-between gap-4 text-[9px] text-neutral-600">
              <div>
                <p className="font-bold text-neutral-800">Declaration & Terms:</p>
                <p className="text-neutral-500 leading-tight">
                  This is a computer-generated tax invoice and bill of supply. 7-day reverent exchange promise for transit damages.
                </p>
                <p className="text-neutral-500">Operating from Agra & Noida Hubs • Subject to Agra jurisdiction.</p>
              </div>

              <div className="text-right shrink-0">
                <p className="font-serif font-bold text-[#003020] text-[11px]">For MADHAV SHRINGAAR</p>
                <p className="text-[8px] text-[#C88A20] font-medium tracking-wider">Agra & Noida • Vrindavan Seva</p>
                <p className="pt-2 font-semibold text-neutral-700 text-[9px]">Authorized Signatory</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Strict 1-Page A4 Isolation Print Styles */}
      <style jsx global>{`
        @page {
          size: A4 portrait;
          margin: 0 !important;
        }
        @media print {
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            height: 100% !important;
            overflow: hidden !important;
            background: #fff !important;
            color: #000 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          /* Hide EVERYTHING in body */
          body * {
            visibility: hidden !important;
          }
          /* Expose ONLY the printable invoice */
          #printable-invoice,
          #printable-invoice * {
            visibility: visible !important;
          }
          #printable-invoice {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important;
            max-width: 210mm !important;
            box-sizing: border-box !important;
            padding: 8mm 10mm !important;
            margin: 0 !important;
            background: white !important;
            border: none !important;
            box-shadow: none !important;
            page-break-inside: avoid !important;
            page-break-after: avoid !important;
            page-break-before: avoid !important;
            break-inside: avoid !important;
            break-after: avoid !important;
          }
        }
      `}</style>
    </div>
  );
}
