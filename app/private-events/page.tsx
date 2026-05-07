import type { Metadata } from 'next';
import { Rule } from '@/components/ui/Rule';
import { buildMetadata, site } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  routeKey: 'private-events',
  path: '/private-events',
});

const KITS = [
  {
    name: 'Daytime takeover',
    when: '12pm – 4pm · Wed–Sat',
    description:
      'Have the room. Lunch service, full bar, the cocktail lab is yours. Up to 30. Workshops, launches, anything that needs an interesting backdrop and good food.',
    headline: 'Lunch but louder.',
  },
  {
    name: 'Evening buyout',
    when: '5pm onward · any day',
    description:
      'Full restaurant. Custom menu. Optional bubble-infusion demo for the cocktail program. Up to 30 seated, 35 mingling.',
    headline: 'Your dinner. Our room.',
  },
  {
    name: 'Bar-only',
    when: 'After service · 9pm+',
    description:
      'When the kitchen winds down, the bar can host a focused tasting — flights, infusions, a shorter snack menu. Late, intimate, very fun.',
    headline: 'Last call has not earned that name yet.',
  },
];

export default function PrivateEvents() {
  return (
    <article className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16">
      <header className="mb-12">
        <p className="kicker mb-2">Private events</p>
        <h1 className="font-display text-balance text-5xl font-black leading-none tracking-masthead sm:text-7xl">
          Up to 30. <span className="italic text-ember">Whole place.</span>
        </h1>
        <p className="dek mt-4 max-w-2xl text-pretty text-lg">
          Three formats. Custom menus. A vapour-bubble demo if you want one. We do not do generic
          buffets, generic playlists, or generic anything.
        </p>
      </header>

      <Rule variant="thick" />

      <section className="mt-12 grid gap-8 md:grid-cols-3">
        {KITS.map((k) => (
          <article key={k.name} className="border border-paper/15 p-6">
            <p className="kicker mb-2">{k.when}</p>
            <h2 className="font-display text-2xl font-black italic tracking-tight">{k.name}</h2>
            <p className="dek mt-2">{k.headline}</p>
            <p className="mt-4 text-paper/85">{k.description}</p>
          </article>
        ))}
      </section>

      <section className="mt-16 grid gap-8 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <p className="kicker mb-3">Inquiry</p>
          <h2 className="font-display text-3xl font-black italic tracking-masthead sm:text-4xl">
            Tell us when, what, and how loud.
          </h2>
          <p className="dek mt-3 max-w-xl">
            We will reply with options, a sample menu, and a deposit number. Most events are
            confirmed inside three days.
          </p>
        </div>
        <div className="md:col-span-5">
          <a
            href={`mailto:${site.email}?subject=Private%20event%20inquiry&body=Date%3A%20%0AGuest%20count%3A%20%0AFormat%20(daytime%20%2F%20evening%20%2F%20bar)%3A%20%0ANotes%3A%20`}
            className="btn-ember w-full"
          >
            Email an inquiry
          </a>
          <a href={`tel:${site.phone}`} className="btn-paper mt-3 w-full">
            Call {site.phoneDisplay}
          </a>
        </div>
      </section>
    </article>
  );
}
