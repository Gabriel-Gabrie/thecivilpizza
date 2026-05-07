// The Civil's logomark — a pizza-shaped circle with a triangular slice
// removed from the top (open V), and three diagonal arrows shooting from
// the upper-right rim toward the lower-left. Hand-traced from the
// official high-res logo.
//
// Each arrow's TAIL touches the inner-right arc of the circle. The
// tail positions slide clockwise along that arc (starts get lower as
// you go down through the three arrows). Lengths step shortest →
// longest from bottom to top.

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

      {/* Three diagonal arrows. Tails sit on the right inner arc; tips
          land at progressively lower-and-rightward positions on the
          lower-left arc. Top arrow is the longest. */}
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Top: tail on right arc at y=26 (x≈79 = 50 + √(38² − 24²)). */}
        <line x1="79" y1="26" x2="16" y2="64" />
        {/* Middle: tail at y=36 (x≈85). */}
        <line x1="85" y1="36" x2="26" y2="72" />
        {/* Bottom: tail at y=50 (x=88, exactly on the right edge). */}
        <line x1="88" y1="50" x2="42" y2="80" />
      </g>

      {/* Filled triangle arrowheads at each tip. */}
      <g fill="currentColor" stroke="currentColor" strokeWidth="0.6" strokeLinejoin="round">
        <polygon points="16,64 24,63 20,57" />
        <polygon points="26,72 34,71 30,65" />
        <polygon points="42,80 50,79 46,73" />
      </g>
    </svg>
  );
}
