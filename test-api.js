// Test the backup API endpoint
import { config } from 'dotenv';
import fetch from 'node-fetch';

// Load environment variables
config();

async function testBackupAPI() {
  console.log('🧪 Testing Backup API Endpoint');
  console.log('==============================');
  
  const testData = {
    formData: {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      country: 'United Kingdom',
      phoneNumber: '+447700900000',
      userRole: 'CTO',
      problemDescription: 'Testing the backup API integration',
      companyName: 'Test Corp',
      companySize: '11-50',
      serviceUrgency: 'not-urgent',
      agreeToTerms: true,
      privacyConsent: true,
      marketingConsent: false,
      captchaToken: 'test-captcha-token'
    },
    metadata: {
      userAgent: 'Test Script',
      timestamp: new Date().toISOString()
    }
  };
  
  try {
    console.log('📤 Sending test data to backup API...');
    
    const response = await fetch('http://localhost:3000/api/backup-lead', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    console.log(`📡 Response Status: ${response.status}`);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ API Response:');
      console.log(`   Success: ${result.success}`);
      console.log(`   Lead ID: ${result.leadId}`);
      console.log(`   Backup ID: ${result.backupId}`);
      console.log(`   Database Backup: ${result.databaseBackup?.success ? '✅' : '❌'}`);
      console.log(`   8n8 Integration: ${result.n8nIntegration?.success ? '✅' : '❌'}`);
    } else {
      const error = await response.text();
      console.log('❌ API Error:', error);
    }
    
  } catch (error) {
    console.log('❌ Connection Error:', error.message);
    console.log('💡 Make sure to start the development server with: npm run dev');
  }
}

async function testHealthAPI() {
  console.log('\n🏥 Testing Health API Endpoint');
  console.log('===============================');
  
  try {
    const response = await fetch('http://localhost:3000/api/health/database');
    
    if (response.ok) {
      const health = await response.json();
      console.log('✅ Health Check Response:');
      console.log(`   Status: ${health.status}`);
      console.log(`   Database Connected: ${health.database.connected ? '✅' : '❌'}`);
      console.log(`   Response Time: ${health.database.responseTime}ms`);
      
      if (health.statistics) {
        console.log(`   Total Leads: ${health.statistics.totalLeads}`);
        console.log(`   New Leads: ${health.statistics.newLeads}`);
        console.log(`   8n8 Success Rate: ${health.statistics.n8nSuccessRate?.toFixed(1)}%`);
      }
    } else {
      console.log('❌ Health Check Failed:', response.status);
    }
    
  } catch (error) {
    console.log('❌ Health Check Error:', error.message);
    console.log('💡 Make sure to start the development server with: npm run dev');
  }
}

// Run tests
async function runTests() {
  await testBackupAPI();
  await testHealthAPI();
  
  console.log('\n🎉 API Testing Complete!');
  console.log('\nNext steps:');
  console.log('1. Start development server: npm run dev');
  console.log('2. Test the contact form on your website');
  console.log('3. Check the database for new leads');
  console.log('4. Deploy to Vercel: vercel --prod');
}

runTests();
