import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getServerTranslations } from '@/lib/i18n/server';

export default async function Footer() {
  const { t } = await getServerTranslations();

  return (
    <>
      <footer className="bg-primary-container text-surface border-t border-secondary/20 docked full-width bottom mt-auto">
        <div className="w-full px-6 py-12 md:px-12 max-w-7xl mx-auto flex flex-col gap-8 text-surface">
          {/* Top Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Col 1: Brand Anchor Card */}
            <div className="space-y-4">
              <Link href="/" className="inline-block group transition-transform hover:opacity-95">
                <Image 
                  alt="Madhav Shringaar" 
                  width={360} 
                  height={125} 
                  className="h-24 sm:h-28 w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform" 
                  src="/images/logo-footer.webp" 
                  priority
                />
              </Link>
              <p className="font-body-sm text-body-sm text-white/80 leading-relaxed">
                {t.footer.brandDesc}
              </p>
              <div className="flex items-center gap-3 pt-2">
                <a 
                  aria-label="Direct WhatsApp Support" 
                  className="w-9 h-9 rounded-full bg-surface/10 hover:bg-[#25D366] text-surface flex items-center justify-center transition-all duration-300 shadow-xs" 
                  href="https://wa.me/917982160480?text=Radhe%20Radhe!%20I%20would%20like%20to%20inquire%20about%20Madhav%20Shringaar." 
                  target="_blank" 
                  rel="noopener noreferrer"
                  title="Chat on WhatsApp +91 79821 60480"
                >
                  <span className="material-symbols-outlined text-base">chat</span>
                </a>
                <a aria-label="YouTube" className="w-9 h-9 rounded-full bg-surface/10 hover:bg-secondary text-surface flex items-center justify-center transition-colors" href="#">
                  <span className="material-symbols-outlined text-base">play_arrow</span>
                </a>
                <a aria-label="Instagram" className="w-9 h-9 rounded-full bg-surface/10 hover:bg-secondary text-surface flex items-center justify-center transition-colors" href="#">
                  <span className="material-symbols-outlined text-base">photo_camera</span>
                </a>
              </div>
            </div>

            {/* Col 2: Quick Links */}
            <div>
              <h3 className="font-title-lg text-title-lg text-secondary-fixed mb-4">{t.footer.quickSevaLinks}</h3>
              <ul className="space-y-2 text-white/90 font-label-md text-label-md">
                <li><Link className="hover:text-secondary-fixed transition-colors" href="/">{t.footer.home}</Link></li>
                <li><Link className="hover:text-secondary-fixed transition-colors" href="/faq">{t.footer.helpFaq}</Link></li>
                <li><Link className="hover:text-secondary-fixed transition-colors" href="/size-chart">{t.footer.sizeChartGuide}</Link></li>
                <li><Link className="hover:text-secondary-fixed transition-colors" href="/policies/authenticity">{t.footer.fabricPromise}</Link></li>
                <li><Link className="hover:text-secondary-fixed transition-colors" href="/policies/shipping">{t.footer.shippingDelivery}</Link></li>
                <li><Link className="hover:text-secondary-fixed transition-colors" href="/policies/returns">{t.footer.exchangeReturns}</Link></li>
              </ul>
            </div>

            {/* Col 3: Shop Collections */}
            <div>
              <h3 className="font-title-lg text-title-lg text-secondary-fixed mb-4">{t.footer.devotionalCategories}</h3>
              <ul className="space-y-2 text-white/90 font-label-md text-label-md">
                <li><Link className="hover:text-secondary-fixed transition-colors" href="/search?category=Poshak">{t.footer.poshakCollection}</Link></li>
                <li><Link className="hover:text-secondary-fixed transition-colors" href="/search?category=Mukut%20%26%20Pagdi">{t.footer.mukutPagdi}</Link></li>
                <li><Link className="hover:text-secondary-fixed transition-colors" href="/search?category=Jewellery%20%26%20Mala">{t.footer.motiMalaHaar}</Link></li>
                <li><Link className="hover:text-secondary-fixed transition-colors" href="/search?category=Bansuri">{t.footer.goldenBansuri}</Link></li>
                <li><Link className="hover:text-secondary-fixed transition-colors" href="/search?category=Singhasan">{t.footer.carvedSinghasan}</Link></li>
                <li><Link className="hover:text-secondary-fixed transition-colors" href="/search?category=Festive%20Sets">{t.footer.festiveComboSets}</Link></li>
              </ul>
            </div>

            {/* Col 4: Devotee Support */}
            <div>
              <h3 className="font-title-lg text-title-lg text-secondary-fixed mb-4">{t.footer.devoteeCareSupport}</h3>
              <div className="space-y-3 font-body-sm text-body-sm text-white/80">
                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-secondary-fixed text-lg mt-0.5">call</span>
                  <div>
                    <div className="font-bold text-surface">
                      <a href="tel:+917078211946" className="hover:text-secondary transition-colors">+91 70782 11946</a>
                    </div>
                    <p className="text-xs">{t.footer.directCalling} {t.footer.callingTime}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[#25D366] text-lg mt-0.5">chat</span>
                  <div>
                    <div className="font-bold text-surface">
                      <a href="https://wa.me/917982160480?text=Radhe%20Radhe!%20I%20would%20like%20to%20inquire%20about%20Madhav%20Shringaar." target="_blank" rel="noopener noreferrer" className="hover:text-[#25D366] transition-colors">+91 79821 60480</a>
                    </div>
                    <p className="text-xs">{t.footer.whatsappSeva}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-secondary-fixed text-lg mt-0.5">mail</span>
                  <div>
                    <a href="mailto:info@madhavshringaar.com" className="font-bold text-surface hover:text-secondary transition-colors">info@madhavshringaar.com</a>
                    <p className="text-xs">{t.footer.devotionalInquiries}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-secondary-fixed text-lg mt-0.5">location_on</span>
                  <div>
                    <p className="text-xs font-semibold text-surface">{t.footer.operatingHubs}</p>
                    <p className="text-xs text-white/70">{t.footer.operatingLocations}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Popular Devotional Searches — Organic SEO internal links */}
          <div className="border-t border-secondary/20 pt-6 text-[11px] leading-relaxed text-white/70">
            <p className="font-semibold text-secondary-fixed mb-2 uppercase tracking-wider text-[10px]">Popular Searches:</p>
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              <Link href="/search?category=Poshak" className="hover:text-secondary-fixed transition-colors">Laddu Gopal dress online</Link>
              <span>•</span>
              <Link href="/search?category=Poshak" className="hover:text-secondary-fixed transition-colors">Laddu Gopal poshak</Link>
              <span>•</span>
              <Link href="/search?category=Poshak" className="hover:text-secondary-fixed transition-colors">Kanha Ji dress online</Link>
              <span>•</span>
              <Link href="/search?category=Designer+Poshak" className="hover:text-secondary-fixed transition-colors">Laddu Gopal designer dress</Link>
              <span>•</span>
              <Link href="/search?category=Winter+Woolen+Poshak" className="hover:text-secondary-fixed transition-colors">Laddu Gopal winter dress</Link>
              <span>•</span>
              <Link href="/search?category=Cotton+Summer+Poshak" className="hover:text-secondary-fixed transition-colors">Laddu Gopal summer dress</Link>
              <span>•</span>
              <Link href="/search?category=Mukut+%26+Pagdi" className="hover:text-secondary-fixed transition-colors">Laddu Gopal mukut online</Link>
              <span>•</span>
              <Link href="/search?category=Mukut+%26+Pagdi" className="hover:text-secondary-fixed transition-colors">Kanha Ji mukut online</Link>
              <span>•</span>
              <Link href="/search?category=Jewellery+%26+Mala" className="hover:text-secondary-fixed transition-colors">Laddu Gopal jewellery set</Link>
              <span>•</span>
              <Link href="/search?category=Jewellery+%26+Mala" className="hover:text-secondary-fixed transition-colors">Laddu Gopal mala & kanthi mala</Link>
              <span>•</span>
              <Link href="/search?category=Complete+Shringar" className="hover:text-secondary-fixed transition-colors">Laddu Gopal shringaar online</Link>
              <span>•</span>
              <Link href="/search?category=Complete+Shringar" className="hover:text-secondary-fixed transition-colors">Kanha Ji shringaar online</Link>
              <span>•</span>
              <Link href="/search?category=Festive+Sets" className="hover:text-secondary-fixed transition-colors">Laddu Gopal poshak with mukut and mala</Link>
              <span>•</span>
              <Link href="/search?category=Poshak" className="hover:text-secondary-fixed transition-colors">Thakur Ji poshak online</Link>
              <span>•</span>
              <Link href="/search?category=Poshak" className="hover:text-secondary-fixed transition-colors">Banke Bihari shringaar items</Link>
              <span>•</span>
              <Link href="/search?category=Poshak" className="hover:text-secondary-fixed transition-colors">Krishna Ji dress online</Link>
              <span>•</span>
              <Link href="/size-chart" className="hover:text-secondary-fixed transition-colors">Laddu Gopal dress size 0 to 6</Link>
              <span>•</span>
              <Link href="/policies/shipping" className="hover:text-secondary-fixed transition-colors">Buy Laddu Gopal dress online in India</Link>
              <span>•</span>
              <Link href="/policies/shipping" className="hover:text-secondary-fixed transition-colors">Laddu Gopal dress with free delivery</Link>
              <span>•</span>
              <Link href="/policies/shipping" className="hover:text-secondary-fixed transition-colors">Laddu Gopal dresses with COD</Link>
              <span>•</span>
              <Link href="/policies/shipping" className="hover:text-secondary-fixed transition-colors">Laddu Gopal poshak in Agra</Link>
              <span>•</span>
              <Link href="/policies/shipping" className="hover:text-secondary-fixed transition-colors">Laddu Gopal dress delivery in Noida</Link>
              <span>•</span>
              <Link href="/policies/shipping" className="hover:text-secondary-fixed transition-colors">Laddu Gopal dresses in Vrindavan</Link>
              <span>•</span>
              <Link href="/policies/shipping" className="hover:text-secondary-fixed transition-colors">Laddu Gopal shringaar shop in Mathura</Link>
              <span>•</span>
              <Link href="/policies/shipping" className="hover:text-secondary-fixed transition-colors">Laddu Gopal shringaar delivery across India</Link>
            </div>
          </div>

          {/* Bottom Disclaimer & Copyright */}
          <div className="border-t border-secondary/20 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-on-primary-container">
            <p>{t.footer.copyright}</p>
            <div className="flex items-center gap-4">
              <Link className="hover:text-secondary-fixed transition-colors" href="/policies/privacy">{t.footer.privacyPolicy}</Link>
              <span>•</span>
              <Link className="hover:text-secondary-fixed transition-colors" href="/policies/terms">{t.footer.termsOfService}</Link>
              <span>•</span>
              <Link className="hover:text-secondary-fixed transition-colors" href="/policies/authenticity">{t.footer.authenticityPromise}</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
