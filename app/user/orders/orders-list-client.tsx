'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Package, 
  Truck, 
  FileText, 
  ChevronRight, 
  ShoppingBag, 
  Sparkles, 
  Copy, 
  Check,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import ReturnRequestModal from '@/components/shared/order/return-request-modal';

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

export default function OrdersListClient({ orders }: { orders: Order[] }) {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedStatus, setSelectedStatus] = React.useState<string>('all');
  const [selectedTimeFilter, setSelectedTimeFilter] = React.useState<string>('all');

  const copyOrderId = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.success('Order ID copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearFilters = () => {
    setSelectedStatus('all');
    setSelectedTimeFilter('all');
    setSearchQuery('');
  };

  // Filter orders
  const filteredOrders = React.useMemo(() => {
    return orders.filter((order) => {
      // 1. Search Query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesId = order.id.toLowerCase().includes(query);
        const matchesAwb = order.awbNumber?.toLowerCase().includes(query);
        const matchesProduct = order.orderitems?.some((item) =>
          item.name.toLowerCase().includes(query)
        );
        if (!matchesId && !matchesAwb && !matchesProduct) {
          return false;
        }
      }

      // 2. Status filters
      if (selectedStatus !== 'all') {
        const isDelivered = order.isDelivered || order.status === 'DELIVERED';
        const isOnTheWay =
          order.status === 'SHIPPED' ||
          order.status === 'OUT_FOR_DELIVERY' ||
          Boolean(order.awbNumber);
        const isCancelled = order.status === 'CANCELLED';
        const isReturned = Boolean(order.refundStatus);

        if (selectedStatus === 'delivered' && !isDelivered) return false;
        if (selectedStatus === 'on_the_way' && (!isOnTheWay || isDelivered)) return false;
        if (selectedStatus === 'cancelled' && !isCancelled) return false;
        if (selectedStatus === 'returned' && !isReturned) return false;
      }

      // 3. Time filter
      if (selectedTimeFilter !== 'all') {
        const orderDate = new Date(order.createdAt);
        const now = new Date();
        const daysDiff = (now.getTime() - orderDate.getTime()) / (1000 * 3600 * 24);
        const orderYear = orderDate.getFullYear().toString();

        if (selectedTimeFilter === 'last_30_days' && daysDiff > 30) return false;
        if (selectedTimeFilter === '2026' && orderYear !== '2026') return false;
        if (selectedTimeFilter === '2025' && orderYear !== '2025') return false;
        if (selectedTimeFilter === 'older' && orderDate.getFullYear() >= 2025) return false;
      }

      return true;
    });
  }, [orders, searchQuery, selectedStatus, selectedTimeFilter]);

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

  const isFiltered = selectedStatus !== 'all' || selectedTimeFilter !== 'all' || searchQuery.trim() !== '';

  return (
    <div className="w-full space-y-5">
      {/* Top Search & Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs p-4 sm:p-5 space-y-4">
        {/* Search Input & Time Filter Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search your orders here (by item name, order ID, or tracking number)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-neutral-50/80 border border-neutral-200/80 rounded-xl outline-none focus:border-[#003020] focus:bg-white text-neutral-800 transition-all placeholder:text-neutral-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs text-neutral-500 whitespace-nowrap hidden sm:inline">Time:</span>
            <select
              value={selectedTimeFilter}
              onChange={(e) => setSelectedTimeFilter(e.target.value)}
              className="text-xs font-semibold py-2.5 px-3 bg-neutral-50/80 border border-neutral-200/80 rounded-xl text-neutral-700 outline-none focus:border-[#003020] cursor-pointer"
            >
              <option value="all">All Time</option>
              <option value="last_30_days">Last 30 days</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="older">Older</option>
            </select>
          </div>
        </div>

        {/* Status Filter Tabs Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-100">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {[
              { id: 'all', label: 'All Orders', count: orders.length },
              { id: 'on_the_way', label: 'On the way' },
              { id: 'delivered', label: 'Delivered' },
              { id: 'cancelled', label: 'Cancelled' },
              { id: 'returned', label: 'Returned' },
            ].map((tab) => {
              const isSelected = selectedStatus === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedStatus(tab.id)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all select-none",
                    isSelected
                      ? "bg-[#003020] text-[#F3D98F] shadow-xs"
                      : "bg-neutral-100/80 text-neutral-600 hover:bg-neutral-200/70 hover:text-neutral-900"
                  )}
                >
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className="ml-1.5 text-[10px] opacity-80 font-mono">({tab.count})</span>
                  )}
                </button>
              );
            })}
          </div>

          {isFiltered && (
            <button
              onClick={clearFilters}
              className="text-xs text-[#0F6F74] hover:text-[#003020] hover:underline font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Showing Count */}
      <div className="flex items-center justify-between text-xs text-neutral-500 px-1">
        <span>
          Showing <strong>{filteredOrders.length}</strong> {filteredOrders.length === 1 ? 'order' : 'orders'}
        </span>
        {isFiltered && (
          <span className="text-[#0F6F74] font-medium">Filtered results</span>
        )}
      </div>

      {/* Empty Search Result */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-200/80 p-12 text-center space-y-3">
          <p className="text-sm font-semibold text-neutral-700">
            No orders match your search or selected filter.
          </p>
          <Button
            onClick={clearFilters}
            variant="outline"
            className="text-xs rounded-xl"
          >
            Reset All Filters
          </Button>
        </div>
      ) : (
        /* Spacious, Full-Width Flipkart-Style Order Cards */
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const firstItem = order.orderitems?.[0];
            const totalItemsCount = order.orderitems?.reduce((acc, it) => acc + (it.qty || 1), 0) || 1;
            const moreItemsCount = (order.orderitems?.length || 1) - 1;
            const cleanId = `OD${order.id.replace(/-/g, '').slice(0, 16).toUpperCase()}`;

            // Status Indicator Logic
            let statusTitle = 'Order Confirmed';
            let statusSubtitle = 'Preparing for dispatch';
            let statusDotColor = 'bg-amber-500 ring-amber-100';

            if (order.isDelivered || order.status === 'DELIVERED') {
              const delDate = order.deliveredAt
                ? new Date(order.deliveredAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
                : 'recently';
              statusTitle = `Delivered on ${delDate}`;
              statusSubtitle = 'Your item has been delivered';
              statusDotColor = 'bg-emerald-600 ring-emerald-100';
            } else if (order.status === 'OUT_FOR_DELIVERY') {
              statusTitle = 'Out For Delivery Today';
              statusSubtitle = 'Courier associate is out with your package';
              statusDotColor = 'bg-sky-600 ring-sky-100';
            } else if (order.status === 'SHIPPED' || order.awbNumber) {
              statusTitle = 'Arriving in 2-3 Days';
              statusSubtitle = order.awbNumber ? `Item shipped via Shiprocket (${order.awbNumber})` : 'Your item has been shipped';
              statusDotColor = 'bg-emerald-600 ring-emerald-100';
            } else if (order.status === 'CANCELLED') {
              statusTitle = 'Cancelled';
              statusSubtitle = 'Order was cancelled';
              statusDotColor = 'bg-red-500 ring-red-100';
            }

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-neutral-200/80 hover:border-[#E6C16A] hover:shadow-md transition-all overflow-hidden"
              >
                {/* Order Top Bar */}
                <div className="bg-[#FAF7F0]/60 px-5 py-3 border-b border-neutral-200/70 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                    <div>
                      <span className="text-neutral-500 block text-[10px] uppercase font-bold tracking-wider">
                        Order Placed
                      </span>
                      <strong className="text-neutral-800">
                        {formatDateTime(new Date(order.createdAt)).dateOnly}
                      </strong>
                    </div>

                    <div>
                      <span className="text-neutral-500 block text-[10px] uppercase font-bold tracking-wider">
                        Total Amount
                      </span>
                      <strong className="font-bold text-[#003020] font-mono text-sm">
                        {formatCurrency(order.totalPrice)}
                      </strong>
                    </div>

                    <div>
                      <span className="text-neutral-500 block text-[10px] uppercase font-bold tracking-wider">
                        Payment Method
                      </span>
                      <strong className="text-neutral-800 uppercase font-mono">
                        {order.paymentMethod}
                      </strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-neutral-500 text-[11px] hidden sm:inline">Order #</span>
                    <button
                      onClick={(e) => copyOrderId(e, cleanId)}
                      className="font-mono text-xs text-[#0F6F74] hover:underline inline-flex items-center gap-1 font-semibold"
                      title="Copy Order ID"
                    >
                      <span>{cleanId}</span>
                      {copiedId === cleanId ? (
                        <span className="text-emerald-600 flex items-center gap-0.5">
                          <Check className="w-3.5 h-3.5" /> Copied
                        </span>
                      ) : (
                        <span className="flex items-center gap-0.5">
                          <Copy className="w-3.5 h-3.5 text-neutral-400" /> Copy ID
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                {/* Main Content Row (Clickable to /order/[id]) */}
                <Link
                  href={`/order/${order.id}`}
                  className="block p-5 sm:p-6 hover:bg-[#FAF7F0]/20 transition-colors"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                    {/* Product Thumbnail & Details (7 cols) */}
                    <div className="sm:col-span-7 flex items-center gap-4">
                      <div className="relative flex-shrink-0">
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200/70 relative">
                          <Image
                            src={firstItem?.image || '/images/logo.png'}
                            alt={firstItem?.name || 'Sacred Item'}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </div>
                        {moreItemsCount > 0 && (
                          <span className="absolute -bottom-2 -right-1 bg-neutral-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-xs">
                            +{moreItemsCount} More
                          </span>
                        )}
                      </div>

                      <div className="space-y-1 min-w-0 flex-1">
                        <h3 className="font-semibold text-sm sm:text-base text-[#003020] line-clamp-2 leading-snug">
                          {firstItem?.name || 'Sacred Vrindavan Item'}
                        </h3>
                        <p className="text-xs text-neutral-500">
                          Total: <strong className="text-neutral-700">{totalItemsCount} {totalItemsCount === 1 ? 'Item' : 'Items'}</strong> • Handcrafted Devotional Shringaar
                        </p>
                        <div className="text-[11px] text-[#C88A20] flex items-center gap-1 font-medium pt-0.5">
                          <Sparkles className="w-3 h-3" />
                          <span>Blessed from Vrindavan Dham</span>
                        </div>
                      </div>
                    </div>

                    {/* Middle: Price (2 cols) */}
                    <div className="sm:col-span-2 sm:text-center">
                      <span className="font-bold text-base sm:text-lg text-[#003020] font-mono block">
                        {formatCurrency(order.totalPrice)}
                      </span>
                      <span className="text-[11px] text-emerald-700 font-medium">
                        Free Pan-India Delivery
                      </span>
                    </div>

                    {/* Right: Flipkart Status Dot & Update (3 cols) */}
                    <div className="sm:col-span-3 sm:text-right space-y-1">
                      <div className="inline-flex items-center gap-2 sm:justify-end">
                        <span className={`w-2.5 h-2.5 rounded-full ring-4 ${statusDotColor}`} />
                        <span className="font-bold text-xs sm:text-sm text-neutral-900 leading-tight">
                          {statusTitle}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500">
                        {statusSubtitle}
                      </p>
                    </div>
                  </div>
                </Link>

                {/* Bottom Actions Row */}
                <div className="bg-neutral-50/70 px-5 py-3 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="text-[11px] text-neutral-500">
                    Standard Express Courier Dispatch from Agra & Noida Hubs
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs rounded-xl border-neutral-200 text-neutral-700 hover:text-[#003020] bg-white"
                    >
                      <Link href={`/order/${order.id}/invoice`} target="_blank">
                        <FileText className="w-3.5 h-3.5 mr-1 text-[#0F6F74]" />
                        Download Invoice
                      </Link>
                    </Button>

                    {order.awbNumber && (
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs rounded-xl border-neutral-200 text-neutral-700 bg-white"
                      >
                        <Link href={`/track-order?awb=${order.awbNumber}`}>
                          <Truck className="w-3.5 h-3.5 mr-1 text-[#0F6F74]" />
                          Track
                        </Link>
                      </Button>
                    )}

                    <ReturnRequestModal order={order} />

                    <Button
                      asChild
                      size="sm"
                      className="h-8 text-xs rounded-xl bg-[#003020] hover:bg-[#002518] text-[#F3D98F] px-4 font-semibold"
                    >
                      <Link href={`/order/${order.id}`}>
                        View Details &rarr;
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
