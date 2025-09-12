# 🤖 ChatBot Master Rules - Hermes Security

## 📋 **CRITICAL RULES - NEVER BREAK THESE**

### **1. ChatBot Activation Rules**
- **ONLY 2 CTAs** can activate ChatBot:
  1. **"Learn More About Our Services"** button in AboutCTASection.tsx
  2. **Contact Form Submission** (after successful form submission)
- **ALL OTHER CTAs** must use standard `navigateToContact()` function
- **NO OTHER BUTTONS** should launch ChatBot without explicit approval

### **2. Protected CTAs (MUST NOT Launch ChatBot)**
- ✅ **Header "Get In Touch"** button
- ✅ **Hero Section "Book Your Pen Test Today"** button
- ✅ **CTASection "Schedule a Discovery Call"** button
- ✅ **CTASection "Start a Pen Test Today"** button
- ✅ **ServicesSection "Book Your Security Assessment Today"** button
- ✅ **ValueProposition** CTA buttons
- ✅ **HowToGetServicesSection** CTA buttons
- ✅ **CaseStudySection** CTA buttons
- ✅ **AboutCTASection "Start Your Security Journey"** button
- ✅ **Any other CTA buttons** in the application

### **3. ChatBot Integration Requirements**
- **MUST** use Crisp Chat integration (`window.$crisp`)
- **MUST** set proper context data when opening chat
- **MUST** track ChatBot activation events for analytics
- **MUST** work on all environments (dev, staging, production)
- **MUST NOT** interfere with standard CTA navigation logic

### **4. ChatBot Context Data**
- **Service Inquiry**: Context = "service_inquiry", Source = "Learn More About Our Services"
- **Contact Form**: Context = "contact_form_submission", Source = CTA source from form

### **5. Implementation Requirements**
- **MUST** create dedicated ChatBot utility functions
- **MUST** isolate ChatBot logic from CTA navigation logic
- **MUST** ensure ChatBot functions are completely separate from `navigateToContact()`
- **MUST** test ChatBot activation on all environments

## 🔧 **Required Components**

### **ChatBot Utility Functions** (`src/utils/chatbotUtils.ts`)
```typescript
export const ChatBotUtils = {
  // Launch ChatBot for service inquiry
  launchServiceInquiry: (source: string) => {
    // Open Crisp chat with service inquiry context
  },

  // Launch ChatBot after contact form submission
  launchContactFormChat: (formData: ContactFormData, ctaSource: string) => {
    // Open Crisp chat with contact form context
  }
};
```

### **AboutCTASection Integration**
```typescript
// ONLY this button should launch ChatBot
<Button
  variant="outline"
  size="lg"
  onClick={() => ChatBotUtils.launchServiceInquiry('Learn More About Our Services')}
>
  Learn More About Our Services
</Button>
```

### **ContactForm Integration**
```typescript
// After successful form submission
const handleFormSuccess = (data: ContactFormData) => {
  // Launch ChatBot after form submission
  ChatBotUtils.launchContactFormChat(data, ctaSource);
  // Continue with normal form success flow
};
```

## 🚫 **FORBIDDEN PATTERNS**

### **Never Use These**
- ❌ **Modify any other CTA buttons** to launch ChatBot
- ❌ **Change standard CTA navigation logic** for ChatBot
- ❌ **Add ChatBot functionality** to protected CTA buttons
- ❌ **Mix ChatBot logic** with `navigateToContact()` function
- ❌ **Remove ChatBot protection** from other CTAs
- ❌ **Add ChatBot to new CTAs** without explicit approval

### **Protected CTA Buttons (NEVER MODIFY FOR CHATBOT)**
```typescript
// These buttons MUST ALWAYS use navigateToContact()
- Header.tsx: "Get In Touch"
- HeroSection.tsx: "Book Your Pen Test Today"
- CTASection.tsx: "Schedule a Discovery Call"
- CTASection.tsx: "Start a Pen Test Today"
- ServicesSection.tsx: "Book Your Security Assessment Today"
- ValueProposition.tsx: All CTA buttons
- HowToGetServicesSection.tsx: All CTA buttons
- CaseStudySection.tsx: All CTA buttons
- AboutCTASection.tsx: "Start Your Security Journey"
```

## ✅ **Allowed ChatBot Activations**

### **1. Service Inquiry ChatBot**
- **Location**: `src/components/AboutCTASection.tsx`
- **Button**: "Learn More About Our Services"
- **Context**: "service_inquiry"
- **Source**: "Learn More About Our Services"

### **2. Contact Form ChatBot**
- **Location**: `src/components/ContactForm.tsx`
- **Trigger**: After successful form submission
- **Context**: "contact_form_submission"
- **Source**: CTA source from form data

## 🧪 **Testing Requirements**

### **Must Test On All Environments**
- ✅ Development (localhost:5173)
- ✅ Staging (GitHub Pages with `/hermes-security-production/`)
- ✅ Production (Vercel with `/`)

### **Must Verify**
- ✅ **ChatBot launches** only from allowed CTAs
- ✅ **Other CTAs** still navigate to contact page normally
- ✅ **ChatBot context data** is set correctly
- ✅ **Crisp chat widget** opens properly
- ✅ **Analytics tracking** works for ChatBot events
- ✅ **No interference** with standard CTA functionality

### **Protected CTA Testing**
- ✅ **Header "Get In Touch"** → Navigate to contact (NO ChatBot)
- ✅ **Hero CTA** → Navigate to contact (NO ChatBot)
- ✅ **CTA Section buttons** → Navigate to contact (NO ChatBot)
- ✅ **Services CTA** → Navigate to contact (NO ChatBot)
- ✅ **All other CTAs** → Navigate to contact (NO ChatBot)

## 🔄 **Build Validation**

Every build MUST:
1. **Validate ChatBot utility** functions are properly implemented
2. **Check ChatBot activation** works only for allowed CTAs
3. **Verify protected CTAs** still use standard navigation
4. **Test Crisp integration** on all environments
5. **Ensure no ChatBot interference** with CTA logic
6. **Validate ChatBot context data** is set correctly
7. **Test analytics tracking** for ChatBot events

## 📊 **Success Metrics**

### **Key Performance Indicators:**
- ✅ **2 ChatBot activations** working correctly
- ✅ **0 ChatBot interference** with other CTAs
- ✅ **100% protected CTAs** still navigate normally
- ✅ **Proper context data** set for ChatBot sessions
- ✅ **Analytics tracking** for ChatBot events
- ✅ **Cross-environment compatibility** maintained

## 🚨 **Emergency Procedures**

### **If ChatBot Breaks Other CTAs:**
1. **Disable ChatBot functions** immediately
2. **Verify all CTAs** still work normally
3. **Fix ChatBot implementation** in development
4. **Test thoroughly** before re-enabling

### **If New CTA Needs ChatBot:**
1. **Get explicit approval** from project owner
2. **Update this master rules** document
3. **Add to allowed ChatBot activations** list
4. **Test thoroughly** on all environments
5. **Update build validation** requirements

---

## 📞 **Contact & Escalation**

### **If Issues Arise:**
1. **Check this document** for ChatBot rules
2. **Verify protected CTAs** are not affected
3. **Test on staging environment** before production
4. **Document any issues** for future reference

### **For New ChatBot Requests:**
1. **Review this master rules** document
2. **Get explicit approval** for new ChatBot CTAs
3. **Update documentation** before implementation
4. **Test thoroughly** before deployment

---

**⚠️ CRITICAL: Only 2 CTAs can launch ChatBot. All other CTAs are PROTECTED and must continue using standard navigation. Any changes must follow these master rules exactly.**
