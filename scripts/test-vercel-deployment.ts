#!/usr/bin/env npx tsx

/**
 * Vercel Deployment Test Script
 * Tests the deployed Vercel API endpoint for email functionality
 */

const testData = {
  to: 'gjdbradford@gmail.com',
  from: 'noreply@hermessecurity.io',
  replyTo: 'test@example.com',
  subject: '🧪 Test Email from Hermes Security - Vercel Deployment',
  htmlBody: `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Test Email - Hermes Security</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1e40af; color: white; padding: 20px; border-radius: 8px; text-align: center; }
            .content { background: #f8fafc; padding: 20px; border-radius: 8px; margin-top: 20px; }
            .test-notice { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 6px; margin-bottom: 20px; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🧪 Vercel Deployment Test</h1>
            <p>Hermes Security Email System</p>
        </div>
        
        <div class="content">
            <div class="test-notice">
                <strong>✅ SUCCESS!</strong><br>
                The Hermes Security email system is now working on Vercel!
            </div>
            
            <h3>Test Details:</h3>
            <ul>
                <li><strong>Timestamp:</strong> ${new Date().toISOString()}</li>
                <li><strong>Environment:</strong> Vercel Production</li>
                <li><strong>API Endpoint:</strong> /api/send-email</li>
                <li><strong>Status:</strong> ✅ Operational</li>
            </ul>
            
            <p>This email confirms that the contact form email system is working correctly in production.</p>
        </div>
    </body>
    </html>
  `,
  textBody: `
VERCEL DEPLOYMENT TEST - HERMES SECURITY
========================================

✅ SUCCESS! The Hermes Security email system is now working on Vercel!

Test Details:
- Timestamp: ${new Date().toISOString()}
- Environment: Vercel Production
- API Endpoint: /api/send-email
- Status: ✅ Operational

This email confirms that the contact form email system is working correctly in production.

---
Hermes Security - Email Testing System
  `,
  headers: {
    'X-Mailer': 'Hermes Security Vercel Test v1.0',
    'X-Priority': '3',
    'X-Hermes-Source': 'vercel-deployment-test',
    'X-Hermes-Form-Type': 'deployment-validation',
    'Message-ID': `<vercel-test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}@hermessecurity.io>`,
    'Date': new Date().toUTCString(),
    'MIME-Version': '1.0',
    'Content-Type': 'text/html; charset=UTF-8'
  }
};

async function testVercelDeployment() {
  console.log('🚀 Testing Vercel Deployment');
  console.log('============================');
  console.log(`📅 Test Time: ${new Date().toISOString()}`);
  console.log(`📧 Test Recipient: ${testData.to}`);
  
  // Get the Vercel project URL from environment or use default
  const vercelUrl = process.env.VERCEL_URL || 'hermes-security-production.vercel.app';
  const apiUrl = `https://${vercelUrl}/api/send-email`;
  
  console.log(`🌐 API URL: ${apiUrl}`);
  
  try {
    console.log('\n📤 Sending test email via Vercel API...');
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Email-Service': 'hermes-vercel-test',
        'X-Test-Environment': 'production'
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Email sent successfully!');
      console.log(`📧 Message ID: ${result.messageId || 'N/A'}`);
      console.log(`📧 Check your inbox at: ${testData.to}`);
      console.log('\n🎉 Vercel deployment is working correctly!');
      console.log('\n📋 Next Steps:');
      console.log('1. Check your email inbox');
      console.log('2. Test the contact form on the live site');
      console.log('3. Verify email formatting and content');
      console.log('4. Test reply functionality');
    } else {
      console.log('❌ Email sending failed');
      console.log(`Error: ${result.error || response.statusText}`);
      console.log('\n🔧 Troubleshooting:');
      console.log('1. Check environment variables in Vercel dashboard');
      console.log('2. Verify SMTP credentials');
      console.log('3. Check Vercel function logs');
    }
  } catch (error) {
    console.log('❌ Network error:', error instanceof Error ? error.message : 'Unknown error');
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Verify Vercel deployment is complete');
    console.log('2. Check API endpoint URL');
    console.log('3. Ensure environment variables are set');
  }
}

// Run the test
testVercelDeployment().catch(console.error);

