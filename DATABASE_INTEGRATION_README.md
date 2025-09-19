# Database Integration Setup Guide
## Hermes Security Contact Form Backup System

### 🎯 Overview
This guide walks you through setting up the PostgreSQL database integration for the Hermes Security contact form system. The integration provides:

- ✅ **Database backup** before 8n8 webhook calls
- ✅ **Unique incremental IDs** for Brevo linking
- ✅ **8n8 response tracking** and retry mechanisms
- ✅ **Data persistence** even if 8n8 fails
- ✅ **Enterprise-grade security** and GDPR compliance

---

## 🚀 Quick Start

### 1. Set up Vercel Postgres Database

#### Option A: Vercel Dashboard (Recommended)
1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to your Hermes Security project
3. Go to **Storage** tab
4. Click **Create Database** → **Postgres**
5. Choose **Free** tier (500MB storage, 1B reads/month)
6. Name it `hermes-database`
7. Copy the connection strings

#### Option B: Vercel CLI
```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Link to your project
vercel link

# Create Postgres database
vercel storage create postgres hermes-database
```

### 2. Configure Environment Variables

Add these environment variables to your Vercel project:

```bash
# Required - Database connection
DATABASE_URL=postgresql://username:password@host:port/database
POSTGRES_URL=postgresql://username:password@host:port/database

# Optional - For connection pooling
POSTGRES_PRISMA_URL=postgresql://username:password@host:port/database?pgbouncer=true&connect_timeout=15
POSTGRES_URL_NON_POOLING=postgresql://username:password@host:port/database

# Optional - Individual components
POSTGRES_USER=username
POSTGRES_HOST=host
POSTGRES_PASSWORD=password
POSTGRES_DATABASE=database

# Application environment
NODE_ENV=production
VERCEL_ENV=production
```

### 3. Deploy Database Schema

```bash
# Install dependencies
npm install

# Run database migrations
npm run db:migrate

# Check migration status
npm run db:migrate:status

# Test database health
npm run db:health
```

### 4. Deploy to Vercel

```bash
# Deploy with new API endpoints
vercel --prod

# Or deploy via Git push (if auto-deployment is enabled)
git add .
git commit -m "Add database integration"
git push origin main
```

---

## 📊 Database Schema

### Enhanced Leads Table
```sql
CREATE TABLE hermes_leads (
    -- Primary identifiers
    id SERIAL PRIMARY KEY,                    -- Unique incremental ID for Brevo
    lead_id VARCHAR(50) UNIQUE NOT NULL,     -- Hermes lead identifier
    brevo_contact_id VARCHAR(100),           -- Brevo CRM contact ID
    
    -- Personal information
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    user_role VARCHAR(100),
    
    -- Business information
    problem_description TEXT NOT NULL,
    company_name VARCHAR(255),
    company_size VARCHAR(50),
    service_urgency VARCHAR(50) NOT NULL DEFAULT 'not-urgent',
    
    -- Consent and legal
    agree_to_terms BOOLEAN NOT NULL DEFAULT FALSE,
    privacy_consent BOOLEAN NOT NULL DEFAULT FALSE,
    marketing_consent BOOLEAN DEFAULT FALSE,
    
    -- Security and validation
    captcha_token VARCHAR(500),
    user_agent TEXT,
    ip_address INET,
    source VARCHAR(50) NOT NULL DEFAULT 'hermes-website',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- 8n8 integration tracking
    n8n_webhook_sent_at TIMESTAMP WITH TIME ZONE,
    n8n_response_received_at TIMESTAMP WITH TIME ZONE,
    n8n_response_data JSONB,
    n8n_success BOOLEAN DEFAULT FALSE,
    n8n_error_message TEXT,
    n8n_retry_count INTEGER DEFAULT 0,
    n8n_last_retry_at TIMESTAMP WITH TIME ZONE,
    
    -- Status and workflow
    status VARCHAR(50) DEFAULT 'new',
    processed_at TIMESTAMP WITH TIME ZONE,
    assigned_to VARCHAR(100),
    notes TEXT,
    
    -- Lead scoring and analysis
    lead_score INTEGER DEFAULT 0,
    priority VARCHAR(20) DEFAULT 'low',
    tags TEXT[],
    ai_analysis JSONB,
    estimated_value DECIMAL(10,2),
    recommended_response_time VARCHAR(50)
);
```

### Key Features
- **Unique incremental ID** (`id`) for Brevo linking
- **8n8 integration tracking** with retry mechanisms
- **GDPR compliance** with data anonymization
- **Performance indexes** for fast queries
- **Audit logging** for security

---

## 🔌 API Endpoints

### 1. Backup Lead (Primary Endpoint)
**POST** `/api/backup-lead`

Backs up form data to database before forwarding to 8n8.

```typescript
// Request
{
  "formData": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "country": "United Kingdom",
    "phoneNumber": "+447700900000",
    "userRole": "CTO",
    "problemDescription": "Need security audit",
    "companyName": "TechCorp",
    "companySize": "51-200",
    "serviceUrgency": "urgent",
    "agreeToTerms": true,
    "privacyConsent": true,
    "marketingConsent": false,
    "captchaToken": "03AGdBq..."
  },
  "metadata": {
    "userAgent": "Mozilla/5.0...",
    "ipAddress": "192.168.1.1"
  }
}

// Response
{
  "success": true,
  "leadId": "HERMES-1k2j3l4m5n6o-p7q8r9",
  "backupId": 123,
  "n8nResponse": {
    "success": true,
    "messageId": "n8n-msg-123"
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "nextSteps": [
    "Lead successfully backed up to database",
    "Data forwarded to 8n8 successfully",
    "Your lead ID is: HERMES-1k2j3l4m5n6o-p7q8r9"
  ]
}
```

### 2. Health Check
**GET** `/api/health/database`

Checks database connectivity and performance.

```typescript
// Response
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "responseTime": 45,
  "database": {
    "connected": true,
    "responseTime": 23
  },
  "statistics": {
    "totalLeads": 1250,
    "newLeads": 45,
    "n8nSuccessRate": 98.5,
    "failedN8nLeads": 3
  }
}
```

### 3. Retrieve Lead
**GET** `/api/leads/{id}`

Retrieves lead information by ID or lead ID.

```typescript
// Response
{
  "success": true,
  "lead": {
    "id": 123,
    "leadId": "HERMES-1k2j3l4m5n6o-p7q8r9",
    "brevoContactId": "brevo-456",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "status": "new",
    "n8nSuccess": true,
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## 🛠️ Development Commands

### Database Management
```bash
# Run migrations
npm run db:migrate

# Rollback migrations
npm run db:migrate:down

# Check migration status
npm run db:migrate:status

# Check database health
npm run db:health

# Seed test data (optional)
npm run db:seed
```

### Testing
```bash
# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration

# Run all tests
npm run test:all

# Test with coverage
npm run test:coverage
```

### Development Mode
```bash
# Start development server
npm run dev

# Test database connection locally
npm run db:health

# Run CORS proxy for local testing
npm run cors-proxy
```

---

## 🔧 Integration with Contact Form

### Option 1: Use Enhanced Contact API (Recommended)
Replace the existing contact API import:

```typescript
// Before
import { submitContactForm } from './services/contactApi';

// After
import { submitContactForm } from './services/contactApiWithDatabase';
```

### Option 2: Update Existing Contact API
Modify your existing contact form component to use the backup API:

```typescript
// In your contact form component
const handleSubmit = async (formData: ContactFormData) => {
  try {
    const response = await fetch('/api/backup-lead', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        formData,
        metadata: {
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        }
      })
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('Lead ID:', result.leadId);
      console.log('Backup ID:', result.backupId);
      // Handle success
    }
  } catch (error) {
    console.error('Submission failed:', error);
  }
};
```

---

## 📈 Monitoring & Maintenance

### Health Monitoring
The system includes comprehensive health monitoring:

- **Database connectivity** checks
- **8n8 integration** success rates
- **Performance metrics** tracking
- **Error rate** monitoring
- **Retry mechanism** status

### Automated Maintenance
- **GDPR compliance** - Automatic data anonymization after 7 years
- **Failed 8n8 retry** - Automatic retry of failed webhook calls
- **Connection pooling** - Automatic connection management
- **Audit logging** - Complete audit trail of all operations

### Manual Maintenance Commands
```bash
# Clean up old leads (GDPR compliance)
npm run db:cleanup

# Check failed 8n8 integrations
npm run db:check-failed

# View database statistics
npm run db:stats

# Export leads data
npm run db:export
```

---

## 🔒 Security Features

### Data Protection
- **Encryption at rest** (Vercel Postgres default)
- **Encryption in transit** (SSL/TLS)
- **Input validation** and sanitization
- **SQL injection prevention**
- **XSS protection**

### Access Control
- **Row-level security** policies
- **Minimal permissions** for database users
- **Audit logging** for all operations
- **Rate limiting** on API endpoints

### GDPR Compliance
- **Data minimization** - Only store necessary data
- **Right to erasure** - Automatic anonymization
- **Data portability** - Export functionality
- **Consent tracking** - Explicit consent flags

---

## 🚨 Troubleshooting

### Common Issues

#### 1. Database Connection Failed
```bash
# Check environment variables
echo $DATABASE_URL

# Test connection
npm run db:health

# Check Vercel logs
vercel logs
```

#### 2. Migration Failed
```bash
# Check migration status
npm run db:migrate:status

# Rollback and retry
npm run db:migrate:down
npm run db:migrate
```

#### 3. 8n8 Integration Failed
```bash
# Check failed leads
npm run db:check-failed

# View 8n8 webhook logs
# Check your 8n8 workflow status
```

#### 4. API Endpoint Not Found
```bash
# Check Vercel deployment
vercel ls

# Check vercel.json configuration
cat vercel.json

# Redeploy
vercel --prod
```

### Debug Mode
Enable debug logging by setting:
```bash
DEBUG=hermes:database,hermes:api
```

---

## 📞 Support

### Documentation
- [Build Plan](./documentation/build-plans/database-integration-build-plan.md)
- [Test Plan](./documentation/test-plans/database-integration-test-plan.md)
- [Security Guide](./documentation/guides/database-security-best-practices.md)
- [Quality Gates](./documentation/guides/database-deployment-quality-gates.md)

### Monitoring
- **Vercel Dashboard** - Database and API monitoring
- **Health Check Endpoint** - `/api/health/database`
- **Application Logs** - Vercel function logs
- **Database Metrics** - Vercel Postgres metrics

---

## ✅ Success Criteria

After successful setup, you should have:

- ✅ **Database backup** working before 8n8 calls
- ✅ **Unique incremental IDs** generated for each lead
- ✅ **8n8 response tracking** and retry mechanisms
- ✅ **Health monitoring** endpoints responding
- ✅ **Data persistence** even if 8n8 fails
- ✅ **Brevo linking capability** using lead IDs
- ✅ **Security compliance** with GDPR requirements

---

*This integration ensures your contact form data is always backed up and provides the foundation for reliable CRM integration with Brevo.*
