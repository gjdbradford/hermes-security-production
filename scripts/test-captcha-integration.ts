#!/usr/bin/env npx tsx

/**
 * CAPTCHA Integration Testing Script
 *
 * This script tests CAPTCHA functionality across all environments
 * and provides comprehensive validation of the integration.
 *
 * Last updated: 2025-09-08T08:51:00.000Z
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface TestResult {
  test: string;
  environment: string;
  status: 'PASS' | 'FAIL' | 'SKIP';
  message: string;
  details?: any;
}

interface TestSuite {
  name: string;
  results: TestResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
  };
}

class CaptchaTester {
  private results: TestSuite[] = [];
  private currentSuite: TestSuite | null = null;

  constructor() {
    console.log('🔐 CAPTCHA Integration Testing Suite');
    console.log('=====================================\n');
  }

  private startSuite(name: string) {
    this.currentSuite = {
      name,
      results: [],
      summary: { total: 0, passed: 0, failed: 0, skipped: 0 }
    };
    console.log(`\n📋 Testing: ${name}`);
    console.log('─'.repeat(50));
  }

  private addResult(test: string, environment: string, status: 'PASS' | 'FAIL' | 'SKIP', message: string, details?: any) {
    if (!this.currentSuite) {
      throw new Error('No active test suite');
    }

    const result: TestResult = { test, environment, status, message, details };
    this.currentSuite.results.push(result);
    this.currentSuite.summary.total++;
    this.currentSuite.summary[status.toLowerCase() as keyof typeof this.currentSuite.summary]++;

    const statusIcon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⏭️';
    console.log(`${statusIcon} ${test} (${environment}): ${message}`);

    if (details && status === 'FAIL') {
      console.log(`   Details: ${JSON.stringify(details, null, 2)}`);
    }
  }

  private endSuite() {
    if (!this.currentSuite) return;

    this.results.push(this.currentSuite);
    const { total, passed, failed, skipped } = this.currentSuite.summary;

    console.log(`\n📊 Summary: ${passed}/${total} passed, ${failed} failed, ${skipped} skipped`);

    if (failed > 0) {
      console.log('❌ Some tests failed - check the details above');
    } else {
      console.log('✅ All tests passed!');
    }
  }

  // Test 1: Dependencies and Configuration
  private testDependencies() {
    this.startSuite('Dependencies and Configuration');

    try {
      // Check if react-google-recaptcha-v3 is installed
      const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
      const hasRecaptcha = packageJson.dependencies['react-google-recaptcha-v3'];

      if (hasRecaptcha) {
        this.addResult('reCAPTCHA Library', 'all', 'PASS', 'react-google-recaptcha-v3 is installed');
      } else {
        this.addResult('reCAPTCHA Library', 'all', 'FAIL', 'react-google-recaptcha-v3 is not installed');
      }
    } catch (error) {
      this.addResult('reCAPTCHA Library', 'all', 'FAIL', 'Failed to check package.json', error);
    }

    // Check if CAPTCHA config file exists
    try {
      const captchaConfig = readFileSync('src/config/captcha.ts', 'utf8');
      if (captchaConfig.includes('CAPTCHA_CONFIGS')) {
        this.addResult('CAPTCHA Config', 'all', 'PASS', 'CAPTCHA configuration file exists');
      } else {
        this.addResult('CAPTCHA Config', 'all', 'FAIL', 'CAPTCHA configuration is incomplete');
      }
    } catch (error) {
      this.addResult('CAPTCHA Config', 'all', 'FAIL', 'CAPTCHA configuration file not found', error);
    }

    // Check if CAPTCHA components exist
    const components = [
      'src/components/CaptchaProvider.tsx',
      'src/components/CaptchaVerification.tsx'
    ];

    components.forEach(component => {
      try {
        const content = readFileSync(component, 'utf8');
        if (content.length > 0) {
          this.addResult('CAPTCHA Component', 'all', 'PASS', `${component} exists and has content`);
        } else {
          this.addResult('CAPTCHA Component', 'all', 'FAIL', `${component} is empty`);
        }
      } catch (error) {
        this.addResult('CAPTCHA Component', 'all', 'FAIL', `${component} not found`, error);
      }
    });

    this.endSuite();
  }

  // Test 2: Environment Configuration
  private testEnvironmentConfig() {
    this.startSuite('Environment Configuration');

    const environments = ['production', 'staging', 'development'];

    environments.forEach(env => {
      try {
        // Check if environment variables are documented
        const captchaConfig = readFileSync('src/config/captcha.ts', 'utf8');
        const envVars = [
          `VITE_RECAPTCHA_SITE_KEY_${env.toUpperCase()}`,
          `VITE_RECAPTCHA_SECRET_KEY_${env.toUpperCase()}`
        ];

        envVars.forEach(envVar => {
          if (captchaConfig.includes(envVar)) {
            this.addResult('Environment Variables', env, 'PASS', `${envVar} is documented`);
          } else {
            this.addResult('Environment Variables', env, 'FAIL', `${envVar} is not documented`);
          }
        });

        // Check if environment-specific config exists
        if (captchaConfig.includes(`case '${env}':`)) {
          this.addResult('Environment Config', env, 'PASS', `Configuration for ${env} exists`);
        } else {
          this.addResult('Environment Config', env, 'FAIL', `Configuration for ${env} missing`);
        }

      } catch (error) {
        this.addResult('Environment Config', env, 'FAIL', `Failed to check ${env} configuration`, error);
      }
    });

    this.endSuite();
  }

  // Test 3: Component Integration
  private testComponentIntegration() {
    this.startSuite('Component Integration');

    try {
      // Check if ContactForm imports CAPTCHA components
      const contactForm = readFileSync('src/components/ContactForm.tsx', 'utf8');

      if (contactForm.includes('useCaptchaVerification')) {
        this.addResult('ContactForm Integration', 'all', 'PASS', 'ContactForm imports CAPTCHA hook');
      } else {
        this.addResult('ContactForm Integration', 'all', 'FAIL', 'ContactForm does not import CAPTCHA hook');
      }

      if (contactForm.includes('captchaToken')) {
        this.addResult('CAPTCHA Token Handling', 'all', 'PASS', 'ContactForm handles CAPTCHA tokens');
      } else {
        this.addResult('CAPTCHA Token Handling', 'all', 'FAIL', 'ContactForm does not handle CAPTCHA tokens');
      }

      if (contactForm.includes('captchaError')) {
        this.addResult('CAPTCHA Error Handling', 'all', 'PASS', 'ContactForm handles CAPTCHA errors');
      } else {
        this.addResult('CAPTCHA Error Handling', 'all', 'FAIL', 'ContactForm does not handle CAPTCHA errors');
      }

    } catch (error) {
      this.addResult('Component Integration', 'all', 'FAIL', 'Failed to check ContactForm integration', error);
    }

    // Check if App.tsx includes CaptchaProvider
    try {
      const appTsx = readFileSync('src/App.tsx', 'utf8');
      if (appTsx.includes('CaptchaProvider')) {
        this.addResult('App Integration', 'all', 'PASS', 'App.tsx includes CaptchaProvider');
      } else {
        this.addResult('App Integration', 'all', 'FAIL', 'App.tsx does not include CaptchaProvider');
      }
    } catch (error) {
      this.addResult('App Integration', 'all', 'FAIL', 'Failed to check App.tsx integration', error);
    }

    this.endSuite();
  }

  // Test 4: API Integration
  private testApiIntegration() {
    this.startSuite('API Integration');

    try {
      // Check if contactApi includes CAPTCHA token
      const contactApi = readFileSync('src/services/contactApi.ts', 'utf8');

      if (contactApi.includes('captchaToken?: string')) {
        this.addResult('API Interface', 'all', 'PASS', 'ContactFormData includes captchaToken');
      } else {
        this.addResult('API Interface', 'all', 'FAIL', 'ContactFormData does not include captchaToken');
      }

      if (contactApi.includes('captchaToken: formData.captchaToken')) {
        this.addResult('API Request', 'all', 'PASS', 'API request includes CAPTCHA token');
      } else {
        this.addResult('API Request', 'all', 'FAIL', 'API request does not include CAPTCHA token');
      }

    } catch (error) {
      this.addResult('API Integration', 'all', 'FAIL', 'Failed to check API integration', error);
    }

    this.endSuite();
  }

  // Test 5: Build and Compilation
  private testBuild() {
    this.startSuite('Build and Compilation');

    try {
      console.log('🔨 Testing build compilation...');
      execSync('npm run build', { stdio: 'pipe' });
      this.addResult('Build Compilation', 'all', 'PASS', 'Project builds successfully');
    } catch (error) {
      this.addResult('Build Compilation', 'all', 'FAIL', 'Build failed', error);
    }

    this.endSuite();
  }

  // Test 6: TypeScript Validation
  private testTypeScript() {
    this.startSuite('TypeScript Validation');

    try {
      console.log('🔍 Running TypeScript validation...');
      execSync('npx tsc --noEmit', { stdio: 'pipe' });
      this.addResult('TypeScript Check', 'all', 'PASS', 'No TypeScript errors found');
    } catch (error) {
      this.addResult('TypeScript Check', 'all', 'FAIL', 'TypeScript errors found', error);
    }

    this.endSuite();
  }

  // Run all tests
  public async runAllTests() {
    this.testDependencies();
    this.testEnvironmentConfig();
    this.testComponentIntegration();
    this.testApiIntegration();
    this.testBuild();
    this.testTypeScript();

    this.generateReport();
  }

  // Generate comprehensive report
  private generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('🔐 CAPTCHA INTEGRATION TEST REPORT');
    console.log('='.repeat(60));

    let totalTests = 0;
    let totalPassed = 0;
    let totalFailed = 0;
    let totalSkipped = 0;

    this.results.forEach(suite => {
      console.log(`\n📋 ${suite.name}`);
      console.log('─'.repeat(40));

      suite.results.forEach(result => {
        const icon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⏭️';
        console.log(`${icon} ${result.test} (${result.environment}): ${result.message}`);
      });

      totalTests += suite.summary.total;
      totalPassed += suite.summary.passed;
      totalFailed += suite.summary.failed;
      totalSkipped += suite.summary.skipped;
    });

    console.log('\n' + '='.repeat(60));
    console.log('📊 OVERALL SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total Tests: ${totalTests}`);
    console.log(`✅ Passed: ${totalPassed}`);
    console.log(`❌ Failed: ${totalFailed}`);
    console.log(`⏭️ Skipped: ${totalSkipped}`);
    console.log(`Success Rate: ${Math.round((totalPassed / totalTests) * 100)}%`);

    if (totalFailed === 0) {
      console.log('\n🎉 All tests passed! CAPTCHA integration is ready.');
    } else {
      console.log('\n⚠️ Some tests failed. Please review and fix the issues above.');
    }

    // Save report to file
    const reportPath = join(process.cwd(), 'captcha-test-report.json');
    writeFileSync(reportPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      summary: { totalTests, totalPassed, totalFailed, totalSkipped },
      suites: this.results
    }, null, 2));

    console.log(`\n📄 Detailed report saved to: ${reportPath}`);
  }
}

// Run the tests
async function main() {
  const tester = new CaptchaTester();
  await tester.runAllTests();
}

// Check if this script is being run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export default CaptchaTester;
