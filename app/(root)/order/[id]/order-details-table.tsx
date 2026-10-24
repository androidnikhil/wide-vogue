'use client';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDateTime, formatId } from '@/lib/utils';
import { Order } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import {toast} from 'sonner'
import { useTransition, useState } from 'react';
import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from '@paypal/react-paypal-js';
import {
  createPayPalOrder,
  approvePayPalOrder,
  updateOrderToPaidCOD,
  updateOrderStatus,
} from '@/lib/actions/order.actions';
import { pushOrderToShiprocket } from '@/lib/actions/shiprocket.actions';
import StripePayment from './stripe-payment';
import RazorpayPayment from './razorpay-payment';
import OrderTimeline from '@/components/shared/order/order-timeline';
import { LOYALTY_CONFIG } from '@/lib/loyalty.config';
import ReturnRequestModal from '@/components/shared/order/return-request-modal';
import AdminReturnAction from '@/components/admin/admin-return-action';
import { Copy, Check, FileText, ChevronRight, Phone, MessageSquare, Printer } from 'lucide-react';
import CopyButton from '@/components/shared/copy-button';

const OrderDetailsTable = ({
  order,
  paypalClientId,
  isAdmin,
  stripeClientSecret,
}: {
  order: Omit<Order, 'paymentResult'>;
  paypalClientId: string;
  isAdmin: boolean;
  stripeClientSecret: string | null;
}) => {
  const {
    id,
    shippingAddress,
    orderitems,
    itemsPrice,
    shippingPrice,
    taxPrice,
    couponCode,
    discountPrice,
    giftCardCode,
    giftCardAmount,
    isGiftWrapped,
    totalPrice,
    paymentMethod,
    isDelivered,
    isPaid,
    paidAt,
    deliveredAt,
    pointsEarned,
    pointsRedeemed,
  } = order;

  const PrintLoadingState = () => {
    const [{ isPending, isRejected }] = usePayPalScriptReducer();
    let status = '';

    if (isPending) {
      status = 'Loading PayPal...';
    } else if (isRejected) {
      status = 'Error Loading PayPal';
    }
    return status;
  };

  const handleCreatePayPalOrder = async () => {
    const res = await createPayPalOrder(order.id);

    if (!res.success) {
      toast.error(res.message,{
        style: {
          backgroundColor: 'red',
          color: 'white',
        }
      });
    }

    return res.data;
  };

  const handleApprovePayPalOrder = async (data: { orderID: string }) => {
    const res = await approvePayPalOrder(order.id, data);

    toast(res.message, {
      style: {
        backgroundColor: res.success ? 'green' : 'red',
        color: 'white',
      },
    });
  };

  // Button to mark order as paid
  const MarkAsPaidButton = () => {
    const [isPending, startTransition] = useTransition();

    return (
      <Button
        type='button'
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const res = await updateOrderToPaidCOD(order.id);
            toast(res.message, {
              style: {
                backgroundColor: res.success ? 'green' : 'red',
                color: 'white',
              },
            });
          })
        }
      >
        {isPending ? 'processing...' : 'Mark As Paid'}
      </Button>
    );
  };

  // Button to update order status
  const UpdateStatusButton = ({ statusLabel, statusValue, requiresAwb = false }: { statusLabel: string, statusValue: string, requiresAwb?: boolean }) => {
    const [isPending, startTransition] = useTransition();
    const [awb, setAwb] = useState(order.awbNumber || '');

    return (
      <div className='flex flex-col gap-2'>
        <Button
          type='button'
          variant={order.status === statusValue ? 'default' : 'outline'}
          disabled={isPending || order.status === statusValue}
          onClick={() => {
            if (requiresAwb && !awb) {
              toast.error('Please enter an AWB Tracking number');
              return;
            }
            startTransition(async () => {
              const res = await updateOrderStatus(order.id, statusValue, awb);
              toast(res.message, {
                style: {
                  backgroundColor: res.success ? 'green' : 'red',
                  color: 'white',
                },
              });
            });
          }}
        >
          {isPending ? '...' : statusLabel}
        </Button>
        {requiresAwb && order.status !== statusValue && (
          <input 
            type="text" 
            placeholder="Enter AWB Number" 
            value={awb}
            onChange={(e) => setAwb(e.target.value)}
            className="text-sm px-2 py-1 border rounded-md border-secondary/30 bg-surface-container"
          />
        )}
      </div>
    );
  };

  const ShiprocketShipButton = () => {
    const [isPending, startTransition] = useTransition();

    return (
      <Button
        type='button'
        size='sm'
        variant='outline'
        className='bg-purple-100/70 hover:bg-purple-200/80 text-purple-900 border-purple-300 font-medium'
        disabled={isPending}
        onClick={() => {
          startTransition(async () => {
            const res = await pushOrderToShiprocket(order.id);
            if (res.success) {
              toast.success(res.message);
            } else {
              toast.error(res.message);
            }
          });
        }}
      >
        {isPending ? 'Connecting...' : order.awbNumber ? 'Re-sync with Shiprocket' : 'Generate Shipment'}
      </Button>
    );
  };

  const [copiedId, setCopiedId] = useState(false);
  const cleanOrderId = `OD${id.replace(/-/g, '').slice(0, 16).toUpperCase()}`;

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(cleanOrderId);
    setCopiedId(true);
    toast.success('Order ID copied to clipboard');
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <>
      {/* Admin Mode Top Navigation Banner */}
      {isAdmin && (
        <div className="mb-4 p-3.5 bg-[#003020] text-[#F3D98F] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md border border-[#E6C16A]/40">
          <div className="flex items-center gap-2.5 text-xs">
            <span className="font-bold text-white uppercase tracking-wider text-[10px] px-2 py-0.5 bg-[#FAF7F0]/20 rounded-md">
              Admin Portal
            </span>
            <span className="text-white/90">
              You are currently viewing this order in customer storefront mode.
            </span>
          </div>
          <Button
            asChild
            size="sm"
            className="bg-[#F3D98F] hover:bg-[#e8cb77] text-[#003020] text-xs font-bold gap-1.5 h-8 px-3.5 rounded-xl shrink-0 shadow-xs"
          >
            <Link href={`/admin/orders/${order.id}`}>
              Open in Admin Order Portal &rarr;
            </Link>
          </Button>
        </div>
      )}

      {/* Breadcrumb & Invoice Actions Navigation */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <nav className="text-xs text-neutral-500 flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-[#003020] hover:underline">Home</Link>
          <span>&gt;</span>
          <Link href="/user/orders" className="hover:text-[#003020] hover:underline">My Account</Link>
          <span>&gt;</span>
          <Link href="/user/orders" className="hover:text-[#003020] hover:underline">My Orders</Link>
          <span>&gt;</span>
          <span className="text-neutral-800 font-semibold font-mono inline-flex items-center gap-1">
            {cleanOrderId}
            <CopyButton text={cleanOrderId} title="Copy Order ID" size="xs" />
          </span>
        </nav>

        <Button
          asChild
          variant="outline"
          size="sm"
          className="h-8 px-3 rounded-xl border-neutral-300 text-xs font-semibold gap-1.5 bg-white hover:bg-neutral-50 shadow-xs text-neutral-800"
        >
          <Link href={`/order/${order.id}/invoice`} target="_blank" title="View & Print Official Tax Invoice">
            <Printer className="w-3.5 h-3.5 text-[#003020]" />
            <span>Tax Invoice & Packing Slip</span>
          </Link>
        </Button>
      </div>

      {/* Flipkart-Style Order Summary Header Banner */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs p-5 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* Main item snippet */}
          <div className="lg:col-span-2 flex items-start gap-4">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200/70 relative flex-shrink-0">
              <Image
                src={orderitems[0]?.image || '/images/logo.png'}
                alt={orderitems[0]?.name || 'Sacred Item'}
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
            <div className="space-y-1">
              <h2 className="font-semibold text-base text-[#003020] line-clamp-2">
                {orderitems[0]?.name}
                {orderitems.length > 1 && (
                  <span className="text-xs text-neutral-500 font-normal ml-2">
                    (+{orderitems.length - 1} more {orderitems.length === 2 ? 'item' : 'items'})
                  </span>
                )}
              </h2>
              <p className="text-xs text-neutral-500">
                Seller: <strong className="text-neutral-700">Madhav Shringaar Vrindavan</strong>
              </p>
              <div className="flex items-center gap-3 pt-1 flex-wrap">
                <span className="font-bold text-lg text-[#003020] font-mono">
                  {formatCurrency(orderitems[0]?.price || totalPrice)}
                </span>
                {orderitems[0]?.qty > 1 && (
                  <span className="text-xs text-neutral-500 font-medium">
                    Qty: {orderitems[0]?.qty}
                  </span>
                )}
                {Number(shippingPrice) === 0 ? (
                  <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60 font-semibold">
                    Free Pan-India Delivery
                  </span>
                ) : (
                  <span className="text-xs text-neutral-700 bg-neutral-100 px-2.5 py-0.5 rounded-full border border-neutral-200 font-medium">
                    Delivery: {formatCurrency(shippingPrice)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Delivery details & Price details */}
          <div className="space-y-3 bg-[#FAF7F0]/60 p-4 rounded-xl border border-neutral-200/60 text-xs">
            <div>
              <span className="text-neutral-500 block uppercase tracking-wider text-[10px] font-bold">
                Delivery Details
              </span>
              <p className="font-semibold text-[#003020] mt-0.5">
                {shippingAddress.fullName}
              </p>
              <p className="text-neutral-600 truncate">
                {shippingAddress.streetAddress}, {shippingAddress.city} - {shippingAddress.postalCode}
              </p>
              <p className="text-neutral-500 mt-0.5">
                Ph: +91 {shippingAddress.contactNumber}
              </p>
            </div>

            <div className="pt-2 border-t border-neutral-200/50 flex items-center justify-between">
              <div>
                <span className="text-neutral-500 block uppercase tracking-wider text-[10px] font-bold">
                  Order ID
                </span>
                <button
                  onClick={handleCopyOrderId}
                  className="font-mono text-xs text-[#0F6F74] hover:underline inline-flex items-center gap-1 font-semibold"
                  title="Click to copy Order ID"
                >
                  <span>{cleanOrderId}</span>
                  {copiedId ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-neutral-400" />}
                </button>
              </div>
              <div>
                {isPaid ? (
                  <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-bold">
                    ✓ Paid
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 text-xs px-2.5 py-1 rounded-full font-bold">
                    Not Paid
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='grid lg:grid-cols-3 gap-6 lg:gap-8'>
        <div className='col-span-2 space-y-6 overflow-x-auto pb-10'>
          {/* Order Timeline Card */}
          <Card className="border-neutral-200/80 shadow-xs rounded-2xl overflow-hidden bg-white">
            <div className="bg-[#FAF7F0]/80 p-4 border-b border-neutral-200/70 flex items-center justify-between">
              <h2 className='font-bold text-sm text-[#003020] flex items-center gap-2'>
                <span className="material-symbols-outlined text-[20px] text-[#0F6F74]">local_shipping</span> 
                <span>Order Tracking & Updates</span>
              </h2>
              <span className="text-xs text-neutral-500 font-mono">
                Order #{cleanOrderId}
              </span>
            </div>
            <CardContent className='p-6 md:p-8'>
              <OrderTimeline order={order} />
            </CardContent>
          </Card>
          
          <Card className="border-secondary/10 shadow-sm rounded-2xl overflow-hidden bg-surface">
            <div className="bg-surface-container-lowest p-4 border-b border-outline-variant/30">
              <h2 className='font-title-lg text-primary flex items-center gap-2'><span className="material-symbols-outlined text-[20px]">payments</span> Payment Method</h2>
            </div>
            <CardContent className='p-6 space-y-3'>
              <p className='font-medium text-lg text-on-surface flex items-center gap-2'>{paymentMethod}</p>
              {isPaid ? (
                <Badge variant='secondary'>
                  Paid at {formatDateTime(paidAt!).dateTime}
                </Badge>
              ) : (
                  <Badge className="bg-red-500 hover:bg-red-600 text-white rounded-full px-3 py-1 font-medium shadow-sm">Not paid</Badge>
              )}
            </CardContent>
          </Card>

          <Card className="border-secondary/10 shadow-sm rounded-2xl overflow-hidden bg-surface">
            <div className="bg-surface-container-lowest p-4 border-b border-outline-variant/30">
              <h2 className='font-title-lg text-primary flex items-center gap-2'><span className="material-symbols-outlined text-[20px]">location_on</span> Shipping Address</h2>
            </div>
            <CardContent className='p-6 space-y-2'>
              <p className="font-title-lg text-on-surface">{shippingAddress.fullName}</p>
              <p className='text-on-surface-variant font-body-md leading-relaxed'>
                {shippingAddress.streetAddress}, {shippingAddress.city}
                {shippingAddress.postalCode}, {shippingAddress.country}
              </p>
              <p className="flex items-center text-secondary font-medium mb-4">
                <span className="w-4 h-4 mr-1 inline-block">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </span>
                +91 {shippingAddress.contactNumber}
              </p>
              {isDelivered ? (
                <Badge variant='secondary'>
                  Delivered at {formatDateTime(deliveredAt!).dateTime}
                </Badge>
              ) : (
                  <Badge className="bg-red-500 hover:bg-red-600 text-white rounded-full px-3 py-1 font-medium shadow-sm">Not Delivered</Badge>
              )}
            </CardContent>
          </Card>

          <Card className="border-secondary/10 shadow-sm rounded-2xl overflow-hidden bg-surface">
            <div className="bg-surface-container-lowest p-4 border-b border-outline-variant/30">
              <h2 className='font-title-lg text-primary flex items-center gap-2'><span className="material-symbols-outlined text-[20px]">inventory_2</span> Order Items</h2>
            </div>
            <CardContent className='p-0 sm:p-4'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderitems.map((item) => (
                    <TableRow key={item.slug}>
                      <TableCell>
                        <Link
                          href={`/product/${item.slug}`}
                          className='flex items-center gap-3 hover:bg-surface-container-lowest p-2 rounded-lg transition-colors'
                        >
                          <div className="w-16 h-16 relative rounded-md overflow-hidden border border-outline-variant/30 shadow-sm flex-shrink-0">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          </div>
                          <span className='font-medium text-on-surface line-clamp-2'>{item.name}</span>
                        </Link>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className='font-medium text-on-surface-variant bg-surface-container px-3 py-1 rounded-full'>{item.qty}</span>
                      </TableCell>
                      <TableCell className='text-right font-bold text-lg text-primary'>
                        {formatCurrency(item.price)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="bg-surface border-secondary/10 shadow-md sticky top-24 overflow-hidden rounded-xl">
            <div className="bg-primary-container text-surface p-4 border-b border-secondary/20">
              <h2 className="font-title-lg flex items-center gap-2"><span className="material-symbols-outlined text-[20px]">receipt_long</span> Order Summary</h2>
            </div>
            <CardContent className='p-6 space-y-4'>
              <div className='flex justify-between items-center text-on-surface-variant'>
                <span>Items Subtotal</span>
                <span className="font-medium text-on-surface">{formatCurrency(itemsPrice)}</span>
              </div>
              {isGiftWrapped && (
                <div className='flex justify-between items-center text-on-surface-variant'>
                  <span>Gift Wrapping</span>
                  <span className="font-medium text-on-surface">{formatCurrency(50)}</span>
                </div>
              )}
              <div className='flex justify-between items-center text-on-surface-variant'>
                <span>Taxes</span>
                <span className="font-medium text-on-surface">{formatCurrency(taxPrice)}</span>
              </div>
              <div className='flex justify-between items-start text-on-surface-variant pb-4 border-b border-outline-variant/30'>
                <div>
                  <span>Delivery Charges</span>
                  <p className="text-[10px] text-muted-foreground font-normal">
                    *(Only delivery charge • Item price separate)
                  </p>
                </div>
                <span className="font-medium text-on-surface">
                  {Number(shippingPrice) === 0 ? (
                    <span className="text-emerald-700 font-semibold">FREE</span>
                  ) : (
                    formatCurrency(shippingPrice)
                  )}
                </span>
              </div>
              
              {Number(discountPrice) > 0 && (
                <div className='flex justify-between items-center text-emerald-600 font-medium pt-2 pb-2'>
                  <span className='flex items-center gap-1.5'>
                    Discount (Code: {couponCode})
                    <CopyButton text={couponCode || ''} title="Copy Promo Code" size="xs" />
                  </span>
                  <span>-{formatCurrency(discountPrice || "0")}</span>
                </div>
              )}
              {Number(giftCardAmount) > 0 && (
                <div className='flex justify-between items-center text-emerald-600 font-medium pt-2 pb-2'>
                  <span className='flex items-center gap-1.5'>
                    Gift Card ({giftCardCode})
                    <CopyButton text={giftCardCode || ''} title="Copy Gift Card Code" size="xs" />
                  </span>
                  <span>-{formatCurrency(giftCardAmount || "0")}</span>
                </div>
              )}
              {pointsRedeemed > 0 && (
                <div className='flex justify-between items-center text-orange-600 font-medium pt-2 pb-2'>
                  <span>Bhakti Points ({pointsRedeemed})</span>
                  <span>-{formatCurrency(LOYALTY_CONFIG.calculateDiscountForPoints(pointsRedeemed).toString())}</span>
                </div>
              )}
              
              <div className='flex justify-between font-bold text-lg text-primary pt-2 pb-2'>
                <span>Total</span>
                <span className="font-bold">{formatCurrency(totalPrice)}</span>
              </div>

              {pointsEarned > 0 && (
                <div className="bg-orange-50 border border-orange-100 rounded-md p-3 flex items-center justify-between text-orange-800">
                  <span className="text-sm font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px]">stars</span>
                    Points Earned
                  </span>
                  <span className="font-bold">+{pointsEarned}</span>
                </div>
              )}
              {/* PayPal Payment */}
              {!isPaid && paymentMethod === 'PayPal' && (
                <div>
                  <PayPalScriptProvider options={{ clientId: paypalClientId }}>
                    <PrintLoadingState />
                    <PayPalButtons
                      createOrder={handleCreatePayPalOrder}
                      onApprove={handleApprovePayPalOrder}
                    />
                  </PayPalScriptProvider>
                </div>
              )}

              {/* Razorpay Payment (Handles UPI, Card, NetBanking) */}
              {!isPaid && ['UPI', 'Card', 'NetBanking'].includes(paymentMethod) && (
                <RazorpayPayment
                  orderId={order.id}
                  amount={Number(order.totalPrice)}
                  customer={{
                    name: shippingAddress?.fullName || (order as any).user?.name,
                    email: (shippingAddress as any)?.guestEmail || (order as any).user?.email,
                    phone: shippingAddress?.contactNumber || (order as any).user?.phoneNumber,
                  }}
                />
              )}

              {/* Stripe Payment */}
              {!isPaid && paymentMethod === 'Stripe' && stripeClientSecret && (
                <StripePayment
                  priceInCents={Number(order.totalPrice) * 100}
                  orderId={order.id}
                  clientSecret={stripeClientSecret}
                />
              )}

              {/* Cash On Delivery */}
              {isAdmin && !isPaid && paymentMethod === 'CashOnDelivery' && (
                <MarkAsPaidButton />
              )}
              {isAdmin && (
                <div className='flex flex-col gap-4 mt-6 border-t pt-4'>
                  {/* Admin Order Packing & Tax Invoice Action Card */}
                  <div className='p-3.5 rounded-xl bg-[#FAF7F0] border border-[#E6C16A]/70 space-y-2 shadow-xs'>
                    <div className='flex items-center justify-between flex-wrap gap-2'>
                      <div>
                        <h4 className='font-bold text-xs text-[#003020] flex items-center gap-1.5'>
                          <Printer className="w-3.5 h-3.5 text-[#C88A20]" />
                          Warehouse Packing & Tax Invoice
                        </h4>
                        <p className='text-[11px] text-neutral-600 mt-0.5 leading-relaxed'>
                          Print official A4 Tax Invoice with logo for the parcel pouch before courier handover.
                        </p>
                      </div>
                      <Button
                        asChild
                        size="sm"
                        className="bg-[#003020] hover:bg-[#002518] text-[#F3D98F] text-xs font-bold gap-1.5 shadow-xs h-8 px-3"
                      >
                        <Link href={`/order/${order.id}/invoice`} target="_blank">
                          <Printer className="w-3.5 h-3.5" />
                          Print Invoice (A4)
                        </Link>
                      </Button>
                    </div>
                  </div>

                  <div className='flex items-center justify-between'>
                    <h3 className='font-bold text-sm text-secondary uppercase tracking-wider'>Shipping & Logistics</h3>
                  </div>

                  <div className='p-3 rounded-xl bg-purple-50/50 border border-purple-200/60 space-y-2'>
                    <div className='flex flex-wrap items-center justify-between gap-2'>
                      <div className='flex items-center gap-2'>
                        <span className="material-symbols-outlined text-purple-700 text-[20px]">local_shipping</span>
                        <span className='font-semibold text-sm text-purple-900'>Shiprocket Integration</span>
                      </div>
                      <ShiprocketShipButton />
                    </div>

                    {order.awbNumber && (
                      <div className='text-xs text-purple-900 pt-1 border-t border-purple-200/50 flex flex-wrap items-center justify-between gap-2'>
                        <span>AWB / Tracking: <strong>{order.awbNumber}</strong></span>
                        <a 
                          href={order.trackingUrl || `https://shiprocket.co/tracking/${order.awbNumber}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-purple-700 underline font-medium hover:text-purple-900 inline-flex items-center gap-1"
                        >
                          Track on Shiprocket
                          <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                        </a>
                      </div>
                    )}
                  </div>

                  <h3 className='font-bold text-sm text-secondary uppercase tracking-wider mt-2'>Manual Status Update</h3>
                  <div className='flex flex-wrap gap-4 items-start'>
                    <UpdateStatusButton statusLabel='Processing' statusValue='PROCESSING' />
                    <UpdateStatusButton statusLabel='Shipped' statusValue='SHIPPED' requiresAwb={true} />
                    <UpdateStatusButton statusLabel='Out for Delivery' statusValue='OUT_FOR_DELIVERY' />
                    <UpdateStatusButton statusLabel='Delivered' statusValue='DELIVERED' />
                  </div>

                  {/* Admin Return Management */}
                  <div className="mt-4">
                    <AdminReturnAction order={order as any} />
                  </div>
                </div>
              )}

              {/* Customer 7-Day Return Request */}
              {!isAdmin && (
                <div className="mt-4 pt-4 border-t border-outline-variant/30 flex justify-center">
                  <ReturnRequestModal order={order as any} />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default OrderDetailsTable;