"use client";

import { Button } from "@/components/ui/button";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.action";
import { Cart, CartItem } from "@/types";
import { Plus, Minus, Loader2, ShoppingBag, Ruler } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/i18n/language-context";
import Link from "next/link";
import WishlistButton from "./wishlist-button";

export interface SizeVariantItem {
  size: string;
  price: string | number;
  originalPrice?: string | number;
  stock?: number;
}

export interface AddToCartProps {
  cart?: Cart;
  item: CartItem;
  sizes?: string[];
  sizeVariants?: SizeVariantItem[];
  basePrice?: string | number;
  baseOriginalPrice?: string | number;
  stock?: number;
}

export default function AddToCart({ 
  cart, 
  item, 
  sizes,
  sizeVariants,
  basePrice,
  baseOriginalPrice,
  stock = 1,
}: AddToCartProps) {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [isPending, startTransition] = useTransition();
  const isHindi = language === "hi";

  const cleanSize = (s?: string) => (s ? s.toLowerCase().replace(/no\.?/gi, "").trim() : "");

  // Determine initial selected size
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    sizes && sizes.length > 0 ? sizes[0] : undefined
  );

  // Size variant lookup
  const getVariant = (sizeName?: string) => {
    if (!sizeName || !sizeVariants || sizeVariants.length === 0) return null;
    const target = cleanSize(sizeName);
    return sizeVariants.find((v) => cleanSize(v.size) === target || v.size === sizeName);
  };

  const activeVariant = getVariant(selectedSize);

  // Dynamic price calculation
  const variantPrice = activeVariant && Number(activeVariant.price) > 0 ? Number(activeVariant.price) : 0;
  const variantOriginalPrice = activeVariant && Number(activeVariant.originalPrice) > 0 ? Number(activeVariant.originalPrice) : 0;

  const allVariantPrices = (sizeVariants || [])
    .map((v) => (Number(v.price) > 0 ? Number(v.price) : Number(v.originalPrice) || 0))
    .filter((n) => n > 0);
  const minVariantPrice = allVariantPrices.length > 0 ? Math.min(...allVariantPrices) : 0;

  const effectivePrice = variantPrice > 0 
    ? variantPrice 
    : (Number(basePrice) > 0 
       ? Number(basePrice) 
       : (minVariantPrice > 0 ? minVariantPrice : Number(item.price) || 0));

  const effectiveOriginalPrice = variantOriginalPrice > 0 
    ? variantOriginalPrice 
    : (Number(baseOriginalPrice) > 0 ? Number(baseOriginalPrice) : null);

  const discountPercent = effectiveOriginalPrice && effectiveOriginalPrice > effectivePrice 
    ? Math.round(((effectiveOriginalPrice - effectivePrice) / effectiveOriginalPrice) * 100) 
    : 0;

  const formattedSize = selectedSize 
    ? (selectedSize.toLowerCase().includes("no") ? selectedSize : `${selectedSize} No.`)
    : undefined;

  // Check if current variant is already in cart
  const targetClean = cleanSize(selectedSize);
  const existItem = cart && cart.items.find((x) => 
    x.productId === item.productId && 
    (!selectedSize || x.size === formattedSize || cleanSize(x.size) === targetClean)
  );

  const handleAddToCart = async () => {
    startTransition(async () => {
      const itemWithSize = { 
        ...item, 
        size: formattedSize,
        price: effectivePrice > 0 ? effectivePrice.toString() : item.price,
      };

      const res = await addItemToCart(itemWithSize);
      if (!res.success) {
        toast.error(res.message, {
          style: { backgroundColor: "#DC2626", color: "white" },
        });
      } else {
        const addedMsg = isHindi 
          ? (formattedSize ? `साइज़ ${formattedSize} सेवा टोकरी में जोड़ा गया` : "सेवा टोकरी में जोड़ा गया")
          : (formattedSize ? `Size ${formattedSize} added to devotional cart` : "Added to devotional cart");
        
        toast.success(addedMsg, {
          action: {
            label: isHindi ? "टोकरी देखें" : "Go To Cart",
            onClick: () => router.push("/cart"),
          },
        });
      }
    });
  };

  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId, formattedSize);
      if (!res.success) {
        toast.error(res.message, {
          style: { backgroundColor: "#DC2626", color: "white" },
        });
      } else {
        toast.success(res.message);
      }
    });
  };

  return (
    <div className="w-full flex flex-col">
      {/* Dynamic Price Header */}
      <div className="mb-6 flex flex-col gap-1.5">
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="text-3xl md:text-4xl font-bold text-on-surface">
            ₹{effectivePrice}
          </span>
          {effectiveOriginalPrice && discountPercent > 0 && (
            <>
              <span className="text-lg md:text-xl text-neutral-400 line-through">
                ₹{effectiveOriginalPrice}
              </span>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-md border border-emerald-200">
                {discountPercent}% {isHindi ? "छूट" : "OFF"}
              </span>
            </>
          )}
        </div>
        <span className="text-xs text-on-surface-variant font-medium">
          {t.product.inclusiveOfTaxes}
        </span>
      </div>

      {/* Size Selector */}
      {sizes && sizes.length > 0 && (
        <div className="mb-6 flex flex-col gap-2.5">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-[#003020] uppercase tracking-wide flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#C88A20]"></span>
              {isHindi ? "गोपाल जी का नाप चुनें (0-6 नं.)" : "Select Gopal Ji Size (0-6 No.)"}
            </span>
            <Link
              href="/size-chart"
              className="text-[#0F6F74] hover:text-[#0a4b4e] font-semibold flex items-center gap-1 hover:underline text-[11px]"
            >
              <Ruler className="w-3.5 h-3.5" />
              {isHindi ? "नाप तालिका (0-6 नं.)" : "Size Guide (0-6 No.)"}
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const v = getVariant(size);
              const isSelected = selectedSize === size;
              const displayLabel = isHindi
                ? (size.toLowerCase().includes("no") ? size.replace(/no\.?/i, "नं.") : `${size} नं.`)
                : (size.toLowerCase().includes("no") ? size : `${size} No.`);
              
              const vp = v && Number(v.price) > 0 ? Number(v.price) : (v && Number(v.originalPrice) > 0 ? Number(v.originalPrice) : 0);
              const vPrice = vp > 0 ? vp : effectivePrice;

              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all flex items-center gap-2 shadow-2xs active:scale-95 ${
                    isSelected
                      ? "bg-[#0F6F74] text-white border-[#0F6F74] ring-2 ring-[#0F6F74]/20 shadow-sm"
                      : "bg-white hover:bg-[#FAF7F0] text-[#003020] border-outline-variant/40 hover:border-[#E6C16A]"
                  }`}
                >
                  <span>{displayLabel}</span>
                  {vPrice > 0 && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      isSelected 
                        ? "bg-[#F3D98F] text-[#003020]" 
                        : "bg-emerald-50 text-emerald-800 border border-emerald-200/60"
                    }`}>
                      ₹{vPrice}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Cart & Wishlist Actions */}
      <div className="flex items-center gap-3 w-full">
        {stock <= 0 ? (
          <Button 
            disabled 
            className="flex-1 h-12 bg-neutral-100 text-neutral-400 font-bold rounded-xl cursor-not-allowed"
          >
            {t.product.outOfStock}
          </Button>
        ) : existItem ? (
          <div className="flex items-center gap-3 flex-1 flex-wrap">
            <div className="flex items-center border border-outline-variant/40 rounded-xl bg-surface-container-low p-1">
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 text-primary" 
                onClick={handleRemoveFromCart} 
                disabled={isPending}
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Minus className="w-4 h-4" />}
              </Button>
              <span className="px-4 font-bold text-base text-primary">{existItem.qty}</span>
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 text-primary" 
                onClick={handleAddToCart} 
                disabled={isPending}
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              </Button>
            </div>
            <Button 
              type="button" 
              onClick={() => router.push("/cart")}
              className="h-12 px-6 gold-gradient-btn text-primary-container font-bold rounded-xl hover:brightness-105 active:scale-95 transition-all"
            >
              {isHindi ? "सेवा टोकरी देखें" : "View Devotional Cart"}
            </Button>
          </div>
        ) : (
          <Button 
            className="flex-1 h-12 py-3 gold-gradient-btn text-primary-container font-bold rounded-xl hover:brightness-105 active:scale-98 transition-all text-sm md:text-base flex items-center justify-center gap-2 shadow-sm" 
            type="button" 
            onClick={handleAddToCart} 
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ShoppingBag className="w-4 h-4" />
            )}
            <span>{t.product.addToCart}</span>
            {effectivePrice > 0 && <span className="font-extrabold">• ₹{effectivePrice}</span>}
          </Button>
        )}
        <WishlistButton 
          productId={item.productId} 
          className="h-12 w-12 flex-shrink-0 bg-surface-container-low border border-outline-variant/40 hover:bg-surface-container rounded-xl shadow-xs active:scale-95 transition-all flex items-center justify-center text-on-surface-variant hover:text-secondary"
        />
      </div>
    </div>
  );
}
