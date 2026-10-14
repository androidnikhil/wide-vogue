
import React from 'react';
import Image from 'next/image';
import CartTrigger from './cart-trigger';
import Link from 'next/link';

import { auth } from '@/auth';
import { getMyCart } from '@/lib/actions/cart.action';
import { getWishlist } from '@/lib/actions/wishlist.actions';
import UserButton from './user-button';
import MobileMenu from './mobile-menu';
import MobileSearch from './mobile-search';

export default async function Header() {
  const session = await auth();
  const cart = await getMyCart();
  const wishlistRes = await getWishlist();
  const wishlistItems = wishlistRes.success ? wishlistRes.data : [];

  return (
    <>
      
<div className="bg-primary-container text-on-primary font-label-md text-label-md py-1.5 px-4 md:px-8 border-b border-secondary/20 max-sm:bg-gradient-to-r max-sm:from-[#003A2C] max-sm:via-[#064936] max-sm:to-[#003A2C] max-sm:text-[#F7EAC7] max-sm:border-b-[#C2A66A]/60 max-sm:py-2 max-sm:px-2">
<div className="max-w-7xl mx-auto flex justify-between items-center text-xs max-sm:grid max-sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] max-sm:gap-1">
<div className="flex items-center gap-2 max-sm:min-w-0 max-sm:gap-1">
<span className="material-symbols-outlined text-secondary-fixed text-base max-sm:shrink-0 max-sm:text-[#E6C16A] max-sm:text-[15px]">local_shipping</span>
<span className="hidden sm:inline">🚚 Free Shipping above ₹999 across India</span>
<span className="sm:hidden max-sm:whitespace-nowrap max-sm:text-[7px] max-sm:font-semibold max-sm:leading-tight max-sm:tracking-tight">Free Shipping ₹999+</span>
</div>
<div className="font-headline-sm text-secondary-fixed text-sm md:text-base tracking-widest font-bold animate-pulse max-sm:whitespace-nowrap max-sm:text-[9px] max-sm:tracking-normal max-sm:text-[#E6C16A] max-sm:[animation:none]">
        ॥ Radhe Radhe ॥
      </div>
<div className="flex min-w-0 items-center gap-1 text-primary-fixed max-sm:justify-self-end max-sm:gap-0.5 max-sm:-translate-x-1 max-sm:text-[#F7EAC7]">
<span className="material-symbols-outlined shrink-0 text-secondary-fixed text-base max-sm:hidden" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
<span className="hidden md:inline">Trusted by 10,000+ Happy Devotees</span>
<span className="md:hidden max-sm:whitespace-nowrap max-sm:text-[7px] max-sm:font-semibold max-sm:leading-tight max-sm:tracking-tight">10,000+ Devotees</span>
</div>
</div>
</div>

<header id="main-header" className="sticky top-0 w-full z-50 border-b border-outline-variant/10 py-2 bg-[#FBF7EE]/95 shadow-sm backdrop-blur-lg">
<div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 flex flex-col gap-2 max-sm:px-2">
<div className="flex items-center justify-between gap-2 sm:gap-3 md:gap-4 w-full">

<div className="flex shrink-0 items-center gap-1.5 sm:gap-2 md:gap-2.5">
<MobileMenu sessionUser={session?.user} />
<Link className="shrink-0 flex items-center" href="/">
<Image
  alt="Madhav Shringaar"
  className="h-9 sm:h-10 md:h-11 lg:h-13 xl:h-14 w-auto object-contain shrink-0"
  src="/images/logo.png"
  width={220}
  height={75}
  quality={90}
  priority
/>
</Link>
</div>

<div className="hidden md:flex min-w-0 flex-1 max-w-xl lg:max-w-2xl flex-col gap-1 mx-2 sm:mx-3 lg:mx-6">
<form action="/search" className="relative flex items-center w-full">
<div className="absolute left-3 sm:left-3.5 flex items-center pointer-events-none text-secondary">
<span className="material-symbols-outlined text-lg sm:text-xl">search</span>
</div>
<input
  name="q"
  className="w-full pl-9 sm:pl-10 pr-20 sm:pr-24 py-2 bg-surface-container-low border border-outline-variant/40 rounded-xl text-xs sm:text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-all"
  placeholder="Search poshak, mukut, mala, combos..."
  type="text"
/>
<button
  type="submit"
  className="absolute right-1 px-3 sm:px-4 py-1.5 gold-gradient-btn text-primary-container font-semibold text-xs sm:text-sm rounded-lg hover:brightness-105 active:scale-95 transition-all"
>
  Search
</button>
</form>
</div>

<div className="flex shrink-0 items-center gap-1 sm:gap-1.5 md:gap-2 lg:gap-4">

<MobileSearch />

<div className="hidden lg:flex items-center">
  <UserButton />
</div>

<Link href="/track-order" className="relative p-2 text-on-surface hover:text-secondary transition-colors active:scale-95 hidden xl:flex items-center gap-1" title="Track Order">
  <span className="material-symbols-outlined text-2xl">local_shipping</span>
</Link>

<Link href="/wishlist" className="relative p-2 text-on-surface hover:text-secondary transition-colors active:scale-95 hidden md:flex items-center" title="Sacred Wishlist">
<span className="material-symbols-outlined text-2xl">favorite</span>
{wishlistItems && wishlistItems.length > 0 && (
  <span className="absolute top-1 right-1 w-4 h-4 bg-secondary text-on-secondary rounded-full font-label-sm text-label-sm flex items-center justify-center text-[10px]">
    {wishlistItems.length}
  </span>
)}
</Link>

<CartTrigger cartItemCount={cart ? cart.items.reduce((a, c) => a + c.qty, 0) : 0} cartPrice={cart ? cart.itemsPrice : '0'} />
</div>
</div>

</div>

<nav className="hidden lg:block bg-surface-container-low border-t border-outline-variant/20">
<div className="max-w-7xl mx-auto px-4 lg:px-4 xl:px-8 flex justify-center items-center text-label-md lg:text-label-lg font-label-md lg:font-label-lg">
<ul className="flex flex-wrap justify-center items-center gap-2.5 lg:gap-4 xl:gap-7 py-2.5 whitespace-nowrap">
<li>
<Link className="text-secondary border-b-2 border-secondary font-title-md text-title-md pb-1 flex items-center gap-1" href="/">
<span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>temple_hindu</span>
              Home
            </Link>
</li>
<li>
<Link className="text-on-surface-variant font-label-lg text-label-lg hover:text-primary transition-colors flex items-center gap-0.5" href="/search?category=Poshak">
              Poshak
</Link>
</li>
<li>
<Link className="text-on-surface-variant font-label-lg text-label-lg hover:text-primary transition-colors flex items-center gap-0.5" href="/search?category=Mukut%20%26%20Bansuri">
              Mukut &amp; Bansuri
</Link>
</li>
<li>
<Link className="text-on-surface-variant font-label-lg text-label-lg hover:text-primary transition-colors flex items-center gap-0.5" href="/search?category=Jewellery%20%26%20Mala">
              Jewellery &amp; Mala
</Link>
</li>
<li>
<Link className="text-on-surface-variant font-label-lg text-label-lg hover:text-primary transition-colors" href="/search?category=Singhasan">
              Singhasan
            </Link>
</li>
<li>
<Link className="text-on-surface-variant font-label-lg text-label-lg hover:text-primary transition-colors" href="/search?category=Seva%20Essentials">
              Seva Essentials
            </Link>
</li>
<li>
<Link className="text-secondary font-title-md text-title-md hover:text-secondary-fixed-dim transition-colors flex items-center gap-1 font-bold" href="/search?category=Festive%20Sets">
<span className="material-symbols-outlined text-base">auto_awesome</span>
              Festive Sets
            </Link>
</li>
<li>
<Link className="text-on-surface-variant font-label-lg text-label-lg hover:text-primary transition-colors" href="/size-chart">
              Size Chart (0-6 No.)
            </Link>
</li>
</ul>
</div>
</nav>
  
</header>

    </>
  );
}
