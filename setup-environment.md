# Environment Variables Setup Guide

## 1. Get Your Connection Strings from Vercel

After creating your Postgres database in Vercel Dashboard, copy these values:

```bash
# Example connection strings (yours will be different)
DATABASE_URL=postgresql://postgres:abc123xyz@db.vercel-storage.com:5432/hermes-database
POSTGRES_URL=postgresql://postgres:abc123xyz@db.vercel-storage.com:5432/hermes-database
```

## 2. Add to Vercel Environment Variables

### Method A: Vercel Dashboard
1. Go to your project → Settings → Environment Variables
2. Add each variable:
   - Name: `DATABASE_URL`, Value: `[your connection string]`
   - Name: `POSTGRES_URL`, Value: `[your connection string]`
3. Select environments: Production, Preview, Development
4. Click Save

### Method B: Vercel CLI
```bash
# Add the environment variables
vercel env add DATABASE_URL
# Paste your DATABASE_URL when prompted

vercel env add POSTGRES_URL  
# Paste your POSTGRES_URL when prompted

# Pull the variables to your local environment
vercel env pull .env.local
```

## 3. Verify Setup

```bash
# Check if environment variables are set
echo $DATABASE_URL
echo $POSTGRES_URL

# Test database connection
npm run db:health
```

## 4. Deploy Database Schema

```bash
# Run migrations to create tables
npm run db:migrate

# Check migration status
npm run db:migrate:status
```

## 5. Test the Integration

```bash
# Deploy to Vercel
vercel --prod

# Test the backup API
curl -X POST https://your-domain.vercel.app/api/backup-lead \
  -H "Content-Type: application/json" \
  -d '{"formData":{"firstName":"Test","lastName":"User","email":"test@example.com","country":"UK","phoneNumber":"+447700900000","userRole":"CTO","problemDescription":"Test","serviceUrgency":"not-urgent","agreeToTerms":true,"privacyConsent":true}}'
```

## Environment Variables Checklist

- [ ] DATABASE_URL set in Vercel
- [ ] POSTGRES_URL set in Vercel  
- [ ] Variables available in all environments
- [ ] Database connection tested
- [ ] Migrations run successfully
- [ ] API endpoints responding
