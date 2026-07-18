'use client';

import React, { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { updateCampground } from '@/app/actions/campgrounds';
import { Edit, ArrowLeft, Loader2, Landmark, MapPin, DollarSign, FileText, Image as ImageIcon, Trash2 } from 'lucide-react';

interface EditCampgroundFormProps {
  campground: {
    _id: string;
    title: string;
    location: string;
    price: number;
    description: string;
    images: {
      url: string;
      filename: string;
    }[];
  };
}

const initialState = {
  success: false,
  error: '',
  id: '',
};

export default function EditCampgroundForm({ campground }: EditCampgroundFormProps) {
  const router = useRouter();
  
  // Bind campground ID to Server Action
  const updateCampgroundWithId = updateCampground.bind(null, campground._id);
  const [state, formAction, isPending] = useActionState(updateCampgroundWithId, initialState);

  React.useEffect(() => {
    if (state?.success && state?.id) {
      router.push(`/campgrounds/${state.id}`);
      router.refresh();
    }
  }, [state, router]);

  return (
    <div className="p-8 sm:p-10 rounded-3xl glass-panel relative overflow-hidden shadow-2xl border border-emerald-500/10">
      <div className="flex items-center space-x-4 mb-8">
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-primary-emerald">
          <Edit className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">Edit Campground</h1>
          <p className="text-sm text-foreground/60 mt-0.5">Modify the details or images of "{campground.title}"</p>
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
            defaultValue={campground.title}
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
              defaultValue={campground.location}
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
                defaultValue={campground.price}
                className="w-full pl-8 pr-4 py-3 rounded-xl border border-emerald-950/10 dark:border-emerald-100/10 bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary-emerald/20 focus:border-primary-emerald transition-all text-sm"
              />
            </div>
          </div>
        </div>

        {/* Upload new images */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground/85 flex items-center" htmlFor="images">
            <ImageIcon className="h-4 w-4 mr-1.5 text-primary-emerald" />
            <span>Upload New Images</span>
          </label>
          <input
            id="images"
            name="images"
            type="file"
            multiple
            accept="image/*"
            className="w-full text-sm text-foreground/60 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-500/10 file:text-primary-emerald hover:file:bg-emerald-500/20 file:transition-colors file:cursor-pointer border border-dashed border-emerald-950/20 dark:border-emerald-100/20 rounded-2xl p-4.5 bg-background/25"
          />
        </div>

        {/* Delete current images selection */}
        {campground.images && campground.images.length > 0 && (
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground/85 flex items-center">
              <Trash2 className="h-4 w-4 mr-1.5 text-red-500" />
              <span>Delete Existing Images</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {campground.images.map((img, i) => (
                <div key={img.filename || i} className="relative rounded-2xl overflow-hidden group border border-emerald-500/5 aspect-video bg-emerald-950/10">
                  <img
                    src={img.url}
                    alt=""
                    className="object-cover w-full h-full"
                  />
                  {/* Checkbox overlay */}
                  <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all cursor-pointer">
                    <input
                      type="checkbox"
                      name="deleteImages"
                      value={img.filename}
                      className="h-5 w-5 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                    />
                    <span className="ml-2 text-xs font-bold text-white">Delete</span>
                  </label>
                </div>
              ))}
            </div>
            <p className="text-xs text-foreground/40 mt-1">Hover over an image and check the box to select it for deletion.</p>
          </div>
        )}

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
            defaultValue={campground.description}
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
              <span>Save Changes</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
