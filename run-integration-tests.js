// Comprehensive Integration Test Suite
// Based on the database integration test plan

import { config } from 'dotenv';
import fetch from 'node-fetch';

// Load environment variables
config();

class IntegrationTester {
  constructor() {
    this.baseUrl = 'http://localhost:3000';
    this.testResults = {
      passed: 0,
      failed: 0,
      total: 0,
      details: []
    };
  }

  async logTest(testName, success, details = '') {
    this.testResults.total++;
    if (success) {
      this.testResults.passed++;
      console.log(`✅ ${testName}: PASSED`);
    } else {
      this.testResults.failed++;
      console.log(`❌ ${testName}: FAILED`);
      if (details) console.log(`   Details: ${details}`);
    }
    this.testResults.details.push({ testName, success, details });
  }

  async testDatabaseHealth() {
    console.log('\n🏥 Testing Database Health Check');
    console.log('================================');
    
    try {
      const response = await fetch(`${this.baseUrl}/api/health/database`);
      const health = await response.json();
      
      await this.logTest(
        'Database Health Check - Status Code',
        response.ok,
        `Status: ${response.status}`
      );
      
      await this.logTest(
        'Database Health Check - Connection',
        health.database?.connected === true,
        `Connected: ${health.database?.connected}`
      );
      
      await this.logTest(
        'Database Health Check - Response Time',
        health.database?.responseTime < 1000,
        `Response Time: ${health.database?.responseTime}ms`
      );
      
      await this.logTest(
        'Database Health Check - Overall Status',
        health.status === 'healthy' || health.status === 'degraded',
        `Status: ${health.status}`
      );
      
    } catch (error) {
      await this.logTest(
        'Database Health Check - Connection',
        false,
        error.message
      );
    }
  }

  async testBackupAPI() {
    console.log('\n📤 Testing Backup API Endpoint');
    console.log('==============================');
    
    const testData = {
      formData: {
        firstName: 'Integration',
        lastName: 'Test',
        email: 'integration.test@example.com',
        country: 'United Kingdom',
        phoneNumber: '+447700900001',
        userRole: 'CTO',
        problemDescription: 'Testing the database integration with comprehensive test suite',
        companyName: 'Test Corp Ltd',
        companySize: '11-50',
        serviceUrgency: 'urgent',
        agreeToTerms: true,
        privacyConsent: true,
        marketingConsent: false,
        captchaToken: 'test-captcha-token-123'
      },
      metadata: {
        userAgent: 'Integration Test Suite',
        timestamp: new Date().toISOString(),
        ipAddress: '127.0.0.1'
      }
    };

    try {
      const response = await fetch(`${this.baseUrl}/api/backup-lead`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Hermes-Source': 'integration-test'
        },
        body: JSON.stringify(testData)
      });

      const result = await response.json();

      await this.logTest(
        'Backup API - Status Code',
        response.ok,
        `Status: ${response.status}`
      );

      await this.logTest(
        'Backup API - Response Structure',
        result.success !== undefined && result.leadId !== undefined,
        `Success: ${result.success}, LeadId: ${result.leadId}`
      );

      await this.logTest(
        'Backup API - Lead ID Generation',
        result.leadId && result.leadId.startsWith('HERMES-'),
        `LeadId: ${result.leadId}`
      );

      await this.logTest(
        'Backup API - Database Backup',
        result.databaseBackup?.success === true,
        `Database Backup: ${result.databaseBackup?.success}`
      );

      await this.logTest(
        'Backup API - Backup ID',
        result.backupId && typeof result.backupId === 'number',
        `BackupId: ${result.backupId}`
      );

      // Store the lead ID for retrieval test
      this.testLeadId = result.leadId;
      this.testBackupId = result.backupId;

    } catch (error) {
      await this.logTest(
        'Backup API - Connection',
        false,
        error.message
      );
    }
  }

  async testLeadRetrieval() {
    console.log('\n🔍 Testing Lead Retrieval');
    console.log('=========================');
    
    if (!this.testLeadId) {
      await this.logTest(
        'Lead Retrieval - Prerequisites',
        false,
        'No test lead ID available from backup test'
      );
      return;
    }

    try {
      // Test retrieval by lead ID
      const response = await fetch(`${this.baseUrl}/api/leads/${this.testLeadId}`);
      const result = await response.json();

      await this.logTest(
        'Lead Retrieval - Status Code',
        response.ok,
        `Status: ${response.status}`
      );

      await this.logTest(
        'Lead Retrieval - Lead Found',
        result.success === true && result.lead !== undefined,
        `Success: ${result.success}`
      );

      await this.logTest(
        'Lead Retrieval - Lead ID Match',
        result.lead?.leadId === this.testLeadId,
        `Expected: ${this.testLeadId}, Got: ${result.lead?.leadId}`
      );

      await this.logTest(
        'Lead Retrieval - Required Fields',
        result.lead?.firstName && result.lead?.lastName && result.lead?.email,
        `Fields present: firstName=${!!result.lead?.firstName}, lastName=${!!result.lead?.lastName}, email=${!!result.lead?.email}`
      );

      await this.logTest(
        'Lead Retrieval - 8n8 Tracking Fields',
        result.lead?.n8nSuccess !== undefined && result.lead?.n8nRetryCount !== undefined,
        `n8nSuccess: ${result.lead?.n8nSuccess}, n8nRetryCount: ${result.lead?.n8nRetryCount}`
      );

      // Test retrieval by numeric ID
      if (this.testBackupId) {
        const numericResponse = await fetch(`${this.baseUrl}/api/leads/${this.testBackupId}`);
        const numericResult = await numericResponse.json();

        await this.logTest(
          'Lead Retrieval - Numeric ID',
          numericResponse.ok && numericResult.success === true,
          `Status: ${numericResponse.status}, Success: ${numericResult.success}`
        );
      }

    } catch (error) {
      await this.logTest(
        'Lead Retrieval - Connection',
        false,
        error.message
      );
    }
  }

  async testErrorHandling() {
    console.log('\n⚠️  Testing Error Handling');
    console.log('==========================');

    // Test invalid lead ID
    try {
      const response = await fetch(`${this.baseUrl}/api/leads/INVALID-ID-123`);
      const result = await response.json();

      await this.logTest(
        'Error Handling - Invalid Lead ID',
        response.status === 404 && result.success === false,
        `Status: ${response.status}, Success: ${result.success}`
      );

    } catch (error) {
      await this.logTest(
        'Error Handling - Invalid Lead ID',
        false,
        error.message
      );
    }

    // Test malformed backup request
    try {
      const response = await fetch(`${this.baseUrl}/api/backup-lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invalid: 'data' })
      });

      const result = await response.json();

      await this.logTest(
        'Error Handling - Malformed Request',
        response.status === 400 && result.success === false,
        `Status: ${response.status}, Success: ${result.success}`
      );

    } catch (error) {
      await this.logTest(
        'Error Handling - Malformed Request',
        false,
        error.message
      );
    }

    // Test missing required fields
    try {
      const response = await fetch(`${this.baseUrl}/api/backup-lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formData: {
            firstName: 'Test',
            // Missing required fields
          }
        })
      });

      const result = await response.json();

      await this.logTest(
        'Error Handling - Missing Required Fields',
        response.status === 400 && result.success === false,
        `Status: ${response.status}, Success: ${result.success}`
      );

    } catch (error) {
      await this.logTest(
        'Error Handling - Missing Required Fields',
        false,
        error.message
      );
    }
  }

  async testPerformance() {
    console.log('\n⚡ Testing Performance');
    console.log('=====================');

    const testData = {
      formData: {
        firstName: 'Performance',
        lastName: 'Test',
        email: 'performance.test@example.com',
        country: 'United Kingdom',
        phoneNumber: '+447700900002',
        userRole: 'CTO',
        problemDescription: 'Performance test for database integration',
        companyName: 'Performance Corp',
        companySize: '51-200',
        serviceUrgency: 'not-urgent',
        agreeToTerms: true,
        privacyConsent: true,
        marketingConsent: false
      },
      metadata: {
        userAgent: 'Performance Test',
        timestamp: new Date().toISOString()
      }
    };

    // Test backup API performance
    try {
      const startTime = Date.now();
      const response = await fetch(`${this.baseUrl}/api/backup-lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      });
      const responseTime = Date.now() - startTime;

      await this.logTest(
        'Performance - Backup API Response Time',
        responseTime < 5000, // Should be under 5 seconds
        `Response Time: ${responseTime}ms`
      );

      await this.logTest(
        'Performance - Backup API Success',
        response.ok,
        `Status: ${response.status}`
      );

    } catch (error) {
      await this.logTest(
        'Performance - Backup API',
        false,
        error.message
      );
    }

    // Test health check performance
    try {
      const startTime = Date.now();
      const response = await fetch(`${this.baseUrl}/api/health/database`);
      const responseTime = Date.now() - startTime;

      await this.logTest(
        'Performance - Health Check Response Time',
        responseTime < 1000, // Should be under 1 second
        `Response Time: ${responseTime}ms`
      );

    } catch (error) {
      await this.logTest(
        'Performance - Health Check',
        false,
        error.message
      );
    }
  }

  async testDataIntegrity() {
    console.log('\n🔒 Testing Data Integrity');
    console.log('=========================');

    const testData = {
      formData: {
        firstName: 'Data Integrity',
        lastName: 'Test',
        email: 'integrity.test@example.com',
        country: 'United Kingdom',
        phoneNumber: '+447700900003',
        userRole: 'CTO',
        problemDescription: 'Testing data integrity and validation',
        companyName: 'Integrity Corp',
        companySize: '201-500',
        serviceUrgency: 'super-urgent',
        agreeToTerms: true,
        privacyConsent: true,
        marketingConsent: true
      },
      metadata: {
        userAgent: 'Data Integrity Test',
        timestamp: new Date().toISOString(),
        ipAddress: '192.168.1.100'
      }
    };

    try {
      const response = await fetch(`${this.baseUrl}/api/backup-lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      });

      const result = await response.json();

      if (result.success && result.leadId) {
        // Retrieve the lead and verify data integrity
        const retrievalResponse = await fetch(`${this.baseUrl}/api/leads/${result.leadId}`);
        const retrievalResult = await retrievalResponse.json();

        await this.logTest(
          'Data Integrity - Lead Creation and Retrieval',
          retrievalResponse.ok && retrievalResult.success === true,
          `Creation: ${result.success}, Retrieval: ${retrievalResult.success}`
        );

        await this.logTest(
          'Data Integrity - Field Preservation',
          retrievalResult.lead?.firstName === 'Data Integrity' &&
          retrievalResult.lead?.lastName === 'Test' &&
          retrievalResult.lead?.email === 'integrity.test@example.com',
          `firstName: ${retrievalResult.lead?.firstName}, lastName: ${retrievalResult.lead?.lastName}, email: ${retrievalResult.lead?.email}`
        );

        await this.logTest(
          'Data Integrity - Timestamp Generation',
          retrievalResult.lead?.createdAt !== undefined,
          `createdAt: ${retrievalResult.lead?.createdAt}`
        );

        await this.logTest(
          'Data Integrity - Unique ID Generation',
          retrievalResult.lead?.id && typeof retrievalResult.lead.id === 'number',
          `ID: ${retrievalResult.lead?.id}`
        );
      }

    } catch (error) {
      await this.logTest(
        'Data Integrity - Test Execution',
        false,
        error.message
      );
    }
  }

  async runAllTests() {
    console.log('🧪 Hermes Security Database Integration Test Suite');
    console.log('==================================================');
    console.log('Based on the comprehensive test plan');
    console.log('');

    await this.testDatabaseHealth();
    await this.testBackupAPI();
    await this.testLeadRetrieval();
    await this.testErrorHandling();
    await this.testPerformance();
    await this.testDataIntegrity();

    // Print summary
    console.log('\n📊 Test Results Summary');
    console.log('========================');
    console.log(`Total Tests: ${this.testResults.total}`);
    console.log(`Passed: ${this.testResults.passed} ✅`);
    console.log(`Failed: ${this.testResults.failed} ❌`);
    console.log(`Success Rate: ${((this.testResults.passed / this.testResults.total) * 100).toFixed(1)}%`);

    if (this.testResults.failed === 0) {
      console.log('\n🎉 All tests passed! Database integration is working perfectly.');
    } else {
      console.log('\n⚠️  Some tests failed. Please check the details above.');
    }

    console.log('\n🔍 Detailed Results:');
    this.testResults.details.forEach(test => {
      const status = test.success ? '✅' : '❌';
      console.log(`   ${status} ${test.testName}`);
      if (test.details) console.log(`      ${test.details}`);
    });

    return this.testResults;
  }
}

// Run the tests
async function main() {
  const tester = new IntegrationTester();
  const results = await tester.runAllTests();
  
  // Exit with appropriate code
  process.exit(results.failed > 0 ? 1 : 0);
}

main().catch(error => {
  console.error('❌ Test suite failed:', error);
  process.exit(1);
});
