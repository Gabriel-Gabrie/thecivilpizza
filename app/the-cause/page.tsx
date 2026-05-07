import type { Metadata } from 'next';
import { Rule } from '@/components/ui/Rule';
import { buildMetadata, site } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({ routeKey: 'the-cause', path: '/the-cause' });

export default function TheCause() {
  return (
    <article>
      <section className="bg-ember text-paper">
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-28">
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-paper/85">
            The Cause
          </p>
          <h1 className="mt-3 font-display text-balance text-5xl font-black italic leading-[0.92] tracking-masthead sm:text-7xl">
            One pie. <br/>A different local cause every month.
          </h1>
          <p className="dek mt-6 max-w-2xl text-pretty text-lg text-paper/95">
            Each month we rotate one pizza on the menu. $3 from every Cause pie goes to a
            Kitchener-Waterloo charity that we picked, that we know by name, that does work
            we have actually seen with our own eyes.
          </p>
          <p className="mt-3 max-w-2xl font-display italic text-paper/95 text-lg">
            Dine-in only — because we want you to ask us about it.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
        <p className="kicker mb-3">How it works</p>
        <ol className="space-y-5 font-display text-lg text-paper">
          <li className="flex gap-4">
            <span className="font-display text-3xl font-black italic text-ember leading-none">1.</span>
            <span>Order The Cause pie — it lives on the regular menu, dine-in only.</span>
          </li>
          <li className="flex gap-4">
            <span className="font-display text-3xl font-black italic text-ember leading-none">2.</span>
            <span>$3 from your pie goes straight to that month's chosen KW charity.</span>
          </li>
          <li className="flex gap-4">
            <span className="font-display text-3xl font-black italic text-ember leading-none">3.</span>
            <span>The chalkboard above the bar tracks the running total. Come check.</span>
          </li>
        </ol>
        <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.2em] text-paper/70">
          Want to nominate a charity? Email{' '}
          <a href={`mailto:${site.email}`} className="text-paper underline-offset-4 hover:underline">
            {site.email}
          </a>.
        </p>
      </section>

      <Rule variant="thick" />

      <section className="mx-auto max-w-4xl px-4 py-12 text-center sm:py-16">
        <p className="dek text-lg">
          The fastest way to support is to come in, order The Cause, and tell us what you think.
        </p>
        <a
          href={site.reserveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ember mt-6 inline-flex"
        >
          Reserve a table
        </a>
      </section>
    </article>
  );
}
