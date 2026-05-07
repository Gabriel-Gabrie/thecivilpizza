# Hosting

## How deployment works (current)

```
push to main
   ↓
GitHub Actions runs (.github/workflows/deploy.yml)
   ↓
npm ci  →  next build  →  out/
   ↓
peaceiris/actions-gh-pages force-pushes out/* to the deploy branch
   ↓
Hostinger webhook clones deploy → demo.gabrielgabrie.com/thecivil/
```

`main` only contains source. `deploy` only contains the built static
site (HTML, JS, CSS, fonts, images, `.htaccess`). The two are kept in
sync by CI, never by hand.

### How this used to work

Earlier the demo deployed by having Hostinger watch `main` and serving
`/thecivil/` via a root `.htaccess` that rewrote every request to
`out/`. That meant the entire repo (source, plans, original photos,
node_modules references, etc.) lived at the served path even though
none of it was reachable via the rewrite. Cleaner now.

## What we've already done

- **Image compression**: every photo in `public/images/` is run through
  `node scripts/optimize-images.mjs` (or `npm run optimize-images`),
  which resizes to max 1600px wide and recompresses with mozjpeg / WebP.
  ~24% payload reduction across the gallery.
- **Static export**: `out/` is a self-contained, hostable folder. No
  server needed.
- **`.htaccess` caching**: 1-year `Cache-Control: immutable` on
  content-hashed `_next/static/` assets and `.jpg|.webp|.svg|.woff2`
  files, 5-minute cache on HTML.

## Better hosting — three options ranked

### 1. Cloudflare Pages (recommended)

- **Free**, no bandwidth limits.
- Builds on push (runs `npm run build`), serves `out/` from CF's global
  edge network.
- Connects to GitHub directly — same workflow as Hostinger's webhook.
- Custom domain support, free TLS.
- No server code is exposed; Pages only deploys the build artifact.
- **Setup**: dash.cloudflare.com → Workers & Pages → Create → connect
  GitHub repo. Build command: `npm run build`. Output dir: `out`.
  Environment vars: `NEXT_PUBLIC_BASE_PATH` (empty if root domain),
  `NEXT_PUBLIC_SITE_URL`.
- **DNS**: point `demo.gabrielgabrie.com/thecivil` (or whatever subdomain
  you choose) at the CF Pages project. Cloudflare gives you `<project>.pages.dev`
  and any custom domain you add.

### 2. Netlify

- **Free tier**: 100GB bandwidth/month (plenty for a demo).
- Same build-on-push model as Cloudflare Pages.
- Excellent UI for forms, redirects, edge functions if needed later.
- **Setup**: app.netlify.com → New site → connect GitHub. Build:
  `npm run build`. Publish: `out`.

### 3. Vercel

- Made by the Next.js team. **Free hobby tier**.
- Easiest fit because it understands Next.js natively — could re-enable
  the Next image optimizer (auto WebP/AVIF, srcset, lazy loading) if we
  switch from `output: 'export'` to standard SSR mode.
- Slight catch: hobby tier has stricter usage rules (commercial use
  technically needs a paid plan) — fine for a demo, talk to the owner
  before making this the production home.

## If we keep Hostinger but only deploy `out/`

Set up a GitHub Actions workflow that builds on push and force-pushes
just the `out/` contents to a `deploy` branch. Then point Hostinger's
webhook at `deploy` instead of `main`.

```yaml
# .github/workflows/deploy.yml
name: Deploy out/ to deploy branch
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run build
        env:
          NEXT_PUBLIC_BASE_PATH: /thecivil
          NEXT_PUBLIC_SITE_URL: https://demo.gabrielgabrie.com/thecivil
      - name: Push out/ to deploy branch
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./out
          publish_branch: deploy
          force_orphan: true
```

Pros: keep the Hostinger setup, only ship the static output.
Cons: still hosting on Hostinger's shared infrastructure, no edge CDN.

## What lives where

- **`main`**: source code, plans, content JSON, original photos, docs.
  Never served to anyone.
- **`deploy`**: only the contents of `out/` — `index.html`, per-route
  folders, `_next/static/*`, `images/*`, the Next.js icon files, plus
  `.htaccess` (sourced from `public/.htaccess` and copied during build)
  for caching headers. No source, no node_modules, no rewrite rules
  needed because everything lives at the served path already.
