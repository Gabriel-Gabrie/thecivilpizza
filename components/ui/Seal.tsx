// The Civil's logomark — a pizza-shaped circle with a sharp triangular
// slice removed from the top (the V apex sits at the exact center of
// the circle), and three diagonal arrows shooting from the upper-right
// rim toward the lower-left rim.
//
// Geometry notes:
//  - Circle: center (50, 50), r = 38
//  - V wedge: opens 12 wide at the rim (44, 12) → (56, 12), apex at (50, 50).
//    Apex angle ≈ 18° — sharp.
//  - Arrow tails sit on the right inner arc, sliding clockwise so each
//    subsequent arrow starts further down. Tips stay anchored on the
//    lower-left rim, which makes the slope shallower than 45° and the
//    arrows progressively shorter top → bottom.

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
      {/* Pizza outline minus a sharp V wedge whose apex is the center. */}
      <path
        d="M 44 12 L 50 50 L 56 12 A 38 38 0 1 1 44 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Three diagonal arrows. Tails on right rim, tips on lower-left rim. */}
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Top arrow — tail (84, 34), tip (26, 79). Length ≈ 73. */}
        <line x1="84" y1="34" x2="26" y2="79" />
        {/* Middle arrow — tail (87, 44), tip (36, 85). Length ≈ 65. */}
        <line x1="87" y1="44" x2="36" y2="85" />
        {/* Bottom arrow — tail (87, 58), tip (50, 88). Length ≈ 48. */}
        <line x1="87" y1="58" x2="50" y2="88" />
      </g>

      {/* Filled triangle arrowheads at each tip — back along the line
          ~7 units, splayed ±4 perpendicular. */}
      <g fill="currentColor" stroke="currentColor" strokeWidth="0.6" strokeLinejoin="round">
        <polygon points="26,79 34,78 30,72" />
        <polygon points="36,85 44,84 38,78" />
        <polygon points="50,88 58,87 52,81" />
      </g>
    </svg>
  );
}
