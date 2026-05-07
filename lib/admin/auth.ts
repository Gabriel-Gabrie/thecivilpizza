// Owner login config. The username and password gate access to the
// admin UI but are NOT a real security boundary — when NEXT_PUBLIC_ADMIN_PAT
// is set, the underlying GitHub token is baked into the built JS bundle
// and is publicly visible to anyone who reads the page source.
//
// What that means in practice: the password keeps random visitors from
// stumbling into the admin and editing things, but a determined attacker
// can extract the token and edit content from anywhere. For a low-stakes
// demo where the worst case is reverting one bad commit, that's an
// accepted trade-off.
//
// To rotate credentials, change OWNER_USERNAME / OWNER_PASSWORD here and
// re-deploy. To rotate the token, update the ADMIN_PAT secret in
// GitHub → repo Settings → Secrets and variables → Actions.

export const OWNER_USERNAME = 'admin';
export const OWNER_PASSWORD = 'thecivil';

/** Bundled-in PAT, set via the ADMIN_PAT secret at build time. */
export const BUNDLED_PAT: string = process.env.NEXT_PUBLIC_ADMIN_PAT ?? '';

/** True when the bundle has a token baked in (production / authed CI build). */
export const HAS_BUNDLED_PAT = BUNDLED_PAT.length > 0;

const SESSION_KEY = 'civil-admin-session';

export function hasSession(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(SESSION_KEY) === 'yes';
  } catch {
    return false;
  }
}

export function startSession(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(SESSION_KEY, 'yes');
  } catch {
    // ignore
  }
}

export function endSession(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(SESSION_KEY);
  } catch {
    // ignore
  }
}
