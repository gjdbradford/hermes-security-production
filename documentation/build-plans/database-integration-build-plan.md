# PostgreSQL Database Integration Build Plan
## Hermes Security Contact Form Backup System

### Overview
This build plan outlines the implementation of a PostgreSQL database backup system for Hermes Security contact form submissions. The database will store all form data before sending to 8n8, ensuring data persistence even if 8n8 fails, and provide a unique incremental ID for linking with Brevo records.

### Architecture Overview

```
Contact Form → Database Backup → 8n8 Webhook → Brevo
     ↓              ↓               ↓          ↓
  Validation    PostgreSQL       Processing   CRM
  & Storage     Storage          & Email      Integration
```

### Phase 1: Database Setup & Configuration

#### 1.1 Database Provider Selection
- **Primary Choice**: Vercel Postgres (Free Tier)
  - 500MB storage
  - 1 billion row reads/month
  - Automatic backups
  - Built-in Vercel integration
  - Connection pooling included

- **Alternative**: Neon (Free Tier)
  - 500MB storage
  - 10GB transfer/month
  - Automatic scaling
  - Branching capabilities

#### 1.2 Database Schema Updates
Update existing schema to include:
- Unique incremental ID (auto-incrementing primary key)
- 8n8 response tracking
- Brevo contact ID linking
- Enhanced metadata fields

#### 1.3 Environment Configuration
```bash
# Vercel Postgres
DATABASE_URL=postgresql://username:password@host:port/database
POSTGRES_URL=postgresql://username:password@host:port/database
POSTGRES_PRISMA_URL=postgresql://username:password@host:port/database?pgbouncer=true&connect_timeout=15
POSTGRES_URL_NON_POOLING=postgresql://username:password@host:port/database
POSTGRES_USER=username
POSTGRES_HOST=host
POSTGRES_PASSWORD=password
POSTGRES_DATABASE=database
```

### Phase 2: API Development

#### 2.1 Database Service Layer
Create `src/services/databaseService.ts`:
- Connection management
- CRUD operations
- Error handling
- Connection pooling
- Transaction management

#### 2.2 Lead Backup API Endpoint
Create `api/backup-lead.ts`:
- Form data validation
- Database insertion
- 8n8 webhook forwarding
- Response handling
- Error recovery

#### 2.3 Database Migration API
Create `api/migrate-database.ts`:
- Schema initialization
- Data migration scripts
- Version control
- Rollback capabilities

### Phase 3: Integration Updates

#### 3.1 Contact Form Service Updates
Modify `src/services/contactApi.ts`:
- Pre-webhook database backup
- Transaction rollback on failure
- Enhanced error handling
- Response correlation

#### 3.2 Database Utilities
Create `src/utils/databaseUtils.ts`:
- Connection helpers
- Query builders
- Data validation
- Error formatting

### Phase 4: Monitoring & Logging

#### 4.1 Database Monitoring
- Connection health checks
- Query performance monitoring
- Error rate tracking
- Storage usage alerts

#### 4.2 Enhanced Logging
- Database operation logging
- 8n8 response tracking
- Error correlation
- Performance metrics

### Phase 5: Security Implementation

#### 5.1 Database Security
- Connection encryption (SSL/TLS)
- Parameterized queries (SQL injection prevention)
- Row-level security policies
- Access control implementation

#### 5.2 API Security
- Request validation
- Rate limiting
- CORS configuration
- Authentication tokens

### Phase 6: Deployment Preparation

#### 6.1 Vercel Configuration Updates
Update `vercel.json`:
- Database API routes
- Environment variables
- Build configurations
- Deployment hooks

#### 6.2 Environment Setup
- Development database
- Staging database
- Production database
- Environment-specific configurations

### Implementation Timeline

#### Week 1: Database Setup
- [ ] Set up Vercel Postgres
- [ ] Create database schema
- [ ] Configure environment variables
- [ ] Test database connectivity

#### Week 2: API Development
- [ ] Create database service layer
- [ ] Implement lead backup API
- [ ] Add migration scripts
- [ ] Unit testing

#### Week 3: Integration & Testing
- [ ] Update contact form service
- [ ] Integration testing
- [ ] Error handling implementation
- [ ] Performance optimization

#### Week 4: Security & Deployment
- [ ] Security implementation
- [ ] Monitoring setup
- [ ] Deployment testing
- [ ] Production deployment

### Database Schema Updates

```sql
-- Enhanced schema with backup tracking
CREATE TABLE hermes_leads (
    id SERIAL PRIMARY KEY,                    -- Unique incremental ID
    lead_id VARCHAR(50) UNIQUE NOT NULL,     -- Hermes lead identifier
    brevo_contact_id VARCHAR(100),           -- Brevo CRM contact ID
    
    -- Form data (all original fields)
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,
    phone_number VARCHAR(50) NOT NULL,       -- Updated field name
    user_role VARCHAR(100),                  -- New field
    problem_description TEXT NOT NULL,
    company_name VARCHAR(255),
    company_size VARCHAR(50),
    service_urgency VARCHAR(50) NOT NULL DEFAULT 'not-urgent',
    agree_to_terms BOOLEAN NOT NULL DEFAULT FALSE,
    privacy_consent BOOLEAN NOT NULL DEFAULT FALSE,
    marketing_consent BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    captcha_token VARCHAR(500),
    user_agent TEXT,
    ip_address INET,
    source VARCHAR(50) NOT NULL DEFAULT 'hermes-website',
    
    -- Processing tracking
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    n8n_webhook_sent_at TIMESTAMP WITH TIME ZONE,
    n8n_response_received_at TIMESTAMP WITH TIME ZONE,
    n8n_response_data JSONB,
    n8n_success BOOLEAN DEFAULT FALSE,
    n8n_error_message TEXT,
    
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
    
    -- Constraints and indexes
    CONSTRAINT idx_hermes_leads_lead_id UNIQUE (lead_id),
    CONSTRAINT idx_hermes_leads_brevo_id UNIQUE (brevo_contact_id)
);

-- Indexes for performance
CREATE INDEX idx_hermes_leads_email ON hermes_leads(email);
CREATE INDEX idx_hermes_leads_created_at ON hermes_leads(created_at);
CREATE INDEX idx_hermes_leads_status ON hermes_leads(status);
CREATE INDEX idx_hermes_leads_n8n_success ON hermes_leads(n8n_success);
CREATE INDEX idx_hermes_leads_brevo_id ON hermes_leads(brevo_contact_id);
```

### API Endpoints

#### POST /api/backup-lead
```typescript
interface BackupLeadRequest {
  formData: ContactFormData;
  metadata: {
    userAgent: string;
    ipAddress?: string;
    timestamp: string;
    captchaToken?: string;
  };
}

interface BackupLeadResponse {
  success: boolean;
  leadId: string;
  backupId: number;
  n8nResponse?: {
    success: boolean;
    messageId?: string;
    error?: string;
  };
  timestamp: string;
}
```

#### GET /api/leads/:id
```typescript
interface LeadResponse {
  id: number;
  leadId: string;
  formData: ContactFormData;
  status: string;
  n8nSuccess: boolean;
  brevoContactId?: string;
  createdAt: string;
  // ... other fields
}
```

### Error Handling Strategy

#### Database Errors
- Connection failures → Retry with exponential backoff
- Query timeouts → Log and return graceful error
- Constraint violations → Validate data before insertion

#### 8n8 Integration Errors
- Webhook failures → Store in database, retry later
- Response parsing errors → Log raw response
- Timeout errors → Implement circuit breaker pattern

#### Recovery Mechanisms
- Automatic retry for failed 8n8 calls
- Manual reprocessing queue
- Data integrity validation
- Backup restoration procedures

### Performance Considerations

#### Database Optimization
- Connection pooling (Vercel Postgres includes this)
- Query optimization
- Index strategy
- Data archiving for old records

#### API Performance
- Async processing where possible
- Response caching
- Rate limiting
- Request validation optimization

### Security Measures

#### Data Protection
- Encryption at rest (Vercel Postgres default)
- Encryption in transit (SSL/TLS)
- PII data handling compliance
- GDPR compliance measures

#### Access Control
- Database user permissions
- API authentication
- Rate limiting
- Input validation and sanitization

### Monitoring & Alerting

#### Key Metrics
- Database connection health
- Query performance
- 8n8 webhook success rate
- Lead processing time
- Error rates

#### Alerts
- Database connectivity issues
- High error rates
- 8n8 integration failures
- Storage quota warnings

### Backup & Recovery

#### Data Backup
- Vercel Postgres automatic backups
- Point-in-time recovery
- Cross-region replication (if needed)

#### Disaster Recovery
- Database restoration procedures
- 8n8 webhook replay capability
- Data migration scripts
- Rollback procedures

### Cost Estimation

#### Vercel Postgres (Free Tier)
- Storage: 500MB (sufficient for ~100k leads)
- Reads: 1B rows/month (more than sufficient)
- Writes: Unlimited (within storage limits)
- **Cost: $0/month**

#### Additional Costs
- Vercel Pro (if needed for higher limits): $20/month
- Monitoring tools: $0 (using Vercel built-in)
- **Total estimated cost: $0-20/month**

### Success Criteria

#### Functional Requirements
- ✅ All form submissions stored in database before 8n8
- ✅ Unique incremental ID for each lead
- ✅ 8n8 response tracking and storage
- ✅ Brevo contact ID linking capability
- ✅ Data persistence even if 8n8 fails

#### Non-Functional Requirements
- ✅ Sub-100ms database insertion time
- ✅ 99.9% uptime for database operations
- ✅ Zero data loss during 8n8 failures
- ✅ GDPR compliance maintained
- ✅ Security best practices implemented

### Risk Mitigation

#### Technical Risks
- Database connection limits → Connection pooling
- 8n8 webhook failures → Retry mechanism
- Data corruption → Validation and constraints
- Performance degradation → Monitoring and optimization

#### Business Risks
- Data loss → Multiple backup strategies
- Compliance violations → Privacy controls
- Cost overruns → Free tier optimization
- Vendor lock-in → Database abstraction layer

### Next Steps

1. **Review and approve** this build plan
2. **Set up Vercel Postgres** database
3. **Create database schema** with migrations
4. **Implement API endpoints** for lead backup
5. **Update contact form service** for database integration
6. **Test integration** thoroughly
7. **Deploy to production** with monitoring

---

*This build plan provides a comprehensive roadmap for implementing a robust PostgreSQL database backup system for the Hermes Security contact form, ensuring data integrity, performance, and compliance.*
