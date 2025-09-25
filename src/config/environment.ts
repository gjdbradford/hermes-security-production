/**
 * Environment Configuration
 *
 * This file manages environment-specific configurations for different deployment targets.
 * It automatically detects the current environment and provides appropriate settings.
 */

export interface EnvironmentConfig {
  name: string;
  webhookUrl: string;
  cdnBaseUrl: string;
  apiBaseUrl: string;
  isProduction: boolean;
  isStaging: boolean;
  isDevelopment: boolean;
}

/**
 * Detect current environment based on hostname
 */
const detectEnvironment = (): EnvironmentConfig => {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';

  // Production environments
  if (hostname === 'www.hermessecurity.io' || hostname === 'hermessecurity.io') {
    return {
      name: 'production',
      webhookUrl: 'https://ilovemylife.app.n8n.cloud/webhook/a57cf53e-c2d6-4e59-8e38-44b774355629',
      cdnBaseUrl: 'https://fiwymn5e6h2iyex9.public.blob.vercel-storage.com',
      apiBaseUrl: 'https://api.hermessecurity.io',
      isProduction: true,
      isStaging: false,
      isDevelopment: false,
    };
  }

  // Vercel staging environment
  if (hostname === 'hermes-security-staging.vercel.app') {
    return {
      name: 'staging',
      webhookUrl:
        'https://ilovemylife.app.n8n.cloud/webhook-test/a57cf53e-c2d6-4e59-8e38-44b774355629',
      cdnBaseUrl: 'https://fiwymn5e6h2iyex9.public.blob.vercel-storage.com',
      apiBaseUrl: 'https://hermes-security-staging.vercel.app/api',
      isProduction: false,
      isStaging: true,
      isDevelopment: false,
    };
  }

  // Vercel production deployments (fallback)
  if (hostname.includes('hermes-security-production') && hostname.includes('vercel.app')) {
    return {
      name: 'production',
      webhookUrl: 'https://ilovemylife.app.n8n.cloud/webhook/a57cf53e-c2d6-4e59-8e38-44b774355629',
      cdnBaseUrl: 'https://fiwymn5e6h2iyex9.public.blob.vercel-storage.com',
      apiBaseUrl: 'https://api.hermessecurity.io',
      isProduction: true,
      isStaging: false,
      isDevelopment: false,
    };
  }

  // Local development (uses staging database)
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '') {
    return {
      name: 'development',
      webhookUrl:
        'https://ilovemylife.app.n8n.cloud/webhook-test/a57cf53e-c2d6-4e59-8e38-44b774355629',
      cdnBaseUrl: 'https://fiwymn5e6h2iyex9.public.blob.vercel-storage.com',
      apiBaseUrl: 'http://localhost:8080',
      isProduction: false,
      isStaging: true, // Local development now uses staging database
      isDevelopment: true,
    };
  }

  // Default fallback (staging environment)
  return {
    name: 'staging',
    webhookUrl:
      'https://ilovemylife.app.n8n.cloud/webhook-test/a57cf53e-c2d6-4e59-8e38-44b774355629',
    cdnBaseUrl: 'https://fiwymn5e6h2iyex9.public.blob.vercel-storage.com',
    apiBaseUrl: 'https://hermes-security-staging.vercel.app/api',
    isProduction: false,
    isStaging: true,
    isDevelopment: false,
  };
};

/**
 * Current environment configuration
 */
export const ENV_CONFIG = detectEnvironment();

/**
 * Get webhook URL for current environment
 */
export const getWebhookUrl = (): string => ENV_CONFIG.webhookUrl;

/**
 * Get CDN base URL for current environment
 */
export const getCdnBaseUrl = (): string => ENV_CONFIG.cdnBaseUrl;

/**
 * Get API base URL for current environment
 */
export const getApiBaseUrl = (): string => ENV_CONFIG.apiBaseUrl;

/**
 * Check if current environment is production
 */
export const isProduction = (): boolean => ENV_CONFIG.isProduction;

/**
 * Check if current environment is staging
 */
export const isStaging = (): boolean => ENV_CONFIG.isStaging;

/**
 * Check if current environment is development
 */
export const isDevelopment = (): boolean => ENV_CONFIG.isDevelopment;

/**
 * Get environment name
 */
export const getEnvironmentName = (): string => ENV_CONFIG.name;

/**
 * Log environment information (useful for debugging)
 */
export const logEnvironmentInfo = (): void => {
  if (typeof console !== 'undefined') {
    console.log('🌍 Environment Configuration:');
    console.log('   Name:', ENV_CONFIG.name);
    console.log('   Webhook URL:', ENV_CONFIG.webhookUrl);
    console.log('   CDN Base URL:', ENV_CONFIG.cdnBaseUrl);
    console.log('   API Base URL:', ENV_CONFIG.apiBaseUrl);
    console.log('   Is Production:', ENV_CONFIG.isProduction);
    console.log('   Is Staging:', ENV_CONFIG.isStaging);
    console.log('   Is Development:', ENV_CONFIG.isDevelopment);
  }
};
