# Joel Stålnacke - Interactive Portfolio

This is a Vite + React based single-page application tailored for deployment on GitHub Pages. It features a Lord of the Rings theme with GSAP animations, Tailwind v4 styling, and a graceful Three.js fallback for mobile devices.

## GitHub Pages Deployment Guide

This project is configured to be easily deployed to GitHub pages.

### 1. Base URL Configuration
By default, the `vite.config.js` is set to `base: '/'` which is correct if your repository is named `<username>.github.io`. 

**[IMPORTANT] Do I need to change anything?**
- If you deploy to `https://steelneckman.github.io/`, **NO CHANGE is needed**. The `base: '/'` is correct.
- If you instead deploy this to a sub-repository like `https://steelneckman.github.io/portfolio/`, you **MUST** change `vite.config.js` to `base: '/portfolio/'`.

### 2. How to Deploy
You can deploy directly from your local machine using the built-in scripts:

```bash
# First, install all dependencies if you haven't
npm install

# This will build the project and push the 'dist' folder to the 'gh-pages' branch
npm run deploy
```

Once pushed, go to your GitHub repository settings -> Pages, and ensure it is serving from the `gh-pages` branch.

### 3. Custom Domain
If you use a custom domain (e.g. `joelstalnacke.se`), you must:
1. Keep `base: '/'` in `vite.config.js`.
2. Add a `CNAME` file to the `public/` directory containing your custom domain name before running `npm run deploy`.

### 4. Routing
This is a Single Page Application (SPA). Because GitHub Pages doesn't support native path-based routing for SPAs out of the box, we use two strategies:
1. Everything is on one page, so no deep linking issues for core content.
2. A fallback `public/404.html` is included. If a user somehow hits a 404, it will gently redirect them back to the main page `index.html`.

## Development
To run the project locally:
```bash
npm run dev
```
