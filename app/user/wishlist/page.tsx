import { Metadata } from 'next';
import { getWishlist } from '@/lib/actions/wishlist.actions';
import ProductCard from '@/components/shared/product/product-card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'My Wishlist | Madhav Shringaar',
  description: 'View and manage your saved sacred poshak and shringaar items in your devotee account.',
};

export default async function UserWishlistPage() {
  const res = await getWishlist();
  const wishlistItems = res.success && res.data ? res.data : [];

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-xl md:text-2xl font-bold text-[#003020] flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-600 fill-rose-100" />
            My Saved Items & Wishlist
          </h1>
          <p className="text-xs md:text-sm text-neutral-500 mt-1">
            Devotional poshak, mukut, and shringaar items you saved for your beloved Kanha Ji.
          </p>
        </div>

        <Button
          asChild
          variant="outline"
          className="rounded-xl border-neutral-300 text-xs self-start sm:self-auto gap-2"
        >
          <Link href="/search">
            <ShoppingBag className="w-4 h-4 text-[#0F6F74]" />
            Explore Store
          </Link>
        </Button>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-200/80 p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <div>
            <h2 className="font-serif text-lg font-bold text-[#003020]">Your Wishlist is Empty</h2>
            <p className="text-xs md:text-sm text-neutral-500 max-w-md mx-auto mt-1">
              Tap the heart icon on any poshak or divine shringaar item to save it here for festive celebrations.
            </p>
          </div>
          <Button asChild className="bg-[#003020] hover:bg-[#002518] text-[#F3D98F] text-xs font-semibold rounded-xl h-10 px-6">
            <Link href="/search">
              Browse Sacred Collections
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {wishlistItems.map((item: any) => (
            <ProductCard key={item.id} product={item.product} />
          ))}
        </div>
      )}
    </div>
  );
}
