#!/usr/bin/env node

/**
 * Hermes Security - Component Validation Script
 * 
 * This script validates the component structure and dependencies
 * to ensure the migration is successful.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Component validation configuration
const REQUIRED_COMPONENTS = [
  'Header.tsx',
  'HeroSection.tsx',
  'ValueProposition.tsx',
  'ServicesSection.tsx',
  'ComplianceSection.tsx',
  'CTASection.tsx',
  'Footer.tsx'
];

const REQUIRED_PAGES = [
  'Index.tsx',
  'NotFound.tsx'
];

const REQUIRED_CONFIG_FILES = [
  'package.json',
  'vite.config.ts',
  'tailwind.config.ts',
  'tsconfig.json',
  'index.html'
];

// Color codes for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFileExists(filePath, description) {
  try {
    if (fs.existsSync(filePath)) {
      log(`✅ ${description}`, 'green');
      return true;
    } else {
      log(`❌ ${description} - MISSING`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ ${description} - ERROR: ${error.message}`, 'red');
    return false;
  }
}

function validateComponentStructure() {
  log('\n🔍 VALIDATING COMPONENT STRUCTURE', 'bold');
  log('=====================================\n', 'blue');

  let allValid = true;

  // Check required config files
  log('📁 Configuration Files:', 'blue');
  REQUIRED_CONFIG_FILES.forEach(file => {
    if (!checkFileExists(file, file)) {
      allValid = false;
    }
  });

  // Check components directory
  log('\n🧩 Components:', 'blue');
  const componentsDir = path.join('src', 'components');
  if (!checkFileExists(componentsDir, 'src/components directory')) {
    allValid = false;
  } else {
    REQUIRED_COMPONENTS.forEach(component => {
      const componentPath = path.join(componentsDir, component);
      if (!checkFileExists(componentPath, component)) {
        allValid = false;
      }
    });
  }

  // Check pages directory
  log('\n📄 Pages:', 'blue');
  const pagesDir = path.join('src', 'pages');
  if (!checkFileExists(pagesDir, 'src/pages directory')) {
    allValid = false;
  } else {
    REQUIRED_PAGES.forEach(page => {
      const pagePath = path.join(pagesDir, page);
      if (!checkFileExists(pagePath, page)) {
        allValid = false;
      }
    });
  }

  // Check UI components directory
  log('\n🎨 UI Components:', 'blue');
  const uiDir = path.join(componentsDir, 'ui');
  if (!checkFileExists(uiDir, 'src/components/ui directory')) {
    allValid = false;
  }

  return allValid;
}

function validatePackageJson() {
  log('\n📦 PACKAGE.JSON VALIDATION', 'bold');
  log('============================\n', 'blue');

  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    // Check required dependencies
    const requiredDeps = [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'lucide-react',
      'tailwindcss'
    ];

    log('🔧 Required Dependencies:', 'blue');
    requiredDeps.forEach(dep => {
      if (packageJson.dependencies && packageJson.dependencies[dep]) {
        log(`✅ ${dep}@${packageJson.dependencies[dep]}`, 'green');
      } else if (packageJson.devDependencies && packageJson.devDependencies[dep]) {
        log(`✅ ${dep}@${packageJson.devDependencies[dep]} (dev)`, 'green');
      } else {
        log(`❌ ${dep} - MISSING`, 'red');
        return false;
      }
    });

    // Check scripts
    log('\n⚡ Scripts:', 'blue');
    const requiredScripts = ['dev', 'build', 'lint'];
    requiredScripts.forEach(script => {
      if (packageJson.scripts && packageJson.scripts[script]) {
        log(`✅ ${script}: ${packageJson.scripts[script]}`, 'green');
      } else {
        log(`❌ ${script} script - MISSING`, 'red');
        return false;
      }
    });

    return true;
  } catch (error) {
    log(`❌ Error reading package.json: ${error.message}`, 'red');
    return false;
  }
}

function generateTestReport() {
  log('\n📊 GENERATING TEST REPORT', 'bold');
  log('==========================\n', 'blue');

  const report = {
    timestamp: new Date().toISOString(),
    componentStructure: validateComponentStructure(),
    packageJson: validatePackageJson(),
    recommendations: []
  };

  if (!report.componentStructure) {
    report.recommendations.push('Fix missing components and configuration files');
  }

  if (!report.packageJson) {
    report.recommendations.push('Fix package.json dependencies and scripts');
  }

  // Save report
  const reportPath = 'migration-validation-report.json';
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  log(`📄 Test report saved to: ${reportPath}`, 'green');

  // Summary
  log('\n🎯 VALIDATION SUMMARY', 'bold');
  log('=====================\n', 'blue');
  
  if (report.componentStructure && report.packageJson) {
    log('✅ All validations passed! Project is ready for development.', 'green');
  } else {
    log('❌ Some validations failed. Please review the recommendations above.', 'red');
    log('\n📋 Recommendations:', 'yellow');
    report.recommendations.forEach((rec, index) => {
      log(`${index + 1}. ${rec}`, 'yellow');
    });
  }

  return report;
}

// Run validation
log('🚀 HERMES SECURITY - COMPONENT VALIDATION', 'bold');
log('==========================================\n', 'blue');

generateTestReport();

export {
  validateComponentStructure,
  validatePackageJson,
  generateTestReport
};
