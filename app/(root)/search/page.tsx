import ProductCard from '@/components/shared/product/product-card';
import { Button } from '@/components/ui/button';
import {
  getAllProducts,
  getAllCategories,
} from '@/lib/actions/product.action';
import Link from 'next/link';

const prices = [
  {
    name: '₹500 to ₹1000',
    value: '500-1000',
  },
  {
    name: '1000 to ₹2000',
    value: '1000-2000',
  },
  {
    name: '₹2000 to ₹3000',
    value: '2000-3000',
  },
  {
    name: '₹3000 to ₹5000',
    value: '3000-5000',
  },
  {
    name: '₹5000 to ₹6000',
    value: '5000-6000',
  },
];

const ratings = [4, 3, 2, 1];

const sortOrders = ['newest', 'lowest', 'highest', 'rating'];

export async function generateMetadata(props: {
  searchParams: Promise<{
    q: string;
    category: string;
    price: string;
    rating: string;
  }>;
}) {
  const {
    q = 'all',
    category = 'all',
    price = 'all',
    rating = 'all',
  } = await props.searchParams;

  const isQuerySet = q && q !== 'all' && q.trim() !== '';
  const isCategorySet =
    category && category !== 'all' && category.trim() !== '';
  const isPriceSet = price && price !== 'all' && price.trim() !== '';
  const isRatingSet = rating && rating !== 'all' && rating.trim() !== '';

  if (isQuerySet || isCategorySet || isPriceSet || isRatingSet) {
    return {
      title: `
      Search ${isQuerySet ? q : ''} 
      ${isCategorySet ? `: Category ${category}` : ''}
      ${isPriceSet ? `: Price ${price}` : ''}
      ${isRatingSet ? `: Rating ${rating}` : ''}`,
    };
  } else {
    return {
      title: 'Search Products',
    };
  }
}

const SearchPage = async (props: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    price?: string;
    rating?: string;
    sort?: string;
    page?: string;
  }>;
}) => {
  const {
    q = 'all',
    category = 'all',
    price = 'all',
    rating = 'all',
    sort = 'newest',
    page = '1',
  } = await props.searchParams;

  // Construct filter url
  const getFilterUrl = ({
    c,
    p,
    s,
    r,
    pg,
  }: {
    c?: string;
    p?: string;
    s?: string;
    r?: string;
    pg?: string;
  }) => {
    const params = { q, category, price, rating, sort, page };

    if (c) params.category = c;
    if (p) params.price = p;
    if (s) params.sort = s;
    if (r) params.rating = r;
    if (pg) params.page = pg;

    return `/search?${new URLSearchParams(params).toString()}`;
  };

  const products = await getAllProducts({
    query: q,
    category,
    price,
    rating,
    sort,
    page: Number(page),
  });

  const categories = await getAllCategories();

  return (
    <div className='container mx-auto px-4 lg:px-8 grid md:grid-cols-5 md:gap-8 my-10'>
      <div className='md:col-span-1 bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/30 h-fit sticky top-24'>
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
            {categories.map((x) => (
              <li key={x.category}>
                <Link
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm ${
                    category === x.category 
                      ? 'bg-secondary/10 text-secondary font-bold border border-secondary/20 shadow-sm' 
                      : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
                  }`}
                  href={getFilterUrl({ c: x.category })}
                >
                  {category === x.category && <span className="material-symbols-outlined text-[16px]">check_circle</span>}
                  {x.category}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* Price Links */}
        <div className='font-title-lg text-primary mb-4 mt-8 border-b border-outline-variant/30 pb-2 flex items-center gap-2'>
          <span className="material-symbols-outlined text-secondary text-xl">payments</span>
          Price
        </div>
        <div>
          <ul className='space-y-1'>
            <li>
              <Link
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm ${
                  price === 'all' 
                    ? 'bg-secondary/10 text-secondary font-bold border border-secondary/20 shadow-sm' 
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
                }`}
                href={getFilterUrl({ p: 'all' })}
              >
                {price === 'all' && <span className="material-symbols-outlined text-[16px]">check_circle</span>}
                Any
              </Link>
            </li>
            {prices.map((p) => (
              <li key={p.value}>
                <Link
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm ${
                    price === p.value 
                      ? 'bg-secondary/10 text-secondary font-bold border border-secondary/20 shadow-sm' 
                      : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
                  }`}
                  href={getFilterUrl({ p: p.value })}
                >
                  {price === p.value && <span className="material-symbols-outlined text-[16px]">check_circle</span>}
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
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
      
      <div className='md:col-span-4 space-y-6'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center bg-surface-container p-4 rounded-xl border border-outline-variant/30'>
          <div className='flex items-center text-on-surface-variant flex-wrap gap-2'>
            {q !== 'all' && q !== '' && <span className="bg-white px-2 py-1 rounded-md text-sm border shadow-sm">Query: {q}</span>}
            {category !== 'all' && category !== '' && <span className="bg-white px-2 py-1 rounded-md text-sm border shadow-sm">Category: {category}</span>}
            {price !== 'all' && <span className="bg-white px-2 py-1 rounded-md text-sm border shadow-sm">Price: {price}</span>}
            {rating !== 'all' && <span className="bg-white px-2 py-1 rounded-md text-sm border shadow-sm">Rating: {rating}+ stars</span>}
            
            {((q !== 'all' && q !== '') || (category !== 'all' && category !== '') || rating !== 'all' || price !== 'all') && (
              <Button variant='outline' size="sm" asChild className="ml-2 h-7 px-3 text-xs border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                <Link href='/search'>Clear Filters</Link>
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2 mt-4 md:mt-0 text-sm font-medium">
            <span className="text-on-surface-variant">Sort by:</span>
            <div className="flex bg-white rounded-lg border border-outline-variant/30 p-1 shadow-sm">
              {sortOrders.map((s) => (
                <Link
                  key={s}
                  className={`px-3 py-1 rounded-md capitalize transition-colors ${sort == s ? 'bg-primary text-white font-medium shadow-sm' : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'}`}
                  href={getFilterUrl({ s })}
                >
                  {s}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {products.data.length === 0 && <div>No products found</div>}
          {products.data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;