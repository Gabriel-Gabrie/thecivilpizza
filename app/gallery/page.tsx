import type { Metadata } from 'next';
import Image from 'next/image';
import { Rule } from '@/components/ui/Rule';
import { GallerySection } from '@/components/gallery/GallerySection';
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
  // Bucket items by their category. 'feature-only' items are intentionally
  // excluded from every category bucket — they appear only in the hero row.
  const buckets = SECTIONS.reduce(
    (acc, s) => {
      acc[s.key] = gallery.items.filter((g) => g.category === s.key);
      return acc;
    },
    {} as Record<string, typeof gallery.items>
  );

  const features = gallery.items.filter((g) => g.feature);

  return (
    <article className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16">
      <header className="mb-10 text-center">
        <p className="kicker mb-2">Photographs</p>
        <h1 className="font-display text-balance text-5xl font-black leading-none tracking-masthead sm:text-7xl">
          The <span className="italic text-ember">Gallery</span>
        </h1>
        <p className="dek mx-auto mt-4 max-w-xl text-pretty text-lg">
          The room, the food, the bar, the block.
        </p>
      </header>

      <Rule variant="thick" />

      {/* Hero feature row. Two photos, side-by-side, equal weight. */}
      <section className="mt-10 grid gap-3 sm:grid-cols-2">
        {features.map((g, idx) => (
          <figure
            key={g.id}
            className="relative aspect-[4/3] overflow-hidden border border-paper/15"
          >
            <Image
              src={withBase(g.src)}
              alt={g.alt}
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover"
              priority={idx === 0}
            />
          </figure>
        ))}
      </section>

      {/* Per-category sections — each handles its own mobile collapse. */}
      {SECTIONS.map((section) => {
        const items = buckets[section.key] ?? [];
        if (items.length === 0) return null;
        return (
          <GallerySection
            key={section.key}
            label={section.label}
            items={items}
          />
        );
      })}
    </article>
  );
}
