#!/usr/bin/env npx tsx

/**
 * 8n8 Webhook Testing Script
 * Tests the 8n8 webhook integration for email delivery
 */

const WEBHOOK_URL = 'https://ilovemylife.app.n8n.cloud/webhook-test/a57cf53e-c2d6-4e59-8e38-44b774355629';

const testFormData = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  country: 'GB',
  mobileNumber: '+44 7700 900000',
  problemDescription: 'Testing 8n8 webhook integration from Hermes Security contact form. This is a test message to verify email delivery.',
  companyName: 'Test Company Ltd',
  companySize: '51-200',
  serviceUrgency: 'Not urgent',
  agreeToTerms: true
};

async function testWebhookConnectivity() {
  console.log('🔗 Testing 8n8 Webhook Connectivity');
  console.log('===================================');
  console.log(`📍 Webhook URL: ${WEBHOOK_URL}`);
  
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hermes-Source': 'webhook-test-suite'
      },
      body: JSON.stringify({ test: 'connectivity' })
    });

    console.log(`   Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      console.log('   ✅ Webhook is accessible');
      const result = await response.text();
      console.log(`   Response: ${result.substring(0, 200)}...`);
      return true;
    } else {
      console.log('   ❌ Webhook returned error');
      const error = await response.text();
      console.log(`   Error: ${error}`);
      return false;
    }
  } catch (error) {
    console.log('   ❌ Network error:', error instanceof Error ? error.message : 'Unknown error');
    return false;
  }
}

async function testWebhookWithFormData() {
  console.log('\n📝 Testing 8n8 Webhook with Form Data');
  console.log('=====================================');
  
  const payload = {
    formData: testFormData,
    timestamp: new Date().toISOString(),
    userAgent: 'Hermes Security Test Suite',
    termsConsent: testFormData.agreeToTerms
  };

  console.log('📊 Payload:');
  console.log(JSON.stringify(payload, null, 2));

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hermes-Source': 'webhook-test-suite',
        'X-Test-Environment': 'local-development'
      },
      body: JSON.stringify(payload)
    });

    console.log(`\n📡 Response: ${response.status} ${response.statusText}`);
    
    const result = await response.text();
    console.log(`📄 Response Body: ${result}`);

    if (response.ok) {
      console.log('   ✅ Form data sent successfully');
      try {
        const jsonResult = JSON.parse(result);
        console.log('   📧 Expected email delivery to: gjdbradford@gmail.com');
        return { success: true, result: jsonResult };
      } catch (e) {
        console.log('   ⚠️  Response is not JSON, but webhook accepted the data');
        return { success: true, result: result };
      }
    } else {
      console.log('   ❌ Form data rejected');
      return { success: false, error: result };
    }
  } catch (error) {
    console.log('   ❌ Network error:', error instanceof Error ? error.message : 'Unknown error');
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

async function testWebhookWithAuth() {
  console.log('\n🔐 Testing 8n8 Webhook with Authentication');
  console.log('==========================================');
  
  const payload = {
    formData: testFormData,
    timestamp: new Date().toISOString(),
    userAgent: 'Hermes Security Test Suite',
    termsConsent: testFormData.agreeToTerms
  };

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.VITE_N8N_API_KEY || 'test-api-key'}`,
        'X-Hermes-Source': 'webhook-test-suite',
        'X-Test-Environment': 'local-development'
      },
      body: JSON.stringify(payload)
    });

    console.log(`   Status: ${response.status} ${response.statusText}`);
    const result = await response.text();
    console.log(`   Response: ${result.substring(0, 200)}...`);

    if (response.ok) {
      console.log('   ✅ Authenticated request successful');
      return { success: true, result: result };
    } else {
      console.log('   ❌ Authentication failed or other error');
      return { success: false, error: result };
    }
  } catch (error) {
    console.log('   ❌ Network error:', error instanceof Error ? error.message : 'Unknown error');
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

async function testWebhookFromContactForm() {
  console.log('\n🌐 Testing Webhook from Contact Form Integration');
  console.log('===============================================');
  
  // Simulate the exact payload that the contact form would send
  const contactFormPayload = {
    formData: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      country: 'GB',
      mobileNumber: '+44 7700 123456',
      problemDescription: 'I need help with web application security testing for my e-commerce platform. We handle sensitive customer data and want to ensure we are compliant with GDPR requirements.',
      companyName: 'Example E-commerce Ltd',
      companySize: '201-500',
      serviceUrgency: 'Urgent',
      agreeToTerms: true
    },
    timestamp: new Date().toISOString(),
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    termsConsent: true
  };

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hermes-Source': 'website-contact-form',
        'X-Test-Environment': 'contact-form-simulation'
      },
      body: JSON.stringify(contactFormPayload)
    });

    console.log(`   Status: ${response.status} ${response.statusText}`);
    const result = await response.text();
    console.log(`   Response: ${result}`);

    if (response.ok) {
      console.log('   ✅ Contact form simulation successful');
      console.log('   📧 Check gjdbradford@gmail.com for email');
      return { success: true, result: result };
    } else {
      console.log('   ❌ Contact form simulation failed');
      return { success: false, error: result };
    }
  } catch (error) {
    console.log('   ❌ Network error:', error instanceof Error ? error.message : 'Unknown error');
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

async function run8n8WebhookTests() {
  console.log('🚀 8n8 Webhook Integration Testing');
  console.log('==================================');
  console.log(`📅 Test Date: ${new Date().toISOString()}`);
  console.log(`🎯 Target Email: gjdbradford@gmail.com`);
  
  const results = {
    connectivity: false,
    formData: false,
    auth: false,
    contactForm: false
  };

  // Test 1: Basic connectivity
  results.connectivity = await testWebhookConnectivity();
  
  // Test 2: Form data submission
  const formDataResult = await testWebhookWithFormData();
  results.formData = formDataResult.success;
  
  // Test 3: Authentication (if API key is available)
  if (process.env.VITE_N8N_API_KEY) {
    const authResult = await testWebhookWithAuth();
    results.auth = authResult.success;
  } else {
    console.log('\n🔐 Skipping authentication test (no API key provided)');
  }
  
  // Test 4: Contact form simulation
  const contactFormResult = await testWebhookFromContactForm();
  results.contactForm = contactFormResult.success;

  // Summary
  console.log('\n📊 TEST RESULTS SUMMARY');
  console.log('=======================');
  console.log(`🔗 Connectivity: ${results.connectivity ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`📝 Form Data: ${results.formData ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`🔐 Authentication: ${results.auth ? '✅ PASS' : '⚠️  SKIPPED'}`);
  console.log(`🌐 Contact Form: ${results.contactForm ? '✅ PASS' : '❌ FAIL'}`);

  // Recommendations
  console.log('\n💡 RECOMMENDATIONS');
  console.log('==================');
  
  if (results.connectivity && results.formData) {
    console.log('✅ Webhook is working! Check your email inbox.');
    console.log('📧 Expected recipient: gjdbradford@gmail.com');
    console.log('📧 Check spam folder if not in inbox');
  } else {
    console.log('❌ Webhook has issues that need to be resolved:');
    if (!results.connectivity) {
      console.log('   - Check webhook URL is correct');
      console.log('   - Verify 8n8 instance is accessible');
    }
    if (!results.formData) {
      console.log('   - Check payload format');
      console.log('   - Verify required fields');
    }
  }

  console.log('\n🔧 Next Steps:');
  console.log('1. Check email inbox for test emails');
  console.log('2. Verify email content and formatting');
  console.log('3. Test from local development server');
  console.log('4. Deploy to production and test live form');
  
  console.log(`\n✅ 8n8 webhook testing completed at ${new Date().toISOString()}`);
}

// Run the tests
run8n8WebhookTests().catch(console.error);
