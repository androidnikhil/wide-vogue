"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n/language-context";
import { Globe } from "lucide-react";

interface LanguageSwitcherProps {
  variant?: "topbar" | "header" | "mobile";
  className?: string;
}

export default function LanguageSwitcher({ variant = "topbar", className = "" }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();

  if (variant === "mobile") {
    return (
      <div className={`flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-outline/10 ${className}`}>
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <Globe className="w-4 h-4 text-[#C88A20]" />
          <span>भाषा / Language</span>
        </div>
        <div className="flex items-center bg-white rounded-lg p-0.5 border border-outline/20 shadow-xs">
          <button
            type="button"
            onClick={() => setLanguage("en")}
            className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
              language === "en"
                ? "bg-[#003020] text-[#F3D98F] shadow-xs"
                : "text-neutral-600 hover:text-black"
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setLanguage("hi")}
            className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
              language === "hi"
                ? "bg-[#003020] text-[#F3D98F] shadow-xs"
                : "text-neutral-600 hover:text-black"
            }`}
          >
            हिन्दी
          </button>
        </div>
      </div>
    );
  }

  // Topbar or Header pill
  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div className="inline-flex items-center bg-black/20 backdrop-blur-xs rounded-full p-0.5 border border-white/20 text-[11px]">
        <span className="pl-1.5 pr-0.5 text-[#E6C16A]">
          <Globe className="w-3 h-3 inline-block" />
        </span>
        <button
          type="button"
          onClick={() => setLanguage("en")}
          aria-label="Switch to English"
          className={`px-2 py-0.5 rounded-full font-semibold transition-all ${
            language === "en"
              ? "bg-[#E6C16A] text-[#003020] shadow-xs"
              : "text-white/80 hover:text-white"
          }`}
        >
          EN
        </button>
        <button
          type="button"
          onClick={() => setLanguage("hi")}
          aria-label="हिन्दी में बदलें"
          className={`px-2 py-0.5 rounded-full font-semibold transition-all ${
            language === "hi"
              ? "bg-[#E6C16A] text-[#003020] shadow-xs"
              : "text-white/80 hover:text-white"
          }`}
        >
          हिन्दी
        </button>
      </div>
    </div>
  );
}
