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

// Get webhook URL from environment configuration
const N8N_WEBHOOK_URL = getEnvironmentConfig().webhookUrl;

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
    
    return {
      success: false,
      messageId: new Date().toISOString(),
      timestamp: new Date().toISOString(),
      nextSteps: [
        "Webhook submission failed",
        "Please check your 8n8 workflow configuration",
        "Error: " + (error instanceof Error ? error.message : 'Unknown error')
      ]
    };
  }
};
