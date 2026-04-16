/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── CiCon Brand Palette (palette 3) ─────────────────────────────────
        // dark-goldenrod: #9d833e  | shadow-grey: #212129
        // alabaster-grey: #e7e7e7 | bright-amber: #ffcf00 (use sparingly)

        // navy → shadow-grey family (dark section backgrounds)
        navy: {
          50:  '#eeeef2',
          100: '#d0d0d8',
          200: '#aeaebb',
          300: '#8b8b9e',
          400: '#6d6d82',
          500: '#4e4e64',
          600: '#38384a',
          700: '#2e2e3a',
          800: '#252530',
          900: '#212129', // shadow-grey — hero, footer, dark sections
        },

        // teal → dark-goldenrod family (primary accent / CTA)
        teal: {
          50:  '#fdf9ec',
          100: '#f7efc8',
          200: '#efe09a',
          300: '#e2c96a',
          400: '#c9a94a',
          500: '#b09040',
          600: '#9d833e', // dark-goldenrod — primary CTA & accents
          700: '#7d6830',
          800: '#5e4e24',
          900: '#3e3418',
          950: '#261f0d',
        },

        // alabaster-grey for borders & light backgrounds
        gray: {
          50:  '#fafaf8',
          100: '#e7e7e7', // alabaster-grey
          200: '#d0d0d0',
          300: '#b4b4b4',
          400: '#969696',
          500: '#787878',
          600: '#5a5a5a',
          700: '#3c3c3c',
          800: '#2a2a2a',
          900: '#1a1a1a',
        },

        // bright-amber — use very sparingly (hero highlight, one badge)
        'amber-brand': '#ffcf00',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backgroundImage: {
        'hero-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out both',
      },
      keyframes: {
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
