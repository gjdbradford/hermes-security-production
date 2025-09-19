#!/bin/bash
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
