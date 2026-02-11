// Cloudinary Image Upload Utilities

import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
if (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

/**
 * Upload image to Cloudinary
 * @param file - File to upload (base64 or file path)
 * @param folder - Folder name in Cloudinary
 * @returns Cloudinary URL
 */
export async function uploadToCloudinary(
  file: string,
  folder: string = 'learnify'
): Promise<string> {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    throw new Error('Cloudinary is not configured');
  }

  try {
    const result = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: 'auto',
      transformation: [
        { width: 1920, height: 1080, crop: 'limit', quality: 'auto:good' },
      ],
    });

    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
}

/**
 * Upload course thumbnail
 */
export async function uploadCourseThumbnail(file: string): Promise<string> {
  return uploadToCloudinary(file, 'learnify/courses/thumbnails');
}

/**
 * Upload instructor avatar
 */
export async function uploadInstructorAvatar(file: string): Promise<string> {
  return uploadToCloudinary(file, 'learnify/instructors');
}

/**
 * Upload user avatar
 */
export async function uploadUserAvatar(file: string): Promise<string> {
  return uploadToCloudinary(file, 'learnify/users');
}

/**
 * Delete image from Cloudinary
 * @param publicId - Cloudinary public ID
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    throw new Error('Cloudinary is not configured');
  }

  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw error;
  }
}

/**
 * Get optimized image URL from Cloudinary
 * @param url - Original Cloudinary URL
 * @param width - Desired width
 * @param height - Desired height
 * @returns Optimized URL
 */
export function getOptimizedImageUrl(
  url: string,
  width?: number,
  height?: number
): string {
  if (!url.includes('cloudinary.com')) {
    return url;
  }

  const baseUrl = url.split('/upload/')[0];
  const imagePath = url.split('/upload/')[1];

  let transformations = 'q_auto,f_auto';
  if (width) transformations += `,w_${width}`;
  if (height) transformations += `,h_${height},c_fill`;

  return `${baseUrl}/upload/${transformations}/${imagePath}`;
}

/**
 * Client-side upload to Cloudinary (using upload preset)
 * Use this function in client components
 */
export async function uploadToCloudinaryClient(
  file: File
): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary client configuration is missing');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Client upload error:', error);
    throw error;
  }
}
