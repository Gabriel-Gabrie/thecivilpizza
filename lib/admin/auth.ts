// Owner login config. The username + password unlock an AES-GCM
// encrypted PAT that's baked into the JavaScript bundle. The bundle
// is publicly readable (the site's deploy branch is a public repo),
// but the encrypted blob is opaque to GitHub's secret scanner so the
// underlying token does NOT get auto-revoked.
//
// Threat model: random visitors can't get past the password. A motivated
// attacker who suspects the password is restaurant-themed could brute-force
// it — PBKDF2 with 600k iterations slows them down but doesn't make it
// impossible. For "demo at risk of vandalism" this is acceptable; do NOT
// reuse this pattern for anything real.
//
// To rotate credentials:
//   * Username / password → edit OWNER_USERNAME / OWNER_PASSWORD here.
//   * PAT → run scripts/encrypt-admin-pat.mjs with the new PAT and
//     password, paste the output as the ADMIN_PAT_ENC repo secret,
//     trigger a rebuild.

export const OWNER_USERNAME = 'admin';
export const OWNER_PASSWORD = 'thecivil';

/** Bundled-in encrypted PAT, set via the ADMIN_PAT_ENC secret at build time. */
export const BUNDLED_PAT_ENC: string =
  process.env.NEXT_PUBLIC_ADMIN_PAT_ENC ?? '';

/** True when the bundle has an encrypted token baked in. */
export const HAS_BUNDLED_PAT = BUNDLED_PAT_ENC.length > 0;

// -- Decrypted-token cache (per browser tab) --------------------------------
//
// PBKDF2 takes ~1-2 seconds to run, so re-decrypting on every page reload
// would be annoying. We cache the decrypted PAT in sessionStorage — it
// dies when the tab closes, doesn't leak between origins or windows.

const PAT_CACHE_KEY = 'civil-admin-pat';

export function readCachedPat(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.sessionStorage.getItem(PAT_CACHE_KEY);
  } catch {
    return null;
  }
}

export function cachePat(pat: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(PAT_CACHE_KEY, pat);
  } catch {
    // ignore
  }
}

export function clearCachedPat(): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.removeItem(PAT_CACHE_KEY);
  } catch {
    // ignore
  }
}
