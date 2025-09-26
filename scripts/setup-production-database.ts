#!/usr/bin/env tsx

import { config } from 'dotenv';
import { Pool } from 'pg';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables
config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

async function setupProductionDatabase() {
  console.log('🚀 Setting up Production Supabase Database');
  console.log('==========================================');

  try {
    const client = await pool.connect();

    // 1. Check connection
    console.log('\n📡 Testing database connection...');
    const connectionInfo = await client.query('SELECT version(), current_database(), current_user');
    console.log(`   ✅ Connected to: ${connectionInfo.rows[0].current_database}`);
    console.log(`   👤 User: ${connectionInfo.rows[0].current_user}`);

    // 2. Create enhanced leads table
    console.log('\n📋 Creating enhanced leads table...');
    const migrationSQL = readFileSync(
      join(__dirname, '../database/migrations/001_create_enhanced_leads_schema.sql'),
      'utf8'
    );
    await client.query(migrationSQL);
    console.log('   ✅ Enhanced leads table created');

    // 3. Set up Row Level Security
    console.log('\n🔒 Setting up Row Level Security...');
    await client.query(`
      -- Enable RLS on hermes_leads table
      ALTER TABLE hermes_leads ENABLE ROW LEVEL SECURITY;
    `);

    await client.query(`
      -- Create policy for service role
      CREATE POLICY "Service role can do everything" ON hermes_leads
      FOR ALL USING (auth.role() = 'service_role');
    `);

    await client.query(`
      -- Create policy for authenticated users
      CREATE POLICY "Authenticated users can read leads" ON hermes_leads
      FOR SELECT USING (auth.role() = 'authenticated');
    `);

    console.log('   ✅ RLS policies created');

    // 4. Create indexes for performance
    console.log('\n⚡ Creating performance indexes...');
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_hermes_leads_email ON hermes_leads(email)',
      'CREATE INDEX IF NOT EXISTS idx_hermes_leads_created_at ON hermes_leads(created_at)',
      'CREATE INDEX IF NOT EXISTS idx_hermes_leads_status ON hermes_leads(status)',
      'CREATE INDEX IF NOT EXISTS idx_hermes_leads_n8n_success ON hermes_leads(n8n_success)',
      'CREATE INDEX IF NOT EXISTS idx_hermes_leads_priority ON hermes_leads(priority)',
      'CREATE INDEX IF NOT EXISTS idx_hermes_leads_urgency ON hermes_leads(service_urgency)',
      'CREATE INDEX IF NOT EXISTS idx_hermes_leads_country ON hermes_leads(country)',
      'CREATE INDEX IF NOT EXISTS idx_hermes_leads_score ON hermes_leads(lead_score)',
      'CREATE INDEX IF NOT EXISTS idx_hermes_leads_company ON hermes_leads(company_name)',
    ];

    for (const indexSQL of indexes) {
      await client.query(indexSQL);
    }
    console.log('   ✅ Performance indexes created');

    // 5. Create helper functions
    console.log('\n🔧 Creating helper functions...');
    await client.query(`
      -- Create function to update lead status
      CREATE OR REPLACE FUNCTION update_lead_status(
          p_lead_id VARCHAR(50),
          p_status VARCHAR(50),
          p_assigned_to VARCHAR(100) DEFAULT NULL,
          p_notes TEXT DEFAULT NULL
      )
      RETURNS VOID AS $$
      BEGIN
          UPDATE hermes_leads 
          SET 
              status = p_status,
              assigned_to = COALESCE(p_assigned_to, assigned_to),
              notes = COALESCE(p_notes, notes),
              processed_at = CASE WHEN p_status != 'new' THEN CURRENT_TIMESTAMP ELSE processed_at END
          WHERE lead_id = p_lead_id;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await client.query(`
      -- Create function to get lead statistics
      CREATE OR REPLACE FUNCTION get_lead_statistics()
      RETURNS TABLE (
          total_leads BIGINT,
          new_leads BIGINT,
          high_priority_leads BIGINT,
          avg_lead_score DECIMAL(5,2),
          total_estimated_value DECIMAL(12,2),
          conversion_rate DECIMAL(5,2)
      ) AS $$
      BEGIN
          RETURN QUERY
          SELECT 
              COUNT(*) as total_leads,
              COUNT(*) FILTER (WHERE status = 'new') as new_leads,
              COUNT(*) FILTER (WHERE priority IN ('critical', 'high')) as high_priority_leads,
              AVG(lead_score) as avg_lead_score,
              SUM(estimated_value) as total_estimated_value,
              (COUNT(*) FILTER (WHERE status = 'converted')::DECIMAL / COUNT(*)::DECIMAL * 100) as conversion_rate
          FROM hermes_leads;
      END;
      $$ LANGUAGE plpgsql;
    `);

    console.log('   ✅ Helper functions created');

    // 6. Create views for reporting
    console.log('\n📊 Creating reporting views...');
    await client.query(`
      -- Create view for high-priority leads
      CREATE OR REPLACE VIEW high_priority_leads AS
      SELECT 
          id,
          lead_id,
          first_name,
          last_name,
          email,
          country,
          company_name,
          service_urgency,
          lead_score,
          priority,
          problem_description,
          created_at,
          status,
          n8n_success
      FROM hermes_leads 
      WHERE priority IN ('critical', 'high')
      AND status = 'new'
      ORDER BY lead_score DESC, created_at ASC;
    `);

    await client.query(`
      -- Create view for recent leads
      CREATE OR REPLACE VIEW recent_leads AS
      SELECT 
          id,
          lead_id,
          first_name,
          last_name,
          email,
          company_name,
          service_urgency,
          priority,
          created_at,
          status,
          n8n_success
      FROM hermes_leads 
      ORDER BY created_at DESC
      LIMIT 50;
    `);

    console.log('   ✅ Reporting views created');

    // 7. Test the setup
    console.log('\n🧪 Testing database setup...');
    const tableCheck = await client.query(`
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'hermes_leads' 
      ORDER BY ordinal_position
    `);

    console.log(`   ✅ Table has ${tableCheck.rows.length} columns`);

    // 8. Show connection info
    console.log('\n🔗 Connection Information:');
    const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (dbUrl) {
      const urlParts = dbUrl.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
      if (urlParts) {
        console.log(`   Host: ${urlParts[3]}`);
        console.log(`   Port: ${urlParts[4]}`);
        console.log(`   Database: ${urlParts[5]}`);
        console.log(`   User: ${urlParts[1]}`);
        console.log(`   Connection Type: ${dbUrl.includes('supabase') ? 'Supabase' : 'Other'}`);
      }
    }

    client.release();

    console.log('\n✅ Production database setup complete!');
    console.log('\n📋 Next Steps:');
    console.log('1. Update your 8n8 workflow with production Supabase credentials');
    console.log('2. Test the webhook connection');
    console.log('3. Deploy your application to production');
    console.log('4. Monitor the data flow in Supabase dashboard');
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check your DATABASE_URL environment variable');
    console.log('2. Verify Supabase project is active');
    console.log('3. Check network connectivity');
    console.log('4. Verify database credentials');
  } finally {
    await pool.end();
  }
}

// Run the setup
setupProductionDatabase();
