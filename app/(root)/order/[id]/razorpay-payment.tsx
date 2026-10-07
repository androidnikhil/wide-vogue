'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { createRazorpayOrder, approveRazorpayOrder } from '@/lib/actions/order.actions';
import { toast } from 'sonner';

export default function RazorpayPayment({
  orderId,
  amount,
}: {
  orderId: string;
  amount: number;
}) {
  const [loading, setLoading] = useState(false);

  const loadScript = (src: string) => {
    return new Promise((resolve) => {
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

    // 3. Initialize Razorpay Checkout
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY', // Enter the Key ID generated from the Dashboard
      amount: amount * 100,
      currency: 'INR',
      name: 'Madhav Shringaar',
      description: 'Devotional Purchase',
      image: '/images/logo.png', // Replace with your logo path
      order_id: rzpOrderId, // This is the order_id created in the backend
      handler: async function (response: any) {
        // 4. Verify payment on backend
        toast('Processing payment...', { duration: 2000 });
        
        const verificationResult = await approveRazorpayOrder(orderId, {
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
        });

        if (verificationResult.success) {
          toast.success(verificationResult.message);
        } else {
          toast.error(verificationResult.message);
        }
      },
      prefill: {
        name: 'Devotee',
        email: 'devotee@example.com',
        contact: '9999999999',
      },
      theme: {
        color: '#ffb300', // Matches secondary brand color
      },
    };

    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.on('payment.failed', function (response: any) {
      toast.error(response.error.description);
    });
    paymentObject.open();
    setLoading(false);
  };

  return (
    <Button 
      onClick={handlePayment} 
      disabled={loading} 
      className="w-full gold-gradient-btn text-primary-container font-bold text-label-lg"
    >
      {loading ? 'Processing...' : 'Pay Securely with Razorpay'}
    </Button>
  );
}
