#!/usr/bin/env npx tsx

/**
 * Local Email Testing Script
 * Tests email functionality using the local Vercel API
 */

import { sendContactFormEmail } from '../src/services/emailService';

const testData = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  country: 'GB',
  mobileNumber: '+44 7700 900000',
  problemDescription: 'This is a test email from the local testing system. Please ignore this message.',
  companyName: 'Test Company Ltd',
  companySize: '51-200',
  serviceUrgency: 'Not urgent' as const,
  agreeToTerms: true,
  timestamp: new Date().toISOString(),
  userAgent: 'Hermes Security Local Test Suite',
  ipAddress: '127.0.0.1'
};

async function testLocalEmail() {
  console.log('🧪 Testing Local Email Functionality');
  console.log('====================================');
  console.log(`📧 Test Data: ${testData.firstName} ${testData.lastName}`);
  console.log(`🏢 Company: ${testData.companyName}`);
  console.log(`📅 Timestamp: ${testData.timestamp}`);
  
  try {
    console.log('\n📤 Sending test email...');
    const result = await sendContactFormEmail(testData);
    
    if (result) {
      console.log('✅ Email sent successfully!');
      console.log('📧 Check your inbox at: gjdbradford@gmail.com');
      console.log('📧 Check secondary inbox at: contact@hermessecurity.io');
    } else {
      console.log('❌ Email sending failed');
    }
  } catch (error) {
    console.log('❌ Error:', error instanceof Error ? error.message : 'Unknown error');
  }
}

// Run the test
testLocalEmail().catch(console.error);
