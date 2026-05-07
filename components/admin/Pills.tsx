'use client';

import { clsx } from 'clsx';
import type { ReactNode } from 'react';

// Multi-select pill picker. The owner clicks a pill to toggle it.
// Friendlier than a comma-separated text field for finite option sets
// (days of the week, predefined menu tags, etc.).

export type PillOption<T extends string | number> = {
  value: T;
  label: string;
};

export function Pills<T extends string | number>({
  label,
  helper,
  options,
  selected,
  onChange,
  dirty,
}: {
  label?: string;
  helper?: ReactNode;
  options: PillOption<T>[];
  selected: T[];
  onChange: (next: T[]) => void;
  dirty?: boolean;
}) {
  const toggle = (v: T) => {
    if (selected.includes(v)) {
      onChange(selected.filter((x) => x !== v));
    } else {
      onChange([...selected, v]);
    }
  };

  return (
    <div className="space-y-2">
      {(label || dirty) && (
        <span className="flex items-baseline justify-between gap-3">
          {label && <span className="text-sm font-medium text-ink">{label}</span>}
          {dirty && (
            <span className="rounded-full bg-brass/20 px-2 py-0.5 text-[11px] font-medium text-ink">
              edited
            </span>
          )}
        </span>
      )}
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isSelected = selected.includes(opt.value);
          return (
            <button
              key={String(opt.value)}
              type="button"
              onClick={() => toggle(opt.value)}
              aria-pressed={isSelected}
              className={clsx(
                'rounded-full border px-3.5 py-1.5 text-sm font-medium transition',
                isSelected
                  ? 'border-ink bg-ink text-paper'
                  : 'border-ink/25 bg-white text-ink/75 hover:border-ink/50 hover:text-ink'
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
      {helper && <span className="block text-xs text-ink/55">{helper}</span>}
    </div>
  );
}
