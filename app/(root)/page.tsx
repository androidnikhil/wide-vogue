
import React from 'react';
import Link from 'next/link';
import ProductCard from '@/components/shared/product/product-card';
import SizeSelector from '@/components/shared/product/size-selector';
import { getLatestProducts } from '@/lib/actions/product.action';

export default async function Homepage() {
  const latestProducts = await getLatestProducts();
  return (
    <div className="bg-background text-on-surface antialiased font-body-md selection:bg-secondary-fixed selection:text-on-secondary-fixed pb-20 md:pb-0">
      

<section className="relative overflow-hidden bg-gradient-to-b from-surface-container-low via-surface to-background py-8 md:py-14 border-b border-outline-variant/30">

<div className="absolute -top-24 -left-24 w-96 h-96 bg-secondary-fixed/30 rounded-full blur-3xl pointer-events-none"></div>
<div className="absolute top-1/2 -right-24 w-96 h-96 bg-primary-fixed/20 rounded-full blur-3xl pointer-events-none"></div>
<div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

<div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-4 md:space-y-6">

<div className="inline-flex items-center gap-2 px-4 py-1.5 bg-surface-container border border-secondary/30 rounded-full shadow-sm">
<span className="material-symbols-outlined text-secondary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>spa</span>
<span className="font-headline-sm text-headline-sm text-secondary font-bold tracking-wide">॥ मेरा कान्हा सबसे प्यारा ॥</span>
</div>

<div className="space-y-2">
<h1 className="font-headline-lg-mobile md:font-display-lg text-headline-lg-mobile md:text-display-lg text-primary tracking-tight font-extrabold leading-tight">
                Adorn Your Laddu Gopal with Love
              </h1>
<p className="font-headline-md text-headline-md text-secondary font-semibold italic">
                Madhav Shringaar Exclusive Collection
              </p>
</div>
<p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
              Divine Handcrafted Poshak, Mukut, Mala &amp; Complete Shringar Collections created with reverent seva for Your Beloved Kanha Ji.
            </p>

<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-xl py-2">
<div className="flex items-center gap-2 p-2.5 bg-surface rounded-lg border border-outline-variant/30 shadow-xs">
<span className="material-symbols-outlined text-secondary text-xl">palette</span>
<span className="font-label-sm text-label-sm text-on-surface font-semibold">Traditional Designs</span>
</div>
<div className="flex items-center gap-2 p-2.5 bg-surface rounded-lg border border-outline-variant/30 shadow-xs">
<span className="material-symbols-outlined text-secondary text-xl">verified</span>
<span className="font-label-sm text-label-sm text-on-surface font-semibold">100% Pure Fabrics</span>
</div>
<div className="flex items-center gap-2 p-2.5 bg-surface rounded-lg border border-outline-variant/30 shadow-xs">
<span className="material-symbols-outlined text-secondary text-xl">local_shipping</span>
<span className="font-label-sm text-label-sm text-on-surface font-semibold">Pan India Delivery</span>
</div>
<div className="flex items-center gap-2 p-2.5 bg-surface rounded-lg border border-outline-variant/30 shadow-xs">
<span className="material-symbols-outlined text-secondary text-xl">lock</span>
<span className="font-label-sm text-label-sm text-on-surface font-semibold">Secure Payments</span>
</div>
</div>

<div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
<Link className="gold-gradient-btn text-primary-container px-7 py-3.5 rounded-lg font-title-md text-title-md font-bold shadow-md hover:shadow-lg hover:brightness-105 active:scale-95 transition-all flex items-center gap-2" href="/search?category=Poshak">
<span>Shop New Festive Poshak</span>
<span className="material-symbols-outlined text-lg">arrow_forward</span>
</Link>
<Link className="px-6 py-3.5 bg-primary-container text-surface hover:bg-primary border border-secondary/40 rounded-lg font-title-md text-title-md active:scale-95 transition-all flex items-center gap-2" href="/search?category=Festive%20Sets">
<span className="material-symbols-outlined text-secondary-fixed text-lg">stars</span>
<span>Explore Shringar Sets</span>
</Link>
</div>
</div>

<div className="lg:col-span-5 relative flex justify-center">
<div className="relative w-full max-w-md lg:max-w-none">

<div className="absolute inset-0 bg-gradient-to-tr from-secondary/20 to-secondary-fixed/40 rounded-2xl filter blur-xl transform rotate-1 scale-105"></div>
<div className="relative rounded-2xl overflow-hidden border-2 border-secondary/30 shadow-2xl bg-surface-container-lowest">
<img alt="Devotional lifestyle e-commerce hero banner of charming Laddu Gopal deity idol dressed in opulent royal yellow and emerald green silk poshak embroidery, adorned with ornate peacock feather mukut crown, golden moti haar pearl necklace, holding golden bansuri flute, surrounded by soft marigold and lotus flower petals in warm cream temple background, studio lighting, high resolution, sacred and festive e-commerce photography" className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700 aspect-[1.79/1]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCb8NJe2azmYQficexwzxPZxTg-l1GWEjWohNlCQL2bVZtRdl979guQmuuEVm0XJWTmBa4yA3q0dhvmB4mEbjiJOpU8jpPZWZ5y8neRPXSIJPG9RRqgyhwtuH7i17kRZExVC318qfIJcxwDRvzP89foycAMXjyqz-X5G0oKJArJW-S7VJtDtAbNZIFLpbltLnerlg3GPMu0NhNVtitSAGIh3rTUctyjSBEUKOd4Ov5N_isBYyUcEPSa"/>
<div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 flex justify-between items-end">
<div>
<span className="font-label-sm text-label-sm uppercase tracking-widest text-white/80 drop-shadow-md">Darshan of the Day</span>
<p className="font-headline-sm text-headline-sm font-bold text-white drop-shadow-md">Shri Banke Bihari Swaroop</p>
</div>
<span className="px-3 py-1 bg-secondary text-on-secondary rounded-full font-label-sm text-label-sm shadow-md">Pure Silk &amp; Zari</span>
</div>
</div>
</div>
</div>
</div>
</div>
</section>

<section className="py-12 md:py-16 max-w-7xl mx-auto px-4 md:px-8" id="categories">

<div className="text-center max-w-xl mx-auto mb-10 space-y-2">
<div className="flex items-center justify-center gap-3 text-secondary">
<span className="h-px w-12 bg-secondary/40"></span>
<span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>spa</span>
<span className="h-px w-12 bg-secondary/40"></span>
</div>
<h2 className="font-headline-lg md:font-headline-lg text-headline-lg md:text-headline-lg text-primary font-bold">
          Shop by Category
        </h2>
<p className="font-body-md text-body-md text-on-surface-variant">
          Explore sacred attire and divine adornments curated for every daily seva and utsav
        </p>
</div>

<div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">

<Link className="group flex flex-col items-center text-center p-3 bg-surface-container-low hover:bg-surface border border-outline-variant/30 hover:border-secondary/50 rounded-xl transition-all shadow-xs hover:shadow-md" href="/search?category=Poshak">
<div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-secondary/40 to-primary-container/20 group-hover:scale-105 transition-transform duration-300">
<div className="w-full h-full rounded-full overflow-hidden border-2 border-surface bg-surface">
<img alt="Traditional yellow and royal peacock blue silk embroidered Laddu Gopal Poshak dress" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDG4X49SFnMyOr2DOG5bhrJyOP57tsP8_e8zdsXaYXuQQPD2Mr7QarBU82O_3BpsoWuwx5JaJikNHwce_YKeQoKG21W1lai2KjYCUd_PCy-bAMKV5giYBl2VovN4ga3wfhi9qmZ9Lo-myS7Ixi3-rgxum0tw8MzVlhoYIcdc47XSLtvu9vSaoVp8sfonuS7x0sl2OgVAULCJmbaeX03f2fRPbwSFhcNwPxnU5aV0xYGviQ5y5rG2r4"/>
</div>
</div>
<h3 className="mt-3 font-title-lg text-title-lg text-primary group-hover:text-secondary transition-colors font-bold text-sm md:text-base">
            Kanha Ji Poshak
          </h3>
<span className="font-body-sm text-body-sm text-on-surface-variant">(All Sizes 0-6)</span>
</Link>

<Link className="group flex flex-col items-center text-center p-3 bg-surface-container-low hover:bg-surface border border-outline-variant/30 hover:border-secondary/50 rounded-xl transition-all shadow-xs hover:shadow-md" href="/search?category=Mukut%20%26%20Pagdi">
<div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-secondary/40 to-primary-container/20 group-hover:scale-105 transition-transform duration-300">
<div className="w-full h-full rounded-full overflow-hidden border-2 border-surface bg-surface">
<img alt="Traditional golden Mukut crown for Laddu Gopal with genuine peacock feather" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCbtu7i93CmSGSy7eoanowiOsY8kwUGuham5weT6tchWQ7SQ6nSrxbIxXTNIzJxWrHvC_NIarJ24kGzKjoI9auXZXZN_Oo48MFC34Wq5LlA7onftvF-gGcRrqXq47WUc-5UWz3XiWfZl-GNs6XjaTUkqtCQ1roj14NhUy11sAGmSsOuGr3lc_YOKhr0dvoHEopUpEK0zp0_uBaiikpE9qNVbWji8Dl_l-frMMFcQ8tZizAAxJsckOY"/>
</div>
</div>
<h3 className="mt-3 font-title-lg text-title-lg text-primary group-hover:text-secondary transition-colors font-bold text-sm md:text-base">
            Mukut &amp; Pagdi
          </h3>
<span className="font-body-sm text-body-sm text-on-surface-variant">(Crown / Mor Pankh)</span>
</Link>

<Link className="group flex flex-col items-center text-center p-3 bg-surface-container-low hover:bg-surface border border-outline-variant/30 hover:border-secondary/50 rounded-xl transition-all shadow-xs hover:shadow-md" href="/search?category=Moti%20Mala%20%26%20Haar">
<div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-secondary/40 to-primary-container/20 group-hover:scale-105 transition-transform duration-300">
<div className="w-full h-full rounded-full overflow-hidden border-2 border-surface bg-surface">
<img alt="Handcrafted pearl and golden beads moti mala necklace set for Laddu Gopal idol" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWZJ43yxJTqRk2U4o3XhQT7P0ifzCHSdrtjv4KpV9H0-mnVdZgoW6eyysmT_73MLN-Rrry2wMDQ4Ij-zuoSLm6ZoZT_8AYzxGm8p0jSMj1qAFLALL3WczugPhz27CicmNtHIzJMqA-R-uYnSIom56dqm1HhSW15dBzPI9KAgIkcERzSjVARbCghH9B1s_YaMfP9xQmpZ0ePvs12uL39vzqiqMP8PuCtVSIVFkCYkNRNT_CKgIU4wlb"/>
</div>
</div>
<h3 className="mt-3 font-title-lg text-title-lg text-primary group-hover:text-secondary transition-colors font-bold text-sm md:text-base">
            Moti Mala &amp; Haar
          </h3>
<span className="font-body-sm text-body-sm text-on-surface-variant">(Tulsi / Pearl)</span>
</Link>

<Link className="group flex flex-col items-center text-center p-3 bg-surface-container-low hover:bg-surface border border-outline-variant/30 hover:border-secondary/50 rounded-xl transition-all shadow-xs hover:shadow-md" href="/search?category=Divine%20Jewellery">
<div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-secondary/40 to-primary-container/20 group-hover:scale-105 transition-transform duration-300">
<div className="w-full h-full rounded-full overflow-hidden border-2 border-surface bg-surface">
<img alt="Divine Jewellery Kundal Haar Baju Band" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWZJ43yxJTqRk2U4o3XhQT7P0ifzCHSdrtjv4KpV9H0-mnVdZgoW6eyysmT_73MLN-Rrry2wMDQ4Ij-zuoSLm6ZoZT_8AYzxGm8p0jSMj1qAFLALL3WczugPhz27CicmNtHIzJMqA-R-uYnSIom56dqm1HhSW15dBzPI9KAgIkcERzSjVARbCghH9B1s_YaMfP9xQmpZ0ePvs12uL39vzqiqMP8PuCtVSIVFkCYkNRNT_CKgIU4wlb"/>
</div>
</div>
<h3 className="mt-3 font-title-lg text-title-lg text-primary group-hover:text-secondary transition-colors font-bold text-sm md:text-base">
            Divine Jewellery
          </h3>
<span className="font-body-sm text-body-sm text-on-surface-variant">(Kundal / Payal)</span>
</Link>

<Link className="group flex flex-col items-center text-center p-3 bg-surface-container-low hover:bg-surface border border-outline-variant/30 hover:border-secondary/50 rounded-xl transition-all shadow-xs hover:shadow-md" href="/search?category=Bansuri%20%26%20Latkan">
<div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-secondary/40 to-primary-container/20 group-hover:scale-105 transition-transform duration-300">
<div className="w-full h-full rounded-full overflow-hidden border-2 border-surface bg-surface">
<img alt="Ornate handcrafted golden bansuri flute for Kanha Ji with peacock feather accent" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZvL8LtQL4wG2sFkHRjiojnegg_sE_ne6X9mYFEq87nv6MaluNj-d_57Oidcl3DKca7Wd1_JR_uQNkGr44uXCWxfZo6xL5EE1xGkGxk9o90obHrFa3o9o1n7HzjoNez7TWVCOcdtvMs2ZNNsRIsLMKLgCejVDUNbRBCQFwa9Lp76pIIPE27LuoIUggrxWmqlTYmTofPlcl7tIG6tekkkM2bfcjrup9i4klzx4PiME3eLZDt0MW0X2C"/>
</div>
</div>
<h3 className="mt-3 font-title-lg text-title-lg text-primary group-hover:text-secondary transition-colors font-bold text-sm md:text-base">
            Bansuri &amp; Latkan
          </h3>
<span className="font-body-sm text-body-sm text-on-surface-variant">(Golden Flutes)</span>
</Link>

<Link className="group flex flex-col items-center text-center p-3 bg-surface-container-low hover:bg-surface border border-outline-variant/30 hover:border-secondary/50 rounded-xl transition-all shadow-xs hover:shadow-md" href="/search?category=Royal%20Singhasan">
<div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-secondary/40 to-primary-container/20 group-hover:scale-105 transition-transform duration-300">
<div className="w-full h-full rounded-full overflow-hidden border-2 border-surface bg-surface">
<img alt="Royal carved wooden Singhasan throne with red velvet cushion and gold leaf detailing" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOJyCy6ORHQ0ego3x1ciS37TMvPYEAS3MbVBo3YaAw_zGPtSeHTGHTLd0CgQT6fhvDuI7H2t1C5R53yc7IekVPngfQHAnsdg29UWqLxpxN5SN5nHepvuXB5cwYOGUt1ggmlGKqe9wW7oyL0o3U7sxlpcFBnUSNt2J0qr8Y6-lNplFyIEm3jbmoAPv3b0KmaJbCGpZr8Kq4P8oz9ecb_p4yiaqT_M-U4a_VlMFEr5UG9JLteazsfkLs"/>
</div>
</div>
<h3 className="mt-3 font-title-lg text-title-lg text-primary group-hover:text-secondary transition-colors font-bold text-sm md:text-base">
            Royal Singhasan
          </h3>
<span className="font-body-sm text-body-sm text-on-surface-variant">(Thrones &amp; Beds)</span>
</Link>
</div>
</section>

<section className="py-12 bg-surface-container-low/60 border-y border-outline-variant/30" id="featured">
<div className="max-w-7xl mx-auto px-4 md:px-8">

<div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
<div>
<div className="flex items-center gap-2 text-secondary">
<span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>spa</span>
<span className="font-label-sm text-label-sm uppercase tracking-wider">Divine Artisan Creations</span>
</div>
<h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary font-bold">
              Featured Devotional Products
            </h2>
</div>

<div className="flex items-center gap-1.5 p-1 bg-surface rounded-lg border border-outline-variant/40 overflow-x-auto custom-scroll">
<button className="px-4 py-1.5 bg-primary-container text-surface font-label-md text-label-md rounded-md shadow-xs whitespace-nowrap">
              Trending Now
            </button>
<button className="px-4 py-1.5 text-on-surface-variant hover:text-primary font-label-md text-label-md rounded-md whitespace-nowrap transition-colors">
              Poshak Specials
            </button>
<button className="px-4 py-1.5 text-on-surface-variant hover:text-primary font-label-md text-label-md rounded-md whitespace-nowrap transition-colors">
              Daily Shringar
            </button>
</div>
</div>


<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
    {latestProducts.length > 0 ? (
        latestProducts.map((product: any) => (
            <ProductCard key={product.id} product={product} />
        ))
    ) : (
        <div className="col-span-full py-10 text-center text-on-surface-variant">
            No products found in the database. Add some from the admin panel!
        </div>
    )}
</div>
        </div>
</section>

<section className="py-12 max-w-7xl mx-auto px-4 md:px-8" id="size-guide">
<div className="bg-surface-container-low border border-secondary/30 rounded-2xl p-6 md:p-10 shadow-sm relative overflow-hidden">
<div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
<div className="space-y-2 text-center md:text-left">
<span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-bold">Accurate Seva Measurement</span>
<h2 className="font-headline-lg-mobile md:font-headline-md text-headline-lg-mobile md:text-headline-md text-primary font-bold">
              Shop by Laddu Gopal Ji Size
            </h2>
<p className="font-body-md text-body-md text-on-surface-variant max-w-lg">
              Every deity has a divine stature. Choose the exact number (0 to 7+) to view tailor-made poshaks, crowns, and matching accessories.
            </p>
</div>
<button className="px-5 py-2.5 bg-surface border border-secondary/50 text-secondary hover:bg-secondary-fixed/20 rounded-lg font-label-lg text-label-lg font-bold flex items-center gap-2 shadow-xs transition-all active:scale-95" >
<span className="material-symbols-outlined text-lg">straighten</span>
<span>View Full Size Chart Guide</span>
</button>
</div>

<SizeSelector />
</div>
</section>

<section className="py-12 bg-surface" id="combos">
<div className="max-w-7xl mx-auto px-4 md:px-8">
<div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-primary-container via-primary-container to-[#081f18] text-surface p-8 md:p-12 border border-secondary/40 shadow-xl">

<div className="absolute -right-20 -bottom-20 w-80 h-80 bg-secondary/30 rounded-full blur-3xl pointer-events-none"></div>
<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
<div className="lg:col-span-7 space-y-4 text-center lg:text-left">
<div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/30 border border-secondary-fixed/30 rounded-full text-secondary-fixed text-xs font-semibold">
<span className="material-symbols-outlined text-sm">auto_awesome</span>
<span>Exclusive Divine Festive Edition</span>
</div>
<h2 className="font-headline-lg-mobile md:font-display-lg text-headline-lg-mobile md:text-display-lg text-surface font-bold leading-tight">
                Make Every Moment Special — Bring Home Divine Happiness
              </h2>
<p className="font-body-lg text-body-lg text-primary-fixed-dim max-w-xl">
                Complete coordinated sets matching Poshak, Mukut, Bansuri, Mala and Payal — hassle-free reverent seva for your Beloved Kanha.
              </p>
<div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
<a className="gold-gradient-btn text-primary-container px-6 py-3 rounded-lg font-title-md text-title-md font-bold shadow-md hover:brightness-105 active:scale-95 transition-all" href="#featured">
                  Shop Coordinated Combos (From ₹1,599)
                </a>
<a className="px-5 py-3 border border-secondary text-secondary-fixed hover:bg-secondary/20 rounded-lg font-title-md text-title-md font-semibold transition-colors flex items-center gap-2" href="https://wa.me/919876543210" target="_blank">
<span className="material-symbols-outlined text-green-400 text-lg">chat</span>
<span>Customise On WhatsApp</span>
</a>
</div>
</div>
<div className="lg:col-span-5 flex justify-center">
<div className="relative w-full max-w-sm rounded-xl overflow-hidden border-2 border-secondary/50 shadow-2xl group bg-surface">
<img alt="Complete Laddu Gopal Shringar combo set including matching yellow silk poshak dress, ornate golden peacock mukut crown, moti haar necklace, tiny bansuri flute, and payal anklets displayed neatly on silk fabric, luxury e-commerce catalog shot" className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500 aspect-square" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB76ugUiHPdf4MNR36s9r7QSmMKuCCttkzZ2qQdHggWVDB7KwYakn2R5eON1YhUNuBCgFhNPEHxCN15bXUXS0-r0ZcMGnoLkFkG78kNf18JIS9fMfaB4yeaX3j_8_hKgzDgaGWCNKT9CfKZR8c2VhZ0EoD61fpr4eiGYJubBvRyis01gWOewyu_DPo-qSCUom1QffoIzjHk4lEp8I7AlOIWyfrdjUE8YRCsIfvYvGZaPjleg9tFDcpb"/>
<div className="p-3 bg-surface-container text-on-surface flex justify-between items-center">
<div>
<p className="font-title-md text-title-md font-bold text-primary">Maha Shringar 5-Piece Gift Set</p>
<p className="font-body-sm text-body-sm text-secondary font-semibold">Includes Blessed Tulsi Touch</p>
</div>
<span className="font-price-lg text-price-lg text-primary font-bold">₹1,599</span>
</div>
</div>
</div>
</div>
</div>
</div>
</section>

<section className="py-10 bg-surface-container-low border-y border-outline-variant/30" id="trust-strip">
<div className="max-w-7xl mx-auto px-4 md:px-8">
<div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
<div className="flex flex-col items-center p-3">
<div className="w-12 h-12 rounded-full bg-secondary-fixed/30 flex items-center justify-center text-secondary mb-3">
<span className="material-symbols-outlined text-2xl">local_shipping</span>
</div>
<h4 className="font-title-lg text-title-lg text-primary font-bold text-sm md:text-base">Fast &amp; Secure Shipping</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Pan-India express delivery with transit insurance</p>
</div>
<div className="flex flex-col items-center p-3">
<div className="w-12 h-12 rounded-full bg-secondary-fixed/30 flex items-center justify-center text-secondary mb-3">
<span className="material-symbols-outlined text-2xl">verified</span>
</div>
<h4 className="font-title-lg text-title-lg text-primary font-bold text-sm md:text-base">100% Authentic Quality</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Pristine silk, non-tarnish brass &amp; genuine peacock feathers</p>
</div>
<div className="flex flex-col items-center p-3">
<div className="w-12 h-12 rounded-full bg-secondary-fixed/30 flex items-center justify-center text-secondary mb-3">
<span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
</div>
<h4 className="font-title-lg text-title-lg text-primary font-bold text-sm md:text-base">Trusted by 50,000+ Devotees</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Spreading sacred devotion into households nationwide</p>
</div>
<div className="flex flex-col items-center p-3">
<div className="w-12 h-12 rounded-full bg-secondary-fixed/30 flex items-center justify-center text-secondary mb-3">
<span className="material-symbols-outlined text-2xl">support_agent</span>
</div>
<h4 className="font-title-lg text-title-lg text-primary font-bold text-sm md:text-base">Dedicated Devotee Care</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Immediate guidance on sizing and seva queries</p>
</div>
</div>
</div>
</section>

    </div>
  );
}
