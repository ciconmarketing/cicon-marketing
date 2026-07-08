// /post-sitemap.xml — the /blog/ index plus every published blogPost.
import type { APIRoute } from 'astro'
import { SITE_URL, renderUrlset, xmlResponse, getSitemapSanityClient } from '../lib/sitemap-xml'

export const prerender = true

const PUBLISHED_POST_SLUGS_QUERY = `
  *[_type == "blogPost" && status == "published" && !(_id in path("drafts.**"))]{
    "slug": slug.current, _updatedAt
  }
`

export const GET: APIRoute = async () => {
  const client = await getSitemapSanityClient()
  const posts: Array<{ slug: string; _updatedAt: string }> = client
    ? await client.fetch(PUBLISHED_POST_SLUGS_QUERY).catch(() => [])
    : []

  const entries = [
    { loc: `${SITE_URL}/blog/` },
    ...posts.map((p) => ({
      loc: `${SITE_URL}/blog/${p.slug}/`,
      lastmod: p._updatedAt,
    })),
  ]

  return xmlResponse(renderUrlset(entries))
}
