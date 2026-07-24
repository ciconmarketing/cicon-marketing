# CiCon Areas-Served — Technical Plan (Deliverable 3)

**Branch:** `feature/areas-served-hub` (worktree `~/dev/cicon-areas-served`, off `origin/main`).

## Routes
| Route | File | Prerender | Index |
|---|---|---|---|
| `/areas-served/` | `src/pages/areas-served/index.astro` | static | yes, in sitemap |
| `/areas-served/{slug}/` | `src/pages/areas-served/[slug].astro` | static via `getStaticPaths()` over the data module (`status !== 'draft'` pages are generated; `indexable === false` → `noindex, nofollow` meta, excluded from sitemap and internal links) | per-page flag |

Draft pages are generated but noindexed so MJ can review on the production URL; they receive no internal links (no orphan-crawl paths advertised) and never enter the sitemap.

## Content model — `src/lib/areas-served.ts`
Single typed module (mirrors the existing `services-nav.ts` "single source of truth" pattern; no new Sanity schema for v1 — repo-reviewed content, build-time validation, no CMS drift):

```ts
type ProofItem = { kind: 'blog' | 'fact' | 'client' | 'testimonial'; label: string; href?: string; approved: boolean }
type AreaFaq = { q: string; a: string }
export type ServiceAreaPage = {
  slug: string; cityName: string; officialName?: string
  region: 'Home' | 'York Region' | 'Toronto' | 'Durham' | 'Peel' | 'Caledon'
  tier: 1 | 2 | 3
  status: 'draft' | 'published'
  indexable: boolean
  title: string           // 55–62 chars, validated
  metaDescription: string // 130–160 chars, validated
  eyebrow: string; h1: string
  summary: string          // 40–80 words answer-first block
  localContext: string[]   // unique paragraphs
  bestFitIndustries: { name: string; note: string }[]
  featuredServices: { slug: keyof SERVICES_NAV; angle: string }[] // 3–6, links to canonical service pages
  localProof: ProofItem[]  // only approved items render
  nearbyAreas: string[]    // slugs, 3–5, only rendered if target is published+indexable
  faqs: AreaFaq[]          // 3–6 unique
  lastReviewed: string
}
```

**Quality gate — `validateAreaPages()`** (same module, executed at import time in `getStaticPaths` + covered by a node test): a page may be `indexable: true` only if it has summary 40–80 words, ≥2 localContext paragraphs, ≥1 `approved` proof item, ≥3 unique FAQs (no cross-city duplicates by exact text), 3–6 featuredServices, title/meta lengths in range, slug lowercase-kebab, and is not Whitby (hard ban list). Violations throw at build → broken data cannot deploy.

## Components (new, in `src/components/areas/`, styled to the service-page system: inline styles on `--shadow/--accent/--action` vars, `.reveal` optional)
- `AreaBreadcrumbs.astro` — first visible breadcrumb UI on the site (Home › Areas Served › City), matches JSON-LD.
- `AreaHero.astro` — light variant of ServiceHero: eyebrow, H1, value prop, WhatsApp primary + Get In Touch secondary + tel tertiary, honest base-disclosure line.
- `AnswerFirst.astro` — bordered standalone summary block (extractable for AI overviews).
- `CityGroups.astro` (hub) — grouped location cards; linked card only when target page is published+indexable, otherwise plain coverage text.
- `AreaProof.astro` — renders approved proof items (blog links, facts); no fabrication path: unapproved items simply don't render.
- `NearbyAreas.astro` — 3–5 links, published targets only.
Reused as-is: `ServiceFaq`, `ProcessStrip`, `EeatBlock`, `GoogleReviews`, `FinalCta`, `Nav`, `Footer`.

## Metadata & head
Copy the service-template head verbatim (GTM shim, Meta Pixel, fonts, `:root` tokens, `VERCEL_ENV` preview-noindex). Per page: unique title/meta (validated lengths), self-referencing trailing-slash canonical, OG/Twitter, `index, follow` only when `indexable` && production.

## JSON-LD (per city page, one `@graph`)
`ORG_CICON` + `PERSON_MAJID` + `WEBSITE_CICON` + `Service` (`@id: {canonical}#service`, name "Digital Marketing Services in {City}", `provider: {'@id': 'https://cicon.ca/#organization'}`, `areaServed: {'@type':'City', name}`, `serviceType: 'Digital marketing'`) + `BreadcrumbList` (`{canonical}#breadcrumb`, Home → Areas Served → City) + `FAQPage` (`{canonical}#faq`, only visible FAQs). Richmond Hill page additionally references `LOCAL_BUSINESS_CICON` by `@id` (it's the real office). **No** per-city PostalAddress, geo, or new LocalBusiness nodes. Hub: `CollectionPage` + `BreadcrumbList` + org reference; footer's sitewide LocalBusiness continues via `<Footer />` default.

## Sitemap & robots
- New `src/pages/areas-sitemap.xml.ts`: hub + `published && indexable` cities, `lastmod` from `lastReviewed`; registered in `src/pages/sitemap.xml.ts` index. robots.txt unchanged.

## Internal links
- Footer: "Service Areas" column becomes links — heading links to hub; items = published cities as links; remaining current claims (Thornhill, Aurora, Newmarket, North York, Markham while draft) stay as plain text (no behavior regression, no links to noindex pages). "Areas Served" link added to Company column.
- Nav: "Areas Served" appended to the hardcoded items (desktop + mobile) — flagged in QA for MJ's crowding review.
- About page ("Built in Richmond Hill, working across the GTA" section) + contact page intro: contextual link to hub.
- City pages → hub, 3–6 canonical service pages, 1–3 relevant blog posts, nearby published cities, contact path.
- Hub → published city pages, major service pages, dental industry page.
- No all-cities footer block; no links to drafts anywhere.

## Analytics (GTM dataLayer shim conventions)
On hub + city pages, one deferred listener script (pattern copied from `contact-us.astro`): `whatsapp_click {source: 'areas_' + slug}`, `phone_click {source}`, `area_city_card_click {city}` (hub), `area_service_card_click {service, city}`. Form CTA links to `/contact-us/#contact-form` (existing form events already instrumented there).

## Testing & QA
- `scripts/__tests__/areas-served.test.ts` (node --test, same harness as parser tests): validation gate rules incl. Whitby ban, slug shape, meta lengths, FAQ uniqueness across cities, nearbyAreas referential integrity + no links to non-indexable pages.
- `npm run build` → assert: draft pages emit noindex; sitemap contains only hub+published; canonicals trailing-slash; no `/areas-served` 404s in internal links (link-check script over `dist/`).
- Schema spot-validation of emitted JSON-LD (parse + required-key assertions in test).

---

## Addendum — 2026-07-24 revision round
- Published set is now data-driven to 4 cities (richmond-hill, vaughan, markham, thornhill); all link surfaces (hub cards, footer, nearby modules, sitemap) update automatically from `status`/`indexable` — no template changes were needed to expand the launch set, confirming the architecture works as designed.
- `Nav.astro`: desktop nav breakpoint moved `md`→`lg` (fixes pre-existing stuck-dropdown bug at 768–1023px); nav labels `whitespace-nowrap`; header phone visible ≥ `xl`.
- Business-entity constants: single `LOCAL_BUSINESS_CICON` now emitted on the homepage too (was an inline near-duplicate with a stale email).

---

## Addendum 2 — 2026-07-24: migrated content to Sanity CMS

Per MJ's Sanity Studio information-architecture spec, all areas-served content moved from repo-side TypeScript literals (`AREA_PAGES`/`COVERAGE_AREAS` in `src/lib/areas-served.ts`) into Sanity, matching the existing `servicePage`/`servicesHub` pattern:

- **`sanity/schemas/serviceArea.ts`** — one document type for all 16 active GBP areas (Studio nav: "Areas Served"). Fields cover editorial status, Has Dedicated Page, Indexable, SEO, hero, content blocks, local proof (with an `approved` flag per item), featured-service references, and nearby-area references. Cross-field validation (`Rule.custom`) blocks Indexable unless Status=Published + Has Dedicated Page=Yes + ≥1 approved proof item — enforced live in Studio, not just at build time. A `rejectWhitby` validator blocks any document whose name/slug contains "whitby".
- **`sanity/schemas/areasServedHub.ts`** — singleton (Studio nav: "Areas Served Hub"), same `__experimental_actions: ['update','publish']` pattern as `servicesHub.ts`. References `serviceArea` documents by group instead of duplicating city copy.
- No custom Studio desk structure was added — the default `structureTool()` already produces exactly one nav entry per registered document type, satisfying "only two top-level entries" without extra complexity.
- `src/lib/sanity.ts` gained `getServiceAreas()` (build-time memoized — one fetch serves `getStaticPaths`, the hub page, `areas-sitemap.xml.ts`, and every page's `<Footer>`), `getServiceArea(slug)`, `getAreasServedHub()`, and the `ServiceAreaData`/`AreasServedHubData` types.
- `src/lib/areas-served.ts` is now content-free — purely `validateAreaPages()` (the build-time backstop gate) operating on whatever Sanity returns, plus `getPublishedAreas`/`getBuildableAreas`/`getAreaBySlug` helpers.
- `[slug].astro`'s `getStaticPaths()` fetches once and passes each area as `props`, avoiding a second per-page Sanity round-trip.
- `scripts/__tests__/areas-served.test.ts` now fetches live Sanity data (via a `before()` hook, `.env.local`-loaded `@sanity/client`, same dotenv pattern as `seed-case-studies.ts`) and runs the same gate against it — 11 tests, all passing against production content.
- All 16 areas seeded and published in Sanity via the Sanity MCP tools (`create_documents`/`patch_documents`/`publish_documents`): 4 published+indexable, 3 draft, 9 hub-only. Studio deployed via `npx sanity deploy` (`https://cicon-marketing.sanity.studio`) per the standing CLAUDE.md instruction to redeploy Studio after schema changes.
