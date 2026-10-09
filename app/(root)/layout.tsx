import Footer from "@/components/footer";
import Header from "@/components/shared/header";
import Link from "next/link";
import { getMyCart } from "@/lib/actions/cart.action";
import { formatCurrency } from "@/lib/utils";
import CartDrawerWrapper from "@/components/shared/cart/cart-drawer-wrapper";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  const cart = await getMyCart();

  return (
    <div className="flex min-h-screen bg-background">
      {/* LEFT: Fixed/slim navigation sidebar */}
      <aside className="hidden lg:flex flex-col w-20 border-r border-outline/20 bg-surface items-center py-8 justify-between fixed h-full left-0 top-0 z-50 shadow-sm">
        <div className="flex flex-col gap-8 items-center w-full">
           <Link href="/" className="hover:scale-105 transition-transform">
             <span className="material-symbols-outlined text-4xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>spa</span>
           </Link>
           <nav className="flex flex-col gap-8 mt-10 text-on-surface-variant w-full">
              <Link href="/search?category=Poshak" className="hover:text-secondary transition-colors flex flex-col items-center gap-1 group w-full py-2">
                 <span className="material-symbols-outlined group-hover:scale-110 transition-transform text-2xl">checkroom</span>
                 <span className="text-[10px] font-bold uppercase tracking-wider">Poshak</span>
              </Link>
              <Link href="/search?category=Mukut" className="hover:text-secondary transition-colors flex flex-col items-center gap-1 group w-full py-2">
                 <span className="material-symbols-outlined group-hover:scale-110 transition-transform text-2xl">diamond</span>
                 <span className="text-[10px] font-bold uppercase tracking-wider">Mukut</span>
              </Link>
              <Link href="/search?category=Bansuri" className="hover:text-secondary transition-colors flex flex-col items-center gap-1 group w-full py-2">
                 <span className="material-symbols-outlined group-hover:scale-110 transition-transform text-2xl">music_note</span>
                 <span className="text-[10px] font-bold uppercase tracking-wider">Bansuri</span>
              </Link>
              <Link href="/cart" className="hover:text-secondary transition-colors flex flex-col items-center gap-1 group relative w-full py-2">
                 <span className="material-symbols-outlined group-hover:scale-110 transition-transform text-2xl">shopping_bag</span>
                 <span className="text-[10px] font-bold uppercase tracking-wider">Cart</span>
                 {cart && cart.items.length > 0 && (
                   <span className="absolute top-0 right-3 w-4 h-4 bg-error text-white rounded-full text-[9px] flex items-center justify-center font-bold">
                     {cart.items.reduce((a, c) => a + c.qty, 0)}
                   </span>
                 )}
              </Link>
           </nav>
        </div>
      </aside>

      {/* CENTER: Main visual website experience */}
      <div className="flex-1 lg:ml-20 flex flex-col min-h-screen relative bg-surface-container-low/30">
        <Header />
        <main className="flex-1 pb-10">
            {children}
        </main>
        <Footer />
      </div>

      {/* RIGHT: Compact shopping/cart panel */}
      <CartDrawerWrapper cart={cart} />
    </div>
  );
}
