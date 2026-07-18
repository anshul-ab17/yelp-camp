import mongoose, { Schema, Document, Model } from 'mongoose';
import { IReview } from './Review';
import { IUser } from './User';

interface Image {
  url: string;
  filename: string;
}

export interface ICampground extends Document {
  title: string;
  images: Image[];
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  price: number;
  description: string;
  location: string;
  author: mongoose.Types.ObjectId | IUser;
  reviews: mongoose.Types.ObjectId[] | IReview[];
  createdAt: Date;
}

const ImageSchema = new Schema<Image>({
  url: String,
  filename: String,
});

// Add virtual property to get thumbnail URL (sizes for edit view)
ImageSchema.virtual('thumbnail').get(function () {
  return this.url.replace('/upload', '/upload/w_200');
});

const CampgroundSchema = new Schema<ICampground>(
  {
    title: {
      type: String,
      required: [true, 'Campground title is required'],
    },
    images: [ImageSchema],
    geometry: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Middleware to clean up reviews associated with the campground when deleted
CampgroundSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await mongoose.model('Review').deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

const Campground: Model<ICampground> = mongoose.models.Campground || mongoose.model<ICampground>('Campground', CampgroundSchema);

export default Campground;
