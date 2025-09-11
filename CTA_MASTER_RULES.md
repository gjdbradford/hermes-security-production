# 🎯 CTA Master Rules - Hermes Security

## 📋 **CRITICAL RULES - NEVER BREAK THESE**

### **1. Environment-Specific Base Paths**
- **Development**: `/` (localhost:5173)
- **Staging**: `/hermes-security-production/` (GitHub Pages)
- **Production**: `/` (Vercel)

### **2. CTA Source Tracking Requirements**
- **MUST** store CTA source in `sessionStorage.setItem('cta-source', ctaSource)`
- **MUST** pass CTA source to contact page for header display
- **MUST** support both sessionStorage (primary) and URL params (fallback)
- **MUST** clear sessionStorage after reading to prevent stale data

### **3. Navigation Requirements**
- **MUST** use React Router `navigate()` for proper base path context
- **MUST** use `navigateToContact(navigate, ctaSource)` utility function
- **MUST** always use relative paths (e.g., `/contact`) - React Router handles base path automatically
- **MUST** never manually construct paths with `getBasePath()` for navigation
- **MUST** never use `window.location.href` directly (breaks staging)

### **4. Contact Page Behavior**
- **MUST** read CTA source from sessionStorage first, then URL params
- **MUST** display CTA source in contact form header
- **MUST** reset form when "Get In Touch" clicked from contact page
- **MUST** scroll to top when reloading contact page

### **5. Header "Get In Touch" Button**
- **MUST** check if already on contact page
- **MUST** do nothing if already on contact page (NO page reload - breaks staging)
- **MUST** navigate normally if not on contact page
- **MUST** work on both desktop and mobile
- **MUST NEVER** use `window.location.reload()` (breaks GitHub Pages routing)

### **6. GitHub Pages Deployment Rules**
- **MUST** never have a `docs/` folder in the repository root (conflicts with GitHub Pages)
- **MUST** use GitHub Actions deployment instead of docs folder
- **MUST** ensure `.nojekyll` file is created in dist/ folder
- **MUST** verify staging serves React app, not documentation
- **MUST** test staging deployment after any folder structure changes

## 🔧 **Required Components**

### **CTA Navigation Utility** (`src/utils/ctaNavigation.ts`)
```typescript
export const navigateToContact = (navigate: NavigateFunction, ctaSource: string): void => {
  sessionStorage.setItem('cta-source', ctaSource);
  // Always use relative path - React Router handles base path automatically
  navigate('/contact');
};
```

### **Routing Utilities** (`src/utils/routingUtils.ts`)
```typescript
export const getBasePath = (): string => {
  // Staging: /hermes-security-production/
  // Production: /
  // Development: /
};
```

### **Contact Page CTA Source Reading**
```typescript
// Read from sessionStorage first, then URL params
const ctaFromStorage = sessionStorage.getItem('cta-source');
if (ctaFromStorage) {
  setCtaSource(ctaFromStorage);
  sessionStorage.removeItem('cta-source');
}
```

## 🚫 **FORBIDDEN PATTERNS**

### **Never Use These**
- ❌ `window.location.href = contactUrl` (breaks staging)
- ❌ `window.location.reload()` (breaks GitHub Pages routing)
- ❌ Manual path construction with `getBasePath()` for navigation
- ❌ Direct navigation without base path awareness
- ❌ CTA buttons without source tracking
- ❌ Contact page without CTA source reading
- ❌ Hardcoded paths without environment detection
- ❌ `docs/` folder in repository root (conflicts with GitHub Pages)
- ❌ GitHub Pages serving documentation instead of React app

## ✅ **Required CTA Components**

All these components MUST use `navigateToContact(navigate, ctaSource)`:

1. **Header.tsx** - Desktop & Mobile "Get In Touch"
2. **CTASection.tsx** - Main CTA buttons
3. **HeroSection.tsx** - Hero CTA buttons
4. **ValueProposition.tsx** - Value prop CTA
5. **ServicesSection.tsx** - Services CTA
6. **HowToGetServicesSection.tsx** - How to get services CTA
7. **CaseStudySection.tsx** - Case study CTA
8. **AboutHeroSection.tsx** - About hero CTA
9. **AboutCTASection.tsx** - About CTA

## 🧪 **Testing Requirements**

### **Must Test On All Environments**
- ✅ Development (localhost:5173)
- ✅ Staging (GitHub Pages with `/hermes-security-production/`)
- ✅ Production (Vercel with `/`)

### **Must Verify**
- ✅ CTA buttons navigate correctly
- ✅ CTA source appears in contact page header
- ✅ Base paths work on all environments
- ✅ Form resets when "Get In Touch" clicked from contact page
- ✅ No broken navigation on staging

## 🔄 **Build Validation**

Every build MUST:
1. **Validate CTA components** use correct navigation
2. **Check base path configuration** for all environments
3. **Verify CTA source tracking** is implemented
4. **Test staging environment** pathing
5. **Ensure no forbidden patterns** are used
6. **Verify no `docs/` folder** in repository root
7. **Confirm GitHub Pages serves React app** not documentation
8. **Test staging deployment** after any folder structure changes

---

**⚠️ CRITICAL: These rules are NON-NEGOTIABLE. Any changes that break these patterns will cause staging environment failures and CTA source tracking issues.**
