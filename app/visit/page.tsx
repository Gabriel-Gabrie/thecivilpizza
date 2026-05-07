import type { Metadata } from 'next';
import Image from 'next/image';
import { Stamp } from '@/components/ui/Stamp';
import { Rule } from '@/components/ui/Rule';
import { buildMetadata, site } from '@/lib/seo';
import { weekTable } from '@/lib/hours';
import { withBase } from '@/lib/url';
import gallery from '@/content/gallery.json';

export const metadata: Metadata = buildMetadata({ routeKey: 'visit', path: '/visit' });

export default function Visit() {
  const week = weekTable();
  const featured = gallery.items.slice(0, 3);

  return (
    <article className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16">
      <header className="mb-12">
        <p className="kicker mb-2">Find us</p>
        <a
          href={site.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block font-display text-balance text-5xl font-black leading-none tracking-masthead transition hover:text-ember sm:text-7xl"
          aria-label="Open directions in Google Maps"
        >
          {site.address.street}, <span className="italic text-ember">The Tannery</span>
        </a>
        <p className="dek mt-4 max-w-2xl text-pretty text-lg">
          Two blocks from Victoria Park, walking distance from the LRT. Tap the address for directions.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-ember">
            Get directions
          </a>
          <a href={`tel:${site.phone}`} className="btn-paper">
            Call {site.phoneDisplay}
          </a>
        </div>
      </header>

      <Rule variant="thick" />

      <section id="hours" className="mt-12 scroll-mt-24 grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="kicker mb-3">Hours</p>
          <ul className="space-y-1.5 font-mono">
            {week.map((d) => (
              <li
                key={d.label}
                className={
                  d.isToday
                    ? 'flex items-baseline justify-between gap-3 border-b border-paper/30 pb-1.5 text-paper'
                    : 'flex items-baseline justify-between gap-3 text-paper/75'
                }
              >
                <span className="uppercase tracking-[0.2em] text-sm">
                  {d.label}{d.isToday ? ' · today' : ''}
                </span>
                <span className="text-sm">{d.ranges.join(' · ')}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 dek">
            Lunch served Wed–Sat, 12pm–4pm.
          </p>
        </div>

        <div className="md:col-span-7">
          <div className="grid gap-3 sm:grid-cols-3">
            {featured.map((g, idx) => (
              <figure key={g.id} className="relative aspect-[4/5] overflow-hidden border border-paper/15">
                <Image
                  src={withBase(g.src)}
                  alt={g.alt}
                  fill
                  sizes="(max-width: 768px) 33vw, 25vw"
                  className="object-cover"
                />
                {g.stamp && (
                  <Stamp className="absolute right-3 top-3" rotate={idx % 2 ? 6 : -8}>
                    {g.stamp}
                  </Stamp>
                )}
              </figure>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}
