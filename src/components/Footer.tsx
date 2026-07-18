import Link from 'next/link';
import { Tent } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full mt-auto border-t border-emerald-950/5 dark:border-emerald-100/5 bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 text-sm text-foreground/50">
          <div className="flex items-center space-x-2">
            <Tent className="h-5 w-5 text-primary-emerald" />
            <span className="font-semibold text-foreground/75">YelpCamp</span>
            <span>&copy; {new Date().getFullYear()} YelpCamp. All rights reserved.</span>
          </div>
          <div className="flex space-x-6">
            <Link href="/campgrounds" className="hover:text-primary-emerald transition-colors">
              Campgrounds
            </Link>
            <a href="https://github.com/anshul-ab17/yelp-camp" target="_blank" rel="noreferrer" className="hover:text-primary-emerald transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
