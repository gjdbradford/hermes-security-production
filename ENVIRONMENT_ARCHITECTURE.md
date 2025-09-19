# 🌍 Environment Architecture

## Overview

This document describes the environment architecture for the Hermes Security application, which uses a **staging-first approach** for development and testing.

## 🏗️ Architecture Summary

| Environment | Database | Purpose | Data Source |
|-------------|----------|---------|-------------|
| **Local Development** | Staging DB | Local development & testing | Staging Supabase |
| **Staging** | Staging DB | Pre-production testing | Staging Supabase |
| **Production** | Production DB | Live application | Production Supabase |

## 🔧 Environment Configuration

### Local Development (.env)
```bash
# Uses Staging Database
DATABASE_URL=postgresql://postgres.zrbosyecsbgbooelgzsw:iJ8QNekshRMH5cIT@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
POSTGRES_URL=postgresql://postgres.zrbosyecsbgbooelgzsw:iJ8QNekshRMH5cIT@aws-1-eu-west-1.pooler.supabase.com:5432/postgres
NODE_ENV=development
VERCEL_ENV=development
```

### Staging Environment (.env.staging)
```bash
# Uses Staging Database
DATABASE_URL=postgresql://postgres.zrbosyecsbgbooelgzsw:iJ8QNekshRMH5cIT@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
POSTGRES_URL=postgresql://postgres.zrbosyecsbgbooelgzsw:iJ8QNekshRMH5cIT@aws-1-eu-west-1.pooler.supabase.com:5432/postgres
NODE_ENV=staging
VERCEL_ENV=preview
```

### Production Environment (.env.production)
```bash
# Uses Production Database
DATABASE_URL=postgres://postgres.dvnseutnwfhrvzkwdnsa:lxZuUbhXQGXQ6pFE@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?sslmode=disable&pgbouncer=true
POSTGRES_URL=postgres://postgres.dvnseutnwfhrvzkwdnsa:lxZuUbhXQGXQ6pFE@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?sslmode=disable&supa=base-pooler.x
NODE_ENV=production
VERCEL_ENV=production
```

## 🎯 Benefits of This Architecture

### ✅ Advantages
1. **Consistent Testing**: Local and staging use the same database, ensuring consistent behavior
2. **Safe Development**: No risk of accidentally affecting production data during development
3. **Easy Reset**: Staging database can be easily reset without affecting production
4. **Cost Effective**: Only need two Supabase projects instead of three
5. **Simplified Deployment**: Clear separation between staging and production environments

### 🔄 Data Flow
```
Local Development → Staging Database
Staging Deployment → Staging Database
Production Deployment → Production Database
```

## 🚀 Deployment Commands

### Local Development
```bash
# Start local development server
npm run dev

# Database operations (uses staging DB)
npm run db:health
npm run db:migrate
```

### Staging Deployment
```bash
# Deploy to staging
npm run build:staging
vercel --target staging

# Database operations
npm run db:health:staging
npm run db:migrate:staging
```

### Production Deployment
```bash
# Deploy to production
npm run build:production
vercel --prod

# Database operations
npm run db:health:production
npm run db:migrate:production
```

## 🔍 Environment Detection

The application automatically detects the environment based on:
- **Production**: `hermessecurity.io` or `www.hermessecurity.io`
- **Vercel Production**: URLs containing `hermes-security-production`
- **GitHub Staging**: `gjdbradford.github.io` with `/hermes-security-production/` path
- **Local Development**: `localhost`, `127.0.0.1`, or empty hostname

## 🛠️ Database Scripts

All database scripts respect the `NODE_ENV` environment variable:

```bash
# Development (uses staging DB)
NODE_ENV=development npm run db:health

# Staging (uses staging DB)
NODE_ENV=staging npm run db:health

# Production (uses production DB)
NODE_ENV=production npm run db:health
```

## 📋 Environment Variables

### Required Variables
- `DATABASE_URL`: Primary database connection (with connection pooling)
- `POSTGRES_URL`: Direct database connection (for migrations)
- `NODE_ENV`: Application environment (`development`, `staging`, `production`)
- `VERCEL_ENV`: Vercel deployment environment

### Optional Variables
- `VITE_DEPLOY_ENV`: Controls build-time environment detection
- `SSL_MODE`: Database SSL configuration (disabled for development)

## 🔐 Security Considerations

1. **Database Passwords**: Never commit passwords to version control
2. **Environment Files**: `.env*` files are gitignored
3. **Connection Strings**: Use connection pooling for production
4. **SSL Configuration**: Disabled for development, enabled for production

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check environment variables are loaded correctly
   - Verify database credentials
   - Ensure network connectivity

2. **Wrong Database Being Used**
   - Check `NODE_ENV` environment variable
   - Verify `.env` file is being loaded
   - Confirm database URLs match expected environment

3. **Migration Failures**
   - Ensure correct `NODE_ENV` is set
   - Check database permissions
   - Verify migration files exist

### Debug Commands
```bash
# Check environment configuration
npm run db:health

# Verify database connection
npm run db:migrate:status

# Test all environments
npm run test:all-envs
```

## 📚 Related Documentation

- [Database Architecture](./DATABASE_ARCHITECTURE.md)
- [Staging Setup Guide](./STAGING_SETUP_GUIDE.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Environment Setup](./ENVIRONMENT_SETUP_COMPLETE.md)
