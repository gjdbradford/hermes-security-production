// Simple database test
import { config } from 'dotenv';
import { Pool } from 'pg';

// Load environment variables
config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
  ssl: false,
});

async function testDatabase() {
  console.log('🧪 Simple Database Test');
  console.log('=======================');
  
  try {
    const client = await pool.connect();
    
    // Test basic connection
    console.log('✅ Database connected successfully');
    
    // Test query
    const result = await client.query('SELECT COUNT(*) as count FROM hermes_leads');
    console.log(`✅ Query successful - Total leads: ${result.rows[0].count}`);
    
    // Test insert
    const insertResult = await client.query(`
      INSERT INTO hermes_leads (
        lead_id, first_name, last_name, email, country, phone_number, 
        user_role, problem_description, company_name, company_size, service_urgency,
        agree_to_terms, privacy_consent, marketing_consent
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING id, lead_id, created_at
    `, [
      `TEST-${Date.now()}`,
      'Simple',
      'Test',
      'simple.test@example.com',
      'United Kingdom',
      '+447700900200',
      'CTO',
      'Simple database test',
      'Test Corp',
      '11-50',
      'not-urgent',
      true,
      true,
      false
    ]);
    
    console.log(`✅ Insert successful - ID: ${insertResult.rows[0].id}, Lead ID: ${insertResult.rows[0].leadId}`);
    
    // Test select
    const selectResult = await client.query('SELECT * FROM hermes_leads WHERE email = $1', ['simple.test@example.com']);
    console.log(`✅ Select successful - Found ${selectResult.rows.length} record(s)`);
    
    if (selectResult.rows.length > 0) {
      const lead = selectResult.rows[0];
      console.log(`   Lead ID: ${lead.lead_id}`);
      console.log(`   Name: ${lead.first_name} ${lead.last_name}`);
      console.log(`   Email: ${lead.email}`);
      console.log(`   Created: ${lead.created_at}`);
      console.log(`   8n8 Success: ${lead.n8n_success}`);
    }
    
    client.release();
    console.log('\n🎉 All database tests passed!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
  } finally {
    await pool.end();
  }
}

testDatabase();
