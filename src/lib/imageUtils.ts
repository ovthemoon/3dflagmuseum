// src/lib/imageUtils.ts
import { FlagData, flagMockData, createNewFlagData } from './FlagMockData';

// Interface for the file upload result
export interface UploadResult {
  success: boolean;
  imagePath?: string;
  error?: string;
}

// Image upload utility function
export async function uploadImage(file: File): Promise<UploadResult> {
  // Check file size (e.g., limit to 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return {
      success: false,
      error: 'File size exceeds 5MB limit'
    };
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return {
      success: false,
      error: 'Invalid file type. Please upload JPEG, PNG, GIF, or WebP.'
    };
  }

  try {
    // Create a unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 7);
    const fileExtension = file.name.split('.').pop();
    const newFileName = `flag_${timestamp}_${randomString}.${fileExtension}`;

    // In a real application, this would be replaced with actual file upload logic
    // For now, we'll simulate a successful upload
    const imagePath = `/uploads/${newFileName}`;

    return {
      success: true,
      imagePath: imagePath
    };
  } catch (error) {
    console.error('Image upload error:', error);
    return {
      success: false,
      error: 'Failed to upload image'
    };
  }
}

// Image list retrieval (existing implementation)
export async function getFlagDataList(): Promise<FlagData[]> {
  return flagMockData;
}

// Flag creation utility (updated to use image upload)
export async function uploadNewFlag(
  username: string,
  flagName: string,
  description: string,
  imageFile: File
): Promise<FlagData | null> {
  try {
    // First, upload the image
    const uploadResult = await uploadImage(imageFile);

    if (!uploadResult.success || !uploadResult.imagePath) {
      throw new Error(uploadResult.error || 'Image upload failed');
    }

    // Create new flag data with the uploaded image path
    const newFlagData = createNewFlagData(
      username,
      flagName,
      description,
      uploadResult.imagePath
    );

    // In a real application, this would be a server-side operation
    flagMockData.push(newFlagData);

    return newFlagData;
  } catch (error) {
    console.error('Flag upload error:', error);
    return null;
  }
}