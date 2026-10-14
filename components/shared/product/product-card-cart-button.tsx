'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Loader2, X, Ruler } from 'lucide-react';
import { toast } from 'sonner';
import { addItemToCart } from '@/lib/actions/cart.action';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/language-context';

interface ProductCardCartButtonProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: string | number;
    images?: string[];
    sizes?: string[];
    sizeVariants?: Array<{ size: string; price: string | number; stock?: number }>;
    stock: number;
  };
}

export default function ProductCardCartButton({ product }: ProductCardCartButtonProps) {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [loadingSize, setLoadingSize] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const isHindi = language === 'hi';
  const hasSizes = product.sizes && product.sizes.length > 0;

  const getVariant = (sizeName: string) => {
    if (!product.sizeVariants || product.sizeVariants.length === 0) return null;
    const clean = sizeName.toLowerCase().replace('no', '').replace('.', '').trim();
    return product.sizeVariants.find(v => {
      const vClean = v.size.toLowerCase().replace('no', '').replace('.', '').trim();
      return vClean === clean || v.size === sizeName;
    });
  };

  if (product.stock <= 0) {
    return (
      <button
        disabled
        className="w-full py-2 bg-neutral-100 text-neutral-400 font-medium text-xs rounded-lg cursor-not-allowed flex items-center justify-center gap-1.5"
      >
        {t.product.outOfStock}
      </button>
    );
  }

  const handleAddDirect = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (hasSizes) {
      setIsOpen(true);
      return;
    }

    setLoadingSize('direct');
    startTransition(async () => {
      try {
        const res = await addItemToCart({
          productId: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price.toString(),
          qty: 1,
          image: product.images?.[0] || 'https://placehold.co/400x400/png',
        });

        if (!res.success) {
          toast.error(res.message, {
            style: { backgroundColor: '#DC2626', color: 'white' },
          });
        } else {
          toast.success(isHindi ? 'सेवा टोकरी में जोड़ा गया' : res.message, {
            action: {
              label: isHindi ? 'टोकरी देखें' : 'Go To Cart',
              onClick: () => router.push('/cart'),
            },
          });
        }
      } catch (err: any) {
        toast.error(err.message || 'Failed to add item to cart');
      } finally {
        setLoadingSize(null);
      }
    });
  };

  const handleSelectSize = async (e: React.MouseEvent, size: string) => {
    e.preventDefault();
    e.stopPropagation();

    setLoadingSize(size);
    startTransition(async () => {
      try {
        const formattedSize = size.toLowerCase().includes('no') ? size : `${size} No.`;
        const v = getVariant(size);
        const finalPrice = v && Number(v.price) > 0 ? v.price.toString() : product.price.toString();

        const res = await addItemToCart({
          productId: product.id,
          name: product.name,
          slug: product.slug,
          price: finalPrice,
          qty: 1,
          image: product.images?.[0] || 'https://placehold.co/400x400/png',
          size: formattedSize,
        });

        if (!res.success) {
          toast.error(res.message, {
            style: { backgroundColor: '#DC2626', color: 'white' },
          });
        } else {
          toast.success(isHindi ? `साइज़ ${formattedSize} सेवा टोकरी में जोड़ा गया` : `Size ${formattedSize} added to cart`, {
            action: {
              label: isHindi ? 'टोकरी देखें' : 'Go To Cart',
              onClick: () => router.push('/cart'),
            },
          });
          setIsOpen(false);
        }
      } catch (err: any) {
        toast.error(err.message || 'Failed to add item to cart');
      } finally {
        setLoadingSize(null);
      }
    });
  };

  if (isOpen && hasSizes) {
    return (
      <div 
        className="w-full bg-[#FAF7F0] border border-[#E6C16A]/60 rounded-xl p-2.5 shadow-md flex flex-col gap-2 transition-all animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#003020] uppercase tracking-wider flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C88A20]"></span>
            {t.product.selectSize}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsOpen(false);
            }}
            className="h-5 w-5 rounded-full hover:bg-neutral-200/60 flex items-center justify-center text-neutral-500 hover:text-neutral-800 transition-colors"
            title="Cancel"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {product.sizes!.map((size) => {
            const isLoading = loadingSize === size && isPending;
            const displayLabel = isHindi
              ? (size.toLowerCase().includes('no') ? size.replace(/no\.?/i, 'नं.') : `${size} नं.`)
              : (size.toLowerCase().includes('no') ? size : `${size} No.`);
            const v = getVariant(size);

            return (
              <button
                key={size}
                type="button"
                disabled={isPending}
                onClick={(e) => handleSelectSize(e, size)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md border transition-all active:scale-95 flex items-center justify-center gap-1 ${
                  isLoading
                    ? 'bg-[#0F6F74] text-white border-[#0F6F74]'
                    : 'bg-white hover:bg-[#F3E5C8] text-[#003020] border-[#E6C16A]/50 hover:border-[#C88A20] shadow-2xs'
                }`}
              >
                {isLoading ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <span>
                    {displayLabel}
                    {v && Number(v.price) > 0 && (
                      <span className="ml-1 text-[10px] text-emerald-700 font-bold">
                        ₹{v.price}
                      </span>
                    )}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-[#E6C16A]/30 text-[10px]">
          <Link
            href="/size-chart"
            onClick={(e) => e.stopPropagation()}
            className="text-[#0F6F74] hover:text-[#0a4b4e] font-medium flex items-center gap-1 hover:underline"
          >
            <Ruler className="w-3 h-3" />
            {isHindi ? 'नाप तालिका (0-6 नं.)' : 'Size Guide (0-6 No.)'}
          </Link>
          <span className="text-neutral-400">{t.product.tapSizeToAdd}</span>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleAddDirect}
      disabled={isPending}
      className="w-full py-2 px-3 gold-gradient-btn text-primary-container rounded-lg font-bold text-xs hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-sm"
    >
      {loadingSize === 'direct' && isPending ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <ShoppingBag className="w-3.5 h-3.5" />
      )}
      <span>{t.product.addToCart}</span>
      {hasSizes && (
        <span className="text-[10px] opacity-80 font-normal">
          ({product.sizes!.length} {t.product.sizesCount})
        </span>
      )}
    </button>
  );
}
