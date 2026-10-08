
import React from 'react';
import Link from 'next/link';

import { auth } from '@/auth';
import { getMyCart } from '@/lib/actions/cart.action';
import { signOutUser } from '@/lib/actions/user.actions';
import { getWishlist } from '@/lib/actions/wishlist.actions';
import UserButton from './user-button';
import MobileMenu from './mobile-menu';

export default async function Header() {
  const session = await auth();
  const cart = await getMyCart();
  const wishlistRes = await getWishlist();
  const wishlistItems = wishlistRes.success ? wishlistRes.data : [];

  return (
    <>
      
<div className="bg-primary-container text-on-primary font-label-md text-label-md py-1.5 px-4 md:px-8 border-b border-secondary/20">
<div className="max-w-7xl mx-auto flex justify-between items-center text-xs">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-secondary-fixed text-base">local_shipping</span>
<span className="hidden sm:inline">🚚 Free Shipping above ₹999 across India</span>
<span className="sm:hidden">🚚 Free Shipping ₹999+</span>
</div>
<div className="font-headline-sm text-secondary-fixed text-sm md:text-base tracking-widest font-bold animate-pulse">
        ॥ Radhe Radhe ॥
      </div>
<div className="flex items-center gap-1 text-primary-fixed">
<span className="material-symbols-outlined text-secondary-fixed text-base" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
<span className="hidden md:inline">Trusted by 10,000+ Happy Devotees</span>
<span className="md:hidden">10,000+ Devotees</span>
</div>
</div>
</div>

<header className="bg-surface/95 dark:bg-surface-container/95 backdrop-blur-md text-primary docked full-width top-0 sticky z-40 shadow-sm border-b border-outline-variant/30">
<div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-3 flex flex-col gap-2">
<div className="flex items-center justify-between gap-4">

<div className="flex items-center gap-3">
<MobileMenu />
<Link className="flex items-center gap-2" href="/">
<img alt="Madhav Shringaar" className="h-14 md:h-20 w-auto object-contain scale-110 ml-2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCz1Fv3CrZlOOVgVq0caDYsVbk_a77C6oy6RTPfvK0_-SsHGjfQhX_4LXSy1W2MlwTdBwzc9Hkxd6hQjg_ljscUAOXCXwDveuh30AWjxZr1NBOiWHB-7hQR7AheTAFjlwGxn9gJCxthYw7srh8HwtwuPmK_fuXdbFmGvicsRGakLpVI9Vvf4JoGRKDImPg7xo9sEne6tQA-UxJ9hwedwyvBoKKBdbeEB9hu_70_JoTV8qok-ZeyTDt4xCNZQD8nfNqrmQ"/>
</Link>
</div>

<div className="hidden md:flex flex-1 max-w-2xl flex-col gap-1 mx-6">
<form action="/search" className="relative flex items-center">
<div className="absolute left-3.5 flex items-center pointer-events-none text-secondary">
<span className="material-symbols-outlined text-xl">search</span>
</div>
<input name="q" className="w-full pl-11 pr-28 py-2.5 bg-surface-container-low border border-outline-variant/40 rounded-lg text-body-md font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-all" placeholder="Search for Kanha Ji Poshak, Mukut, Mala, Accessories..." type="text"/>
<button type="submit" className="absolute right-1.5 px-4 py-1.5 gold-gradient-btn text-primary-container font-label-md text-label-md rounded-md hover:brightness-105 active:scale-95 transition-all">
              Search
            </button>
</form>

<div className="flex items-center gap-2 text-xs text-on-surface-variant font-label-sm text-label-sm">
<span className="font-bold text-secondary">Trending:</span>
<a className="hover:text-secondary transition-colors underline decoration-outline-variant" href="#featured">Poshak</a>
<span>•</span>
<a className="hover:text-secondary transition-colors underline decoration-outline-variant" href="#featured">Peacock Mukut</a>
<span>•</span>
<a className="hover:text-secondary transition-colors underline decoration-outline-variant" href="#featured">Bansuri</a>
<span>•</span>
<a className="hover:text-secondary transition-colors underline decoration-outline-variant" href="#featured">Singhasan</a>
<span>•</span>
<a className="hover:text-secondary transition-colors underline decoration-outline-variant" href="#combos">Combo Sets</a>
</div>
</div>

<div className="flex items-center gap-2 md:gap-5">

<button aria-label="Search items" className="md:hidden p-2 text-on-surface hover:text-secondary active:scale-95" id="toggleMobileSearch">
<span className="material-symbols-outlined text-2xl">search</span>
</button>

<div className="hidden lg:flex items-center">
  <UserButton />
</div>

<Link href="/track-order" className="relative p-2 text-on-surface hover:text-secondary transition-colors active:scale-95 hidden sm:flex items-center gap-1" title="Track Order">
  <span className="material-symbols-outlined text-2xl">local_shipping</span>
</Link>

<Link href="/wishlist" className="relative p-2 text-on-surface hover:text-secondary transition-colors active:scale-95 hidden sm:flex items-center" title="Sacred Wishlist">
<span className="material-symbols-outlined text-2xl">favorite</span>
{wishlistItems && wishlistItems.length > 0 && (
  <span className="absolute 1 top-1 right-1 w-4 h-4 bg-secondary text-on-secondary rounded-full font-label-sm text-label-sm flex items-center justify-center text-[10px]">
    {wishlistItems.length}
  </span>
)}
</Link>

<Link href="/cart" className="flex items-center gap-2 p-2 bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/50 rounded-lg text-primary transition-colors active:scale-95" id="cartDrawerBtn">
<div className="relative">
<span className="material-symbols-outlined text-2xl text-secondary">shopping_bag</span>
{cart && cart.items.length > 0 && (
<span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary-container text-primary-fixed rounded-full font-label-sm text-label-sm flex items-center justify-center text-[10px] font-bold">
  {cart.items.reduce((a, c) => a + c.qty, 0)}
</span>
)}
</div>
<div className="hidden sm:flex flex-col text-left pr-1">
<span className="font-label-sm text-label-sm leading-tight text-on-surface-variant">Seva Cart</span>
<span className="font-label-md text-label-md font-bold text-secondary leading-tight">₹{cart ? cart.itemsPrice : '0'}</span>
</div>
</Link>
</div>
</div>

<div className="hidden md:hidden pt-2 pb-1" id="mobileSearchField">
<form action="/search" className="relative flex items-center w-full">
<input name="q" className="w-full pl-10 pr-20 py-2 bg-surface-container-low border border-outline-variant/40 rounded-lg text-body-sm font-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary" placeholder="Search dresses, mukut, bansuri..." type="text"/>
<span className="material-symbols-outlined absolute left-3 text-secondary text-lg">search</span>
<button type="submit" className="absolute right-1 px-3 py-1 gold-gradient-btn text-primary-container font-label-sm text-label-sm rounded">Find</button>
</form>
</div>
</div>

<nav className="hidden md:block bg-surface-container-low border-t border-outline-variant/20">
<div className="max-w-7xl mx-auto px-4 lg:px-4 xl:px-8 flex justify-center items-center text-label-md lg:text-label-lg font-label-md lg:font-label-lg">
<ul className="flex items-center gap-3 lg:gap-5 xl:gap-8 py-2.5">
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
