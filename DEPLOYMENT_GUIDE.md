# 🚀 Hermes Security - Deployment Guide

## 📋 **CRITICAL: NO JEKYLL POLICY**

**This project is a React application deployed to GitHub Pages. Jekyll is completely disabled and will never be used.**

### **Why No Jekyll?**
- ✅ **React Application**: This is a modern React 18 + TypeScript application
- ✅ **Vite Build System**: Uses Vite for fast builds and optimized bundles
- ✅ **Static Site**: Built as static files and served directly
- ✅ **Custom Deployment**: GitHub Actions workflow handles deployment
- ✅ **Jekyll Disabled**: Multiple layers prevent Jekyll from ever running

## 🛠️ **Tech Stack & Architecture**

### **Frontend Stack:**
- **React 18** with TypeScript
- **Vite** as build tool (not Jekyll)
- **Tailwind CSS** for styling
- **React Router DOM** for client-side routing
- **Radix UI + shadcn/ui** for components
- **Lucide React** for icons

### **Deployment Stack:**
- **GitHub Pages** for hosting
- **GitHub Actions** for CI/CD
- **Vite Build** for production bundles
- **Static File Serving** (no server-side processing)

## 🚫 **Jekyll Prevention Strategy**

### **Multiple Layers of Jekyll Disabling:**

#### **1. .nojekyll Files**
```bash
# Root level
.nojekyll

# Built app level
dist/.nojekyll

# Docs folder level
docs/.nojekyll
```

#### **2. Jekyll Configuration Override**
```yaml
# _config.yml (root)
plugins: []
exclude: [node_modules, src, package.json, ...]

# docs/_config.yml
plugins: []
exclude: ["*"]
```

#### **3. GitHub Actions Workflow**
- Builds React app with Vite
- Creates docs folder with React app content
- Ensures all .nojekyll files are present
- Deploys static React app (not Jekyll)

#### **4. Docs Folder Structure**
- Contains full React application
- Redirects to main app if accessed directly
- Bypasses Jekyll completely

## 🔧 **Build & Deployment Process**

### **1. Development**
```bash
npm run dev          # Local development server
npm run build        # Production build
npm run build:staging # Staging build with base path
```

### **2. GitHub Actions Workflow**
```yaml
# .github/workflows/deploy.yml
1. Checkout code
2. Setup Node.js 18
3. Install dependencies (npm ci)
4. Build React app (npm run build:staging)
5. Disable Jekyll (create .nojekyll files)
6. Create docs folder structure
7. Deploy to GitHub Pages
```

### **3. Deployment Environments**

#### **Staging (GitHub Pages)**
- **URL**: `https://gjdbradford.github.io/hermes-security-production/`
- **Base Path**: `/hermes-security-production/`
- **Build Command**: `npm run build:staging`
- **Trigger**: Push to `main` branch

#### **Production (Vercel)**
- **URL**: `https://hermes-security-production.vercel.app/`
- **Base Path**: `/`
- **Build Command**: `npm run build:production`
- **Trigger**: After successful staging deployment

## 📁 **Project Structure**

```
hermes-security-production/
├── src/                    # React source code
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── utils/             # Utility functions
│   └── ...
├── dist/                  # Built React app (GitHub Pages)
├── docs/                  # Docs folder (Jekyll bypass)
├── .github/workflows/     # GitHub Actions
├── .nojekyll             # Disable Jekyll (root)
├── _config.yml           # Jekyll config override
└── package.json          # Node.js dependencies
```

## 🚨 **Important Notes**

### **DO NOT:**
- ❌ Enable Jekyll in GitHub Pages settings
- ❌ Remove .nojekyll files
- ❌ Modify _config.yml to enable Jekyll features
- ❌ Use Jekyll-specific features or plugins
- ❌ Create Jekyll layouts or includes

### **DO:**
- ✅ Use React components and pages
- ✅ Build with Vite (not Jekyll)
- ✅ Deploy static files to GitHub Pages
- ✅ Use GitHub Actions for deployment
- ✅ Keep Jekyll completely disabled

## 🔍 **Troubleshooting**

### **If Jekyll Errors Appear:**
1. **Check .nojekyll files** are present in root, dist, and docs
2. **Verify _config.yml** disables all Jekyll features
3. **Ensure GitHub Actions** creates proper file structure
4. **Check docs folder** contains React app, not Jekyll files

### **If Deployment Fails:**
1. **Check GitHub Actions logs** for build errors
2. **Verify Node.js version** is 18
3. **Ensure all dependencies** are installed correctly
4. **Check Vite build** completes successfully

## 📊 **Performance & Optimization**

### **Build Optimizations:**
- **Vite**: Fast builds with HMR
- **Tree Shaking**: Removes unused code
- **Code Splitting**: Lazy-loaded components
- **Asset Optimization**: Compressed images and assets
- **Bundle Analysis**: Optimized chunk sizes

### **Runtime Optimizations:**
- **React 18**: Concurrent features and Suspense
- **Lazy Loading**: Components loaded on demand
- **Image Optimization**: Responsive images with proper formats
- **Caching**: Static assets cached by CDN

## 🛡️ **Security & Compliance**

### **Security Features:**
- **HTTPS Only**: All traffic encrypted
- **Content Security Policy**: XSS protection
- **No Server-Side Code**: Static site reduces attack surface
- **Dependency Scanning**: Regular security audits

### **Compliance:**
- **GDPR**: Privacy-compliant data handling
- **Accessibility**: WCAG 2.1 AA compliant
- **Performance**: Core Web Vitals optimized

## 📞 **Support & Maintenance**

### **For Developers:**
- **Documentation**: Comprehensive guides and rules
- **Quality Gates**: Automated testing and validation
- **Git Hooks**: Pre-commit and pre-push validation
- **CI/CD**: Automated deployment pipeline

### **For Deployment Issues:**
- **Check GitHub Actions**: Monitor workflow runs
- **Review Logs**: Detailed build and deployment logs
- **Test Locally**: Reproduce issues in development
- **Update Dependencies**: Keep packages current

---

**🎯 Remember: This is a React application. Jekyll is disabled and will never be used. All deployment is handled by GitHub Actions and Vite builds.**
