// Simple script to create database tables
import { config } from 'dotenv';
import { Pool } from 'pg';

// Load environment variables
config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
  ssl: false,
});

async function setupTables() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Setting up database tables...');
    
    // Create the main leads table
    await client.query(`
      CREATE TABLE IF NOT EXISTS hermes_leads (
        id SERIAL PRIMARY KEY,
        lead_id VARCHAR(50) UNIQUE NOT NULL,
        brevo_contact_id VARCHAR(100),
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        country VARCHAR(100) NOT NULL,
        phone_number VARCHAR(50) NOT NULL,
        user_role VARCHAR(100),
        problem_description TEXT NOT NULL,
        company_name VARCHAR(255),
        company_size VARCHAR(50),
        service_urgency VARCHAR(50) NOT NULL DEFAULT 'not-urgent',
        agree_to_terms BOOLEAN NOT NULL DEFAULT FALSE,
        privacy_consent BOOLEAN NOT NULL DEFAULT FALSE,
        marketing_consent BOOLEAN DEFAULT FALSE,
        captcha_token VARCHAR(500),
        user_agent TEXT,
        ip_address INET,
        source VARCHAR(50) NOT NULL DEFAULT 'hermes-website',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        n8n_webhook_sent_at TIMESTAMP WITH TIME ZONE,
        n8n_response_received_at TIMESTAMP WITH TIME ZONE,
        n8n_response_data JSONB,
        n8n_success BOOLEAN DEFAULT FALSE,
        n8n_error_message TEXT,
        n8n_retry_count INTEGER DEFAULT 0,
        n8n_last_retry_at TIMESTAMP WITH TIME ZONE,
        status VARCHAR(50) DEFAULT 'new',
        processed_at TIMESTAMP WITH TIME ZONE,
        assigned_to VARCHAR(100),
        notes TEXT,
        lead_score INTEGER DEFAULT 0,
        priority VARCHAR(20) DEFAULT 'low',
        tags TEXT[],
        ai_analysis JSONB,
        estimated_value DECIMAL(10,2),
        recommended_response_time VARCHAR(50)
      )
    `);
    console.log('✅ Created hermes_leads table');
    
    // Create indexes
    await client.query('CREATE INDEX IF NOT EXISTS idx_hermes_leads_lead_id ON hermes_leads(lead_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_hermes_leads_email ON hermes_leads(email)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_hermes_leads_created_at ON hermes_leads(created_at)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_hermes_leads_status ON hermes_leads(status)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_hermes_leads_n8n_success ON hermes_leads(n8n_success)');
    console.log('✅ Created indexes');
    
    // Create audit log table
    await client.query(`
      CREATE TABLE IF NOT EXISTS audit_log (
        id SERIAL PRIMARY KEY,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        user_name TEXT,
        database_name TEXT,
        command_tag TEXT,
        query TEXT,
        ip_address INET,
        application_name TEXT,
        session_id TEXT
      )
    `);
    console.log('✅ Created audit_log table');
    
    // Create migration tracking table
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        migration_name VARCHAR(255) UNIQUE NOT NULL,
        checksum VARCHAR(64) NOT NULL,
        applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created schema_migrations table');
    
    // Insert sample data
    await client.query(`
      INSERT INTO hermes_leads (
        lead_id, first_name, last_name, email, country, phone_number, 
        user_role, problem_description, company_name, company_size, service_urgency,
        agree_to_terms, privacy_consent, marketing_consent, lead_score, priority, 
        tags, source, n8n_success
      ) VALUES 
      (
        'HERMES-TEST-001',
        'John',
        'Doe',
        'john.doe@example.com',
        'United Kingdom',
        '+447700900000',
        'CTO',
        'We need a comprehensive security audit for our e-commerce platform.',
        'TechCorp Ltd',
        '51-200',
        'urgent',
        TRUE,
        TRUE,
        FALSE,
        45,
        'high',
        ARRAY['urgent', 'medium-business', 'security-audit'],
        'hermes-website',
        TRUE
      ) ON CONFLICT (lead_id) DO NOTHING
    `);
    console.log('✅ Inserted sample data');
    
    console.log('🎉 Database setup complete!');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

setupTables();
