# 🤖 **Crisp AI Agent - Multiple Entry Trigger Points Plan**

## **📋 OVERVIEW**
This plan outlines multiple strategic entry points to trigger the Crisp AI Agent chat window, providing users with immediate access to AI assistance and human experts across different user journeys and intent levels.

---

## **🎯 PHASE 1: High-Intent Conversion Triggers**

### **1.1 Discovery Call Buttons**
**Location**: Hero Section, CTA Section
**Trigger**: "Schedule a discovery call" / "Schedule Now"
**AI Agent Prompt**: 
```
"Hi! I see you're interested in scheduling a discovery call. I can help you schedule this right away. 

Would you prefer to:
1. 📞 Have a phone call with our security expert
2. 💬 Chat with us on WhatsApp
3. 📧 Schedule a video call
4. 🗓️ Book a time slot in our calendar

What's your preferred contact method?"
```

**Implementation**:
```javascript
// Add to HeroSection.tsx and CTASection.tsx
const handleDiscoveryCall = () => {
  if (window.$crisp) {
    window.$crisp.push(["do", "chat:open"]);
    // Set custom data for AI agent context
    window.$crisp.push(["set", "session:data", [["intent", "discovery_call"]]]);
  }
};
```

### **1.2 Get Started Buttons**
**Location**: Header, Services Section
**Trigger**: "Get Started" / "Get Started with Hermes Security"
**AI Agent Prompt**:
```
"Welcome! I'm here to help you get started with Hermes Security. 

To provide you with the best service, I'd like to understand your needs:

1. 🏢 What type of organization are you?
2. 🛡️ What security challenges are you facing?
3. ⏰ How urgent is your security assessment?
4. 📞 Would you prefer to discuss this over the phone or continue chatting?

Let me know your preference and I'll connect you with the right expert!"
```

---

## **📞 PHASE 2: Communication Preference Triggers**

### **2.1 Phone Number Requests**
**AI Agent Workflow**:
```
User: "I'd like to speak on the phone"
AI: "Perfect! I can arrange a call with our security expert right away. 

Could you please provide:
📱 Your phone number
⏰ Your preferred time (we're available 9 AM - 6 PM GMT)
🌍 Your timezone

I'll have our expert call you within 30 minutes, or we can schedule for a specific time that works for you."
```

### **2.2 WhatsApp Integration**
**AI Agent Workflow**:
```
User: "I'd prefer WhatsApp"
AI: "Great choice! WhatsApp is perfect for ongoing support. 

Here's our WhatsApp number: +44 (0) 20 7946 0958

I'll send you a WhatsApp message right now with:
📋 A quick security assessment questionnaire
📅 Available appointment slots
💬 Direct access to our security experts

Would you like me to initiate the WhatsApp conversation now?"
```

### **2.3 Video Call Scheduling**
**AI Agent Workflow**:
```
User: "I'd like a video call"
AI: "Excellent! Video calls are great for detailed security discussions. 

I can schedule a video call with our senior security consultant. Available slots:

📅 Today: 2 PM, 4 PM GMT
📅 Tomorrow: 10 AM, 2 PM, 4 PM GMT
📅 This week: Multiple slots available

What time works best for you? I'll send you a calendar invite with the video call link."
```

---

## **📚 PHASE 3: Content Engagement Triggers**

### **3.1 Download Methodology**
**Location**: CTA Section
**Trigger**: "Download Guide" button
**AI Agent Prompt**:
```
"Thanks for your interest in our methodology! I'm sending you the comprehensive guide now.

While you review it, would you like me to:
1. 📞 Schedule a call to discuss how this applies to your organization
2. 💬 Answer any specific questions about our approach
3. 📋 Provide a custom security assessment for your needs
4. 🎯 Show you how we can implement this for your specific use case

What would be most helpful for you?"
```

### **3.2 Request Sample Report**
**Location**: CTA Section
**Trigger**: "Request Sample" button
**AI Agent Prompt**:
```
"Great choice! I'm sending you a sample executive report that shows exactly how we present findings to leadership teams.

This sample demonstrates:
📊 Executive-level vulnerability prioritization
🎯 Business impact assessment
📈 Risk scoring methodology
🛠️ Remediation roadmap

Would you like me to:
1. 📞 Walk you through the report structure
2. 💬 Discuss how this applies to your organization
3. 📋 Schedule a custom assessment
4. 🎯 Show you our full reporting capabilities

What interests you most?"
```

---

## **🛡️ PHASE 4: Service-Specific Triggers**

### **4.1 Service Cards**
**Location**: Services Section
**Trigger**: Click on any service card (Web App, API, Mobile, Cloud, etc.)
**AI Agent Prompt**:
```
"I see you're interested in [SERVICE_NAME] security testing. This is one of our most popular services!

Let me ask a few quick questions to provide you with the most relevant information:

1. 🏢 What type of [SERVICE_NAME] are you looking to secure?
2. 📊 How many [SERVICE_NAME] do you have?
3. ⏰ What's your timeline for security assessment?
4. 🎯 Are you looking for compliance (SOC 2, GDPR) or general security?

Based on your answers, I can:
- 📞 Connect you with our [SERVICE_NAME] specialist
- 💬 Provide a custom quote
- 📋 Schedule a technical discussion
- 🎯 Show you our [SERVICE_NAME] methodology

What would you like to know first?"
```

### **4.2 Methodology Stage Clicks**
**Location**: Services Section (Initiate, Discover, Attack, Prioritize)
**Trigger**: Click on any methodology stage
**AI Agent Prompt**:
```
"Excellent! The [STAGE_NAME] stage is crucial for successful security testing. 

Let me explain how we handle [STAGE_NAME]:

[STAGE_SPECIFIC_CONTENT]

Would you like me to:
1. 📞 Schedule a call with our [STAGE_NAME] specialist
2. 💬 Show you our [STAGE_NAME] checklist
3. 📋 Provide a custom [STAGE_NAME] plan for your organization
4. 🎯 Demonstrate our [STAGE_NAME] tools and approach

What would be most valuable for you?"
```

---

## **📱 PHASE 5: Mobile & Accessibility Triggers**

### **5.1 Mobile-Specific Triggers**
**Implementation**:
```javascript
// Detect mobile devices and offer WhatsApp as primary option
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

if (isMobile && window.$crisp) {
  // Customize AI agent for mobile users
  window.$crisp.push(["set", "session:data", [["device", "mobile"]]]);
  
  // Offer WhatsApp as primary option
  const mobilePrompt = `
  "Hi! I see you're on mobile. For the best experience, would you prefer:
  
  1. 💬 Continue chatting here
  2. 📱 Switch to WhatsApp (faster on mobile)
  3. 📞 Get a phone call
  4. 📧 Receive an email with next steps
  
  What works best for you?"
  `;
}
```

### **5.2 Accessibility Triggers**
**Implementation**:
```javascript
// Detect screen readers and offer phone as primary option
const hasScreenReader = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (hasScreenReader && window.$crisp) {
  window.$crisp.push(["set", "session:data", [["accessibility", "screen_reader"]]]);
  
  const accessibilityPrompt = `
  "Hi! I understand you may prefer voice communication. Would you like:
  
  1. 📞 A phone call with our security expert
  2. 💬 Continue with this chat
  3. 📧 Receive detailed information via email
  4. 🗓️ Schedule a video call with captions
  
  What would be most comfortable for you?"
  `;
}
```

---

## **🎯 PHASE 6: Intent-Based Triggers**

### **6.1 High-Value Page Triggers**
**Location**: Contact page, specific service pages
**Trigger**: Page visit + time spent
**Implementation**:
```javascript
// Trigger chat after 30 seconds on high-value pages
let pageTimer;
const startPageTimer = () => {
  pageTimer = setTimeout(() => {
    if (window.$crisp && !window.$crisp.is("visible")) {
      window.$crisp.push(["do", "chat:open"]);
      window.$crisp.push(["set", "session:data", [["trigger", "page_timer"]]]);
    }
  }, 30000); // 30 seconds
};

// Clear timer on page leave
const clearPageTimer = () => {
  if (pageTimer) clearTimeout(pageTimer);
};
```

### **6.2 Scroll-Based Triggers**
**Implementation**:
```javascript
// Trigger chat when user scrolls to bottom of page
const handleScroll = () => {
  const scrollPercentage = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  
  if (scrollPercentage > 80 && window.$crisp && !window.$crisp.is("visible")) {
    window.$crisp.push(["do", "chat:open"]);
    window.$crisp.push(["set", "session:data", [["trigger", "scroll_bottom"]]]);
  }
};
```

### **6.3 Exit Intent Triggers**
**Implementation**:
```javascript
// Trigger chat when user tries to leave the page
const handleExitIntent = (e) => {
  if (e.clientY <= 0 && window.$crisp && !window.$crisp.is("visible")) {
    window.$crisp.push(["do", "chat:open"]);
    window.$crisp.push(["set", "session:data", [["trigger", "exit_intent"]]]);
  }
};

document.addEventListener('mouseleave', handleExitIntent);
```

---

## **🔧 PHASE 7: Implementation Strategy**

### **7.1 Global Crisp Utility**
Create a utility file for managing Crisp triggers:

```javascript
// utils/crispTriggers.ts
export const CrispTriggers = {
  // Open chat with context
  openChat: (context: string, data?: Record<string, any>) => {
    if (window.$crisp) {
      window.$crisp.push(["do", "chat:open"]);
      if (data) {
        window.$crisp.push(["set", "session:data", [Object.entries(data)]]);
      }
      window.$crisp.push(["set", "session:data", [["context", context]]]);
    }
  },

  // Set user preferences
  setPreferences: (preferences: Record<string, any>) => {
    if (window.$crisp) {
      window.$crisp.push(["set", "session:data", [Object.entries(preferences)]]);
    }
  },

  // Track events
  trackEvent: (event: string, data?: Record<string, any>) => {
    if (window.$crisp) {
      window.$crisp.push(["set", "session:data", [["event", event]]]);
      if (data) {
        window.$crisp.push(["set", "session:data", [Object.entries(data)]]);
      }
    }
  }
};
```

### **7.2 Component Integration**
Update components to use the utility:

```javascript
// Example: CTASection.tsx
import { CrispTriggers } from '@/utils/crispTriggers';

const handleDiscoveryCall = () => {
  CrispTriggers.openChat('discovery_call', {
    intent: 'high_value',
    source: 'cta_section'
  });
};

const handleDownloadGuide = () => {
  CrispTriggers.openChat('download_guide', {
    intent: 'content_engagement',
    source: 'methodology_download'
  });
};
```

---

## **📊 PHASE 8: Analytics & Optimization**

### **8.1 Trigger Performance Tracking**
Track the effectiveness of each trigger:

```javascript
// Track trigger performance
const trackTriggerPerformance = (trigger: string, conversion: boolean) => {
  CrispTriggers.trackEvent('trigger_clicked', {
    trigger,
    conversion,
    timestamp: new Date().toISOString(),
    page: window.location.pathname
  });
};
```

### **8.2 A/B Testing Framework**
Test different trigger approaches:

```javascript
// A/B test different trigger messages
const getTriggerMessage = (testGroup: string) => {
  const messages = {
    group_a: "Hi! How can I help you today?",
    group_b: "Welcome! I'm here to assist with your security needs.",
    group_c: "Hello! Ready to secure your digital assets?"
  };
  return messages[testGroup] || messages.group_a;
};
```

---

## **🎯 PHASE 9: Success Metrics**

### **9.1 Key Performance Indicators**
- **Chat Initiation Rate**: % of users who start a chat
- **Conversion Rate**: % of chat users who become leads
- **Response Time**: Time from trigger to first AI response
- **User Satisfaction**: Chat completion rates and feedback
- **Lead Quality**: Quality score of leads from different triggers

### **9.2 Optimization Goals**
- **Target Chat Initiation Rate**: 15-25% of page visitors
- **Target Conversion Rate**: 40-60% of chat users
- **Target Response Time**: < 3 seconds
- **Target User Satisfaction**: > 85% completion rate

---

## **🚀 PHASE 10: Implementation Timeline**

### **Week 1**: High-Intent Triggers
- Implement Discovery Call triggers
- Implement Get Started triggers
- Test basic functionality

### **Week 2**: Communication Triggers
- Implement phone number requests
- Implement WhatsApp integration
- Test communication preferences

### **Week 3**: Content Triggers
- Implement download triggers
- Implement sample request triggers
- Test content engagement

### **Week 4**: Service Triggers
- Implement service card triggers
- Implement methodology triggers
- Test service-specific flows

### **Week 5**: Advanced Triggers
- Implement mobile-specific triggers
- Implement accessibility triggers
- Test advanced scenarios

### **Week 6**: Optimization
- Implement analytics tracking
- A/B test different approaches
- Optimize based on performance data

---

## **✅ SUCCESS CRITERIA**

### **Functional Requirements**
- ✅ All trigger points open Crisp chat correctly
- ✅ AI agent provides contextually relevant responses
- ✅ Communication preferences are properly handled
- ✅ Mobile and accessibility needs are addressed
- ✅ Analytics tracking works accurately

### **Performance Requirements**
- ✅ Chat opens within 1 second of trigger
- ✅ AI agent responds within 3 seconds
- ✅ No impact on page load performance
- ✅ Works across all browsers and devices

### **User Experience Requirements**
- ✅ Natural conversation flow
- ✅ Clear communication options
- ✅ Seamless handoff to human experts
- ✅ High user satisfaction scores

This comprehensive plan provides multiple strategic entry points for the Crisp AI Agent, ensuring users can easily access assistance regardless of their journey stage or preferred communication method.
