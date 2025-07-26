import mongoose, { Schema, Document, Types } from 'mongoose';
import Review from './review';

interface IImage {
    url: string;
    filename: string;
    thumbnail?: string;
}

export interface ICampground extends Document {
    title: string;
    images: IImage[];
    geometry: {
        type: 'Point';
        coordinates: number[];
    };
    price: number;
    description: string;
    location: string;
    author: Types.ObjectId;
    reviews: Types.ObjectId[];
}

const ImageSchema = new Schema<IImage>({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function (this: IImage) {
    return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema<ICampground>({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);

CampgroundSchema.virtual('properties.popUpMarkup').get(function (this: ICampground) {
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 20)}...</p>`;
});

CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        });
    }
});

const Campground = mongoose.model<ICampground>('Campground', CampgroundSchema);
export default Campground;
