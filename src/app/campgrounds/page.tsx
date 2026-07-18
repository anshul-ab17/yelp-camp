'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ClusterMap from '@/components/ClusterMap';
import SearchBar from '@/components/SearchBar';
import { MapPin, Plus, Star, Compass, Loader2, Sparkles, Coffee } from 'lucide-react';

interface CampgroundType {
  _id: string;
  title: string;
  location: string;
  price: number;
  description: string;
  images: {
    url: string;
    filename: string;
  }[];
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
}

function CampgroundsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchQuery = searchParams.get('search') || '';

  const [campgrounds, setCampgrounds] = useState<CampgroundType[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const loaderRef = useRef<HTMLDivElement>(null);

  // Fetch initial list of campgrounds when search changes
  useEffect(() => {
    async function fetchInitial() {
      setLoading(true);
      try {
        const res = await fetch(`/api/campgrounds?limit=15&offset=0&search=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        setCampgrounds(data.campgrounds || []);
        setHasMore(data.hasMore);
        setOffset(data.campgrounds?.length || 0);
      } catch (err) {
        console.error('Failed to load campgrounds:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchInitial();
  }, [searchQuery]);

  // Load more campgrounds on scroll
  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const res = await fetch(
        `/api/campgrounds?limit=15&offset=${offset}&search=${encodeURIComponent(searchQuery)}`
      );
      const data = await res.json();
      if (data.campgrounds && data.campgrounds.length > 0) {
        setCampgrounds((prev) => [...prev, ...data.campgrounds]);
        setOffset((prev) => prev + data.campgrounds.length);
        setHasMore(data.hasMore);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Failed to load more campgrounds:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  // Intersection observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, offset, loading, loadingMore]);

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-[calc(100vh-4rem)] bg-background">
      
      {/* Left Side: Directory Listings (TripAdvisor Style Cards) */}
      <div className="w-full lg:w-3/5 xl:w-2/3 px-4 sm:px-6 lg:px-8 py-8 flex flex-col space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-950/5 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold font-display tracking-tight text-foreground">
              Campsites in the United States
            </h1>
            <p className="text-sm text-foreground/50 mt-1">
              Showing {campgrounds.length} campsites matching your preferences
            </p>
          </div>
          <Link
            href="/campgrounds/new"
            className="inline-flex items-center justify-center space-x-1.5 px-5 py-2.5 rounded-xl bg-primary-emerald text-white hover:bg-emerald-600 font-semibold text-sm shadow-md active:scale-[0.98] transition-all cursor-pointer w-fit"
          >
            <Plus className="h-4 w-4" />
            <span>Add Campground</span>
          </Link>
        </div>

        {/* Filters and search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <SearchBar />
        </div>

        {/* Campgrounds List */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary-emerald" />
            <p className="text-sm text-foreground/50 font-semibold">Loading YelpCamp Directory...</p>
          </div>
        ) : campgrounds.length === 0 ? (
          <div className="py-20 text-center rounded-3xl bg-emerald-500/5 border border-emerald-500/10 flex flex-col items-center justify-center">
            <Compass className="h-10 w-10 text-primary-emerald/50 mb-3" />
            <h3 className="text-lg font-bold">No campgrounds found</h3>
            <p className="text-sm text-foreground/55 mt-1 max-w-sm">
              We couldn't find any campsites matching your search. Try adjusting your query or create a new one!
            </p>
          </div>
        ) : (
          <div className="flex flex-col space-y-6">
            {campgrounds.map((campground, index) => (
              <div
                key={campground._id}
                className="group flex flex-col md:flex-row rounded-3xl glass-panel overflow-hidden border border-emerald-500/10 shadow-md hover:shadow-2xl hover:shadow-emerald-600/5 hover:border-emerald-500/35 hover:-translate-y-1 transition-all duration-300 ease-out relative w-full bg-white/80"
              >
                {/* Image (Left on Desktop) */}
                <div className="relative h-60 md:h-auto md:w-2/5 shrink-0 overflow-hidden bg-emerald-950/10">
                  <img
                    src={campground.images[0]?.url || '/seeds/camp_1.jpg'}
                    alt={campground.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Floating index count */}
                  <span className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-background/95 backdrop-blur-sm text-xs font-bold text-foreground border border-emerald-500/15 shadow-sm z-10">
                    #{index + 1}
                  </span>
                </div>

                {/* Details (Right on Desktop) */}
                <div className="p-6 md:p-8 flex flex-col justify-between flex-grow">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold font-display text-foreground group-hover:text-primary-emerald transition-colors leading-snug line-clamp-1">
                          {campground.title}
                        </h3>
                        <p className="flex items-center text-xs text-foreground/55 mt-1">
                          <MapPin className="h-3.5 w-3.5 mr-1 text-primary-emerald" />
                          <span>{campground.location}</span>
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-foreground/45">Price from</p>
                        <p className="text-xl font-extrabold text-primary-emerald">${campground.price}<span className="text-xs font-semibold text-foreground/50">/night</span></p>
                      </div>
                    </div>

                    {/* Review Bubble mockup like TripAdvisor */}
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="h-4.5 w-4.5 fill-emerald-500 text-emerald-500"
                          />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-foreground/80">5.0</span>
                      <span className="text-xs text-foreground/40 font-semibold">(Verified Camp)</span>
                    </div>

                    {/* Features list mock */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-emerald-500/10 text-primary-emerald text-[11px] font-bold">
                        <Sparkles className="h-3 w-3 mr-1" /> Verified
                      </span>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-yellow-500/10 text-yellow-700 text-[11px] font-bold">
                        <Coffee className="h-3 w-3 mr-1" /> Fire Ring
                      </span>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-500/10 text-slate-700 text-[11px] font-bold">
                        🏕️ Tent Pitch
                      </span>
                    </div>

                    <p className="text-sm text-foreground/60 leading-relaxed line-clamp-2 pt-2">
                      {campground.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-5 border-t border-emerald-950/5 flex items-center justify-between">
                    <Link
                      href={`/campgrounds/${campground._id}`}
                      className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-emerald-500/10 text-primary-emerald hover:bg-emerald-500/20 text-sm font-bold transition-all"
                    >
                      <span>View Details</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Infinite Scroll Loader Target */}
        <div ref={loaderRef} className="py-10 flex items-center justify-center">
          {loadingMore && (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin text-primary-emerald" />
              <p className="text-xs text-foreground/50 font-semibold">Fetching more campsites...</p>
            </div>
          )}
          {!hasMore && campgrounds.length > 0 && (
            <p className="text-xs text-foreground/35 font-medium">You've reached the end of the campsite directory.</p>
          )}
        </div>

      </div>

      {/* Right Side: Sticky Cluster Map (TripAdvisor Style Sticky Column) */}
      <div className="hidden lg:block lg:w-2/5 xl:w-1/3 h-[calc(100vh-4rem)] sticky top-16 border-l border-emerald-950/5 shadow-2xl overflow-hidden bg-slate-50">
        <ClusterMap campgrounds={campgrounds} />
      </div>

    </div>
  );
}

export default function CampgroundsIndex() {
  return (
    <Suspense fallback={
      <div className="py-20 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary-emerald" />
        <p className="text-sm text-foreground/50 font-semibold">Loading YelpCamp Directory...</p>
      </div>
    }>
      <CampgroundsContent />
    </Suspense>
  );
}
