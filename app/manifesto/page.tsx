import type { Metadata } from 'next';
import { Rule } from '@/components/ui/Rule';
import { Seal } from '@/components/ui/Seal';
import { buildMetadata } from '@/lib/seo';
import { manifesto } from '@/content/manifesto';

export const metadata: Metadata = buildMetadata({ routeKey: 'manifesto', path: '/manifesto' });

export default function Manifesto() {
  return (
    <article className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-20">
      <header>
        <p className="kicker mb-2">{manifesto.byline}</p>
        <h1 className="font-display text-balance text-4xl font-black italic leading-[1] tracking-masthead sm:text-6xl">
          {manifesto.title}
        </h1>
        <p className="dek mt-3 text-base text-paper/85">{manifesto.dek}</p>
      </header>

      <Rule variant="thin" className="my-8" />

      <div className="space-y-5 text-lg leading-relaxed text-paper">
        {manifesto.body.map((b, i) => (
          <p key={i} className="text-pretty">
            {b.text}
          </p>
        ))}
      </div>

      <div className="mt-16 flex justify-center text-paper/50">
        <Seal size={48} />
      </div>
    </article>
  );
}
