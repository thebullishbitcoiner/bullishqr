import { existsSync, rmSync, readFileSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

console.log('🧹 Cleaning old deployment files before build...');

const rootDir = '.';

// Always restore source files from git first
console.log('📥 Restoring source files from git...');
try {
  execSync('git checkout HEAD -- index.html manifest.json', { stdio: 'inherit' });
  console.log('✓ Restored source files');
} catch (error) {
  console.warn('⚠ Could not restore from git (this is OK if not in a git repo)');
}

// Clean old deployment files
const oldAssets = join(rootDir, 'assets');
if (existsSync(oldAssets)) {
  rmSync(oldAssets, { recursive: true, force: true });
  console.log('✓ Removed old assets/');
}

const oldIndex = join(rootDir, 'index.html');
if (existsSync(oldIndex)) {
  // Check if it's a built file (has assets references) or source file
  const content = readFileSync(oldIndex, 'utf-8');
  if (content.includes('/bullishqr/assets/') || content.includes('assets/main-') || content.includes('crossorigin')) {
    // It's a built file, restore source
    try {
      execSync('git checkout HEAD -- index.html', { stdio: 'pipe' });
      console.log('✓ Restored source index.html');
    } catch (error) {
      console.error('❌ Could not restore source index.html');
      process.exit(1);
    }
  } else {
    console.log('✓ Source index.html is correct');
  }
}

const oldManifest = join(rootDir, 'manifest.json');
if (existsSync(oldManifest)) {
  // Check if it's a built manifest (has icons array as empty) or source
  const content = readFileSync(oldManifest, 'utf-8');
  if (content.includes('"icons": []')) {
    // It's a built manifest, restore source
    try {
      execSync('git checkout HEAD -- manifest.json', { stdio: 'pipe' });
      console.log('✓ Restored source manifest.json');
    } catch (error) {
      console.error('❌ Could not restore source manifest.json');
      process.exit(1);
    }
  } else {
    console.log('✓ Source manifest.json is correct');
  }
}

console.log('✅ Root cleaned, ready to build!');

