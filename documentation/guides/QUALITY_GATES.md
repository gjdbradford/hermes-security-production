# 🛡️ Quality Gates & Deployment Rules

This document outlines the comprehensive quality gates and rules that all code must pass through before any push or deployment to the Hermes Security project.

## 📋 Overview

Our quality gates ensure that:
- ✅ Code meets high quality standards
- ✅ Security vulnerabilities are caught early
- ✅ Performance is maintained
- ✅ All environments work correctly
- ✅ Deployments are reliable and safe
- ✅ **8n8 webhook integration works correctly**
- ✅ **Static site deployment is optimized**

## 🔧 Quality Gate Components

### 1. **Pre-Commit Hooks** (Local Development)
- **ESLint**: Code quality and style enforcement
- **Prettier**: Code formatting consistency
- **TypeScript**: Type checking
- **Security**: Secret detection
- **Build Validation**: Ensures code compiles

### 2. **Pre-Push Hooks** (Before Remote Push)
- **Comprehensive Testing**: Routing and environment tests
- **Security Audit**: Dependency vulnerability scanning
- **Build Validation**: Both staging and production builds
- **Performance Checks**: Bundle size validation

### 3. **CI/CD Pipeline** (GitHub Actions)
- **Code Quality**: Linting, formatting, type checking
- **Build Validation**: Multi-environment builds
- **Testing**: Comprehensive test suite
- **Security**: Secrets detection and vulnerability scanning
- **Performance**: Bundle size and performance budgets
- **Deployment**: Automated staging and production deployment

## 🚀 Quality Gate Rules

### **Rule 1: Code Quality Standards**
```bash
# All code must pass these checks:
npm run lint          # ESLint validation
npm run type-check    # TypeScript type checking
npm run format:check  # Prettier formatting check
```

**Failure Criteria:**
- ❌ Any ESLint errors
- ❌ TypeScript compilation errors
- ❌ Code formatting inconsistencies

### **Rule 1.1: 8n8 Integration Standards**
```bash
# 8n8 webhook integration must pass these checks:
npm run test:8n8      # 8n8 integration tests
npm run test:e2e      # End-to-end form submission tests
```

**Failure Criteria:**
- ❌ Webhook URL detection fails
- ❌ Form data submission fails
- ❌ 8n8 webhook response handling fails
- ❌ Environment detection incorrect
- ❌ Unused variables or imports

### **Rule 2: Security Requirements**
```bash
# Security checks that must pass:
npm run security:audit    # Dependency vulnerability scan
npm run security:secrets  # Secret detection
```

**Failure Criteria:**
- ❌ High or critical security vulnerabilities
- ❌ Hardcoded secrets or API keys
- ❌ Unsafe code patterns (eval, innerHTML, etc.)

### **Rule 3: Build Validation**
```bash
# Both environments must build successfully:
npm run build:staging     # GitHub Pages build
npm run build:production  # Vercel production build
```

**Failure Criteria:**
- ❌ Build failures in either environment
- ❌ Missing critical assets
- ❌ Incorrect base path configuration
- ❌ Bundle size exceeding limits

### **Rule 4: Testing Requirements**
```bash
# All tests must pass:
npm run test:routing      # Routing functionality
npm run test:all-envs     # Environment validation
npm run test:cdn          # CDN integration
npm run test:captcha      # Security features
```

**Failure Criteria:**
- ❌ Any test failures
- ❌ Routing issues
- ❌ Environment configuration problems
- ❌ CDN or security feature failures

### **Rule 5: Performance Standards**
- **Bundle Size**: Main bundle must be under 512KB
- **Load Time**: Critical resources must load quickly
- **Asset Optimization**: Images and assets must be optimized

**Failure Criteria:**
- ❌ Bundle size exceeding 512KB
- ❌ Unoptimized assets
- ❌ Performance regressions

## 📝 Commit Message Standards

All commits must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### **Allowed Types:**
- `feat`: New feature
- `fix`: Bug fix
- `hotfix`: Critical hotfix
- `security`: Security fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Build system changes
- `ci`: CI/CD changes
- `chore`: Maintenance tasks
- `revert`: Reverting changes

### **Required Scopes:**
- `ui`: User interface components
- `api`: API related changes
- `config`: Configuration changes
- `deploy`: Deployment related
- `security`: Security related
- `performance`: Performance related
- `accessibility`: Accessibility improvements
- `seo`: SEO related
- `email`: Email functionality
- `routing`: Routing and navigation
- `assets`: Static assets
- `deps`: Dependencies
- `docs`: Documentation
- `tests`: Test related
- `ci`: CI/CD
- `hotfix`: Critical fixes

### **Examples:**
```bash
✅ feat(ui): add new contact form validation
✅ fix(security): resolve XSS vulnerability in contact form
✅ hotfix(deploy): fix staging deployment configuration
✅ perf(assets): optimize image loading performance
❌ fix: bug fix                    # Missing scope
❌ update stuff                    # Invalid type
❌ feat: add feature              # Too short description
```

## 🔄 Deployment Pipeline

### **Staging Deployment** (GitHub Pages)
1. **Trigger**: Push to `main` branch
2. **URL**: `https://gjdbradford.github.io/hermes-security-production/`
3. **Base Path**: `/hermes-security-production/`
4. **Quality Gates**: All 5 gates must pass
5. **Auto-deploy**: Yes, after all gates pass

### **Production Deployment** (Vercel)
1. **Trigger**: After successful staging deployment
2. **URL**: `https://hermes-security-production.vercel.app/`
3. **Base Path**: `/`
4. **Quality Gates**: All 5 gates must pass
5. **Auto-deploy**: Yes, after staging validation

## 🛠️ Local Development Setup

### **Install Quality Gate Tools:**
```bash
# Install dependencies
npm install

# Install pre-commit hooks
npx husky install
npx husky add .husky/pre-commit "npm run pre-commit"
npx husky add .husky/pre-push "npm run pre-push"
npx husky add .husky/commit-msg "npx commitlint --edit \$1"

# Install commitlint
npm install -g @commitlint/cli @commitlint/config-conventional
```

### **Available Commands:**
```bash
# Quality checks
npm run quality:check    # Run all quality checks
npm run quality:fix      # Fix quality issues automatically

# Pre-commit validation
npm run pre-commit       # Full pre-commit validation
npm run pre-push         # Full pre-push validation

# Security checks
npm run security:audit   # Dependency security audit
npm run security:secrets # Detect hardcoded secrets

# Build validation
npm run validate:build   # Validate both builds
npm run validate:all     # Complete validation suite
```

## 🚨 Bypassing Quality Gates

**⚠️ WARNING: Quality gates should only be bypassed in extreme emergencies!**

### **Emergency Bypass (Not Recommended):**
```bash
# Skip pre-commit hooks
git commit --no-verify -m "emergency: critical hotfix"

# Skip pre-push hooks
git push --no-verify
```

### **When Bypassing is Acceptable:**
- 🚨 Critical security vulnerability requiring immediate fix
- 🚨 Production system down requiring emergency patch
- 🚨 Data corruption or loss prevention

### **Post-Bypass Requirements:**
1. **Immediate**: Fix the issue that required bypassing
2. **Within 24 hours**: Run full quality gate suite
3. **Documentation**: Document why bypass was necessary
4. **Review**: Team review of the bypass decision

## 📊 Quality Gate Status

### **Current Status:**
- ✅ **Code Quality**: Enforced
- ✅ **Security**: Enforced
- ✅ **Build Validation**: Enforced
- ✅ **Testing**: Enforced
- ✅ **Performance**: Enforced

### **Monitoring:**
- **GitHub Actions**: All quality gates visible in CI/CD pipeline
- **Local Development**: Pre-commit and pre-push hooks active
- **Deployment**: Automatic deployment after gate validation

## 🔧 Troubleshooting

### **Common Issues:**

#### **ESLint Errors:**
```bash
# Fix automatically
npm run lint:fix

# Check specific file
npx eslint src/components/MyComponent.tsx
```

#### **TypeScript Errors:**
```bash
# Check types
npm run type-check

# Fix in IDE
# Use TypeScript language server for real-time feedback
```

#### **Build Failures:**
```bash
# Check staging build
npm run build:staging

# Check production build
npm run build:production

# Clean and rebuild
rm -rf dist/ node_modules/
npm install
npm run build:staging
```

#### **Test Failures:**
```bash
# Run specific test
npm run test:routing

# Debug routing issues
npm run test:all-envs
```

### **Getting Help:**
1. **Check GitHub Actions**: Review CI/CD pipeline logs
2. **Local Validation**: Run `npm run validate:all`
3. **Team Support**: Contact development team
4. **Documentation**: Review this guide and related docs

## 📈 Continuous Improvement

### **Regular Reviews:**
- **Weekly**: Quality gate effectiveness review
- **Monthly**: Performance metrics analysis
- **Quarterly**: Security standards update
- **Annually**: Complete quality gate overhaul

### **Feedback Loop:**
- **Developer Feedback**: Report quality gate issues
- **Performance Metrics**: Monitor build times and success rates
- **Security Updates**: Stay current with security best practices
- **Tool Updates**: Keep quality gate tools updated

---

**Remember**: Quality gates are designed to protect the project and ensure reliable deployments. They should be seen as helpful tools, not obstacles. When in doubt, ask the team for help rather than bypassing the gates.
