# 8n8 Webhook Setup

## Overview

The contact form has been simplified to submit directly to 8n8 webhooks. All API logic and database integration has been removed from the frontend.

## Configuration Required

### 1. Webhook URLs Configured

The webhook URLs are already configured in `src/services/contactForm.ts`:

```typescript
// All environments use the same webhook URL
return 'https://ilovemylife.app.n8n.cloud/webhook-test/a57cf53e-c2d6-4e59-8e38-44b774355629';
```

**Note**: Currently all environments (production, staging, local) use the same webhook URL. You can differentiate between environments in your 8n8 workflow using the `source` field or hostname detection.

### 2. 8n8 Workflow Setup

Your 8n8 workflow should:

1. **Receive webhook data** from the contact form
2. **Process the form data** (validation, formatting, etc.)
3. **Save to Supabase** using 8n8's Supabase node
4. **Send email notifications** using 8n8's email nodes
5. **Return success response** to the frontend

### 3. Form Data Structure

The contact form sends the following data structure:

```json
{
  "firstName": "string",
  "lastName": "string", 
  "email": "string",
  "country": "string",
  "phoneNumber": "string",
  "userRole": "string",
  "problemDescription": "string",
  "companyName": "string",
  "companySize": "string", 
  "serviceUrgency": "string",
  "agreeToTerms": "boolean",
  "privacyConsent": "boolean",
  "marketingConsent": "boolean",
  "captchaToken": "string",
  "ctaSource": "string",
  "timestamp": "string",
  "userAgent": "string",
  "source": "hermes-security-website"
}
```

### 4. Environment Detection

The form automatically detects the environment and uses the appropriate webhook URL:

- **Production**: `www.hermessecurity.io` or `hermessecurity.io`
- **Staging**: `hermes-security-staging.vercel.app`
- **Local Development**: `localhost` or `127.0.0.1`

### 5. Response Format

8n8 should return a JSON response:

```json
{
  "success": true,
  "message": "Form submitted successfully"
}
```

## Benefits

- ✅ **Simplified architecture** - No complex API functions to maintain
- ✅ **Reliable database integration** - 8n8 handles all database operations
- ✅ **Better error handling** - 8n8 provides robust workflow management
- ✅ **Easier debugging** - All logic centralized in 8n8
- ✅ **Scalable** - 8n8 can handle complex workflows and integrations

## Next Steps

1. ✅ **Webhook URL configured** - Already set to your 8n8 webhook
2. **Create your 8n8 workflow** to handle form submissions
3. **Test the contact form submission** 
4. **Deploy to staging/production**

The contact form is ready to submit to your 8n8 webhook at:
`https://ilovemylife.app.n8n.cloud/webhook-test/a57cf53e-c2d6-4e59-8e38-44b774355629`

The contact form is now much simpler and more reliable!
