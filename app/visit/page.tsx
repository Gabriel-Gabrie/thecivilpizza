import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Stamp } from '@/components/ui/Stamp';
import { Rule } from '@/components/ui/Rule';
import { buildMetadata, site } from '@/lib/seo';
import { weekTable } from '@/lib/hours';
import { withBase } from '@/lib/url';
import gallery from '@/content/gallery.json';

export const metadata: Metadata = buildMetadata({ routeKey: 'visit', path: '/visit' });

export default function Visit() {
  const week = weekTable();
  return (
    <article className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16">
      <header className="mb-12">
        <p className="kicker mb-2">Find the door</p>
        <h1 className="font-display text-balance text-5xl font-black leading-none tracking-masthead sm:text-7xl">
          {site.address.street}, <span className="italic text-ember">The Tannery</span>
        </h1>
        <p className="dek mt-4 max-w-2xl text-pretty text-lg">
          We are tucked into the heritage Tannery building on the south side of Charles. Look for the
          ember-lit window. Smell the dough.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-ember">
            Get directions
          </a>
          <a href={`tel:${site.phone}`} className="btn-paper">
            Call {site.phoneDisplay}
          </a>
          <Link href="/private-events" className="btn-paper">
            Private events
          </Link>
        </div>
      </header>

      <Rule variant="thick" />

      <section className="mt-12 grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="kicker mb-3">Hours</p>
          <ul className="space-y-1.5 font-mono">
            {week.map((d) => (
              <li
                key={d.label}
                className={
                  d.isToday
                    ? 'flex items-baseline justify-between gap-3 border-b border-paper/30 pb-1.5 text-paper'
                    : 'flex items-baseline justify-between gap-3 text-paper/65'
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
            Lunch served Wed–Sat, 12pm–4pm. Kitchen closes thirty minutes before the bar does.
          </p>
        </div>

        <div className="md:col-span-7 grid gap-8">
          <div>
            <p className="kicker mb-3">Getting here</p>
            <dl className="grid gap-y-3 sm:grid-cols-[120px_1fr]">
              <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/55">Drive</dt>
              <dd className="text-paper/85">Surface lot at Charles & Water. Two-hour street parking after 6pm.</dd>
              <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/55">Walk</dt>
              <dd className="text-paper/85">Two blocks from Victoria Park. Three from the LRT at Kitchener City Hall.</dd>
              <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/55">Bike</dt>
              <dd className="text-paper/85">Iron Horse Trail spurs onto Charles a block away. Racks at the entrance.</dd>
              <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/55">Transit</dt>
              <dd className="text-paper/85">GRT 7 / 8 stop on Victoria. ION LRT — Kitchener City Hall stop.</dd>
            </dl>
          </div>
          <div>
            <p className="kicker mb-3">Accessibility</p>
            <p className="text-paper/85">
              Step-free entry from the north Tannery courtyard. Accessible washroom on the ground
              floor. Tables can be rearranged for wheelchairs — call ahead and we will hold a spot.
            </p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-paper/45">
              [TODO: owner to confirm specifics for go-live]
            </p>
          </div>
        </div>
      </section>

      <Rule variant="thin" className="my-16" />

      <section>
        <p className="kicker mb-3">Inside the room</p>
        <h2 className="font-display text-3xl font-black italic tracking-masthead sm:text-4xl">
          Brick. Brass. Bubble.
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {gallery.items.map((g, idx) => (
            <figure key={g.id} className="relative aspect-[4/5] overflow-hidden border border-paper/15">
              <Image
                src={withBase(g.src)}
                alt={g.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
      </section>
    </article>
  );
}

