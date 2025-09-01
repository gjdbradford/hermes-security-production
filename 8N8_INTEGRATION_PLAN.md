# 8n8 Webhook Integration Plan

## 🎯 **Objective**
Get the 8n8 webhook working locally first, then deploy to production. This will handle email sending more reliably than the Vercel API approach.

## 📋 **Current 8n8 Configuration**

### **Webhook URL:**
```
https://ilovemylife.app.n8n.cloud/webhook-test/a57cf53e-c2d6-4e59-8e38-44b774355629
```

### **Expected Payload:**
```json
{
  "formData": {
    "firstName": "string",
    "lastName": "string", 
    "email": "string",
    "country": "string",
    "mobileNumber": "string",
    "problemDescription": "string",
    "companyName": "string",
    "companySize": "string",
    "serviceUrgency": "string",
    "agreeToTerms": boolean
  },
  "timestamp": "ISO string",
  "userAgent": "string",
  "termsConsent": boolean
}
```

## 🔧 **Step-by-Step Integration Plan**

### **Phase 1: Local Testing & Validation**

#### **Step 1: Test Webhook Endpoint**
```bash
# Test if webhook is accessible
curl -X POST https://ilovemylife.app.n8n.cloud/webhook-test/a57cf53e-c2d6-4e59-8e38-44b774355629 \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

#### **Step 2: Test with Real Form Data**
```bash
# Test with actual contact form data
curl -X POST https://ilovemylife.app.n8n.cloud/webhook-test/a57cf53e-c2d6-4e59-8e38-44b774355629 \
  -H "Content-Type: application/json" \
  -d '{
    "formData": {
      "firstName": "Test",
      "lastName": "User",
      "email": "test@example.com",
      "country": "GB",
      "mobileNumber": "+44 7700 900000",
      "problemDescription": "Testing 8n8 webhook integration",
      "companyName": "Test Company Ltd",
      "companySize": "51-200",
      "serviceUrgency": "Not urgent",
      "agreeToTerms": true
    },
    "timestamp": "2025-08-31T19:00:00.000Z",
    "userAgent": "Hermes Security Test Suite",
    "termsConsent": true
  }'
```

#### **Step 3: Test from Local Development Server**
- Start local dev server: `npm run dev`
- Navigate to contact form
- Submit test form
- Check browser network tab for webhook calls

### **Phase 2: Fix Integration Issues**

#### **Step 4: Debug Webhook Response**
- Check webhook response codes
- Verify payload format
- Test authentication if required

#### **Step 5: Update Contact Form Integration**
- Ensure form calls webhook correctly
- Add proper error handling
- Implement fallback mechanisms

### **Phase 3: Production Deployment**

#### **Step 6: Deploy to Production**
- Test webhook from production site
- Verify email delivery
- Monitor webhook success rates

## 🧪 **Testing Scripts**

### **Local Webhook Test Script**
```bash
#!/bin/bash
# Test 8n8 webhook locally

WEBHOOK_URL="https://ilovemylife.app.n8n.cloud/webhook-test/a57cf53e-c2d6-4e59-8e38-44b774355629"

echo "🧪 Testing 8n8 Webhook Integration"
echo "================================="

# Test 1: Basic connectivity
echo "1️⃣ Testing basic connectivity..."
curl -s -o /dev/null -w "%{http_code}" -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"test": "connectivity"}'

# Test 2: Full form data
echo "2️⃣ Testing with full form data..."
curl -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "formData": {
      "firstName": "Test",
      "lastName": "User", 
      "email": "test@example.com",
      "country": "GB",
      "mobileNumber": "+44 7700 900000",
      "problemDescription": "Testing 8n8 webhook integration",
      "companyName": "Test Company Ltd",
      "companySize": "51-200",
      "serviceUrgency": "Not urgent",
      "agreeToTerms": true
    },
    "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%S.000Z)'",
    "userAgent": "Hermes Security Test Suite",
    "termsConsent": true
  }'
```

## 🔍 **Current Issues to Investigate**

### **1. Webhook URL Validation**
- Is the webhook URL correct?
- Is the 8n8 instance accessible?
- Are there any authentication requirements?

### **2. Payload Format**
- Does the payload match what 8n8 expects?
- Are all required fields included?
- Is the data structure correct?

### **3. Network Issues**
- Are there CORS issues?
- Is the webhook endpoint responding?
- Are there any rate limiting issues?

## 📊 **Expected Results**

### **Successful Webhook Call:**
```json
{
  "success": true,
  "messageId": "unique-id",
  "timestamp": "2025-08-31T19:00:00.000Z",
  "nextSteps": [
    "Email sent successfully",
    "Check inbox for confirmation"
  ]
}
```

### **Failed Webhook Call:**
```json
{
  "success": false,
  "error": "Error message",
  "details": "Detailed error information"
}
```

## 🎯 **Success Criteria**

- ✅ Webhook responds with 200 OK
- ✅ Form data is received by 8n8
- ✅ Email is sent to `gjdbradford@gmail.com`
- ✅ Email contains all form data
- ✅ Professional email formatting
- ✅ Reply functionality works

## 🚀 **Next Steps**

1. **Test webhook endpoint** - Verify it's accessible
2. **Debug payload format** - Ensure data structure is correct
3. **Test from local dev** - Verify integration works locally
4. **Fix any issues** - Resolve authentication, CORS, or format problems
5. **Deploy to production** - Test on live site

---

**Priority**: High - This is the primary email delivery method
**Estimated Time**: 30-45 minutes for local testing and fixes
