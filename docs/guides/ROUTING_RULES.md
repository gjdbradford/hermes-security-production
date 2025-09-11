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

## 📝 Code Review Checklist

Before approving any routing-related changes:

- [ ] Uses `buildUrl()` for all page navigation
- [ ] Uses `TriggerHandlers.contactForm()` for contact CTAs
- [ ] No direct `navigate()` calls for page navigation
- [ ] No hardcoded paths
- [ ] Tested in all three environments
- [ ] Console logs show correct URL generation
- [ ] Hash routing works correctly

## 🎯 Quick Reference

| Action | Use This | Don't Use This |
|--------|----------|----------------|
| Navigate to About | `buildUrl('about')` | `navigate('/about')` |
| Navigate to Contact | `TriggerHandlers.contactForm('Source')` | `buildUrl('contact')` |
| Navigate to Home | `buildUrl('')` | `navigate('/')` |
| Check Environment | `getEnvironment()` | Manual hostname checking |

---

**Remember**: These rules exist because routing is complex across different environments. Following them prevents 404 errors and broken navigation.
