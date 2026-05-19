/**
 * POST /api/arvow-webhook
 *
 * Receives new article payloads from Arvow and creates a blogPost document
 * in Sanity with status: 'arvow-imported'.
 *
 * Authentication: shared-secret comparison via ARVOW_WEBHOOK_SECRET (X-Secret header).
 * Idempotency:    Checks for existing document with matching arvowId — returns
 *                 200 (already imported) instead of creating a duplicate.
 *
 * Expected request:
 *   POST /api/arvow-webhook
 *   X-Secret:          <shared_secret>        // plain string comparison
 *   X-Arvow-Batch-Id:  <batchId>             // optional batch identifier
 *   Content-Type: application/json
 *   Body: ArvowPayload (see type below)
 *
 * Required env vars (set in Vercel Dashboard → Settings → Environment Variables):
 *   ARVOW_WEBHOOK_SECRET        — shared secret for auth
 *   PUBLIC_SANITY_PROJECT_ID    — Sanity project ID
 *   PUBLIC_SANITY_DATASET       — Sanity dataset (default: production)
 *   SANITY_WRITE_TOKEN          — Sanity API token with write access
 */

// This route is SSR — it must NOT be prerendered.
export const prerender = false

import type { APIRoute } from 'astro'
import { createClient } from '@sanity/client'

// ── Types ────────────────────────────────────────────────────────────────────

/**
 * Arvow's actual outgoing payload shape (verified from live webhook logs).
 * Field names are snake_case as Arvow sends them.
 */
interface ArvowPayload {
  /** Unique Arvow article ID — used for idempotency. Required. */
  id: string
  /** Article title / H1. Required. */
  title: string
  /** Article body as markdown. Required. Arvow field: content_markdown */
  content_markdown: string
  /** Article body as HTML. Optional. Arvow field: content */
  content?: string
  /** URL slug. Optional — Arvow does not always send this; we generate from title if absent. */
  slug?: string
  /** Meta description. Optional. Arvow field: metadescription */
  metadescription?: string
  /** Hero image CDN URL. Optional. Arvow field: thumbnail */
  thumbnail?: string
  /** Hero image alt text. Optional. Arvow field: thumbnail_alt_text */
  thumbnail_alt_text?: string
  /** Tag list. Optional. Arvow field: tags */
  tags?: string[]
  /** Arvow batch identifier. Optional. Arvow field: batch_id */
  batch_id?: string
  /** Arvow campaign identifier. Optional. Arvow field: campaign_id */
  campaign_id?: string
  /** Arvow campaign name. Optional. Arvow field: campaign_name */
  campaign_name?: string
  /** Seed keyword. Optional. Arvow field: keyword_seed */
  keyword_seed?: string
  /** Language code (e.g. "en"). Optional. Arvow field: language_code */
  language_code?: string
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function getSanityWriteClient() {
  const projectId = (import.meta.env.PUBLIC_SANITY_PROJECT_ID ?? '').trim()
  const dataset  = (import.meta.env.PUBLIC_SANITY_DATASET ?? 'production').trim()
  const token    = (import.meta.env.SANITY_WRITE_TOKEN ?? '').trim()

  if (!projectId || !token) return null

  return createClient({
    projectId,
    dataset,
    token,
    useCdn: false,
    apiVersion: '2024-01-01',
  })
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

/** Convert a title to a URL slug: lowercase, hyphens only, no leading/trailing hyphens. */
function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// ── Route handler ─────────────────────────────────────────────────────────────

export const POST: APIRoute = async ({ request }) => {
  // ── 1. Auth: shared-secret comparison ─────────────────────────────────────
  const secret = (import.meta.env.ARVOW_WEBHOOK_SECRET ?? '').trim()
  if (!secret) {
    console.error('[arvow-webhook] ARVOW_WEBHOOK_SECRET is not set.')
    return json({ error: 'Server misconfiguration — missing webhook secret.' }, 500)
  }

  const rawBody = await request.text()
  const incomingSecret = (request.headers.get('x-secret') ?? '').trim()

  if (incomingSecret !== secret) {
    console.warn('[arvow-webhook] Secret mismatch — unauthorized request.')
    return json({ error: 'Unauthorized — invalid secret.' }, 401)
  }

  // ── 2. Parse & validate payload ────────────────────────────────────────────
  let payload: ArvowPayload
  try {
    payload = JSON.parse(rawBody)
  } catch {
    console.error('[arvow-webhook] JSON parse failed. Raw body (first 500):', rawBody.slice(0, 500))
    return json({ error: 'Invalid JSON body.' }, 400)
  }

  const { id, title, content_markdown } = payload

  if (!id || typeof id !== 'string') {
    console.error('[arvow-webhook] Validation failed: missing field "id"')
    return json({ error: 'Missing required field: id' }, 400)
  }
  if (!title || typeof title !== 'string') {
    console.error('[arvow-webhook] Validation failed: missing field "title"')
    return json({ error: 'Missing required field: title' }, 400)
  }
  if (!content_markdown || typeof content_markdown !== 'string') {
    console.error('[arvow-webhook] Validation failed: missing field "content_markdown"')
    return json({ error: 'Missing required field: content_markdown' }, 400)
  }

  // Generate slug from title if Arvow didn't send one
  const slug = payload.slug
    ? payload.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/^-+|-+$/g, '')
    : slugify(title)

  if (!slug) {
    console.error('[arvow-webhook] Validation failed: could not derive slug from title:', title)
    return json({ error: 'Could not generate slug from title.' }, 400)
  }

  // ── 3. Build Sanity client ─────────────────────────────────────────────────
  const client = getSanityWriteClient()
  if (!client) {
    console.error('[arvow-webhook] Cannot build Sanity client — missing env vars.')
    return json({ error: 'Server misconfiguration — Sanity client unavailable.' }, 500)
  }

  // ── 4. Idempotency check — skip duplicate imports ──────────────────────────
  const existing = await client.fetch<{ _id: string } | null>(
    `*[_type == "blogPost" && arvowId == $arvowId][0]{ _id }`,
    { arvowId: id },
  )

  if (existing) {
    console.log(`[arvow-webhook] Already imported arvowId="${id}" as doc ${existing._id} — skipping.`)
    return json({
      ok: true,
      duplicate: true,
      message: 'Already imported.',
      sanityId: existing._id,
    })
  }

  // ── 5. Resolve category reference ─────────────────────────────────────────
  // Arvow sends tags[] — try matching the first tag to a blogCategory slug
  let categoryRef: { _type: 'reference'; _ref: string } | undefined
  const firstTag = payload.tags?.[0]
  if (firstTag) {
    const tagSlug = slugify(firstTag)
    const cat = await client.fetch<{ _id: string } | null>(
      `*[_type == "blogCategory" && slug.current == $slug][0]{ _id }`,
      { slug: tagSlug },
    )
    if (cat) {
      categoryRef = { _type: 'reference', _ref: cat._id }
    } else {
      console.warn(`[arvow-webhook] No blogCategory found for tag "${firstTag}" (slug "${tagSlug}") — importing without category.`)
    }
  }

  // ── 6. Build Sanity document ───────────────────────────────────────────────
  const batchId = payload.batch_id
    ?? request.headers.get('X-Arvow-Batch-Id')
    ?? undefined

  const doc: Record<string, unknown> = {
    _type: 'blogPost',
    status: 'arvow-imported',
    enrichmentRequired: true,

    // Core fields
    title,
    slug: { _type: 'slug', current: slug },
    ...(categoryRef && { category: categoryRef }),

    // Hero image — mapped from Arvow's thumbnail fields
    ...(payload.thumbnail && {
      heroImage: {
        _type: 'externalImage',
        url: payload.thumbnail,
        alt: payload.thumbnail_alt_text ?? title,
      },
    }),

    // SEO — mapped from Arvow's metadescription
    ...(payload.metadescription && { metaDescription: payload.metadescription }),
    ...(payload.keyword_seed    && { keywords: [payload.keyword_seed] }),
    ...(payload.tags?.length    && { tags: payload.tags }),

    // Raw markdown body — enrich-arvow converts this to Portable Text
    arvowRawPayload: rawBody.length > 8000
      ? rawBody.slice(0, 8000) + '\n… [truncated — full payload exceeds 8 KB]'
      : rawBody,

    // Arvow metadata
    arvowId: id,
    ...(batchId               && { arvowBatchId: batchId }),
    ...(payload.campaign_id   && { arvowCampaignId: payload.campaign_id }),
    ...(payload.campaign_name && { arvowCampaignName: payload.campaign_name }),
    arvowReceivedAt: new Date().toISOString(),

    // Workflow notes
    notes: [
      `Imported from Arvow on ${new Date().toISOString()}`,
      batchId              ? `Batch: ${batchId}` : null,
      payload.campaign_name ? `Campaign: ${payload.campaign_name}` : null,
      payload.keyword_seed  ? `Keyword seed: ${payload.keyword_seed}` : null,
      'Run `npm run enrich-arvow -- --docId <id>` to convert body and enrich schema.',
    ].filter(Boolean) as string[],
  }

  // ── 7. Create the document ─────────────────────────────────────────────────
  let created: { _id: string }
  try {
    created = await client.create(doc as Parameters<typeof client.create>[0])
    console.log(`[arvow-webhook] Created blogPost ${created._id} for arvowId="${id}" slug="${slug}"`)
  } catch (err) {
    console.error('[arvow-webhook] Sanity create failed:', err)
    return json({ error: 'Failed to create Sanity document.' }, 500)
  }

  return json({
    ok: true,
    sanityId: created._id,
    slug,
    status: 'arvow-imported',
    message: 'Post imported. Run enrich-arvow to convert body and enrich schema.',
  }, 201)
}

// Reject non-POST methods explicitly
export const GET: APIRoute = () =>
  json({ error: 'Method not allowed. Use POST.' }, 405)
