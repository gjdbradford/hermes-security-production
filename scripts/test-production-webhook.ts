#!/usr/bin/env tsx

import { config } from 'dotenv';

// Load environment variables
config();

const PRODUCTION_WEBHOOK_URL =
  'https://ilovemylife.app.n8n.cloud/webhook/83ae02df-4b2f-4e3a-aa1b-52e12d046cda';
const STAGING_WEBHOOK_URL =
  'https://ilovemylife.app.n8n.cloud/webhook-test/83ae02df-4b2f-4e3a-aa1b-52e12d046cda';

async function testWebhookConnection(webhookUrl: string, environment: string) {
  console.log(`\n🧪 Testing ${environment} webhook connection...`);
  console.log(`   URL: ${webhookUrl}`);

  try {
    const testData = {
      // Basic information
      email: 'test@hermessecurity.io',
      pentestType: 'web-application',
      productionEnvironment: 'true',
      stagingEnvironment: 'false',
      preferredTime: 'morning',
      timezone: 'UTC',
      additionalInfo: 'Test webhook connection',
      selectedServices: ['web-application', 'api-testing'],

      // Web Applications
      webApplications: {
        count: '1-5',
        technologies: ['React', 'Node.js'],
        vulnerabilities: ['SQL Injection', 'XSS'],
        web_concerns: 'Test webhook connection',
      },

      // Mobile Applications
      mobileApplications: {
        count: '0',
        platforms: [],
        frameworks: [],
        features: [],
        mobile_concerns: '',
      },

      // API Endpoints
      apiEndpoints: {
        count: '1-5',
        types: ['REST API'],
        authMethods: ['JWT'],
        sensitiveData: ['User Data'],
        api_concerns: 'Test webhook connection',
      },

      // Network
      network: {
        components: ['Firewall'],
        protocols: ['HTTPS'],
        network_concerns: 'Test webhook connection',
      },

      // Infrastructure
      infrastructure: {
        components: ['Cloud Servers'],
        cloudPlatforms: ['AWS'],
        operatingSystems: ['Linux'],
        infrastructure_concerns: 'Test webhook connection',
      },

      // Security and metadata
      captchaToken: 'test-captcha-token',
      assessmentId: `TEST-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      userAgent: 'Test Webhook Script',
      source: 'hermes-security-needs-assessment',
      formType: 'needs-assessment',
      testMode: true,
    };

    console.log('   📤 Sending test data...');
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    console.log(`   📡 Response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`   ❌ Error response: ${errorText}`);
      return false;
    }

    // Handle response
    let result;
    try {
      const responseText = await response.text();
      if (responseText.trim()) {
        result = JSON.parse(responseText);
        console.log('   ✅ Success with response:', result);
      } else {
        console.log('   ✅ Success (no response body)');
        result = { success: true };
      }
    } catch (_parseError) {
      console.log('   ✅ Success (non-JSON response)');
      result = { success: true };
    }

    return true;
  } catch (error) {
    console.log(`   ❌ Connection failed: ${error.message}`);
    return false;
  }
}

async function testProductionWebhook() {
  console.log('🚀 Testing Production Webhook Connection');
  console.log('==========================================');

  // Test staging webhook first
  const stagingSuccess = await testWebhookConnection(STAGING_WEBHOOK_URL, 'Staging');

  // Test production webhook
  const productionSuccess = await testWebhookConnection(PRODUCTION_WEBHOOK_URL, 'Production');

  console.log('\n📊 Test Results:');
  console.log(`   Staging Webhook: ${stagingSuccess ? '✅ Success' : '❌ Failed'}`);
  console.log(`   Production Webhook: ${productionSuccess ? '✅ Success' : '❌ Failed'}`);

  if (productionSuccess) {
    console.log('\n✅ Production webhook is working!');
    console.log('\n📋 Next Steps:');
    console.log('1. Check your 8n8 workflow execution history');
    console.log('2. Verify Supabase data is being inserted');
    console.log('3. Test with a real needs assessment form');
    console.log('4. Monitor for any errors in 8n8 logs');
  } else {
    console.log('\n❌ Production webhook failed!');
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check if 8n8 workflow is active');
    console.log('2. Verify webhook URL is correct');
    console.log('3. Check 8n8 workflow logs for errors');
    console.log('4. Ensure Supabase credentials are correct in 8n8');
  }
}

// Run the test
testProductionWebhook();
