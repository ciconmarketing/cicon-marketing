/**
 * batch-retrofit.ts
 * Phase 2: process posts #2–#12 with concurrency-3 parallelism.
 *
 * Usage:
 *   SANITY_TOKEN=<token> npx tsx scripts/migration/batch-retrofit.ts
 */

import { retrofitPost } from './retrofit-existing-post'
import type { RetrofitResult } from './retrofit-existing-post'

// ── Posts to process (slugs map 1-to-1 with cicon.ca URLs) ───────────────────
// Post #1 (local-seo-agency-toronto-guide-2026) was completed in Phase 1.

const POSTS: { n: number; url: string }[] = [
  { n:  2, url: 'https://cicon.ca/marketing-for-dental-clinics-a-practical-growth-playbook/' },
  { n:  3, url: 'https://cicon.ca/why-local-seo-is-important-and-how-to-do-it-in-2026/' },
  { n:  4, url: 'https://cicon.ca/dental-seo-services-cdcp-renewal-gta/' },
  { n:  5, url: 'https://cicon.ca/google-ads-management-gta-trades-spring-checklist/' },
  { n:  6, url: 'https://cicon.ca/digital-marketing-agency-in-richmond-hill-2026/' },
  { n:  7, url: 'https://cicon.ca/dental-marketin-canada-guide-2026/' },
  { n:  8, url: 'https://cicon.ca/cafe-for-working-near-me/' },
  { n:  9, url: 'https://cicon.ca/social-media-marketing-for-canadian-business-owners-2026-guide/' },
  { n: 10, url: 'https://cicon.ca/seo-optimization-near-me-2026/' },
  { n: 11, url: 'https://cicon.ca/digital-marketing-agency-strategies-2026/' },
  { n: 12, url: 'https://cicon.ca/meta-ads-agency-how-to-use/' },
]

// ── Concurrency limiter (no extra deps) ──────────────────────────────────────

async function runWithConcurrency<T>(
  tasks: Array<() => Promise<T>>,
  limit: number
): Promise<Array<T | Error>> {
  const results: Array<T | Error> = new Array(tasks.length)
  let next = 0

  async function worker() {
    while (next < tasks.length) {
      const i = next++
      try {
        results[i] = await tasks[i]()
      } catch (err) {
        results[i] = err instanceof Error ? err : new Error(String(err))
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, tasks.length) }, worker))
  return results
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function pad(s: string, n: number): string {
  return s.length >= n ? s.slice(0, n) : s + ' '.repeat(n - s.length)
}

function trunc(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1) + '…' : s
}

// ── Main ──────────────────────────────────────────────────────────────────────

if (!process.env.SANITY_TOKEN) {
  console.error('ERROR: SANITY_TOKEN environment variable not set.')
  process.exit(1)
}

console.log(`\n${'═'.repeat(70)}`)
console.log(`PHASE 2 BATCH RETROFIT — ${POSTS.length} posts, concurrency 3`)
console.log(`${'═'.repeat(70)}\n`)

const tasks = POSTS.map(({ n, url }) => async () => {
  console.log(`▶ [#${n}] Starting: ${url.split('/').at(-2)}`)
  const result = await retrofitPost(url)
  console.log(`✓ [#${n}] Done: ${result.title.slice(0, 50)}`)
  return { n, result }
})

const rawResults = await runWithConcurrency(tasks, 3)

// ── Summary table ─────────────────────────────────────────────────────────────

console.log(`\n\n${'═'.repeat(120)}`)
console.log('PHASE 2 SUMMARY TABLE')
console.log(`${'═'.repeat(120)}\n`)

// Header
console.log(
  pad('#', 3) +
  pad('Slug', 48) +
  pad('Words', 7) +
  pad('RT', 4) +
  pad('Blk', 5) +
  pad('FAQ', 5) +
  pad('Stat', 32) +
  pad('About Entities', 52) +
  'Notes'
)
console.log('─'.repeat(220))

for (const raw of rawResults) {
  if (raw instanceof Error) {
    console.log(`❌ ERROR: ${raw.message}`)
    continue
  }

  const { n, result } = raw as { n: number; result: RetrofitResult }

  if (result.error) {
    console.log(
      pad(`${n}`, 3) +
      pad(trunc(result.slug, 46), 48) +
      pad('—', 7) + pad('—', 4) + pad('—', 5) + pad('—', 5) +
      pad('—', 32) + pad('—', 52) +
      `❌ ${result.error}`
    )
    continue
  }

  const statCol = result.statNumber
    ? `${result.statNumber} — ${trunc(result.statContext, 25)}`
    : '⚠️ none'

  const aboutCol = result.aboutEntities.map(e => trunc(e, 16)).join(' · ')

  const notesCol = [
    result.qaWeak ? '⚠️ QA weak' : '',
    result.faqCount === 0 ? '⚠️ 0 FAQs' : '',
    !result.statNumber ? '⚠️ no stat' : '',
    result.statSource ? `src:${trunc(result.statSource, 20)}` : '',
    ...result.notes.filter(n => n.startsWith('GEO') || n.startsWith('WARN')).map(n => trunc(n, 40)),
  ].filter(Boolean).join(' | ')

  console.log(
    pad(`${n}`, 3) +
    pad(trunc(result.slug, 46), 48) +
    pad(String(result.wordCount), 7) +
    pad(`${result.readTime}m`, 4) +
    pad(String(result.bodyBlocks), 5) +
    pad(String(result.faqCount), 5) +
    pad(trunc(statCol, 30), 32) +
    pad(trunc(aboutCol, 50), 52) +
    (notesCol || '✓')
  )
}

console.log(`\n${'═'.repeat(120)}`)
console.log(`All ${POSTS.length} posts processed. Open Sanity Studio to review each at ready-for-review status.`)
console.log(`http://localhost:3334/structure/blogPost\n`)
