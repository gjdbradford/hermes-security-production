/**
 * CAPTCHA Provider Component
 *
 * This component provides Google reCAPTCHA v3 context to the application.
 * It automatically detects the environment and configures CAPTCHA accordingly.
 *
 * Last updated: 2025-09-08T08:51:00.000Z
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { getCaptchaConfig, isCaptchaEnabled, getCaptchaConfigSummary } from '../config/captcha';

interface CaptchaContextType {
  isEnabled: boolean;
  isLoaded: boolean;
  config: ReturnType<typeof getCaptchaConfigSummary>;
}

const CaptchaContext = createContext<CaptchaContextType | undefined>(undefined);

interface CaptchaProviderProps {
  children: ReactNode;
}

export const CaptchaProvider: React.FC<CaptchaProviderProps> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [config, setConfig] = useState(getCaptchaConfigSummary());

  useEffect(() => {
    const checkCaptchaStatus = () => {
      const enabled = isCaptchaEnabled();
      const currentConfig = getCaptchaConfigSummary();

      setIsEnabled(enabled);
      setConfig(currentConfig);
      setIsLoaded(true);

      // Only log once on initialization
      if (currentConfig.debug && !window.captchaProviderLogged) {
        console.log('🔐 CAPTCHA Provider initialized:', {
          enabled,
          config: currentConfig,
        });
        window.captchaProviderLogged = true;
      }
    };

    checkCaptchaStatus();
  }, []);

  // If CAPTCHA is not enabled, render children without provider
  if (!isEnabled) {
    if (config.debug) {
      console.log('🔐 CAPTCHA disabled, rendering without provider');
    }
    return <>{children}</>;
  }

  const captchaConfig = getCaptchaConfig();

  return (
    <CaptchaContext.Provider value={{ isEnabled, isLoaded, config }}>
      <GoogleReCaptchaProvider
        reCaptchaKey={captchaConfig.siteKey}
        scriptProps={{
          async: true,
          defer: true,
          appendTo: 'head',
          nonce: undefined,
        }}
        useRecaptchaNet={false}
        useEnterprise={false}
        container={{
          element: undefined,
          parameters: {
            badge: 'bottomright',
            theme: 'light',
          },
        }}
      >
        {children}
      </GoogleReCaptchaProvider>
    </CaptchaContext.Provider>
  );
};

export const useCaptcha = (): CaptchaContextType => {
  const context = useContext(CaptchaContext);
  if (context === undefined) {
    throw new Error('useCaptcha must be used within a CaptchaProvider');
  }
  return context;
};

export default CaptchaProvider;
