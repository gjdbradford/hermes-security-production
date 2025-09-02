/**
 * Environment Detection Utilities
 * 
 * This file provides utility functions for detecting the current deployment environment
 * and can be used across the application for environment-specific behavior.
 */

/**
 * Get the current environment name
 * @returns 'production' | 'staging' | 'development'
 */
export const getEnvironmentName = (): string => {
  if (typeof window === 'undefined') {
    return 'development'; // Server-side rendering fallback
  }
  
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;
  
  // Production environments
  if (hostname === 'www.hermessecurity.io' || hostname === 'hermessecurity.io') {
    return 'production';
  }
  
  // Vercel production deployments
  if (hostname.includes('hermes-security-production') && hostname.includes('vercel.app')) {
    return 'production';
  }
  
  // GitHub Pages staging
  if (hostname === 'gjdbradford.github.io' && pathname.includes('/hermes-security-production/')) {
    return 'staging';
  }
  
  // Local development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'development';
  }
  
  // Default fallback
  return 'staging';
};

/**
 * Check if current environment is production
 */
export const isProduction = (): boolean => getEnvironmentName() === 'production';

/**
 * Check if current environment is staging
 */
export const isStaging = (): boolean => getEnvironmentName() === 'staging';

/**
 * Check if current environment is development
 */
export const isDevelopment = (): boolean => getEnvironmentName() === 'development';

/**
 * Get environment-specific configuration
 */
export const getEnvironmentConfig = () => {
  const env = getEnvironmentName();
  
  switch (env) {
    case 'production':
      return {
        webhookUrl: 'https://ilovemylife.app.n8n.cloud/webhook/a57cf53e-c2d6-4e59-8e38-44b774355629',
        cdnBaseUrl: 'https://fiwymn5e6h2iyex9.public.blob.vercel-storage.com',
        apiBaseUrl: 'https://api.hermessecurity.io',
        logLevel: 'error'
      };
      
    case 'staging':
      return {
        webhookUrl: 'https://ilovemylife.app.n8n.cloud/webhook-test/a57cf53e-c2d6-4e59-8e38-44b774355629',
        cdnBaseUrl: 'https://fiwymn5e6h2iyex9.public.blob.vercel-storage.com',
        apiBaseUrl: 'https://staging-api.hermessecurity.io',
        logLevel: 'warn'
      };
      
    case 'development':
    default:
      return {
        webhookUrl: 'https://ilovemylife.app.n8n.cloud/webhook-test/a57cf53e-c2d6-4e59-8e38-44b774355629',
        cdnBaseUrl: 'https://fiwymn5e6h2iyex9.public.blob.vercel-storage.com',
        apiBaseUrl: 'http://localhost:8080',
        logLevel: 'log'
      };
  }
};

/**
 * Log environment information (useful for debugging)
 */
export const logEnvironmentInfo = (): void => {
  if (typeof console === 'undefined') return;
  
  const env = getEnvironmentName();
  const config = getEnvironmentConfig();
  
  console.log('🌍 Environment Information:');
  console.log('   Name:', env);
  console.log('   Webhook URL:', config.webhookUrl);
  console.log('   CDN Base URL:', config.cdnBaseUrl);
  console.log('   API Base URL:', config.apiBaseUrl);
  console.log('   Log Level:', config.logLevel);
  console.log('   Is Production:', isProduction());
  console.log('   Is Staging:', isStaging());
  console.log('   Is Development:', isDevelopment());
};
