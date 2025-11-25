#!/usr/bin/env node

/**
 * Build script for infidate-js
 * Copies source files to dist and optionally minifies them
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Parse command line arguments
const args = process.argv.slice(2);
const minify = args.includes('--minify');

// Directories
const srcDir = path.join(__dirname, '..', 'src');
const distDir = path.join(__dirname, '..', 'dist');

console.log('🚀 Building infidate-js...\n');

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  console.log('📁 Creating dist directory...');
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy main files from src to dist
console.log('📋 Copying source files to dist...');

try {
  // Copy JavaScript file
  const jsSource = path.join(srcDir, 'infidate.js');
  const jsDest = path.join(distDir, 'infidate.js');
  
  if (fs.existsSync(jsSource)) {
    fs.copyFileSync(jsSource, jsDest);
    console.log('  ✓ Copied infidate.js');
  } else {
    console.error('  ✗ Source file not found: infidate.js');
    process.exit(1);
  }

  // Copy CSS file
  const cssSource = path.join(srcDir, 'infidate.css');
  const cssDest = path.join(distDir, 'infidate.css');
  
  if (fs.existsSync(cssSource)) {
    fs.copyFileSync(cssSource, cssDest);
    console.log('  ✓ Copied infidate.css');
  } else {
    console.error('  ✗ Source file not found: infidate.css');
    process.exit(1);
  }

  // Create ESM module version
  console.log('\n📦 Creating ESM module...');
  const esmDest = path.join(distDir, 'infidate.esm.js');
  const jsContent = fs.readFileSync(jsSource, 'utf8');
  
  // Add ESM export at the end
  const esmContent = jsContent + '\n\nexport { InfiDate, InfiDatePicker, InfiDateUtils };\nexport default InfiDate;\n';
  fs.writeFileSync(esmDest, esmContent);
  console.log('  ✓ Created infidate.esm.js');

} catch (error) {
  console.error('❌ Error copying files:', error.message);
  process.exit(1);
}

// Minify if requested
if (minify) {
  console.log('\n🗜️  Minifying files...');
  
  try {
    // Check if terser is available
    try {
      execSync('npx terser --version', { stdio: 'ignore' });
    } catch {
      console.log('  ⚠️  Installing terser...');
      execSync('npm install --no-save terser', { stdio: 'inherit' });
    }

    // Minify JavaScript
    const jsInput = path.join(distDir, 'infidate.js');
    const jsOutput = path.join(distDir, 'infidate.min.js');
    execSync(`npx terser ${jsInput} -c -m -o ${jsOutput}`, { stdio: 'inherit' });
    console.log('  ✓ Minified infidate.min.js');

    // Check if clean-css-cli is available
    try {
      execSync('npx clean-css-cli --version', { stdio: 'ignore' });
    } catch {
      console.log('  ⚠️  Installing clean-css-cli...');
      execSync('npm install --no-save clean-css-cli', { stdio: 'inherit' });
    }

    // Minify CSS
    const cssInput = path.join(distDir, 'infidate.css');
    const cssOutput = path.join(distDir, 'infidate.min.css');
    execSync(`npx clean-css-cli -o ${cssOutput} ${cssInput}`, { stdio: 'inherit' });
    console.log('  ✓ Minified infidate.min.css');

  } catch (error) {
    console.warn('  ⚠️  Minification failed:', error.message);
    console.warn('  ⚠️  Continuing without minification...');
  }
}

// Display build summary
console.log('\n✅ Build completed successfully!\n');
console.log('📦 Generated files:');
console.log('  - dist/infidate.js');
console.log('  - dist/infidate.esm.js');
console.log('  - dist/infidate.css');

if (minify) {
  console.log('  - dist/infidate.min.js');
  console.log('  - dist/infidate.min.css');
}

console.log('\n🎉 Ready to publish!\n');

