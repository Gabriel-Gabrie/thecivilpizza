// The Civil's logomark — a pizza-shaped circle with a triangular slice
// removed from the top (creating an open V), and three diagonal arrows
// shooting from the upper-right down through the lower-left of the
// circle. Hand-traced from the official high-res logo.

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
      {/* Pizza outline minus a V wedge taken out of the top.
          Path: from V's left rim point → down to V's bottom point →
          up to V's right rim point → large clockwise arc all the way
          around the circle back to start. */}
      <path
        d="M 30 18 L 50 48 L 70 18 A 38 38 0 1 1 30 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Three parallel arrows shooting from upper-right toward lower-left. */}
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="70" y1="38" x2="38" y2="70" />
        <line x1="62" y1="38" x2="30" y2="70" />
        <line x1="54" y1="38" x2="22" y2="70" />
      </g>

      {/* Filled triangle arrowheads at each line's lower-left tip. */}
      <g fill="currentColor" stroke="currentColor" strokeWidth="0.6" strokeLinejoin="round">
        <polygon points="38,70 44,68 40,64" />
        <polygon points="30,70 36,68 32,64" />
        <polygon points="22,70 28,68 24,64" />
      </g>
    </svg>
  );
}
