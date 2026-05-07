import Link from 'next/link';
import { OpenClosedPill } from '@/components/status/OpenClosedPill';
import { Wordmark } from '@/components/ui/Wordmark';

const NAV = [
  { href: '/menu', label: 'Menu' },
  { href: '/cocktails', label: 'Cocktails' },
  { href: '/the-cause', label: 'The Cause' },
  { href: '/visit', label: 'Visit' },
  { href: '/manifesto', label: 'Manifesto' },
];

function dayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function Masthead() {
  const issue = dayOfYear();
  return (
    <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-ink/70 bg-ink/95">
      {/* top strip — newspaper masthead */}
      <div className="border-b border-paper/15">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-[10px] font-mono uppercase tracking-[0.2em] text-paper/70 sm:px-6">
          <span className="hidden sm:inline">Vol. 1 · No. {issue} · Kitchener, ON</span>
          <span className="sm:hidden">No. {issue}</span>
          <OpenClosedPill />
        </div>
      </div>

      {/* logo strip */}
      <div className="border-b border-paper/15">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" aria-label="The Civil — home" className="flex items-baseline gap-2">
            <Wordmark />
          </Link>
          <nav aria-label="Primary" className="hidden items-center gap-6 md:flex">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/80 transition hover:text-paper"
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <Link href="/menu" className="md:hidden font-mono text-[11px] uppercase tracking-[0.2em] text-paper/80">
            Menu →
          </Link>
        </div>
      </div>
    </header>
  );
}
