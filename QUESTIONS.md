# Questions for the Owner

Resolved during planning:

- ~~Phone number for tap-to-call~~ → **+1 (519) 570-9992**
- ~~Repo / hosting~~ → **this repo, autodeploys to demo.gabrielgabrie.com/thecivil**
- ~~Demo URL OK?~~ → **yes**

---

## Still open

### Content

1. **Cause archive.** [content/cause.json](content/cause.json) ships with placeholder months and stats. Please confirm or replace:
   - This month's charity name + URL (currently set to **House of Friendship**)
   - The 6-month archive list
   - Total raised + pizzas sold figures
2. **Cause pie naming.** Each month's Cause pie name in the archive is invented. Real names please.
3. **Flight prices.** Transcribed from your menu PNG as **$14** for a 4×0.5oz flight. Confirm.
4. **Cocktail pricing on the existing site.** Your menu PNG shows **$12** cocktails (1.5oz). Confirm — older third-party sites still list $10.44.
5. **The Civil Lager.** Confirmed brewed with **Bellwoods**? Pricing $8.25 for 16oz pour, $8.75 rotating tall cans?
6. **Wines.** Pinot Grigio and Cab Nero — glass $10, bottle $38. Are there others or a rotating list?
7. **Lunch menu.** Confirm the lunch items I transcribed. Are there seasonal items not on this PNG?

### Photos

8. **Right-to-use confirmation** on every photo in [ASSETS.md](ASSETS.md). All sourced from your existing GoDaddy CDN.
9. **Photographer credits** for `IMG_*` files (`cocktail-negroni.jpg`, `cocktail-pineapple-rosemary.jpg`, `flight-gin-tonic.jpg`) — these look professionally shot.
10. **Bigger photo budget?** Several pies and cocktails have no photos and currently use generated SVG art. Even three more high-res shots would meaningfully change the site.

### Operations / hosting

11. **Subpath routing mode.** When a request hits `demo.gabrielgabrie.com/thecivil/...`, does the server forward `/thecivil/...` to the Next.js process, or strip the prefix at a proxy? See [README.md § Subpath deployment](README.md#subpath-deployment) for what changes.
12. **Domain plan.** Eventually swap onto `thecivil.ca`? If so, when, and what's the DNS handover plan?
13. **Newsletter signup.** Want one? Buttondown / ConvertKit are easy adds.
14. **Gift cards.** Toast supports them. Add a CTA?
15. **Phone visibility.** Confirm `+1 (519) 570-9992` is the right public-facing number (vs an internal/owner cell).

### Page-specific

16. **Accessibility on `/visit`** — confirm:
    - Step-free entry (the page currently says "from the north Tannery courtyard" — accurate?)
    - Accessible washroom on the ground floor — yes/no
17. **Private events** — confirm capacity (we say "up to 30 seated, 35 mingling"), inquiry email (we use the main email), and any hard min/max.
18. **Manifesto** — read [content/manifesto.ts](content/manifesto.ts). Voice and facts both need owner sign-off. We took some creative liberties.
19. **The Cause stats** — currently showing $8,400 raised over 14 months. Real numbers, please.

### Future / v2

20. Self-serve CMS (Sanity) so you can edit menu/hours/cause without a dev?
21. "Meet the team" page?
22. A real photo gallery beyond the 6 we currently have?
23. Newsletter / SMS for new pies and Cause-month reveals?

---

## Where the placeholder content lives

Search the repo for `TODO`:

```bash
grep -r "TODO" content/ app/ --include='*.ts*' --include='*.json'
```

Most placeholders are in `content/cause.json` and the accessibility blurb on `app/visit/page.tsx`.
