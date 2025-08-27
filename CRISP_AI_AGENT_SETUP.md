# 🤖 **Crisp AI Agent Setup Guide for Discovery Calls**

## **📋 Overview**
This guide shows you how to configure your Crisp AI Agent to handle discovery call triggers and collect phone numbers from users.

---

## **🎯 Step 1: Access Crisp Dashboard**

1. **Login** to your Crisp dashboard at https://app.crisp.chat/
2. **Navigate** to "AI Agents" in the left sidebar
3. **Click** "Create AI Agent" or edit your existing agent

---

## **🤖 Step 2: Configure AI Agent Triggers**

### **2.1 Set Up Trigger Keywords**
In your AI Agent settings, add these trigger keywords:

```
discovery call
book call
schedule call
phone call
contact me
get in touch
speak to expert
security consultation
```

### **2.2 Configure Session Data Triggers**
Set up triggers based on session data that your website sends:

```
context: discovery_call
intent: high_value
intent: phone_communication
intent: super_urgent
```

---

## **💬 Step 3: Create AI Agent Responses**

### **3.1 Discovery Call Initial Response**
**Trigger**: When user clicks "Book Discovery Call" button
**Response**:
```
Hi! I see you're interested in booking a discovery call. I can help you schedule this right away.

Would you prefer to:
1. 📞 Have a phone call with our security expert
2. 💬 Chat with us on WhatsApp
3. 📧 Schedule a video call
4. 🗓️ Book a time slot in our calendar

What's your preferred contact method?
```

### **3.2 Phone Call Request Response**
**Trigger**: When user chooses phone call option
**Response**:
```
Perfect! I can arrange a call with our security expert right away.

Could you please provide:
📱 Your phone number
⏰ Your preferred time (we're available 9 AM - 6 PM GMT)
🌍 Your timezone

I'll have our expert call you within 30 minutes, or we can schedule for a specific time that works for you.
```

### **3.3 WhatsApp Request Response**
**Trigger**: When user chooses WhatsApp option
**Response**:
```
Great choice! WhatsApp is perfect for ongoing support.

Here's our WhatsApp number: +44 (0) 20 7946 0958

I'll send you a WhatsApp message right now with:
📋 A quick security assessment questionnaire
📅 Available appointment slots
💬 Direct access to our security experts

Would you like me to initiate the WhatsApp conversation now?
```

### **3.4 Video Call Request Response**
**Trigger**: When user chooses video call option
**Response**:
```
Excellent! Video calls are great for detailed security discussions.

I can schedule a video call with our senior security consultant. Available slots:

📅 Today: 2 PM, 4 PM GMT
📅 Tomorrow: 10 AM, 2 PM, 4 PM GMT
📅 This week: Multiple slots available

What time works best for you? I'll send you a calendar invite with the video call link.
```

### **3.5 Urgent Security Issue Response**
**Trigger**: When user has super urgent security concern
**Response**:
```
🚨 URGENT: I understand you have an immediate security concern.

I'm connecting you with our senior security expert right now.

For immediate assistance:
📞 Call: +44 (0) 20 7946 0958
💬 WhatsApp: +44 (0) 20 7946 0958

Our expert will respond within 5 minutes. What type of security issue are you experiencing?
```

---

## **📱 Step 4: Phone Number Collection Workflow**

### **4.1 Phone Number Validation**
Set up your AI Agent to validate phone numbers:

**Validation Rules**:
- Must contain country code (e.g., +44, +1, +33)
- Must be 10-15 digits total
- Common formats: +44 7700 900000, +1 (555) 123-4567

**AI Agent Response for Invalid Numbers**:
```
I need a valid phone number to arrange your call. Please provide:
- Country code (e.g., +44 for UK, +1 for US)
- Your phone number

Example: +44 7700 900000
```

### **4.2 Phone Number Confirmation**
**AI Agent Response**:
```
Perfect! I have your phone number: [PHONE_NUMBER]

I'll have our security expert call you at [PREFERRED_TIME].

Before I schedule this, could you tell me:
1. What type of security assessment do you need?
2. How urgent is this?
3. What's your company size?

This helps me connect you with the right expert.
```

---

## **🔄 Step 5: Handoff to Human Agent**

### **5.1 Automatic Handoff Rules**
Configure your AI Agent to handoff to human agents when:

1. **Phone number is collected** and confirmed
2. **User requests immediate assistance**
3. **Complex security questions are asked**
4. **User shows high intent (urgent, ready to buy)**

### **5.2 Handoff Message**
**AI Agent Response**:
```
Great! I have all the information I need. Let me connect you with our security expert right now.

[HANDOFF TO HUMAN AGENT]

Hi [HUMAN_NAME], I have [USER_NAME] on the line who needs a discovery call. They're interested in [SERVICE_TYPE] and their phone number is [PHONE_NUMBER]. They prefer [COMMUNICATION_METHOD].
```

---

## **📊 Step 6: Data Collection and CRM Integration**

### **6.1 Required Information Collection**
Your AI Agent should collect:

- **Name**: Full name
- **Phone**: Validated phone number
- **Email**: Email address
- **Company**: Company name and size
- **Service Interest**: Type of security service needed
- **Urgency**: How urgent is the request
- **Preferred Time**: When they want to be contacted
- **Communication Preference**: Phone, WhatsApp, Video, Email

### **6.2 CRM Data Format**
Structure the collected data for your CRM:

```json
{
  "lead": {
    "name": "John Doe",
    "phone": "+44 7700 900000",
    "email": "john@company.com",
    "company": "Tech Corp Ltd",
    "company_size": "51-200",
    "service_interest": "Web Application Pentest",
    "urgency": "Super urgent",
    "preferred_time": "2 PM GMT",
    "communication_preference": "phone",
    "source": "discovery_call_button",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

---

## **⚙️ Step 7: Advanced Configuration**

### **7.1 Multi-language Support**
If you serve multiple countries, set up language detection:

**English Response**:
```
Hi! I can help you book a discovery call...
```

**German Response**:
```
Hallo! Ich kann Ihnen helfen, einen Entdeckungsanruf zu buchen...
```

### **7.2 Time Zone Handling**
Configure your AI Agent to handle different time zones:

**Response with Time Zone**:
```
I see you're in [TIMEZONE]. Our experts are available:
- Your time: 9 AM - 6 PM [LOCAL_TIME]
- GMT: 9 AM - 6 PM

What time works best for you in your timezone?
```

### **7.3 Lead Scoring**
Set up automatic lead scoring based on responses:

**High Value Indicators**:
- Super urgent requests
- Large company size (500+ employees)
- Multiple service interests
- Immediate availability

**Medium Value Indicators**:
- Standard urgency
- Medium company size (50-500 employees)
- Single service interest
- Flexible scheduling

---

## **📈 Step 8: Analytics and Optimization**

### **8.1 Track Key Metrics**
Monitor these metrics in your Crisp dashboard:

- **Chat Initiation Rate**: % of users who start a chat
- **Phone Number Collection Rate**: % of chats that result in phone numbers
- **Handoff Rate**: % of chats handed to human agents
- **Conversion Rate**: % of chats that become qualified leads
- **Response Time**: Time from trigger to first AI response

### **8.2 A/B Testing**
Test different approaches:

**Test A**: Direct phone number request
**Test B**: Multiple communication options
**Test C**: Urgency-based messaging

### **8.3 Optimization Goals**
Target metrics:
- **Phone Number Collection**: > 60%
- **Handoff to Human**: > 40%
- **Lead Conversion**: > 30%
- **Response Time**: < 3 seconds

---

## **🚀 Step 9: Implementation Checklist**

### **✅ Technical Setup**
- [ ] Crisp script loaded on website
- [ ] AI Agent created and configured
- [ ] Trigger keywords set up
- [ ] Session data triggers configured
- [ ] Phone number validation rules set
- [ ] Handoff rules configured

### **✅ Content Setup**
- [ ] Discovery call responses written
- [ ] Phone call workflow created
- [ ] WhatsApp integration set up
- [ ] Video call scheduling configured
- [ ] Urgent response workflow created
- [ ] Multi-language support (if needed)

### **✅ Integration Setup**
- [ ] CRM integration configured
- [ ] Email notifications set up
- [ ] Calendar integration working
- [ ] WhatsApp Business connected
- [ ] Analytics tracking enabled

### **✅ Testing**
- [ ] Test all trigger buttons
- [ ] Verify phone number collection
- [ ] Test handoff to human agents
- [ ] Verify CRM data flow
- [ ] Test mobile responsiveness
- [ ] Test different browsers

---

## **🎯 Success Metrics**

### **Immediate Goals (Week 1-2)**
- Chat initiation rate: 15-25%
- Phone number collection: 50-60%
- Response time: < 3 seconds

### **Medium-term Goals (Month 1-2)**
- Lead conversion rate: 30-40%
- Handoff to human: 40-50%
- User satisfaction: > 85%

### **Long-term Goals (Month 3+)**
- Automated lead qualification: 70-80%
- Reduced response time: < 2 seconds
- Increased conversion rates: 40-50%

This setup will create a seamless discovery call experience that automatically collects phone numbers and connects users with your security experts.
