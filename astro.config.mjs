import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';

// Local content preview (`npm run dev:local-content`): answer every Sanity
// query from a local dataset (snapshot + staged patches in content-staging/)
// instead of the live CMS. Never active on Vercel.
const localContentDataset = !process.env.VERCEL && process.env.LOCAL_CONTENT_DATASET;

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
  vite: localContentDataset
    ? {
        resolve: {
          alias: [{
            find: /^@sanity\/client$/,
            replacement: fileURLToPath(new URL('./scripts/local-content/local-sanity-client.mjs', import.meta.url)),
          }],
        },
      }
    : {},
});
