import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { getProductBySlug } from '@/lib/actions/product.action';
import { notFound } from 'next/navigation';
import ProductPrice from '@/components/shared/product/product-price';
import ProductImages from '@/components/shared/product/product-images';
import AddToCart from '@/components/shared/product/add-to-cart';
import { getMyCart } from '@/lib/actions/cart.action';
import ReviewList from './review-list';
import WishlistButton from '@/components/shared/product/wishlist-button';
import { auth } from '@/auth';
import Rating from '@/components/shared/product/rating';
import ProductTrustBadges from '@/components/shared/product/product-trust-badges';

const ProductDetailsPage = async (props: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await props.params;

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const session = await auth();
  const userId = session?.user?.id;

  const cart = await getMyCart();

  return (
    <>
      <section className="pb-10 pt-4 max-w-7xl mx-auto px-4 md:px-8">
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12'>
          {/* Images Column (Left) */}
          <div className='lg:col-span-6 xl:col-span-7'>
            <ProductImages images={product.images} />
          </div>
          
          {/* Details & Action Column (Right) */}
          <div className='lg:col-span-6 xl:col-span-5 flex flex-col'>
            {/* Header / Title */}
            <div className='flex flex-col gap-3 pb-6 border-b border-outline-variant/30'>
              <p className='font-label-lg text-label-lg text-secondary uppercase tracking-widest font-bold'>
                {product.brand} {product.category}
              </p>
              <h1 className='font-headline-lg text-headline-lg lg:text-4xl text-primary font-bold'>{product.name}</h1>
              
              <div className="flex items-center gap-4 mt-1">
                <Rating value={Number(product.rating)} />
                <span className="text-on-surface-variant font-body-sm">
                  ({product.numReviews} reviews)
                </span>
                <span className="text-outline-variant">|</span>
                {product.stock > 0 ? (
                  <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none font-semibold px-3">In Stock</Badge>
                ) : (
                  <Badge variant='destructive' className="font-semibold px-3">Out Of Stock</Badge>
                )}
              </div>
            </div>

            {/* Price & Cart Actions */}
            <div className='py-6 border-b border-outline-variant/30'>
              <div className='mb-6 flex items-baseline gap-4'>
                <ProductPrice
                  value={Number(product.price)}
                  className='text-4xl font-bold text-on-surface'
                />
                <span className="text-sm text-on-surface-variant font-medium">(Inclusive of all taxes)</span>
              </div>

              {product.stock > 0 && (
                <div className='flex items-center gap-3 w-full'>
                  <div className="flex-1">
                    <AddToCart
                      cart={cart}
                      sizes={product.sizes}
                      item={{
                        productId: product.id,
                        name: product.name,
                        slug: product.slug,
                        price: product.price,
                        qty: 1,
                        image: product.images![0],
                      }}
                    />
                  </div>
                  <WishlistButton 
                    productId={product.id} 
                    className="h-12 w-12 flex-shrink-0 bg-surface-container-low border border-outline-variant/30 hover:bg-surface-container rounded-lg shadow-sm active:scale-95 transition-all flex items-center justify-center text-on-surface-variant hover:text-secondary"
                  />
                </div>
              )}
            </div>

            {/* Trust Badges & Pincode Checker */}
            <div className="py-2">
              <ProductTrustBadges 
                isReturnable={product.isReturnable} 
                returnWindowDays={product.returnWindowDays} 
              />
            </div>

            {/* Description */}
            <div className='mt-8 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-sm'>
              <p className='font-title-lg text-title-lg text-primary font-bold mb-4 flex items-center gap-2'>
                <span className="material-symbols-outlined text-secondary">info</span>
                Devotional Description
              </p>
              <p className='font-body-md text-body-md text-on-surface-variant leading-relaxed'>{product.description}</p>
            </div>
            
          </div>
        </div>
      </section>
      <section className='mt-10 max-w-7xl mx-auto px-4 md:px-8'>
        <h2 className='h2-bold mb-5'>Customer Reviews</h2>
        <ReviewList
          userId={userId || ''}
          productId={product.id}
          productSlug={product.slug}
        />
      </section>
    </>
  );
};

export default ProductDetailsPage;