'use client';

import { clsx } from 'clsx';
import type { ReactNode } from 'react';

// Reusable text input for the admin. Light theme, normal-case labels,
// roomy padding so it's pleasant to edit a long menu in one sitting.

export function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  helper,
  multiline,
  rows = 2,
  monospace,
  dirty,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  helper?: ReactNode;
  multiline?: boolean;
  rows?: number;
  monospace?: boolean;
  dirty?: boolean;
}) {
  const inputClass = clsx(
    'block w-full rounded-md border bg-white px-3.5 py-2.5 text-base text-ink placeholder:text-ink/35 focus:outline-none focus:ring-2 focus:ring-ink/20',
    monospace && 'font-mono text-sm',
    dirty
      ? 'border-brass focus:border-brass'
      : 'border-ink/20 focus:border-ink/50'
  );
  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium text-ink">{label}</span>
        {dirty && (
          <span className="rounded-full bg-brass/20 px-2 py-0.5 text-[11px] font-medium text-ink">
            edited
          </span>
        )}
      </span>
      <span className="mt-1.5 block">
        {multiline ? (
          <textarea
            rows={rows}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={inputClass}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={inputClass}
            spellCheck={false}
          />
        )}
      </span>
      {helper && (
        <span className="mt-1.5 block text-xs text-ink/55">{helper}</span>
      )}
    </label>
  );
}
