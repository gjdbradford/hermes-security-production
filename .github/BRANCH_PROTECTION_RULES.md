# Branch Protection Rules

This document outlines the required branch protection rules for the Hermes Security project to ensure safe deployments and code quality.

## Required GitHub Branch Protection Rules

### Main Branch Protection

To set up branch protection rules for the `main` branch:

1. Go to your GitHub repository
2. Navigate to **Settings** → **Branches**
3. Click **Add rule** or edit existing rule for `main`
4. Configure the following settings:

#### ✅ Required Settings

- **✅ Require a pull request before merging**
  - Required number of reviewers: `1`
  - Dismiss stale PR approvals when new commits are pushed: `✅`
  - Require review from code owners: `✅` (if you have a CODEOWNERS file)

- **✅ Require status checks to pass before merging**
  - Require branches to be up to date before merging: `✅`
  - Required status checks:
    - `🔍 Code Quality & Linting`
    - `🏗️ Build Validation`
    - `🧪 Testing & Validation`
    - `🛡️ Security & Secrets Check`
    - `⚡ Performance Check`

- **✅ Require conversation resolution before merging**
  - All conversations on code must be resolved before merging

- **✅ Require signed commits**
  - All commits must be signed (recommended for security)

- **✅ Require linear history**
  - Prevent merge commits (enforces rebase workflow)

- **✅ Include administrators**
  - Apply these rules to administrators as well

- **✅ Restrict pushes that create files**
  - Prevent direct pushes that create new files

#### 🚫 Blocking Settings

- **❌ Allow force pushes**: `DISABLED`
- **❌ Allow deletions**: `DISABLED`
- **❌ Allow bypassing the above settings**: `DISABLED`

### Develop Branch Protection (Optional)

If you use a `develop` branch for feature integration:

1. Create a similar rule for `develop` branch
2. Use the same quality gates but allow faster iteration
3. Consider requiring fewer reviewers (0-1) for develop branch

## Quality Gates Integration

The branch protection rules work in conjunction with the GitHub Actions workflows:

### Automatic Quality Gates
- **Code Quality & Linting**: ESLint, Prettier, TypeScript checks
- **Build Validation**: Production and staging builds
- **Testing & Validation**: Routing tests, environment tests, CDN tests
- **Security & Secrets Check**: Secret detection, dependency audit
- **Performance Check**: Bundle size analysis, performance budget

### Deployment Flow
1. **Push to main** → Quality gates run automatically
2. **All gates pass** → Staging deployment to GitHub Pages
3. **Any gate fails** → Deployment blocked, fix required locally
4. **Manual production** → Requires explicit confirmation + quality gates

## Enforcement

### What Happens When Rules Are Violated

- **Direct push to main**: Blocked by GitHub
- **PR without required checks**: Cannot be merged
- **Failed quality gates**: Deployment automatically cancelled
- **Force push attempt**: Blocked by GitHub

### Override Process

- **Emergency fixes**: Use the manual production deployment workflow
- **Administrator override**: Disabled by default for security
- **Bypass protection**: Not allowed for any user

## Benefits

1. **🛡️ Security**: Prevents accidental production deployments
2. **🔍 Quality**: Ensures all code meets quality standards
3. **🚀 Reliability**: Staging deployment only after all checks pass
4. **📋 Traceability**: All changes go through PR review process
5. **🔄 Consistency**: Enforced workflow across all contributors

## Setup Instructions

1. **Enable branch protection** using the settings above
2. **Test the workflow** by creating a test PR
3. **Verify quality gates** run and block bad code
4. **Confirm staging deployment** only happens after all gates pass
5. **Test manual production deployment** workflow

## Troubleshooting

### Common Issues

- **Status checks not appearing**: Ensure workflow files are in `.github/workflows/`
- **Checks failing**: Review the specific quality gate that's failing
- **Deployment blocked**: Fix the failing quality gate locally first
- **PR cannot be merged**: Ensure all required status checks are passing

### Getting Help

- Check the GitHub Actions logs for detailed error messages
- Review the quality gate configuration in the workflow files
- Ensure all required dependencies are properly configured

---

**⚠️ Important**: These branch protection rules are essential for maintaining code quality and preventing accidental production deployments. Do not disable them without careful consideration of the security implications.
