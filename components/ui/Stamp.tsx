import { clsx } from 'clsx';
import type { ReactNode } from 'react';

export function Stamp({
  children,
  className,
  rotate = -6,
  tone = 'ember',
}: {
  children: ReactNode;
  className?: string;
  rotate?: number;
  tone?: 'ember' | 'ink' | 'paper';
}) {
  const toneClass =
    tone === 'ember'
      ? 'text-ember bg-paper'
      : tone === 'ink'
      ? 'text-ink bg-paper'
      : 'text-paper bg-ink/80 border-paper';
  return (
    <span
      className={clsx(
        'inline-flex items-center justify-center rounded-full border-2 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.22em]',
        toneClass,
        'shadow-[inset_0_0_0_2px_currentColor]',
        className
      )}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </span>
  );
}
