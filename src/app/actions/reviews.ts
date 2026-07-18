'use server';

import { revalidatePath } from 'next/cache';
import crypto from 'crypto';
import db from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export interface ReviewResponse {
  success: boolean;
  error: string;
}

export async function createReview(campgroundId: string, prevState: any, formData: FormData): Promise<ReviewResponse> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'You must be logged in to leave a review' };
    }

    const rating = Number(formData.get('rating'));
    const body = formData.get('body') as string;

    if (!rating || isNaN(rating) || rating < 1 || rating > 5 || !body) {
      return { success: false, error: 'Rating and review text are required' };
    }

    // Verify campground exists
    const campground = db.prepare('SELECT id FROM campgrounds WHERE id = ?').get(campgroundId);
    if (!campground) {
      return { success: false, error: 'Campground not found' };
    }

    // Insert review into SQLite
    const reviewId = crypto.randomUUID();
    db.prepare('INSERT INTO reviews (id, body, rating, author_id, campground_id) VALUES (?, ?, ?, ?, ?)').run(
      reviewId,
      body,
      rating,
      user._id,
      campgroundId
    );

    revalidatePath(`/campgrounds/${campgroundId}`);

    return { success: true, error: '' };
  } catch (error: any) {
    console.error('Create review error:', error);
    return { success: false, error: error.message || 'An error occurred while creating review' };
  }
}

export async function deleteReview(campgroundId: string, reviewId: string): Promise<ReviewResponse> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'You must be logged in to delete a review' };
    }

    // Find review
    const review = db.prepare('SELECT * FROM reviews WHERE id = ?').get(reviewId) as any;
    if (!review) {
      return { success: false, error: 'Review not found' };
    }

    // Authorization check: Only the author of the review can delete it
    if (review.author_id !== user._id) {
      return { success: false, error: 'You do not have permission to delete this review' };
    }

    // Delete review document from SQLite
    db.prepare('DELETE FROM reviews WHERE id = ?').run(reviewId);

    revalidatePath(`/campgrounds/${campgroundId}`);

    return { success: true, error: '' };
  } catch (error: any) {
    console.error('Delete review error:', error);
    return { success: false, error: error.message || 'An error occurred while deleting review' };
  }
}
