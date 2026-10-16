'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Menu,
  X,
  Home,
  Truck,
  Heart,
  MapPin,
  HelpCircle,
  Gift,
  ShoppingBag,
  MessageSquare,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Ruler,
  LogOut,
} from 'lucide-react';
import { isDummyPhoneEmail } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { signOutUser } from '@/lib/actions/user.actions';
import LanguageSwitcher from './language-switcher';
import { useLanguage } from '@/lib/i18n/language-context';

interface MobileMenuProps {
  sessionUser?: {
    name?: string | null;
    email?: string | null;
    role?: string | null;
    image?: string | null;
  } | null;
}

export default function MobileMenu({ sessionUser }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { t, language } = useLanguage();

  const isHindi = language === 'hi';
  const closeMenu = () => setIsOpen(false);

  const divineCollections = [
    {
      href: '/',
      label: t.header.navHome,
      icon: Home,
      tag: null,
    },
    {
      href: '/search?category=Poshak',
      label: t.header.navPoshak,
      emoji: '🦚',
      tag: isHindi ? '0–6 नं.' : '0–6 No.',
    },
    {
      href: '/search?category=Mukut%20%26%20Bansuri',
      label: t.header.navMukutBansuri,
      emoji: '👑',
      tag: null,
    },
    {
      href: '/search?category=Jewellery%20%26%20Mala',
      label: t.header.navJewelleryMala,
      emoji: '📿',
      tag: null,
    },
    {
      href: '/search?category=Singhasan',
      label: isHindi ? 'सिंहासन एवं झूला' : 'Singhasan & Jhula',
      emoji: '🪑',
      tag: null,
    },
    {
      href: '/search?category=Seva%20Essentials',
      label: t.header.navSevaEssentials,
      emoji: '🌸',
      tag: null,
    },
    {
      href: '/search?category=Festive%20Sets',
      label: t.header.navFestiveSets,
      emoji: '✨',
      tag: isHindi ? 'विशेष' : 'Special',
      highlight: true,
    },
    {
      href: '/size-chart',
      label: t.header.navSizeChart,
      icon: Ruler,
      tag: isHindi ? '0–6 नाप' : '0–6 Sizes',
    },
  ];

  return (
    <div className="md:flex lg:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-primary hover:text-secondary hover:bg-black/5 rounded-xl transition-colors"
            aria-label={isHindi ? 'मेन्यू खोलें' : 'Open navigation menu'}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>

        <SheetContent
          side="left"
          className="w-[315px] sm:w-[380px] bg-[#FAF8F5] p-0 flex flex-col h-full border-r border-[#E6C16A]/30 overflow-hidden text-neutral-800 shadow-2xl [&>button]:hidden"
        >
          {/* Accessible Title */}
          <SheetHeader className="sr-only">
            <SheetTitle>Madhav Shringaar Navigation Menu</SheetTitle>
          </SheetHeader>

          {/* Premium Header Banner with Official Logo */}
          <div className="bg-gradient-to-b from-white via-[#FCFAF5] to-[#F7F2E7] border-b border-[#E6C16A]/30 p-4 pt-5 relative shrink-0">
            <div className="flex items-center justify-between gap-2">
              <Link href="/" onClick={closeMenu} className="inline-block transition-opacity hover:opacity-95">
                <Image
                  src="/images/logo.webp"
                  alt="Madhav Shringaar"
                  width={220}
                  height={78}
                  className="h-13 sm:h-14 w-auto object-contain drop-shadow-xs"
                  priority
                />
              </Link>
              <button
                type="button"
                onClick={closeMenu}
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors active:scale-95"
                aria-label={isHindi ? 'मेन्यू बंद करें' : 'Close menu'}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sacred Tagline & Operating Hubs */}
            <div className="flex items-center justify-between gap-1.5 mt-2.5 pt-2 border-t border-neutral-200/60">
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#8A5A0A] bg-[#FAF0D7] border border-[#E6C16A]/50 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span>🦚</span> {isHindi ? 'आगरा एवं नोएडा केंद्र' : 'Agra & Noida Hubs'}
              </span>
              <span className="text-[11px] font-serif font-bold text-[#003020] tracking-wide">
                {t.header.radheRadhe}
              </span>
            </div>
          </div>

          {/* Language Switcher in Mobile Menu */}
          <div className="px-3 pt-2.5 shrink-0">
            <LanguageSwitcher variant="mobile" />
          </div>

          {/* Devotee Account Card */}
          <div className="px-3 pt-3 shrink-0">
            {sessionUser ? (
              <div className="p-3 bg-white rounded-2xl border border-[#E6C16A]/35 shadow-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-[#003020] text-[#E6C16A] flex items-center justify-center font-serif font-bold text-base shadow-sm ring-2 ring-[#E6C16A]/40 shrink-0">
                    {sessionUser.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#003020] truncate">
                      {isHindi ? 'हरे कृष्णा' : 'Hare Krishna'}, {sessionUser.name?.split(' ')[0] || t.header.devotee} 🙏
                    </p>
                    <p className="text-[11px] text-neutral-500 truncate">
                      {isDummyPhoneEmail(sessionUser.email)
                        ? (isHindi ? 'पावन सेवा खाता' : 'Blessed Seva Account')
                        : sessionUser.email}
                    </p>
                  </div>
                </div>
                <Link
                  href="/user"
                  onClick={closeMenu}
                  className="text-xs font-semibold text-[#8A5A0A] bg-[#FAF3E0] hover:bg-[#F3E7C4] px-2.5 py-1.5 rounded-xl border border-[#E6C16A]/40 shrink-0 transition-colors flex items-center gap-0.5"
                >
                  <span>{isHindi ? 'खाता' : 'Hub'}</span>
                  <ChevronRight className="w-3 h-3 text-[#8A5A0A]" />
                </Link>
              </div>
            ) : (
              <div className="p-3.5 bg-gradient-to-r from-[#003020] via-[#06422F] to-[#0A4D33] text-white rounded-2xl shadow-sm flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#E6C16A] flex items-center gap-1">
                    <span>🙏</span> {isHindi ? 'स्वागत है, भक्तजन' : 'Welcome, Devotee'}
                  </p>
                  <p className="text-[11px] text-white/85 leading-tight mt-0.5 truncate">
                    {isHindi ? 'ऑर्डर स्टेटस एवं सेवा रिवॉर्ड्स हेतु' : 'Sign in to track orders & seva rewards'}
                  </p>
                </div>
                <Link
                  href="/sign-in"
                  onClick={closeMenu}
                  className="px-3.5 py-1.5 bg-[#E6C16A] hover:bg-[#d8b053] text-[#003020] font-bold text-xs rounded-xl shadow-xs transition-all whitespace-nowrap active:scale-95 shrink-0"
                >
                  {t.header.signIn}
                </Link>
              </div>
            )}
          </div>

          {/* Scrollable Navigation Body */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 text-xs">
            {/* Divine Collections Section */}
            <div>
              <div className="flex items-center gap-1.5 px-2 mb-1.5">
                <Sparkles className="w-3 h-3 text-[#C2A66A]" />
                <p className="text-[10px] uppercase font-bold tracking-widest text-[#8A5A0A]">
                  {isHindi ? 'पवित्र सेवा संग्रह' : 'Divine Collections'}
                </p>
              </div>

              <div className="space-y-1 bg-white/70 backdrop-blur-xs p-1.5 rounded-2xl border border-neutral-200/50 shadow-xs">
                {divineCollections.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMenu}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                        item.highlight
                          ? 'bg-gradient-to-r from-[#FFF8E7] to-[#FFF1D0] border border-[#E6C16A]/60 text-[#8A5A0A] font-bold shadow-xs'
                          : 'text-neutral-700 hover:text-[#003020] hover:bg-[#FAF3E0]/60 font-medium'
                      }`}
                    >
                      <span className="flex items-center gap-2.5 text-[13px]">
                        {Icon ? (
                          <Icon className={`w-4 h-4 ${item.highlight ? 'text-[#8A5A0A]' : 'text-[#003020]'}`} />
                        ) : (
                          <span className="text-base leading-none">{item.emoji}</span>
                        )}
                        <span>{item.label}</span>
                      </span>

                      {item.tag && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.highlight
                              ? 'bg-[#E6C16A] text-[#003020]'
                              : 'bg-neutral-100 text-neutral-600'
                          }`}
                        >
                          {item.tag}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Quick Services Section */}
            <div>
              <div className="flex items-center gap-1.5 px-2 mb-1.5">
                <p className="text-[10px] uppercase font-bold tracking-widest text-neutral-500">
                  {isHindi ? 'भक्त सेवा एवं सहायता' : 'Devotee Services'}
                </p>
              </div>

              <div className="space-y-1 bg-white/70 backdrop-blur-xs p-1.5 rounded-2xl border border-neutral-200/50 shadow-xs">
                <Link
                  href="/track-order"
                  onClick={closeMenu}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-neutral-700 hover:text-[#003020] hover:bg-[#FAF3E0]/60 transition-colors font-medium text-[13px]"
                >
                  <span className="flex items-center gap-2.5">
                    <Truck className="w-4 h-4 text-emerald-700" />
                    <span>{isHindi ? 'ऑर्डर स्टेटस ट्रैक करें' : 'Track Order Status'}</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                </Link>

                <Link
                  href="/wishlist"
                  onClick={closeMenu}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-neutral-700 hover:text-[#003020] hover:bg-[#FAF3E0]/60 transition-colors font-medium text-[13px]"
                >
                  <span className="flex items-center gap-2.5">
                    <Heart className="w-4 h-4 text-rose-600" />
                    <span>{t.header.wishlist}</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                </Link>

                {sessionUser && (
                  <>
                    <Link
                      href="/user/orders"
                      onClick={closeMenu}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl text-neutral-700 hover:text-[#003020] hover:bg-[#FAF3E0]/60 transition-colors font-medium text-[13px]"
                    >
                      <span className="flex items-center gap-2.5">
                        <ShoppingBag className="w-4 h-4 text-[#003020]" />
                        <span>{isHindi ? 'मेरे ऑर्डर' : 'My Orders'}</span>
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                    </Link>

                    <Link
                      href="/user/addresses"
                      onClick={closeMenu}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl text-neutral-700 hover:text-[#003020] hover:bg-[#FAF3E0]/60 transition-colors font-medium text-[13px]"
                    >
                      <span className="flex items-center gap-2.5">
                        <MapPin className="w-4 h-4 text-[#003020]" />
                        <span>{t.header.savedAddresses}</span>
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                    </Link>

                    <Link
                      href="/user/gift-cards"
                      onClick={closeMenu}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl text-neutral-700 hover:text-[#003020] hover:bg-[#FAF3E0]/60 transition-colors font-medium text-[13px]"
                    >
                      <span className="flex items-center gap-2.5">
                        <Gift className="w-4 h-4 text-[#8A5A0A]" />
                        <span>{t.header.giftCardsRewards}</span>
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                    </Link>
                  </>
                )}

                <Link
                  href="/faq"
                  onClick={closeMenu}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-neutral-700 hover:text-[#003020] hover:bg-[#FAF3E0]/60 transition-colors font-medium text-[13px]"
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-[#003020]" />
                    <span>{isHindi ? 'सहायता केंद्र एवं प्रश्नोत्तर' : 'Devotee FAQs & Help'}</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                </Link>

                {sessionUser?.role === 'admin' && (
                  <Link
                    href="/admin/overview"
                    onClick={closeMenu}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl text-[#003020] bg-amber-50/70 hover:bg-amber-100/70 border border-amber-200 transition-colors font-semibold text-[13px]"
                  >
                    <span className="flex items-center gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-amber-700" />
                      <span>{isHindi ? 'व्यवस्थापक प्रबंधन' : 'Admin Management'}</span>
                    </span>
                    <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-1.5 py-0.5 rounded">
                      Admin
                    </span>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Devotee Care & WhatsApp Support Footer */}
          <div className="p-3 bg-white border-t border-[#E6C16A]/30 shrink-0 space-y-2">
            <a
              href="https://wa.me/917982160480?text=Radhe%20Radhe!%20Need%20help%20with%20my%20order%20on%20Madhav%20Shringaar."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#075E54] rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all shadow-xs active:scale-98"
            >
              <MessageSquare className="w-4 h-4 text-[#25D366]" />
              <span>{isHindi ? 'व्हाट्सऐप: +91 79821 60480' : 'WhatsApp: +91 79821 60480'}</span>
            </a>

            <div className="flex items-center justify-between text-[10px] text-neutral-500 px-1 pt-0.5">
              <span>{isHindi ? 'आगरा एवं नोएडा केंद्र' : 'Agra & Noida Dispatch Hubs'}</span>
              <span>{isHindi ? 'सोम-शनि (प्रातः 10-सायं 7)' : 'Mon-Sat (10am–7pm)'}</span>
            </div>

            {sessionUser && (
              <form action={signOutUser} className="pt-1.5 border-t border-neutral-100">
                <button
                  type="submit"
                  onClick={closeMenu}
                  className="w-full text-center text-xs text-red-600 hover:text-red-700 font-semibold py-1 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{t.header.signOut}</span>
                </button>
              </form>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
