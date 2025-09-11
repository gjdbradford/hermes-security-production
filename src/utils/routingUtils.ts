/**
 * Routing utilities for handling different deployment environments
 */

// Get the base path for the current environment
export const getBasePath = (): string => {
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;

  console.log('🔍 Routing Debug:', { hostname, pathname });

  // Check if we're in a staging environment
  if (pathname.includes('/hermes-security-production/')) {
    console.log('🏗️ Detected staging environment');
    return '/hermes-security-production/';
  }

  // Check if we're in development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    console.log('💻 Detected development environment');
    return '/';
  }

  // Check if we're on GitHub Pages staging domain
  if (hostname === 'gjdbradford.github.io' && pathname.includes('/hermes-security-production/')) {
    console.log('🏗️ Detected GitHub Pages staging environment');
    return '/hermes-security-production/';
  }

  // Check if we're on Vercel production domain
  if (hostname === 'hermes-security-production-o1yyi3yd1-gjdbradford-5891s-projects.vercel.app') {
    console.log('🚀 Detected Vercel production environment');
    return '/';
  }

  // Default to root for production
  console.log('🚀 Detected production environment');
  return '/';
};

// Build a URL with the correct base path
export const buildUrl = (path: string): string => {
  const basePath = getBasePath();
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  let finalUrl: string;

  if (basePath === '/') {
    finalUrl = `/#/${cleanPath}`;
  } else {
    finalUrl = `${basePath}#/${cleanPath}`;
  }

  console.log('🔗 Built URL:', { basePath, cleanPath, finalUrl });
  return finalUrl;
};

// Get the current environment type
export const getEnvironment = (): 'development' | 'staging' | 'production' => {
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'development';
  }

  if (pathname.includes('/hermes-security-production/') ||
      (hostname === 'gjdbradford.github.io' && pathname.includes('/hermes-security-production/'))) {
    return 'staging';
  }

  if (hostname === 'hermes-security-production-o1yyi3yd1-gjdbradford-5891s-projects.vercel.app') {
    return 'production';
  }

  return 'production';
};

// Log environment info for debugging
export const logEnvironmentInfo = (): void => {
  console.log('🌍 Environment Info:', {
    hostname: window.location.hostname,
    pathname: window.location.pathname,
    basePath: getBasePath(),
    environment: getEnvironment(),
    fullUrl: window.location.href,
    origin: window.location.origin
  });
};
