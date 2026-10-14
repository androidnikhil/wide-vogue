import ProductCard from '@/components/shared/product/product-card';
import { Button } from '@/components/ui/button';
import {
  getAllProducts,
  getAllCategories,
} from '@/lib/actions/product.action';
import Link from 'next/link';
import PriceSlider from '@/components/shared/search/price-slider';
import MobileFilterDrawer from '@/components/shared/search/mobile-filter-drawer';

const ratings = [4, 3, 2, 1];

const sortOrders = ['newest', 'lowest', 'highest', 'rating'];

export async function generateMetadata(props: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    price?: string;
    rating?: string;
  }>;
}) {
  const {
    q = 'all',
    category = 'all',
  } = await props.searchParams;

  const isQuerySet = q && q !== 'all' && q.trim() !== '';
  const isCategorySet =
    category && category !== 'all' && category.trim() !== '';

  let title = 'Explore Laddu Gopal Poshak & Shringaar Collection';
  if (isQuerySet && isCategorySet) {
    title = `${q} in ${category} | Madhav Shringaar`;
  } else if (isQuerySet) {
    title = `Search: "${q}" | Madhav Shringaar`;
  } else if (isCategorySet) {
    title = `${category} for Shri Laddu Gopal Ji | Agra & Noida`;
  }

  const description = isCategorySet
    ? `Explore handcrafted ${category} for Shri Laddu Gopal Ji at Madhav Shringaar. Authentic Vrindavan style devotional shringaar delivered fast across Agra, Noida, Delhi NCR & all India.`
    : `Search and buy premium Laddu Gopal poshaks, designer mukuts, bansuris & deity shringaar from Madhav Shringaar operating from Agra and Noida.`;

  return {
    title,
    description,
    keywords: [
      isCategorySet ? `${category} Agra` : 'Laddu Gopal poshak Agra',
      isCategorySet ? `${category} Noida` : 'Laddu Gopal poshak Noida',
      'Kanha ji dresses online',
      'Vrindavan deity shringaar',
      'Madhav Shringaar',
    ],
    alternates: {
      canonical: '/search',
    },
  };
}

const SearchPage = async (props: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    price?: string;
    rating?: string;
    sort?: string;
    page?: string;
    size?: string;
  }>;
}) => {
  const {
    q = 'all',
    category = 'all',
    price = 'all',
    rating = 'all',
    sort = 'newest',
    page = '1',
    size = 'all',
  } = await props.searchParams;

  // Construct filter url
  const getFilterUrl = ({
    c,
    p,
    s,
    r,
    pg,
    sz,
  }: {
    c?: string;
    p?: string;
    s?: string;
    r?: string;
    pg?: string;
    sz?: string;
  }) => {
    const params = { q, category, price, rating, sort, page, size };

    if (c) params.category = c;
    if (p) params.price = p;
    if (s) params.sort = s;
    if (r) params.rating = r;
    if (pg) params.page = pg;
    if (sz) params.size = sz;

    return `/search?${new URLSearchParams(params).toString()}`;
  };

  const products = await getAllProducts({
    query: q,
    category,
    price,
    rating,
    sort,
    page: Number(page),
    size,
  });

  const categories = await getAllCategories();

  return (
    <div className='container mx-auto px-4 lg:px-8 grid md:grid-cols-5 md:gap-8 my-6 md:my-10'>
      {/* Desktop Filter Sidebar - Hidden on mobile */}
      <div className='hidden md:block md:col-span-1 bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/30 h-fit sticky top-24'>
        {/* Category Links */}
        <div className='font-title-lg text-primary mb-4 border-b border-outline-variant/30 pb-2 flex items-center gap-2'>
          <span className="material-symbols-outlined text-secondary text-xl">category</span>
          Department
        </div>
        <div>
          <ul className='space-y-1'>
            <li>
              <Link
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm ${
                  (category === 'all' || category === '') 
                    ? 'bg-secondary/10 text-secondary font-bold border border-secondary/20 shadow-sm' 
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
                }`}
                href={getFilterUrl({ c: 'all' })}
              >
                {(category === 'all' || category === '') && <span className="material-symbols-outlined text-[16px]">check_circle</span>}
                Any
              </Link>
            </li>
            {categories.map((x) => {
              const isMatch = category.toLowerCase() === x.category.toLowerCase() ||
                (category.toLowerCase() === 'poshak' && x.category.toLowerCase().includes('poshak'));
              return (
                <li key={x.category}>
                  <Link
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm ${
                      isMatch
                        ? 'bg-secondary/10 text-secondary font-bold border border-secondary/20 shadow-sm' 
                        : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
                    }`}
                    href={getFilterUrl({ c: x.category })}
                  >
                    {isMatch && <span className="material-symbols-outlined text-[16px]">check_circle</span>}
                    {x.category}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Interactive Price Slider */}
        <div className='font-title-lg text-primary mb-4 mt-8 border-b border-outline-variant/30 pb-2 flex items-center gap-2'>
          <span className="material-symbols-outlined text-secondary text-xl">payments</span>
          Price Range
        </div>
        <div>
          <PriceSlider currentPrice={price} />
        </div>

        {/* Rating Links */}
        <div className='font-title-lg text-primary mb-4 mt-8 border-b border-outline-variant/30 pb-2 flex items-center gap-2'>
          <span className="material-symbols-outlined text-secondary text-xl">hotel_class</span>
          Customer Ratings
        </div>
        <div>
          <ul className='space-y-1'>
            <li>
              <Link
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm ${
                  rating === 'all' 
                    ? 'bg-secondary/10 text-secondary font-bold border border-secondary/20 shadow-sm' 
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
                }`}
                href={getFilterUrl({ r: 'all' })}
              >
                {rating === 'all' && <span className="material-symbols-outlined text-[16px]">check_circle</span>}
                Any
              </Link>
            </li>
            {ratings.map((r) => (
              <li key={r}>
                <Link
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm ${
                    rating === r.toString() 
                      ? 'bg-secondary/10 text-secondary font-bold border border-secondary/20 shadow-sm' 
                      : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
                  }`}
                  href={getFilterUrl({ r: `${r}` })}
                >
                  {rating === r.toString() && <span className="material-symbols-outlined text-[16px] text-amber-500">star</span>}
                  {`${r} stars & up`}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Products & Top Controls */}
      <div className='w-full md:col-span-4 space-y-6'>
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center bg-surface-container p-3 md:p-4 rounded-xl border border-outline-variant/30 gap-3'>
          
          {/* Active Filter Tags */}
          <div className='flex items-center text-on-surface-variant flex-wrap gap-2'>
            {/* Mobile Filter Button (visible on mobile only) */}
            <div className="md:hidden">
              <MobileFilterDrawer
                categories={categories}
                category={category}
                price={price}
                rating={rating}
              />
            </div>

            {q !== 'all' && q !== '' && <span className="bg-white px-2 py-1 rounded-md text-xs border shadow-sm">Query: {q}</span>}
            {category !== 'all' && category !== '' && <span className="bg-white px-2 py-1 rounded-md text-xs border shadow-sm">Category: {category}</span>}
            {price !== 'all' && <span className="bg-white px-2 py-1 rounded-md text-xs border shadow-sm">Price: {price}</span>}
            {rating !== 'all' && <span className="bg-white px-2 py-1 rounded-md text-xs border shadow-sm">Rating: {rating}+ stars</span>}
            
            {((q !== 'all' && q !== '') || (category !== 'all' && category !== '') || rating !== 'all' || price !== 'all') && (
              <Button variant='outline' size="sm" asChild className="h-7 px-2.5 text-xs border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                <Link href='/search'>Clear All</Link>
              </Button>
            )}
          </div>

          {/* Sort By Controls */}
          <div className="flex items-center gap-2 text-xs md:text-sm font-medium w-full sm:w-auto justify-between sm:justify-start">
            <span className="text-on-surface-variant whitespace-nowrap">Sort by:</span>
            <div className="flex bg-white rounded-lg border border-outline-variant/30 p-1 shadow-sm overflow-x-auto">
              {sortOrders.map((s) => (
                <Link
                  key={s}
                  className={`px-2.5 py-1 rounded-md capitalize transition-colors text-xs whitespace-nowrap ${sort == s ? 'bg-primary text-white font-medium shadow-sm' : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'}`}
                  href={getFilterUrl({ s })}
                >
                  {s}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'>
          {products.data.length === 0 && (
            <div className="col-span-full py-16 text-center text-gray-500">
              <span className="text-3xl mb-2 block">🦚</span>
              <p className="font-semibold text-base text-primary">No divine products found</p>
              <p className="text-xs text-gray-400 mt-1">Try adjusting your filters or search query</p>
              <Button asChild variant="outline" size="sm" className="mt-4">
                <Link href="/search">Reset Filters</Link>
              </Button>
            </div>
          )}
          {products.data.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;