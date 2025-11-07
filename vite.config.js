import { defineConfig } from 'vite';
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

// Read version from package.json
const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));
const version = packageJson.version;

// GitHub Pages base path - dynamically set based on environment
// For development (HMR), use '/' so everything works locally
// For production builds, use '/bullishqr/' for GitHub Pages
// You can override this by setting BASE_PATH environment variable
const base = process.env.BASE_PATH || (process.env.NODE_ENV === 'production' ? '/bullishqr/' : '/');

export default defineConfig({
  base,
  define: {
    __APP_VERSION__: JSON.stringify(version),
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: './index.html',
      },
    },
  },
  plugins: [
    {
      name: 'fix-manifest-icons',
      closeBundle() {
        // After build completes, find and fix the manifest file
        const assetsDir = join('dist', 'assets');
        try {
          const files = readdirSync(assetsDir);
          const manifestFile = files.find(file => file.startsWith('manifest-') && file.endsWith('.json'));
          
          if (manifestFile) {
            const manifestPath = join(assetsDir, manifestFile);
            const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
            
            // Fix icon paths - manifest is in assets/, logo is in root
            // So we need to go up one level: ../logo.png
            if (manifest.icons) {
              manifest.icons.forEach(icon => {
                icon.src = '../logo.png';
              });
              writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
            }
          }
        } catch (error) {
          console.warn('Could not fix manifest icons:', error);
        }
      }
    }
  ],
  server: {
    port: 3000,
    open: true,
  },
});

