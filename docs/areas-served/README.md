# Areas Served — Editorial & Publishing Guide

**Content lives in Sanity Studio now** (migrated 2026-07-24 from repo-side TypeScript literals). Studio: **https://cicon-marketing.sanity.studio**

Two document types, matching the same pattern as the rest of the site (`Service Page` / `Services Hub Page`):

- **Areas Served** — one `serviceArea` document per market (all 16 active GBP areas). Editorial status, page/indexability toggles, SEO, hero, content blocks, local proof, and nearby-area links all live on this one document type.
- **Areas Served Hub** — a singleton `areasServedHub` document for `/areas-served/`. References `serviceArea` documents by group instead of duplicating city names or copy.

The Astro site (`src/pages/areas-served/*.astro`) fetches both at build time via `src/lib/sanity.ts` (`getServiceAreas`, `getServiceArea`, `getAreasServedHub`). `src/lib/areas-served.ts` no longer holds content — it is now purely the build-time quality gate (`validateAreaPages`), which throws and fails the build if the CMS data is invalid.

## How pages publish

Three fields on each `serviceArea` document control everything:

| Editorial Status | Has Dedicated Page | Indexable | Generated? | Robots | In sitemap? | Linked? |
|---|---|---|---|---|---|---|
| any | No | (forced No) | no route at all | — | no | hub coverage card only, no link |
| Draft | Yes | must be No | yes (for review on prod URL) | `noindex` | no | no |
| Published | Yes | Yes | yes | `index, follow` (prod only) | yes | yes |

**Indexable** cannot be turned on in Studio unless Status = Published, Has Dedicated Page = Yes, **and** at least one Local Proof item has Approved = Yes — the schema enforces this live as a validation error, and `npm run test:areas` + the build-time gate enforce it again as a backstop.

Flipping a city live in Studio: open the document → set Editorial Status to Published, Has Dedicated Page to Yes, add/confirm an Approved Local Proof item, toggle Indexable on → **Publish**. Then update the expected-published list in `scripts/__tests__/areas-served.test.ts` (deliberate two-touch so nobody publishes by accident) and open a PR — Studio publishes are independent of the Vercel deploy, so the page only goes live on cicon.ca after the next `main` deploy picks up the new content (or immediately if `main` is already deployed and this is a content-only change — Astro fetches Sanity at build time, so a **new Vercel build** is what actually publishes the page; a Sanity publish alone does not).

## Required evidence before a city goes indexable

At least one `serviceArea.localProof` item with **Approved = Yes**:
- A client/project/testimonial genuinely connected to the city **that MJ has approved for public city attribution** (client-city associations are otherwise confidential — the case-study schema is hidden for a reason).
- City-specific published content (a real blog guide, not a passing mention).
- A verifiable business fact (only Richmond Hill qualifies — the office).

Never invent proof, statistics, or "our {city} office" language. Both the Sanity schema and the build gate block the office phrasing and Whitby outright; neither can catch fabrication — that's on the editor.

## Client-city attribution status (2026-07-24)

Locations checked against each client's own public website.

**Approved by MJ for restrained public attribution** (rendered on pages; wording = name + city + relationship, never results/metrics/scope):
- **Markham:** Sparkle Light, Bethel International (Canadian HQ), Venizzi → published on `/areas-served/markham/`
- **Thornhill:** Joseph Kitchen and Bath, AM Group Studio, Artistry Homes → published on `/areas-served/thornhill/`
- **Bolton:** Direct Air Systems → hub coverage card only (Bolton has no page this release)

**Verified but NOT approved for attribution** (do not add to any `serviceArea.localProof` without a new MJ decision):
- **Richmond Hill:** Maison Opes, Smile Express Denture Clinic, MacGyver Auto Body, Paya Group
- **Toronto:** First Electrical Supply (East York), Pizza Olive, Moxie Dental

## Adding a new city

1. In Studio, create a new **Areas Served** document. Set City / Area Name, Slug, Region, Tier, Editorial Status = Draft, Has Dedicated Page = Yes (once content is ready) or No (hub-only for now).
2. Fill Hub Card Line (always required) and, once Has Dedicated Page is Yes, the Hero/Content Blocks fields: Eyebrow, H1, Answer-First Summary (40–80 words, names CiCon + Richmond Hill base), ≥2 Local Market Context paragraphs, ≥2 Best-Fit Industries, 3–6 Featured Services (referencing real `servicePage` docs), 3–6 FAQs whose question text doesn't duplicate another city.
3. Meta Title 55–62 chars, Meta Description 130–160 chars (CiCon-wide SEO standard; hard-enforced by the schema).
4. Add 3–5 **Nearby Areas** references (links only render once the target is published+indexable).
5. In the **Areas Served Hub** singleton, add the new document to the right Geographic Group's Areas list (or remove it from `Toronto markets`/etc. if it graduates from hub-only).
6. Leave Indexable off until proof is approved and status is Published.
7. `npm run test:areas` (fetches live Sanity data), then `npm run build`, then open a PR — the page only appears on cicon.ca after that PR merges and Vercel rebuilds.

## Retiring a city

Set Editorial Status back to Draft and Indexable off in Studio (page 404s only if you delete the document — prefer draft + a redirect in `vercel.json` if the URL had traffic), then trigger a rebuild. If a market leaves the GBP list entirely (like Whitby), delete the `serviceArea` document, remove it from any `geographicGroups`/`nearbyAreas` references, and never re-add it — the schema rejects any document whose name/slug contains "whitby".

## Rules the templates and schema already enforce

- One `Service` JSON-LD node per city page, `provider` → `https://cicon.ca/#organization`, `areaServed` = the single city. No per-city LocalBusiness, PostalAddress, or geo — the only real office is Richmond Hill.
- CTA hierarchy: WhatsApp → Get In Touch (form) → phone. "Book a Free Strategy Call" is not used.
- Analytics: `whatsapp_click` / `phone_click` / `get_in_touch_click` / `area_city_card_click` / `area_service_card_click` push to the GTM dataLayer with `source: areas_<slug>`. Configure GA4 tags for these in the GTM container (`GTM-NH5ZSMKJ`).
- Sitemap: `/areas-sitemap.xml` is generated live from Sanity at build time; never hand-edit.
- `Footer.astro`'s Service Areas column, the hub, and every nearby-area module all resolve live+indexable status independently at build time — a Studio change to one document updates every surface on the next build with no other code change required.

## Review cadence

- After deploy: crawl check + Rich Results test on hub, Richmond Hill, Vaughan, Markham, Thornhill.
- 7–14 days: indexation check in GSC (`site:cicon.ca/areas-served/`).
- 30 days: query review per page (GSC filter `page contains /areas-served/`).
- 60–90 days: content/CTR review; consolidate, improve, or de-index pages that stay weak (flip Editorial Status back to Draft in Studio + rebuild).
- Do not judge success by indexed-page count — benchmark (2026-07-24, GSC 90d): "digital marketing agency richmond hill" 366 impr @ pos 14.5; "digital marketing thornhill" 138 impr @ pos 48.6; "google maps seo vaughan" 131 impr @ pos 23.3; "local seo scarborough" 32 impr @ pos 32.9 (Scarborough is next in the build queue — Tier 2A, hub-only for now).
