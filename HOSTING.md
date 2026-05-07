# Hosting

## Status quo: Hostinger + full-repo clone

Hostinger's webhook clones the entire repository into a directory under
`demo.gabrielgabrie.com/thecivil` on every push to `main`. The site is
served via the `.htaccess` at the repo root, which rewrites every request
under `/thecivil/` to `out/`. The rest of the repo (source, node_modules
references, plans, ASSETS.md, etc.) sits there unused.

This works, but:

- **The repo footprint is large** — the build ships everything: source,
  scripts, plans, original photo collections.
- **Cold loads are slow** — Hostinger's shared hosting isn't the fastest
  globally, and there's no CDN edge caching.
- **No image optimization** — static export skips the Next.js image
  optimizer, so mobile downloads full-resolution photos.

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

## My recommendation

**Move to Cloudflare Pages.** Free, fast everywhere in the world, hooks
into your existing GitHub repo, only ships `out/`. Hostinger continues
to host whatever else lives at `gabrielgabrie.com`; just point the
`/thecivil` subdomain (or use a fresh subdomain like `civil.gabrielgabrie.com`)
at the CF Pages project.

If you want, I can write the migration commit (config + DNS notes) and
hand you a one-pager.
