import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Bubble } from '@/components/motion/Bubble';
import { Rule } from '@/components/ui/Rule';
import { Stamp } from '@/components/ui/Stamp';
import { buildMetadata, site } from '@/lib/seo';
import { withBase } from '@/lib/url';
import menu from '@/content/menu.json';

export const metadata: Metadata = buildMetadata({ routeKey: 'cocktails', path: '/cocktails' });

export default function Cocktails() {
  return (
    <article className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16">
      <header className="mb-10 grid gap-8 md:grid-cols-12 md:items-center">
        <div className="md:col-span-7">
          <p className="kicker mb-2">From-scratch bar program</p>
          <h1 className="font-display text-balance text-5xl font-black leading-none tracking-masthead sm:text-7xl">
            Cocktails &amp; <span className="italic text-ember">flights</span>
          </h1>
          <p className="dek mt-4 max-w-xl text-pretty text-lg">
            Syrups, infusions, and bitters made on-site. Three-pour flights. One vapour bubble we
            will pop in front of you.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={site.reserveUrl} target="_blank" rel="noopener noreferrer" className="btn-ember">
              Reserve a stool
            </a>
            <Link href="/menu" className="btn-paper">View the full menu</Link>
          </div>
        </div>
        <div className="relative md:col-span-5">
          <div className="relative aspect-[4/5] overflow-hidden border border-paper/15">
            <Image
              src={withBase('/images/cocktail-negroni.jpg')}
              alt="A negroni with a large ice block, blood orange peel, and segment, on a dark surface."
              fill
              priority
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover"
            />
            <div className="absolute -bottom-6 -left-6 sm:-bottom-10 sm:-left-10">
              <Bubble size={180} className="" />
            </div>
            <Stamp className="absolute right-3 top-3" rotate={-7} tone="paper">
              FROM SCRATCH
            </Stamp>
          </div>
        </div>
      </header>

      <Rule variant="thick" />

      <section className="mt-12 grid gap-12 md:grid-cols-12">
        <div className="md:col-span-7">
          <p className="kicker mb-3">Cocktails</p>
          <h2 className="font-display text-3xl font-black italic">
            1.5oz, $12 each.
          </h2>
          <p className="dek mt-2 text-base">
            Plus the bubble — that one comes with a vapour-filled bubble we will pop in front of
            you. Birthday cocktail $8 if you ask, the staff knows.
          </p>
          <div className="mt-8 columns-1 gap-10 sm:columns-2">
            {menu.cocktails.items.map((c) => (
              <div key={c.slug} className="mb-7 break-inside-avoid border-b border-paper/15 pb-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-xl font-black italic">{c.name}</h3>
                  {c.slug === 'bubble-infusion' && (
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-vapour">
                      bubble
                    </span>
                  )}
                </div>
                <p className="dek mt-1">{c.dek}</p>
                <p className="mt-2 font-mono text-[11px] text-paper/65">
                  {c.ingredients.join(' · ')}
                </p>
              </div>
            ))}
          </div>
        </div>
        <aside className="md:col-span-5">
          <div className="sticky top-32 rounded-md border border-paper/20 p-6">
            <p className="kicker mb-2">Flights · 2oz pours</p>
            <h2 className="font-display text-3xl font-black italic">Three pours, one decision.</h2>
            <p className="dek mt-2 text-base">
              Each flight comes with a tasting card. Compare notes. Argue politely.
            </p>
            <ul className="mt-6 space-y-5">
              {menu.flights.items.map((f) => (
                <li key={f.slug} className="border-t border-paper/15 pt-3">
                  <p className="font-display text-lg font-black italic">{f.name}</p>
                  <p className="font-mono text-[11px] text-paper/65">
                    {f.ingredients.join(' · ')}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>
    </article>
  );
}
