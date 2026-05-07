import { clsx } from 'clsx';

export function Rule({
  variant = 'thin',
  className,
}: {
  variant?: 'thin' | 'thick' | 'double';
  className?: string;
}) {
  const map = {
    thin: 'border-t border-paper/20',
    thick: 'border-t-2 border-paper/85',
    double: 'border-t-4 border-double border-paper/85',
  };
  return <hr className={clsx('w-full', map[variant], className)} aria-hidden="true" />;
}
