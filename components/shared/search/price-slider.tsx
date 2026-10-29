"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

interface PriceSliderProps {
  currentPrice?: string;
  onApply?: () => void;
}

const quickPresets = [
  { label: "Under ₹1,000", value: "0-1000" },
  { label: "₹1,000 - ₹2,500", value: "1000-2500" },
  { label: "₹2,500 - ₹5,000", value: "2500-5000" },
  { label: "₹5,000+", value: "5000-10000" },
];

export default function PriceSlider({ currentPrice = "all", onApply }: PriceSliderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const parseInitialPrices = () => {
    if (currentPrice && currentPrice !== "all" && currentPrice.includes("-")) {
      const [minStr, maxStr] = currentPrice.split("-");
      return {
        min: Number(minStr) || 0,
        max: Number(maxStr) || 10000,
      };
    }
    return { min: 0, max: 10000 };
  };

  const initial = parseInitialPrices();
  const [minPrice, setMinPrice] = useState<number>(initial.min);
  const [maxPrice, setMaxPrice] = useState<number>(initial.max);

  useEffect(() => {
    const updated = parseInitialPrices();
    setMinPrice(updated.min);
    setMaxPrice(updated.max);
  }, [currentPrice]);

  const applyPriceRange = (min: number, max: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (min === 0 && max === 10000) {
      params.delete("price");
    } else {
      params.set("price", `${min}-${max}`);
    }
    params.set("page", "1");
    router.push(`/search?${params.toString()}`);
    if (onApply) onApply();
  };

  const handlePreset = (presetVal: string) => {
    const [minStr, maxStr] = presetVal.split("-");
    const min = Number(minStr);
    const max = Number(maxStr);
    setMinPrice(min);
    setMaxPrice(max);
    applyPriceRange(min, max);
  };

  return (
    <div className="space-y-4">
      {/* Slider Visual */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-semibold text-primary">
          <span>₹{minPrice.toLocaleString("en-IN")}</span>
          <span className="text-[#C88A20]">Max: ₹{maxPrice.toLocaleString("en-IN")}</span>
        </div>
        <input
          type="range"
          min={500}
          max={10000}
          step={100}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full h-2 bg-[#E6C16A]/30 rounded-lg appearance-none cursor-pointer accent-[#C88A20]"
        />
      </div>

      {/* Manual Input Fields & Apply Button */}
      <div className="flex items-center gap-1.5">
        <div className="flex-1 min-w-0 flex items-center border border-outline-variant/40 rounded-lg px-1.5 py-1.5 bg-white shadow-2xs focus-within:border-[#C88A20]">
          <span className="text-xs text-gray-400 mr-0.5 shrink-0">₹</span>
          <input
            type="number"
            min={0}
            max={maxPrice}
            value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))}
            className="w-full min-w-0 text-xs font-medium text-primary outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            placeholder="Min"
          />
        </div>
        <span className="text-xs text-gray-400 shrink-0">-</span>
        <div className="flex-1 min-w-0 flex items-center border border-outline-variant/40 rounded-lg px-1.5 py-1.5 bg-white shadow-2xs focus-within:border-[#C88A20]">
          <span className="text-xs text-gray-400 mr-0.5 shrink-0">₹</span>
          <input
            type="number"
            min={minPrice}
            max={10000}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full min-w-0 text-xs font-medium text-primary outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            placeholder="Max"
          />
        </div>
        <Button
          type="button"
          size="sm"
          onClick={() => applyPriceRange(minPrice, maxPrice)}
          className="h-8 px-2.5 shrink-0 text-xs font-bold gold-gradient-btn text-primary-container rounded-lg hover:brightness-105 shadow-2xs"
        >
          Go
        </Button>
      </div>

      {/* Quick Presets */}
      <div className="space-y-1">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
          Quick Filters
        </p>
        <div className="flex flex-wrap gap-1.5">
          {quickPresets.map((preset) => {
            const isSelected = currentPrice === preset.value;
            return (
              <button
                key={preset.value}
                type="button"
                onClick={() => handlePreset(preset.value)}
                className={`text-[11px] px-2.5 py-1 rounded-md transition-all font-medium ${
                  isSelected
                    ? "bg-[#C88A20] text-white shadow-sm font-bold"
                    : "bg-[#FBF7EE] text-gray-700 hover:bg-[#E6C16A]/20 border border-outline-variant/20"
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
