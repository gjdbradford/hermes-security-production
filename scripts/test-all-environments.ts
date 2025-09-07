#!/usr/bin/env npx tsx

/**
 * Comprehensive Environment Testing Script
 * Tests all environments: local, staging (GitHub Pages), and production (Vercel)
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

interface TestResult {
  environment: string;
  url: string;
  status: 'pass' | 'fail' | 'skip';
  details: string;
  responseTime?: number;
  errors?: string[];
}

interface EnvironmentConfig {
  name: string;
  url: string;
  description: string;
  testPaths: string[];
  expectedAssets: string[];
}

const environments: EnvironmentConfig[] = [
  {
    name: 'local',
    url: 'http://localhost:8081',
    description: 'Local Development Server',
    testPaths: ['/', '/about', '/contact', '/terms', '/privacy'],
    expectedAssets: ['/assets/index-', '/assets/vendor-', '/assets/ui-']
  },
  {
    name: 'staging',
    url: 'https://gjdbradford.github.io/hermes-security-production',
    description: 'GitHub Pages Staging',
    testPaths: ['/', '/about', '/contact', '/terms', '/privacy'],
    expectedAssets: ['/hermes-security-production/assets/index-', '/hermes-security-production/assets/vendor-', '/hermes-security-production/assets/ui-']
  },
  {
    name: 'production',
    url: 'https://hermessecurity.io',
    description: 'Vercel Production',
    testPaths: ['/', '/about', '/contact', '/terms', '/privacy'],
    expectedAssets: ['/assets/index-', '/assets/vendor-', '/assets/ui-']
  }
];

class EnvironmentTester {
  private results: TestResult[] = [];

  async testEnvironment(env: EnvironmentConfig): Promise<TestResult[]> {
    console.log(`\n🧪 Testing ${env.description} (${env.url})`);
    console.log('=' .repeat(60));

    const envResults: TestResult[] = [];

    // Test 1: Basic connectivity
    const connectivityResult = await this.testConnectivity(env);
    envResults.push(connectivityResult);

    if (connectivityResult.status === 'fail') {
      console.log(`❌ Cannot connect to ${env.name}, skipping further tests`);
      return envResults;
    }

    // Test 2: Main page loads
    const mainPageResult = await this.testPageLoad(env, '/');
    envResults.push(mainPageResult);

    // Test 3: All routes work
    for (const path of env.testPaths) {
      const routeResult = await this.testPageLoad(env, path);
      envResults.push(routeResult);
    }

    // Test 4: Assets load correctly
    const assetsResult = await this.testAssets(env);
    envResults.push(assetsResult);

    // Test 5: CTA buttons work (if main page loads)
    if (mainPageResult.status === 'pass') {
      const ctaResult = await this.testCTAButtons(env);
      envResults.push(ctaResult);
    }

    return envResults;
  }

  private async testConnectivity(env: EnvironmentConfig): Promise<TestResult> {
    try {
      const startTime = Date.now();
      const response = await fetch(env.url, { 
        method: 'HEAD',
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });
      const responseTime = Date.now() - startTime;

      if (response.ok) {
        return {
          environment: env.name,
          url: env.url,
          status: 'pass',
          details: `Connected successfully (${response.status})`,
          responseTime
        };
      } else {
        return {
          environment: env.name,
          url: env.url,
          status: 'fail',
          details: `HTTP ${response.status}: ${response.statusText}`,
          responseTime
        };
      }
    } catch (error) {
      return {
        environment: env.name,
        url: env.url,
        status: 'fail',
        details: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  private async testPageLoad(env: EnvironmentConfig, path: string): Promise<TestResult> {
    try {
      const url = `${env.url}${path}`;
      const startTime = Date.now();
      const response = await fetch(url, { 
        signal: AbortSignal.timeout(15000) // 15 second timeout
      });
      const responseTime = Date.now() - startTime;

      if (response.ok) {
        const content = await response.text();
        
        // Check for common issues
        const errors: string[] = [];
        
        if (content.includes('Failed to load module script')) {
          errors.push('MIME type errors detected');
        }
        
        if (content.includes('404') && !content.includes('404 page')) {
          errors.push('404 error in content');
        }
        
        if (content.length < 1000) {
          errors.push('Page content seems too short');
        }

        if (errors.length > 0) {
          return {
            environment: env.name,
            url,
            status: 'fail',
            details: `Page loaded but has issues: ${errors.join(', ')}`,
            responseTime,
            errors
          };
        }

        return {
          environment: env.name,
          url,
          status: 'pass',
          details: `Page loaded successfully (${content.length} chars)`,
          responseTime
        };
      } else {
        return {
          environment: env.name,
          url,
          status: 'fail',
          details: `HTTP ${response.status}: ${response.statusText}`,
          responseTime
        };
      }
    } catch (error) {
      return {
        environment: env.name,
        url: `${env.url}${path}`,
        status: 'fail',
        details: `Failed to load: ${error instanceof Error ? error.message : 'Unknown error'}`,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  private async testAssets(env: EnvironmentConfig): Promise<TestResult> {
    try {
      const errors: string[] = [];
      let successCount = 0;
      let totalCount = 0;

      for (const assetPattern of env.expectedAssets) {
        // Try to find actual asset files by testing common patterns
        const testAssets = [
          `${assetPattern}*.js`,
          `${assetPattern}*.css`
        ];

        for (const testAsset of testAssets) {
          totalCount++;
          try {
            const assetUrl = `${env.url}${testAsset}`;
            const response = await fetch(assetUrl, { 
              method: 'HEAD',
              signal: AbortSignal.timeout(5000)
            });
            
            if (response.ok) {
              successCount++;
            } else {
              errors.push(`Asset ${testAsset}: HTTP ${response.status}`);
            }
          } catch (error) {
            errors.push(`Asset ${testAsset}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }
      }

      if (successCount === 0) {
        return {
          environment: env.name,
          url: env.url,
          status: 'fail',
          details: 'No assets could be loaded',
          errors
        };
      } else if (successCount < totalCount) {
        return {
          environment: env.name,
          url: env.url,
          status: 'fail',
          details: `Only ${successCount}/${totalCount} assets loaded`,
          errors
        };
      } else {
        return {
          environment: env.name,
          url: env.url,
          status: 'pass',
          details: `All ${successCount} assets loaded successfully`
        };
      }
    } catch (error) {
      return {
        environment: env.name,
        url: env.url,
        status: 'fail',
        details: `Asset test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  private async testCTAButtons(env: EnvironmentConfig): Promise<TestResult> {
    try {
      // Test if contact page loads (which indicates CTA navigation works)
      const contactUrl = `${env.url}/contact`;
      const response = await fetch(contactUrl, { 
        signal: AbortSignal.timeout(10000)
      });

      if (response.ok) {
        const content = await response.text();
        
        // Check if it's the contact page (not a redirect or error)
        if (content.includes('Contact Us') || content.includes('contact')) {
          return {
            environment: env.name,
            url: contactUrl,
            status: 'pass',
            details: 'Contact page accessible (CTA navigation working)'
          };
        } else {
          return {
            environment: env.name,
            url: contactUrl,
            status: 'fail',
            details: 'Contact page not properly loaded'
          };
        }
      } else {
        return {
          environment: env.name,
          url: contactUrl,
          status: 'fail',
          details: `Contact page HTTP ${response.status}: ${response.statusText}`
        };
      }
    } catch (error) {
      return {
        environment: env.name,
        url: `${env.url}/contact`,
        status: 'fail',
        details: `CTA test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  async runAllTests(): Promise<void> {
    console.log('🚀 Starting Comprehensive Environment Testing');
    console.log('=' .repeat(60));

    // Check if local server is running
    if (environments[0].name === 'local') {
      try {
        await fetch(environments[0].url, { 
          method: 'HEAD',
          signal: AbortSignal.timeout(2000)
        });
      } catch (error) {
        console.log('⚠️  Local development server not running. Start it with: npm run dev');
        environments[0] = { ...environments[0], url: 'SKIP' };
      }
    }

    for (const env of environments) {
      if (env.url === 'SKIP') {
        console.log(`\n⏭️  Skipping ${env.description} (not available)`);
        continue;
      }

      const envResults = await this.testEnvironment(env);
      this.results.push(...envResults);
    }

    this.printSummary();
  }

  private printSummary(): void {
    console.log('\n' + '=' .repeat(60));
    console.log('📊 TEST SUMMARY');
    console.log('=' .repeat(60));

    const environmentSummary = new Map<string, { pass: number; fail: number; skip: number }>();

    for (const result of this.results) {
      if (!environmentSummary.has(result.environment)) {
        environmentSummary.set(result.environment, { pass: 0, fail: 0, skip: 0 });
      }
      const summary = environmentSummary.get(result.environment)!;
      summary[result.status]++;
    }

    for (const [env, summary] of environmentSummary) {
      const total = summary.pass + summary.fail + summary.skip;
      const passRate = total > 0 ? ((summary.pass / total) * 100).toFixed(1) : '0';
      
      console.log(`\n${env.toUpperCase()}:`);
      console.log(`  ✅ Pass: ${summary.pass}`);
      console.log(`  ❌ Fail: ${summary.fail}`);
      console.log(`  ⏭️  Skip: ${summary.skip}`);
      console.log(`  📈 Pass Rate: ${passRate}%`);
    }

    // Show failed tests
    const failedTests = this.results.filter(r => r.status === 'fail');
    if (failedTests.length > 0) {
      console.log('\n❌ FAILED TESTS:');
      for (const test of failedTests) {
        console.log(`  • ${test.environment}: ${test.url}`);
        console.log(`    ${test.details}`);
        if (test.errors) {
          for (const error of test.errors) {
            console.log(`    Error: ${error}`);
          }
        }
      }
    }

    // Overall status
    const totalPass = this.results.filter(r => r.status === 'pass').length;
    const totalTests = this.results.length;
    const overallPassRate = totalTests > 0 ? ((totalPass / totalTests) * 100).toFixed(1) : '0';

    console.log(`\n🎯 OVERALL: ${totalPass}/${totalTests} tests passed (${overallPassRate}%)`);
    
    if (overallPassRate === '100.0') {
      console.log('🎉 All environments are working perfectly!');
    } else if (parseFloat(overallPassRate) >= 80) {
      console.log('⚠️  Most environments working, but some issues detected.');
    } else {
      console.log('🚨 Multiple environment issues detected. Review failed tests above.');
    }
  }
}

// Main execution
async function main() {
  const tester = new EnvironmentTester();
  await tester.runAllTests();
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { EnvironmentTester, TestResult, EnvironmentConfig };
