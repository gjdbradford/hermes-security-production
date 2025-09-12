# 🚦 ROUTING RULES & GUIDELINES

## ⚠️ CRITICAL: NEVER BREAK THESE RULES

This document establishes mandatory rules for routing across all environments to prevent 404 errors and broken navigation.

## 🌍 Environment-Specific Routing

### **Local Development** (`localhost:8081`)
- **Base Path**: `/`
- **Contact Page**: `/#/contact`
- **About Page**: `/#/about`
- **Home Page**: `/#/`

### **Staging** (`gjdbradford.github.io`)
- **Base Path**: `/hermes-security-production/`
- **Contact Page**: `/hermes-security-production/#/contact`
- **About Page**: `/hermes-security-production/#/about`
- **Home Page**: `/hermes-security-production/#/`

### **Production** (Vercel)
- **Base Path**: `/`
- **Contact Page**: `/#/contact`
- **About Page**: `/#/about`
- **Home Page**: `/#/`

## 📋 MANDATORY ROUTING RULES

### **Rule 1: ALWAYS Use `buildUrl()` Function**
```javascript
// ✅ CORRECT - Use buildUrl for all navigation
import { buildUrl } from "@/utils/routingUtils";

const contactUrl = buildUrl('contact');
window.location.href = contactUrl;

// ❌ WRONG - Never use direct paths
window.location.href = '/contact';
navigate('/contact');
```

### **Rule 2: NEVER Use React Router's `navigate()` for Page Navigation**
```javascript
// ❌ WRONG - This breaks staging environment
const navigate = useNavigate();
navigate('/about');

// ✅ CORRECT - Use buildUrl instead
const aboutUrl = buildUrl('about');
window.location.href = aboutUrl;
```

### **Rule 3: Use `TriggerHandlers.contactForm()` for Contact CTAs**
```javascript
// ✅ CORRECT - Use existing working logic
import { TriggerHandlers } from "@/utils/crispTriggers";

onClick={() => {
  TriggerHandlers.contactForm('Get In Touch');
}}

// ❌ WRONG - Don't create custom contact navigation
onClick={() => {
  window.location.href = '/contact';
}}
```

### **Rule 4: Handle Hash Routing Correctly**
```javascript
// ✅ CORRECT - buildUrl handles hash routing automatically
const url = buildUrl('about'); // Returns correct hash-based URL

// ❌ WRONG - Manual hash construction
const url = `${basePath}#/about`; // May not work in all environments
```

### **Rule 5: NEVER Use Hardcoded Paths in HTML Templates**
```html
<!-- ❌ WRONG - Hardcoded paths break staging environment -->
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
<link rel="manifest" href="/site.webmanifest" />
<meta property="og:image" content="/images/social/og-image.svg" />
<script type="module" src="/src/main.tsx"></script>

<!-- ✅ CORRECT - Relative paths work with Vite's base path -->
<link rel="icon" type="image/x-icon" href="favicon.ico" />
<link rel="manifest" href="site.webmanifest" />
<meta property="og:image" content="images/social/og-image.svg" />
<script type="module" src="src/main.tsx"></script>
```

## 🔧 Implementation Examples

### **Header Navigation**
```javascript
// ✅ CORRECT Implementation
const handleNavigation = (item) => {
  if (item.type === 'route') {
    const routePath = item.href.replace('/', '');
    const routeUrl = buildUrl(routePath);
    window.location.href = routeUrl;
  } else {
    // Handle anchor navigation
    const sectionId = item.href.replace('#', '');
    const homeUrl = buildUrl('');
    window.location.href = homeUrl;
    setTimeout(() => scrollToSection(sectionId), 100);
  }
};
```

### **CTA Buttons**
```javascript
// ✅ CORRECT - Use TriggerHandlers for contact CTAs
<Button onClick={() => TriggerHandlers.contactForm('CTA Source')}>
  Get In Touch
</Button>

// ✅ CORRECT - Use buildUrl for other page CTAs
<Button onClick={() => {
  const aboutUrl = buildUrl('about');
  window.location.href = aboutUrl;
}}>
  Learn More
</Button>
```

### **Link Components**
```javascript
// ✅ CORRECT - Use buildUrl for href
<Link to={buildUrl('about')}>About Us</Link>

// ❌ WRONG - Direct path
<Link to="/about">About Us</Link>
```

## 🧪 Testing Requirements

### **Before Any Routing Changes:**
1. **Test Local**: `localhost:8081`
2. **Test Staging**: `gjdbradford.github.io/hermes-security-production/`
3. **Test Production**: Vercel deployment

### **Required Test Cases:**
- [ ] Header "About" link works in all environments
- [ ] Header "Get In Touch" button works in all environments
- [ ] CTA section buttons work in all environments
- [ ] Contact form reloads correctly when already on contact page
- [ ] All hash routing works correctly

## 🚨 Common Mistakes to Avoid

### **Mistake 1: Using React Router navigate()**
```javascript
// ❌ This breaks staging environment
navigate('/about');
```

### **Mistake 2: Hardcoded Paths**
```javascript
// ❌ This only works in local/production
window.location.href = '/contact';
```

### **Mistake 3: Manual Hash Construction**
```javascript
// ❌ This may not work correctly
const url = `${basePath}#/contact`;
```

### **Mistake 4: Not Testing All Environments**
- Always test local, staging, and production
- Don't assume what works locally will work in staging

## 📁 File Locations

### **Routing Utilities**
- `src/utils/routingUtils.ts` - Core routing functions
- `src/utils/crispTriggers.ts` - CTA trigger handlers

### **Components Using Routing**
- `src/components/Header.tsx` - Main navigation
- `src/components/CTASection.tsx` - CTA buttons
- `src/pages/Contact.tsx` - Contact page

## 🔍 Debugging Routing Issues

### **Check Console Logs**
The routing utilities include debug logging:
```javascript
console.log('🔍 Routing Debug:', { hostname, pathname });
console.log('🔗 Built URL:', { basePath, cleanPath, finalUrl });
```

### **Environment Detection**
```javascript
import { getEnvironment } from "@/utils/routingUtils";
console.log('Environment:', getEnvironment()); // 'development' | 'staging' | 'production'
```

## 🚫 **ROUTING DUPLICATION PREVENTION RULES**

### **Rule 6: NEVER Allow Function Call Spam**
```javascript
// ❌ WRONG - This causes console spam and performance issues
export const getBasePath = (): string => {
  console.log('🔍 Routing Debug:', { hostname, pathname }); // Logs every call
  // ... routing logic
};

// ✅ CORRECT - Cache results and log only once
let cachedBasePath: string | null = null;
let hasLoggedEnvironment = false;

export const getBasePath = (): string => {
  if (cachedBasePath !== null) {
    return cachedBasePath; // Return cached value
  }
  
  if (!hasLoggedEnvironment) {
    console.log('🔍 Routing Debug:', { hostname, pathname }); // Log only once
    hasLoggedEnvironment = true;
  }
  
  // ... routing logic with caching
  cachedBasePath = result;
  return cachedBasePath;
};
```

### **Rule 7: Cache Expensive Routing Operations**
```javascript
// ✅ CORRECT - Cache base path calculations
let cachedBasePath: string | null = null;

// ✅ CORRECT - Cache environment detection
let cachedEnvironment: string | null = null;

// ✅ CORRECT - One-time logging flags
let hasLoggedEnvironment = false;
let urlBuildLogged = false;
```

### **Rule 8: Prevent Console Spam in Production**
```javascript
// ✅ CORRECT - Conditional logging
if (process.env.NODE_ENV === 'development' && !window.urlBuildLogged) {
  console.log('🔗 Built URL:', { basePath, cleanPath, finalUrl });
  window.urlBuildLogged = true;
}

// ✅ CORRECT - Session-based logging control
if (!window.environmentInfoLogged) {
  console.log('🌍 Environment Info:', environmentData);
  window.environmentInfoLogged = true;
}
```

### **Rule 9: Optimize Component Re-renders**
```javascript
// ❌ WRONG - Function called on every render
const MyComponent = () => {
  const basePath = getBasePath(); // Called every render
  return <div>{basePath}</div>;
};

// ✅ CORRECT - Memoize or cache expensive calls
const MyComponent = () => {
  const basePath = useMemo(() => getBasePath(), []); // Called once
  return <div>{basePath}</div>;
};
```

### **Rule 10: Prevent Multiple Navigation Calls**
```javascript
// ❌ WRONG - Multiple calls to same function
const handleClick = () => {
  getBasePath(); // Call 1
  buildUrl('contact'); // Calls getBasePath() again
  navigateToContact(); // Calls getBasePath() again
};

// ✅ CORRECT - Single call with caching
const handleClick = () => {
  const basePath = getBasePath(); // Called once, cached
  // Use cached value for subsequent operations
};
```

## 📝 Code Review Checklist

Before approving any routing-related changes:

- [ ] Uses `buildUrl()` for all page navigation
- [ ] Uses `TriggerHandlers.contactForm()` for contact CTAs
- [ ] No direct `navigate()` calls for page navigation
- [ ] No hardcoded paths
- [ ] Tested in all three environments
- [ ] Console logs show correct URL generation
- [ ] Hash routing works correctly
- [ ] **No function call duplication** - routing functions are cached
- [ ] **No console spam** - debug logs appear only once per session
- [ ] **Performance optimized** - expensive operations are memoized
- [ ] **Component re-renders** don't cause repeated function calls
- [ ] **Window properties** are properly typed for logging flags
- [ ] **HTML templates use relative paths** - no hardcoded `/favicon.ico` or `/manifest.json`
- [ ] **Favicon displays correctly** in all environments (dev, staging, production)

## 🎯 Quick Reference

| Action | Use This | Don't Use This |
|--------|----------|----------------|
| Navigate to About | `buildUrl('about')` | `navigate('/about')` |
| Navigate to Contact | `TriggerHandlers.contactForm('Source')` | `buildUrl('contact')` |
| Navigate to Home | `buildUrl('')` | `navigate('/')` |
| Check Environment | `getEnvironment()` | Manual hostname checking |

## 🚨 **CRITICAL ISSUE RESOLVED: Console Spam Prevention**

### **Issue Fixed (2025-01-XX)**
- **Problem 1**: Multiple repeated "Routing Debug" messages in console when clicking "Get In Touch"
- **Root Cause 1**: `getBasePath()` function called multiple times without caching
- **Solution 1**: Implemented caching and one-time logging flags
- **Files Modified 1**: `src/utils/routingUtils.ts`, `src/vite-env.d.ts`

- **Problem 2**: Favicon not displaying in staging environment (showing generic globe icon)
- **Root Cause 2**: Hardcoded absolute paths in HTML templates (`/favicon.ico`, `/site.webmanifest`)
- **Solution 2**: Changed to relative paths that work with Vite's base path handling
- **Files Modified 2**: `index.html`, `docs/index.html`

### **Prevention Measures**
- All routing functions now use caching to prevent repeated calculations
- Debug logging is limited to once per session
- Component re-renders don't trigger repeated function calls
- Performance is optimized for production environments
- HTML templates use relative paths that work with Vite's base path handling
- Favicon and manifest files display correctly in all environments

---

**Remember**: These rules exist because routing is complex across different environments. Following them prevents 404 errors, broken navigation, and console spam that degrades user experience.
