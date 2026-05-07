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

## What's already in place on Hostinger (current setup)

We already do the "deploy `out/` to a `deploy` branch" pattern — that's
what the workflow at [.github/workflows/deploy.yml](.github/workflows/deploy.yml)
does. Hostinger's webhook watches `deploy` and pulls.

**One important detail:** the workflow does *not* use `force_orphan: true`
(the obvious choice for "always replace contents wholesale"). An earlier
version did, and Hostinger's auto-pull broke — every deploy was a
parentless commit, so the server's `git pull` had no fast-forward path
and the working tree got stuck on stale files until manually wiped.
With normal-history pushes (`force_orphan` omitted), `git pull`
fast-forwards cleanly. The full reasoning is in a comment at the top of
the workflow file.

Pros of the current setup: zero server-side config, owner already pays
for Hostinger, deploy-on-push is a single webhook.
Cons: still on Hostinger's shared infrastructure, no edge CDN. The
"better hosting" options above (Cloudflare Pages especially) are worth
revisiting when the demo moves to `thecivil.ca`.

## What lives where

- **`main`**: source code, plans, content JSON, original photos, docs.
  Never served to anyone.
- **`deploy`**: only the contents of `out/` — `index.html`, per-route
  folders, `_next/static/*`, `images/*`, the Next.js icon files, plus
  `.htaccess` (sourced from `public/.htaccess` and copied during build)
  for caching headers. No source, no node_modules, no rewrite rules
  needed because everything lives at the served path already.
