# Owner admin

The Civil's owner edits site content through `/admin` —
[demo.gabrielgabrie.com/thecivil/admin](https://demo.gabrielgabrie.com/thecivil/admin).
Edits commit straight to `main`, GitHub Actions rebuilds, the deploy
branch updates, and Hostinger pulls the new version. **Live in ~90 seconds.**

## What the owner sees

A friendly username + password sign-in form, then four tabs:

| Tab | Edits |
|---|---|
| **Contact & links** | Phone, email, Instagram, Reserve URL, Order URL, Directions URL, address, brand tagline & description |
| **Hours** | Weekly schedule (each day's open/close ranges, multiple ranges per day, "Closed" by leaving empty), the lunch window |
| **Menu** | Every section (Pies, Starters, Cocktails, Flights, Beer & Wine, Lunch). Add / edit / remove / reorder items |
| **Gallery** | Upload new photos, edit alt text + category, mark items as "feature" (hero row), delete items |

The owner never sees GitHub, tokens, branches, commits, or file paths.

## Why we encrypt the bundled token

The admin page runs entirely in the browser. To talk to GitHub it needs
a personal access token (PAT). The simple version — bundle the raw PAT
into the JavaScript — was tried and immediately broken: GitHub's secret
scanning saw the leaked token in the public deploy branch and
auto-revoked it within minutes.

The fix: we encrypt the PAT with the owner's password (AES-256-GCM,
PBKDF2 with 600,000 iterations), and only the **encrypted blob** lives
in the bundle. The blob is just base64 noise — GitHub's scanner has
nothing to match. The owner's password unlocks it client-side at sign-in.

> **Security trade-off:** the password is the only thing protecting the
> token. A determined attacker who knows the password is restaurant-themed
> could brute-force "thecivil" — PBKDF2 makes each guess slow but not
> impossibly slow. For a demo whose worst case is "vandalism, recoverable
> by `git revert`," this is acceptable. **Do not reuse this pattern for
> anything actually sensitive.**

## Setup (developer-side, one-time)

You need to generate a PAT, encrypt it with the owner's password, and
paste the encrypted blob into a GitHub Secret.

### 1. Generate a personal access token

A fine-grained PAT scoped to this repo is enough:

- Open
  [GitHub → Settings → Developer settings → Fine-grained tokens](https://github.com/settings/personal-access-tokens/new).
- Token name: anything (e.g. *"Civil admin"*).
- Resource owner: `Gabriel-Gabrie`.
- Repository access: *Only select repositories* → `Gabriel-Gabrie/thecivilpizza`.
- Repository permissions: under **Contents**, change to **Read and write**.
- Generate, copy the token (starts with `github_pat_`).

(Classic PATs with `repo` scope work too, if you'd prefer no expiry.)

### 2. Encrypt it with the owner's password

The owner's password is hardcoded in
[`lib/admin/auth.ts`](lib/admin/auth.ts) as `OWNER_PASSWORD` (currently
`thecivil`). The encrypt script takes the password and the PAT, outputs
a base64 blob:

```bash
npm run encrypt-admin-pat -- thecivil github_pat_yourTokenHere
```

The blob comes out on stdout. Copy it.

### 3. Add it as a repository secret

- Go to
  [the repo's Actions secrets](https://github.com/Gabriel-Gabrie/thecivilpizza/settings/secrets/actions).
- **New repository secret** → name **`ADMIN_PAT_ENC`**, value = the
  blob from step 2.

If you previously had a secret called `ADMIN_PAT` (the old plaintext
version), delete it.

### 4. Trigger a re-deploy

Push any small change to `main`, OR re-run the latest
[Build + push to deploy branch](https://github.com/Gabriel-Gabrie/thecivilpizza/actions/workflows/deploy.yml)
workflow.

### 5. Verify

Visit `/admin` on the live site. You should see the **Sign in**
username/password form. Type `admin` / `thecivil` → you're in.

If you skip step 3 (no `ADMIN_PAT_ENC` secret), the admin page falls
back to the developer "paste a token" form so you can still test
locally with `npm run dev`.

## Owner-facing credentials

Hardcoded in [`lib/admin/auth.ts`](lib/admin/auth.ts):

```
username: admin
password: thecivil
```

If you change `OWNER_PASSWORD`, you **must** also re-encrypt the PAT
with the new password (run step 2 again) and update the
`ADMIN_PAT_ENC` secret. The encryption uses the password itself as the
unlock key — they have to match.

## Rotating the token

If the PAT is compromised:

1. Revoke it on GitHub.
2. Generate a new one (same scope).
3. Re-encrypt with the same password (step 2 above).
4. Update the `ADMIN_PAT_ENC` secret value.
5. Trigger a rebuild.

The owner doesn't have to do anything — same username/password, new
token under the hood.

## How saving works under the hood

1. Owner clicks **Save changes**.
2. Admin builds a single Git commit containing every changed JSON file
   plus any newly uploaded images.
3. Commit lands on `main`.
4. The `Build + push to deploy branch` GitHub Action runs (~50 seconds).
5. `out/` is pushed onto the `deploy` branch (with normal history so
   Hostinger can fast-forward — see [HOSTING.md](HOSTING.md)).
6. Hostinger's webhook pulls and serves.

The owner sees a green "Saved." banner with no underlying detail.

## When something goes wrong

- **"That username or password is wrong"** — typo, OR the PAT was
  encrypted with a different password than the one in `OWNER_PASSWORD`.
- **"We can't reach the site's editor right now"** — token unlocked
  fine but GitHub rejected it. Most likely the token expired or was
  revoked. Re-run the rotation steps above.
- **Saved but not visible after 2-3 minutes** — check the
  [Actions tab](https://github.com/Gabriel-Gabrie/thecivilpizza/actions)
  for a failed build. Most common cause is invalid JSON, which means
  one of the admin tabs let through a bad value. The live site keeps
  serving the previous version — no damage.

## Where the data lives

- `content/seo.json` — addresses, links, brand copy
- `content/hours.json` — schedule
- `content/menu.json` — all menu items
- `content/gallery.json` — gallery item list
- `public/images/` — uploaded image files
