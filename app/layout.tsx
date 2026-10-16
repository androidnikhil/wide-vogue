import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "@/assets/styles/globals.css";
import { APP_NAME, APP_URL, DEFAULT_SEO_TITLE, DEFAULT_SEO_DESCRIPTION, SEO_KEYWORDS } from "@/lib/constants";
import { ThemeProvider } from "next-themes";
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from "@/components/ui/sonner";
import { LanguageProvider } from "@/lib/i18n/language-context";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    template: `%s | Madhav Shringaar - Agra & Noida`,
    default: DEFAULT_SEO_TITLE,
  },
  description: DEFAULT_SEO_DESCRIPTION,
  keywords: SEO_KEYWORDS,
  authors: [{ name: 'Madhav Shringaar', url: APP_URL }],
  creator: 'Madhav Shringaar',
  publisher: 'Madhav Shringaar',
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: APP_URL,
    siteName: 'Madhav Shringaar | Agra & Noida',
    title: DEFAULT_SEO_TITLE,
    description: DEFAULT_SEO_DESCRIPTION,
    images: [
      {
        url: '/images/devotional/complete_shringar.webp',
        width: 1200,
        height: 630,
        alt: 'Madhav Shringaar - Divine Laddu Gopal Ji Poshak & Shringaar Agra Noida',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_SEO_TITLE,
    description: DEFAULT_SEO_DESCRIPTION,
    images: ['/images/devotional/complete_shringar.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const jsonLdLocalBusiness = {
  '@context': 'https://schema.org',
  '@type': ['Store', 'LocalBusiness'],
  name: 'Madhav Shringaar',
  alternateName: 'Madhav Shringaar - Devotional Store Agra & Noida',
  description: DEFAULT_SEO_DESCRIPTION,
  url: APP_URL,
  logo: `${APP_URL}/images/logo.png`,
  image: `${APP_URL}/images/devotional/complete_shringar.webp`,
  telephone: '+917982160480',
  email: 'info@madhavshringaar.com',
  taxID: '09EHFPP7126A1ZE',
  priceRange: '₹₹',
  currenciesAccepted: 'INR',
  paymentAccepted: 'Cash on Delivery, UPI, Credit Card, Debit Card, Net Banking',
  areaServed: [
    { '@type': 'City', name: 'Agra' },
    { '@type': 'City', name: 'Noida' },
    { '@type': 'City', name: 'Greater Noida' },
    { '@type': 'City', name: 'Mathura' },
    { '@type': 'City', name: 'Vrindavan' },
    { '@type': 'AdministrativeArea', name: 'Delhi NCR' },
    { '@type': 'AdministrativeArea', name: 'Uttar Pradesh' },
    { '@type': 'Country', name: 'India' },
  ],
  address: [
    {
      '@type': 'PostalAddress',
      addressLocality: 'Agra',
      addressRegion: 'Uttar Pradesh',
      postalCode: '282001',
      addressCountry: 'IN',
    },
    {
      '@type': 'PostalAddress',
      addressLocality: 'Noida',
      addressRegion: 'Uttar Pradesh',
      postalCode: '201301',
      addressCountry: 'IN',
    },
  ],
  sameAs: ['https://wa.me/917982160480'],
};

const jsonLdWebSite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Madhav Shringaar',
  url: APP_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${APP_URL}/search?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com" rel="preconnect"/>
        <link crossOrigin="anonymous" href="https://fonts.gstatic.com" rel="preconnect"/>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdLocalBusiness) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
      </head>
      <body
        className={`${inter.className} ${playfair.variable} font-body-lg antialiased bg-background text-on-background`}
        suppressHydrationWarning
      >
        <NextTopLoader color="#b8860b" showSpinner={false} />
        <ThemeProvider
          attribute='class'
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            {children}
            <Toaster />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
