'use client';

import { useState, useEffect } from 'react';
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

  // Toggle visibility on the data-pie nodes directly. Cheaper than re-mounting
  // the menu list, and keeps the rendered HTML the same for SEO.
  useEffect(() => {
    const all = document.querySelectorAll<HTMLElement>('[data-pie]');
    all.forEach((el) => {
      const tags = (el.dataset.tags ?? '').split(',');
      const visible = active === 'all' || tags.includes(active);
      el.style.display = visible ? '' : 'none';
    });
  }, [active]);

  return (
    <div className="-mx-4 mb-8 flex items-center gap-3 overflow-x-auto px-4 py-1 sm:mx-0 sm:px-0">
      <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/65">
        Filter pies
      </span>
      <div role="tablist" aria-label="Filter pizzas by tag" className="flex gap-2">
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
                : 'border-paper/40 text-paper/85 hover:text-paper'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}
