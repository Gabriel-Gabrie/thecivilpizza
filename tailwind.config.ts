import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.{ts,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: 'rgb(var(--ink) / <alpha-value>)',
        paper: 'rgb(var(--paper) / <alpha-value>)',
        'paper-2': 'rgb(var(--paper-2) / <alpha-value>)',
        ember: 'rgb(var(--ember) / <alpha-value>)',
        brass: 'rgb(var(--brass) / <alpha-value>)',
        char: 'rgb(var(--char) / <alpha-value>)',
        vapour: 'rgb(var(--vapour) / <alpha-value>)',
        basil: 'rgb(var(--basil) / <alpha-value>)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'ui-serif', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      letterSpacing: {
        masthead: '-0.04em',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translate3d(0,0,0)' },
          '100%': { transform: 'translate3d(-50%,0,0)' },
        },
        drift: {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%': { transform: 'translate3d(8px,-12px,0) scale(1.04)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
      },
      animation: {
        marquee: 'marquee 50s linear infinite',
        'marquee-fast': 'marquee 28s linear infinite',
        drift: 'drift 9s ease-in-out infinite',
        flicker: 'flicker 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
