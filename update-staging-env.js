// Update Staging Environment with Real Connection Strings
import { writeFileSync } from 'fs';

function updateStagingEnv() {
  console.log('🔧 Updating Staging Environment Configuration');
  console.log('==============================================');
  
  const stagingEnv = `# Staging Environment
# Supabase Staging Database

# Connect to Supabase via connection pooling
DATABASE_URL=postgresql://postgres.zrbosyecsbgbooelgzsw:[YOUR-PASSWORD]@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true

# Direct connection to the database. Used for migrations
POSTGRES_URL=postgresql://postgres.zrbosyecsbgbooelgzsw:[YOUR-PASSWORD]@aws-1-eu-west-1.pooler.supabase.com:5432/postgres

# Application environment
NODE_ENV=staging
VERCEL_ENV=preview

# Next Steps:
# 1. Replace [YOUR-PASSWORD] with your actual staging database password
# 2. Run: npm run db:migrate:staging
# 3. Run: npm run db:health:staging
# 4. Deploy to Vercel staging: vercel --target staging
`;

  try {
    writeFileSync('.env.staging', stagingEnv);
    console.log('✅ Updated .env.staging with your connection strings');
    
    console.log('\n🔑 Next Step Required:');
    console.log('You need to replace [YOUR-PASSWORD] with your actual staging database password.');
    console.log('');
    console.log('📋 To find your password:');
    console.log('1. Go to your staging Supabase project dashboard');
    console.log('2. Go to Settings → Database');
    console.log('3. Look for the database password (or reset it if needed)');
    console.log('');
    console.log('📝 Then update .env.staging:');
    console.log('Replace [YOUR-PASSWORD] with your actual password');
    console.log('');
    console.log('🚀 After updating the password, run:');
    console.log('npm run db:migrate:staging');
    console.log('npm run db:health:staging');
    
  } catch (error) {
    console.log('❌ Error updating staging environment:', error.message);
  }
}

updateStagingEnv();
