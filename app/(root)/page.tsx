import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/shared/product/product-card';
import SizeSelector from '@/components/shared/product/size-selector';
import { getAllProducts, getLatestProducts } from '@/lib/actions/product.action';

const productSizes = new Set(['0', '1', '2', '3', '4', '5', '6', '7']);

export default async function Homepage({
  searchParams,
}: {
  searchParams: Promise<{ size?: string }>;
}) {
  const { size } = await searchParams;
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
      let newImg = '/images/devotional/complete_shringar.jpg';
      const nameLower = p.name ? p.name.toLowerCase() : '';
      if (nameLower.includes('poshak') || p.category === 'Poshak') newImg = '/images/devotional/poshak.jpg';
      else if (nameLower.includes('mukut') || p.category === 'Mukut') newImg = '/images/devotional/mukut.jpg';
      else if (nameLower.includes('bansuri') || p.category === 'Bansuri') newImg = '/images/devotional/bansuri.jpg';
      else if (nameLower.includes('mala') || p.category === 'Mala') newImg = '/images/devotional/mala.jpg';
      else if (nameLower.includes('jewel') || p.category === 'Jewellery') newImg = '/images/devotional/jewellery.jpg';
      else if (nameLower.includes('aasan') || p.category === 'Aasan') newImg = '/images/devotional/aasan.jpg';
      
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
              <span className="font-bold text-xs uppercase tracking-[0.2em] text-[#003020]">Divine Essentials</span>
            </div>
            
            <h1 className="text-6xl md:text-[6.5rem] text-[#003020] font-bold tracking-tight leading-[0.95] font-serif mb-6 relative z-10 drop-shadow-sm">
              Adorn Your <br />
              <span className="inline-block transform -rotate-3 text-[#0F6F74] italic font-medium bg-[#E6C16A]/20 px-4 rounded-3xl mt-2">Beloved</span> Kanha
            </h1>
            
            <p className="text-xl md:text-2xl text-[#003020]/70 max-w-md font-serif mb-10 pl-6 border-l-4 border-[#C88A20] rounded-sm">
              Beautiful Poshak & Shringar, Chosen With Love.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link href="/search?category=Poshak" className="bg-[#003020] px-10 py-5 rounded-[2rem] text-white font-bold shadow-xl shadow-[#003020]/20 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 text-center uppercase tracking-widest text-sm border-2 border-[#003020]">
                Shop Poshak
              </Link>
              <Link href="/search?category=Mukut" className="bg-white px-10 py-5 rounded-[2rem] text-[#003020] font-bold shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300 text-center uppercase tracking-widest text-sm border-2 border-[#E6C16A]/30">
                Explore Shringar
              </Link>
            </div>
          </div>

          {/* RIGHT: Floating Artwork & Organic Layout */}
          <div className="lg:col-span-7 relative h-[550px] lg:h-[750px] w-full flex justify-center lg:justify-end items-center mt-10 lg:mt-0">
            {/* Organic Blob Background for Image */}
            <div className="absolute w-[90%] h-[90%] bg-gradient-to-tr from-[#E6C16A] to-[#FDE8DF] rounded-[40%_60%_70%_30%/40%_50%_60%_50%] animate-[spin_30s_linear_infinite] opacity-50 blur-xl"></div>
            <div className="absolute w-[80%] h-[80%] bg-[#0F6F74] rounded-[60%_40%_30%_70%/60%_30%_70%_40%] animate-[spin_25s_linear_infinite_reverse] opacity-20 blur-2xl"></div>

            {/* The Main Artwork - Breaking out slightly */}
            <div className="relative w-full lg:w-[110%] h-[110%] ml-auto z-20 flex items-center justify-center transform lg:translate-x-12">
              <div className="w-[85%] h-[85%] relative rounded-[3rem] lg:rounded-[6rem] overflow-visible shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700 bg-white p-3 border-4 border-white/60">
                <img 
                  src="/images/devotional/hero_krishna.jpg" 
                  alt="Divine Kanha Artwork" 
                  className="w-full h-full object-cover rounded-[2.5rem] lg:rounded-[5.5rem]"
                />
                
                {/* Floating Detail Elements bursting from the frame */}
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white rounded-full flex items-center justify-center p-2 shadow-xl border-4 border-[#FBF7EE] transform -rotate-12 z-30">
                   <img src="/images/devotional/mukut.jpg" className="w-full h-full object-cover rounded-full" alt="Mukut Detail" />
                </div>
                
                <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#FDFBF7] rounded-[2rem] flex items-center justify-center p-2 shadow-lg border-2 border-[#E6C16A]/50 transform rotate-12 z-30">
                   <img src="/images/devotional/bansuri.jpg" className="w-full h-full object-cover rounded-[1.5rem]" alt="Bansuri Detail" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. DISCOVER KANHA — PLAYFUL ASYMMETRIC CATEGORY COMPOSITION */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-12 relative z-20 -mt-10">
        <div className="text-center mb-16">
          <span className="text-[#C88A20] font-bold tracking-[0.2em] uppercase text-xs">Curated Seva</span>
          <h2 className="text-5xl md:text-6xl font-bold text-[#003020] font-serif mt-2">Discover <span className="italic text-[#0F6F74] font-light">Shringar</span></h2>
        </div>
        
        <div className="grid grid-cols-2 gap-4 md:h-[560px] md:grid-cols-12 md:grid-rows-3 md:gap-5">
           <Link href="/search?category=Poshak" className="group relative col-span-2 h-[360px] overflow-hidden rounded-[2rem] border-4 border-white bg-white shadow-xl md:col-span-8 md:row-span-3 md:h-full md:rounded-[2.5rem]">
             <img src="/images/devotional/poshak.jpg" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Poshak" />
             <div className="absolute inset-0 bg-gradient-to-t from-[#003020]/80 via-transparent to-transparent"></div>
             <div className="absolute bottom-6 left-6 text-white sm:bottom-8 sm:left-8">
               <h3 className="text-3xl font-serif font-bold sm:text-4xl">Poshak</h3>
               <span className="mt-2 inline-block rounded-full bg-[#E6C16A] px-3 py-1 text-xs font-bold text-[#003020]">Bestsellers</span>
             </div>
           </Link>

           <div className="col-span-2 grid grid-cols-3 gap-3 md:col-span-4 md:row-span-3 md:grid-cols-1 md:grid-rows-3 md:gap-5">
             <Link href="/search?category=Mukut" className="group relative aspect-square overflow-hidden rounded-[1.5rem] border-4 border-white bg-[#E8F3EE] shadow-lg transition-transform duration-300 hover:-translate-y-1 md:aspect-auto md:min-h-0 md:rounded-[1.75rem]">
               <img src="/images/devotional/mukut.jpg" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Mukut" />
               <div className="absolute inset-0 bg-gradient-to-br from-[#0F6F74]/70 to-transparent"></div>
               <div className="absolute left-5 top-5 text-white sm:left-6 sm:top-6">
                 <h3 className="text-xl font-serif font-bold sm:text-2xl">Mukut</h3>
               </div>
             </Link>

             <Link href="/search?category=Bansuri" className="group relative aspect-square overflow-hidden rounded-[1.5rem] border-4 border-white bg-[#FDE8DF] shadow-lg transition-transform duration-300 hover:-translate-y-1 md:aspect-auto md:min-h-0 md:rounded-[1.75rem]">
               <img src="/images/devotional/bansuri.jpg" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Bansuri" />
               <div className="absolute inset-0 bg-gradient-to-t from-[#003020]/75 to-transparent"></div>
               <div className="absolute bottom-4 right-4 text-right text-white sm:bottom-6 sm:right-6">
                 <h3 className="text-xl font-serif font-bold sm:text-2xl">Bansuri</h3>
               </div>
             </Link>

             <Link href="/search?category=Jewellery" className="group relative flex aspect-square items-center justify-center overflow-hidden rounded-[1.5rem] border-4 border-white bg-[#FBF7EE] shadow-lg transition-transform duration-300 hover:-translate-y-1 md:aspect-auto md:min-h-0 md:rounded-[1.75rem]">
               <img src="/images/devotional/jewellery.jpg" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Jewellery" />
               <div className="absolute inset-0 bg-[#C88A20]/20 transition-colors group-hover:bg-transparent"></div>
               <h3 className="absolute rounded-full bg-[#003020]/60 px-3 py-2 text-center font-serif text-base font-bold text-white backdrop-blur-sm sm:px-4 sm:text-xl">Jewels</h3>
             </Link>
           </div>
        </div>
      </section>

      {/* 3. EDITORIAL PRODUCT CAMPAIGN - SIGNATURE POSHAK */}
      <section className="py-24 my-10 bg-[#003020] text-white relative overflow-hidden rounded-[3rem] mx-4 md:mx-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0F6F74] rounded-full blur-[100px] opacity-40 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#C88A20] rounded-full blur-[100px] opacity-30 -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative z-10">
           <div className="relative group">
              <div className="w-full h-[400px] md:h-[600px] bg-white p-3 rounded-t-[10rem] rounded-b-[2rem] transform -rotate-3 transition-transform group-hover:rotate-0 duration-500 shadow-2xl">
                <img src="/images/devotional/poshak.jpg" className="w-full h-full object-cover rounded-t-[9.5rem] rounded-b-[1.5rem]" alt="Signature Poshak" />
              </div>
              <div className="absolute -right-6 top-1/4 bg-[#E6C16A] text-[#003020] w-24 h-24 rounded-full flex items-center justify-center font-bold text-lg rotate-12 shadow-lg border-4 border-[#003020]">
                 New!
              </div>
           </div>
           
           <div className="flex flex-col items-start justify-center">
              <span className="material-symbols-outlined text-[#E6C16A] text-5xl mb-6">workspace_premium</span>
              <h2 className="text-5xl md:text-7xl font-serif font-bold leading-tight mb-6">
                Signature <br /><span className="text-[#E6C16A] italic font-light">Poshak</span>
              </h2>
              <p className="text-lg md:text-xl text-white/80 font-light mb-10 border-l-4 border-[#0F6F74] pl-6">
                Handcrafted by master artisans. Every stitch is infused with pure devotion. Designed perfectly for your beloved Laddu Gopal.
              </p>
              <Link href="/search?category=Poshak" className="bg-[#E6C16A] text-[#003020] px-10 py-4 rounded-full font-bold shadow-lg hover:bg-white transition-colors uppercase tracking-widest text-sm">
                Explore The Collection
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
               <img src="/images/devotional/kanhas_world.jpg" className="w-full h-full object-cover rounded-full" alt="Kanha's World Art" />
             </div>
             
             <div className="absolute bottom-10 -right-4 w-40 h-40 bg-[#E8F3EE] rounded-full p-2 shadow-xl border-4 border-white z-20">
               <img src="/images/devotional/mala.jpg" className="w-full h-full object-cover rounded-full" alt="Detail" />
             </div>
          </div>
          
          <div className="order-1 lg:order-2 space-y-6 text-center lg:text-left">
            <span className="text-[#0F6F74] font-bold tracking-[0.2em] uppercase text-sm border-b-2 border-[#0F6F74] pb-1">The Divine Details</span>
            <h2 className="text-6xl md:text-7xl font-serif leading-none text-[#003020] font-bold mb-4">
              Kanha's <br/> <span className="text-[#C88A20] italic">Little World</span>
            </h2>
            <p className="text-2xl font-serif italic text-[#003020]/70">“Where every little detail is chosen with love.”</p>
            <p className="text-lg leading-relaxed text-[#003020]/80 mt-6 max-w-lg mx-auto lg:mx-0">
              Enter a world where devotion takes physical form. The gentle curve of His bansuri, the vibrant feathers of His mukut, the delicate embroidery of His poshak—everything is curated to resonate with the purest love.
            </p>
            <button className="mt-8 bg-[#0F6F74] text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest text-sm shadow-xl hover:-translate-y-1 transition-transform">
              Read Our Story
            </button>
          </div>
          
        </div>
      </section>

      {/* 5. PRODUCT GRID — ECOMMERCE FOCUS */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-12 bg-white rounded-[3rem] shadow-sm my-12 border border-[#003020]/5">
        <div className="flex flex-col items-center text-center mb-16">
          <span className="material-symbols-outlined text-[#C88A20] text-4xl mb-4">shopping_bag</span>
          <h2 className="text-4xl md:text-5xl font-serif text-[#003020] font-bold mb-4">Featured Collection</h2>
          <p className="text-[#003020]/60 max-w-2xl text-lg">Real Madhav Shringaar products, ready for your beloved Kanha.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {latestProducts && latestProducts.length > 0 ? (
            latestProducts.slice(0, 4).map((product: any) => (
                <div key={product.id} className="w-full transform hover:-translate-y-2 transition-transform duration-300">
                  <ProductCard product={product} />
                </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-on-surface-variant bg-[#FBF7EE] rounded-2xl">
               <span className="material-symbols-outlined text-4xl mb-2 opacity-50">inventory_2</span>
               <p>No featured products available.</p>
            </div>
          )}
        </div>
        
        <div className="mt-16 text-center">
           <Link href="/search" className="inline-block border-2 border-[#003020] text-[#003020] px-10 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-[#003020] hover:text-white transition-colors shadow-sm">
              View Entire Collection
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
                Complete <br/>
                <span className="italic text-[#C88A20] font-light">Shringar</span>
              </h2>
              <p className="text-xl text-[#003020]/80 font-serif italic mb-10 bg-white/50 inline-block px-6 py-2 rounded-full border border-white">
                “Everything your beloved Kanha needs, thoughtfully brought together.”
              </p>
              
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-10">
                 <span className="bg-white text-[#003020] font-bold px-4 py-2 rounded-full shadow-sm">Poshak</span>
                 <span className="bg-white text-[#003020] font-bold px-4 py-2 rounded-full shadow-sm">Mukut</span>
                 <span className="bg-white text-[#003020] font-bold px-4 py-2 rounded-full shadow-sm">Mala</span>
                 <span className="bg-white text-[#003020] font-bold px-4 py-2 rounded-full shadow-sm">Bansuri</span>
                 <span className="bg-white text-[#003020] font-bold px-4 py-2 rounded-full shadow-sm">Kangan</span>
              </div>
              
              <Link href="/search?category=Complete Shringar" className="inline-block bg-[#003020] text-white px-12 py-5 rounded-full font-bold shadow-xl hover:-translate-y-1 transition-transform uppercase tracking-widest text-sm">
                Explore Combos
              </Link>
           </div>
           
           <div className="order-1 lg:order-2">
              <div className="relative w-[100%] aspect-[4/3] bg-white rounded-[4rem_1rem_4rem_1rem] shadow-2xl p-4 transform rotate-3 hover:rotate-0 transition-transform duration-500 border-8 border-white/60">
                 <img src="/images/devotional/complete_shringar.jpg" className="w-full h-full object-cover rounded-[3rem_0.5rem_3rem_0.5rem]" alt="Complete Shringar Arrangement" />
                 
                 {/* Floating price badge */}
                 <div className="absolute -bottom-6 -left-6 bg-[#0F6F74] text-white p-6 rounded-full shadow-xl rotate-[-15deg] font-serif font-bold text-xl border-4 border-white">
                    Matching<br/>Sets!
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 7. SHOP BY SIZE — ELEGANT INTERACTIVE */}
      <section className="relative overflow-hidden bg-[#E8F3EE] py-12 sm:py-16">
        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-6 rounded-[2rem] border border-[#E6C16A]/30 bg-[#FDFBF7] p-4 shadow-[0_18px_45px_-30px_rgba(0,48,32,0.4)] sm:p-6 lg:flex-row lg:gap-8 lg:p-7">

          <div className="w-full lg:w-[27%] lg:shrink-0">
            <div className="group relative mx-auto aspect-[16/9] w-full max-w-sm overflow-hidden rounded-[1.5rem] border-2 border-white bg-[#FBF7EE] shadow-md ring-1 ring-[#E6C16A]/50 lg:aspect-[4/5] lg:max-w-none">
               <img src="/images/devotional/aasan.jpg" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Laddu Gopal seated on an aasan" />
               <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#003020]/85 via-[#003020]/30 to-transparent px-4 pb-4 pt-10">
                 <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#F3D98F]">A thoughtful guide</span>
                 <p className="mt-1 font-serif text-base font-semibold text-white">Find his perfect fit</p>
               </div>
            </div>
          </div>
          
          <div className="w-full min-w-0 lg:flex-1">
            <div className="mb-4 text-center lg:text-left">
              <span className="mb-1 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C88A20]">
                <span className="material-symbols-outlined text-lg text-[#0F6F74]">straighten</span>
                The perfect fit
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#003020] sm:text-3xl">Find the Perfect Fit</h2>
              <p className="mx-auto mt-1 max-w-2xl text-xs leading-relaxed text-[#003020]/70 sm:text-sm lg:mx-0">Select your Laddu Gopal Ji&apos;s size number to view tailor-made Shringaar.</p>
            </div>
            <div className="rounded-[1.5rem] border border-[#E6C16A]/30 bg-[#FBF7EE] p-2.5 sm:p-3">
               <SizeSelector selectedSize={selectedSize} />
            </div>
          </div>
          
        </div>
      </section>
      
      {/* 8. FESTIVAL / OCCASION CAMPAIGN */}
      <section className="py-24 bg-[#0F6F74] text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-6xl font-serif font-bold mb-12">Seva For Every Occasion</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Daily Seva', img: '/images/devotional/poshak.jpg', color: 'bg-[#003020]' }, 
              { name: 'Janmashtami', img: '/images/devotional/hero_krishna.jpg', color: 'bg-[#C88A20]' }, 
              { name: 'Festivals', img: '/images/devotional/mukut.jpg', color: 'bg-[#E6C16A]' }, 
              { name: 'Special Darshan', img: '/images/devotional/complete_shringar.jpg', color: 'bg-[#FDE8DF]' }
            ].map((occ, i) => (
              <Link key={occ.name} href={`/search?q=${occ.name}`} className="group block relative h-64 md:h-80 rounded-[2rem] overflow-hidden shadow-lg hover:-translate-y-3 transition-all duration-300">
                <img src={occ.img} className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" alt={occ.name} />
                <div className={`absolute inset-0 bg-gradient-to-t ${occ.color}/90 via-transparent to-transparent`}></div>
                <div className="absolute bottom-6 left-0 w-full text-center px-4">
                   <h3 className="text-white font-bold font-serif text-2xl drop-shadow-md">{occ.name}</h3>
                   <span className="text-white/80 text-sm mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Explore </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 9. WHY YOU'LL LOVE US — PLAYFUL BENEFITS */}
      <section className="py-24 bg-[#FBF7EE]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow text-center border-b-4 border-[#0F6F74]">
            <div className="w-20 h-20 mx-auto bg-[#E8F3EE] rounded-full flex items-center justify-center text-[#0F6F74] mb-6 shadow-inner">
               <span className="material-symbols-outlined text-4xl">local_shipping</span>
            </div>
            <h4 className="font-bold text-[#003020] font-serif text-2xl mb-2">Fast & Secure</h4>
            <p className="text-[#003020]/70 font-light">Safe delivery right to your doorstep</p>
          </div>
          
          <div className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow text-center border-b-4 border-[#C88A20]">
            <div className="w-20 h-20 mx-auto bg-[#FDFBF7] rounded-full flex items-center justify-center text-[#C88A20] mb-6 shadow-inner">
               <span className="material-symbols-outlined text-4xl">workspace_premium</span>
            </div>
            <h4 className="font-bold text-[#003020] font-serif text-2xl mb-2">Authentic Quality</h4>
            <p className="text-[#003020]/70 font-light">Premium craftsmanship you can trust</p>
          </div>
          
          <div className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow text-center border-b-4 border-[#E6C16A]">
            <div className="w-20 h-20 mx-auto bg-[#FDE8DF] rounded-full flex items-center justify-center text-[#E6C16A] mb-6 shadow-inner">
               <span className="material-symbols-outlined text-4xl">favorite</span>
            </div>
            <h4 className="font-bold text-[#003020] font-serif text-2xl mb-2">Made With Love</h4>
            <p className="text-[#003020]/70 font-light">Created with devotion for Kanha</p>
          </div>
          
          <div className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow text-center border-b-4 border-[#003020]">
            <div className="w-20 h-20 mx-auto bg-gray-50 rounded-full flex items-center justify-center text-[#003020] mb-6 shadow-inner">
               <span className="material-symbols-outlined text-4xl">support_agent</span>
            </div>
            <h4 className="font-bold text-[#003020] font-serif text-2xl mb-2">Devotee Care</h4>
            <p className="text-[#003020]/70 font-light">We are always here to help you</p>
          </div>
        </div>
      </section>

      {/* 10. MOMENTS OF SEVA */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-12 bg-white rounded-[4rem] my-12 shadow-sm border border-[#003020]/5">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-serif text-[#003020] font-bold mb-4">Moments of Seva</h2>
          <p className="text-[#003020]/60 text-lg">Glimpses of devotion from our artisans and devotees.</p>
        </div>
        
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
           <div className="group relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-[#E6C16A]/20 bg-[#FBF7EE] shadow-md">
             <img src="/images/devotional/kanhas_world.jpg" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Kanha's world of seva" />
           </div>
           <div className="group relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-[#E6C16A]/20 bg-[#E8F3EE] shadow-md">
             <img src="/images/devotional/bansuri.jpg" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Decorative bansuri" />
           </div>
           <div className="group relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-[#E6C16A]/20 bg-[#FDE8DF] shadow-md">
             <img src="/images/devotional/mala.jpg" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Decorative mala" />
           </div>
        </div>
      </section>

      {/* 11. TESTIMONIALS */}
      <section className="py-24 bg-[#E8F3EE]">
         <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-center text-4xl md:text-5xl font-serif text-[#003020] font-bold mb-16">Loved by Devotees</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                 { name: 'Radhika S.', text: 'The poshak is absolutely stunning. The embroidery work is so detailed. My Kanha looks divine!' },
                 { name: 'Meera V.', text: 'I ordered the complete shringar set for Janmashtami. The packaging was beautiful and the quality is premium.' },
                 { name: 'Ananya D.', text: 'Beautiful mukut and bansuri. Exactly what I was looking for. Will definitely shop again for daily seva items.' }
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
        <img src="/images/devotional/hero_krishna.jpg" className="absolute inset-0 w-full h-full object-cover object-top opacity-30 blur-sm" alt="Background" />
        
        <div className="relative z-20 max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
          <span className="material-symbols-outlined text-[#E6C16A] text-6xl mb-6">favorite</span>
          <h2 className="text-5xl md:text-7xl font-serif font-bold mb-8 leading-tight">
            Bring Home <br/> <span className="text-[#E6C16A] italic font-light">Divine Happiness</span>
          </h2>
          <p className="text-xl md:text-2xl text-white/80 font-serif italic mb-12">Make every moment of seva special.</p>
          <Link href="/search" className="bg-[#E6C16A] text-[#003020] px-12 py-5 rounded-full font-bold uppercase tracking-widest text-sm shadow-2xl hover:bg-white hover:-translate-y-1 transition-all duration-300">
            Shop Madhav Shringaar
          </Link>
        </div>
      </section>

    </div>
  );
}
