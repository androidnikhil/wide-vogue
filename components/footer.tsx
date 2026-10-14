import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <>
      <footer className="bg-primary-container text-surface border-t border-secondary/20 docked full-width bottom mt-auto">
<div className="w-full px-6 py-12 md:px-12 max-w-7xl mx-auto flex flex-col gap-8 text-surface">
{/* Top Columns */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
{/* Col 1: Brand Anchor Card */}
<div className="space-y-4">
<div className="bg-surface p-3 rounded-lg inline-block shadow-sm">
<Image alt="Madhav Shringaar" width={180} height={70} className="h-16 w-auto object-contain" src="/images/logo.png" />
</div>
<p className="font-body-sm text-body-sm text-white/80 leading-relaxed">
            Bringing divine adornments, authentic fabrics, and revered seva essentials to every Kanha devotee with eternal dedication.
          </p>
<div className="flex items-center gap-3 pt-2">
<a aria-label="WhatsApp" className="w-8 h-8 rounded-full bg-surface/10 hover:bg-secondary text-surface flex items-center justify-center transition-colors" href="https://wa.me/917982160480" target="_blank" rel="noopener noreferrer">
<span className="material-symbols-outlined text-sm">chat</span>
</a>
<a aria-label="YouTube" className="w-8 h-8 rounded-full bg-surface/10 hover:bg-secondary text-surface flex items-center justify-center transition-colors" href="#">
<span className="material-symbols-outlined text-sm">play_arrow</span>
</a>
<a aria-label="Instagram" className="w-8 h-8 rounded-full bg-surface/10 hover:bg-secondary text-surface flex items-center justify-center transition-colors" href="#">
<span className="material-symbols-outlined text-sm">photo_camera</span>
</a>
</div>
</div>
{/* Col 2: Quick Links */}
<div>
<h3 className="font-title-lg text-title-lg text-secondary-fixed mb-4">Quick Seva Links</h3>
<ul className="space-y-2 text-white/90 font-label-md text-label-md">
<li><Link className="hover:text-secondary-fixed transition-colors" href="/">Home</Link></li>
<li><Link className="hover:text-secondary-fixed transition-colors" href="/faq">Help Centre &amp; Devotee FAQs</Link></li>
<li><Link className="hover:text-secondary-fixed transition-colors" href="/size-chart">Size Chart Guide (0-6 No.)</Link></li>
<li><Link className="hover:text-secondary-fixed transition-colors" href="/policies/authenticity">Authentic Fabric Promise</Link></li>
<li><Link className="hover:text-secondary-fixed transition-colors" href="/policies/shipping">Shipping &amp; Pan-India Delivery</Link></li>
<li><Link className="hover:text-secondary-fixed transition-colors" href="/policies/returns">Exchange &amp; Return Policy</Link></li>
</ul>
</div>
{/* Col 3: Shop Collections */}
<div>
<h3 className="font-title-lg text-title-lg text-secondary-fixed mb-4">Devotional Categories</h3>
<ul className="space-y-2 text-white/90 font-label-md text-label-md">
<li><a className="hover:text-secondary-fixed transition-colors" href="#categories">Poshak Collection</a></li>
<li><a className="hover:text-secondary-fixed transition-colors" href="#categories">Mukut &amp; Pagdi</a></li>
<li><a className="hover:text-secondary-fixed transition-colors" href="#categories">Moti Mala &amp; Haar</a></li>
<li><a className="hover:text-secondary-fixed transition-colors" href="#categories">Golden Bansuri</a></li>
<li><a className="hover:text-secondary-fixed transition-colors" href="#categories">Carved Singhasan</a></li>
<li><a className="hover:text-secondary-fixed transition-colors" href="#combos">Festive Combo Sets</a></li>
</ul>
</div>
{/* Col 4: Devotee Support */}
<div>
<h3 className="font-title-lg text-title-lg text-secondary-fixed mb-4">Devotee Care Support</h3>
<div className="space-y-3 font-body-sm text-body-sm text-white/80">
<div className="flex items-start gap-2.5">
<span className="material-symbols-outlined text-secondary-fixed text-lg mt-0.5">call</span>
<div>
<div className="font-bold text-surface">
  <a href="tel:+917982160480" className="hover:text-secondary transition-colors">+91 79821 60480</a>
</div>
<p className="text-xs">Mon-Sat (10:00 AM - 7:00 PM IST)</p>
</div>
</div>
<div className="flex items-start gap-2.5">
<span className="material-symbols-outlined text-secondary-fixed text-lg mt-0.5">mail</span>
<div>
<a href="mailto:info@madhavshringaar.com" className="font-bold text-surface hover:text-secondary transition-colors">info@madhavshringaar.com</a>
<p className="text-xs">Devotional Inquiries &amp; Orders</p>
</div>
</div>
<div className="flex items-start gap-2.5">
<span className="material-symbols-outlined text-secondary-fixed text-lg mt-0.5">location_on</span>
<div>
  <p className="text-xs font-semibold text-surface">Operating from Agra &amp; Noida</p>
  <p className="text-xs text-white/70">Uttar Pradesh / Delhi NCR | Express Pan-India Delivery</p>
</div>
</div>
</div>
</div>
</div>
{/* Bottom Disclaimer & Copyright */}
<div className="border-t border-secondary/20 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-on-primary-container">
<p>© 2025 Madhav Shringaar. Dedicated with utmost reverent seva to Shri Laddu Gopal Ji. All Rights Reserved.</p>
<div className="flex items-center gap-4">
<Link className="hover:text-secondary-fixed transition-colors" href="/policies/privacy">Privacy Policy</Link>
<span>•</span>
<Link className="hover:text-secondary-fixed transition-colors" href="/policies/terms">Terms of Service</Link>
<span>•</span>
<Link className="hover:text-secondary-fixed transition-colors" href="/policies/authenticity">Authenticity Promise</Link>
</div>
</div>
</div>
</footer>
    </>
  );
}
