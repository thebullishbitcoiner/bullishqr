import { defineConfig } from 'vite';

// GitHub Pages base path - update this to match your repository name
// If your repo is at https://username.github.io/bullishqr, use '/bullishqr/'
// If it's at https://username.github.io/, use '/'
const base = process.env.GITHUB_PAGES === 'true' ? '/bullishqr/' : '/';

export default defineConfig({
  base,
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  server: {
    port: 3000,
    open: true,
  },
});

