import { Badge } from '@/components/ui/badge';
import { getProductBySlug } from '@/lib/actions/product.action';
import { notFound } from 'next/navigation';
import ProductImages from '@/components/shared/product/product-images';
import AddToCart from '@/components/shared/product/add-to-cart';
import { getMyCart } from '@/lib/actions/cart.action';
import ReviewList from './review-list';
import { auth } from '@/auth';
import Rating from '@/components/shared/product/rating';
import ProductTrustBadges from '@/components/shared/product/product-trust-badges';
import PincodeChecker from '@/components/shared/product/pincode-checker';
import { getRecommendedProducts } from '@/lib/actions/recommendations.actions';
import ProductCard from '@/components/shared/product/product-card';
import { Metadata } from 'next';
import { APP_URL } from '@/lib/constants';
import { getServerTranslations } from '@/lib/i18n/server';

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found | Madhav Shringaar',
    };
  }

  const ogImage = product.images?.[0] || '/images/devotional/complete_shringar.webp';
  const title = `${product.name} | Laddu Gopal Poshak & Shringaar - Agra & Noida`;
  const description = `${product.name} - Handcrafted ${product.category} for Shri Laddu Gopal Ji. Authentic Vrindavan craftsmanship, deity-safe fabric. Express delivery in Agra, Noida, Delhi NCR & across India. Price: ₹${product.price}.`;

  return {
    title,
    description,
    keywords: [
      product.name,
      `${product.category} Agra`,
      `${product.category} Noida`,
      'Laddu Gopal poshak Agra',
      'Laddu Gopal dress Noida',
      'Kanha ji poshak online',
      'Braj devotional shringaar',
      'Madhav Shringaar Agra Noida',
      ...(product.sizes || []).map((s: string) => `Size ${s} Laddu Gopal poshak`),
    ],
    alternates: {
      canonical: `/product/${product.slug}`,
    },
    openGraph: {
      title: `${product.name} | Madhav Shringaar`,
      description,
      url: `${APP_URL}/product/${product.slug}`,
      siteName: 'Madhav Shringaar',
      images: [
        {
          url: ogImage.startsWith('http') ? ogImage : `${APP_URL}${ogImage}`,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | Madhav Shringaar`,
      description,
      images: [ogImage.startsWith('http') ? ogImage : `${APP_URL}${ogImage}`],
    },
  };
}

const ProductDetailsPage = async (props: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await props.params;

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const session = await auth();
  const userId = session?.user?.id;
  
  const recommendedProducts = await getRecommendedProducts(product.id, product.category);
  const cart = await getMyCart();
  const { t, lang } = await getServerTranslations();
  const isHindi = lang === 'hi';

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: (product.images || []).map((img: string) => (img.startsWith('http') ? img : `${APP_URL}${img}`)),
    description: product.description || `${product.name} - Divine Laddu Gopal Ji poshak and shringaar operating from Agra and Noida.`,
    sku: product.id,
    mpn: product.slug,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Madhav Shringaar',
    },
    offers: {
      '@type': 'Offer',
      url: `${APP_URL}/product/${product.slug}`,
      priceCurrency: 'INR',
      price: Number(product.price).toFixed(2),
      priceValidUntil: '2027-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Store',
        name: 'Madhav Shringaar (Agra & Noida)',
        telephone: '+917982160480',
        url: APP_URL,
      },
    },
    ...(Number(product.numReviews) > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: Number(product.rating).toFixed(1),
            reviewCount: Number(product.numReviews),
          },
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
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
                {isHindi ? 'माधव शृंगार' : product.brand} {product.category}
              </p>
              <h1 className='font-headline-lg text-headline-lg lg:text-4xl text-primary font-bold'>{product.name}</h1>
              
              <div className="flex items-center gap-4 mt-1">
                <Rating value={Number(product.rating)} />
                <span className="text-on-surface-variant font-body-sm">
                  ({product.numReviews} {isHindi ? 'समीक्षाएं' : 'reviews'})
                </span>
                <span className="text-outline-variant">|</span>
                {product.stock > 0 ? (
                  <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none font-semibold px-3">
                    {t.product.inStock}
                  </Badge>
                ) : (
                  <Badge variant='destructive' className="font-semibold px-3">
                    {t.product.outOfStock}
                  </Badge>
                )}
              </div>
            </div>

            {/* Price & Cart Actions */}
            <div className='py-6 border-b border-outline-variant/30'>
              <AddToCart
                cart={cart}
                sizes={product.sizes}
                sizeVariants={(product as any).sizeVariants}
                basePrice={product.price}
                baseOriginalPrice={product.originalPrice}
                stock={product.stock}
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

            {/* Trust Badges & Pincode Checker */}
            <div className="py-2">
              <PincodeChecker />
              <div className="mt-4">
                <ProductTrustBadges 
                  isReturnable={product.isReturnable} 
                  returnWindowDays={product.returnWindowDays}
                  returnPolicyText={product.returnPolicyText}
                />
              </div>
            </div>

            {/* Description */}
            <div className='mt-8 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-sm'>
              <p className='font-title-lg text-title-lg text-primary font-bold mb-4 flex items-center gap-2'>
                <span className="material-symbols-outlined text-secondary">info</span>
                {t.product.description}
              </p>
              <div 
                className='font-body-md text-body-md text-on-surface-variant leading-relaxed prose prose-sm max-w-none [&_b]:font-bold [&_strong]:font-bold [&_b]:text-[#003020] [&_strong]:text-[#003020] [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2 [&_li]:my-0.5 [&_h3]:font-serif [&_h3]:font-bold [&_h3]:text-base [&_h3]:text-[#003020] [&_h3]:mt-3 [&_h3]:mb-1 [&_p]:mb-2.5 last:[&_p]:mb-0'
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
            
          </div>
        </div>
      </section>

      {/* AI Recommendations */}
      {recommendedProducts.length > 0 && (
        <section className='py-12 bg-surface-container-lowest border-y border-outline-variant/30'>
          <div className='max-w-7xl mx-auto px-4 md:px-8'>
            <div className='text-center max-w-xl mx-auto mb-10 space-y-2'>
              <div className='flex items-center justify-center gap-3 text-secondary'>
                <span className='h-px w-12 bg-secondary/40'></span>
                <span className='material-symbols-outlined text-xl' style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                <span className='h-px w-12 bg-secondary/40'></span>
              </div>
              <h2 className='font-headline-md text-headline-md text-primary font-bold'>
                {t.product.divineMatches}
              </h2>
              <p className='font-body-sm text-body-sm text-on-surface-variant'>
                {isHindi ? 'कान्हा जी के संपूर्ण शृंगार हेतु सर्वाधिक पसंद किए जाने वाले संयोजन' : 'Products frequently brought together for complete shringaar'}
              </p>
            </div>
            
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6'>
              {recommendedProducts.map((p) => (
                <ProductCard key={p.id} product={p as any} />
              ))}
            </div>
          </div>
        </section>
      )}
      <section className='mt-10 max-w-7xl mx-auto px-4 md:px-8'>
        <h2 className='h2-bold mb-5'>{isHindi ? 'भक्तों की समीक्षाएं एवं अनुभव' : 'Customer Reviews'}</h2>
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