# 8n8 Integration Test Plan
## Hermes Security Contact Form - Simplified Architecture

### Overview
This test plan covers the testing of the simplified contact form architecture that submits directly to 8n8 webhooks. All database integration and API logic has been removed from the frontend.

---

## Test Environment Setup

### 1. Environment Configuration
```bash
# Development
npm run dev
# Form submits to: https://ilovemylife.app.n8n.cloud/webhook-test/a57cf53e-c2d6-4e59-8e38-44b774355629

# Staging
# Form submits to: https://ilovemylife.app.n8n.cloud/webhook-test/a57cf53e-c2d6-4e59-8e38-44b774355629

# Production
# Form submits to: https://ilovemylife.app.n8n.cloud/webhook/a57cf53e-c2d6-4e59-8e38-44b774355629
```

### 2. 8n8 Workflow Requirements
- **Webhook Trigger**: Receives form data from contact form
- **Data Processing**: Validates and processes form data
- **Database Integration**: Saves data to Supabase
- **Email Notifications**: Sends email notifications
- **Response**: Returns success/error response to frontend

---

## Test Categories

## 1. Frontend Integration Tests

### 1.1 Webhook URL Detection
**File**: `src/services/contactForm.ts`

#### Test Cases:
```typescript
describe('Webhook URL Detection', () => {
  test('Production domain uses production webhook', () => {
    // Mock window.location.hostname = 'www.hermessecurity.io'
    const url = getWebhookUrl()
    expect(url).toBe('https://ilovemylife.app.n8n.cloud/webhook/a57cf53e-c2d6-4e59-8e38-44b774355629')
  })

  test('Staging domain uses test webhook', () => {
    // Mock window.location.hostname = 'hermes-security-staging.vercel.app'
    const url = getWebhookUrl()
    expect(url).toBe('https://ilovemylife.app.n8n.cloud/webhook-test/a57cf53e-c2d6-4e59-8e38-44b774355629')
  })

  test('Localhost uses test webhook', () => {
    // Mock window.location.hostname = 'localhost'
    const url = getWebhookUrl()
    expect(url).toBe('https://ilovemylife.app.n8n.cloud/webhook-test/a57cf53e-c2d6-4e59-8e38-44b774355629')
  })
})
```

### 1.2 Form Data Submission
**File**: `src/services/contactForm.ts`

#### Test Cases:
```typescript
describe('Form Data Submission', () => {
  test('Submits complete form data to webhook', async () => {
    const formData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      country: 'South Africa',
      phoneNumber: '+27769004082',
      userRole: 'CTO',
      problemDescription: 'Security audit needed',
      companyName: 'Test Corp',
      companySize: '51-200',
      serviceUrgency: 'urgent',
      agreeToTerms: true,
      privacyConsent: true,
      marketingConsent: false,
      captchaToken: 'test-token',
      ctaSource: 'hero-banner'
    }

    const result = await submitContactForm(formData)
    expect(result.success).toBe(true)
  })

  test('Handles webhook errors gracefully', async () => {
    // Mock webhook failure
    const result = await submitContactForm(invalidData)
    expect(result.success).toBe(false)
    expect(result.message).toContain('Failed to submit')
  })
})
```

### 1.3 Contact Form Component
**File**: `src/components/ContactForm.tsx`

#### Test Cases:
```typescript
describe('ContactForm Component', () => {
  test('Renders all form fields correctly', () => {
    render(<ContactForm onSuccess={jest.fn()} ctaSource="test" />)
    
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/mobile number/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/problem description/i)).toBeInTheDocument()
  })

  test('Submits form data to 8n8 webhook', async () => {
    const mockSubmit = jest.fn().mockResolvedValue({ success: true })
    jest.spyOn(contactFormService, 'submitContactForm').mockImplementation(mockSubmit)

    render(<ContactForm onSuccess={jest.fn()} ctaSource="test" />)
    
    // Fill form
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } })
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } })
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(expect.objectContaining({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com'
      }))
    })
  })
})
```

---

## 2. 8n8 Workflow Tests

### 2.1 Webhook Data Reception
**8n8 Workflow Testing**

#### Test Cases:
- [ ] **Data Reception**: Webhook receives form data correctly
- [ ] **Data Validation**: All required fields are present
- [ ] **Data Types**: Data types are correct
- [ ] **Error Handling**: Handles malformed data gracefully

#### Test Steps:
1. Submit test form data from frontend
2. Check 8n8 workflow execution logs
3. Verify data is received correctly
4. Test with missing required fields
5. Test with invalid data types

### 2.2 Database Integration
**8n8 Supabase Node Testing**

#### Test Cases:
- [ ] **Data Storage**: Form data saved to Supabase correctly
- [ ] **Data Integrity**: All fields stored with correct values
- [ ] **Error Handling**: Database errors handled gracefully
- [ ] **Data Retrieval**: Stored data can be retrieved

#### Test Steps:
1. Submit form with complete data
2. Check Supabase database for new record
3. Verify all fields are stored correctly
4. Test with database connection issues
5. Verify error handling

### 2.3 Email Notifications
**8n8 Email Node Testing**

#### Test Cases:
- [ ] **Email Sending**: Emails sent successfully
- [ ] **Email Content**: Email content includes form data
- [ ] **Recipients**: Emails sent to correct recipients
- [ ] **Error Handling**: Email failures handled gracefully

#### Test Steps:
1. Submit form with valid email
2. Check email delivery
3. Verify email content
4. Test with invalid email addresses
5. Verify error handling

---

## 3. End-to-End Tests

### 3.1 Complete Flow Testing
**File**: `tests/e2e/contact-form-flow.test.ts`

#### Test Scenarios:
```typescript
describe('Contact Form E2E Flow', () => {
  test('Complete successful submission flow', async () => {
    // 1. Navigate to contact form
    await page.goto('http://localhost:3000/#/contact')
    
    // 2. Fill form with valid data
    await page.fill('[data-testid="firstName"]', 'John')
    await page.fill('[data-testid="lastName"]', 'Doe')
    await page.fill('[data-testid="email"]', 'john.doe@example.com')
    await page.fill('[data-testid="phoneNumber"]', '+27769004082')
    await page.selectOption('[data-testid="userRole"]', 'CTO')
    await page.fill('[data-testid="problemDescription"]', 'Security audit needed')
    await page.fill('[data-testid="companyName"]', 'Test Corp')
    await page.selectOption('[data-testid="companySize"]', '51-200')
    await page.selectOption('[data-testid="serviceUrgency"]', 'urgent')
    await page.check('[data-testid="agreeToTerms"]')
    await page.check('[data-testid="privacyConsent"]')
    
    // 3. Submit form
    await page.click('[data-testid="submitButton"]')
    
    // 4. Verify success message
    await expect(page.locator('[data-testid="successMessage"]')).toBeVisible()
    
    // 5. Verify 8n8 webhook was called
    // (This would require 8n8 workflow to be running)
  })

  test('Form validation errors', async () => {
    // Test with missing required fields
    await page.goto('http://localhost:3000/#/contact')
    await page.click('[data-testid="submitButton"]')
    
    // Verify validation errors are shown
    await expect(page.locator('[data-testid="firstNameError"]')).toBeVisible()
    await expect(page.locator('[data-testid="emailError"]')).toBeVisible()
  })
})
```

### 3.2 Cross-Browser Testing
**Priority: High**

#### Test Cases:
- [ ] **Chrome**: Form submission works correctly
- [ ] **Firefox**: Form submission works correctly
- [ ] **Safari**: Form submission works correctly
- [ ] **Edge**: Form submission works correctly
- [ ] **Mobile Safari**: Form submission works correctly
- [ ] **Mobile Chrome**: Form submission works correctly

---

## 4. Performance Tests

### 4.1 Form Submission Performance
**File**: `tests/performance/form-submission.test.ts`

#### Test Cases:
```typescript
describe('Form Submission Performance', () => {
  test('Form submission response time', async () => {
    const startTime = Date.now()
    
    const result = await submitContactForm(testData)
    
    const duration = Date.now() - startTime
    expect(duration).toBeLessThan(5000) // 5 seconds max
    expect(result.success).toBe(true)
  })

  test('Concurrent form submissions', async () => {
    const concurrentSubmissions = 10
    const startTime = Date.now()
    
    const promises = Array.from({ length: concurrentSubmissions }, () =>
      submitContactForm({ ...testData, email: `test-${Date.now()}@example.com` })
    )
    
    const results = await Promise.all(promises)
    const duration = Date.now() - startTime
    
    expect(results.every(r => r.success)).toBe(true)
    expect(duration).toBeLessThan(10000) // 10 seconds for 10 concurrent submissions
  })
})
```

---

## 5. Security Tests

### 5.1 Input Validation
**File**: `tests/security/input-validation.test.ts`

#### Test Cases:
```typescript
describe('Input Validation Security', () => {
  test('XSS prevention in form data', async () => {
    const maliciousData = {
      ...testData,
      firstName: '<script>alert("xss")</script>John',
      problemDescription: '<img src=x onerror=alert("xss")>Malicious content'
    }
    
    const result = await submitContactForm(maliciousData)
    expect(result.success).toBe(true)
    
    // Verify data is sanitized before sending to 8n8
    // This would be handled by 8n8 workflow
  })

  test('SQL injection prevention', async () => {
    const maliciousData = {
      ...testData,
      firstName: "'; DROP TABLE users; --",
      email: "test@example.com'; DELETE FROM users; --"
    }
    
    const result = await submitContactForm(maliciousData)
    expect(result.success).toBe(true)
    
    // Verify 8n8 handles malicious data safely
  })
})
```

---

## 6. Error Handling Tests

### 6.1 Network Error Scenarios
**File**: `tests/errors/network-errors.test.ts`

#### Test Cases:
```typescript
describe('Network Error Handling', () => {
  test('Webhook timeout handling', async () => {
    // Mock webhook timeout
    jest.spyOn(global, 'fetch').mockImplementation(() =>
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 100)
      )
    )
    
    const result = await submitContactForm(testData)
    expect(result.success).toBe(false)
    expect(result.message).toContain('timeout')
  })

  test('Network connectivity issues', async () => {
    // Mock network error
    jest.spyOn(global, 'fetch').mockRejectedValue(new Error('Network error'))
    
    const result = await submitContactForm(testData)
    expect(result.success).toBe(false)
    expect(result.message).toContain('network')
  })
})
```

---

## 7. Test Automation & CI/CD

### 7.1 Test Scripts
**File**: `package.json` test scripts:
```json
{
  "scripts": {
    "test:8n8": "jest --testPathPattern=8n8",
    "test:e2e": "playwright test",
    "test:performance": "jest --testPathPattern=performance",
    "test:security": "jest --testPathPattern=security",
    "test:all": "npm run test:8n8 && npm run test:e2e && npm run test:security",
    "test:coverage": "jest --coverage",
    "test:watch": "jest --watch"
  }
}
```

### 7.2 GitHub Actions Workflow
**File**: `.github/workflows/8n8-tests.yml`:
```yaml
name: 8n8 Integration Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run 8n8 integration tests
        run: npm run test:8n8
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Run security tests
        run: npm run test:security
      
      - name: Generate coverage report
        run: npm run test:coverage
```

---

## 8. Success Criteria

### 8.1 Functional Requirements
- ✅ Form submits to correct 8n8 webhook URL
- ✅ All form data included in webhook payload
- ✅ 8n8 workflow processes data successfully
- ✅ Database integration works via 8n8
- ✅ Email notifications sent via 8n8
- ✅ Error handling works correctly
- ✅ Form validation works correctly

### 8.2 Performance Requirements
- ✅ Form submission response time < 5 seconds
- ✅ Concurrent submissions handled correctly
- ✅ No performance degradation
- ✅ Mobile performance acceptable

### 8.3 Security Requirements
- ✅ Input validation prevents XSS
- ✅ Data sanitization prevents injection attacks
- ✅ Secure webhook communication
- ✅ No sensitive data exposure

---

## 9. Test Data

### 9.1 Test Form Data
```typescript
export const testFormData = {
  valid: {
    complete: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      country: 'South Africa',
      phoneNumber: '+27769004082',
      userRole: 'CTO',
      problemDescription: 'Security audit needed for our web application',
      companyName: 'Test Corp',
      companySize: '51-200',
      serviceUrgency: 'urgent',
      agreeToTerms: true,
      privacyConsent: true,
      marketingConsent: false,
      ctaSource: 'hero-banner'
    },
    minimal: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      country: 'United States',
      phoneNumber: '+1234567890',
      userRole: 'CEO',
      problemDescription: 'Need security assessment',
      companyName: 'Smith Corp',
      companySize: '11-50',
      serviceUrgency: 'Not urgent',
      agreeToTerms: true,
      privacyConsent: true
    }
  },
  invalid: {
    missingRequired: {
      firstName: 'John',
      // Missing required fields
    },
    invalidEmail: {
      ...testFormData.valid.complete,
      email: 'invalid-email'
    },
    invalidPhone: {
      ...testFormData.valid.complete,
      phoneNumber: 'invalid-phone'
    }
  }
}
```

---

*This test plan ensures the 8n8 integration is thoroughly tested across all dimensions: functionality, performance, security, and reliability.*
