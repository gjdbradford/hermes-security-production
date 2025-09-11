# 8n8 Multi-Environment Setup Guide

This guide provides step-by-step instructions for configuring 8n8 workflows to work across multiple deployment environments (development, staging, and production).

## 🎯 **Overview**

The goal is to have a single 8n8 workflow that automatically detects the environment and routes requests appropriately, eliminating the need for separate workflows per environment.

## 🏗️ **Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Development   │    │     Staging     │    │   Production    │
│   localhost     │    │ GitHub Pages    │    │ Vercel/Heroku   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                   8n8 Workflow Router                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │  Test Webhook   │  │  Staging Logic  │  │ Production     │ │
│  │  (Development)  │  │  (GitHub Pages) │  │ Logic (Vercel) │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## 🚀 **Step 1: Create Environment Detection Logic**

### 1.1 Add Environment Headers to Your 8n8 Workflow

In your 8n8 workflow, add a "Switch" node that checks the `X-Hermes-Environment` header:

```json
{
  "id": "environment-detector",
  "type": "n8n-nodes-base.switch",
  "position": [240, 300],
  "parameters": {
    "rules": {
      "rules": [
        {
          "conditions": {
            "string": [
              {
                "value1": "={{ $json.headers['x-hermes-environment'] }}",
                "value2": "production"
              }
            ]
          },
          "output": 0
        },
        {
          "conditions": {
            "string": [
              {
                "value1": "={{ $json.headers['x-hermes-environment'] }}",
                "value2": "staging"
              }
            ]
          },
          "output": 1
        },
        {
          "conditions": {
            "string": [
              {
                "value1": "={{ $json.headers['x-hermes-environment'] }}",
                "value2": "development"
              }
            ]
          },
          "output": 2
        }
      ]
    }
  }
}
```

### 1.2 Create Environment-Specific Processing Nodes

Create three separate processing paths for each environment:

#### **Production Path (Output 0)**
- Email notifications to production team
- Database logging to production database
- CRM integration with production systems
- Slack/Discord notifications to production channels

#### **Staging Path (Output 1)**
- Email notifications to staging team
- Database logging to staging database
- Test integrations
- Slack/Discord notifications to staging channels

#### **Development Path (Output 2)**
- Console logging only
- No external notifications
- Test data validation
- Development team notifications

## 🔧 **Step 2: Update Your Frontend Code**

### 2.1 Modify Contact Form Submission

Update your contact form to send environment information:

```typescript
// In your contact form submission
const submitForm = async (formData: ContactFormData) => {
  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hermes-Source': 'website-contact-form',
        'X-Hermes-Environment': getEnvironmentName(), // Add this line
        'X-Hermes-Version': '1.0.0'
      },
      body: JSON.stringify(requestData)
    });
    
    // ... rest of your code
  } catch (error) {
    // ... error handling
  }
};
```

### 2.2 Environment Detection Function

```typescript
// src/utils/environment.ts
export const getEnvironmentName = (): string => {
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;
  
  if (hostname === 'www.hermessecurity.io' || hostname === 'hermessecurity.io') {
    return 'production';
  }
  
  if (hostname.includes('hermes-security-production') && hostname.includes('vercel.app')) {
    return 'production';
  }
  
  if (hostname === 'gjdbradford.github.io' && pathname.includes('/hermes-security-production/')) {
    return 'staging';
  }
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'development';
  }
  
  return 'staging'; // Default fallback
};
```

## 🌐 **Step 3: Configure 8n8 Webhook URLs**

### 3.1 Production Webhook
- **URL**: `https://ilovemylife.app.n8n.cloud/webhook/a57cf53e-c2d6-4e59-8e38-44b774355629`
- **Purpose**: Live production form submissions
- **Security**: High (rate limiting, IP whitelisting)

### 3.2 Staging Webhook
- **URL**: `https://ilovemylife.app.n8n.cloud/webhook-test/a57cf53e-c2d6-4e59-8e38-44b774355629`
- **Purpose**: Testing and staging form submissions
- **Security**: Medium (basic rate limiting)

### 3.3 Development Webhook
- **URL**: `https://ilovemylife.app.n8n.cloud/webhook-test/a57cf53e-c2d6-4e59-8e38-44b774355629`
- **Purpose**: Local development testing
- **Security**: Low (for development only)

## 🔒 **Step 4: Security Configuration**

### 4.1 Rate Limiting

Configure rate limiting in your 8n8 workflow:

```json
{
  "id": "rate-limiter",
  "type": "n8n-nodes-base.function",
  "position": [120, 300],
  "parameters": {
    "functionCode": "// Rate limiting logic\nconst ip = $json.headers['x-forwarded-for'] || $json.headers['x-real-ip'];\nconst now = Date.now();\n\n// Check if IP is rate limited\nif (global.rateLimit && global.rateLimit[ip]) {\n  const timeDiff = now - global.rateLimit[ip].timestamp;\n  if (timeDiff < 60000 && global.rateLimit[ip].count >= 5) {\n    throw new Error('Rate limit exceeded. Please try again later.');\n  }\n}\n\n// Update rate limit counter\nif (!global.rateLimit) global.rateLimit = {};\nif (!global.rateLimit[ip]) global.rateLimit[ip] = { count: 0, timestamp: now };\nglobal.rateLimit[ip].count++;\nglobal.rateLimit[ip].timestamp = now;\n\nreturn $json;"
  }
}
```

### 4.2 IP Whitelisting (Production Only)

```json
{
  "id": "ip-whitelist",
  "type": "n8n-nodes-base.function",
  "position": [120, 400],
  "parameters": {
    "functionCode": "// IP whitelisting for production\nconst environment = $json.headers['x-hermes-environment'];\nconst ip = $json.headers['x-forwarded-for'] || $json.headers['x-real-ip'];\n\nif (environment === 'production') {\n  const allowedIPs = ['your-production-ip-1', 'your-production-ip-2'];\n  if (!allowedIPs.includes(ip)) {\n    throw new Error('IP not whitelisted for production');\n  }\n}\n\nreturn $json;"
  }
}
```

## 📧 **Step 5: Email Configuration**

### 5.1 Environment-Specific Email Templates

Create different email templates for each environment:

```json
{
  "id": "email-router",
  "type": "n8n-nodes-base.switch",
  "position": [600, 300],
  "parameters": {
    "rules": {
      "rules": [
        {
          "conditions": {
            "string": [
              {
                "value1": "={{ $json.environment }}",
                "value2": "production"
              }
            ]
          },
          "output": 0
        },
        {
          "conditions": {
            "string": [
              {
                "value1": "={{ $json.environment }}",
                "value2": "staging"
              }
            ]
          },
          "output": 1
        },
        {
          "conditions": {
            "string": [
              {
                "value1": "={{ $json.environment }}",
                "value2": "development"
              }
            ]
          },
          "output": 2
        }
      ]
    }
  }
}
```

### 5.2 Email Templates

#### **Production Template**
- Professional formatting
- Company branding
- Legal disclaimers
- Contact information

#### **Staging Template**
- "TESTING" watermark
- Simplified formatting
- Development team contact

#### **Development Template**
- Debug information
- Console logging
- Developer contact only

## 🗄️ **Step 6: Database Configuration**

### 6.1 Environment-Specific Databases

```json
{
  "id": "database-router",
  "type": "n8n-nodes-base.switch",
  "position": [800, 300],
  "parameters": {
    "rules": {
      "rules": [
        {
          "conditions": {
            "string": [
              {
                "value1": "={{ $json.environment }}",
                "value2": "production"
              }
            ]
          },
          "output": 0
        },
        {
          "conditions": {
            "string": [
              {
                "value1": "={{ $json.environment }}",
                "value2": "staging"
              }
            ]
          },
          "output": 1
        },
        {
          "conditions": {
            "string": [
              {
                "value1": "={{ $json.environment }}",
                "value2": "development"
              }
            ]
          },
          "output": 2
        }
      ]
    }
  }
}
```

### 6.2 Database Connections

- **Production**: `hermes_production_db`
- **Staging**: `hermes_staging_db`
- **Development**: `hermes_dev_db`

## 🔔 **Step 7: Notification Configuration**

### 7.1 Slack/Discord Channels

```json
{
  "id": "notification-router",
  "type": "n8n-nodes-base.switch",
  "position": [1000, 300],
  "parameters": {
    "rules": {
      "rules": [
        {
          "conditions": {
            "string": [
              {
                "value1": "={{ $json.environment }}",
                "value2": "production"
              }
            ]
          },
          "output": 0
        },
        {
          "conditions": {
            "string": [
              {
                "value1": "={{ $json.environment }}",
                "value2": "staging"
              }
            ]
          },
          "output": 1
        },
        {
          "conditions": {
            "string": [
              {
                "value1": "={{ $json.environment }}",
                "value2": "development"
              }
            ]
          },
          "output": 2
        }
      ]
    }
  }
}
```

### 7.2 Channel Mapping

- **Production**: `#hermes-production-alerts`
- **Staging**: `#hermes-staging-alerts`
- **Development**: `#hermes-dev-alerts`

## 🧪 **Step 8: Testing Your Setup**

### 8.1 Test Each Environment

```bash
# Test Development
curl -X POST https://ilovemylife.app.n8n.cloud/webhook-test/a57cf53e-c2d6-4e59-8e38-44b774355629 \
  -H "Content-Type: application/json" \
  -H "X-Hermes-Environment: development" \
  -d '{"test": "development"}'

# Test Staging
curl -X POST https://ilovemylife.app.n8n.cloud/webhook-test/a57cf53e-c2d6-4e59-8e38-44b774355629 \
  -H "Content-Type: application/json" \
  -H "X-Hermes-Environment: staging" \
  -d '{"test": "staging"}'

# Test Production
curl -X POST https://ilovemylife.app.n8n.cloud/webhook/a57cf53e-c2d6-4e59-8e38-44b774355629 \
  -H "Content-Type: application/json" \
  -H "X-Hermes-Environment: production" \
  -d '{"test": "production"}'
```

### 8.2 Verify Environment Detection

Check your 8n8 workflow logs to ensure:
- Environment headers are received correctly
- Requests are routed to the right processing path
- Appropriate notifications are sent
- Data is stored in the correct database

## 🚨 **Step 9: Error Handling**

### 9.1 Environment-Specific Error Handling

```json
{
  "id": "error-handler",
  "type": "n8n-nodes-base.function",
  "position": [1200, 300],
  "parameters": {
    "functionCode": "// Environment-specific error handling\nconst environment = $json.environment || 'unknown';\nconst error = $json.error || 'Unknown error';\n\n// Log error based on environment\nif (environment === 'production') {\n  // Send to production error monitoring\n  console.error('PRODUCTION ERROR:', error);\n  // Could integrate with Sentry, LogRocket, etc.\n} else if (environment === 'staging') {\n  // Send to staging error monitoring\n  console.warn('STAGING ERROR:', error);\n} else {\n  // Development - just log\n  console.log('DEV ERROR:', error);\n}\n\nreturn $json;"
  }
}
```

## 📊 **Step 10: Monitoring & Analytics**

### 10.1 Environment Metrics

Track performance and errors by environment:

```json
{
  "id": "metrics-collector",
  "type": "n8n-nodes-base.function",
  "position": [1400, 300],
  "parameters": {
    "functionCode": "// Collect environment metrics\nconst environment = $json.environment || 'unknown';\nconst timestamp = new Date().toISOString();\nconst processingTime = Date.now() - $json.timestamp;\n\n// Store metrics in your analytics system\nconst metrics = {\n  environment,\n  timestamp,\n  processingTime,\n  success: !$json.error,\n  error: $json.error || null\n};\n\n// You could send this to Google Analytics, Mixpanel, etc.\nconsole.log('METRICS:', metrics);\n\nreturn $json;"
  }
}
```

## 🔄 **Step 11: Deployment Workflow**

### 11.1 Automated Deployment

1. **Development**: Auto-deploy on every commit to `dev` branch
2. **Staging**: Auto-deploy on every commit to `staging` branch
3. **Production**: Manual deployment from `main` branch

### 11.2 Environment Variables

Set these environment variables in your deployment platforms:

```bash
# Vercel
N8N_WEBHOOK_URL=https://ilovemylife.app.n8n.cloud/webhook/a57cf53e-c2d6-4e59-8e38-44b774355629
N8N_ENVIRONMENT=production

# GitHub Pages
N8N_WEBHOOK_URL=https://ilovemylife.app.n8n.cloud/webhook-test/a57cf53e-c2d6-4e59-8e38-44b774355629
N8N_ENVIRONMENT=staging

# Local Development
N8N_WEBHOOK_URL=https://ilovemylife.app.n8n.cloud/webhook-test/a57cf53e-c2d6-4e59-8e38-44b774355629
N8N_ENVIRONMENT=development
```

## ✅ **Step 12: Validation Checklist**

- [ ] Environment detection works correctly
- [ ] Webhook URLs are properly configured
- [ ] Rate limiting is implemented
- [ ] IP whitelisting is configured (production)
- [ ] Email templates are environment-specific
- [ ] Database routing works correctly
- [ ] Notifications go to right channels
- [ ] Error handling is environment-aware
- [ ] Metrics collection is working
- [ ] All environments tested successfully

## 🎉 **Benefits of This Setup**

1. **Single Workflow**: Maintain one workflow instead of three
2. **Environment Isolation**: Clear separation between environments
3. **Easy Testing**: Test all scenarios in one place
4. **Consistent Logic**: Same business logic across environments
5. **Scalable**: Easy to add new environments
6. **Maintainable**: Single source of truth for workflow logic

## 🆘 **Troubleshooting**

### Common Issues

1. **CORS Errors**: Ensure your 8n8 workflow allows requests from all environments
2. **Environment Detection Fails**: Check header names and values
3. **Wrong Webhook URL**: Verify environment detection logic
4. **Rate Limiting Too Strict**: Adjust limits for development/staging

### Debug Commands

```bash
# Check environment detection
curl -I https://your-site.com/contact

# Test webhook with environment header
curl -X POST YOUR_WEBHOOK_URL \
  -H "X-Hermes-Environment: development" \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

This setup will give you a robust, scalable 8n8 integration that works seamlessly across all your deployment environments!
