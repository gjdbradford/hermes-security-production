#!/bin/bash

# Hermes Security 8n8 Integration Setup Script
# This script helps set up the 8n8 workflow for contact form processing

echo "🚀 Setting up 8n8 Integration for Hermes Security..."

# Check if required tools are installed
command -v curl >/dev/null 2>&1 || { echo "❌ curl is required but not installed. Aborting." >&2; exit 1; }
command -v jq >/dev/null 2>&1 || { echo "❌ jq is required but not installed. Aborting." >&2; exit 1; }

# Configuration variables
WORKFLOW_CONFIG_FILE="8n8-workflow-config.json"
ENV_FILE=".env"

echo "�� Step 1: Validating configuration files..."

# Check if workflow config exists
if [ ! -f "$WORKFLOW_CONFIG_FILE" ]; then
    echo "❌ Workflow configuration file not found: $WORKFLOW_CONFIG_FILE"
    exit 1
fi

# Check if .env file exists
if [ ! -f "$ENV_FILE" ]; then
    echo "❌ Environment file not found: $ENV_FILE"
    echo "📝 Please copy .env.example to .env and configure your settings"
    exit 1
fi

echo "✅ Configuration files found"

# Load environment variables
source .env

echo "�� Step 2: Testing 8n8 connectivity..."

# Test 8n8 webhook endpoint
if [ -n "$VITE_8N8_WEBHOOK_URL" ]; then
    echo "🔗 Testing webhook URL: $VITE_8N8_WEBHOOK_URL"
    
    # Send test payload
    TEST_RESPONSE=$(curl -s -X POST "$VITE_8N8_WEBHOOK_URL" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $VITE_8N8_API_KEY" \
        -d '{
            "formData": {
                "firstName": "Test",
                "lastName": "User",
                "email": "test@example.com",
                "country": "GB",
                "mobileNumber": "+44 7700 900000",
                "problemDescription": "Test security assessment needed",
                "companyName": "Test Company",
                "companySize": "51-200",
                "serviceUrgency": "urgent",
                "agreeToTerms": true,
                "gdprConsent": true
            },
            "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'",
            "leadId": "HERMES-SETUP-TEST",
            "source": "hermes-website"
        }')
    
    if [ $? -eq 0 ]; then
        echo "✅ Webhook test successful"
        echo "📄 Response: $TEST_RESPONSE"
    else
        echo "❌ Webhook test failed"
        echo "�� Please check your 8n8 configuration"
    fi
else
    echo "⚠️  No webhook URL configured"
fi

echo "�� Step 3: Validating email configuration..."

# Check EmailJS configuration
if [ -n "$VITE_EMAILJS_SERVICE_ID" ] && [ -n "$VITE_EMAILJS_TEMPLATE_ID" ] && [ -n "$VITE_EMAILJS_USER_ID" ]; then
    echo "✅ EmailJS configuration found"
else
    echo "⚠️  EmailJS configuration incomplete"
    echo "�� Please configure VITE_EMAILJS_* variables in .env"
fi

echo "📋 Step 4: Database setup..."

# Check database configuration
if [ -n "$VITE_DB_HOST" ] && [ -n "$VITE_DB_NAME" ]; then
    echo "✅ Database configuration found"
    echo "🗄️  Database: $VITE_DB_NAME on $VITE_DB_HOST:$VITE_DB_PORT"
else
    echo "⚠️  Database configuration incomplete"
fi

echo "📋 Step 5: Creating database schema..."

# Create database schema
if [ -f "database/hermes_leads_schema.sql" ]; then
    echo "📄 Database schema file found"
    echo "🔧 Please run the following command to create the database schema:"
    echo "   psql -h $VITE_DB_HOST -p $VITE_DB_PORT -U $VITE_DB_USER -d $VITE_DB_NAME -f database/hermes_leads_schema.sql"
else
    echo "❌ Database schema file not found"
fi

echo "📋 Step 6: Testing form submission..."

# Test the contact form
echo "🧪 Testing contact form submission..."
echo "�� Please visit: http://localhost:8081/#/contact"
echo "📝 Fill out the form and submit to test the integration"

echo ""
echo "🎉 8n8 Integration Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. ✅ Verify webhook is receiving data in 8n8 dashboard"
echo "2. ✅ Check email delivery to contact@hermessecurity.io"
echo "3. ✅ Verify database storage"
echo "4. ✅ Test AI agent processing"
echo "5. ✅ Monitor Slack notifications (if configured)"
echo ""
echo "�� Troubleshooting:"
echo "- Check 8n8 execution logs for errors"
echo "- Verify API keys and webhook URLs"
echo "- Test email service configuration"
echo "- Check database connectivity"
echo ""
echo "�� Support:"
echo "- 8n8 Documentation: https://docs.8n8.io"
echo "- EmailJS Documentation: https://www.emailjs.com/docs"
echo "- Hermes Security: contact@hermessecurity.io"
