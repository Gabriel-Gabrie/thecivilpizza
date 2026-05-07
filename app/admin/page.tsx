'use client';

import { useEffect, useState } from 'react';
import { AuthGate } from '@/components/admin/AuthGate';
import { AdminShell } from '@/components/admin/AdminShell';
import { readToken } from '@/lib/admin/storage';
import { verifyToken } from '@/lib/admin/github';
import { HAS_BUNDLED_PAT, readCachedPat } from '@/lib/admin/auth';

// Two flows depending on the build:
//
//   Production (HAS_BUNDLED_PAT === true):
//     AuthGate is a username/password form. On submit it decrypts the
//     bundled AES-GCM token using the password, verifies it, caches the
//     decrypted PAT in sessionStorage so reloads inside the same tab
//     skip the password prompt. Closing the tab forgets the PAT.
//
//   Local dev (no bundled PAT):
//     AuthGate is the legacy "paste a token" form. Token is stored in
//     localStorage and re-verified on reload.

export default function AdminPage() {
  const [phase, setPhase] = useState<'hydrating' | 'auth' | 'authed'>('hydrating');
  const [token, setToken] = useState<string | null>(null);
  const [login, setLogin] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // Production: see if we have a decrypted PAT cached for this tab.
      if (HAS_BUNDLED_PAT) {
        const cached = readCachedPat();
        if (cached) {
          try {
            const { login: who } = await verifyToken(cached);
            if (cancelled) return;
            setToken(cached);
            setLogin(who);
            setPhase('authed');
            return;
          } catch {
            // Cached token is bad — fall through to auth gate.
          }
        }
        if (cancelled) return;
        setPhase('auth');
        return;
      }
      // Dev: stored personal token.
      const stored = readToken();
      if (!stored) {
        if (cancelled) return;
        setPhase('auth');
        return;
      }
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
          <p className="text-sm text-ink/60">Loading…</p>
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
