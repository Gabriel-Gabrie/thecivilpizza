import type { Metadata } from 'next';
import { Rule } from '@/components/ui/Rule';
import { Seal } from '@/components/ui/Seal';
import { buildMetadata } from '@/lib/seo';
import { manifesto } from '@/content/manifesto';

export const metadata: Metadata = buildMetadata({ routeKey: 'manifesto', path: '/manifesto' });

export default function Manifesto() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-20">
      <header className="text-center">
        <p className="kicker mb-2">{manifesto.byline}</p>
        <h1 className="font-display text-balance text-5xl font-black italic leading-[0.95] tracking-masthead sm:text-7xl">
          {manifesto.title}
        </h1>
        <p className="dek mt-4 text-lg">{manifesto.dek}</p>
      </header>

      <Rule variant="double" className="my-10" />

      <div className="space-y-6 text-lg leading-relaxed text-paper/90">
        {manifesto.body.map((b, i) => {
          if (b.type === 'h') {
            return (
              <h2
                key={i}
                className="mt-8 font-display text-3xl font-black italic tracking-masthead text-paper"
              >
                {b.text}
              </h2>
            );
          }
          // first paragraph gets a drop cap
          if (b.type === 'p' && i === 0) {
            return (
              <p key={i} className="drop-cap font-display text-pretty">
                {b.text}
              </p>
            );
          }
          return (
            <p key={i} className="font-display text-pretty">
              {b.text}
            </p>
          );
        })}
      </div>

      <div className="mt-16 flex justify-center text-paper/70">
        <Seal size={80} />
      </div>
    </article>
  );
}
