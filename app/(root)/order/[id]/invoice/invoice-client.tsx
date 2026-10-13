'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Printer, ArrowLeft, ShieldCheck, CheckCircle2, PackageCheck, Truck } from 'lucide-react';
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
    <div className="min-h-screen bg-neutral-100 py-6 print:py-0 print:bg-white text-neutral-900">
      {/* Top Action Bar (Hidden when printing / downloading PDF) */}
      <div className="max-w-4xl mx-auto mb-6 px-4 print:hidden flex items-center justify-between gap-4">
        <Button
          asChild
          variant="outline"
          className="rounded-xl border-neutral-300 text-xs font-semibold gap-2 bg-white hover:bg-neutral-50 shadow-xs"
        >
          <Link href={`/order/${order.id}`}>
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Order Details
          </Link>
        </Button>

        <div className="flex items-center gap-3">
          <Button
            onClick={handlePrint}
            className="bg-[#003020] hover:bg-[#002518] text-[#F3D98F] rounded-xl text-xs font-semibold gap-2 shadow-md h-10 px-5 active:scale-95 transition-all"
          >
            <Printer className="w-4 h-4" />
            Print / Save A4 Invoice PDF
          </Button>
        </div>
      </div>

      {/* Standard A4 Printable Invoice Sheet (210mm x 297mm) */}
      <div className="invoice-sheet max-w-[210mm] mx-auto bg-white shadow-xl print:shadow-none print:m-0 print:p-0 print:max-w-none rounded-2xl print:rounded-none overflow-hidden border border-neutral-200/80 print:border-none">
        <div className="p-8 md:p-12 print:p-6 space-y-5">
          {/* Header & Brand Letterhead */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-5 border-b-2 border-[#003020]">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Image
                  src="/images/logo.png"
                  alt="Madhav Shringaar"
                  width={200}
                  height={75}
                  className="h-16 w-auto object-contain"
                  priority
                  unoptimized
                />
              </div>
              <div className="text-xs text-neutral-600 space-y-0.5 pt-1">
                <p className="font-bold text-[#003020] text-sm">Madhav Shringaar Private Limited</p>
                <p className="font-semibold text-neutral-800">Operating Hubs: Agra & Noida (Delhi NCR / UP)</p>
                <p>Sacred Workshop: Raman Reti Road, Vrindavan Dham, Mathura - 281121, UP, India</p>
                <p>Devotee Care / WhatsApp: <strong>+91 79821 60480</strong> | Email: info@madhavshringaar.com</p>
                <p className="text-[11px] text-neutral-500 font-mono">
                  GSTIN: 09AAAFM1234F1Z5 • MSME: UDYAM-UP-55-0012891
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right space-y-1 shrink-0">
              <span className="inline-block px-3 py-1 bg-[#FAF7F0] border border-[#E6C16A] text-[#003020] font-serif font-bold text-xs tracking-wider uppercase rounded-lg">
                Tax Invoice / Bill of Supply
              </span>
              <div className="pt-2 text-xs space-y-1 font-medium text-neutral-700">
                <p>
                  <span className="text-neutral-500">Invoice No: </span>
                  <strong className="font-mono text-[#003020]">{invoiceNumber}</strong>
                </p>
                <p>
                  <span className="text-neutral-500">Invoice Date: </span>
                  <strong>{orderDate}</strong>
                </p>
                <p>
                  <span className="text-neutral-500">Order ID: </span>
                  <strong className="font-mono text-neutral-900 text-[12px]">{cleanOrderId}</strong>
                </p>
                <p>
                  <span className="text-neutral-500">Database Ref: </span>
                  <span className="font-mono text-[10px] text-neutral-500">{order.id.slice(0, 12)}...</span>
                </p>
                <p>
                  <span className="text-neutral-500">Place of Supply: </span>
                  <strong>{address.state}, India (State Code: 09)</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Delivery & Packing Pouch Instructions Banner */}
          {!order.isPaid && order.paymentMethod === 'CashOnDelivery' ? (
            <div className="p-3 bg-amber-50/90 border-2 border-amber-400 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">⚠️</span>
                <div>
                  <p className="font-black text-amber-950 uppercase tracking-wide text-xs">
                    Cash on Delivery (COD) — Collect Payment at Doorstep
                  </p>
                  <p className="text-[11px] text-amber-800">
                    Courier delivery executive must collect exact cash from recipient before opening box.
                  </p>
                </div>
              </div>
              <div className="text-right pl-4 shrink-0">
                <p className="text-[10px] text-amber-800 font-bold uppercase">Cash to Collect</p>
                <p className="text-lg font-mono font-black text-amber-950">{formatCurrency(grandTotal)}</p>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-emerald-50/90 border-2 border-emerald-400 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">✅</span>
                <div>
                  <p className="font-black text-emerald-950 uppercase tracking-wide text-xs">
                    Prepaid Order — Do Not Collect Cash
                  </p>
                  <p className="text-[11px] text-emerald-800">
                    Payment verified via {order.paymentMethod}. Hand over package directly to devotee.
                  </p>
                </div>
              </div>
              <div className="text-right pl-4 shrink-0">
                <p className="text-[10px] text-emerald-800 font-bold uppercase">Prepaid Amount</p>
                <p className="text-lg font-mono font-black text-emerald-950">{formatCurrency(grandTotal)}</p>
              </div>
            </div>
          )}

          {/* Customer Billed To / Shipped To Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-[#FAF7F0]/40 p-4 rounded-xl border border-neutral-200/80 text-xs">
            <div className="space-y-1">
              <h3 className="font-bold uppercase tracking-wider text-[11px] text-[#003020] flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C88A20]" />
                Customer Shipping Address
              </h3>
              <p className="font-bold text-sm text-neutral-900 pt-1">{address.fullName}</p>
              <p className="text-neutral-700 leading-relaxed">
                {address.streetAddress}<br />
                {address.city}, {address.state} - <strong>{address.postalCode}</strong><br />
                {address.country}
              </p>
              <p className="text-neutral-800 pt-1 font-semibold">
                Contact: +91 {address.contactNumber}
              </p>
              {address.guestEmail && (
                <p className="text-neutral-600">Email: {address.guestEmail}</p>
              )}
            </div>

            <div className="space-y-1 md:border-l md:border-neutral-200 md:pl-5">
              <h3 className="font-bold uppercase tracking-wider text-[11px] text-[#003020] flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#0F6F74]" />
                Logistics & Dispatch Information
              </h3>
              <div className="pt-1 space-y-1.5">
                <p className="flex justify-between">
                  <span className="text-neutral-500">Payment Mode:</span>
                  <strong className="text-neutral-900">{order.paymentMethod}</strong>
                </p>
                <p className="flex justify-between">
                  <span className="text-neutral-500">Payment Status:</span>
                  <strong className={order.isPaid ? 'text-emerald-700' : 'text-amber-700'}>
                    {order.isPaid ? 'PAID / CONFIRMED' : 'PENDING (COD)'}
                  </strong>
                </p>
                <p className="flex justify-between">
                  <span className="text-neutral-500">Shipping Partner:</span>
                  <strong className="text-neutral-900">{order.shippingCarrier || 'Shiprocket / Express Courier'}</strong>
                </p>
                <p className="flex justify-between">
                  <span className="text-neutral-500">AWB Tracking No:</span>
                  <strong className="font-mono text-neutral-900">
                    {order.awbNumber || 'Assigned upon Packing'}
                  </strong>
                </p>
                <p className="flex justify-between">
                  <span className="text-neutral-500">Fulfillment Hub:</span>
                  <span>Agra & Noida Dispatch Facility</span>
                </p>
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-neutral-200 rounded-lg overflow-hidden">
              <thead className="bg-[#003020] text-[#F3D98F] uppercase text-[11px] tracking-wider font-semibold">
                <tr>
                  <th className="p-2.5 w-10 text-center">#</th>
                  <th className="p-2.5">Sacred Item & Specifications</th>
                  <th className="p-2.5 w-20 text-center">HSN Code</th>
                  <th className="p-2.5 w-14 text-center">Qty</th>
                  <th className="p-2.5 w-24 text-right">Unit Rate</th>
                  <th className="p-2.5 w-24 text-right">Taxable</th>
                  <th className="p-2.5 w-24 text-right">Total (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {order.orderitems.map((item: any, idx: number) => {
                  const unitPrice = Number(item.price);
                  const itemTotal = unitPrice * item.qty;
                  return (
                    <tr key={idx} className="hover:bg-neutral-50/50">
                      <td className="p-2.5 text-center text-neutral-500">{idx + 1}</td>
                      <td className="p-2.5">
                        <div className="font-semibold text-neutral-900">{item.name}</div>
                        <div className="text-[10px] text-neutral-500">
                          Handcrafted Shri Laddu Gopal Ji Seva Craft
                          {item.size && ` • Size: ${item.size} No.`}
                        </div>
                      </td>
                      <td className="p-2.5 text-center text-neutral-600 font-mono">6204</td>
                      <td className="p-2.5 text-center font-bold text-neutral-900">{item.qty}</td>
                      <td className="p-2.5 text-right font-mono">{formatCurrency(unitPrice)}</td>
                      <td className="p-2.5 text-right font-mono">{formatCurrency(itemTotal)}</td>
                      <td className="p-2.5 text-right font-bold text-neutral-900 font-mono">
                        {formatCurrency(itemTotal)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Financial Calculation Breakdown */}
          <div className="flex flex-col sm:flex-row justify-between gap-6 pt-2">
            <div className="max-w-xs space-y-2 text-xs text-neutral-600">
              <div className="p-3 rounded-xl bg-[#FAF7F0] border border-[#E6C16A]/50 space-y-1">
                <p className="font-bold text-[#003020] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C88A20]" />
                  100% Deity Safe Assurance
                </p>
                <p className="text-[11px] text-neutral-600 leading-relaxed">
                  Handcrafted with pure devotion in Vrindavan Dham and dispatched from Agra & Noida. All items are non-scratch and sanitized for divine altar worship.
                </p>
              </div>
            </div>

            <div className="w-full sm:w-80 space-y-2 text-xs">
              <div className="space-y-1.5 pb-2.5 border-b border-neutral-200 text-neutral-700">
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
                    <span>Pan-India Delivery:</span>
                    <span className="font-semibold">FREE</span>
                  </div>
                )}
                {discountTotal > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount Applied:</span>
                    <span className="font-mono">-{formatCurrency(discountTotal)}</span>
                  </div>
                )}
                {giftCardTotal > 0 && (
                  <div className="flex justify-between text-amber-700">
                    <span>Gift Card / Voucher Applied:</span>
                    <span className="font-mono">-{formatCurrency(giftCardTotal)}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-500 text-[11px]">
                  <span>Integrated GST (Included):</span>
                  <span className="font-mono">{formatCurrency(order.taxPrice || 0)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-2 text-base font-bold text-[#003020] bg-[#FAF7F0] px-3 rounded-lg">
                <span>Grand Total:</span>
                <span className="font-mono text-lg text-[#003020]">{formatCurrency(grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* Warehouse Packing Checklist Section */}
          <div className="border border-neutral-200 rounded-xl p-3 bg-neutral-50/70 text-[11px] grid grid-cols-1 sm:grid-cols-3 gap-2 text-neutral-600">
            <div>
              <strong className="text-neutral-800 block">Packaging Checklist:</strong>
              <p>✓ Deity poshak & mukut inspected</p>
              <p>✓ Bubble wrap protection verified</p>
            </div>
            <div>
              <strong className="text-neutral-800 block">Courier Packing Pouch:</strong>
              <p>Partner: {order.shippingCarrier || 'Shiprocket Express'}</p>
              <p>AWB: {order.awbNumber || 'Affixed to outer parcel'}</p>
            </div>
            <div className="sm:text-right">
              <strong className="text-neutral-800 block">Altar Quality Check:</strong>
              <p className="text-emerald-700 font-bold">Passed Inspection ✓</p>
              <p>Dispatched from Agra & Noida Hubs</p>
            </div>
          </div>

          {/* Footer Signature & Declaration */}
          <div className="pt-4 border-t border-neutral-200 flex flex-col sm:flex-row justify-between items-end gap-5 text-xs text-neutral-600">
            <div className="space-y-1">
              <p className="font-bold text-[#003020]">Declaration & Customer Policy:</p>
              <p className="text-[11px] text-neutral-500 max-w-md leading-relaxed">
                This invoice confirms the supply of sacred devotional clothing and ornaments. Goods once received in damaged condition are covered under our 7-day exchange promise. For assistance, reach us on WhatsApp (+91 79821 60480).
              </p>
            </div>

            <div className="text-center sm:text-right space-y-2 min-w-[200px]">
              <div className="inline-block p-2 border border-dashed border-[#C88A20] rounded-xl bg-[#FAF7F0] text-center">
                <p className="font-serif text-[#003020] font-bold text-[11px]">MADHAV SHRINGAAR</p>
                <p className="text-[9px] text-[#C88A20] font-medium tracking-widest">AGRA & NOIDA • VRINDAVAN SEVA</p>
              </div>
              <p className="text-[11px] font-semibold text-neutral-700">
                Authorized Signatory
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Print Specific CSS to enforce Standard A4 Portrait Dimensions */}
      <style jsx global>{`
        @page {
          size: A4 portrait;
          margin: 8mm;
        }
        @media print {
          html, body {
            background: white !important;
            color: #000 !important;
            margin: 0 !important;
            padding: 0 !important;
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
          }
          header, footer, nav, #main-header, button {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
