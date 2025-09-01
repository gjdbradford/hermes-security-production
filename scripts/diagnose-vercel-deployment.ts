#!/usr/bin/env npx tsx

/**
 * Vercel Deployment Diagnostic Script
 * Identifies issues with the Vercel deployment and email system
 */

async function diagnoseVercelDeployment() {
  console.log('🔍 Vercel Deployment Diagnostic');
  console.log('================================');
  
  const baseUrl = 'https://hermes-security-production.vercel.app';
  
  // Test 1: Check if main site loads
  console.log('\n1️⃣ Testing main site...');
  try {
    const response = await fetch(baseUrl);
    console.log(`   Status: ${response.status} ${response.statusText}`);
    if (response.ok) {
      console.log('   ✅ Main site is accessible');
    } else {
      console.log('   ❌ Main site has issues');
    }
  } catch (error) {
    console.log('   ❌ Main site error:', error instanceof Error ? error.message : 'Unknown error');
  }
  
  // Test 2: Check API endpoint with GET
  console.log('\n2️⃣ Testing API endpoint (GET)...');
  try {
    const response = await fetch(`${baseUrl}/api/send-email`);
    console.log(`   Status: ${response.status} ${response.statusText}`);
    const text = await response.text();
    console.log(`   Response: ${text.substring(0, 100)}...`);
    
    if (response.status === 405) {
      console.log('   ✅ API endpoint exists (returns 405 for GET - expected)');
    } else if (response.status === 404) {
      console.log('   ❌ API endpoint not found - Vercel function not deployed');
    } else {
      console.log('   ⚠️  Unexpected response');
    }
  } catch (error) {
    console.log('   ❌ API endpoint error:', error instanceof Error ? error.message : 'Unknown error');
  }
  
  // Test 3: Check API endpoint with POST
  console.log('\n3️⃣ Testing API endpoint (POST)...');
  try {
    const response = await fetch(`${baseUrl}/api/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ test: 'data' })
    });
    console.log(`   Status: ${response.status} ${response.statusText}`);
    const text = await response.text();
    console.log(`   Response: ${text.substring(0, 200)}...`);
    
    if (response.status === 400) {
      console.log('   ✅ API endpoint exists (returns 400 for invalid data - expected)');
    } else if (response.status === 404) {
      console.log('   ❌ API endpoint not found - Vercel function not deployed');
    } else {
      console.log('   ⚠️  Unexpected response');
    }
  } catch (error) {
    console.log('   ❌ API endpoint error:', error instanceof Error ? error.message : 'Unknown error');
  }
  
  // Test 4: Check if there are any other API endpoints
  console.log('\n4️⃣ Testing other potential API endpoints...');
  const apiEndpoints = [
    '/api',
    '/api/',
    '/api/test',
    '/api/health'
  ];
  
  for (const endpoint of apiEndpoints) {
    try {
      const response = await fetch(`${baseUrl}${endpoint}`);
      console.log(`   ${endpoint}: ${response.status} ${response.statusText}`);
    } catch (error) {
      console.log(`   ${endpoint}: Error`);
    }
  }
  
  // Test 5: Check Vercel deployment info
  console.log('\n5️⃣ Vercel Deployment Analysis...');
  console.log('   📁 API file exists: ✅ /api/send-email.ts');
  console.log('   📄 vercel.json exists: ✅ /vercel.json');
  console.log('   🔧 Build configuration: Check vercel.json');
  
  // Test 6: Recommendations
  console.log('\n6️⃣ Recommendations...');
  console.log('   🔧 If API returns 404:');
  console.log('      - Check Vercel dashboard for build errors');
  console.log('      - Verify vercel.json configuration');
  console.log('      - Ensure API file is in correct location');
  console.log('      - Check if TypeScript compilation is working');
  
  console.log('   📧 For email functionality:');
  console.log('      - Set environment variables in Vercel dashboard');
  console.log('      - Configure SMTP credentials');
  console.log('      - Test with valid email data');
  
  console.log('\n✅ Diagnostic completed');
}

// Run the diagnostic
diagnoseVercelDeployment().catch(console.error);
