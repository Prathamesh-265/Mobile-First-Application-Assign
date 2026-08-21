import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // One accent, used consistently, instead of Tailwind's default
        // indigo everywhere - the whole point is restraint, not variety.
        accent: {
          50: '#f5f2ff',
          100: '#ebe4ff',
          200: '#d3c4ff',
          300: '#b299ff',
          400: '#9370ff',
          500: '#7c4dff',
          600: '#6a35f0',
          700: '#5726c9',
        },
        ink: {
          950: '#0a0912',
          900: '#0f0e18',
          800: '#161522',
          700: '#211f30',
          600: '#2c2a3d',
        },
      },
      fontFamily: {
        display: ['var(--font-display)'],
        sans: ['var(--font-sans)'],
      },
      boxShadow: {
        card: '0 1px 0 0 rgba(255,255,255,0.03) inset, 0 12px 24px -16px rgba(0,0,0,0.5)',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease forwards',
        shimmer: 'shimmer 1.6s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
