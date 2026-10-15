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
    const discount = product.discountPercent || 0;

    const displayCategory = lang === 'hi' 
      ? (categoryTranslations[product.category] || product.category || t.common.featured)
      : (product.category || t.common.featured);

    const brandName = lang === 'hi' ? 'माधव शृंगार' : (product.brand || 'Madhav Shringaar');

    return (
        <div className="bg-white rounded-[1.5rem] border border-outline-variant/40 hover:border-secondary/50 shadow-sm hover:shadow-xl hover:-translate-y-2 active:scale-[0.99] transition-all duration-500 group-hover:rotate-1 flex flex-col justify-between overflow-hidden group">
            <div className="relative bg-surface-container p-2 aspect-square overflow-hidden flex items-center justify-center">
                <span className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-primary-container text-surface font-label-sm text-label-sm rounded text-[10px]">
                    {displayCategory}
                </span>
                <WishlistButton productId={product.id} />
                <Link href={`/product/${product.slug}`} className="w-full h-full block">
                    <Image
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-[1.03] group-active:scale-[1.03] transition-transform duration-700 ease-out"
                        src={product.images[0] || "https://placehold.co/400x400/png"}
                        width={400}
                        height={400}
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
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
                        <span className="font-bold">{Number(product.rating)}</span>
                        <span className="text-on-surface-variant text-[11px]">({product.numReviews})</span>
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
                        {discount > 0 && (
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
    );
};

export default ProductCard;