'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Maximize2, X, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';

const Productimages = ({ images }: { images: string[] }) => {
  const [current, setCurrent] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const safeImages = images && images.length > 0 ? images : ['/images/devotional/complete_shringar.webp'];

  const handleNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % safeImages.length);
  }, [safeImages.length]);

  const handlePrev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + safeImages.length) % safeImages.length);
  }, [safeImages.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsLightboxOpen(false);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isLightboxOpen, handleNext, handlePrev]);

  return (
    <div className="space-y-4">
      {/* Main Image Container — object-contain so NO deity crown or poshak is cropped */}
      <div
        className="relative w-full aspect-square bg-linear-to-b from-[#FDFCF9] via-white to-[#F8F6F0] rounded-2xl overflow-hidden border border-outline-variant/30 shadow-xs flex items-center justify-center p-2 sm:p-4 group cursor-zoom-in"
        onClick={() => setIsLightboxOpen(true)}
      >
        <Image
          src={safeImages[current]}
          alt="Product divine shringaar view"
          width={1000}
          height={1000}
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="w-full h-full object-contain object-center transition-transform duration-500 group-hover:scale-[1.02]"
          priority
        />

        {/* Click to Zoom Pill */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsLightboxOpen(true);
          }}
          className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md border border-neutral-200/80 text-neutral-800 hover:text-primary flex items-center gap-1.5 text-xs font-semibold transition-all hover:scale-105 active:scale-95"
        >
          <Maximize2 className="w-3.5 h-3.5 text-amber-700" />
          <span>Full View</span>
        </button>
      </div>

      {/* Thumbnails strip */}
      {safeImages.length > 1 && (
        <div className="flex flex-wrap gap-2.5 sm:gap-3 pt-1">
          {safeImages.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setCurrent(index)}
              className={cn(
                'w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden cursor-pointer active:scale-95 border-2 transition-all shadow-2xs p-1 bg-white flex items-center justify-center',
                index === current
                  ? 'border-secondary ring-2 ring-secondary/20 scale-105 shadow-sm'
                  : 'border-outline-variant/30 opacity-70 hover:opacity-100 hover:border-secondary/50'
              )}
            >
              <Image
                src={image}
                alt={`Thumbnail ${index + 1}`}
                width={100}
                height={100}
                sizes="80px"
                className="object-contain w-full h-full"
              />
            </button>
          ))}
        </div>
      )}

      {/* Full-Screen Lightbox Modal — Portal directly into document.body to break out of all parent stacking contexts */}
      {isLightboxOpen && mounted && typeof document !== 'undefined' && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[99999] bg-black/95 flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200 select-none"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Top Bar Controls */}
          <div
            className="flex items-center justify-between text-white z-30 pb-2 w-full max-w-7xl mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Prominent Back Button */}
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 text-white text-xs sm:text-sm font-semibold transition-all border border-white/20 shadow-lg cursor-pointer"
              title="Back to Product (Esc)"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Back</span>
            </button>

            {/* Image Counter */}
            {safeImages.length > 1 && (
              <span className="text-xs sm:text-sm text-neutral-300 bg-white/10 px-3 py-1 rounded-full font-mono border border-white/10 shadow-xs">
                {current + 1} / {safeImages.length}
              </span>
            )}

            {/* Prominent Close Button */}
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 text-white text-xs sm:text-sm font-semibold transition-all border border-white/20 shadow-lg cursor-pointer"
              title="Close Full View (Esc)"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Close</span>
            </button>
          </div>

          {/* Central Full View: Pure Product Image Only */}
          <div
            className="relative flex-1 flex items-center justify-center min-h-0 py-2 sm:py-4 overflow-hidden"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsLightboxOpen(false);
            }}
          >
            {/* Prev Button */}
            {safeImages.length > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-2 sm:left-6 z-30 p-3 sm:p-3.5 rounded-full bg-black/60 hover:bg-black/90 active:scale-95 text-white border border-white/20 transition-all shadow-2xl cursor-pointer"
                title="Previous Image (Left Arrow)"
              >
                <ChevronLeft className="w-5 h-5 sm:w-7 sm:h-7" />
              </button>
            )}

            <div className="relative max-h-[82vh] max-w-[92vw] flex items-center justify-center">
              <Image
                src={safeImages[current]}
                alt="Full-size divine product view"
                width={1600}
                height={1600}
                sizes="95vw"
                className="max-h-[82vh] max-w-[92vw] w-auto h-auto object-contain rounded-xl drop-shadow-2xl select-none"
                priority
              />
            </div>

            {/* Next Button */}
            {safeImages.length > 1 && (
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-2 sm:right-6 z-30 p-3 sm:p-3.5 rounded-full bg-black/60 hover:bg-black/90 active:scale-95 text-white border border-white/20 transition-all shadow-2xl cursor-pointer"
                title="Next Image (Right Arrow)"
              >
                <ChevronRight className="w-5 h-5 sm:w-7 sm:h-7" />
              </button>
            )}
          </div>

          {/* Bottom Thumbnails Strip (only if multiple images) */}
          {safeImages.length > 1 && (
            <div
              className="flex items-center justify-center gap-2 pt-2 z-30 overflow-x-auto py-1"
              onClick={(e) => e.stopPropagation()}
            >
              {safeImages.map((image, index) => (
                <button
                  key={`lightbox-${image}-${index}`}
                  type="button"
                  onClick={() => setCurrent(index)}
                  className={cn(
                    'w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden border-2 transition-all p-0.5 bg-white shrink-0 cursor-pointer',
                    index === current
                      ? 'border-amber-400 scale-105 shadow-md ring-2 ring-amber-400/40'
                      : 'border-white/20 opacity-50 hover:opacity-90'
                  )}
                >
                  <Image
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    width={60}
                    height={60}
                    className="object-contain w-full h-full"
                  />
                </button>
              ))}
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
};

export default Productimages;