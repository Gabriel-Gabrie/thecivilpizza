// Civic seal — circular mark combining a pizza slice, cocktail glass, and banner.
// Used as logomark, footer stamp, and 404 fallback. Pure SVG, no deps.

import { clsx } from 'clsx';

export function Seal({ className, size = 64 }: { className?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      role="img"
      aria-label="The Civil — civic seal"
      className={clsx('shrink-0', className)}
    >
      <defs>
        <path
          id="seal-arc-top"
          d="M 30,100 A 70,70 0 0 1 170,100"
          fill="none"
        />
        <path
          id="seal-arc-bottom"
          d="M 38,108 A 62,62 0 0 0 162,108"
          fill="none"
        />
      </defs>

      {/* outer ring */}
      <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="100" cy="100" r="86" fill="none" stroke="currentColor" strokeWidth="0.6" />
      <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 3" />

      {/* curved type */}
      <text fill="currentColor" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="3">
        <textPath href="#seal-arc-top" startOffset="50%" textAnchor="middle">
          THE CIVIL · KITCHENER
        </textPath>
      </text>
      <text fill="currentColor" fontFamily="var(--font-mono)" fontSize="7" letterSpacing="3">
        <textPath href="#seal-arc-bottom" startOffset="50%" textAnchor="middle">
          FROM SCRATCH · SINCE WE FELT LIKE IT
        </textPath>
      </text>

      {/* center: pizza slice + cocktail glass crossed */}
      <g transform="translate(100,108)">
        {/* slice */}
        <g transform="rotate(-20)">
          <path
            d="M 0,-30 L 26,22 L -26,22 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="0" cy="0" r="3" fill="currentColor" />
          <circle cx="-9" cy="10" r="2.4" fill="currentColor" />
          <circle cx="9" cy="8" r="2.4" fill="currentColor" />
          <circle cx="0" cy="16" r="2" fill="currentColor" />
        </g>
        {/* cocktail glass (V) */}
        <g transform="rotate(20)">
          <path
            d="M -22,-26 L 22,-26 L 0,2 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <line x1="0" y1="2" x2="0" y2="22" stroke="currentColor" strokeWidth="2" />
          <line x1="-10" y1="22" x2="10" y2="22" stroke="currentColor" strokeWidth="2" />
          {/* bubble on rim */}
          <circle cx="14" cy="-22" r="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </g>
      </g>

      {/* tiny stars at the seal edges */}
      <g fill="currentColor">
        <polygon points="100,12 102,18 108,18 103,22 105,28 100,24 95,28 97,22 92,18 98,18" transform="scale(0.55) translate(82, -8)" />
        <polygon points="100,12 102,18 108,18 103,22 105,28 100,24 95,28 97,22 92,18 98,18" transform="scale(0.55) translate(82, 320)" />
      </g>
    </svg>
  );
}
