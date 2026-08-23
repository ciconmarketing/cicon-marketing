# CiCon Marketing — Claude Code Project Guide

This is the CiCon Marketing website: Astro 5 + Sanity.io + Vercel.

---

## Session Rules (immutable)

- **No Vercel deploy** unless MJ explicitly says "push to Vercel", "make it live", or "go ahead".
- **WhatsApp URL**: `https://wa.me/16475840800` — NEVER change.
- **Phone display**: `+1 (289) 807-1020` | tel link: `tel:+12898071020` — NEVER change.

---

## CiCon SEO Standards

`metaTitle` is enforced by Sanity schema validation (blocking). `metaDescription` is a Studio **warning**, not a hard error — 17 posts predate this standard. Write to the range anyway; do not treat the warning as optional.

| Field            | Min | Max | Notes                                      |
|------------------|-----|-----|--------------------------------------------|
| `metaTitle`      | 50  | 61  | Google SERP truncates at ~60 chars         |
| `metaDescription`| 140 | 150 | Warning-only in Studio; still the target    |

**Rules when writing titles and descriptions:**

- Write to fit the range, not just the topic. Count characters before finalising.
- `metaTitle` format: `Primary Keyword: Secondary Context | CiCon` — keep the brand suffix short.
- `metaDescription` format: one benefit sentence + one action/differentiator sentence. No keyword stuffing.
- `metaTitle` is validated server-side in Sanity: an out-of-range title shows a blocking error in Studio and cannot be published. `metaDescription` shows a non-blocking warning, so legacy posts stay publishable — new posts should still land in 140-150.
- When generating or editing `metaTitle` / `metaDescription` values, always output the character count alongside the value.

---

## Architecture

- **Frontend**: Astro 5, `output: 'static'`, deployed to Vercel
- **CMS**: Sanity.io — project `26ol0sqj`, dataset `cicon-marketing`
- **Schema**: `sanity/schemas/blogPost.ts` — single document type for all blog posts
- **Enrichment script**: `npm run enrich-arvow -- --docId <id>` (uses `scripts/post-processor/`)
- **Editorial transforms**: `scripts/post-processor/editorial-transforms.ts` — applied post-parse: statCallout injection, pullQuote injection, Final Recommendation audit, internal link injection

---

## Sanity Studio deploy

```bash
cd sanity && npx sanity deploy
```

Always deploy after schema changes. Studio URL: `https://cicon-marketing.sanity.studio`

---

## Key URLs

- Production: `https://cicon.ca`
- Sanity Studio: `https://cicon-marketing.sanity.studio`
- Blog: `https://cicon.ca/blog/`

---

## Blog Post Publishing Workflow

For all new blog posts, follow `docs/workflows/publish-blog-post.md` verbatim. MJ provides topic + files; the workflow derives everything else. Do NOT use the deprecated enrichment script (`enrich-arvow-post.ts`) for new posts.
