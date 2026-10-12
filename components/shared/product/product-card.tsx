import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";
import ProductCardCartButton from "./product-card-cart-button";
import WishlistButton from "./wishlist-button";
import ProductPrice from "./product-price";

const ProductCard = ({ product }: { product: Product }) => {
    const originalPrice = product.originalPrice ? product.originalPrice.toString() : product.price.toString();
    const discount = product.discountPercent || 0;

    return (
        <div className="bg-white rounded-[1.5rem] border border-outline-variant/40 hover:border-secondary/50 shadow-sm hover:shadow-xl hover:-translate-y-2 active:scale-[0.99] transition-all duration-500 group-hover:rotate-1 flex flex-col justify-between overflow-hidden group">
            <div className="relative bg-surface-container p-2 aspect-square overflow-hidden flex items-center justify-center">
                <span className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-primary-container text-surface font-label-sm text-label-sm rounded text-[10px]">
                    {product.category || "Featured"}
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
                    <span className="font-body-sm text-body-sm text-secondary font-semibold">{product.brand || "Madhav Shringaar"}</span>
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
                    <div className="flex items-baseline gap-2 my-1">
                        <ProductPrice value={product.price.toString()} className="text-primary text-base md:text-lg" />
                        {discount > 0 && (
                            <>
                                <span className="font-body-sm text-body-sm text-on-surface-variant line-through text-xs opacity-70">₹{originalPrice}</span>
                                <span className="font-label-sm text-label-sm text-emerald-800 text-[10px] font-bold bg-emerald-50 px-1.5 py-0.5 rounded-sm">{discount}% OFF</span>
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