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
  server: {
    port: 3000,
    open: true,
  },
});

