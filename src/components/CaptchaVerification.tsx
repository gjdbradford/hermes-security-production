/**
 * CAPTCHA Verification Component
 * 
 * This component handles CAPTCHA token generation and validation for forms.
 * It provides a hook for easy integration with form submissions.
 * 
 * Last updated: 2025-09-08T08:51:00.000Z
 */

import React, { useCallback, useState } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { validateCaptchaScore, isCaptchaDebugMode } from '../config/captcha';

export interface CaptchaVerificationResult {
  success: boolean;
  token?: string;
  score?: number;
  error?: string;
}

interface CaptchaVerificationProps {
  onVerificationComplete: (result: CaptchaVerificationResult) => void;
  action?: string;
  children?: React.ReactNode;
}

export const CaptchaVerification: React.FC<CaptchaVerificationProps> = ({
  onVerificationComplete,
  action = 'contact_form_submit',
  children
}) => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [isVerifying, setIsVerifying] = useState(false);

  const executeCaptcha = useCallback(async (): Promise<CaptchaVerificationResult> => {
    if (!executeRecaptcha) {
      const error = 'reCAPTCHA not available';
      if (isCaptchaDebugMode()) {
        console.error('🔐 CAPTCHA Error:', error);
      }
      return { success: false, error };
    }

    try {
      setIsVerifying(true);
      
      if (isCaptchaDebugMode()) {
        console.log('🔐 Executing CAPTCHA verification for action:', action);
      }

      const token = await executeRecaptcha(action);
      
      if (!token) {
        const error = 'Failed to generate CAPTCHA token';
        if (isCaptchaDebugMode()) {
          console.error('🔐 CAPTCHA Error:', error);
        }
        return { success: false, error };
      }

      if (isCaptchaDebugMode()) {
        console.log('🔐 CAPTCHA token generated successfully');
      }

      // Note: Score validation happens on the server side
      // For now, we'll return the token and let the server validate
      return { success: true, token };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown CAPTCHA error';
      if (isCaptchaDebugMode()) {
        console.error('🔐 CAPTCHA Error:', errorMessage);
      }
      return { success: false, error: errorMessage };
    } finally {
      setIsVerifying(false);
    }
  }, [executeRecaptcha, action]);

  const handleVerification = useCallback(async () => {
    const result = await executeCaptcha();
    onVerificationComplete(result);
  }, [executeCaptcha, onVerificationComplete]);

  return (
    <div className="captcha-verification">
      {children}
      {isVerifying && (
        <div className="captcha-loading">
          <span className="text-sm text-gray-500">Verifying security...</span>
        </div>
      )}
    </div>
  );
};

/**
 * Hook for CAPTCHA verification
 * Use this hook in your forms to get CAPTCHA tokens
 */
export const useCaptchaVerification = (action: string = 'contact_form_submit') => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [isVerifying, setIsVerifying] = useState(false);

  const verifyCaptcha = useCallback(async (): Promise<CaptchaVerificationResult> => {
    if (!executeRecaptcha) {
      const error = 'reCAPTCHA not available';
      if (isCaptchaDebugMode()) {
        console.error('🔐 CAPTCHA Error:', error);
      }
      return { success: false, error };
    }

    try {
      setIsVerifying(true);
      
      if (isCaptchaDebugMode()) {
        console.log('🔐 Executing CAPTCHA verification for action:', action);
      }

      const token = await executeRecaptcha(action);
      
      if (!token) {
        const error = 'Failed to generate CAPTCHA token';
        if (isCaptchaDebugMode()) {
          console.error('🔐 CAPTCHA Error:', error);
        }
        return { success: false, error };
      }

      if (isCaptchaDebugMode()) {
        console.log('🔐 CAPTCHA token generated successfully');
      }

      return { success: true, token };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown CAPTCHA error';
      if (isCaptchaDebugMode()) {
        console.error('🔐 CAPTCHA Error:', errorMessage);
      }
      return { success: false, error: errorMessage };
    } finally {
      setIsVerifying(false);
    }
  }, [executeRecaptcha, action]);

  return {
    verifyCaptcha,
    isVerifying
  };
};

export default CaptchaVerification;
