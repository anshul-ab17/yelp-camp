import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IReview extends Document {
    body: string;
    rating: number;
    author: Types.ObjectId;
}

const reviewSchema = new Schema<IReview>({
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Review = mongoose.model<IReview>('Review', reviewSchema);
export default Review;
