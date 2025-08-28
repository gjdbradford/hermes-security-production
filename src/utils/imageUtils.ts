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
 * Utility function to get the correct image path based on environment
 * This ensures images work correctly in both development and production
 */
export function getImagePath(imagePath: string): string {
  // Remove leading slash if present
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  
  // In development, use relative paths
  if (import.meta.env.DEV) {
    return `/${cleanPath}`;
  }
  
  // In production, check if we're in staging or production
  const isStaging = import.meta.env.VITE_DEPLOY_ENV === 'staging';
  const basePath = isStaging ? '/hermes-security-production/' : '/';
  
  return `${basePath}${cleanPath}`;
}

/**
 * Get the correct base path for the current environment
 */
export function getBasePath(): string {
  if (import.meta.env.DEV) {
    return '/';
  }
  
  const isStaging = import.meta.env.VITE_DEPLOY_ENV === 'staging';
  return isStaging ? '/hermes-security-production/' : '/';
}

/**
 * Common image paths that can be used throughout the application
 */
export const IMAGE_PATHS = {
  logo: () => getImagePath('images/logos/logo.svg'),
  heroBackground: () => getImagePath('images/backgrounds/hero-bg.jpg'),
  favicon: () => getImagePath('images/icons/favicon.svg'),
  placeholder: () => getImagePath('images/icons/placeholder.svg'),
  ogImage: () => getImagePath('images/social/og-image.svg'),
  twitterImage: () => getImagePath('images/social/twitter-image.svg'),
  caseStudies: {
    apiAttackPath: () => getImagePath('images/case-studies/api-attack-path.svg'),
    cloudLateralMovement: () => getImagePath('images/case-studies/cloud-lateral-movement.svg'),
    mobileSecurity: () => getImagePath('images/case-studies/mobile-security.svg'),
    webSecurity: () => getImagePath('images/case-studies/web-security.svg'),
    networkSecurity: () => getImagePath('images/case-studies/network-security.svg'),
  }
} as const;

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
