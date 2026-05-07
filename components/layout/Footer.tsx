import Link from 'next/link';
import { Seal } from '@/components/ui/Seal';
import { site } from '@/lib/seo';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-paper/15">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Seal size={56} className="mb-4 text-paper" />
            <h2 className="font-display text-3xl italic leading-none tracking-masthead">
              The <span className="text-ember">Civil</span>
            </h2>
            <p className="mt-3 max-w-xs font-display italic text-paper/85">
              Modern cocktails. Adventurous pies. Rotating flights.
            </p>
          </div>
          <div className="md:col-span-4">
            <p className="kicker mb-3">Visit</p>
            <address className="not-italic text-paper">
              <a
                href={site.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-4 hover:text-ember hover:underline"
              >
                {site.address.street}<br />
                {site.address.locality}, {site.address.region} {site.address.postalCode}
              </a><br />
              <a href={`tel:${site.phone}`} className="underline-offset-4 hover:underline">
                {site.phoneDisplay}
              </a><br />
              <a href={`mailto:${site.email}`} className="underline-offset-4 hover:underline">
                {site.email}
              </a>
            </address>
          </div>
          <div className="md:col-span-3">
            <p className="kicker mb-3">Reach us</p>
            <ul className="space-y-2 text-paper">
              <li>
                <a href={site.reserveUrl} target="_blank" rel="noopener noreferrer" className="hover:text-ember">
                  Reserve
                </a>
              </li>
              <li>
                <a href={site.orderUrl} target="_blank" rel="noopener noreferrer" className="hover:text-ember">
                  Order pickup
                </a>
              </li>
              <li>
                <Link href="/visit#private-events" className="hover:text-ember">
                  Private events
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-ember">
                  Gallery
                </Link>
              </li>
              <li>
                <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-ember">
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-paper/15 pt-6 text-[11px] font-mono uppercase tracking-[0.2em] text-paper/65 sm:flex-row sm:items-center sm:justify-between">
          <span>© {year} The Civil — Kitchener</span>
          <span>
            Built by{' '}
            <a
              href="https://gabrielgabrie.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-paper underline-offset-4 hover:text-ember hover:underline"
            >
              Gabriel Gabrie
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
