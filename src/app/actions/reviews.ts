'use server';

import { revalidatePath } from 'next/cache';
import { connectToDatabase } from '@/lib/mongodb';
import Campground from '@/models/Campground';
import Review from '@/models/Review';
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

    await connectToDatabase();

    const campground = await Campground.findById(campgroundId);
    if (!campground) {
      return { success: false, error: 'Campground not found' };
    }

    // Create review
    const review = new Review({
      body,
      rating,
      author: user._id,
    });

    await review.save();

    // Link review to campground
    campground.reviews.push(review._id as any);
    await campground.save();

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

    await connectToDatabase();

    const review = await Review.findById(reviewId);
    if (!review) {
      return { success: false, error: 'Review not found' };
    }

    // Authorization check: Only the author of the review can delete it
    if (review.author.toString() !== user._id.toString()) {
      return { success: false, error: 'You do not have permission to delete this review' };
    }

    // Pull from campground reviews array
    await Campground.findByIdAndUpdate(campgroundId, {
      $pull: { reviews: reviewId },
    });

    // Delete review document
    await Review.findByIdAndDelete(reviewId);

    revalidatePath(`/campgrounds/${campgroundId}`);

    return { success: true, error: '' };
  } catch (error: any) {
    console.error('Delete review error:', error);
    return { success: false, error: error.message || 'An error occurred while deleting review' };
  }
}
