# 🧪 **Discovery Call & Crisp Chat Test Plan**

## **📋 Overview**
This test plan covers comprehensive testing of discovery call triggers, Crisp chat window functionality, and AI agent responses across different scenarios and user journeys.

---

## **🎯 Test Environment Setup**

### **Test Environment Requirements**
- **Browser**: Chrome, Firefox, Safari, Edge (latest versions)
- **Devices**: Desktop, Tablet, Mobile
- **Network**: Fast connection, Slow connection (3G), Offline scenarios
- **Crisp Dashboard**: Access to AI Agent configuration
- **Test Data**: Sample phone numbers, email addresses, company information

### **Test Data Preparation**
```javascript
// Test user data
const testUsers = {
  highValue: {
    name: "John Smith",
    phone: "+44 7700 900000",
    email: "john.smith@enterprise.com",
    company: "Enterprise Corp Ltd",
    companySize: "1000+",
    urgency: "Super urgent"
  },
  mediumValue: {
    name: "Sarah Johnson",
    phone: "+44 7700 900001",
    email: "sarah@startup.com",
    company: "Tech Startup Ltd",
    companySize: "51-200",
    urgency: "Urgent"
  },
  lowValue: {
    name: "Mike Wilson",
    phone: "+44 7700 900002",
    email: "mike@smallbiz.com",
    company: "Small Business Ltd",
    companySize: "1-10",
    urgency: "Not urgent"
  }
};
```

---

## **🔧 Phase 1: Discovery Call Button Trigger Tests**

### **Test 1.1: Basic Discovery Call Button Functionality**
**Objective**: Verify discovery call buttons open Crisp chat and send correct trigger

**Test Steps**:
1. Navigate to homepage
2. Click "Schedule a Discovery Call" button in Hero Section
3. Verify Crisp chat window opens
4. Verify trigger message is sent
5. Verify session data is set correctly

**Expected Results**:
- ✅ Chat window opens within 2 seconds
- ✅ Message appears: "Hi! I see you're interested in scheduling a discovery call..."
- ✅ Session data includes: `context: discovery_call`, `intent: high_value`
- ✅ No JavaScript errors in console

**Test Cases**:
```javascript
// Test different discovery call buttons
test("Hero Section Discovery Call Button - Slide 1", () => {
  navigateToHeroSlide(0); // Root causes slide
  clickButton("Schedule a discovery call");
  expect(chatWindow).toBeVisible();
  expect(triggerMessage).toContain("discovery call");
  expect(sessionData.context).toBe("discovery_call");
});

test("Hero Section Discovery Call Button - Slide 2", () => {
  navigateToHeroSlide(1); // Fix asymmetry slide
  clickButton("Schedule a discovery call");
  expect(chatWindow).toBeVisible();
  expect(triggerMessage).toContain("discovery call");
  expect(sessionData.context).toBe("discovery_call");
});

test("Hero Section Engagement Button - Slide 3", () => {
  navigateToHeroSlide(2); // Old way slide
  clickButton("See how we run an engagement");
  expect(chatWindow).toBeVisible();
  expect(triggerMessage).toContain("engagement");
});

test("Hero Section Download Button - Slide 4", () => {
  navigateToHeroSlide(3); // Alerts to action slide
  clickButton("Download our methodology one-pager");
  expect(chatWindow).toBeVisible();
  expect(triggerMessage).toContain("methodology");
});

test("CTA Section Discovery Call Button", () => {
  clickButton("Schedule Now");
  expect(chatWindow).toBeVisible();
  expect(triggerMessage).toContain("discovery call");
});
```

### **Test 1.2: Multiple Discovery Call Button Locations**
**Objective**: Test all discovery call buttons across the site

**Test Locations**:
- [ ] Hero Section - "Schedule a discovery call" (Slide 1: Root causes)
- [ ] Hero Section - "Schedule a discovery call" (Slide 2: Fix asymmetry)
- [ ] Hero Section - "See how we run an engagement" (Slide 3: Old way)
- [ ] Hero Section - "Download our methodology one-pager" (Slide 4: Alerts to action)
- [ ] CTA Section - "Schedule Now"
- [ ] Services Section - "Get Started with Hermes Security"
- [ ] Header - "Get Started" (desktop)
- [ ] Header - "Get Started" (mobile menu)
- [ ] Footer - Any discovery call links

**Test Steps**:
1. Test each button location
2. Verify consistent behavior
3. Verify correct trigger context
4. Test mobile responsiveness

**Expected Results**:
- ✅ All buttons trigger chat window
- ✅ Consistent messaging across all locations
- ✅ Mobile buttons work correctly
- ✅ No duplicate chat windows

### **Test 1.3: Button State and Loading**
**Objective**: Test button behavior during chat opening

**Test Steps**:
1. Click discovery call button
2. Verify button state changes (loading/disabled)
3. Wait for chat to open
4. Verify button returns to normal state

**Expected Results**:
- ✅ Button shows loading state
- ✅ Button is disabled during chat opening
- ✅ Button returns to normal after chat opens
- ✅ No multiple clicks possible

### **Test 1.4: Hero Carousel Functionality**
**Objective**: Test hero carousel with 4 slides

**Test Steps**:
1. Navigate to homepage
2. Verify all 4 hero slides are present
3. Test manual navigation between slides
4. Test auto-rotation functionality
5. Verify discovery call triggers work on each slide
6. Test pause/resume auto-rotation

**Expected Results**:
- ✅ All 4 slides display correctly
- ✅ Manual navigation works (dots and arrows)
- ✅ Auto-rotation cycles through all 4 slides
- ✅ Discovery call triggers work on slides 1 & 2
- ✅ Engagement triggers work on slide 3
- ✅ Download triggers work on slide 4
- ✅ Pause/resume functionality works
- ✅ Slide transitions are smooth

**Hero Slide Content Verification**:
- **Slide 1**: "AI speed. Human ethics. Real impact." - "Don't be in tomorrow's news"
- **Slide 2**: "Fix the Asymmetry" - AI-driven penetration testing
- **Slide 3**: "The old way is gone" - Automated ethical hacking
- **Slide 4**: "From alerts to action" - Enterprise reporting

### **Test 1.5: Services Navigation Anchor**
**Objective**: Test Services navigation link anchors to Service Catalogue section

**Test Steps**:
1. Navigate to homepage
2. Click "Services" in the main navigation menu
3. Verify page scrolls to Service Catalogue section
4. Verify URL updates with #services anchor
5. Test on both desktop and mobile navigation
6. Test keyboard navigation to Services link

**Expected Results**:
- ✅ Clicking "Services" scrolls to Service Catalogue section
- ✅ URL updates to include #services anchor
- ✅ Service Catalogue title "Service Catalogue" is visible
- ✅ Smooth scrolling animation works
- ✅ Works on both desktop and mobile navigation
- ✅ Keyboard navigation accessible (Tab to Services, Enter to activate)
- ✅ No JavaScript errors in console

**Test Cases**:
```javascript
test("Desktop Services Navigation", () => {
  clickNavigationItem("Services");
  expect(page).toHaveURL(/.*#services$/);
  expect(getElementByText("Service Catalogue")).toBeVisible();
  expect(getElementByText("Service Catalogue")).toBeInViewport();
});

test("Mobile Services Navigation", () => {
  openMobileMenu();
  clickNavigationItem("Services");
  expect(page).toHaveURL(/.*#services$/);
  expect(getElementByText("Service Catalogue")).toBeVisible();
  expect(mobileMenu).not.toBeVisible(); // Menu should close
});

test("Keyboard Services Navigation", () => {
  pressKey("Tab"); // Navigate to Services link
  pressKey("Enter"); // Activate Services link
  expect(page).toHaveURL(/.*#services$/);
  expect(getElementByText("Service Catalogue")).toBeVisible();
});
```

---

## **💬 Phase 2: Crisp Chat Window Tests**

### **Test 2.1: Chat Window Opening**
**Objective**: Verify chat window opens correctly

**Test Steps**:
1. Trigger discovery call button
2. Observe chat window animation
3. Verify chat window positioning
4. Test chat window responsiveness

**Expected Results**:
- ✅ Chat window appears in bottom-right corner
- ✅ Smooth opening animation
- ✅ Correct size on all screen sizes
- ✅ No layout shifts on page

### **Test 2.2: Chat Window Functionality**
**Objective**: Test basic chat window features

**Test Steps**:
1. Open chat window
2. Test minimize/maximize
3. Test close functionality
4. Test chat window persistence

**Expected Results**:
- ✅ Minimize button works
- ✅ Maximize button works
- ✅ Close button works
- ✅ Chat state persists during navigation

### **Test 2.3: Chat Window Performance**
**Objective**: Test chat window performance

**Test Steps**:
1. Open chat window multiple times
2. Test on slow network connection
3. Test with multiple browser tabs
4. Test memory usage

**Expected Results**:
- ✅ Chat opens quickly (< 2 seconds)
- ✅ No performance degradation
- ✅ Works on slow connections
- ✅ No memory leaks

---

## **🤖 Phase 3: AI Agent Response Tests**

### **Test 3.1: Initial Discovery Call Response**
**Objective**: Verify AI agent sends correct initial message

**Test Steps**:
1. Click discovery call button
2. Wait for AI agent response
3. Verify message content
4. Verify message timing

**Expected Results**:
- ✅ AI agent responds within 3 seconds
- ✅ Message includes communication options
- ✅ Message is properly formatted
- ✅ Emojis display correctly

**Expected Message**:
```
Hi! I see you're interested in scheduling a discovery call. I can help you schedule this right away.

Would you prefer to:
1. 📞 Have a phone call with our security expert
2. 💬 Chat with us on WhatsApp
3. 📧 Schedule a video call
4. 🗓️ Book a time slot in our calendar

What's your preferred contact method?
```

### **Test 3.2: Communication Preference Responses**
**Objective**: Test AI agent responses to different communication preferences

**Test Scenarios**:
1. **Phone Call Response**
   - User selects: "Have a phone call"
   - Expected: Ask for phone number, preferred time, timezone

2. **WhatsApp Response**
   - User selects: "Chat with us on WhatsApp"
   - Expected: Provide WhatsApp number, offer to initiate conversation

3. **Video Call Response**
   - User selects: "Schedule a video call"
   - Expected: Show available time slots, offer calendar booking

4. **Calendar Response**
   - User selects: "Book a time slot"
   - Expected: Show calendar integration, available slots

**Test Steps**:
1. Trigger discovery call
2. Select each communication option
3. Verify AI agent response
4. Test response timing

**Expected Results**:
- ✅ Each option triggers appropriate response
- ✅ Responses are contextually relevant
- ✅ Response timing is consistent
- ✅ No broken links or invalid information

### **Test 3.3: Phone Number Collection**
**Objective**: Test phone number collection workflow

**Test Steps**:
1. Select phone call option
2. Enter valid phone number
3. Enter invalid phone number
4. Test phone number validation
5. Verify confirmation message

**Valid Phone Numbers**:
- `+44 7700 900000`
- `+1 (555) 123-4567`
- `+33 1 23 45 67 89`

**Invalid Phone Numbers**:
- `1234567890` (no country code)
- `+44` (too short)
- `abc123def` (contains letters)

**Expected Results**:
- ✅ Valid numbers are accepted
- ✅ Invalid numbers show error message
- ✅ Confirmation message appears
- ✅ Phone number is stored correctly

---

## **📱 Phase 4: Mobile and Responsive Tests**

### **Test 4.1: Mobile Device Compatibility**
**Objective**: Test discovery call functionality on mobile devices

**Test Devices**:
- [ ] iPhone (Safari)
- [ ] Android (Chrome)
- [ ] iPad (Safari)
- [ ] Android Tablet (Chrome)

**Test Steps**:
1. Open site on mobile device
2. Click discovery call button
3. Test chat window functionality
4. Test typing and sending messages
5. Test mobile-specific features

**Expected Results**:
- ✅ Chat window adapts to mobile screen
- ✅ Touch interactions work correctly
- ✅ Keyboard doesn't cover chat window
- ✅ WhatsApp option is prominently displayed

### **Test 4.2: Responsive Design**
**Objective**: Test chat window on different screen sizes

**Screen Sizes**:
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)
- [ ] Large Desktop (2560x1440)

**Test Steps**:
1. Test each screen size
2. Verify chat window positioning
3. Test chat window sizing
4. Verify text readability

**Expected Results**:
- ✅ Chat window positioned correctly on all sizes
- ✅ Text is readable on all devices
- ✅ No horizontal scrolling required
- ✅ Chat window doesn't overlap content

---

## **🌐 Phase 5: Cross-Browser Tests**

### **Test 5.1: Browser Compatibility**
**Objective**: Test discovery call functionality across browsers

**Browsers**:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Chrome Mobile
- [ ] Safari Mobile

**Test Steps**:
1. Test each browser
2. Verify chat window opens
3. Test message sending
4. Verify session data
5. Test browser-specific features

**Expected Results**:
- ✅ Works consistently across all browsers
- ✅ No browser-specific errors
- ✅ Session data is set correctly
- ✅ Chat functionality is identical

### **Test 5.2: Browser Console Tests**
**Objective**: Verify no JavaScript errors

**Test Steps**:
1. Open browser developer tools
2. Click discovery call button
3. Monitor console for errors
4. Check network requests
5. Verify Crisp script loading

**Expected Results**:
- ✅ No JavaScript errors
- ✅ Crisp script loads successfully
- ✅ Network requests complete successfully
- ✅ No 404 or 500 errors

---

## **🔒 Phase 6: Security and Privacy Tests**

### **Test 6.1: Data Security**
**Objective**: Verify data is transmitted securely

**Test Steps**:
1. Open browser developer tools
2. Monitor network requests
3. Check for HTTPS usage
4. Verify data encryption
5. Test data transmission

**Expected Results**:
- ✅ All requests use HTTPS
- ✅ No sensitive data in URL parameters
- ✅ Data is encrypted in transit
- ✅ No data leakage in console

### **Test 6.2: Privacy Compliance**
**Objective**: Verify GDPR compliance

**Test Steps**:
1. Check for privacy notices
2. Verify data consent
3. Test data retention
4. Verify user rights

**Expected Results**:
- ✅ Privacy policy is accessible
- ✅ User consent is collected
- ✅ Data retention policies are clear
- ✅ User can request data deletion

---

## **⚡ Phase 7: Performance Tests**

### **Test 7.1: Load Time Tests**
**Objective**: Verify chat window doesn't impact page performance

**Test Steps**:
1. Measure page load time without chat
2. Measure page load time with chat
3. Test chat window load time
4. Monitor resource usage

**Expected Results**:
- ✅ Page load time impact < 10%
- ✅ Chat window loads < 2 seconds
- ✅ No blocking resources
- ✅ Minimal memory usage

### **Test 7.2: Concurrent User Tests**
**Objective**: Test system under load

**Test Steps**:
1. Simulate multiple concurrent users
2. Test chat window performance
3. Monitor server response
4. Test AI agent response time

**Expected Results**:
- ✅ System handles concurrent users
- ✅ Chat response time remains < 3 seconds
- ✅ No system crashes
- ✅ Consistent performance

---

## **🔄 Phase 8: Integration Tests**

### **Test 8.1: CRM Integration**
**Objective**: Verify lead data flows to CRM

**Test Steps**:
1. Complete discovery call flow
2. Verify data is sent to CRM
3. Check data accuracy
4. Test data formatting

**Expected Results**:
- ✅ Lead data is captured correctly
- ✅ Data is sent to CRM system
- ✅ Data format is correct
- ✅ No duplicate entries

### **Test 8.2: Email Integration**
**Objective**: Verify email notifications work

**Test Steps**:
1. Complete discovery call flow
2. Check for email notifications
3. Verify email content
4. Test email delivery

**Expected Results**:
- ✅ Email notifications are sent
- ✅ Email content is correct
- ✅ Emails are delivered
- ✅ No spam filtering issues

---

## **📊 Phase 9: Analytics Tests**

### **Test 9.1: Event Tracking**
**Objective**: Verify analytics events are tracked

**Test Steps**:
1. Open browser developer tools
2. Click discovery call button
3. Monitor analytics events
4. Verify event data

**Expected Results**:
- ✅ Discovery call events are tracked
- ✅ Event data is accurate
- ✅ Events are sent to analytics
- ✅ No duplicate events

### **Test 9.2: Conversion Tracking**
**Objective**: Verify conversion tracking works

**Test Steps**:
1. Complete discovery call flow
2. Verify conversion events
3. Check conversion attribution
4. Test funnel tracking

**Expected Results**:
- ✅ Conversions are tracked
- ✅ Attribution is correct
- ✅ Funnel data is accurate
- ✅ ROI calculations work

---

## **🚨 Phase 10: Error Handling Tests**

### **Test 10.1: Network Error Handling**
**Objective**: Test behavior when network fails

**Test Steps**:
1. Disconnect internet
2. Click discovery call button
3. Reconnect internet
4. Test recovery

**Expected Results**:
- ✅ Graceful error handling
- ✅ User-friendly error messages
- ✅ Automatic retry on reconnect
- ✅ No data loss

### **Test 10.2: Crisp Service Failure**
**Objective**: Test behavior when Crisp is unavailable

**Test Steps**:
1. Simulate Crisp service failure
2. Click discovery call button
3. Verify fallback behavior
4. Test recovery

**Expected Results**:
- ✅ Fallback to contact form
- ✅ User-friendly error message
- ✅ Alternative contact methods shown
- ✅ No broken user experience

---

## **📋 Test Execution Checklist**

### **Pre-Test Setup**
- [ ] Test environment configured
- [ ] Test data prepared
- [ ] Crisp dashboard access verified
- [ ] Analytics tracking enabled
- [ ] CRM integration tested

### **Test Execution**
- [ ] Phase 1: Discovery Call Button Tests
- [ ] Phase 2: Crisp Chat Window Tests
- [ ] Phase 3: AI Agent Response Tests
- [ ] Phase 4: Mobile and Responsive Tests
- [ ] Phase 5: Cross-Browser Tests
- [ ] Phase 6: Security and Privacy Tests
- [ ] Phase 7: Performance Tests
- [ ] Phase 8: Integration Tests
- [ ] Phase 9: Analytics Tests
- [ ] Phase 10: Error Handling Tests

### **Post-Test Validation**
- [ ] All test results documented
- [ ] Issues logged and prioritized
- [ ] Performance metrics recorded
- [ ] User feedback collected
- [ ] Recommendations made

---

## **🎯 Success Criteria**

### **Functional Requirements**
- ✅ All discovery call buttons trigger chat window
- ✅ AI agent responds within 3 seconds
- ✅ Phone number collection works correctly
- ✅ Handoff to human agents functions
- ✅ Works across all browsers and devices

### **Performance Requirements**
- ✅ Chat window opens < 2 seconds
- ✅ AI agent responds < 3 seconds
- ✅ Page load impact < 10%
- ✅ No memory leaks or performance degradation

### **User Experience Requirements**
- ✅ Intuitive and easy to use
- ✅ Clear communication options
- ✅ Responsive design on all devices
- ✅ Error handling is user-friendly
- ✅ High user satisfaction scores

### **Business Requirements**
- ✅ Lead data captured accurately
- ✅ CRM integration works correctly
- ✅ Analytics tracking functions
- ✅ Conversion rates meet targets
- ✅ ROI is measurable and positive

This comprehensive test plan ensures your discovery call system works flawlessly across all scenarios and provides an excellent user experience.
