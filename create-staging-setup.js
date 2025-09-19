// Create Staging Environment Setup Guide
import { writeFileSync } from 'fs';

function createStagingSetup() {
  console.log('🏗️ Creating Staging Environment Setup');
  console.log('=====================================');
  
  const stagingGuide = `# 🚀 Staging Environment Setup Guide

## 📋 Step 1: Create Staging Supabase Project

### 1. Go to Supabase Dashboard
- Visit: https://supabase.com/dashboard
- Click "New Project"

### 2. Project Configuration
- **Name**: \`hermes-security-staging\`
- **Organization**: Your organization
- **Database Password**: Generate a strong password (save it!)
- **Region**: Choose closest to your users
- **Pricing Plan**: Free tier is fine for staging

### 3. Wait for Setup
- Project creation takes 2-3 minutes
- You'll get a connection string when ready

## 📋 Step 2: Get Connection String

### 1. In Your New Staging Project
- Go to **Settings** → **Database**
- Scroll down to **Connection String**
- Copy the **URI** connection string
- It will look like:
  \`postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres\`

### 2. Update Environment File
- Open \`.env.staging\` in your project
- Replace the placeholder URLs with your real staging connection string

## 📋 Step 3: Set Up Database Schema

### 1. Run Migrations on Staging
\`\`\`bash
# Set staging environment
export NODE_ENV=staging

# Run migrations
npm run db:migrate:staging

# Check health
npm run db:health:staging
\`\`\`

### 2. Verify Staging Database
- Go to Supabase Dashboard → Staging Project
- Check **Table Editor** → \`hermes_leads\` table exists
- Should be empty (no data yet)

## 📋 Step 4: Deploy to Vercel Staging

### 1. Set Environment Variables in Vercel
\`\`\`bash
# Add staging environment variables
vercel env add DATABASE_URL staging
vercel env add POSTGRES_URL staging
\`\`\`

### 2. Deploy to Staging
\`\`\`bash
# Deploy to staging/preview
vercel --target staging
\`\`\`

### 3. Test Staging Deployment
- Visit the staging URL provided by Vercel
- Test the contact form
- Check staging database for new leads

## 📋 Step 5: Production Deployment

### 1. When Staging is Working
- Deploy to production: \`vercel --prod\`
- Production will use your existing Supabase database (5 leads)

## 🎯 Environment Summary

| Environment | Database | Purpose | Data |
|-------------|----------|---------|------|
| **Development** | Local or Dev Supabase | Local development | Test data |
| **Staging** | New Supabase Project | Pre-production testing | Test data |
| **Production** | Current Supabase | Live site | Real customer data |

## 🔍 Verification Checklist

- [ ] Staging Supabase project created
- [ ] Connection string added to \`.env.staging\`
- [ ] Database migrations run on staging
- [ ] Vercel staging environment variables set
- [ ] Staging deployment successful
- [ ] Contact form works on staging
- [ ] Leads appear in staging database
- [ ] Production deployment ready

## 🚨 Important Notes

1. **Keep Passwords Secure**: Don't commit database passwords to git
2. **Test Thoroughly**: Make sure staging works before production
3. **Monitor Both**: Keep an eye on both staging and production databases
4. **Backup Strategy**: Staging can be reset, production needs backups

## 📞 Next Steps

1. Create the staging Supabase project
2. Update \`.env.staging\` with connection string
3. Run staging migrations
4. Test staging deployment
5. Deploy to production when ready

Ready to start? Let's create that staging project! 🚀
`;

  try {
    writeFileSync('STAGING_SETUP_GUIDE.md', stagingGuide);
    console.log('✅ Created STAGING_SETUP_GUIDE.md');
    
    // Also create a quick setup script
    const quickSetup = `#!/bin/bash
# Quick Staging Setup Script

echo "🏗️ Setting up Staging Environment"
echo "================================="

echo "📋 Step 1: Create Staging Supabase Project"
echo "   - Go to: https://supabase.com/dashboard"
echo "   - Click 'New Project'"
echo "   - Name: hermes-security-staging"
echo "   - Choose region and generate password"
echo ""

echo "📋 Step 2: Get Connection String"
echo "   - Go to Settings → Database"
echo "   - Copy the URI connection string"
echo "   - Update .env.staging file"
echo ""

echo "📋 Step 3: Run Migrations"
echo "   - npm run db:migrate:staging"
echo "   - npm run db:health:staging"
echo ""

echo "📋 Step 4: Deploy to Vercel"
echo "   - vercel env add DATABASE_URL staging"
echo "   - vercel env add POSTGRES_URL staging"
echo "   - vercel --target staging"
echo ""

echo "✅ Staging setup complete!"
echo "📖 See STAGING_SETUP_GUIDE.md for detailed instructions"
`;

    writeFileSync('setup-staging.sh', quickSetup);
    console.log('✅ Created setup-staging.sh');
    
    // Make it executable
    import('child_process').then(child_process => {
      child_process.exec('chmod +x setup-staging.sh');
    });
    
  } catch (error) {
    console.log('❌ Error creating setup files:', error.message);
    return;
  }
  
  console.log('\n📋 Next Steps:');
  console.log('1. 📖 Read STAGING_SETUP_GUIDE.md for detailed instructions');
  console.log('2. 🚀 Create staging Supabase project');
  console.log('3. 🔧 Update .env.staging with connection string');
  console.log('4. 🗄️ Run staging migrations');
  console.log('5. ☁️ Deploy to Vercel staging');
  
  console.log('\n🎯 Current Status:');
  console.log('   Development: ✅ Ready');
  console.log('   Staging: 🔄 Needs Supabase project');
  console.log('   Production: ✅ Ready (5 leads in current DB)');
  
  console.log('\n✅ Staging setup files created!');
}

createStagingSetup();
