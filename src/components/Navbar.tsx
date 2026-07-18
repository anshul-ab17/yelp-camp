import Link from 'next/link';
import { getCurrentUser, clearJWTCookie } from '@/lib/auth';
import { Tent, PlusCircle, LogIn, UserPlus, LogOut } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function Navbar() {
  const user = await getCurrentUser();

  // Server Action inline or referenced for logout
  async function handleLogout() {
    'use server';
    await clearJWTCookie();
    redirect('/');
  }

  return (
    <header className="sticky top-0 z-50 w-full glass-navbar border-b border-emerald-950/5 dark:border-emerald-100/5 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="p-2 rounded-lg bg-emerald-600/10 text-primary-emerald group-hover:bg-emerald-600/20 transition-all duration-300">
                <Tent className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary-emerald transition-colors duration-300">
                YelpCamp
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-8 text-sm font-medium">
            <Link
              href="/#home"
              className="text-foreground/75 hover:text-primary-emerald transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              href="/campgrounds"
              className="text-foreground/75 hover:text-primary-emerald transition-colors duration-200"
            >
              Campgrounds
            </Link>
            <Link
              href="/#about"
              className="text-foreground/75 hover:text-primary-emerald transition-colors duration-200"
            >
              About
            </Link>
            <Link
              href="/#faq"
              className="text-foreground/75 hover:text-primary-emerald transition-colors duration-200"
            >
              FAQ
            </Link>
            {user && (
              <Link
                href="/campgrounds/new"
                className="flex items-center space-x-1 text-foreground/75 hover:text-primary-emerald transition-colors duration-200"
              >
                <PlusCircle className="h-4 w-4" />
                <span>New Camp</span>
              </Link>
            )}
          </nav>

          {/* Auth section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-primary-emerald border border-emerald-500/20">
                  {user.username}
                </span>
                <form action={handleLogout}>
                  <button
                    type="submit"
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-transparent text-sm font-medium text-foreground/80 hover:text-red-500 hover:bg-red-500/5 transition-all duration-200 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm font-medium text-foreground/80 hover:text-primary-emerald hover:bg-emerald-500/5 transition-all duration-200"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Link>
                <Link
                  href="/register"
                  className="flex items-center space-x-1.5 px-4.5 py-2 rounded-lg text-sm font-medium bg-primary-emerald text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-[0.98] transition-all duration-200"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
