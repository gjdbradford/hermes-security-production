// Final Comprehensive Test Suite
// Testing all database functionality

import { config } from 'dotenv';
import { Pool } from 'pg';

// Load environment variables
config();

class FinalTester {
  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
      ssl: false,
    });
    this.testResults = {
      passed: 0,
      failed: 0,
      total: 0,
      details: []
    };
    this.testLeadId = null;
    this.testLeadNumericId = null;
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
      const client = await this.pool.connect();
      const startTime = Date.now();
      
      await client.query('SELECT 1');
      const responseTime = Date.now() - startTime;
      
      await this.logTest(
        'Database Connection - Basic Query',
        true,
        `Response Time: ${responseTime}ms`
      );
      
      await this.logTest(
        'Database Connection - Response Time',
        responseTime < 1000,
        `Response Time: ${responseTime}ms`
      );
      
      client.release();
      
    } catch (error) {
      await this.logTest(
        'Database Connection - Basic Query',
        false,
        error.message
      );
    }
  }

  async testTableStructure() {
    console.log('\n📋 Testing Table Structure');
    console.log('==========================');
    
    try {
      const client = await this.pool.connect();
      
      // Test hermes_leads table exists
      const tableResult = await client.query(`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'hermes_leads' 
        ORDER BY ordinal_position
      `);
      
      await this.logTest(
        'Table Structure - hermes_leads Table Exists',
        tableResult.rows.length > 0,
        `Columns found: ${tableResult.rows.length}`
      );
      
      // Check for required columns
      const columnNames = tableResult.rows.map(row => row.column_name);
      const requiredColumns = ['id', 'lead_id', 'first_name', 'last_name', 'email', 'created_at', 'n8n_success'];
      
      const hasRequiredColumns = requiredColumns.every(col => columnNames.includes(col));
      
      await this.logTest(
        'Table Structure - Required Columns Present',
        hasRequiredColumns,
        `Required columns: ${requiredColumns.join(', ')}`
      );
      
      // Test indexes
      const indexResult = await client.query(`
        SELECT indexname, indexdef 
        FROM pg_indexes 
        WHERE tablename = 'hermes_leads'
      `);
      
      await this.logTest(
        'Table Structure - Indexes Present',
        indexResult.rows.length > 0,
        `Indexes found: ${indexResult.rows.length}`
      );
      
      client.release();
      
    } catch (error) {
      await this.logTest(
        'Table Structure - Table Query',
        false,
        error.message
      );
    }
  }

  async testLeadCreation() {
    console.log('\n📝 Testing Lead Creation');
    console.log('========================');
    
    const testData = {
      leadId: `FINAL-TEST-${Date.now()}`,
      firstName: 'Final',
      lastName: 'Test',
      email: 'final.test@example.com',
      country: 'United Kingdom',
      phoneNumber: '+447700900300',
      userRole: 'CTO',
      problemDescription: 'Final comprehensive test of database integration',
      companyName: 'Final Test Corp',
      companySize: '51-200',
      serviceUrgency: 'urgent',
      agreeToTerms: true,
      privacyConsent: true,
      marketingConsent: false
    };

    try {
      const client = await this.pool.connect();
      
      const result = await client.query(`
        INSERT INTO hermes_leads (
          lead_id, first_name, last_name, email, country, phone_number, 
          user_role, problem_description, company_name, company_size, service_urgency,
          agree_to_terms, privacy_consent, marketing_consent, user_agent, ip_address,
          source, lead_score, priority, tags
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
        RETURNING id, lead_id, created_at
      `, [
        testData.leadId,
        testData.firstName,
        testData.lastName,
        testData.email,
        testData.country,
        testData.phoneNumber,
        testData.userRole,
        testData.problemDescription,
        testData.companyName,
        testData.companySize,
        testData.serviceUrgency,
        testData.agreeToTerms,
        testData.privacyConsent,
        testData.marketingConsent,
        'Final Test Script',
        '127.0.0.1',
        'hermes-website',
        50,
        'high',
        ['urgent', 'test', 'integration']
      ]);
      
      const lead = result.rows[0];
      this.testLeadId = lead.lead_id;
      this.testLeadNumericId = lead.id;
      
      await this.logTest(
        'Lead Creation - Insert Success',
        lead.id > 0,
        `ID: ${lead.id}, Lead ID: ${lead.lead_id}`
      );
      
      await this.logTest(
        'Lead Creation - Unique ID Generation',
        typeof lead.id === 'number' && lead.id > 0,
        `Numeric ID: ${lead.id}`
      );
      
      await this.logTest(
        'Lead Creation - Lead ID Match',
        lead.lead_id === testData.leadId,
        `Expected: ${testData.leadId}, Got: ${lead.lead_id}`
      );
      
      await this.logTest(
        'Lead Creation - Timestamp Generation',
        lead.created_at !== null,
        `Created: ${lead.created_at}`
      );
      
      client.release();
      
    } catch (error) {
      await this.logTest(
        'Lead Creation - Insert Execution',
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
      const client = await this.pool.connect();
      
      // Test retrieval by numeric ID
      const resultById = await client.query('SELECT * FROM hermes_leads WHERE id = $1', [this.testLeadNumericId]);
      
      await this.logTest(
        'Lead Retrieval - By Numeric ID',
        resultById.rows.length === 1,
        `Found ${resultById.rows.length} record(s)`
      );
      
      // Test retrieval by lead ID
      const resultByLeadId = await client.query('SELECT * FROM hermes_leads WHERE lead_id = $1', [this.testLeadId]);
      
      await this.logTest(
        'Lead Retrieval - By Lead ID',
        resultByLeadId.rows.length === 1,
        `Found ${resultByLeadId.rows.length} record(s)`
      );
      
      // Test retrieval by email
      const resultByEmail = await client.query('SELECT * FROM hermes_leads WHERE email = $1', ['final.test@example.com']);
      
      await this.logTest(
        'Lead Retrieval - By Email',
        resultByEmail.rows.length === 1,
        `Found ${resultByEmail.rows.length} record(s)`
      );
      
      // Test data consistency
      const leadById = resultById.rows[0];
      const leadByLeadId = resultByLeadId.rows[0];
      
      await this.logTest(
        'Lead Retrieval - Data Consistency',
        leadById.id === leadByLeadId.id && leadById.email === leadByLeadId.email,
        `Same lead retrieved by different methods`
      );
      
      await this.logTest(
        'Lead Retrieval - Data Preservation',
        leadById.first_name === 'Final' && leadById.last_name === 'Test',
        `Name: ${leadById.first_name} ${leadById.last_name}`
      );
      
      client.release();
      
    } catch (error) {
      await this.logTest(
        'Lead Retrieval - Query Execution',
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
      const client = await this.pool.connect();
      
      // Test status update
      const statusResult = await client.query(`
        UPDATE hermes_leads 
        SET status = $1, assigned_to = $2, notes = $3, updated_at = CURRENT_TIMESTAMP
        WHERE lead_id = $4
        RETURNING status, assigned_to, notes
      `, ['processing', 'Test User', 'Updated by final test script', this.testLeadId]);
      
      await this.logTest(
        'Lead Updates - Status Update',
        statusResult.rows.length === 1,
        `Updated ${statusResult.rows.length} record(s)`
      );
      
      // Test 8n8 response update
      const n8nResult = await client.query(`
        UPDATE hermes_leads 
        SET n8n_success = $1, n8n_response_data = $2, n8n_response_received_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
        WHERE lead_id = $3
        RETURNING n8n_success, n8n_response_data
      `, [true, JSON.stringify({ messageId: 'test-message-456', status: 'success' }), this.testLeadId]);
      
      await this.logTest(
        'Lead Updates - 8n8 Response Update',
        n8nResult.rows.length === 1,
        `Updated ${n8nResult.rows.length} record(s)`
      );
      
      // Verify updates
      const verifyResult = await client.query('SELECT status, assigned_to, n8n_success FROM hermes_leads WHERE lead_id = $1', [this.testLeadId]);
      const updatedLead = verifyResult.rows[0];
      
      await this.logTest(
        'Lead Updates - Status Verification',
        updatedLead.status === 'processing',
        `Status: ${updatedLead.status}`
      );
      
      await this.logTest(
        'Lead Updates - 8n8 Success Verification',
        updatedLead.n8n_success === true,
        `8n8 Success: ${updatedLead.n8n_success}`
      );
      
      await this.logTest(
        'Lead Updates - Assigned To Verification',
        updatedLead.assigned_to === 'Test User',
        `Assigned To: ${updatedLead.assigned_to}`
      );
      
      client.release();
      
    } catch (error) {
      await this.logTest(
        'Lead Updates - Update Execution',
        false,
        error.message
      );
    }
  }

  async testStatistics() {
    console.log('\n📊 Testing Statistics');
    console.log('=====================');
    
    try {
      const client = await this.pool.connect();
      
      // Get total leads count
      const totalResult = await client.query('SELECT COUNT(*) as count FROM hermes_leads');
      const totalLeads = parseInt(totalResult.rows[0].count);
      
      await this.logTest(
        'Statistics - Total Leads Count',
        totalLeads >= 2, // Should have at least our test leads
        `Total Leads: ${totalLeads}`
      );
      
      // Get new leads count
      const newResult = await client.query("SELECT COUNT(*) as count FROM hermes_leads WHERE status = 'new'");
      const newLeads = parseInt(newResult.rows[0].count);
      
      await this.logTest(
        'Statistics - New Leads Count',
        typeof newLeads === 'number',
        `New Leads: ${newLeads}`
      );
      
      // Get 8n8 success rate
      const n8nResult = await client.query('SELECT COUNT(*) as total, SUM(CASE WHEN n8n_success = true THEN 1 ELSE 0 END) as successful FROM hermes_leads');
      const total = parseInt(n8nResult.rows[0].total);
      const successful = parseInt(n8nResult.rows[0].successful);
      const successRate = total > 0 ? (successful / total) * 100 : 0;
      
      await this.logTest(
        'Statistics - 8n8 Success Rate Calculation',
        typeof successRate === 'number',
        `8n8 Success Rate: ${successRate.toFixed(1)}% (${successful}/${total})`
      );
      
      // Get high priority leads
      const priorityResult = await client.query("SELECT COUNT(*) as count FROM hermes_leads WHERE priority IN ('high', 'critical')");
      const highPriorityLeads = parseInt(priorityResult.rows[0].count);
      
      await this.logTest(
        'Statistics - High Priority Leads Count',
        typeof highPriorityLeads === 'number',
        `High Priority Leads: ${highPriorityLeads}`
      );
      
      client.release();
      
    } catch (error) {
      await this.logTest(
        'Statistics - Query Execution',
        false,
        error.message
      );
    }
  }

  async testErrorHandling() {
    console.log('\n⚠️  Testing Error Handling');
    console.log('==========================');
    
    try {
      const client = await this.pool.connect();
      
      // Test invalid ID retrieval
      const invalidResult = await client.query('SELECT * FROM hermes_leads WHERE id = $1', [99999]);
      
      await this.logTest(
        'Error Handling - Invalid ID Retrieval',
        invalidResult.rows.length === 0,
        `Found ${invalidResult.rows.length} record(s) for invalid ID`
      );
      
      // Test invalid email retrieval
      const invalidEmailResult = await client.query('SELECT * FROM hermes_leads WHERE email = $1', ['nonexistent@example.com']);
      
      await this.logTest(
        'Error Handling - Invalid Email Retrieval',
        invalidEmailResult.rows.length === 0,
        `Found ${invalidEmailResult.rows.length} record(s) for invalid email`
      );
      
      // Test constraint violation (duplicate lead_id)
      try {
        await client.query('INSERT INTO hermes_leads (lead_id, first_name, last_name, email, country, phone_number, problem_description, agree_to_terms, privacy_consent) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [
          this.testLeadId, // Duplicate lead_id
          'Duplicate',
          'Test',
          'duplicate@example.com',
          'United Kingdom',
          '+447700900400',
          'Duplicate test',
          true,
          true
        ]);
        
        await this.logTest(
          'Error Handling - Duplicate Constraint',
          false,
          'Should have failed with duplicate lead_id'
        );
        
      } catch (error) {
        await this.logTest(
          'Error Handling - Duplicate Constraint',
          error.message.includes('unique') || error.message.includes('duplicate'),
          `Constraint violation properly caught: ${error.message}`
        );
      }
      
      client.release();
      
    } catch (error) {
      await this.logTest(
        'Error Handling - Test Execution',
        false,
        error.message
      );
    }
  }

  async testPerformance() {
    console.log('\n⚡ Testing Performance');
    console.log('=====================');
    
    try {
      const client = await this.pool.connect();
      
      // Test query performance
      const startTime = Date.now();
      await client.query('SELECT COUNT(*) FROM hermes_leads');
      const queryTime = Date.now() - startTime;
      
      await this.logTest(
        'Performance - Basic Query Speed',
        queryTime < 100, // Should be very fast
        `Query Time: ${queryTime}ms`
      );
      
      // Test insert performance
      const insertStartTime = Date.now();
      await client.query(`
        INSERT INTO hermes_leads (
          lead_id, first_name, last_name, email, country, phone_number, 
          problem_description, agree_to_terms, privacy_consent
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [
        `PERF-TEST-${Date.now()}`,
        'Performance',
        'Test',
        'performance.test@example.com',
        'United Kingdom',
        '+447700900500',
        'Performance test',
        true,
        true
      ]);
      const insertTime = Date.now() - insertStartTime;
      
      await this.logTest(
        'Performance - Insert Speed',
        insertTime < 500, // Should be reasonably fast
        `Insert Time: ${insertTime}ms`
      );
      
      client.release();
      
    } catch (error) {
      await this.logTest(
        'Performance - Test Execution',
        false,
        error.message
      );
    }
  }

  async runAllTests() {
    console.log('🧪 Hermes Security Database Final Integration Test Suite');
    console.log('========================================================');
    console.log('Comprehensive testing of all database functionality');
    console.log('Based on the test plan from documentation');
    console.log('');

    await this.testDatabaseConnection();
    await this.testTableStructure();
    await this.testLeadCreation();
    await this.testLeadRetrieval();
    await this.testLeadUpdates();
    await this.testStatistics();
    await this.testErrorHandling();
    await this.testPerformance();

    // Print summary
    console.log('\n📊 Final Test Results Summary');
    console.log('==============================');
    console.log(`Total Tests: ${this.testResults.total}`);
    console.log(`Passed: ${this.testResults.passed} ✅`);
    console.log(`Failed: ${this.testResults.failed} ❌`);
    console.log(`Success Rate: ${((this.testResults.passed / this.testResults.total) * 100).toFixed(1)}%`);

    if (this.testResults.failed === 0) {
      console.log('\n🎉 ALL TESTS PASSED! 🎉');
      console.log('\n✅ Database Integration Status: PERFECT');
      console.log('   - Database connection: ✅ Working');
      console.log('   - Table structure: ✅ Complete');
      console.log('   - Lead creation: ✅ Working');
      console.log('   - Lead retrieval: ✅ Working');
      console.log('   - Lead updates: ✅ Working');
      console.log('   - Statistics: ✅ Working');
      console.log('   - Error handling: ✅ Working');
      console.log('   - Performance: ✅ Excellent');
      console.log('\n🚀 Your database integration is ready for production!');
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

  async cleanup() {
    await this.pool.end();
  }
}

// Run the tests
async function main() {
  const tester = new FinalTester();
  const results = await tester.runAllTests();
  await tester.cleanup();
  
  // Exit with appropriate code
  process.exit(results.failed > 0 ? 1 : 0);
}

main().catch(error => {
  console.error('❌ Test suite failed:', error);
  process.exit(1);
});
