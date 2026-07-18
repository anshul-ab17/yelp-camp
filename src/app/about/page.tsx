import Link from 'next/link';
import { Compass, BookOpen, Heart, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] py-16 px-4 sm:px-6 lg:px-8 overflow-hidden flex flex-col justify-center">
      {/* Blurred background image pattern */}
      <div 
        className="absolute inset-0 -z-10 bg-cover bg-center filter blur-xl scale-110 opacity-15"
        style={{ backgroundImage: "url('/bg-about.jpg')" }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white/40 via-white/80 to-white" />

      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-primary-emerald text-xs font-semibold tracking-wide border border-emerald-500/20">
            <span>🌲 Our Story</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-display tracking-tight text-foreground">
            About YelpCamp
          </h1>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Connecting campers with the best wilderness campsites and outdoor memories across the country.
          </p>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
          <div className="p-8 rounded-3xl glass-panel border border-emerald-500/10 shadow-lg space-y-4 bg-white/70">
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-primary-emerald w-fit">
              <Compass className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold font-display">Our Mission</h3>
            <p className="text-sm text-foreground/75 leading-relaxed">
              We believe that nature is meant to be shared. Our goal is to catalog free and public campsites across the country, letting users discover the perfect escape, write reviews, and share their experiences with others.
            </p>
          </div>

          <div className="p-8 rounded-3xl glass-panel border border-emerald-500/10 shadow-lg space-y-4 bg-white/70">
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-primary-emerald w-fit">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold font-display">Community Driven</h3>
            <p className="text-sm text-foreground/75 leading-relaxed">
              Every campground, rating, image, and description is uploaded by a member of the YelpCamp community. This keeps our listings raw, honest, and updated in real-time by actual campers who've been there.
            </p>
          </div>
        </div>

        {/* Brand values card */}
        <div className="p-8 sm:p-10 rounded-3xl glass-panel border border-emerald-500/10 shadow-xl space-y-6 text-center max-w-2xl mx-auto bg-white/80">
          <Heart className="h-10 w-10 text-red-500 mx-auto fill-red-500/20" />
          <h3 className="text-2xl font-bold font-display">Leave No Trace</h3>
          <p className="text-sm text-foreground/70 leading-relaxed">
            As outdoor lovers, we advocate for responsible camping. We encourage all YelpCamp users to respect wildlife, clean up trash, and practice "Leave No Trace" principles to preserve these beautiful environments for future generations.
          </p>
          <div className="pt-4">
            <Link
              href="/campgrounds"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary-emerald text-white hover:bg-emerald-600 font-semibold text-sm shadow-md transition-all cursor-pointer"
            >
              Start Exploring
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
