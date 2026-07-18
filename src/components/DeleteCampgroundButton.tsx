'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteCampground } from '@/app/actions/campgrounds';
import { Trash2, Loader2 } from 'lucide-react';

interface DeleteCampgroundButtonProps {
  id: string;
}

export default function DeleteCampgroundButton({ id }: DeleteCampgroundButtonProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this campground? This will also clean up all reviews associated with it.')) {
      setIsPending(true);
      const res = await deleteCampground(id);
      setIsPending(false);

      if (res.success) {
        router.push('/campgrounds');
        router.refresh();
      } else {
        alert(res.error || 'Failed to delete campground');
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-red-500/20 text-sm font-semibold text-red-500 hover:bg-red-500/5 active:scale-[0.98] transition-all disabled:opacity-70 disabled:pointer-events-none cursor-pointer"
    >
      {isPending ? (
        <Loader2 className="h-4.5 w-4.5 animate-spin" />
      ) : (
        <>
          <Trash2 className="h-4.5 w-4.5" />
          <span>Delete Campground</span>
        </>
      )}
    </button>
  );
}
