import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReview extends Document {
  body: string;
  rating: number;
  author: mongoose.Types.ObjectId;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>({
  body: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Review: Model<IReview> = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);

export default Review;
