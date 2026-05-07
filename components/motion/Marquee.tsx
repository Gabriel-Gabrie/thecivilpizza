import { clsx } from 'clsx';
import type { ReactNode } from 'react';

export function Marquee({
  children,
  speed = 'slow',
  className,
}: {
  children: ReactNode;
  speed?: 'slow' | 'fast';
  className?: string;
}) {
  return (
    <div className={clsx('relative w-full overflow-hidden', className)}>
      <div
        className={clsx(
          'flex w-max items-center gap-12 whitespace-nowrap',
          speed === 'fast' ? 'animate-marquee-fast' : 'animate-marquee'
        )}
      >
        {/* Duplicate the children to make the loop seamless */}
        <div className="flex items-center gap-12">{children}</div>
        <div className="flex items-center gap-12" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
