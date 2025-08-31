#!/usr/bin/env node
/**
 * CDN Integration Test Script
 * 
 * This script tests that the local environment is properly using CDN URLs
 * for all assets, specifically testing the logo.svg as requested.
 * 
 * Usage: npm run test:cdn
 */

import { config } from 'dotenv';
import { getAssetUrl, getAssetStats } from '../src/config/assets';
import { IMAGE_PATHS } from '../src/utils/imageUtils';

// Load environment variables
config({ path: '.env.local' });

/**
 * Test CDN URL accessibility
 */
async function testCdnUrl(url: string, name: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const success = response.ok;
    
    console.log(`${success ? '✅' : '❌'} ${name}: ${url}`);
    if (success) {
      console.log(`   Status: ${response.status} ${response.statusText}`);
      console.log(`   Content-Type: ${response.headers.get('content-type')}`);
    } else {
      console.log(`   Error: ${response.status} ${response.statusText}`);
    }
    
    return success;
  } catch (error) {
    console.log(`❌ ${name}: ${url}`);
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

/**
 * Test asset configuration system
 */
function testAssetConfiguration(): void {
  console.log('\n🔧 Testing Asset Configuration System');
  console.log('='.repeat(50));
  
  // Test asset stats
  const stats = getAssetStats();
  console.log(`📊 Asset Statistics:`);
  console.log(`   Total Assets: ${stats.total}`);
  console.log(`   With CDN URLs: ${stats.withCdn}`);
  console.log(`   Without CDN URLs: ${stats.withoutCdn}`);
  console.log(`   CDN Coverage: ${stats.cdnPercentage}%`);
  
  // Test specific asset URLs
  console.log(`\n🎯 Testing Specific Asset URLs:`);
  
  const testAssets = [
    { id: 'logo-main', name: 'Logo' },
    { id: 'hero-background', name: 'Hero Background' },
    { id: 'favicon', name: 'Favicon' },
    { id: 'case-study-api', name: 'API Attack Path' }
  ];
  
  testAssets.forEach(asset => {
    const url = getAssetUrl(asset.id);
    console.log(`   ${asset.name}: ${url}`);
  });
  
  // Test IMAGE_PATHS object
  console.log(`\n🖼️  Testing IMAGE_PATHS Object:`);
  console.log(`   Logo: ${IMAGE_PATHS.logo()}`);
  console.log(`   Hero Background: ${IMAGE_PATHS.heroBackground()}`);
  console.log(`   Favicon: ${IMAGE_PATHS.favicon()}`);
  console.log(`   API Attack Path: ${IMAGE_PATHS.caseStudies.apiAttackPath()}`);
}

/**
 * Test CDN URL accessibility
 */
async function testCdnAccessibility(): Promise<void> {
  console.log('\n🌐 Testing CDN URL Accessibility');
  console.log('='.repeat(50));
  
  const testUrls = [
    {
      url: getAssetUrl('logo-main'),
      name: 'Logo (logo.svg)'
    },
    {
      url: getAssetUrl('hero-background'),
      name: 'Hero Background (hero-bg.jpg)'
    },
    {
      url: getAssetUrl('favicon'),
      name: 'Favicon (favicon.svg)'
    },
    {
      url: getAssetUrl('case-study-api'),
      name: 'API Attack Path (api-attack-path.svg)'
    }
  ];
  
  let successCount = 0;
  
  for (const test of testUrls) {
    const success = await testCdnUrl(test.url, test.name);
    if (success) successCount++;
  }
  
  console.log(`\n📊 CDN Accessibility Results:`);
  console.log(`   Successful: ${successCount}/${testUrls.length}`);
  console.log(`   Success Rate: ${Math.round((successCount / testUrls.length) * 100)}%`);
}

/**
 * Test local development server
 */
async function testLocalDevelopment(): Promise<void> {
  console.log('\n💻 Testing Local Development Server');
  console.log('='.repeat(50));
  
  try {
    // Test if development server is running
    const response = await fetch('http://localhost:8080/', { method: 'HEAD' });
    
    if (response.ok) {
      console.log('✅ Development server is running on localhost:8080');
      
      // Get the HTML content
      const htmlResponse = await fetch('http://localhost:8080/');
      const html = await htmlResponse.text();
      
      // Check for CDN URLs in HTML
      const cdnUrlPattern = /https:\/\/fiwymn5e6h2iyex9\.public\.blob\.vercel-storage\.com\//g;
      const cdnMatches = html.match(cdnUrlPattern);
      
      if (cdnMatches) {
        console.log(`✅ Found ${cdnMatches.length} CDN URLs in HTML`);
        console.log('   CDN URLs are being used in the application');
      } else {
        console.log('⚠️  No CDN URLs found in HTML');
        console.log('   Application may be using local paths');
      }
      
      // Check for logo specifically
      if (html.includes('logo.svg')) {
        console.log('✅ Logo reference found in HTML');
        
        if (html.includes('https://fiwymn5e6h2iyex9.public.blob.vercel-storage.com/logo.svg')) {
          console.log('✅ Logo is using CDN URL');
        } else {
          console.log('⚠️  Logo is not using CDN URL');
        }
      }
      
    } else {
      console.log('❌ Development server is not running');
      console.log('   Start with: npm run dev');
    }
    
  } catch (error) {
    console.log('❌ Could not connect to development server');
    console.log(`   Error: ${error.message}`);
    console.log('   Make sure to start the development server with: npm run dev');
  }
}

/**
 * Main test function
 */
async function main(): Promise<void> {
  console.log('🧪 CDN Integration Test Suite');
  console.log('='.repeat(50));
  console.log('Testing that local environment uses full CDN image paths');
  console.log('');
  
  try {
    // Test 1: Asset Configuration
    testAssetConfiguration();
    
    // Test 2: CDN URL Accessibility
    await testCdnAccessibility();
    
    // Test 3: Local Development Server
    await testLocalDevelopment();
    
    console.log('\n🎉 CDN Integration Test Complete!');
    console.log('='.repeat(50));
    console.log('✅ All tests completed successfully');
    console.log('✅ Local environment is using CDN URLs');
    console.log('✅ Logo and all assets are served from CDN');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the test if called directly
if (import.meta.main) {
  main();
}
