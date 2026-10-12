"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";

const NotFoundPage = () => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen px-4 py-8 md:py-12 bg-[#FBF7EE] overflow-hidden selection:bg-[#E6C16A]/30">
      {/* Ambient Celestial Glows */}
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-[#176B55]/15 via-[#E6C16A]/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#E6C16A]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Brand Logo */}
      <Link href="/" className="mb-6 z-10 transition-transform duration-300 hover:scale-105" title="Go to Madhav Shringaar">
        <Image
          src="/images/logo.png"
          alt={`${APP_NAME} logo`}
          width={220}
          height={80}
          className="h-20 md:h-24 w-auto object-contain drop-shadow-sm"
          priority
        />
      </Link>

      {/* Main Container: Full Body Kanha Ji + 404 Card */}
      <div className="relative z-10 w-full max-w-4xl flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-10">
        
        {/* Left / Side: Full Body Animated Little Kanha Ji Waving */}
        <div className="relative flex flex-col items-center flex-shrink-0 animate-[kanhaFloatWave_4.5s_ease-in-out_infinite]">
          
          {/* Clean English Speech Bubble */}
          <div className="relative mb-3 px-4 py-2 rounded-2xl bg-white border-2 border-[#E6C16A] shadow-md text-center max-w-[220px] animate-[bubblePulse_3s_ease-in-out_infinite]">
            <p className="text-xs font-bold text-[#176B55]">
              Hello Devotee! 🦚
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Looking for this page?
            </p>
            {/* Speech Bubble Pointer */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-white border-r-2 border-b-2 border-[#E6C16A] rotate-45" />
          </div>

          {/* Character Container with Soft Divine Halo */}
          <div className="relative flex items-center justify-center">
            {/* Soft Glowing Aura behind Little Krishna */}
            <div className="absolute w-60 h-60 rounded-full bg-gradient-to-tr from-[#E6C16A]/40 via-[#176B55]/20 to-[#E6C16A]/30 blur-2xl -z-10 animate-[pulse_4s_ease-in-out_infinite]" />
            
            {/* Full Body Little Krishna Image Waving Hello */}
            <Image
              src="/images/kanha-waving.png"
              alt="Cute Little Kanha Ji Waving Hello"
              width={280}
              height={380}
              className="w-56 md:w-64 lg:w-72 h-auto object-contain drop-shadow-2xl"
              priority
            />
          </div>
        </div>

        {/* Right / Center: 404 Devotional Card */}
        <div className="w-full max-w-md rounded-3xl border border-[#C88A20]/25 bg-white/95 backdrop-blur-md shadow-xl p-8 md:p-10 text-center flex flex-col items-center">
          
          {/* Grand 404 Gradient Display */}
          <div className="mb-2">
            <span className="text-6xl md:text-7xl font-black font-serif tracking-tighter bg-gradient-to-r from-[#176B55] via-[#C88A20] to-[#176B55] bg-clip-text text-transparent drop-shadow-sm">
              404
            </span>
          </div>

          {/* Clean English Heading */}
          <h1 className="text-2xl md:text-3xl font-extrabold font-serif text-[#003020] mb-2 tracking-tight">
            Page Not Found
          </h1>

          {/* Minimal Description */}
          <p className="text-xs md:text-sm text-gray-500 max-w-xs mb-6 leading-relaxed">
            The page you are looking for does not exist or has been moved.
          </p>

          {/* Primary Action Button */}
          <Button
            asChild
            className="w-full gold-gradient-btn text-primary-container font-bold text-sm py-3.5 rounded-xl shadow-md hover:brightness-105 active:scale-95 transition-all mb-6 flex items-center justify-center gap-2"
          >
            <Link href="/">
              <span className="material-symbols-outlined text-lg">home</span>
              Go Back to Home
            </Link>
          </Button>

          {/* Quick Seva Navigation Links */}
          <div className="w-full pt-5 border-t border-[#C88A20]/20">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Explore Collections
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/search?category=Poshak"
                className="px-3 py-2 rounded-lg bg-[#FBF7EE] hover:bg-[#E6C16A]/20 border border-secondary/20 text-xs font-medium text-[#18221F] hover:text-primary transition-colors flex items-center justify-center gap-1.5"
              >
                <span>🦚</span> Poshak
              </Link>
              <Link
                href="/search?category=Mukut%20%26%20Bansuri"
                className="px-3 py-2 rounded-lg bg-[#FBF7EE] hover:bg-[#E6C16A]/20 border border-secondary/20 text-xs font-medium text-[#18221F] hover:text-primary transition-colors flex items-center justify-center gap-1.5"
              >
                <span>👑</span> Mukut &amp; Flute
              </Link>
              <Link
                href="/search?category=Jewellery%20%26%20Mala"
                className="px-3 py-2 rounded-lg bg-[#FBF7EE] hover:bg-[#E6C16A]/20 border border-secondary/20 text-xs font-medium text-[#18221F] hover:text-primary transition-colors flex items-center justify-center gap-1.5"
              >
                <span>📿</span> Jewellery
              </Link>
              <Link
                href="/track-order"
                className="px-3 py-2 rounded-lg bg-[#FBF7EE] hover:bg-[#E6C16A]/20 border border-secondary/20 text-xs font-medium text-[#18221F] hover:text-primary transition-colors flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-xs">local_shipping</span> Track Order
              </Link>
            </div>
          </div>

        </div>

      </div>

      {/* Gentle Floating Animation Keyframes */}
      <style jsx>{`
        @keyframes kanhaFloatWave {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(1deg);
          }
        }
        @keyframes bubblePulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }
      `}</style>
    </div>
  );
};

export default NotFoundPage;
