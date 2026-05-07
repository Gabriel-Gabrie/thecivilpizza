// localStorage helpers for the admin token. Centralized so one place
// owns the key name and the security warning lives next to the storage.
//
// Security note: this token grants write access to the repo. It's stored
// in plain localStorage. Acceptable for a single-owner low-risk demo;
// the AuthGate component warns the user and offers a clear "log out"
// button that wipes the key.

const TOKEN_KEY = 'civil-admin-token';

export function readToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function writeToken(token: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // ignore — incognito mode etc.
  }
}

export function clearToken(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }
}
