'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteReview } from '@/app/actions/reviews';
import { Trash, Loader2 } from 'lucide-react';

interface DeleteReviewButtonProps {
  campgroundId: string;
  reviewId: string;
}

export default function DeleteReviewButton({ campgroundId, reviewId }: DeleteReviewButtonProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete your review?')) {
      setIsPending(true);
      const res = await deleteReview(campgroundId, reviewId);
      setIsPending(false);

      if (res.success) {
        router.refresh();
      } else {
        alert(res.error || 'Failed to delete review');
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="p-1.5 rounded-lg text-foreground/40 hover:text-red-500 hover:bg-red-500/5 transition-all disabled:opacity-75 disabled:pointer-events-none cursor-pointer"
      title="Delete review"
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash className="h-4 w-4" />
      )}
    </button>
  );
}
