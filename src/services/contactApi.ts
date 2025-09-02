// Contact form API service for 8n8 integration ONLY
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

// Environment-based 8n8 Webhook Configuration
const getWebhookUrl = (): string => {
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;
  
  // Production: www.hermessecurity.io, hermessecurity.io, or Vercel production
  if (hostname === 'www.hermessecurity.io' || 
      hostname === 'hermessecurity.io' ||
      hostname === 'hermes-security-production-o1yyi3yd1-gjdbradford-5891s-projects.vercel.app') {
    return 'https://ilovemylife.app.n8n.cloud/webhook/a57cf53e-c2d6-4e59-8e38-44b774355629';
  }
  
  // Staging: gjdbradford.github.io/hermes-security-production/
  if (hostname === 'gjdbradford.github.io' && pathname.includes('/hermes-security-production/')) {
    return 'https://ilovemylife.app.n8n.cloud/webhook-test/a57cf53e-c2d6-4e59-8e38-44b774355629';
  }
  
  // Local development: localhost
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
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

    console.log('🚀 Environment detected:', window.location.hostname);
    console.log('📍 Path detected:', window.location.pathname);
    console.log('🌍 Using webhook URL:', N8N_WEBHOOK_URL);
    console.log('📊 Form Data:', requestData);

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hermes-Source': 'website-contact-form'
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
