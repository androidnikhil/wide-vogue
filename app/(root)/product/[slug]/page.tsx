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
  const title = `${product.name} Online | Laddu Gopal Dress & Poshak - Madhav Shringaar`;
  const description = `Buy ${product.name} (${product.category}) for Shri Laddu Gopal Ji online at Madhav Shringaar. Authentic Vrindavan craftsmanship, traditional designs, Cash on Delivery (COD), free delivery over ₹999 & express delivery across India. Price: ₹${product.price}.`;

  return {
    title,
    description,
    keywords: [
      product.name,
      `${product.name} online`,
      'Laddu Gopal dress online',
      'Laddu Gopal poshak',
      'Laddu Gopal Ji dress',
      'Kanha Ji dress online',
      'Laddu Gopal designer dress',
      'Handmade Laddu Gopal poshak',
      'Laddu Gopal dress price',
      'Small Kanha Ji dress',
      'Laddu Gopal mukut online',
      'Laddu Gopal mala online',
      'Laddu Gopal jewellery set',
      'Laddu Gopal shringaar online',
      'Thakur Ji poshak online',
      'Banke Bihari shringaar items',
      'Krishna Ji dress online',
      'Buy Laddu Gopal dress online in India',
      'Laddu Gopal poshak with mukut and mala',
      'Laddu Gopal dress size 0 to 6',
      'Laddu Gopal dress with free delivery',
      'Laddu Gopal dresses with COD',
      'Laddu Gopal dress shop in Agra',
      'Laddu Gopal poshak in Agra',
      'Laddu Gopal dress delivery in Noida',
      'Laddu Gopal shringaar delivery across India',
      'Braj devotional shringaar',
      'Madhav Shringaar Agra Noida',
      ...(product.sizes || []).map((s: string) => `Size ${s} Laddu Gopal poshak`),
      ...(product.sizes || []).map((s: string) => `Laddu Gopal dress size ${s}`),
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
        {/* Purchase Hero Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start'>
          {/* Images Column (Left, Sticky) */}
          <div className='lg:col-span-7 xl:col-span-7 lg:sticky lg:top-24 self-start'>
            <ProductImages images={product.images} />
          </div>
          
          {/* Details & Action Column (Right) */}
          <div className='lg:col-span-5 xl:col-span-5 flex flex-col'>
            {/* Header / Title */}
            <div className='flex flex-col gap-2.5 pb-5 border-b border-outline-variant/30'>
              <p className='font-label-lg text-label-lg text-secondary uppercase tracking-widest font-bold text-xs'>
                {isHindi ? 'माधव शृंगार' : product.brand} • {product.category}
              </p>
              <h1 className='font-headline-lg text-headline-lg text-2xl lg:text-3xl text-primary font-bold leading-tight'>
                {product.name}
              </h1>
              
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <Rating value={Number(product.rating)} />
                <span className="text-on-surface-variant text-xs font-medium">
                  ({product.numReviews} {isHindi ? 'समीक्षाएं' : 'reviews'})
                </span>
                <span className="text-outline-variant">|</span>
                {product.stock > 0 ? (
                  <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none font-semibold px-2.5 py-0.5 text-xs">
                    {t.product.inStock}
                  </Badge>
                ) : (
                  <Badge variant='destructive' className="font-semibold px-2.5 py-0.5 text-xs">
                    {t.product.outOfStock}
                  </Badge>
                )}
              </div>
            </div>

            {/* Price & Cart Actions */}
            <div className='py-5 border-b border-outline-variant/30'>
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

            {/* Pincode Checker & Trust Badges */}
            <div className="py-4 flex flex-col gap-3">
              <PincodeChecker />
              <ProductTrustBadges 
                isReturnable={product.isReturnable} 
                returnWindowDays={product.returnWindowDays}
                returnPolicyText={null}
              />
            </div>
          </div>
        </div>

        {/* Dedicated Balanced Product Overview & Policy Section */}
        <div className="mt-14 pt-10 border-t border-outline-variant/30">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* Left Column: Devotional Description & Deity Craftsmanship (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl border border-outline-variant/30 shadow-xs">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-outline-variant/20">
                  <span className="material-symbols-outlined text-secondary text-2xl">menu_book</span>
                  <h2 className="font-title-lg text-lg sm:text-xl text-primary font-bold">
                    {isHindi ? 'विस्तृत विवरण एवं शृंगार विशेषताएँ' : 'Devotional Description & Highlights'}
                  </h2>
                </div>
                <div 
                  className="font-body-md text-on-surface-variant leading-relaxed prose prose-sm sm:prose max-w-none [&_b]:font-bold [&_strong]:font-bold [&_b]:text-[#003020] [&_strong]:text-[#003020] [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-3 [&_li]:my-1 [&_h3]:font-serif [&_h3]:font-bold [&_h3]:text-base [&_h3]:text-[#003020] [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:mb-3 last:[&_p]:mb-0"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>

              {/* Authentic Braj Karigari Callout */}
              <div className="bg-linear-to-r from-[#FAF7F0] to-amber-50/50 p-6 rounded-2xl border border-[#E6C16A]/40 shadow-xs flex items-start gap-4">
                <div className="h-11 w-11 rounded-xl bg-[#0F6F74]/10 text-[#0F6F74] flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                </div>
                <div className="flex-1 text-xs sm:text-sm text-[#003020]">
                  <h3 className="font-bold text-sm sm:text-base text-primary mb-1">
                    {isHindi ? 'प्रामाणिक ब्रजधाम कारीगरी एवं विग्रह सुरक्षा' : 'Authentic Braj Karigari & Deity Fit Guarantee'}
                  </h3>
                  <p className="text-neutral-600 leading-relaxed font-normal">
                    {isHindi 
                      ? 'प्रत्येक पोशाक एवं शृंगार को मथुरा-वृंदावन के कुशल कारीगरों द्वारा पवित्रता एवं भक्ति भाव से तैयार किया जाता है। ठाकुर जी के कोमल अंगों के स्पर्श हेतु रेशमी अस्तर का उपयोग होता है।'
                      : 'Every shringaar set is lovingly hand-tailored by generational Mathura & Vrindavan karigars using deity-safe pure fabrics, soft silk inner linings, and authentic zari.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Return & Exchange Policy + Seva Care Guidelines (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* Return & Refund Policy Card */}
              <div className="bg-[#FAF7F0] p-6 rounded-2xl border border-[#E6C16A]/50 shadow-xs flex flex-col gap-3">
                <div className="flex items-center gap-2 pb-2 border-b border-[#E6C16A]/30">
                  <span className="material-symbols-outlined text-[#C88A20] text-2xl">sync_alt</span>
                  <h3 className="font-title-lg text-lg text-primary font-bold">
                    {isHindi ? 'वापसी एवं विनिमय नीति' : 'Return & Exchange Policy'}
                  </h3>
                </div>
                
                {product.isReturnable ? (
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-100/70 px-3 py-1.5 rounded-lg w-max">
                    <span className="h-2 w-2 rounded-full bg-emerald-600"></span>
                    {isHindi ? `${product.returnWindowDays} दिन में सहज वापसी उपलब्ध` : `${product.returnWindowDays} Days Easy Return Available`}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 bg-amber-100/70 px-3 py-1.5 rounded-lg w-max">
                    <span className="h-2 w-2 rounded-full bg-amber-600"></span>
                    {isHindi ? 'विग्रह नाप अनुसार (Non-Returnable)' : 'Made to Measure (Non-Returnable)'}
                  </div>
                )}

                {product.returnPolicyText ? (
                  <div 
                    className="text-xs sm:text-sm text-neutral-700 leading-relaxed mt-2 prose prose-xs max-w-none [&_b]:font-bold [&_strong]:font-bold [&_b]:text-[#003020] [&_strong]:text-[#003020] [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2 [&_li]:my-1 [&_p]:mb-2 last:[&_p]:mb-0"
                    dangerouslySetInnerHTML={{ __html: product.returnPolicyText }}
                  />
                ) : (
                  <p className="text-xs text-neutral-600 leading-relaxed mt-2">
                    {isHindi 
                      ? 'यदि प्राप्त वस्त्र में कोई त्रुटि या नाप में भिन्नता हो तो डिलीवरी के 48 घंटों में संपर्क करें। विग्रह वस्त्रों की पवित्रता बनाए रखने हेतु उपयोग न किया गया हो।'
                      : 'Returns or replacements accepted if reported within 48 hours for size or defect issues. Divine shringaar must remain unopened and unused for sanctity.'}
                  </p>
                )}
              </div>

              {/* Sacred Seva & Handling Instructions */}
              <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col gap-3">
                <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/20">
                  <span className="material-symbols-outlined text-secondary text-2xl">dry_cleaning</span>
                  <h3 className="font-title-lg text-lg text-primary font-bold">
                    {isHindi ? 'सेवा एवं सुरक्षा निर्देश' : 'Devotional Care & Handling'}
                  </h3>
                </div>
                <ul className="text-xs text-neutral-600 space-y-2 list-disc pl-4 leading-relaxed font-normal">
                  <li>{isHindi ? 'पोशाक को कोमल हाथों से धारण कराएं, तीखे आभूषणों से धागे न खींचें।' : 'Handle gently when adorning Thakur Ji; avoid sharp ornaments snagging fine embroidery.'}</li>
                  <li>{isHindi ? 'धूप, अगरबत्ती की सीधी आंच एवं जल से सुरक्षित रखें।' : 'Keep away from direct diya flame, continuous water, and strong perfumes.'}</li>
                  <li>{isHindi ? 'सूखे एवं पवित्र वस्त्र पेटी अथवा बॉक्स में संभाल कर रखें।' : 'Store in a clean, sacred cotton cloth or devotional box to keep pure and fragrant.'}</li>
                </ul>
              </div>
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