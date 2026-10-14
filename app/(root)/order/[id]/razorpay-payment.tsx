'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { createRazorpayOrder, approveRazorpayOrder } from '@/lib/actions/order.actions';
import { toast } from 'sonner';

export default function RazorpayPayment({
  orderId,
  amount,
  customer,
}: {
  orderId: string;
  amount: number;
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
  };
}) {
  const [loading, setLoading] = useState(false);

  const loadScript = (src: string) => {
    return new Promise((resolve) => {
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

  const handlePayment = async () => {
    setLoading(true);
    
    // 1. Load Razorpay script
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
    if (!res) {
      toast.error('Razorpay SDK failed to load. Are you online?');
      setLoading(false);
      return;
    }

    // 2. Create Order on backend
    const createOrderResult = await createRazorpayOrder(orderId);
    if (!createOrderResult.success) {
      toast.error(createOrderResult.message);
      setLoading(false);
      return;
    }

    const rzpOrderId = createOrderResult.data;
    const rzpKeyId = (createOrderResult as any).keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_Tky1mPj28GZWtr';

    // 3. Initialize Razorpay Checkout
    const options = {
      key: rzpKeyId,
      amount: Math.round(amount * 100),
      currency: 'INR',
      name: 'Madhav Shringaar',
      description: 'Devotional Purchase',
      image: '/images/logo.png',
      order_id: rzpOrderId,
      handler: async function (response: any) {
        // 4. Verify payment on backend
        toast.loading('Confirming your payment...', { id: 'approve-payment' });
        
        try {
          const verificationResult = await approveRazorpayOrder(orderId, {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          });

          toast.dismiss('approve-payment');

          if (verificationResult.success) {
            toast.success(verificationResult.message || 'Payment confirmed successfully!');
            // Refresh server state immediately
            setTimeout(() => {
              window.location.reload();
            }, 600);
          } else {
            toast.error(verificationResult.message || 'Payment verification failed');
            setLoading(false);
          }
        } catch (err: any) {
          toast.dismiss('approve-payment');
          toast.error(err.message || 'An error occurred while verifying payment');
          setLoading(false);
        }
      },
      prefill: {
        name: customer?.name || 'Devotee',
        email: customer?.email || '',
        contact: customer?.phone ? customer.phone.replace(/\D/g, '').slice(-10) : '',
      },
      theme: {
        color: '#083329',
      },
      modal: {
        ondismiss: function () {
          setLoading(false);
        },
      },
    };

    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.on('payment.failed', function (response: any) {
      toast.error(response.error?.description || 'Payment failed');
      setLoading(false);
    });
    paymentObject.open();
  };

  return (
    <Button 
      onClick={handlePayment} 
      disabled={loading} 
      className="w-full bg-[#083329] hover:bg-[#002518] text-[#F3D98F] font-bold text-sm py-3 rounded-xl shadow-md border border-[#D4AF37]/30 transition-all"
    >
      {loading ? 'Processing Payment...' : 'Pay Securely with Razorpay'}
    </Button>
  );
}
