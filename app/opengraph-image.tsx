import { ImageResponse } from 'next/og';
import seo from '@/content/seo.json';

export const runtime = 'edge';
export const alt = 'The Civil — Modern cocktails. Adventurous pies. Rotating flights.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'rgb(14, 13, 11)',
          color: 'rgb(242, 235, 220)',
          padding: 64,
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: 'monospace',
            fontSize: 18,
            letterSpacing: 4,
            textTransform: 'uppercase',
            opacity: 0.8,
          }}
        >
          <span>Vol. 1 · The Civil Times</span>
          <span>Kitchener, ON</span>
        </div>

        <div
          style={{
            height: 4,
            backgroundColor: 'rgb(242, 235, 220)',
            marginTop: 16,
            opacity: 0.85,
          }}
        />

        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            marginTop: 32,
          }}
        >
          <div
            style={{
              fontFamily: 'serif',
              fontSize: 124,
              lineHeight: 0.95,
              fontWeight: 900,
              letterSpacing: -3,
            }}
          >
            Modern cocktails.
          </div>
          <div
            style={{
              fontFamily: 'serif',
              fontSize: 124,
              lineHeight: 0.95,
              fontWeight: 900,
              fontStyle: 'italic',
              color: 'rgb(200, 51, 30)',
              letterSpacing: -3,
            }}
          >
            Adventurous pies.
          </div>
          <div
            style={{
              fontFamily: 'serif',
              fontSize: 124,
              lineHeight: 0.95,
              fontWeight: 900,
              letterSpacing: -3,
            }}
          >
            Rotating flights.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            fontFamily: 'monospace',
            fontSize: 18,
            opacity: 0.85,
          }}
        >
          <span>{seo.site.address.street}, Kitchener · The Tannery</span>
          <span>thecivil.ca</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
