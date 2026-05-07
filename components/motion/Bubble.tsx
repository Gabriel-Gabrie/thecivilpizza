'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';

// Vapour-bubble showpiece. Borrowed from The Civil's Bubble Infusion
// cocktail. Continuous meandering drift (visible on every device,
// completes a loop in ~3.8s), faint cursor parallax stacked on top
// for desktop, pop-on-tap that emits puff dots and reveals a
// "See cocktails →" CTA so visitors connect the bubble to the cocktail
// program. Respects prefers-reduced-motion.

export function Bubble({
  className,
  size = 220,
  ctaTarget = '/cocktails',
}: {
  className?: string;
  size?: number;
  ctaTarget?: string;
}) {
  const reduced = useReducedMotion();
  const [popped, setPopped] = useState(false);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reduced) return;
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let raf = 0;
    let target = { x: 0, y: 0 };
    const ease = () => {
      setParallax((p) => ({
        x: p.x + (target.x - p.x) * 0.08,
        y: p.y + (target.y - p.y) * 0.08,
      }));
      raf = requestAnimationFrame(ease);
    };
    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      target = { x: ((e.clientX - cx) / cx) * 14, y: ((e.clientY - cy) / cy) * 12 };
    };
    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(ease);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  const handlePop = () => {
    if (popped) return;
    setPopped(true);
    // Hold the popped state ~3.5s so the CTA is readable, then re-form.
    window.setTimeout(() => setPopped(false), 3500);
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        width: size,
        height: size,
        position: 'relative',
        // Cursor parallax (desktop only) is applied to the WRAPPER so the
        // autonomous drift animation on the inner button stacks on top.
        transform: `translate3d(${parallax.x}px, ${parallax.y}px, 0)`,
        transition: 'transform 0.25s ease-out',
        willChange: 'transform',
      }}
    >
      <AnimatePresence initial={false} mode="wait">
        {!popped && (
          <motion.button
            key="bubble"
            type="button"
            aria-label="Pop the vapour bubble"
            onClick={handlePop}
            className="absolute inset-0 cursor-pointer rounded-full"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={
              reduced
                ? { scale: 1, opacity: 1 }
                : {
                    // Autonomous meandering drift — visible on desktop AND mobile
                    // (where there's no cursor parallax). Keyframes form a small
                    // loop around the origin.
                    scale: [1, 1.05, 0.97, 1.03, 1],
                    x: [0, 26, -12, -22, 0],
                    y: [0, -18, 14, 8, 0],
                    opacity: 1,
                  }
            }
            transition={
              reduced
                ? { duration: 0 }
                : {
                    scale: { repeat: Infinity, duration: 3.8, ease: 'easeInOut' },
                    x: { repeat: Infinity, duration: 3.8, ease: 'easeInOut' },
                    y: { repeat: Infinity, duration: 3.8, ease: 'easeInOut' },
                    opacity: { duration: 0.6 },
                  }
            }
            exit={{ scale: 1.6, opacity: 0, transition: { duration: 0.18 } }}
            whileTap={{ scale: 0.96 }}
          >
            <BubbleSvg />
          </motion.button>
        )}
      </AnimatePresence>

      {/* puff dots */}
      <AnimatePresence>
        {popped &&
          [...Array(7)].map((_, i) => {
            const angle = (i / 7) * Math.PI * 2;
            const dist = 70 + Math.random() * 40;
            return (
              <motion.span
                key={`puff-${i}`}
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 h-2 w-2 rounded-full bg-vapour/80"
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{
                  x: Math.cos(angle) * dist,
                  y: Math.sin(angle) * dist,
                  opacity: 0,
                  scale: 0.4,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.4, ease: 'easeOut' }}
              />
            );
          })}
      </AnimatePresence>

      {/* reveal CTA — fades in alongside the puff and persists while popped */}
      <AnimatePresence>
        {popped && (
          <motion.div
            key="bubble-cta"
            className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 flex-col items-center text-center"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.25, duration: 0.35 } }}
            exit={{ opacity: 0, y: -4, transition: { duration: 0.2 } }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/85">
              That's our Bubble Infusion
            </p>
            <Link
              href={ctaTarget}
              className="mt-2 inline-flex items-center gap-2 rounded-full border-2 border-paper bg-paper/10 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.22em] text-paper backdrop-blur transition hover:bg-paper hover:text-ink"
            >
              See cocktails →
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BubbleSvg() {
  return (
    <svg viewBox="0 0 220 220" className="h-full w-full" aria-hidden="true">
      <defs>
        <radialGradient id="bubble-fill" cx="38%" cy="34%" r="68%">
          <stop offset="0%" stopColor="rgb(var(--vapour))" stopOpacity="0.95" />
          <stop offset="40%" stopColor="rgb(var(--vapour))" stopOpacity="0.35" />
          <stop offset="78%" stopColor="rgb(var(--brass))" stopOpacity="0.25" />
          <stop offset="100%" stopColor="rgb(var(--ember))" stopOpacity="0.18" />
        </radialGradient>
        <radialGradient id="bubble-rim" cx="50%" cy="50%" r="50%">
          <stop offset="92%" stopColor="rgb(var(--paper))" stopOpacity="0" />
          <stop offset="100%" stopColor="rgb(var(--paper))" stopOpacity="0.7" />
        </radialGradient>
      </defs>
      <circle cx="110" cy="110" r="100" fill="url(#bubble-fill)" />
      <circle cx="110" cy="110" r="100" fill="url(#bubble-rim)" />
      {/* iridescent highlights */}
      <ellipse cx="78" cy="72" rx="34" ry="18" fill="rgb(var(--paper))" opacity="0.55" />
      <ellipse cx="74" cy="68" rx="14" ry="6" fill="rgb(var(--paper))" opacity="0.95" />
      <ellipse cx="142" cy="148" rx="22" ry="6" fill="rgb(var(--paper))" opacity="0.18" />
    </svg>
  );
}
