#!/usr/bin/env npx tsx

/**
 * Hermes Security Email Testing Plan
 * Comprehensive testing for contact form email delivery
 * 
 * This script tests email functionality across different environments:
 * 1. Staging Environment (GitHub Pages)
 * 2. Production Environment (Vercel)
 * 3. Local Development Environment
 */

import { ContactFormData } from '../src/services/contactApi';

// Test data for email testing
const testContactData: ContactFormData = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  country: 'GB',
  mobileNumber: '+44 7700 900000',
  problemDescription: 'This is a test email from the Hermes Security contact form testing system. Please ignore this message.',
  companyName: 'Test Company Ltd',
  companySize: '51-200',
  serviceUrgency: 'Not urgent',
  agreeToTerms: true
};

// Email configuration
const EMAIL_CONFIG = {
  // Primary recipient (where emails should be sent)
  primaryRecipient: 'gjdbradford@gmail.com',
  
  // Test recipients for validation
  testRecipients: [
    'gjdbradford@gmail.com',
    'contact@hermessecurity.io'
  ],
  
  // Expected email subject pattern
  subjectPattern: /🔒 .* from .* - Security Consultation Request \[.*\]/,
  
  // Expected email content elements
  requiredContent: [
    'Hermes Security',
    'Security Consultation Request',
    'Personal Information',
    'Company Information',
    'Security Requirements',
    'Consent & Compliance',
    'Submission Details'
  ]
};

// Environment configurations
const ENVIRONMENTS = {
  staging: {
    name: 'Staging (GitHub Pages)',
    baseUrl: 'https://gjdbradford.github.io/hermes-security-production/',
    apiUrl: 'https://hermes-security-production.vercel.app/api/send-email',
    description: 'GitHub Pages deployment with Vercel API backend'
  },
  production: {
    name: 'Production (Vercel)',
    baseUrl: 'https://hermes-security-production.vercel.app/',
    apiUrl: 'https://hermes-security-production.vercel.app/api/send-email',
    description: 'Full Vercel deployment'
  },
  local: {
    name: 'Local Development',
    baseUrl: 'http://localhost:8080',
    apiUrl: 'http://localhost:3000/api/send-email',
    description: 'Local development server'
  }
};

/**
 * Test email sending via API endpoint
 */
async function testEmailAPI(environment: typeof ENVIRONMENTS[keyof typeof ENVIRONMENTS], testData: ContactFormData) {
  console.log(`\n🧪 Testing ${environment.name} Email API`);
  console.log(`📍 API URL: ${environment.apiUrl}`);
  
  try {
    const emailPayload = {
      to: EMAIL_CONFIG.primaryRecipient,
      from: 'noreply@hermessecurity.io',
      replyTo: testData.email,
      subject: `🔒 ${testData.firstName} ${testData.lastName} from ${testData.companyName} - Security Consultation Request [${testData.serviceUrgency}]`,
      htmlBody: generateTestEmailHTML(testData),
      textBody: generateTestEmailText(testData),
      headers: {
        'X-Mailer': 'Hermes Security Test Suite v1.0',
        'X-Priority': '3',
        'X-Hermes-Source': 'email-test-suite',
        'X-Hermes-Form-Type': 'test-email',
        'X-Hermes-Urgency': testData.serviceUrgency.toLowerCase().replace(' ', '-'),
        'X-Hermes-Company': testData.companyName,
        'X-Hermes-Country': testData.country,
        'Message-ID': `<test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}@hermessecurity.io>`,
        'Date': new Date().toUTCString(),
        'MIME-Version': '1.0',
        'Content-Type': 'text/html; charset=UTF-8'
      }
    };

    const response = await fetch(environment.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Email-Service': 'hermes-test-suite',
        'X-Test-Environment': environment.name
      },
      body: JSON.stringify(emailPayload)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log(`✅ Email sent successfully`);
      console.log(`📧 Message ID: ${result.messageId}`);
      return { success: true, messageId: result.messageId, response: result };
    } else {
      console.log(`❌ Email failed: ${result.error || response.statusText}`);
      return { success: false, error: result.error || response.statusText };
    }
  } catch (error) {
    console.log(`❌ Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Test contact form submission via web interface
 */
async function testContactForm(environment: typeof ENVIRONMENTS[keyof typeof ENVIRONMENTS], testData: ContactFormData) {
  console.log(`\n🌐 Testing ${environment.name} Contact Form`);
  console.log(`📍 Form URL: ${environment.baseUrl}#contact`);
  
  try {
    // Simulate form submission via 8n8 webhook
    const webhookUrl = 'https://ilovemylife.app.n8n.cloud/webhook-test/a57cf53e-c2d6-4e59-8e38-44b774355629';
    
    const formPayload = {
      formData: testData,
      timestamp: new Date().toISOString(),
      userAgent: 'Hermes Security Test Suite',
      termsConsent: testData.agreeToTerms
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hermes-Source': 'website-contact-form-test',
        'X-Test-Environment': environment.name
      },
      body: JSON.stringify(formPayload)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log(`✅ Form submitted successfully`);
      console.log(`📧 Message ID: ${result.messageId || 'N/A'}`);
      return { success: true, messageId: result.messageId, response: result };
    } else {
      console.log(`❌ Form submission failed: ${result.error || response.statusText}`);
      return { success: false, error: result.error || response.statusText };
    }
  } catch (error) {
    console.log(`❌ Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Generate test email HTML content
 */
function generateTestEmailHTML(testData: ContactFormData): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TEST EMAIL - Hermes Security Contact Form</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #dc2626; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
        .content { background: #f8fafc; padding: 20px; border-radius: 0 0 8px 8px; }
        .test-notice { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 6px; margin-bottom: 20px; }
        .section { margin-bottom: 20px; }
        .section h3 { color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px; }
        .field { margin-bottom: 10px; }
        .label { font-weight: 600; color: #374151; }
        .value { color: #6b7280; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🧪 TEST EMAIL - Hermes Security</h1>
        <p>Contact Form Testing System</p>
    </div>
    
    <div class="content">
        <div class="test-notice">
            <strong>⚠️ TEST EMAIL NOTICE:</strong><br>
            This is an automated test email from the Hermes Security contact form testing system. 
            Please ignore this message. This email was sent to verify that the contact form email 
            delivery system is working correctly.
        </div>
        
        <div class="section">
            <h3>👤 Test Contact Information</h3>
            <div class="field">
                <span class="label">Name:</span>
                <span class="value">${testData.firstName} ${testData.lastName}</span>
            </div>
            <div class="field">
                <span class="label">Email:</span>
                <span class="value">${testData.email}</span>
            </div>
            <div class="field">
                <span class="label">Company:</span>
                <span class="value">${testData.companyName}</span>
            </div>
            <div class="field">
                <span class="label">Test Timestamp:</span>
                <span class="value">${new Date().toISOString()}</span>
            </div>
        </div>
    </div>
</body>
</html>`;
}

/**
 * Generate test email text content
 */
function generateTestEmailText(testData: ContactFormData): string {
  return `
TEST EMAIL - HERMES SECURITY CONTACT FORM
=========================================

⚠️ TEST EMAIL NOTICE:
This is an automated test email from the Hermes Security contact form testing system. 
Please ignore this message.

TEST CONTACT INFORMATION:
- Name: ${testData.firstName} ${testData.lastName}
- Email: ${testData.email}
- Company: ${testData.companyName}
- Test Timestamp: ${new Date().toISOString()}

---
Hermes Security - Email Testing System
This email was automatically generated for testing purposes.
`;
}

/**
 * Main test execution function
 */
async function runEmailTests() {
  console.log('🚀 Hermes Security Email Testing Suite');
  console.log('=====================================');
  console.log(`📧 Primary Recipient: ${EMAIL_CONFIG.primaryRecipient}`);
  console.log(`📅 Test Date: ${new Date().toISOString()}`);
  
  const results = {
    staging: { api: null, form: null },
    production: { api: null, form: null },
    local: { api: null, form: null }
  };

  // Test each environment
  for (const [envKey, environment] of Object.entries(ENVIRONMENTS)) {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`🌍 Testing ${environment.name}`);
    console.log(`📝 ${environment.description}`);
    
    // Test API endpoint
    results[envKey as keyof typeof results].api = await testEmailAPI(environment, testContactData);
    
    // Test contact form
    results[envKey as keyof typeof results].form = await testContactForm(environment, testContactData);
    
    // Wait between tests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Generate test report
  console.log(`\n${'='.repeat(50)}`);
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('======================');
  
  for (const [envKey, environment] of Object.entries(ENVIRONMENTS)) {
    const envResults = results[envKey as keyof typeof results];
    console.log(`\n🌍 ${environment.name}:`);
    console.log(`   API Test: ${envResults.api?.success ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   Form Test: ${envResults.form?.success ? '✅ PASS' : '❌ FAIL'}`);
    
    if (envResults.api?.error) {
      console.log(`   API Error: ${envResults.api.error}`);
    }
    if (envResults.form?.error) {
      console.log(`   Form Error: ${envResults.form.error}`);
    }
  }

  // Recommendations
  console.log(`\n${'='.repeat(50)}`);
  console.log('💡 RECOMMENDATIONS');
  console.log('==================');
  console.log('1. Check email inboxes for test emails');
  console.log('2. Verify email content and formatting');
  console.log('3. Test reply functionality');
  console.log('4. Check spam/junk folders');
  console.log('5. Verify 8n8 webhook processing');
  console.log('6. Monitor Vercel function logs');
  
  console.log(`\n📧 Expected Email Recipients:`);
  EMAIL_CONFIG.testRecipients.forEach(recipient => {
    console.log(`   - ${recipient}`);
  });
  
  console.log(`\n✅ Email testing completed at ${new Date().toISOString()}`);
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runEmailTests().catch(console.error);
}

export { runEmailTests, testEmailAPI, testContactForm, EMAIL_CONFIG, ENVIRONMENTS };
