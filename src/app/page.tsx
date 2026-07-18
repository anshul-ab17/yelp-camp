import Link from 'next/link';
import { Compass, ShieldCheck, Map, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/10 via-background to-background"></div>
      
      {/* Hero content */}
      <div className="max-w-4xl mx-auto px-6 text-center py-20 flex flex-col items-center justify-center">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-primary-emerald text-xs font-semibold tracking-wide border border-emerald-500/20 mb-6 animate-fade-in">
          <span>🌲 YelpCamp Next.js Edition</span>
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-extrabold font-display tracking-tight text-foreground mb-6 leading-tight max-w-3xl">
          Explore the Wild, <br />
          <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-300">
            Share the Adventure
          </span>
        </h1>
        
        <p className="text-lg sm:text-xl text-foreground/70 max-w-2xl mb-10 leading-relaxed">
          Welcome to YelpCamp! Discover curated wilderness campsites, read real community reviews, and map out your next forest getaway.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Link
            href="/campgrounds"
            className="group flex items-center justify-center space-x-2 w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold bg-primary-emerald text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 transition-all duration-300 active:scale-[0.98] cursor-pointer"
          >
            <span>Explore Campgrounds</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
          <Link
            href="/campgrounds/new"
            className="flex items-center justify-center w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold glass-panel text-foreground hover:bg-emerald-500/5 transition-all duration-300 active:scale-[0.98]"
          >
            <span>Share a Campground</span>
          </Link>
        </div>
      </div>

      {/* Feature Section */}
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="flex flex-col items-start p-6 rounded-2xl glass-panel relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-300">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-primary-emerald mb-4">
              <Compass className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold font-display mb-2">Curated Wilderness</h3>
            <p className="text-sm text-foreground/60 leading-relaxed">
              Find and document hidden forest campsites, lake views, and mountain camping spots shared by outdoor enthusiasts.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-start p-6 rounded-2xl glass-panel relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-300">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-primary-emerald mb-4">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold font-display mb-2">Community Reviews</h3>
            <p className="text-sm text-foreground/60 leading-relaxed">
              Read transparent feedback on amenities, accessibility, wild life activity, and overall camping quality.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-start p-6 rounded-2xl glass-panel relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-300">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-primary-emerald mb-4">
              <Map className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold font-display mb-2">Interactive Mapping</h3>
            <p className="text-sm text-foreground/60 leading-relaxed">
              Track locations instantly with Mapbox maps showing exact camping positions and clusters in your area.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
