import { CheckCircle2, Circle, Truck, Package, PackageCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface OrderTimelineProps {
  order: any;
}

const OrderTimeline = ({ order }: OrderTimelineProps) => {
  const isPaid = order.isPaid;
  const isDelivered = order.isDelivered;
  const status = order.status || 'PENDING';
  
  const steps = [
    {
      title: 'Order Placed',
      description: order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '',
      icon: Package,
      isCompleted: true, // Always completed if order exists
      isActive: status === 'PENDING',
    },
    {
      title: 'Processing',
      description: isPaid ? 'Payment Confirmed' : 'Awaiting Payment',
      icon: CheckCircle2,
      isCompleted: status === 'PROCESSING' || status === 'SHIPPED' || status === 'DELIVERED' || isDelivered,
      isActive: status === 'PROCESSING',
    },
    {
      title: 'Shipped',
      description: order.awbNumber ? `Tracking: ${order.awbNumber}` : '',
      icon: Truck,
      isCompleted: status === 'SHIPPED' || status === 'DELIVERED' || isDelivered,
      isActive: status === 'SHIPPED',
    },
    {
      title: 'Delivered',
      description: order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString() : '',
      icon: PackageCheck,
      isCompleted: status === 'DELIVERED' || isDelivered,
      isActive: status === 'DELIVERED',
    }
  ];

  return (
    <div className="w-full">
      <div className="relative border-l-2 border-outline-variant/30 ml-4 space-y-8 pb-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={index} className="relative pl-8">
              <div 
                className={cn(
                  "absolute -left-[17px] top-0 flex h-8 w-8 items-center justify-center rounded-full border-2 bg-background",
                  step.isCompleted ? "border-green-500 text-green-500" : 
                  step.isActive ? "border-primary text-primary" : 
                  "border-outline-variant/50 text-outline-variant/50"
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex flex-col pt-1">
                <h4 className={cn(
                  "text-base font-semibold",
                  step.isCompleted || step.isActive ? "text-on-surface" : "text-on-surface-variant/70"
                )}>
                  {step.title}
                </h4>
                {step.description && (
                  <p className="text-sm text-on-surface-variant mt-1">
                    {step.description}
                  </p>
                )}
                {step.title === 'Shipped' && order.trackingUrl && step.isCompleted && (
                  <Link href={order.trackingUrl} target="_blank" className="text-primary text-sm mt-1 hover:underline">
                    Click here to track your package
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTimeline;
