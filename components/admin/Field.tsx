'use client';

import { clsx } from 'clsx';
import type { ReactNode } from 'react';

// Reusable text input. Adapts to label, helper text, and a "dirty" hint
// (rendered when value !== original).

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
    'block w-full rounded-md border bg-ink/60 px-3 py-2 text-paper placeholder:text-paper/40 focus:outline-none',
    monospace && 'font-mono text-sm',
    dirty
      ? 'border-brass focus:border-brass'
      : 'border-paper/25 focus:border-paper/70'
  );
  return (
    <label className="block">
      <span className="flex items-baseline justify-between">
        <span className="kicker">{label}</span>
        {dirty && (
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-brass">
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
        <span className="mt-1.5 block font-mono text-[10px] text-paper/55">
          {helper}
        </span>
      )}
    </label>
  );
}
