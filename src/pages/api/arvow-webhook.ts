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
 *   ARVOW_WEBHOOK_SECRET        — shared secret for HMAC signature
 *   PUBLIC_SANITY_PROJECT_ID    — Sanity project ID
 *   PUBLIC_SANITY_DATASET       — Sanity dataset (default: production)
 *   SANITY_WRITE_TOKEN          — Sanity API token with write access
 */

// This route is SSR — it must NOT be prerendered.
export const prerender = false

import type { APIRoute } from 'astro'
import { createClient } from '@sanity/client'

// ── Types ────────────────────────────────────────────────────────────────────

interface ArvowPayload {
  /** Unique Arvow article ID — used for idempotency. Required. */
  id: string
  /** Article title / H1. Required. */
  title: string
  /** URL slug (no leading/trailing slashes). Required. */
  slug: string
  /** Short subtitle / dek. Optional. */
  dek?: string
  /**
   * Article body — raw markdown as Arvow generates it.
   * Will be converted to Portable Text by the enrich-arvow script.
   */
  bodyMarkdown: string
  /** ISO 8601 date string, e.g. "2026-05-15". Optional. */
  publishedAt?: string
  /** Estimated read time in minutes. Optional. */
  readTime?: number
  /** Category slug matching a blogCategory document in Sanity. Optional. */
  categorySlug?: string
  /** Hero image CDN URL. Optional. */
  heroImageUrl?: string
  /** Hero image alt text. Optional but recommended when heroImageUrl is set. */
  heroImageAlt?: string
  /** Hero image caption. Optional. */
  heroImageCaption?: string
  /** Meta title (≤60 chars). Optional. */
  metaTitle?: string
  /** Meta description (≤160 chars). Optional. */
  metaDescription?: string
  /** Target keyword list. Optional. */
  keywords?: string[]
  /** Arvow batch/campaign identifier, e.g. "may-2026-dental". Optional. */
  batchId?: string
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

  // DIAGNOSTIC — log the incoming field names so we can verify Arvow's payload shape.
  // REMOVE after confirming the field names are correct.
  console.log('[arvow-webhook] DIAG incoming fields:', Object.keys(payload).sort().join(', '))
  console.log('[arvow-webhook] DIAG slug value:', payload.slug ?? '(missing)')
  console.log('[arvow-webhook] DIAG bodyMarkdown present:', typeof (payload as any).bodyMarkdown === 'string' ? 'yes' : 'no')
  console.log('[arvow-webhook] DIAG raw field check — body:', typeof (payload as any).body)
  console.log('[arvow-webhook] DIAG raw field check — content:', typeof (payload as any).content)
  console.log('[arvow-webhook] DIAG raw field check — content_markdown:', typeof (payload as any).content_markdown)

  const { id, title, slug, bodyMarkdown } = payload

  if (!id || typeof id !== 'string') {
    console.error('[arvow-webhook] Validation failed: missing field "id". Keys received:', Object.keys(payload).join(', '))
    return json({ error: 'Missing required field: id' }, 400)
  }
  if (!title || typeof title !== 'string') {
    console.error('[arvow-webhook] Validation failed: missing field "title". Keys received:', Object.keys(payload).join(', '))
    return json({ error: 'Missing required field: title' }, 400)
  }
  if (!slug || typeof slug !== 'string' || !/^[a-z0-9-]+$/.test(slug)) {
    console.error(`[arvow-webhook] Validation failed: slug="${slug}" — must match /^[a-z0-9-]+$/`)
    return json({ error: 'Missing or invalid field: slug (lowercase, hyphens only)' }, 400)
  }
  if (!bodyMarkdown || typeof bodyMarkdown !== 'string') {
    console.error(`[arvow-webhook] Validation failed: bodyMarkdown missing or not a string. Type: ${typeof bodyMarkdown}. Keys received: ${Object.keys(payload).join(', ')}`)
    return json({ error: 'Missing required field: bodyMarkdown' }, 400)
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

  // ── 5. Resolve category reference (if categorySlug provided) ───────────────
  let categoryRef: { _type: 'reference'; _ref: string } | undefined
  if (payload.categorySlug) {
    const cat = await client.fetch<{ _id: string } | null>(
      `*[_type == "blogCategory" && slug.current == $slug][0]{ _id }`,
      { slug: payload.categorySlug },
    )
    if (cat) {
      categoryRef = { _type: 'reference', _ref: cat._id }
    } else {
      console.warn(`[arvow-webhook] No blogCategory found for slug="${payload.categorySlug}" — importing without category.`)
    }
  }

  // ── 6. Build Sanity document ───────────────────────────────────────────────
  const batchId = payload.batchId
    ?? request.headers.get('X-Arvow-Batch-Id')
    ?? undefined

  const doc: Record<string, unknown> = {
    _type: 'blogPost',
    status: 'arvow-imported',
    enrichmentRequired: true,

    // Core fields
    title,
    slug: { _type: 'slug', current: slug },
    ...(payload.dek          && { dek: payload.dek }),
    ...(payload.publishedAt  && { publishedAt: payload.publishedAt }),
    ...(payload.readTime     && { readTime: payload.readTime }),
    ...(categoryRef          && { category: categoryRef }),

    // Hero image
    ...(payload.heroImageUrl && {
      heroImage: {
        _type: 'externalImage',
        url: payload.heroImageUrl,
        alt: payload.heroImageAlt ?? title,
        ...(payload.heroImageCaption && { caption: payload.heroImageCaption }),
      },
    }),

    // SEO
    ...(payload.metaTitle       && { metaTitle: payload.metaTitle }),
    ...(payload.metaDescription && { metaDescription: payload.metaDescription }),
    ...(payload.keywords?.length && { keywords: payload.keywords }),

    // Raw markdown — the enrich-arvow script converts this to Portable Text
    // and stores it in the `body` field. We store it here for reference.
    arvowRawPayload: rawBody.length > 8000
      ? rawBody.slice(0, 8000) + '\n… [truncated — full payload exceeds 8 KB]'
      : rawBody,

    // Arvow metadata
    arvowId: id,
    ...(batchId && { arvowBatchId: batchId }),
    arvowReceivedAt: new Date().toISOString(),

    // Workflow
    notes: [
      `Imported from Arvow on ${new Date().toISOString()}`,
      batchId ? `Batch: ${batchId}` : null,
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
