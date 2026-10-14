"use client";
import { Button } from "@/components/ui/button";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.action";
import { Cart, CartItem } from "@/types";
import { Plus, Minus, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/i18n/language-context";

interface SizeVariantItem {
  size: string;
  price: string | number;
  originalPrice?: string | number;
  stock?: number;
}

const AddToCart = ({ 
  cart, 
  item, 
  sizes,
  sizeVariants 
}: { 
  cart?: Cart; 
  item: CartItem; 
  sizes?: string[];
  sizeVariants?: SizeVariantItem[];
}) => {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [isPending, startTransition] = useTransition();
  const [selectedSize, setSelectedSize] = useState(sizes && sizes.length > 0 ? sizes[0] : undefined);

  // Determine current active size variant price & stock
  const getVariant = (sizeName?: string) => {
    if (!sizeName || !sizeVariants || sizeVariants.length === 0) return null;
    const clean = sizeName.toLowerCase().replace('no', '').replace('.', '').trim();
    return sizeVariants.find(v => {
      const vClean = v.size.toLowerCase().replace('no', '').replace('.', '').trim();
      return vClean === clean || v.size === sizeName;
    });
  };

  const activeVariant = getVariant(selectedSize);
  const currentPrice = activeVariant?.price ? String(activeVariant.price) : item.price;
  const currentOriginalPrice = activeVariant?.originalPrice ? String(activeVariant.originalPrice) : null;

  const handleAddToCart = async () => {
    startTransition(async () => {
      const formattedSize = selectedSize 
        ? (selectedSize.toLowerCase().includes('no') ? selectedSize : `${selectedSize} No.`)
        : undefined;

      const itemWithSize = { 
        ...item, 
        size: formattedSize,
        price: currentPrice,
      };

      const res = await addItemToCart(itemWithSize);
      if (!res.success) {
        toast.error(res.message, {
          style: { backgroundColor: "#DC2626", color: "white" },
        });
      } else {
        toast.success(res.message, {
          action: {
            label: language === 'hi' ? "सेवा टोकरी देखें" : "Go To Cart",
            onClick: () => router.push("/cart"),
          },
        });
      }
    });
  };

  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId);
      if (!res.success) {
        toast.error(res.message, {
          style: { backgroundColor: "#DC2626", color: "white" },
        });
      } else {
        toast.success(res.message);
      }
    });
  };

  // Check if item is in cart
  const existItem =
    cart && cart.items.find((x) => x.productId === item.productId && x.size === selectedSize);

  return existItem ? (
    <div className="flex items-center gap-2">
      <Button type='button' variant='outline' size="icon" onClick={handleRemoveFromCart}>
        {isPending ? (
          <Loader className='w-4 h-4 animate-spin' />
        ) : (
          <Minus className='w-4 h-4' />
        )}
      </Button>
      <span className='px-3 font-bold text-sm'>{existItem.qty}</span>
      <Button type='button' variant='outline' size="icon" onClick={handleAddToCart}>
        {isPending ? (
          <Loader className='w-4 h-4 animate-spin' />
        ) : (
          <Plus className='w-4 h-4' />
        )}
      </Button>
    </div>
  ) : (
    <div className="flex flex-col gap-3 w-full">
      {sizes && sizes.length > 0 && (
        <div className="flex flex-col gap-1.5 w-full">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-primary">{t.product.selectSize}</span>
            {activeVariant && Number(activeVariant.price) > 0 && (
              <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                ₹{activeVariant.price}
                {currentOriginalPrice && Number(currentOriginalPrice) > Number(activeVariant.price) && (
                  <span className="line-through text-neutral-400 ml-1.5 font-normal">₹{currentOriginalPrice}</span>
                )}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const v = getVariant(size);
              const isSelected = selectedSize === size;
              const displayLabel = size.toLowerCase().includes('no') ? size : `${size} No.`;

              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all flex flex-col items-center min-w-16 ${
                    isSelected
                      ? 'bg-[#0F6F74] text-white border-[#0F6F74] shadow-sm'
                      : 'bg-white hover:bg-neutral-50 text-[#003020] border-outline-variant/40'
                  }`}
                >
                  <span>{displayLabel}</span>
                  {v && Number(v.price) > 0 && (
                    <span className={`text-[10px] ${isSelected ? 'text-[#F3D98F]' : 'text-neutral-500'}`}>
                      ₹{v.price}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
      <Button className='w-full py-2.5 gold-gradient-btn text-primary-container font-bold hover:brightness-105 active:scale-95 transition-all' type='button' onClick={handleAddToCart} disabled={isPending}>
        {isPending ? (
          <Loader className='w-4 h-4 animate-spin mr-2' />
        ) : (
          <Plus className='w-4 h-4 mr-2' />
        )}
        {t.product.addToCart} {activeVariant && Number(activeVariant.price) > 0 ? `• ₹${activeVariant.price}` : ''}
      </Button>
    </div>
  );
};

export default AddToCart;
