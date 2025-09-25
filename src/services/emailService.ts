/**
 * Email Service with Proper Mail Headers
 * Handles contact form submissions with professional email formatting
 */

export interface EmailData {
  to: string;
  from: string;
  replyTo: string;
  subject: string;
  htmlBody: string;
  textBody: string;
  headers: EmailHeaders;
  attachments?: EmailAttachment[];
}

export interface EmailHeaders {
  'X-Mailer': string;
  'X-Priority': string;
  'X-MSMail-Priority': string;
  Importance: string;
  'X-Hermes-Source': string;
  'X-Hermes-Form-Type': string;
  'X-Hermes-Urgency': string;
  'X-Hermes-Company': string;
  'X-Hermes-Country': string;
  'Message-ID': string;
  Date: string;
  'MIME-Version': string;
  'Content-Type': string;
  'Content-Transfer-Encoding': string;
}

export interface EmailAttachment {
  filename: string;
  content: string;
  contentType: string;
}

export interface ContactFormEmailData {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  mobileNumber?: string;
  problemDescription: string;
  companyName?: string;
  companySize?: string;
  serviceUrgency: string;
  agreeToTerms: boolean;
  timestamp: string;
  userAgent: string;
  ipAddress?: string;
}

/**
 * Generate proper email headers for contact form submissions
 */
export const generateEmailHeaders = (formData: ContactFormEmailData): EmailHeaders => {
  const messageId = `<hermes-${Date.now()}-${Math.random().toString(36).substr(2, 9)}@hermessecurity.io>`;
  const priority =
    formData.serviceUrgency === 'Super urgent'
      ? '1'
      : formData.serviceUrgency === 'Urgent'
        ? '2'
        : '3';

  return {
    'X-Mailer': 'Hermes Security Contact Form v1.0',
    'X-Priority': priority,
    'X-MSMail-Priority': priority === '1' ? 'High' : priority === '2' ? 'Normal' : 'Low',
    Importance: priority === '1' ? 'high' : 'normal',
    'X-Hermes-Source': 'website-contact-form',
    'X-Hermes-Form-Type': 'security-consultation-request',
    'X-Hermes-Urgency': formData.serviceUrgency.toLowerCase().replace(' ', '-'),
    'X-Hermes-Company': formData.companyName || 'not-provided',
    'X-Hermes-Country': formData.country,
    'Message-ID': messageId,
    Date: new Date().toUTCString(),
    'MIME-Version': '1.0',
    'Content-Type': 'text/html; charset=UTF-8',
    'Content-Transfer-Encoding': '8bit',
  };
};

/**
 * Generate HTML email body for contact form submissions
 */
export const generateEmailBody = (
  formData: ContactFormEmailData
): { html: string; text: string } => {
  const urgencyColor =
    formData.serviceUrgency === 'Super urgent'
      ? '#dc2626'
      : formData.serviceUrgency === 'Urgent'
        ? '#ea580c'
        : '#059669';

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Form Submission - Hermes Security</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f8fafc; padding: 20px; border-radius: 0 0 8px 8px; }
        .section { margin-bottom: 20px; }
        .section h3 { color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px; }
        .field { margin-bottom: 10px; }
        .label { font-weight: 600; color: #374151; }
        .value { color: #6b7280; }
        .urgency { display: inline-block; padding: 4px 12px; border-radius: 20px; color: white; font-weight: 600; font-size: 12px; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
        .cta { background: #1e40af; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block; margin-top: 15px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🔒 New Security Consultation Request</h1>
        <p>Hermes Security Contact Form Submission</p>
    </div>
    
    <div class="content">
        <div class="section">
            <span class="urgency" style="background-color: ${urgencyColor};">${formData.serviceUrgency.toUpperCase()}</span>
            <h3>👤 Personal Information</h3>
            <div class="field">
                <span class="label">Name:</span>
                <span class="value">${formData.firstName} ${formData.lastName}</span>
            </div>
            <div class="field">
                <span class="label">Email:</span>
                <span class="value"><a href="mailto:${formData.email}">${formData.email}</a></span>
            </div>
            <div class="field">
                <span class="label">Country:</span>
                <span class="value">${formData.country}</span>
            </div>
            <div class="field">
                <span class="label">Mobile:</span>
                <span class="value">${formData.mobileNumber ? `<a href="tel:${formData.mobileNumber}">${formData.mobileNumber}</a>` : 'Not provided'}</span>
            </div>
        </div>

        <div class="section">
            <h3>🏢 Company Information</h3>
            <div class="field">
                <span class="label">Company:</span>
                <span class="value">${formData.companyName || 'Not provided'}</span>
            </div>
            <div class="field">
                <span class="label">Size:</span>
                <span class="value">${formData.companySize || 'Not provided'}</span>
            </div>
            <div class="field">
                <span class="label">Service Urgency:</span>
                <span class="value" style="color: ${urgencyColor}; font-weight: 600;">${formData.serviceUrgency}</span>
            </div>
        </div>

        <div class="section">
            <h3>📝 Security Requirements</h3>
            <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #1e40af;">
                ${formData.problemDescription.replace(/\n/g, '<br>')}
            </div>
        </div>

        <div class="section">
            <h3>✅ Consent & Compliance</h3>
            <div class="field">
                <span class="label">Terms Agreement:</span>
                <span class="value">${formData.agreeToTerms ? '✅ Yes' : '❌ No'}</span>
            </div>
            <div class="field">
                <span class="label">GDPR Compliance:</span>
                <span class="value">✅ Explicit consent provided</span>
            </div>
        </div>

        <div class="section">
            <h3>�� Submission Details</h3>
            <div class="field">
                <span class="label">Timestamp:</span>
                <span class="value">${new Date(formData.timestamp).toLocaleString()}</span>
            </div>
            <div class="field">
                <span class="label">User Agent:</span>
                <span class="value" style="font-size: 11px; word-break: break-all;">${formData.userAgent}</span>
            </div>
            ${
              formData.ipAddress
                ? `
            <div class="field">
                <span class="label">IP Address:</span>
                <span class="value">${formData.ipAddress}</span>
            </div>
            `
                : ''
            }
        </div>

        <div style="text-align: center; margin-top: 25px;">
            <a href="mailto:${formData.email}?subject=Re: Your Security Consultation Request&body=Hi ${formData.firstName},%0D%0A%0D%0AThank you for your interest in Hermes Security services..." class="cta">
                📧 Reply to ${formData.firstName}
            </a>
        </div>
    </div>

    <div class="footer">
        <p><strong>Hermes Security</strong> - AI-Driven Penetration Testing & Security Consulting</p>
        <p>This email was automatically generated from the Hermes Security website contact form.</p>
        <p>Message ID: ${generateEmailHeaders(formData)['Message-ID']}</p>
    </div>
</body>
</html>`;

  const text = `
NEW SECURITY CONSULTATION REQUEST - HERMES SECURITY
==================================================

URGENCY: ${formData.serviceUrgency.toUpperCase()}

PERSONAL INFORMATION:
- Name: ${formData.firstName} ${formData.lastName}
- Email: ${formData.email}
- Country: ${formData.country}
- Mobile: ${formData.mobileNumber || 'Not provided'}

COMPANY INFORMATION:
- Company: ${formData.companyName || 'Not provided'}
- Size: ${formData.companySize || 'Not provided'}
- Service Urgency: ${formData.serviceUrgency}

SECURITY REQUIREMENTS:
${formData.problemDescription}

CONSENT & COMPLIANCE:
- Terms Agreement: ${formData.agreeToTerms ? 'Yes' : 'No'}
- GDPR Compliance: Explicit consent provided

SUBMISSION DETAILS:
- Timestamp: ${new Date(formData.timestamp).toLocaleString()}
- User Agent: ${formData.userAgent}
${formData.ipAddress ? `- IP Address: ${formData.ipAddress}` : ''}

---
Hermes Security - AI-Driven Penetration Testing & Security Consulting
This email was automatically generated from the Hermes Security website contact form.
Message ID: ${generateEmailHeaders(formData)['Message-ID']}
`;

  return { html, text };
};

/**
 * Send email using Vercel serverless function
 */
export const sendEmail = async (emailData: EmailData): Promise<boolean> => {
  try {
    // Use Vercel API route
    const apiUrl = import.meta.env.PROD
      ? '/api/send-email' // Production: use Vercel API route
      : 'http://localhost:3000/api/send-email'; // Development: local API

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Email-Service': 'hermes-contact-form',
      },
      body: JSON.stringify({
        ...emailData,
        // Convert headers object to array format for some email services
        headersArray: Object.entries(emailData.headers).map(([key, value]) => ({ key, value })),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Email service error: ${response.status} ${errorData.error || response.statusText}`
      );
    }

    const result = await response.json();
    console.log('📧 Email sent successfully:', result);
    return true;
  } catch (error) {
    console.error('❌ Email sending failed:', error);

    // Fallback: Try EmailJS if configured
    if (typeof window !== 'undefined' && (window as any).emailjs) {
      return await sendEmailViaEmailJS(emailData);
    }

    return false;
  }
};

/**
 * Fallback email sending via EmailJS
 */
const sendEmailViaEmailJS = async (emailData: EmailData): Promise<boolean> => {
  try {
    const emailjs = (window as any).emailjs;

    const templateParams = {
      to_email: emailData.to,
      from_name: 'Hermes Security Contact Form',
      reply_to: emailData.replyTo,
      subject: emailData.subject,
      message: emailData.textBody,
      html_message: emailData.htmlBody,
      headers: JSON.stringify(emailData.headers),
    };

    const result = await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID || 'default_service',
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'contact_form',
      templateParams,
      import.meta.env.VITE_EMAILJS_USER_ID
    );

    console.log(' EmailJS email sent:', result);
    return true;
  } catch (error) {
    console.error('❌ EmailJS fallback failed:', error);
    return false;
  }
};

/**
 * Main function to send contact form email with proper headers
 */
export const sendContactFormEmail = async (formData: ContactFormEmailData): Promise<boolean> => {
  const headers = generateEmailHeaders(formData);
  const { html, text } = generateEmailBody(formData);

  const emailData: EmailData = {
    to: 'gjdbradford@gmail.com',
    from: 'noreply@hermessecurity.io',
    replyTo: formData.email,
    subject: `🔒 ${formData.firstName} ${formData.lastName} from ${formData.companyName || 'No Company'} - Security Consultation Request [${formData.serviceUrgency}]`,
    htmlBody: html,
    textBody: text,
    headers,
  };

  return await sendEmail(emailData);
};
