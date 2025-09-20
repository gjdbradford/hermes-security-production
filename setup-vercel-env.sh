#!/bin/bash

# Script to add required environment variables to Vercel
echo "🔧 Setting up Vercel environment variables for API functions..."

# Add SMTP configuration for email functionality
echo "📧 Adding SMTP configuration..."
npx vercel env add SMTP_HOST preview <<< "smtp.gmail.com"
npx vercel env add SMTP_PORT preview <<< "587"
npx vercel env add SMTP_SECURE preview <<< "false"
npx vercel env add SMTP_USER preview <<< "your-email@gmail.com"
npx vercel env add SMTP_PASS preview <<< "your-app-password"
npx vercel env add EMAIL_FROM preview <<< "noreply@hermessecurity.io"

# Add the same for production
npx vercel env add SMTP_HOST production <<< "smtp.gmail.com"
npx vercel env add SMTP_PORT production <<< "587"
npx vercel env add SMTP_SECURE production <<< "false"
npx vercel env add SMTP_USER production <<< "your-email@gmail.com"
npx vercel env add SMTP_PASS production <<< "your-app-password"
npx vercel env add EMAIL_FROM production <<< "noreply@hermessecurity.io"

echo "✅ Environment variables setup complete!"
echo "⚠️  Please update the SMTP credentials with your actual email configuration"
