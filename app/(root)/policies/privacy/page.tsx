import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="h1-bold text-primary mb-8 text-center">Privacy Policy</h1>
      
      <div className="bg-surface-container-low p-8 rounded-2xl border border-outline-variant/30 space-y-6 prose prose-stone max-w-none prose-headings:text-primary prose-a:text-secondary">
        <p>Last updated: October 2026</p>
        <p>This Privacy Policy describes how Madhav Shringaar ("we", "us", or "our") collects, uses, and discloses your personal information when you visit or make a purchase from our website.</p>

        <h3 className="font-bold text-xl mt-6">1. Information We Collect</h3>
        <p>When you visit the site, we collect certain information about your device, your interaction with the site, and information necessary to process your purchases. We may also collect additional information if you contact us for customer support.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Order Information:</strong> Name, billing address, shipping address, payment information, email address, and phone number.</li>
          <li><strong>Device Information:</strong> Version of web browser, IP address, time zone, cookie information, what sites or products you view, search terms, and how you interact with the Site.</li>
        </ul>

        <h3 className="font-bold text-xl mt-6">2. How We Use Your Information</h3>
        <p>We use the Order Information that we collect generally to fulfill any orders placed through the Site (including processing your payment information, arranging for shipping, and providing you with invoices and/or order confirmations). Additionally, we use this Order Information to:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Communicate with you;</li>
          <li>Screen our orders for potential risk or fraud; and</li>
          <li>When in line with the preferences you have shared with us, provide you with information or advertising relating to our products or services.</li>
        </ul>

        <h3 className="font-bold text-xl mt-6">3. Sharing Your Information</h3>
        <p>We share your Personal Information with third parties to help us use your Personal Information, as described above. For example, we use a payment gateway (Razorpay/PayPal) for secure processing of payments, and delivery partners (Delhivery/BlueDart) to ship your orders.</p>

        <h3 className="font-bold text-xl mt-6">4. Data Retention</h3>
        <p>When you place an order through the Site, we will maintain your Order Information for our records unless and until you ask us to delete this information.</p>

        <h3 className="font-bold text-xl mt-6">5. Changes</h3>
        <p>We may update this privacy policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal, or regulatory reasons.</p>
      </div>
    </div>
  );
}
