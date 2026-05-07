'use client';

import { usePathname } from 'next/navigation';
import { site } from '@/lib/seo';

// A single discreet tap-to-call button, mobile only. Sits in the
// bottom-right corner above the iOS safe area. Replaced an earlier
// 4-button bar (Reserve/Order/Directions/Call) that ate too much
// screen real estate and pulled focus away from the page content.
export function StickyActionBar() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;

  return (
    <a
      href={`tel:${site.phone}`}
      aria-label={`Call The Civil at ${site.phoneDisplay}`}
      className="fixed bottom-4 right-4 z-40 md:hidden inline-flex h-12 w-12 items-center justify-center rounded-full border border-paper/20 bg-ink/90 text-paper shadow-lg backdrop-blur transition hover:bg-ink active:scale-95"
      style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
    >
      <IconPhone className="h-[18px] w-[18px]" />
    </a>
  );
}

function IconPhone({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 4h4l2 5-2 1a12 12 0 0 0 5 5l1-2 5 2v4a2 2 0 0 1-2 2A18 18 0 0 1 3 6a2 2 0 0 1 2-2z" />
    </svg>
  );
}
