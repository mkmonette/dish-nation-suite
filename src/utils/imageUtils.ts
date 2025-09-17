/**
 * Image utility functions for handling uploads, compression, and validation
 */

export interface ImageProcessingOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

export interface ImageValidationResult {
  isValid: boolean;
  error?: string;
  file?: File;
}

/**
 * Validates image file size and type
 */
export const validateImageFile = (file: File, maxSizeMB: number): ImageValidationResult => {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { isValid: false, error: 'Please select an image file' };
  }

  // Check supported formats
  const supportedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!supportedFormats.includes(file.type)) {
    return { isValid: false, error: 'Please use JPG, PNG, or WebP format' };
  }

  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return { isValid: false, error: `File size must be less than ${maxSizeMB}MB` };
  }

  return { isValid: true, file };
};

/**
 * Compresses and resizes an image file
 */
export const compressImage = (
  file: File, 
  options: ImageProcessingOptions = {}
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const {
      maxWidth = 1920,
      maxHeight = 1080,
      quality = 0.8,
      format = 'jpeg'
    } = options;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    if (!ctx) {
      reject(new Error('Canvas not supported'));
      return;
    }

    img.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      let { width, height } = img;
      
      if (width > maxWidth || height > maxHeight) {
        const aspectRatio = width / height;
        
        if (width > height) {
          width = Math.min(width, maxWidth);
          height = width / aspectRatio;
        } else {
          height = Math.min(height, maxHeight);
          width = height * aspectRatio;
        }
      }

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Draw and compress image
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert to base64 with compression
      const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
      const compressedDataUrl = canvas.toDataURL(mimeType, quality);
      
      resolve(compressedDataUrl);
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Creates a preview URL for an image file
 */
export const createImagePreview = (file: File): string => {
  return URL.createObjectURL(file);
};

/**
 * Cleans up preview URLs to prevent memory leaks
 */
export const cleanupImagePreview = (url: string): void => {
  if (url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};

/**
 * Gets optimized image options based on image type
 */
export const getImageProcessingOptions = (type: 'logo' | 'banner'): ImageProcessingOptions => {
  switch (type) {
    case 'logo':
      return {
        maxWidth: 400,
        maxHeight: 400,
        quality: 0.9,
        format: 'png'
      };
    case 'banner':
      return {
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 0.8,
        format: 'jpeg'
      };
    default:
      return {};
  }
};

/**
 * Checks if a string is a valid base64 image
 */
export const isValidImageDataUrl = (dataUrl: string): boolean => {
  if (!dataUrl.startsWith('data:image/')) return false;
  
  try {
    // Try to create an image element to validate
    const img = new Image();
    img.src = dataUrl;
    return true;
  } catch {
    return false;
  }
};

/**
 * Gets the file size of a base64 image in MB
 */
export const getBase64ImageSize = (base64: string): number => {
  // Remove data URL prefix
  const base64Data = base64.split(',')[1] || base64;
  
  // Calculate size (base64 is ~33% larger than original)
  const sizeInBytes = (base64Data.length * 3) / 4;
  return sizeInBytes / (1024 * 1024);
};

/**
 * Default placeholder images for various types
 */
export const getDefaultPlaceholder = (type: 'logo' | 'banner' | 'hero' | 'food' | 'profile'): string => {
  if (type === 'logo') {
    // Simple SVG logo placeholder
    return `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
        <rect width="200" height="200" fill="#f3f4f6" rx="20"/>
        <circle cx="100" cy="80" r="30" fill="#9ca3af"/>
        <rect x="50" y="130" width="100" height="8" fill="#9ca3af" rx="4"/>
        <rect x="70" y="150" width="60" height="6" fill="#d1d5db" rx="3"/>
      </svg>
    `)}`;
  } else if (type === 'food') {
    // Food placeholder
    return `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
        <rect width="400" height="300" fill="#f9fafb"/>
        <circle cx="200" cy="150" r="80" fill="#e5e7eb"/>
        <circle cx="200" cy="150" r="50" fill="#9ca3af"/>
        <rect x="160" y="180" width="80" height="8" fill="#6b7280" rx="4"/>
      </svg>
    `)}`;
  } else if (type === 'hero') {
    // Hero background placeholder
    return `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#6366f1;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#8b5cf6;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#ec4899;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="1920" height="1080" fill="url(#grad)"/>
      </svg>
    `)}`;
  } else if (type === 'profile') {
    // Profile placeholder
    return `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
        <rect width="100" height="100" fill="#f3f4f6" rx="50"/>
        <circle cx="50" cy="35" r="15" fill="#9ca3af"/>
        <path d="M25 75 Q25 60 50 60 Q75 60 75 75" fill="#9ca3af"/>
      </svg>
    `)}`;
  } else {
    // Banner/default placeholder
    return `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400">
        <rect width="800" height="400" fill="#f9fafb"/>
        <rect x="300" y="150" width="200" height="100" fill="#e5e7eb" rx="10"/>
        <rect x="320" y="170" width="160" height="12" fill="#9ca3af" rx="6"/>
        <rect x="340" y="200" width="120" height="8" fill="#d1d5db" rx="4"/>
        <rect x="360" y="220" width="80" height="8" fill="#d1d5db" rx="4"/>
      </svg>
    `)}`;
  }
};