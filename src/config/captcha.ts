/**
 * CAPTCHA Configuration System
 * 
 * This file manages Google reCAPTCHA v3 configuration across different environments.
 * It provides environment-specific site keys, thresholds, and settings.
 * 
 * Last updated: 2025-09-08T08:51:00.000Z
 */

import { getEnvironmentName, isDevelopment, isStaging, isProduction } from '../utils/environment';

// Extend window interface for debug flags
declare global {
  interface Window {
    captchaConfigLogged?: boolean;
    captchaProviderLogged?: boolean;
    contactFormCaptchaLogged?: boolean;
    contactFormCtaLogged?: boolean;
  }
}

export interface CaptchaConfig {
  siteKey: string;
  secretKey: string;
  threshold: number;
  enabled: boolean;
  debug: boolean;
}

/**
 * Environment-specific CAPTCHA configuration
 * 
 * IMPORTANT: Replace the placeholder keys with your actual Google reCAPTCHA keys
 * You can obtain these from: https://www.google.com/recaptcha/admin/create
 */
const CAPTCHA_CONFIGS: Record<string, CaptchaConfig> = {
  production: {
    siteKey: import.meta.env.VITE_RECAPTCHA_SITE_KEY_PRODUCTION || '6LdvzKUrAAAAAALYd3dIR0PLgmBUD-iLLtwngCic',
    secretKey: import.meta.env.VITE_RECAPTCHA_SECRET_KEY_PRODUCTION || 'YOUR_PRODUCTION_SECRET_KEY',
    threshold: 0.5, // Higher threshold for production security
    enabled: true,
    debug: false
  },
  staging: {
    siteKey: import.meta.env.VITE_RECAPTCHA_SITE_KEY_STAGING || '6LdvzKUrAAAAAALYd3dIR0PLgmBUD-iLLtwngCic',
    secretKey: import.meta.env.VITE_RECAPTCHA_SECRET_KEY_STAGING || 'YOUR_STAGING_SECRET_KEY',
    threshold: 0.3, // Lower threshold for testing
    enabled: true,
    debug: true
  },
  development: {
    siteKey: import.meta.env.VITE_RECAPTCHA_SITE_KEY_DEVELOPMENT || '6LdvzKUrAAAAAALYd3dIR0PLgmBUD-iLLtwngCic',
    secretKey: import.meta.env.VITE_RECAPTCHA_SECRET_KEY_DEVELOPMENT || 'YOUR_DEV_SECRET_KEY',
    threshold: 0.1, // Very low threshold for development
    enabled: true, // Set to false to bypass CAPTCHA in development
    debug: false // Set to true for verbose logging
  }
};

/**
 * Get CAPTCHA configuration for current environment
 */
export const getCaptchaConfig = (): CaptchaConfig => {
  const environment = getEnvironmentName();
  const config = CAPTCHA_CONFIGS[environment] || CAPTCHA_CONFIGS.development;
  
  // Log configuration for debugging (only once)
  if (config.debug && !window.captchaConfigLogged) {
    console.log('🔐 CAPTCHA Configuration:', {
      environment,
      siteKey: config.siteKey.substring(0, 10) + '...',
      threshold: config.threshold,
      enabled: config.enabled,
      debug: config.debug
    });
    window.captchaConfigLogged = true;
  }
  
  return config;
};

/**
 * Check if CAPTCHA is enabled for current environment
 */
export const isCaptchaEnabled = (): boolean => {
  const config = getCaptchaConfig();
  return config.enabled && config.siteKey !== 'YOUR_PRODUCTION_SITE_KEY' && 
         config.siteKey !== 'YOUR_STAGING_SITE_KEY' && 
         config.siteKey !== 'YOUR_DEV_SITE_KEY';
};

/**
 * Get CAPTCHA site key for current environment
 */
export const getCaptchaSiteKey = (): string => {
  const config = getCaptchaConfig();
  return config.siteKey;
};

/**
 * Get CAPTCHA threshold for current environment
 */
export const getCaptchaThreshold = (): number => {
  const config = getCaptchaConfig();
  return config.threshold;
};

/**
 * Check if CAPTCHA debug mode is enabled
 */
export const isCaptchaDebugMode = (): boolean => {
  const config = getCaptchaConfig();
  return config.debug;
};

/**
 * Validate CAPTCHA score against environment threshold
 */
export const validateCaptchaScore = (score: number): boolean => {
  const threshold = getCaptchaThreshold();
  const isValid = score >= threshold;
  
  if (isCaptchaDebugMode()) {
    console.log(`🔐 CAPTCHA Score Validation: ${score} >= ${threshold} = ${isValid ? '✅ PASS' : '❌ FAIL'}`);
  }
  
  return isValid;
};

/**
 * Get CAPTCHA configuration summary for debugging
 */
export const getCaptchaConfigSummary = () => {
  const environment = getEnvironmentName();
  const config = getCaptchaConfig();
  
  return {
    environment,
    enabled: isCaptchaEnabled(),
    siteKeyConfigured: config.siteKey !== 'YOUR_PRODUCTION_SITE_KEY' && 
                      config.siteKey !== 'YOUR_STAGING_SITE_KEY' && 
                      config.siteKey !== 'YOUR_DEV_SITE_KEY',
    threshold: config.threshold,
    debug: config.debug,
    isProduction: isProduction(),
    isStaging: isStaging(),
    isDevelopment: isDevelopment()
  };
};

/**
 * Environment-specific CAPTCHA setup instructions
 */
export const getCaptchaSetupInstructions = () => {
  const environment = getEnvironmentName();
  
  const instructions = {
    production: {
      title: 'Production CAPTCHA Setup',
      steps: [
        '1. Go to https://www.google.com/recaptcha/admin/create',
        '2. Create a new site with reCAPTCHA v3',
        '3. Add domains: hermessecurity.io, www.hermessecurity.io',
        '4. Copy the Site Key and Secret Key',
        '5. Set environment variables: VITE_RECAPTCHA_SITE_KEY_PROD and VITE_RECAPTCHA_SECRET_KEY_PROD',
        '6. Deploy with production keys'
      ]
    },
    staging: {
      title: 'Staging CAPTCHA Setup',
      steps: [
        '1. Use the same reCAPTCHA site as production',
        '2. Add staging domain: gjdbradford.github.io',
        '3. Set environment variables: VITE_RECAPTCHA_SITE_KEY_STAGING and VITE_RECAPTCHA_SECRET_KEY_STAGING',
        '4. Test with staging deployment'
      ]
    },
    development: {
      title: 'Development CAPTCHA Setup',
      steps: [
        '1. Use the same reCAPTCHA site as staging',
        '2. Add local domains: localhost, 127.0.0.1',
        '3. Set environment variables: VITE_RECAPTCHA_SITE_KEY_DEV and VITE_RECAPTCHA_SECRET_KEY_DEV',
        '4. Or set enabled: false to bypass CAPTCHA in development'
      ]
    }
  };
  
  return instructions[environment] || instructions.development;
};
