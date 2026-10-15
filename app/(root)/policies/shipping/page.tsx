import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping Policy & Pan-India Delivery | Agra & Noida Hubs',
  description: 'Shipping timelines and delivery estimates for Madhav Shringaar. Express 1-2 day delivery in Agra, Noida & Delhi NCR, 3-5 days across India.',
  keywords: [
    'Madhav Shringaar shipping policy',
    'Laddu Gopal poshak delivery time',
    'Krishna dress delivery Agra Noida',
  ],
  alternates: {
    canonical: '/policies/shipping',
  },
};

export default function ShippingPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="h1-bold text-primary mb-8 text-center">Shipping &amp; Delivery Policy</h1>
      
      <div className="bg-surface-container-low p-8 rounded-2xl border border-outline-variant/30 space-y-6 prose prose-stone max-w-none prose-headings:text-primary prose-a:text-secondary">
        <h3 className="font-bold text-xl mt-6">1. Operating Hubs &amp; Dispatch</h3>
        <p>Madhav Shringaar operates from our fulfillment and artisan workshops located in <strong>Agra and Noida</strong> (Uttar Pradesh). All orders are carefully inspected and securely packaged within 1-2 business days.</p>
        <p>If we are experiencing a high volume of orders (such as during Janmashtami, Radhashtami, or Diwali), shipments may take an additional day. Please allow extra transit time during festive rush periods.</p>

        <h3 className="font-bold text-xl mt-6">2. Shipping Rates &amp; Delivery Estimates</h3>
        <p>Shipping charges for your order will be calculated and clearly displayed at checkout.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Local Express (Agra, Noida, Greater Noida &amp; Delhi NCR):</strong> 1-2 business days. Cost: ₹50 (Free over ₹999).</li>
          <li><strong>Pan-India Standard Delivery:</strong> 3-5 business days. Cost: ₹50.</li>
          <li><strong>Free Shipping:</strong> Automatically applied on all orders above ₹999.</li>
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
