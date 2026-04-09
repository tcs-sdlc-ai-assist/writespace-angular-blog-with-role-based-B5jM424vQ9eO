# Deployment Guide — WriteSpace on Vercel

## Overview

This document covers deploying the WriteSpace Angular application to Vercel, including configuration, build settings, SPA routing, environment setup, and troubleshooting.

---

## Prerequisites

- A [Vercel](https://vercel.com) account
- The Vercel CLI installed (`npm i -g vercel`) or access to the Vercel Dashboard
- The WriteSpace repository connected to Vercel (via GitHub, GitLab, or Bitbucket)

---

## vercel.json Configuration

Create a `vercel.json` file in the project root with the following contents:

```json
{
  "version": 2,
  "buildCommand": "ng build",
  "outputDirectory": "dist/writespace/browser",
  "framework": null,
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*).js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*).css",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### Key Configuration Details

| Field              | Value                        | Purpose                                              |
|--------------------|------------------------------|------------------------------------------------------|
| `buildCommand`     | `ng build`                   | Runs the Angular production build                    |
| `outputDirectory`  | `dist/writespace/browser`    | Points Vercel to the Angular build output directory   |
| `rewrites`         | `/(.*) → /index.html`       | Enables SPA client-side routing for all paths         |

---

## SPA Rewrite Rules

Angular uses client-side routing via the Angular Router. Without rewrite rules, navigating directly to a route like `/blog/my-post` would return a 404 from Vercel because no physical file exists at that path.

The rewrite rule in `vercel.json` ensures that **all requests** that do not match a static file are served `index.html`, allowing the Angular Router to handle the route on the client side.

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

> **Note:** Vercel automatically serves static files (JS, CSS, images) before applying rewrites, so your assets will load correctly.

---

## Build Command & Output Directory

### Build Command

The default build command is:

```bash
ng build
```

This runs the Angular CLI production build, which includes:

- Ahead-of-Time (AOT) compilation
- Tree shaking and dead code elimination
- Minification and bundling
- Hashing of output filenames for cache busting

To verify the build locally before deploying:

```bash
npm run build
```

### Output Directory

Angular 17+ outputs the production build to:

```
dist/writespace/browser
```

This path is derived from the project name configured in `angular.json`. If you rename the project, update the `outputDirectory` in `vercel.json` accordingly.

To verify the correct output path, check `angular.json`:

```json
{
  "projects": {
    "writespace": {
      "architect": {
        "build": {
          "options": {
            "outputPath": "dist/writespace"
          }
        }
      }
    }
  }
}
```

Angular 17+ uses an application builder that creates a `browser` subdirectory inside the output path, resulting in `dist/writespace/browser`.

---

## Environment Setup

### Vercel Dashboard Configuration

1. Navigate to your project in the [Vercel Dashboard](https://vercel.com/dashboard)
2. Go to **Settings** → **Environment Variables**
3. Add the required environment variables for each environment (Production, Preview, Development)

### Angular Environment Files

Angular uses environment files for build-time configuration. These are located at:

- `src/environments/environment.ts` — development defaults
- `src/environments/environment.prod.ts` — production values

Example `environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.writespace.example.com',
};
```

### Using Vercel Environment Variables at Build Time

To inject Vercel environment variables into the Angular build, create a custom build script that generates the environment file before building:

1. Add a `set-env.ts` or `set-env.js` script:

```javascript
const fs = require('fs');

const environment = `
export const environment = {
  production: true,
  apiUrl: '${process.env.API_URL || 'https://api.writespace.example.com'}',
};
`;

fs.writeFileSync('./src/environments/environment.prod.ts', environment);
```

2. Update the build command in `vercel.json`:

```json
{
  "buildCommand": "node set-env.js && ng build"
}
```

3. Add `API_URL` (and any other variables) in the Vercel Dashboard under Environment Variables.

---

## Node.js Version

Ensure the Node.js version on Vercel is compatible with Angular 17+. Angular 17 requires Node.js 18.13 or later.

Set the Node.js version in Vercel:

- **Option 1:** In the Vercel Dashboard under **Settings** → **General** → **Node.js Version**, select `18.x` or `20.x`
- **Option 2:** Add an `engines` field to `package.json`:

```json
{
  "engines": {
    "node": ">=18.13.0"
  }
}
```

---

## Deployment Steps

### Via Vercel Dashboard

1. Push your code to the connected Git repository
2. Vercel automatically detects the push and triggers a build
3. Monitor the build in the Vercel Dashboard under **Deployments**

### Via Vercel CLI

```bash
# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Manual Deployment

```bash
# Build locally
npm run build

# Deploy the output directory
vercel deploy dist/writespace/browser --prod
```

---

## Troubleshooting

### 404 Errors on Page Refresh

**Symptom:** Navigating directly to a route (e.g., `/blog/my-post`) or refreshing the page returns a 404.

**Cause:** The SPA rewrite rule is missing or misconfigured.

**Fix:** Ensure `vercel.json` contains the rewrite rule:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

### Build Fails with "Cannot find module @angular/cli"

**Symptom:** The build fails because Angular CLI is not found.

**Cause:** `@angular/cli` is listed in `devDependencies` and Vercel may skip dev dependencies.

**Fix:** Ensure the Vercel build installs all dependencies. Set the install command explicitly:

```json
{
  "installCommand": "npm install"
}
```

Or set the `VERCEL_FORCE_NO_BUILD_CACHE` environment variable to `1` to clear the cache and reinstall.

---

### Blank Page After Deployment

**Symptom:** The deployment succeeds but the page is blank with no visible errors.

**Cause:** The `outputDirectory` in `vercel.json` does not match the actual build output path.

**Fix:**

1. Run `ng build` locally and verify the output directory structure
2. Confirm the output is at `dist/writespace/browser`
3. Ensure `vercel.json` has `"outputDirectory": "dist/writespace/browser"`
4. Check the browser console for errors — a mismatched `<base href>` can also cause this

---

### Assets Not Loading (404 for JS/CSS Files)

**Symptom:** The HTML loads but JavaScript and CSS files return 404.

**Cause:** The `outputDirectory` is pointing to the wrong folder, or the `<base href>` in `index.html` is incorrect.

**Fix:**

1. Verify `index.html` contains `<base href="/">`
2. Confirm the `outputDirectory` includes the `browser` subdirectory: `dist/writespace/browser`
3. Check that the build output contains the expected JS and CSS files

---

### Environment Variables Not Available

**Symptom:** API calls fail because the API URL is `undefined` or uses the wrong value.

**Cause:** Angular environment files are compiled at build time. Vercel environment variables set in the dashboard are only available during the build process, not at runtime.

**Fix:**

1. Use a build script (see [Using Vercel Environment Variables at Build Time](#using-vercel-environment-variables-at-build-time)) to inject variables into the Angular environment file before the build runs
2. Verify the environment variables are set for the correct Vercel environment (Production, Preview, or Development)
3. Redeploy after adding or changing environment variables — existing deployments will not pick up changes

---

### Build Timeout

**Symptom:** The build exceeds the maximum allowed time and is cancelled.

**Cause:** Large projects or unoptimized builds can exceed Vercel's build time limits (45 minutes on free tier).

**Fix:**

1. Ensure `budgets` in `angular.json` are configured to catch bundle size regressions
2. Use lazy loading for feature modules/components to reduce the main bundle size
3. Check for circular dependencies that can slow down compilation
4. If using SSR, consider switching to client-side only rendering for Vercel static deployments

---

### Caching Issues After Redeployment

**Symptom:** Users see stale content or old JavaScript bundles after a new deployment.

**Cause:** Browser or CDN caching of old assets.

**Fix:**

1. Angular's production build includes content hashes in filenames by default — this should prevent stale JS/CSS
2. For `index.html`, Vercel serves it with appropriate cache headers by default
3. If issues persist, add explicit cache headers in `vercel.json` for `index.html`:

```json
{
  "headers": [
    {
      "source": "/index.html",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-cache, no-store, must-revalidate"
        }
      ]
    }
  ]
}
```

---

## Production Checklist

- [ ] `vercel.json` is present in the project root with correct `buildCommand`, `outputDirectory`, and `rewrites`
- [ ] Angular production environment file contains correct API URLs and configuration
- [ ] All required environment variables are set in the Vercel Dashboard
- [ ] Node.js version is set to 18.x or 20.x
- [ ] `ng build` completes successfully locally before pushing
- [ ] SPA rewrite rule is configured for client-side routing
- [ ] `<base href="/">` is set in `src/index.html`
- [ ] Lazy loading is configured for feature routes to optimize bundle size
- [ ] Cache headers are configured for static assets