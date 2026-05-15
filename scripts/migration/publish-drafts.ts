/**
 * publish-drafts.ts
 * Bug #2 fix: Publish 4 blogPost documents that are stuck in draft state.
 *
 * These documents have Sanity's internal status == "published" (our custom field)
 * but were never formally published via Sanity's document actions API, so they
 * still live under the drafts.* path and are invisible to production queries.
 *
 * Usage:
 *   SANITY_TOKEN=<write-token> npx tsx scripts/migration/publish-drafts.ts
 */

import { createClient } from '@sanity/client'

const TOKEN = process.env.SANITY_TOKEN
if (!TOKEN) {
  console.error('ERROR: SANITY_TOKEN not set.')
  process.exit(1)
}

const client = createClient({
  projectId: '26ol0sqj',
  dataset: 'cicon-marketing',
  token: TOKEN,
  useCdn: false,
  apiVersion: '2025-02-19',
})

// Drafts to publish — slug maps to Sanity document _id without "drafts." prefix
const DRAFT_SLUGS = [
  'local-seo-agency-toronto-guide-2026',          // Post #1
  'dental-seo-services-cdcp-renewal-gta',          // Post #4
  'google-ads-management-gta-trades-spring-checklist', // Post #5
  'digital-marketing-agency-in-richmond-hill-2026', // Post #6
]

async function getPublishedIdForSlug(slug: string): Promise<{ draftId: string; publishedId: string } | null> {
  // Check if a draft exists for this slug
  const results = await client.fetch<Array<{ _id: string }>>(`
    *[_type == "blogPost" && slug.current == $slug] { _id }
  `, { slug })

  if (results.length === 0) {
    console.log(`  ⚠️  No document found for slug: ${slug}`)
    return null
  }

  for (const doc of results) {
    if (doc._id.startsWith('drafts.')) {
      const publishedId = doc._id.replace(/^drafts\./, '')
      return { draftId: doc._id, publishedId }
    }
  }

  // Already published (no drafts. prefix)
  console.log(`  ✓ Already published: ${slug}`)
  return null
}

async function publishDraft(draftId: string, publishedId: string): Promise<void> {
  await client.request({
    url: `/data/actions/${client.config().dataset}`,
    method: 'POST',
    body: {
      actions: [{
        actionType: 'sanity.action.document.publish',
        draftId,
        publishedId,
      }],
    },
  })
}

console.log(`\n${'═'.repeat(60)}`)
console.log('PUBLISH STUCK DRAFTS')
console.log(`${'═'.repeat(60)}\n`)

for (const slug of DRAFT_SLUGS) {
  process.stdout.write(`▶ ${slug}\n`)
  try {
    const ids = await getPublishedIdForSlug(slug)
    if (!ids) continue

    const { draftId, publishedId } = ids
    console.log(`  Draft ID:     ${draftId}`)
    console.log(`  Published ID: ${publishedId}`)

    await publishDraft(draftId, publishedId)
    console.log(`  ✅ Published!\n`)
  } catch (err) {
    console.error(`  ❌ Error: ${err instanceof Error ? err.message : String(err)}\n`)
  }
}

// Verify: count published non-draft posts
const count = await client.fetch<number>(`count(*[_type == "blogPost" && !(_id in path("drafts.**"))])`)
console.log(`\n${'═'.repeat(60)}`)
console.log(`Published (non-draft) blogPost documents: ${count}`)
console.log(`${'═'.repeat(60)}\n`)
