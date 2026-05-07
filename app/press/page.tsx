import type { Metadata } from 'next';
import { Rule } from '@/components/ui/Rule';
import { buildMetadata } from '@/lib/seo';
import press from '@/content/press.json';

export const metadata: Metadata = buildMetadata({ routeKey: 'press', path: '/press' });

export default function Press() {
  return (
    <article className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
      <header className="mb-10 text-center">
        <p className="kicker mb-2">Letters to the editor</p>
        <h1 className="font-display text-balance text-5xl font-black italic leading-[0.95] tracking-masthead sm:text-7xl">
          What people <span className="text-ember">say</span>
        </h1>
        <p className="dek mt-3 text-lg">
          Pulled verbatim from public reviews. We did not write them. They are nice anyway.
        </p>
      </header>

      <Rule variant="thick" />

      <section className="mt-10 grid gap-6 sm:grid-cols-2">
        {press.items.map((p, i) => (
          <figure
            key={i}
            className="break-inside-avoid border border-paper/15 p-6"
          >
            <blockquote className="font-display text-xl italic leading-snug text-paper">
              “{p.quote}”
            </blockquote>
            <figcaption className="mt-4 flex items-center justify-between gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55">
                {p.byline ?? 'a guest'}
              </span>
              <span className="rounded-full border border-paper/30 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/85">
                {p.source}{p.rating ? ` · ${p.rating}` : ''}
              </span>
            </figcaption>
          </figure>
        ))}
      </section>
    </article>
  );
}
