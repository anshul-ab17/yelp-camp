import { notFound, redirect } from 'next/navigation';
import db from '@/lib/db';
import EditCampgroundForm from '@/components/EditCampgroundForm';
import { getCurrentUser } from '@/lib/auth';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCampgroundPage({ params }: PageProps) {
  const { id } = await params;

  // Verify user is logged in
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    redirect(`/login?redirectTo=/campgrounds/${id}/edit`);
  }

  // Fetch campground from SQLite
  const campRow = db.prepare('SELECT * FROM campgrounds WHERE id = ?').get(id) as any;
  if (!campRow) {
    notFound();
  }

  // Authorization check
  if (campRow.author_id !== currentUser._id) {
    redirect(`/campgrounds/${id}`);
  }

  // Map to campground object
  const campground = {
    _id: campRow.id,
    title: campRow.title,
    location: campRow.location,
    price: campRow.price,
    description: campRow.description,
    images: JSON.parse(campRow.images_json || '[]'),
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="p-6 sm:p-10 rounded-3xl glass-panel border border-emerald-500/10 shadow-xl bg-white/80 space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold font-display tracking-tight text-foreground">
            Edit Campground
          </h1>
          <p className="text-sm text-foreground/50 mt-1">
            Update campground features, location, price, or upload more outdoor photos.
          </p>
        </div>

        <EditCampgroundForm campground={campground} />
      </div>
    </div>
  );
}
