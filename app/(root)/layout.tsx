import Footer from "@/components/footer";
import Header from "@/components/shared/header";
import Link from "next/link";
import Image from "next/image";
import { getMyCart } from "@/lib/actions/cart.action";
import CartDrawerWrapper from "@/components/shared/cart/cart-drawer-wrapper";
import WhatsAppFloatingButton from "@/components/shared/whatsapp-floating-button";
import { getServerTranslations } from "@/lib/i18n/server";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cart = await getMyCart();
  const { t } = await getServerTranslations();

  return (
    <div className="flex min-h-screen bg-background">
      {/* LEFT: Fixed/slim navigation sidebar */}
      <aside className="hidden lg:flex flex-col w-[88px] border-r border-outline/20 bg-surface items-center py-6 justify-between fixed h-full left-0 top-0 z-50 shadow-xs">
        <div className="flex flex-col gap-5 items-center w-full">
           <Link href="/" className="hover:scale-105 transition-transform group" title="Madhav Shringaar">
             <div className="w-[66px] h-[66px] rounded-2xl bg-white shadow-xs border border-[#E6C16A]/50 p-1 flex items-center justify-center group-hover:shadow-md group-hover:border-[#C88A20] transition-all overflow-hidden">
               <Image 
                 src="/images/icons/favicon.webp" 
                 alt="Madhav Shringaar" 
                 width={72} 
                 height={72} 
                 className="w-full h-full object-contain group-hover:scale-105 transition-transform" 
                 priority
               />
             </div>
           </Link>
           <nav className="flex flex-col gap-4 mt-2 text-on-surface-variant w-full">
              <Link href="/search?category=Poshak" className="hover:text-secondary transition-colors flex flex-col items-center gap-1.5 group w-full py-1">
                 <div className="w-[64px] h-[64px] rounded-2xl bg-white shadow-xs border border-neutral-200/90 p-0.5 flex items-center justify-center group-hover:border-[#E6C16A] group-hover:shadow-md group-hover:scale-105 transition-all duration-300 overflow-hidden">
                   <Image 
                     src="/images/icons/poshak-3d.webp" 
                     alt={t.header.sidebarPoshak} 
                     width={80} 
                     height={80} 
                     className="w-full h-full object-contain p-0.5 group-hover:scale-110 transition-transform duration-300" 
                   />
                 </div>
                 <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-600 group-hover:text-[#003020] transition-colors">{t.header.sidebarPoshak}</span>
              </Link>
              <Link href="/search?category=Mukut%20%26%20Pagdi" className="hover:text-secondary transition-colors flex flex-col items-center gap-1.5 group w-full py-1">
                 <div className="w-[64px] h-[64px] rounded-2xl bg-white shadow-xs border border-neutral-200/90 p-0.5 flex items-center justify-center group-hover:border-[#E6C16A] group-hover:shadow-md group-hover:scale-105 transition-all duration-300 overflow-hidden">
                   <Image 
                     src="/images/icons/mukut-3d.webp" 
                     alt={t.header.sidebarMukut} 
                     width={80} 
                     height={80} 
                     className="w-full h-full object-contain p-0.5 group-hover:scale-110 transition-transform duration-300" 
                   />
                 </div>
                 <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-600 group-hover:text-[#003020] transition-colors">{t.header.sidebarMukut}</span>
              </Link>
              <Link href="/search?category=Bansuri" className="hover:text-secondary transition-colors flex flex-col items-center gap-1.5 group w-full py-1">
                 <div className="w-[64px] h-[64px] rounded-2xl bg-white shadow-xs border border-neutral-200/90 p-0.5 flex items-center justify-center group-hover:border-[#E6C16A] group-hover:shadow-md group-hover:scale-105 transition-all duration-300 overflow-hidden">
                   <Image 
                     src="/images/icons/bansuri-3d.webp" 
                     alt={t.header.sidebarBansuri} 
                     width={80} 
                     height={80} 
                     className="w-full h-full object-contain p-0.5 group-hover:scale-110 transition-transform duration-300" 
                   />
                 </div>
                 <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-600 group-hover:text-[#003020] transition-colors">{t.header.sidebarBansuri}</span>
              </Link>
              <Link href="/cart" className="hover:text-secondary transition-colors flex flex-col items-center gap-1.5 group relative w-full py-1">
                 <div className="w-[64px] h-[64px] rounded-2xl bg-white shadow-xs border border-neutral-200/90 p-0.5 flex items-center justify-center group-hover:border-[#E6C16A] group-hover:shadow-md group-hover:scale-105 transition-all duration-300 relative overflow-hidden">
                   <Image 
                     src="/images/icons/cart-3d.webp" 
                     alt={t.header.sidebarCart} 
                     width={80} 
                     height={80} 
                     className="w-full h-full object-contain p-0.5 group-hover:scale-110 transition-transform duration-300" 
                   />
                 </div>
                 {cart && cart.items.length > 0 && (
                   <span className="absolute -top-0.5 right-1.5 w-5 h-5 bg-[#C88A20] text-white rounded-full text-[11px] flex items-center justify-center font-bold shadow-xs z-10">
                     {cart.items.reduce((a, c) => a + c.qty, 0)}
                   </span>
                 )}
                 <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-600 group-hover:text-[#003020] transition-colors">{t.header.sidebarCart}</span>
              </Link>
           </nav>
        </div>
      </aside>

      {/* CENTER: Main visual website experience */}
      <div className="flex-1 lg:ml-[88px] flex flex-col min-h-screen relative bg-surface-container-low/30">
        <Header />
        <main className="flex-1 pb-10">
            {children}
        </main>
        <Footer />
      </div>

      {/* RIGHT: Compact shopping/cart panel */}
      <CartDrawerWrapper cart={cart} />

      {/* Floating WhatsApp Quick Connect Button */}
      <WhatsAppFloatingButton />
    </div>
  );
}
