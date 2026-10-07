import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Returns & Refunds Policy',
};

export default function ReturnsPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="h1-bold text-primary mb-8 text-center">Returns & Refunds Policy</h1>
      
      <div className="bg-surface-container-low p-8 rounded-2xl border border-outline-variant/30 space-y-6 prose prose-stone max-w-none prose-headings:text-primary prose-a:text-secondary">
        <p>At Madhav Shringaar, we take utmost care in packaging and delivering our sacred products to you. However, if you are not entirely satisfied with your purchase, we're here to help.</p>

        <h3 className="font-bold text-xl mt-6">1. Returns</h3>
        <p>You have 7 calendar days to return an item from the date you received it.</p>
        <p>To be eligible for a return, your item must be unused and in the same condition that you received it. Your item must be in the original packaging.</p>
        <p>Your item needs to have the receipt or proof of purchase.</p>

        <h3 className="font-bold text-xl mt-6">2. Refunds</h3>
        <p>Once we receive your item, we will inspect it and notify you that we have received your returned item. We will immediately notify you on the status of your refund after inspecting the item.</p>
        <p>If your return is approved, we will initiate a refund to your original method of payment (or via bank transfer for COD orders). You will receive the credit within 5-7 working days, depending on your card issuer's policies.</p>

        <h3 className="font-bold text-xl mt-6">3. Exceptions</h3>
        <p>Please note that for hygiene and spiritual purity reasons, certain items like worn poshak (clothing), used mukuts, or custom-made murtis cannot be returned unless they arrived damaged or defective.</p>

        <h3 className="font-bold text-xl mt-6">4. Shipping for Returns</h3>
        <p>You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund.</p>

        <h3 className="font-bold text-xl mt-6">5. Contact Us</h3>
        <p>If you have any questions on how to return your item to us, contact us at <strong>info@madhavshringaar.com</strong> or WhatsApp us at <strong>+91 70782 11946</strong>.</p>
      </div>
    </div>
  );
}
