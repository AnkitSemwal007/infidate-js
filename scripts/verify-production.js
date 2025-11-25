#!/usr/bin/env node

/**
 * Production Verification Script
 * Checks if the package is ready for production release
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying production readiness...\n');

let errors = 0;
let warnings = 0;

// Check required files exist
const requiredFiles = [
  'package.json',
  'README.md',
  'LICENSE',
  'dist/infidate.js',
  'dist/infidate.esm.js',
  'dist/infidate.css',
  'types/index.d.ts'
];

console.log('📁 Checking required files...');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`  ✓ ${file}`);
  } else {
    console.log(`  ✗ ${file} - MISSING`);
    errors++;
  }
});

// Check for console.log in dist files
console.log('\n🔍 Checking for debug statements in dist files...');
const distFiles = ['dist/infidate.js', 'dist/infidate.esm.js'];
distFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    const matches = content.match(/console\.log/g);
    if (matches) {
      console.log(`  ✗ ${file} contains ${matches.length} console.log statements`);
      errors++;
    } else {
      console.log(`  ✓ ${file} is clean`);
    }
  }
});

// Check package.json
console.log('\n📦 Checking package.json...');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

const pkgChecks = [
  { key: 'name', expected: 'infidate-js' },
  { key: 'version', required: true },
  { key: 'description', required: true },
  { key: 'main', expected: 'dist/infidate.js' },
  { key: 'module', expected: 'dist/infidate.esm.js' },
  { key: 'types', expected: 'types/index.d.ts' },
  { key: 'license', expected: 'MIT' },
  { key: 'repository', required: true },
  { key: 'author', required: true }
];

pkgChecks.forEach(check => {
  const value = pkg[check.key];
  if (check.expected) {
    if (value === check.expected) {
      console.log(`  ✓ ${check.key}: ${value}`);
    } else {
      console.log(`  ✗ ${check.key}: expected "${check.expected}", got "${value}"`);
      errors++;
    }
  } else if (check.required) {
    if (value) {
      console.log(`  ✓ ${check.key}: ${typeof value === 'object' ? JSON.stringify(value) : value}`);
    } else {
      console.log(`  ✗ ${check.key} is missing`);
      errors++;
    }
  }
});

// Check files array
if (pkg.files && Array.isArray(pkg.files)) {
  console.log(`  ✓ files array: ${pkg.files.join(', ')}`);
} else {
  console.log(`  ⚠ files array not defined - all files will be published`);
  warnings++;
}

// Check file sizes
console.log('\n📊 File sizes...');
const sizeChecks = [
  { file: 'dist/infidate.js', maxKB: 100 },
  { file: 'dist/infidate.esm.js', maxKB: 100 },
  { file: 'dist/infidate.css', maxKB: 50 }
];

sizeChecks.forEach(check => {
  if (fs.existsSync(check.file)) {
    const stats = fs.statSync(check.file);
    const sizeKB = (stats.size / 1024).toFixed(2);
    if (sizeKB <= check.maxKB) {
      console.log(`  ✓ ${check.file}: ${sizeKB} KB`);
    } else {
      console.log(`  ⚠ ${check.file}: ${sizeKB} KB (exceeds ${check.maxKB} KB)`);
      warnings++;
    }
  }
});

// Summary
console.log('\n' + '='.repeat(50));
if (errors === 0 && warnings === 0) {
  console.log('✅ All checks passed! Package is ready for production.');
  console.log('\n🚀 Next steps:');
  console.log('   1. npm login');
  console.log('   2. npm publish');
  process.exit(0);
} else {
  console.log(`❌ Found ${errors} error(s) and ${warnings} warning(s)`);
  console.log('\n⚠️  Please fix the issues before publishing.');
  process.exit(errors > 0 ? 1 : 0);
}

