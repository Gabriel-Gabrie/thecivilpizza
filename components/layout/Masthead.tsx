'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { OpenClosedPill } from '@/components/status/OpenClosedPill';
import { Wordmark } from '@/components/ui/Wordmark';
import { site } from '@/lib/seo';

const NAV = [
  { href: '/menu', label: 'Menu' },
  { href: '/cocktails', label: 'Cocktails' },
  { href: '/the-cause', label: 'The Cause' },
  { href: '/visit', label: 'Visit' },
  { href: '/manifesto', label: 'Manifesto' },
];

export function Masthead() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // Track when we've mounted on the client so the createPortal call is safe.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Close the drawer whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on Escape and lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  // IMPORTANT: do not add backdrop-filter / filter / transform to <header>.
  // Those create a CSS stacking context, which would trap the drawer's z-30
  // beneath the masthead's z-40 children — making the close X unreachable.
  // The drawer is portaled to <body> for the same reason.
  const header = (
    <header className="sticky top-0 z-40 bg-ink">
      {/* status strip */}
      <div className="border-b border-paper/15">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-[10px] font-mono uppercase tracking-[0.2em] text-paper/80 sm:px-6">
          <a
            href={site.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-4 hover:text-paper hover:underline"
            aria-label="Get directions to The Civil"
          >
            <span className="hidden sm:inline">Kitchener, ON · The Tannery</span>
            <span className="sm:hidden">Kitchener, ON</span>
          </a>
          <OpenClosedPill />
        </div>
      </div>

      {/* logo + nav */}
      <div className="border-b border-paper/15">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" aria-label="The Civil — home" className="flex items-baseline gap-2">
            <Wordmark />
          </Link>
          <nav aria-label="Primary" className="hidden items-center gap-6 md:flex">
            {NAV.map((n) => {
              const active = pathname === n.href || pathname === `${n.href}/`;
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  aria-current={active ? 'page' : undefined}
                  className={
                    active
                      ? 'font-mono text-[11px] uppercase tracking-[0.2em] text-paper'
                      : 'font-mono text-[11px] uppercase tracking-[0.2em] text-paper/80 transition hover:text-paper'
                  }
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden relative z-50 inline-flex h-9 w-9 items-center justify-center rounded-full border border-paper/30 text-paper transition hover:border-paper/70"
          >
            {open ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </div>
    </header>
  );

  // Drawer is portaled to <body> so it lives outside the masthead's
  // stacking context. The masthead (z-40) sits cleanly on top of the
  // open drawer (z-30), so the close X remains visible and clickable.
  const drawer =
    mounted &&
    createPortal(
      <div
        id="mobile-nav"
        className={clsx(
          'md:hidden fixed inset-0 z-30 transition',
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        )}
        aria-hidden={!open}
      >
        {/* solid backdrop covers the whole viewport, doubles as a close button */}
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="absolute inset-0 bg-ink"
          tabIndex={open ? 0 : -1}
        />
        {/* nav content — pt-28 clears the masthead height even with iOS safe-area */}
        <nav
          aria-label="Primary"
          className={clsx(
            'relative h-full overflow-y-auto px-4 pb-8 pt-28 origin-top transform transition-transform duration-200',
            open ? 'translate-y-0' : '-translate-y-3'
          )}
        >
          <ul className="space-y-1">
            {NAV.map((n) => {
              const active = pathname === n.href || pathname === `${n.href}/`;
              return (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? 'page' : undefined}
                    className={clsx(
                      'block border-b border-paper/15 py-4 font-display text-3xl font-black italic tracking-masthead',
                      active ? 'text-ember' : 'text-paper hover:text-ember'
                    )}
                  >
                    {n.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>,
      document.body
    );

  return (
    <>
      {header}
      {drawer}
    </>
  );
}

function IconMenu() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
    </svg>
  );
}
function IconClose() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  );
}
