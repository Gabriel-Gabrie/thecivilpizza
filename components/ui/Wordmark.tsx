import { clsx } from 'clsx';

export function Wordmark({
  className,
  variant = 'horizontal',
}: {
  className?: string;
  variant?: 'horizontal' | 'stacked';
}) {
  if (variant === 'stacked') {
    return (
      <div className={clsx('inline-flex flex-col leading-none', className)}>
        <span className="font-display text-[10px] font-medium uppercase tracking-[0.4em] text-paper/70">
          The
        </span>
        <span className="font-display text-[clamp(2rem,8vw,5rem)] font-black italic leading-[0.85] tracking-masthead">
          Civil
        </span>
      </div>
    );
  }
  return (
    <span className={clsx('inline-flex items-baseline gap-1.5 font-display', className)}>
      <span className="text-[10px] uppercase tracking-[0.32em] text-paper/70">The</span>
      <span className="text-[1.5rem] font-black italic leading-none tracking-masthead">Civil</span>
    </span>
  );
}
