import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Feather, HeartHandshake, Sparkles, ShieldCheck, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'About Us | Our Sacred Journey & Seva | Madhav Shringaar',
  description:
    'Discover the sacred story of Madhav Shringaar — handcrafted Laddu Gopal Ji poshak, designer mukut, mala, and shringaar accessories made with devotion by Braj artisans.',
  keywords: [
    'about Madhav Shringaar',
    'Laddu Gopal poshak story',
    'Vrindavan deity dress artisans',
    'Kanha Ji shringaar store',
    'handcrafted Krishna poshak India',
  ],
  alternates: {
    canonical: '/about',
  },
};

export default function AboutUsPage() {
  const values = [
    {
      icon: Feather,
      title: 'Devotion in Every Stitch',
      description:
        'Every poshak is conceived not as mere clothing, but as an offering of love (seva) for Thakur Ji. Our designs honor traditional Braj iconography and seasonal festival traditions.',
    },
    {
      icon: ShieldCheck,
      title: 'Pure & Deity-Safe Fabrics',
      description:
        'We select pure, soft cottons for summer, warm micro-velvets for winter, and pure silks for festive darshan — gentle on brass and ashtadhatu vigrahas without harsh chemicals.',
    },
    {
      icon: HeartHandshake,
      title: 'Empowering Braj Artisans',
      description:
        'We work directly with traditional craft families in Vrindavan, Mathura, and Agra, ensuring fair livelihoods while preserving centuries-old zari, gota patti, and stone-setting arts.',
    },
    {
      icon: Sparkles,
      title: 'Careful & Respectful Packaging',
      description:
        'Every parcel is packed with utmost reverence in pristine protective boxes so your divine shringaar arrives safely at your doorstep anywhere across India.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#003020]">
      {/* 1. HERO SECTION */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-[#FAF4E6] to-[#FDFBF7] border-b border-[#E6C16A]/20">
        <div className="max-w-6xl mx-auto px-6 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E6C16A]/20 border border-[#E6C16A]/50 text-[#8A5A0A] text-xs font-semibold uppercase tracking-widest shadow-2xs">
            <Sparkles className="w-4 h-4 text-[#C88A20]" />
            Our Sacred Calling &amp; Seva
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-[#003020] tracking-tight leading-tight max-w-4xl mx-auto">
            Adorning Little Kanha Ji with <span className="italic text-[#C88A20]">Pure Love &amp; Heritage</span>
          </h1>

          <p className="text-neutral-700 text-base md:text-lg max-w-2xl mx-auto font-serif leading-relaxed">
            Welcome to Madhav Shringaar — where devotion meets artisan craftsmanship. We create temple-grade, handcrafted dresses, mukuts, and shringaar sets for Shri Laddu Gopal Ji.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-[#003020] hover:bg-[#002518] text-[#F3D98F] rounded-full font-bold px-8 shadow-md">
              <Link href="/search?category=Poshak">
                Explore Divine Poshak <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full border-[#003020]/20 text-[#003020] hover:bg-white font-semibold px-8 shadow-2xs">
              <Link href="/policies/authenticity">Our Fabric Promise</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 2. THE STORY / MISSION SECTION */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-[#0F6F74] font-bold tracking-[0.2em] uppercase text-xs border-b-2 border-[#0F6F74] pb-1">
              THE STORY BEHIND MADHAV SHRINGAAR
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#003020] leading-snug">
              Born from Devotion, Handcrafted in the Sacred Heart of Braj
            </h2>
            <div className="space-y-4 text-neutral-700 leading-relaxed font-sans text-sm md:text-base">
              <p>
                In Indian homes, <strong>Shri Laddu Gopal Ji</strong> is cherished not simply as a deity, but as the dearest child of the family. From the morning <em>Snana</em> and dressing to the evening <em>Shayan</em>, every moment of seva is guided by maternal affection (<em>Vatsalya Bhava</em>).
              </p>
              <p>
                Madhav Shringaar was born from this exact yearning: to provide devotees across India with authentic, royal, and pure shringaar worthy of their beloved Thakur Ji. What started as a devotional pursuit in the holy lands of Vrindavan and Mathura has grown into a trusted destination for thousands of Krishna bhaktas worldwide.
              </p>
              <p>
                Every poshak in our collection carries the essence of Braj Dham — stitched with reverence, embellished with hand-embroidered zari, and inspected meticulously before it reaches your home temple.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-4/3 rounded-3xl overflow-hidden shadow-xl border-4 border-white">
              <Image
                src="/images/devotional/complete_shringar.webp"
                alt="Madhav Shringaar Handcrafted Seva"
                width={800}
                height={600}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <div className="absolute -bottom-6 -right-4 bg-white p-5 rounded-2xl shadow-xl border border-[#E6C16A]/40 max-w-xs space-y-1">
              <p className="font-serif font-bold text-[#003020] text-sm">100% Handcrafted Seva</p>
              <p className="text-xs text-neutral-600">Preserving hereditary Braj craftsmanship with pure deity-grade fabrics.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. OUR FOUR SEVA PILLARS */}
      <section className="py-20 bg-white border-y border-[#003020]/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-[#C88A20] font-bold text-xs uppercase tracking-[0.2em]">OUR CORE PROMISE</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#003020]">The Four Pillars of Our Seva</h2>
            <p className="text-neutral-600 text-sm md:text-base">
              We hold ourselves to the highest standards of purity, ethics, and reverence in everything we create.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className="p-8 rounded-2xl bg-[#FDFBF7] border border-[#003020]/10 hover:shadow-md transition-shadow space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-[#003020] text-[#F3D98F] flex items-center justify-center shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-[#003020]">{v.title}</h3>
                  <p className="text-neutral-600 text-sm leading-relaxed">{v.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. DISPATCH HUBS & CUSTOMER ASSURANCE */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <div className="bg-[#FAF4E6] rounded-3xl p-8 md:p-12 border border-[#E6C16A]/40">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left items-center">
            <div className="md:col-span-2 space-y-4">
              <span className="text-[#8A5A0A] font-bold text-xs uppercase tracking-wider">PAN-INDIA DISPATCH &amp; DEVOTEE SUPPORT</span>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#003020]">
                Operating Hubs in Agra &amp; Noida with Express Delivery Across India
              </h2>
              <p className="text-neutral-700 text-sm leading-relaxed">
                Orders are dispatched from our verified facilities with tamper-evident, water-resistant packaging. Enjoy free shipping on orders above ₹999, easy Cash on Delivery (COD), and real-time shipment tracking.
              </p>
              <div className="flex flex-wrap gap-4 pt-2 text-xs font-semibold text-neutral-800">
                <span className="inline-flex items-center gap-1.5"><MapPin className="w-4 h-4 text-[#C88A20]" /> Dispatch Hubs: Agra &amp; Noida</span>
                <span className="inline-flex items-center gap-1.5"><Phone className="w-4 h-4 text-[#25D366]" /> WhatsApp: +91 79821 60480</span>
                <span className="inline-flex items-center gap-1.5"><Mail className="w-4 h-4 text-[#003020]" /> info@madhavshringaar.com</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 justify-center items-center md:items-end">
              <Button asChild className="w-full sm:w-auto bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-full font-bold px-6 shadow-sm">
                <a href="https://wa.me/917982160480?text=Radhe%20Radhe!%20I%20would%20like%20to%20learn%20more%20about%20Madhav%20Shringaar." target="_blank" rel="noopener noreferrer">
                  Chat on WhatsApp
                </a>
              </Button>
              <Button asChild variant="outline" className="w-full sm:w-auto rounded-full border-[#003020]/30 text-[#003020] hover:bg-white font-semibold px-6">
                <Link href="/size-chart">View Size Chart Guide</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
