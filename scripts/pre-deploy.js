import { existsSync, rmSync, readFileSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

console.log('🧹 Cleaning old deployment files before build...');

const rootDir = '.';

// Always restore source files from git first (if in git repo)
console.log('📥 Checking source files...');
try {
  // Check if we're in a git repo
  execSync('git rev-parse --git-dir', { stdio: 'pipe' });
  
  // Restore source files
  execSync('git checkout HEAD -- index.html manifest.json', { stdio: 'pipe' });
  console.log('✓ Restored source files from git');
} catch (error) {
  // Not in git repo or git command failed - that's OK, continue
  console.log('ℹ Not in git repo or git unavailable, checking files manually...');
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

