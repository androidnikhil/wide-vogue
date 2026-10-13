'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Printer,
  Copy,
  Check,
  ExternalLink,
  Truck,
  Package,
  Phone,
  MessageCircle,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { updateOrderStatus, updateOrderToPaidCOD, dispatchManualCourier } from '@/lib/actions/order.actions';
import { pushOrderToShiprocket } from '@/lib/actions/shiprocket.actions';
import AdminReturnAction from '@/components/admin/admin-return-action';

interface AdminOrderClientProps {
  order: any;
}

const COURIER_OPTIONS = [
  { label: 'Shiprocket Express', value: 'Shiprocket' },
  { label: 'Delhivery', value: 'Delhivery' },
  { label: 'Bluedart Express', value: 'Bluedart' },
  { label: 'India Post (Speed Post)', value: 'India Post' },
  { label: 'DTDC Courier', value: 'DTDC' },
  { label: 'Ekart Logistics', value: 'Ekart' },
  { label: 'Other Courier', value: 'Other' },
];

export default function AdminOrderClient({ order }: AdminOrderClientProps) {
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Manual dispatch state
  const [courierName, setCourierName] = useState(order.shippingCarrier || 'Shiprocket');
  const [awbInput, setAwbInput] = useState(order.awbNumber || '');

  // Shiprocket message helper
  const [shiprocketNotice, setShiprocketNotice] = useState<string | null>(null);

  const cleanOrderId = `OD${order.id.replace(/-/g, '').slice(0, 16).toUpperCase()}`;
  const address = order.shippingAddress || {};
  const orderDate = formatDateTime(new Date(order.createdAt)).dateTime;

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(cleanOrderId);
    setCopied(true);
    toast.success('Order ID copied');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleManualDispatch = () => {
    if (!awbInput || !awbInput.trim()) {
      toast.error('Please enter an AWB / Tracking number');
      return;
    }

    startTransition(async () => {
      const res = await dispatchManualCourier({
        orderId: order.id,
        courierName,
        awbNumber: awbInput.trim(),
      });

      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    });
  };

  const handleShiprocketPush = () => {
    setShiprocketNotice(null);
    startTransition(async () => {
      const res = await pushOrderToShiprocket(order.id);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
        setShiprocketNotice(res.message);
      }
    });
  };

  const handleUpdateStatus = (newStatus: string) => {
    startTransition(async () => {
      const res = await updateOrderStatus(order.id, newStatus);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    });
  };

  const handleMarkAsPaidCOD = () => {
    startTransition(async () => {
      const res = await updateOrderToPaidCOD(order.id);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    });
  };

  // Status styles
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300">Delivered</Badge>;
      case 'SHIPPED':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Shipped</Badge>;
      case 'OUT_FOR_DELIVERY':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-300">Out for Delivery</Badge>;
      case 'PROCESSING':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-300">Processing</Badge>;
      default:
        return <Badge className="bg-neutral-100 text-neutral-800 border-neutral-300">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Navigation & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-outline-variant/30">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-8 px-2.5 text-xs font-semibold gap-1.5 border-neutral-300 bg-white hover:bg-neutral-50"
            >
              <Link href="/admin/orders">
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Orders
              </Link>
            </Button>
            <span className="text-neutral-400">/</span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-bold text-sm text-[#003020]">{cleanOrderId}</span>
              <button
                type="button"
                onClick={handleCopyOrderId}
                className="p-1 hover:bg-neutral-200/60 rounded text-neutral-500 hover:text-neutral-800 transition-colors"
                title="Copy Order ID"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
          <p className="text-xs text-neutral-500 pl-1">
            Placed on <strong>{orderDate}</strong>
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            asChild
            size="sm"
            className="bg-[#003020] hover:bg-[#002518] text-[#F3D98F] text-xs font-bold gap-1.5 shadow-sm h-9 px-3.5"
          >
            <Link href={`/admin/orders/${order.id}/invoice`} title="View & Print Single-Page A4 Invoice inside Admin Portal">
              <Printer className="w-4 h-4 text-[#F3D98F]" />
              Print Tax Invoice (A4)
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-9 px-3 text-xs font-medium gap-1.5 bg-white border-neutral-300 hover:bg-neutral-50"
          >
            <Link href={`/order/${order.id}`} target="_blank" title="Preview customer-facing storefront view in new tab">
              <ExternalLink className="w-3.5 h-3.5 text-neutral-600" />
              Preview Storefront
            </Link>
          </Button>
        </div>
      </div>

      {/* Overview Status Banner */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#003020]/10 flex items-center justify-center text-[#003020]">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Fulfillment Status:</span>
              {getStatusBadge(order.status || 'PENDING')}
              {order.refundStatus === 'RETURN_REQUESTED' && (
                <Badge className="bg-amber-100 text-amber-900 border-amber-300">⚠️ Return Requested</Badge>
              )}
              {order.refundStatus === 'RETURN_APPROVED' && (
                <Badge className="bg-emerald-100 text-emerald-900 border-emerald-300">✅ Return Approved</Badge>
              )}
            </div>
            <p className="text-xs text-neutral-600 mt-0.5">
              {order.awbNumber ? (
                <span>
                  Tracking AWB: <strong className="font-mono text-neutral-900">{order.awbNumber}</strong>
                </span>
              ) : (
                'Awaiting courier dispatch / AWB generation'
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 border-l border-neutral-200 pl-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Payment:</span>
              {order.isPaid ? (
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300">✓ Paid</Badge>
              ) : (
                <Badge className="bg-amber-100 text-amber-900 border-amber-300">COD Unpaid</Badge>
              )}
            </div>
            <p className="text-xs text-neutral-600 mt-0.5">
              Mode: <strong>{order.paymentMethod}</strong> • Total: <strong className="text-neutral-900">{formatCurrency(order.totalPrice)}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Two Column Operations Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Order Items & Customer Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Ordered Items Packing Card */}
          <Card className="rounded-2xl border-neutral-200/80 shadow-xs overflow-hidden">
            <CardHeader className="bg-neutral-50/80 border-b border-neutral-200/70 py-3.5 px-5">
              <CardTitle className="text-sm font-bold text-[#003020] flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#C88A20]" />
                  Ordered Items ({order.orderitems?.length || 0})
                </span>
                <span className="text-xs font-normal text-neutral-500">Pick & Pack List</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-neutral-100">
                {order.orderitems?.map((item: any, idx: number) => (
                  <div key={idx} className="p-4 flex items-center justify-between gap-4 hover:bg-neutral-50/50">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-16 h-16 rounded-xl bg-neutral-100 border border-neutral-200 relative shrink-0 overflow-hidden">
                        <Image
                          src={item.image || '/images/logo.png'}
                          alt={item.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <p className="font-semibold text-xs text-neutral-900 truncate">{item.name}</p>
                        <p className="text-[11px] text-neutral-500">
                          SKU / Slug: <span className="font-mono text-neutral-700">{item.slug || item.productId?.slice(0, 8)}</span>
                        </p>
                        {item.size && (
                          <span className="inline-block px-1.5 py-0.5 bg-[#FAF7F0] border border-[#E6C16A] text-[#003020] text-[10px] font-bold rounded">
                            Deity Size: {item.size} No.
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="font-mono font-bold text-xs text-neutral-900">
                        {formatCurrency(Number(item.price) * item.qty)}
                      </p>
                      <p className="text-[11px] text-neutral-500">
                        {item.qty} × {formatCurrency(Number(item.price))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Financial Subtotals */}
              <div className="p-4 bg-neutral-50/50 border-t border-neutral-200/80 space-y-1.5 text-xs text-neutral-700">
                <div className="flex justify-between">
                  <span>Items Subtotal:</span>
                  <span className="font-mono">{formatCurrency(order.itemsPrice || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span className="font-mono">
                    {Number(order.shippingPrice) > 0 ? formatCurrency(order.shippingPrice) : 'FREE (Pan-India)'}
                  </span>
                </div>
                {Number(order.discountPrice) > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount / Coupon:</span>
                    <span className="font-mono">-{formatCurrency(order.discountPrice)}</span>
                  </div>
                )}
                {Number(order.giftCardAmount) > 0 && (
                  <div className="flex justify-between text-amber-700">
                    <span>Gift Card Applied:</span>
                    <span className="font-mono">-{formatCurrency(order.giftCardAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-500 text-[11px]">
                  <span>GST / Tax (Included):</span>
                  <span className="font-mono">{formatCurrency(order.taxPrice || 0)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-neutral-200 text-sm font-bold text-[#003020]">
                  <span>Total Payable:</span>
                  <span className="font-mono text-base">{formatCurrency(order.totalPrice || 0)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer & Delivery Address Card */}
          <Card className="rounded-2xl border-neutral-200/80 shadow-xs">
            <CardHeader className="bg-neutral-50/80 border-b border-neutral-200/70 py-3.5 px-5">
              <CardTitle className="text-sm font-bold text-[#003020] flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#C88A20]" />
                  Delivery & Customer Contact
                </span>
                <span className="text-xs font-normal text-neutral-500">Destination</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 text-xs space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Recipient Name</p>
                  <p className="text-sm font-bold text-neutral-900">{address.fullName || order.user?.name || 'Customer'}</p>
                  <p className="text-neutral-700 leading-relaxed pt-1">
                    {address.streetAddress}<br />
                    {address.city}, {address.state} - <strong>{address.postalCode}</strong><br />
                    {address.country || 'India'}
                  </p>
                </div>

                <div className="space-y-2 border-t md:border-t-0 md:border-l border-neutral-200 pt-3 md:pt-0 md:pl-4">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Phone / WhatsApp</p>
                    <p className="font-bold text-sm text-neutral-900 flex items-center gap-2 mt-0.5">
                      +91 {address.contactNumber || 'No phone provided'}
                      {address.contactNumber && (
                        <div className="flex items-center gap-1.5 ml-1">
                          <a
                            href={`tel:+91${address.contactNumber}`}
                            className="p-1 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
                            title="Call recipient"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                          <a
                            href={`https://wa.me/91${address.contactNumber}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700"
                            title="Chat on WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Email Address</p>
                    <p className="text-neutral-800 font-medium">
                      {order.guestEmail || order.user?.email || 'No email provided'}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Payment Method</p>
                    <p className="text-neutral-800 font-semibold">{order.paymentMethod}</p>
                  </div>
                </div>
              </div>

              {/* COD Cash Collection Alert */}
              {!order.isPaid && order.paymentMethod === 'CashOnDelivery' && (
                <div className="mt-2 p-3 bg-amber-50 border border-amber-300 rounded-xl flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <p className="font-bold text-amber-900 text-xs">⚠️ Cash on Delivery (Uncollected)</p>
                    <p className="text-[11px] text-amber-800">
                      Collect exact cash of <strong>{formatCurrency(order.totalPrice)}</strong> upon parcel delivery.
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    disabled={isPending}
                    onClick={handleMarkAsPaidCOD}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shrink-0 h-8 px-3"
                  >
                    Mark Cash Collected
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

        </div>

        {/* Right 1 Col: Logistics & Order Operations */}
        <div className="space-y-6">
          
          {/* Shipping & Courier Operations Card */}
          <Card className="rounded-2xl border-neutral-200/80 shadow-xs">
            <CardHeader className="bg-neutral-50/80 border-b border-neutral-200/70 py-3.5 px-5">
              <CardTitle className="text-sm font-bold text-[#003020] flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#C88A20]" />
                Logistics & Dispatch
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4 text-xs">
              
              {/* Existing AWB Display if dispatched */}
              {order.awbNumber && (
                <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-900 text-xs flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-blue-700" />
                      Dispatched Parcel
                    </span>
                    <span className="font-mono font-bold text-blue-900">{order.awbNumber}</span>
                  </div>
                  <div className="pt-1 border-t border-blue-200/60 flex items-center justify-between">
                    <span className="text-[11px] text-blue-800">
                      Carrier: <strong>{order.shippingCarrier || 'Shiprocket / Express Courier'}</strong>
                    </span>
                    <a
                      href={order.trackingUrl || `https://shiprocket.co/tracking/${order.awbNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 hover:text-blue-900 font-bold underline inline-flex items-center gap-1 text-[11px]"
                    >
                      Track Parcel
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}

              {/* Manual Courier Dispatch (Primary e-commerce option) */}
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3">
                <div>
                  <h4 className="font-bold text-neutral-900 text-xs flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5 text-[#003020]" />
                    Manual Courier & AWB Dispatch
                  </h4>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Assign any courier (Shiprocket, Delhivery, Bluedart, Speed Post) and enter the tracking number.
                  </p>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="text-[10px] font-bold text-neutral-600 uppercase">Courier Partner</label>
                    <select
                      value={courierName}
                      onChange={(e) => setCourierName(e.target.value)}
                      className="w-full mt-1 text-xs px-2.5 py-1.5 rounded-lg border border-neutral-300 bg-white text-neutral-800 focus:outline-none focus:ring-1 focus:ring-[#003020]"
                    >
                      {COURIER_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-neutral-600 uppercase">AWB / Tracking Number</label>
                    <Input
                      type="text"
                      placeholder="e.g. 143256789012"
                      value={awbInput}
                      onChange={(e) => setAwbInput(e.target.value)}
                      className="mt-1 h-8 text-xs font-mono"
                    />
                  </div>

                  <Button
                    type="button"
                    size="sm"
                    disabled={isPending}
                    onClick={handleManualDispatch}
                    className="w-full bg-[#003020] hover:bg-[#002518] text-[#F3D98F] text-xs font-bold h-8 mt-1 shadow-xs"
                  >
                    {isPending ? 'Saving...' : order.awbNumber ? 'Update AWB & Re-sync' : 'Dispatch Order & Mark Shipped'}
                  </Button>
                </div>
              </div>

              {/* Shiprocket Automated API Integration */}
              <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-purple-900 text-xs">Automated Shiprocket API</h4>
                    <p className="text-[11px] text-purple-700">Push order directly into Shiprocket account</p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={isPending}
                    onClick={handleShiprocketPush}
                    className="bg-purple-100 hover:bg-purple-200 text-purple-900 border-purple-300 text-xs font-semibold h-8"
                  >
                    {isPending ? 'Connecting...' : order.awbNumber ? 'Re-sync API' : 'Generate Shipment'}
                  </Button>
                </div>

                {shiprocketNotice && (
                  <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-lg text-[11px] text-amber-900 space-y-1">
                    <p className="font-semibold flex items-center gap-1 text-amber-800">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      Shiprocket Connection Notice:
                    </p>
                    <p className="leading-tight text-[10px]">
                      {shiprocketNotice}
                    </p>
                    <p className="text-[10px] text-neutral-600 pt-0.5">
                      💡 Tip: You can dispatch right away using the <strong>Manual Courier & AWB</strong> form above without waiting for API configuration.
                    </p>
                  </div>
                )}
              </div>

            </CardContent>
          </Card>

          {/* Order Lifecycle Status Updater */}
          <Card className="rounded-2xl border-neutral-200/80 shadow-xs">
            <CardHeader className="bg-neutral-50/80 border-b border-neutral-200/70 py-3.5 px-5">
              <CardTitle className="text-sm font-bold text-[#003020] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C88A20]" />
                Update Order Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-2 text-xs">
              <p className="text-[11px] text-neutral-500 mb-2">
                Click any milestone to advance order tracking and notify the customer via email:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={order.status === 'PROCESSING' ? 'default' : 'outline'}
                  disabled={isPending || order.status === 'PROCESSING'}
                  onClick={() => handleUpdateStatus('PROCESSING')}
                  className="h-8 text-xs font-semibold"
                >
                  Processing
                </Button>

                <Button
                  type="button"
                  variant={order.status === 'SHIPPED' ? 'default' : 'outline'}
                  disabled={isPending || order.status === 'SHIPPED'}
                  onClick={() => handleUpdateStatus('SHIPPED')}
                  className="h-8 text-xs font-semibold"
                >
                  Shipped
                </Button>

                <Button
                  type="button"
                  variant={order.status === 'OUT_FOR_DELIVERY' ? 'default' : 'outline'}
                  disabled={isPending || order.status === 'OUT_FOR_DELIVERY'}
                  onClick={() => handleUpdateStatus('OUT_FOR_DELIVERY')}
                  className="h-8 text-xs font-semibold"
                >
                  Out for Delivery
                </Button>

                <Button
                  type="button"
                  variant={order.status === 'DELIVERED' ? 'default' : 'outline'}
                  disabled={isPending || order.status === 'DELIVERED'}
                  onClick={() => handleUpdateStatus('DELIVERED')}
                  className="h-8 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white"
                >
                  Delivered
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Admin Return / Exchange Management */}
          <AdminReturnAction order={order} />

        </div>

      </div>
    </div>
  );
}
