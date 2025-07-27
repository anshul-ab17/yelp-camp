import express from 'express';
import { validateReview, isLoggedIn, isReviewAuthor } from '../middleware';
import * as reviews from '../controllers/reviews';
import catchAsync from '../utils/catchAsync';

const router = express.Router({ mergeParams: true });

router.post('/', isLoggedIn as any, validateReview as any, catchAsync(reviews.createReview) as any);

router.delete('/:reviewId', isLoggedIn as any, isReviewAuthor as any, catchAsync(reviews.deleteReview) as any);

export default router;
