# CAPTCHA Integration Setup Guide

This guide provides comprehensive instructions for setting up Google reCAPTCHA v3 integration across all environments (local, staging, and production) for the Hermes Security contact form.

## 📋 Table of Contents

1. [Google reCAPTCHA Setup](#google-recaptcha-setup)
2. [Environment Configuration](#environment-configuration)
3. [Local Development Setup](#local-development-setup)
4. [Staging Environment Setup](#staging-environment-setup)
5. [Production Environment Setup](#production-environment-setup)
6. [Testing and Validation](#testing-and-validation)
7. [Troubleshooting](#troubleshooting)
8. [Security Considerations](#security-considerations)

## 🔐 Google reCAPTCHA Setup

### Step 1: Create Google reCAPTCHA Account

1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin/create)
2. Sign in with your Google account
3. Click "Create" to register a new site

### Step 2: Configure reCAPTCHA Site

**Site Registration:**
- **Label**: `Hermes Security Contact Form`
- **reCAPTCHA Type**: `reCAPTCHA v3` (invisible, background scoring)
- **Domains**: Add the following domains:
  - `hermessecurity.io`
  - `www.hermessecurity.io`
  - `gjdbradford.github.io`
  - `localhost`
  - `127.0.0.1`

**Important Notes:**
- reCAPTCHA v3 provides invisible protection with score-based verification
- You can use the same site key across multiple domains
- Local development domains (localhost, 127.0.0.1) are supported for testing

### Step 3: Obtain Keys

After registration, you'll receive:
- **Site Key** (public): Used in frontend JavaScript
- **Secret Key** (private): Used in backend verification

**Security Note**: Never expose the Secret Key in client-side code.

## 🌍 Environment Configuration

### Environment Variables

Create environment-specific variables for each deployment:

```bash
# Production Environment
VITE_RECAPTCHA_SITE_KEY_PRODUCTION=your_production_site_key
VITE_RECAPTCHA_SECRET_KEY_PRODUCTION=your_production_secret_key

# Staging Environment
VITE_RECAPTCHA_SITE_KEY_STAGING=your_staging_site_key
VITE_RECAPTCHA_SECRET_KEY_STAGING=your_staging_secret_key

# Development Environment
VITE_RECAPTCHA_SITE_KEY_DEVELOPMENT=your_dev_site_key
VITE_RECAPTCHA_SECRET_KEY_DEVELOPMENT=your_dev_secret_key
```

### Configuration Files

The CAPTCHA configuration is managed in `src/config/captcha.ts`:

```typescript
const CAPTCHA_CONFIGS = {
  production: {
    siteKey: process.env.VITE_RECAPTCHA_SITE_KEY_PRODUCTION || 'YOUR_PRODUCTION_SITE_KEY',
    secretKey: process.env.VITE_RECAPTCHA_SECRET_KEY_PRODUCTION || 'YOUR_PRODUCTION_SECRET_KEY',
    threshold: 0.5, // Higher threshold for production security
    enabled: true,
    debug: false
  },
  staging: {
    siteKey: process.env.VITE_RECAPTCHA_SITE_KEY_STAGING || 'YOUR_STAGING_SITE_KEY',
    secretKey: process.env.VITE_RECAPTCHA_SECRET_KEY_STAGING || 'YOUR_STAGING_SECRET_KEY',
    threshold: 0.3, // Lower threshold for testing
    enabled: true,
    debug: true
  },
  development: {
    siteKey: process.env.VITE_RECAPTCHA_SITE_KEY_DEVELOPMENT || 'YOUR_DEV_SITE_KEY',
    secretKey: process.env.VITE_RECAPTCHA_SECRET_KEY_DEVELOPMENT || 'YOUR_DEV_SECRET_KEY',
    threshold: 0.1, // Very low threshold for development
    enabled: true, // Set to false to bypass CAPTCHA in development
    debug: true
  }
};
```

## 💻 Local Development Setup

### Option 1: Use Real reCAPTCHA Keys (Recommended)

1. **Set Environment Variables:**
   ```bash
   # Create .env.local file
   echo "VITE_RECAPTCHA_SITE_KEY_DEV=your_dev_site_key" >> .env.local
   echo "VITE_RECAPTCHA_SECRET_KEY_DEV=your_dev_secret_key" >> .env.local
   ```

2. **Start Development Server:**
   ```bash
   npm run dev
   ```

3. **Test CAPTCHA:**
   - Open browser to `http://localhost:5173`
   - Navigate to contact form
   - Submit form to test CAPTCHA integration

### Option 2: Bypass CAPTCHA in Development

If you want to disable CAPTCHA for local development:

1. **Edit Configuration:**
   ```typescript
   // In src/config/captcha.ts
   development: {
     // ... other config
     enabled: false, // Disable CAPTCHA
     debug: true
   }
   ```

2. **Restart Development Server:**
   ```bash
   npm run dev
   ```

## 🚀 Staging Environment Setup

### GitHub Pages Deployment

1. **Set Environment Variables in GitHub:**
   - Go to repository Settings → Secrets and variables → Actions
   - Add the following secrets:
     - `VITE_RECAPTCHA_SITE_KEY_STAGING`
     - `VITE_RECAPTCHA_SECRET_KEY_STAGING`

2. **Update GitHub Actions Workflow:**
   ```yaml
   # In .github/workflows/deploy.yml
   env:
     VITE_RECAPTCHA_SITE_KEY_STAGING: ${{ secrets.VITE_RECAPTCHA_SITE_KEY_STAGING }}
     VITE_RECAPTCHA_SECRET_KEY_STAGING: ${{ secrets.VITE_RECAPTCHA_SECRET_KEY_STAGING }}
   ```

3. **Deploy:**
   ```bash
   git add .
   git commit -m "Add CAPTCHA configuration for staging"
   git push origin main
   ```

### Vercel Staging Deployment

1. **Set Environment Variables in Vercel:**
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add variables for staging environment

2. **Deploy:**
   ```bash
   vercel --prod
   ```

## 🌐 Production Environment Setup

### Domain Configuration

1. **Update reCAPTCHA Settings:**
   - Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
   - Edit your site configuration
   - Ensure production domains are listed:
     - `hermessecurity.io`
     - `www.hermessecurity.io`

2. **Set Production Environment Variables:**
   ```bash
   # In your production deployment platform
   VITE_RECAPTCHA_SITE_KEY_PROD=your_production_site_key
   VITE_RECAPTCHA_SECRET_KEY_PROD=your_production_secret_key
   ```

### Vercel Production Deployment

1. **Configure Environment Variables:**
   ```bash
   vercel env add VITE_RECAPTCHA_SITE_KEY_PROD
   vercel env add VITE_RECAPTCHA_SECRET_KEY_PROD
   ```

2. **Deploy to Production:**
   ```bash
   vercel --prod
   ```

## 🧪 Testing and Validation

### Automated Testing

Run the comprehensive CAPTCHA test suite:

```bash
# Run all CAPTCHA tests
npx tsx scripts/test-captcha-integration.ts
```

This will test:
- ✅ Dependencies and configuration
- ✅ Environment-specific settings
- ✅ Component integration
- ✅ API integration
- ✅ Build compilation
- ✅ TypeScript validation

### Manual Testing

1. **Local Testing:**
   ```bash
   npm run dev
   # Open http://localhost:5173/contact
   # Submit form and check browser console for CAPTCHA logs
   ```

2. **Staging Testing:**
   - Deploy to staging environment
   - Test form submission
   - Verify CAPTCHA tokens are generated

3. **Production Testing:**
   - Deploy to production
   - Test with real user scenarios
   - Monitor CAPTCHA scores and thresholds

### Debug Mode

Enable debug mode to see detailed CAPTCHA logs:

```typescript
// In src/config/captcha.ts
development: {
  // ... other config
  debug: true // Enable detailed logging
}
```

Debug logs will show:
- 🔐 CAPTCHA token generation
- 🔐 Score validation results
- 🔐 Environment detection
- 🔐 Configuration details

## 🔧 Troubleshooting

### Common Issues

#### 1. CAPTCHA Not Loading

**Symptoms:** No CAPTCHA verification, form submits without token

**Solutions:**
- Check if site key is correctly set
- Verify domain is registered in reCAPTCHA console
- Check browser console for JavaScript errors
- Ensure CaptchaProvider is wrapped around the app

#### 2. CAPTCHA Verification Failing

**Symptoms:** Form submission fails with CAPTCHA error

**Solutions:**
- Check if secret key is correctly set
- Verify server-side verification is implemented
- Check CAPTCHA score threshold settings
- Review network requests in browser dev tools

#### 3. Environment Detection Issues

**Symptoms:** Wrong CAPTCHA configuration being used

**Solutions:**
- Check `src/utils/environment.ts` for correct hostname detection
- Verify environment variables are set correctly
- Check if build process includes environment variables

#### 4. Build Failures

**Symptoms:** TypeScript or build errors

**Solutions:**
- Run `npm run build` to check for compilation errors
- Check if all CAPTCHA components are properly imported
- Verify TypeScript types are correct

### Debug Commands

```bash
# Check if CAPTCHA is enabled
npm run dev
# Open browser console and check for CAPTCHA logs

# Test build process
npm run build

# Run TypeScript validation
npx tsc --noEmit

# Run comprehensive tests
npx tsx scripts/test-captcha-integration.ts
```

## 🔒 Security Considerations

### Best Practices

1. **Never expose secret keys in client-side code**
2. **Use environment-specific configurations**
3. **Implement server-side verification**
4. **Set appropriate score thresholds per environment**
5. **Monitor CAPTCHA performance and scores**

### Score Thresholds

- **Production**: 0.5 (higher security)
- **Staging**: 0.3 (moderate security for testing)
- **Development**: 0.1 (low threshold for development)

### Server-Side Verification

The CAPTCHA token must be verified on the server side:

```javascript
// Example server-side verification (8n8 webhook)
const verifyCaptcha = async (token, secretKey) => {
  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${secretKey}&response=${token}`
  });
  
  const result = await response.json();
  return result.success && result.score >= threshold;
};
```

## 📞 Support

If you encounter issues with CAPTCHA integration:

1. Check the troubleshooting section above
2. Run the automated test suite
3. Review browser console logs
4. Check Google reCAPTCHA Admin Console for site status
5. Verify environment variables are set correctly

## 📚 Additional Resources

- [Google reCAPTCHA Documentation](https://developers.google.com/recaptcha/docs/v3)
- [react-google-recaptcha-v3 Library](https://www.npmjs.com/package/react-google-recaptcha-v3)
- [reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
- [Environment Variables Guide](https://vitejs.dev/guide/env-and-mode.html)

---

**Last Updated:** 2025-09-08T08:51:00.000Z
**Version:** 1.0.0
