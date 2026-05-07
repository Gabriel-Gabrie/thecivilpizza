'use client';

import { useState, useMemo, useEffect } from 'react';
import { clsx } from 'clsx';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'veggie', label: 'Veggie' },
  { key: 'meaty', label: 'Meaty' },
  { key: 'spicy', label: 'Spicy' },
  { key: 'sweet', label: 'Sweet' },
] as const;

type FilterKey = (typeof FILTERS)[number]['key'];

export function MenuFilters() {
  const [active, setActive] = useState<FilterKey>('all');

  // Update DOM on filter change — vanilla CSS toggling avoids re-rendering
  // every pizza row in React.
  useEffect(() => {
    const all = document.querySelectorAll<HTMLElement>('[data-pie]');
    all.forEach((el) => {
      const tags = (el.dataset.tags ?? '').split(',');
      const visible = active === 'all' || tags.includes(active);
      el.style.display = visible ? '' : 'none';
    });
  }, [active]);

  return (
    <div
      role="tablist"
      aria-label="Filter pizzas"
      className="sticky top-[88px] z-20 -mx-4 mb-8 flex gap-2 overflow-x-auto border-y border-paper/15 bg-ink/85 px-4 py-2 backdrop-blur sm:mx-0 sm:rounded-full sm:border sm:px-3"
    >
      {FILTERS.map((f) => (
        <button
          key={f.key}
          role="tab"
          aria-selected={active === f.key}
          onClick={() => setActive(f.key)}
          className={clsx(
            'pill shrink-0 transition-colors',
            active === f.key
              ? 'border-ember bg-ember text-paper'
              : 'border-paper/40 text-paper/80 hover:text-paper'
          )}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
