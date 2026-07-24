# CiCon Areas-Served — QA Report (Deliverable 5) — Rev 2, five-page launch

**Date:** 2026-07-24 · **Branch:** `feature/areas-served-hub` · Pushed for Vercel **preview only** — not merged to `main`, not deployed to production.

## Launch set (indexable, in `/areas-sitemap.xml`, internally linked)
- `/areas-served/` — hub
- `/areas-served/richmond-hill/` — HQ market
- `/areas-served/vaughan/` — proof: two live Vaughan guides
- `/areas-served/markham/` — proof: MJ-approved client references (Sparkle Light, Bethel International, Venizzi) + GTA dental guide
- `/areas-served/thornhill/` — proof: MJ-approved client references (Joseph Kitchen and Bath, AM Group Studio, Artistry Homes); fills the proven 138-impressions-at-position-49 demand gap

**Withheld (built, `noindex`, zero internal links, out of sitemap):** Aurora, Newmarket, North York — full content ready, awaiting city-level proof.
**Hub-only:** Scarborough, Pickering, Bolton (with approved Direct Air Systems line on its coverage card), King, Whitchurch–Stouffville, East Gwillimbury, Toronto, Mississauga, Etobicoke. **Whitby: excluded and validator-banned.**

## Revision-round changes verified
1. **Canonical business data corrected repo-wide** — see file list in the summary. Stale `69 Cartier Crescent` (repo legal page **and** live Sanity privacy-policy doc — patched & published in CMS), stale `+1 (905) 884-5060` fallback, `hello@cicon.ca` (homepage JSON-LD, defaults, Sanity schema initialValue). Homepage now reuses the shared `LOCAL_BUSINESS_CICON` constant instead of a drifting inline copy; about-us `@id`/broken-logo and contact-us `@id`/geo inconsistencies unified to `#local-business` / `43.8828,-79.4403`. Zero occurrences of any stale value in the production build output. Sanity live content (homepage contact, contactPage, smsTerms, aboutPage) audited — already correct.
2. **Restrained client attribution** renders exactly as approved (name + city + relationship only; no metrics/testimonials/scope; no office implication — validator-enforced).
3. **Nav fixed at tablet widths:** pre-existing production bug found at 768–1023px — the desktop Services dropdown had no hidden state below 1024px and rendered permanently open, covering content. Fix: desktop nav breakpoint moved md→lg (hamburger menu now serves 768–1023px, where it works correctly); labels no-wrap; phone number in the header shows at ≥1280px (still present in mobile menu, footer, and every page CTA). Verified visually at 768 / 1024 / 1280 / 375px — single-line nav at 1024+, working hover dropdown CSS unchanged for ≥1024.

## Automated checks (all passing, fresh production build)
| Check | Result |
|---|---|
| `npm run test:areas` (10 gate tests, expected-published list updated to 4 cities) | ✅ 10/10 |
| Production build | ✅ clean |
| Robots | ✅ hub + 4 cities `index, follow`; aurora/newmarket/north-york `noindex, nofollow, noarchive, nosnippet` |
| Sitemap | ✅ exactly hub + 4 published cities with `lastmod`; registered in `/sitemap.xml` index |
| Canonicals | ✅ self-referencing, trailing slash, all areas pages |
| Internal links | ✅ zero links to the 3 drafts anywhere in dist; zero unresolved hrefs; footer links hub + 4 cities; nearby-area modules link only published pages |
| JSON-LD | ✅ parses on all 8 pages; Service→`#organization`, City areaServed, FAQPage == visible FAQs, BreadcrumbList; single LocalBusiness entity sitewide |
| Stale business data in dist | ✅ 0 |
| Unapproved-proof leakage | ✅ 0 (Richmond Hill/Toronto client names remain data-only, `approved: false`) |
| Whitby | ✅ 0 occurrences |
| Visual | ✅ 375 / 768 / 1024 / 1280 checked in Chrome; no console errors |

## Remaining risks
1. **Nav breakpoint change is sitewide** — every page now shows the hamburger at 768–1023px instead of the (broken) desktop nav. This is strictly better than the stuck-open dropdown, but MJ should eyeball it on the Vercel preview on a real tablet.
2. **Richmond Hill cannibalization** unresolved until the consolidation plan (doc 04) is approved and executed — expect the RH area page to compete with the homepage + two blog posts in the interim.
3. Markham/Thornhill currently have near-zero query visibility (~9 impr / 138 impr); rankings will take weeks — judge at the 30/60/90-day reviews, not launch week.
4. GA4 tags for the new dataLayer events (`area_city_card_click`, `area_service_card_click`, `get_in_touch_click`, and `whatsapp_click`/`phone_click` with `areas_*` sources) must be added in the GTM container — container-side work, not in the repo.
5. The privacy-policy address fix is live in Sanity now but only appears on cicon.ca after the next production deploy (static build).

## Production-launch steps (when MJ says go)
1. Open a PR from `feature/areas-served-hub` → `main`; confirm the Vercel preview renders hub + 4 city pages correctly (spot-check robots meta = `index, follow` is only on the production domain — previews are noindexed by design).
2. Merge to `main` (this is the production deploy on Vercel).
3. Post-deploy (same day): fetch `https://cicon.ca/sitemap.xml` and `/areas-sitemap.xml`; run Google Rich Results test on hub + Richmond Hill + Markham; submit `/areas-sitemap.xml` in GSC and request indexing for the 5 URLs.
4. Create a GA4 annotation for the launch date; add the GTM tags for the new events.
5. Day 7–14: GSC indexation check (`site:cicon.ca/areas-served/`); Day 30: first query review; Day 60–90: content/CTR review per the editorial README cadence.
6. Separately, review doc 04 (Richmond Hill consolidation) and green-light the blog merge + redirects ~2–4 weeks after launch.

---

## Addendum — 2026-07-24: re-verified after CMS migration

Same 5-page launch set (hub, richmond-hill, vaughan, markham, thornhill indexable; aurora/newmarket/north-york draft), now served entirely from Sanity. Re-ran the full QA sweep against the CMS-backed build:

- `npm run test:areas`: **11/11**, fetching live Sanity data (was 10/10 against static fixtures pre-migration; added a "Sanity returned all 16 GBP-list areas" test and a hub-only-areas sanity check).
- Production build (`VERCEL_ENV=production`): clean.
- Robots: hub + 4 cities `index,follow`; 3 drafts `noindex`. Identical to pre-migration.
- `/areas-sitemap.xml`: identical 5-URL set, `lastmod` now sourced from each document's `lastReviewed` field in Sanity.
- Zero: stale business data, Whitby references, links to draft pages, unresolved internal hrefs, JSON-LD parse failures.
- Hub renders all 16 areas (4 as linked cards, 12 as plain coverage text) exactly matching the Sanity `geographicGroups` structure — verified via static HTML extraction, not just visual spot-check.
- Visual check (Chrome, desktop + 375px mobile) on hub and Thornhill: pixel-identical to the pre-migration static version; zero console errors.
- Confirmed via `mcp__Sanity__get_schema` that only two new document types exist in the deployed schema (`serviceArea`, `areasServedHub`) alongside the pre-existing types — matches the requested Studio IA exactly, no extra nav entries.

**New consideration:** content changes now require a Sanity publish **and** a new Vercel build (Astro fetches at build time, not runtime) — a Studio-only publish does not update the live site until the next deploy. This is the same tradeoff every other Sanity-backed page on this site already has (blog, service pages); documented in the editorial README.
