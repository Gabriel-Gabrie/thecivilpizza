'use client';

import { useState } from 'react';
import { verifyRepoAccess, verifyToken } from '@/lib/admin/github';
import { writeToken } from '@/lib/admin/storage';
import {
  BUNDLED_PAT,
  HAS_BUNDLED_PAT,
  OWNER_PASSWORD,
  OWNER_USERNAME,
  startSession,
} from '@/lib/admin/auth';

// Two modes:
//   1. Production / authed CI build → username + password form. Validates
//      against OWNER_USERNAME / OWNER_PASSWORD. On success, the bundled
//      PAT is used for all subsequent API calls.
//   2. Local dev (no ADMIN_PAT secret bundled) → falls back to the legacy
//      personal-access-token field so the developer can still test.

export function AuthGate({ onAuth }: { onAuth: (token: string, login: string) => void }) {
  return HAS_BUNDLED_PAT ? <UserPassGate onAuth={onAuth} /> : <TokenGate onAuth={onAuth} />;
}

function UserPassGate({ onAuth }: { onAuth: (token: string, login: string) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    if (username.trim() !== OWNER_USERNAME || password !== OWNER_PASSWORD) {
      setError('That username or password is wrong.');
      setBusy(false);
      return;
    }
    try {
      // Sanity check: hit GitHub once so we surface any token issues
      // before the editor screen loads.
      const { login } = await verifyToken(BUNDLED_PAT);
      await verifyRepoAccess(BUNDLED_PAT);
      startSession();
      onAuth(BUNDLED_PAT, login);
    } catch {
      setError(
        "We can't reach the site's editor right now. Please email Gabriel."
      );
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6 sm:py-20">
      <p className="text-sm font-medium text-ink/60">The Civil — owner area</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        Sign in
      </h1>
      <p className="mt-3 text-base text-ink/75">
        Use the username and password Gabriel set up for you.
      </p>

      <form onSubmit={submit} className="mt-8 space-y-4" autoComplete="on">
        <label className="block">
          <span className="text-sm font-medium text-ink">Username</span>
          <input
            type="text"
            autoFocus
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1.5 block w-full rounded-md border border-ink/20 bg-white px-3.5 py-2.5 text-base text-ink focus:border-ink/50 focus:outline-none focus:ring-2 focus:ring-ink/20"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-ink">Password</span>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 block w-full rounded-md border border-ink/20 bg-white px-3.5 py-2.5 text-base text-ink focus:border-ink/50 focus:outline-none focus:ring-2 focus:ring-ink/20"
          />
        </label>
        {error && (
          <p
            role="alert"
            className="rounded-md border border-ember/40 bg-ember/10 px-3.5 py-2.5 text-sm text-ember"
          >
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center justify-center rounded-md bg-ink px-5 py-2.5 text-sm font-medium text-paper transition hover:bg-ink/85 disabled:opacity-50"
        >
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="mt-12 text-xs text-ink/50">
        Forgot your password? Email Gabriel.
      </p>
    </div>
  );
}

function TokenGate({ onAuth }: { onAuth: (token: string, login: string) => void }) {
  const [token, setToken] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const trimmed = token.trim();
      if (!trimmed) throw new Error('Paste your token first.');
      const { login } = await verifyToken(trimmed);
      await verifyRepoAccess(trimmed);
      writeToken(trimmed);
      startSession();
      onAuth(trimmed, login);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6 sm:py-20">
      <p className="text-sm font-medium text-ink/60">Local dev</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        Paste a personal access token
      </h1>
      <p className="mt-3 text-base text-ink/75">
        This screen only shows up when ADMIN_PAT isn't baked into the build.
        In production the owner sees a username/password form instead.
      </p>

      <form onSubmit={submit} className="mt-8 space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-ink">GitHub token</span>
          <input
            type="password"
            autoFocus
            spellCheck={false}
            autoComplete="off"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="github_pat_..."
            className="mt-1.5 block w-full rounded-md border border-ink/20 bg-white px-3.5 py-2.5 font-mono text-sm text-ink placeholder:text-ink/35 focus:border-ink/50 focus:outline-none focus:ring-2 focus:ring-ink/20"
          />
        </label>
        {error && (
          <p
            role="alert"
            className="rounded-md border border-ember/40 bg-ember/10 px-3.5 py-2.5 text-sm text-ember"
          >
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center justify-center rounded-md bg-ink px-5 py-2.5 text-sm font-medium text-paper transition hover:bg-ink/85 disabled:opacity-50"
        >
          {busy ? 'Verifying…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
