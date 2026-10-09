'use client';

import { useEffect } from 'react';

import { productDefaultValues } from '@/lib/constants';
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
import { Card, CardContent } from '../ui/card';
import Image from 'next/image';
import { Checkbox } from '../ui/checkbox';
import { X } from 'lucide-react';

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
      product && type === 'Update' ? product : productDefaultValues,
  });

  const onSubmit: SubmitHandler<z.infer<typeof insertProductSchema>> = async (
    values
  ) => {
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
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <div>
                    <Input 
                      placeholder='Select or type a category' 
                      list="category-options" 
                      {...field} 
                    />
                    <datalist id="category-options">
                      <option value="Laddu Gopal" />
                      <option value="Mukut & Pagdi" />
                      <option value="Moti Mala" />
                      <option value="Bansuri" />
                      <option value="Singhasan" />
                      <option value="Combos" />
                    </datalist>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
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
        <div className='flex flex-col md:flex-row gap-5'>
          {/* Original Price */}
          <FormField
            control={form.control}
            name='originalPrice'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Original Price (MRP)</FormLabel>
                <FormControl>
                  <Input placeholder='Enter actual price' {...field} />
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
                <FormLabel>Selling Price (Auto-calculated)</FormLabel>
                <FormControl>
                  <Input placeholder='Calculated selling price' readOnly className="bg-gray-100" {...field} />
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
                          if (checked) {
                            field.onChange([...current, size]);
                          } else {
                            field.onChange(current.filter((val) => val !== size));
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
                          onClientUploadComplete={(res: { url: string }[]) => {
                            const newUrls = res.map((file) => file.url);
                            form.setValue('images', [...images, ...newUrls]);
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
                  onClientUploadComplete={(res: { url: string }[]) => {
                    form.setValue('banner', res[0].url);
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
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductSchema>,
                'description'
              >;
            }) => (
              <FormItem className='w-full'>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Enter product description'
                    className='resize-none'
                    {...field}
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
                    onCheckedChange={field.onChange}
                    className="h-5 w-5"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {form.watch('isReturnable') && (
            <div className='grid md:grid-cols-2 gap-5'>
              <FormField
                control={form.control}
                name='returnWindowDays'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>Return Window (Days)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder='e.g., 7' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='returnPolicyText'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>Return Policy Text (Optional)</FormLabel>
                    <FormControl>
                      <div>
                        <Input 
                          placeholder='e.g., 7 Days Replacement Policy' 
                          value={field.value || ''} 
                          onChange={field.onChange}
                          list="return-policy-options" 
                        />
                        <datalist id="return-policy-options">
                          <option value="7 Days Replacement Policy" />
                          <option value="7 Days Refund Policy" />
                          <option value="14 Days Replacement Policy" />
                          <option value="Replacement only on damaged item" />
                          <option value="No questions asked returns" />
                        </datalist>
                      </div>
                    </FormControl>
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