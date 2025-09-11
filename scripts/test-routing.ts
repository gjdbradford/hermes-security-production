#!/usr/bin/env tsx

/**
 * Routing Test Suite
 *
 * This script tests routing functionality across all environments
 * to ensure no 404 errors occur.
 *
 * Run with: npx tsx scripts/test-routing.ts
 */

import { getBasePath, buildUrl, getEnvironment } from '../src/utils/routingUtils';

// Mock window.location for testing
const mockWindowLocation = (hostname: string, pathname: string) => {
  Object.defineProperty(window, 'location', {
    value: {
      hostname,
      pathname,
      href: `https://${hostname}${pathname}`,
    },
    writable: true,
  });
};

// Test cases for different environments
const testCases = [
  {
    name: 'Local Development',
    hostname: 'localhost',
    pathname: '/',
    expectedBasePath: '/',
    expectedEnvironment: 'development' as const,
  },
  {
    name: 'Staging Environment',
    hostname: 'gjdbradford.github.io',
    pathname: '/hermes-security-production/',
    expectedBasePath: '/hermes-security-production/',
    expectedEnvironment: 'staging' as const,
  },
  {
    name: 'Production Environment',
    hostname: 'hermes-security-production-o1yyi3yd1-gjdbradford-5891s-projects.vercel.app',
    pathname: '/',
    expectedBasePath: '/',
    expectedEnvironment: 'production' as const,
  },
];

// Test routing functions
function testRouting() {
  console.log('🧪 Testing Routing Functions\n');

  let passedTests = 0;
  let totalTests = 0;

  for (const testCase of testCases) {
    console.log(`📍 Testing ${testCase.name}`);
    console.log(`   Hostname: ${testCase.hostname}`);
    console.log(`   Pathname: ${testCase.pathname}`);

    // Mock the environment
    mockWindowLocation(testCase.hostname, testCase.pathname);

    // Test getBasePath()
    totalTests++;
    const basePath = getBasePath();
    if (basePath === testCase.expectedBasePath) {
      console.log(`   ✅ getBasePath(): ${basePath}`);
      passedTests++;
    } else {
      console.log(`   ❌ getBasePath(): Expected ${testCase.expectedBasePath}, got ${basePath}`);
    }

    // Test getEnvironment()
    totalTests++;
    const environment = getEnvironment();
    if (environment === testCase.expectedEnvironment) {
      console.log(`   ✅ getEnvironment(): ${environment}`);
      passedTests++;
    } else {
      console.log(`   ❌ getEnvironment(): Expected ${testCase.expectedEnvironment}, got ${environment}`);
    }

    // Test buildUrl() for different routes
    const routes = ['', 'about', 'contact'];
    for (const route of routes) {
      totalTests++;
      const url = buildUrl(route);
      const expectedUrl = testCase.expectedBasePath === '/'
        ? `/#/${route}`
        : `${testCase.expectedBasePath}#/${route}`;

      if (url === expectedUrl) {
        console.log(`   ✅ buildUrl('${route}'): ${url}`);
        passedTests++;
      } else {
        console.log(`   ❌ buildUrl('${route}'): Expected ${expectedUrl}, got ${url}`);
      }
    }

    console.log('');
  }

  // Summary
  console.log('📊 Test Results:');
  console.log(`   Passed: ${passedTests}/${totalTests}`);
  console.log(`   Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

  if (passedTests === totalTests) {
    console.log('   🎉 All routing tests passed!');
    return true;
  } else {
    console.log('   ⚠️  Some routing tests failed!');
    return false;
  }
}

// Test specific URL generation
function testSpecificUrls() {
  console.log('\n🔗 Testing Specific URL Generation\n');

  const testUrls = [
    { environment: 'Local', hostname: 'localhost', pathname: '/', route: 'about', expected: '/#/about' },
    { environment: 'Staging', hostname: 'gjdbradford.github.io', pathname: '/hermes-security-production/', route: 'about', expected: '/hermes-security-production/#/about' },
    { environment: 'Production', hostname: 'hermes-security-production-o1yyi3yd1-gjdbradford-5891s-projects.vercel.app', pathname: '/', route: 'about', expected: '/#/about' },
    { environment: 'Local', hostname: 'localhost', pathname: '/', route: 'contact', expected: '/#/contact' },
    { environment: 'Staging', hostname: 'gjdbradford.github.io', pathname: '/hermes-security-production/', route: 'contact', expected: '/hermes-security-production/#/contact' },
    { environment: 'Production', hostname: 'hermes-security-production-o1yyi3yd1-gjdbradford-5891s-projects.vercel.app', pathname: '/', route: 'contact', expected: '/#/contact' },
  ];

  let passed = 0;
  const total = testUrls.length;

  for (const test of testUrls) {
    mockWindowLocation(test.hostname, test.pathname);
    const url = buildUrl(test.route);

    if (url === test.expected) {
      console.log(`✅ ${test.environment} - ${test.route}: ${url}`);
      passed++;
    } else {
      console.log(`❌ ${test.environment} - ${test.route}: Expected ${test.expected}, got ${url}`);
    }
  }

  console.log(`\n📊 URL Tests: ${passed}/${total} passed`);
  return passed === total;
}

// Main test runner
function runTests() {
  console.log('🚦 ROUTING TEST SUITE');
  console.log('====================\n');

  const routingTests = testRouting();
  const urlTests = testSpecificUrls();

  console.log('\n🏁 Final Results:');
  console.log('================');

  if (routingTests && urlTests) {
    console.log('✅ All tests passed! Routing is working correctly.');
    process.exit(0);
  } else {
    console.log('❌ Some tests failed! Check routing implementation.');
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
}

export { testRouting, testSpecificUrls };
