# ⚡ Performance Master Rules - Hermes Security

## 📋 **CRITICAL RULES - NEVER BREAK THESE**

### **1. Function Call Optimization Rules**
- **MUST** cache expensive function calls that are called multiple times
- **MUST** prevent console spam by implementing one-time logging flags
- **MUST** use memoization for functions called during component re-renders
- **MUST** avoid repeated calculations in utility functions

### **2. Console Logging Rules**
- **MUST** limit debug logging to once per session for routing functions
- **MUST** use conditional logging based on environment (development only when appropriate)
- **MUST** implement session-based flags to prevent repeated console messages
- **MUST** never log the same message multiple times in a single user session

### **3. Component Performance Rules**
- **MUST** use `useMemo()` for expensive calculations in components
- **MUST** use `useCallback()` for event handlers that are passed as props
- **MUST** prevent unnecessary re-renders that trigger repeated function calls
- **MUST** cache results of utility functions that don't change during session

### **4. Utility Function Rules**
- **MUST** implement caching for functions that:
  - Are called multiple times per session
  - Perform expensive calculations
  - Access browser APIs (window.location, etc.)
  - Generate debug output
- **MUST** use module-level variables for caching
- **MUST** reset cache only when necessary (e.g., environment changes)

## 🔧 **Required Implementation Patterns**

### **Caching Pattern for Utility Functions**
```typescript
// ✅ CORRECT - Cached utility function
let cachedResult: string | null = null;
let hasLogged = false;

export const getExpensiveValue = (): string => {
  if (cachedResult !== null) {
    return cachedResult; // Return cached value
  }
  
  // Only log once per session
  if (!hasLogged) {
    console.log('🔍 Debug info:', debugData);
    hasLogged = true;
  }
  
  // Expensive calculation
  const result = performExpensiveCalculation();
  cachedResult = result;
  return result;
};
```

### **Component Memoization Pattern**
```typescript
// ✅ CORRECT - Memoized component calculations
const MyComponent = () => {
  const expensiveValue = useMemo(() => getExpensiveValue(), []);
  const handleClick = useCallback(() => {
    // Handle click
  }, []);
  
  return <div onClick={handleClick}>{expensiveValue}</div>;
};
```

### **Session-Based Logging Pattern**
```typescript
// ✅ CORRECT - One-time logging per session
export const logEnvironmentInfo = (): void => {
  if (!(window as any).environmentInfoLogged) {
    console.log('🌍 Environment Info:', environmentData);
    (window as any).environmentInfoLogged = true;
  }
};
```

### **TypeScript Window Extensions**
```typescript
// ✅ CORRECT - Type window properties for logging flags
declare global {
  interface Window {
    environmentInfoLogged?: boolean;
    urlBuildLogged?: boolean;
    customFlagLogged?: boolean;
  }
}
```

## 🚫 **FORBIDDEN PATTERNS**

### **Never Use These**
- ❌ **Uncached expensive functions** called multiple times
- ❌ **Console.log without session flags** in utility functions
- ❌ **Functions that log on every call** without caching
- ❌ **Component calculations without memoization** when expensive
- ❌ **Repeated API calls** for the same data
- ❌ **Window property access** without caching

### **Anti-Patterns to Avoid**
```typescript
// ❌ WRONG - Logs every call, no caching
export const getBasePath = (): string => {
  console.log('🔍 Routing Debug:', { hostname, pathname }); // Spam!
  // ... expensive calculation every time
};

// ❌ WRONG - No memoization in component
const MyComponent = () => {
  const value = getExpensiveValue(); // Called every render
  return <div>{value}</div>;
};

// ❌ WRONG - No session-based logging control
const logInfo = () => {
  console.log('Info:', data); // Logs every time
};
```

## ✅ **Required Performance Optimizations**

### **1. Routing Functions** (`src/utils/routingUtils.ts`)
- ✅ Cache `getBasePath()` results
- ✅ One-time environment logging
- ✅ Session-based debug flags
- ✅ Conditional production logging

### **2. Component Optimizations**
- ✅ Memoize expensive calculations
- ✅ Use `useCallback` for event handlers
- ✅ Prevent unnecessary re-renders
- ✅ Cache utility function results

### **3. Debug Logging**
- ✅ Session-based logging flags
- ✅ Environment-conditional logging
- ✅ One-time initialization messages
- ✅ Performance-aware console output

## 🧪 **Testing Requirements**

### **Performance Testing**
- ✅ **Console spam test**: No repeated debug messages
- ✅ **Function call count**: Expensive functions called only once
- ✅ **Component re-render**: No unnecessary calculations
- ✅ **Memory usage**: No memory leaks from caching
- ✅ **Session persistence**: Logging flags work across page navigation

### **Required Test Cases**
- [ ] Click "Get In Touch" - no console spam
- [ ] Navigate between pages - no repeated routing logs
- [ ] Component re-renders - no repeated calculations
- [ ] Page refresh - logging flags reset appropriately
- [ ] Multiple user sessions - each gets one-time logging

## 🔄 **Build Validation**

Every build MUST:
1. **Check for console spam** in development tools
2. **Validate caching** is implemented for expensive functions
3. **Verify memoization** in components with expensive calculations
4. **Test session-based logging** works correctly
5. **Ensure no performance regressions** from new code
6. **Validate TypeScript types** for window properties
7. **Check memory usage** doesn't increase over time

## 📊 **Performance Metrics**

### **Key Performance Indicators:**
- ✅ **0 console spam** - No repeated debug messages
- ✅ **< 5ms** - Utility function execution time (cached)
- ✅ **< 100ms** - Component render time (memoized)
- ✅ **< 1MB** - Memory usage increase per session
- ✅ **100% cache hit rate** - For expensive utility functions

## 🚨 **Emergency Procedures**

### **If Performance Issues Arise:**
1. **Check console for spam** - Look for repeated messages
2. **Profile function calls** - Identify uncached expensive operations
3. **Review component renders** - Check for unnecessary re-renders
4. **Validate caching** - Ensure utility functions are cached
5. **Test session behavior** - Verify logging flags work correctly

### **If Console Spam Detected:**
1. **Identify source** - Find the function causing repeated logs
2. **Implement caching** - Add module-level cache variables
3. **Add session flags** - Implement one-time logging
4. **Test thoroughly** - Verify spam is eliminated
5. **Update documentation** - Add to this master rules file

## 📞 **Contact & Escalation**

### **Performance Issues:**
1. **Check this document** for optimization patterns
2. **Review recent changes** for performance regressions
3. **Profile the application** to identify bottlenecks
4. **Implement caching** for expensive operations
5. **Test on all environments** before deployment

### **For New Performance Requirements:**
1. **Review this master rules** document
2. **Implement caching patterns** from the start
3. **Add performance tests** to validation suite
4. **Document optimization decisions** for future reference
5. **Monitor performance metrics** after deployment

---

## 🎯 **Quick Reference**

| Issue | Solution | Pattern |
|-------|----------|---------|
| Console spam | Session-based logging flags | `if (!window.flagLogged)` |
| Repeated calculations | Module-level caching | `let cached = null` |
| Component re-renders | useMemo/useCallback | `useMemo(() => fn(), [])` |
| Expensive utilities | Function caching | `if (cached) return cached` |
| Debug logging | One-time flags | `hasLogged = true` |

---

**⚠️ CRITICAL: Performance issues degrade user experience and can cause console spam. All utility functions must be optimized with caching and controlled logging. These rules are NON-NEGOTIABLE.**
