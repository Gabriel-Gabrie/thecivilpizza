// The demo deploys to https://demo.gabrielgabrie.com/thecivil as a static
// site. We use Next.js static export so the build produces a self-contained
// `out/` folder of plain HTML/CSS/JS that any static file host can serve.
//
// basePath / assetPrefix make every URL in the output respect the /thecivil
// subpath. Set via .env.production so the autodeploy pipeline doesn't need
// to be aware of these.

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const assetPrefix = process.env.NEXT_PUBLIC_ASSET_PREFIX ?? basePath;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  // Static hosts (nginx, Apache, GH Pages, S3) serve directories cleanly when
  // every page lives at /<route>/index.html — trailingSlash flips routing to
  // that layout. Pair with assets that live under a static prefix.
  trailingSlash: true,
  basePath,
  assetPrefix,
  poweredByHeader: false,
  images: {
    // Static export cannot run the Next image optimizer at request time.
    // We pre-size all images at design time and let the browser handle them.
    unoptimized: true,
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
