# The Civil — Website Overhaul & Redesign Plan

> **⚠️ HISTORICAL — do not treat this as the current spec.**
> This is the original v0 plan. The implementation has diverged
> in several places. **For the current state of the site, read
> [README.md](../README.md), [ADMIN.md](../ADMIN.md), and
> [HOSTING.md](../HOSTING.md).** Notable drift:
> - `/manifesto` and `/press` were planned but never shipped (or were
>   removed). They do **not** exist as routes today.
> - `content/cause.json`, `content/manifesto.ts`, and `content/press.json`
>   referenced below do **not** exist. The Cause page is hardcoded.
> - The `/admin` editor (with encrypted-PAT auth and 4 tabs for
>   contact / hours / menu / gallery) was added after this plan was
>   written and is not described here.
> - The Tannery has been removed from all copy (the building reference
>   below is stale; the address is just "151 Charles St W, Kitchener").
> - Photo count has grown from ~14 to 76. See [ASSETS.md](../ASSETS.md).
> - Cocktail and flight prices were resolved: $12 cocktails, $14 flights.

**Status:** Draft v1.1 · Ready for implementation agent
**Target:** A demo-grade, mobile-first, design-led marketing site for The Civil (Kitchener pizzeria + craft cocktail bar)
**Live reference:** https://thecivil.ca · Instagram: @thecivilkitchener
**Demo URL:** https://demo.gabrielgabrie.com/thecivil (autodeploys on push to this repo)
**Public phone (tap-to-call):** +1 (519) 570-9992

---

## 0. TL;DR

The current site is a stock GoDaddy template that does The Civil dirty. The food is adventurous, the cocktails are theatrical, and the brand voice is genuinely funny ("Civil Disobedience", "Donair It In Public", "Dill Communication", "Panchetta Brie-Lieve It"). The site should be too.

We are going to **rebuild the marketing site from scratch as a Next.js 14 app** with a mobile-first design system that leans into the **"refined-but-rebellious"** identity baked into the brand name. Editorial newspaper meets dim cocktail bar. Cream paper, ink black, ember red, brass gold, with a vapour-bubble motif borrowed from their flagship cocktail. The result is a single, beautifully animated demo that reroutes users to their existing **Toast** reservation/ordering flows so business operations are 100% untouched.

**No backend changes. No POS changes. No menu changes. Just a website that finally matches the food.**

---

## 1. Discovery — what we know about The Civil

### 1.1 Business essentials (do NOT change these)
- **Name:** The Civil
- **Address:** 12-151 Charles St W, The Tannery, Kitchener, ON
- **Email:** thecivilkitchener@gmail.com
- **Phone:** +1 (519) 570-9992 (use `tel:+15195709992` for tap-to-call)
- **Instagram:** @thecivilkitchener
- **Hours:**
  - Mon–Tue: 5pm–10pm
  - Wed–Thu: 12pm–10pm
  - Fri–Sat: 12pm–11pm
  - Sun: closed
  - Lunch: Wed–Sat, 12pm–4pm
- **Reservations:** Toast Tables — `tables.toasttab.com` (existing link)
- **Takeout:** Toast online ordering — `order.toasttab.com` (existing link)
- **Private events:** up to 30 guests, daytime or evening
- **Tagline:** "Modern Cocktails. Adventurous Pies. Rotating Flights."

### 1.2 The menu (verbatim — use these names, they ARE the brand)

**Cocktail Flights** ($ TBC, three pours each, 2oz)
- Whiskey Sour Flight — classic, blueberry, watermelon, pineapple
- Gin & Tonic Flight — classic, blueberry, pineapple, strawberry
- Margarita Flight — classic, watermelon, grapefruit, strawberry

**Starters ($11)**
- Strawberry, Goat Cheese & Pecan Salad
- Caesar Salad (with prosciutto, baby spinach base)
- Insanity Loaf (roasted-garlic pull-apart bread)

**Pizzas — all $20**
- The Bouge (ricotta, prosciutto, pear, gorgonzola, pecans, honey, arugula)
- The Cause — rotating charity pie, dine-in only, $3/pie to local charity
- Caprese In Love
- Just All The Pepperoni
- Get Your Greens
- Civil Disobedience (ham, pineapple, jalapeños)
- But Like Actually A Good Veggie Pie
- Calabrese Cousin
- Panchetta Brie-Lieve It
- Pollo Pesto
- You Seem Like A Fungi
- Donair It In Public
- Full Denim Tuxedo
- Bee Spicy
- Dill Communication

**Cocktails — all $10.44**
- Elderflower Whiskey Sour
- Hibiscus High Tea
- Figgy Jam Sour
- Chocolate Pistachio
- Bourbon Hot Chocolate
- Candied Peach Brulee
- Pomegranate Negroni
- Rotating Bubble Infusion *(this is the showpiece — vapour-filled bubble on top)*
- Cherrywood Smoked Maple Old Fashioned
- The Earl's Private Jet

> The implementation agent should treat menu data as a single JSON source of truth in `content/menu.json` so swapping items is one PR, not a hunt-and-replace.

### 1.3 Brand voice (decoded)
- **Punny, irreverent, grown-up.** The pizza names are stand-up comedy. Lean in.
- **Civic / civil double meaning.** "Civil disobedience", "civic seal", "the manifesto", "the cause". This is a vein worth mining.
- **Theatrical without being precious.** Vapour bubbles. Cherrywood smoke. Brulee torches. The room itself has no TVs, no noise — the food and drink do the talking.
- **Local & charitable.** "The Cause" rotating charity pizza is a real differentiator that is invisible on the current site. Surface it.
- **From-scratch obsessive.** Doughs, syrups, infusions, sauces. Lead with this.

### 1.4 What's broken about thecivil.ca today
- GoDaddy template — generic layout, no personality.
- Menu is buried / not on the homepage.
- The hilarious pizza names are nowhere to be found.
- "The Cause" charity program is invisible.
- No live "open / closed" state. Users have to do hours-math.
- Mobile layout is functional but uninspired; no sticky CTAs.
- No optimized images, no SEO meta, no structured data → bad search presence.
- No real photography hierarchy — gallery is a wall of thumbnails.

---

## 2. Creative direction — "The Civil Times"

**Concept:** the website is The Civil's broadsheet — a nightly-printed newspaper from a slightly anarchic, very civil pizzeria. Editorial typography, masthead, datelines, bylines, pull quotes. But underneath, it's a dim bar lit by amber pendants and the blue glow of a torch. Fire, ink, vapour, brass.

### 2.1 Design pillars
1. **Editorial-first.** Big headlines. Hierarchy you could read across a room. Drop caps on long copy. Ruled separators.
2. **Dim & warm.** Default theme is dark, cream-on-ink. Light/"daytime" theme exists for lunch.
3. **Motion with restraint.** One showpiece (the vapour bubble). Everything else is small: marquees, scramble-text, gentle parallax. No full-screen hero videos that hurt mobile data plans.
4. **Mobile is the design, not a port.** Designed at 375px first, then scaled up. Bottom sticky action bar. Thumb-zone CTAs.
5. **Punchlines preserved.** Pizza names are headlines. Don't shrink them. Don't sanitize them.

### 2.2 Color tokens (Tailwind config)

```
--ink:        #0E0D0B   /* near-black, with warmth */
--paper:      #F2EBDC   /* cream / newsprint */
--paper-2:    #E8DFC8   /* aged paper */
--ember:      #C8331E   /* tomato/charity red — primary action */
--brass:      #C9A24A   /* cocktail amber, accents only */
--char:       #2A1F18   /* charred crust */
--vapour:     #B8D4D2   /* bubble teal, single-use */
--ok:         #5A7D3F   /* basil — used sparingly */
```

Dark theme defaults: `bg: ink`, `text: paper`, `accent: ember`, `secondary: brass`.
Light theme (lunch mode): `bg: paper`, `text: ink`, `accent: ember`, `secondary: char`.

### 2.3 Typography
- **Display / Masthead:** a high-contrast serif with newspaper bones. Recommended: **Editorial New** (paid) or free fallback **Fraunces** (variable, free, Google Fonts) with `opsz` set high for headlines.
- **Body:** **Söhne** (paid) or free fallback **Inter** / **Geist Sans**.
- **Monospace / dateline / pricing:** **JetBrains Mono** or **Geist Mono**.
- **Accent / wordmark:** the existing logotype if recoverable; otherwise commission a custom SVG wordmark using Fraunces 900 italic with a custom ligature on "Ci".

Use `next/font` with `display: 'swap'` and self-host. No FOUT.

### 2.4 Motifs (visual building blocks)
- **The Civic Seal** — a circular SVG mark combining a pizza slice, a cocktail glass, and a banner with "EST. KITCHENER · SINCE WE FELT LIKE IT". Use as favicon, footer stamp, and loading mark.
- **The Bubble** — a single animated SVG/CSS bubble that floats in the hero, tracks the cursor faintly, and pops if tapped, releasing a puff. Mobile: idle drift only, taps welcome.
- **The Rule** — heavy 1px ink rule used liberally between sections, à la a real newspaper.
- **The Stamp** — circular "ROTATING TONIGHT" / "DINE-IN ONLY" / "FROM SCRATCH" stamps applied to images at angles.
- **The Marquee** — slow horizontal scroll of pizza names like a stock ticker / printing-press feed across the top of the menu page.

---

## 3. Information architecture

Single Next.js app with these routes (each route has its own `page.tsx`; everything is statically generated):

```
/                        Landing — "tonight's edition"
/menu                    Full menu (pies + starters + cocktails + flights)
/menu/[slug]             Optional deep page per pizza (link from /menu)
/cocktails               Optional split view of cocktails + flights
/the-cause               Charity pizza spotlight (history + this month)
/visit                   Hours, address, parking, transit, gallery
/private-events          Up to-30 booking inquiry
/manifesto               Long-read about from-scratch ethos & no-TV policy
/press                   Pull quotes & reviews (Restaurant Guru, OpenTable, Yelp)
/legal/privacy           Stub
404                      Custom "Off-Menu" page with hidden pie reveal
```

External links (no rebuild needed — these MUST keep working):
- **Reserve** → existing Toast Tables URL
- **Order Pickup** → existing Toast online ordering URL
- **Instagram** → @thecivilkitchener
- **Email** → mailto link
- **Google Maps** → directions deep-link

**Sitemap & robots.txt** auto-generated by Next.js.

---

## 4. Page-by-page specification

### 4.1 `/` — Landing ("Tonight's Edition")

**Above the fold (mobile, 375×812 baseline):**
1. **Top strip (sticky):** masthead reading `THE CIVIL — Vol. 1 · No. {{day-of-year}} · KITCHENER` in monospace. Right side: live status pill — `OPEN · LAST PIE 9:45 PM` or `CLOSED · OPENS WED 12:00`.
2. **Hero headline:** giant editorial type — "Modern cocktails. **Adventurous pies.** Rotating flights." Pies italicized, ember-colored.
3. **The Bubble:** a single animated vapour bubble drifting behind the type. Pops on tap, reforms after 2s.
4. **Primary CTAs (thumb zone):** two buttons — `Reserve a table` (ember solid) and `Order pickup` (paper outline). Both deep-link to Toast. Tertiary text link: `Browse the menu →`.

**Below the fold:**
5. **"Tonight's flight" card** — features the `Rotating Bubble Infusion` cocktail with a short paragraph, a link to `/cocktails`, and a tiny vapour animation.
6. **"The Cause" strip** — full-bleed section in ember red with cream type: "$3 from every Cause pie this month goes to {{rotating}}. Dine-in only." CTA → `/the-cause`.
7. **Pies marquee** — horizontal infinite scroll of all 15 pizza names, each a link to `/menu#slug`.
8. **Three-up gallery** — interior, dough, cocktail pour. Each image has a tilted stamp ("FROM SCRATCH", "NO TVs", "REAL FIRE").
9. **Hours + map** — list of hours with TODAY highlighted, embedded static Google Map (no JS API; just an `<a>` to maps), address, "12 minutes from UW campus" line.
10. **Footer** — civic seal, IG link, email, copyright, "Built with disobedience."

**Sticky bottom action bar (mobile only):** three icons — `Reserve · Order · Call` — always visible. Hides on scroll-down, returns on scroll-up.

### 4.2 `/menu` — The full broadsheet menu

- Render as a true newspaper spread: two-column on desktop (`columns-2 gap-12`), single column on mobile.
- **Section heads** as classified-ad style: "PIES — ALL $20", "STARTERS", "COCKTAILS — $10.44 EACH", "FLIGHTS".
- Each pizza is a **headline + dek + ingredient list**, e.g.:
  > **Civil Disobedience**
  > *A felony of flavor, three counts on the indictment.*
  > Smoked ham · grilled pineapple · jalapeños · mozzarella · tomato.
- Add a small "DINE-IN ONLY" stamp on `The Cause`.
- Sticky filter chips at top of mobile view: `All · Veggie · Meaty · Spicy · Sweet`. Filter is client-side only. Tags live in `menu.json`.
- Top of page: a slow horizontal **pizza-name marquee** (ticker).
- Each pie row has a deep-link anchor (`#civil-disobedience`) so the marquee items work as nav.

### 4.3 `/the-cause`

- Editorial long-form about why a rotating charity pie exists.
- "This month's cause" hero card — name, photo, link to charity site (placeholder for now).
- Archive list of prior month causes (placeholder data: an array of 6 example months, with a TODO comment for the implementation agent to flag).
- CTA: `Reserve to support this month →`.

### 4.4 `/visit`

- Big address + hours (with today highlighted, live open/closed pill).
- "Getting here" — drive, walk, transit (GRT 7/8 routes near Tannery), bike (Iron Horse Trail proximity), and parking notes (Charles & Water lot).
- Photo gallery — masonry on desktop, single-column on mobile.
- Accessibility note: explicit blurb if known; otherwise a placeholder with a TODO for the owner to confirm.
- Private events teaser → `/private-events`.

### 4.5 `/private-events`

- Single hero photo of the room.
- Three "kits": **Daytime takeover** · **Evening buyout** · **Bar-only**.
- Inquiry button → `mailto:` with prefilled subject `Private event inquiry — [date]`.
- Capacity: "Up to 30 guests, all in." Min/max copy as placeholder.

### 4.6 `/manifesto`

- Long-form essay, 600–900 words, written in The Civil's voice. Topics: from-scratch dough, no TVs, real fire, Kitchener loyalty, "The Cause", flight culture.
- Drop caps. Pull quotes. Newspaper-style rules.
- This is the most "writer-y" page; the implementation agent should produce a strong first draft and flag for owner review.

### 4.7 `/press`

- Pull quotes from public reviews (Restaurant Guru 4.7, OpenTable, Yelp, Tripadvisor).
- Treat each as a Letter-to-the-Editor block with a byline.
- Verbatim quotes only; cite source under each.

### 4.8 `404`

- "This pie is off the menu."
- Easter egg: a hidden 16th pizza ("The Quiet Riot") rendered only here, with a "back to safety" CTA.

---

## 5. Mobile-first interaction details

These are not optional — most users are on phones.

- **Designed at 375px first.** No horizontal scroll anywhere. Min tap target 44×44 pt.
- **Sticky bottom action bar** with Reserve / Order / Call (ID: `bottom-bar`). Hides on scroll-down, shows on scroll-up. Use `IntersectionObserver` against a sentinel near the footer to retract it when the footer is in view.
- **Live open/closed pill** computed client-side from a small `hours.ts` helper using `Intl.DateTimeFormat` in `America/Toronto`. Renders SSR-stable initial state then refines on hydration.
- **Tap-to-call** on `+1 (519) 570-9992` via `tel:+15195709992` from the sticky bottom bar, the masthead-overflow menu, the footer, and `/visit`. On desktop, render the formatted number as plain text alongside the link so it's copyable.
- **Tap-to-directions** on address using `geo:` URI scheme on mobile and Google Maps fallback on desktop.
- **Reduced motion** respected (`prefers-reduced-motion: reduce`) — the bubble idles instead of popping; marquees pause.
- **Haptic-style affordances** — small scale-down on tap (`active:scale-[0.98]`), no heavy animations on press.
- **Add-to-home-screen ready** — manifest, maskable icons, theme-color meta.
- **Performance budget:** LCP < 2.0s on 4G, total JS < 150KB gzipped on the landing page. Use `next/image` for everything.

---

## 6. Tech stack & repo structure

### 6.1 Stack
- **Next.js 14+ (App Router)** with TypeScript.
- **Tailwind CSS** + a tiny custom plugin for the design tokens above.
- **Framer Motion** for entrance + scroll-triggered motion (kept lightweight).
- **Lenis** for smooth scroll on desktop only (disabled on mobile to preserve native scroll inertia).
- **`next/font`** for self-hosted fonts.
- **`next/image`** with `sharp` for AVIF/WebP.
- **MDX** for `/manifesto` and `/the-cause` long-form copy.
- **JSON content** for menu, hours, gallery, press quotes (in `/content`).
- No CMS for v1 — a single content edit is one PR. Add Sanity/Contentful later if the owner wants self-serve.
- **Hosting:** the existing autodeploy pipeline that publishes this repo to **`https://demo.gabrielgabrie.com/thecivil`** on every push to `main`. The site is served from a **subpath**, not the apex — this is non-negotiable and dictates several config choices below.

### 6.2 Repo structure
```
/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                  # /
│   ├── menu/page.tsx
│   ├── menu/[slug]/page.tsx
│   ├── cocktails/page.tsx
│   ├── the-cause/page.tsx
│   ├── visit/page.tsx
│   ├── private-events/page.tsx
│   ├── manifesto/page.tsx
│   ├── press/page.tsx
│   ├── not-found.tsx
│   ├── sitemap.ts
│   ├── robots.ts
│   └── opengraph-image.tsx       # dynamic OG card per route
├── components/
│   ├── ui/                       # Button, Pill, Stamp, Rule, DropCap…
│   ├── layout/Masthead.tsx
│   ├── layout/StickyActionBar.tsx
│   ├── layout/Footer.tsx
│   ├── motion/Bubble.tsx         # the showpiece
│   ├── motion/Marquee.tsx
│   ├── motion/Scramble.tsx
│   ├── menu/PizzaCard.tsx
│   ├── menu/CocktailCard.tsx
│   ├── menu/MenuFilters.tsx
│   └── status/OpenClosedPill.tsx
├── content/
│   ├── menu.json
│   ├── hours.json
│   ├── gallery.json
│   ├── press.json
│   ├── cause.json
│   ├── manifesto.mdx
│   └── seo.json
├── lib/
│   ├── hours.ts                  # open/closed logic, TZ-aware
│   ├── seo.ts                    # metadata builder
│   └── analytics.ts              # noop placeholder
├── public/
│   ├── images/                   # downloaded + generated assets
│   ├── icons/                    # civic seal, favicons
│   ├── stamps/                   # SVG stamps
│   └── fonts/                    # self-hosted woff2
├── styles/globals.css
├── tailwind.config.ts
├── next.config.mjs
├── package.json
├── README.md
└── plans/                        # this document lives here
```

### 6.3 Subpath deployment — read this twice

The demo is served from `https://demo.gabrielgabrie.com/thecivil`, not from a domain root. Every asset URL, internal link, and route must respect this prefix or the deployed build will 404 in subtle ways that pass local-dev testing.

Required configuration in `next.config.mjs`:

```js
const isProd = process.env.NODE_ENV === 'production';
const basePath = isProd ? '/thecivil' : '';

export default {
  basePath,
  assetPrefix: basePath,
  trailingSlash: false,
  images: {
    // unoptimized: true ONLY if the host can't run the Next image optimizer.
    // Confirm with the host before flipping; default to optimizer ON.
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_SITE_URL: isProd
      ? 'https://demo.gabrielgabrie.com/thecivil'
      : 'http://localhost:3000',
  },
};
```

Rules the implementation agent MUST follow:

- **Internal navigation:** always `<Link href="/menu">` — Next.js prepends `basePath` automatically. Never hardcode `/thecivil/menu`.
- **Static assets in `<img>`, `<link>`, inline CSS, OG images, and JSON-LD:** prefix with `process.env.NEXT_PUBLIC_BASE_PATH`. A small helper `lib/url.ts` exposing `withBase(path: string)` should wrap every such use. Do not interpolate by hand at the call site.
- **`next/image` and `next/font`:** the optimizer respects `assetPrefix` automatically — leave URLs as `/images/foo.jpg`, do **not** add `/thecivil/` yourself.
- **`sitemap.ts`, `robots.ts`, JSON-LD, OG metadata:** build absolute URLs from `NEXT_PUBLIC_SITE_URL`. Do **not** use `headers()` to derive the host — this breaks SSG.
- **Canonical URLs and OG `url` fields:** include `/thecivil` in the absolute URL (e.g. `https://demo.gabrielgabrie.com/thecivil/menu`).
- **Service worker / manifest:** `start_url` and `scope` must be `/thecivil/`.
- **Sticky/anchor links:** `href="#hours"` is fine — fragments aren't affected by basePath.
- **External links to Toast / IG / mailto / tel:** unchanged. They are absolute URLs.
- **Sanity check before merging any feature:** run `next build && next start` locally with `NODE_ENV=production`, then `curl -I http://localhost:3000/thecivil/` (or whatever the host expects) to confirm 200s on `/thecivil/_next/static/...` and `/thecivil/images/...`. A subpath bug that only shows on the live host is the most expensive class of regression on this project.

If the host serves the subpath via a reverse-proxy strip (i.e. requests reach the Next.js process at `/`, not `/thecivil/`), instead of `basePath` set `assetPrefix: 'https://demo.gabrielgabrie.com/thecivil'` and configure the proxy to forward `X-Forwarded-Prefix`. **Confirm with the owner which mode the autodeploy uses before writing the config.**

### 6.4 Conventions
- **No client components unless needed.** Default to server components; mark interactivity with `"use client"` at the smallest possible boundary (`Bubble`, `MenuFilters`, `OpenClosedPill`, `StickyActionBar`).
- **Strict TS.** `"strict": true`, `noUncheckedIndexedAccess: true`.
- **Lint/format:** ESLint + Prettier with Tailwind plugin; commit a `.editorconfig`.
- **Images:** all assets go in `public/images/` with kebab-case names. Every `next/image` use must include `alt`, `width`, `height`, and `sizes`.

---

## 7. Asset acquisition (the hard part)

The owner cannot access their assets, and `WebFetch` against `thecivil.ca` returns data-URI placeholders because GoDaddy lazy-loads. Instagram is gated. Plan:

1. **Run a real scrape** with PowerShell against `thecivil.ca`:
   ```powershell
   Invoke-WebRequest https://thecivil.ca -OutFile site.html
   ```
   Then parse for `srcset`, `data-src`, `data-srcset`, GoDaddy CDN domains (`img1.wsimg.com`), and any JSON blob in `<script>` tags. Download each asset to `public/images/source/`.
2. **Wayback Machine.** Pull 2–3 historical snapshots from `web.archive.org/web/*/thecivil.ca` — the lazy-load placeholders are usually expanded in archived versions.
3. **Instagram.** Use `https://www.instagram.com/thecivilkitchener/?__a=1` (often blocked) or fall back to the public oEmbed endpoint per-post for posts the owner identifies. If blocked entirely, request the owner share 6–10 specific post URLs and pull each via embed.
4. **Google Business Profile.** Their Google listing exposes 20+ user/owner photos at `https://www.google.com/maps/place/...` — usable as fallback hero/gallery imagery (verify rights / prefer owner-uploaded).
5. **Generate what's missing.** Civic seal, stamps, wordmark — produce as SVG in-repo. The implementation agent owns these.
6. **Fallback policy.** Any photo we cannot source goes into `public/images/_placeholders/` with a `TODO: replace` comment in the JSX. Do **not** ship Unsplash stock without flagging it loudly in the README's "Assets to replace" section.

> The implementation agent **must** produce an `ASSETS.md` that lists every image used, where it came from, and whether it's verified for use. This is the owner's checklist for go-live.

---

## 8. SEO, metadata, and structured data

- **`<title>` per route** built via `lib/seo.ts`.
- **Open Graph** + Twitter Card for every route. Use `app/opengraph-image.tsx` to render dynamic OG cards (newspaper-masthead style with the page's headline) at build time.
- **JSON-LD** on `/`:
  - `Restaurant` schema with name, address, geo, openingHoursSpecification, servesCuisine, priceRange `$$`, telephone (placeholder), menu URL.
  - `LocalBusiness` and `Place` overlap intentionally.
- **`menu` schema** on `/menu` (`MenuItem` × each pizza/cocktail).
- **Robots:** allow all; sitemap referenced.
- **Canonical URLs.**
- **`hreflang`:** en-CA only for v1.

---

## 9. Accessibility

- **WCAG 2.2 AA** target. AAA where cheap.
- All color tokens above tested for contrast on both themes (the cream-on-ink combo passes AAA at 16px).
- **Keyboard nav:** every interactive element reachable. Visible focus rings using `outline: 2px solid var(--ember)`.
- **Skip link** to main content.
- **Screen reader labels** on icon-only buttons (the bottom action bar especially).
- **Reduced motion** respected globally.
- **Form labels** even on the mailto-only event inquiry button (label as button, not input).
- **Live status pill** uses `aria-live="polite"`.

---

## 10. Analytics & integrations

- **Plausible** or **Vercel Web Analytics** (cookieless). No GA4 — keeps the cookie banner off, which improves UX and fits the "civil" vibe.
- **Outbound link tracking** on Reserve / Order / IG / Maps (single event each).
- **Toast** integration is **link-out only** for v1. No iframe embed (their iframe is sluggish and breaks the design system).
- **No newsletter** unless the owner asks. If they do, plug in Buttondown or ConvertKit later.

---

## 11. Step-by-step implementation plan

The implementation agent should execute these in order. Each step ends with a working, deployable state.

### Step 1 — Bootstrap
1. Initialize Next.js 14 TypeScript app at the repo root: `npx create-next-app@latest . --ts --tailwind --eslint --app --src-dir=false --import-alias "@/*"`.
2. Install deps: `framer-motion`, `lenis`, `clsx`, `class-variance-authority`, `@vercel/og`, `sharp`.
3. Add Prettier + Tailwind plugin; add `.editorconfig`.
4. Configure `tailwind.config.ts` with the color tokens + font families from §2.2 / §2.3.
5. Add `next/font` self-hosted Fraunces + Inter + JetBrains Mono.
6. Commit: `chore: bootstrap next 14 with tailwind + design tokens`.

### Step 2 — Asset acquisition
1. Run the scrape pass per §7. Save raw assets to `public/images/source/`.
2. Hand-pick the 12–20 best images. Crop/optimize. Save final assets to `public/images/` with descriptive names: `interior-bar-amber.jpg`, `pie-civil-disobedience.jpg`, `cocktail-bubble-infusion.jpg`, etc.
3. Author the civic seal SVG in `public/icons/seal.svg`. Author 4–6 stamp SVGs in `public/stamps/`.
4. Author the wordmark SVG in `public/icons/wordmark.svg` (Fraunces 900 italic outlined; or commission later).
5. Generate favicons + PWA icons via Real Favicon Generator output, commit to `app/`.
6. Write `ASSETS.md` listing every image, source, and verification status.
7. Commit: `feat(assets): add brand marks, stamps, and curated photography`.

### Step 3 — Content layer
1. Author `content/menu.json` with every menu item from §1.2 — name, slug, dek (one-liner punchline), ingredients[], price, tags[] (`veggie`, `meaty`, `spicy`, `sweet`, `dine-in-only`).
2. Author `content/hours.json` with the schedule from §1.1, plus an `exceptions` array (closures, holidays).
3. Author `content/cause.json` — placeholder month + 6 prior-month entries with a `// TODO: confirm with owner` comment.
4. Author `content/press.json` — 6 verbatim pull quotes with sources from Restaurant Guru, OpenTable, Yelp, Tripadvisor.
5. Author `content/manifesto.mdx` — 600–900 words in The Civil's voice (see §11.x for outline).
6. Author `content/seo.json` — per-route titles, descriptions, OG copy.
7. Commit: `feat(content): seed menu, hours, press, and manifesto content`.

### Step 4 — Layout shell
1. Build `app/layout.tsx` with `<Masthead />`, `<main>`, `<Footer />`, and `<StickyActionBar />` (mobile only).
2. Build `components/layout/Masthead.tsx` — sticky top strip with newspaper-style volume/issue numbers and live status pill on the right.
3. Build `components/status/OpenClosedPill.tsx` — server-renders a stable initial state, hydrates with `Intl.DateTimeFormat` in `America/Toronto`, polls every 60s.
4. Build `components/layout/Footer.tsx` — civic seal, IG/email/maps links, copyright, "Built with disobedience.".
5. Build `components/layout/StickyActionBar.tsx` — three icon buttons (Reserve / Order / Call). Hides on scroll-down via `IntersectionObserver` and a footer sentinel.
6. Wire global styles, fonts, and theme switcher (default dark; toggle in footer).
7. Commit: `feat(layout): app shell with masthead, footer, sticky actions`.

### Step 5 — Landing page (`/`)
1. Build hero with the editorial headline + `<Bubble />` showpiece.
2. Build `<Bubble />` — SVG circle with a teal radial gradient, idle drift via Framer Motion's `useAnimationFrame`, pop-on-tap that emits 3–5 small `motion.span` puff dots, then reform after 2s. Disable pop in `prefers-reduced-motion`.
3. Build "Tonight's flight" card with link to `/cocktails`.
4. Build "The Cause" full-bleed strip in ember red.
5. Build `<Marquee />` of all pizza names — pure CSS keyframe `translateX` over a duplicated child for seamless loop.
6. Build three-up gallery with rotated SVG stamps positioned absolute over each image.
7. Build hours block with today highlighted (driven by `hours.json` + `lib/hours.ts`).
8. Wire all CTAs to Toast URLs from `content/seo.json` (single source).
9. Lighthouse pass: target 95+ all categories on mobile.
10. Commit: `feat(home): tonights edition landing with bubble showpiece`.

### Step 6 — Menu page (`/menu`)
1. Render menu sections as `<section>` blocks with classified-ad heads.
2. Build `<PizzaCard />` — headline + italic dek + bullet-separated ingredients on one line; second line: price + tag pills.
3. Build `<CocktailCard />` — same anatomy, with vapour-bubble icon next to `Rotating Bubble Infusion`.
4. Build `<MenuFilters />` — client-side chip filter (`All / Veggie / Meaty / Spicy / Sweet`), persists in `?filter=` query param.
5. Add the slow horizontal pizza-name marquee at the top.
6. Add `JSON-LD` `Menu` schema generated from `menu.json`.
7. Optional: pre-render `/menu/[slug]` deep pages with one bigger image + the dek; use `generateStaticParams`.
8. Commit: `feat(menu): full broadsheet menu with filters and schema`.

### Step 7 — Supporting pages
1. `/the-cause` — long-form + this-month card + archive list.
2. `/visit` — hours, address, getting-here, gallery, accessibility note.
3. `/private-events` — three kit cards + mailto inquiry button.
4. `/manifesto` — render `manifesto.mdx` with drop cap and pull-quote MDX components.
5. `/press` — render `press.json` as letters-to-editor.
6. `/cocktails` — split view of cocktails + flights for users who came for the drinks.
7. `not-found.tsx` — off-menu page with hidden 16th pizza Easter egg.
8. Commit per page: `feat({page}): {short description}`.

### Step 8 — SEO, sitemap, OG
1. Implement `lib/seo.ts` — `buildMetadata({ title, description, path })` returning a `Metadata` object.
2. Implement `app/sitemap.ts` and `app/robots.ts`.
3. Implement `app/opengraph-image.tsx` per route (or a shared one with title param) using `@vercel/og` to render newspaper-masthead OG cards.
4. Add `Restaurant` JSON-LD on `/` and `Menu` JSON-LD on `/menu`.
5. Add `manifest.json`, theme-color, maskable icons.
6. Commit: `feat(seo): metadata, sitemap, og cards, structured data`.

### Step 9 — Polish & QA
1. Cross-browser test (Safari iOS especially — bubble animation is the risk surface).
2. Test on a real iPhone SE (375px) and iPhone 15 Pro (393px). Test on Pixel 7. Test desktop at 1280, 1440, 1920.
3. Run Axe and Lighthouse a11y scan; fix anything below AA.
4. Run `next build`; ensure 0 errors, 0 warnings.
5. Add a `README.md` with: brand brief, run commands, content-edit guide (where to edit menu, hours, cause), deploy guide, asset replacement checklist.
6. Add `ASSETS.md` per §7 closing note.
7. Tag the demo: `v0.1.0-demo`.
8. Commit: `chore(release): v0.1.0-demo`.

### Step 10 — Deploy
1. Push to `main` on this existing repo. Autodeploy publishes to `https://demo.gabrielgabrie.com/thecivil`.
2. **Before the first push,** confirm with the owner whether the host's autodeploy uses Next.js `basePath` (requests arrive at `/thecivil/...`) or a proxy-strip pattern (requests arrive at `/`). Configure §6.3 accordingly.
3. After the first deploy, smoke-test on the live URL: every CTA, every image, every internal link, the OG card, and `tel:`/`mailto:` from a real phone.
4. Share the live URL with the owner once Step 9's checklist is green.

---

## 12. Open questions for the owner (compile as `QUESTIONS.md`)

The implementation agent should NOT block on these for the demo, but should list them in `QUESTIONS.md` for the owner:

**Resolved (do not re-ask):**
- ~~Phone number for tap-to-call~~ → **+1 (519) 570-9992**
- ~~Repo / hosting target~~ → **this repo, autodeploys to `demo.gabrielgabrie.com/thecivil`**
- ~~Demo URL~~ → **`demo.gabrielgabrie.com/thecivil` is acceptable for the demo phase**

**Still open:**
1. Can you provide the exact list of "The Cause" charities for the last 6 months?
2. Are the cocktail prices uniform at $10.44, or does that change?
3. Flight prices — confirm dollar amounts (not on the public menu listing we sourced).
4. Do you want a built-in newsletter signup?
5. When ready for production, do we keep the GoDaddy domain (`thecivil.ca`) or migrate DNS?
6. Do you want a soft dark/light theme toggle exposed to users, or default dark only?
7. Confirm accessibility details (step-free entry? accessible washroom?) for the `/visit` page.
8. Do you want a "Gift cards" CTA? (Toast supports them.)
9. Permission to feature staff bios / a "Meet the team" page in v2?
10. Right-to-use confirmation on every photo we sourced (see `ASSETS.md`).
11. Subpath routing mode for the autodeploy host: native Next.js `basePath` or proxy-strip? (See §6.3.)

---

## 13. Out of scope for v1 (good v2 candidates)

- Online ordering UI (keep Toast link-out — they own the integration, refunds, and POS sync).
- Reservation UI (same — keep Toast Tables link-out).
- Real CMS (Sanity) for self-serve content edits.
- Loyalty / accounts / login.
- Blog or "stories" beyond the manifesto.
- Multi-language.
- Gift card flow.
- Native app or PWA install promo (we'll set up the manifest but not nag users).

---

## 14. Risks & mitigations

| Risk | Mitigation |
|---|---|
| GoDaddy CDN blocks scraping → no real photos | Wayback Machine fallback; Google Business profile photos; flag clearly in `ASSETS.md` and request owner to upload originals. |
| Instagram scraping fails | Ask owner to share 8–12 post URLs; embed via official IG embed or pull via oEmbed. |
| Bubble animation hurts Lighthouse on low-end Android | Idle-only on `prefers-reduced-motion` and on `connection.saveData`; fallback to a static SVG. |
| Toast outage breaks Reserve/Order CTAs | Add a soft fallback link to email + phone; display a non-blocking banner if Toast 5xx is detected via a tiny edge probe (v2). |
| Owner edits menu and forgets to redeploy | README.md "How to update the menu" with a one-paragraph Vercel auto-deploy explanation; v2 add Sanity. |
| Photo rights uncertain | `ASSETS.md` go-live checklist; do NOT publish to the apex domain until cleared. Demo lives on the Vercel preview URL until then. |

---

## 15. Definition of "demo done"

The demo is shippable to the owner when:

- [ ] All routes in §3 render without errors.
- [ ] Mobile-first design verified on iPhone SE and Pixel 7 in real browsers.
- [ ] Lighthouse mobile scores ≥ 95 / 95 / 100 / 100.
- [ ] Reserve and Order CTAs successfully deep-link to the existing Toast URLs.
- [ ] Live open/closed pill is correct in `America/Toronto` across DST boundary (test by mocking `Date`).
- [ ] `ASSETS.md` is populated for every published image.
- [ ] `QUESTIONS.md` is populated.
- [ ] `README.md` documents how the owner edits menu, hours, and cause.
- [ ] Deployed to a Vercel preview URL ready to send to the owner.

When all boxes are checked, hand it back for owner feedback before we touch DNS.

---

*Built with disobedience.*
