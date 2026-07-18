'use server';

import { revalidatePath } from 'next/cache';
import crypto from 'crypto';
import db from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { geocodeLocation } from '@/lib/mapbox';
import { uploadImage } from '@/lib/cloudinary';

export interface ActionResponse {
  success: boolean;
  error: string;
  id: string;
}

export async function createCampground(prevState: any, formData: FormData): Promise<ActionResponse> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'You must be logged in to create a campground', id: '' };
    }

    const title = formData.get('title') as string;
    const location = formData.get('location') as string;
    const price = Number(formData.get('price'));
    const description = formData.get('description') as string;
    const imageFiles = formData.getAll('images') as File[];

    if (!title || !location || isNaN(price) || !description) {
      return { success: false, error: 'All fields are required', id: '' };
    }

    // 1. Geocode location using our OSM Nominatim helper
    const [lng, lat] = await geocodeLocation(location);

    // 2. Upload images
    const images: { url: string; filename: string }[] = [];
    for (const file of imageFiles) {
      if (file && file.size > 0) {
        const uploaded = await uploadImage(file);
        images.push(uploaded);
      }
    }

    if (images.length === 0) {
      // Add a local seed default image
      images.push({
        url: '/seeds/camp_1.jpg',
        filename: 'YelpCamp/default_camp',
      });
    }

    // 3. Insert into SQLite
    const campgroundId = crypto.randomUUID();
    db.prepare(`
      INSERT INTO campgrounds (id, title, location, price, description, geometry_lat, geometry_lng, images_json, author_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      campgroundId,
      title,
      location,
      price,
      description,
      lat,
      lng,
      JSON.stringify(images),
      user._id
    );
    
    revalidatePath('/campgrounds');
    return { success: true, id: campgroundId, error: '' };
  } catch (error: any) {
    console.error('Create campground error:', error);
    return { success: false, error: error.message || 'An error occurred while creating campground', id: '' };
  }
}

export async function updateCampground(id: string, prevState: any, formData: FormData): Promise<ActionResponse> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'You must be logged in to edit a campground', id: '' };
    }

    // Find campground
    const campground = db.prepare('SELECT * FROM campgrounds WHERE id = ?').get(id) as any;
    if (!campground) {
      return { success: false, error: 'Campground not found', id: '' };
    }

    // Authorization check
    if (campground.author_id !== user._id) {
      return { success: false, error: 'You do not have permission to edit this campground', id: '' };
    }

    const title = formData.get('title') as string;
    const location = formData.get('location') as string;
    const price = Number(formData.get('price'));
    const description = formData.get('description') as string;
    const newImageFiles = formData.getAll('images') as File[];
    const deleteImages = formData.getAll('deleteImages') as string[]; // image filenames to delete

    if (!title || !location || isNaN(price) || !description) {
      return { success: false, error: 'All fields are required', id: '' };
    }

    // Geocode if location changed
    let lat = campground.geometry_lat;
    let lng = campground.geometry_lng;
    if (campground.location !== location) {
      const coords = await geocodeLocation(location);
      lng = coords[0];
      lat = coords[1];
    }

    // Parse existing images
    let images: { url: string; filename: string }[] = JSON.parse(campground.images_json);

    // Upload new images
    for (const file of newImageFiles) {
      if (file && file.size > 0) {
        const uploaded = await uploadImage(file);
        images.push(uploaded);
      }
    }

    // Filter out deleted images
    if (deleteImages && deleteImages.length > 0) {
      images = images.filter((img) => !deleteImages.includes(img.filename));
    }

    // Update SQLite
    db.prepare(`
      UPDATE campgrounds
      SET title = ?, location = ?, price = ?, description = ?, geometry_lat = ?, geometry_lng = ?, images_json = ?
      WHERE id = ?
    `).run(
      title,
      location,
      price,
      description,
      lat,
      lng,
      JSON.stringify(images),
      id
    );

    revalidatePath(`/campgrounds/${id}`);
    revalidatePath('/campgrounds');

    return { success: true, id, error: '' };
  } catch (error: any) {
    console.error('Update campground error:', error);
    return { success: false, error: error.message || 'An error occurred while updating campground', id: '' };
  }
}

export async function deleteCampground(id: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'You must be logged in to delete a campground' };
    }

    const campground = db.prepare('SELECT * FROM campgrounds WHERE id = ?').get(id) as any;
    if (!campground) {
      return { success: false, error: 'Campground not found' };
    }

    // Authorization check
    if (campground.author_id !== user._id) {
      return { success: false, error: 'You do not have permission to delete this campground' };
    }

    // Delete reviews and campground (cascading manually for safety)
    db.prepare('DELETE FROM reviews WHERE campground_id = ?').run(id);
    db.prepare('DELETE FROM campgrounds WHERE id = ?').run(id);

    revalidatePath('/campgrounds');
    return { success: true };
  } catch (error: any) {
    console.error('Delete campground error:', error);
    return { success: false, error: error.message || 'An error occurred while deleting campground' };
  }
}
