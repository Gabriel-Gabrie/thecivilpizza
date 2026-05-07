import type { Metadata, Viewport } from 'next';
import { Fraunces, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Masthead } from '@/components/layout/Masthead';
import { Footer } from '@/components/layout/Footer';
import { StickyActionBar } from '@/components/layout/StickyActionBar';
import { buildMetadata } from '@/lib/seo';
import { site } from '@/lib/seo';
import { openingHoursSpecification } from '@/lib/hours';

const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  axes: ['SOFT', 'opsz'],
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

export const metadata: Metadata = buildMetadata({ routeKey: 'home', path: '/' });

export const viewport: Viewport = {
  themeColor: '#0e0d0b',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const restaurantJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: site.name,
    description: site.description,
    url: site.url,
    telephone: site.phone,
    email: site.email,
    image: `${site.url}/og.svg`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: site.geo.lat,
      longitude: site.geo.lng,
    },
    servesCuisine: ['Pizza', 'Cocktails', 'Italian-inspired'],
    priceRange: '$$',
    acceptsReservations: 'True',
    hasMenu: `${site.url}/menu`,
    sameAs: [site.instagram],
    openingHoursSpecification: openingHoursSpecification(),
  };

  return (
    <html
      lang="en-CA"
      className={`${fraunces.variable} ${inter.variable} ${jetbrains.variable}`}
    >
      <body className="grain min-h-screen flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-ember focus:px-3 focus:py-2 focus:font-mono focus:text-xs focus:uppercase focus:text-paper"
        >
          Skip to content
        </a>
        <Masthead />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <StickyActionBar />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd) }}
        />
      </body>
    </html>
  );
}
