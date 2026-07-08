// Shared helpers for the hand-rolled sitemap endpoints under src/pages/*sitemap*.xml.ts
// Replaces @astrojs/sitemap, which only supports a single flat sitemap file.

export const SITE_URL = 'https://cicon.ca'

export type SitemapUrlEntry = {
  loc: string
  lastmod?: string | null
}

export type SitemapIndexEntry = {
  loc: string
  lastmod?: string | null
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

// Normalizes a date-ish value (Date, ISO datetime, or plain date string) to
// an ISO 8601 date/datetime string suitable for <lastmod>. Returns null if unusable.
function toLastmod(value?: string | null): string | null {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date.toISOString()
}

export function renderUrlset(entries: SitemapUrlEntry[]): string {
  const body = entries
    .map(({ loc, lastmod }) => {
      const lm = toLastmod(lastmod)
      return `<url><loc>${escapeXml(loc)}</loc>${lm ? `<lastmod>${lm}</lastmod>` : ''}</url>`
    })
    .join('')
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`
}

export function renderSitemapIndex(entries: SitemapIndexEntry[]): string {
  const body = entries
    .map(({ loc, lastmod }) => {
      const lm = toLastmod(lastmod)
      return `<sitemap><loc>${escapeXml(loc)}</loc>${lm ? `<lastmod>${lm}</lastmod>` : ''}</sitemap>`
    })
    .join('')
  return `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</sitemapindex>`
}

export function xmlResponse(xml: string): Response {
  return new Response(xml, {
    status: 200,
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}

// Same inline-client pattern used by getStaticPaths() in blog/[slug].astro and
// marketing-services/[slug].astro — kept local rather than a shared singleton
// so a missing/invalid project ID degrades to an empty list, not a build crash.
export async function getSitemapSanityClient() {
  const { createClient } = await import('@sanity/client')
  const projectId = (import.meta.env.PUBLIC_SANITY_PROJECT_ID ?? '').trim()
  const dataset = (import.meta.env.PUBLIC_SANITY_DATASET ?? 'production').trim()
  if (!/^[a-z0-9-]+$/.test(projectId)) return null
  return createClient({ projectId, dataset, useCdn: false, apiVersion: '2024-01-01' })
}
