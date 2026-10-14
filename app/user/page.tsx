import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getUserAccountData } from '@/lib/actions/user.actions';
import { isDummyPhoneEmail } from '@/lib/constants';
import { 
  Package, 
  MapPin, 
  CreditCard, 
  Gift, 
  HelpCircle, 
  ShieldCheck, 
  Ruler, 
  Truck, 
  RotateCcw, 
  FileText, 
  Lock, 
  ChevronRight, 
  User, 
  Heart, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'My Account | Madhav Shringaar',
  description: 'Manage your orders, saved addresses, payments, gift cards, and seva preferences.',
};

export default async function UserAccountPage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/sign-in?callbackUrl=/user');
  }

  const user = await getUserAccountData();
  const userName = user?.name && user.name !== 'NO_NAME' ? user.name : 'Devotee';
  const userPhone = user?.phoneNumber || '';
  const userEmail = user?.email && !isDummyPhoneEmail(user.email) ? user.email : '';
  const orderCount = user?._count?.Order || 0;
  const wishlistCount = user?._count?.Wishlist || 0;
  const addressesCount = Array.isArray(user?.addresses) ? user.addresses.length : (user?.address ? 1 : 0);
  const bhaktiPoints = user?.bhaktiPoints || 0;

  const sections = [
    {
      category: 'Orders & Deliveries',
      items: [
        {
          title: 'Your Orders',
          subtitle: 'View history, track active shipments, and download tax invoices',
          href: '/user/orders',
          icon: Package,
          badge: orderCount > 0 ? `${orderCount} Orders` : undefined,
        },
        {
          title: 'Track Live Shipment',
          subtitle: 'Real-time AWB delivery tracking via Shiprocket',
          href: '/track-order',
          icon: Truck,
        },
      ],
    },
    {
      category: 'Account Settings & Addresses',
      items: [
        {
          title: 'Profile Information',
          subtitle: 'Edit your full name, verified mobile number, and email address',
          href: '/user/profile',
          icon: User,
        },
        {
          title: 'Manage Saved Addresses',
          subtitle: 'Save Home, Temple / Ashram, and Work delivery locations',
          href: '/user/addresses',
          icon: MapPin,
          badge: addressesCount > 0 ? `${addressesCount} Saved` : undefined,
        },
      ],
    },
    {
      category: 'Payments, Wallet & Rewards',
      items: [
        {
          title: 'Payment Methods & Security',
          subtitle: 'Saved UPI, Cards & NetBanking preferences with 256-bit encryption',
          href: '/user/payments',
          icon: CreditCard,
        },
        {
          title: 'Gift Cards & Bhakti Rewards',
          subtitle: 'Check gift voucher balance and redeem earned seva reward points',
          href: '/user/gift-cards',
          icon: Gift,
          badge: bhaktiPoints > 0 ? `${bhaktiPoints} Pts` : undefined,
        },
      ],
    },
    {
      category: 'Devotee Care, Legal & Policies',
      items: [
        {
          title: 'Help Centre & FAQs',
          subtitle: 'Answers regarding poshak sizing, dispatch schedules, and COD',
          href: '/faq',
          icon: HelpCircle,
        },
        {
          title: 'Authenticity Promise',
          subtitle: 'Our 100% Vrindavan sacred craft guarantee & deity-safe fabrics',
          href: '/policies/authenticity',
          icon: ShieldCheck,
        },
        {
          title: 'Size Chart Guide (0-6 No.)',
          subtitle: 'Detailed Laddu Gopal Ji idol height & poshak diameter chart',
          href: '/size-chart',
          icon: Ruler,
        },
        {
          title: 'Return & Refund Policy',
          subtitle: '7-day reverent exchange guidelines and return instructions',
          href: '/policies/returns',
          icon: RotateCcw,
        },
        {
          title: 'Shipping & Delivery Policy',
          subtitle: 'Pan-India shipping timelines, packaging safety, and courier partners',
          href: '/policies/shipping',
          icon: FileText,
        },
        {
          title: 'Terms of Service & Privacy',
          subtitle: 'Official terms of usage, customer privacy, and data security',
          href: '/policies/terms',
          icon: Lock,
        },
      ],
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Devotee Profile Header Banner */}
      <div className="bg-gradient-to-r from-[#003020] via-[#0F6F74] to-[#003020] rounded-3xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#E6C16A]/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-gradient-to-br from-[#E6C16A] to-[#C88A20] text-[#003020] font-serif text-2xl md:text-3xl font-bold flex items-center justify-center shadow-md flex-shrink-0">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-serif text-xl md:text-2xl font-bold">
                  {userName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[#F3D98F] text-[11px] font-semibold tracking-wide flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#E6C16A]" />
                  Bhakti Seva Member
                </span>
              </div>
              <p className="text-white/80 text-xs md:text-sm">
                {userPhone ? `+91 ${userPhone}` : userEmail || 'Dedicated to Shri Laddu Gopal Ji'}
              </p>
              {userEmail && userPhone && (
                <p className="text-white/60 text-xs">{userEmail}</p>
              )}
            </div>
          </div>

          {/* Bhakti Points Counter */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 flex items-center gap-4 self-start md:self-auto">
            <div className="h-10 w-10 rounded-xl bg-[#E6C16A] text-[#003020] flex items-center justify-center font-bold text-lg">
              🪙
            </div>
            <div>
              <div className="text-xs text-white/70 uppercase tracking-wider font-medium">Bhakti Points</div>
              <div className="text-lg font-bold text-[#F3D98F]">
                {bhaktiPoints} Pts
                <span className="text-xs font-normal text-white/80 ml-1.5">
                  (₹{(bhaktiPoints * 0.1).toFixed(0)} Value)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stat Bar */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-white/15 text-center text-xs">
          <Link href="/user/orders" className="hover:text-[#F3D98F] transition-colors">
            <span className="block text-lg font-bold text-white">{orderCount}</span>
            <span className="text-white/70">Orders</span>
          </Link>
          <Link href="/wishlist" className="hover:text-[#F3D98F] transition-colors border-x border-white/15">
            <span className="block text-lg font-bold text-white">{wishlistCount}</span>
            <span className="text-white/70">Wishlist</span>
          </Link>
          <Link href="/user/addresses" className="hover:text-[#F3D98F] transition-colors">
            <span className="block text-lg font-bold text-white">{addressesCount}</span>
            <span className="text-white/70">Addresses</span>
          </Link>
        </div>
      </div>

      {/* Categorized Flipkart-Style Grid */}
      <div className="space-y-8">
        {sections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-3">
            <h2 className="font-serif text-lg font-bold text-[#003020] flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#C88A20]"></span>
              {section.category}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {section.items.map((item, iIdx) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={iIdx}
                    href={item.href}
                    className="group bg-white rounded-2xl p-4 md:p-5 border border-outline-variant/30 hover:border-[#E6C16A] shadow-xs hover:shadow-md transition-all flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="h-11 w-11 rounded-xl bg-[#FAF7F0] group-hover:bg-[#E6C16A]/20 text-[#0F6F74] group-hover:text-[#C88A20] flex items-center justify-center flex-shrink-0 transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-sm text-[#003020] group-hover:text-[#0F6F74] transition-colors truncate">
                            {item.title}
                          </h3>
                          {item.badge && (
                            <span className="px-2 py-0.5 rounded-full bg-[#E6C16A]/25 text-[#8A5A0A] font-bold text-[10px]">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-500 truncate">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-[#003020] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
