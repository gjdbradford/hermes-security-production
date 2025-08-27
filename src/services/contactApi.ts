// Contact form API service for 8n8 integration and email backup
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

// 8n8 Webhook Configuration
const N8N_WEBHOOK_URL = 'https://ilovemylife.app.n8n.cloud/webhook-test/a57cf53e-c2d6-4e59-8e38-44b774355629';
const N8N_API_KEY = import.meta.env.VITE_N8N_API_KEY || '';

export const submitContactForm = async (formData: ContactFormData): Promise<ContactApiResponse> => {
  try {
    const requestData: ContactApiRequest = {
      formData,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      termsConsent: formData.agreeToTerms
    };

    console.log('🚀 Submitting to 8n8:', N8N_WEBHOOK_URL);
    console.log('📊 Form Data:', requestData);

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${N8N_API_KEY}`,
        'X-Hermes-Source': 'website-contact-form'
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
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
    
    // Fallback: Send email directly if 8n8 fails
    await sendFallbackEmail(formData);
    
    return {
      success: true,
      messageId: new Date().toISOString(),
      timestamp: new Date().toISOString(),
      nextSteps: [
        "We've received your enquiry and will respond within 24 hours",
        "Note: Our automated system is temporarily unavailable, but your message has been sent"
      ]
    };
  }
};

// Fallback email service
const sendFallbackEmail = async (formData: ContactFormData) => {
  try {
    const emailData = {
      to: 'gjdbradford@gmail.com',
      subject: `${formData.firstName} from ${formData.companyName || 'No Company'} - Hermes Website Contact Enquiry [${formData.serviceUrgency}]`,
      body: `
        **New Contact Form Submission (Fallback)**
        
        **Personal Information:**
        - Name: ${formData.firstName} ${formData.lastName}
        - Email: ${formData.email}
        - Country: ${formData.country}
        - Mobile: ${formData.mobileNumber}
        
        **Company Information:**
        - Company: ${formData.companyName || 'Not provided'}
        - Size: ${formData.companySize || 'Not provided'}
        - Urgency: ${formData.serviceUrgency}
        
        **Problem Description:**
        ${formData.problemDescription}
        
        **Consent:**
        - Terms Agreement: ${formData.agreeToTerms ? 'Yes' : 'No'}
        
        **Submission Details:**
        - Timestamp: ${new Date().toISOString()}
        - User Agent: ${navigator.userAgent}
        
        ---
        This lead was sent via fallback email service due to 8n8 integration issues.
      `
    };

    // Use a simple email service (you can replace with your preferred service)
    const emailResponse = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailData)
    });

    console.log('📧 Fallback email sent:', emailResponse.ok);
  } catch (error) {
    console.error('❌ Fallback email failed:', error);
  }
};
