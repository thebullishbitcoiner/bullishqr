import { defineConfig } from 'vite';
import { readFileSync } from 'fs';

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
      writeBundle(options, bundle) {
        // Find the manifest file in bundle
        const manifestFile = Object.keys(bundle).find(file => 
          file.startsWith('assets/manifest-') && file.endsWith('.json')
        );
        
        if (manifestFile && bundle[manifestFile]) {
          const manifest = JSON.parse(bundle[manifestFile].source);
          // Fix icon paths - manifest is in assets/, logo is in root
          // So we need to go up one level: ../logo.png
          if (manifest.icons) {
            manifest.icons.forEach(icon => {
              // Change from ./logo.png to ../logo.png (from assets/ to root)
              icon.src = icon.src.replace('./logo.png', '../logo.png');
            });
            bundle[manifestFile].source = JSON.stringify(manifest, null, 2);
          }
        }
      }
    }
  ],
  server: {
    port: 3000,
    open: true,
  },
});

