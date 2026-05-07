import type { Metadata } from 'next';
import { Rule } from '@/components/ui/Rule';
import { buildMetadata, site } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  routeKey: 'private-events',
  path: '/private-events',
});

const SUBJECT = encodeURIComponent('Private event inquiry');

export default function PrivateEvents() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-20">
      <header>
        <p className="kicker mb-2">Private events</p>
        <h1 className="font-display text-balance text-5xl font-black italic leading-[0.92] tracking-masthead sm:text-7xl">
          Up to 30. <span className="text-ember">Whole place.</span>
        </h1>
      </header>

      <Rule variant="thick" className="my-10" />

      {/* Verbatim copy from thecivil.ca */}
      <div className="space-y-5 font-display text-lg leading-relaxed text-paper">
        <p className="drop-cap">
          Our beautiful, eclectic space can accommodate up to 30 guests.
        </p>
        <p>We offer private daytime bookings, or nighttime event rentals.</p>
        <p>Send us an email and we'll show you how we can make your event one to remember.</p>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <a
          href={`mailto:${site.email}?subject=${SUBJECT}`}
          className="btn-ember"
        >
          Email about an event
        </a>
        <a href={`tel:${site.phone}`} className="btn-paper">
          Call {site.phoneDisplay}
        </a>
      </div>
    </article>
  );
}
