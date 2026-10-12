'use client';

import { useState } from 'react';
import Form from 'next/form';

export default function MobileSearch() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative md:hidden">
      <button
        type="button"
        aria-label={isOpen ? 'Close search' : 'Open search'}
        aria-expanded={isOpen}
        aria-controls="mobile-search-form"
        onClick={() => setIsOpen((open) => !open)}
        className="p-1.5 text-on-surface hover:text-secondary active:scale-95"
      >
        <span className="material-symbols-outlined text-[22px]">
          {isOpen ? 'close' : 'search'}
        </span>
      </button>

      {isOpen && (
        <Form
          id="mobile-search-form"
          action="/search"
          role="search"
          className="absolute right-0 top-full z-[60] mt-2 flex w-[min(20rem,calc(100vw-1.5rem))] items-center gap-2 rounded-lg border border-outline-variant/40 bg-surface-container-lowest p-2 shadow-xl"
        >
          <label className="sr-only" htmlFor="mobile-search-query">
            Search products
          </label>
          <input
            id="mobile-search-query"
            name="q"
            type="search"
            autoFocus
            placeholder="Search products..."
            className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-on-surface outline-none placeholder:text-on-surface-variant"
          />
          <button
            type="submit"
            className="gold-gradient-btn rounded-md px-3 py-2 text-sm font-semibold text-primary-container"
          >
            Search
          </button>
        </Form>
      )}
    </div>
  );
}
