'use client';

import React, { useActionState, useRef } from 'react';
import { createReview } from '@/app/actions/reviews';
import { MessageSquare, Star, Loader2 } from 'lucide-react';

interface ReviewFormProps {
  campgroundId: string;
}

const initialState = {
  success: false,
  error: '',
};

export default function ReviewForm({ campgroundId }: ReviewFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const createReviewWithId = createReview.bind(null, campgroundId);
  const [state, formAction, isPending] = useActionState(createReviewWithId, initialState);
  const [rating, setRating] = React.useState(5);

  React.useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
      setRating(5);
    }
  }, [state]);

  return (
    <div className="p-6 rounded-3xl glass-panel border border-emerald-500/10 shadow-lg shadow-emerald-500/2">
      <h3 className="text-lg font-bold font-display text-foreground flex items-center mb-4">
        <MessageSquare className="h-5 w-5 mr-1.5 text-primary-emerald" />
        <span>Leave a Review</span>
      </h3>

      {state?.error && (
        <div className="p-3.5 mb-4 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 text-xs font-semibold">
          {state.error}
        </div>
      )}

      {state?.success && (
        <div className="p-3.5 mb-4 rounded-xl bg-emerald-500/10 text-primary-emerald border border-emerald-500/20 text-xs font-semibold">
          Review submitted successfully!
        </div>
      )}

      <form ref={formRef} action={formAction} className="space-y-4">
        {/* Rating Stars */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground/80">Rating</label>
          <div className="flex items-center space-x-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none transition-transform duration-100 active:scale-90 cursor-pointer"
              >
                <Star
                  className={`h-6 w-6 ${
                    star <= rating
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-foreground/25 dark:text-foreground/20'
                  }`}
                />
              </button>
            ))}
            {/* Hidden Input to submit in FormData */}
            <input type="hidden" name="rating" value={rating} />
          </div>
        </div>

        {/* Review text */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground/80" htmlFor="body">
            Review Text
          </label>
          <textarea
            id="body"
            name="body"
            required
            rows={4}
            placeholder="Tell others about your experience at this campsite..."
            className="w-full px-4 py-3 rounded-xl border border-emerald-950/10 dark:border-emerald-100/10 bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary-emerald/20 focus:border-primary-emerald transition-all text-sm resize-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-primary-emerald text-white hover:bg-emerald-600 font-semibold shadow-md shadow-emerald-500/10 active:scale-[0.98] transition-all disabled:opacity-75 disabled:pointer-events-none cursor-pointer"
        >
          {isPending ? (
            <Loader2 className="h-4.5 w-4.5 animate-spin" />
          ) : (
            <span>Submit Review</span>
          )}
        </button>
      </form>
    </div>
  );
}
