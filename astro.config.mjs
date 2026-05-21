import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  integrations: [
    tailwind(),
    react(),
    sitemap({
      // Exclude pages that shouldn't be indexed
      filter: (page) =>
        !page.includes('/thank-you') &&
        !page.includes('/privacy-policy') &&
        !page.includes('/terms-and-conditions-sms') &&
        !page.includes('/faq') &&
        !page.includes('/book-a-strategy-call-with-cicon-marketing') &&
        !page.includes('/services/'),
    }),
  ],
  // In Astro 5, 'hybrid' was merged into 'static' (the default).
  // Individual routes opt into SSR with `export const prerender = false`.
  // Adding the Vercel adapter enables SSR for those routes on Vercel.
  output: 'static',
  adapter: vercel(),
  site: 'https://cicon.ca',
});
