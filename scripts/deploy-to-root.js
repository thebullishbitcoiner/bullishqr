import { readdirSync, copyFileSync, mkdirSync, existsSync, statSync, writeFileSync, rmSync } from 'fs';
import { join } from 'path';

console.log('📦 Deploying built files to root...');

const distDir = 'dist';
const rootDir = '.';

if (!existsSync(distDir)) {
  console.error('❌ dist folder not found. Run "npm run build" first.');
  process.exit(1);
}


// Files to copy from dist to root
const filesToCopy = [
  'index.html',
  'manifest.json',
  '.nojekyll'
];

// Directories to copy
const dirsToCopy = ['assets'];

// Copy files
filesToCopy.forEach(file => {
  const src = join(distDir, file);
  const dest = join(rootDir, file);
  if (existsSync(src)) {
    copyFileSync(src, dest);
    console.log(`✓ Copied ${file}`);
  }
});

// Copy directories
dirsToCopy.forEach(dir => {
  const srcDir = join(distDir, dir);
  const destDir = join(rootDir, dir);
  
  if (existsSync(srcDir)) {
    if (!existsSync(destDir)) {
      mkdirSync(destDir, { recursive: true });
    }
    
    // Recursively copy directory contents
    function copyRecursive(src, dest) {
      const entries = readdirSync(src, { withFileTypes: true });
      for (const entry of entries) {
        const srcPath = join(src, entry.name);
        const destPath = join(dest, entry.name);
        
        if (entry.isDirectory()) {
          if (!existsSync(destPath)) {
            mkdirSync(destPath, { recursive: true });
          }
          copyRecursive(srcPath, destPath);
        } else {
          copyFileSync(srcPath, destPath);
        }
      }
    }
    
    copyRecursive(srcDir, destDir);
    console.log(`✓ Copied ${dir}/`);
  }
});

// Create .nojekyll if it doesn't exist
const nojekyll = join(rootDir, '.nojekyll');
if (!existsSync(nojekyll)) {
  writeFileSync(nojekyll, '');
  console.log('✓ Created .nojekyll');
}

console.log('');
console.log('✅ Files copied to root!');
console.log('Now commit and push:');
console.log('  git add index.html manifest.json assets/ .nojekyll');
console.log('  git commit -m "Deploy to GitHub Pages"');
console.log('  git push');

