import type { Metadata } from 'next';
import Link from 'next/link';
import { Rule } from '@/components/ui/Rule';
import { Stamp } from '@/components/ui/Stamp';
import { buildMetadata, site } from '@/lib/seo';
import cause from '@/content/cause.json';

export const metadata: Metadata = buildMetadata({ routeKey: 'the-cause', path: '/the-cause' });

export default function TheCause() {
  return (
    <article>
      <section className="bg-ember text-paper">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 sm:py-24 md:grid-cols-12">
          <div className="md:col-span-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-paper/85">
              The Cause · Vol. {cause.stats.monthsRunning} · {cause.current.month}
            </p>
            <h1 className="mt-3 font-display text-balance text-5xl font-black italic leading-[0.92] tracking-masthead sm:text-7xl">
              One pizza. <br />A different cause every month.
            </h1>
            <p className="dek mt-6 max-w-2xl text-pretty text-lg text-paper/95">
              Each month we rotate one pie on the menu. $3 from every Cause pie goes to a local
              KW charity that we picked, that we know by name. Dine-in only. Ask us about it.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={site.reserveUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border-2 border-paper bg-paper px-6 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-ember">
                Reserve to support
              </a>
              <a href={cause.current.url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border-2 border-paper px-6 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-paper hover:bg-paper hover:text-ember">
                {cause.current.name} →
              </a>
            </div>
          </div>
          <div className="md:col-span-4 flex flex-col justify-end gap-3">
            <Stamp className="self-start" rotate={-7} tone="paper">
              {cause.stats.totalRaised} raised
            </Stamp>
            <p className="font-display italic text-paper/90">
              {cause.stats.pizzasSold.toLocaleString()} Cause pies sold over {cause.stats.monthsRunning} months.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
        <p className="kicker mb-3">This month</p>
        <h2 className="font-display text-4xl font-black italic tracking-masthead sm:text-5xl">
          {cause.current.name}
        </h2>
        <p className="drop-cap mt-6 font-display text-lg leading-relaxed text-paper/90">
          {cause.current.summary} The Cause pie this month is{' '}
          <span className="italic text-ember">{cause.current.pizza}</span>. It is on the menu only
          for the next twenty-something nights, so do not sleep on it.
        </p>
        <p className="mt-4 dek">
          We will post each month's running total on the chalkboard above the bar. Come check.
        </p>
      </section>

      <Rule variant="thick" />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <p className="kicker mb-3">Archive</p>
        <h2 className="font-display text-3xl font-black italic tracking-masthead sm:text-4xl">
          Previously, on The Cause.
        </h2>
        <ul className="mt-8 grid gap-x-12 gap-y-3 md:grid-cols-2">
          {cause.archive.map((a) => (
            <li key={a.month} className="flex items-baseline gap-3 border-b border-paper/15 pb-2">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/55">
                {a.month}
              </span>
              <span className="font-display text-lg italic text-paper">{a.name}</span>
              <span className="ml-auto hidden font-mono text-[11px] text-paper/45 sm:inline">
                {a.pizza}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-pretty font-mono text-[11px] uppercase tracking-[0.2em] text-paper/55">
          Want to nominate a charity? Email <Link href={`mailto:${site.email}`} className="text-paper underline-offset-4 hover:underline">{site.email}</Link>.
        </p>
      </section>
    </article>
  );
}
