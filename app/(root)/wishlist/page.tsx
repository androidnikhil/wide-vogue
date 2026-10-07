import { getWishlist } from '@/lib/actions/wishlist.actions';
import { Metadata } from 'next';
import ProductCard from '@/components/shared/product/product-card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Your Wishlist',
  description: 'View and manage your saved items',
};

export default async function WishlistPage() {
  const res = await getWishlist();
  const wishlistItems = res.data;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="h2-bold mb-8 text-primary">Your Wishlist</h1>
      
      {!res.success ? (
        <div className="text-center py-20 bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30">
          <span className="material-symbols-outlined text-6xl text-secondary/30 mb-4">favorite</span>
          <h2 className="text-2xl font-semibold mb-2">Please log in</h2>
          <p className="text-on-surface-variant mb-6">You need to log in to view and save items to your wishlist.</p>
          <Link href="/sign-in">
            <Button className="gold-gradient-btn text-white rounded-full px-8">Sign In</Button>
          </Link>
        </div>
      ) : wishlistItems.length === 0 ? (
        <div className="text-center py-20 bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30">
          <span className="material-symbols-outlined text-6xl text-secondary/30 mb-4">heart_broken</span>
          <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
          <p className="text-on-surface-variant mb-6">Explore our collection and find something you love!</p>
          <Link href="/search">
            <Button className="gold-gradient-btn text-white rounded-full px-8">Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {wishlistItems.map((item) => (
            // @ts-ignore
            <ProductCard key={item.id} product={item.product} />
          ))}
        </div>
      )}
    </div>
  );
}
