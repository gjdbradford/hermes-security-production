// Verify Supabase Data and Connection
import { config } from 'dotenv';
import { Pool } from 'pg';

// Load environment variables
config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
  ssl: false,
});

async function verifySupabaseData() {
  console.log('🔍 Verifying Supabase Database Connection and Data');
  console.log('==================================================');
  
  try {
    const client = await pool.connect();
    
    // 1. Check connection details
    console.log('\n📡 Connection Information:');
    const connectionInfo = await client.query('SELECT version(), current_database(), current_user');
    console.log(`   Database Version: ${connectionInfo.rows[0].version}`);
    console.log(`   Database Name: ${connectionInfo.rows[0].current_database}`);
    console.log(`   Connected As: ${connectionInfo.rows[0].current_user}`);
    
    // 2. Check if hermes_leads table exists
    console.log('\n📋 Table Verification:');
    const tableCheck = await client.query(`
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'hermes_leads' 
      ORDER BY ordinal_position
    `);
    
    if (tableCheck.rows.length > 0) {
      console.log(`   ✅ hermes_leads table exists with ${tableCheck.rows.length} columns`);
      console.log(`   📊 Key columns: ${tableCheck.rows.slice(0, 10).map(r => r.column_name).join(', ')}`);
    } else {
      console.log('   ❌ hermes_leads table does not exist');
      return;
    }
    
    // 3. Check total records
    console.log('\n📊 Data Summary:');
    const totalCount = await client.query('SELECT COUNT(*) as count FROM hermes_leads');
    console.log(`   Total Leads: ${totalCount.rows[0].count}`);
    
    // 4. Show recent records
    const recentRecords = await client.query(`
      SELECT 
        id, 
        lead_id, 
        first_name, 
        last_name, 
        email, 
        created_at,
        n8n_success,
        status
      FROM hermes_leads 
      ORDER BY created_at DESC 
      LIMIT 5
    `);
    
    console.log('\n📝 Recent Records:');
    if (recentRecords.rows.length > 0) {
      recentRecords.rows.forEach((record, index) => {
        console.log(`   ${index + 1}. ID: ${record.id} | Lead ID: ${record.lead_id}`);
        console.log(`      Name: ${record.first_name} ${record.last_name}`);
        console.log(`      Email: ${record.email}`);
        console.log(`      Created: ${record.created_at}`);
        console.log(`      8n8 Success: ${record.n8n_success} | Status: ${record.status}`);
        console.log('');
      });
    } else {
      console.log('   No records found');
    }
    
    // 5. Check 8n8 integration status
    const n8nStats = await client.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE n8n_success = true) as successful,
        COUNT(*) FILTER (WHERE n8n_success = false) as failed,
        COUNT(*) FILTER (WHERE n8n_success IS NULL) as pending
      FROM hermes_leads
    `);
    
    const stats = n8nStats.rows[0];
    console.log('🔄 8n8 Integration Status:');
    console.log(`   Total Leads: ${stats.total}`);
    console.log(`   Successful: ${stats.successful}`);
    console.log(`   Failed: ${stats.failed}`);
    console.log(`   Pending: ${stats.pending}`);
    
    // 6. Check database size and performance
    const dbSize = await client.query(`
      SELECT pg_size_pretty(pg_database_size(current_database())) as size
    `);
    console.log(`\n💾 Database Size: ${dbSize.rows[0].size}`);
    
    // 7. Connection string verification
    console.log('\n🔗 Connection String Info:');
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
    
    console.log('\n✅ Database verification complete!');
    console.log('\n📋 Next Steps:');
    console.log('1. Check Supabase Dashboard → Table Editor → hermes_leads');
    console.log('2. Verify you\'re in the correct Supabase project');
    console.log('3. If data is missing, check connection string');
    console.log('4. Consider setting up staging/production separation');
    
  } catch (error) {
    console.error('❌ Database verification failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check your DATABASE_URL in .env file');
    console.log('2. Verify Supabase project is active');
    console.log('3. Check network connectivity');
    console.log('4. Verify database credentials');
  } finally {
    await pool.end();
  }
}

verifySupabaseData();
