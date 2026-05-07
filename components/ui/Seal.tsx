// The Civil's logomark — a pizza-shaped circle with a triangular slice
// removed from the top (open V), and three diagonal arrows shooting from
// the upper-right toward the lower-left. Hand-traced from the official
// high-res logo.
//
// Note on the arrows: each arrow's start slides DOWN-RIGHT along the
// upper rim of the circle from the previous arrow's start, and each
// arrow is progressively shorter than the one above it. They are NOT
// just three parallel lines stacked horizontally.

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

      {/* Three diagonal arrows — each starts further down-right along
          the upper rim and is shorter than the one above it. */}
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Top arrow — longest. Starts near the top of the V's right edge. */}
        <line x1="50" y1="26" x2="16" y2="64" />
        {/* Middle arrow — slightly shorter, shifted down-right. */}
        <line x1="62" y1="36" x2="26" y2="72" />
        {/* Bottom arrow — shortest. Starts mid-right, ends near 6 o'clock. */}
        <line x1="72" y1="50" x2="42" y2="80" />
      </g>

      {/* Filled triangle arrowheads at each line's lower-left tip. */}
      <g fill="currentColor" stroke="currentColor" strokeWidth="0.6" strokeLinejoin="round">
        {/* Tip at (16, 64). Direction (-34, 38) → unit (-0.67, 0.75). */}
        <polygon points="16,64 24,62 18,56" />
        {/* Tip at (26, 72). Direction (-36, 36) → unit (-0.71, 0.71). */}
        <polygon points="26,72 34,70 28,64" />
        {/* Tip at (42, 80). Direction (-30, 30) → unit (-0.71, 0.71). */}
        <polygon points="42,80 50,78 44,72" />
      </g>
    </svg>
  );
}
