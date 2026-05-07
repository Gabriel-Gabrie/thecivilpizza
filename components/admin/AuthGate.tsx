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
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <p className="kicker mb-2">Owner area</p>
      <h1 className="font-display text-balance text-4xl font-black italic leading-[1] tracking-masthead sm:text-5xl">
        Sign in.
      </h1>
      <p className="dek mt-4 text-base">
        Paste your GitHub personal access token. It's stored in your browser only —
        not sent anywhere except GitHub. Don't sign in on a shared device.
      </p>

      <form onSubmit={submit} className="mt-8 space-y-4">
        <label className="block">
          <span className="kicker">GitHub token</span>
          <input
            type="password"
            autoFocus
            spellCheck={false}
            autoComplete="off"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="github_pat_..."
            className="mt-2 block w-full rounded-md border border-paper/30 bg-ink/60 px-4 py-3 font-mono text-sm text-paper placeholder:text-paper/40 focus:border-paper focus:outline-none"
          />
        </label>
        {error && (
          <p
            role="alert"
            className="rounded-md border border-ember/60 bg-ember/10 px-4 py-3 font-mono text-sm text-ember"
          >
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={busy}
          className="btn-ember disabled:opacity-50"
        >
          {busy ? 'Verifying…' : 'Sign in'}
        </button>
      </form>

      <details className="mt-12 rounded-md border border-paper/20 p-5">
        <summary className="cursor-pointer font-mono text-[11px] uppercase tracking-[0.2em] text-paper/80">
          How to get a token (one-time, ~3 minutes)
        </summary>
        <ol className="mt-4 space-y-3 text-sm text-paper/85">
          <li>
            <span className="font-mono text-paper/60">1.</span> Open{' '}
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
            <span className="font-mono text-paper/60">2.</span> Token name: anything
            (e.g. "Civil admin"). Expiry: whatever you're comfortable with.
          </li>
          <li>
            <span className="font-mono text-paper/60">3.</span> Resource owner:{' '}
            <span className="font-mono text-paper">Gabriel-Gabrie</span>. Repository
            access: "Only select repositories" →{' '}
            <span className="font-mono text-paper">{REPO}</span>.
          </li>
          <li>
            <span className="font-mono text-paper/60">4.</span> Repository
            permissions: under "Contents", change to{' '}
            <span className="font-mono text-paper">Read and write</span>. Leave the
            others alone.
          </li>
          <li>
            <span className="font-mono text-paper/60">5.</span> Generate, copy the
            token (starts with{' '}
            <span className="font-mono text-paper">github_pat_</span>), paste it
            above.
          </li>
        </ol>
      </details>
    </div>
  );
}
