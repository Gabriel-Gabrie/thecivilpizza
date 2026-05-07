import type { Metadata } from 'next';
import Image from 'next/image';
import { Rule } from '@/components/ui/Rule';
import { buildMetadata } from '@/lib/seo';
import { withBase } from '@/lib/url';
import gallery from '@/content/gallery.json';

export const metadata: Metadata = buildMetadata({
  routeKey: 'gallery',
  path: '/gallery',
});

const SECTIONS: Array<{ key: string; label: string }> = [
  { key: 'interior', label: 'The room' },
  { key: 'pies', label: 'The pies' },
  { key: 'cocktails', label: 'Cocktails' },
  { key: 'flights', label: 'Flights' },
  { key: 'exterior', label: 'The block' },
];

export default function GalleryPage() {
  // Bucket items by their category so each section renders independently.
  const buckets = SECTIONS.reduce(
    (acc, s) => {
      acc[s.key] = gallery.items.filter((g) => g.category === s.key);
      return acc;
    },
    {} as Record<string, typeof gallery.items>
  );

  return (
    <article className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16">
      <header className="mb-10 text-center">
        <p className="kicker mb-2">Photographs</p>
        <h1 className="font-display text-balance text-5xl font-black leading-none tracking-masthead sm:text-7xl">
          The <span className="italic text-ember">Gallery</span>
        </h1>
        <p className="dek mx-auto mt-4 max-w-xl text-pretty text-lg">
          The room, the food, the bar, the block. Tap a photo for a closer look.
        </p>
      </header>

      <Rule variant="thick" />

      {/* Hero feature: the three best shots, big */}
      <section className="mt-10 grid gap-3 sm:grid-cols-3">
        {gallery.items
          .filter((g) => g.feature)
          .slice(0, 3)
          .map((g, idx) => (
            <figure
              key={g.id}
              className={
                idx === 0
                  ? 'relative aspect-[4/5] overflow-hidden border border-paper/15 sm:col-span-2 sm:aspect-[16/10]'
                  : 'relative aspect-[4/5] overflow-hidden border border-paper/15'
              }
            >
              <Image
                src={withBase(g.src)}
                alt={g.alt}
                fill
                sizes={
                  idx === 0
                    ? '(max-width: 640px) 100vw, 66vw'
                    : '(max-width: 640px) 100vw, 33vw'
                }
                className="object-cover"
                priority={idx === 0}
              />
            </figure>
          ))}
      </section>

      {/* Per-category sections */}
      {SECTIONS.map((section) => {
        const items = buckets[section.key] ?? [];
        if (items.length === 0) return null;
        return (
          <section key={section.key} className="mt-16">
            <div className="mb-5 flex items-end justify-between border-b-2 border-paper/85 pb-2">
              <h2 className="font-display text-3xl font-black italic uppercase tracking-tight sm:text-4xl">
                {section.label}
              </h2>
              <p className="hidden font-mono text-[10px] uppercase tracking-[0.3em] text-paper/55 sm:block">
                {items.length} {items.length === 1 ? 'photo' : 'photos'}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((g) => (
                <figure
                  key={g.id}
                  className="relative aspect-[4/5] overflow-hidden border border-paper/15"
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
          </section>
        );
      })}
    </article>
  );
}
