import type { Metadata } from 'next';
import Image from 'next/image';
import { Rule } from '@/components/ui/Rule';
import { Marquee } from '@/components/motion/Marquee';
import { buildMetadata, site } from '@/lib/seo';
import { withBase } from '@/lib/url';

export const metadata: Metadata = buildMetadata({ routeKey: 'the-cause', path: '/the-cause' });

// A continuously scrolling row of pizza photos so the "rotating monthly"
// promise is felt before it's read. Pulled from the gallery's pies set,
// hand-picked for visual variety so no two adjacent images repeat a vibe.
const ROTATION = [
  { src: '/images/pro-bouge-topdown.jpg',           alt: 'Top-down prosciutto and arugula pizza.' },
  { src: '/images/pro-pepperoni-window.jpg',        alt: 'Pepperoni pizza foreground with another pie behind.' },
  { src: '/images/pro-egg-bbq-pizza.jpg',           alt: 'BBQ pizza with eggs, top-down.' },
  { src: '/images/pro-mushroom-side.jpg',           alt: 'Mushroom pizza side angle.' },
  { src: '/images/pro-donair-topdown.jpg',          alt: 'Donair-style pizza top-down.' },
  { src: '/images/pizza-pepperoni-honey.jpg',       alt: 'Pepperoni pizza drizzled with hot honey.' },
  { src: '/images/pie-pesto-chicken-tomato.jpg',    alt: 'Pesto chicken and tomato pizza, top-down.' },
  { src: '/images/pie-egg-greenonion.jpg',          alt: 'Pizza with eggs and green onion drizzled in sauce.' },
  { src: '/images/pizza-dill-communication.webp',   alt: 'Pizza with dill pickles, sesame seeds, and sauce drizzle.' },
  { src: '/images/pro-chicken-tomato-topdown.jpg',  alt: 'Chicken, tomato, and red onion pizza top-down.' },
];

export default function TheCause() {
  return (
    <article>
      <section className="relative">
        {/* Soft ember glow in the corners — matches the rest of the site,
            keeps a hint of red without painting the whole hero. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            backgroundImage:
              'radial-gradient(ellipse 900px 480px at 0% 0%, rgb(var(--ember) / 0.12), transparent 60%), radial-gradient(ellipse 700px 400px at 100% 100%, rgb(var(--ember) / 0.10), transparent 65%)',
          }}
        />
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-28">
          <p className="kicker mb-3">The Cause</p>
          <h1 className="font-display text-balance text-5xl font-black italic leading-[0.92] tracking-masthead sm:text-7xl">
            One pie. <br />
            A different local cause <span className="text-ember">every month.</span>
          </h1>
          <p className="dek mt-6 max-w-2xl text-pretty text-lg">
            Each month we rotate one pizza on the menu. <span className="text-ember">$3</span> from
            every Cause pie goes to a Kitchener-Waterloo charity that we picked, that we know by
            name, that does work we have actually seen with our own eyes.
          </p>
          <p className="dek mt-3 max-w-2xl text-pretty text-lg">
            Dine-in only.
          </p>
        </div>
      </section>

      {/* Rotating pizza ribbon — visual reminder that the Cause pie isn't fixed. */}
      <section
        aria-label="Examples of past pies"
        className="border-y border-paper/15 bg-ink py-6 sm:py-8"
      >
        <Marquee speed="slow" className="-mx-4 sm:-mx-6">
          {ROTATION.map((p, i) => (
            <figure
              key={i}
              className="relative h-32 w-44 shrink-0 overflow-hidden border border-paper/15 sm:h-44 sm:w-60"
            >
              <Image
                src={withBase(p.src)}
                alt={p.alt}
                fill
                sizes="(max-width: 640px) 176px, 240px"
                className="object-cover"
              />
            </figure>
          ))}
        </Marquee>
        <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.32em] text-paper/55">
          A few past pies — the next one is something else
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
        <p className="kicker mb-3">How it works</p>
        <ol className="space-y-5 font-display text-lg text-paper">
          <li className="flex gap-4">
            <span className="font-display text-3xl font-black italic text-ember leading-none">1.</span>
            <span>Order The Cause pie. Dine-in only.</span>
          </li>
          <li className="flex gap-4">
            <span className="font-display text-3xl font-black italic text-ember leading-none">2.</span>
            <span>$3 from your pie goes straight to this month's chosen KW charity.</span>
          </li>
          <li className="flex gap-4">
            <span className="font-display text-3xl font-black italic text-ember leading-none">3.</span>
            <span>Small per pie, but it adds up — real, local impact every month.</span>
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
          The easiest way to help is to come in and order The Cause.
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
