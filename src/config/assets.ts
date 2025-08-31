/**
 * Asset Configuration System
 * 
 * This file manages all static assets (images, documents, etc.) for the application.
 * Assets are stored in a CDN and referenced by their full URLs for optimal performance.
 * 
 * Last updated: 2025-08-31T12:36:20.272Z
 */

export interface AssetConfig {
  id: string;
  name: string;
  category: 'logo' | 'background' | 'icon' | 'social' | 'case-study' | 'document';
  localPath: string;
  cdnUrl?: string;
  alt: string;
  width?: number;
  height?: number;
  optimized?: boolean;
  lastUpdated: string;
  description?: string;
}

/**
 * Master asset configuration
 * Add new assets here and run `npm run assets:sync` to upload to CDN
 */
export const ASSET_CONFIG: AssetConfig[] = [
  {
    "id": "logo-main",
    "name": "Hermes Security Logo",
    "category": "logo",
    "localPath": "images/logos/logo.svg",
    "alt": "Hermes Security Logo",
    "width": 200,
    "height": 60,
    "lastUpdated": "2025-08-31T12:36:20.269Z",
    "description": "Main company logo used in header and branding",
    "cdnUrl": "https://fiwymn5e6h2iyex9.public.blob.vercel-storage.com/logo.svg"
  },
  {
    "id": "hero-background",
    "name": "Hero Background",
    "category": "background",
    "localPath": "images/backgrounds/hero-bg.jpg",
    "alt": "Hero section background with cybersecurity theme",
    "width": 1920,
    "height": 1080,
    "lastUpdated": "2025-08-31T12:36:20.272Z",
    "description": "Background image for the hero section",
    "cdnUrl": "https://fiwymn5e6h2iyex9.public.blob.vercel-storage.com/hero-bg.jpg"
  },
  {
    "id": "favicon",
    "name": "Favicon",
    "category": "icon",
    "localPath": "images/icons/favicon.svg",
    "alt": "Hermes Security Favicon",
    "width": 32,
    "height": 32,
    "lastUpdated": "2025-08-31T12:36:20.272Z",
    "description": "Browser favicon",
    "cdnUrl": "https://fiwymn5e6h2iyex9.public.blob.vercel-storage.com/favicon.svg"
  },
  {
    "id": "placeholder",
    "name": "Image Placeholder",
    "category": "icon",
    "localPath": "images/icons/placeholder.svg",
    "alt": "Image placeholder",
    "width": 300,
    "height": 200,
    "lastUpdated": "2025-08-31T12:36:20.272Z",
    "description": "Fallback image for missing or failed images",
    "cdnUrl": "https://fiwymn5e6h2iyex9.public.blob.vercel-storage.com/placeholder.svg"
  },
  {
    "id": "og-image",
    "name": "Open Graph Image",
    "category": "social",
    "localPath": "images/social/og-image.svg",
    "alt": "Hermes Security - AI-Driven Penetration Testing",
    "width": 1200,
    "height": 630,
    "lastUpdated": "2025-08-31T12:36:20.272Z",
    "description": "Social media preview image for Open Graph",
    "cdnUrl": "https://fiwymn5e6h2iyex9.public.blob.vercel-storage.com/og-image.svg"
  },
  {
    "id": "twitter-image",
    "name": "Twitter Card Image",
    "category": "social",
    "localPath": "images/social/twitter-image.svg",
    "alt": "Hermes Security - AI-Driven Penetration Testing",
    "width": 1200,
    "height": 630,
    "lastUpdated": "2025-08-31T12:36:20.272Z",
    "description": "Social media preview image for Twitter Cards",
    "cdnUrl": "https://fiwymn5e6h2iyex9.public.blob.vercel-storage.com/twitter-image.svg"
  },
  {
    "id": "case-study-api",
    "name": "API Attack Path",
    "category": "case-study",
    "localPath": "images/case-studies/api-attack-path.svg",
    "alt": "API security attack path visualization",
    "width": 400,
    "height": 300,
    "lastUpdated": "2025-08-31T12:36:20.272Z",
    "description": "Visualization of API security attack paths",
    "cdnUrl": "https://fiwymn5e6h2iyex9.public.blob.vercel-storage.com/api-attack-path.svg"
  },
  {
    "id": "case-study-cloud",
    "name": "Cloud Lateral Movement",
    "category": "case-study",
    "localPath": "images/case-studies/cloud-lateral-movement.svg",
    "alt": "Cloud security lateral movement visualization",
    "width": 400,
    "height": 300,
    "lastUpdated": "2025-08-31T12:36:20.272Z",
    "description": "Visualization of cloud lateral movement attacks",
    "cdnUrl": "https://fiwymn5e6h2iyex9.public.blob.vercel-storage.com/cloud-lateral-movement.svg"
  },
  {
    "id": "case-study-mobile",
    "name": "Mobile Security",
    "category": "case-study",
    "localPath": "images/case-studies/mobile-security.svg",
    "alt": "Mobile security testing visualization",
    "width": 400,
    "height": 300,
    "lastUpdated": "2025-08-31T12:36:20.272Z",
    "description": "Visualization of mobile security testing scenarios",
    "cdnUrl": "https://fiwymn5e6h2iyex9.public.blob.vercel-storage.com/mobile-security.svg"
  },
  {
    "id": "case-study-web",
    "name": "Web Security",
    "category": "case-study",
    "localPath": "images/case-studies/web-security.svg",
    "alt": "Web application security visualization",
    "width": 400,
    "height": 300,
    "lastUpdated": "2025-08-31T12:36:20.272Z",
    "description": "Visualization of web application security testing",
    "cdnUrl": "https://fiwymn5e6h2iyex9.public.blob.vercel-storage.com/web-security.svg"
  },
  {
    "id": "case-study-network",
    "name": "Network Security",
    "category": "case-study",
    "localPath": "images/case-studies/network-security.svg",
    "alt": "Network security testing visualization",
    "width": 400,
    "height": 300,
    "lastUpdated": "2025-08-31T12:36:20.272Z",
    "description": "Visualization of network security testing scenarios",
    "cdnUrl": "https://fiwymn5e6h2iyex9.public.blob.vercel-storage.com/network-security.svg"
  }
];

/**
 * Get asset URL by ID
 * Returns CDN URL if available, otherwise falls back to local path
 */
export const getAssetUrl = (id: string): string => {
  const asset = ASSET_CONFIG.find(a => a.id === id);
  if (!asset) {
    console.warn(`Asset not found: ${id}`);
    return '';
  }
  
  // Use CDN URL if available, fallback to local path
  return asset.cdnUrl || `/${asset.localPath}`;
};

/**
 * Get asset configuration by ID
 */
export const getAssetConfig = (id: string): AssetConfig | undefined => {
  return ASSET_CONFIG.find(a => a.id === id);
};

/**
 * Get all assets by category
 */
export const getAssetsByCategory = (category: AssetConfig['category']): AssetConfig[] => {
  return ASSET_CONFIG.filter(a => a.category === category);
};

/**
 * Find asset ID by local path
 */
export const findAssetIdByPath = (path: string): string | null => {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const asset = ASSET_CONFIG.find(a => a.localPath === cleanPath);
  return asset?.id || null;
};

/**
 * Check if asset has CDN URL
 */
export const hasCdnUrl = (id: string): boolean => {
  const asset = getAssetConfig(id);
  return Boolean(asset?.cdnUrl);
};

/**
 * Get asset statistics
 */
export const getAssetStats = () => {
  const total = ASSET_CONFIG.length;
  const withCdn = ASSET_CONFIG.filter(a => a.cdnUrl).length;
  const withoutCdn = total - withCdn;
  
  return {
    total,
    withCdn,
    withoutCdn,
    cdnPercentage: Math.round((withCdn / total) * 100)
  };
};
