import type { Metadata } from 'next';
import Image from 'next/image';
import { Rule } from '@/components/ui/Rule';
import { buildMetadata, site } from '@/lib/seo';
import { weekTable } from '@/lib/hours';
import { withBase } from '@/lib/url';

const PRIVATE_EVENTS_EMAIL_SUBJECT = encodeURIComponent('Private event inquiry');

export const metadata: Metadata = buildMetadata({ routeKey: 'visit', path: '/visit' });

export default function Visit() {
  const week = weekTable();

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
          {site.address.street}, <span className="italic text-ember">Kitchener</span>
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
          <figure className="relative aspect-[4/5] overflow-hidden border border-paper/15 sm:aspect-[3/4]">
            <Image
              src={withBase('/images/exterior-lang-tanning.jpg')}
              alt="The Civil's storefront at night — black awning with the cursive logo, bright wall lamps overhead, neon PIZZA OPEN sign in the window, patio tables out front. Lang Tanning Company brick facade above."
              fill
              sizes="(max-width: 768px) 100vw, 58vw"
              className="object-cover"
            />
          </figure>
        </div>
      </section>

      <Rule variant="thick" className="my-16" />

      {/* Private events — verbatim copy from thecivil.ca */}
      <section id="private-events" className="scroll-mt-24 grid gap-10 md:grid-cols-12">
        <div className="md:col-span-7">
          <p className="kicker mb-3">Private events</p>
          <h2 className="font-display text-4xl font-black italic leading-[0.95] tracking-masthead sm:text-5xl">
            Up to 30. <span className="text-ember">Whole place.</span>
          </h2>
          <p className="dek mt-4 max-w-xl text-pretty text-lg">
            Our beautiful, eclectic space can accommodate up to 30 guests. We offer private
            daytime bookings or nighttime event rentals.
          </p>
          <p className="dek mt-3 max-w-xl text-pretty text-lg">
            Send us an email and we'll show you how we can make your event one to remember.
          </p>
        </div>
        <div className="md:col-span-5 md:flex md:items-end">
          <a
            href={`mailto:${site.email}?subject=${PRIVATE_EVENTS_EMAIL_SUBJECT}`}
            className="btn-ember w-full sm:w-auto"
          >
            Email about an event
          </a>
        </div>
      </section>
    </article>
  );
}
