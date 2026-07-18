import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { connectToDatabase } from '@/lib/mongodb';
import Campground from '@/models/Campground';
import EditCampgroundForm from '@/components/EditCampgroundForm';
import { getCurrentUser } from '@/lib/auth';
import { ArrowLeft } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCampground({ params }: PageProps) {
  const { id } = await params;

  await connectToDatabase();
  const campDoc = await Campground.findById(id);

  if (!campDoc) {
    notFound();
  }

  // Auth validation
  const user = await getCurrentUser();
  if (!user || campDoc.author.toString() !== user._id.toString()) {
    redirect(`/campgrounds/${id}`);
  }

  // Serialize to plain JSON
  const campground = {
    _id: campDoc._id.toString(),
    title: campDoc.title,
    location: campDoc.location,
    price: campDoc.price,
    description: campDoc.description,
    images: campDoc.images.map((img: any) => ({
      url: img.url,
      filename: img.filename,
    })),
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 relative w-full">
      {/* Back button */}
      <Link
        href={`/campgrounds/${campground._id}`}
        className="inline-flex items-center space-x-1.5 text-sm font-medium text-foreground/60 hover:text-primary-emerald transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Campground</span>
      </Link>

      <EditCampgroundForm campground={campground} />
    </div>
  );
}
