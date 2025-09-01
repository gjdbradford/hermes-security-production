# Hermes Security Email Testing Plan

## Overview

This document outlines the comprehensive testing strategy for the Hermes Security contact form email delivery system. The system uses multiple email delivery methods to ensure reliable communication with potential clients.

## Email System Architecture

### Primary Email Flow
1. **Contact Form Submission** → **8n8 Webhook** → **Email Processing** → **Delivery**
2. **Fallback Flow**: Direct API call to Vercel serverless function
3. **Backup Flow**: EmailJS service (if configured)

### Email Recipients
- **Primary Recipient**: `gjdbradford@gmail.com`
- **Secondary Recipient**: `contact@hermessecurity.io`
- **Reply-To**: Customer's email address (from form)

### Email Subject Format
```
🔒 [FirstName] [LastName] from [CompanyName] - Security Consultation Request [Urgency]
```

Example: `🔒 John Smith from Acme Corp - Security Consultation Request [Urgent]`

## Testing Environments

### 1. Staging Environment (GitHub Pages)
- **URL**: `https://gjdbradford.github.io/hermes-security-production/`
- **API**: `https://hermes-security-production.vercel.app/api/send-email`
- **Description**: GitHub Pages frontend with Vercel API backend
- **Testing Method**: Automated script + manual verification

### 2. Production Environment (Vercel)
- **URL**: `https://hermes-security-production.vercel.app/`
- **API**: `https://hermes-security-production.vercel.app/api/send-email`
- **Description**: Full Vercel deployment
- **Testing Method**: Automated script + manual verification

### 3. Local Development
- **URL**: `http://localhost:8080`
- **API**: `http://localhost:3000/api/send-email`
- **Description**: Local development server
- **Testing Method**: Manual testing during development

## Email Configuration

### Required Environment Variables

#### Vercel Environment Variables
```bash
# SMTP Configuration
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

### Email Headers
The system includes comprehensive email headers for proper delivery and tracking:

```javascript
{
  'X-Mailer': 'Hermes Security Contact Form v1.0',
  'X-Priority': '1-3', // Based on urgency
  'X-MSMail-Priority': 'High/Normal/Low',
  'Importance': 'high/normal',
  'X-Hermes-Source': 'website-contact-form',
  'X-Hermes-Form-Type': 'security-consultation-request',
  'X-Hermes-Urgency': 'super-urgent/urgent/not-urgent',
  'X-Hermes-Company': 'company-name',
  'X-Hermes-Country': 'country-code',
  'Message-ID': 'unique-message-id',
  'Date': 'RFC-2822-date',
  'MIME-Version': '1.0',
  'Content-Type': 'text/html; charset=UTF-8'
}
```

## Testing Procedures

### Automated Testing Script

Run the comprehensive email testing script:

```bash
# Navigate to project directory
cd /Users/gbradford/Desktop/Cursor/Hermes/hermes-copycraft-main

# Run email tests
npx tsx scripts/email-test-plan.ts
```

### Manual Testing Checklist

#### 1. Contact Form Testing
- [ ] Fill out contact form with test data
- [ ] Submit form and verify success message
- [ ] Check browser console for errors
- [ ] Verify Crisp chat opens after submission

#### 2. Email Delivery Verification
- [ ] Check primary recipient inbox (`gjdbradford@gmail.com`)
- [ ] Check secondary recipient inbox (`contact@hermessecurity.io`)
- [ ] Verify email appears in inbox (not spam)
- [ ] Check email formatting and content
- [ ] Test reply functionality

#### 3. Email Content Validation
- [ ] Subject line format is correct
- [ ] HTML email renders properly
- [ ] Text version is readable
- [ ] All form data is included
- [ ] Urgency level is displayed correctly
- [ ] Company information is present
- [ ] Contact details are accurate

#### 4. System Integration Testing
- [ ] 8n8 webhook receives data
- [ ] Vercel function processes request
- [ ] SMTP connection is successful
- [ ] Email headers are properly set
- [ ] Fallback mechanisms work

### Test Data

Use this test data for consistent testing:

```javascript
{
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  country: 'GB',
  mobileNumber: '+44 7700 900000',
  problemDescription: 'This is a test email from the Hermes Security contact form testing system.',
  companyName: 'Test Company Ltd',
  companySize: '51-200',
  serviceUrgency: 'Not urgent',
  agreeToTerms: true
}
```

## Production Deployment Testing

### Pre-Deployment Checklist
- [ ] Environment variables are set in Vercel
- [ ] SMTP credentials are valid
- [ ] 8n8 webhook URL is correct
- [ ] Email templates are tested
- [ ] Fallback mechanisms are configured

### Post-Deployment Testing
- [ ] Run automated test script
- [ ] Submit test form on live site
- [ ] Verify email delivery within 5 minutes
- [ ] Check email content accuracy
- [ ] Test reply functionality
- [ ] Monitor error logs

### Monitoring and Alerts
- [ ] Set up email delivery monitoring
- [ ] Configure error alerts for failed emails
- [ ] Monitor 8n8 webhook success rates
- [ ] Track Vercel function performance
- [ ] Set up SMTP connection monitoring

## Troubleshooting Guide

### Common Issues

#### 1. Emails Not Delivered
**Symptoms**: Form submits successfully but no email received
**Solutions**:
- Check SMTP credentials in Vercel environment variables
- Verify email addresses are correct
- Check spam/junk folders
- Review Vercel function logs
- Test SMTP connection manually

#### 2. 8n8 Webhook Failures
**Symptoms**: Form submission fails or times out
**Solutions**:
- Verify webhook URL is correct
- Check 8n8 API key configuration
- Review 8n8 workflow logs
- Test webhook endpoint manually
- Check network connectivity

#### 3. Email Formatting Issues
**Symptoms**: Emails received but poorly formatted
**Solutions**:
- Check HTML email template
- Verify CSS styles are inline
- Test email in different clients
- Review email headers
- Check character encoding

#### 4. SMTP Authentication Errors
**Symptoms**: Vercel function logs show authentication failures
**Solutions**:
- Verify SMTP credentials
- Check if 2FA is enabled (use app password)
- Test SMTP connection with different tools
- Review Gmail security settings
- Check for IP restrictions

### Debug Commands

```bash
# Test SMTP connection
telnet smtp.gmail.com 587

# Test webhook endpoint
curl -X POST https://ilovemylife.app.n8n.cloud/webhook-test/a57cf53e-c2d6-4e59-8e38-44b774355629 \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'

# Check Vercel function logs
vercel logs --follow

# Test email API directly
curl -X POST https://hermes-security-production.vercel.app/api/send-email \
  -H "Content-Type: application/json" \
  -d '{"to": "test@example.com", "subject": "Test", "htmlBody": "Test email"}'
```

## Success Criteria

### Email Delivery
- ✅ Emails delivered within 5 minutes of form submission
- ✅ 99%+ delivery success rate
- ✅ Emails appear in inbox (not spam)
- ✅ Reply functionality works correctly

### Content Quality
- ✅ All form data included in email
- ✅ Professional formatting and styling
- ✅ Clear subject line with urgency indicator
- ✅ Proper email headers for tracking

### System Reliability
- ✅ 8n8 webhook processes 99%+ of submissions
- ✅ Vercel function handles errors gracefully
- ✅ Fallback mechanisms work when primary fails
- ✅ No data loss during processing

## Testing Schedule

### Daily Testing
- [ ] Automated test script execution
- [ ] Email delivery verification
- [ ] System health check

### Weekly Testing
- [ ] Full manual testing procedure
- [ ] Email template review
- [ ] Performance monitoring review

### Monthly Testing
- [ ] Security audit of email system
- [ ] Backup and recovery testing
- [ ] Documentation updates

## Contact Information

For issues or questions regarding email testing:
- **Technical Lead**: Graham Bradford
- **Email**: gjdbradford@gmail.com
- **Project**: Hermes Security Contact Form
- **Repository**: hermes-security-production

---

**Last Updated**: August 31, 2025
**Version**: 1.0
**Status**: Active
