#!/bin/bash

# Local Quality Gates Testing Script
# Run this script locally to test quality gates before pushing to GitHub

set -e  # Exit on any error

echo "🧪 Testing Quality Gates Locally"
echo "================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    local status=$1
    local message=$2
    case $status in
        "success")
            echo -e "${GREEN}✅ $message${NC}"
            ;;
        "error")
            echo -e "${RED}❌ $message${NC}"
            ;;
        "warning")
            echo -e "${YELLOW}⚠️  $message${NC}"
            ;;
        "info")
            echo -e "${BLUE}ℹ️  $message${NC}"
            ;;
    esac
}

# Function to run a command and check result
run_check() {
    local name=$1
    local command=$2
    local continue_on_error=${3:-false}
    
    echo ""
    print_status "info" "Running: $name"
    echo "Command: $command"
    echo ""
    
    if eval "$command"; then
        print_status "success" "$name passed"
        return 0
    else
        if [ "$continue_on_error" = "true" ]; then
            print_status "warning" "$name failed (continuing...)"
            return 1
        else
            print_status "error" "$name failed"
            return 1
        fi
    fi
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_status "error" "package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    print_status "info" "Installing dependencies..."
    npm ci
fi

echo ""
print_status "info" "Starting Quality Gates Testing"
echo "=================================="

# Track overall success
overall_success=true

# 1. Code Quality & Linting
echo ""
echo "🔍 QUALITY GATE 1: Code Quality & Linting"
echo "=========================================="

run_check "ESLint Check" "npm run lint" true
lint_result=$?

run_check "Prettier Check" "npx prettier --check \"src/**/*.{ts,tsx,js,jsx,json,css,md}\"" true
prettier_result=$?

run_check "TypeScript Type Check" "npx tsc --noEmit"
typescript_result=$?

run_check "CTA Master Rules Validation" "npm run validate:cta"
cta_result=$?

run_check "Security Audit" "npm audit --audit-level=high" true
audit_result=$?

# 2. Build Validation
echo ""
echo "🏗️ QUALITY GATE 2: Build Validation"
echo "===================================="

run_check "Staging Build" "npm run build:staging"
staging_build_result=$?

run_check "Production Build" "npm run build:production"
production_build_result=$?

# Check critical files exist
echo ""
print_status "info" "Checking critical build files..."

if [ -f "dist/index.html" ]; then
    print_status "success" "index.html found"
else
    print_status "error" "index.html missing"
    overall_success=false
fi

if [ -f "dist/favicon.ico" ]; then
    print_status "success" "favicon.ico found"
else
    print_status "error" "favicon.ico missing"
    overall_success=false
fi

if [ -f "dist/robots.txt" ]; then
    print_status "success" "robots.txt found"
else
    print_status "error" "robots.txt missing"
    overall_success=false
fi

if [ -f "dist/sitemap.xml" ]; then
    print_status "success" "sitemap.xml found"
else
    print_status "error" "sitemap.xml missing"
    overall_success=false
fi

# 3. Testing & Validation
echo ""
echo "🧪 QUALITY GATE 3: Testing & Validation"
echo "======================================="

run_check "Routing Tests" "npm run test:routing"
routing_result=$?

run_check "Environment Tests" "npm run test:all-envs"
env_result=$?

run_check "CDN Integration Tests" "npm run test:cdn"
cdn_result=$?

run_check "Security Tests" "npm run test:captcha"
security_result=$?

# 4. Performance Check
echo ""
echo "⚡ QUALITY GATE 4: Performance Check"
echo "===================================="

# Check bundle size
if [ -d "dist/assets" ]; then
    echo ""
    print_status "info" "Analyzing bundle size..."
    
    # Find main bundle size
    MAIN_BUNDLE_SIZE=$(find dist/assets -name "index-*.js" -exec wc -c {} + | awk '{sum+=$1} END {print sum}')
    
    if [ "$MAIN_BUNDLE_SIZE" -gt 512000 ]; then
        print_status "error" "Main bundle too large: ${MAIN_BUNDLE_SIZE} bytes (max: 512KB)"
        overall_success=false
    else
        print_status "success" "Main bundle size OK: ${MAIN_BUNDLE_SIZE} bytes"
    fi
    
    echo ""
    print_status "info" "Largest files:"
    find dist/assets -name "*.js" -exec ls -lh {} + | sort -k5 -hr | head -5
else
    print_status "error" "Assets directory missing"
    overall_success=false
fi

# 5. Security Check
echo ""
echo "🛡️ QUALITY GATE 5: Security & Secrets Check"
echo "============================================"

print_status "info" "Checking for potential secrets in code..."

# Simple pattern matching for common secret patterns
if grep -r -E "(password|secret|key|token|api_key)" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" src/ | grep -v "//.*password" | grep -v "//.*secret" | grep -v "//.*key" > /dev/null 2>&1; then
    print_status "warning" "Potential secrets found in code (manual review required)"
else
    print_status "success" "No obvious secrets found in code"
fi

# Check for environment variables usage
echo ""
print_status "info" "Environment variables in use:"
grep -r "process.env" --include="*.ts" --include="*.tsx" src/ | head -5 || echo "No process.env usage found"

# Final Results
echo ""
echo "📊 QUALITY GATES SUMMARY"
echo "========================"

# Count results
total_checks=0
passed_checks=0

# Code Quality
if [ $lint_result -eq 0 ]; then ((passed_checks++)); fi; ((total_checks++))
if [ $prettier_result -eq 0 ]; then ((passed_checks++)); fi; ((total_checks++))
if [ $typescript_result -eq 0 ]; then ((passed_checks++)); fi; ((total_checks++))
if [ $cta_result -eq 0 ]; then ((passed_checks++)); fi; ((total_checks++))

# Build Validation
if [ $staging_build_result -eq 0 ]; then ((passed_checks++)); fi; ((total_checks++))
if [ $production_build_result -eq 0 ]; then ((passed_checks++)); fi; ((total_checks++))

# Testing
if [ $routing_result -eq 0 ]; then ((passed_checks++)); fi; ((total_checks++))
if [ $env_result -eq 0 ]; then ((passed_checks++)); fi; ((total_checks++))
if [ $cdn_result -eq 0 ]; then ((passed_checks++)); fi; ((total_checks++))
if [ $security_result -eq 0 ]; then ((passed_checks++)); fi; ((total_checks++))

echo ""
print_status "info" "Results: $passed_checks/$total_checks checks passed"

if [ "$overall_success" = true ]; then
    echo ""
    print_status "success" "🎉 ALL QUALITY GATES PASSED!"
    print_status "success" "✅ Ready to push to GitHub"
    print_status "info" "Your code will pass the GitHub Actions quality gates"
    exit 0
else
    echo ""
    print_status "error" "❌ QUALITY GATES FAILED"
    print_status "error" "🚫 Do not push to GitHub yet"
    print_status "info" "Fix the failing checks above before pushing"
    exit 1
fi
