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
                  loading="lazy"
                />
              </Link>
              <p className="font-body-sm text-body-sm text-white/80 leading-relaxed">
                {t.footer.brandDesc}
              </p>
              <div className="flex items-center gap-3 pt-2">
                {/* Instagram */}
                <a 
                  aria-label="Madhav Shringaar Instagram" 
                  className="w-9 h-9 rounded-full bg-surface/10 hover:bg-[#E1306C] text-surface flex items-center justify-center transition-all duration-300 shadow-xs hover:scale-105 active:scale-95" 
                  href="https://www.instagram.com/madhav.shringaar?srtk=MXVkanU0a2wwbjB0OQ==" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  title="Follow us on Instagram @madhav.shringaar"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>

                {/* Facebook */}
                <a 
                  aria-label="Madhav Shringaar Facebook" 
                  className="w-9 h-9 rounded-full bg-surface/10 hover:bg-[#1877F2] text-surface flex items-center justify-center transition-all duration-300 shadow-xs hover:scale-105 active:scale-95" 
                  href="https://www.facebook.com/share/1CLPMdGbhJ/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  title="Connect on Facebook"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>

                {/* Pinterest */}
                <a 
                  aria-label="Madhav Shringaar Pinterest" 
                  className="w-9 h-9 rounded-full bg-surface/10 hover:bg-[#E60023] text-surface flex items-center justify-center transition-all duration-300 shadow-xs hover:scale-105 active:scale-95" 
                  href="https://pin.it/51M0t5Fs5" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  title="Follow us on Pinterest"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.332 1.357-.053.211-.174.257-.402.156-1.498-.696-2.433-2.883-2.433-4.639 0-3.774 2.743-7.242 7.906-7.242 4.15 0 7.377 2.957 7.377 6.911 0 4.123-2.599 7.441-6.206 7.441-1.212 0-2.351-.629-2.741-1.374l-.746 2.844c-.27 1.033-1.001 2.327-1.49 3.123 1.109.344 2.285.53 3.507.53 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
                  </svg>
                </a>

                {/* Direct WhatsApp Support */}
                <a 
                  aria-label="Direct WhatsApp Support" 
                  className="w-9 h-9 rounded-full bg-surface/10 hover:bg-[#25D366] text-surface flex items-center justify-center transition-all duration-300 shadow-xs hover:scale-105 active:scale-95" 
                  href="https://wa.me/917982160480?text=Radhe%20Radhe!%20I%20would%20like%20to%20inquire%20about%20Madhav%20Shringaar." 
                  target="_blank" 
                  rel="noopener noreferrer"
                  title="Chat on WhatsApp +91 79821 60480"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Col 2: Quick Links */}
            <div>
              <h3 className="font-title-lg text-title-lg text-secondary-fixed mb-4">{t.footer.quickSevaLinks}</h3>
              <ul className="space-y-2 text-white/90 font-label-md text-label-md">
                <li><Link className="hover:text-secondary-fixed transition-colors" href="/">{t.footer.home}</Link></li>
                <li><Link className="hover:text-secondary-fixed transition-colors" href="/about">About Our Story</Link></li>
                <li><Link className="hover:text-secondary-fixed transition-colors" href="/blogs">Seva &amp; Bhakti Blogs</Link></li>
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
