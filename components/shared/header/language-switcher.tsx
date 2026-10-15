"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n/language-context";
import { Globe } from "lucide-react";
import { Language } from "@/lib/i18n/translations";

interface LanguageSwitcherProps {
  variant?: "topbar" | "header" | "mobile";
  className?: string;
}

export default function LanguageSwitcher({ variant = "topbar", className = "" }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();

  const handleSelect = (newLang: Language) => {
    if (newLang === language) return;
    setLanguage(newLang);
    // Reload immediately so all Server Components (Header, Layout, Page, Footer) re-render in the chosen language
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

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
            onClick={() => handleSelect("en")}
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
            onClick={() => handleSelect("hi")}
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
      <div className="inline-flex items-center bg-black/25 backdrop-blur-xs rounded-full p-0.5 border border-white/25 text-[11px] shadow-xs">
        <span className="pl-2 pr-1 text-[#E6C16A]">
          <Globe className="w-3.5 h-3.5 inline-block" />
        </span>
        <button
          type="button"
          onClick={() => handleSelect("en")}
          aria-label="Switch to English"
          className={`px-2.5 py-0.5 rounded-full font-bold transition-all ${
            language === "en"
              ? "bg-[#E6C16A] text-[#003020] shadow-sm scale-102"
              : "text-white/80 hover:text-white"
          }`}
        >
          EN
        </button>
        <button
          type="button"
          onClick={() => handleSelect("hi")}
          aria-label="हिन्दी भाषा चुनें"
          className={`px-2.5 py-0.5 rounded-full font-bold transition-all ${
            language === "hi"
              ? "bg-[#E6C16A] text-[#003020] shadow-sm scale-102"
              : "text-white/80 hover:text-white"
          }`}
        >
          हिन्दी
        </button>
      </div>
    </div>
  );
}
