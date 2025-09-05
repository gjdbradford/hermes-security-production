#!/usr/bin/env npx tsx

/**
 * Comprehensive Webhook Testing Script
 * 
 * This script tests:
 * 1. Webhook connectivity and activation status
 * 2. CORS proxy functionality
 * 3. Form data submission
 * 4. Email delivery verification
 * 
 * Usage: npx tsx scripts/comprehensive-webhook-test.ts
 */

const WEBHOOK_URL = 'https://ilovemylife.app.n8n.cloud/webhook-test/a57cf53e-c2d6-4e59-8e38-44b774355629';
const PROXY_URL = 'http://localhost:3001/proxy';

const testFormData = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  country: 'GB',
  mobileNumber: '+44 7700 900000',
  problemDescription: 'Comprehensive webhook test from Hermes Security. Testing both direct webhook and CORS proxy functionality.',
  companyName: 'Test Company Ltd',
  companySize: '51-200',
  serviceUrgency: 'Not urgent',
  agreeToTerms: true
};

async function testWebhookStatus() {
  console.log('🔍 Testing Webhook Status');
  console.log('=========================');
  console.log(`📍 Webhook URL: ${WEBHOOK_URL}`);
  
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hermes-Source': 'comprehensive-test-suite'
      },
      body: JSON.stringify({ test: 'status-check' })
    });

    console.log(`   Status: ${response.status} ${response.statusText}`);
    
    if (response.status === 404) {
      const error = await response.text();
      console.log('   ❌ Webhook not registered');
      console.log('   📋 Error:', error);
      return { status: 'not-registered', error };
    } else if (response.ok) {
      console.log('   ✅ Webhook is active and accessible');
      return { status: 'active', response };
    } else {
      console.log('   ⚠️  Webhook returned error');
      const error = await response.text();
      console.log('   📋 Error:', error);
      return { status: 'error', error };
    }
  } catch (error) {
    console.log('   ❌ Network error:', error instanceof Error ? error.message : 'Unknown error');
    return { status: 'network-error', error };
  }
}

async function testCorsProxy() {
  console.log('\n🔄 Testing CORS Proxy');
  console.log('======================');
  console.log(`📍 Proxy URL: ${PROXY_URL}`);
  
  try {
    const response = await fetch(`${PROXY_URL.replace('/proxy', '')}/health`);
    
    if (response.ok) {
      console.log('   ✅ CORS proxy server is running');
      return { status: 'running' };
    } else {
      console.log('   ❌ CORS proxy server not responding');
      return { status: 'not-running' };
    }
  } catch (error) {
    console.log('   ❌ CORS proxy server not accessible');
    console.log('   💡 Start it with: npx tsx scripts/cors-proxy-server.ts');
    return { status: 'not-accessible', error };
  }
}

async function testDirectWebhookSubmission() {
  console.log('\n📝 Testing Direct Webhook Submission');
  console.log('=====================================');
  
  const payload = {
    formData: testFormData,
    timestamp: new Date().toISOString(),
    userAgent: 'Comprehensive Test Suite',
    termsConsent: testFormData.agreeToTerms
  };

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hermes-Source': 'comprehensive-test-suite'
      },
      body: JSON.stringify(payload)
    });

    console.log(`   Status: ${response.status} ${response.statusText}`);
    const result = await response.text();
    console.log(`   Response: ${result.substring(0, 200)}...`);

    if (response.ok) {
      console.log('   ✅ Direct webhook submission successful');
      return { success: true, result };
    } else {
      console.log('   ❌ Direct webhook submission failed');
      return { success: false, error: result };
    }
  } catch (error) {
    console.log('   ❌ Network error:', error instanceof Error ? error.message : 'Unknown error');
    return { success: false, error };
  }
}

async function testProxySubmission() {
  console.log('\n🔄 Testing CORS Proxy Submission');
  console.log('=================================');
  
  const payload = {
    formData: testFormData,
    timestamp: new Date().toISOString(),
    userAgent: 'Comprehensive Test Suite (via Proxy)',
    termsConsent: testFormData.agreeToTerms
  };

  try {
    const response = await fetch(PROXY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hermes-Source': 'comprehensive-test-suite'
      },
      body: JSON.stringify(payload)
    });

    console.log(`   Status: ${response.status} ${response.statusText}`);
    const result = await response.text();
    console.log(`   Response: ${result.substring(0, 200)}...`);

    if (response.ok) {
      console.log('   ✅ Proxy submission successful');
      return { success: true, result };
    } else {
      console.log('   ❌ Proxy submission failed');
      return { success: false, error: result };
    }
  } catch (error) {
    console.log('   ❌ Network error:', error instanceof Error ? error.message : 'Unknown error');
    return { success: false, error };
  }
}

async function runComprehensiveTests() {
  console.log('🚀 Comprehensive Webhook Testing Suite');
  console.log('======================================');
  console.log(`📅 Test Date: ${new Date().toISOString()}`);
  console.log(`🎯 Target Email: gjdbradford@gmail.com`);
  console.log(`📧 Test Email: ${testFormData.email}`);
  
  const results = {
    webhookStatus: null,
    corsProxy: null,
    directSubmission: null,
    proxySubmission: null
  };

  // Test 1: Webhook status
  results.webhookStatus = await testWebhookStatus();
  
  // Test 2: CORS proxy availability
  results.corsProxy = await testCorsProxy();
  
  // Test 3: Direct webhook submission (if webhook is active)
  if (results.webhookStatus?.status === 'active') {
    results.directSubmission = await testDirectWebhookSubmission();
  } else {
    console.log('\n📝 Skipping direct webhook test (webhook not active)');
  }
  
  // Test 4: Proxy submission (if proxy is running)
  if (results.corsProxy?.status === 'running') {
    results.proxySubmission = await testProxySubmission();
  } else {
    console.log('\n🔄 Skipping proxy submission test (proxy not running)');
  }

  // Summary
  console.log('\n📊 COMPREHENSIVE TEST RESULTS');
  console.log('==============================');
  console.log(`🔍 Webhook Status: ${results.webhookStatus?.status || 'unknown'}`);
  console.log(`🔄 CORS Proxy: ${results.corsProxy?.status || 'unknown'}`);
  console.log(`📝 Direct Submission: ${results.directSubmission?.success ? '✅ SUCCESS' : '❌ FAILED'}`);
  console.log(`🔄 Proxy Submission: ${results.proxySubmission?.success ? '✅ SUCCESS' : '❌ FAILED'}`);

  // Recommendations
  console.log('\n💡 RECOMMENDATIONS');
  console.log('==================');
  
  if (results.webhookStatus?.status === 'not-registered') {
    console.log('🚨 CRITICAL: Webhook is not registered!');
    console.log('   1. Go to your 8n8 instance: https://ilovemylife.app.n8n.cloud');
    console.log('   2. Click "Execute workflow" button');
    console.log('   3. Activate the webhook');
    console.log('   4. Run this test again');
  }
  
  if (results.corsProxy?.status !== 'running') {
    console.log('🔄 CORS Proxy not running:');
    console.log('   1. Start proxy: npx tsx scripts/cors-proxy-server.ts');
    console.log('   2. Enable in browser: localStorage.setItem("hermes-use-cors-proxy", "true")');
    console.log('   3. Test contact form from localhost:8080');
  }
  
  if (results.directSubmission?.success || results.proxySubmission?.success) {
    console.log('✅ Webhook is working! Check your email inbox.');
    console.log('📧 Expected recipient: gjdbradford@gmail.com');
    console.log('📧 Check spam folder if not in inbox');
  }

  console.log('\n🔧 Next Steps:');
  console.log('1. Activate webhook in 8n8 (if not registered)');
  console.log('2. Start CORS proxy for local development');
  console.log('3. Test contact form from localhost:8080');
  console.log('4. Check email delivery');
  console.log('5. Deploy to production and test live form');
  
  console.log(`\n✅ Comprehensive testing completed at ${new Date().toISOString()}`);
}

// Run the comprehensive tests
runComprehensiveTests().catch(console.error);
