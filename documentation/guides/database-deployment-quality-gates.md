# Database Deployment Quality Gates
## Hermes Security Contact Form Backup System

### Overview
This document defines comprehensive quality gates and deployment best practices for the PostgreSQL database integration, ensuring smooth, secure, and reliable deployments with zero downtime and data integrity.

### Quality Gate Framework

#### Gate Categories
1. **Pre-deployment Gates**: Validation before deployment
2. **Deployment Gates**: Checks during deployment process
3. **Post-deployment Gates**: Verification after deployment
4. **Rollback Gates**: Criteria for automatic rollback

---

## 1. Pre-Deployment Quality Gates

### 1.1 Code Quality Gates

#### 1.1.1 Static Analysis
```bash
# ESLint and TypeScript checks
npm run lint
npm run type-check
npm run format:check

# Success Criteria:
# - Zero ESLint errors
# - Zero TypeScript errors
# - 100% code formatting compliance
```

#### 1.1.2 Security Scanning
```bash
# Dependency vulnerability scan
npm audit --audit-level=high

# Code security analysis
npm run security:audit

# Success Criteria:
# - Zero high/critical vulnerabilities
# - All medium vulnerabilities documented
# - Security scan passes with 100% score
```

#### 1.1.3 Database Schema Validation
```bash
# Schema migration validation
npm run db:validate-schema

# Success Criteria:
# - All migrations are reversible
# - No breaking schema changes without version bump
# - Foreign key constraints properly defined
# - Indexes optimized for query patterns
```

### 1.2 Test Quality Gates

#### 1.2.1 Unit Tests
```bash
# Run unit tests with coverage
npm run test:unit
npm run test:coverage

# Success Criteria:
# - 100% test pass rate
# - Minimum 90% code coverage
# - All critical paths covered
# - Test execution time < 30 seconds
```

#### 1.2.2 Integration Tests
```bash
# Run integration tests
npm run test:integration

# Success Criteria:
# - 100% integration test pass rate
# - Database connection tests pass
# - API endpoint tests pass
# - 8n8 integration tests pass
```

#### 1.2.3 Performance Tests
```bash
# Run performance benchmarks
npm run test:performance

# Success Criteria:
# - Database operations < 100ms average
# - API responses < 500ms average
# - Concurrent request handling > 50 req/sec
# - Memory usage within limits
```

### 1.3 Database Quality Gates

#### 1.3.1 Migration Validation
```sql
-- Validate migration scripts
SELECT migration_name, checksum, applied_at 
FROM schema_migrations 
ORDER BY applied_at DESC;

-- Success Criteria:
# - All migrations applied successfully
# - Migration checksums match
# - No pending migrations
# - Database schema version matches code
```

#### 1.3.2 Data Integrity Checks
```sql
-- Check data consistency
SELECT COUNT(*) as total_leads FROM hermes_leads;
SELECT COUNT(*) as orphaned_records FROM hermes_leads WHERE lead_id IS NULL;
SELECT COUNT(*) as duplicate_emails FROM (
    SELECT email, COUNT(*) as cnt 
    FROM hermes_leads 
    GROUP BY email 
    HAVING COUNT(*) > 1
) duplicates;

-- Success Criteria:
# - Zero orphaned records
# - Zero duplicate lead_ids
# - Data constraints enforced
# - Referential integrity maintained
```

#### 1.3.3 Performance Benchmarks
```sql
-- Query performance validation
EXPLAIN ANALYZE SELECT * FROM hermes_leads WHERE email = 'test@example.com';
EXPLAIN ANALYZE SELECT * FROM hermes_leads WHERE created_at > NOW() - INTERVAL '1 day';

-- Success Criteria:
# - Email lookup uses index (Index Scan)
# - Date range queries use index
# - Query execution time < 10ms
# - No sequential scans on large tables
```

### 1.4 Environment Validation

#### 1.4.1 Environment Variables
```bash
# Validate required environment variables
echo "Validating environment variables..."

required_vars=(
    "DATABASE_URL"
    "POSTGRES_URL"
    "NODE_ENV"
    "VERCEL_ENV"
)

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ Missing required environment variable: $var"
        exit 1
    else
        echo "✅ $var is set"
    fi
done

# Success Criteria:
# - All required environment variables present
# - Database URLs properly formatted
# - Environment-specific configurations correct
```

#### 1.4.2 Database Connectivity
```bash
# Test database connection
npm run db:health-check

# Success Criteria:
# - Database connection successful
# - Connection pool healthy
# - Read/write permissions verified
# - SSL connection established
```

---

## 2. Deployment Quality Gates

### 2.1 Build Quality Gates

#### 2.1.1 Build Validation
```bash
# Build for all environments
npm run build:staging
npm run build:production

# Success Criteria:
# - All builds complete successfully
# - No build warnings or errors
# - Bundle size within limits
# - Environment-specific builds differ correctly
```

#### 2.1.2 Asset Validation
```bash
# Validate build assets
npm run assets:validate

# Success Criteria:
# - All required assets present
# - Asset integrity checks pass
# - CDN upload successful
# - Asset versions properly tagged
```

### 2.2 Database Deployment Gates

#### 2.2.1 Migration Deployment
```bash
# Deploy database migrations
npm run db:migrate:production

# Success Criteria:
# - Migrations applied in correct order
# - No migration failures
# - Database schema updated
# - Migration rollback tested
```

#### 2.2.2 Data Migration Validation
```sql
-- Validate data migration
SELECT 
    COUNT(*) as total_records,
    COUNT(DISTINCT lead_id) as unique_leads,
    MIN(created_at) as earliest_record,
    MAX(created_at) as latest_record
FROM hermes_leads;

-- Success Criteria:
# - All records migrated successfully
# - No data loss during migration
# - Data types preserved correctly
# - Constraints applied successfully
```

### 2.3 API Deployment Gates

#### 2.3.1 API Health Checks
```bash
# Deploy API endpoints
npm run deploy:api

# Test API health
curl -f https://api.hermessecurity.io/health/database
curl -f https://api.hermessecurity.io/health/n8n

# Success Criteria:
# - All API endpoints deployed successfully
# - Health checks return 200 OK
# - Database connectivity verified
# - 8n8 integration verified
```

#### 2.3.2 Load Testing
```bash
# Run deployment load tests
npm run test:load:deployment

# Success Criteria:
# - API handles expected load
# - Database performance maintained
# - No memory leaks detected
# - Response times within SLA
```

---

## 3. Post-Deployment Quality Gates

### 3.1 Functional Validation

#### 3.1.1 End-to-End Testing
```bash
# Run post-deployment E2E tests
npm run test:e2e:production

# Success Criteria:
# - Contact form submission works
# - Database backup successful
# - 8n8 integration functional
# - User receives confirmation
```

#### 3.1.2 Database Operations
```sql
-- Test database operations
INSERT INTO hermes_leads (
    lead_id, first_name, last_name, email, country, 
    phone_number, problem_description, service_urgency,
    agree_to_terms, privacy_consent
) VALUES (
    'DEPLOYMENT-TEST-001', 'Test', 'User', 'test@deployment.com',
    'United Kingdom', '+44 7700 900000', 'Deployment test',
    'not-urgent', TRUE, TRUE
);

-- Verify insertion
SELECT * FROM hermes_leads WHERE lead_id = 'DEPLOYMENT-TEST-001';

-- Clean up test data
DELETE FROM hermes_leads WHERE lead_id = 'DEPLOYMENT-TEST-001';

-- Success Criteria:
# - Insert operation successful
# - Data retrieved correctly
# - Cleanup operation successful
# - No side effects on existing data
```

### 3.2 Performance Validation

#### 3.2.1 Response Time Monitoring
```bash
# Monitor API response times
npm run monitor:performance

# Success Criteria:
# - API response times < 500ms
# - Database query times < 100ms
# - 8n8 webhook response < 2s
# - No performance degradation
```

#### 3.2.2 Resource Utilization
```bash
# Monitor resource usage
npm run monitor:resources

# Success Criteria:
# - CPU usage < 80%
# - Memory usage < 90%
# - Database connections < 80% of pool
# - No resource leaks detected
```

### 3.3 Security Validation

#### 3.3.1 Security Scanning
```bash
# Run post-deployment security scan
npm run security:scan:production

# Success Criteria:
# - No new vulnerabilities introduced
# - SSL/TLS configuration correct
# - Authentication mechanisms working
# - Input validation functioning
```

#### 3.3.2 Data Protection Validation
```sql
-- Verify data protection measures
SELECT 
    COUNT(*) as total_records,
    COUNT(*) FILTER (WHERE privacy_consent = true) as consented_records,
    COUNT(*) FILTER (WHERE gdpr_compliant = true) as gdpr_compliant
FROM hermes_leads;

-- Success Criteria:
# - All records have proper consent flags
# - GDPR compliance maintained
# - Data encryption active
# - Access controls enforced
```

---

## 4. Rollback Quality Gates

### 4.1 Automatic Rollback Triggers

#### 4.1.1 Error Rate Thresholds
```yaml
rollback_triggers:
  error_rate:
    threshold: 5%  # Rollback if error rate > 5%
    window: 5m     # Over 5-minute window
    metric: "http_requests_errors_total / http_requests_total"
  
  response_time:
    threshold: 1000ms  # Rollback if response time > 1s
    window: 3m         # Over 3-minute window
    metric: "http_request_duration_seconds"
  
  database_errors:
    threshold: 10  # Rollback if > 10 DB errors
    window: 2m     # Over 2-minute window
    metric: "database_errors_total"
```

#### 4.1.2 Health Check Failures
```bash
# Health check monitoring
while true; do
  if ! curl -f https://api.hermessecurity.io/health/database; then
    echo "Database health check failed - triggering rollback"
    npm run rollback:database
    break
  fi
  
  if ! curl -f https://api.hermessecurity.io/health/n8n; then
    echo "8n8 health check failed - triggering rollback"
    npm run rollback:api
    break
  fi
  
  sleep 30
done

# Success Criteria:
# - Health checks run every 30 seconds
# - Rollback triggered on failure
# - Rollback completes within 5 minutes
# - System restored to previous state
```

### 4.2 Manual Rollback Criteria

#### 4.2.1 Data Integrity Issues
```sql
-- Check for data integrity issues
SELECT 
  COUNT(*) as total_leads,
  COUNT(*) FILTER (WHERE lead_id IS NULL) as missing_lead_ids,
  COUNT(*) FILTER (WHERE email IS NULL) as missing_emails,
  COUNT(*) FILTER (WHERE created_at IS NULL) as missing_timestamps
FROM hermes_leads;

-- Rollback if:
# - Any required fields are NULL
# - Data corruption detected
# - Referential integrity violated
# - Migration rollback required
```

#### 4.2.2 Performance Degradation
```bash
# Monitor performance metrics
if [ "$(get_average_response_time)" -gt 2000 ]; then
  echo "Performance degradation detected - manual rollback required"
  npm run rollback:manual --reason="performance_degradation"
fi

# Rollback if:
# - Response times increase by > 100%
# - Database query times increase by > 200%
# - Memory usage exceeds 95%
# - CPU usage exceeds 90%
```

---

## 5. Deployment Scripts & Automation

### 5.1 Pre-Deployment Script
**File**: `scripts/pre-deployment-check.sh`
```bash
#!/bin/bash
set -e

echo "🚀 Starting pre-deployment quality gates..."

# Code quality checks
echo "📝 Running code quality checks..."
npm run lint
npm run type-check
npm run format:check

# Security checks
echo "🔒 Running security checks..."
npm audit --audit-level=high
npm run security:audit

# Test execution
echo "🧪 Running tests..."
npm run test:unit
npm run test:integration
npm run test:performance

# Database validation
echo "🗄️ Validating database schema..."
npm run db:validate-schema

# Environment validation
echo "🌍 Validating environment..."
npm run validate:environment

# Build validation
echo "🏗️ Validating builds..."
npm run build:staging
npm run build:production

echo "✅ All pre-deployment quality gates passed!"
```

### 5.2 Deployment Script
**File**: `scripts/deploy.sh`
```bash
#!/bin/bash
set -e

echo "🚀 Starting deployment..."

# Database migration
echo "🗄️ Deploying database migrations..."
npm run db:migrate:production

# API deployment
echo "🔌 Deploying API endpoints..."
npm run deploy:api

# Health checks
echo "🏥 Running health checks..."
npm run health:check:deployment

# Load testing
echo "⚡ Running load tests..."
npm run test:load:deployment

echo "✅ Deployment completed successfully!"
```

### 5.3 Post-Deployment Script
**File**: `scripts/post-deployment-validation.sh`
```bash
#!/bin/bash
set -e

echo "🔍 Starting post-deployment validation..."

# Functional testing
echo "🧪 Running functional tests..."
npm run test:e2e:production

# Performance monitoring
echo "📊 Monitoring performance..."
npm run monitor:performance

# Security validation
echo "🔒 Running security validation..."
npm run security:scan:production

# Data validation
echo "📊 Validating data integrity..."
npm run db:validate:data

echo "✅ Post-deployment validation completed!"
```

### 5.4 Rollback Script
**File**: `scripts/rollback.sh`
```bash
#!/bin/bash
set -e

REASON=${1:-"manual_rollback"}
echo "🔄 Starting rollback (reason: $REASON)..."

# Database rollback
echo "🗄️ Rolling back database..."
npm run db:rollback:production

# API rollback
echo "🔌 Rolling back API..."
npm run api:rollback:production

# Validation
echo "✅ Validating rollback..."
npm run health:check:rollback

echo "✅ Rollback completed successfully!"
```

---

## 6. Monitoring & Alerting

### 6.1 Quality Gate Metrics

#### 6.1.1 Deployment Metrics
```typescript
interface DeploymentMetrics {
  deploymentId: string;
  timestamp: Date;
  duration: number;
  success: boolean;
  qualityGatesPassed: number;
  qualityGatesTotal: number;
  rollbackTriggered: boolean;
  rollbackReason?: string;
}
```

#### 6.1.2 Performance Metrics
```typescript
interface PerformanceMetrics {
  averageResponseTime: number;
  databaseQueryTime: number;
  errorRate: number;
  throughput: number;
  resourceUtilization: {
    cpu: number;
    memory: number;
    database: number;
  };
}
```

### 6.2 Alerting Rules

#### 6.2.1 Critical Alerts
```yaml
alerts:
  deployment_failure:
    condition: "deployment_success == false"
    severity: "critical"
    notification: ["slack", "email", "pagerduty"]
  
  database_connection_failure:
    condition: "database_health_check == false"
    severity: "critical"
    notification: ["slack", "email", "pagerduty"]
  
  high_error_rate:
    condition: "error_rate > 5%"
    severity: "critical"
    notification: ["slack", "email"]
```

#### 6.2.2 Warning Alerts
```yaml
alerts:
  performance_degradation:
    condition: "response_time > 1000ms"
    severity: "warning"
    notification: ["slack"]
  
  resource_utilization_high:
    condition: "cpu_usage > 80% OR memory_usage > 90%"
    severity: "warning"
    notification: ["slack"]
```

---

## 7. Quality Gate Dashboard

### 7.1 Dashboard Metrics
```typescript
interface QualityGateDashboard {
  currentStatus: {
    deployment: "healthy" | "degraded" | "failed";
    database: "healthy" | "degraded" | "failed";
    api: "healthy" | "degraded" | "failed";
    performance: "healthy" | "degraded" | "failed";
  };
  
  recentDeployments: DeploymentMetrics[];
  qualityGateHistory: QualityGateResult[];
  performanceTrends: PerformanceMetrics[];
  alertHistory: Alert[];
}
```

### 7.2 Quality Gate Reports
```bash
# Generate quality gate report
npm run quality:report

# Report includes:
# - Test coverage metrics
# - Performance benchmarks
# - Security scan results
# - Database health status
# - Deployment success rate
# - Rollback frequency
```

---

## 8. Continuous Improvement

### 8.1 Quality Gate Optimization
- **Weekly Reviews**: Analyze quality gate effectiveness
- **Threshold Tuning**: Adjust thresholds based on historical data
- **Process Refinement**: Improve deployment processes
- **Tool Integration**: Add new quality gates as needed

### 8.2 Metrics-Driven Improvements
- **Deployment Success Rate**: Target > 99%
- **Rollback Frequency**: Target < 5%
- **Quality Gate Pass Rate**: Target > 95%
- **Mean Time to Recovery**: Target < 10 minutes

---

## 9. Emergency Procedures

### 9.1 Emergency Rollback
```bash
# Emergency rollback procedure
npm run emergency:rollback --reason="critical_failure"

# Steps:
# 1. Immediate service shutdown
# 2. Database rollback to last known good state
# 3. API rollback to previous version
# 4. Health check validation
# 5. Stakeholder notification
```

### 9.2 Data Recovery
```bash
# Data recovery procedure
npm run data:recover --from-backup="YYYY-MM-DD-HH-MM"

# Steps:
# 1. Stop all services
# 2. Restore database from backup
# 3. Validate data integrity
# 4. Restart services
# 5. Verify functionality
```

---

## 10. Success Criteria

### 10.1 Deployment Success Metrics
- ✅ **Zero Downtime**: Deployments complete without service interruption
- ✅ **Data Integrity**: No data loss or corruption during deployments
- ✅ **Performance**: No degradation in response times or throughput
- ✅ **Security**: No new vulnerabilities introduced

### 10.2 Quality Gate Effectiveness
- ✅ **Gate Pass Rate**: > 95% of deployments pass all quality gates
- ✅ **Rollback Rate**: < 5% of deployments require rollback
- ✅ **Recovery Time**: < 10 minutes average rollback time
- ✅ **Monitoring**: 100% visibility into deployment health

### 10.3 Continuous Improvement
- ✅ **Process Optimization**: Monthly review and improvement of quality gates
- ✅ **Tool Enhancement**: Quarterly evaluation of new quality gate tools
- ✅ **Training**: Regular team training on quality gate procedures
- ✅ **Documentation**: Up-to-date quality gate documentation

---

*This comprehensive quality gate framework ensures reliable, secure, and efficient deployments of the PostgreSQL database integration system.*
