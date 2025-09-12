#!/usr/bin/env npx tsx

/**
 * Router Navigation Validation Script
 *
 * This script validates that all navigation links use React Router DOM
 * instead of hardcoded href attributes or window.location navigation.
 *
 * Rules:
 * - Internal routes MUST use React Router Link components
 * - Internal routes MUST NOT use href attributes
 * - Navigation MUST use navigate() function or Link components
 * - All navigation MUST respect staging environment paths
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

interface ValidationError {
  file: string;
  line: number;
  message: string;
  severity: 'error' | 'warning';
}

interface ValidationResult {
  errors: ValidationError[];
  warnings: ValidationError[];
  totalFiles: number;
  filesWithIssues: number;
}

class RouterNavigationValidator {
  private errors: ValidationError[] = [];
  private warnings: ValidationError[] = [];
  private totalFiles = 0;
  private filesWithIssues = 0;

  // Patterns to check for forbidden navigation
  private forbiddenPatterns = [
    {
      pattern: /<a\s+[^>]*href\s*=\s*["']\/[^"']*["'][^>]*>/g,
      message: 'Found <a href="/route"> - use <Link to="/route"> instead',
      severity: 'error' as const,
      exception: /href\s*=\s*["']#/, // Allow anchor links
    },
    {
      pattern: /window\.location\.href\s*=/g,
      message: 'Found window.location.href - use navigate() function instead',
      severity: 'error' as const,
      exception: /\/\/.*fallback|fallback.*method|backup.*method/i, // Allow documented fallbacks
    },
    {
      pattern: /location\.href\s*=/g,
      message: 'Found location.href - use navigate() function instead',
      severity: 'error' as const,
      exception: /\/\/.*fallback|fallback.*method|backup.*method/i, // Allow documented fallbacks
    },
    {
      pattern: /window\.location\.assign\s*\(/g,
      message: 'Found window.location.assign - use navigate() function instead',
      severity: 'error' as const,
    },
    {
      pattern: /window\.location\.replace\s*\(/g,
      message: 'Found window.location.replace - use navigate() function instead',
      severity: 'error' as const,
    },
  ];

  // Patterns to check for proper React Router usage
  private requiredPatterns = [
    {
      pattern: /import\s+.*\s+from\s+['"]react-router-dom['"]/,
      message: 'React Router DOM import required for navigation components',
      severity: 'warning' as const,
      context: 'navigation-components',
    },
  ];

  private isNavigationComponent(filePath: string): boolean {
    const navigationComponents = [
      'Header.tsx',
      'Footer.tsx',
      'Navigation.tsx',
      'Breadcrumb.tsx',
      'Sidebar.tsx',
      'MobileMenu.tsx',
    ];

    const fileName = filePath.split('/').pop() || '';
    return navigationComponents.some(comp => fileName.includes(comp));
  }

  private validateFile(filePath: string): void {
    try {
      const content = readFileSync(filePath, 'utf-8');
      this.totalFiles++;

      let hasIssues = false;
      const isNavComponent = this.isNavigationComponent(filePath);

      // Check for forbidden patterns
      for (const rule of this.forbiddenPatterns) {
        let match;
        while ((match = rule.pattern.exec(content)) !== null) {
          // Skip if it's an exception (like anchor links)
          if (rule.exception && rule.exception.test(match[0])) {
            continue;
          }

          // Check if this is a documented fallback by looking at surrounding context
          const matchIndex = match.index;
          const beforeContext = content.substring(Math.max(0, matchIndex - 200), matchIndex);
          const afterContext = content.substring(
            matchIndex,
            Math.min(content.length, matchIndex + 200)
          );
          const context = beforeContext + afterContext;

          // Skip if it's a documented fallback
          if (rule.exception && rule.exception.test(context)) {
            continue;
          }

          const lineNumber = content.substring(0, match.index).split('\n').length;
          const error: ValidationError = {
            file: filePath,
            line: lineNumber,
            message: rule.message,
            severity: rule.severity,
          };

          if (rule.severity === 'error') {
            this.errors.push(error);
          } else {
            this.warnings.push(error);
          }
          hasIssues = true;
        }
      }

      // Check for required patterns in navigation components
      if (isNavComponent) {
        for (const rule of this.requiredPatterns) {
          if (!rule.pattern.test(content)) {
            const error: ValidationError = {
              file: filePath,
              line: 1,
              message: rule.message,
              severity: rule.severity,
            };
            this.warnings.push(error);
            hasIssues = true;
          }
        }
      }

      if (hasIssues) {
        this.filesWithIssues++;
      }
    } catch (error) {
      console.error(`❌ Error reading file ${filePath}:`, error);
    }
  }

  private scanDirectory(dirPath: string): void {
    try {
      const items = readdirSync(dirPath);

      for (const item of items) {
        const fullPath = join(dirPath, item);
        const stat = statSync(fullPath);

        if (stat.isDirectory()) {
          // Skip node_modules and other non-source directories
          if (!['node_modules', '.git', 'dist', 'build', '.vite'].includes(item)) {
            this.scanDirectory(fullPath);
          }
        } else if (stat.isFile() && (extname(item) === '.tsx' || extname(item) === '.ts')) {
          this.validateFile(fullPath);
        }
      }
    } catch (error) {
      console.error(`❌ Error scanning directory ${dirPath}:`, error);
    }
  }

  public validate(): ValidationResult {
    console.log('🔍 Validating React Router navigation...\n');

    // Scan source directory
    const srcPath = join(process.cwd(), 'src');
    this.scanDirectory(srcPath);

    const result: ValidationResult = {
      errors: this.errors,
      warnings: this.warnings,
      totalFiles: this.totalFiles,
      filesWithIssues: this.filesWithIssues,
    };

    return result;
  }

  public printResults(result: ValidationResult): boolean {
    console.log('📊 Validation Results:');
    console.log(`   Total files scanned: ${result.totalFiles}`);
    console.log(`   Files with issues: ${result.filesWithIssues}`);
    console.log(`   Errors: ${result.errors.length}`);
    console.log(`   Warnings: ${result.warnings.length}\n`);

    // Print errors
    if (result.errors.length > 0) {
      console.log('❌ ERRORS (must be fixed):');
      result.errors.forEach(error => {
        console.log(`   ${error.file}:${error.line} - ${error.message}`);
      });
      console.log('');
    }

    // Print warnings
    if (result.warnings.length > 0) {
      console.log('⚠️  WARNINGS (should be addressed):');
      result.warnings.forEach(warning => {
        console.log(`   ${warning.file}:${warning.line} - ${warning.message}`);
      });
      console.log('');
    }

    // Success message
    if (result.errors.length === 0 && result.warnings.length === 0) {
      console.log('✅ All navigation links are using React Router DOM correctly!');
      return true;
    }

    if (result.errors.length === 0) {
      console.log('✅ No critical navigation errors found!');
      console.log('⚠️  Please address warnings for best practices.');
      return true;
    }

    console.log('❌ Navigation validation failed. Please fix the errors above.');
    return false;
  }
}

// Main execution
async function main() {
  const validator = new RouterNavigationValidator();
  const result = validator.validate();
  const success = validator.printResults(result);

  if (!success) {
    process.exit(1);
  }
}

// Run the validation
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('❌ Validation script failed:', error);
    process.exit(1);
  });
}

export { RouterNavigationValidator };
