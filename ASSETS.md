# Assets — Photo Inventory & Rights Checklist

The site currently ships with **76 photographs** in [public/images/](public/images/). All of them were collected by us — none were taken by us. Before publishing the site to a new domain (or to thecivil.ca itself), the owner must confirm right-to-use on every image.

The authoritative list of which images are referenced where, with alt text and category, lives in [content/gallery.json](content/gallery.json). 56 of the 76 are referenced by the gallery; the rest are direct `<Image src=...>` references inside specific pages (hero backdrops, the cocktails feature, the visit page exterior shot, the home strip).

---

## Sourcing summary

| Source | What we got | How |
|---|---|---|
| **The Civil's GoDaddy CDN** (`img1.wsimg.com/isteam/ip/57a23fb7-f616-48e7-883c-940e535f97ba/`) | The original gallery photos already published on `thecivil.ca`. ~14 photos including the wide interior, the BAR sign, the dill-pickle pizza, and several flight/cocktail shots. | Direct CDN download by URL. |
| **The Civil's Wayback Machine snapshot** | A professional photoshoot whose filenames followed an `IMG_5XXX-Final.jpg` pattern — the pro shots: the negroni, the gin & tonic flight, the pineapple-rosemary cocktail. | URLs recovered from a Wayback snapshot, plus brute-forcing IDs 5500-5700 against the same CDN. |
| **The Civil's Instagram & Tripadvisor** | Additional pies, cocktails, and interiors. | Manual download. |
| **Google Maps screenshots provided by the owner** | ~30 photos of the room, the food, the exterior, and the block. | Owner forwarded these directly. |
| **Logo PNG (`logo-original.jpg`)** | The Civil's existing logo on the menu graphics. | Used as a reference for the SVG logomark in [components/ui/Seal.tsx](components/ui/Seal.tsx) and [components/ui/Wordmark.tsx](components/ui/Wordmark.tsx). |

The two GoDaddy menu graphics (`1000098597.png`, `1000109288.png`) were used to **transcribe** the cocktail / flight / lunch menu — text only. Not shipped as imagery.

Originals are in [public/images/source/](public/images/source/) (gitignored). The processed working copies in [public/images/](public/images/) are run through [scripts/optimize-images.mjs](scripts/optimize-images.mjs) — resized to max 1600px wide, recompressed with mozjpeg / WebP. Roughly 24% payload reduction.

---

## Naming convention

Filenames are descriptive, not provenance-based:

- `interior-*` — the room itself
- `exterior-*` — the storefront, the patio, the block
- `pie-*` — pizza shots (informal)
- `pro-*` — professional photoshoot pies (the high-quality batch)
- `pizza-*` — original-site gallery pizzas
- `cocktail-*` — drinks
- `flight-*` — cocktail/dessert flights

This makes scanning the directory and `content/gallery.json` much easier than an `IMG_5526-Final.jpg`-style scheme would.

---

## Brand marks (owned by us, in-repo)

| Path | Purpose |
|---|---|
| [components/ui/Seal.tsx](components/ui/Seal.tsx) | Inline SVG civic seal — used as logomark and footer stamp. Hand-traced from the logo PNG. |
| [components/ui/Wordmark.tsx](components/ui/Wordmark.tsx) | "The Civil" wordmark, set in Fraunces 900 italic via `next/font`. |
| [components/ui/Stamp.tsx](components/ui/Stamp.tsx) | Rotated typographic stamp template (REAL FIRE / NO TVs / DINE-IN ONLY etc). |
| [app/icon.svg](app/icon.svg), [app/apple-icon.svg](app/apple-icon.svg) | Favicons. |

These are all generated in this repo and have no third-party rights claims. The wordmark is intentionally close to the existing typographic identity but is **not** a copy of any registered mark — owner can request a custom commissioned wordmark before going to production at `thecivil.ca`.

---

## Rights-confirmation procedure

Before the site goes live on `thecivil.ca`:

1. **Owner confirms photographer credits.** The pro shots (e.g. `cocktail-negroni.jpg`, `cocktail-pineapple-rosemary.jpg`, `flight-gin-tonic.jpg`, the `pro-*` series) are clearly higher-quality than the rest. If a credit is required, add it to that image's `alt` field in [content/gallery.json](content/gallery.json) (or the figcaption on the page that uses it directly).
2. **Owner confirms right-to-use** on every image — most are already on the existing thecivil.ca, but a new domain is a new context.
3. **If a photo is rejected:**
   - Remove the file from `public/images/`.
   - Remove its entry from [content/gallery.json](content/gallery.json).
   - If it's referenced directly in a page, grep for `/images/<filename>` and either swap to a different photo or drop the slot. The PizzaTile component falls back to its SVG art automatically if a slug has no entry in `PIE_PHOTOS`.

The `/admin` Gallery tab also gives the owner a way to delete and replace photos themselves — they don't need to touch the repo.

---

## What changed since this doc was first written

The first version of this file listed 14 photos in a hand-maintained table. We dropped the table once the count went past 50 — a 76-row table goes stale every time anyone uploads a photo via `/admin`. The source of truth is now the directory listing plus `content/gallery.json`. If you need to know what a specific image is, open it; if you need to know where it's used, grep the repo.
