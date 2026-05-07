'use client';

import { useEffect, useRef, useState } from 'react';
import { Field } from './Field';

// Wrapper around <Field> for editing a string[] as a comma-separated
// string. The bug we're fixing: if onChange immediately splits + filters
// + rejoins on every keystroke, typing ", " (comma+space) causes the
// trailing empty token to be dropped, which throws away the space the
// user just typed. Result: you can't ever enter a second item.
//
// Fix: keep the raw text in local state. Sync the parsed array out to
// the parent on every keystroke (so dirty-detection works), but display
// the raw input verbatim so commas and trailing spaces survive.

export function CsvInput({
  label,
  value,
  onChange,
  placeholder,
  helper,
  dirty,
}: {
  label: string;
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  helper?: React.ReactNode;
  dirty?: boolean;
}) {
  const [raw, setRaw] = useState(() => value.join(', '));
  // Re-sync if the array changes externally (e.g., a different item
  // is rendered into the same row, or a publish reset the originals).
  const lastSync = useRef(JSON.stringify(value));
  useEffect(() => {
    const cur = JSON.stringify(value);
    if (cur !== lastSync.current) {
      lastSync.current = cur;
      setRaw(value.join(', '));
    }
  }, [value]);

  return (
    <Field
      label={label}
      value={raw}
      placeholder={placeholder}
      helper={helper}
      dirty={dirty}
      onChange={(v) => {
        setRaw(v);
        const next = v.split(',').map((s) => s.trim()).filter(Boolean);
        onChange(next);
      }}
    />
  );
}
