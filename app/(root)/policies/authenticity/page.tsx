import { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Sparkles, HeartHandshake, CheckCircle2, Feather, ArrowRight, Ruler } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Authenticity & Pure Fabric Promise | Madhav Shringaar',
  description: 'Our sacred commitment to 100% authentic Vrindavan craftsmanship, pure deity-safe fabrics, and reverent seva for Shri Laddu Gopal Ji. Dispatched from Agra & Noida.',
  keywords: [
    'authentic Laddu Gopal dress',
    'pure silk poshak Vrindavan',
    'deity safe fabric Krishna poshak',
    'Madhav Shringaar quality guarantee',
  ],
  alternates: {
    canonical: '/policies/authenticity',
  },
};

export default function AuthenticityPromisePage() {
  const promises = [
    {
      icon: Feather,
      title: 'Handcrafted in Vrindavan & Mathura',
      description: 'Every poshak, mukut, bansuri, and singhasan is crafted in the sacred land of Braj by hereditary artisans preserving generations of traditional temple shringaar heritage.',
    },
    {
      icon: ShieldCheck,
      title: 'Pure & Deity-Safe Fabrics',
      description: 'We use only virgin silks, velvet, fine cotton, and non-toxic zari threads. Free from harmful chemical odors and gentle on sacred brass, ashtadhatu, and marble vigrahas.',
    },
    {
      icon: Sparkles,
      title: 'Rigorous 5-Point Seva Inspection',
      description: 'Before any parcel is dispatched, each piece undergoes strict quality verification: seam durability, stone setting, thread finish, size accuracy, and pristine packaging.',
    },
    {
      icon: HeartHandshake,
      title: 'Direct Brij Artisan Support',
      description: 'By choosing Madhav Shringaar, you directly empower local craft families and women artisans across Vrindavan, Govardhan, and Mathura with fair, respectful livelihoods.',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E6C16A]/20 border border-[#E6C16A]/50 text-[#8A5A0A] text-xs font-semibold uppercase tracking-widest">
          <Feather className="w-4 h-4 text-[#C88A20]" />
          Our Sacred Commitment
        </div>

        <h1 className="font-serif text-3xl md:text-5xl font-bold text-[#003020] tracking-tight">
          The Madhav Shringaar Authenticity Promise
        </h1>

        <p className="text-neutral-600 text-sm md:text-base leading-relaxed">
          Dedicated with eternal reverence to Shri Laddu Gopal Ji. We pledge that every divine adornment delivered to your home is authentic, pure, and crafted with uncompromised love.
        </p>
      </div>

      {/* 4 Core Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {promises.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 md:p-8 border border-[#E6C16A]/40 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 flex gap-4 md:gap-5"
            >
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#E6C16A] to-[#C88A20] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <Icon className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-lg font-bold text-[#003020]">
                  {item.title}
                </h3>
                <p className="text-xs md:text-sm text-neutral-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Manifesto */}
      <div className="bg-[#FAF7F0] rounded-3xl p-8 md:p-12 border border-[#E6C16A]/60 shadow-sm space-y-8 mb-16">
        <div className="space-y-3">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#003020]">
            Purity (Shuddhta) in Every Thread
          </h2>
          <p className="text-sm md:text-base text-neutral-700 leading-relaxed">
            In Sanatan tradition, deity clothing is not mere apparel — it is a sacred offering of bhakti. We ensure our workshop maintains a pure, sattvic atmosphere where every artisan works with mindfulness and respect.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-[#E6C16A]/40">
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-[#003020]">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Virgin Materials
            </div>
            <p className="text-xs text-neutral-600">
              Zero recycled remnants. All fabrics are fresh, radiant, and tailored specifically for sacred seva.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-[#003020]">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Vigraha-Safe Finishes
            </div>
            <p className="text-xs text-neutral-600">
              Smooth inner lining without scratchy seams or harsh adhesives that could tarnish deity polish.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-[#003020]">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Flawless Replacement
            </div>
            <p className="text-xs text-neutral-600">
              If an item fails to match our authenticity promise, our devotee care team will replace it with utmost priority.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-white rounded-2xl border border-outline-variant/30 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-[#176B55]/10 flex items-center justify-center text-[#176B55]">
            <Ruler className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#003020]">Unsure about your Laddu Gopal Ji size?</h4>
            <p className="text-xs text-neutral-500">Consult our comprehensive size chart guide (0 to 6 No.).</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            href="/size-chart"
            className="w-full sm:w-auto px-4 py-2 border border-[#0F6F74] text-[#0F6F74] hover:bg-[#0F6F74] hover:text-white rounded-lg text-xs font-bold transition-all text-center"
          >
            Size Chart Guide
          </Link>
          <Link
            href="/search"
            className="w-full sm:w-auto px-5 py-2 gold-gradient-btn text-primary-container rounded-lg text-xs font-bold hover:brightness-105 transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>Browse Seva</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
