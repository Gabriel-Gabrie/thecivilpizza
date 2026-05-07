'use client';

import Image from 'next/image';
import { useState } from 'react';
import { clsx } from 'clsx';
import { withBase } from '@/lib/url';

type Item = {
  id: string;
  alt: string;
  src: string;
};

// On mobile we only show the first INITIAL_MOBILE photos per category and
// gate the rest behind a "show more" button, so scrolling the gallery isn't
// 50 photos tall by default. Desktop shows everything because the grid
// layout already paginates visually with three columns.
const INITIAL_MOBILE = 4;

export function GallerySection({
  label,
  items,
}: {
  label: string;
  items: Item[];
}) {
  const [expanded, setExpanded] = useState(false);
  const hasOverflow = items.length > INITIAL_MOBILE;

  return (
    <section className="mt-16">
      <div className="mb-5 flex items-end justify-between border-b-2 border-paper/85 pb-2">
        <h2 className="font-display text-3xl font-black italic uppercase tracking-tight sm:text-4xl">
          {label}
        </h2>
        <p className="hidden font-mono text-[10px] uppercase tracking-[0.3em] text-paper/55 sm:block">
          {items.length} {items.length === 1 ? 'photo' : 'photos'}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((g, idx) => (
          <figure
            key={g.id}
            className={clsx(
              'relative aspect-[4/5] overflow-hidden border border-paper/15',
              // Mobile-only collapse: hide indices >= INITIAL_MOBILE until expanded.
              !expanded && idx >= INITIAL_MOBILE && 'hidden sm:block'
            )}
          >
            <Image
              src={withBase(g.src)}
              alt={g.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 hover:scale-[1.03]"
            />
          </figure>
        ))}
      </div>

      {hasOverflow && (
        <div className="mt-5 flex justify-center sm:hidden">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="btn-paper"
          >
            {expanded
              ? 'Show fewer'
              : `Show ${items.length - INITIAL_MOBILE} more`}
          </button>
        </div>
      )}
    </section>
  );
}
