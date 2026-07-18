import { HelpCircle, Star, Shield, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function FAQPage() {
  const faqs = [
    {
      question: 'Is it free to list a campground on YelpCamp?',
      answer: 'Yes! YelpCamp is completely free for all users. You can add new campgrounds, upload pictures, and write reviews without any hidden charges or subscription fees.',
      icon: HelpCircle,
    },
    {
      question: 'How do I add a new campground?',
      answer: 'Simply log in to your account, click on the "Add Campground" button on the campsite directory page, fill out the details (title, location, price, description, images), and press Publish. Our system will automatically geocode the address onto our interactive map!',
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
    <div className="relative min-h-[calc(100vh-4rem)] py-16 px-4 sm:px-6 lg:px-8 overflow-hidden flex flex-col justify-center">
      {/* Blurred background image pattern */}
      <div 
        className="absolute inset-0 -z-10 bg-cover bg-center filter blur-xl scale-110 opacity-15"
        style={{ backgroundImage: "url('/bg-faq.jpg')" }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white/40 via-white/80 to-white" />

      <div className="max-w-4xl mx-auto space-y-12 relative z-10 w-full">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-primary-emerald text-xs font-semibold tracking-wide border border-emerald-500/20">
            <span>❓ Frequently Asked Questions</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-display tracking-tight text-foreground">
            FAQ & Support
          </h1>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Find quick answers to common questions about YelpCamp listings, reviews, and maps.
          </p>
        </div>

        {/* FAQs */}
        <div className="space-y-6 max-w-3xl mx-auto pt-6">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="p-6 sm:p-8 rounded-3xl glass-panel border border-emerald-500/10 shadow-md bg-white/70 hover:border-emerald-500/20 hover:shadow-lg transition-all duration-300"
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

        {/* Footer Support Callout */}
        <div className="p-8 rounded-3xl glass-panel border border-emerald-500/10 shadow-lg text-center max-w-lg mx-auto bg-white/80 space-y-4">
          <h3 className="text-lg font-bold">Have more questions?</h3>
          <p className="text-xs text-foreground/55 leading-relaxed">
            Get in touch or join the community of campers to discuss camping trips and gear recommendations!
          </p>
          <div className="pt-2">
            <Link
              href="/campgrounds"
              className="inline-flex items-center space-x-1.5 text-sm font-semibold text-primary-emerald hover:underline"
            >
              <span>Explore Wilderness Campgrounds</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
