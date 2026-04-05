import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(14,165,233,0.3), 0 10px 30px rgba(2,132,199,0.2)',
      },
    },
  },
  plugins: [],
} satisfies Config;
