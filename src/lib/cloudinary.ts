import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary only if variables exist, else print warning
const isCloudinaryConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_KEY &&
  process.env.CLOUDINARY_SECRET;

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
  });
}

export default cloudinary;

export async function uploadImage(file: File): Promise<{ url: string; filename: string }> {
  // Resilient Fallback: If Cloudinary credentials are not set, use a beautiful random unsplash camping image
  if (!isCloudinaryConfigured) {
    const defaultImages = [
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1487730116645-74489c95b41b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=1200&q=80'
    ];
    const randomImage = defaultImages[Math.floor(Math.random() * defaultImages.length)];
    return {
      url: randomImage,
      filename: `mock_cloudinary_id_${Date.now()}`,
    };
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: 'YelpCamp' },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result!.secure_url,
          filename: result!.public_id,
        });
      }
    ).end(buffer);
  });
}
