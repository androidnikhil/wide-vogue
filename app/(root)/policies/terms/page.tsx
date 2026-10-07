import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
};

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="h1-bold text-primary mb-8 text-center">Terms of Service</h1>
      
      <div className="bg-surface-container-low p-8 rounded-2xl border border-outline-variant/30 space-y-6 prose prose-stone max-w-none prose-headings:text-primary prose-a:text-secondary">
        <h3 className="font-bold text-xl mt-6">1. Overview</h3>
        <p>This website is operated by Madhav Shringaar. Throughout the site, the terms "we", "us" and "our" refer to Madhav Shringaar. We offer this website, including all information, tools, and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies and notices stated here.</p>

        <h3 className="font-bold text-xl mt-6">2. Online Store Terms</h3>
        <p>By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence. You may not use our products for any illegal or unauthorized purpose.</p>

        <h3 className="font-bold text-xl mt-6">3. Products and Services</h3>
        <p>Certain products or services may be available exclusively online through the website. These products or services may have limited quantities and are subject to return or exchange only according to our Return Policy.</p>
        <p>We have made every effort to display as accurately as possible the colors and images of our products. We cannot guarantee that your computer monitor's display of any color will be accurate.</p>

        <h3 className="font-bold text-xl mt-6">4. Accuracy of Billing and Account Information</h3>
        <p>We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household or per order.</p>

        <h3 className="font-bold text-xl mt-6">5. Changes to Terms of Service</h3>
        <p>You can review the most current version of the Terms of Service at any time at this page. We reserve the right, at our sole discretion, to update, change or replace any part of these Terms of Service by posting updates and changes to our website.</p>
      </div>
    </div>
  );
}
