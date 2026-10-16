'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Printer, ArrowLeft, FileText, Receipt, HeartHandshake } from 'lucide-react';
import { formatCurrency, formatDateTime } from '@/lib/utils';

interface AdminInvoiceClientProps {
  order: any;
}

export default function AdminInvoiceClient({ order }: AdminInvoiceClientProps) {
  // Default to 80mm Thermal POS as requested by user
  const [printFormat, setPrintFormat] = useState<'thermal' | 'a4'>('thermal');

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
    <div className="space-y-4 pb-12">
      {/* Top Admin Action Bar (Hidden when printing) */}
      <div className="print:hidden flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs max-w-4xl mx-auto">
        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-xl border-neutral-300 text-xs font-semibold gap-1.5 bg-white hover:bg-neutral-50 shadow-xs text-neutral-800"
          >
            <Link href={`/admin/orders/${order.id}`}>
              <ArrowLeft className="w-3.5 h-3.5 text-[#003020]" />
              Order Details
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-xl border-neutral-300 text-xs font-semibold gap-1.5 bg-white hover:bg-neutral-50"
          >
            <Link href={`/admin/orders/${order.id}/thank-you`}>
              <HeartHandshake className="w-3.5 h-3.5 text-amber-600" />
              Thank You Note
            </Link>
          </Button>
        </div>

        {/* Paper Format Selector */}
        <div className="flex items-center gap-1.5 bg-neutral-100 p-1 rounded-xl border border-neutral-200">
          <button
            type="button"
            onClick={() => setPrintFormat('thermal')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              printFormat === 'thermal'
                ? 'bg-[#003020] text-[#F3D98F] shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            80mm Thermal (POS)
          </button>
          <button
            type="button"
            onClick={() => setPrintFormat('a4')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              printFormat === 'a4'
                ? 'bg-[#003020] text-[#F3D98F] shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            A4 Standard
          </button>
        </div>

        <Button
          onClick={handlePrint}
          size="sm"
          className="bg-[#003020] hover:bg-[#002518] text-[#F3D98F] rounded-xl text-xs font-bold gap-1.5 shadow-md h-9 px-4 active:scale-95 transition-all"
        >
          <Printer className="w-4 h-4 text-[#F3D98F]" />
          Print {printFormat === 'thermal' ? '80mm Thermal Invoice' : 'A4 Invoice'}
        </Button>
      </div>

      {/* ========================================================================= */}
      {/* 1. 80MM THERMAL PRINTER FORMAT (Primary Default)                          */}
      {/* ========================================================================= */}
      {printFormat === 'thermal' && (
        <div className="flex justify-center">
          <div
            id="printable-thermal-invoice"
            className="w-[80mm] max-w-[80mm] min-w-[80mm] bg-white text-black p-3.5 print:p-2 border border-dashed border-neutral-400 print:border-none shadow-md print:shadow-none font-mono text-[10.5px] leading-tight select-none"
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
                #printable-thermal-invoice {
                  width: 79mm !important;
                  max-width: 79mm !important;
                  margin: 0 auto !important;
                  padding: 2mm !important;
                  border: none !important;
                  box-shadow: none !important;
                }
              }
            `}</style>

            {/* Header */}
            <div className="text-center space-y-0.5 pb-1">
              <p className="font-bold text-xs tracking-wider">॥ श्री राधे राधे ॥</p>
              <h1 className="text-sm font-black uppercase tracking-wide">MADHAV SHRINGAAR</h1>
              <p className="text-[9px] uppercase font-semibold">Madhav Shringaar Pvt Ltd</p>
              <p className="text-[8px] text-neutral-700">Hubs: Noida &bull; Agra &bull; Vrindavan</p>
              <p className="text-[8px] font-mono">GSTIN: 09EHFPP7126A1ZE</p>
              <p className="text-[8px]">Helpline: +91 79821 60480</p>
              <p className="text-[8px]">info@madhavshringaar.com</p>
            </div>

            <div className="border-b border-dashed border-black my-1.5" />

            {/* Title & Metadata */}
            <div className="text-center pb-1">
              <p className="font-bold text-[11px] tracking-wide uppercase">*** TAX INVOICE ***</p>
            </div>
            <div className="space-y-0.5 text-[9.5px]">
              <div className="flex justify-between">
                <span>Inv No:</span>
                <span className="font-bold">{invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span>{orderDate}</span>
              </div>
              <div className="flex justify-between">
                <span>Order ID:</span>
                <span className="font-bold">{cleanOrderId}</span>
              </div>
              <div className="flex justify-between">
                <span>Place of Supply:</span>
                <span>{address.state || 'UP'}, India (09)</span>
              </div>
            </div>

            <div className="border-b border-dashed border-black my-1.5" />

            {/* Customer Details */}
            <div className="space-y-0.5 text-[9.5px]">
              <p className="font-bold uppercase text-[9px]">Billed &amp; Shipped To:</p>
              <p className="font-bold">{address.fullName || order.user?.name || 'Customer'}</p>
              <p className="text-[9px] leading-tight">
                {address.streetAddress}, {address.city}, {address.state} - {address.postalCode}
              </p>
              <p className="text-[9px]">Mobile: +91 {address.contactNumber || 'N/A'}</p>
              {address.guestEmail && <p className="text-[8px] truncate">{address.guestEmail}</p>}
            </div>

            <div className="border-b border-dashed border-black my-1.5" />

            {/* Items Table */}
            <div className="space-y-1">
              <div className="grid grid-cols-12 font-bold text-[9px] uppercase border-b border-black pb-0.5">
                <span className="col-span-7">Item</span>
                <span className="col-span-2 text-center">Qty</span>
                <span className="col-span-3 text-right">Amt</span>
              </div>
              {order.orderitems?.map((item: any, idx: number) => (
                <div key={idx} className="grid grid-cols-12 text-[9px] py-0.5 items-start">
                  <div className="col-span-7 pr-1">
                    <p className="font-medium leading-tight">{item.name}</p>
                    {item.size && <p className="text-[8px] text-neutral-700">Size: {item.size}</p>}
                    <p className="text-[8px] text-neutral-600">@{formatCurrency(item.price)}</p>
                  </div>
                  <span className="col-span-2 text-center font-bold">x{item.qty}</span>
                  <span className="col-span-3 text-right font-bold">
                    {formatCurrency(Number(item.price) * item.qty)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-b border-dashed border-black my-1.5" />

            {/* Summary */}
            <div className="space-y-0.5 text-[9.5px]">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span>{formatCurrency(itemsTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery / Shipping:</span>
                <span>{shippingTotal === 0 ? 'FREE (₹0.00)' : formatCurrency(shippingTotal)}</span>
              </div>
              {order.isGiftWrapped && (
                <div className="flex justify-between">
                  <span>Gift Wrapping:</span>
                  <span>{formatCurrency(50)}</span>
                </div>
              )}
              {discountTotal > 0 && (
                <div className="flex justify-between font-bold">
                  <span>Discount ({order.couponCode || 'Coupon'}):</span>
                  <span>-{formatCurrency(discountTotal)}</span>
                </div>
              )}
              {giftCardTotal > 0 && (
                <div className="flex justify-between font-bold">
                  <span>Gift Card ({order.giftCardCode || 'GC'}):</span>
                  <span>-{formatCurrency(giftCardTotal)}</span>
                </div>
              )}
              <div className="border-b border-black my-1" />
              <div className="flex justify-between text-xs font-black">
                <span>NET PAYABLE:</span>
                <span>{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            <div className="border-b border-dashed border-black my-1.5" />

            {/* Payment Status Notice */}
            <div className="text-center py-1">
              {order.isPaid ? (
                <div className="border border-black p-1 space-y-0.5">
                  <p className="font-black text-[10px] uppercase">*** PREPAID &bull; DO NOT COLLECT CASH ***</p>
                  <p className="text-[8.5px]">Payment received via {order.paymentMethod || 'Online Payment'}</p>
                </div>
              ) : order.paymentMethod === 'CashOnDelivery' ? (
                <div className="border-2 border-black p-1 space-y-0.5">
                  <p className="font-black text-[10.5px] uppercase">*** CASH ON DELIVERY (COD) ***</p>
                  <p className="font-bold text-[10px]">COLLECT CASH: {formatCurrency(grandTotal)}</p>
                </div>
              ) : (
                <div className="border border-black p-1">
                  <p className="font-bold text-[9px] uppercase">Payment: {order.paymentMethod}</p>
                </div>
              )}
            </div>

            <div className="border-b border-dashed border-black my-1.5" />

            {/* Return Policy Notice */}
            <div className="space-y-0.5 text-[8px] text-neutral-800 leading-tight">
              <p className="font-bold uppercase text-[8.5px]">Return &amp; Exchange Policy:</p>
              <p>• Accepted only for size issues or defective items.</p>
              <p>• Must report within 48 hours of delivery with clear unboxing video proof.</p>
              <p>• Product must be unused with original packaging intact.</p>
            </div>

            <div className="border-b border-dashed border-black my-1.5" />

            {/* Footer */}
            <div className="text-center space-y-0.5 text-[8px]">
              <p className="font-bold">Thank You For Choosing Madhav Shringaar!</p>
              <p>www.madhavshringaar.com &bull; +91 79821 60480</p>
              <p className="text-[7px] tracking-widest uppercase pt-1">*** RADHE RADHE ***</p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. A4 STANDARD DOCUMENT FORMAT (Optional Full Sheet)                      */}
      {/* ========================================================================= */}
      {printFormat === 'a4' && (
        <div className="flex justify-center">
          <div
            id="printable-invoice"
            className="w-full max-w-[210mm] bg-white rounded-xl print:rounded-none border border-neutral-200 print:border-none shadow-lg print:shadow-none p-6 print:p-0 text-neutral-900 font-sans"
          >
            <style jsx global>{`
              @media print {
                @page {
                  size: A4 portrait;
                  margin: 6mm 8mm;
                }
                body {
                  background: #ffffff !important;
                }
              }
            `}</style>
            <div className="space-y-3 text-xs leading-normal">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 pb-2.5 border-b-2 border-[#003020]">
                <div className="space-y-0.5 max-w-md">
                  <div className="flex items-center gap-2 pb-0.5">
                    <Image
                      src="/images/logo.png"
                      alt="Madhav Shringaar"
                      width={150}
                      height={44}
                      className="h-10 w-auto object-contain"
                      priority
                      unoptimized
                    />
                  </div>
                  <p className="font-bold text-[#003020] text-xs leading-tight">Madhav Shringaar Private Limited</p>
                  <p className="text-[10px] text-neutral-600 leading-tight">
                    Operating Hubs: <strong>Agra &amp; Noida</strong> (Uttar Pradesh / Delhi NCR)
                  </p>
                  <p className="text-[10px] text-neutral-500 leading-tight">
                    Sacred Workshop: Raman Reti Road, Vrindavan Dham, Mathura - 281121, UP, India
                  </p>
                  <p className="text-[10px] text-neutral-600 font-mono pt-0.5">
                    GSTIN: <strong className="text-neutral-900">09EHFPP7126A1ZE</strong> &bull; MSME:{' '}
                    <strong className="text-neutral-900">UDYAM-UP-01-0152376</strong>
                  </p>
                  <p className="text-[10px] text-neutral-600">
                    Helpline: <strong>+91 79821 60480</strong> &bull; Email: info@madhavshringaar.com
                  </p>
                </div>

                <div className="text-right space-y-0.5 shrink-0">
                  <div className="inline-block px-2.5 py-0.5 bg-[#FAF7F0] border border-[#E6C16A] text-[#003020] font-serif font-bold text-[10px] tracking-wider uppercase rounded">
                    Tax Invoice / Bill of Supply
                  </div>
                  <div className="pt-1 text-[10px] space-y-0.5 text-neutral-700">
                    <p>
                      Invoice No: <strong className="font-mono text-neutral-900">{invoiceNumber}</strong>
                    </p>
                    <p>
                      Invoice Date: <strong>{orderDate}</strong>
                    </p>
                    <p>
                      Order ID: <strong className="font-mono text-neutral-900">{cleanOrderId}</strong>
                    </p>
                    <p>
                      Place of Supply: <strong>{address.state || 'Uttar Pradesh'}, India (09)</strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="overflow-hidden border border-neutral-300 rounded-md">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#003020] text-[#F3D98F] text-[10px] uppercase font-bold">
                      <th className="py-1.5 px-2 w-8 text-center">#</th>
                      <th className="py-1.5 px-2">Item Description</th>
                      <th className="py-1.5 px-2 w-16 text-center">Size</th>
                      <th className="py-1.5 px-2 w-12 text-center">Qty</th>
                      <th className="py-1.5 px-2 w-20 text-right">Unit Rate</th>
                      <th className="py-1.5 px-2 w-24 text-right">Net Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {order.orderitems?.map((item: any, index: number) => (
                      <tr key={item.id || index} className="hover:bg-neutral-50/50">
                        <td className="py-1.5 px-2 text-center font-mono text-neutral-500 text-[10px]">
                          {index + 1}
                        </td>
                        <td className="py-1.5 px-2">
                          <p className="font-semibold text-neutral-900">{item.name}</p>
                          <p className="text-[10px] text-neutral-500 font-mono">HSN: 6204 &bull; GST @ 5% Inclusive</p>
                        </td>
                        <td className="py-1.5 px-2 text-center font-medium text-neutral-700">
                          {item.size || 'Standard'}
                        </td>
                        <td className="py-1.5 px-2 text-center font-bold text-neutral-900">{item.qty}</td>
                        <td className="py-1.5 px-2 text-right font-mono">{formatCurrency(item.price)}</td>
                        <td className="py-1.5 px-2 text-right font-bold font-mono text-neutral-900">
                          {formatCurrency(Number(item.price) * item.qty)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex justify-end pt-2">
                <div className="w-72 space-y-1 text-xs">
                  <div className="flex justify-between text-neutral-600">
                    <span>Items Subtotal:</span>
                    <span className="font-mono">{formatCurrency(itemsTotal)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Delivery Charges:</span>
                    <span className="font-mono">
                      {shippingTotal === 0 ? 'FREE (₹0.00)' : formatCurrency(shippingTotal)}
                    </span>
                  </div>
                  {discountTotal > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Discount ({order.couponCode || 'Coupon'}):</span>
                      <span className="font-mono">-{formatCurrency(discountTotal)}</span>
                    </div>
                  )}
                  {giftCardTotal > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Gift Card ({order.giftCardCode || 'GC'}):</span>
                      <span className="font-mono">-{formatCurrency(giftCardTotal)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-sm text-[#003020] border-t border-neutral-300 pt-1.5">
                    <span>Grand Total:</span>
                    <span className="font-mono">{formatCurrency(grandTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Devotional Footer */}
              <div className="text-center pt-4 border-t border-neutral-200 text-neutral-500 text-[10px]">
                <p className="font-bold text-[#003020]">॥ हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे ॥</p>
                <p>Thank you for choosing Madhav Shringaar for your Thakur Ji&apos;s holy seva.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
