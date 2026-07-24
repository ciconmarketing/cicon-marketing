# Areas Served — Editorial & Publishing Guide

The `/areas-served/` system is driven entirely by [`src/lib/areas-served.ts`](../../src/lib/areas-served.ts). No page copy lives in the `.astro` templates. A build-time quality gate (`validateAreaPages`) refuses to build invalid data, and `npm run test:areas` covers the gate.

## How pages publish

| status | indexable | Generated? | Robots | In sitemap? | Linked from hub/footer? |
|---|---|---|---|---|---|
| `draft` | must be `false` | yes (for review on the prod URL) | `noindex` | no | no |
| `published` | `true` | yes | `index, follow` (prod only) | yes (`/areas-sitemap.xml`) | yes |

Flipping a city live = set `status: 'published'`, `indexable: true`, make sure at least one `localProof` item is `approved: true`, update `lastReviewed`, run `npm run test:areas`, and update the expected published list in `scripts/__tests__/areas-served.test.ts` (deliberate two-touch so nobody publishes by accident).

## Required evidence before a city goes indexable

At least one of, stored as an `approved: true` proof item:
- A client/project/testimonial genuinely connected to the city **that MJ has approved for public city attribution** (client-city associations are otherwise confidential — the case-study schema is hidden for a reason).
- City-specific published content (a real blog guide, not a passing mention).
- A verifiable business fact (only Richmond Hill qualifies — the office).

Never invent proof, statistics, or "our {city} office" language. The gate blocks the office phrasing and Whitby outright; it cannot catch fabrication — that's on the editor.

## Client-city attribution status (2026-07-24)

Locations checked against each client's own public website.

**Approved by MJ for restrained public attribution** (rendered on pages; wording = name + city + relationship, never results/metrics/scope):
- **Markham:** Sparkle Light, Bethel International (Canadian HQ), Venizzi → published on `/areas-served/markham/`
- **Thornhill:** Joseph Kitchen and Bath, AM Group Studio, Artistry Homes → published on `/areas-served/thornhill/`
- **Bolton:** Direct Air Systems → hub coverage card only (Bolton has no page this release)

**Verified but NOT approved for attribution** (do not render without a new MJ decision):
- **Richmond Hill:** Maison Opes, Smile Express Denture Clinic, MacGyver Auto Body, Paya Group
- **Toronto:** First Electrical Supply (East York), Pizza Olive, Moxie Dental

## Adding a new city

1. Add a `ServiceAreaPage` object in `AREA_PAGES` (copy an existing draft as a template) with **unique** editorial content: summary (40–80 words, answer-first, names CiCon + Richmond Hill base), ≥2 localContext paragraphs, 3–6 featuredServices with city-specific angles, 3–6 FAQs whose text appears on no other city page.
2. `title` 55–62 chars, `metaDescription` 130–160 chars (Sanity-wide CiCon standard).
3. Start as `status: 'draft'`, `indexable: false`.
4. If it was hub-only before, remove its entry from `COVERAGE_AREAS` and add a `cardFor(...)` in the hub's group builder (`src/pages/areas-served/index.astro`).
5. Add it to 3–5 neighbours' `nearbyAreas` (and vice versa) — links only render once published.
6. `npm run test:areas` then `npm run build`.

## Retiring a city

Set `status: 'draft'` + `indexable: false` (page 404s only if you delete the object — prefer draft + a redirect in `vercel.json` if the URL had traffic). If a market leaves the GBP list entirely (like Whitby), delete the object, add the slug to `BANNED_AREAS`, and keep it out of `COVERAGE_AREAS`.

## Rules the templates already enforce

- One `Service` JSON-LD node per city page, `provider` → `https://cicon.ca/#organization`, `areaServed` = the single city. No per-city LocalBusiness, PostalAddress, or geo — the only real office is Richmond Hill.
- CTA hierarchy: WhatsApp → Get In Touch (form) → phone. "Book a Free Strategy Call" is not used.
- Analytics: `whatsapp_click` / `phone_click` / `get_in_touch_click` / `area_city_card_click` / `area_service_card_click` push to the GTM dataLayer with `source: areas_<slug>`. Configure GA4 tags for these in the GTM container (`GTM-NH5ZSMKJ`).
- Sitemap: `/areas-sitemap.xml` is generated from the data; never hand-edit.

## Review cadence

- After deploy: crawl check + Rich Results test on hub, Richmond Hill, Vaughan.
- 7–14 days: indexation check in GSC (`site:cicon.ca/areas-served/`).
- 30 days: query review per page (GSC filter `page contains /areas-served/`).
- 60–90 days: content/CTR review; consolidate, improve, or de-index pages that stay weak.
- Do not judge success by indexed-page count — benchmark (2026-07-24, GSC 90d): "digital marketing agency richmond hill" 366 impr @ pos 14.5; "digital marketing thornhill" 138 impr @ pos 48.6; "google maps seo vaughan" 131 impr @ pos 23.3; "local seo scarborough" 32 impr @ pos 32.9.
