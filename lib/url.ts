// Wrap any static asset path so it gets the basePath prefix when deployed
// at /thecivil. next/image and next/link handle this automatically — only
// use withBase() for raw URLs you embed yourself (OG metadata, JSON-LD,
// inline <img>, manifest references, etc.).

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export function withBase(path: string): string {
  if (!path.startsWith('/')) return path;
  return `${BASE}${path}`;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  if (path === '/' || path === '') return SITE_URL;
  // SITE_URL already includes the basePath in production
  return `${SITE_URL.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
}
