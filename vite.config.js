import { defineConfig } from 'vite';
import { readFileSync } from 'fs';

// Read version from package.json
const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));
const version = packageJson.version;

// GitHub Pages base path - update this to match your repository name
// If your repo is at https://username.github.io/bullishqr, use '/bullishqr/'
// If it's at https://username.github.io/, use '/'
const base = '/bullishqr/';

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

