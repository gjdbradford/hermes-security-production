# Email Service Test Plan

## Overview
This document outlines the comprehensive testing strategy for the Hermes Security email service integration.

## Test Environments

### Local Development
- **URL**: `http://localhost:8080`
- **API**: Local development server
- **Purpose**: Development and initial testing

### Vercel Preview
- **URL**: Vercel preview deployment
- **API**: Vercel serverless functions
- **Purpose**: Staging and integration testing

### Production
- **URL**: Production domain
- **API**: Production Vercel deployment
- **Purpose**: Production validation

## Test Categories

### 1. Unit Tests

#### Contact API Service Tests
```typescript
// Test file: src/tests/contactApi.test.ts
describe('Contact API Service', () => {
  test('submitContactForm - successful 8n8 submission', async () => {
    // Test successful 8n8 webhook submission
  });

  test('submitContactForm - fallback to email service', async () => {
    // Test fallback when 8n8 fails
  });

  test('sendFallbackEmail - successful email sending', async () => {
    // Test direct email sending
  });
});
```

#### Email Service Tests
```typescript
// Test file: src/tests/emailService.test.ts
describe('Email Service', () => {
  test('generateEmailHeaders - proper header generation', () => {
    // Test email header generation
  });

  test('generateEmailBody - HTML and text formatting', () => {
    // Test email body generation
  });

  test('sendContactFormEmail - successful sending', async () => {
    // Test complete email sending process
  });
});
```

### 2. Integration Tests

#### API Endpoint Tests
```typescript
// Test file: src/tests/api-integration.test.ts
describe('API Integration', () => {
  test('POST /api/send-email - successful email sending', async () => {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testEmailData)
    });
    
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      success: true,
      messageId: expect.any(String)
    });
  });

  test('POST /api/send-email - validation errors', async () => {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}) // Missing required fields
    });
    
    expect(response.status).toBe(400);
  });
});
```

### 3. End-to-End Tests

#### Contact Form Submission Flow
```typescript
// Test file: src/tests/e2e/contact-form.test.ts
describe('Contact Form E2E', () => {
  test('Complete form submission flow', async () => {
    // 1. Fill out contact form
    // 2. Submit form
    // 3. Verify success message
    // 4. Check email delivery
  });

  test('Form validation errors', async () => {
    // Test form validation on incomplete data
  });

  test('Network error handling', async () => {
    // Test behavior when API is unavailable
  });
});
```

## Manual Test Cases

### Test Case 1: Basic Contact Form Submission

**Objective**: Verify basic contact form functionality

**Prerequisites**:
- Email service configured
- SMTP credentials valid
- Contact form accessible

**Steps**:
1. Navigate to contact form
2. Fill in all required fields:
   - First Name: "Test"
   - Last Name: "User"
   - Email: "test@example.com"
   - Country: "United Kingdom"
   - Mobile: "+44 7700 900000"
   - Company: "Test Company"
   - Company Size: "51-200"
   - Service Urgency: "Urgent"
   - Problem Description: "Test security assessment needed"
   - Agree to Terms: ✓
3. Submit form

**Expected Results**:
- ✅ Form submits successfully
- ✅ Success message displayed
- ✅ Email received at gjdbradford@gmail.com
- ✅ Email contains proper headers
- ✅ Email formatted correctly

### Test Case 2: High Priority Submission

**Objective**: Verify high priority email handling

**Steps**:
1. Submit form with Service Urgency: "Super urgent"
2. Check email headers

**Expected Results**:
- ✅ Email has X-Priority: 1
- ✅ Email has X-MSMail-Priority: High
- ✅ Email has Importance: high
- ✅ Subject line indicates urgency

### Test Case 3: 8n8 Fallback Scenario

**Objective**: Test email fallback when 8n8 is unavailable

**Prerequisites**:
- 8n8 webhook temporarily disabled or returning errors

**Steps**:
1. Submit contact form
2. Verify fallback email is sent

**Expected Results**:
- ✅ Fallback email sent successfully
- ✅ User receives appropriate feedback
- ✅ Email contains fallback indicator

### Test Case 4: Email Header Validation

**Objective**: Verify all custom email headers are present

**Steps**:
1. Submit contact form
2. Check received email headers

**Expected Headers**:
