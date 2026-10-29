import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";
import ProductCardCartButton from "./product-card-cart-button";
import WishlistButton from "./wishlist-button";
import ProductPrice from "./product-price";
import { getServerTranslations } from "@/lib/i18n/server";

const categoryTranslations: Record<string, string> = {
  'Poshak': 'पोशाक',
  'Mukut & Pagdi': 'मुकुट एवं पगड़ी',
  'Mukut': 'मुकुट',
  'Mukut & Bansuri': 'मुकुट एवं बाँसुरी',
  'Bansuri': 'बाँसुरी',
  'Jewellery': 'आभूषण',
  'Jewellery & Mala': 'आभूषण एवं माला',
  'Mala': 'माला',
  'Singhasan': 'सिंहासन',
  'Seva Essentials': 'सेवा सामग्री',
  'Festive Sets': 'उत्सव सेट',
  'Complete Shringar': 'संपूर्ण शृंगार',
};

const ProductCard = async ({ product }: { product: Product }) => {
  const { t, lang } = await getServerTranslations();
  const variants = Array.isArray((product as any).sizeVariants) ? (product as any).sizeVariants : [];
  const validVariantPrices = variants
    .map((v: any) => {
      const p = Number(v.price);
      const op = Number(v.originalPrice);
      return p > 0 ? p : (op > 0 ? op : 0);
    })
    .filter((n: number) => n > 0);

  const hasMultiPricing = validVariantPrices.length > 0;
  const minVariantPrice = hasMultiPricing ? Math.min(...validVariantPrices) : Number(product.price);
  const maxVariantPrice = hasMultiPricing ? Math.max(...validVariantPrices) : Number(product.price);
  const isPriceRange = hasMultiPricing && minVariantPrice < maxVariantPrice;

  const baseSellingPrice = minVariantPrice > 0 ? minVariantPrice : Number(product.price);
  const originalPrice = product.originalPrice ? product.originalPrice.toString() : product.price.toString();
  const numOriginalPrice = Number(originalPrice);

  // Actual discount calculation (no hardcoding)
  let discount = product.discountPercent || 0;
  if (!discount && numOriginalPrice > baseSellingPrice) {
    discount = Math.round(((numOriginalPrice - baseSellingPrice) / numOriginalPrice) * 100);
  }
  const hasDiscount = discount > 0 && numOriginalPrice > baseSellingPrice;

  // Actual reviews and rating (no hardcoding)
  const ratingValue = Number(product.rating) || 0;
  const numReviews = Number(product.numReviews) || 0;
  const hasReviews = numReviews > 0 && ratingValue > 0;

  const displayCategory = lang === 'hi' 
    ? (categoryTranslations[product.category] || product.category || t.common.featured)
    : (product.category || t.common.featured);

  const brandName = lang === 'hi' ? 'माधव शृंगार' : (product.brand || 'Madhav Shringaar');

  return (
    <>
      {/* =========================================================================
          1. MOBILE & IPAD VIEW (< 1024px) — Flipkart-Style Layout (Requested)
          ========================================================================= */}
      <div className="lg:hidden bg-white rounded-2xl border border-neutral-200/80 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden group">
        
        {/* Top Image Container — object-contain so NO deity crown or poshak is cropped */}
        <div className="relative bg-[#FAF8F5] aspect-[4/5] sm:aspect-square overflow-hidden flex items-center justify-center">
          {/* Category Pill */}
          <span className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-[#003020]/90 backdrop-blur-xs text-[#F3D98F] text-[10px] font-bold rounded shadow-2xs">
            {displayCategory}
          </span>

          {/* Circular Wishlist Heart: Floating top-right corner of image */}
          <WishlistButton 
            productId={product.id} 
            className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-white/95 backdrop-blur-xs shadow-xs hover:bg-white flex items-center justify-center text-neutral-500 hover:text-rose-600 active:scale-90 transition-all border border-neutral-200/60"
          />

          {/* Main Product Image (Uncropped) */}
          <Link href={`/product/${product.slug}`} className="w-full h-full flex items-center justify-center">
            <Image
              alt={product.name}
              className="w-full h-full object-contain object-center drop-shadow-2xs group-hover:scale-105 transition-transform duration-500 ease-out"
              src={product.images[0] || "/images/devotional/complete_shringar.webp"}
              width={400}
              height={400}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </Link>

          {/* Rating Badge: Floating bottom-left corner of image (Only when actual ratings exist) */}
          {hasReviews ? (
            <div className="absolute bottom-2 left-2 z-10 bg-white/95 backdrop-blur-xs px-1.5 py-0.5 rounded shadow-2xs border border-neutral-200/80 text-[10px] font-bold text-neutral-800 flex items-center gap-1">
              <span>{ratingValue.toFixed(1)}</span>
              <span className="text-emerald-700 text-[10px]">★</span>
              <span className="text-neutral-300 font-normal">|</span>
              <span className="text-neutral-500 font-normal text-[10px]">{numReviews}</span>
            </div>
          ) : (
            <div className="absolute bottom-2 left-2 z-10 bg-white/95 backdrop-blur-xs px-1.5 py-0.5 rounded shadow-2xs border border-neutral-200/80 text-[9px] font-semibold text-emerald-800">
              Pure Braj
            </div>
          )}
        </div>

        {/* Card Body (Below Image — Flipkart style) */}
        <div className="p-2.5 sm:p-3 flex flex-col gap-1.5 flex-1 justify-between">
          <div className="space-y-1">
            {/* Assured Brand Tag: ✓ Assured • Madhav Shringaar */}
            <div className="flex items-center gap-1 text-[11px] font-bold text-neutral-900">
              <span className="text-emerald-800 text-[9px] font-black bg-emerald-50 px-1 py-0.5 rounded border border-emerald-200/60 leading-none">
                ✓ Assured
              </span>
              <span className="truncate text-neutral-800 font-semibold">{brandName}</span>
            </div>

            {/* 2-Line Title */}
            <Link href={`/product/${product.slug}`} className="block">
              <h3 className="text-xs sm:text-sm text-neutral-700 font-normal leading-snug line-clamp-2 hover:text-[#003020] transition-colors min-h-[2rem]">
                {product.name}
              </h3>
            </Link>
          </div>

          <div className="space-y-1.5 pt-0.5">
            {/* Flipkart Price Format (Actual data only) */}
            <div className="flex items-baseline gap-1.5 flex-wrap">
              {hasDiscount && (
                <span className="text-emerald-700 font-bold text-xs sm:text-sm">
                  ↓{discount}%
                </span>
              )}
              {hasDiscount && !isPriceRange && (
                <span className="line-through text-neutral-400 text-xs">
                  ₹{numOriginalPrice.toFixed(0)}
                </span>
              )}
              <span className="text-neutral-900 font-extrabold text-sm sm:text-base">
                {isPriceRange ? `₹${minVariantPrice} – ₹${maxVariantPrice}` : `₹${baseSellingPrice}`}
              </span>
            </div>

            {/* Delivery Badge (Actual data only) */}
            <div className="flex items-center justify-between text-[10px] text-neutral-500 border-t border-neutral-100 pt-1">
              <span>
                Delivery in <strong className="text-neutral-800 font-semibold">2-4 days</strong>
              </span>
              <span className="text-[10px] text-emerald-800 font-semibold">
                {baseSellingPrice >= 999 ? 'Free Delivery' : 'Free >₹999'}
              </span>
            </div>

            {/* Cart Button */}
            <ProductCardCartButton
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price.toString(),
                images: product.images,
                sizes: product.sizes,
                sizeVariants: (product as any).sizeVariants,
                stock: product.stock,
              }}
            />
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. DESKTOP VIEW (>= 1024px) — Original Madhav Shringaar Card Design
          ========================================================================= */}
      <div className="hidden lg:flex bg-white rounded-[1.5rem] border border-outline-variant/40 hover:border-secondary/50 shadow-sm hover:shadow-xl hover:-translate-y-2 active:scale-[0.99] transition-all duration-500 group-hover:rotate-1 flex-col justify-between overflow-hidden group">
        <div className="relative bg-[#FAF8F5] aspect-square overflow-hidden flex items-center justify-center">
          <span className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-primary-container text-surface font-label-sm text-label-sm rounded text-[10px]">
            {displayCategory}
          </span>
          <WishlistButton productId={product.id} />
          <Link href={`/product/${product.slug}`} className="w-full h-full flex items-center justify-center">
            <Image
              alt={product.name}
              className="w-full h-full object-contain group-hover:scale-[1.03] group-active:scale-[1.03] transition-transform duration-700 ease-out"
              src={product.images[0] || "/images/devotional/complete_shringar.webp"}
              width={400}
              height={400}
              sizes="25vw"
            />
          </Link>
        </div>
        <div className="p-3 flex flex-col gap-1.5 flex-1 justify-between">
          <div>
            <span className="font-body-sm text-body-sm text-secondary font-semibold">{brandName}</span>
            <Link href={`/product/${product.slug}`}>
              <h3 className="font-title-lg text-title-lg text-primary text-sm font-bold leading-tight group-hover:text-secondary transition-colors line-clamp-1">
                {product.name}
              </h3>
            </Link>
            <div className="flex items-center gap-1 text-xs text-amber-600 mt-1">
              <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="font-bold">{ratingValue}</span>
              <span className="text-on-surface-variant text-[11px]">({numReviews})</span>
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2 my-1 flex-wrap">
              {isPriceRange ? (
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="text-primary text-base md:text-lg font-bold">₹{minVariantPrice} – ₹{maxVariantPrice}</span>
                  {product.sizes && product.sizes.length > 0 && (
                    <span className="text-[10px] text-neutral-600 bg-amber-50/80 border border-amber-200/60 font-semibold px-1.5 py-0.5 rounded">
                      {lang === 'hi' ? `${product.sizes.length} साइज़` : `${product.sizes.length} sizes`}
                    </span>
                  )}
                </div>
              ) : (
                <ProductPrice value={baseSellingPrice.toString()} className="text-primary text-base md:text-lg" />
              )}
              {hasDiscount && (
                <>
                  {!isPriceRange && (
                    <span className="font-body-sm text-body-sm text-on-surface-variant line-through text-xs opacity-70">₹{originalPrice}</span>
                  )}
                  <span className="font-label-sm text-label-sm text-emerald-800 text-[10px] font-bold bg-emerald-50 px-1.5 py-0.5 rounded-sm">
                    {isPriceRange ? `${lang === 'hi' ? 'तक' : 'Up to'} ${discount}% ${t.common.off}` : `${discount}% ${t.common.off}`}
                  </span>
                </>
              )}
            </div>
            <ProductCardCartButton
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price.toString(),
                images: product.images,
                sizes: product.sizes,
                sizeVariants: (product as any).sizeVariants,
                stock: product.stock,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCard;