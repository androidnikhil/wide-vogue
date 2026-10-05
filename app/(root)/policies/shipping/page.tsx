import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping Policy',
};

export default function ShippingPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="h1-bold text-primary mb-8 text-center">Shipping Policy</h1>
      
      <div className="bg-surface-container-low p-8 rounded-2xl border border-outline-variant/30 space-y-6 prose prose-stone max-w-none prose-headings:text-primary prose-a:text-secondary">
        <h3 className="font-bold text-xl mt-6">1. Processing Time</h3>
        <p>All orders are processed within 1-2 business days. Orders are not shipped or delivered on weekends or holidays.</p>
        <p>If we are experiencing a high volume of orders (such as during Janmashtami or Diwali), shipments may be delayed by a few days. Please allow additional days in transit for delivery.</p>

        <h3 className="font-bold text-xl mt-6">2. Shipping Rates & Delivery Estimates</h3>
        <p>Shipping charges for your order will be calculated and displayed at checkout.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Standard Delivery:</strong> 3-5 business days. Cost: ₹50</li>
          <li><strong>Free Shipping:</strong> Available on all orders over ₹999.</li>
        </ul>
        <p>Delivery delays can occasionally occur due to courier issues beyond our control.</p>

        <h3 className="font-bold text-xl mt-6">3. Shipment Confirmation & Order Tracking</h3>
        <p>You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s). You will also receive WhatsApp updates at every stage of the shipment process. The tracking number will be active within 24 hours.</p>

        <h3 className="font-bold text-xl mt-6">4. Damages</h3>
        <p>Madhav Shringaar ensures secure and sacred packaging for all items. However, if you receive a damaged product, please contact us immediately with photographic evidence, and we will initiate a replacement or refund.</p>
      </div>
    </div>
  );
}
