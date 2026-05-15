#!/usr/bin/env tsx
/**
 * enrich-arvow-post.ts
 *
 * Manual enrichment script for Arvow-imported blogPost documents.
 * Converts raw markdown body to Portable Text and populates schema
 * enrichment fields (entities, quickAnswer, faqs, endCtaStat, etc.).
 *
 * Usage:
 *   npm run enrich-arvow -- --docId <sanityDocumentId>
 *   npm run enrich-arvow -- --slug <post-slug>
 *   npm run enrich-arvow -- --docId <id> --dry-run
 *   npm run enrich-arvow -- --docId <id> --force  # re-enrich already-enriched post
 *
 * Required env vars:
 *   PUBLIC_SANITY_PROJECT_ID
 *   PUBLIC_SANITY_DATASET     (default: production)
 *   SANITY_WRITE_TOKEN
 *
 * Set them in a local .env file or export them before running.
 */

import { createClient } from '@sanity/client'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

// ── Config ───────────────────────────────────────────────────────────────────

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '../../')

// Load .env manually (tsx doesn't auto-load it)
function loadDotEnv() {
  const envPath = path.join(ROOT, '.env')
  if (!fs.existsSync(envPath)) return
  const lines = fs.readFileSync(envPath, 'utf8').split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '')
    if (!process.env[key]) process.env[key] = val
  }
}
loadDotEnv()

// ── Entity Dictionary ─────────────────────────────────────────────────────────

interface EntityEntry {
  term: string
  schemaType: string
  aliases: string[]
  wikipedia: string | null
}

interface EntityDict {
  brands_products: EntityEntry[]
  geographic: EntityEntry[]
  industry_concepts: EntityEntry[]
  dental_vertical: EntityEntry[]
}

const entitiesPath = path.join(ROOT, 'src/lib/entities.json')
const entityDict: EntityDict = JSON.parse(fs.readFileSync(entitiesPath, 'utf8'))
const allEntities: EntityEntry[] = [
  ...entityDict.brands_products,
  ...entityDict.geographic,
  ...entityDict.industry_concepts,
  ...entityDict.dental_vertical,
]

// ── Sanity client ─────────────────────────────────────────────────────────────

function getSanityClient(write = false) {
  const projectId = (process.env.PUBLIC_SANITY_PROJECT_ID ?? '').trim()
  const dataset   = (process.env.PUBLIC_SANITY_DATASET ?? 'production').trim()
  const token     = write ? (process.env.SANITY_WRITE_TOKEN ?? '').trim() : undefined

  if (!projectId) throw new Error('Missing PUBLIC_SANITY_PROJECT_ID')
  if (write && !token) throw new Error('Missing SANITY_WRITE_TOKEN')

  return createClient({ projectId, dataset, token, useCdn: false, apiVersion: '2024-01-01' })
}

// ── Argument parsing ──────────────────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2)
  const get  = (flag: string) => {
    const idx = args.indexOf(flag)
    return idx !== -1 ? args[idx + 1] : undefined
  }
  return {
    docId:  get('--docId'),
    slug:   get('--slug'),
    dryRun: args.includes('--dry-run'),
    force:  args.includes('--force'),
  }
}

// ── Markdown → Portable Text conversion ──────────────────────────────────────

/**
 * Minimal markdown-to-Portable-Text converter.
 *
 * Handles the subset Arvow produces:
 *   - ATX headings (##, ###)
 *   - Bullet lists (-, *)
 *   - Numbered lists
 *   - Blockquotes (> Quick Answer: ...)
 *   - Paragraphs
 *   - Bold (**text**) and italic (*text*)
 *   - Inline code (`code`)
 *
 * For production, replace with @portabletext/markdown if richer conversion
 * is needed. This keeps the script dependency-free.
 */

interface PortableTextSpan {
  _type: 'span'
  _key: string
  text: string
  marks: string[]
}

interface PortableTextBlock {
  _type: 'block'
  _key: string
  style: string
  markDefs: unknown[]
  children: PortableTextSpan[]
  listItem?: string
  level?: number
}

type PTBlock = PortableTextBlock

let _keyCounter = 0
function key(): string {
  return `k${(++_keyCounter).toString(36)}`
}

function parseInline(text: string): PortableTextSpan[] {
  // Tokenize **bold**, *italic*, `code`
  const spans: PortableTextSpan[] = []
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) {
      spans.push({ _type: 'span', _key: key(), text: text.slice(last, m.index), marks: [] })
    }
    if (m[2]) spans.push({ _type: 'span', _key: key(), text: m[2], marks: ['strong'] })
    else if (m[3]) spans.push({ _type: 'span', _key: key(), text: m[3], marks: ['em'] })
    else if (m[4]) spans.push({ _type: 'span', _key: key(), text: m[4], marks: ['code'] })
    last = m.index + m[0].length
  }
  if (last < text.length) {
    spans.push({ _type: 'span', _key: key(), text: text.slice(last), marks: [] })
  }
  return spans.length ? spans : [{ _type: 'span', _key: key(), text, marks: [] }]
}

function makeBlock(style: string, text: string, listItem?: string, level?: number): PTBlock {
  const block: PTBlock = {
    _type: 'block',
    _key: key(),
    style,
    markDefs: [],
    children: parseInline(text),
  }
  if (listItem) block.listItem = listItem
  if (level)    block.level    = level
  return block
}

interface ParseResult {
  /** Portable Text blocks for the `body` field */
  blocks: PTBlock[]
  /** Extracted Quick Answer text (from first `> Quick Answer:` blockquote) */
  quickAnswer: string | null
  /** Extracted FAQ pairs */
  faqs: Array<{ _key: string; question: string; answer: string }>
  /** Best stat candidate for endCtaStat */
  topStat: string | null
}

function parseMarkdown(markdown: string): ParseResult {
  const lines = markdown.split('\n')
  const blocks: PTBlock[] = []
  let quickAnswer: string | null = null
  const faqs: Array<{ _key: string; question: string; answer: string }> = []

  let inFaqSection = false
  let pendingQuestion: string | null = null

  // Stat pattern: numbers like "76%", "$1,200", "3x", "2.5M", "$500+"
  const statRegex = /\b(\d{1,3}(?:,\d{3})*(?:\.\d+)?(?:%|x|\+)?|\$\d[\d,]*(?:\.\d+)?(?:\+|k|M)?)\b/g
  const statCandidates: string[] = []

  let i = 0
  while (i < lines.length) {
    const line = lines[i].trimEnd()

    // Heading detection
    const h2 = line.match(/^## (.+)/)
    const h3 = line.match(/^### (.+)/)
    if (h2) {
      const headingText = h2[1].trim()
      inFaqSection = /faq|frequently asked|questions/i.test(headingText)
      blocks.push(makeBlock('h2', headingText))
      i++; continue
    }
    if (h3) {
      const headingText = h3[1].trim()
      inFaqSection = /faq|frequently asked|questions/i.test(headingText)
      blocks.push(makeBlock('h3', headingText))
      i++; continue
    }

    // Blockquote — capture first "Quick Answer:" blockquote
    if (line.startsWith('>')) {
      const bqText = line.replace(/^>\s*/, '').trim()
      if (!quickAnswer && /^quick answer[:：]/i.test(bqText)) {
        quickAnswer = bqText.replace(/^quick answer[:：]\s*/i, '').trim()
      } else {
        blocks.push(makeBlock('blockquote', bqText))
      }
      i++; continue
    }

    // Bullet list
    const bullet = line.match(/^[-*+]\s+(.+)/)
    if (bullet) {
      // Detect stat in list item
      const matches = bullet[1].match(statRegex)
      if (matches) statCandidates.push(...matches)
      if (inFaqSection && pendingQuestion) {
        // Answer line in FAQ
        const lastFaq = faqs[faqs.length - 1]
        if (lastFaq && !lastFaq.answer) lastFaq.answer = bullet[1].trim()
      } else {
        blocks.push(makeBlock('normal', bullet[1].trim(), 'bullet', 1))
      }
      i++; continue
    }

    // Numbered list
    const numbered = line.match(/^\d+\.\s+(.+)/)
    if (numbered) {
      const matches = numbered[1].match(statRegex)
      if (matches) statCandidates.push(...matches)
      blocks.push(makeBlock('normal', numbered[1].trim(), 'number', 1))
      i++; continue
    }

    // FAQ question: lines starting with "Q:" or bold question in FAQ section
    if (inFaqSection) {
      const qMatch = line.match(/^(?:\*\*)?Q[:：]?\s*(.+?)(?:\*\*)?$/) ||
                     line.match(/^(\d+\.\s+.+\?)\s*$/)
      if (qMatch && qMatch[1]) {
        pendingQuestion = qMatch[1].trim().replace(/^\d+\.\s*/, '')
        faqs.push({ _key: key(), question: pendingQuestion, answer: '' })
        i++; continue
      }
      const aMatch = line.match(/^(?:\*\*)?A[:：]?\s*(.+?)(?:\*\*)?$/)
      if (aMatch && aMatch[1] && faqs.length) {
        const lastFaq = faqs[faqs.length - 1]
        if (!lastFaq.answer) lastFaq.answer = aMatch[1].trim()
        i++; continue
      }
    }

    // Empty line
    if (!line.trim()) {
      i++; continue
    }

    // Regular paragraph
    const matches = line.match(statRegex)
    if (matches) statCandidates.push(...matches)

    if (!inFaqSection) {
      blocks.push(makeBlock('normal', line.trim()))
    }
    i++
  }

  // Pick top stat: prefer % stats, then $ stats, then first match
  const percentStat  = statCandidates.find(s => s.includes('%'))
  const dollarStat   = statCandidates.find(s => s.startsWith('$'))
  const topStat      = percentStat ?? dollarStat ?? statCandidates[0] ?? null

  // Filter out FAQ items with empty answers
  const validFaqs = faqs.filter(f => f.question && f.answer)

  return { blocks, quickAnswer, faqs: validFaqs, topStat }
}

// ── Entity matching ───────────────────────────────────────────────────────────

interface EntityMatch {
  term: string
  schemaType: string
  sameAs: string | null
  count: number
}

function matchEntities(text: string): EntityMatch[] {
  const counts = new Map<string, EntityMatch>()
  const normalizedText = text.toLowerCase()

  for (const entry of allEntities) {
    const searchTerms = [entry.term, ...entry.aliases]
    let totalCount = 0
    for (const t of searchTerms) {
      let idx = 0
      const lower = t.toLowerCase()
      while ((idx = normalizedText.indexOf(lower, idx)) !== -1) {
        totalCount++
        idx += lower.length
      }
    }
    if (totalCount > 0) {
      counts.set(entry.term, {
        term: entry.term,
        schemaType: entry.schemaType,
        sameAs: entry.wikipedia,
        count: totalCount,
      })
    }
  }

  return Array.from(counts.values()).sort((a, b) => b.count - a.count)
}

function buildEntityRef(e: EntityMatch, includeKey = true) {
  return {
    ...(includeKey && { _key: key() }),
    name: e.term,
    type: e.schemaType,
    ...(e.sameAs && { sameAs: e.sameAs }),
  }
}

// ── Main enrichment logic ─────────────────────────────────────────────────────

interface BlogPostDoc {
  _id: string
  _type: string
  title: string
  slug: { current: string }
  status: string
  enrichmentRequired: boolean
  arvowRawPayload?: string
  quickAnswer?: string
  body?: unknown[]
  faqs?: unknown[]
  endCtaStat?: unknown
  aboutEntities?: unknown[]
  mentionsEntities?: unknown[]
}

async function enrich(docId: string, opts: { dryRun: boolean; force: boolean }) {
  const client = getSanityWriteClient()
  const readClient = getSanityClient(false)

  // Fetch the document
  const doc = await readClient.fetch<BlogPostDoc | null>(
    `*[_type == "blogPost" && _id == $id][0]`,
    { id: docId },
  )

  if (!doc) {
    console.error(`✗ No blogPost found with _id="${docId}"`)
    process.exit(1)
  }

  console.log(`\n📄 Document: "${doc.title}"`)
  console.log(`   Slug: ${doc.slug?.current}`)
  console.log(`   Status: ${doc.status}`)
  console.log(`   Enrichment required: ${doc.enrichmentRequired}`)

  if (!doc.enrichmentRequired && !opts.force) {
    console.log('\n✅ Already enriched. Use --force to re-enrich.')
    process.exit(0)
  }

  if (doc.status === 'published' && !opts.force) {
    console.error('\n✗ Cannot enrich a published post. Use --force to override.')
    process.exit(1)
  }

  // Extract raw markdown from arvowRawPayload
  let rawMarkdown: string
  if (doc.arvowRawPayload) {
    try {
      const payload = JSON.parse(doc.arvowRawPayload)
      rawMarkdown = payload.bodyMarkdown ?? ''
    } catch {
      // payload stored as truncated string or non-JSON; treat as raw markdown
      rawMarkdown = doc.arvowRawPayload
    }
  } else {
    console.error('\n✗ No arvowRawPayload found — cannot enrich without source markdown.')
    process.exit(1)
  }

  if (!rawMarkdown.trim()) {
    console.error('\n✗ arvowRawPayload contains empty bodyMarkdown.')
    process.exit(1)
  }

  // ── Parse markdown ─────────────────────────────────────────────────────────
  console.log('\n🔍 Parsing markdown...')
  const { blocks, quickAnswer, faqs, topStat } = parseMarkdown(rawMarkdown)
  console.log(`   Portable Text blocks: ${blocks.length}`)
  console.log(`   Quick Answer: ${quickAnswer ? `"${quickAnswer.slice(0, 60)}…"` : 'not found'}`)
  console.log(`   FAQs extracted: ${faqs.length}`)
  console.log(`   Top stat: ${topStat ?? 'not found'}`)

  // ── Match entities ─────────────────────────────────────────────────────────
  console.log('\n🔍 Matching entities...')
  const fullText = [doc.title, rawMarkdown].join(' ')
  const matched  = matchEntities(fullText)

  const aboutEntities    = matched.slice(0, 3)
  const mentionsEntities = matched.slice(3, 13)

  console.log(`   About (top 3): ${aboutEntities.map(e => e.term).join(', ') || 'none'}`)
  console.log(`   Mentions (4–13): ${mentionsEntities.map(e => e.term).join(', ') || 'none'}`)

  // ── Build patch ────────────────────────────────────────────────────────────
  const patch: Record<string, unknown> = {
    status: 'ready-for-review',
    enrichmentRequired: false,
    body: blocks,
    ...(quickAnswer   && { quickAnswer }),
    ...(faqs.length   && { faqs }),
    ...(topStat && {
      endCtaStat: {
        number:  topStat,
        context: 'Key metric from this article',
        source:  '',
      },
    }),
    ...(aboutEntities.length && {
      aboutEntities: aboutEntities.map(e => buildEntityRef(e)),
    }),
    ...(mentionsEntities.length && {
      mentionsEntities: mentionsEntities.map(e => buildEntityRef(e)),
    }),
  }

  // ── Dry run output ─────────────────────────────────────────────────────────
  if (opts.dryRun) {
    console.log('\n🔎 DRY RUN — patch that would be applied:')
    console.log(JSON.stringify(patch, null, 2))
    console.log('\n✅ Dry run complete. Remove --dry-run to apply.')
    return
  }

  // ── Apply patch ────────────────────────────────────────────────────────────
  console.log('\n📝 Writing to Sanity...')
  await client.patch(docId).set(patch).commit()

  console.log(`\n✅ Done! Post is now status="ready-for-review".`)
  console.log(`\n   Next steps:`)
  console.log(`   1. Open Sanity Studio → Blog Post → "${doc.title}"`)
  console.log(`   2. Spot-check entity bolding, Quick Answer, and FAQ items.`)
  console.log(`   3. Add 3 related posts.`)
  console.log(`   4. Set End CTA stat source attribution.`)
  console.log(`   5. Set status to "published" to trigger Vercel rebuild.`)
}

function getSanityWriteClient() {
  return getSanityClient(true)
}

// ── Entry point ───────────────────────────────────────────────────────────────

async function main() {
  const { docId, slug, dryRun, force } = parseArgs()

  if (!docId && !slug) {
    console.error(`
Usage:
  npm run enrich-arvow -- --docId <sanityDocumentId>
  npm run enrich-arvow -- --slug <post-slug>
  npm run enrich-arvow -- --docId <id> --dry-run
  npm run enrich-arvow -- --docId <id> --force

Options:
  --docId    Sanity document _id (e.g. "drafts.abc123" or "abc123")
  --slug     Post slug (alternative to --docId — looks up the document)
  --dry-run  Show what would be patched without writing to Sanity
  --force    Re-enrich even if enrichmentRequired is already false
`)
    process.exit(1)
  }

  let resolvedDocId = docId

  if (!resolvedDocId && slug) {
    const readClient = getSanityClient(false)
    const found = await readClient.fetch<{ _id: string } | null>(
      `*[_type == "blogPost" && slug.current == $slug][0]{ _id }`,
      { slug },
    )
    if (!found) {
      console.error(`✗ No blogPost found with slug="${slug}"`)
      process.exit(1)
    }
    resolvedDocId = found._id
    console.log(`Resolved slug "${slug}" → docId "${resolvedDocId}"`)
  }

  await enrich(resolvedDocId!, { dryRun, force })
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
