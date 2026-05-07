# Questions for the Owner

Resolved during planning:

- ~~Phone number for tap-to-call~~ → **+1 (519) 570-9992**
- ~~Repo / hosting~~ → **this repo, autodeploys to demo.gabrielgabrie.com/thecivil**
- ~~Demo URL OK?~~ → **yes**
- ~~Tannery references in copy~~ → **removed** (address is now just "151 Charles St W, Kitchener")
- ~~Owner content editing~~ → **`/admin` page now lets you edit menu, hours, photos, and contact info from the browser**

---

## Still open

### Content

1. **Menu accuracy** — every item in [content/menu.json](content/menu.json) was transcribed from your menu PNGs. Confirm:
   - All 15 pizza names, ingredients, and prices ($20 across the board).
   - 9 cocktails ($12, 1.5oz).
   - 5 flights ($14, four 0.5oz pours = 2oz total).
   - The 5 beer / wine entries — pricing especially. Are there others or a rotating list?
   - The 5 lunch items — confirm and add seasonal items if missing.
2. **The Civil Lager** — confirmed brewed with **Bellwoods**? Pricing **$8.25 / 16oz**, **$8.75 rotating tall cans**?
3. **Wines** — Pinot Grigio and Cab Nero — **glass $10, bottle $38**. Are there others?

### The Cause page

4. The page at [app/the-cause/page.tsx](app/the-cause/page.tsx) is **evergreen / explainer-only** right now. It does not name a current charity, archive past months, or show running totals.
   - Want a "this month's charity" callout? If so, where does the data come from — owner-edited via `/admin`, or a separate ops doc?
   - Want a past-months archive? Want a "$X raised over Y months" running total?
   - The `ROTATION` array of past pies in that file is a hand-picked photo strip — confirm this is OK as-is (it's not tied to actual past Cause months).

### Photos

5. **Right-to-use confirmation** on every photo in [public/images/](public/images/). All sourced from your existing GoDaddy CDN, your Instagram, your Tripadvisor, or Google Maps screenshots you sent. See [ASSETS.md](ASSETS.md).
6. **Photographer credits** for the pro-shoot files (the `IMG_*` and `pro-*` series — clearly higher-quality, look professionally shot).
7. **Bigger photo budget?** A few pies and cocktails still have no real photo and lean on generated SVG art. A handful more high-res shots would meaningfully change the site.

### Operations / hosting

8. **Subpath routing mode.** When a request hits `demo.gabrielgabrie.com/thecivil/...`, does the server forward `/thecivil/...` to the static build, or strip the prefix at a proxy? Affects whether `NEXT_PUBLIC_BASE_PATH` should stay `/thecivil` or change.
9. **Domain plan.** Eventually swap onto `thecivil.ca`? If so, when, and what's the DNS handover plan? If we move the site to root (`thecivil.ca/` instead of `thecivil.ca/thecivil/`), `NEXT_PUBLIC_BASE_PATH` needs to be empty for that build.
10. **Phone visibility.** Confirm `+1 (519) 570-9992` is the right public-facing number (vs an internal/owner cell).
11. **Newsletter signup.** Want one? Buttondown / ConvertKit are easy adds.
12. **Gift cards.** Toast supports them. Add a CTA?

### Page-specific

13. **Accessibility on `/visit`** — confirm:
    - Step-free entry (yes/no, and where the entrance is)
    - Accessible washroom on the ground floor (yes/no)
14. **Private events** — confirm capacity (we say "up to 30"), inquiry email (we use the main email), and any hard min/max.

### Future / v2

15. Press / pull-quotes page? (We had one in v0 and dropped it; can come back if you want quotes from Restaurant Guru / Yelp / OpenTable / Tripadvisor.)
16. Long-form "Manifesto" / story page? (Same — was in v0, currently not on the site.)
17. "Meet the team" page?
18. SMS / newsletter for new pies and Cause-month reveals?

---

## Where placeholder content lives

The accessibility blurb on [app/visit/page.tsx](app/visit/page.tsx) and the rotating-pie photo strip on [app/the-cause/page.tsx](app/the-cause/page.tsx) are the two places where the displayed content is best-effort and benefits most from owner sign-off.
