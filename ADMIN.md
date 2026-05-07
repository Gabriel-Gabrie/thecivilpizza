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
| **Menu** | Every section (Pies, Starters, Cocktails, Flights, Beer & Wine, Lunch). Add / edit / remove / reorder items. Each item: name, price, dek (one-line punchline), ingredients, tags |
| **Gallery** | Upload new photos, edit alt text + category, mark items as "feature" (hero row), delete items |

The owner never sees GitHub, tokens, branches, commits, or file paths.

## Setup (developer-side, one-time)

The owner can't log in yet — first you (developer) need to bake a
GitHub personal access token into the build. The build inlines it into
the JavaScript bundle and the username/password form unlocks it.

> **Security note:** the token is exposed in client JS by design. The
> username/password is not a real security barrier — anyone with
> `view-source:` on `/admin` can extract the token. The blast radius is
> "Contents: read/write on this one repo," which is recoverable via
> `git revert`. Acceptable for this demo. Do **not** ship this pattern
> for anything actually sensitive.

1. **Generate a personal access token.** Classic, no expiry is fine:
   - Open [GitHub → Settings → Developer settings → Personal access tokens (classic)](https://github.com/settings/tokens?type=classic).
   - **Generate new token (classic)** → name "Civil admin," expiry **No expiration**.
   - Scope: tick **`repo`** (full control of repositories — needed to write content + upload images via the API).
   - Generate, copy the token (starts with `ghp_`).

2. **Add it as a repository secret:**
   - Go to [the repo's Actions secrets settings](https://github.com/Gabriel-Gabrie/thecivilpizza/settings/secrets/actions).
   - **New repository secret** → name **`ADMIN_PAT`**, value = the token from step 1.

3. **Trigger a re-deploy** so the secret gets baked in:
   - Push any small change to `main`, OR
   - Re-run the latest [Build + push to deploy branch](https://github.com/Gabriel-Gabrie/thecivilpizza/actions/workflows/deploy.yml) workflow.

4. **Verify:** visit `/admin` on the live site. You should see the
   **Sign in** username/password form (not the "paste a token" form).

If you ever skip step 2 (no `ADMIN_PAT` secret), the admin page falls
back to the developer "paste a token" form so you can still test
locally with `npm run dev`.

## Owner-facing credentials

Hardcoded in [`lib/admin/auth.ts`](lib/admin/auth.ts):

```
username: admin
password: thecivil
```

Email Gabriel to change either. (One file edit + push, ~2 minutes.)

## Rotating the token

If the PAT is ever compromised:
1. Revoke it on GitHub.
2. Generate a new one (same `repo` scope).
3. Update the `ADMIN_PAT` secret value in repo settings.
4. Push a small change to trigger a rebuild.

The owner doesn't have to do anything — sign-in keeps working with the
same username/password.

## How saving works under the hood

1. Owner clicks **Save changes**.
2. Admin builds a single Git commit containing every changed JSON file
   plus any newly uploaded images.
3. Commit lands on `main`.
4. The `Build + push to deploy branch` GitHub Action runs (~50 seconds).
5. `out/` is force-pushed onto the `deploy` branch (with normal history
   so Hostinger can fast-forward — see [HOSTING.md](HOSTING.md)).
6. Hostinger's webhook pulls and serves.

The owner sees a green "Saved." banner with no underlying detail.

## When something goes wrong

- **"That username or password is wrong"** — typo in the sign-in form.
- **"We can't reach the site's editor right now"** — the bundled token
  is missing, expired, or revoked. Re-run the setup steps above.
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
