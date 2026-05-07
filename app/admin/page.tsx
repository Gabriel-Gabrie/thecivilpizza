'use client';

import { useEffect, useState } from 'react';
import { AuthGate } from '@/components/admin/AuthGate';
import { AdminShell } from '@/components/admin/AdminShell';
import { readToken } from '@/lib/admin/storage';
import { verifyToken } from '@/lib/admin/github';

// Owner-only content editor. Auth is a GitHub fine-grained PAT with
// Contents: Read and write on this repo. Token lives in localStorage —
// see components/admin/AuthGate.tsx for the security caveats and the
// step-by-step token-creation guide.

export default function AdminPage() {
  const [phase, setPhase] = useState<'hydrating' | 'auth' | 'authed'>('hydrating');
  const [token, setToken] = useState<string | null>(null);
  const [login, setLogin] = useState<string | null>(null);

  useEffect(() => {
    const stored = readToken();
    if (!stored) {
      setPhase('auth');
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const { login: who } = await verifyToken(stored);
        if (cancelled) return;
        setToken(stored);
        setLogin(who);
        setPhase('authed');
      } catch {
        if (cancelled) return;
        setPhase('auth');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // The public site's body bg is ink (dark). The admin runs on a paper
  // (cream) bg for readability. Set the body class while this route is
  // mounted, restore on unmount.
  useEffect(() => {
    document.body.classList.add('bg-paper', 'text-ink');
    document.body.classList.remove('bg-ink', 'text-paper');
    return () => {
      document.body.classList.remove('bg-paper', 'text-ink');
      document.body.classList.add('bg-ink', 'text-paper');
    };
  }, []);

  return (
    <div className="min-h-screen bg-paper text-ink">
      {phase === 'hydrating' && (
        <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
          <p className="text-sm text-ink/60">Checking sign-in…</p>
        </div>
      )}
      {phase === 'auth' && (
        <AuthGate
          onAuth={(t, who) => {
            setToken(t);
            setLogin(who);
            setPhase('authed');
          }}
        />
      )}
      {phase === 'authed' && token && login && (
        <AdminShell
          token={token}
          login={login}
          onSignOut={() => {
            setToken(null);
            setLogin(null);
            setPhase('auth');
          }}
        />
      )}
    </div>
  );
}
