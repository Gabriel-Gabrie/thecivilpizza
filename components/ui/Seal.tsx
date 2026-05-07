// The Civil's actual logomark — a circle with three diagonal arrows
// "slicing" through it, top-left to bottom-right. Recreated by hand from
// the official menu graphics; pure SVG, no deps.

import { clsx } from 'clsx';

export function Seal({ className, size = 64 }: { className?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      role="img"
      aria-label="The Civil logomark"
      className={clsx('shrink-0', className)}
    >
      {/* outer circle (the "pizza") */}
      <circle
        cx="50"
        cy="50"
        r="38"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
      />

      {/* three diagonal arrows slicing through */}
      <g
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        {/* top arrow */}
        <line x1="22" y1="32" x2="62" y2="64" />
        <polyline points="56,58 62,64 56,68" />
        {/* middle arrow */}
        <line x1="30" y1="32" x2="70" y2="64" />
        <polyline points="64,58 70,64 64,68" />
        {/* bottom arrow */}
        <line x1="38" y1="32" x2="78" y2="64" />
        <polyline points="72,58 78,64 72,68" />
      </g>
    </svg>
  );
}
