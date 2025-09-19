# 🏗️ Hermes Security Database Architecture

## 📊 **Current Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                    HERMES SECURITY APP                     │
├─────────────────────────────────────────────────────────────┤
│  Frontend (Vite/React)     │  API Routes (Vercel)         │
│  ├─ Contact Form           │  ├─ /api/backup-lead         │
│  ├─ Lead Management        │  ├─ /api/health/database     │
│  └─ Dashboard              │  └─ /api/leads/[id]          │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                 SUPABASE POSTGRESQL DB                     │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  hermes_leads table (4 leads currently)                │ │
│  │  ├─ id (Primary Key)                                   │ │
│  │  ├─ lead_id (Unique Identifier)                        │ │
│  │  ├─ Contact Form Data                                  │ │
│  │  ├─ 8n8 Integration Tracking                           │ │
│  │  └─ Timestamps & Status                                │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## ⚠️ **Current Issues**

### **1. No Environment Separation**
- **Problem**: Using the same database for development and production
- **Risk**: Test data mixed with production data
- **Solution**: Implement staging/production separation

### **2. Data Visibility in Supabase**
- **Issue**: You're not seeing data updates in Supabase dashboard
- **Possible Causes**:
  - Looking in wrong database/project
  - Supabase dashboard caching
  - Connection string pointing to different database

## 🎯 **Recommended Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                    DEVELOPMENT ENVIRONMENT                  │
├─────────────────────────────────────────────────────────────┤
│  Local Development          │  Local Testing Database      │
│  ├─ npm run dev            │  ├─ Local PostgreSQL         │
│  ├─ Local API testing      │  ├─ Test data only           │
│  └─ Component development  │  └─ Reset frequently         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    STAGING ENVIRONMENT                      │
├─────────────────────────────────────────────────────────────┤
│  Staging Deployment         │  Staging Database            │
│  ├─ Vercel Preview         │  ├─ Supabase Staging         │
│  ├─ Integration testing    │  ├─ Test data                │
│  └─ Pre-production tests   │  └─ Safe to reset            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    PRODUCTION ENVIRONMENT                   │
├─────────────────────────────────────────────────────────────┤
│  Production Deployment      │  Production Database         │
│  ├─ Vercel Production      │  ├─ Supabase Production      │
│  ├─ Live contact forms     │  ├─ Real customer data       │
│  └─ 8n8 webhooks          │  └─ Backup & monitoring      │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 **Implementation Plan**

### **Phase 1: Environment Separation**

#### **1. Create Staging Database**
```bash
# In Supabase Dashboard:
# 1. Create new project: "hermes-security-staging"
# 2. Get connection string
# 3. Update .env.staging
```

#### **2. Environment Configuration**
```bash
# .env.local (Development)
DATABASE_URL=postgres://localhost:5432/hermes_dev
POSTGRES_URL=postgres://localhost:5432/hermes_dev

# .env.staging (Staging)
DATABASE_URL=postgres://staging-connection-string
POSTGRES_URL=postgres://staging-connection-string

# .env.production (Production)
DATABASE_URL=postgres://production-connection-string
POSTGRES_URL=postgres://production-connection-string
```

#### **3. Vercel Environment Variables**
```bash
# Staging Environment
vercel env add DATABASE_URL staging
vercel env add POSTGRES_URL staging

# Production Environment  
vercel env add DATABASE_URL production
vercel env add POSTGRES_URL production
```

### **Phase 2: Database Migration Strategy**

#### **1. Migration Scripts**
```bash
# Run migrations on each environment
npm run db:migrate:staging
npm run db:migrate:production
```

#### **2. Data Seeding**
```bash
# Seed staging with test data
npm run db:seed:staging

# Production starts empty (real data only)
```

### **Phase 3: Monitoring & Backup**

#### **1. Environment Health Checks**
- `/api/health/database` - Environment-specific
- Separate monitoring for each environment
- Alert on staging/production differences

#### **2. Backup Strategy**
- Staging: Daily backups, easy reset
- Production: Hourly backups, point-in-time recovery
- Cross-environment data sync for testing

## 🔍 **Current Data Verification**

### **Check Your Supabase Data:**

1. **Go to Supabase Dashboard**
2. **Navigate to**: Table Editor → hermes_leads
3. **You should see**: 4 records (including our test data)

### **If You Don't See Data:**

1. **Check Project**: Make sure you're in the right Supabase project
2. **Check Table**: Look for `hermes_leads` table
3. **Check Permissions**: Ensure you have read access
4. **Refresh**: Clear browser cache and refresh

### **Verify Connection String:**

```bash
# Check current connection
node -e "
import { config } from 'dotenv';
config();
console.log('Database URL:', process.env.DATABASE_URL?.substring(0, 50) + '...');
"
```

## 📋 **Next Steps**

### **Immediate Actions:**

1. **✅ Verify Current Data**: Check Supabase dashboard
2. **🔄 Create Staging Environment**: Set up separate staging database
3. **📊 Implement Monitoring**: Environment-specific health checks
4. **🚀 Deploy to Staging**: Test with staging database first

### **Production Deployment:**

1. **Create Production Database**: Separate Supabase project
2. **Configure Environment Variables**: In Vercel
3. **Run Migrations**: Set up production schema
4. **Deploy**: With production database connection
5. **Monitor**: Health checks and data flow

## 🎯 **Benefits of Proper Architecture**

- **🔒 Data Isolation**: No test data in production
- **🧪 Safe Testing**: Staging environment for integration tests
- **📊 Clear Monitoring**: Environment-specific metrics
- **🔄 Easy Rollbacks**: Independent environment management
- **🛡️ Security**: Separate credentials and access controls

Would you like me to help you set up the staging environment first?
