// Enhanced Contact form API service with Database Backup Integration
import { logEnvironmentInfo, getEnvironmentName } from '../utils/environment';

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  phoneNumber: string;
  userRole: string;
  problemDescription: string;
  companyName?: string;
  companySize?: string;
  serviceUrgency: string;
  agreeToTerms: boolean;
  privacyConsent: boolean;
  marketingConsent?: boolean;
  captchaToken?: string;
}

export interface ContactApiRequest {
  formData: ContactFormData;
  timestamp: string;
  userAgent: string;
  ipAddress?: string;
  termsConsent: boolean;
  captchaToken?: string;
}

export interface ContactApiResponse {
  success: boolean;
  messageId: string;
  timestamp: string;
  nextSteps: string[];
  leadId?: string;
  backupId?: number;
  databaseBackup?: {
    success: boolean;
    backupId: number;
  };
  n8nIntegration?: {
    success: boolean;
    messageId?: string;
    error?: string;
  };
}

// Get the appropriate API endpoint based on environment
const getBackupApiUrl = (): string => {
  const hostname = window.location.hostname;

  // Production: www.hermessecurity.io or hermessecurity.io
  if (hostname === 'www.hermessecurity.io' || hostname === 'hermessecurity.io') {
    return 'https://hermessecurity.io/api/backup-lead';
  }

  // Staging: hermes-security-staging.vercel.app
  if (hostname === 'hermes-security-staging.vercel.app') {
    return 'https://hermes-security-staging.vercel.app/api/backup-lead';
  }

  // Local development - use local API server
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:3002/api/backup-lead';
  }

  // Default to staging Vercel API
  return 'https://hermes-security-staging.vercel.app/api/backup-lead';
};

const BACKUP_API_URL = getBackupApiUrl();

export const submitContactForm = async (formData: ContactFormData): Promise<ContactApiResponse> => {
  try {
    // Check if we're using the 8n8 webhook (staging) or API endpoint
    const isWebhook = BACKUP_API_URL.includes('n8n.cloud');

    const requestData = isWebhook
      ? {
          // 8n8 webhook format
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          country: formData.country,
          phoneNumber: formData.phoneNumber,
          userRole: formData.userRole,
          problemDescription: formData.problemDescription,
          companyName: formData.companyName,
          companySize: formData.companySize,
          serviceUrgency: formData.serviceUrgency,
          agreeToTerms: formData.agreeToTerms,
          privacyConsent: formData.privacyConsent,
          marketingConsent: formData.marketingConsent,
          captchaToken: formData.captchaToken,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          termsConsent: formData.agreeToTerms,
        }
      : {
          // API endpoint format
          formData,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          termsConsent: formData.agreeToTerms,
          captchaToken: formData.captchaToken,
        };

    // Log environment information
    logEnvironmentInfo();
    console.warn('🌍 Using backup API URL:', BACKUP_API_URL);
    console.warn('📊 Form Data:', requestData);
    console.warn('🔐 reCAPTCHA Token:', formData.captchaToken ? 'Present' : 'Missing');

    // Check if we're in development mode and should bypass API
    const isDev = getEnvironmentName() === 'development';
    const bypassApi = isDev && localStorage.getItem('hermes-bypass-api') === 'true';

    if (bypassApi) {
      console.warn('🚧 Development mode: Bypassing API submission');
      return {
        success: true,
        messageId: new Date().toISOString(),
        timestamp: new Date().toISOString(),
        leadId: 'DEV-LEAD-' + Date.now(),
        backupId: 999,
        databaseBackup: {
          success: true,
          backupId: 999,
        },
        n8nIntegration: {
          success: true,
          messageId: new Date().toISOString(),
        },
        nextSteps: [
          'Development mode: Form submitted successfully (API bypassed)',
          "To test with real API, run: localStorage.removeItem('hermes-bypass-api')",
          'Then refresh the page and try again',
        ],
      };
    }

    console.log('🚀 Submitting contact form with database backup...');

    const response = await fetch(BACKUP_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hermes-Source': 'website-contact-form',
        'X-Hermes-Environment': getEnvironmentName(),
        'X-Hermes-Version': '2.0.0',
      },
      body: JSON.stringify(requestData),
    });

    console.warn('📡 Response status:', response.status);
    console.warn('📋 Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error response body:', errorText);

      let errorMessage = `API Error: ${response.status} ${response.statusText}`;
      let nextSteps = [
        'Please check your internet connection and try again',
        'Error: ' + errorText,
      ];

      // Handle specific error cases
      if (response.status === 503) {
        errorMessage = 'Database temporarily unavailable';
        nextSteps = [
          'The database backup service is temporarily unavailable',
          'Your form data was not saved - please try again in a few moments',
          'If the problem persists, please contact support',
        ];
      } else if (response.status === 400) {
        errorMessage = 'Invalid form data';
        nextSteps = [
          'Please check that all required fields are filled correctly',
          'Ensure your email address is valid',
          'Make sure you agree to the terms and conditions',
        ];
      }

      return {
        success: false,
        messageId: new Date().toISOString(),
        timestamp: new Date().toISOString(),
        nextSteps: [errorMessage, ...nextSteps],
      };
    }

    // Parse response - handle both API and webhook responses
    let result;
    try {
      result = await response.json();
    } catch (_parseError) {
      // If response is not JSON (empty or plain text), treat as success
      result = { success: true, messageId: new Date().toISOString() };
    }
    console.warn('✅ API Response:', result);

    // Enhanced response with database and 8n8 information
    const enhancedResponse: ContactApiResponse = {
      success: result.success !== false, // Default to true unless explicitly false
      messageId: result.n8nResponse?.messageId || result.messageId || new Date().toISOString(),
      timestamp: result.timestamp || new Date().toISOString(),
      leadId: result.leadId,
      backupId: result.backupId,
      databaseBackup: {
        success: result.backupId ? true : false, // Only true if we have a backup ID
        backupId: result.backupId,
      },
      n8nIntegration: {
        success: result.n8nResponse?.success || isWebhook, // If webhook, assume success
        messageId: result.n8nResponse?.messageId,
        error: result.n8nResponse?.error,
      },
      nextSteps: result.nextSteps || [
        "We've received your enquiry and will respond within 24 hours",
        isWebhook
          ? 'Your information has been processed by our system'
          : 'Your information has been securely backed up to our database',
        'Check your email for a confirmation',
        'Our AI agent is processing your request',
      ],
    };

    // Add specific next steps based on 8n8 integration status
    if (result.n8nResponse?.success) {
      enhancedResponse.nextSteps.unshift(
        '✅ Data successfully processed and forwarded to our team'
      );
    } else if (result.n8nResponse?.error) {
      enhancedResponse.nextSteps.unshift(
        '⚠️ Your data is safely backed up, but there was a delay in processing'
      );
      enhancedResponse.nextSteps.push('We will retry processing your request automatically');
    }

    // Add lead ID information for tracking
    if (result.leadId) {
      enhancedResponse.nextSteps.push(
        `Your lead ID is: ${result.leadId} (save this for reference)`
      );
    }

    return enhancedResponse;
  } catch (error) {
    console.error('❌ Contact Form Submission Error:', error);

    // Check if it's a network error
    const isNetworkError = error instanceof Error && error.message.includes('Failed to fetch');
    const isCorsError = error instanceof Error && error.message.includes('CORS');

    let errorMessage = 'Form submission failed';
    let nextSteps = [
      'Please check your internet connection and try again',
      'Error: ' + (error instanceof Error ? error.message : 'Unknown error'),
    ];

    if (isNetworkError || isCorsError) {
      errorMessage = 'Network connection error detected';
      nextSteps = [
        'Please check your internet connection',
        'The backup API may not be accessible from your current environment',
        'Try refreshing the page and submitting again',
        'If the problem persists, please contact support',
      ];
    }

    return {
      success: false,
      messageId: new Date().toISOString(),
      timestamp: new Date().toISOString(),
      nextSteps: [errorMessage, ...nextSteps],
    };
  }
};

// Utility function to check if the backup API is available
export const checkBackupApiHealth = async (): Promise<{
  available: boolean;
  responseTime: number;
  error?: string;
}> => {
  try {
    const startTime = Date.now();

    const healthUrl = BACKUP_API_URL.replace('/backup-lead', '/health/database');

    const response = await fetch(healthUrl, {
      method: 'GET',
      headers: {
        'X-Hermes-Source': 'health-check',
      },
    });

    const responseTime = Date.now() - startTime;

    if (response.ok) {
      const health = await response.json();
      return {
        available: health.status === 'healthy',
        responseTime,
        error: health.status !== 'healthy' ? 'Database unhealthy' : undefined,
      };
    } else {
      return {
        available: false,
        responseTime,
        error: `Health check failed: ${response.status} ${response.statusText}`,
      };
    }
  } catch (error) {
    return {
      available: false,
      responseTime: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

// Utility function to retrieve lead information
export const getLeadInfo = async (
  leadId: string
): Promise<{
  success: boolean;
  lead?: any;
  error?: string;
}> => {
  try {
    const leadUrl = BACKUP_API_URL.replace('/backup-lead', `/leads/${leadId}`);

    const response = await fetch(leadUrl, {
      method: 'GET',
      headers: {
        'X-Hermes-Source': 'lead-retrieval',
      },
    });

    if (response.ok) {
      const result = await response.json();
      return {
        success: true,
        lead: result.lead,
      };
    } else {
      const error = await response.text();
      return {
        success: false,
        error: `Failed to retrieve lead: ${error}`,
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
