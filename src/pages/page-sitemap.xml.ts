// /page-sitemap.xml — core, non-service, non-blog pages.
import type { APIRoute } from 'astro'
import { SITE_URL, renderUrlset, xmlResponse } from '../lib/sitemap-xml'

export const prerender = true

const CORE_PAGES = [
  '/',
  '/about-us/',
  '/contact-us/',
  '/faq/',
  '/check-google-map-visibility-for-free/',
]

export const GET: APIRoute = async () => {
  const entries = CORE_PAGES.map((path) => ({ loc: `${SITE_URL}${path}` }))
  return xmlResponse(renderUrlset(entries))
}
