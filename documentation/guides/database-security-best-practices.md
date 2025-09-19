# Database Security Best Practices
## Hermes Security Contact Form Backup System

### Overview
This document outlines comprehensive security best practices for the PostgreSQL database integration, ensuring top-notch security implementation for storing contact form data with GDPR compliance and enterprise-grade protection.

## 1. Database Security Architecture

### 1.1 Security Layers
```
┌─────────────────────────────────────┐
│           Application Layer         │
│  - Input Validation & Sanitization  │
│  - Authentication & Authorization   │
│  - Rate Limiting & DDoS Protection  │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│            Network Layer            │
│  - SSL/TLS Encryption               │
│  - VPN/Tunnel Security              │
│  - Firewall Rules                   │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│           Database Layer            │
│  - Row-Level Security (RLS)         │
│  - Column Encryption                │
│  - Audit Logging                    │
└─────────────────────────────────────┘
```

### 1.2 Security Principles
- **Defense in Depth**: Multiple security layers
- **Least Privilege**: Minimal necessary access
- **Zero Trust**: Verify everything
- **Data Minimization**: Store only what's needed
- **Encryption Everywhere**: At rest and in transit

## 2. Database Access Control

### 2.1 User Management
```sql
-- Create dedicated application user
CREATE USER hermes_app_user WITH PASSWORD 'secure_random_password';

-- Grant minimal required permissions
GRANT CONNECT ON DATABASE hermes_prod TO hermes_app_user;
GRANT USAGE ON SCHEMA public TO hermes_app_user;
GRANT SELECT, INSERT, UPDATE ON hermes_leads TO hermes_app_user;
GRANT USAGE, SELECT ON SEQUENCE hermes_leads_id_seq TO hermes_app_user;

-- Create read-only user for monitoring
CREATE USER hermes_monitor_user WITH PASSWORD 'monitor_secure_password';
GRANT CONNECT ON DATABASE hermes_prod TO hermes_monitor_user;
GRANT SELECT ON hermes_leads TO hermes_monitor_user;
```

### 2.2 Row-Level Security (RLS)
```sql
-- Enable RLS on leads table
ALTER TABLE hermes_leads ENABLE ROW LEVEL SECURITY;

-- Policy for application user
CREATE POLICY leads_app_policy ON hermes_leads
    FOR ALL TO hermes_app_user
    USING (true)
    WITH CHECK (true);

-- Policy for monitor user (read-only)
CREATE POLICY leads_monitor_policy ON hermes_leads
    FOR SELECT TO hermes_monitor_user
    USING (true);

-- Restrict access to sensitive data
CREATE POLICY leads_sensitive_policy ON hermes_leads
    FOR SELECT TO hermes_app_user
    USING (
        created_at > NOW() - INTERVAL '90 days' OR
        status IN ('processed', 'archived')
    );
```

## 3. Data Encryption

### 3.1 Encryption at Rest
```sql
-- Enable transparent data encryption
ALTER DATABASE hermes_prod SET default_transaction_isolation = 'read committed';
ALTER DATABASE hermes_prod SET ssl = on;

-- Encrypt sensitive columns
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Hash sensitive data
UPDATE hermes_leads SET 
    phone_number = pgp_sym_encrypt(phone_number, 'encryption_key'),
    ip_address = pgp_sym_encrypt(ip_address::text, 'encryption_key');
```

### 3.2 Encryption in Transit
```javascript
// SSL/TLS configuration
const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: true,
    ca: process.env.DB_SSL_CA,
    cert: process.env.DB_SSL_CERT,
    key: process.env.DB_SSL_KEY
  }
};
```

### 3.3 Application-Level Encryption
```typescript
import crypto from 'crypto';

class DataEncryption {
  private readonly algorithm = 'aes-256-gcm';
  private readonly key = process.env.ENCRYPTION_KEY!;

  encrypt(data: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(this.algorithm, this.key);
    cipher.setAAD(Buffer.from('hermes-lead-data'));
    
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
  }

  decrypt(encryptedData: string): string {
    const parts = encryptedData.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];
    
    const decipher = crypto.createDecipher(this.algorithm, this.key);
    decipher.setAAD(Buffer.from('hermes-lead-data'));
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}
```

## 4. Input Validation & Sanitization

### 4.1 Data Validation
```typescript
import { z } from 'zod';

const ContactFormSchema = z.object({
  firstName: z.string()
    .min(1, 'First name is required')
    .max(100, 'First name too long')
    .regex(/^[a-zA-Z\s\-']+$/, 'Invalid characters in first name'),
  
  lastName: z.string()
    .min(1, 'Last name is required')
    .max(100, 'Last name too long')
    .regex(/^[a-zA-Z\s\-']+$/, 'Invalid characters in last name'),
  
  email: z.string()
    .email('Invalid email format')
    .max(255, 'Email too long')
    .toLowerCase(),
  
  phoneNumber: z.string()
    .regex(/^\+[1-9]\d{1,14}$/, 'Invalid phone number format')
    .max(20, 'Phone number too long'),
  
  country: z.string()
    .min(2, 'Country code required')
    .max(100, 'Country name too long')
    .regex(/^[a-zA-Z\s\-']+$/, 'Invalid country name'),
  
  problemDescription: z.string()
    .min(10, 'Description too short')
    .max(5000, 'Description too long')
    .transform(str => str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')),
  
  agreeToTerms: z.boolean().refine(val => val === true, 'Terms agreement required'),
  privacyConsent: z.boolean().refine(val => val === true, 'Privacy consent required')
});

// Sanitize input data
function sanitizeInput(data: any): ContactFormData {
  const sanitized = ContactFormSchema.parse(data);
  
  // Additional sanitization
  sanitized.firstName = sanitized.firstName.trim();
  sanitized.lastName = sanitized.lastName.trim();
  sanitized.email = sanitized.email.trim().toLowerCase();
  sanitized.problemDescription = sanitized.problemDescription.trim();
  
  return sanitized;
}
```

### 4.2 SQL Injection Prevention
```typescript
// Use parameterized queries
async function createLead(leadData: ContactFormData): Promise<Lead> {
  const query = `
    INSERT INTO hermes_leads (
      lead_id, first_name, last_name, email, country,
      phone_number, user_role, problem_description,
      company_name, company_size, service_urgency,
      agree_to_terms, privacy_consent, marketing_consent,
      captcha_token, user_agent, ip_address
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
    RETURNING *
  `;
  
  const values = [
    leadData.leadId,
    leadData.firstName,
    leadData.lastName,
    leadData.email,
    leadData.country,
    leadData.phoneNumber,
    leadData.userRole,
    leadData.problemDescription,
    leadData.companyName,
    leadData.companySize,
    leadData.serviceUrgency,
    leadData.agreeToTerms,
    leadData.privacyConsent,
    leadData.marketingConsent,
    leadData.captchaToken,
    leadData.userAgent,
    leadData.ipAddress
  ];
  
  const result = await db.query(query, values);
  return result.rows[0];
}
```

## 5. Authentication & Authorization

### 5.1 API Authentication
```typescript
import jwt from 'jsonwebtoken';

interface AuthConfig {
  secret: string;
  expiresIn: string;
  issuer: string;
  audience: string;
}

class AuthService {
  private config: AuthConfig;

  constructor() {
    this.config = {
      secret: process.env.JWT_SECRET!,
      expiresIn: '1h',
      issuer: 'hermes-security',
      audience: 'hermes-api'
    };
  }

  generateToken(userId: string, permissions: string[]): string {
    return jwt.sign(
      { 
        userId, 
        permissions,
        iat: Math.floor(Date.now() / 1000)
      },
      this.config.secret,
      {
        expiresIn: this.config.expiresIn,
        issuer: this.config.issuer,
        audience: this.config.audience
      }
    );
  }

  verifyToken(token: string): { userId: string; permissions: string[] } {
    try {
      const decoded = jwt.verify(token, this.config.secret, {
        issuer: this.config.issuer,
        audience: this.config.audience
      }) as any;
      
      return {
        userId: decoded.userId,
        permissions: decoded.permissions || []
      };
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  hasPermission(userPermissions: string[], requiredPermission: string): boolean {
    return userPermissions.includes(requiredPermission) || 
           userPermissions.includes('admin');
  }
}
```

### 5.2 Rate Limiting
```typescript
import rateLimit from 'express-rate-limit';

// General API rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Rate limit exceeded',
      retryAfter: Math.round(req.rateLimit.resetTime / 1000)
    });
  }
});

// Strict rate limiting for lead submission
const leadSubmissionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 lead submissions per hour
  message: 'Too many lead submissions from this IP',
  keyGenerator: (req) => {
    return req.ip + ':' + req.body.email; // IP + email combination
  },
  skipSuccessfulRequests: true
});
```

## 6. Audit Logging & Monitoring

### 6.1 Database Audit Logging
```sql
-- Enable audit logging
CREATE EXTENSION IF NOT EXISTS pgaudit;

-- Configure audit settings
ALTER SYSTEM SET pgaudit.log = 'all';
ALTER SYSTEM SET pgaudit.log_catalog = off;
ALTER SYSTEM SET pgaudit.log_parameter = on;
ALTER SYSTEM SET pgaudit.log_statement_once = on;

-- Create audit table
CREATE TABLE audit_log (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_name TEXT,
    database_name TEXT,
    command_tag TEXT,
    query TEXT,
    ip_address INET,
    application_name TEXT,
    session_id TEXT
);

-- Function to log sensitive operations
CREATE OR REPLACE FUNCTION log_sensitive_operation()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_log (
        user_name, database_name, command_tag, query,
        ip_address, application_name, session_id
    ) VALUES (
        current_user, current_database(), TG_OP,
        CASE 
            WHEN TG_OP = 'DELETE' THEN 'DELETE FROM ' || TG_TABLE_NAME
            WHEN TG_OP = 'UPDATE' THEN 'UPDATE ' || TG_TABLE_NAME
            WHEN TG_OP = 'INSERT' THEN 'INSERT INTO ' || TG_TABLE_NAME
        END,
        inet_client_addr(), current_setting('application_name'),
        pg_backend_pid()::text
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create audit triggers
CREATE TRIGGER audit_leads_changes
    AFTER INSERT OR UPDATE OR DELETE ON hermes_leads
    FOR EACH ROW EXECUTE FUNCTION log_sensitive_operation();
```

### 6.2 Application Logging
```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'hermes-database-api' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Security event logging
class SecurityLogger {
  static logAuthAttempt(userId: string, success: boolean, ip: string) {
    logger.info('Authentication attempt', {
      userId,
      success,
      ip,
      timestamp: new Date().toISOString(),
      event: 'auth_attempt'
    });
  }

  static logDataAccess(userId: string, operation: string, recordId: string) {
    logger.info('Data access', {
      userId,
      operation,
      recordId,
      timestamp: new Date().toISOString(),
      event: 'data_access'
    });
  }

  static logSecurityViolation(type: string, details: any, ip: string) {
    logger.warn('Security violation', {
      type,
      details,
      ip,
      timestamp: new Date().toISOString(),
      event: 'security_violation'
    });
  }
}
```

## 7. GDPR Compliance

### 7.1 Data Minimization
```sql
-- Data retention policy
CREATE OR REPLACE FUNCTION cleanup_old_leads()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Delete leads older than 7 years (GDPR requirement)
    DELETE FROM hermes_leads 
    WHERE created_at < NOW() - INTERVAL '7 years'
    AND status IN ('processed', 'converted', 'rejected');
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    -- Log the cleanup
    INSERT INTO audit_log (command_tag, query, timestamp)
    VALUES ('CLEANUP', 'Deleted old leads', NOW());
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup (run monthly)
SELECT cron.schedule('cleanup-old-leads', '0 2 1 * *', 'SELECT cleanup_old_leads();');
```

### 7.2 Right to Erasure (Right to be Forgotten)
```sql
-- Function to anonymize personal data
CREATE OR REPLACE FUNCTION anonymize_lead_data(lead_id_param VARCHAR(50))
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE hermes_leads 
    SET 
        first_name = '[ANONYMIZED]',
        last_name = '[ANONYMIZED]',
        email = CONCAT('anonymized_', id, '@deleted.local'),
        phone_number = '[ANONYMIZED]',
        ip_address = NULL,
        user_agent = '[ANONYMIZED]',
        problem_description = '[PERSONAL DATA REMOVED]',
        company_name = '[ANONYMIZED]',
        notes = '[PERSONAL DATA REMOVED]',
        status = 'anonymized'
    WHERE lead_id = lead_id_param;
    
    -- Log the anonymization
    INSERT INTO audit_log (command_tag, query, timestamp)
    VALUES ('ANONYMIZE', 'Anonymized lead data', NOW());
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;
```

### 7.3 Data Portability
```sql
-- Function to export user data
CREATE OR REPLACE FUNCTION export_user_data(email_param VARCHAR(255))
RETURNS JSON AS $$
DECLARE
    user_data JSON;
BEGIN
    SELECT json_agg(row_to_json(leads)) INTO user_data
    FROM (
        SELECT 
            id,
            lead_id,
            first_name,
            last_name,
            email,
            country,
            phone_number,
            user_role,
            problem_description,
            company_name,
            company_size,
            service_urgency,
            created_at,
            status
        FROM hermes_leads 
        WHERE email = email_param
    ) leads;
    
    -- Log the export
    INSERT INTO audit_log (command_tag, query, timestamp)
    VALUES ('EXPORT', 'User data export', NOW());
    
    RETURN COALESCE(user_data, '[]'::json);
END;
$$ LANGUAGE plpgsql;
```

## 8. Security Monitoring

### 8.1 Intrusion Detection
```typescript
class SecurityMonitor {
  private suspiciousActivities: Map<string, number> = new Map();
  
  checkSuspiciousActivity(ip: string, activity: string): boolean {
    const key = `${ip}:${activity}`;
    const count = this.suspiciousActivities.get(key) || 0;
    
    if (count > 10) { // Threshold for suspicious activity
      SecurityLogger.logSecurityViolation('suspicious_activity', {
        ip,
        activity,
        count
      }, ip);
      
      return true;
    }
    
    this.suspiciousActivities.set(key, count + 1);
    return false;
  }
  
  resetCounters(): void {
    this.suspiciousActivities.clear();
  }
}
```

### 8.2 Health Checks
```typescript
// Security health check endpoint
app.get('/api/health/security', async (req, res) => {
  const health = {
    timestamp: new Date().toISOString(),
    status: 'healthy',
    checks: {
      databaseConnection: await checkDatabaseSecurity(),
      encryptionStatus: checkEncryptionStatus(),
      auditLogging: checkAuditLogging(),
      rateLimiting: checkRateLimiting(),
      sslCertificates: checkSSLCertificates()
    }
  };
  
  const allHealthy = Object.values(health.checks).every(check => check === true);
  health.status = allHealthy ? 'healthy' : 'unhealthy';
  
  res.status(allHealthy ? 200 : 503).json(health);
});
```

## 9. Incident Response

### 9.1 Security Incident Procedures
```typescript
class IncidentResponse {
  static async handleSecurityBreach(incident: SecurityIncident) {
    // 1. Immediate containment
    await this.containThreat(incident);
    
    // 2. Assess impact
    const impact = await this.assessImpact(incident);
    
    // 3. Notify stakeholders
    await this.notifyStakeholders(incident, impact);
    
    // 4. Document incident
    await this.documentIncident(incident);
    
    // 5. Implement remediation
    await this.implementRemediation(incident);
    
    // 6. Post-incident review
    await this.scheduleReview(incident);
  }
  
  private static async containThreat(incident: SecurityIncident) {
    // Block suspicious IPs
    await this.blockIP(incident.sourceIP);
    
    // Revoke compromised tokens
    await this.revokeTokens(incident.userId);
    
    // Disable affected accounts
    await this.disableAccount(incident.userId);
  }
}
```

## 10. Security Checklist

### 10.1 Pre-Deployment Security Checklist
- [ ] Database user permissions reviewed and minimized
- [ ] Row-level security policies implemented
- [ ] SSL/TLS encryption configured
- [ ] Input validation and sanitization implemented
- [ ] SQL injection prevention measures in place
- [ ] Rate limiting configured
- [ ] Audit logging enabled
- [ ] GDPR compliance measures implemented
- [ ] Security monitoring configured
- [ ] Incident response procedures documented

### 10.2 Ongoing Security Maintenance
- [ ] Regular security updates applied
- [ ] Database access logs reviewed weekly
- [ ] Security metrics monitored daily
- [ ] Penetration testing performed quarterly
- [ ] Security training conducted monthly
- [ ] Backup and recovery procedures tested
- [ ] Compliance audits performed annually

---

*This comprehensive security framework ensures the PostgreSQL database integration meets enterprise-grade security standards while maintaining GDPR compliance and operational excellence.*
