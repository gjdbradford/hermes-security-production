/**
 * Image utility functions for handling loading, errors, and optimization
 *
 * Updated to use CDN-based asset management system
 */

import { getAssetUrl, findAssetIdByPath } from '@/config/assets';

export interface ImageConfig {
  src: string;
  alt: string;
  fallback?: string;
  loading?: 'lazy' | 'eager';
  className?: string;
}

/**
 * Utility function to get the correct image path based on environment
 * Now uses CDN URLs when available, with fallback to local paths
 */
export function getImagePath(imagePath: string): string {
  // First, try to find asset by local path and get CDN URL
  const assetId = findAssetIdByPath(imagePath);
  if (assetId) {
    const cdnUrl = getAssetUrl(assetId);
    if (cdnUrl) {
      return cdnUrl;
    }
  }

  // Fallback to original logic for non-configured assets or when CDN is not available
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;

  // Check if we're in a browser environment (runtime)
  if (typeof window !== 'undefined') {
    // Use Vite's BASE_URL which is set by the vite.config.ts base option
    const basePath = import.meta.env.BASE_URL || '/';
    return `${basePath}${cleanPath}`;
  }

  // Build-time environment - check environment variables
  const isStaging = process.env.VITE_DEPLOY_ENV === 'staging';
  const basePath = isStaging ? '/hermes-security-production/' : '/';

  return `${basePath}${cleanPath}`;
}

/**
 * Get the correct base path for the current environment
 */
export function getBasePath(): string {
  // Check if we're in a browser environment (runtime)
  if (typeof window !== 'undefined') {
    return import.meta.env.BASE_URL || '/';
  }

  // Build-time environment
  const isStaging = process.env.VITE_DEPLOY_ENV === 'staging';
  return isStaging ? '/hermes-security-production/' : '/';
}

/**
 * Common image paths that can be used throughout the application
 * Now uses CDN URLs when available
 */
export const IMAGE_PATHS = {
  logo: () => getAssetUrl('logo-main'),
  heroBackground: () => getAssetUrl('hero-background'),
  favicon: () => getAssetUrl('favicon-ico'),
  placeholder: () => getAssetUrl('placeholder'),
  ogImage: () => getAssetUrl('og-image'),
  twitterImage: () => getAssetUrl('twitter-image'),
  caseStudies: {
    apiAttackPath: () => getAssetUrl('case-study-api'),
    cloudLateralMovement: () => getAssetUrl('case-study-cloud'),
    mobileSecurity: () => getAssetUrl('case-study-mobile'),
    webSecurity: () => getAssetUrl('case-study-web'),
    networkSecurity: () => getAssetUrl('case-study-network'),
  },
} as const;

/**
 * Handle image loading errors with fallback
 */
export const handleImageError = (
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  fallback?: string
) => {
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
export const getResponsiveImagePath = (
  basePath: string,
  _size: 'sm' | 'md' | 'lg' = 'md'
): string => {
  const extension = basePath.split('.').pop();
  const _baseName = basePath.replace(`.${extension}`, '');

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
  ERROR: 'error',
} as const;

export type ImageLoadingStateType = (typeof ImageLoadingState)[keyof typeof ImageLoadingState];
