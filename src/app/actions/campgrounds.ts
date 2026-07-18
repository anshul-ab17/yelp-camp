'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { connectToDatabase } from '@/lib/mongodb';
import Campground from '@/models/Campground';
import { getCurrentUser } from '@/lib/auth';
import { geocodeLocation } from '@/lib/mapbox';
import { uploadImage } from '@/lib/cloudinary';
import cloudinary from '@/lib/cloudinary';

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

    await connectToDatabase();

    // 1. Geocode location
    const coordinates = await geocodeLocation(location);

    // 2. Upload images
    const images: { url: string; filename: string }[] = [];
    for (const file of imageFiles) {
      if (file && file.size > 0) {
        const uploaded = await uploadImage(file);
        images.push(uploaded);
      }
    }

    if (images.length === 0) {
      // Add a default Unsplash image if no images were uploaded
      images.push({
        url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80',
        filename: 'YelpCamp/default_camp',
      });
    }

    // 3. Create and save campground
    const campground = new Campground({
      title,
      location,
      price,
      description,
      geometry: {
        type: 'Point',
        coordinates,
      },
      images,
      author: user._id,
    });

    await campground.save();
    
    // Path revalidation
    revalidatePath('/campgrounds');
    
    return { success: true, id: campground._id.toString(), error: '' };
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

    await connectToDatabase();
    const campground = await Campground.findById(id);
    if (!campground) {
      return { success: false, error: 'Campground not found', id: '' };
    }

    // Authorization check
    if (campground.author.toString() !== user._id.toString()) {
      return { success: false, error: 'You do not have permission to edit this campground', id: '' };
    }

    const title = formData.get('title') as string;
    const location = formData.get('location') as string;
    const price = Number(formData.get('price'));
    const description = formData.get('description') as string;
    const newImageFiles = formData.getAll('images') as File[];
    const deleteImages = formData.getAll('deleteImages') as string[]; // public IDs to delete

    if (!title || !location || isNaN(price) || !description) {
      return { success: false, error: 'All fields are required', id: '' };
    }

    // Update simple fields
    campground.title = title;
    campground.price = price;
    campground.description = description;

    // Check if location changed; if so, re-geocode
    if (campground.location !== location) {
      campground.location = location;
      const coordinates = await geocodeLocation(location);
      campground.geometry = {
        type: 'Point',
        coordinates,
      };
    }

    // Upload new images
    for (const file of newImageFiles) {
      if (file && file.size > 0) {
        const uploaded = await uploadImage(file);
        campground.images.push(uploaded);
      }
    }

    // Delete selected images
    if (deleteImages && deleteImages.length > 0) {
      // Remove from Cloudinary (only if configured and not mock IDs)
      const isCloudinaryConfigured =
        process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_KEY &&
        process.env.CLOUDINARY_SECRET;

      for (const filename of deleteImages) {
        if (isCloudinaryConfigured && !filename.startsWith('mock_')) {
          try {
            await cloudinary.uploader.destroy(filename);
          } catch (err) {
            console.error('Cloudinary destroy error:', err);
          }
        }
      }

      // Remove from campground database entry
      await campground.updateOne({
        $pull: { images: { filename: { $in: deleteImages } } },
      });
    }

    await campground.save();

    revalidatePath(`/campgrounds/${id}`);
    revalidatePath('/campgrounds');

    return { success: true, id: campground._id.toString(), error: '' };
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

    await connectToDatabase();
    const campground = await Campground.findById(id);
    if (!campground) {
      return { success: false, error: 'Campground not found' };
    }

    // Authorization check
    if (campground.author.toString() !== user._id.toString()) {
      return { success: false, error: 'You do not have permission to delete this campground' };
    }

    // Delete from Cloudinary
    const isCloudinaryConfigured =
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_KEY &&
      process.env.CLOUDINARY_SECRET;

    if (isCloudinaryConfigured) {
      for (const img of campground.images) {
        if (img.filename && !img.filename.startsWith('mock_')) {
          try {
            await cloudinary.uploader.destroy(img.filename);
          } catch (err) {
            console.error('Cloudinary destroy error:', err);
          }
        }
      }
    }

    // Delete campground (triggers review cleanup middleware)
    await Campground.findByIdAndDelete(id);

    revalidatePath('/campgrounds');

    return { success: true };
  } catch (error: any) {
    console.error('Delete campground error:', error);
    return { success: false, error: error.message || 'An error occurred while deleting campground' };
  }
}
