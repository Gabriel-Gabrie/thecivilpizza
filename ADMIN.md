# Owner admin

The Civil's owner edits site content through `/admin` —
[demo.gabrielgabrie.com/thecivil/admin](https://demo.gabrielgabrie.com/thecivil/admin).
Edits commit straight to `main`, GitHub Actions rebuilds, the deploy
branch updates, and Hostinger pulls the new version. **Live in ~90 seconds.**

## What can be edited

| Tab | Edits |
|---|---|
| **Contact & links** | Phone, email, Instagram, Reserve URL, Order URL, Directions URL, address, brand tagline & description |
| **Hours** | Weekly schedule (each day's open/close ranges, multiple ranges per day, "Closed" by leaving empty), the lunch window |
| **Menu** | Every section (Pies, Starters, Cocktails, Flights, Beer & Wine, Lunch). Add / edit / remove / reorder items. Each item: name, price, dek (one-line punchline), ingredients, tags |
| **Gallery** | Upload new photos, edit alt text + category, mark items as "feature" (hero row), delete items |

## How to sign in (one-time setup, ~3 minutes)

1. Open
   [GitHub → Settings → Developer settings → Fine-grained tokens](https://github.com/settings/personal-access-tokens/new).
2. Token name: anything (e.g. *"Civil admin"*). Expiry: whatever you're
   comfortable with — 90 days is reasonable.
3. **Resource owner:** `Gabriel-Gabrie`. **Repository access:** *Only
   select repositories* → `Gabriel-Gabrie/thecivilpizza`.
4. **Repository permissions:** under *Contents*, change to **Read and
   write**. Leave everything else on the defaults.
5. Click **Generate token**. Copy the token (starts with
   `github_pat_`). It will only be shown once.
6. Visit `/admin`, paste the token, hit *Sign in*.

The token is stored in your browser's localStorage. There's a *Sign out*
button in the admin header that wipes it. **Don't sign in on a shared
device** — anyone with browser access could impersonate you.

## What happens when you click Publish

1. Admin computes a single Git commit containing every changed JSON file
   plus any newly uploaded images.
2. The commit lands on `main`.
3. The `Build + push to deploy branch` GitHub Action runs (~50 seconds):
   `npm ci → next build → force-push out/ to deploy`.
4. Hostinger's webhook detects the new commit on `deploy` and pulls.
5. The site is live with your changes.

You'll see a "Published. CI is now building → view commit" banner with a
direct link to the GitHub commit.

## When something goes wrong

- **"This token does not have write access"** — your PAT was created
  without Contents: Read and write. Re-generate it with the right
  permission.
- **"GitHub API 401"** — the token is invalid or expired. Sign out, then
  generate a fresh one.
- **"GitHub API 422"** — usually means the file was edited on `main`
  between when you loaded the admin and when you published. Refresh,
  redo your edits, and publish again.
- **CI build failed** — the live site keeps serving the previous
  version. Most likely cause is invalid JSON. Email the developer with
  the commit URL and a screenshot.

## What this admin doesn't do (yet)

- Live preview inside the admin (you'll see the change live ~90s after
  publish).
- Roles / multiple users.
- Drag-to-reorder (use the up/down arrow buttons).
- Image cropping (upload pre-cropped images).
- Edit `manifesto.ts` / `app/the-cause/page.tsx` long-form copy
  (those live in code; ask the developer).

## Where the data lives

- `content/seo.json` — addresses, links, brand copy
- `content/hours.json` — schedule
- `content/menu.json` — all menu items
- `content/gallery.json` — gallery item list
- `public/images/` — uploaded image files
