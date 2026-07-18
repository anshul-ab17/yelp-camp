'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('search') || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/campgrounds?search=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/campgrounds');
    }
  };

  const handleClear = () => {
    setQuery('');
    router.push('/campgrounds');
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-md relative flex items-center">
      <div className="relative w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/45" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or location..."
          className="w-full pl-12 pr-10 py-3 rounded-2xl glass-panel border border-emerald-950/10 dark:border-emerald-100/10 focus:outline-none focus:ring-2 focus:focus:ring-primary-emerald/20 focus:border-primary-emerald transition-all text-sm shadow-md shadow-emerald-500/2"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-emerald-500/10 text-foreground/50 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <button
        type="submit"
        className="ml-3 px-5 py-3 rounded-2xl bg-primary-emerald hover:bg-emerald-600 text-white font-semibold text-sm transition-all shadow-md shadow-emerald-500/10 active:scale-[0.98] cursor-pointer"
      >
        Search
      </button>
    </form>
  );
}
