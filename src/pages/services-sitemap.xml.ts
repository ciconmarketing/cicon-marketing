// /services-sitemap.xml — the /marketing-services/ hub plus every published servicePage.
import type { APIRoute } from 'astro'
import { SITE_URL, renderUrlset, xmlResponse, getSitemapSanityClient } from '../lib/sitemap-xml'

export const prerender = true

const SERVICE_SLUGS_QUERY = `
  *[_type == "servicePage" && status != "draft"]{ "slug": slug.current, _updatedAt }
`

export const GET: APIRoute = async () => {
  const client = await getSitemapSanityClient()
  const services: Array<{ slug: string; _updatedAt: string }> = client
    ? await client.fetch(SERVICE_SLUGS_QUERY).catch(() => [])
    : []

  const entries = [
    { loc: `${SITE_URL}/marketing-services/` },
    ...services.map((s) => ({
      loc: `${SITE_URL}/marketing-services/${s.slug}/`,
      lastmod: s._updatedAt,
    })),
  ]

  return xmlResponse(renderUrlset(entries))
}
