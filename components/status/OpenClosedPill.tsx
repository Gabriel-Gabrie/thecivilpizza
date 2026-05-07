'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { getStatus, type Status } from '@/lib/hours';

export function OpenClosedPill({ className }: { className?: string }) {
  // Initial state computed at render time (server) using America/Toronto.
  // After mount, refresh every 60s so the pill is always honest.
  const [status, setStatus] = useState<Status>(() => getStatus());
  const pathname = usePathname();
  // From the homepage we can scroll directly to the hours block; from any
  // other route we route over to /visit#hours. Both targets carry the same id.
  const onHome = pathname === '/' || pathname === '';
  const href = onHome ? '#hours' : '/visit#hours';

  useEffect(() => {
    const tick = () => setStatus(getStatus());
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);

  let text = '';
  let dotClass = '';
  let toneClass = '';

  if (status.kind === 'open') {
    text = `Open · last pie ${status.closesAt}`;
    dotClass = 'bg-basil';
    toneClass = 'border-paper/60 hover:border-paper';
  } else if (status.kind === 'closing-soon') {
    text = `Closing soon · ${status.closesAt}`;
    dotClass = 'bg-brass animate-flicker';
    toneClass = 'border-brass/80 hover:border-brass';
  } else {
    text = `Closed · opens ${status.nextDayLabel} ${status.nextOpen}`;
    dotClass = 'bg-ember';
    toneClass = 'border-paper/40 hover:border-paper/80';
  }

  return (
    <Link
      href={href}
      aria-label={`${text}. View full hours.`}
      className={clsx(
        'pill inline-flex items-center gap-2 transition-colors',
        toneClass,
        className
      )}
    >
      <span
        role="status"
        aria-live="polite"
        className="contents"
      >
        <span className={clsx('h-1.5 w-1.5 rounded-full', dotClass)} aria-hidden="true" />
        <span>{text}</span>
      </span>
    </Link>
  );
}
