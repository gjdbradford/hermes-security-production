# Email System Deployment Guide

## Current Status

The email testing revealed that the email system is not yet deployed to Vercel. Here's what needs to be done to get the email system working in production.

## Deployment Requirements

### 1. Vercel Deployment

The email system requires the Vercel serverless function to be deployed. Currently, the API endpoint `/api/send-email` is not available.

**Steps to deploy:**
1. Deploy the project to Vercel
2. Configure environment variables
3. Test the API endpoint

### 2. Environment Variables Setup

The following environment variables need to be configured in Vercel:

```bash
# SMTP Configuration (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@hermessecurity.io

# 8n8 Integration
VITE_N8N_API_KEY=your-8n8-bearer-token

# EmailJS Fallback (Optional)
VITE_EMAILJS_SERVICE_ID=your-service-id
VITE_EMAILJS_TEMPLATE_ID=your-template-id
VITE_EMAILJS_USER_ID=your-user-id
```

### 3. Gmail App Password Setup

To use Gmail SMTP, you need to:
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password for "Mail"
3. Use the App Password as `SMTP_PASS`

## Testing Strategy

### Can Run on GitHub Pages?
**No** - GitHub Pages only serves static files. The email functionality requires:
- Serverless functions (Vercel API routes)
- SMTP server access
- Environment variables

### Must Run on Vercel?
**Yes** - The email system requires:
- Vercel serverless functions for `/api/send-email`
- Environment variables for SMTP configuration
- Server-side processing for email sending

## Production Testing Plan

### Phase 1: Vercel Deployment
1. Deploy project to Vercel
2. Configure environment variables
3. Test API endpoint availability

### Phase 2: Email Configuration
1. Set up Gmail SMTP credentials
2. Test email sending functionality
3. Verify email delivery

### Phase 3: Integration Testing
1. Test contact form submission
2. Verify 8n8 webhook integration
3. Test fallback mechanisms

### Phase 4: Production Validation
1. Submit real contact form
2. Verify email delivery to recipients
3. Test reply functionality
4. Monitor system performance

## Manual Testing Commands

### Test Vercel API Endpoint
```bash
curl -X POST https://hermes-security-production.vercel.app/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "gjdbradford@gmail.com",
    "from": "noreply@hermessecurity.io",
    "replyTo": "test@example.com",
    "subject": "Test Email from Hermes Security",
    "htmlBody": "<h1>Test Email</h1><p>This is a test email.</p>",
    "textBody": "Test Email\n\nThis is a test email.",
    "headers": {
      "X-Mailer": "Hermes Security Test",
      "X-Priority": "3"
    }
  }'
```

### Test 8n8 Webhook
```bash
curl -X POST https://ilovemylife.app.n8n.cloud/webhook-test/a57cf53e-c2d6-4e59-8e38-44b774355629 \
  -H "Content-Type: application/json" \
  -d '{
    "formData": {
      "firstName": "Test",
      "lastName": "User",
      "email": "test@example.com",
      "country": "GB",
      "mobileNumber": "+44 7700 900000",
      "problemDescription": "Test message",
      "companyName": "Test Company",
      "companySize": "51-200",
      "serviceUrgency": "Not urgent",
      "agreeToTerms": true
    },
    "timestamp": "2025-08-31T18:00:00.000Z",
    "userAgent": "Test Agent",
    "termsConsent": true
  }'
```

## Expected Email Flow

### Primary Flow (8n8)
1. User submits contact form
2. Form data sent to 8n8 webhook
3. 8n8 processes and sends email
4. Email delivered to recipients

### Fallback Flow (Vercel API)
1. 8n8 webhook fails
2. Form submission calls Vercel API
3. Vercel function sends email via SMTP
4. Email delivered to recipients

### Backup Flow (EmailJS)
1. Both 8n8 and Vercel fail
2. EmailJS service sends email
3. Email delivered to recipients

## Email Recipients

- **Primary**: `gjdbradford@gmail.com`
- **Secondary**: `contact@hermessecurity.io`
- **Reply-To**: Customer's email from form

## Next Steps

1. **Deploy to Vercel** - Set up the serverless functions
2. **Configure SMTP** - Set up Gmail app password
3. **Test Email System** - Run comprehensive tests
4. **Monitor Performance** - Set up logging and alerts
5. **Production Validation** - Test with real contact form

## Troubleshooting

### Common Issues
- **API not found**: Vercel deployment incomplete
- **SMTP auth failed**: Gmail credentials incorrect
- **Email not delivered**: Check spam folder, verify recipients
- **8n8 webhook fails**: Check webhook URL and API key

### Debug Steps
1. Check Vercel function logs
2. Verify environment variables
3. Test SMTP connection manually
4. Check 8n8 workflow status
5. Review email headers and content

---

**Status**: Ready for Vercel deployment
**Priority**: High - Required for production contact form
**Estimated Time**: 2-4 hours for full setup and testing
