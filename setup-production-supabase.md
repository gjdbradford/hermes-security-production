# Production Supabase Setup Guide

## 1. Create Production Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose your organization
4. Set project name: `hermes-security-production`
5. Set database password (save this securely!)
6. Choose region closest to your users
7. Click "Create new project"

## 2. Get Production Connection Details

### From Supabase Dashboard:
1. Go to **Settings** → **Database**
2. Copy the **Connection string** (URI)
3. Copy the **API URL** and **anon key**

### Environment Variables for Production:
```bash
# Production Supabase
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key
DATABASE_URL=postgresql://postgres:[password]@db.your-project-ref.supabase.co:5432/postgres
POSTGRES_URL=postgresql://postgres:[password]@db.your-project-ref.supabase.co:5432/postgres
```

## 3. Set Up Database Schema

Run the migration script:
```bash
npm run db:migrate:production
```

## 4. Configure Row Level Security (RLS)

```sql
-- Enable RLS on hermes_leads table
ALTER TABLE hermes_leads ENABLE ROW LEVEL SECURITY;

-- Create policy for service role
CREATE POLICY "Service role can do everything" ON hermes_leads
FOR ALL USING (auth.role() = 'service_role');

-- Create policy for authenticated users (if needed)
CREATE POLICY "Authenticated users can read leads" ON hermes_leads
FOR SELECT USING (auth.role() = 'authenticated');
```

## 5. Set Up 8n8 Production Webhook

### In your 8n8 workflow:
1. Create a new webhook node
2. Set webhook path: `/webhook/needs-assessment-production`
3. Configure the Supabase node with production credentials
4. Test the connection

### Production Webhook URL:
```
https://ilovemylife.app.n8n.cloud/webhook/needs-assessment-production
```

## 6. Update Environment Variables in Vercel

### In Vercel Dashboard:
1. Go to your project settings
2. Navigate to **Environment Variables**
3. Add production variables:

```
DATABASE_URL=postgresql://postgres:[password]@db.your-project-ref.supabase.co:5432/postgres
POSTGRES_URL=postgresql://postgres:[password]@db.your-project-ref.supabase.co:5432/postgres
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key
N8N_WEBHOOK_URL=https://ilovemylife.app.n8n.cloud/webhook/needs-assessment-production
```

## 7. Test Production Connection

```bash
# Test database connection
npm run db:health:production

# Test webhook
curl -X POST https://ilovemylife.app.n8n.cloud/webhook/needs-assessment-production \
  -H "Content-Type: application/json" \
  -d '{"test": "connection"}'
```

## 8. Deploy to Production

```bash
# Deploy to production
./deploy.sh production
```

## 9. Monitor Production Data

### Check Supabase Dashboard:
1. Go to **Table Editor** → **hermes_leads**
2. Verify data is being inserted
3. Check **Logs** for any errors

### Monitor 8n8 Workflow:
1. Check execution history
2. Verify Supabase node is working
3. Monitor error logs

