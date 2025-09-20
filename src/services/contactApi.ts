// Contact form API service for 8n8 integration ONLY
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
}

// Environment-based 8n8 Webhook Configuration
const getWebhookUrl = (): string => {
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;

  // Production: www.hermessecurity.io or hermessecurity.io
  if (hostname === 'www.hermessecurity.io' || hostname === 'hermessecurity.io') {
    return 'https://ilovemylife.app.n8n.cloud/webhook/a57cf53e-c2d6-4e59-8e38-44b774355629';
  }

  // Staging: gjdbradford.github.io/hermes-security-production/
  if (hostname === 'gjdbradford.github.io' && pathname.includes('/hermes-security-production/')) {
    return 'https://ilovemylife.app.n8n.cloud/webhook-test/a57cf53e-c2d6-4e59-8e38-44b774355629';
  }

  // Local development: Use CORS proxy if available, otherwise direct webhook
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    // Check if CORS proxy is available
    const useProxy = localStorage.getItem('hermes-use-cors-proxy') === 'true';
    if (useProxy) {
      return 'http://localhost:3001/proxy';
    }
    return 'https://ilovemylife.app.n8n.cloud/webhook-test/a57cf53e-c2d6-4e59-8e38-44b774355629';
  }

  // Default to test webhook for any other environment
  return 'https://ilovemylife.app.n8n.cloud/webhook-test/a57cf53e-c2d6-4e59-8e38-44b774355629';
};

const N8N_WEBHOOK_URL = getWebhookUrl();

export const submitContactForm = async (formData: ContactFormData): Promise<ContactApiResponse> => {
  try {
    const requestData: ContactApiRequest = {
      formData,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      termsConsent: formData.agreeToTerms,
      captchaToken: formData.captchaToken,
    };

    // Create a flattened structure for better webhook compatibility
    const webhookPayload = {
      // Form data
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

      // Metadata
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      termsConsent: formData.agreeToTerms,

      // reCAPTCHA token - make it easily accessible
      captchaToken: formData.captchaToken,
      recaptchaToken: formData.captchaToken, // Alternative name for webhook
      recaptcha_response: formData.captchaToken, // Google's expected field name

      // Original nested structure for backward compatibility
      formData: requestData.formData,
    };

    // Log environment information
    logEnvironmentInfo();
    console.warn('🌍 Using webhook URL:', N8N_WEBHOOK_URL);
    console.warn('📊 Form Data:', requestData);
    console.warn('🔐 reCAPTCHA Token:', formData.captchaToken ? 'Present' : 'Missing');

    // Check if we're in development mode and should bypass webhook
    const isDev = getEnvironmentName() === 'development';
    const bypassWebhook = isDev && localStorage.getItem('hermes-bypass-webhook') === 'true';

    if (bypassWebhook) {
      console.warn('🚧 Development mode: Bypassing webhook submission');
      return {
        success: true,
        messageId: new Date().toISOString(),
        timestamp: new Date().toISOString(),
        nextSteps: [
          'Development mode: Form submitted successfully (webhook bypassed)',
          "To test with real webhook, run: localStorage.removeItem('hermes-bypass-webhook')",
          'Then refresh the page and try again',
        ],
      };
    }

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hermes-Source': 'website-contact-form',
        'X-Hermes-Environment': getEnvironmentName(),
        'X-Hermes-Version': '1.0.0',
      },
      body: JSON.stringify(webhookPayload),
    });

    console.warn(' Response status:', response.status);
    console.warn(
      '📋 Response headers:',
      Object.fromEntries(Array.from(response.headers.entries()))
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error response body:', errorText);
      throw new Error(`8n8 API Error: ${response.status} ${response.statusText}`);
    }

    // Handle empty response
    const responseText = await response.text();
    console.warn('📄 Raw response:', responseText);

    let result;
    if (responseText.trim() === '') {
      // If response is empty, create a success response
      console.warn('⚠️ Empty response from webhook, treating as success');
      result = {
        success: true,
        messageId: new Date().toISOString(),
        timestamp: new Date().toISOString(),
      };
    } else {
      try {
        result = JSON.parse(responseText);
      } catch (_parseError) {
        console.warn('⚠️ Failed to parse JSON response, treating as success');
        result = {
          success: true,
          messageId: new Date().toISOString(),
          timestamp: new Date().toISOString(),
        };
      }
    }

    console.warn('✅ 8n8 Response:', result);

    return {
      success: true,
      messageId: result.messageId || new Date().toISOString(),
      timestamp: result.timestamp || new Date().toISOString(),
      nextSteps: result.nextSteps || [
        "We've received your enquiry and will respond within 24 hours",
        'Check your email for a confirmation',
        'Our AI agent is processing your request',
      ],
    };
  } catch (error) {
    console.error('❌ 8n8 Submission Error:', error);

    // Check if it's a CORS error
    const isCorsError = error instanceof Error && error.message.includes('CORS');
    const isNetworkError = error instanceof Error && error.message.includes('Failed to fetch');
    const isJsonError = error instanceof Error && error.message.includes('JSON');

    let errorMessage = 'Webhook submission failed';
    let nextSteps = [
      'Please check your 8n8 workflow configuration',
      'Error: ' + (error instanceof Error ? error.message : 'Unknown error'),
    ];

    if (isCorsError || isNetworkError) {
      errorMessage = 'CORS/Network error detected';
      nextSteps = [
        'The webhook is not accessible from your current environment',
        'Try using the CORS proxy server for local development',
        'Run: npx tsx scripts/cors-proxy-server.ts',
        "Then enable proxy mode in browser console: localStorage.setItem('hermes-use-cors-proxy', 'true')",
      ];
    } else if (isJsonError) {
      errorMessage = 'Response parsing error';
      nextSteps = [
        'The webhook returned an invalid response',
        'This might be a temporary issue with the 8n8 workflow',
        'Please try again in a few moments',
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
