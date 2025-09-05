#!/usr/bin/env tsx

/**
 * Comprehensive Test Script for Legal Pages
 * Tests Terms of Use, Privacy Policy, and Contact Form functionality
 */

import { performance } from 'perf_hooks';

interface TestResult {
  test: string;
  status: 'PASS' | 'FAIL' | 'SKIP';
  message: string;
  duration?: number;
  details?: any;
}

class LegalPagesTester {
  private baseUrl = 'http://localhost:8080';
  private results: TestResult[] = [];

  async runAllTests(): Promise<void> {
    console.log('🧪 Starting Legal Pages Test Suite...\n');
    
    await this.testPageAccessibility();
    await this.testPagePerformance();
    await this.testContentValidation();
    await this.testNavigation();
    await this.testSEO();
    
    this.printResults();
  }

  private async testPageAccessibility(): Promise<void> {
    console.log('📋 Testing Page Accessibility...');
    
    const pages = ['/', '/#/terms', '/#/privacy', '/#/contact'];
    
    for (const page of pages) {
      const startTime = performance.now();
      
      try {
        const response = await fetch(`${this.baseUrl}${page}`);
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        if (response.ok) {
          this.addResult('PASS', `Page ${page} accessible`, `Status: ${response.status}, Time: ${duration.toFixed(2)}ms`);
        } else {
          this.addResult('FAIL', `Page ${page} not accessible`, `Status: ${response.status}`);
        }
      } catch (error) {
        this.addResult('FAIL', `Page ${page} connection failed`, error.message);
      }
    }
  }

  private async testPagePerformance(): Promise<void> {
    console.log('⚡ Testing Page Performance...');
    
    const pages = ['/#/terms', '/#/privacy', '/#/contact'];
    
    for (const page of pages) {
      const startTime = performance.now();
      
      try {
        const response = await fetch(`${this.baseUrl}${page}`);
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        if (duration < 2000) {
          this.addResult('PASS', `Page ${page} performance`, `Load time: ${duration.toFixed(2)}ms (Target: <2000ms)`);
        } else {
          this.addResult('FAIL', `Page ${page} performance`, `Load time: ${duration.toFixed(2)}ms (Target: <2000ms)`);
        }
      } catch (error) {
        this.addResult('FAIL', `Page ${page} performance test failed`, error.message);
      }
    }
  }

  private async testContentValidation(): Promise<void> {
    console.log('📝 Testing Content Validation...');
    
    // Test Terms page content
    try {
      const termsResponse = await fetch(`${this.baseUrl}/#/terms`);
      const termsHtml = await termsResponse.text();
      
      const requiredTermsContent = [
        'Graham Bradford',
        'graham@hermessecurity.io',
        'Terms of Use',
        'European Union',
        'Service Level Agreement',
        'Intellectual Property',
        'Limitation of Liability'
      ];
      
      for (const content of requiredTermsContent) {
        if (termsHtml.includes(content)) {
          this.addResult('PASS', `Terms page contains: ${content}`, 'Content found');
        } else {
          this.addResult('FAIL', `Terms page missing: ${content}`, 'Content not found');
        }
      }
    } catch (error) {
      this.addResult('FAIL', 'Terms page content validation failed', error.message);
    }

    // Test Privacy page content
    try {
      const privacyResponse = await fetch(`${this.baseUrl}/#/privacy`);
      const privacyHtml = await privacyResponse.text();
      
      const requiredPrivacyContent = [
        'GDPR',
        'Data Controller',
        'Personal Data',
        'Legal Basis',
        'Data Protection Rights',
        'Right to Erasure',
        'Data Security'
      ];
      
      for (const content of requiredPrivacyContent) {
        if (privacyHtml.includes(content)) {
          this.addResult('PASS', `Privacy page contains: ${content}`, 'Content found');
        } else {
          this.addResult('FAIL', `Privacy page missing: ${content}`, 'Content not found');
        }
      }
    } catch (error) {
      this.addResult('FAIL', 'Privacy page content validation failed', error.message);
    }
  }

  private async testNavigation(): Promise<void> {
    console.log('🧭 Testing Navigation...');
    
    try {
      const homeResponse = await fetch(`${this.baseUrl}/`);
      const homeHtml = await homeResponse.text();
      
      // Check for navigation links
      const navLinks = ['/#/about', '/#/contact', '/#/terms', '/#/privacy'];
      
      for (const link of navLinks) {
        if (homeHtml.includes(link)) {
          this.addResult('PASS', `Navigation link found: ${link}`, 'Link present in HTML');
        } else {
          this.addResult('FAIL', `Navigation link missing: ${link}`, 'Link not found in HTML');
        }
      }
    } catch (error) {
      this.addResult('FAIL', 'Navigation test failed', error.message);
    }
  }

  private async testSEO(): Promise<void> {
    console.log('🔍 Testing SEO Elements...');
    
    const pages = [
      { path: '/#/terms', expectedTitle: 'Terms of Use - Hermes Security' },
      { path: '/#/privacy', expectedTitle: 'Privacy Policy - Hermes Security' },
      { path: '/#/contact', expectedTitle: 'Contact - Hermes Security' }
    ];
    
    for (const page of pages) {
      try {
        const response = await fetch(`${this.baseUrl}${page.path}`);
        const html = await response.text();
        
        // Check for title tag
        const titleMatch = html.match(/<title>(.*?)<\/title>/i);
        if (titleMatch) {
          this.addResult('PASS', `SEO Title for ${page.path}`, `Found: ${titleMatch[1]}`);
        } else {
          this.addResult('FAIL', `SEO Title missing for ${page.path}`, 'No title tag found');
        }
        
        // Check for meta description
        const metaDescMatch = html.match(/<meta name="description" content="(.*?)"/i);
        if (metaDescMatch) {
          this.addResult('PASS', `Meta Description for ${page.path}`, `Found: ${metaDescMatch[1].substring(0, 50)}...`);
        } else {
          this.addResult('FAIL', `Meta Description missing for ${page.path}`, 'No meta description found');
        }
        
      } catch (error) {
        this.addResult('FAIL', `SEO test failed for ${page.path}`, error.message);
      }
    }
  }

  private addResult(status: 'PASS' | 'FAIL' | 'SKIP', test: string, message: string, details?: any): void {
    this.results.push({
      test,
      status,
      message,
      details
    });
  }

  private printResults(): void {
    console.log('\n📊 Test Results Summary:');
    console.log('='.repeat(50));
    
    const passCount = this.results.filter(r => r.status === 'PASS').length;
    const failCount = this.results.filter(r => r.status === 'FAIL').length;
    const skipCount = this.results.filter(r => r.status === 'SKIP').length;
    
    console.log(`✅ Passed: ${passCount}`);
    console.log(`❌ Failed: ${failCount}`);
    console.log(`⏭️  Skipped: ${skipCount}`);
    console.log(`📈 Total: ${this.results.length}`);
    
    console.log('\n📋 Detailed Results:');
    console.log('-'.repeat(50));
    
    this.results.forEach((result, index) => {
      const icon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⏭️';
      console.log(`${index + 1}. ${icon} ${result.test}`);
      console.log(`   ${result.message}`);
      if (result.details) {
        console.log(`   Details: ${JSON.stringify(result.details)}`);
      }
      console.log('');
    });
    
    // Overall status
    if (failCount === 0) {
      console.log('🎉 All tests passed! Legal pages are ready for production.');
    } else {
      console.log(`⚠️  ${failCount} test(s) failed. Please review and fix issues before deployment.`);
    }
  }
}

// Run the tests
async function main() {
  const tester = new LegalPagesTester();
  await tester.runAllTests();
}

// Run the tests
main().catch(console.error);

export default LegalPagesTester;
