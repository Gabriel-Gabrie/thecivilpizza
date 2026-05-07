import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/url';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    '/',
    '/menu',
    '/cocktails',
    '/the-cause',
    '/visit',
    '/manifesto',
  ];
  const now = new Date();
  return paths.map((p) => ({
    url: absoluteUrl(p),
    lastModified: now,
    changeFrequency: p === '/' || p === '/menu' ? 'weekly' : 'monthly',
    priority: p === '/' ? 1 : p === '/menu' ? 0.9 : 0.6,
  }));
}
