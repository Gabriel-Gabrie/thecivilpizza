// The demo deploys to https://demo.gabrielgabrie.com/thecivil
// Toggle BASE_PATH at build/run time so the same code works locally (no prefix)
// and on the host (with /thecivil prefix). If your host strips the prefix at
// the proxy layer, set BASE_PATH="" and ASSET_PREFIX="https://demo.gabrielgabrie.com/thecivil" instead.

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const assetPrefix = process.env.NEXT_PUBLIC_ASSET_PREFIX ?? basePath;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath,
  assetPrefix,
  trailingSlash: false,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'img1.wsimg.com' },
      { protocol: 'https', hostname: 'web.archive.org' },
    ],
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_SITE_URL:
      process.env.NEXT_PUBLIC_SITE_URL ??
      (process.env.NODE_ENV === 'production'
        ? 'https://demo.gabrielgabrie.com/thecivil'
        : 'http://localhost:3000'),
  },
};

export default nextConfig;
