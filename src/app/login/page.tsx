'use client';

import React, { useActionState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loginUser } from '../actions/auth';
import { LogIn, User as UserIcon, Lock, ArrowRight, Loader2 } from 'lucide-react';

const initialState = {
  success: false,
  error: '',
};

export default function Login() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(loginUser, initialState);

  React.useEffect(() => {
    if (state?.success) {
      router.push('/campgrounds');
      router.refresh();
    }
  }, [state, router]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 relative">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/5 via-background to-background"></div>

      <div className="w-full max-w-md p-8 rounded-3xl glass-panel relative overflow-hidden shadow-2xl border border-emerald-500/10">
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-primary-emerald mb-4">
            <LogIn className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold font-display text-foreground">Welcome Back</h2>
          <p className="text-sm text-foreground/60 mt-1">Sign in to your YelpCamp account</p>
        </div>

        {state?.error && (
          <div className="p-4 mb-6 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 text-sm font-medium">
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-5">
          {/* Username input */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground/80" htmlFor="username">
              Username
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/40" />
              <input
                id="username"
                name="username"
                type="text"
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-emerald-950/10 dark:border-emerald-100/10 bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary-emerald/20 focus:border-primary-emerald transition-all"
                placeholder="username"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground/80" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/40" />
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-emerald-950/10 dark:border-emerald-100/10 bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary-emerald/20 focus:border-primary-emerald transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-xl bg-primary-emerald text-white hover:bg-emerald-600 font-semibold shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/25 active:scale-[0.98] transition-all disabled:opacity-75 disabled:pointer-events-none cursor-pointer"
          >
            {isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-sm text-center text-foreground/60 mt-6">
          Don't have an account?{' '}
          <Link href="/register" className="font-semibold text-primary-emerald hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
