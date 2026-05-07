// The Civil's logomark — a pizza-shaped circle with a triangular slice
// removed from the top (open V), and three diagonal arrows shooting from
// the upper-right rim toward the lower-left rim. Hand-traced from the
// official high-res logo.
//
// Each arrow has slope −1 (45° down-left). Tails sit on the right inner
// arc; tips land on the lower rim. Tails slide clockwise along the rim
// from arrow to arrow, which makes each subsequent arrow shorter than
// the one above it.

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
      {/* Pizza outline minus a V wedge taken out of the top. */}
      <path
        d="M 30 18 L 50 48 L 70 18 A 38 38 0 1 1 30 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Three diagonal arrows at slope −1. Tail x and tip x mirror
          across the slope (Δx = Δy). All tails sit on the right rim. */}
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Top: tail (79, 26)  → tip (26, 79). Length ≈ 75 (longest). */}
        <line x1="79" y1="26" x2="26" y2="79" />
        {/* Middle: tail (85, 36) → tip (36, 85). Length ≈ 69. */}
        <line x1="85" y1="36" x2="36" y2="85" />
        {/* Bottom: tail (88, 50) → tip (50, 88). Length ≈ 54 (shortest). */}
        <line x1="88" y1="50" x2="50" y2="88" />
      </g>

      {/* Filled triangle arrowheads at each tip — back along the line
          ~7 units, splayed ±4 perpendicular. */}
      <g fill="currentColor" stroke="currentColor" strokeWidth="0.6" strokeLinejoin="round">
        <polygon points="26,79 34,77 28,71" />
        <polygon points="36,85 44,83 38,77" />
        <polygon points="50,88 58,86 52,80" />
      </g>
    </svg>
  );
}
