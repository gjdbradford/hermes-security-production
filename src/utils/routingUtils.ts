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

  // Only log once per session to prevent spam
  if (!hasLoggedEnvironment) {
    console.log('🔍 Routing Debug:', { hostname });
    hasLoggedEnvironment = true;
  }

  // Check for GitHub Pages staging environment
  if (hostname === 'gjdbradford.github.io') {
    cachedBasePath = '/hermes-security-production/';
    return cachedBasePath;
  }

  // All other environments use root path
  if (!hasLoggedEnvironment) {
    console.log('🌍 Detected environment:', hostname);
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

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'development';
  }

  if (
    hostname === 'hermes-security-staging.vercel.app' ||
    hostname.includes('staging') ||
    hostname === 'hermes-security-production.vercel.app'
  ) {
    return 'staging';
  }

  if (hostname === 'gjdbradford.github.io') {
    return 'staging';
  }

  // All other environments are production
  return 'production';
};

// Navigate to a path using proper routing
export const navigateTo = (path: string): void => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  // Use proper navigation method instead of direct href assignment
  if (typeof window !== 'undefined' && window.location) {
    window.location.assign(cleanPath);
  }
};

// Navigate to needs assessment with email parameter
export const navigateToNeedsAssessment = (email: string): void => {
  const encodedEmail = encodeURIComponent(email);
  navigateTo(`/needs-assessment?email=${encodedEmail}`);
};

// Navigate to home page
export const navigateToHome = (): void => {
  navigateTo('/');
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
