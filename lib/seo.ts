import type { Metadata } from 'next';
import seo from '@/content/seo.json';
import { absoluteUrl } from './url';

type RouteKey = keyof typeof seo.routes;

export function buildMetadata(opts: {
  routeKey?: RouteKey;
  title?: string;
  description?: string;
  path: string;
  ogImage?: string;
}): Metadata {
  const route = opts.routeKey ? seo.routes[opts.routeKey] : null;
  const title = opts.title ?? route?.title ?? seo.site.name;
  const description = opts.description ?? route?.description ?? seo.site.description;
  const url = absoluteUrl(opts.path);
  const ogImage = opts.ogImage ?? `/opengraph-image?title=${encodeURIComponent(title)}`;
  return {
    title,
    description,
    metadataBase: new URL(seo.site.url),
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      siteName: seo.site.name,
      locale: 'en_CA',
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    robots: { index: true, follow: true },
  };
}

export const site = seo.site;
export const routes = seo.routes;
