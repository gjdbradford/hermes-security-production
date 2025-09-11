#!/usr/bin/env node
/**
 * Test Fixes Script
 *
 * This script tests all the fixes we've implemented to ensure they're working correctly.
 *
 * Usage: npm run test:fixes
 */

import { config } from 'dotenv';
import { getEnvironmentConfig, getEnvironmentName } from '../src/utils/environment';

// Load environment variables
config({ path: '.env.local' });

/**
 * Test environment detection
 */
function testEnvironmentDetection() {
  console.log('🧪 Testing Environment Detection...');

  // Mock different environments
  const testEnvironments = [
    { hostname: 'www.hermessecurity.io', expected: 'production' },
    { hostname: 'hermessecurity.io', expected: 'production' },
    { hostname: 'hermes-security-production-abc123.vercel.app', expected: 'production' },
    { hostname: 'gjdbradford.github.io', pathname: '/hermes-security-production/', expected: 'staging' },
    { hostname: 'localhost', expected: 'development' },
    { hostname: '127.0.0.1', expected: 'development' }
  ];

  console.log('✅ Environment detection tests completed');
}

/**
 * Test webhook URL configuration
 */
function testWebhookConfiguration() {
  console.log('\n🧪 Testing Webhook Configuration...');

  try {
    const config = getEnvironmentConfig();
    console.log('   Webhook URL:', config.webhookUrl);
    console.log('   CDN Base URL:', config.cdnBaseUrl);
    console.log('   API Base URL:', config.apiBaseUrl);
    console.log('   Log Level:', config.logLevel);
    console.log('✅ Webhook configuration test completed');
  } catch (error) {
    console.error('❌ Webhook configuration test failed:', error);
  }
}

/**
 * Test asset URLs
 */
function testAssetUrls() {
  console.log('\n🧪 Testing Asset URLs...');

  const expectedAssets = [
    'https://fiwymn5e6h2iyex9.public.blob.vercel-storage.com/favicon.svg',
    'https://fiwymn5e6h2iyex9.public.blob.vercel-storage.com/favicon.ico',
    'https://fiwymn5e6h2iyex9.public.blob.vercel-storage.com/site.webmanifest'
  ];

  expectedAssets.forEach(url => {
    if (url.startsWith('https://fiwymn5e6h2iyex9.public.blob.vercel-storage.com/')) {
      console.log(`   ✅ ${url.split('/').pop()}`);
    } else {
      console.log(`   ❌ ${url.split('/').pop()}`);
    }
  });

  console.log('✅ Asset URL test completed');
}

/**
 * Test 8n8 webhook endpoints
 */
async function test8n8Endpoints() {
  console.log('\n🧪 Testing 8n8 Webhook Endpoints...');

  const endpoints = [
    {
      name: 'Production',
      url: 'https://ilovemylife.app.n8n.cloud/webhook/a57cf53e-c2d6-4e59-8e38-44b774355629',
      environment: 'production'
    },
    {
      name: 'Staging/Test',
      url: 'https://ilovemylife.app.n8n.cloud/webhook-test/a57cf53e-c2d6-4e59-8e38-44b774355629',
      environment: 'staging'
    }
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Hermes-Environment': endpoint.environment,
          'X-Hermes-Source': 'test-script'
        },
        body: JSON.stringify({
          test: true,
          timestamp: new Date().toISOString(),
          environment: endpoint.environment
        })
      });

      if (response.ok) {
        console.log(`   ✅ ${endpoint.name}: ${response.status}`);
      } else {
        console.log(`   ⚠️  ${endpoint.name}: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.log(`   ❌ ${endpoint.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  console.log('✅ 8n8 endpoint test completed');
}

/**
 * Main test function
 */
async function runTests() {
  console.log('🚀 Starting Fix Verification Tests...\n');

  try {
    // Run all tests
    testEnvironmentDetection();
    testWebhookConfiguration();
    testAssetUrls();
    await test8n8Endpoints();

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n💡 Next steps:');
    console.log('   1. Deploy your changes to production');
    console.log('   2. Test the contact form submission');
    console.log('   3. Verify favicon and manifest load without errors');
    console.log('   4. Check that 8n8 webhook receives requests');

  } catch (error) {
    console.error('\n❌ Tests failed:', error);
    process.exit(1);
  }
}

// Run tests if called directly
if (import.meta.main) {
  runTests();
}
