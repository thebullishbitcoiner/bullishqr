# bullishQR

A simple Progressive Web App (PWA) for generating QR codes with a black theme and orange accents.

## Features

- 🎨 Black theme with #ff9900 orange accents
- ⚡ Instant QR code generation as you type
- 💾 Download QR codes as PNG images
- 📱 PWA support (manifest.json)
- 🔥 Hot Module Replacement (HMR) with Vite
- 🚀 GitHub Pages deployment ready

## Development

### Prerequisites

- Node.js 18+ and npm

### Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server with HMR:
```bash
npm run dev
```

The app will open at `http://localhost:3000` with hot module replacement enabled.

### Build

Build for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Deployment to GitHub Pages

The project deploys from the root of the main branch:

1. **Build and deploy**:
   ```bash
   npm run deploy
   ```

   This will:
   - Build the project to `dist/`
   - Copy built files to root (`index.html`, `manifest.json`, `assets/`)
   - Create `.nojekyll` file

2. **Commit and push the built files**:
   ```bash
   git add index.html manifest.json assets/ .nojekyll
   git commit -m "Deploy to GitHub Pages"
   git push
   ```

3. **Enable GitHub Pages** in your repository settings:
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: `main` / `root` folder

4. **Update the base path** (if needed):
   - If your repository name is different from `bullishqr`, update the `base` path in `vite.config.js`
   - Also update `start_url` in `manifest.json` to match

The app will be available at: `https://[your-username].github.io/bullishqr/`

## Configuration

### Changing the GitHub Pages base path

If your repository has a different name, update these files:

1. **vite.config.js** - Change the `base` variable
2. **manifest.json** - Update the `start_url` to match

## Project Structure

```
bullishqr/
├── index.html          # Main HTML file
├── script.js           # JavaScript logic
├── styles.css          # Styling
├── manifest.json       # PWA manifest
├── vite.config.js      # Vite configuration
├── package.json        # Dependencies and scripts
└── .github/
    └── workflows/
        └── deploy.yml  # GitHub Actions deployment
```

