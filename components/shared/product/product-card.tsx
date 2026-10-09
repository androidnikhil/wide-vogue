import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";
import AddToCart from "./add-to-cart";
import WishlistButton from "./wishlist-button";
import ProductPrice from "./product-price";

const ProductCard = ({ product }: { product: Product }) => {
    const originalPrice = product.originalPrice ? product.originalPrice.toString() : product.price.toString();
    const discount = product.discountPercent || 0;

    return (
        <div className="bg-white rounded-[1.5rem] border border-outline-variant/40 hover:border-secondary/50 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group-hover:rotate-1 flex flex-col justify-between overflow-hidden group">
            <div className="relative bg-surface-container p-2 aspect-square overflow-hidden flex items-center justify-center">
                <span className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-primary-container text-surface font-label-sm text-label-sm rounded text-[10px]">
                    {product.category || "Featured"}
                </span>
                <WishlistButton productId={product.id} />
                <Link href={`/product/${product.slug}`} className="w-full h-full">
                    <img
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                        src={product.images[0] || "https://placehold.co/400x400/png"}
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
                                <span className="font-body-sm text-body-sm text-on-surface-variant line-through text-xs font-serif opacity-70">₹{originalPrice}</span>
                                <span className="font-label-sm text-label-sm text-emerald-800 text-[10px] font-bold bg-emerald-50 px-1.5 py-0.5 rounded-sm">{discount}% OFF</span>
                            </>
                        )}
                    </div>
                    {product.stock > 0 ? (
                        product.sizes && product.sizes.length > 0 ? (
                            <Link href={`/product/${product.slug}`} className="w-full py-1.5 gold-gradient-btn text-primary-container font-label-md text-label-md rounded font-bold hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-1">
                                <span className="material-symbols-outlined text-sm">straighten</span>
                                Select Size
                            </Link>
                        ) : (
                            <AddToCart 
                                item={{
                                    productId: product.id,
                                    name: product.name,
                                    slug: product.slug,
                                    price: product.price.toString(),
                                    qty: 1,
                                    image: product.images[0] || "https://placehold.co/400x400/png"
                                }}
                            />
                        )
                    ) : (
                        <button disabled className="w-full py-1.5 bg-outline-variant text-on-surface-variant font-label-md text-label-md rounded font-bold opacity-70 cursor-not-allowed flex items-center justify-center gap-1">
                            Out of Stock
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;