# Database Integration Test Plan - DEPRECATED
## Hermes Security Contact Form - Legacy API Architecture

### ⚠️ **IMPORTANT NOTICE**
**This test plan is DEPRECATED as of v2.0.0**

The contact form architecture has been simplified to submit directly to 8n8 webhooks. All database integration and API logic has been removed from the frontend. 

**Please refer to:**
- `8n8-integration-test-plan.md` - For current testing approach
- `contact-form-test-plan.md` - For updated contact form testing

### Overview (Legacy)
This test plan provided comprehensive testing strategies for the PostgreSQL database integration, ensuring data integrity, performance, security, and reliability of the contact form backup system. This approach has been replaced with direct 8n8 webhook integration.

### Test Environment Setup

#### 1. Environment Configuration
```bash
# Development
DATABASE_URL=postgresql://dev_user:dev_pass@localhost:5432/hermes_dev
NODE_ENV=development

# Staging
DATABASE_URL=postgresql://staging_user:staging_pass@staging-host:5432/hermes_staging
NODE_ENV=staging

# Production
DATABASE_URL=postgresql://prod_user:prod_pass@prod-host:5432/hermes_prod
NODE_ENV=production
```

#### 2. Test Data Management
- **Seed Data**: Pre-populated test leads with various scenarios
- **Mock Data**: Generated test data for load testing
- **Cleanup Scripts**: Automated data cleanup between test runs
- **Data Isolation**: Separate test databases per environment

### Test Categories

## 1. Unit Tests

### 1.1 Database Service Tests
**File**: `src/services/__tests__/databaseService.test.ts`

#### Test Cases:
```typescript
describe('DatabaseService', () => {
  describe('Connection Management', () => {
    test('should establish database connection successfully')
    test('should handle connection failures gracefully')
    test('should implement connection pooling correctly')
    test('should close connections properly on shutdown')
  })

  describe('Lead Operations', () => {
    test('should insert new lead with all required fields')
    test('should insert lead with optional fields')
    test('should handle duplicate lead_id constraint violations')
    test('should update lead status correctly')
    test('should retrieve lead by ID')
    test('should retrieve lead by email')
    test('should handle non-existent lead retrieval')
  })

  describe('Transaction Management', () => {
    test('should commit successful transactions')
    test('should rollback failed transactions')
    test('should handle concurrent transactions')
    test('should maintain data consistency during rollback')
  })

  describe('Error Handling', () => {
    test('should handle database connection errors')
    test('should handle SQL syntax errors')
    test('should handle constraint violations')
    test('should handle timeout errors')
    test('should log errors appropriately')
  })
})
```

#### Test Data Setup:
```typescript
const testLeadData = {
  leadId: 'TEST-LEAD-001',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@test.com',
  country: 'United Kingdom',
  phoneNumber: '+44 7700 900000',
  userRole: 'CTO',
  problemDescription: 'Security audit needed',
  companyName: 'Test Corp',
  companySize: '51-200',
  serviceUrgency: 'urgent',
  agreeToTerms: true,
  privacyConsent: true,
  marketingConsent: false,
  captchaToken: 'test-captcha-token',
  userAgent: 'Mozilla/5.0 Test Browser',
  ipAddress: '127.0.0.1'
}
```

### 1.2 API Endpoint Tests
**File**: `api/__tests__/backup-lead.test.ts`

#### Test Cases:
```typescript
describe('POST /api/backup-lead', () => {
  describe('Valid Requests', () => {
    test('should backup lead and forward to 8n8 successfully')
    test('should handle optional fields correctly')
    test('should return correct response format')
    test('should generate unique incremental ID')
  })

  describe('Invalid Requests', () => {
    test('should reject missing required fields')
    test('should reject invalid email format')
    test('should reject invalid phone number format')
    test('should reject missing consent flags')
    test('should handle malformed JSON')
  })

  describe('Database Integration', () => {
    test('should store lead in database before 8n8 call')
    test('should handle database insertion failures')
    test('should rollback on 8n8 failure')
    test('should maintain data consistency')
  })

  describe('8n8 Integration', () => {
    test('should forward data to 8n8 after database backup')
    test('should handle 8n8 webhook failures')
    test('should store 8n8 response data')
    test('should retry failed 8n8 calls')
  })
})
```

### 1.3 Contact Form Service Tests
**File**: `src/services/__tests__/contactApi.test.ts`

#### Test Cases:
```typescript
describe('ContactApi Integration', () => {
  describe('Database Backup Flow', () => {
    test('should call database backup before 8n8')
    test('should use database backup ID in 8n8 payload')
    test('should handle backup failure gracefully')
    test('should maintain transaction integrity')
  })

  describe('Error Scenarios', () => {
    test('should handle database connection failures')
    test('should handle 8n8 webhook failures')
    test('should handle partial failures')
    test('should provide meaningful error messages')
  })
})
```

## 2. Integration Tests

### 2.1 End-to-End Flow Tests
**File**: `tests/integration/contact-form-flow.test.ts`

#### Test Scenarios:
```typescript
describe('Contact Form E2E Flow', () => {
  test('Complete successful submission flow', async () => {
    // 1. Submit contact form
    // 2. Verify database backup
    // 3. Verify 8n8 webhook call
    // 4. Verify 8n8 response storage
    // 5. Verify response to user
  })

  test('Database backup with 8n8 failure', async () => {
    // 1. Submit contact form
    // 2. Verify database backup
    // 3. Mock 8n8 failure
    // 4. Verify data remains in database
    // 5. Verify retry mechanism
  })

  test('Database failure with form submission', async () => {
    // 1. Mock database failure
    // 2. Submit contact form
    // 3. Verify graceful error handling
    // 4. Verify user notification
  })
})
```

### 2.2 Database Integration Tests
**File**: `tests/integration/database-integration.test.ts`

#### Test Cases:
```typescript
describe('Database Integration', () => {
  test('Lead creation with all fields', async () => {
    const leadData = { /* complete lead data */ }
    const result = await databaseService.createLead(leadData)
    
    expect(result.id).toBeDefined()
    expect(result.leadId).toBe(leadData.leadId)
    expect(result.createdAt).toBeDefined()
  })

  test('Lead retrieval and updates', async () => {
    const lead = await databaseService.createLead(testData)
    const retrieved = await databaseService.getLeadById(lead.id)
    
    expect(retrieved).toEqual(lead)
    
    await databaseService.updateLeadStatus(lead.id, 'processed')
    const updated = await databaseService.getLeadById(lead.id)
    
    expect(updated.status).toBe('processed')
  })

  test('Concurrent lead creation', async () => {
    const promises = Array.from({ length: 10 }, (_, i) => 
      databaseService.createLead({ ...testData, leadId: `TEST-${i}` })
    )
    
    const results = await Promise.all(promises)
    expect(results).toHaveLength(10)
    expect(new Set(results.map(r => r.id)).size).toBe(10)
  })
})
```

## 3. Performance Tests

### 3.1 Load Testing
**File**: `tests/performance/load-tests.ts`

#### Test Scenarios:
```typescript
describe('Performance Tests', () => {
  test('Database insertion performance', async () => {
    const startTime = Date.now()
    
    for (let i = 0; i < 100; i++) {
      await databaseService.createLead({
        ...testData,
        leadId: `LOAD-TEST-${i}`,
        email: `load-test-${i}@example.com`
      })
    }
    
    const duration = Date.now() - startTime
    expect(duration).toBeLessThan(5000) // 5 seconds for 100 insertions
  })

  test('Concurrent request handling', async () => {
    const concurrentRequests = 50
    const startTime = Date.now()
    
    const promises = Array.from({ length: concurrentRequests }, (_, i) =>
      fetch('/api/backup-lead', {
        method: 'POST',
        body: JSON.stringify({
          ...testData,
          leadId: `CONCURRENT-${i}`,
          email: `concurrent-${i}@example.com`
        })
      })
    )
    
    const responses = await Promise.all(promises)
    const duration = Date.now() - startTime
    
    expect(responses.every(r => r.ok)).toBe(true)
    expect(duration).toBeLessThan(10000) // 10 seconds for 50 concurrent requests
  })
})
```

### 3.2 Database Performance Tests
```typescript
describe('Database Performance', () => {
  test('Query performance with large dataset', async () => {
    // Insert 1000 test leads
    await seedLargeDataset(1000)
    
    const startTime = Date.now()
    const leads = await databaseService.getLeadsByStatus('new')
    const duration = Date.now() - startTime
    
    expect(leads).toHaveLength(1000)
    expect(duration).toBeLessThan(1000) // 1 second for 1000 records
  })

  test('Index effectiveness', async () => {
    // Test email lookup performance
    const startTime = Date.now()
    const lead = await databaseService.getLeadByEmail('test@example.com')
    const duration = Date.now() - startTime
    
    expect(lead).toBeDefined()
    expect(duration).toBeLessThan(100) // 100ms for indexed lookup
  })
})
```

## 4. Security Tests

### 4.1 Input Validation Tests
**File**: `tests/security/input-validation.test.ts`

#### Test Cases:
```typescript
describe('Input Validation Security', () => {
  test('SQL injection prevention', async () => {
    const maliciousData = {
      ...testData,
      firstName: "'; DROP TABLE hermes_leads; --",
      email: "test@example.com'; DELETE FROM hermes_leads; --"
    }
    
    const result = await databaseService.createLead(maliciousData)
    expect(result.id).toBeDefined()
    
    // Verify table still exists and data was sanitized
    const leads = await databaseService.getAllLeads()
    expect(leads.length).toBeGreaterThan(0)
  })

  test('XSS prevention in stored data', async () => {
    const xssData = {
      ...testData,
      problemDescription: '<script>alert("xss")</script>Malicious content',
      companyName: '<img src=x onerror=alert("xss")>'
    }
    
    const result = await databaseService.createLead(xssData)
    expect(result.problemDescription).not.toContain('<script>')
    expect(result.companyName).not.toContain('<img')
  })

  test('Data sanitization', async () => {
    const unsanitizedData = {
      ...testData,
      firstName: '  John  ',
      email: '  JOHN.DOE@EXAMPLE.COM  ',
      phoneNumber: '+44 (7700) 900-000'
    }
    
    const result = await databaseService.createLead(unsanitizedData)
    expect(result.firstName).toBe('John')
    expect(result.email).toBe('john.doe@example.com')
    expect(result.phoneNumber).toBe('+447700900000')
  })
})
```

### 4.2 Authentication & Authorization Tests
```typescript
describe('API Security', () => {
  test('Unauthorized access prevention', async () => {
    const response = await fetch('/api/leads/1', {
      method: 'GET',
      headers: { 'Authorization': 'Bearer invalid-token' }
    })
    
    expect(response.status).toBe(401)
  })

  test('Rate limiting', async () => {
    const requests = Array.from({ length: 101 }, () =>
      fetch('/api/backup-lead', {
        method: 'POST',
        body: JSON.stringify(testData)
      })
    )
    
    const responses = await Promise.all(requests)
    const rateLimited = responses.filter(r => r.status === 429)
    
    expect(rateLimited.length).toBeGreaterThan(0)
  })
})
```

## 5. Data Integrity Tests

### 5.1 Transaction Tests
**File**: `tests/integrity/transaction-tests.ts`

#### Test Cases:
```typescript
describe('Data Integrity', () => {
  test('Atomic transaction rollback', async () => {
    const initialCount = await databaseService.getLeadCount()
    
    try {
      await databaseService.createLeadWithTransaction({
        ...testData,
        leadId: 'TRANSACTION-TEST'
      })
      
      // Simulate 8n8 failure
      throw new Error('8n8 webhook failed')
    } catch (error) {
      // Transaction should be rolled back
    }
    
    const finalCount = await databaseService.getLeadCount()
    expect(finalCount).toBe(initialCount)
  })

  test('Data consistency during concurrent operations', async () => {
    const leadId = 'CONCURRENT-INTEGRITY-TEST'
    
    const promises = [
      databaseService.createLead({ ...testData, leadId }),
      databaseService.createLead({ ...testData, leadId }),
      databaseService.updateLeadStatus(leadId, 'processed')
    ]
    
    const results = await Promise.allSettled(promises)
    const successes = results.filter(r => r.status === 'fulfilled')
    
    // Only one should succeed due to unique constraint
    expect(successes).toHaveLength(1)
  })
})
```

### 5.2 Data Validation Tests
```typescript
describe('Data Validation', () => {
  test('Required field validation', async () => {
    const incompleteData = {
      firstName: 'John',
      // Missing required fields
    }
    
    await expect(databaseService.createLead(incompleteData))
      .rejects.toThrow('Required fields missing')
  })

  test('Data type validation', async () => {
    const invalidData = {
      ...testData,
      leadScore: 'invalid-number',
      agreeToTerms: 'not-boolean'
    }
    
    await expect(databaseService.createLead(invalidData))
      .rejects.toThrow('Invalid data types')
  })
})
```

## 6. Error Handling Tests

### 6.1 Database Error Scenarios
**File**: `tests/errors/database-errors.test.ts`

#### Test Cases:
```typescript
describe('Database Error Handling', () => {
  test('Connection timeout handling', async () => {
    // Mock database timeout
    jest.spyOn(databaseService, 'createLead')
      .mockRejectedValue(new Error('Connection timeout'))
    
    const response = await fetch('/api/backup-lead', {
      method: 'POST',
      body: JSON.stringify(testData)
    })
    
    expect(response.status).toBe(503)
    const error = await response.json()
    expect(error.error).toContain('Database unavailable')
  })

  test('Constraint violation handling', async () => {
    // Create duplicate lead
    await databaseService.createLead(testData)
    
    const response = await fetch('/api/backup-lead', {
      method: 'POST',
      body: JSON.stringify(testData)
    })
    
    expect(response.status).toBe(409)
    const error = await response.json()
    expect(error.error).toContain('Duplicate lead')
  })
})
```

### 6.2 8n8 Integration Error Tests
```typescript
describe('8n8 Integration Errors', () => {
  test('8n8 webhook timeout', async () => {
    // Mock 8n8 timeout
    jest.spyOn(n8nService, 'sendWebhook')
      .mockRejectedValue(new Error('Request timeout'))
    
    const response = await fetch('/api/backup-lead', {
      method: 'POST',
      body: JSON.stringify(testData)
    })
    
    expect(response.status).toBe(200) // Database backup succeeded
    const result = await response.json()
    expect(result.n8nResponse.success).toBe(false)
    expect(result.n8nResponse.error).toContain('timeout')
  })

  test('8n8 webhook failure with retry', async () => {
    let callCount = 0
    jest.spyOn(n8nService, 'sendWebhook')
      .mockImplementation(() => {
        callCount++
        if (callCount < 3) {
          throw new Error('Temporary failure')
        }
        return Promise.resolve({ success: true })
      })
    
    const response = await fetch('/api/backup-lead', {
      method: 'POST',
      body: JSON.stringify(testData)
    })
    
    expect(response.status).toBe(200)
    expect(callCount).toBe(3) // Should retry 3 times
  })
})
```

## 7. Monitoring & Alerting Tests

### 7.1 Health Check Tests
**File**: `tests/monitoring/health-checks.test.ts`

#### Test Cases:
```typescript
describe('Health Checks', () => {
  test('Database health check', async () => {
    const response = await fetch('/api/health/database')
    
    expect(response.status).toBe(200)
    const health = await response.json()
    expect(health.status).toBe('healthy')
    expect(health.responseTime).toBeLessThan(1000)
  })

  test('8n8 integration health check', async () => {
    const response = await fetch('/api/health/n8n')
    
    expect(response.status).toBe(200)
    const health = await response.json()
    expect(health.status).toBe('healthy')
    expect(health.lastSuccessfulCall).toBeDefined()
  })
})
```

### 7.2 Metrics Collection Tests
```typescript
describe('Metrics Collection', () => {
  test('Lead creation metrics', async () => {
    await databaseService.createLead(testData)
    
    const metrics = await metricsService.getMetrics()
    expect(metrics.totalLeads).toBeGreaterThan(0)
    expect(metrics.averageResponseTime).toBeDefined()
  })

  test('Error rate tracking', async () => {
    // Generate some errors
    await databaseService.createLead({ ...testData, leadId: 'ERROR-TEST-1' })
    await databaseService.createLead({ ...testData, leadId: 'ERROR-TEST-1' }) // Duplicate
    
    const metrics = await metricsService.getErrorMetrics()
    expect(metrics.errorRate).toBeGreaterThan(0)
    expect(metrics.constraintViolations).toBeGreaterThan(0)
  })
})
```

## 8. Test Automation & CI/CD

### 8.1 Test Scripts
**File**: `package.json` test scripts:
```json
{
  "scripts": {
    "test:unit": "jest --testPathPattern=__tests__",
    "test:integration": "jest --testPathPattern=integration",
    "test:performance": "jest --testPathPattern=performance",
    "test:security": "jest --testPathPattern=security",
    "test:all": "npm run test:unit && npm run test:integration && npm run test:security",
    "test:coverage": "jest --coverage",
    "test:watch": "jest --watch",
    "test:ci": "jest --ci --coverage --watchAll=false"
  }
}
```

### 8.2 GitHub Actions Workflow
**File**: `.github/workflows/test.yml`:
```yaml
name: Database Integration Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: hermes_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Setup test database
        run: |
          npm run db:migrate:test
          npm run db:seed:test
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/hermes_test
      
      - name: Run unit tests
        run: npm run test:unit
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/hermes_test
      
      - name: Run integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/hermes_test
      
      - name: Run security tests
        run: npm run test:security
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/hermes_test
      
      - name: Generate coverage report
        run: npm run test:coverage
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/hermes_test
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
```

### 8.3 Test Data Management
**File**: `tests/fixtures/test-data.ts`:
```typescript
export const testLeads = {
  valid: {
    complete: { /* complete lead data */ },
    minimal: { /* minimal required fields */ },
    withOptional: { /* all optional fields included */ }
  },
  invalid: {
    missingRequired: { /* missing required fields */ },
    invalidEmail: { /* invalid email format */ },
    invalidPhone: { /* invalid phone format */ },
    sqlInjection: { /* SQL injection attempts */ },
    xss: { /* XSS attempts */ }
  }
}

export const performanceTestData = {
  bulk: Array.from({ length: 1000 }, (_, i) => ({
    ...testLeads.valid.complete,
    leadId: `PERF-TEST-${i}`,
    email: `perf-test-${i}@example.com`
  }))
}
```

## 9. Test Execution Strategy

### 9.1 Test Phases
1. **Development Phase**: Unit tests run on every commit
2. **Integration Phase**: Integration tests run on pull requests
3. **Pre-deployment**: Full test suite including performance tests
4. **Post-deployment**: Smoke tests and health checks

### 9.2 Test Environment Management
- **Local Development**: SQLite for fast unit tests
- **CI/CD**: PostgreSQL container for integration tests
- **Staging**: Full PostgreSQL instance with production-like data
- **Production**: Read-only tests and health checks only

### 9.3 Test Reporting
- **Coverage Reports**: Minimum 90% code coverage
- **Performance Benchmarks**: Response time and throughput metrics
- **Security Reports**: Vulnerability scans and penetration tests
- **Error Tracking**: Test failure analysis and trend monitoring

## 10. Success Criteria

### 10.1 Functional Requirements
- ✅ All database operations complete successfully
- ✅ 8n8 integration works with proper error handling
- ✅ Data integrity maintained across all scenarios
- ✅ Performance meets specified benchmarks

### 10.2 Non-Functional Requirements
- ✅ 99.9% test pass rate in CI/CD
- ✅ Sub-100ms average database operation time
- ✅ Zero data loss in error scenarios
- ✅ Security vulnerabilities addressed

### 10.3 Quality Gates
- **Unit Tests**: 100% pass rate required
- **Integration Tests**: 100% pass rate required
- **Performance Tests**: Within 10% of benchmarks
- **Security Tests**: Zero high/critical vulnerabilities
- **Coverage**: Minimum 90% code coverage

---

*This comprehensive test plan ensures the PostgreSQL database integration is thoroughly tested across all dimensions: functionality, performance, security, and reliability.*
