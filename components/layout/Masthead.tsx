'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { OpenClosedPill } from '@/components/status/OpenClosedPill';
import { Wordmark } from '@/components/ui/Wordmark';

const NAV = [
  { href: '/menu', label: 'Menu' },
  { href: '/cocktails', label: 'Cocktails' },
  { href: '/the-cause', label: 'The Cause' },
  { href: '/visit', label: 'Visit' },
  { href: '/manifesto', label: 'Manifesto' },
];

export function Masthead() {
  const pathname = usePathname();
  // The mobile "Menu →" CTA is just a wayfinder — hide it when we're already
  // on /menu. Same for any other top-level page if we add CTAs later.
  const onMenu = pathname === '/menu' || pathname === '/menu/';

  return (
    <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-ink/75 bg-ink/95">
      {/* status strip */}
      <div className="border-b border-paper/15">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-[10px] font-mono uppercase tracking-[0.2em] text-paper/75 sm:px-6">
          <span className="hidden sm:inline">Kitchener, ON · The Tannery</span>
          <span className="sm:hidden">Kitchener, ON</span>
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
                      : 'font-mono text-[11px] uppercase tracking-[0.2em] text-paper/75 transition hover:text-paper'
                  }
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>
          {!onMenu && (
            <Link
              href="/menu"
              className="md:hidden font-mono text-[11px] uppercase tracking-[0.2em] text-paper/85"
            >
              Menu →
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
