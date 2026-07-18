import Link from 'next/link';
import { notFound } from 'next/navigation';
import { connectToDatabase } from '@/lib/mongodb';
import Campground from '@/models/Campground';
import Review from '@/models/Review';
import User from '@/models/User';
import CampgroundMap from '@/components/CampgroundMap';
import ReviewForm from '@/components/ReviewForm';
import DeleteCampgroundButton from '@/components/DeleteCampgroundButton';
import DeleteReviewButton from '@/components/DeleteReviewButton';
import { getCurrentUser } from '@/lib/auth';
import { MapPin, Calendar, User as UserIcon, DollarSign, Edit, Star } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CampgroundDetail({ params }: PageProps) {
  const { id } = await params;

  await connectToDatabase();

  // Fetch campground with deep population
  const campDoc = await Campground.findById(id)
    .populate('author')
    .populate({
      path: 'reviews',
      populate: {
        path: 'author',
      },
    });

  if (!campDoc) {
    notFound();
  }

  // Get current logged-in user
  const currentUser = await getCurrentUser();
  const currentUserId = currentUser?._id?.toString() || '';

  // Serialize to plain JSON object
  const campground = {
    _id: campDoc._id.toString(),
    title: campDoc.title,
    location: campDoc.location,
    price: campDoc.price,
    description: campDoc.description,
    geometry: {
      type: campDoc.geometry.type,
      coordinates: [campDoc.geometry.coordinates[0], campDoc.geometry.coordinates[1]] as [number, number],
    },
    images: campDoc.images.map((img: any) => ({
      url: img.url,
      filename: img.filename,
    })),
    author: {
      _id: (campDoc.author as any)._id.toString(),
      username: (campDoc.author as any).username,
    },
    reviews: campDoc.reviews.map((rev: any) => ({
      _id: rev._id.toString(),
      body: rev.body,
      rating: rev.rating,
      createdAt: rev.createdAt.toISOString(),
      author: {
        _id: rev.author._id.toString(),
        username: rev.author.username,
      },
    })),
  };

  const isAuthor = campground.author._id === currentUserId;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Main Details (Col Span 2) */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            {/* Title & Location Header */}
            <div>
              <h1 className="text-3xl font-extrabold font-display tracking-tight text-foreground">
                {campground.title}
              </h1>
              <p className="flex items-center text-sm text-foreground/60 mt-2">
                <MapPin className="h-4 w-4 mr-1 text-primary-emerald" />
                <span>{campground.location}</span>
              </p>
            </div>

            {/* Images Grid/Single */}
            <div className="rounded-3xl overflow-hidden glass-panel border border-emerald-500/10 shadow-lg relative h-[400px] w-full bg-emerald-950/10">
              <img
                src={campground.images[0]?.url || 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80'}
                alt={campground.title}
                className="object-cover w-full h-full"
              />
              <span className="absolute top-6 right-6 px-4 py-2 rounded-2xl bg-background/95 backdrop-blur-sm text-sm font-bold text-primary-emerald border border-emerald-500/10 shadow-sm">
                ${campground.price} / night
              </span>
            </div>
          </div>

          {/* Description & Author box */}
          <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-emerald-500/10 shadow-md space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-emerald-950/5 dark:border-emerald-100/5">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-primary-emerald">
                  <UserIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-foreground/45">Submitted by</p>
                  <p className="text-sm font-bold text-foreground/80">{campground.author.username}</p>
                </div>
              </div>

              {/* Price Details */}
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-primary-emerald">
                  <DollarSign className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-foreground/45">Cost per Night</p>
                  <p className="text-sm font-bold text-foreground/80">${campground.price}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold font-display">About the Campground</h3>
              <p className="text-foreground/75 leading-relaxed text-sm whitespace-pre-line">
                {campground.description}
              </p>
            </div>

            {/* Author Controls */}
            {isAuthor && (
              <div className="pt-6 border-t border-emerald-950/5 dark:border-emerald-100/5 flex flex-wrap gap-4">
                <Link
                  href={`/campgrounds/${campground._id}/edit`}
                  className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-emerald-500/10 text-primary-emerald hover:bg-emerald-500/20 text-sm font-semibold transition-all cursor-pointer"
                >
                  <Edit className="h-4.5 w-4.5" />
                  <span>Edit Details</span>
                </Link>
                <DeleteCampgroundButton id={campground._id} />
              </div>
            )}
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold font-display text-foreground">
              User Reviews ({campground.reviews.length})
            </h2>

            {campground.reviews.length === 0 ? (
              <div className="p-8 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 text-center">
                <p className="text-sm text-foreground/50">No reviews yet. Be the first to share your thoughts!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {campground.reviews.map((review) => (
                  <div
                    key={review._id}
                    className="p-5 rounded-2xl glass-panel border border-emerald-500/10 shadow-sm flex flex-col md:flex-row md:items-start justify-between gap-4"
                  >
                    <div className="space-y-3">
                      {/* Rating stars & author */}
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center space-x-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4.5 w-4.5 ${
                                star <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-foreground/15 dark:text-foreground/10'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-primary-emerald">
                          {review.author.username}
                        </span>
                        <span className="text-[10px] text-foreground/45 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Review text */}
                      <p className="text-sm text-foreground/75 leading-relaxed">
                        {review.body}
                      </p>
                    </div>

                    {/* Delete button (review author check) */}
                    {review.author._id === currentUserId && (
                      <DeleteReviewButton campgroundId={campground._id} reviewId={review._id} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar (Map & Form) (Col Span 1) */}
        <div className="space-y-8 lg:sticky lg:top-24 h-fit">
          {/* Mapbox Map */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground/80">Campground Location</h3>
            <CampgroundMap
              coordinates={campground.geometry.coordinates}
              title={campground.title}
              location={campground.location}
            />
          </div>

          {/* Review Form */}
          {currentUser ? (
            <ReviewForm campgroundId={campground._id} />
          ) : (
            <div className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 text-center space-y-3">
              <h3 className="font-bold text-sm">Want to leave a review?</h3>
              <p className="text-xs text-foreground/60 leading-relaxed">
                Log in or register for a free account to share your experience with the community.
              </p>
              <div className="pt-2 flex items-center justify-center space-x-3">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-xl bg-primary-emerald hover:bg-emerald-600 text-white font-semibold text-xs transition-all"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-xl glass-panel text-foreground text-xs font-semibold hover:bg-emerald-500/5 transition-all"
                >
                  Register
                </Link>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
