# GitHub Pages Image Serving Fix Plan

## 🎯 **Current Issue**
- Images are being built correctly and included in the `dist/` folder
- GitHub Pages is not serving static assets (images) correctly
- Direct image URLs return 404 errors
- Main site loads but images don't display

## ✅ **What's Already Done**
- ✅ `.nojekyll` file exists in root directory
- ✅ GitHub Actions workflow is working
- ✅ Images are being copied to `dist/` folder during build
- ✅ Base path is correctly configured for staging (`/hermes-security-production/`)

## 🔧 **Root Cause Analysis**
The issue is likely one of the following:
1. **GitHub Pages Source Configuration**: Repository settings may not be pointing to the correct branch/folder
2. **Asset Path Resolution**: Images may be referenced with incorrect paths in the code
3. **GitHub Pages Jekyll Processing**: Despite `.nojekyll` file, Jekyll might still be interfering

## 📋 **Step-by-Step Fix Plan**

### **Step 1: Verify GitHub Pages Repository Settings**
1. Go to your repository: `https://github.com/gjdbradford/hermes-security-production`
2. Navigate to **Settings** → **Pages**
3. Verify the following settings:
   - **Source**: "Deploy from a branch"
   - **Branch**: `main` (or `gh-pages` if using that branch)
   - **Folder**: `/ (root)` - **This is critical for serving from docs folder**
4. If you want to serve from `docs/` folder:
   - Change **Folder** to `/docs`
   - Update build configuration accordingly

### **Step 2: Update Build Configuration for docs/ Folder (Optional)**
If you want to serve from `docs/` folder instead of root:

```bash
# Update vite.config.ts to output to docs/ folder
build: {
  outDir: 'docs',
  // ... other settings
}
```

### **Step 3: Verify Image Paths in Code**
Check all image references in your components:

```typescript
// ✅ Correct path for staging
src="/hermes-security-production/images/logos/logo.svg"

// ❌ Incorrect paths
src="/images/logos/logo.svg"
src="images/logos/logo.svg"
```

### **Step 4: Test Current Deployment**
```bash
# Test main site
curl -I https://gjdbradford.github.io/hermes-security-production/

# Test image directly
curl -I https://gjdbradford.github.io/hermes-security-production/images/logos/logo.svg

# Test with different path variations
curl -I https://gjdbradford.github.io/hermes-security-production/assets/logo.svg
```

### **Step 5: Update GitHub Actions Workflow**
Ensure the workflow copies `.nojekyll` to the correct location:

```yaml
- name: Ensure static assets are accessible
  run: |
    # Copy .nojekyll file to prevent Jekyll processing
    cp .nojekyll dist/ || echo ".nojekyll file not found, creating one"
    echo "# This file tells GitHub Pages not to process the site with Jekyll" > dist/.nojekyll
    
    # If using docs/ folder
    # cp .nojekyll docs/ || echo ".nojekyll file not found, creating one"
    # echo "# This file tells GitHub Pages not to process the site with Jekyll" > docs/.nojekyll
```

### **Step 6: Alternative Solutions**

#### **Option A: Use docs/ Folder Structure**
1. Update `vite.config.ts`:
```typescript
build: {
  outDir: 'docs',
  // ... other settings
}
```

2. Update GitHub Pages settings to use `/docs` folder
3. Update all image paths to be relative to docs/

#### **Option B: Use gh-pages Branch**
1. Update GitHub Actions to deploy to `gh-pages` branch
2. Update repository settings to use `gh-pages` branch
3. Ensure `.nojekyll` is copied to the gh-pages branch

#### **Option C: Use CDN for Images**
1. Upload images to a CDN (Cloudinary, AWS S3, etc.)
2. Update image references to use CDN URLs
3. This bypasses GitHub Pages static asset limitations

## 🚀 **Recommended Approach**

### **Immediate Fix (Recommended)**
1. **Verify GitHub Pages Settings**: Ensure folder is set to `/ (root)`
2. **Check Image Paths**: Verify all image references use correct base path
3. **Force Re-deploy**: Push a small change to trigger new deployment
4. **Test**: Verify images load correctly

### **If Issues Persist**
1. **Switch to docs/ folder**: Update build configuration and repository settings
2. **Use CDN**: Upload critical images to CDN for reliable serving

## 🔍 **Testing Checklist**

- [ ] Main site loads: `https://gjdbradford.github.io/hermes-security-production/`
- [ ] Logo displays correctly on homepage
- [ ] Direct image access works: `https://gjdbradford.github.io/hermes-security-production/images/logos/logo.svg`
- [ ] All other images (hero-bg.jpg, favicon.ico, etc.) load correctly
- [ ] No 404 errors in browser console
- [ ] Images load in different browsers

## 📞 **Next Steps**
1. Check GitHub Pages repository settings
2. Verify image paths in code
3. Test current deployment
4. Implement recommended fix
5. Monitor for any remaining issues

---

**Status**: Ready for implementation
**Priority**: High
**Estimated Time**: 30-60 minutes
