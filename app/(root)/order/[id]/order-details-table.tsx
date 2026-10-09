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
import StripePayment from './stripe-payment';
import RazorpayPayment from './razorpay-payment';
import OrderTimeline from '@/components/shared/order/order-timeline';
import { LOYALTY_CONFIG } from '@/lib/loyalty.config';

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

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 mt-4 gap-4">
        <div>
          <h1 className='h2-bold text-primary'>Order Details</h1>
          <p className="text-on-surface-variant font-mono mt-1 text-sm bg-surface-container px-2 py-1 rounded-md inline-block border border-outline-variant/30">ID: {id}</p>
        </div>
      </div>
      <div className='grid lg:grid-cols-3 gap-6 lg:gap-8'>
        <div className='col-span-2 space-y-6 overflow-x-auto pb-10'>
          <Card className="border-secondary/10 shadow-sm rounded-2xl overflow-hidden bg-surface">
            <div className="bg-primary-container text-surface p-4 border-b border-secondary/20">
              <h2 className='font-title-lg flex items-center gap-2'><span className="material-symbols-outlined text-[20px]">local_shipping</span> Track Your Order</h2>
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
              <div className='flex justify-between items-center text-on-surface-variant pb-4 border-b border-outline-variant/30'>
                <span>Shipping</span>
                <span className="font-medium text-on-surface">{formatCurrency(shippingPrice)}</span>
              </div>
              
              {Number(discountPrice) > 0 && (
                <div className='flex justify-between items-center text-emerald-600 font-medium pt-2 pb-2'>
                  <span>Discount (Code: {couponCode})</span>
                  <span>-{formatCurrency(discountPrice || "0")}</span>
                </div>
              )}
              {Number(giftCardAmount) > 0 && (
                <div className='flex justify-between items-center text-emerald-600 font-medium pt-2 pb-2'>
                  <span>Gift Card ({giftCardCode})</span>
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
                <div className='flex flex-col gap-3 mt-6 border-t pt-4'>
                  <h3 className='font-bold text-sm text-secondary uppercase tracking-wider'>Admin Actions: Update Status</h3>
                  <div className='flex flex-wrap gap-4 items-start'>
                    <UpdateStatusButton statusLabel='Processing' statusValue='PROCESSING' />
                    <UpdateStatusButton statusLabel='Shipped' statusValue='SHIPPED' requiresAwb={true} />
                    <UpdateStatusButton statusLabel='Out for Delivery' statusValue='OUT_FOR_DELIVERY' />
                    <UpdateStatusButton statusLabel='Delivered' statusValue='DELIVERED' />
                  </div>
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