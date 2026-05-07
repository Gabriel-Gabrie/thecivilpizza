import Image from 'next/image';
import Link from 'next/link';
import { Bubble } from '@/components/motion/Bubble';
import { Marquee } from '@/components/motion/Marquee';
import { Stamp } from '@/components/ui/Stamp';
import { Rule } from '@/components/ui/Rule';
import { weekTable } from '@/lib/hours';
import { site } from '@/lib/seo';
import menu from '@/content/menu.json';
import gallery from '@/content/gallery.json';
import cause from '@/content/cause.json';
import { PizzaTile } from '@/components/menu/PizzaTile';

export default function Home() {
  const week = weekTable();
  // Pies we have real photos for — surfaces the most photo-rich tiles up front.
  const FEATURED_SLUGS = ['civil-disobedience', 'bee-spicy', 'you-seem-like-a-fungi'] as const;
  const featuredPies = FEATURED_SLUGS
    .map((s) => menu.pizzas.items.find((p) => p.slug === s))
    .filter((p): p is (typeof menu)['pizzas']['items'][number] => Boolean(p));

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* photo backdrop, very subtle */}
        <div className="pointer-events-none absolute inset-0 -z-0 opacity-[0.18]" aria-hidden="true">
          <Image
            src="/images/pizza-and-flight.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/60 to-ink" />
        </div>
        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 pt-10 pb-12 sm:px-6 sm:pt-14 sm:pb-20 md:grid-cols-12 md:gap-6 md:pt-20">
          <div className="md:col-span-7">
            <p className="kicker mb-4">An evening edition · Kitchener</p>
            <h1 className="font-display text-balance leading-[0.92] tracking-masthead text-paper">
              <span className="block text-[clamp(2.6rem,9vw,6.5rem)] font-black">
                Modern cocktails.
              </span>
              <span className="block text-[clamp(2.6rem,9vw,6.5rem)] font-black italic text-ember">
                Adventurous pies.
              </span>
              <span className="block text-[clamp(2.6rem,9vw,6.5rem)] font-black">
                Rotating flights.
              </span>
            </h1>
            <p className="dek mt-6 max-w-xl text-pretty text-lg sm:text-xl">
              From-scratch pizzas, theatrical cocktails, and a vapour bubble we will pop in
              front of you. In the Tannery. Open Mon–Sat.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={site.reserveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ember"
              >
                Reserve a table
                <span aria-hidden="true">→</span>
              </a>
              <a
                href={site.orderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-paper"
              >
                Order pickup
              </a>
              <Link href="/menu" className="ml-1 font-mono text-[12px] uppercase tracking-[0.2em] text-paper/80 underline-offset-4 hover:underline">
                Browse the menu →
              </Link>
            </div>
          </div>

          <div className="relative flex md:col-span-5 md:items-center md:justify-center">
            <div className="relative mx-auto h-[280px] w-[280px] sm:h-[360px] sm:w-[360px]">
              <Bubble size={360} className="absolute inset-0" />
              <p className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55">
                tap the bubble
              </p>
            </div>
          </div>
        </div>

        {/* hairline — like a newspaper rule */}
        <Rule variant="thick" />
        <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6">
          <p className="text-center font-mono text-[10px] uppercase tracking-[0.4em] text-paper/55">
            Modern · Adventurous · Rotating · From&nbsp;Scratch · Loud · No&nbsp;TVs
          </p>
        </div>
        <Rule variant="thin" />
      </section>

      {/* PIZZA NAME MARQUEE */}
      <section className="border-y border-paper/10 bg-ink py-3">
        <Marquee>
          {menu.pizzas.items.map((p) => (
            <Link
              key={p.slug}
              href={`/menu#${p.slug}`}
              className="font-display text-[clamp(1.6rem,4vw,2.4rem)] italic text-paper/80 hover:text-ember"
            >
              {p.name}
              <span className="px-6 text-paper/30">★</span>
            </Link>
          ))}
        </Marquee>
      </section>

      {/* TONIGHT'S FEATURE — bubble cocktail */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5 flex flex-col">
            <p className="kicker mb-3">Tonight on the bar</p>
            <h2 className="font-display text-4xl font-black italic leading-[0.95] tracking-masthead sm:text-6xl">
              Bubble Infusion
            </h2>
            <p className="dek mt-4 max-w-md text-lg">
              Blueberry-infused gin, lemon, honey, egg white. Topped with a vapour-filled bubble.
              We pop it for you. The smell is the point.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/cocktails" className="btn-paper">
                See all cocktails
              </Link>
              <Link href="/menu" className="font-mono text-[12px] uppercase tracking-[0.2em] text-paper/80 underline-offset-4 hover:underline">
                Pies →
              </Link>
            </div>
            <figure className="relative mt-8 aspect-[4/5] overflow-hidden border border-paper/15">
              <Image
                src="/images/cocktail-pineapple-rosemary.jpg"
                alt="A gin cocktail with dried pineapple wheel and rosemary, lit by a vintage cut-glass lamp."
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
              <Stamp className="absolute right-3 top-3" rotate={-7} tone="paper">
                $12 · 1.5oz
              </Stamp>
            </figure>
          </div>
          <div className="md:col-span-7">
            <FeaturedPiesGrid pies={featuredPies} />
          </div>
        </div>
      </section>

      {/* THE CAUSE — full-bleed strip */}
      <section className="bg-ember text-paper">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 sm:py-20 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-paper/85">
              The Cause · {cause.current.month}
            </p>
            <h2 className="mt-3 font-display text-4xl font-black italic leading-[0.95] tracking-masthead sm:text-6xl">
              $3 from every Cause pie funds {cause.current.name}.
            </h2>
            <p className="mt-4 max-w-2xl font-display italic text-paper/95 text-lg">
              {cause.current.summary}
            </p>
          </div>
          <div className="md:col-span-5 flex flex-col justify-end gap-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-paper/85">
              This month's Cause pie
            </p>
            <p className="font-display italic text-paper text-xl">{cause.current.pizza}</p>
            <Link
              href="/the-cause"
              className="inline-flex items-center gap-2 self-start rounded-full border-2 border-paper px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.22em] text-paper hover:bg-paper hover:text-ember"
            >
              Read the story →
            </Link>
          </div>
        </div>
      </section>

      {/* GALLERY with stamps */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="mb-10 flex items-baseline justify-between gap-4">
          <h2 className="font-display text-4xl font-black italic tracking-masthead sm:text-5xl">
            The room
          </h2>
          <Link href="/visit" className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/70 hover:text-paper">
            Visit →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {gallery.items.slice(0, 3).map((g, idx) => (
            <figure key={g.id} className="relative aspect-[4/5] overflow-hidden border border-paper/15 bg-paper-2/10 sm:aspect-[3/4]">
              <Image
                src={g.src}
                alt={g.alt}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent" aria-hidden="true" />
              {g.stamp && (
                <Stamp className="absolute right-3 top-3" rotate={idx % 2 === 0 ? -8 : 6}>
                  {g.stamp}
                </Stamp>
              )}
            </figure>
          ))}
        </div>
      </section>

      {/* HOURS + ADDRESS */}
      <section className="border-t border-paper/15 bg-ink/40">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-20 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="kicker mb-3">Hours</p>
            <ul className="space-y-1.5 font-mono text-sm">
              {week.map((d) => (
                <li
                  key={d.label}
                  className={
                    d.isToday
                      ? 'flex items-baseline justify-between gap-3 border-b border-paper/30 pb-1.5 text-paper'
                      : 'flex items-baseline justify-between gap-3 text-paper/65'
                  }
                >
                  <span className="uppercase tracking-[0.2em]">
                    {d.label}{d.isToday ? ' · today' : ''}
                  </span>
                  <span>{d.ranges.join(' · ')}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 dek max-w-sm">
              Lunch served Wed–Sat, 12pm–4pm. Reservations and pickup are routed through Toast.
            </p>
          </div>
          <div className="md:col-span-7">
            <p className="kicker mb-3">Find us</p>
            <h3 className="font-display text-3xl font-black italic leading-tight tracking-masthead sm:text-4xl">
              {site.address.street}<br />
              The Tannery, Downtown Kitchener
            </h3>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={site.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-paper"
              >
                Get directions
              </a>
              <a href={`tel:${site.phone}`} className="btn-paper">
                {site.phoneDisplay}
              </a>
            </div>
            <p className="mt-8 dek max-w-md">
              Two blocks from Victoria Park. Walking distance from the LRT. Parking lot at Charles &amp; Water.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

function FeaturedPiesGrid({ pies }: { pies: typeof import('@/content/menu.json')['pizzas']['items'] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {pies.map((p, idx) => (
        <PizzaTile key={p.slug} pie={p} idx={idx} />
      ))}
    </div>
  );
}

