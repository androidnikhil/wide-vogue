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
  const address = order.shippingAddress;

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
              Customer View
            </Link>
          </Button>
        </div>

        <Button
          onClick={handlePrint}
          size="sm"
          className="bg-[#003020] hover:bg-[#002518] text-[#F3D98F] rounded-xl text-xs font-bold gap-1.5 shadow-md h-9 px-4 active:scale-95 transition-all"
        >
          <Printer className="w-4 h-4" />
          Print / Save PDF (1-Page A4)
        </Button>
      </div>

      {/* Strict 1-Page A4 Invoice Sheet */}
      <div className="invoice-sheet max-w-[210mm] mx-auto bg-white shadow-xl print:shadow-none print:m-0 print:p-0 print:max-w-none rounded-xl print:rounded-none overflow-hidden border border-neutral-200 print:border-none">
        <div className="p-6 md:p-8 print:p-4 space-y-3.5 text-xs">
          
          {/* Header & Letterhead */}
          <div className="flex items-start justify-between gap-4 pb-3 border-b-2 border-[#003020]">
            <div className="space-y-1 max-w-md">
              <div className="flex items-center gap-2">
                <Image
                  src="/images/logo.png"
                  alt="Madhav Shringaar"
                  width={180}
                  height={55}
                  className="h-12 w-auto object-contain"
                  priority
                  unoptimized
                />
              </div>
              <p className="font-bold text-[#003020] text-sm leading-tight">Madhav Shringaar Private Limited</p>
              <p className="text-[11px] text-neutral-600 leading-tight">
                Operating Hubs: <strong>Agra & Noida</strong> (Uttar Pradesh / Delhi NCR)
              </p>
              <p className="text-[11px] text-neutral-500 leading-tight">
                Sacred Workshop: Raman Reti Road, Vrindavan Dham, Mathura - 281121, UP, India
              </p>
              <p className="text-[11px] text-neutral-600 font-mono pt-0.5">
                GSTIN: <strong className="text-neutral-900">09EHFPP7126A1ZE</strong> • MSME: <strong className="text-neutral-900">UDYAM-UP-01-0152376</strong>
              </p>
              <p className="text-[11px] text-neutral-600">
                Helpline: <strong>+91 79821 60480</strong> • Email: info@madhavshringaar.com
              </p>
            </div>

            <div className="text-right space-y-1 shrink-0">
              <div className="inline-block px-3 py-1 bg-[#FAF7F0] border border-[#E6C16A] text-[#003020] font-serif font-bold text-xs tracking-wider uppercase rounded-md">
                Tax Invoice / Bill of Supply
              </div>
              <div className="pt-1 text-[11px] space-y-0.5 text-neutral-700">
                <p>Invoice No: <strong className="font-mono text-neutral-900 text-xs">{invoiceNumber}</strong></p>
                <p>Invoice Date: <strong>{orderDate}</strong></p>
                <p>Order ID: <strong className="font-mono text-neutral-900 text-xs">{cleanOrderId}</strong></p>
                <p>Place of Supply: <strong>{address.state}, India (Code: 09)</strong></p>
              </div>
            </div>
          </div>

          {/* Courier Delivery Instruction Strip */}
          {!order.isPaid && order.paymentMethod === 'CashOnDelivery' ? (
            <div className="p-2 bg-amber-50 border border-amber-400 rounded-lg flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-amber-900 uppercase">📦 Cash on Delivery (COD):</span>
                <span className="text-[11px] text-amber-800">Courier delivery boy must collect exact cash from recipient.</span>
              </div>
              <div className="font-mono font-bold text-amber-950 text-xs shrink-0 pl-2">
                Collect: {formatCurrency(grandTotal)}
              </div>
            </div>
          ) : (
            <div className="p-2 bg-emerald-50 border border-emerald-400 rounded-lg flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-emerald-900 uppercase">✓ Prepaid Order:</span>
                <span className="text-[11px] text-emerald-800">Paid securely via {order.paymentMethod}. Deliver parcel without collecting cash.</span>
              </div>
              <div className="font-mono font-bold text-emerald-950 text-xs shrink-0 pl-2">
                Prepaid: {formatCurrency(grandTotal)}
              </div>
            </div>
          )}

          {/* Customer & Shipping 2-Column Info */}
          <div className="grid grid-cols-2 gap-4 bg-neutral-50/70 p-3 rounded-lg border border-neutral-200 text-[11px]">
            <div>
              <p className="font-bold text-neutral-800 uppercase tracking-wider text-[10px] text-[#003020] mb-1">
                Billed & Shipped To:
              </p>
              <p className="font-bold text-xs text-neutral-900">{address.fullName}</p>
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

            <div className="border-l border-neutral-200 pl-4 space-y-1">
              <p className="font-bold text-neutral-800 uppercase tracking-wider text-[10px] text-[#003020] mb-1">
                Logistics & Dispatch:
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
          <table className="w-full text-left text-[11px] border border-neutral-200 rounded-md overflow-hidden">
            <thead className="bg-[#003020] text-[#F3D98F] uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="py-1.5 px-2 w-8 text-center">#</th>
                <th className="py-1.5 px-2">Description of Sacred Goods</th>
                <th className="py-1.5 px-2 w-16 text-center">HSN</th>
                <th className="py-1.5 px-2 w-12 text-center">Qty</th>
                <th className="py-1.5 px-2 w-20 text-right">Unit Rate</th>
                <th className="py-1.5 px-2 w-20 text-right">Taxable</th>
                <th className="py-1.5 px-2 w-20 text-right">Total (INR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {order.orderitems.map((item: any, idx: number) => {
                const unitPrice = Number(item.price);
                const itemTotal = unitPrice * item.qty;
                return (
                  <tr key={idx} className="hover:bg-neutral-50/50">
                    <td className="py-1.5 px-2 text-center text-neutral-500">{idx + 1}</td>
                    <td className="py-1.5 px-2">
                      <div className="font-semibold text-neutral-900">{item.name}</div>
                      <div className="text-[10px] text-neutral-500">
                        Handcrafted Deity Seva Craft{item.size ? ` • Size: ${item.size} No.` : ''}
                      </div>
                    </td>
                    <td className="py-1.5 px-2 text-center text-neutral-600 font-mono text-[10px]">6204</td>
                    <td className="py-1.5 px-2 text-center font-bold text-neutral-900">{item.qty}</td>
                    <td className="py-1.5 px-2 text-right font-mono">{formatCurrency(unitPrice)}</td>
                    <td className="py-1.5 px-2 text-right font-mono">{formatCurrency(itemTotal)}</td>
                    <td className="py-1.5 px-2 text-right font-bold text-neutral-900 font-mono">
                      {formatCurrency(itemTotal)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Financial Calculation & Breakdown */}
          <div className="flex justify-end pt-1">
            <div className="w-64 space-y-1 text-[11px] text-neutral-700">
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
              <div className="flex justify-between text-neutral-500 text-[10px]">
                <span>Integrated GST (Included):</span>
                <span className="font-mono">{formatCurrency(order.taxPrice || 0)}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 px-2 text-sm font-bold text-[#003020] bg-[#FAF7F0] rounded border border-[#E6C16A]/50 mt-1">
                <span>Grand Total:</span>
                <span className="font-mono text-base">{formatCurrency(grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* Legal Declaration & Authorized Signature */}
          <div className="pt-2 border-t border-neutral-200 flex items-center justify-between gap-4 text-[10px] text-neutral-600">
            <div>
              <p className="font-bold text-neutral-800">Declaration & Terms:</p>
              <p className="text-neutral-500 leading-tight">
                This is a computer-generated tax invoice and bill of supply. 7-day reverent exchange promise for transit damages.
              </p>
              <p className="text-neutral-500">Operating from Agra & Noida Hubs • Subject to Agra jurisdiction.</p>
            </div>

            <div className="text-right shrink-0">
              <p className="font-serif font-bold text-[#003020] text-xs">For MADHAV SHRINGAAR</p>
              <p className="text-[9px] text-[#C88A20] font-medium tracking-wider">Agra & Noida • Vrindavan Seva</p>
              <p className="pt-4 font-semibold text-neutral-700 text-[10px]">Authorized Signatory</p>
            </div>
          </div>

        </div>
      </div>

      {/* Strict 1-Page A4 Portrait CSS */}
      <style jsx global>{`
        @page {
          size: A4 portrait;
          margin: 6mm 8mm;
        }
        @media print {
          html, body {
            background: white !important;
            color: #000 !important;
            margin: 0 !important;
            padding: 0 !important;
            height: auto !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .invoice-sheet {
            max-width: 100% !important;
            width: 100% !important;
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            padding: 0 !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            page-break-after: avoid !important;
            break-after: avoid !important;
          }
          header, footer, nav, #main-header, button {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
