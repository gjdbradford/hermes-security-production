# 🏗️ Build Plans

This directory contains all build and deployment documentation for the Hermes Security project.

## 🚨 **MANDATORY CDN INTEGRATION RULE**

**ALL enhancements, builds, and deployments MUST follow this rule:**

### 🔒 **CDN Asset Management**
- ❌ **NEVER** use local asset paths in production
- ✅ **ALWAYS** upload assets to Vercel Blob Storage
- ✅ **ALWAYS** use full CDN URLs with `getImagePath()` utility
- ✅ **ALWAYS** update asset configuration in `src/config/assets.ts`

### 📋 **CDN Integration Process**
```bash
# 1. Add assets to public/images/ directory
# 2. Update src/config/assets.ts with asset metadata
# 3. Upload to CDN
npm run assets:upload

# 4. Verify CDN integration
npm run assets:status

# 5. Test CDN functionality
npm run test:cdn
```

**📖 Full CDN Rule Documentation**: [CDN Integration Rule](./cdn-integration-rule.md)

---

## 📋 Available Build Plans

### Deployment Documentation
- **[deployment.md](./deployment.md)** - Main deployment procedures
- **[deployment-status.md](./deployment-status.md)** - Current deployment status
- **[deployment-fixes.md](./deployment-fixes.md)** - Deployment issue fixes

### Migration & Setup
- **[migration-checklist.md](./migration-checklist.md)** - Complete migration checklist
- **[github-pages-image-fix.md](./github-pages-image-fix.md)** - GitHub Pages image optimization
- **[github-pages-jekyll-fix.md](./github-pages-jekyll-fix.md)** - Jekyll configuration fixes
- **[image-migration-test-plan.md](./image-migration-test-plan.md)** - Image migration procedures
- **[jekyll-fix-summary.md](./jekyll-fix-summary.md)** - Jekyll fix summary

### Recent Updates
- **[homepage-how-to-get-services-update.md](./homepage-how-to-get-services-update.md)** - New homepage section with CDN integration
- **[cdn-migration-build-plan.md](./cdn-migration-build-plan.md)** - CDN migration procedures

## 🚀 Build Process

The build process follows these stages:
1. **Development** - Local development with hot reload
2. **Staging** - Staging environment testing with CDN verification
3. **Production** - Production build and deployment with CDN validation
4. **Validation** - Post-deployment verification including CDN performance

## 📊 Build Status

- ✅ **Development Build**: Working
- ✅ **Production Build**: Working
- ✅ **GitHub Pages Deployment**: Active
- ✅ **Asset Optimization**: Complete
- ✅ **Performance Optimization**: Complete
- ✅ **CDN Integration**: Active and Mandatory

## 🔧 Build Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Staging build
npm run build:staging

# Production build
npm run build:production

# Asset Management (CDN Integration)
npm run assets:upload      # Upload assets to CDN
npm run assets:status      # Check asset status
npm run assets:sync        # Sync asset configuration
npm run test:cdn           # Test CDN functionality
```

## 🚀 **CDN Integration Checklist**

Before any deployment, verify:

- [ ] All new assets uploaded to Vercel Blob Storage
- [ ] Asset configuration updated in `src/config/assets.ts`
- [ ] Components use `getImagePath()` utility
- [ ] No local asset references remain
- [ ] CDN functionality tested
- [ ] Performance meets requirements

---

**Last Updated**: December 2025  
**CDN Rule Status**: **MANDATORY - NO EXCEPTIONS**
