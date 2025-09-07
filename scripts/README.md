# Testing Scripts

## Environment Testing

### `test-all-environments.ts`

Comprehensive testing script that validates all deployment environments:

- **Local Development** (`http://localhost:8081`)
- **GitHub Pages Staging** (`https://gjdbradford.github.io/hermes-security-production`)
- **Vercel Production** (`https://hermessecurity.io`)

#### Usage

```bash
# Run all environment tests
npm run test:all-envs

# Or run directly
npx tsx scripts/test-all-environments.ts
```

#### What it tests

1. **Connectivity**: Basic HTTP connectivity to each environment
2. **Page Loading**: All routes (`/`, `/about`, `/contact`, `/terms`, `/privacy`)
3. **Asset Loading**: JavaScript and CSS files load correctly
4. **CTA Functionality**: Contact page accessibility (indicates CTA buttons work)
5. **Error Detection**: MIME type errors, 404s, and other issues

#### Test Results

The script provides detailed results including:
- Pass/fail status for each test
- Response times
- Error details
- Overall pass rate per environment
- Summary of failed tests

#### Expected Results

- **Local**: 100% pass rate (9/9 tests)
- **Production**: 100% pass rate (9/9 tests) 
- **Staging**: Variable (depends on GitHub Pages deployment status)

#### Troubleshooting

If tests fail:

1. **Local**: Ensure dev server is running (`npm run dev`)
2. **Production**: Check Vercel deployment status
3. **Staging**: Check GitHub Actions deployment status

The script will automatically skip local tests if the dev server isn't running.
