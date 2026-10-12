import { Metadata } from 'next';
import FAQClient from './faq-client';
import { APP_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Devotee Help Centre & FAQs | Laddu Gopal Poshak (Agra & Noida)',
  description: 'Frequently asked questions regarding Laddu Gopal Ji poshak sizing (0-6 No.), Vrindavan craftsmanship, express delivery in Agra, Noida, Delhi NCR & pan-India.',
  keywords: [
    'Laddu Gopal poshak FAQ',
    'Laddu Gopal size guide Agra',
    'Kanha dress online Noida',
    'Laddu Gopal poshak delivery time',
    'Madhav Shringaar customer care',
  ],
  alternates: {
    canonical: '/faq',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I determine the right size (0 to 6 No.) for my Laddu Gopal Ji?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Measure your deity vigraha from the lotus base to the top of the crown in inches. 0 No. is approx 1.5–2 inches, 1 No. is 2.5 inches, 2 No. is 3 inches, 3 No. is 3.5 inches, 4 No. is 4 inches, 5 No. is 5 inches, and 6 No. is 6 inches. Consult our Size Chart page for full guidance.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where does Madhav Shringaar operate from?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Madhav Shringaar operates from Agra and Noida in Uttar Pradesh (Delhi NCR / Braj Region proximity), offering fast local dispatch to Agra, Noida, Greater Noida, and reliable pan-India delivery.',
      },
    },
    {
      '@type': 'Question',
      name: 'How many days does pan-India and NCR delivery take?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Express delivery within Agra, Noida, and Delhi NCR typically takes 1 to 2 business days. Rest of India usually takes 3 to 5 business days with live tracking.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I return or exchange a poshak if it does not fit?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, we offer an easy 7-day return and exchange window for unused, pristine items in original sacred packaging directly through your account Orders section.',
      },
    },
  ],
};

export default function FAQPage() {
  return (
    <div className="py-8 px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <FAQClient />
    </div>
  );
}
