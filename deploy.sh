#!/bin/bash

# Hermes Security Deployment Script
# Usage: ./deploy.sh [staging|production]

set -e

ENVIRONMENT=${1:-staging}

echo "🚀 Deploying Hermes Security to $ENVIRONMENT..."

if [ "$ENVIRONMENT" = "production" ]; then
    echo "📦 Building for production..."
    npm run build:production
    
    echo "🌐 Deploying to production (hermessecurity.io)..."
    vercel link --project hermes-security-production --yes
    vercel --prod
    
    echo "✅ Production deployment complete!"
    echo "🔗 Production URL: https://hermessecurity.io"
    
elif [ "$ENVIRONMENT" = "staging" ]; then
    echo "📦 Building for staging..."
    npm run build:staging
    
    echo "🧪 Deploying to staging (staging.hermessecurity.io)..."
    vercel link --project hermes-security-staging --yes
    vercel --target staging
    
    echo "✅ Staging deployment complete!"
    echo "🔗 Staging URL: https://staging.hermessecurity.io"
    
else
    echo "❌ Invalid environment. Use 'staging' or 'production'"
    echo "Usage: ./deploy.sh [staging|production]"
    exit 1
fi

echo "🎉 Deployment successful!"
