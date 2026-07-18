import Link from 'next/link';
import { Compass, ShieldCheck, Map, ArrowRight, BookOpen, Heart, Users, HelpCircle, Star, Shield } from 'lucide-react';

export default function Home() {
  const faqs = [
    {
      question: 'Is it free to list a campground on YelpCamp?',
      answer: 'Yes! YelpCamp is completely free for all users. You can add new campgrounds, upload pictures, and write reviews without any hidden charges or subscription fees.',
      icon: HelpCircle,
    },
    {
      question: 'How do I add a new campground?',
      answer: 'Simply log in to your account, click on the "Add Campground" button on the campsite directory page, fill out the details (title, location, price, description, images), and press Publish. Our system will geocode the address onto our interactive map!',
      icon: HelpCircle,
    },
    {
      question: 'How do I edit or delete my campground listings?',
      answer: 'Only the user who created the campground has permission to edit or delete it. When logged in, navigate to the campground\'s details page. If you are the author, you will see "Edit Details" and "Delete Campground" control buttons.',
      icon: HelpCircle,
    },
    {
      question: 'What are the rules for reviews and ratings?',
      answer: 'We want to keep ratings honest and helpful. Reviewers must be logged in. Be descriptive about your experience, accessibility, cell signal, wildlife, and amenities. Reviews can be deleted by their authors at any time.',
      icon: Star,
    },
    {
      question: 'Are all campgrounds verified?',
      answer: 'While we encourage accurate entries, YelpCamp listings are user-submitted. Campers should exercise caution, review map positions, read multiple community reviews, and verify campsite conditions/rules locally.',
      icon: Shield,
    },
  ];

  return (
    <div className="flex flex-col w-full">
      
      {/* 1. HERO SECTION (HOME) */}
      <section 
        id="home"
        className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center overflow-hidden bg-cover bg-center scroll-mt-16"
        style={{ backgroundImage: "linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.75)), url('/hero-bg.jpg')" }}
      >
        <div className="max-w-4xl mx-auto px-6 text-center py-20 flex flex-col items-center justify-center relative z-10">
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold tracking-wide border border-emerald-500/30 mb-6 backdrop-blur-md">
            <span>🌲 YelpCamp Next.js Edition</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-extrabold font-display tracking-tight text-white mb-6 leading-tight max-w-3xl">
            Explore the Wild, <br />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              Share the Adventure
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mb-10 leading-relaxed">
            Welcome to YelpCamp! Discover curated wilderness campsites, read real community reviews, and map out your next forest getaway.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link
              href="/campgrounds"
              className="group flex items-center justify-center space-x-2 w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 transition-all duration-300 active:scale-[0.98] cursor-pointer"
            >
              <span>Explore Campgrounds</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            <Link
              href="/campgrounds/new"
              className="flex items-center justify-center w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold bg-white/10 hover:bg-white/15 border border-white/20 text-white backdrop-blur-md transition-all duration-300 active:scale-[0.98] cursor-pointer"
            >
              <span>Share a Campground</span>
            </Link>
          </div>
        </div>

        {/* Hero Features Grid */}
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 pb-20 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-start p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 backdrop-blur-md group hover:border-emerald-400/30 transition-all duration-300">
              <div className="p-3 rounded-xl bg-emerald-500/25 text-emerald-300 mb-4">
                <Compass className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold font-display text-white mb-2">Curated Wilderness</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Find forest campsites, lake views, and mountain camping spots shared by outdoor enthusiasts.
              </p>
            </div>

            <div className="flex flex-col items-start p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 backdrop-blur-md group hover:border-emerald-400/30 transition-all duration-300">
              <div className="p-3 rounded-xl bg-emerald-500/25 text-emerald-300 mb-4">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold font-display text-white mb-2">Community Reviews</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Read transparent feedback on amenities, accessibility, wildlife, and overall camping quality.
              </p>
            </div>

            <div className="flex flex-col items-start p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 backdrop-blur-md group hover:border-emerald-400/30 transition-all duration-300">
              <div className="p-3 rounded-xl bg-emerald-500/25 text-emerald-300 mb-4">
                <Map className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold font-display text-white mb-2">Interactive Mapping</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Track locations instantly with Mapbox maps showing exact camping positions and clusters in your area.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT SECTION */}
      <section 
        id="about"
        className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-background border-t border-emerald-950/5 scroll-mt-16"
      >
        {/* Blurred background image pattern */}
        <div 
          className="absolute inset-0 -z-10 bg-cover bg-center filter blur-xl scale-110 opacity-15"
          style={{ backgroundImage: "url('/bg-about.jpg')" }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white/40 via-white/80 to-white" />

        <div className="max-w-5xl mx-auto space-y-12 relative z-10">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-primary-emerald text-xs font-semibold tracking-wide border border-emerald-500/20">
              <span>🌲 Our Story</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-foreground">
              About YelpCamp
            </h2>
            <p className="text-base sm:text-lg text-foreground/60 max-w-2xl mx-auto">
              Connecting campers with the best wilderness campsites and outdoor memories across the country.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
            <div className="p-8 rounded-3xl glass-panel border border-emerald-500/10 shadow-lg space-y-4 bg-white/75 hover:border-emerald-500/20 transition-all duration-300">
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-primary-emerald w-fit">
                <Compass className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold font-display">Our Mission</h3>
              <p className="text-sm text-foreground/75 leading-relaxed">
                We believe that nature is meant to be shared. Our goal is to catalog free and public campsites across the country, letting users discover the perfect escape, write reviews, and share their experiences with others.
              </p>
            </div>

            <div className="p-8 rounded-3xl glass-panel border border-emerald-500/10 shadow-lg space-y-4 bg-white/75 hover:border-emerald-500/20 transition-all duration-300">
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-primary-emerald w-fit">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold font-display">Community Driven</h3>
              <p className="text-sm text-foreground/75 leading-relaxed">
                Every campground, rating, image, and description is uploaded by a member of the YelpCamp community. This keeps our listings raw, honest, and updated in real-time by actual campers who\'ve been there.
              </p>
            </div>
          </div>

          <div className="p-8 sm:p-10 rounded-3xl glass-panel border border-emerald-500/10 shadow-xl space-y-6 text-center max-w-2xl mx-auto bg-white/80">
            <Heart className="h-10 w-10 text-red-500 mx-auto fill-red-500/15" />
            <h3 className="text-2xl font-bold font-display">Leave No Trace</h3>
            <p className="text-sm text-foreground/70 leading-relaxed">
              As outdoor lovers, we advocate for responsible camping. We encourage all YelpCamp users to respect wildlife, clean up trash, and practice "Leave No Trace" principles to preserve these beautiful environments for future generations.
            </p>
          </div>
        </div>
      </section>

      {/* 3. FAQ SECTION */}
      <section 
        id="faq"
        className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-background border-t border-emerald-950/5 scroll-mt-16"
      >
        {/* Blurred background image pattern */}
        <div 
          className="absolute inset-0 -z-10 bg-cover bg-center filter blur-xl scale-110 opacity-15"
          style={{ backgroundImage: "url('/bg-faq.jpg')" }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white/40 via-white/80 to-white" />

        <div className="max-w-5xl mx-auto space-y-12 relative z-10 w-full">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-primary-emerald text-xs font-semibold tracking-wide border border-emerald-500/20">
              <span>❓ Frequently Asked Questions</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-foreground">
              FAQ & Support
            </h2>
            <p className="text-base sm:text-lg text-foreground/60 max-w-2xl mx-auto">
              Find quick answers to common questions about YelpCamp listings, reviews, and maps.
            </p>
          </div>

          <div className="space-y-6 max-w-3xl mx-auto pt-6">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="p-6 sm:p-8 rounded-3xl glass-panel border border-emerald-500/10 shadow-md bg-white/75 hover:border-emerald-500/20 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-primary-emerald mt-0.5 shrink-0">
                    <faq.icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold font-display text-foreground leading-snug">
                      {faq.question}
                    </h3>
                    <p className="text-sm text-foreground/65 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
