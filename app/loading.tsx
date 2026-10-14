import React from "react";
import Image from "next/image";

const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FBF7EE] text-[#003020]">
      {/* Ambient spiritual golden & emerald light glow */}
      <div className="absolute w-96 h-96 rounded-full bg-gradient-radial from-[#E6C16A]/25 via-[#176B55]/10 to-transparent blur-3xl pointer-events-none" />

      {/* Main Sacred Chakra & Divine Emblem Container */}
      <div className="relative flex items-center justify-center mb-8">
        {/* Outer Rotating Sudarshan Chakra / Sacred Sunburst Ring */}
        <svg 
          className="w-48 h-48 md:w-60 md:h-60 text-[#C88A20]/45 animate-[spin_20s_linear_infinite]" 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="50" cy="50" r="41" stroke="#E6C16A" strokeWidth="0.8" opacity="0.6" />
          {/* 16 Sacred Rays / Petals */}
          {Array.from({ length: 16 }).map((_, i) => {
            const angle = (i * 360) / 16;
            return (
              <g key={i} transform={`rotate(${angle} 50 50)`}>
                <path
                  d="M50 4 Q51.5 12 50 16 Q48.5 12 50 4Z"
                  fill="url(#goldGradient)"
                  opacity="0.85"
                />
                <circle cx="50" cy="20" r="1.2" fill="#C88A20" />
              </g>
            );
          })}
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F9E29D" />
              <stop offset="50%" stopColor="#C88A20" />
              <stop offset="100%" stopColor="#8A5A0A" />
            </linearGradient>
          </defs>
        </svg>

        {/* Inner Counter-Rotating Lotus Ring */}
        <svg 
          className="absolute w-36 h-36 md:w-44 md:h-44 text-[#176B55]/55 animate-[spin_8s_linear_infinite_reverse]" 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="50" cy="50" r="32" stroke="currentColor" strokeWidth="1.2" strokeDasharray="6 4" />
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 360) / 8;
            return (
              <g key={i} transform={`rotate(${angle} 50 50)`}>
                <circle cx="50" cy="24" r="2.2" fill="#176B55" opacity="0.75" />
              </g>
            );
          })}
        </svg>

        {/* Center Glowing Divine Emblem with Larger Logo */}
        <div className="absolute w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-[#FFFDF9] via-[#FAF3E0] to-[#F1E0B4] border-2 border-[#E6C16A] shadow-[0_0_40px_rgba(200,138,32,0.5)] flex items-center justify-center p-3 animate-pulse duration-1000">
          <Image 
            src="/images/logo.webp" 
            alt="Madhav Shringaar" 
            width={120} 
            height={120} 
            className="w-full h-full object-contain filter drop-shadow-md select-none scale-105"
            priority
          />
        </div>
      </div>

      {/* Devotional Typography & Sacred Status */}
      <div className="text-center z-10 space-y-2 max-w-sm px-4">
        <h2 className="font-serif text-lg md:text-xl font-bold tracking-[0.25em] text-[#003020] uppercase">
          Madhav Shringaar
        </h2>
        
        <p className="text-xs text-[#C88A20] font-medium tracking-widest uppercase">
          Divine Adornments for Shri Laddu Gopal Ji
        </p>

        {/* Luxury Sliding Golden Shimmer Line */}
        <div className="w-48 h-0.5 mx-auto bg-[#E6C16A]/30 rounded-full overflow-hidden mt-3 relative">
          <div className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-[#C88A20] to-transparent animate-[shimmer_1.8s_ease-in-out_infinite]" />
        </div>

        <p className="text-[11px] text-neutral-500 tracking-wider pt-1 animate-pulse">
          Preparing Sacred Seva...
        </p>
      </div>
    </div>
  );
};

export default Loader;