# CiCon Pipeline B — Post Processor

Scripts for enriching Arvow-imported blog posts before they go live on cicon.ca.

---

## Pipeline Overview

```
Arvow generates markdown
        │
        ▼
POST /api/arvow-webhook          ← Webhook endpoint (src/pages/api/arvow-webhook.ts)
        │  Creates blogPost in Sanity with:
        │    status: 'arvow-imported'
        │    enrichmentRequired: true
        │    body: (empty — raw markdown in arvowRawPayload)
        ▼
npm run enrich-arvow             ← This script (manual step)
        │  Parses markdown, converts to Portable Text,
        │  extracts entities, FAQs, Quick Answer, End CTA stat.
        │  Sets status: 'ready-for-review', enrichmentRequired: false
        ▼
Editor review in Sanity Studio
        │  Spot-checks, links related posts, approves.
        │  Sets status: 'published'
        ▼
Vercel rebuilds → post goes live at cicon.ca/blog/<slug>/
```

---

## `enrich-arvow-post.ts`

Converts a raw Arvow-imported `blogPost` document into an enriched, review-ready post.

### What it does

1. Fetches the document from Sanity by `--docId` or `--slug`.
2. Parses the `arvowRawPayload` to extract `bodyMarkdown`.
3. Converts markdown to Portable Text blocks.
4. Extracts Quick Answer (first `> Quick Answer:` blockquote).
5. Extracts FAQ Q&A pairs from "Frequently Asked Questions" section.
6. Identifies the best stat candidate for the End CTA block.
7. Runs entity dictionary scan → populates `aboutEntities` (top 3) and `mentionsEntities` (next up to 10).
8. Patches the Sanity document with all enriched fields.
9. Sets `status: 'ready-for-review'` and `enrichmentRequired: false`.

### Usage

```bash
# Enrich by document ID
npm run enrich-arvow -- --docId <sanityDocumentId>

# Enrich by slug
npm run enrich-arvow -- --slug <post-slug>

# Preview what would be written (no changes to Sanity)
npm run enrich-arvow -- --docId <id> --dry-run

# Re-enrich a post that was already enriched (overrides safeguard)
npm run enrich-arvow -- --docId <id> --force
```

### Required env vars

Set these in your local `.env` file (not committed to git):

```
PUBLIC_SANITY_PROJECT_ID=your_project_id
PUBLIC_SANITY_DATASET=production
SANITY_WRITE_TOKEN=your_write_token
```

Get your write token from: https://www.sanity.io/manage → your project → API → Tokens → Add API token (Editor role).

---

## Webhook Endpoint

**`src/pages/api/arvow-webhook.ts`** — Receives Arvow payloads and creates `blogPost` documents.

### Authentication

Every request must include the shared secret in the `X-Secret` header:

```
X-Secret: <your_arvow_webhook_secret>
```

The value is compared directly against the `ARVOW_WEBHOOK_SECRET` env var.

### Required env vars (Vercel Dashboard)

| Variable | Where to set |
|---|---|
| `ARVOW_WEBHOOK_SECRET` | Vercel → Settings → Environment Variables |
| `PUBLIC_SANITY_PROJECT_ID` | Already set |
| `PUBLIC_SANITY_DATASET` | Already set |
| `SANITY_WRITE_TOKEN` | Vercel → Settings → Environment Variables |

### Payload format

```json
{
  "id": "arvow-unique-article-id",
  "title": "Article Title (H1)",
  "slug": "article-url-slug",
  "dek": "Short subtitle (optional)",
  "bodyMarkdown": "## Introduction\n\nFull article as markdown...",
  "publishedAt": "2026-05-15",
  "readTime": 8,
  "categorySlug": "local-seo",
  "heroImageUrl": "https://cdn.example.com/hero.jpg",
  "heroImageAlt": "Alt text for hero image",
  "heroImageCaption": "Caption (optional)",
  "metaTitle": "SEO title (optional, max 60 chars)",
  "metaDescription": "Meta description (optional, max 160 chars)",
  "keywords": ["local seo", "toronto"],
  "batchId": "may-2026-dental"
}
```

Required fields: `id`, `title`, `slug`, `bodyMarkdown`.

### Idempotency

The endpoint checks `arvowId` against existing documents before creating. Sending the same `id` twice returns `{ "ok": true, "duplicate": true }` without creating a duplicate.

### Testing locally

```bash
# Start dev server
npm run dev

# In another terminal — fire a test payload
SECRET="your-local-secret"
BODY='{"id":"test-001","title":"Test Post","slug":"test-post","bodyMarkdown":"## Hello\n\nWorld."}'

curl -X POST http://localhost:4321/api/arvow-webhook \
  -H "Content-Type: application/json" \
  -H "X-Secret: $SECRET" \
  -d "$BODY"
```

---

## After enrichment — editor checklist

Once `enrich-arvow` runs, open Sanity Studio and:

- [ ] Spot-check entity bolding for accuracy (especially `aboutEntities`).
- [ ] Verify Quick Answer is set and ≤500 chars.
- [ ] Review FAQ items — add/edit as needed (target: 4–6 Q&A).
- [ ] Set End CTA stat source attribution.
- [ ] Link 3 related posts.
- [ ] Review hero image alt text and caption.
- [ ] Set status to **Published** — Vercel rebuild fires automatically.

---

## Troubleshooting

**"No arvowRawPayload found"**
The document was created before the raw payload storage was added, or `bodyMarkdown` was missing from the original Arvow payload. Manually paste the markdown into the `arvowRawPayload` field in Sanity Studio, then re-run with `--force`.

**"Missing SANITY_WRITE_TOKEN"**
Create an Editor-role token at sanity.io/manage and add it to `.env`.

**"enrichmentRequired is already false"**
Post was already enriched. Use `--force` to re-run (useful if the entity dictionary was updated).
