# Vercel Deployment Guide for Hermes Security

## 🚀 Quick Deployment Steps

### Step 1: Complete Vercel Login
In your terminal, complete the Vercel login process:

```bash
cd /Users/gbradford/Desktop/Cursor/Hermes/hermes-copycraft-main
vercel login
```

**Choose**: "Continue with GitHub" (recommended)

### Step 2: Deploy to Vercel
```bash
vercel --prod --yes
```

### Step 3: Configure Environment Variables
After deployment, you'll need to set up environment variables in the Vercel dashboard:

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Find your project: `hermes-copycraft-main`
3. Go to **Settings** → **Environment Variables**
4. Add the following variables:

```bash
# SMTP Configuration (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@hermessecurity.io

# 8n8 Integration
VITE_N8N_API_KEY=your-8n8-bearer-token

# EmailJS Fallback (Optional)
VITE_EMAILJS_SERVICE_ID=your-service-id
VITE_EMAILJS_TEMPLATE_ID=your-template-id
VITE_EMAILJS_USER_ID=your-user-id
```

### Step 4: Gmail App Password Setup
1. Go to [myaccount.google.com](https://myaccount.google.com)
2. **Security** → **2-Step Verification** (enable if not already)
3. **Security** → **App passwords**
4. Generate password for "Mail"
5. Use this password as `SMTP_PASS` in Vercel

### Step 5: Test Email System
After deployment and environment setup:

```bash
# Test the email API
npx tsx scripts/email-test-plan.ts
```

## 📧 Expected Results

After successful deployment:
- ✅ Vercel API endpoint: `https://your-project.vercel.app/api/send-email`
- ✅ Contact form: `https://your-project.vercel.app/#contact`
- ✅ Email delivery to: `gjdbradford@gmail.com`

## 🔧 Troubleshooting

### If deployment fails:
1. Check `vercel.json` syntax
2. Ensure all dependencies are in `package.json`
3. Verify build process works locally: `npm run build`

### If email API fails:
1. Check environment variables in Vercel dashboard
2. Verify Gmail app password is correct
3. Check Vercel function logs

### If 8n8 webhook fails:
1. Verify webhook URL is correct
2. Check 8n8 API key configuration
3. Test webhook endpoint manually

## 📊 Testing Checklist

After deployment:
- [ ] Vercel project is live
- [ ] Environment variables are set
- [ ] Email API endpoint responds
- [ ] Contact form submits successfully
- [ ] Emails are delivered to inbox
- [ ] Email content is properly formatted
- [ ] Reply functionality works

## 🎯 Next Steps

1. **Complete Vercel login** (interactive step)
2. **Deploy project** (`vercel --prod --yes`)
3. **Set environment variables** (Vercel dashboard)
4. **Test email system** (automated script)
5. **Validate production** (manual testing)

---

**Status**: Ready for deployment
**Estimated Time**: 15-30 minutes
**Priority**: High - Required for email functionality

