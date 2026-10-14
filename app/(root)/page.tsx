import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/shared/product/product-card';
import { getAllProducts, getLatestProducts } from '@/lib/actions/product.action';
import { getServerTranslations } from '@/lib/i18n/server';

const productSizes = new Set(['0', '1', '2', '3', '4', '5', '6', '7']);

export default async function Homepage({
  searchParams,
}: {
  searchParams: Promise<{ size?: string }>;
}) {
  const { size } = await searchParams;
  const { t, lang } = await getServerTranslations();
  const isHindi = lang === 'hi';

  const selectedSize = size && productSizes.has(size) ? size : undefined;
  let latestProducts = selectedSize
    ? (
        await getAllProducts({
          query: 'all',
          page: 1,
          size: selectedSize,
        })
      ).data
    : await getLatestProducts();
  
  // Intercept dummy image data
  latestProducts = latestProducts.map((p: any) => {
    let images = p.images || [];
    let hasSample = images.some((img: any) => img && img.includes('sample-products'));
    
    if (hasSample) {
      let newImg = '/images/devotional/complete_shringar.webp';
      const nameLower = p.name ? p.name.toLowerCase() : '';
      if (nameLower.includes('poshak') || p.category === 'Poshak') newImg = '/images/devotional/poshak.webp';
      else if (nameLower.includes('mukut') || p.category === 'Mukut') newImg = '/images/devotional/mukut.webp';
      else if (nameLower.includes('bansuri') || p.category === 'Bansuri') newImg = '/images/devotional/bansuri.webp';
      else if (nameLower.includes('mala') || p.category === 'Mala') newImg = '/images/devotional/mala.webp';
      else if (nameLower.includes('jewel') || p.category === 'Jewellery') newImg = '/images/devotional/jewellery.webp';
      else if (nameLower.includes('aasan') || p.category === 'Aasan') newImg = '/images/devotional/aasan.webp';
      
      return { ...p, images: [newImg] };
    }
    return p;
  });

  return (
    <div className="bg-[#FBF7EE] text-on-surface antialiased font-body-md overflow-x-hidden">
      
      {/* 1. HERO — ORGANIC, LAYERED, EXPRESSIVE */}
      <section className="relative min-h-[90vh] bg-gradient-to-br from-[#E8F3EE] via-[#FDFBF7] to-[#FDE8DF] overflow-hidden pt-24 pb-12 px-6 md:px-12 rounded-b-[4rem] md:rounded-b-[10rem] border-b-8 border-white/50 shadow-sm z-10">
        
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#0F6F74]/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#C88A20]/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3"></div>
        <div className="absolute top-1/3 left-1/2 w-[400px] h-[400px] bg-[#F7C9B6]/20 rounded-full blur-[80px] -translate-x-1/2"></div>
        
        {/* Floating Decorative Elements */}
        <span className="material-symbols-outlined absolute top-32 left-[10%] text-5xl text-[#C88A20]/40 rotate-12 animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>local_florist</span>
        <span className="material-symbols-outlined absolute bottom-40 left-[40%] text-4xl text-[#0F6F74]/30 -rotate-12" style={{ fontVariationSettings: "'FILL' 1" }}>spa</span>
        <span className="material-symbols-outlined absolute top-40 right-[15%] text-6xl text-rose-300/40 rotate-45" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_nature</span>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-20">
          
          {/* LEFT: Expressive Typography */}
          <div className="lg:col-span-5 flex flex-col items-start text-left z-30 pt-10">
            <div className="inline-flex items-center gap-3 bg-white/70 backdrop-blur-md px-6 py-2 rounded-full border border-white/40 shadow-sm mb-8 transform -rotate-2">
              <span className="w-2 h-2 rounded-full bg-[#C88A20] animate-ping"></span>
              <span className="font-bold text-xs uppercase tracking-[0.2em] text-[#003020]">{t.home.divineEssentials}</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-[6.5rem] text-[#003020] font-bold tracking-tight leading-[1.05] md:leading-[1] lg:leading-[0.95] font-serif mb-6 relative z-10 drop-shadow-sm">
              {isHindi ? (
                <>
                  सजाएं अपने <br />
                  <span className="inline-block transform -rotate-3 text-[#0F6F74] italic font-medium bg-[#E6C16A]/20 px-3 sm:px-4 rounded-3xl mt-2">लाडले</span> कान्हा को
                </>
              ) : (
                <>
                  Adorn Your <br />
                  <span className="inline-block transform -rotate-3 text-[#0F6F74] italic font-medium bg-[#E6C16A]/20 px-3 sm:px-4 rounded-3xl mt-2">Beloved</span> Kanha
                </>
              )}
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-[#003020]/70 max-w-md font-serif mb-8 sm:mb-10 pl-4 sm:pl-6 border-l-4 border-[#C88A20] rounded-sm">
              {t.home.hero1Subtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              <Link href="/search?category=Poshak" className="bg-[#003020] px-8 sm:px-10 py-3.5 sm:py-5 rounded-[2rem] text-white font-bold shadow-xl shadow-[#003020]/20 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 text-center uppercase tracking-widest text-xs sm:text-sm border-2 border-[#003020]">
                {t.home.hero1Btn}
              </Link>
              <Link href="/search?category=Mukut" className="bg-white px-8 sm:px-10 py-3.5 sm:py-5 rounded-[2rem] text-[#003020] font-bold shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300 text-center uppercase tracking-widest text-xs sm:text-sm border-2 border-[#E6C16A]/30">
                {t.home.hero1Btn2}
              </Link>
            </div>
          </div>

          {/* RIGHT: Floating Artwork & Organic Layout */}
          <div className="lg:col-span-7 relative h-[420px] sm:h-[500px] lg:h-[750px] w-full flex justify-center lg:justify-end items-center mt-6 lg:mt-0">
            {/* Organic Blob Background for Image */}
            <div className="absolute w-[90%] h-[90%] bg-gradient-to-tr from-[#E6C16A] to-[#FDE8DF] rounded-[40%_60%_70%_30%/40%_50%_60%_50%] animate-[spin_30s_linear_infinite] opacity-50 blur-xl"></div>
            <div className="absolute w-[80%] h-[80%] bg-[#0F6F74] rounded-[60%_40%_30%_70%/60%_30%_70%_40%] animate-[spin_25s_linear_infinite_reverse] opacity-20 blur-2xl"></div>

            {/* The Main Artwork - Breaking out slightly */}
            <div className="relative w-full lg:w-[110%] h-[110%] ml-auto z-20 flex items-center justify-center transform lg:translate-x-12">
              <div className="w-[85%] h-[85%] relative rounded-[3rem] lg:rounded-[6rem] overflow-visible shadow-2xl rotate-2 hover:rotate-0 active:rotate-0 transition-transform duration-700 bg-white p-3 border-4 border-white/60">
                <Image
                  src="/images/devotional/hero_krishna.webp"
                  alt="Divine Kanha Artwork" 
                  className="w-full h-full object-cover rounded-[2.5rem] lg:rounded-[5.5rem]"
                  width={1200}
                  height={1200}
                  preload
                  sizes="(max-width: 1024px) 85vw, 60vw"
                />
                
                {/* Floating Detail Elements bursting from the frame */}
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white rounded-full flex items-center justify-center p-2 shadow-xl border-4 border-[#FBF7EE] transform -rotate-12 z-30">
                   <Image src="/images/devotional/mukut.webp" className="w-full h-full object-cover rounded-full" alt="Mukut Detail" width={180} height={180} sizes="128px" />
                </div>
                
                <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#FDFBF7] rounded-[2rem] flex items-center justify-center p-2 shadow-lg border-2 border-[#E6C16A]/50 transform rotate-12 z-30">
                   <Image src="/images/devotional/bansuri.webp" className="w-full h-full object-cover rounded-[1.5rem]" alt="Bansuri Detail" width={180} height={180} sizes="112px" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. DISCOVER KANHA — PLAYFUL ASYMMETRIC CATEGORY COMPOSITION */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-12 relative z-20 -mt-10">
        <div className="text-center mb-16">
          <span className="text-[#C88A20] font-bold tracking-[0.2em] uppercase text-xs">{t.home.curatedSeva}</span>
          <h2 className="text-5xl md:text-6xl font-bold text-[#003020] font-serif mt-2">
            {isHindi ? (
              <>दिव्य <span className="italic text-[#0F6F74] font-light">शृंगार दर्शन</span></>
            ) : (
              <>Discover <span className="italic text-[#0F6F74] font-light">Shringar</span></>
            )}
          </h2>
        </div>
        
        <div className="grid grid-cols-2 gap-4 md:h-[560px] md:grid-cols-12 md:grid-rows-3 md:gap-5">
           <Link href="/search?category=Poshak" className="group relative col-span-2 h-[360px] overflow-hidden rounded-[2rem] border-4 border-white bg-white shadow-xl transition-transform active:scale-[0.99] md:col-span-8 md:row-span-3 md:h-full md:rounded-[2.5rem]">
             <Image src="/images/devotional/poshak.webp" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 group-active:scale-105" alt={t.home.poshakTitle} width={1200} height={900} sizes="(max-width: 768px) 100vw, 66vw" />
             <div className="absolute inset-0 bg-gradient-to-t from-[#003020]/80 via-transparent to-transparent"></div>
             <div className="absolute bottom-6 left-6 text-white sm:bottom-8 sm:left-8">
               <h3 className="text-3xl font-serif font-bold sm:text-4xl">{t.home.poshakTitle}</h3>
               <span className="mt-2 inline-block rounded-full bg-[#E6C16A] px-3 py-1 text-xs font-bold text-[#003020]">{t.home.bestsellersBadge}</span>
             </div>
           </Link>

           <div className="col-span-2 grid grid-cols-3 gap-3 md:col-span-4 md:row-span-3 md:grid-cols-1 md:grid-rows-3 md:gap-5">
             <Link href="/search?category=Mukut" className="group relative aspect-square overflow-hidden rounded-[1.5rem] border-4 border-white bg-[#E8F3EE] shadow-lg transition-transform duration-300 hover:-translate-y-1 active:scale-[0.98] md:aspect-auto md:min-h-0 md:rounded-[1.75rem]">
               <Image src="/images/devotional/mukut.webp" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 group-active:scale-105" alt={t.home.mukutTitle} width={500} height={500} sizes="34vw" />
               <div className="absolute inset-0 bg-gradient-to-br from-[#0F6F74]/70 to-transparent"></div>
               <div className="absolute left-5 top-5 text-white sm:left-6 sm:top-6">
                 <h3 className="text-xl font-serif font-bold sm:text-2xl">{t.home.mukutTitle}</h3>
               </div>
             </Link>

             <Link href="/search?category=Bansuri" className="group relative aspect-square overflow-hidden rounded-[1.5rem] border-4 border-white bg-[#FDE8DF] shadow-lg transition-transform duration-300 hover:-translate-y-1 active:scale-[0.98] md:aspect-auto md:min-h-0 md:rounded-[1.75rem]">
               <Image src="/images/devotional/bansuri.webp" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 group-active:scale-105" alt={t.home.bansuriTitle} width={500} height={500} sizes="34vw" />
               <div className="absolute inset-0 bg-gradient-to-t from-[#003020]/75 to-transparent"></div>
               <div className="absolute bottom-4 right-4 text-right text-white sm:bottom-6 sm:right-6">
                 <h3 className="text-xl font-serif font-bold sm:text-2xl">{t.home.bansuriTitle}</h3>
               </div>
             </Link>

             <Link href="/search?category=Jewellery" className="group relative flex aspect-square items-center justify-center overflow-hidden rounded-[1.5rem] border-4 border-white bg-[#FBF7EE] shadow-lg transition-transform duration-300 hover:-translate-y-1 active:scale-[0.98] md:aspect-auto md:min-h-0 md:rounded-[1.75rem]">
               <Image src="/images/devotional/jewellery.webp" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 group-active:scale-105" alt={t.home.jewelsTitle} width={500} height={500} sizes="34vw" />
               <div className="absolute inset-0 bg-[#C88A20]/20 transition-colors group-hover:bg-transparent"></div>
               <h3 className="absolute rounded-full bg-[#003020]/60 px-3 py-2 text-center font-serif text-base font-bold text-white backdrop-blur-sm sm:px-4 sm:text-xl">{t.home.jewelsTitle}</h3>
             </Link>
           </div>
        </div>
      </section>

      {/* 3. EDITORIAL PRODUCT CAMPAIGN - SIGNATURE POSHAK */}
      <section className="py-24 my-10 bg-[#003020] text-white relative overflow-hidden rounded-[3rem] mx-4 md:mx-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0F6F74] rounded-full blur-[100px] opacity-40 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#C88A20] rounded-full blur-[100px] opacity-30 -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 gap-10 items-center relative z-10 lg:grid-cols-2 lg:gap-16">
           <div className="relative group">
              <div className="w-full h-[400px] md:h-[480px] lg:h-[600px] bg-white p-3 rounded-t-[10rem] rounded-b-[2rem] transform -rotate-3 transition-transform group-hover:rotate-0 active:rotate-0 duration-500 shadow-2xl">
                <Image src="/images/devotional/poshak.webp" className="w-full h-full object-cover rounded-t-[9.5rem] rounded-b-[1.5rem] transition-transform duration-700 group-hover:scale-[1.02] group-active:scale-[1.02]" alt={t.home.hero2Title} width={1000} height={1200} sizes="(max-width: 768px) 100vw, 50vw" />
              </div>
              <div className="absolute -right-6 top-1/4 bg-[#E6C16A] text-[#003020] w-24 h-24 rounded-full flex items-center justify-center font-bold text-sm sm:text-base text-center p-2 rotate-12 shadow-lg border-4 border-[#003020]">
                 {t.home.newBadge}
              </div>
           </div>
           
           <div className="flex min-w-0 flex-col items-start justify-center">
              <span className="material-symbols-outlined text-[#E6C16A] text-5xl mb-6">workspace_premium</span>
              <h2 className="mb-6 max-w-full break-words font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-[clamp(3rem,5.3vw,4.5rem)]">
                {isHindi ? (
                  <>विशेष <br /><span className="text-[#E6C16A] italic font-light">ज़री पोशाक</span></>
                ) : (
                  <>Signature <br /><span className="text-[#E6C16A] italic font-light">Poshak</span></>
                )}
              </h2>
              <p className="text-lg md:text-xl text-white/80 font-light mb-10 border-l-4 border-[#0F6F74] pl-6">
                {t.home.hero2Subtitle}
              </p>
              <Link href="/search?category=Poshak" className="bg-[#E6C16A] text-[#003020] px-10 py-4 rounded-full font-bold shadow-lg hover:bg-white transition-colors uppercase tracking-widest text-sm">
                {t.home.hero2Btn}
              </Link>
           </div>
        </div>
      </section>

      {/* 4. KANHA'S LITTLE WORLD — IMMERSIVE ILLUSTRATED COMPOSITION */}
      <section className="py-32 relative overflow-hidden bg-[#FBF7EE]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center pt-10">
          
          <div className="order-2 lg:order-1 relative h-[500px] lg:h-[700px] w-full flex items-center justify-center">
             <div className="absolute w-[100%] h-[100%] bg-[#FDE8DF] rounded-[40%_60%_70%_30%/40%_50%_60%_50%] opacity-80 blur-lg"></div>
             
             <div className="relative z-10 w-[90%] h-[90%] p-4 bg-white rounded-full shadow-2xl border-8 border-[#0F6F74]/20 hover:border-[#0F6F74]/50 transition-colors duration-500">
               <Image src="/images/devotional/kanhas_world.webp" className="w-full h-full object-cover rounded-full transition-transform duration-700 hover:scale-[1.02] active:scale-[1.02]" alt="Kanha's World Art" width={800} height={800} sizes="(max-width: 1024px) 90vw, 40vw" />
             </div>
             
             <div className="absolute bottom-10 -right-4 w-40 h-40 bg-[#E8F3EE] rounded-full p-2 shadow-xl border-4 border-white z-20">
               <Image src="/images/devotional/mala.webp" className="w-full h-full object-cover rounded-full" alt="Detail" width={300} height={300} sizes="(max-width: 1024px) 30vw, 20vw" />
             </div>
          </div>
          
          <div className="order-1 lg:order-2 space-y-6 text-center lg:text-left">
            <span className="text-[#0F6F74] font-bold tracking-[0.2em] uppercase text-sm border-b-2 border-[#0F6F74] pb-1">{t.home.kanhasWorldTag}</span>
            <h2 className="text-5xl md:text-7xl font-serif leading-none text-[#003020] font-bold mb-4">
              {isHindi ? (
                <>कान्हा की <br/> <span className="text-[#C88A20] italic">बाल लीला एवं शृंगार</span></>
              ) : (
                <>Kanha's <br/> <span className="text-[#C88A20] italic">Little World</span></>
              )}
            </h2>
            <p className="text-2xl font-serif italic text-[#003020]/70">{t.home.kanhasWorldSubtitle}</p>
            <p className="text-lg leading-relaxed text-[#003020]/80 mt-6 max-w-lg mx-auto lg:mx-0">
              {t.home.kanhasWorldDesc}
            </p>
            <Link href="/about" className="inline-block mt-8 bg-[#0F6F74] text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest text-sm shadow-xl hover:-translate-y-1 transition-transform">
              {t.home.readOurStoryBtn}
            </Link>
          </div>
          
        </div>
      </section>

      {/* 5. PRODUCT GRID — ECOMMERCE FOCUS */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-12 bg-white rounded-[3rem] shadow-sm my-12 border border-[#003020]/5">
        <div className="flex flex-col items-center text-center mb-16">
          <span className="material-symbols-outlined text-[#C88A20] text-4xl mb-4">shopping_bag</span>
          <h2 className="text-4xl md:text-5xl font-serif text-[#003020] font-bold mb-4">{t.home.featuredTitle}</h2>
          <p className="text-[#003020]/60 max-w-2xl text-lg">{t.home.featuredSubtitle}</p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-8">
          {latestProducts && latestProducts.length > 0 ? (
            latestProducts.slice(0, 4).map((product: any) => (
                <div key={product.id} className="w-full transform hover:-translate-y-2 transition-transform duration-300">
                  <ProductCard product={product} />
                </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-on-surface-variant bg-[#FBF7EE] rounded-2xl">
               <span className="material-symbols-outlined text-4xl mb-2 opacity-50">inventory_2</span>
               <p>{t.home.noFeatured}</p>
            </div>
          )}
        </div>
        
        <div className="mt-16 text-center">
           <Link href="/search" className="inline-block border-2 border-[#003020] text-[#003020] px-10 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-[#003020] hover:text-white transition-colors shadow-sm">
              {t.home.viewEntireCollection}
           </Link>
        </div>
      </section>

      {/* 6. COMPLETE SHRINGAR — ORGANIC/WAVY CAMPAIGN */}
      <section className="py-32 relative bg-[#FDE8DF] overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden">
           <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-[#E6C16A]/20 rounded-full blur-[80px]"></div>
           <div className="absolute bottom-10 -left-20 w-[500px] h-[500px] bg-[#0F6F74]/10 rounded-full blur-[80px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
           <div className="order-2 lg:order-1 text-center lg:text-left space-y-6">
              <h2 className="text-6xl md:text-8xl font-serif font-bold text-[#003020] leading-none mb-6">
                {isHindi ? (
                  <>संपूर्ण <br/><span className="italic text-[#C88A20] font-light">शृंगार सेट</span></>
                ) : (
                  <>Complete <br/><span className="italic text-[#C88A20] font-light">Shringar</span></>
                )}
              </h2>
              <p className="text-xl text-[#003020]/80 font-serif italic mb-10 bg-white/50 inline-block px-6 py-2 rounded-full border border-white">
                {t.home.completeSubtitle}
              </p>
              
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-10">
                 <span className="bg-white text-[#003020] font-bold px-4 py-2 rounded-full shadow-sm">{t.home.poshakBadge}</span>
                 <span className="bg-white text-[#003020] font-bold px-4 py-2 rounded-full shadow-sm">{t.home.mukutBadge}</span>
                 <span className="bg-white text-[#003020] font-bold px-4 py-2 rounded-full shadow-sm">{t.home.malaBadge}</span>
                 <span className="bg-white text-[#003020] font-bold px-4 py-2 rounded-full shadow-sm">{t.home.bansuriBadge}</span>
                 <span className="bg-white text-[#003020] font-bold px-4 py-2 rounded-full shadow-sm">{t.home.kanganBadge}</span>
              </div>
              
              <Link href="/search?category=Complete Shringar" className="inline-block bg-[#003020] text-white px-12 py-5 rounded-full font-bold shadow-xl hover:-translate-y-1 transition-transform uppercase tracking-widest text-sm">
                {t.home.exploreCombos}
              </Link>
           </div>
           
           <div className="order-1 lg:order-2">
              <div className="group relative w-[100%] aspect-[4/3] bg-white rounded-[4rem_1rem_4rem_1rem] shadow-2xl p-4 transform rotate-3 hover:rotate-0 active:rotate-0 transition-transform duration-500 border-8 border-white/60">
                 <Image src="/images/devotional/complete_shringar.webp" className="w-full h-full object-cover rounded-[3rem_0.5rem_3rem_0.5rem] transition-transform duration-700 group-hover:scale-[1.02] group-active:scale-[1.02]" alt="Complete Shringar Arrangement" width={1000} height={900} sizes="(max-width: 768px) 100vw, 50vw" />
                 
                 {/* Floating price badge */}
                 <div className="absolute -bottom-6 -left-6 bg-[#0F6F74] text-white p-6 rounded-full shadow-xl rotate-[-15deg] font-serif font-bold text-lg md:text-xl border-4 border-white text-center leading-tight">
                    {t.home.matchingSets}
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 8. FESTIVAL / OCCASION CAMPAIGN */}
      <section className="py-24 bg-[#0F6F74] text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-serif font-bold mb-12">{t.home.sevaForOccasions}</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: t.home.dailySeva, query: 'Daily Seva', img: '/images/devotional/poshak.webp', color: 'bg-[#003020]' },
              { name: t.home.janmashtami, query: 'Janmashtami', img: '/images/devotional/hero_krishna.webp', color: 'bg-[#C88A20]' },
              { name: t.home.festivals, query: 'Festivals', img: '/images/devotional/mukut.webp', color: 'bg-[#E6C16A]' },
              { name: t.home.specialDarshan, query: 'Special Darshan', img: '/images/devotional/complete_shringar.webp', color: 'bg-[#FDE8DF]' }
            ].map((occ) => (
              <Link key={occ.query} href={`/search?q=${encodeURIComponent(occ.query)}`} className="group block relative h-64 md:h-80 rounded-[2rem] overflow-hidden shadow-lg hover:-translate-y-3 active:scale-[0.98] transition-all duration-300">
                <Image src={occ.img} className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 group-active:opacity-100 group-active:scale-110 transition-all duration-700" alt={occ.name} width={800} height={800} sizes="(max-width: 768px) 50vw, 25vw" />
                <div className={`absolute inset-0 bg-gradient-to-t ${occ.color}/90 via-transparent to-transparent`}></div>
                <div className="absolute bottom-6 left-0 w-full text-center px-4">
                   <h3 className="text-white font-bold font-serif text-xl md:text-2xl drop-shadow-md">{occ.name}</h3>
                   <span className="text-white/80 text-sm mt-1 opacity-0 group-hover:opacity-100 transition-opacity">{t.home.explore}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 9. WHY DEVOTEES CHOOSE US — HANDCRAFTED SEVA COMMITMENT */}
      <section className="py-24 bg-gradient-to-b from-[#FBF7EE] via-[#F8F2E2]/60 to-[#FBF7EE] relative overflow-hidden border-y border-[#E6C16A]/20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Heading with Human/Devotional Warmth */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#0F6F74]/10 text-[#0F6F74] mb-3 uppercase tracking-widest font-sans">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F6F74]"></span>
              {t.home.devotionalPromise}
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-[#003020] font-bold tracking-tight mb-4">
              {t.home.promiseTitle}
            </h2>
            <p className="text-[#003020]/75 text-base md:text-lg font-light leading-relaxed">
              {t.home.promiseDesc}
            </p>
          </div>

          {/* 4 Human-Crafted Seva Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Braj Dhām Karigari */}
            <div className="bg-white rounded-3xl p-7 shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-[#D4A346]/40 hover:border-[#B37812] ring-1 ring-[#D4A346]/15 hover:ring-[#B37812]/30 flex flex-col justify-between group hover:-translate-y-1.5 relative">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFF9EE] to-[#FBF2DE] border border-[#D4A346]/40 flex items-center justify-center text-[#C88A20] shadow-xs group-hover:scale-105 group-hover:border-[#B37812]/60 transition-all duration-300">
                    <span className="material-symbols-outlined text-3xl">workspace_premium</span>
                  </div>
                  <span className="inline-flex items-center text-[11px] font-bold text-[#8A5A0A] bg-[#FAF3E0] border border-[#D4A346]/35 px-3 py-1 rounded-full tracking-wide uppercase font-sans">
                    {t.home.pillar1Top}
                  </span>
                </div>
                <h3 className="font-bold text-[#003020] font-serif text-xl tracking-tight mb-2.5 group-hover:text-[#8A5A0A] transition-colors">
                  {t.home.pillar1Title}
                </h3>
                <p className="text-[#003020]/80 text-sm leading-relaxed font-light mb-6">
                  {t.home.pillar1Desc}
                </p>
              </div>
              <div className="pt-4 border-t border-neutral-100">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#FAF3E0]/70 border border-[#D4A346]/30 text-xs text-[#8A5A0A] font-semibold font-sans">
                  <span className="material-symbols-outlined text-base text-[#0F6F74] shrink-0">verified</span>
                  <span className="truncate">{t.home.pillar1Badge}</span>
                </div>
              </div>
            </div>

            {/* Card 2: Pavitra Safe Packaging */}
            <div className="bg-white rounded-3xl p-7 shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-[#0F6F74]/35 hover:border-[#0F6F74] ring-1 ring-[#0F6F74]/15 hover:ring-[#0F6F74]/35 flex flex-col justify-between group hover:-translate-y-1.5 relative">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#EAF5F2] to-[#DEF0EB] border border-[#0F6F74]/30 flex items-center justify-center text-[#0F6F74] shadow-xs group-hover:scale-105 group-hover:border-[#0F6F74]/60 transition-all duration-300">
                    <span className="material-symbols-outlined text-3xl">local_shipping</span>
                  </div>
                  <span className="inline-flex items-center text-[11px] font-bold text-[#0F6F74] bg-[#EAF5F2] border border-[#0F6F74]/30 px-3 py-1 rounded-full tracking-wide uppercase font-sans">
                    {t.home.pillar2Top}
                  </span>
                </div>
                <h3 className="font-bold text-[#003020] font-serif text-xl tracking-tight mb-2.5 group-hover:text-[#0F6F74] transition-colors">
                  {t.home.pillar2Title}
                </h3>
                <p className="text-[#003020]/80 text-sm leading-relaxed font-light mb-6">
                  {t.home.pillar2Desc}
                </p>
              </div>
              <div className="pt-4 border-t border-neutral-100">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#EAF5F2]/70 border border-[#0F6F74]/30 text-xs text-[#0F6F74] font-semibold font-sans">
                  <span className="material-symbols-outlined text-base text-[#0F6F74] shrink-0">inventory_2</span>
                  <span className="truncate">{t.home.pillar2Badge}</span>
                </div>
              </div>
            </div>

            {/* Card 3: Size Fit Guarantee (0 to 6 No.) */}
            <div className="bg-white rounded-3xl p-7 shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-[#D97706]/35 hover:border-[#B45309] ring-1 ring-[#D97706]/15 hover:ring-[#B45309]/30 flex flex-col justify-between group hover:-translate-y-1.5 relative">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFF5ED] to-[#FEEAD9] border border-[#D97706]/40 flex items-center justify-center text-[#D97706] shadow-xs group-hover:scale-105 group-hover:border-[#B45309]/60 transition-all duration-300">
                    <span className="material-symbols-outlined text-3xl">favorite</span>
                  </div>
                  <span className="inline-flex items-center text-[11px] font-bold text-[#B45309] bg-[#FFF5ED] border border-[#D97706]/35 px-3 py-1 rounded-full tracking-wide uppercase font-sans">
                    {t.home.pillar3Top}
                  </span>
                </div>
                <h3 className="font-bold text-[#003020] font-serif text-xl tracking-tight mb-2.5 group-hover:text-[#B45309] transition-colors">
                  {t.home.pillar3Title}
                </h3>
                <p className="text-[#003020]/80 text-sm leading-relaxed font-light mb-6">
                  {t.home.pillar3Desc}
                </p>
              </div>
              <div className="pt-4 border-t border-neutral-100">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#FFF5ED]/80 border border-[#D97706]/30 text-xs text-[#B45309] font-semibold font-sans">
                  <span className="material-symbols-outlined text-base text-[#D97706] shrink-0">published_with_changes</span>
                  <span className="truncate">{t.home.pillar3Badge}</span>
                </div>
              </div>
            </div>

            {/* Card 4: Devotee Care on Call & WhatsApp */}
            <div className="bg-white rounded-3xl p-7 shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-[#003020]/25 hover:border-[#003020] ring-1 ring-[#003020]/15 hover:ring-[#003020]/30 flex flex-col justify-between group hover:-translate-y-1.5 relative">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F0F5F2] to-[#E2EBE5] border border-[#003020]/20 flex items-center justify-center text-[#003020] shadow-xs group-hover:scale-105 group-hover:border-[#003020]/50 transition-all duration-300">
                    <span className="material-symbols-outlined text-3xl">support_agent</span>
                  </div>
                  <span className="inline-flex items-center text-[11px] font-bold text-[#003020] bg-[#F0F5F2] border border-[#003020]/25 px-3 py-1 rounded-full tracking-wide uppercase font-sans">
                    {t.home.pillar4Top}
                  </span>
                </div>
                <h3 className="font-bold text-[#003020] font-serif text-xl tracking-tight mb-2.5 group-hover:text-[#003020] transition-colors">
                  {t.home.pillar4Title}
                </h3>
                <p className="text-[#003020]/80 text-sm leading-relaxed font-light mb-6">
                  {t.home.pillar4Desc}
                </p>
              </div>
              <div className="pt-4 border-t border-neutral-100">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F0F5F2]/80 border border-[#003020]/20 text-xs text-[#003020] font-semibold font-sans">
                  <span className="material-symbols-outlined text-base text-[#25D366] shrink-0">chat</span>
                  <span className="truncate">{t.home.pillar4Badge}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. MOMENTS OF SEVA */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-12 bg-white rounded-[4rem] my-12 shadow-sm border border-[#003020]/5">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-serif text-[#003020] font-bold mb-4">{t.home.momentsOfSeva}</h2>
          <p className="text-[#003020]/60 text-lg">{t.home.momentsSubtitle}</p>
        </div>
        
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
           <div className="group relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-[#E6C16A]/20 bg-[#FBF7EE] shadow-md">
             <Image src="/images/devotional/kanhas_world.webp" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 group-active:scale-105" alt="Kanha's world of seva" width={900} height={700} sizes="(max-width: 768px) 100vw, 33vw" />
           </div>
           <div className="group relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-[#E6C16A]/20 bg-[#E8F3EE] shadow-md">
             <Image src="/images/devotional/bansuri.webp" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 group-active:scale-105" alt="Decorative bansuri" width={900} height={700} sizes="(max-width: 768px) 100vw, 33vw" />
           </div>
           <div className="group relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-[#E6C16A]/20 bg-[#FDE8DF] shadow-md">
             <Image src="/images/devotional/mala.webp" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 group-active:scale-105" alt="Decorative mala" width={900} height={700} sizes="(max-width: 768px) 100vw, 33vw" />
           </div>
        </div>
      </section>

      {/* 11. TESTIMONIALS */}
      <section className="py-24 bg-[#E8F3EE]">
         <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-center text-4xl md:text-5xl font-serif text-[#003020] font-bold mb-16">{t.home.lovedByDevotees}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                 { name: t.home.review1Name, text: t.home.review1Text },
                 { name: t.home.review2Name, text: t.home.review2Text },
                 { name: t.home.review3Name, text: t.home.review3Text }
               ].map((review, i) => (
                 <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm relative pt-12">
                   <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-[#E6C16A] rounded-full flex items-center justify-center text-white text-2xl font-serif">"</div>
                   <div className="flex gap-1 text-[#C88A20] mb-4 justify-center">
                     <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                     <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                     <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                     <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                     <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                   </div>
                   <p className="text-center text-[#003020]/80 italic mb-6">"{review.text}"</p>
                   <p className="text-center font-bold text-[#003020] font-serif">— {review.name}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* 12. FINAL CTA — VISUALLY MEMORABLE */}
      <section className="py-32 bg-[#003020] text-white relative overflow-hidden rounded-t-[4rem]">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10"></div>
        <Image src="/images/devotional/hero_krishna.webp" className="absolute inset-0 w-full h-full object-cover object-top opacity-30 blur-sm" alt="Background" width={1600} height={1000} sizes="100vw" />
        
        <div className="relative z-20 max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
          <span className="material-symbols-outlined text-[#E6C16A] text-6xl mb-6">favorite</span>
          <h2 className="text-5xl md:text-7xl font-serif font-bold mb-8 leading-tight">
            {isHindi ? (
              <>
                घर लाएं <br/> <span className="text-[#E6C16A] italic font-light">दिव्य आनंद एवं कृपा</span>
              </>
            ) : (
              <>
                Bring Home <br/> <span className="text-[#E6C16A] italic font-light">Divine Happiness</span>
              </>
            )}
          </h2>
          <p className="text-xl md:text-2xl text-white/80 font-serif italic mb-12">{t.home.ctaSubtitle}</p>
          <Link href="/search" className="bg-[#E6C16A] text-[#003020] px-12 py-5 rounded-full font-bold uppercase tracking-widest text-sm shadow-2xl hover:bg-white hover:-translate-y-1 transition-all duration-300">
            {t.home.ctaBtn}
          </Link>
        </div>
      </section>

    </div>
  );
}
