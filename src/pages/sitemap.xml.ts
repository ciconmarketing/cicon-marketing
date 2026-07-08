// /sitemap.xml — master sitemap index. Points to the categorized sub-sitemaps
// (page/services/post) instead of a single flat file.
import type { APIRoute } from 'astro'
import { SITE_URL, renderSitemapIndex, xmlResponse } from '../lib/sitemap-xml'

export const prerender = true

export const GET: APIRoute = async () => {
  const entries = [
    { loc: `${SITE_URL}/page-sitemap.xml` },
    { loc: `${SITE_URL}/services-sitemap.xml` },
    { loc: `${SITE_URL}/post-sitemap.xml` },
  ]
  return xmlResponse(renderSitemapIndex(entries))
}
