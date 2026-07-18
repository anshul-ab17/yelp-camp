import Link from 'next/link';
import { connectToDatabase } from '@/lib/mongodb';
import Campground from '@/models/Campground';
import ClusterMap from '@/components/ClusterMap';
import SearchBar from '@/components/SearchBar';
import { MapPin, Plus, Compass } from 'lucide-react';
import Image from 'next/image';

interface PageProps {
  searchParams: Promise<{ search?: string }>;
}

export default async function CampgroundsIndex({ searchParams }: PageProps) {
  const params = await searchParams;
  const searchQuery = params.search || '';

  await connectToDatabase();

  // Create search regex if present
  const filter = searchQuery
    ? {
        $or: [
          { title: { $regex: searchQuery, $options: 'i' } },
          { location: { $regex: searchQuery, $options: 'i' } },
        ],
      }
    : {};

  // Fetch campgrounds (raw mongoose array)
  const rawCampgrounds = await Campground.find(filter).sort({ createdAt: -1 });

  // Map to plain objects so next.js server components can serialize them
  const campgrounds = rawCampgrounds.map((doc) => {
    const camp = doc.toObject({ virtuals: true });
    return {
      _id: camp._id.toString(),
      title: camp.title,
      location: camp.location,
      price: camp.price,
      description: camp.description,
      images: camp.images.map((img: any) => ({
        url: img.url,
        filename: img.filename,
      })),
      geometry: {
        type: camp.geometry.type,
        coordinates: [camp.geometry.coordinates[0], camp.geometry.coordinates[1]] as [number, number],
      },
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Cluster Map Header */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold font-display tracking-tight text-foreground">
              Campsite Directory
            </h1>
            <p className="text-sm text-foreground/60 mt-1">
              Explore user-submitted campgrounds across the country
            </p>
          </div>

          <Link
            href="/campgrounds/new"
            className="inline-flex items-center justify-center space-x-1.5 px-5 py-2.5 rounded-xl bg-primary-emerald text-white hover:bg-emerald-600 font-semibold text-sm shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Campground</span>
          </Link>
        </div>

        {/* Mapbox Map */}
        <ClusterMap campgrounds={campgrounds} />
      </div>

      {/* Filter and Listing */}
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <SearchBar />
          {searchQuery && (
            <p className="text-sm text-foreground/50 self-start sm:self-center">
              Found {campgrounds.length} results for "{searchQuery}"
            </p>
          )}
        </div>

        {campgrounds.length === 0 ? (
          <div className="py-20 text-center rounded-3xl bg-emerald-500/5 border border-emerald-500/10 flex flex-col items-center justify-center">
            <Compass className="h-10 w-10 text-primary-emerald/50 mb-3" />
            <h3 className="text-lg font-bold">No campgrounds found</h3>
            <p className="text-sm text-foreground/55 mt-1 max-w-sm">
              We couldn't find any campsites matching your search. Try adjusting your query or create a new one!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {campgrounds.map((campground) => (
              <div
                key={campground._id}
                className="group flex flex-col rounded-3xl glass-panel overflow-hidden border border-emerald-500/10 shadow-lg hover:shadow-xl hover:border-emerald-500/20 hover:-translate-y-1 transition-all duration-300 relative"
              >
                {/* Image */}
                <div className="relative h-56 w-full overflow-hidden bg-emerald-950/10">
                  <img
                    src={campground.images[0]?.url || 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80'}
                    alt={campground.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Floating Price */}
                  <span className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-background/95 backdrop-blur-sm text-xs font-bold text-primary-emerald border border-emerald-500/10 shadow-sm">
                    ${campground.price}/night
                  </span>
                </div>

                {/* Details */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold font-display text-foreground group-hover:text-primary-emerald transition-colors line-clamp-1">
                    {campground.title}
                  </h3>
                  
                  <p className="flex items-center text-xs text-foreground/55 mt-1.5">
                    <MapPin className="h-3.5 w-3.5 mr-1 text-primary-emerald" />
                    <span>{campground.location}</span>
                  </p>

                  <p className="text-sm text-foreground/60 mt-4 leading-relaxed line-clamp-3">
                    {campground.description}
                  </p>

                  <div className="mt-6 pt-5 border-t border-emerald-950/5 dark:border-emerald-100/5 flex items-center justify-between">
                    <Link
                      href={`/campgrounds/${campground._id}`}
                      className="inline-flex items-center text-sm font-semibold text-primary-emerald hover:underline"
                    >
                      <span>View Details</span>
                      <span className="ml-1 group-hover:translate-x-0.5 transition-transform duration-200">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
