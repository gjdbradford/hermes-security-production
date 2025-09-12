/**
 * Routing utilities for handling different deployment environments
 */

// Cache for base path to prevent repeated calculations and logging
let cachedBasePath: string | null = null;
let hasLoggedEnvironment = false;

// Function to clear cache (for testing purposes)
export const clearRoutingCache = (): void => {
  cachedBasePath = null;
  hasLoggedEnvironment = false;
  if (typeof window !== 'undefined') {
    (window as any).urlBuildLogged = false;
    (window as any).environmentInfoLogged = false;
  }
};

// Get the base path for the current environment
export const getBasePath = (): string => {
  // Return cached value if available
  if (cachedBasePath !== null) {
    return cachedBasePath;
  }

  const hostname = window.location.hostname;
  const pathname = window.location.pathname;

  // Only log once per session to prevent spam
  if (!hasLoggedEnvironment) {
    console.log('🔍 Routing Debug:', { hostname, pathname });
    hasLoggedEnvironment = true;
  }

  // Check if we're in a staging environment
  if (pathname.includes('/hermes-security-production/')) {
    if (!hasLoggedEnvironment) {
      console.log('🏗️ Detected staging environment');
    }
    cachedBasePath = '/hermes-security-production/';
    return cachedBasePath;
  }

  // Check if we're in development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    if (!hasLoggedEnvironment) {
      console.log('💻 Detected development environment');
    }
    cachedBasePath = '/';
    return cachedBasePath;
  }

  // Check if we're on GitHub Pages staging domain
  if (hostname === 'gjdbradford.github.io') {
    if (!hasLoggedEnvironment) {
      console.log('🏗️ Detected GitHub Pages staging environment');
    }
    cachedBasePath = '/hermes-security-production/';
    return cachedBasePath;
  }

  // Check if we're on Vercel production domain
  if (hostname === 'hermes-security-production-o1yyi3yd1-gjdbradford-5891s-projects.vercel.app') {
    if (!hasLoggedEnvironment) {
      console.log('🚀 Detected Vercel production environment');
    }
    cachedBasePath = '/';
    return cachedBasePath;
  }

  // Default to root for production
  if (!hasLoggedEnvironment) {
    console.log('🚀 Detected production environment');
  }
  cachedBasePath = '/';
  return cachedBasePath;
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

  // Only log URL building in development and only once per unique path
  if (process.env.NODE_ENV === 'development' && !(window as any).urlBuildLogged) {
    console.log('🔗 Built URL:', { basePath, cleanPath, finalUrl });
    (window as any).urlBuildLogged = true;
  }

  return finalUrl;
};

// Get the current environment type
export const getEnvironment = (): 'development' | 'staging' | 'production' => {
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'development';
  }

  if (
    pathname.includes('/hermes-security-production/') ||
    (hostname === 'gjdbradford.github.io' && pathname.includes('/hermes-security-production/'))
  ) {
    return 'staging';
  }

  if (hostname === 'hermes-security-production-o1yyi3yd1-gjdbradford-5891s-projects.vercel.app') {
    return 'production';
  }

  return 'production';
};

// Log environment info for debugging (only once per session)
export const logEnvironmentInfo = (): void => {
  if (!(window as any).environmentInfoLogged) {
    console.log('🌍 Environment Info:', {
      hostname: window.location.hostname,
      pathname: window.location.pathname,
      basePath: getBasePath(),
      environment: getEnvironment(),
      fullUrl: window.location.href,
      origin: window.location.origin,
    });
    (window as any).environmentInfoLogged = true;
  }
};
