"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import PriceSlider from "./price-slider";

interface MobileFilterDrawerProps {
  categories: { category: string }[];
  category: string;
  price: string;
  rating: string;
}

const ratings = [4, 3, 2, 1];

export default function MobileFilterDrawer({
  categories,
  category,
  price,
  rating,
}: MobileFilterDrawerProps) {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();

  const getFilterUrl = ({ c, r }: { c?: string; r?: string }) => {
    const params = new URLSearchParams(searchParams.toString());
    if (c !== undefined) {
      if (c === "all" || !c) params.delete("category");
      else params.set("category", c);
    }
    if (r !== undefined) {
      if (r === "all" || !r) params.delete("rating");
      else params.set("rating", r);
    }
    params.set("page", "1");
    return `/search?${params.toString()}`;
  };

  // Count active filters
  let activeCount = 0;
  if (category && category !== "all" && category !== "") activeCount++;
  if (price && price !== "all") activeCount++;
  if (rating && rating !== "all") activeCount++;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg border border-outline-variant/30 text-xs font-bold text-primary shadow-sm hover:bg-[#FBF7EE] transition-colors"
        >
          <span className="material-symbols-outlined text-base text-[#C88A20]">tune</span>
          Filters
          {activeCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-[#176B55] text-white text-[10px] flex items-center justify-center font-bold">
              {activeCount}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="max-h-[85vh] rounded-t-2xl p-0 flex flex-col bg-[#FDF9F0]">
        <SheetHeader className="px-6 py-4 border-b border-outline-variant/20 flex flex-row items-center justify-between">
          <SheetTitle className="text-base font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-[#C88A20] text-lg">tune</span>
            Filters {activeCount > 0 && `(${activeCount})`}
          </SheetTitle>
          {activeCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-xs text-red-600 hover:text-red-700 h-auto p-0"
              onClick={() => setOpen(false)}
            >
              <Link href="/search">Clear All</Link>
            </Button>
          )}
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-3 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#C88A20] text-base">category</span>
              Department
            </h4>
            <div className="flex flex-wrap gap-2">
              <Link
                href={getFilterUrl({ c: "all" })}
                onClick={() => setOpen(false)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                  category === "all" || category === ""
                    ? "bg-[#176B55] text-white border-[#176B55] font-bold shadow-sm"
                    : "bg-white text-gray-700 border-outline-variant/30"
                }`}
              >
                All Categories
              </Link>
              {categories.map((c) => {
                const isMatch = category.toLowerCase() === c.category.toLowerCase() ||
                  (category.toLowerCase() === 'poshak' && c.category.toLowerCase().includes('poshak'));
                return (
                  <Link
                    key={c.category}
                    href={getFilterUrl({ c: c.category })}
                    onClick={() => setOpen(false)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                      isMatch
                        ? "bg-[#176B55] text-white border-[#176B55] font-bold shadow-sm"
                        : "bg-white text-gray-700 border-outline-variant/30"
                    }`}
                  >
                    {c.category}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="pt-2 border-t border-outline-variant/20">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-3 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#C88A20] text-base">payments</span>
              Price Range
            </h4>
            <PriceSlider currentPrice={price} onApply={() => setOpen(false)} />
          </div>

          {/* Customer Ratings */}
          <div className="pt-2 border-t border-outline-variant/20">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-3 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#C88A20] text-base">hotel_class</span>
              Customer Ratings
            </h4>
            <div className="flex flex-wrap gap-2">
              <Link
                href={getFilterUrl({ r: "all" })}
                onClick={() => setOpen(false)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                  rating === "all"
                    ? "bg-[#176B55] text-white border-[#176B55] font-bold shadow-sm"
                    : "bg-white text-gray-700 border-outline-variant/30"
                }`}
              >
                Any Rating
              </Link>
              {ratings.map((r) => (
                <Link
                  key={r}
                  href={getFilterUrl({ r: `${r}` })}
                  onClick={() => setOpen(false)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1 ${
                    rating === r.toString()
                      ? "bg-[#176B55] text-white border-[#176B55] font-bold shadow-sm"
                      : "bg-white text-gray-700 border-outline-variant/30"
                  }`}
                >
                  <span className="text-amber-500">★</span>
                  {r} Stars &amp; Up
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Done Button */}
        <div className="p-4 border-t border-outline-variant/20 bg-white">
          <Button
            type="button"
            onClick={() => setOpen(false)}
            className="w-full gold-gradient-btn text-primary-container font-bold text-sm py-2.5 rounded-xl shadow-md"
          >
            Done
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
