'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Loader, Lock, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  createOrder, 
  createRazorpayOrderFromCart, 
  createPaidOrderWithRazorpay 
} from '@/lib/actions/order.actions';
import { toast } from 'sonner';

interface PlaceOrderFormProps {
  paymentMethod?: string;
  totalAmount?: number;
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
  };
}

export default function PlaceOrderForm({
  paymentMethod = 'CashOnDelivery',
  totalAmount = 0,
  customer = {},
}: PlaceOrderFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const isZeroAmount = totalAmount <= 0 || paymentMethod === 'GiftCard';
  const isCOD = !isZeroAmount && paymentMethod === 'CashOnDelivery';

  const loadScript = (src: string) => {
    return new Promise<boolean>((resolve) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        return resolve(true);
      }
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrderZeroAmount = async () => {
    setLoading(true);
    try {
      const res = await createOrder();
      if (res.redirectTo) {
        toast.success('Sacred order placed successfully! (100% covered by Gift Card / Discount)');
        router.push(res.redirectTo);
      } else if (!res.success) {
        toast.error(res.message);
        setLoading(false);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to place order. Please try again.');
      setLoading(false);
    }
  };

  const handlePlaceOrderCOD = async () => {
    setLoading(true);
    try {
      const res = await createOrder();
      if (res.redirectTo) {
        toast.success('Order placed successfully via Cash on Delivery!');
        router.push(res.redirectTo);
      } else if (!res.success) {
        toast.error(res.message);
        setLoading(false);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to place order. Please try again.');
      setLoading(false);
    }
  };

  const handleOnlinePaymentRazorpay = async () => {
    setLoading(true);
    try {
      // 1. Load Razorpay Checkout Script
      const scriptLoaded = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!scriptLoaded) {
        toast.error('Unable to load payment gateway. Please check your internet connection.');
        setLoading(false);
        return;
      }

      // 2. Generate Razorpay Order for current Cart
      const rzpRes = await createRazorpayOrderFromCart();
      if (!rzpRes.success || !rzpRes.data) {
        toast.error(rzpRes.message || 'Failed to initialize payment gateway.');
        setLoading(false);
        return;
      }

      const rzpOrderId = rzpRes.data;

      // 3. Open Razorpay Checkout modal directly
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_Tky1mPj28GZWtr',
        amount: Math.round(totalAmount * 100),
        currency: 'INR',
        name: 'Madhav Shringaar',
        description: `Order Payment (${paymentMethod})`,
        image: '/images/logo.png',
        order_id: rzpOrderId,
        handler: async function (response: any) {
          toast.loading('Payment received! Confirming your sacred order...', { id: 'verify-payment' });
          try {
            const verificationRes = await createPaidOrderWithRazorpay({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });

            toast.dismiss('verify-payment');

            if (verificationRes.success && verificationRes.redirectTo) {
              toast.success('Payment verified! Order placed successfully.');
              router.push(verificationRes.redirectTo);
            } else {
              toast.error(verificationRes.message || 'Payment verification failed.');
              setLoading(false);
            }
          } catch (verifyErr: any) {
            toast.dismiss('verify-payment');
            toast.error(verifyErr.message || 'Verification error occurred.');
            setLoading(false);
          }
        },
        prefill: {
          name: customer.name || '',
          email: customer.email || '',
          contact: customer.phone ? customer.phone.replace(/\D/g, '').slice(-10) : '',
        },
        theme: {
          color: '#B8860B',
        },
        modal: {
          ondismiss: function () {
            toast.info('Payment was not completed. Your cart has been safely preserved.');
            setLoading(false);
          },
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.on('payment.failed', function (failRes: any) {
        toast.error(failRes.error?.description || 'Payment was declined. Please try again.');
        setLoading(false);
      });
      paymentObject.open();
    } catch (err: any) {
      toast.error(err.message || 'Payment initiation failed.');
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (isZeroAmount) {
      handlePlaceOrderZeroAmount();
    } else if (isCOD) {
      handlePlaceOrderCOD();
    } else {
      handleOnlinePaymentRazorpay();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <Button
        type="submit"
        disabled={loading}
        className="w-full h-12 rounded-xl gold-gradient-btn text-primary-container font-label-lg font-bold shadow-md hover:scale-[1.01] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            <span>Confirming Order...</span>
          </>
        ) : isZeroAmount ? (
          <>
            <Check className="w-5 h-5 stroke-[2.5]" />
            <span>Confirm Order (₹0 - 100% Paid)</span>
          </>
        ) : isCOD ? (
          <>
            <Check className="w-5 h-5 stroke-[2.5]" />
            <span>Place Order (Cash on Delivery)</span>
          </>
        ) : (
          <>
            <Lock className="w-4 h-4" />
            <span>Pay &amp; Place Order (₹{totalAmount.toLocaleString('en-IN')})</span>
          </>
        )}
      </Button>
      {isZeroAmount ? (
        <p className="text-[11px] text-center text-emerald-700 mt-2 font-medium flex items-center justify-center gap-1">
          ✓ Entire order covered by Gift Card / Discount. No payment required.
        </p>
      ) : !isCOD && (
        <p className="text-[11px] text-center text-on-surface-variant mt-2 flex items-center justify-center gap-1">
          <CreditCard className="w-3.5 h-3.5 text-secondary" />
          100% Secure 256-Bit SSL Encrypted Razorpay Checkout
        </p>
      )}
    </form>
  );
}