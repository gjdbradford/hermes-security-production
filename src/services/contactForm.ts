// Simplified Contact form service - Direct 8n8 webhook submission
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
  ctaSource?: string;
}

export interface ContactFormResponse {
  success: boolean;
  message?: string;
}

// Get the appropriate 8n8 webhook URL based on environment
const getWebhookUrl = (): string => {
  const hostname = window.location.hostname;

  // Production: www.hermessecurity.io or hermessecurity.io
  if (hostname === 'www.hermessecurity.io' || hostname === 'hermessecurity.io') {
    return 'https://ilovemylife.app.n8n.cloud/webhook/a57cf53e-c2d6-4e59-8e38-44b774355629';
  }

  // Staging: hermes-security-staging.vercel.app
  if (hostname === 'hermes-security-staging.vercel.app') {
    return 'https://ilovemylife.app.n8n.cloud/webhook-test/a57cf53e-c2d6-4e59-8e38-44b774355629';
  }

  // Local development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'https://ilovemylife.app.n8n.cloud/webhook-test/a57cf53e-c2d6-4e59-8e38-44b774355629';
  }

  // Default to staging
  return 'https://ilovemylife.app.n8n.cloud/webhook-test/a57cf53e-c2d6-4e59-8e38-44b774355629';
};

const WEBHOOK_URL = getWebhookUrl();

export const submitContactForm = async (
  formData: ContactFormData
): Promise<ContactFormResponse> => {
  try {
    console.log('🚀 Submitting contact form to 8n8 webhook:', WEBHOOK_URL);
    console.log('📝 Form data:', formData);

    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
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
        ctaSource: formData.ctaSource,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        source: 'hermes-security-website',
      }),
    });

    console.log('📡 8n8 webhook response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ 8n8 webhook error response:', errorText);
      throw new Error(`8n8 webhook error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('✅ 8n8 webhook success:', result);

    return {
      success: true,
      message: 'Form submitted successfully',
    };
  } catch (error) {
    console.error('❌ Contact form submission error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to submit form',
    };
  }
};
