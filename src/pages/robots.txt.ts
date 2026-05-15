/**
 * robots.txt — build-time conditional
 *
 * Vercel sets VERCEL_ENV at build time:
 *   production → permissive (allows all crawlers, references sitemap)
 *   preview    → blocking  (Disallow: /)
 *   undefined  → blocking  (safe default for local dev)
 *
 * NOTE: This site uses output:'static'. Astro generates this file at
 * build time using the env vars available during the Vercel build.
 * Each deployment therefore gets the correct robots.txt baked in:
 * the production build allows indexing; preview builds block it.
 *
 * The static public/robots.txt has been removed so this route owns /robots.txt.
 */
import type { APIRoute } from 'astro'

export const GET: APIRoute = () => {
  const isProduction = import.meta.env.VERCEL_ENV === 'production'

  const body = isProduction
    ? [
        'User-agent: *',
        'Allow: /',
        '',
        'Sitemap: https://cicon.ca/sitemap-index.xml',
      ].join('\n')
    : [
        '# Preview deployment — search engine indexing blocked.',
        '# This file is generated at Vercel build time via VERCEL_ENV.',
        '# Production build will contain the permissive version.',
        'User-agent: *',
        'Disallow: /',
      ].join('\n')

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  })
}
