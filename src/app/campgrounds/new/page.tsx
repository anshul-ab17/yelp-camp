'use client';

import React, { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createCampground } from '@/app/actions/campgrounds';
import { PlusCircle, ArrowLeft, Loader2, Landmark, MapPin, DollarSign, FileText, Image as ImageIcon } from 'lucide-react';

const initialState = {
  success: false,
  error: '',
  id: '',
};

export default function NewCampground() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(createCampground, initialState);

  React.useEffect(() => {
    if (state?.success && state?.id) {
      router.push(`/campgrounds/${state.id}`);
      router.refresh();
    }
  }, [state, router]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 relative w-full">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/5 via-background to-background"></div>

      {/* Back button */}
      <Link
        href="/campgrounds"
        className="inline-flex items-center space-x-1.5 text-sm font-medium text-foreground/60 hover:text-primary-emerald transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Directory</span>
      </Link>

      <div className="p-8 sm:p-10 rounded-3xl glass-panel relative overflow-hidden shadow-2xl border border-emerald-500/10">
        <div className="flex items-center space-x-4 mb-8">
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-primary-emerald">
            <PlusCircle className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display text-foreground">Add a New Campground</h1>
            <p className="text-sm text-foreground/60 mt-0.5">Share a new wilderness destination with the community</p>
          </div>
        </div>

        {state?.error && (
          <div className="p-4 mb-6 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 text-sm font-medium">
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground/85 flex items-center" htmlFor="title">
              <Landmark className="h-4 w-4 mr-1.5 text-primary-emerald" />
              <span>Campground Title</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              placeholder="e.g. Whispering Pines"
              className="w-full px-4 py-3 rounded-xl border border-emerald-950/10 dark:border-emerald-100/10 bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary-emerald/20 focus:border-primary-emerald transition-all text-sm"
            />
          </div>

          {/* Location & Price row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Location */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground/85 flex items-center" htmlFor="location">
                <MapPin className="h-4 w-4 mr-1.5 text-primary-emerald" />
                <span>Location</span>
              </label>
              <input
                id="location"
                name="location"
                type="text"
                required
                placeholder="e.g. Yosemite Valley, CA"
                className="w-full px-4 py-3 rounded-xl border border-emerald-950/10 dark:border-emerald-100/10 bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary-emerald/20 focus:border-primary-emerald transition-all text-sm"
              />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground/85 flex items-center" htmlFor="price">
                <DollarSign className="h-4 w-4 mr-1.5 text-primary-emerald" />
                <span>Price per Night</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-foreground/45 font-semibold">$</span>
                <input
                  id="price"
                  name="price"
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-3 rounded-xl border border-emerald-950/10 dark:border-emerald-100/10 bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary-emerald/20 focus:border-primary-emerald transition-all text-sm"
                />
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground/85 flex items-center" htmlFor="images">
              <ImageIcon className="h-4 w-4 mr-1.5 text-primary-emerald" />
              <span>Upload Images</span>
            </label>
            <input
              id="images"
              name="images"
              type="file"
              multiple
              accept="image/*"
              className="w-full text-sm text-foreground/60 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-500/10 file:text-primary-emerald hover:file:bg-emerald-500/20 file:transition-colors file:cursor-pointer border border-dashed border-emerald-950/20 dark:border-emerald-100/20 rounded-2xl p-4.5 bg-background/25"
            />
            <p className="text-xs text-foreground/40 mt-1">Select one or multiple photos to showcase the campsite</p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground/85 flex items-center" htmlFor="description">
              <FileText className="h-4 w-4 mr-1.5 text-primary-emerald" />
              <span>Description</span>
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={5}
              placeholder="Tell other campers about the amenities, views, and activities here..."
              className="w-full px-4 py-3 rounded-xl border border-emerald-950/10 dark:border-emerald-100/10 bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary-emerald/20 focus:border-primary-emerald transition-all text-sm resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-xl bg-primary-emerald text-white hover:bg-emerald-600 font-semibold shadow-lg shadow-emerald-500/15 hover:shadow-emerald-500/25 active:scale-[0.98] transition-all disabled:opacity-75 disabled:pointer-events-none cursor-pointer"
          >
            {isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <span>Publish Campground</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
