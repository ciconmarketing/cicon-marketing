/**
 * robots.txt — request-time, host-based gating
 *
 * IMPORTANT: VERCEL_ENV is NOT a reliable signal here.
 * cicon-marketing.vercel.app is Vercel's *production* deployment, so
 * VERCEL_ENV === 'production' on staging — which would incorrectly open
 * the crawl gate before domain cutover.
 *
 * Instead we check the Host header at request time:
 *   Host === cicon.ca (or www.cicon.ca) → permissive robots.txt
 *   Any other host (staging URL, Vercel preview, local dev) → Disallow: /
 *
 * This is an API route (not prerendered), so `request` is available.
 * After domain cutover nothing needs to change here — it auto-switches.
 */
import type { APIRoute } from 'astro'

export const GET: APIRoute = ({ request }) => {
  const host = request.headers.get('host') ?? ''
  const isLiveDomain = host === 'cicon.ca' || host === 'www.cicon.ca'

  const body = isLiveDomain
    ? [
        'User-agent: *',
        'Allow: /',
        '',
        '# Exclude utility / legal pages from crawl',
        'Disallow: /thank-you/',
        'Disallow: /privacy-policy/',
        'Disallow: /terms-and-conditions-sms/',
        '',
        '# Sitemap',
        'Sitemap: https://cicon.ca/sitemap-index.xml',
      ].join('\n')
    : [
        '# Staging / preview deployment — search engine indexing blocked.',
        '# Only cicon.ca serves the permissive version.',
        'User-agent: *',
        'Disallow: /',
      ].join('\n')

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      // Short cache so staging never gets stale-cached as "open"
      'Cache-Control': 'public, max-age=60',
    },
  })
}
