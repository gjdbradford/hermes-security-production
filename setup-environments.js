// Setup Staging and Production Environments
import { config } from 'dotenv';
import { writeFileSync, existsSync } from 'fs';

// Load environment variables
config();

function setupEnvironments() {
  console.log('🏗️ Setting Up Staging and Production Environments');
  console.log('==================================================');
  
  // Current production connection (your current Supabase)
  const currentProdUrl = process.env.DATABASE_URL;
  
  if (!currentProdUrl) {
    console.log('❌ No DATABASE_URL found in .env file');
    return;
  }
  
  console.log('\n📋 Current Setup:');
  console.log(`   Production DB: ${currentProdUrl.substring(0, 50)}...`);
  
  // Create environment files
  console.log('\n🔧 Creating Environment Files:');
  
  // 1. Development environment (local)
  const devEnv = `# Development Environment
# Local PostgreSQL or Supabase Dev Database

DATABASE_URL=postgresql://postgres:password@localhost:5432/hermes_dev
POSTGRES_URL=postgresql://postgres:password@localhost:5432/hermes_dev

# Application environment
NODE_ENV=development
VERCEL_ENV=development

# Optional: Use a separate Supabase project for development
# DATABASE_URL=postgresql://postgres.dev-project:password@db.supabase.com:5432/postgres
# POSTGRES_URL=postgresql://postgres.dev-project:password@db.supabase.com:5432/postgres
`;

  // 2. Staging environment
  const stagingEnv = `# Staging Environment
# Create a separate Supabase project for staging

# TODO: Replace with your staging database connection string
DATABASE_URL=postgresql://postgres.staging-project:password@db.supabase.com:5432/postgres
POSTGRES_URL=postgresql://postgres.staging-project:password@db.supabase.com:5432/postgres

# Application environment
NODE_ENV=staging
VERCEL_ENV=preview

# Instructions:
# 1. Create new Supabase project: "hermes-security-staging"
# 2. Get connection string from Supabase dashboard
# 3. Replace the DATABASE_URL and POSTGRES_URL above
# 4. Run: npm run db:migrate:staging
`;

  // 3. Production environment (current)
  const prodEnv = `# Production Environment
# Your current Supabase database

DATABASE_URL=${currentProdUrl}
POSTGRES_URL=${process.env.POSTGRES_URL || currentProdUrl}

# Application environment
NODE_ENV=production
VERCEL_ENV=production

# This is your current working database
# Contains: 5 test leads + any production data
`;

  // Write environment files
  try {
    writeFileSync('.env.development', devEnv);
    console.log('   ✅ Created .env.development');
    
    writeFileSync('.env.staging', stagingEnv);
    console.log('   ✅ Created .env.staging');
    
    writeFileSync('.env.production', prodEnv);
    console.log('   ✅ Created .env.production');
    
  } catch (error) {
    console.log('   ❌ Error creating environment files:', error.message);
    return;
  }
  
  // Create migration scripts
  console.log('\n🚀 Creating Migration Scripts:');
  
  const packageJsonScripts = `
  "scripts": {
    "dev": "vite",
    "dev:staging": "vite --mode staging",
    "dev:production": "vite --mode production",
    "build": "vite build",
    "build:staging": "VITE_DEPLOY_ENV=staging vite build",
    "build:production": "VITE_DEPLOY_ENV=production vite build",
    "db:migrate": "npx tsx scripts/migrate-database.ts up",
    "db:migrate:dev": "NODE_ENV=development npx tsx scripts/migrate-database.ts up",
    "db:migrate:staging": "NODE_ENV=staging npx tsx scripts/migrate-database.ts up",
    "db:migrate:production": "NODE_ENV=production npx tsx scripts/migrate-database.ts up",
    "db:health": "npx tsx scripts/database-health-check.ts",
    "db:health:dev": "NODE_ENV=development npx tsx scripts/database-health-check.ts",
    "db:health:staging": "NODE_ENV=staging npx tsx scripts/database-health-check.ts",
    "db:health:production": "NODE_ENV=production npx tsx scripts/database-health-check.ts"
  }`;

  console.log('   📝 Add these scripts to your package.json:');
  console.log(packageJsonScripts);
  
  // Vercel configuration
  console.log('\n☁️ Vercel Configuration:');
  
  const vercelConfig = `# Vercel Environment Variables Setup

## Staging Environment (Preview Deployments)
vercel env add DATABASE_URL staging
vercel env add POSTGRES_URL staging

## Production Environment
vercel env add DATABASE_URL production  
vercel env add POSTGRES_URL production

## Commands:
# Deploy to staging
vercel --target staging

# Deploy to production
vercel --prod
`;

  try {
    writeFileSync('vercel-env-setup.md', vercelConfig);
    console.log('   ✅ Created vercel-env-setup.md');
  } catch (error) {
    console.log('   ❌ Error creating Vercel config:', error.message);
  }
  
  console.log('\n📋 Next Steps:');
  console.log('1. Create staging Supabase project');
  console.log('2. Update .env.staging with staging connection string');
  console.log('3. Run: npm run db:migrate:staging');
  console.log('4. Test staging deployment');
  console.log('5. Deploy to production when ready');
  
  console.log('\n🎯 Environment Strategy:');
  console.log('   Development → Local DB or Dev Supabase project');
  console.log('   Staging → Separate Supabase staging project');
  console.log('   Production → Current Supabase project (5 leads)');
  
  console.log('\n✅ Environment setup complete!');
}

setupEnvironments();
