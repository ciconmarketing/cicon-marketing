// /areas-sitemap.xml — the /areas-served/ hub plus published, indexable city
// pages only. Draft/noindex city pages and hub-only areas are deliberately
// excluded (quality gate in src/lib/areas-served.ts; content in Sanity).
import type { APIRoute } from 'astro'
import { SITE_URL, renderUrlset, xmlResponse } from '../lib/sitemap-xml'
import { getServiceAreas } from '../lib/sanity'
import { getPublishedAreas } from '../lib/areas-served'

export const prerender = true

export const GET: APIRoute = async () => {
  const areas = await getServiceAreas()
  const entries = [
    { loc: `${SITE_URL}/areas-served/` },
    ...getPublishedAreas(areas).map((p) => ({
      loc: `${SITE_URL}/areas-served/${p.slug}/`,
      lastmod: p.lastReviewed,
    })),
  ]
  return xmlResponse(renderUrlset(entries))
}
