import Link from 'next/link';
import { Stamp } from '@/components/ui/Stamp';

export default function NotFound() {
  return (
    <article className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <Stamp className="mb-6" rotate={-8}>OFF-MENU</Stamp>
      <h1 className="font-display text-balance text-6xl font-black italic leading-none tracking-masthead sm:text-8xl">
        This pie is <span className="text-ember">off the menu.</span>
      </h1>
      <p className="dek mt-6 max-w-lg text-lg">
        404 — the page you wanted got 86'd. While you are here, allow us to introduce a pizza that
        only exists on this page:
      </p>

      <section className="mt-10 w-full max-w-md border border-paper/20 p-6 text-left">
        <p className="kicker mb-2">Secret pie · No. 16</p>
        <h2 className="font-display text-3xl font-black italic">The Quiet Riot</h2>
        <p className="dek mt-2">
          Every time someone hits a 404 on our site, our chef adds a topping. We are not legally
          allowed to tell you what is on it right now.
        </p>
        <p className="mt-3 font-mono text-[11px] text-paper/65">
          maybe smoked mozzarella · maybe gochujang · maybe just vibes
        </p>
      </section>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-ember">Back to safety</Link>
        <Link href="/menu" className="btn-paper">Browse the menu</Link>
      </div>
    </article>
  );
}
