import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";
import ProductCardCartButton from "./product-card-cart-button";
import WishlistButton from "./wishlist-button";
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
  const discount = product.discountPercent || 0;

  const displayCategory = lang === 'hi' 
    ? (categoryTranslations[product.category] || product.category || t.common.featured)
    : (product.category || t.common.featured);

  const brandName = lang === 'hi' ? 'माधव शृंगार' : (product.brand || 'Madhav Shringaar');
  const ratingNum = Number(product.rating) > 0 ? Number(product.rating).toFixed(1) : '4.8';
  const reviewsCount = Number(product.numReviews) > 0 ? product.numReviews : 14;

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/80 hover:border-neutral-300 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      
      {/* Top Image Container — object-contain so NO poshak/mukut is cropped */}
      <div className="relative bg-[#FAF8F5] aspect-[4/5] sm:aspect-square overflow-hidden flex items-center justify-center p-2.5 sm:p-3">
        {/* Category Pill / Braj Badge */}
        <span className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 bg-[#003020]/90 backdrop-blur-xs text-[#F3D98F] text-[10px] font-bold rounded shadow-2xs">
          {displayCategory}
        </span>

        {/* Floating Wishlist Heart Button (Flipkart style) */}
        <WishlistButton 
          productId={product.id} 
          className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/95 backdrop-blur-xs shadow-xs hover:bg-white flex items-center justify-center text-neutral-500 hover:text-rose-600 active:scale-90 transition-all border border-neutral-200/60"
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

        {/* Bottom-left Rating Badge (Exact Flipkart style: 4.8 ★ | 14) */}
        <div className="absolute bottom-2 left-2 z-10 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-md shadow-2xs border border-neutral-200/80 text-[10px] sm:text-[11px] font-bold text-neutral-800 flex items-center gap-1">
          <span>{ratingNum}</span>
          <span className="text-emerald-700 text-[11px]">★</span>
          <span className="text-neutral-300 font-normal">|</span>
          <span className="text-neutral-500 font-normal text-[10px]">{reviewsCount}</span>
        </div>
      </div>

      {/* Card Body (Below Image — Flipkart style) */}
      <div className="p-3 sm:p-3.5 flex flex-col gap-1.5 flex-1 justify-between">
        <div className="space-y-1">
          {/* Assured Brand Line */}
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-900">
            <span className="text-emerald-800 text-[10px] font-black bg-emerald-50 px-1 py-0.5 rounded border border-emerald-200/60 leading-none">
              ✓ Assured
            </span>
            <span className="truncate text-neutral-800 font-semibold">{brandName}</span>
          </div>

          {/* Product Name (2-line clean font) */}
          <Link href={`/product/${product.slug}`} className="block">
            <h3 className="text-xs sm:text-sm text-neutral-700 font-normal leading-snug line-clamp-2 hover:text-[#003020] transition-colors min-h-[2.25rem]">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="space-y-2 pt-1">
          {/* Price Row (Flipkart exact style from Image 1) */}
          <div className="flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
            {discount > 0 && (
              <span className="text-emerald-700 font-bold text-xs sm:text-sm">
                ↓{discount}%
              </span>
            )}
            {discount > 0 && originalPrice && Number(originalPrice) > baseSellingPrice && !isPriceRange && (
              <span className="line-through text-neutral-400 text-xs">
                ₹{originalPrice}
              </span>
            )}
            <span className="text-neutral-900 font-extrabold text-sm sm:text-base">
              {isPriceRange ? `₹${minVariantPrice} – ₹${maxVariantPrice}` : `₹${baseSellingPrice}`}
            </span>
          </div>

          {/* Delivery & Size Line */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-neutral-500 border-t border-neutral-100 pt-1.5">
            <span>
              Get in <strong className="text-neutral-800 font-semibold">2-4 days</strong>
            </span>
            {product.sizes && product.sizes.length > 0 ? (
              <span className="text-[10px] text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded font-semibold border border-amber-200/50">
                {product.sizes.length} sizes
              </span>
            ) : (
              <span className="text-[10px] text-emerald-800 font-medium">Free &gt;₹999</span>
            )}
          </div>

          {/* Quick Add To Devotional Cart Button */}
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
  );
};

export default ProductCard;