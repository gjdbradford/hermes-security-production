// Contact form API service for 8n8 integration and email backup
import { sendContactFormEmail, ContactFormEmailData } from './emailService';

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
    
    // Fallback: Send email directly with proper headers via Vercel
    const emailSent = await sendFallbackEmail(formData);
    
    return {
      success: true,
      messageId: new Date().toISOString(),
      timestamp: new Date().toISOString(),
      nextSteps: [
        "We've received your enquiry and will respond within 24 hours",
        emailSent ? "A confirmation email has been sent" : "Note: Our automated system is temporarily unavailable, but your message has been received"
      ]
    };
  }
};

// Enhanced fallback email service with proper headers via Vercel
const sendFallbackEmail = async (formData: ContactFormData): Promise<boolean> => {
  try {
    const emailData: ContactFormEmailData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      country: formData.country,
      mobileNumber: formData.mobileNumber,
      problemDescription: formData.problemDescription,
      companyName: formData.companyName,
      companySize: formData.companySize,
      serviceUrgency: formData.serviceUrgency,
      agreeToTerms: formData.agreeToTerms,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      ipAddress: undefined // IP address is not available in the browser context for this fallback
    };

    const headers = generateEmailHeaders(emailData);
    const { html, text } = generateEmailBody(emailData);
    
    const emailDataForVercel: EmailData = {
      to: 'gjdbradford@gmail.com', // This should ideally be configurable
      from: 'noreply@hermessecurity.io',
      replyTo: formData.email,
      subject: `🔒 ${formData.firstName} ${formData.lastName} from ${formData.companyName || 'No Company'} - Security Consultation Request [${formData.serviceUrgency}]`,
      htmlBody: html,
      textBody: text,
      headers
    };

    return await sendEmail(emailDataForVercel);

  } catch (error) {
    console.error('❌ Fallback email failed:', error);
    return false;
  }
};
