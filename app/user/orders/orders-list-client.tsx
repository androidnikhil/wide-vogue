'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Package, 
  Truck, 
  FileText, 
  ExternalLink, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  RotateCcw,
  ShoppingBag,
  Sparkles,
  Copy,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { toast } from 'sonner';

interface OrderItem {
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: string | number;
  qty: number;
}

interface Order {
  id: string;
  createdAt: string | Date;
  totalPrice: string | number;
  isPaid: boolean;
  paidAt?: string | Date | null;
  isDelivered: boolean;
  deliveredAt?: string | Date | null;
  status: string;
  paymentMethod: string;
  awbNumber?: string | null;
  refundStatus?: string | null;
  returnReason?: string | null;
  orderitems: OrderItem[];
}

import ReturnRequestModal from '@/components/shared/order/return-request-modal';

export default function OrdersListClient({ orders }: { orders: Order[] }) {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const copyOrderId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.success('Order ID copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusBadge = (order: Order) => {
    if (order.isDelivered) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Delivered
        </span>
      );
    }
    if (order.awbNumber || order.status === 'SHIPPED') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold border border-sky-200">
          <Truck className="w-3.5 h-3.5 text-sky-600" />
          In Transit
        </span>
      );
    }
    if (order.isPaid) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          Order Confirmed & Preparing
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 text-xs font-bold border border-neutral-200">
        <Clock className="w-3.5 h-3.5 text-neutral-500" />
        Processing Payment
      </span>
    );
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-neutral-200/80 p-12 text-center space-y-4 max-w-xl mx-auto my-8">
        <div className="w-16 h-16 rounded-2xl bg-[#FAF7F0] text-[#0F6F74] flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="font-serif text-xl font-bold text-[#003020]">
            No Orders Placed Yet
          </h3>
          <p className="text-xs md:text-sm text-neutral-500 max-w-sm mx-auto">
            You haven't placed any devotional orders yet. Explore our handcrafted Vrindavan poshak and sacred shringaar collections.
          </p>
        </div>
        <Button
          asChild
          className="bg-[#003020] hover:bg-[#002518] text-[#F3D98F] font-semibold rounded-xl text-xs px-6"
        >
          <Link href="/search?q=poshak">
            Explore Sacred Collections
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {orders.map((order) => {
        const orderDate = formatDateTime(new Date(order.createdAt)).dateOnly;
        const totalFormatted = formatCurrency(order.totalPrice);
        const firstItem = order.orderitems?.[0];

        return (
          <div
            key={order.id}
            className="bg-white rounded-2xl border border-neutral-200/80 hover:border-[#E6C16A] shadow-xs hover:shadow-md transition-all overflow-hidden"
          >
            {/* Order Top Bar (Flipkart Style) */}
            <div className="bg-[#FAF7F0]/60 p-4 sm:p-5 border-b border-neutral-200/70 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                <div>
                  <span className="text-neutral-500 block text-[11px] uppercase tracking-wider font-medium">
                    Order Placed
                  </span>
                  <strong className="text-neutral-800">{orderDate}</strong>
                </div>

                <div>
                  <span className="text-neutral-500 block text-[11px] uppercase tracking-wider font-medium">
                    Total Amount
                  </span>
                  <strong className="font-bold text-[#003020] text-sm font-mono">
                    {totalFormatted}
                  </strong>
                </div>

                <div>
                  <span className="text-neutral-500 block text-[11px] uppercase tracking-wider font-medium">
                    Payment Method
                  </span>
                  <strong className="text-neutral-800 uppercase font-mono">
                    {order.paymentMethod}
                  </strong>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {getStatusBadge(order)}

                <div className="text-right hidden sm:block">
                  <span className="text-neutral-500 block text-[11px] uppercase tracking-wider font-medium">
                    Order #
                  </span>
                  <button
                    onClick={() => copyOrderId(order.id)}
                    className="font-mono text-[11px] text-[#0F6F74] hover:underline inline-flex items-center gap-1 font-semibold"
                    title="Click to copy ID"
                  >
                    <span>{order.id.slice(0, 8).toUpperCase()}</span>
                    {copiedId === order.id ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3 text-neutral-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Order Items List */}
            <div className="p-4 sm:p-6 divide-y divide-neutral-100 space-y-4">
              {order.orderitems && order.orderitems.length > 0 ? (
                order.orderitems.map((item, idx) => (
                  <div
                    key={idx}
                    className="pt-4 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl bg-neutral-100 overflow-hidden flex-shrink-0 relative border border-neutral-200/60">
                        <Image
                          src={item.image || '/images/logo.png'}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="space-y-1 min-w-0">
                        <Link
                          href={`/product/${item.slug}`}
                          className="font-semibold text-sm text-[#003020] hover:text-[#0F6F74] transition-colors truncate block"
                        >
                          {item.name}
                        </Link>
                        <p className="text-xs text-neutral-500">
                          Qty: <strong className="text-neutral-800">{item.qty}</strong> • Price: <strong className="font-mono text-neutral-800">{formatCurrency(item.price)}</strong>
                        </p>
                        <div className="text-[11px] text-neutral-500 flex items-center gap-1 pt-0.5">
                          <Sparkles className="w-3 h-3 text-[#C88A20]" />
                          <span>Handcrafted in Vrindavan Dham</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right sm:self-center flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                      <span className="font-bold text-sm text-[#003020] font-mono">
                        {formatCurrency(Number(item.price) * item.qty)}
                      </span>
                      <Button
                        asChild
                        variant="link"
                        className="text-xs text-[#0F6F74] p-0 h-auto font-medium"
                      >
                        <Link href={`/product/${item.slug}`}>
                          Buy Again &rarr;
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-neutral-500 py-2">
                  1 Sacred Package • Total: {totalFormatted}
                </div>
              )}
            </div>

            {/* Bottom Actions Row (Download Invoice, Track, View Details) */}
            <div className="bg-neutral-50/70 px-4 sm:px-6 py-3 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="text-neutral-500 text-[11px]">
                {order.isDelivered
                  ? `Delivered on ${formatDateTime(new Date(order.deliveredAt || order.createdAt)).dateOnly}`
                  : 'Courier updates dispatched via Shiprocket Pan-India'}
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                {/* Download Standard A4 Tax Invoice */}
                <Button
                  asChild
                  variant="outline"
                  className="rounded-xl border-[#003020]/20 hover:border-[#003020] text-[#003020] text-xs font-semibold gap-1.5 h-8.5 bg-white shadow-2xs"
                >
                  <Link href={`/order/${order.id}/invoice`} target="_blank">
                    <FileText className="w-3.5 h-3.5 text-[#0F6F74]" />
                    Download Tax Invoice (A4)
                  </Link>
                </Button>

                {/* Return Request (7-Day window) */}
                <ReturnRequestModal order={order} />

                {/* Track Shipment */}
                <Button
                  asChild
                  variant="outline"
                  className="rounded-xl border-neutral-300 text-neutral-700 text-xs font-semibold gap-1.5 h-8.5 bg-white shadow-2xs"
                >
                  <Link href={order.awbNumber ? `/track-order?awb=${order.awbNumber}` : `/track-order`}>
                    <Truck className="w-3.5 h-3.5 text-[#0F6F74]" />
                    Track Shipment
                  </Link>
                </Button>

                {/* View Order Details */}
                <Button
                  asChild
                  className="bg-[#003020] hover:bg-[#002518] text-[#F3D98F] text-xs font-semibold rounded-xl h-8.5 px-4 shadow-2xs"
                >
                  <Link href={`/order/${order.id}`}>
                    Order Details
                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
