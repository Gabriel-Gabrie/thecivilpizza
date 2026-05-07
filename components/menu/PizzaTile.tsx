import Image from 'next/image';
import Link from 'next/link';
import { Stamp } from '@/components/ui/Stamp';
import { withBase } from '@/lib/url';

type Pie = {
  slug: string;
  name: string;
  dek: string;
  ingredients: string[];
  price: string;
  tags?: string[];
};

// We have real photos for some pies. For the rest we render the same
// gradient/topping SVG art used elsewhere on the site so tiles never look broken.
const PIE_PHOTOS: Record<string, string> = {
  'the-bouge': '/images/pro-bouge-topdown.jpg',
  'civil-disobedience': '/images/pro-egg-bbq-pizza.jpg',
  'bee-spicy': '/images/pizza-pepperoni-honey.jpg',
  'just-all-the-pepperoni': '/images/pro-pepperoni-window.jpg',
  'dill-communication': '/images/pizza-dill-communication.webp',
  'you-seem-like-a-fungi': '/images/pro-mushroom-side.jpg',
  'donair-it-in-public': '/images/pro-donair-topdown.jpg',
  'caprese-in-love': '/images/pro-chicken-tomato-topdown.jpg',
  'pollo-pesto': '/images/pro-chicken-pie-pastel-flight.jpg',
};

const TILE_PALETTES: Array<[string, string]> = [
  ['#C8331E', '#2A1F18'],
  ['#C9A24A', '#0E0D0B'],
  ['#B8D4D2', '#2A1F18'],
  ['#5A7D3F', '#0E0D0B'],
  ['#F2EBDC', '#C8331E'],
  ['#C9A24A', '#C8331E'],
];

export function PizzaTile({ pie, idx }: { pie: Pie; idx: number }) {
  const palette = TILE_PALETTES[idx % TILE_PALETTES.length] ?? ['#C8331E', '#2A1F18'];
  const isCause = pie.slug === 'the-cause';
  const photo = PIE_PHOTOS[pie.slug];
  return (
    <Link
      href={`/menu#${pie.slug}`}
      className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden border border-paper/15"
    >
      <div className="absolute inset-0">
        {photo ? (
          <Image
            src={withBase(photo)}
            alt={pie.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <PieArt palette={palette} seed={pie.slug} />
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10" />
      {isCause && (
        <Stamp className="absolute left-3 top-3" rotate={-7} tone="paper">
          DINE-IN ONLY
        </Stamp>
      )}
      <div className="relative p-3">
        <h3 className="font-display text-[clamp(1.05rem,2.4vw,1.4rem)] font-black italic leading-tight tracking-tight text-paper">
          {pie.name}
        </h3>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-paper/70">
          {pie.price}
        </p>
      </div>
    </Link>
  );
}

function PieArt({ palette, seed }: { palette: [string, string]; seed: string }) {
  const [a, b] = palette;
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const dots = Array.from({ length: 9 }).map((_, i) => ({
    cx: 18 + ((h >> (i * 2)) & 0x3f) % 64,
    cy: 18 + ((h >> (i * 3 + 1)) & 0x3f) % 64,
    r: 2 + (i % 3),
  }));
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
      <defs>
        <radialGradient id={`p-${seed}`} cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor={a} stopOpacity="1" />
          <stop offset="100%" stopColor={b} stopOpacity="1" />
        </radialGradient>
      </defs>
      <rect width="100" height="100" fill={`url(#p-${seed})`} />
      <circle cx="50" cy="50" r="42" fill="none" stroke={a} strokeOpacity="0.3" strokeWidth="3" />
      <circle cx="50" cy="50" r="36" fill={b} fillOpacity="0.35" />
      {dots.map((d, i) => (
        <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill={a} fillOpacity="0.85" />
      ))}
    </svg>
  );
}
