import { existsSync, rmSync, readFileSync } from 'fs';
import { join } from 'path';

console.log('🧹 Cleaning old deployment files before build...');

const rootDir = '.';

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
  if (content.includes('/bullishqr/assets/') || content.includes('assets/main-')) {
    rmSync(oldIndex, { force: true });
    console.log('✓ Removed old built index.html');
  } else {
    console.log('⚠ Keeping source index.html');
  }
}

const oldManifest = join(rootDir, 'manifest.json');
if (existsSync(oldManifest)) {
  // Check if it's a built manifest (has icons array as empty) or source
  const content = readFileSync(oldManifest, 'utf-8');
  if (content.includes('"icons": []')) {
    rmSync(oldManifest, { force: true });
    console.log('✓ Removed old built manifest.json');
  } else {
    console.log('⚠ Keeping source manifest.json');
  }
}

console.log('✅ Root cleaned, ready to build!');

