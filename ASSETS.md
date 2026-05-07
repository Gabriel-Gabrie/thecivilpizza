# Assets — Photo Inventory & Rights Checklist

All photographs currently used in the demo were **sourced from The Civil's existing GoDaddy CDN** at `img1.wsimg.com/isteam/ip/57a23fb7-f616-48e7-883c-940e535f97ba/`. The bulk of the gallery comes from a professional photoshoot whose filenames followed an `IMG_5XXX-Final.jpg` pattern; URLs were recovered from the Wayback Machine snapshot of `thecivil.ca` and the rest of the sequence was discovered by brute-forcing IDs 5500-5700 against the same CDN. Originals live at [public/images/source/](public/images/source/) (gitignored) and renamed working copies live at [public/images/](public/images/).

Before publishing this site to a new domain (or to thecivil.ca itself), the owner must confirm right-to-use on each image below. This is the go-live checklist.

---

## Inventory

| File in `public/images/` | Original CDN filename | Subject | Used on | Owner-confirmed? |
|---|---|---|---|---|
| `pizza-and-flight.jpg` | `1000095337.jpg` | A pizza in the foreground with a four-glass cocktail flight behind it. Damask wallpaper visible. | `/` (hero backdrop, gallery), Civil Disobedience tile | [ ] |
| `pizza-pepperoni-honey.jpg` | `1000095338.jpg` | Pepperoni close-up with hot honey drizzle. | Bee Spicy / Just All The Pepperoni tiles | [ ] |
| `pizza-dill-communication.webp` | `1000096210.webp` | Dill Communication pizza, top-down. | Dill Communication tile | [ ] |
| `pizza-fungi.jpg` | `1000096566.jpg` | You Seem Like A Fungi pizza in box. | You Seem Like A Fungi tile | [ ] |
| `flight-pastel.webp` | `1000096761.webp` | Pastel flight on damask wallpaper. | (held; available for future use) | [ ] |
| `flight-bright.jpg` | `1000097988.jpg` | Bright flight against white-brick wall. | (held) | [ ] |
| `flight-bourbon-hot-choc.jpg` | `1000098668.jpg` | Bourbon hot chocolate flight (4 mugs, whipped cream). | (held) | [ ] |
| `flight-bourbon-mugs.jpg` | `1000099231.jpg` | Bourbon hot chocolate trio. | (held) | [ ] |
| `flight-gin-tonic.jpg` | `IMG_5526-Final.jpg` | **Pro shot** — gin & tonic flight in pastel mason jars. | `/visit` gallery | [ ] |
| `interior-bar.jpg` | `1000098719.jpg` | **Money shot** — wide dining-room interior with damask wallpaper, leather banquette, brass lamps, "On Tap — Bellwoods Civil Lager" chalkboard. | `/` gallery, `/visit` | [ ] |
| `bar-sign.jpg` | `IMG_20220307_153326_779.jpg` | Black-and-white "BAR" marquee sign on a tannery beam. | `/` gallery, `/visit` | [ ] |
| `cocktail-pink-basil.jpg` | `1000099143.jpg` | Single red cocktail with basil leaf garnish. | (held) | [ ] |
| `cocktail-negroni.jpg` | `IMG_20211123_082050_229.jpg` | **Pro shot** — moody negroni with large ice block and blood orange. | `/cocktails` hero | [ ] |
| `cocktail-pineapple-rosemary.jpg` | `IMG_20211125_090548_952.jpg` | Gin cocktail with pineapple wheel + rosemary, lit by a vintage cut-glass lamp. | `/` Tonight on the bar feature | [ ] |

Two GoDaddy assets (`1000098597.png`, `1000109288.png`) were menu graphics, not photos. They were used to **transcribe** the current cocktail/flight/lunch menu (cocktails are now $12, flights $14 — corrected in [content/menu.json](content/menu.json)). Not shipped as imagery.

---

## Brand marks (owned by us, in-repo)

| Path | Purpose |
|---|---|
| [components/ui/Seal.tsx](components/ui/Seal.tsx) | Inline SVG civic seal — used as logomark and footer stamp. |
| [components/ui/Wordmark.tsx](components/ui/Wordmark.tsx) | "The Civil" wordmark, set in Fraunces 900 italic via `next/font`. |
| [components/ui/Stamp.tsx](components/ui/Stamp.tsx) | Rotated typographic stamp template (REAL FIRE / NO TVs / DINE-IN ONLY etc). |
| [app/icon.svg](app/icon.svg), [app/apple-icon.svg](app/apple-icon.svg) | Favicons. |
| [app/opengraph-image.tsx](app/opengraph-image.tsx) | Edge-rendered Open Graph card (newspaper masthead style). |

These are all generated in this repo and have no third-party rights claims. The wordmark is intentionally close to the existing typographic identity but is **not** a copy of any registered mark — owner can request a custom commissioned wordmark before going to production at `thecivil.ca`.

---

## Procedure if a photo is rejected

1. Remove the file from `public/images/` and update the references in:
   - [content/gallery.json](content/gallery.json) (gallery items)
   - [components/menu/PizzaTile.tsx](components/menu/PizzaTile.tsx) (`PIE_PHOTOS` map)
   - Any direct `<Image src="/images/..." />` references — grep the repo
2. Either replace with a different existing photo, or remove the slot. The PizzaTile component falls back to its SVG art automatically if a slug has no entry in `PIE_PHOTOS`.
3. Update this file's "Owner-confirmed?" column to a strikethrough.

---

## Photographer credits

The two `IMG_*` files are clearly higher-quality than the rest and look professionally shot. **Owner: please confirm photographer credit.** If a credit is required, add it to the alt text in [content/gallery.json](content/gallery.json) and to the figcaption on `/visit`.
