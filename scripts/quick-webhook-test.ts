#!/usr/bin/env npx tsx

/**
 * Quick 8n8 Webhook Test
 * Run this immediately after activating the webhook in 8n8
 */

const WEBHOOK_URL = 'https://ilovemylife.app.n8n.cloud/webhook-test/a57cf53e-c2d6-4e59-8e38-44b774355629';

async function quickWebhookTest() {
  console.log('⚡ Quick 8n8 Webhook Test');
  console.log('=========================');
  console.log('Run this after activating the webhook in 8n8');
  console.log(`📍 Webhook: ${WEBHOOK_URL}`);
  
  const testPayload = {
    formData: {
      firstName: 'Quick',
      lastName: 'Test',
      email: 'quicktest@example.com',
      country: 'GB',
      mobileNumber: '+44 7700 123456',
      problemDescription: 'Quick test of activated 8n8 webhook for Hermes Security contact form.',
      companyName: 'Quick Test Ltd',
      companySize: '11-50',
      serviceUrgency: 'Not urgent',
      agreeToTerms: true
    },
    timestamp: new Date().toISOString(),
    userAgent: 'Hermes Security Quick Test',
    termsConsent: true
  };

  try {
    console.log('\n📤 Sending test data...');
    
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hermes-Source': 'quick-test'
      },
      body: JSON.stringify(testPayload)
    });

    console.log(`📡 Response: ${response.status} ${response.statusText}`);
    
    const result = await response.text();
    console.log(`📄 Response Body: ${result}`);

    if (response.ok) {
      console.log('\n✅ SUCCESS! Webhook is working!');
      console.log('📧 Check gjdbradford@gmail.com for the test email');
      console.log('📧 Check spam folder if not in inbox');
      console.log('\n🎉 Your contact form should now work!');
    } else {
      console.log('\n❌ Webhook still not working');
      console.log('🔧 Make sure you clicked "Execute workflow" in 8n8');
      console.log('🔧 Check that the workflow is saved and active');
    }
  } catch (error) {
    console.log('\n❌ Network error:', error instanceof Error ? error.message : 'Unknown error');
    console.log('🔧 Check your internet connection and 8n8 instance');
  }
}

// Run the quick test
quickWebhookTest().catch(console.error);
