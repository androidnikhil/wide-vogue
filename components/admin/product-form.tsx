'use client';

import { useEffect, useState, useRef } from 'react';

import { productDefaultValues, PRODUCT_CATEGORIES, DEFAULT_RETURN_POLICY_HTML } from '@/lib/constants';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { insertProductSchema, updateProductSchema } from '@/lib/validators';
import { Product } from '@/types';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { ControllerRenderProps, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import slugify from 'slugify';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { createProduct, updateProduct } from '@/lib/actions/product.action';
import { UploadButton } from '@/lib/uploadthing';
import { convertFilesToWebP } from '@/lib/utils/image-converter';
import { Card, CardContent } from '../ui/card';
import Image from 'next/image';
import { Checkbox } from '../ui/checkbox';
import { X, Sparkles, Layers, Plus, Palette } from 'lucide-react';
import RichTextEditor from './rich-text-editor';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

const COLOR_OPTIONS = [
  { name: 'Yellow', hex: '#FFD700' },
  { name: 'Red', hex: '#E53E3E' },
  { name: 'Green', hex: '#38A169' },
  { name: 'Pink', hex: '#ED64A6' },
  { name: 'Orange', hex: '#DD6B20' },
  { name: 'Sky Blue', hex: '#63B3ED' },
  { name: 'Dark Blue', hex: '#2B6CB0' },
  { name: 'White', hex: '#F7FAFC' },
  { name: 'Purple', hex: '#805AD5' },
  { name: 'Multicolor', hex: 'linear-gradient(135deg, #FFD700, #E53E3E, #38A169, #2B6CB0)' },
  { name: 'Gold', hex: '#D69E2E' },
];

const getColorHex = (name: string): string => {
  const clean = name.toLowerCase().trim();
  const match = COLOR_OPTIONS.find((c) => c.name.toLowerCase() === clean);
  return match ? match.hex : '#A0AEC0';
};


const ProductForm = ({
  type,
  product,
  productId,
}: {
  type: 'Create' | 'Update';
  product?: Product;
  productId?: string;
}) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof insertProductSchema>>({
    resolver: type === 'Update' ? zodResolver(updateProductSchema) : zodResolver(insertProductSchema),
    defaultValues:
      product && type === 'Update' ? {
        ...product,
        sizeVariants: (product as any).sizeVariants || [],
      } : productDefaultValues,
  });

  const selectedSizes = form.watch('sizes') || [];
  const sizeVariants = form.watch('sizeVariants') || [];
  const basePrice = form.watch('price') || '0';
  const baseOriginalPrice = form.watch('originalPrice') || '0';
  const baseStock = form.watch('stock') || 0;
  const hasExistingVariants = (product && (product as any).sizeVariants && (product as any).sizeVariants.length > 0) || (product?.sizes && product.sizes.length > 0);
  const [pricingMode, setPricingMode] = useState<'single' | 'size'>(hasExistingVariants ? 'size' : 'single');
  const [syncSamePrice, setSyncSamePrice] = useState(false);
  const initialCategory = product?.category || form.getValues('category') || '';
  const [isCustomCategory, setIsCustomCategory] = useState<boolean>(
    Boolean(initialCategory && !PRODUCT_CATEGORIES.includes(initialCategory as any))
  );

  const onSubmit: SubmitHandler<z.infer<typeof insertProductSchema>> = async (
    values
  ) => {
    // If product has sizes, guarantee every selected size has a variant (falling back to base values if untouched)
    if (selectedSizes.length > 0) {
      const existingVariants = values.sizeVariants || [];
      const fallbackPrice = values.price || values.originalPrice || '0';
      const fallbackOriginalPrice = values.originalPrice || values.price || fallbackPrice;

      const completeVariants = selectedSizes.map((sz) => {
        const existing = existingVariants.find((v) => v.size === sz);
        const p = Number(existing?.price) || 0;
        const op = Number(existing?.originalPrice) || 0;
        const effectivePrice = p > 0 ? String(existing!.price) : (op > 0 ? String(existing!.originalPrice) : String(fallbackPrice));
        const effectiveOriginalPrice = op > 0 ? String(existing!.originalPrice) : (p > 0 ? String(existing!.price) : String(fallbackOriginalPrice));

        return {
          size: sz,
          price: effectivePrice,
          originalPrice: effectiveOriginalPrice,
          stock: existing?.stock !== undefined ? existing.stock : Number(values.stock || 0),
        };
      });
      values.sizeVariants = completeVariants;

      // Extract valid non-zero prices to determine base starting price
      const validPrices = completeVariants
        .map((v) => Number(v.price))
        .filter((n) => !isNaN(n) && n > 0);

      if (validPrices.length > 0) {
        const minPrice = Math.min(...validPrices);
        const matchingVariant = completeVariants.find((v) => Number(v.price) === minPrice);
        const minOriginalPrice = matchingVariant?.originalPrice ? Number(matchingVariant.originalPrice) : minPrice;

        // Auto-assign base price if 0 or when using size-based matrix
        if (Number(values.price || 0) <= 0 || pricingMode === 'size') {
          values.price = minPrice.toFixed(2);
          values.originalPrice = (minOriginalPrice || minPrice).toFixed(2);
          if (minOriginalPrice > minPrice) {
            values.discountPercent = Math.round(((minOriginalPrice - minPrice) / minOriginalPrice) * 100);
          } else {
            values.discountPercent = 0;
          }
        }
      }
    }
    // On Create
    if (type === 'Create') {
      const res = await createProduct(values);

      if (!res.success) {
        toast.error(res.message,{
          style: {
            backgroundColor: "#DC2626",
            color: "white",
          }
        });
      } else {
        toast.success(res.message);
        router.push('/admin/products');
      }
    }

    // On Update
    if (type === 'Update') {
      if (!productId) {
        router.push('/admin/products');
        return;
      }

      const res = await updateProduct({ ...values, id: productId });

      if (!res.success) {
        toast.error(res.message,{
            style: {
              backgroundColor: "#DC2626",
              color: "white",
            }
          });
      } else {
        toast.success(res.message);
        router.push('/admin/products');
      }
    }
  };

  const images = form.watch('images');
  const isFeatured = form.watch('isFeatured');
  const banner = form.watch('banner');
  
  const originalPrice = form.watch('originalPrice');
  const discountPercent = form.watch('discountPercent');

  useEffect(() => {
    if (originalPrice && discountPercent !== undefined) {
      const orig = Number(originalPrice) || 0;
      const dist = Number(discountPercent) || 0;
      const finalPrice = orig * (1 - dist / 100);
      form.setValue('price', finalPrice.toFixed(2), { shouldValidate: true });
    }
  }, [originalPrice, discountPercent, form]);

  return (
    <Form {...form}>
      <form
        method='POST'
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-8'
      >
        <div className='flex flex-col md:flex-row gap-5'>
          {/* Name */}
          <FormField
            control={form.control}
            name='name'
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductSchema>,
                'name'
              >;
            }) => (
              <FormItem className='w-full'>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder='Enter product name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Slug */}
          <FormField
            control={form.control}
            name='slug'
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductSchema>,
                'slug'
              >;
            }) => (
              <FormItem className='w-full'>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <div className='relative'>
                    <Input placeholder='Enter slug' {...field} />
                    <Button
                      type='button'
                      className='bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 mt-2'
                      onClick={() => {
                        form.setValue(
                          'slug',
                          slugify(form.getValues('name'), { lower: true })
                        );
                      }}
                    >
                      Generate
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex flex-col md:flex-row gap-5'>
          {/* Category */}
          <FormField
            control={form.control}
            name='category'
            render={({ field }) => {
              const isPredefined = PRODUCT_CATEGORIES.includes(field.value as any);
              const selectValue = isPredefined ? field.value : (field.value || isCustomCategory ? '__custom__' : '');

              return (
                <FormItem className='w-full'>
                  <div className="flex items-center justify-between">
                    <FormLabel>Category</FormLabel>
                    {isCustomCategory && (
                      <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Custom Category Mode
                      </span>
                    )}
                  </div>
                  <FormControl>
                    <div className="space-y-2">
                      <Select
                        value={selectValue}
                        onValueChange={(val) => {
                          if (val === '__custom__') {
                            setIsCustomCategory(true);
                          } else {
                            setIsCustomCategory(false);
                            field.onChange(val);
                          }
                        }}
                      >
                        <SelectTrigger className="w-full bg-white border-outline-variant/60 shadow-xs">
                          <SelectValue placeholder="Select deity product category..." />
                        </SelectTrigger>
                        <SelectContent className="max-h-80 bg-white">
                          <SelectGroup>
                            <SelectLabel className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                              👗 Poshak & Vastras
                            </SelectLabel>
                            <SelectItem value="Designer Poshak">Designer Poshak</SelectItem>
                            <SelectItem value="Special / Festival Poshak">Special / Festival Poshak</SelectItem>
                            <SelectItem value="Winter Woolen Poshak">Winter Woolen Poshak</SelectItem>
                            <SelectItem value="Cotton Summer Poshak">Cotton Summer Poshak</SelectItem>
                            <SelectItem value="Poshak">Poshak (All / General)</SelectItem>
                          </SelectGroup>

                          <SelectGroup>
                            <SelectLabel className="text-[11px] font-bold text-amber-800 uppercase tracking-wider pt-2">
                              👑 Mukut, Bansuri & Shringar
                            </SelectLabel>
                            <SelectItem value="Mukut & Pagdi">Mukut & Pagdi</SelectItem>
                            <SelectItem value="Mukut & Bansuri">Mukut & Bansuri</SelectItem>
                            <SelectItem value="Bansuri">Bansuri</SelectItem>
                            <SelectItem value="Jewellery & Mala">Jewellery & Mala</SelectItem>
                            <SelectItem value="Moti Mala">Moti Mala</SelectItem>
                            <SelectItem value="Kangan & Payal">Kangan & Payal</SelectItem>
                          </SelectGroup>

                          <SelectGroup>
                            <SelectLabel className="text-[11px] font-bold text-amber-900 uppercase tracking-wider pt-2">
                              🪑 Sinhasan, Seva & Combos
                            </SelectLabel>
                            <SelectItem value="Singhasan">Singhasan</SelectItem>
                            <SelectItem value="Jhula">Jhula</SelectItem>
                            <SelectItem value="Seva Essentials">Seva Essentials</SelectItem>
                            <SelectItem value="Festive Sets">Festive Sets</SelectItem>
                            <SelectItem value="Complete Shringar">Complete Shringar</SelectItem>
                          </SelectGroup>

                          <SelectGroup>
                            <SelectLabel className="text-[11px] font-bold text-stone-600 uppercase tracking-wider pt-2">
                              ➕ Custom
                            </SelectLabel>
                            <SelectItem value="__custom__">➕ Custom / Type New Category...</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>

                      {(isCustomCategory || (!isPredefined && field.value)) && (
                        <div className="flex items-center gap-2 pt-1 animate-in fade-in-50">
                          <Input
                            placeholder="Enter custom category name (e.g. Laddu Gopal Vigrah)"
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.value)}
                            className="bg-amber-50/50 border-amber-300 focus-visible:ring-amber-500"
                            autoFocus
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setIsCustomCategory(false);
                              field.onChange('Designer Poshak');
                            }}
                            className="text-xs text-muted-foreground hover:text-foreground shrink-0"
                          >
                            Reset
                          </Button>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          {/* Brand */}
          <FormField
            control={form.control}
            name='brand'
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductSchema>,
                'brand'
              >;
            }) => (
              <FormItem className='w-full'>
                <FormLabel>Brand</FormLabel>
                <FormControl>
                  <Input placeholder='Enter brand' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Pricing Strategy Selector */}
        <div className="p-4 bg-gradient-to-r from-amber-50/60 to-orange-50/40 rounded-2xl border border-amber-200/80 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                Pricing Strategy
              </span>
              <p className="text-xs text-neutral-600 mt-0.5">
                Choose whether this product has one uniform price or different prices for each size
              </p>
            </div>
            <div className="inline-flex rounded-xl border border-amber-300/80 bg-white p-1 shadow-2xs">
              <button
                type="button"
                onClick={() => setPricingMode('single')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  pricingMode === 'single'
                    ? 'bg-[#003020] text-[#E6C16A] shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Single Fixed Price
              </button>
              <button
                type="button"
                onClick={() => setPricingMode('size')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                  pricingMode === 'size'
                    ? 'bg-[#003020] text-[#E6C16A] shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Size-Wise Pricing Matrix
              </button>
            </div>
          </div>

          {pricingMode === 'size' && (
            <div className="p-3 bg-white/90 rounded-xl border border-amber-200/70 text-xs text-amber-950 flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-700 text-base">info</span>
              <span>
                <strong>Size-Wise Pricing Active:</strong> You can enter specific MRP and Selling Price for each size below. The base price will automatically be set to the starting/lowest size price.
              </span>
            </div>
          )}
        </div>

        <div className={`flex flex-col md:flex-row gap-5 ${pricingMode === 'size' ? 'opacity-85' : ''}`}>
          {/* Original Price */}
          <FormField
            control={form.control}
            name='originalPrice'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>
                  {pricingMode === 'size' ? 'Base / Starting MRP (₹)' : 'Original Price (MRP)'}
                </FormLabel>
                <FormControl>
                  <Input placeholder={pricingMode === 'size' ? 'Auto-filled from lowest size' : 'Enter actual price'} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Discount Percent */}
          <FormField
            control={form.control}
            name='discountPercent'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Discount Offer (%)</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    min="0"
                    max="100"
                    placeholder='Enter % off' 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Final Selling Price (Calculated) */}
          <FormField
            control={form.control}
            name='price'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>
                  {pricingMode === 'size' ? 'Base Selling Price (Auto-set)' : 'Selling Price (Auto-calculated)'}
                </FormLabel>
                <FormControl>
                  <Input placeholder='Selling price (edit to round off)' {...field} className="bg-white font-medium text-primary" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex flex-col md:flex-row gap-5'>
          {/* Stock */}
          <FormField
            control={form.control}
            name='stock'
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductSchema>,
                'stock'
              >;
            }) => (
              <FormItem className='w-full'>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input placeholder='Enter stock' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex flex-col gap-5'>
          {/* Sizes */}
          <FormField
            control={form.control}
            name='sizes'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Available Sizes (Laddu Gopal No.)</FormLabel>
                <div className="flex flex-wrap gap-4 mt-2">
                  {['0', '1', '2', '3', '4', '5', '6', '7'].map((size) => (
                    <div key={size} className="flex items-center space-x-2">
                      <Checkbox
                        id={`size-${size}`}
                        checked={field.value?.includes(size)}
                        onCheckedChange={(checked) => {
                          const current = field.value || [];
                          const currentVariants = form.getValues('sizeVariants') || [];
                          if (checked) {
                            field.onChange([...current, size]);
                            if (!currentVariants.some((v) => v.size === size)) {
                              form.setValue('sizeVariants', [
                                ...currentVariants,
                                {
                                  size,
                                  price: basePrice && Number(basePrice) > 0 ? String(basePrice) : (baseOriginalPrice || '0'),
                                  originalPrice: baseOriginalPrice || basePrice || '0',
                                  stock: Number(baseStock || 0),
                                },
                              ]);
                            }
                          } else {
                            field.onChange(current.filter((val) => val !== size));
                            form.setValue('sizeVariants', currentVariants.filter((v) => v.size !== size));
                          }
                        }}
                      />
                      <label htmlFor={`size-${size}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {size}
                      </label>
                    </div>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Dynamic Size-Wise Pricing & Inventory Matrix */}
          {selectedSizes.length > 0 && (
            <div className="mt-2 p-4 rounded-xl border border-[#E6C16A]/60 bg-[#FAF7F0] space-y-3.5 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-sm text-[#003020] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#C88A20] text-base">straighten</span>
                    Size-Specific Pricing &amp; Stock Matrix
                  </h4>
                  <p className="text-xs text-neutral-600">
                    Set customized selling prices and original MRPs for each size.
                  </p>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs bg-amber-100/70 hover:bg-amber-200 text-amber-950 border-amber-300 font-bold flex items-center gap-1"
                    onClick={() => {
                      const updated = selectedSizes.map((s) => {
                        const existing = sizeVariants.find((v) => v.size === s);
                        const mrp = existing?.originalPrice && Number(existing.originalPrice) > 0 
                          ? String(existing.originalPrice) 
                          : (baseOriginalPrice && Number(baseOriginalPrice) > 0 ? String(baseOriginalPrice) : (existing?.price || '0'));
                        return {
                          size: s,
                          price: mrp,
                          originalPrice: mrp,
                          stock: existing?.stock !== undefined ? existing.stock : Number(baseStock || 0),
                        };
                      });
                      form.setValue('sizeVariants', updated);
                      setSyncSamePrice(true);
                      toast.success("⚡ Selling Price set same as Original MRP for all sizes!");
                    }}
                  >
                    ⚡ Same Price (Selling = MRP)
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs border-[#E6C16A] text-[#003020] hover:bg-[#F3E5AB]/40"
                    onClick={() => {
                      const updated = selectedSizes.map((s) => {
                        const existing = sizeVariants.find((v) => v.size === s);
                        return {
                          size: s,
                          price: existing?.price && Number(existing.price) > 0 ? existing.price : (basePrice || '0'),
                          originalPrice: existing?.originalPrice && Number(existing.originalPrice) > 0 ? existing.originalPrice : (baseOriginalPrice || '0'),
                          stock: existing?.stock !== undefined ? existing.stock : Number(baseStock || 0),
                        };
                      });
                      form.setValue('sizeVariants', updated);
                      toast.success("Applied base price and stock to all sizes");
                    }}
                  >
                    Auto-Fill from Base Values
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs border-[#0F6F74] text-[#0F6F74] hover:bg-[#0F6F74]/10 flex items-center gap-1 font-semibold"
                    onClick={() => {
                      const firstWithColors = sizeVariants.find((v) => v.colors && v.colors.length > 0);
                      if (!firstWithColors || !firstWithColors.colors || firstWithColors.colors.length === 0) {
                        toast.info("Please choose colors for at least one size first, then click here to copy to all sizes.");
                        return;
                      }
                      const colorsToCopy = [...firstWithColors.colors];
                      const updated = selectedSizes.map((s) => {
                        const existing = sizeVariants.find((v) => v.size === s) || {
                          size: s,
                          price: basePrice,
                          originalPrice: baseOriginalPrice,
                          stock: Number(baseStock || 0),
                        };
                        return {
                          ...existing,
                          colors: colorsToCopy,
                        };
                      });
                      form.setValue('sizeVariants', updated);
                      toast.success(`Copied colors (${colorsToCopy.join(', ')}) to all sizes!`);
                    }}
                  >
                    <Palette className="w-3.5 h-3.5" />
                    Copy Colors to All Sizes
                  </Button>
                </div>
              </div>

              {/* Sync Toggle */}
              <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-amber-200/60">
                <input
                  type="checkbox"
                  id="sync-same-price"
                  checked={syncSamePrice}
                  onChange={(e) => setSyncSamePrice(e.target.checked)}
                  className="rounded text-[#0F6F74] focus:ring-[#0F6F74] h-4 w-4"
                />
                <label htmlFor="sync-same-price" className="text-xs font-semibold text-neutral-800 cursor-pointer select-none">
                  Selling Price is same as Original MRP (Typing MRP will automatically fill Selling Price)
                </label>
              </div>

              <div className="overflow-x-auto bg-white rounded-lg border border-neutral-200">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-200 bg-neutral-50 text-neutral-700">
                      <th className="py-2.5 px-3 font-semibold">Size</th>
                      <th className="py-2.5 px-3 font-semibold">Selling Price (₹)</th>
                      <th className="py-2.5 px-3 font-semibold">Original MRP (₹)</th>
                      <th className="py-2.5 px-3 font-semibold">Stock Qty</th>
                      <th className="py-2.5 px-3 font-semibold min-w-[200px]">Available Colors</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {selectedSizes.map((sz) => {
                      const variant = sizeVariants.find((v) => v.size === sz) || {
                        size: sz,
                        price: basePrice,
                        originalPrice: baseOriginalPrice,
                        stock: Number(baseStock || 0),
                      };

                      const updateVariant = (field: 'price' | 'originalPrice' | 'stock' | 'colors', val: any) => {
                        const others = sizeVariants.filter((v) => v.size !== sz);
                        const updatedVar = {
                          ...variant,
                          size: sz,
                          [field]: val,
                        };
                        // If syncSamePrice is true and originalPrice is updated, mirror to price
                        if (syncSamePrice && field === 'originalPrice') {
                          updatedVar.price = val;
                        }
                        form.setValue('sizeVariants', [...others, updatedVar]);
                      };

                      const handleRowSamePrice = () => {
                        const targetPrice = variant.originalPrice || variant.price || '0';
                        const others = sizeVariants.filter((v) => v.size !== sz);
                        form.setValue('sizeVariants', [
                          ...others,
                          {
                            ...variant,
                            size: sz,
                            price: targetPrice,
                            originalPrice: targetPrice,
                          },
                        ]);
                        toast.success(`Size ${sz} Selling Price set same as MRP (₹${targetPrice})`);
                      };

                      return (
                        <tr key={sz} className="hover:bg-amber-50/40 transition-colors">
                          <td className="py-2.5 px-3 font-bold text-[#003020] whitespace-nowrap">
                            <span className="px-2.5 py-0.5 rounded-full bg-[#E6C16A]/20 text-[#8A5A0A] font-medium text-xs border border-[#E6C16A]/40">
                              Size {sz} No.
                            </span>
                          </td>
                          <td className="py-2 px-3">
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder={variant.originalPrice || basePrice || '0'}
                              value={variant.price || ''}
                              onChange={(e) => updateVariant('price', e.target.value)}
                              className="h-8 w-28 text-xs bg-white font-semibold text-[#003020]"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder={baseOriginalPrice || '0'}
                              value={variant.originalPrice || ''}
                              onChange={(e) => updateVariant('originalPrice', e.target.value)}
                              className="h-8 w-28 text-xs bg-white"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <Input
                              type="number"
                              min="0"
                              placeholder={String(baseStock || 0)}
                              value={variant.stock ?? ''}
                              onChange={(e) => updateVariant('stock', Number(e.target.value || 0))}
                              className="h-8 w-24 text-xs bg-white"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <div className="flex flex-wrap items-center gap-1.5 min-w-[200px]">
                              {((variant.colors as string[]) || []).map((col: string) => (
                                <span
                                  key={col}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-white border border-neutral-300 shadow-2xs"
                                >
                                  <span
                                    className="w-2.5 h-2.5 rounded-full border border-black/15 shrink-0"
                                    style={{ background: getColorHex(col) }}
                                  />
                                  <span className="text-neutral-800">{col}</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const curr = (variant.colors as string[]) || [];
                                      updateVariant('colors', curr.filter((c: string) => c !== col));
                                    }}
                                    className="text-neutral-400 hover:text-red-500 font-bold ml-0.5 leading-none cursor-pointer"
                                    title="Remove color"
                                  >
                                    &times;
                                  </button>
                                </span>
                              ))}

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button
                                    type="button"
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium border border-dashed border-[#0F6F74] text-[#0F6F74] hover:bg-[#0F6F74]/10 transition-colors cursor-pointer bg-white"
                                  >
                                    <Plus className="w-3 h-3" />
                                    <span>Add Color</span>
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="w-48 p-1.5 bg-white rounded-xl shadow-lg border border-neutral-200 z-50">
                                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-2 py-1 border-b border-neutral-100">
                                    Choose Colors (Size {sz})
                                  </div>
                                  <div className="max-h-52 overflow-y-auto py-1 space-y-0.5 custom-scroll">
                                    {COLOR_OPTIONS.map((c) => {
                                      const isSelected = ((variant.colors as string[]) || []).includes(c.name);
                                      return (
                                        <button
                                          key={c.name}
                                          type="button"
                                          onClick={() => {
                                            const curr = (variant.colors as string[]) || [];
                                            if (isSelected) {
                                              updateVariant('colors', curr.filter((x: string) => x !== c.name));
                                            } else {
                                              updateVariant('colors', [...curr, c.name]);
                                            }
                                          }}
                                          className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-xs transition-colors text-left cursor-pointer ${
                                            isSelected ? 'bg-amber-50 font-bold text-amber-900' : 'hover:bg-neutral-100 text-neutral-700'
                                          }`}
                                        >
                                          <div className="flex items-center gap-2">
                                            <span
                                              className="w-3.5 h-3.5 rounded-full border border-black/15 shrink-0"
                                              style={{ background: c.hex }}
                                            />
                                            <span>{c.name}</span>
                                          </div>
                                          {isSelected && <span className="text-amber-700 text-xs font-bold">✓</span>}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                          <td className="py-2 px-3 text-right">
                            <button
                              type="button"
                              onClick={handleRowSamePrice}
                              className="text-[11px] font-semibold text-[#0F6F74] hover:underline"
                              title="Copy MRP to Selling Price for this size"
                            >
                              Same as MRP
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        <div className='upload-field flex flex-col md:flex-row gap-5'>
          {/* Images */}
          <FormField
            control={form.control}
            name='images'
            render={() => (
              <FormItem className='w-full'>
                <FormLabel>Images</FormLabel>
                <Card>
                  <CardContent className='space-y-2 mt-2 min-h-48'>
                    <div className='flex flex-wrap gap-4 items-start'>
                      {images.map((image: string) => (
                        <div key={image} className='relative'>
                          <Image
                            src={image}
                            alt='product image'
                            className='w-20 h-20 object-cover object-center rounded-sm'
                            width={100}
                            height={100}
                          />
                          <button
                            type='button'
                            className='absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-sm'
                            onClick={() => {
                              form.setValue(
                                'images',
                                images.filter((i: string) => i !== image)
                              );
                            }}
                          >
                            <X className='w-4 h-4' />
                          </button>
                        </div>
                      ))}
                      <FormControl>
                        <UploadButton
                          endpoint='imageUploader'
                          appearance={{
                            button: "bg-primary text-white text-sm font-bold w-full rounded-md px-4 py-2 hover:bg-primary/90 transition-colors",
                            allowedContent: "text-on-surface-variant text-xs mt-1",
                            container: "w-max border border-outline-variant rounded-md p-4 bg-surface-container flex flex-col items-center justify-center",
                          }}
                          onBeforeUploadBegin={async (files) => {
                            toast.loading('Converting images to WebP...', { id: 'webp-convert' });
                            const webpFiles = await convertFilesToWebP(files);
                            toast.dismiss('webp-convert');
                            return webpFiles;
                          }}
                          onClientUploadComplete={(res: { url: string }[]) => {
                            const newUrls = res.map((file) => file.url);
                            form.setValue('images', [...images, ...newUrls]);
                            toast.success('Images converted to WebP & uploaded!');
                          }}
                          onUploadError={(error: Error) => {
                            toast.error(`ERROR! ${error.message}`,{
                                style: {
                                  backgroundColor: "#DC2626",
                                  color: "white",
                                }
                              });
                          }}
                        />
                      </FormControl>
                    </div>
                  </CardContent>
                </Card>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='upload-field'>
          {/* isFeatured */}
          <div className="flex flex-col gap-1 mb-2">
            <span className="font-semibold text-primary">Featured Product</span>
            <span className="text-xs text-on-surface-variant">Featured products are highlighted in the main carousel and special sections on the homepage to attract more customers.</span>
          </div>
          <Card>
            <CardContent className='space-y-2 mt-2 p-4'>
              <FormField
                control={form.control}
                name='isFeatured'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center space-x-3 space-y-0'>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Yes, mark as Featured Product</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              {isFeatured && banner && (
                <div className='relative'>
                  <Image
                    src={banner}
                    alt='banner image'
                    className='w-full object-cover object-center rounded-sm'
                    width={1920}
                    height={680}
                  />
                  <button
                    type='button'
                    className='absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-sm'
                    onClick={() => {
                      form.setValue('banner', '');
                    }}
                  >
                    <X className='w-4 h-4' />
                  </button>
                </div>
              )}

              {isFeatured && !banner && (
                <UploadButton
                  endpoint='imageUploader'
                  appearance={{
                    button: "bg-primary text-white text-sm font-bold w-full rounded-md px-4 py-2 hover:bg-primary/90 transition-colors",
                    allowedContent: "text-on-surface-variant text-xs mt-1",
                    container: "w-max border border-outline-variant rounded-md p-4 bg-surface-container flex flex-col items-center justify-center",
                  }}
                  onBeforeUploadBegin={async (files) => {
                    toast.loading('Converting banner to WebP...', { id: 'webp-banner' });
                    const webpFiles = await convertFilesToWebP(files);
                    toast.dismiss('webp-banner');
                    return webpFiles;
                  }}
                  onClientUploadComplete={(res: { url: string }[]) => {
                    form.setValue('banner', res[0].url);
                    toast.success('Banner converted to WebP & uploaded!');
                  }}
                  onUploadError={(error: Error) => {
                    toast.error(`ERROR! ${error.message}`,{
                        style: {
                          backgroundColor: "#DC2626",
                          color: "white",
                        }
                      });
                  }}
                />
              )}
            </CardContent>
          </Card>
        </div>
        <div>
          {/* Description */}
          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel className="flex items-center justify-between">
                  <span>Product Description (Rich Text &amp; Formatted Paste Supported)</span>
                  <span className="text-[11px] text-neutral-500 font-normal">
                    Supports Bold, Italic, Bullet Lists &amp; Formatting
                  </span>
                </FormLabel>
                <FormControl>
                  <RichTextEditor
                    value={field.value || ''}
                    onChange={field.onChange}
                    placeholder="Enter divine details, poshak fabric quality, embroidery style, seva recommendations..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* Returns & Refunds Section */}
        <div className='flex flex-col gap-5 border border-outline-variant/30 p-6 rounded-xl bg-surface-container-lowest'>
          <h3 className="font-semibold text-lg text-primary">Returns & Refunds Configuration</h3>
          
          <FormField
            control={form.control}
            name='isReturnable'
            render={({ field }) => (
              <FormItem className='flex flex-row items-center justify-between rounded-lg border border-outline-variant/50 p-4 shadow-sm'>
                <div className='space-y-0.5'>
                  <FormLabel className='text-base font-medium'>Eligible for Return</FormLabel>
                  <div className='text-sm text-on-surface-variant text-muted-foreground'>
                    Can the customer request a return or refund for this item?
                  </div>
                </div>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);
                      if (checked) {
                        if (!form.getValues('returnPolicyText')) {
                          form.setValue('returnPolicyText', DEFAULT_RETURN_POLICY_HTML, { shouldDirty: true });
                        }
                        if (!form.getValues('returnWindowDays')) {
                          form.setValue('returnWindowDays', 7, { shouldDirty: true });
                        }
                      }
                    }}
                    className="h-5 w-5"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {form.watch('isReturnable') && (
            <div className='flex flex-col gap-5'>
              <div className='max-w-xs'>
                <FormField
                  control={form.control}
                  name='returnWindowDays'
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <FormLabel className="font-semibold text-primary">Return Window (Days)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder='e.g., 7' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name='returnPolicyText'
                render={({ field }) => (
                  <FormItem className='w-full space-y-3'>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <FormLabel className="font-semibold text-primary">Return Policy Terms & Instructions (Rich Text)</FormLabel>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          field.onChange(DEFAULT_RETURN_POLICY_HTML);
                          toast.success('Suggested return policy loaded!');
                        }}
                        className="h-8 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border-amber-300 gap-1.5 self-start sm:self-auto shadow-xs"
                      >
                        <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                        ⚡ Use Suggested Return Policy
                      </Button>
                    </div>

                    {/* Suggested Policy Banner / Card */}
                    <div className="rounded-xl border border-amber-200/90 bg-linear-to-br from-amber-50/70 via-[#FFFDF5] to-orange-50/40 p-4 text-xs text-stone-700 shadow-xs space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-900 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                          <span className="material-symbols-outlined text-sm text-amber-600">verified</span>
                          Suggested Standard Return Policy
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            field.onChange(DEFAULT_RETURN_POLICY_HTML);
                            toast.success('Suggested return policy applied to editor!');
                          }}
                          className="text-[11px] font-bold text-amber-800 hover:text-amber-950 underline underline-offset-2 transition-colors cursor-pointer flex items-center gap-1"
                        >
                          Fill into Editor ↵
                        </button>
                      </div>
                      <div className="space-y-2 text-stone-700 leading-relaxed font-sans bg-white/90 p-3 rounded-lg border border-amber-100 shadow-2xs">
                        <p>
                          Returns are accepted only for size issues or defective products. Customers must report the issue within 48 hours of delivery and provide clear photos or an unboxing video as proof. Products must be unused and returned in their original packaging. Return approval is subject to verification.
                        </p>
                        <p className="pt-2 text-stone-600 border-t border-amber-100/70">
                          Returns are not accepted for change of mind, colour preference, or minor variations in handmade designs.
                        </p>
                      </div>
                    </div>

                    <FormControl>
                      <RichTextEditor
                        value={field.value || ''}
                        onChange={field.onChange}
                        placeholder="Enter return and replacement terms..."
                      />
                    </FormControl>
                    <p className="text-xs text-on-surface-variant">
                      Supports bold, italic, bullet lists, and clean copy-paste. Click <b>Use Suggested Return Policy</b> above to auto-fill anytime without typing manually.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>

        <div>
          <Button
            type='submit'
            size='lg'
            disabled={form.formState.isSubmitting}
            className='button col-span-2 w-full'
          >
            {form.formState.isSubmitting ? 'Submitting' : `${type} Product`}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;