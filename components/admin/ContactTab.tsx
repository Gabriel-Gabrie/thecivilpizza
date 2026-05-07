'use client';

import { Field } from './Field';

// `seo` is the parsed content/seo.json. We only edit fields under .site
// here — the .routes section is per-page metadata that the owner doesn't
// need to touch.

export type SeoSite = {
  name: string;
  tagline: string;
  description: string;
  url: string;
  address: {
    street: string;
    streetFull?: string;
    locality: string;
    region: string;
    country: string;
    postalCode: string;
  };
  geo: { lat: number; lng: number };
  phone: string;
  phoneDisplay: string;
  email: string;
  instagram: string;
  instagramHandle: string;
  reserveUrl: string;
  orderUrl: string;
  mapsUrl: string;
};

export type SeoFile = { site: SeoSite; routes: Record<string, unknown> };

export function ContactTab({
  draft,
  original,
  setDraft,
}: {
  draft: SeoFile;
  original: SeoFile;
  setDraft: (next: SeoFile) => void;
}) {
  const site = draft.site;
  const orig = original.site;

  const set = <K extends keyof SeoSite>(key: K, value: SeoSite[K]) => {
    setDraft({ ...draft, site: { ...site, [key]: value } });
  };
  const setAddr = (key: keyof SeoSite['address'], value: string) => {
    setDraft({
      ...draft,
      site: { ...site, address: { ...site.address, [key]: value } },
    });
  };

  const dirty = (a: unknown, b: unknown) => JSON.stringify(a) !== JSON.stringify(b);

  return (
    <div className="space-y-8">
      <section>
        <h2 className="font-display text-2xl font-black italic">Reach us</h2>
        <p className="dek mt-1 text-base">Phone, email, social, and the addresses for Reserve / Order / Directions.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field
            label="Phone (E.164)"
            value={site.phone}
            onChange={(v) => set('phone', v)}
            placeholder="+15195709992"
            helper={'Used in tel: links. Format: +1XXXXXXXXXX, no spaces.'}
            dirty={dirty(site.phone, orig.phone)}
          />
          <Field
            label="Phone (display)"
            value={site.phoneDisplay}
            onChange={(v) => set('phoneDisplay', v)}
            placeholder="(519) 570-9992"
            helper={'How the number appears on the site.'}
            dirty={dirty(site.phoneDisplay, orig.phoneDisplay)}
          />
          <Field
            label="Email"
            value={site.email}
            onChange={(v) => set('email', v)}
            placeholder="thecivilkitchener@gmail.com"
            type="email"
            dirty={dirty(site.email, orig.email)}
          />
          <Field
            label="Instagram URL"
            value={site.instagram}
            onChange={(v) => set('instagram', v)}
            placeholder="https://www.instagram.com/thecivilkitchener"
            dirty={dirty(site.instagram, orig.instagram)}
          />
          <Field
            label="Instagram handle (display)"
            value={site.instagramHandle}
            onChange={(v) => set('instagramHandle', v)}
            placeholder="@thecivilkitchener"
            dirty={dirty(site.instagramHandle, orig.instagramHandle)}
          />
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl font-black italic">Toast links</h2>
        <p className="dek mt-1 text-base">
          When Toast changes the URLs, paste the new ones here.
        </p>
        <div className="mt-4 grid gap-4">
          <Field
            label="Reserve URL"
            value={site.reserveUrl}
            onChange={(v) => set('reserveUrl', v)}
            placeholder="https://tables.toasttab.com/restaurants/.../findTime"
            monospace
            dirty={dirty(site.reserveUrl, orig.reserveUrl)}
          />
          <Field
            label="Order pickup URL"
            value={site.orderUrl}
            onChange={(v) => set('orderUrl', v)}
            placeholder="https://order.toasttab.com/online/the-civil-..."
            monospace
            dirty={dirty(site.orderUrl, orig.orderUrl)}
          />
          <Field
            label="Directions URL (Google Maps)"
            value={site.mapsUrl}
            onChange={(v) => set('mapsUrl', v)}
            placeholder="https://www.google.com/maps/dir/?api=1&destination=..."
            monospace
            helper={'Used by every "Get directions" CTA on the site.'}
            dirty={dirty(site.mapsUrl, orig.mapsUrl)}
          />
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl font-black italic">Address</h2>
        <p className="dek mt-1 text-base">Used in the footer, /visit, and structured data.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field
            label="Street (display)"
            value={site.address.street}
            onChange={(v) => setAddr('street', v)}
            placeholder="151 Charles St W"
            dirty={dirty(site.address.street, orig.address.street)}
          />
          <Field
            label="Street (full / canonical)"
            value={site.address.streetFull ?? ''}
            onChange={(v) => setAddr('streetFull', v)}
            placeholder="12-151 Charles St W"
            helper={'Suite number included for delivery / postal use.'}
            dirty={dirty(site.address.streetFull, orig.address.streetFull)}
          />
          <Field
            label="Locality"
            value={site.address.locality}
            onChange={(v) => setAddr('locality', v)}
            placeholder="Kitchener"
            dirty={dirty(site.address.locality, orig.address.locality)}
          />
          <Field
            label="Region"
            value={site.address.region}
            onChange={(v) => setAddr('region', v)}
            placeholder="ON"
            dirty={dirty(site.address.region, orig.address.region)}
          />
          <Field
            label="Postal code"
            value={site.address.postalCode}
            onChange={(v) => setAddr('postalCode', v)}
            placeholder="N2G 1H6"
            dirty={dirty(site.address.postalCode, orig.address.postalCode)}
          />
          <Field
            label="Country"
            value={site.address.country}
            onChange={(v) => setAddr('country', v)}
            placeholder="CA"
            dirty={dirty(site.address.country, orig.address.country)}
          />
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl font-black italic">Brand copy</h2>
        <div className="mt-4 grid gap-4">
          <Field
            label="Tagline"
            value={site.tagline}
            onChange={(v) => set('tagline', v)}
            placeholder="Modern cocktails. Adventurous pies. Rotating flights."
            dirty={dirty(site.tagline, orig.tagline)}
          />
          <Field
            label="Site description (used by search engines)"
            value={site.description}
            onChange={(v) => set('description', v)}
            multiline
            rows={3}
            dirty={dirty(site.description, orig.description)}
          />
        </div>
      </section>
    </div>
  );
}
