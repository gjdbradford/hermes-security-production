# 🚀 **Contact Form Test Plan - Updated for v1.2.0**

## **📋 OVERVIEW**
This document outlines the comprehensive testing approach for the Hermes Security contact form, including all recent updates for mobile number validation, SMS/API compatibility, and form submission improvements.

---

## **🎯 TEST STRATEGY**

### **Primary Changes in v1.2.0**
- ✅ **All CTA buttons** now navigate to contact form (not Crisp chat)
- ✅ **Contact form** is the primary conversion point
- ✅ **TriggerHandlers.contactForm()** replaces discovery call triggers
- ✅ **Navigation** uses `window.location.href = '/#/contact'`
- ✅ **SMS-Compatible Mobile Validation** for all countries
- ✅ **Country-Specific Digit Validation** with proper E.164 formatting
- ✅ **Enhanced reCAPTCHA Integration** with proper token handling
- ✅ **Improved ChatBot Integration** with data sanitization
- ✅ **CORS Error Handling** with proxy server support

---

## **🧪 COMPONENT TESTING**

### **1. Hero Section CTA Testing**
**Priority: Critical**

#### **Test Cases**
- [ ] **Banner 1**: "Book Your Pen Test Today" navigates to contact form
- [ ] **Banner 2**: "Book Your Pen Test Today" navigates to contact form
- [ ] **Banner 3**: "Book Your Pen Test Today" navigates to contact form
- [ ] **Banner 4**: "Book Your Pen Test Today" navigates to contact form
- [ ] **Banner 5**: "Book Your Pen Test Today" navigates to contact form
- [ ] **No Crisp Chat**: Crisp chat does not open from hero CTAs

#### **Test Steps**
1. Navigate to homepage
2. Click each "Book Your Pen Test Today" button
3. Verify navigation to contact form page
4. Verify Crisp chat does not open

### **2. Value Proposition CTA Testing**
**Priority: High**

#### **Test Cases**
- [ ] **"Book Your Pen Test Today"** button navigates to contact form
- [ ] **No Crisp Chat**: Crisp chat does not open

#### **Test Steps**
1. Scroll to "Why Hermes Security" section
2. Click "Book Your Pen Test Today" button
3. Verify navigation to contact form page

### **3. Services Section CTA Testing**
**Priority: High**

#### **Test Cases**
- [ ] **"Book Your Security Assessment Today"** button navigates to contact form
- [ ] **No Crisp Chat**: Crisp chat does not open

#### **Test Steps**
1. Scroll to Services section
2. Click "Book Your Security Assessment Today" button
3. Verify navigation to contact form page

### **4. How To Get Services Section CTA Testing**
**Priority: Medium**

#### **Test Cases**
- [ ] **"Book Your Pen Test Today"** button navigates to contact form
- [ ] **No Crisp Chat**: Crisp chat does not open

#### **Test Steps**
1. Scroll to "From findings to fixes" section
2. Click "Book Your Pen Test Today" button
3. Verify navigation to contact form page

### **5. Case Study Section CTA Testing**
**Priority: High**

#### **Test Cases**
- [ ] **"Read the case"** buttons navigate to contact form
- [ ] **All 4 case studies**: Each CTA button works correctly
- [ ] **No Crisp Chat**: Crisp chat does not open

#### **Test Steps**
1. Navigate to case study section
2. Click "Read the case" button for each case study
3. Verify navigation to contact form page

### **6. Final CTA Section Testing**
**Priority: High**

#### **Test Cases**
- [ ] **"Schedule a Discovery Call"** button navigates to contact form
- [ ] **"Start a Pen Test Today"** button navigates to contact form
- [ ] **No Crisp Chat**: Crisp chat does not open

#### **Test Steps**
1. Scroll to final CTA section
2. Click both CTA buttons
3. Verify navigation to contact form page

---

## **📱 MOBILE NUMBER VALIDATION TESTING**

### **1. Country-Specific Validation**
**Priority: Critical**

#### **Test Cases**
- [ ] **South Africa (ZA)**: 9 digits required (e.g., 0769004082)
- [ ] **United States (US)**: 10 digits required (e.g., 1234567890)
- [ ] **United Kingdom (GB)**: 10-11 digits accepted (e.g., 7123456789 or 71234567890)
- [ ] **Germany (DE)**: 10-12 digits accepted
- [ ] **China (CN)**: 11 digits required
- [ ] **India (IN)**: 10 digits required
- [ ] **Australia (AU)**: 9 digits required
- [ ] **Brazil (BR)**: 10-11 digits accepted

#### **Test Steps**
1. Select each country from dropdown
2. Enter valid mobile number for that country
3. Verify green checkmark and E.164 format display
4. Enter invalid digit count
5. Verify specific error message with expected range

#### **Validation Examples**
| Country | Valid Example | Invalid Example | Expected Error |
|---------|---------------|-----------------|----------------|
| South Africa | 0769004082 | 076900408 | "Please enter 9 digits for South Africa (currently 8)" |
| United States | 1234567890 | 123456789 | "Please enter 10 digits for United States (currently 9)" |
| United Kingdom | 7123456789 | 712345678 | "Please enter 10-11 digits for United Kingdom (currently 9)" |
| China | 13812345678 | 1381234567 | "Please enter 11 digits for China (currently 10)" |

### **2. E.164 Format Validation**
**Priority: Critical**

#### **Test Cases**
- [ ] **Proper E.164 Format**: All numbers display as +[country code][digits]
- [ ] **Leading Zero Removal**: National numbers with leading zeros are handled correctly
- [ ] **International Format**: Numbers are properly formatted for SMS services
- [ ] **No Special Characters**: Only digits and + are allowed in E.164 format

#### **Test Steps**
1. Enter mobile number with leading zero (e.g., 0769004082)
2. Verify E.164 format shows +27769004082 (for South Africa)
3. Test with various country codes
4. Verify no spaces, dashes, or parentheses in E.164 format

### **3. SMS/API Compatibility**
**Priority: Critical**

#### **Test Cases**
- [ ] **Brevo API Compatibility**: All validated numbers work with Brevo SMS
- [ ] **8n8 Workflow Compatibility**: Numbers don't cause API failures
- [ ] **International SMS**: Numbers are valid for international SMS services
- [ ] **Format Consistency**: All numbers follow E.164 standard

#### **Test Steps**
1. Submit form with valid mobile numbers from different countries
2. Check webhook response for proper phone number format
3. Verify no API errors due to invalid number format
4. Test with SMS service integration

### **4. Real-time Validation Feedback**
**Priority: High**

#### **Test Cases**
- [ ] **Immediate Feedback**: Validation updates as user types
- [ ] **Clear Error Messages**: Specific error messages for each country
- [ ] **Success Indicators**: Green checkmark with E.164 format when valid
- [ ] **Digit Count Display**: Shows current vs expected digit count

#### **Test Steps**
1. Start typing mobile number
2. Verify validation updates in real-time
3. Check error messages are country-specific
4. Verify success indicator shows correct E.164 format

---

## **🔧 TECHNICAL TESTING**

### **1. TriggerHandlers.contactForm() Function**
**Priority: Critical**

#### **Test Cases**
- [ ] **Function exists**: `TriggerHandlers.contactForm()` is defined
- [ ] **Navigation works**: Function navigates to `/#/contact`
- [ ] **Error handling**: Function handles errors gracefully
- [ ] **Fallback**: Fallback navigation works if primary fails

#### **Test Steps**
1. Open browser console
2. Call `TriggerHandlers.contactForm()`
3. Verify navigation to contact page
4. Test error scenarios

### **2. Import Statements**
**Priority: High**

#### **Test Cases**
- [ ] **All components** import `TriggerHandlers` correctly
- [ ] **No import errors**: All imports resolve successfully
- [ ] **Build process**: No TypeScript errors during build

#### **Components to Check**
- [ ] HeroSection.tsx
- [ ] ValueProposition.tsx
- [ ] ServicesSection.tsx
- [ ] HowToGetServicesSection.tsx
- [ ] CaseStudySection.tsx
- [ ] CTASection.tsx

### **3. reCAPTCHA Integration Testing**
**Priority: Critical**

#### **Test Cases**
- [ ] **Token Generation**: reCAPTCHA token is generated on form submission
- [ ] **Token Validation**: Token is properly sent to webhook
- [ ] **Webhook Processing**: Webhook correctly extracts and validates token
- [ ] **Error Handling**: Proper error handling for reCAPTCHA failures
- [ ] **Development Mode**: reCAPTCHA bypass works in development

#### **Test Steps**
1. Submit form with valid data
2. Check console for reCAPTCHA token generation
3. Verify token is included in webhook payload
4. Check webhook response for successful reCAPTCHA verification
5. Test with invalid/expired tokens

### **4. ChatBot Integration Testing**
**Priority: High**

#### **Test Cases**
- [ ] **Data Sanitization**: Form data is properly sanitized for ChatBot
- [ ] **Session Data**: ChatBot receives correct session data
- [ ] **No "Invalid data" Errors**: ChatBot launches without errors
- [ ] **Accessibility**: Dialog components have proper accessibility attributes
- [ ] **Error Handling**: ChatBot handles data errors gracefully

#### **Test Steps**
1. Submit form successfully
2. Verify ChatBot opens without console errors
3. Check ChatBot session data is properly formatted
4. Test with various form data combinations
5. Verify accessibility compliance

### **5. CORS and Webhook Testing**
**Priority: High**

#### **Test Cases**
- [ ] **Webhook Submission**: Form data reaches webhook successfully
- [ ] **CORS Handling**: CORS errors are handled gracefully
- [ ] **Proxy Server**: CORS proxy server works when enabled
- [ ] **Development Bypass**: Webhook bypass works in development mode
- [ ] **Error Recovery**: Proper error messages for webhook failures

#### **Test Steps**
1. Test form submission in development mode
2. Enable CORS proxy and test submission
3. Test webhook bypass functionality
4. Verify error handling for network issues
5. Check webhook response processing

### **6. Build and Deployment**
**Priority: High**

#### **Test Cases**
- [ ] **Development build**: `npm run dev` works without errors
- [ ] **Production build**: `npm run build` completes successfully
- [ ] **No console errors**: No JavaScript errors in browser console
- [ ] **All CTAs work**: All buttons function correctly in production
- [ ] **Mobile validation**: All mobile validation features work in production

---

## **📱 RESPONSIVE TESTING**

### **1. Mobile Testing**
**Priority: High**

#### **Test Cases**
- [ ] **Mobile CTAs**: All CTA buttons work on mobile devices
- [ ] **Touch targets**: Buttons are large enough for touch interaction
- [ ] **Navigation**: Contact form loads correctly on mobile
- [ ] **Performance**: No performance issues on mobile devices

#### **Devices to Test**
- [ ] iPhone (Safari)
- [ ] Android (Chrome)
- [ ] iPad (Safari)
- [ ] Android Tablet (Chrome)

### **2. Desktop Testing**
**Priority: High**

#### **Test Cases**
- [ ] **Desktop CTAs**: All CTA buttons work on desktop
- [ ] **Mouse interaction**: Hover effects work correctly
- [ ] **Keyboard navigation**: Tab navigation works
- [ ] **Performance**: No performance issues on desktop

#### **Browsers to Test**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

---

## **♿ ACCESSIBILITY TESTING**

### **1. Keyboard Navigation**
**Priority: Medium**

#### **Test Cases**
- [ ] **Tab navigation**: All CTA buttons are reachable via Tab
- [ ] **Enter key**: Buttons can be activated with Enter key
- [ ] **Space key**: Buttons can be activated with Space key
- [ ] **Focus indicators**: Clear focus indicators are visible

### **2. Screen Reader Testing**
**Priority: Medium**

#### **Test Cases**
- [ ] **Button labels**: Screen readers announce button text correctly
- [ ] **Navigation**: Screen readers announce navigation to contact form
- [ ] **ARIA labels**: Proper ARIA labels are present
- [ ] **Page titles**: Contact form page has appropriate title

---

## **🚨 ERROR SCENARIOS**

### **1. Network Issues**
**Priority: Medium**

#### **Test Cases**
- [ ] **Slow connection**: CTAs work on slow connections
- [ ] **Offline mode**: Graceful handling when offline
- [ ] **Network errors**: Error handling for network failures

### **2. JavaScript Errors**
**Priority: High**

#### **Test Cases**
- [ ] **Console errors**: No JavaScript errors in console
- [ ] **Function errors**: `TriggerHandlers.contactForm()` handles errors
- [ ] **Import errors**: No module import errors
- [ ] **Build errors**: No TypeScript compilation errors

---

## **✅ SUCCESS CRITERIA**

### **Functional Requirements**
- ✅ All CTA buttons navigate to contact form
- ✅ No Crisp chat opens from CTA buttons
- ✅ Contact form loads correctly
- ✅ Navigation works on all devices and browsers
- ✅ No JavaScript errors in console
- ✅ Build process completes successfully
- ✅ **Mobile number validation works for all countries**
- ✅ **SMS/API compatible E.164 formatting**
- ✅ **reCAPTCHA integration functions properly**
- ✅ **ChatBot launches without errors**
- ✅ **Webhook submission works reliably**

### **Performance Requirements**
- ✅ CTA button response time < 1 second
- ✅ Contact form load time < 3 seconds
- ✅ No performance impact from changes
- ✅ Smooth navigation transitions
- ✅ **Mobile validation response time < 500ms**
- ✅ **Form submission time < 5 seconds**

### **User Experience Requirements**
- ✅ Clear call-to-action text
- ✅ Intuitive navigation flow
- ✅ Consistent behavior across all CTAs
- ✅ No broken links or 404 errors
- ✅ **Clear mobile number validation feedback**
- ✅ **Country-specific error messages**
- ✅ **Real-time validation updates**
- ✅ **Accessible form components**

### **Technical Requirements**
- ✅ **E.164 format compliance for all countries**
- ✅ **SMS service compatibility**
- ✅ **API integration reliability**
- ✅ **Error handling and recovery**
- ✅ **Accessibility compliance (WCAG 2.1)**

---

## **📊 TEST RESULTS TRACKING**

### **Test Execution Log**
| Test Case | Status | Date | Tester | Notes |
|-----------|--------|------|--------|-------|
| **CTA Navigation Tests** | | | | |
| Hero Banner 1 CTA | ⏳ | - | - | - |
| Hero Banner 2 CTA | ⏳ | - | - | - |
| Hero Banner 3 CTA | ⏳ | - | - | - |
| Hero Banner 4 CTA | ⏳ | - | - | - |
| Hero Banner 5 CTA | ⏳ | - | - | - |
| Value Proposition CTA | ⏳ | - | - | - |
| Services Section CTA | ⏳ | - | - | - |
| How To Get Services CTA | ⏳ | - | - | - |
| Case Study CTAs | ⏳ | - | - | - |
| Final CTA Section | ⏳ | - | - | - |
| **Mobile Number Validation Tests** | | | | |
| South Africa (ZA) Validation | ⏳ | - | - | - |
| United States (US) Validation | ⏳ | - | - | - |
| United Kingdom (GB) Validation | ⏳ | - | - | - |
| Germany (DE) Validation | ⏳ | - | - | - |
| China (CN) Validation | ⏳ | - | - | - |
| India (IN) Validation | ⏳ | - | - | - |
| Australia (AU) Validation | ⏳ | - | - | - |
| Brazil (BR) Validation | ⏳ | - | - | - |
| E.164 Format Validation | ⏳ | - | - | - |
| SMS/API Compatibility | ⏳ | - | - | - |
| **Integration Tests** | | | | |
| reCAPTCHA Integration | ⏳ | - | - | - |
| ChatBot Integration | ⏳ | - | - | - |
| CORS and Webhook Testing | ⏳ | - | - | - |
| **Responsive Tests** | | | | |
| Mobile Testing | ⏳ | - | - | - |
| Desktop Testing | ⏳ | - | - | - |
| Accessibility Testing | ⏳ | - | - | - |

**Legend**: ✅ Passed | ❌ Failed | ⏳ Pending | 🔄 In Progress

---

## **🚨 TROUBLESHOOTING**

### **Common Issues**
1. **CTA buttons not working**: Check import statements and function calls
2. **Navigation not working**: Verify `TriggerHandlers.contactForm()` function
3. **Crisp chat still opening**: Check for remaining `discoveryCall()` references
4. **Build errors**: Check TypeScript compilation and import paths

### **Debug Steps**
1. **Check console**: Look for JavaScript errors
2. **Verify imports**: Ensure `TriggerHandlers` is imported correctly
3. **Test function**: Call `TriggerHandlers.contactForm()` in console
4. **Check build**: Run `npm run build` to check for errors

---

**Last Updated**: v1.2.0 - Comprehensive mobile validation, SMS compatibility, and integration improvements
**Next Review**: After deployment and user testing

---

## **🔧 QUICK TEST COMMANDS**

### **Development Testing**
```bash
# Start development server
npm run dev

# Test CORS proxy server
npm run cors-proxy

# Enable webhook bypass for testing
localStorage.setItem('hermes-bypass-webhook', 'true')

# Enable CORS proxy for testing
localStorage.setItem('hermes-use-cors-proxy', 'true')
```

### **Production Testing**
```bash
# Build for production
npm run build

# Test production build
npm run preview

# Run quality checks
npm run quality:check
```

### **Mobile Validation Testing**
```javascript
// Test mobile validation in console
const testNumbers = {
  'ZA': '0769004082',    // South Africa - 9 digits
  'US': '1234567890',    // United States - 10 digits
  'GB': '7123456789',    // United Kingdom - 10 digits
  'CN': '13812345678'    // China - 11 digits
};

// Test each country's validation
Object.entries(testNumbers).forEach(([country, number]) => {
  console.log(`Testing ${country}: ${number}`);
});
```

