'use client';

import { useEffect, useRef, useState } from 'react';
import { clsx } from 'clsx';
import { site } from '@/lib/seo';

export function StickyActionBar() {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      // Hide on scroll down past 120px, show on scroll up.
      if (y > 120 && y > lastY.current + 4) setHidden(true);
      else if (y < lastY.current - 4) setHidden(false);
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={clsx(
        'fixed inset-x-0 bottom-0 z-40 md:hidden transition-transform duration-300',
        hidden ? 'translate-y-full' : 'translate-y-0'
      )}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-auto max-w-md px-3 pb-3 pt-2">
        <div className="grid grid-cols-4 gap-1.5 rounded-full border border-paper/20 bg-ink/95 p-1.5 backdrop-blur shadow-[0_-12px_30px_-15px_rgba(0,0,0,0.8)]">
          <a
            href={site.reserveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-0.5 rounded-full bg-ember py-2 font-mono text-[9px] uppercase tracking-[0.14em] text-paper"
          >
            <IconCalendar className="h-[18px] w-[18px]" />
            Reserve
          </a>
          <a
            href={site.orderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-0.5 rounded-full border border-paper/40 py-2 font-mono text-[9px] uppercase tracking-[0.14em] text-paper"
          >
            <IconBag className="h-[18px] w-[18px]" />
            Order
          </a>
          <a
            href={site.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-0.5 rounded-full border border-paper/40 py-2 font-mono text-[9px] uppercase tracking-[0.14em] text-paper"
          >
            <IconPin className="h-[18px] w-[18px]" />
            Directions
          </a>
          <a
            href={`tel:${site.phone}`}
            className="flex flex-col items-center justify-center gap-0.5 rounded-full border border-paper/40 py-2 font-mono text-[9px] uppercase tracking-[0.14em] text-paper"
          >
            <IconPhone className="h-[18px] w-[18px]" />
            Call
          </a>
        </div>
      </div>
    </div>
  );
}

function IconCalendar({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 3v4M16 3v4" />
    </svg>
  );
}
function IconBag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path d="M5 8h14l-1 12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 8z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}
function IconPin({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}
function IconPhone({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path d="M5 4h4l2 5-2 1a12 12 0 0 0 5 5l1-2 5 2v4a2 2 0 0 1-2 2A18 18 0 0 1 3 6a2 2 0 0 1 2-2z" />
    </svg>
  );
}
