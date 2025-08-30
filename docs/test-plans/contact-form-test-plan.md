# 🚀 **8n8 Integration Plan - Step-by-Step Guide**

## **📋 OVERVIEW**
This plan will help you integrate the Hermes Security contact form with 8n8 for AI agent automation and lead processing.

---

## **🎯 PHASE 1: 8n8 Account Setup**

### **Step 1.1: Create 8n8 Account**
1. **Go to**: https://8n8.io
2. **Sign up** for a new account
3. **Choose plan** (Free tier available for testing)
4. **Verify email** and complete account setup

### **Step 1.2: Access Dashboard**
1. **Login** to your 8n8 dashboard
2. **Navigate** to "Workflows" section
3. **Create** a new workspace for Hermes Security

---

## **🔧 PHASE 2: Create Webhook Endpoint**

### **Step 2.1: Create New Workflow**
1. **Click** "Create Workflow"
2. **Name it**: "Hermes Contact Form Handler"
3. **Description**: "Processes contact form submissions from Hermes Security website"

### **Step 2.2: Add Webhook Trigger**
1. **Search** for "Webhook" in the trigger library
2. **Add** "Webhook" trigger to your workflow
3. **Configure** webhook settings:
   - **Method**: POST
   - **Path**: `/hermes-contact`
   - **Authentication**: Bearer Token
   - **Response Mode**: Respond to Webhook

### **Step 2.3: Get Webhook URL**
1. **Copy** the webhook URL (format: `https://your-instance.8n8.io/webhook/hermes-contact`)
2. **Save** this URL for later use
3. **Note** the Bearer Token for authentication

---

## **🤖 PHASE 3: Build AI Agent Workflow**

### **Step 3.1: Add Data Processing Nodes**
1. **Add** "Set" node to extract form data
2. **Configure** data mapping:
   ```json
   {
     "leadId": "{{$json.leadId}}",
     "firstName": "{{$json.formData.firstName}}",
     "lastName": "{{$json.formData.lastName}}",
     "email": "{{$json.formData.email}}",
     "country": "{{$json.formData.country}}",
     "mobileNumber": "{{$json.formData.mobileNumber}}",
     "problemDescription": "{{$json.formData.problemDescription}}",
     "companyName": "{{$json.formData.companyName}}",
     "companySize": "{{$json.formData.companySize}}",
     "serviceUrgency": "{{$json.formData.serviceUrgency}}",
     "gdprConsent": "{{$json.formData.gdprConsent}}",
     "timestamp": "{{$json.timestamp}}"
   }
   ```

### **Step 3.2: Add Lead Scoring Node**
1. **Add** "Code" node for lead scoring
2. **Configure** scoring logic:
   ```javascript
   const urgency = $input.first().json.serviceUrgency;
   const companySize = $input.first().json.companySize;
   
   let score = 0;
   
   // Urgency scoring
   switch(urgency) {
     case 'super-urgent': score += 50; break;
     case 'urgent': score += 30; break;
     case 'standard': score += 15; break;
     case 'not-urgent': score += 5; break;
   }
   
   // Company size scoring
   if (companySize && companySize.includes('1000+')) score += 20;
   else if (companySize && companySize.includes('500+')) score += 15;
   else if (companySize && companySize.includes('200+')) score += 10;
   
   return {
     leadScore: score,
     priority: score > 40 ? 'high' : score > 20 ? 'medium' : 'low'
   };
   ```

### **Step 3.3: Add Database Storage**
1. **Add** "Database" node (or use Google Sheets for testing)
2. **Configure** to store lead data:
   - **Table**: `hermes_leads`
   - **Fields**: Map all form data + lead score
   - **Unique ID**: Use leadId

### **Step 3.4: Add Email Notification**
1. **Add** "Email" node
2. **Configure** notification email:
   - **To**: `contact@hermessecurity.io`
   - **Subject**: `New Lead: {{$json.firstName}} {{$json.lastName}} - Score: {{$json.leadScore}}`
   - **Body**: Include lead details and score

### **Step 3.5: Add AI Agent Processing**
1. **Add** "OpenAI" or "AI" node
2. **Configure** AI processing:
   ```javascript
   // AI prompt for lead analysis
   const prompt = `
   Analyze this cybersecurity lead:
   
   Name: ${$input.first().json.firstName} ${$input.first().json.lastName}
   Company: ${$input.first().json.companyName || 'Not provided'}
   Problem: ${$input.first().json.problemDescription}
   Urgency: ${$input.first().json.serviceUrgency}
   Lead Score: ${$input.first().json.leadScore}
   
   Provide:
   1. Recommended next steps
   2. Suggested service package
   3. Priority level
   4. Estimated response time
   `;
   ```

---

## **📧 PHASE 4: Email Integration**

### **Step 4.1: Add Email Backup**
1. **Add** "Email" node for backup
2. **Configure** backup email:
   - **To**: `gjdbradford@gmail.com`
   - **Subject**: `[{{$json.firstName}}] from [{{$json.companyName}}] - Hermes Website Contact Enquiry [{{$json.serviceUrgency}}]`
   - **Body**: Format with all lead details

### **Step 4.2: Add Auto-Response**
1. **Add** "Email" node for auto-response
2. **Configure** auto-response:
   - **To**: `{{$json.email}}`
   - **Subject**: `Thank you for contacting Hermes Security`
   - **Body**: Professional thank you message with next steps

---

## **🔗 PHASE 5: Update Website Configuration**

### **Step 5.1: Update Environment Variables**
Add to your `.env` file:
```env
VITE_8N8_API_KEY=your-8n8-bearer-token
VITE_8N8_WEBHOOK_URL=https://your-instance.8n8.io/webhook/hermes-contact
```

### **Step 5.2: Update contactApi.ts**
Ensure the webhook URL and API key are correctly configured in your `contactApi.ts` file.

---

## ** PHASE 6: Testing & Validation**

### **Step 6.1: Test Webhook**
1. **Use 8n8's webhook testing tool**
2. **Send test payload**:
   ```json
   {
     "formData": {
       "firstName": "Test",
       "lastName": "User",
       "email": "test@example.com",
       "country": "GB",
       "mobileNumber": "+44 7700 900000",
       "problemDescription": "Need security assessment for our e-commerce platform",
       "companyName": "Test Company Ltd",
       "companySize": "51-200",
       "serviceUrgency": "urgent",
       "agreeToTerms": true,
       "gdprConsent": true
     },
     "timestamp": "2024-01-15T10:30:00Z",
     "leadId": "HERMES-TEST-001"
   }
   ```

### **Step 6.2: Verify Workflow Execution**
1. **Check** 8n8 execution logs
2. **Verify** lead scoring works
3. **Confirm** emails are sent
4. **Check** database storage
5. **Test** AI agent processing

### **Step 6.3: Test Real Form Submission**
1. **Submit** real contact form
2. **Monitor** 8n8 workflow execution
3. **Verify** all emails are received
4. **Check** lead data in database
5. **Confirm** AI agent analysis

---

## **🤖 PHASE 6.5: Crisp AI Agent Integration Testing**

### **Step 6.5.1: Crisp Script Loading Test**
1. **Verify Crisp script loads correctly**:
   - Open browser developer tools
   - Check Network tab for `https://client.crisp.chat/l.js`
   - Verify script loads without errors
   - Confirm `window.$crisp` is available globally

2. **Test Crisp widget visibility**:
   - Check if Crisp chat widget appears on all pages
   - Verify widget is positioned in bottom-right corner
   - Test widget expand/collapse functionality
   - Confirm widget styling matches brand colors

### **Step 6.5.2: Form Submission Trigger Test**
1. **Test automatic chat opening**:
   - Fill out contact form completely
   - Submit form with valid data
   - Verify Crisp chat automatically opens after successful submission
   - Check that chat opens regardless of urgency level

2. **Test with different urgency levels**:
   - Submit form with "Super urgent" selected
   - Submit form with "Urgent" selected
   - Submit form with "Not urgent" selected
   - Confirm chat opens in all scenarios

### **Step 6.5.3: Crisp AI Agent Configuration Test**
1. **Verify AI Agent setup in Crisp dashboard**:
   - Login to Crisp dashboard
   - Navigate to AI Agents section
   - Confirm AI agent is configured for Hermes Security
   - Test AI agent responses

2. **Test AI Agent workflow**:
   - Submit contact form to trigger chat
   - Verify AI agent greets user appropriately
   - Test AI agent asking relevant security questions
   - Confirm AI agent can gather lead information

### **Step 6.5.4: Human Handoff Test**
1. **Test AI to human transition**:
   - Complete AI agent conversation
   - Verify AI agent offers to connect to human expert
   - Test handoff process to human agent
   - Confirm human agent receives lead context

2. **Test escalation scenarios**:
   - Test "Super urgent" escalation path
   - Verify immediate human connection for urgent cases
   - Test standard escalation for non-urgent cases
   - Confirm proper routing based on urgency

### **Step 6.5.5: Cross-Browser Compatibility Test**
1. **Test on different browsers**:
   - Chrome (latest version)
   - Firefox (latest version)
   - Safari (latest version)
   - Edge (latest version)
   - Mobile browsers (iOS Safari, Chrome Mobile)

2. **Test responsive behavior**:
   - Desktop (1920x1080 and above)
   - Tablet (768px - 1024px)
   - Mobile (320px - 767px)
   - Verify chat widget adapts to screen size

### **Step 6.5.6: Performance and Load Testing**
1. **Test page load performance**:
   - Measure page load time with Crisp script
   - Verify no significant performance impact
   - Test script loading in slow network conditions
   - Check for any blocking resources

2. **Test concurrent users**:
   - Simulate multiple users submitting forms simultaneously
   - Verify Crisp chat handles multiple conversations
   - Test AI agent response times under load
   - Confirm no conflicts between concurrent sessions

### **Step 6.5.7: Error Handling and Edge Cases**
1. **Test network failures**:
   - Disconnect internet during form submission
   - Verify graceful error handling
   - Test reconnection behavior
   - Confirm form data is not lost

2. **Test browser compatibility issues**:
   - Test with JavaScript disabled
   - Test with ad blockers enabled
   - Test with privacy mode enabled
   - Verify fallback behavior

### **Step 6.5.8: Security and Privacy Testing**
1. **Test data transmission**:
   - Verify all data is transmitted over HTTPS
   - Check for any sensitive data in browser console
   - Test GDPR compliance features
   - Confirm data retention policies

2. **Test authentication and authorization**:
   - Verify Crisp website ID is correct
   - Test session management
   - Confirm proper user identification
   - Test data access controls

### **Step 6.5.9: Integration with 8n8 Workflow Test**
1. **Test end-to-end workflow**:
   - Submit contact form
   - Verify Crisp chat opens
   - Complete AI agent conversation
   - Confirm 8n8 receives lead data
   - Verify email notifications are sent
   - Check database storage

2. **Test data consistency**:
   - Verify form data matches Crisp conversation data
   - Confirm lead scoring includes Crisp interaction data
   - Test data synchronization between systems
   - Verify no duplicate entries

### **Step 6.5.10: User Experience Testing**
1. **Test conversation flow**:
   - Verify AI agent asks relevant questions
   - Test conversation naturalness and flow
   - Confirm AI agent understands user responses
   - Test conversation completion and handoff

2. **Test user satisfaction**:
   - Gather feedback on chat experience
   - Test conversation completion rates
   - Verify user satisfaction with AI responses
   - Test user willingness to continue conversation

### **Step 6.5.11: Analytics and Reporting Test**
1. **Test Crisp analytics**:
   - Verify conversation tracking
   - Test lead conversion tracking
   - Confirm AI agent performance metrics
   - Test reporting accuracy

2. **Test integration analytics**:
   - Verify form-to-chat conversion rates
   - Test chat-to-lead conversion rates
   - Confirm overall lead quality improvement
   - Test ROI measurement capabilities

---

## **📊 PHASE 7: Monitoring & Analytics**

### **Step 7.1: Set Up Monitoring**
1. **Configure** 8n8 execution monitoring
2. **Set up** error alerts
3. **Monitor** webhook response times
4. **Track** lead processing success rate

### **Step 7.2: Analytics Dashboard**
1. **Create** lead analytics dashboard
2. **Track** conversion rates
3. **Monitor** lead quality scores
4. **Analyze** response times

---

## **🔒 PHASE 8: Security & Compliance**

### **Step 8.1: Security Configuration**
1. **Enable** HTTPS for all webhook calls
2. **Configure** proper authentication
3. **Set up** rate limiting
4. **Implement** input validation

### **Step 8.2: GDPR Compliance**
1. **Ensure** data retention policies
2. **Implement** data deletion requests
3. **Log** consent status
4. **Audit** data processing

---

## **✅ SUCCESS CRITERIA**

### **Functional Requirements**
- ✅ Webhook receives form data within 5 seconds
- ✅ Lead scoring works correctly
- ✅ Emails are sent to all recipients
- ✅ Database storage functions properly
- ✅ AI agent provides analysis
- ✅ Auto-response is sent to user
- ✅ Crisp script loads correctly on all pages
- ✅ Crisp chat widget appears and functions properly
- ✅ Form submission automatically opens Crisp chat
- ✅ AI agent greets users and asks relevant questions
- ✅ AI agent can handoff to human experts
- ✅ Integration works across all browsers and devices

### **Performance Requirements**
- ✅ Webhook response time < 5 seconds
- ✅ Email delivery < 30 seconds
- ✅ Database storage < 3 seconds
- ✅ AI processing < 10 seconds
- ✅ Crisp script load time < 2 seconds
- ✅ Chat widget response time < 1 second
- ✅ AI agent response time < 3 seconds
- ✅ Page load performance impact < 10%

### **Security Requirements**
- ✅ HTTPS encryption for all data
- ✅ Bearer token authentication
- ✅ Input validation and sanitization
- ✅ GDPR compliance maintained
- ✅ Crisp data transmission over HTTPS
- ✅ Secure session management
- ✅ No sensitive data exposure in browser
- ✅ Proper data retention and deletion

---

## **🚨 TROUBLESHOOTING**

### **Common Issues**
1. **Webhook not receiving data**: Check URL and authentication
2. **Emails not sending**: Verify email service configuration
3. **Database errors**: Check database connection and schema
4. **AI processing fails**: Verify API keys and quotas

### **Support Resources**
- **8n8 Documentation**: https://docs.8n8.io
- **8n8 Community**: https://community.8n8.io
- **Email Service Support**: Check your email provider's documentation

**Would you like me to help you with any specific step in this integration plan?**

