import type { MetadataRoute } from 'next';
import seo from '@/content/seo.json';

export default function manifest(): MetadataRoute.Manifest {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  const scope = base === '' ? '/' : `${base}/`;
  // We rely on Next.js's app/icon.svg + apple-icon.svg conventions for the
  // primary favicon. The manifest icons below point at the same SVG; PWA
  // hosts that need rasterized PNGs can be addressed in v2 with @vercel/og
  // or a build-time sharp step.
  return {
    name: seo.site.name,
    short_name: seo.site.name,
    description: seo.site.description,
    start_url: scope,
    scope,
    display: 'standalone',
    background_color: '#0e0d0b',
    theme_color: '#0e0d0b',
    icons: [
      { src: `${base}/apple-icon.svg`, sizes: '180x180', type: 'image/svg+xml' },
      { src: `${base}/icon.svg`, sizes: 'any', type: 'image/svg+xml' },
    ],
  };
}
