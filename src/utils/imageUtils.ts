/**
 * Image utility functions for handling loading, errors, and optimization
 */

export interface ImageConfig {
  src: string;
  alt: string;
  fallback?: string;
  loading?: 'lazy' | 'eager';
  className?: string;
}

/**
 * Get the correct image path based on environment
 */
export const getImagePath = (path: string): string => {
  // Remove any leading slashes to ensure consistent path handling
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // In development, use relative paths
  if (import.meta.env.DEV) {
    return `/${cleanPath}`;
  }
  
  // In production, use the base path
  return `/${cleanPath}`;
};

/**
 * Handle image loading errors with fallback
 */
export const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>, fallback?: string) => {
  const img = event.currentTarget;
  
  if (fallback && img.src !== fallback) {
    img.src = fallback;
  } else {
    // Use a default placeholder if no fallback is provided
    img.src = '/images/icons/placeholder.svg';
  }
  
  console.warn(`Image failed to load: ${img.src}`);
};

/**
 * Preload critical images
 */
export const preloadImages = (imagePaths: string[]): void => {
  imagePaths.forEach(path => {
    const img = new Image();
    img.src = getImagePath(path);
  });
};

/**
 * Get optimized image path for different screen sizes
 */
export const getResponsiveImagePath = (basePath: string, size: 'sm' | 'md' | 'lg' = 'md'): string => {
  const extension = basePath.split('.').pop();
  const baseName = basePath.replace(`.${extension}`, '');
  
  // For now, return the original path
  // In the future, this could return different sized images
  return getImagePath(basePath);
};

/**
 * Image loading states
 */
export const ImageLoadingState = {
  LOADING: 'loading',
  LOADED: 'loaded',
  ERROR: 'error'
} as const;

export type ImageLoadingStateType = typeof ImageLoadingState[keyof typeof ImageLoadingState];
