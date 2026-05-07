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

  // On mount, check for a stored token. If we have one, verify it's still
  // valid before showing the editor; otherwise show the auth gate.
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

  if (phase === 'hydrating') {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <p className="font-mono text-sm text-paper/65">Checking sign-in…</p>
      </div>
    );
  }

  if (phase === 'auth') {
    return (
      <AuthGate
        onAuth={(t, who) => {
          setToken(t);
          setLogin(who);
          setPhase('authed');
        }}
      />
    );
  }

  return (
    <AdminShell
      token={token!}
      login={login!}
      onSignOut={() => {
        setToken(null);
        setLogin(null);
        setPhase('auth');
      }}
    />
  );
}
