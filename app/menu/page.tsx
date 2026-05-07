import type { Metadata } from 'next';
import { MenuFilters } from '@/components/menu/MenuFilters';
import { Rule } from '@/components/ui/Rule';
import { Stamp } from '@/components/ui/Stamp';
import { buildMetadata, site } from '@/lib/seo';
import menu from '@/content/menu.json';

export const metadata: Metadata = buildMetadata({ routeKey: 'menu', path: '/menu' });

type MenuItem = {
  slug: string;
  name: string;
  dek: string;
  ingredients: string[];
  price: string;
  tags?: string[];
};

export default function MenuPage() {
  return (
    <>
      <article className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16">
        <header className="mb-8 text-center">
          <h1 className="font-display text-balance text-5xl font-black leading-none tracking-masthead sm:text-7xl">
            The <span className="italic text-ember">Menu</span>
          </h1>
          <p className="dek mx-auto mt-4 max-w-xl text-pretty text-lg">
            Pizzas, starters, cocktails, flights. Made from scratch.
          </p>
        </header>

        <section aria-labelledby="pies" className="mt-2">
          <SectionHeader id="pies" label={menu.pizzas.heading} />
          <MenuFilters />
          <div className="md:columns-2 md:gap-12">
            {menu.pizzas.items.map((p) => (
              <PieRow key={p.slug} item={p} />
            ))}
          </div>
        </section>

        <Rule variant="thick" className="my-16" />

        <section aria-labelledby="starters">
          <SectionHeader id="starters" label={menu.starters.heading} />
          <div className="md:columns-2 md:gap-12">
            {menu.starters.items.map((p) => (
              <SimpleRow key={p.slug} item={p} />
            ))}
          </div>
        </section>

        <Rule variant="double" className="my-16" />

        <section aria-labelledby="cocktails">
          <SectionHeader id="cocktails" label={menu.cocktails.heading} />
          <div className="md:columns-2 md:gap-12">
            {menu.cocktails.items.map((p) => (
              <SimpleRow key={p.slug} item={p} highlight={p.slug === 'bubble-infusion'} />
            ))}
          </div>
        </section>

        <Rule variant="thick" className="my-16" />

        <section aria-labelledby="flights">
          <SectionHeader id="flights" label={menu.flights.heading} />
          <div className="md:columns-2 md:gap-12">
            {menu.flights.items.map((p) => (
              <SimpleRow key={p.slug} item={p} />
            ))}
          </div>
        </section>

        <Rule variant="thick" className="my-16" />

        <section aria-labelledby="beerWine">
          <SectionHeader id="beerWine" label={menu.beerWine.heading} />
          <div className="md:columns-2 md:gap-12">
            {menu.beerWine.items.map((p) => (
              <SimpleRow key={p.slug} item={p} />
            ))}
          </div>
        </section>

        <Rule variant="double" className="my-16" />

        <section aria-labelledby="lunch">
          <SectionHeader id="lunch" label={menu.lunch.heading} />
          <p className="dek mb-6 max-w-xl">
            A separate, smaller menu served Wed–Sat from 12pm to 4pm. Soup, sandwiches,
            stuffed bread loaves, and the lunch feature.
          </p>
          <div className="md:columns-2 md:gap-12">
            {menu.lunch.items.map((p) => (
              <SimpleRow key={p.slug} item={p} />
            ))}
          </div>
        </section>
      </article>

      <MenuJsonLd />
    </>
  );
}

function SectionHeader({ id, label }: { id: string; label: string }) {
  return (
    <div className="mb-6 flex items-end justify-between border-b-2 border-paper/85 pb-2">
      <h2
        id={id}
        className="font-display text-3xl font-black italic uppercase tracking-tight sm:text-4xl"
      >
        {label}
      </h2>
      <p className="hidden font-mono text-[10px] uppercase tracking-[0.3em] text-paper/55 sm:block">
        Section · {id.toUpperCase()}
      </p>
    </div>
  );
}

function PieRow({ item }: { item: MenuItem }) {
  const isCause = item.slug === 'the-cause';
  return (
    <div
      id={item.slug}
      data-pie
      data-tags={(item.tags ?? []).join(',')}
      className="mb-8 break-inside-avoid border-b border-paper/15 pb-6"
    >
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-display text-2xl font-black italic leading-tight tracking-tight sm:text-3xl">
          {item.name}
        </h3>
        <span className="font-mono text-sm text-paper/85">{item.price}</span>
      </div>
      <p className="dek mt-1 text-pretty">{item.dek}</p>
      <p className="mt-3 font-mono text-[12px] text-paper/65">
        {item.ingredients.join(' · ')}
      </p>
      {isCause && (
        <Stamp className="mt-3" rotate={-3} tone="ember">
          DINE-IN ONLY · $3 to charity
        </Stamp>
      )}
    </div>
  );
}

function SimpleRow({ item, highlight }: { item: MenuItem; highlight?: boolean }) {
  return (
    <div className="mb-7 break-inside-avoid border-b border-paper/15 pb-5">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-display text-xl font-black italic leading-tight tracking-tight sm:text-2xl">
          {item.name}
          {highlight && (
            <span className="ml-2 align-middle font-mono text-[10px] uppercase tracking-[0.2em] text-vapour">
              · the bubble
            </span>
          )}
        </h3>
        <span className="font-mono text-sm text-paper/85">{item.price}</span>
      </div>
      <p className="dek mt-1 text-pretty">{item.dek}</p>
      <p className="mt-2 font-mono text-[11px] text-paper/65">
        {item.ingredients.join(' · ')}
      </p>
    </div>
  );
}

function MenuJsonLd() {
  const items = [
    ...menu.pizzas.items,
    ...menu.starters.items,
    ...menu.cocktails.items,
    ...menu.flights.items,
  ];
  const json = {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    name: `${site.name} — Menu`,
    url: `${site.url}/menu`,
    hasMenuSection: [
      {
        '@type': 'MenuSection',
        name: 'Pizzas',
        hasMenuItem: menu.pizzas.items.map((i) => ({
          '@type': 'MenuItem',
          name: i.name,
          description: i.dek,
          offers: { '@type': 'Offer', price: i.price.replace('$', ''), priceCurrency: 'CAD' },
        })),
      },
      {
        '@type': 'MenuSection',
        name: 'Starters',
        hasMenuItem: menu.starters.items.map((i) => ({
          '@type': 'MenuItem',
          name: i.name,
          description: i.dek,
        })),
      },
      {
        '@type': 'MenuSection',
        name: 'Cocktails',
        hasMenuItem: menu.cocktails.items.map((i) => ({
          '@type': 'MenuItem',
          name: i.name,
          description: i.dek,
        })),
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
