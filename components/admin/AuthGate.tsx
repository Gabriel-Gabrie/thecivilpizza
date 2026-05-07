'use client';

import { useState } from 'react';
import { verifyRepoAccess, verifyToken, REPO } from '@/lib/admin/github';
import { writeToken } from '@/lib/admin/storage';

export function AuthGate({ onAuth }: { onAuth: (token: string, login: string) => void }) {
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
      onAuth(trimmed, login);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6 sm:py-20">
      <p className="text-sm font-medium text-ink/60">Owner area</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        Sign in
      </h1>
      <p className="mt-3 text-base text-ink/75">
        Paste your GitHub personal access token. It's stored in your browser only —
        not sent anywhere except GitHub. Don't sign in on a shared device.
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

      <details className="mt-12 rounded-md border border-ink/15 bg-white p-5">
        <summary className="cursor-pointer text-sm font-medium text-ink">
          How to get a token (one-time, ~3 minutes)
        </summary>
        <ol className="mt-4 space-y-2.5 text-sm text-ink/75">
          <li>
            <span className="font-medium text-ink/55">1.</span> Open{' '}
            <a
              href="https://github.com/settings/personal-access-tokens/new"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ember underline-offset-4 hover:underline"
            >
              GitHub → Settings → Developer settings → Fine-grained tokens
            </a>
            .
          </li>
          <li>
            <span className="font-medium text-ink/55">2.</span> Token name: anything
            (e.g. "Civil admin"). Expiry: whatever you're comfortable with.
          </li>
          <li>
            <span className="font-medium text-ink/55">3.</span> Resource owner:{' '}
            <span className="rounded bg-ink/5 px-1.5 py-0.5 font-mono text-xs">Gabriel-Gabrie</span>.
            Repository access: "Only select repositories" →{' '}
            <span className="rounded bg-ink/5 px-1.5 py-0.5 font-mono text-xs">{REPO}</span>.
          </li>
          <li>
            <span className="font-medium text-ink/55">4.</span> Repository
            permissions: under "Contents", change to{' '}
            <strong className="font-medium text-ink">Read and write</strong>. Leave the
            others alone.
          </li>
          <li>
            <span className="font-medium text-ink/55">5.</span> Generate, copy the
            token (starts with{' '}
            <span className="rounded bg-ink/5 px-1.5 py-0.5 font-mono text-xs">github_pat_</span>),
            paste it above.
          </li>
        </ol>
      </details>
    </div>
  );
}
