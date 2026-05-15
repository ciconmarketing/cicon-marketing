import { createClient } from '@sanity/client'

const TOKEN = 'skULhuo7iMM2IoZOd2QKs2GGIJDkNqlyF5Y4AvEJKRXdT1O0SdVOS4TKy3kXmEg1M14LM6BrlUun5fSxu'
const c = createClient({ projectId: '26ol0sqj', dataset: 'cicon-marketing', useCdn: false, apiVersion: '2024-01-01', token: TOKEN })

// These 4 posts are Sanity-published but have custom status still at ready-for-review
const SLUGS = [
  'local-seo-agency-toronto-guide-2026',
  'dental-seo-services-cdcp-renewal-gta',
  'google-ads-management-gta-trades-spring-checklist',
  'digital-marketing-agency-in-richmond-hill-2026',
]

const docs = await c.fetch<Array<{_id: string; slug: string}>>(`
  *[_type == "blogPost" && slug.current in $slugs && !(_id in path("drafts.**"))] {
    _id, "slug": slug.current
  }
`, { slugs: SLUGS })

console.log(`Patching ${docs.length} documents...`)

for (const doc of docs) {
  await c.patch(doc._id).set({ status: 'published' }).commit()
  console.log(`  ✅ ${doc.slug}`)
}

const count = await c.fetch<number>(`count(*[_type == "blogPost" && status == "published" && !(_id in path("drafts.**"))])`)
console.log(`\nPublished posts (status + non-draft): ${count}`)
