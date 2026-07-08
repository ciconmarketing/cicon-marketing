import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';

export default defineConfig({
  // Sitemaps are hand-rolled as categorized endpoints under src/pages
  // (sitemap.xml, page-sitemap.xml, services-sitemap.xml, post-sitemap.xml)
  // instead of via @astrojs/sitemap, which only supports a single flat file.
  integrations: [
    tailwind(),
    react(),
  ],
  // In Astro 5, 'hybrid' was merged into 'static' (the default).
  // Individual routes opt into SSR with `export const prerender = false`.
  // Adding the Vercel adapter enables SSR for those routes on Vercel.
  output: 'static',
  adapter: vercel(),
  site: 'https://cicon.ca',
});
