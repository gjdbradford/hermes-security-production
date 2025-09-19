# 🚀 Complete Staging Setup Guide

## ✅ **What's Done:**
- ✅ Staging environment file created (`.env.staging`)
- ✅ Connection strings configured
- ✅ Environment scripts added to package.json

## 🔑 **Next Step: Add Your Password**

### **1. Find Your Staging Database Password**
- Go to your **staging Supabase project** dashboard
- Navigate to **Settings** → **Database**
- Find the database password (or reset it if needed)

### **2. Update .env.staging**
Replace `[YOUR-PASSWORD]` in `.env.staging` with your actual password:

```bash
# Edit the file
nano .env.staging

# Or use your preferred editor
code .env.staging
```

**Replace this line:**
```
DATABASE_URL=postgresql://postgres.zrbosyecsbgbooelgzsw:[YOUR-PASSWORD]@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**With your actual password:**
```
DATABASE_URL=postgresql://postgres.zrbosyecsbgbooelgzsw:your_actual_password@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Do the same for POSTGRES_URL:**
```
POSTGRES_URL=postgresql://postgres.zrbosyecsbgbooelgzsw:your_actual_password@aws-1-eu-west-1.pooler.supabase.com:5432/postgres
```

## 🗄️ **Step 3: Set Up Staging Database**

After updating the password, run these commands:

```bash
# Run migrations on staging database
npm run db:migrate:staging

# Check staging database health
npm run db:health:staging
```

## ☁️ **Step 4: Deploy to Vercel Staging**

```bash
# Add environment variables to Vercel
vercel env add DATABASE_URL staging
vercel env add POSTGRES_URL staging

# Deploy to staging
vercel --target staging
```

## 🧪 **Step 5: Test Staging**

1. Visit your staging URL (provided by Vercel)
2. Test the contact form
3. Check your staging Supabase database for new leads

## 📊 **Current Environment Status**

| Environment | Database | Status | Next Action |
|-------------|----------|--------|-------------|
| **Development** | Current Supabase | ✅ Ready | None |
| **Staging** | New Supabase | 🔄 Password needed | Add password |
| **Production** | Current Supabase | ✅ Ready | Deploy after staging |

## 🎯 **Quick Commands Reference**

```bash
# Check current environment
echo $NODE_ENV

# Set staging environment
export NODE_ENV=staging

# Run staging commands
npm run db:migrate:staging
npm run db:health:staging
npm run dev:staging

# Deploy commands
vercel --target staging    # Deploy to staging
vercel --prod             # Deploy to production
```

## 🚨 **Important Notes**

1. **Keep passwords secure** - Don't commit passwords to git
2. **Test staging first** - Make sure staging works before production
3. **Monitor both databases** - Keep an eye on staging and production

## ✅ **Success Checklist**

- [ ] Password added to `.env.staging`
- [ ] `npm run db:migrate:staging` successful
- [ ] `npm run db:health:staging` shows healthy
- [ ] Vercel environment variables added
- [ ] Staging deployment successful
- [ ] Contact form works on staging
- [ ] Leads appear in staging database

## 🎉 **Ready for Production!**

Once staging is working perfectly, you can deploy to production with confidence!

**Next Action**: Add your staging database password to `.env.staging` and run the migration commands.
