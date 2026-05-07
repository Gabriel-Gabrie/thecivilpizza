// The Civil's logomark — circle with three diagonal arrows shooting
// down-right. Hand-traced from the official logo: thick stroke, parallel
// arrows offset across the upper-left of the circle, right-angle
// arrowheads at each lower-right end. Pure SVG, no deps.

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
      {/* outer circle */}
      <circle
        cx="50"
        cy="50"
        r="40"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
      />

      {/* three parallel diagonal arrows */}
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* arrow 1 (top) — line + L-shape arrowhead opening back-and-up */}
        <line x1="22" y1="36" x2="64" y2="78" />
        <polyline points="56,78 64,78 64,70" />

        {/* arrow 2 (middle) */}
        <line x1="32" y1="36" x2="74" y2="78" />
        <polyline points="66,78 74,78 74,70" />

        {/* arrow 3 (bottom) */}
        <line x1="42" y1="36" x2="82" y2="76" />
        <polyline points="74,76 82,76 82,68" />
      </g>
    </svg>
  );
}
