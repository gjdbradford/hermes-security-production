// Contact form API service for 8n8 integration ONLY
import { getEnvironmentConfig, logEnvironmentInfo, getEnvironmentName } from '../utils/environment';

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  mobileNumber: string;
  problemDescription: string;
  companyName?: string;
  companySize?: string;
  serviceUrgency: string;
  agreeToTerms: boolean;
  privacyConsent: boolean;
  marketingConsent?: boolean;
}

export interface ContactApiRequest {
  formData: ContactFormData;
  timestamp: string;
  userAgent: string;
  ipAddress?: string;
  termsConsent: boolean;
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
      termsConsent: formData.agreeToTerms
    };

    // Log environment information
    logEnvironmentInfo();
    console.log('🌍 Using webhook URL:', N8N_WEBHOOK_URL);
    console.log('📊 Form Data:', requestData);

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hermes-Source': 'website-contact-form',
        'X-Hermes-Environment': getEnvironmentName(),
        'X-Hermes-Version': '1.0.0'
      },
      body: JSON.stringify(requestData)
    });

    console.log(' Response status:', response.status);
    console.log('📋 Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Error response body:', errorText);
      throw new Error(`8n8 API Error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('✅ 8n8 Response:', result);

    return {
      success: true,
      messageId: result.messageId || new Date().toISOString(),
      timestamp: result.timestamp || new Date().toISOString(),
      nextSteps: result.nextSteps || [
        "We've received your enquiry and will respond within 24 hours",
        "Check your email for a confirmation",
        "Our AI agent is processing your request"
      ]
    };

  } catch (error) {
    console.error('❌ 8n8 Submission Error:', error);
    
    // Check if it's a CORS error
    const isCorsError = error instanceof Error && error.message.includes('CORS');
    const isNetworkError = error instanceof Error && error.message.includes('Failed to fetch');
    
    let errorMessage = "Webhook submission failed";
    let nextSteps = [
      "Please check your 8n8 workflow configuration",
      "Error: " + (error instanceof Error ? error.message : 'Unknown error')
    ];
    
    if (isCorsError || isNetworkError) {
      errorMessage = "CORS/Network error detected";
      nextSteps = [
        "The webhook is not accessible from your current environment",
        "Try using the CORS proxy server for local development",
        "Run: npx tsx scripts/cors-proxy-server.ts",
        "Then enable proxy mode in browser console: localStorage.setItem('hermes-use-cors-proxy', 'true')"
      ];
    }
    
    return {
      success: false,
      messageId: new Date().toISOString(),
      timestamp: new Date().toISOString(),
      nextSteps: [errorMessage, ...nextSteps]
    };
  }
};
