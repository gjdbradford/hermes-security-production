// Direct Database Service Testing
// Testing the database service without the web server

import { config } from 'dotenv';
import { databaseService } from './src/services/databaseService.ts';

// Load environment variables
config();

class DatabaseTester {
  constructor() {
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

  async testDatabaseConnection() {
    console.log('\n🔗 Testing Database Connection');
    console.log('==============================');
    
    try {
      const health = await databaseService.healthCheck();
      
      await this.logTest(
        'Database Connection - Health Check',
        health.status === 'healthy',
        `Status: ${health.status}, Response Time: ${health.responseTime}ms`
      );
      
      await this.logTest(
        'Database Connection - Response Time',
        health.responseTime < 1000,
        `Response Time: ${health.responseTime}ms`
      );
      
    } catch (error) {
      await this.logTest(
        'Database Connection - Health Check',
        false,
        error.message
      );
    }
  }

  async testLeadCreation() {
    console.log('\n📝 Testing Lead Creation');
    console.log('========================');
    
    const testData = {
      leadId: `TEST-${Date.now()}`,
      formData: {
        firstName: 'Database',
        lastName: 'Test',
        email: 'database.test@example.com',
        country: 'United Kingdom',
        phoneNumber: '+447700900100',
        userRole: 'CTO',
        problemDescription: 'Testing database service directly',
        companyName: 'Database Test Corp',
        companySize: '11-50',
        serviceUrgency: 'urgent',
        agreeToTerms: true,
        privacyConsent: true,
        marketingConsent: false
      },
      userAgent: 'Database Test Script',
      ipAddress: '127.0.0.1',
      captchaToken: 'test-token-123'
    };

    try {
      const lead = await databaseService.createLead(testData);
      
      await this.logTest(
        'Lead Creation - Success',
        lead !== null && lead.id !== undefined,
        `Lead ID: ${lead?.id}, Lead ID: ${lead?.leadId}`
      );
      
      await this.logTest(
        'Lead Creation - Unique ID Generation',
        lead?.id && typeof lead.id === 'number' && lead.id > 0,
        `ID: ${lead?.id}`
      );
      
      await this.logTest(
        'Lead Creation - Lead ID Match',
        lead?.leadId === testData.leadId,
        `Expected: ${testData.leadId}, Got: ${lead?.leadId}`
      );
      
      await this.logTest(
        'Lead Creation - Data Preservation',
        lead?.firstName === 'Database' && lead?.lastName === 'Test',
        `firstName: ${lead?.firstName}, lastName: ${lead?.lastName}`
      );
      
      await this.logTest(
        'Lead Creation - Timestamp Generation',
        lead?.createdAt !== undefined,
        `createdAt: ${lead?.createdAt}`
      );
      
      // Store for retrieval test
      this.testLeadId = lead.leadId;
      this.testLeadNumericId = lead.id;
      
    } catch (error) {
      await this.logTest(
        'Lead Creation - Execution',
        false,
        error.message
      );
    }
  }

  async testLeadRetrieval() {
    console.log('\n🔍 Testing Lead Retrieval');
    console.log('==========================');
    
    if (!this.testLeadId || !this.testLeadNumericId) {
      await this.logTest(
        'Lead Retrieval - Prerequisites',
        false,
        'No test lead available from creation test'
      );
      return;
    }

    try {
      // Test retrieval by numeric ID
      const leadById = await databaseService.getLeadById(this.testLeadNumericId);
      
      await this.logTest(
        'Lead Retrieval - By Numeric ID',
        leadById !== null && leadById.id === this.testLeadNumericId,
        `Retrieved ID: ${leadById?.id}, Expected: ${this.testLeadNumericId}`
      );
      
      // Test retrieval by lead ID
      const leadByLeadId = await databaseService.getLeadByLeadId(this.testLeadId);
      
      await this.logTest(
        'Lead Retrieval - By Lead ID',
        leadByLeadId !== null && leadByLeadId.leadId === this.testLeadId,
        `Retrieved Lead ID: ${leadByLeadId?.leadId}, Expected: ${this.testLeadId}`
      );
      
      // Test retrieval by email
      const leadByEmail = await databaseService.getLeadByEmail('database.test@example.com');
      
      await this.logTest(
        'Lead Retrieval - By Email',
        leadByEmail !== null && leadByEmail.email === 'database.test@example.com',
        `Retrieved Email: ${leadByEmail?.email}`
      );
      
      await this.logTest(
        'Lead Retrieval - Data Consistency',
        leadById?.id === leadByLeadId?.id && leadByLeadId?.id === leadByEmail?.id,
        `All methods return same lead: ${leadById?.id}`
      );
      
    } catch (error) {
      await this.logTest(
        'Lead Retrieval - Execution',
        false,
        error.message
      );
    }
  }

  async testLeadUpdates() {
    console.log('\n🔄 Testing Lead Updates');
    console.log('========================');
    
    if (!this.testLeadId) {
      await this.logTest(
        'Lead Updates - Prerequisites',
        false,
        'No test lead available'
      );
      return;
    }

    try {
      // Test status update
      const statusUpdate = await databaseService.updateLeadStatus({
        leadId: this.testLeadId,
        status: 'processing',
        assignedTo: 'Test User',
        notes: 'Updated by test script'
      });
      
      await this.logTest(
        'Lead Updates - Status Update',
        statusUpdate === true,
        `Update Success: ${statusUpdate}`
      );
      
      // Test 8n8 response update
      const n8nUpdate = await databaseService.updateN8nResponse({
        leadId: this.testLeadId,
        success: true,
        responseData: { messageId: 'test-message-123', status: 'success' },
        errorMessage: null
      });
      
      await this.logTest(
        'Lead Updates - 8n8 Response Update',
        n8nUpdate === true,
        `Update Success: ${n8nUpdate}`
      );
      
      // Verify updates
      const updatedLead = await databaseService.getLeadByLeadId(this.testLeadId);
      
      await this.logTest(
        'Lead Updates - Status Verification',
        updatedLead?.status === 'processing',
        `Status: ${updatedLead?.status}`
      );
      
      await this.logTest(
        'Lead Updates - 8n8 Success Verification',
        updatedLead?.n8nSuccess === true,
        `8n8 Success: ${updatedLead?.n8nSuccess}`
      );
      
      await this.logTest(
        'Lead Updates - Assigned To Verification',
        updatedLead?.assignedTo === 'Test User',
        `Assigned To: ${updatedLead?.assignedTo}`
      );
      
    } catch (error) {
      await this.logTest(
        'Lead Updates - Execution',
        false,
        error.message
      );
    }
  }

  async testStatistics() {
    console.log('\n📊 Testing Statistics');
    console.log('=====================');
    
    try {
      const stats = await databaseService.getLeadStatistics();
      
      await this.logTest(
        'Statistics - Retrieval Success',
        stats !== null && typeof stats.totalLeads === 'number',
        `Total Leads: ${stats?.totalLeads}`
      );
      
      await this.logTest(
        'Statistics - Total Leads Count',
        stats.totalLeads >= 1, // Should have at least our test lead
        `Total Leads: ${stats.totalLeads}`
      );
      
      await this.logTest(
        'Statistics - New Leads Count',
        typeof stats.newLeads === 'number',
        `New Leads: ${stats.newLeads}`
      );
      
      await this.logTest(
        'Statistics - 8n8 Success Rate',
        typeof stats.n8nSuccessRate === 'number',
        `8n8 Success Rate: ${stats.n8nSuccessRate}%`
      );
      
    } catch (error) {
      await this.logTest(
        'Statistics - Execution',
        false,
        error.message
      );
    }
  }

  async testErrorHandling() {
    console.log('\n⚠️  Testing Error Handling');
    console.log('==========================');
    
    try {
      // Test invalid ID retrieval
      const invalidLead = await databaseService.getLeadById(99999);
      
      await this.logTest(
        'Error Handling - Invalid ID Retrieval',
        invalidLead === null,
        `Result: ${invalidLead}`
      );
      
      // Test invalid email retrieval
      const invalidEmail = await databaseService.getLeadByEmail('nonexistent@example.com');
      
      await this.logTest(
        'Error Handling - Invalid Email Retrieval',
        invalidEmail === null,
        `Result: ${invalidEmail}`
      );
      
    } catch (error) {
      await this.logTest(
        'Error Handling - Exception Handling',
        false,
        error.message
      );
    }
  }

  async runAllTests() {
    console.log('🧪 Hermes Security Database Service Direct Testing');
    console.log('==================================================');
    console.log('Testing database service without web server');
    console.log('');

    await this.testDatabaseConnection();
    await this.testLeadCreation();
    await this.testLeadRetrieval();
    await this.testLeadUpdates();
    await this.testStatistics();
    await this.testErrorHandling();

    // Print summary
    console.log('\n📊 Test Results Summary');
    console.log('========================');
    console.log(`Total Tests: ${this.testResults.total}`);
    console.log(`Passed: ${this.testResults.passed} ✅`);
    console.log(`Failed: ${this.testResults.failed} ❌`);
    console.log(`Success Rate: ${((this.testResults.passed / this.testResults.total) * 100).toFixed(1)}%`);

    if (this.testResults.failed === 0) {
      console.log('\n🎉 All database tests passed! The database service is working perfectly.');
      console.log('\n✅ Database Integration Status:');
      console.log('   - Database connection: Working');
      console.log('   - Lead creation: Working');
      console.log('   - Lead retrieval: Working');
      console.log('   - Lead updates: Working');
      console.log('   - Statistics: Working');
      console.log('   - Error handling: Working');
    } else {
      console.log('\n⚠️  Some database tests failed. Please check the details above.');
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
  const tester = new DatabaseTester();
  const results = await tester.runAllTests();
  
  // Close database connection
  await databaseService.close();
  
  // Exit with appropriate code
  process.exit(results.failed > 0 ? 1 : 0);
}

main().catch(error => {
  console.error('❌ Database test suite failed:', error);
  process.exit(1);
});
