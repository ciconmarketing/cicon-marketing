/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── CiCon Brand Palette ──────────────────────────────────────────
        // bright-marine: #0071bd  | baltic-blue: #1558a4 | regal-navy: #163172
        // white: #ffffff          | ghost-white: #efedf4
        navy: {
          50:  '#e8edf7',
          100: '#c5d0eb',
          200: '#9fb0da',
          300: '#7890c9',
          400: '#4f6fb5',
          500: '#1a4f9e',
          600: '#1558a4', // baltic-blue
          700: '#163172', // regal-navy — hero, footer, dark sections
          800: '#0e2055', // deeper regal navy
          900: '#07122e', // darkest
        },
        teal: {
          50:  '#e0f0fb',
          100: '#b3d8f4',
          200: '#80bcec',
          300: '#4da0e3',
          400: '#268cda',
          500: '#0079cc',
          600: '#0071bd', // bright-marine — primary CTA
          700: '#1558a4', // baltic-blue — hover
          800: '#163172', // regal-navy — deep hover
        },
        // ghost-white replaces gray-50 for light section backgrounds
        gray: {
          50:  '#efedf4', // ghost-white from palette
        },
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
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
