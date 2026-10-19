'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  Ruler, 
  Truck, 
  ShieldCheck, 
  CreditCard, 
  RotateCcw, 
  Gift, 
  MessageCircle, 
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface FAQItem {
  q: string;
  a: string;
}

interface FAQCategory {
  id: string;
  name: string;
  icon: any;
  items: FAQItem[];
}

const faqData: FAQCategory[] = [
  {
    id: 'sizing',
    name: 'Sizing & Poshak Fit',
    icon: Ruler,
    items: [
      {
        q: 'How do I determine the right size (0 to 6 No.) for my Laddu Gopal Ji?',
        a: 'Measure your deity vigraha from the lotus base to the top of the crown / shika in inches. 0 No. is approximately 1.5–2 inches (gheva/skirt diameter 3–4"), 1 No. is 2.5 inches (5"), 2 No. is 3 inches (6"), 3 No. is 3.5 inches (7"), 4 No. is 4 inches (8"), 5 No. is 5 inches (10"), and 6 No. is 6 inches (12"). You can check our dedicated Size Chart page for exact visual guidance.',
      },
      {
        q: 'What if the poshak does not fit my deity after delivery?',
        a: 'We understand the sacred reverence of seva. If the ordered size does not comfortably fit your deity, you can request an exchange within 7 days of delivery through your Orders page or by contacting our devotee helpline.',
      },
      {
        q: 'Are the inner linings soft enough for metal and ashtadhatu vigrahas?',
        a: 'Yes, absolutely. All our poshaks feature pure cotton or fine satin deity-safe linings that prevent scratching or tarnishing of delicate vigraha polishing and ashtadhatu surfaces.',
      },
    ],
  },
  {
    id: 'shipping',
    name: 'Shipping & Delivery',
    icon: Truck,
    items: [
      {
        q: 'How many days does pan-India delivery take?',
        a: 'Metro cities typically receive dispatches in 2–4 business days. Other regions across India take 4–6 business days. All parcels are dispatched via premium couriers (Bluedart, Delhivery, Xpressbees) via Shiprocket.',
      },
      {
        q: 'How do I track my active parcel in real-time?',
        a: 'As soon as your parcel is dispatched from Vrindavan Dham, you will receive an SMS and WhatsApp update with your live AWB tracking number. You can also track anytime on our Track Order page or your Account Hub.',
      },
      {
        q: 'Is Cash on Delivery (COD) available in my area?',
        a: 'Yes, Cash on Delivery is available across 19,000+ Indian pin codes. Simply enter your delivery pincode during checkout to verify instant COD availability.',
      },
    ],
  },
  {
    id: 'authenticity',
    name: 'Vrindavan Craft & Purity',
    icon: ShieldCheck,
    items: [
      {
        q: 'Are your items truly handcrafted in Vrindavan Dham?',
        a: 'Yes. Every poshak, pagdi, bansuri, and shringaar item is designed and finished by traditional artisan sevaks in the holy lanes of Vrindavan and Mathura Dham, upholding centuries of sacred craftsmanship.',
      },
      {
        q: 'How is the packaging sanitized and handled before dispatch?',
        a: 'Every parcel is packed in a pure, vegetarian, smoke-free environment. Items are reverently inspected and enclosed in moisture-sealed tamper-evident boxes so they reach your home altar in pristine purity.',
      },
    ],
  },
  {
    id: 'payments',
    name: 'Payment & Security',
    icon: CreditCard,
    items: [
      {
        q: 'Which payment methods do you accept?',
        a: 'We accept UPI (Google Pay, PhonePe, Paytm, BHIM), all major Credit & Debit Cards (Visa, MasterCard, RuPay), NetBanking across 50+ banks, and Cash on Delivery (COD).',
      },
      {
        q: 'Is my online payment safe and encrypted?',
        a: 'Yes. All online payments are handled via bank-grade 256-bit SSL encrypted PCI-DSS Level 1 compliant gateways. We strictly adhere to RBI tokenization guidelines and never store unmasked card numbers.',
      },
      {
        q: 'How are refunds handled for cancelled orders?',
        a: 'Refunds for prepaid orders are initiated immediately back to your original payment mode (UPI/Card/Bank) and reflect within 24–48 banking hours.',
      },
    ],
  },
  {
    id: 'returns',
    name: 'Returns & Exchanges',
    icon: RotateCcw,
    items: [
      {
        q: 'What is your return and replacement policy?',
        a: 'We provide a 7-day reverent exchange and replacement policy for unworn, sacred items if there is any size mismatch or rare transit damage. Simply initiate a request from your Orders section.',
      },
      {
        q: 'What should I do if an item arrives damaged in transit?',
        a: 'Please share a photo of the outer box and damaged item via WhatsApp (+91 79821 60480) within 48 hours of delivery. We will promptly dispatch a replacement at zero extra cost to you.',
      },
    ],
  },
  {
    id: 'rewards',
    name: 'Bhakti Points & Vouchers',
    icon: Gift,
    items: [
      {
        q: 'How do I earn and redeem Bhakti Points?',
        a: 'You earn 1 Bhakti Point for every ₹10 spent on authentic shringaar, plus 50 bonus points upon sharing verified deity photos. Each point is worth ₹0.10 and points apply automatically at checkout.',
      },
      {
        q: 'Can I gift a Madhav Shringaar voucher to another devotee?',
        a: 'Yes, you can select an auspicious gift denomination (₹501, ₹1,100, ₹2,100, ₹5,100) from the Gift Cards section and share the sacred voucher code directly with friends and family.',
      },
    ],
  },
];

export default function FAQClient() {
  const [selectedCat, setSelectedCat] = useState('sizing');
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({
    'sizing-0': true,
  });

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Filter items based on search query
  const filteredCategories = faqData.map((cat) => {
    if (!searchQuery.trim()) return cat;
    const matchingItems = cat.items.filter(
      (it) =>
        it.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        it.a.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return { ...cat, items: matchingItems };
  }).filter((cat) => !searchQuery.trim() || cat.items.length > 0);

  const activeCategory = searchQuery.trim()
    ? null
    : faqData.find((c) => c.id === selectedCat) || faqData[0];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Devotee Help Center Banner */}
      <div className="bg-gradient-to-r from-[#003020] via-[#0F6F74] to-[#003020] rounded-3xl p-6 md:p-10 text-white shadow-lg relative overflow-hidden text-center">
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#E6C16A]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#F3D98F] text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#E6C16A]" />
            Devotee Care & Seva Assistance
          </div>
          <h1 className="font-serif text-2xl md:text-4xl font-bold">
            How May We Assist Your Seva Today?
          </h1>
          <p className="text-xs md:text-sm text-white/80 leading-relaxed">
            Quick answers regarding poshak sizes, Vrindavan craftsmanship, dispatch timelines, and sacred packaging.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-lg mx-auto pt-2">
            <Search className="w-5 h-5 text-neutral-400 absolute left-4 top-5" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sizing, delivery time, COD, return policy..."
              className="pl-12 pr-4 h-12 bg-white text-neutral-900 rounded-2xl border-none shadow-md text-sm placeholder:text-neutral-400 focus-visible:ring-2 focus-visible:ring-[#E6C16A]"
            />
          </div>
        </div>
      </div>

      {/* Categories Grid (No scrollbar / No slider) */}
      {!searchQuery.trim() && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 md:gap-3">
          {faqData.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCat === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCat(cat.id);
                  setOpenItems((prev) => ({ ...prev, [`${cat.id}-0`]: true }));
                }}
                className={`group p-3 sm:p-4 rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-200 border cursor-pointer min-h-[95px] ${
                  isSelected
                    ? 'bg-[#003020] text-white border-[#E6C16A] shadow-md ring-2 ring-[#E6C16A]/30 scale-[1.02]'
                    : 'bg-white text-neutral-800 border-neutral-200/90 hover:border-[#0F6F74]/50 hover:bg-neutral-50/80 hover:shadow-sm'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors mb-2 ${
                    isSelected
                      ? 'bg-[#E6C16A]/20 text-[#F3D98F]'
                      : 'bg-[#0F6F74]/10 text-[#0F6F74] group-hover:bg-[#0F6F74]/15'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <span
                  className={`block text-xs sm:text-[13px] font-semibold leading-tight ${
                    isSelected ? 'text-[#F3D98F]' : 'text-[#003020]'
                  }`}
                >
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Accordion Questions List */}
      <div className="space-y-4">
        {searchQuery.trim() ? (
          /* Search results across all categories */
          filteredCategories.length === 0 ? (
            <div className="bg-white rounded-2xl border border-neutral-200/80 p-12 text-center space-y-3">
              <HelpCircle className="w-10 h-10 text-neutral-400 mx-auto" />
              <h3 className="font-serif text-lg font-bold text-[#003020]">
                No matching answers found
              </h3>
              <p className="text-xs text-neutral-500">
                Need personalized help? Reach our devotee support on WhatsApp anytime.
              </p>
            </div>
          ) : (
            filteredCategories.map((cat) => (
              <div key={cat.id} className="space-y-3">
                <h3 className="font-serif text-base font-bold text-[#003020] flex items-center gap-2">
                  <cat.icon className="w-4 h-4 text-[#0F6F74]" />
                  {cat.name}
                </h3>
                {cat.items.map((item, idx) => {
                  const key = `${cat.id}-${idx}`;
                  const isOpen = openItems[key];
                  return (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl border border-neutral-200/80 overflow-hidden shadow-xs transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => toggleItem(key)}
                        className="w-full p-4 md:p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm text-[#003020] hover:text-[#0F6F74] transition-colors"
                      >
                        <span>{item.q}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-neutral-400 flex-shrink-0 transition-transform ${
                            isOpen ? 'rotate-180 text-[#003020]' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5 text-xs md:text-sm text-neutral-600 leading-relaxed border-t border-neutral-100 pt-3 bg-[#FAF7F0]/30">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))
          )
        ) : (
          /* Selected Category Items */
          activeCategory?.items.map((item, idx) => {
            const key = `${activeCategory.id}-${idx}`;
            const isOpen = openItems[key];
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-neutral-200/80 hover:border-[#E6C16A]/80 overflow-hidden shadow-xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleItem(key)}
                  className="w-full p-4 md:p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm md:text-base text-[#003020] hover:text-[#0F6F74] transition-colors"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-neutral-400 flex-shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-[#003020]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs md:text-sm text-neutral-600 leading-relaxed border-t border-neutral-100 pt-3 bg-[#FAF7F0]/30">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Live Devotee Helpline Card */}
      <div className="bg-[#FAF7F0] rounded-3xl p-6 md:p-8 border border-[#E6C16A]/50 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1">
          <h3 className="font-serif text-lg md:text-xl font-bold text-[#003020] flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-[#25D366]" />
            Still Have Questions About Your Seva?
          </h3>
          <p className="text-xs md:text-sm text-neutral-600 leading-relaxed">
            Our devotional support team in Vrindavan is here to guide you with custom sizing, matching accessories, and order status.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Button
            asChild
            className="bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold rounded-xl text-xs gap-2 shadow-xs"
          >
            <a
              href="https://wa.me/917982160480?text=Hare%20Krishna!%20I%20have%20a%20question%20regarding%20my%20Madhav%20Shringaar%20order."
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="w-4 h-4" />
              Chat on WhatsApp
            </a>
          </Button>

          <Button
            asChild
            variant="outline"
            className="rounded-xl border-[#003020] text-[#003020] font-semibold text-xs gap-1.5"
          >
            <Link href="/size-chart">
              <Ruler className="w-3.5 h-3.5 text-[#0F6F74]" />
              View Size Chart
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
