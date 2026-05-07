import { clsx } from 'clsx';
import { Seal } from './Seal';

export function Wordmark({
  className,
  variant = 'horizontal',
  size = 'md',
}: {
  className?: string;
  variant?: 'horizontal' | 'mark-only';
  size?: 'sm' | 'md' | 'lg';
}) {
  const markSize = size === 'sm' ? 22 : size === 'lg' ? 40 : 28;
  const textSize =
    size === 'sm' ? 'text-[1.1rem]' : size === 'lg' ? 'text-[2rem]' : 'text-[1.4rem]';

  if (variant === 'mark-only') {
    return <Seal size={markSize} className={className} />;
  }

  return (
    <span className={clsx('inline-flex items-center gap-2.5', className)}>
      <Seal size={markSize} />
      <span className="inline-flex items-baseline gap-1.5 font-display leading-none">
        <span className="text-[10px] uppercase tracking-[0.32em] text-paper/70">The</span>
        <span className={clsx('font-black italic tracking-masthead', textSize)}>Civil</span>
      </span>
    </span>
  );
}
