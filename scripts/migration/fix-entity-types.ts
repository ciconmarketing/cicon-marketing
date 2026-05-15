/**
 * fix-entity-types.ts
 * Patches all 12 blogPost documents: replaces type "SoftwareApplication"
 * with type "Thing" in aboutEntities and mentionsEntities arrays.
 * Names, sameAs URLs, and _keys are untouched.
 */
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: '26ol0sqj',
  dataset: 'cicon-marketing',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
  apiVersion: '2024-01-01',
})

const QUERY = `
  *[_type == "blogPost" && status == "published" && !(_id in path("drafts.**"))] {
    _id,
    title,
    "aboutEntities": aboutEntities[]{ _key, name, type, sameAs },
    "mentionsEntities": mentionsEntities[]{ _key, name, type, sameAs }
  }
`

async function main() {
  const posts = await client.fetch<Array<{
    _id: string
    title: string
    aboutEntities: Array<{ _key: string; name: string; type: string; sameAs?: string }>
    mentionsEntities: Array<{ _key: string; name: string; type: string; sameAs?: string }>
  }>>(QUERY)

  let totalPatched = 0

  for (const post of posts) {
    const setPatch: Record<string, string> = {}

    for (const e of (post.aboutEntities ?? [])) {
      if (e.type === 'SoftwareApplication') {
        setPatch[`aboutEntities[_key == "${e._key}"].type`] = 'Thing'
      }
    }
    for (const e of (post.mentionsEntities ?? [])) {
      if (e.type === 'SoftwareApplication') {
        setPatch[`mentionsEntities[_key == "${e._key}"].type`] = 'Thing'
      }
    }

    if (Object.keys(setPatch).length === 0) {
      console.log(`  ✓ skip  ${post.title} (no SoftwareApplication entities)`)
      continue
    }

    await client.patch(post._id).set(setPatch).commit()
    const count = Object.keys(setPatch).length
    totalPatched += count
    console.log(`  ✓ patch ${post.title}: ${count} entit${count === 1 ? 'y' : 'ies'} → Thing`)
  }

  console.log(`\nDone. ${totalPatched} entity type(s) updated across ${posts.length} posts.`)
}

main().catch(err => {
  console.error('ERROR:', err)
  process.exit(1)
})
