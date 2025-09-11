#!/usr/bin/env tsx

/**
 * CTA Master Rules Validator
 * Ensures all CTA buttons follow the established patterns and never break
 * environment-specific pathing or CTA source tracking
 */

import fs from 'fs';
import path from 'path';

interface ValidationResult {
  passed: boolean;
  errors: string[];
  warnings: string[];
}

class CTARulesValidator {
  private errors: string[] = [];
  private warnings: string[] = [];
  private srcDir: string;

  constructor() {
    this.srcDir = path.join(process.cwd(), 'src');
  }

  /**
   * Main validation function
   */
  async validate(): Promise<ValidationResult> {
    console.log('🎯 Starting CTA Master Rules Validation...\n');

    // Run all validation checks
    await this.validateRequiredFiles();
    await this.validateCTAComponents();
    await this.validateRoutingUtils();
    await this.validateContactPage();
    await this.validateForbiddenPatterns();
    await this.validateEnvironmentPaths();

    const passed = this.errors.length === 0;

    if (passed) {
      console.log('✅ All CTA Master Rules validation checks PASSED!');
    } else {
      console.log('❌ CTA Master Rules validation FAILED!');
      console.log('\n🚨 ERRORS:');
      this.errors.forEach(error => console.log(`   - ${error}`));
    }

    if (this.warnings.length > 0) {
      console.log('\n⚠️  WARNINGS:');
      this.warnings.forEach(warning => console.log(`   - ${warning}`));
    }

    return {
      passed,
      errors: this.errors,
      warnings: this.warnings,
    };
  }

  /**
   * Validate required files exist
   */
  private async validateRequiredFiles(): Promise<void> {
    console.log('📁 Checking required files...');

    const requiredFiles = [
      'src/utils/ctaNavigation.ts',
      'src/utils/routingUtils.ts',
      'src/pages/Contact.tsx',
      'CTA_MASTER_RULES.md',
    ];

    for (const file of requiredFiles) {
      const filePath = path.join(process.cwd(), file);
      if (!fs.existsSync(filePath)) {
        this.errors.push(`Missing required file: ${file}`);
      }
    }
  }

  /**
   * Validate CTA components use correct navigation
   */
  private async validateCTAComponents(): Promise<void> {
    console.log('🔘 Validating CTA components...');

    const ctaComponents = [
      'src/components/Header.tsx',
      'src/components/CTASection.tsx',
      'src/components/HeroSection.tsx',
      'src/components/ValueProposition.tsx',
      'src/components/ServicesSection.tsx',
      'src/components/HowToGetServicesSection.tsx',
      'src/components/CaseStudySection.tsx',
      'src/components/AboutHeroSection.tsx',
      'src/components/AboutCTASection.tsx',
    ];

    for (const component of ctaComponents) {
      const filePath = path.join(process.cwd(), component);
      if (!fs.existsSync(filePath)) {
        this.errors.push(`Missing CTA component: ${component}`);
        continue;
      }

      const content = fs.readFileSync(filePath, 'utf-8');

      // Check for required imports
      if (!content.includes('navigateToContact')) {
        this.errors.push(`${component}: Missing navigateToContact import`);
      }

      if (!content.includes('useNavigate')) {
        this.errors.push(`${component}: Missing useNavigate import`);
      }

      // Check for forbidden patterns (allow in ctaNavigation.ts as fallback method)
      if (
        content.includes('window.location.href') &&
        !content.includes('window.location.reload()') &&
        !file.includes('ctaNavigation.ts')
      ) {
        this.errors.push(`${component}: Uses forbidden window.location.href pattern`);
      }

      // Check for CTA source tracking
      if (content.includes('handleCTAClick') && !content.includes('navigateToContact(navigate')) {
        this.errors.push(`${component}: handleCTAClick not using navigateToContact`);
      }
    }
  }

  /**
   * Validate routing utilities
   */
  private async validateRoutingUtils(): Promise<void> {
    console.log('🛣️  Validating routing utilities...');

    const routingUtilsPath = path.join(process.cwd(), 'src/utils/routingUtils.ts');
    if (!fs.existsSync(routingUtilsPath)) {
      this.errors.push('Missing routing utilities file');
      return;
    }

    const content = fs.readFileSync(routingUtilsPath, 'utf-8');

    // Check for required functions
    if (!content.includes('getBasePath')) {
      this.errors.push('routingUtils.ts: Missing getBasePath function');
    }

    if (!content.includes('hermes-security-production')) {
      this.errors.push('routingUtils.ts: Missing staging environment path');
    }

    // Check for environment detection
    if (!content.includes('gjdbradford.github.io')) {
      this.errors.push('routingUtils.ts: Missing GitHub Pages staging detection');
    }
  }

  /**
   * Validate contact page CTA source reading
   */
  private async validateContactPage(): Promise<void> {
    console.log('📞 Validating contact page...');

    const contactPagePath = path.join(process.cwd(), 'src/pages/Contact.tsx');
    if (!fs.existsSync(contactPagePath)) {
      this.errors.push('Missing Contact.tsx page');
      return;
    }

    const content = fs.readFileSync(contactPagePath, 'utf-8');

    // Check for CTA source reading
    if (!content.includes("sessionStorage.getItem('cta-source')")) {
      this.errors.push('Contact.tsx: Missing sessionStorage CTA source reading');
    }

    if (!content.includes("sessionStorage.removeItem('cta-source')")) {
      this.errors.push('Contact.tsx: Missing sessionStorage cleanup');
    }

    // Check for URL parameter fallback
    if (!content.includes('URLSearchParams')) {
      this.errors.push('Contact.tsx: Missing URL parameter fallback');
    }
  }

  /**
   * Validate no forbidden patterns are used
   */
  private async validateForbiddenPatterns(): Promise<void> {
    console.log('🚫 Checking for forbidden patterns...');

    const srcFiles = this.getAllSourceFiles();

    for (const file of srcFiles) {
      const content = fs.readFileSync(file, 'utf-8');

      // Check for forbidden window.location.href usage (allow in ctaNavigation.ts as fallback)
      const hrefMatches = content.match(/window\.location\.href\s*=/g);
      if (
        hrefMatches &&
        !content.includes('window.location.reload()') &&
        !file.includes('ctaNavigation.ts')
      ) {
        this.errors.push(`${file}: Uses forbidden window.location.href pattern`);
      }

      // Check for hardcoded paths
      if (content.includes('/contact') && !content.includes('getBasePath')) {
        this.warnings.push(`${file}: May have hardcoded contact path`);
      }
    }
  }

  /**
   * Validate environment-specific paths
   */
  private async validateEnvironmentPaths(): Promise<void> {
    console.log('🌍 Validating environment paths...');

    // Check vite.config.ts for base path configuration
    const viteConfigPath = path.join(process.cwd(), 'vite.config.ts');
    if (fs.existsSync(viteConfigPath)) {
      const content = fs.readFileSync(viteConfigPath, 'utf-8');

      if (!content.includes('hermes-security-production')) {
        this.errors.push('vite.config.ts: Missing staging environment base path');
      }

      if (!content.includes('VITE_DEPLOY_ENV')) {
        this.errors.push('vite.config.ts: Missing environment variable configuration');
      }
    }

    // Check package.json for build scripts
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const content = fs.readFileSync(packageJsonPath, 'utf-8');

      if (!content.includes('build:staging')) {
        this.errors.push('package.json: Missing staging build script');
      }

      if (!content.includes('VITE_DEPLOY_ENV=staging')) {
        this.errors.push('package.json: Missing staging environment variable');
      }
    }
  }

  /**
   * Get all source files recursively
   */
  private getAllSourceFiles(): string[] {
    const files: string[] = [];

    const walkDir = (dir: string): void => {
      const items = fs.readdirSync(dir);

      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
          walkDir(fullPath);
        } else if (stat.isFile() && (item.endsWith('.tsx') || item.endsWith('.ts'))) {
          files.push(fullPath);
        }
      }
    };

    walkDir(this.srcDir);
    return files;
  }
}

// Main execution
async function main() {
  const validator = new CTARulesValidator();
  const result = await validator.validate();

  if (!result.passed) {
    console.log('\n💥 CTA Master Rules validation failed!');
    console.log('Please fix the errors above before proceeding.');
    process.exit(1);
  }

  console.log('\n🎉 CTA Master Rules validation completed successfully!');
  process.exit(0);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('❌ Validation error:', error);
    process.exit(1);
  });
}

export { CTARulesValidator };
