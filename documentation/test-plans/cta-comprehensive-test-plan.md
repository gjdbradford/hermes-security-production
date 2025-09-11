# CTA Comprehensive Test Plan

## Overview
This test plan ensures all Call-to-Action (CTA) buttons across the application work correctly with proper navigation, CTA source passing, and contact form title display.

## Test Requirements

### 1. CTA Source Passing ✅
- **Requirement**: Every CTA button must pass its button text as `ctaSource` through `sessionStorage`
- **Implementation**: `sessionStorage.setItem('cta-source', ctaButtonText)`
- **Verification**: Check browser dev tools > Application > Session Storage for `cta-source` value

### 2. Proper URL Navigation ✅
- **Requirement**: All CTAs must navigate to `/contact` (not `/#/contact`)
- **Implementation**: `window.location.href = window.location.origin + '/contact'`
- **Verification**: URL should be `http://localhost:8080/contact` (or appropriate environment URL)

### 3. Contact Form Title Display ✅
- **Requirement**: Contact form must display the CTA source text as the title
- **Implementation**: Contact form reads `sessionStorage.getItem('cta-source')` and displays it
- **Verification**: Contact form title should match the clicked CTA button text

### 4. Default Contact Form Title ✅
- **Requirement**: If no CTA source is passed, contact form defaults to "Get In Touch"
- **Implementation**: Default state in Contact component is "Get In Touch"
- **Verification**: Direct navigation to `/contact` shows "Get In Touch" as title

## Components to Test

### Homepage Components
1. **HeroSection** - "Book Your Pen Test Today" button
2. **CTASection** - "Schedule a Discovery Call" and "Start a Pen Test Today" buttons
3. **ServicesSection** - "Book Your Security Assessment Today" button
4. **ValueProposition** - "Book Your Pen Test Today" button
5. **Header** - "Get In Touch" button (desktop and mobile)

### About Page Components
6. **AboutHeroSection** - "Start Your Security Journey" button
7. **AboutCTASection** - "Start Your Security Journey" button

### Other Pages
8. **HowToGetServicesSection** - "Book Your Pen Test Today" button

## Test Steps

### For Each CTA Button:
1. **Click the CTA button**
2. **Verify URL Navigation**: Check that URL is `/contact` (not `/#/contact`)
3. **Verify CTA Source**: Check browser dev tools > Application > Session Storage for `cta-source` value
4. **Verify Contact Form Title**: Check that contact form displays the CTA button text as title
5. **Verify Form Reset**: Check that form fields are cleared and form is ready for input

### Default Contact Form Test:
1. **Direct Navigation**: Go directly to `/contact` URL
2. **Verify Default Title**: Check that title shows "Get In Touch"
3. **Verify Form State**: Check that form is ready for input

## Test Environments

### Local Development
- **URL**: `http://localhost:8080/`
- **Contact URL**: `http://localhost:8080/contact`

### Staging (GitHub Pages)
- **URL**: `https://gjdbradford.github.io/hermes-security-production/`
- **Contact URL**: `https://gjdbradford.github.io/hermes-security-production/contact`

### Production (Vercel)
- **URL**: `https://www.hermessecurity.io/`
- **Contact URL**: `https://www.hermessecurity.io/contact`

## Expected Results

### ✅ Pass Criteria
- All CTA buttons navigate to correct `/contact` URL
- All CTA buttons pass their text as `cta-source` in sessionStorage
- Contact form displays the correct CTA source text as title
- Direct navigation to `/contact` shows "Get In Touch" as default title
- Form fields are cleared and ready for input

### ❌ Fail Criteria
- CTA buttons navigate to `/#/contact` (hash routing)
- CTA buttons don't pass `cta-source` to sessionStorage
- Contact form doesn't display the correct title
- Form fields are not cleared or form is not ready for input

## Implementation Checklist

### For Each CTA Component:
- [ ] Remove `TriggerHandlers.contactForm()` calls
- [ ] Add `handleCTAClick` function with proper navigation
- [ ] Store CTA source in `sessionStorage`
- [ ] Use `window.location.href` for navigation
- [ ] Add console logging for debugging

### Contact Form Component:
- [ ] Read `cta-source` from `sessionStorage` on load
- [ ] Display CTA source as title (or "Get In Touch" as default)
- [ ] Clear form fields and reset form state
- [ ] Scroll to top of page

## Debugging

### Console Logs to Look For:
- `🔘 [Component] CTA clicked: [CTA Text]`
- `💾 Stored CTA source: [CTA Text]`
- `🧭 Navigating to: [Contact URL]`
- `✅ ContactForm: Received CTA source from parent: [CTA Text]`

### Common Issues:
1. **Hash Routing**: URL shows `/#/contact` instead of `/contact`
2. **Missing CTA Source**: sessionStorage doesn't contain `cta-source`
3. **Wrong Title**: Contact form shows wrong title
4. **Form Not Reset**: Form fields contain previous values

## Test Execution

### Manual Testing:
1. Test each CTA button individually
2. Verify all 4 requirements for each button
3. Test in all 3 environments (local, staging, production)
4. Test direct navigation to contact form

### Automated Testing:
- Use browser console to run test scripts
- Check sessionStorage values programmatically
- Verify URL navigation programmatically

## Success Metrics
- **100% CTA Button Coverage**: All CTA buttons follow the 4 requirements
- **Cross-Environment Compatibility**: Works in local, staging, and production
- **User Experience**: Smooth navigation with proper form state management
- **Debugging**: Clear console logs for troubleshooting
