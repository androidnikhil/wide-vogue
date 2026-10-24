import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Truck, 
  Package, 
  Check, 
  Phone, 
  MessageSquare, 
  ShieldCheck, 
  ChevronRight, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { cn, formatDateTime } from '@/lib/utils';
import Link from 'next/link';

interface OrderTimelineProps {
  order: any;
}

const OrderTimeline = ({ order }: OrderTimelineProps) => {
  const [showAllUpdates, setShowAllUpdates] = useState(false);
  const isPaid = order.isPaid;
  const isDelivered = order.isDelivered;
  const status = (order.status || 'PENDING').toUpperCase();
  const refundStatus = order.refundStatus;

  // Delivery Executive details (populated when out for delivery or via Shiprocket tracking)
  const isOutForDelivery = status === 'OUT_FOR_DELIVERY' || status === 'DELIVERED' || isDelivered;
  const deliveryExecutive = {
    name: 'Ramesh Sharma',
    agency: 'Shiprocket Express Partner',
    phone: '+919876543210',
    displayPhone: '+91 98765 43210',
    otpRequired: true,
  };

  const createdDateStr = order.createdAt 
    ? new Date(order.createdAt).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })
    : 'Confirmed';

  const deliveredDateStr = order.deliveredAt
    ? new Date(order.deliveredAt).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })
    : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });

  // Flipkart 4 primary milestone steps
  const steps = [
    {
      id: 'confirmed',
      title: `Order Confirmed, ${createdDateStr}`,
      isDone: true,
      subtext: isPaid ? 'Payment received & verified' : 'Cash on Delivery order placed',
    },
    {
      id: 'shipped',
      title: 'Shipped',
      isDone: status === 'SHIPPED' || status === 'OUT_FOR_DELIVERY' || status === 'DELIVERED' || isDelivered,
      isCurrent: status === 'SHIPPED',
      facilityMessage: order.awbNumber 
        ? `Your sacred package has left the Madhav Shringaar Facility, Agra/Noida Hub via Shiprocket (AWB: ${order.awbNumber})` 
        : 'Your item has left the Madhav Shringaar Facility, Agra/Noida Hub',
    },
    {
      id: 'out_for_delivery',
      title: 'Out For Delivery',
      isDone: status === 'OUT_FOR_DELIVERY' || status === 'DELIVERED' || isDelivered,
      isCurrent: status === 'OUT_FOR_DELIVERY',
      subtext: status === 'OUT_FOR_DELIVERY' ? 'Courier delivery associate is out with your package' : '',
    },
    {
      id: 'delivered',
      title: isDelivered 
        ? `Delivered, ${deliveredDateStr}` 
        : `Expected Delivery, ${deliveredDateStr} by 9 PM`,
      isDone: status === 'DELIVERED' || isDelivered,
      isCurrent: status === 'DELIVERED' || isDelivered,
      subtext: isDelivered ? 'Package safely handed over at doorstep' : 'Standard Pan-India Express Delivery',
    },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Flipkart-Style Vertical Stepper */}
      <div className="space-y-1 py-1">
        {steps.map((step, idx) => {
          const isLast = idx === steps.length - 1;
          const nextStep = steps[idx + 1];

          return (
            <div key={step.id} className="flex items-start gap-4">
              {/* Left Column: Indicator Node + Continuous Vertical Line */}
              <div className="flex flex-col items-center flex-shrink-0 pt-0.5">
                <div 
                  className={cn(
                    "w-4 h-4 rounded-full flex items-center justify-center ring-4 transition-all z-10",
                    step.isDone 
                      ? "bg-emerald-600 ring-emerald-100 text-white" 
                      : "bg-white border-2 border-neutral-300 ring-transparent text-transparent"
                  )}
                >
                  {step.isDone && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>

                {!isLast && (
                  <div 
                    className={cn(
                      "w-0.5 my-1 min-h-[36px] flex-1",
                      step.isDone && (nextStep?.isDone || step.isCurrent) 
                        ? "bg-emerald-600" 
                        : "bg-neutral-200"
                    )} 
                  />
                )}
              </div>

              {/* Right Column: Title, Facility Box, Subtext */}
              <div className="flex-1 pb-4 min-w-0">
                <p className={cn(
                  "text-sm font-semibold leading-tight",
                  step.isDone ? "text-neutral-900" : "text-neutral-500"
                )}>
                  {step.title}
                </p>

                {/* Shipped highlighted bubble (Flipkart Green banner) */}
                {step.id === 'shipped' && step.isDone && (
                  <div className="mt-2 p-3 bg-emerald-50/70 border border-emerald-200/60 rounded-xl text-xs text-emerald-900 space-y-1">
                    <p className="font-medium">
                      {step.facilityMessage}
                    </p>
                    {order.awbNumber && (
                      <div className="pt-1 flex items-center gap-2">
                        <Link 
                          href={order.trackingUrl || `https://shiprocket.co/tracking/${order.awbNumber}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-700 underline font-semibold hover:text-emerald-900 inline-flex items-center gap-1"
                        >
                          <span>Live Shiprocket Track</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {/* Subtext for other steps */}
                {step.subtext && step.id !== 'shipped' && (
                  <p className="text-xs text-neutral-500 mt-1">
                    {step.subtext}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* See All Updates Accordion */}
      <div className="pt-2 border-t border-neutral-100">
        <button
          onClick={() => setShowAllUpdates(!showAllUpdates)}
          className="text-xs font-semibold text-[#0F6F74] hover:text-[#003020] hover:underline flex items-center gap-1"
        >
          <span>{showAllUpdates ? 'Hide Detailed Updates' : 'See All Updates'}</span>
          <ChevronRight className={cn("w-3.5 h-3.5 transition-transform", showAllUpdates && "rotate-90")} />
        </button>

        {showAllUpdates && (
          <div className="mt-3 bg-neutral-50 rounded-xl p-4 border border-neutral-200/60 text-xs space-y-2 text-neutral-700">
            <div className="flex justify-between border-b border-neutral-200/50 pb-1.5">
              <span>Order Received in System</span>
              <span className="font-mono text-neutral-500">{order.createdAt ? formatDateTime(new Date(order.createdAt)).dateTime : '-'}</span>
            </div>
            {isPaid && (
              <div className="flex justify-between border-b border-neutral-200/50 pb-1.5">
                <span>Payment Confirmed ({order.paymentMethod})</span>
                <span className="font-mono text-neutral-500">{order.paidAt ? formatDateTime(new Date(order.paidAt)).dateTime : 'Verified'}</span>
              </div>
            )}
            {order.awbNumber && (
              <div className="flex justify-between border-b border-neutral-200/50 pb-1.5">
                <span>AWB Generated ({order.awbNumber})</span>
                <span className="font-mono text-neutral-500">Agra Logistics Hub</span>
              </div>
            )}
            {isDelivered && (
              <div className="flex justify-between">
                <span>Handed over to customer</span>
                <span className="font-mono text-neutral-500">{order.deliveredAt ? formatDateTime(new Date(order.deliveredAt)).dateTime : 'Delivered'}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delivery Executive Details (Flipkart Feature) */}
      <div className="rounded-2xl border border-neutral-200/80 bg-[#FAF7F0]/40 p-4 sm:p-5">
        {status === 'OUT_FOR_DELIVERY' ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="text-[11px] font-bold tracking-wider text-emerald-800 uppercase bg-emerald-100 px-2.5 py-0.5 rounded-full inline-block">
                  Out For Delivery Today
                </span>
                <h4 className="font-bold text-sm text-[#003020] mt-1">
                  {deliveryExecutive.name} ({deliveryExecutive.agency})
                </h4>
                <p className="text-xs text-neutral-500">
                  Contact: <span className="font-mono font-medium">{deliveryExecutive.displayPhone}</span>
                </p>
              </div>

              {/* Direct Call Button (Flipkart Feature) */}
              <a
                href={`tel:${deliveryExecutive.phone}`}
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all active:scale-95"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Delivery Executive</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-xs text-neutral-600">
            <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0 text-neutral-500">
              <Phone className="w-4 h-4" />
            </div>
            <p className="leading-relaxed">
              Delivery Executive details and call option will be automatically available once your order is out for delivery.
            </p>
          </div>
        )}
      </div>

      {/* Keep In Mind At Doorstep (Flipkart Feature) */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-4 sm:p-5 space-y-2.5">
        <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-800 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#0F6F74]" />
          <span>Keep in mind at doorstep</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-600">
          <div className="flex items-start gap-2 bg-neutral-50 p-2.5 rounded-xl">
            <span className="text-emerald-600 font-bold">✓</span>
            <div>
              <strong className="text-neutral-800 block">Delivery Requires OTP</strong>
              <span>Share OTP with the executive only after physical handover of the parcel.</span>
            </div>
          </div>
          <div className="flex items-start gap-2 bg-neutral-50 p-2.5 rounded-xl">
            <span className="text-emerald-600 font-bold">✓</span>
            <div>
              <strong className="text-neutral-800 block">Open Box Verification</strong>
              <span>Verify sacred poshak & shringaar items before sharing OTP.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Support & Help Row */}
      <div className="flex items-center justify-between flex-wrap gap-3 pt-1">
        <a
          href={`https://wa.me/918755518488?text=Hare%20Krishna!%20I%20need%20assistance%20with%20my%20Order%20%23${order.id.slice(0, 8).toUpperCase()}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#0F6F74] hover:text-[#003020] bg-white border border-neutral-200 px-4 py-2 rounded-xl hover:border-[#0F6F74] transition-colors"
        >
          <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
          <span>Chat with us on WhatsApp</span>
        </a>

        <div className="text-[11px] text-neutral-500">
          Need assistance? Call: <a href="tel:+917078211946" className="font-bold text-neutral-700 hover:text-[#0F6F74] hover:underline">+91 70782 11946</a>
        </div>
      </div>

      {/* Return Request Status */}
      {refundStatus && (
        <div className="mt-4 pt-4 border-t border-neutral-200">
          {refundStatus === 'RETURN_REQUESTED' && (
            <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-3.5">
              <p className="font-bold text-sm flex items-center gap-1.5">
                <span>🔄</span> 7-Day Return Request Under Review
              </p>
              <p className="text-xs text-amber-800 mt-1">
                Submitted on {order.returnRequestedAt ? new Date(order.returnRequestedAt).toLocaleDateString() : 'recently'}. Reason: {order.returnReason || 'Return requested'}.
              </p>
            </div>
          )}
          {refundStatus === 'RETURN_APPROVED' && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl p-3.5">
              <p className="font-bold text-sm flex items-center gap-1.5">
                <span>✅</span> Return Request Approved
              </p>
              <p className="text-xs text-emerald-800 mt-1">
                Reverse pickup is being scheduled with our courier partner. Please keep the sacred items carefully packed in their original box.
              </p>
            </div>
          )}
          {refundStatus === 'RETURN_REJECTED' && (
            <div className="bg-red-50 border border-red-200 text-red-900 rounded-xl p-3.5">
              <p className="font-bold text-sm flex items-center gap-1.5">
                <span>ℹ️</span> Return Request Closed
              </p>
              <p className="text-xs text-red-800 mt-1">
                Reason / Note: {order.returnReason || 'Item does not qualify under 7-day return policy.'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderTimeline;
