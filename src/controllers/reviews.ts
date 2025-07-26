import { Request, Response } from 'express';
import Campground from '../models/campground';
import Review from '../models/review';

export const createReview = async (req: Request, res: Response) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    const review = new Review(req.body.review);
    review.author = (req.user as any)._id;
    campground.reviews.push(review._id as any);
    await review.save();
    await campground.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/campgrounds/${campground._id}`);
};

export const deleteReview = async (req: Request, res: Response) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review');
    res.redirect(`/campgrounds/${id}`);
};
