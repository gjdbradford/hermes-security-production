#!/usr/bin/env tsx
// Simple Local API Server for Database Integration

import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { Pool } from 'pg';

// Load environment variables
config();

const app = express();
const PORT = 3002;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
  ssl: false,
});

// Enable CORS for all routes
app.use(
  cors({
    origin: ['http://localhost:8080', 'http://localhost:8081', 'http://localhost:8082', 'http://localhost:8083', 'http://localhost:8084', 'http://localhost:8085'],
    credentials: true,
  })
);

// Parse JSON bodies
app.use(express.json());

// Generate unique lead ID
function generateLeadId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `HERMES-${timestamp}-${random}`.toUpperCase();
}

// Backup lead endpoint
app.post('/api/backup-lead', async (req, res) => {
  console.log('🚀 Processing lead backup request...');
  console.log('📊 Request data:', JSON.stringify(req.body, null, 2));

  try {
    const { formData } = req.body;

    if (!formData) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: formData',
        message: 'Form data is required'
      });
    }

    // Generate unique lead ID
    const leadId = generateLeadId();
    
    console.log(`💾 Saving lead ${leadId} to database...`);

    // Save to database
    const client = await pool.connect();
    try {
      const insertResult = await client.query(`
        INSERT INTO hermes_leads (
          lead_id, first_name, last_name, email, country, phone_number,
          problem_description, company_name, service_urgency, 
          agree_to_terms, privacy_consent, source, status, 
          lead_score, priority, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        RETURNING id
      `, [
        leadId,
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.country,
        formData.phoneNumber,
        formData.problemDescription,
        formData.companyName || null,
        formData.serviceUrgency,
        formData.agreeToTerms,
        formData.privacyConsent,
        'local-development',
        'new',
        75, // Default lead score
        'high', // Default priority
        new Date()
      ]);

      console.log(`✅ Lead ${leadId} saved with database ID: ${insertResult.rows[0].id}`);

      // Return success response
      const response = {
        success: true,
        leadId,
        backupId: insertResult.rows[0].id,
        timestamp: new Date().toISOString(),
        nextSteps: [
          "Lead successfully saved to staging database",
          "You can view this lead in your Supabase dashboard",
          `Lead ID: ${leadId} (save this for reference)`,
          "Database integration is working correctly"
        ]
      };

      console.log('📤 Returning response:', response);
      return res.status(200).json(response);

    } finally {
      client.release();
    }

  } catch (error) {
    console.error('❌ Database error:', error);
    return res.status(500).json({
      success: false,
      error: 'Database error',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

// Health check endpoint
app.get('/api/health/database', async (req, res) => {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT NOW() as current_time, COUNT(*) as lead_count FROM hermes_leads');
      
      return res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: {
          connected: true,
          currentTime: result.rows[0].current_time,
          totalLeads: parseInt(result.rows[0].lead_count)
        }
      });
    } finally {
      client.release();
    }
  } catch (error) {
    return res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// General health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Local API server is running',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Local API Server running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`💾 Database health: http://localhost:${PORT}/api/health/database`);
  console.log(`📝 Backup endpoint: http://localhost:${PORT}/api/backup-lead`);
  console.log('');
  console.log('✅ Your contact form will now save leads directly to the staging database!');
  console.log('🌍 Environment: Local Development → Staging Database');
  console.log('');
  console.log('To test:');
  console.log('1. Open http://localhost:8085 in your browser');
  console.log('2. Submit the contact form');
  console.log('3. Check your Supabase dashboard for the new lead');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down local API server...');
  await pool.end();
  process.exit(0);
});
