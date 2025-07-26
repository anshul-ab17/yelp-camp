import { Request, Response, NextFunction } from 'express';
import { campgroundSchema, reviewSchema } from './schemas';
import ExpressError from './utils/ExpressError';
import Campground from './models/campground';
import Review from './models/review';

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
        (req.session as any).returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
};

export const validateCampground = (req: Request, res: Response, next: NextFunction) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el: any) => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

export const isAuthor = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    if (!req.user || !campground.author.equals((req.user as any)._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
};

export const isReviewAuthor = async (req: Request, res: Response, next: NextFunction) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) {
        req.flash('error', 'Cannot find that review!');
        return res.redirect(`/campgrounds/${id}`);
    }
    if (!req.user || !review.author.equals((req.user as any)._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
};

export const validateReview = (req: Request, res: Response, next: NextFunction) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el: any) => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};
