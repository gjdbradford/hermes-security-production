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

### **5. Scroll-to-Top Navigation Requirements**
- **MUST** implement ScrollToTop component in App.tsx for all route navigation
- **MUST** ensure ScrollToTop component is placed inside BrowserRouter
- **MUST** use smooth scrolling behavior for better UX
- **MUST** work with all navigation methods (links, buttons, programmatic)
- **MUST** NOT interfere with CTA logic or sessionStorage operations
- **MUST** be tested on all environments (dev, staging, production)

### **6. ChatBot Integration Rules**
- **ONLY 2 CTAs** can activate ChatBot:
  1. **"Learn More About Our Services"** button in AboutCTASection.tsx
  2. **Contact Form Submission** (after successful form submission)
- **ALL OTHER CTAs** must use standard `navigateToContact()` function
- **MUST** use ChatBotUtils for approved ChatBot activations
- **MUST NOT** modify any other CTA buttons to launch ChatBot
- **MUST** follow CHATBOT_MASTER_RULES.md for ChatBot implementations

### **7. Header "Get In Touch" Button**
- **MUST** check if already on contact page
- **MUST** do nothing if already on contact page (NO page reload - breaks staging)
- **MUST** navigate normally if not on contact page
- **MUST** work on both desktop and mobile
- **MUST NEVER** use `window.location.reload()` (breaks GitHub Pages routing)
- **MUST NOT** launch ChatBot (protected CTA)

### **8. GitHub Pages Deployment Rules**
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

### **ScrollToTop Component** (`src/components/ScrollToTop.tsx`)
```typescript
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
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
- ✅ ScrollToTop component scrolls to top on all route changes
- ✅ ScrollToTop works with all navigation methods (links, buttons, programmatic)
- ✅ ScrollToTop does not interfere with CTA logic or sessionStorage
- ✅ ChatBot launches only from approved CTAs (Learn More About Our Services + Contact Form)
- ✅ All other CTAs still navigate to contact page normally (NO ChatBot)
- ✅ ChatBot context data is set correctly
- ✅ Crisp chat widget opens properly

## 🔄 **Build Validation**

Every build MUST:
1. **Validate CTA components** use correct navigation
2. **Check base path configuration** for all environments
3. **Verify CTA source tracking** is implemented
4. **Verify ScrollToTop component** is properly integrated in App.tsx
5. **Verify ChatBot integration** works only for approved CTAs
6. **Validate ChatBot master rules** are followed
7. **Test staging environment** pathing
8. **Ensure no forbidden patterns** are used
9. **Verify no `docs/` folder** in repository root
10. **Confirm GitHub Pages serves React app** not documentation
11. **Test staging deployment** after any folder structure changes

---

**⚠️ CRITICAL: These rules are NON-NEGOTIABLE. Any changes that break these patterns will cause staging environment failures and CTA source tracking issues.**
