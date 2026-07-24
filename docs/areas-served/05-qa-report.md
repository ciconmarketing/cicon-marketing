# CiCon Areas-Served — QA Report (Deliverable 5)

**Date:** 2026-07-24 · **Branch:** `feature/areas-served-hub` (worktree `~/dev/cicon-areas-served`, off `origin/main`) · **Not deployed** — per CLAUDE.md, no Vercel deploy without MJ's explicit go-live.

## URLs created

**Indexable at launch (in `/areas-sitemap.xml`, linked from hub/footer/nav):**
- `/areas-served/` — hub
- `/areas-served/richmond-hill/` — home market (HQ proof)
- `/areas-served/vaughan/` — proof: two live Vaughan guides + demand data

**Built but intentionally withheld (generated `noindex`, zero internal links, excluded from sitemap — full unique content ready for review at the URL):**
- `/areas-served/thornhill/` — flips on MJ proof approval (best demand gap: 138 impr @ pos 49, no page)
- `/areas-served/markham/` — flips on approval to attribute Sparkle Light / Bethel / Venizzi (all publicly Markham-based)
- `/areas-served/aurora/`, `/areas-served/newmarket/`, `/areas-served/north-york/` — await any city-level proof

**No pages created (hub coverage text only):** Scarborough, Pickering, Bolton, King, Whitchurch–Stouffville, East Gwillimbury, Toronto, Mississauga, Etobicoke. **Whitby: excluded everywhere and hard-banned in the validator.**

## Automated checks (all passing)

| Check | Result |
|---|---|
| `npm run test:areas` (10 quality-gate tests: Whitby ban, meta lengths, proof gate, FAQ cross-city uniqueness, nearby-slug integrity, office-claim ban, summary standalone rule) | ✅ 10/10 |
| `npm run build` (dev + `VERCEL_ENV=production`) | ✅ clean |
| Robots meta — production build | ✅ hub/RH/Vaughan `index, follow`; all 5 drafts `noindex, nofollow, noarchive, nosnippet`; every page noindexed on previews (existing convention preserved) |
| Sitemap | ✅ `/sitemap.xml` index now includes `/areas-sitemap.xml`; it contains exactly hub + RH + Vaughan with `lastmod` |
| Canonicals | ✅ self-referencing, trailing slash, on every areas page |
| Internal links | ✅ zero links to draft pages anywhere in dist; zero unresolved internal hrefs on the new pages; no orphans (hub ← nav/footer/about/contact; cities ← hub/footer/nearby) |
| JSON-LD | ✅ parses on all 8 pages; city pages: Org + Person + WebSite + Service(provider→`#organization`, areaServed City) + FAQPage + BreadcrumbList (+ sitewide LocalBusiness via footer). No per-city LocalBusiness/address/geo. FAQPage count == visible FAQ count on every page |
| Unapproved proof leakage | ✅ zero occurrences of pending client names in dist |
| Whitby in dist | ✅ zero occurrences |
| Visual check (Chrome, desktop + 375px mobile) | ✅ hub + Richmond Hill page render on-brand (Clash Display, shadow/goldenrod tokens, WhatsApp-green primary); no console errors |
| CTA hierarchy | ✅ WhatsApp primary → Get In Touch secondary → phone tertiary on every areas page; "Book a Free Strategy Call" absent |
| Analytics | ✅ `whatsapp_click` / `phone_click` / `get_in_touch_click` / `area_city_card_click` / `area_service_card_click` wired via the existing GTM dataLayer shim with `source: areas_<slug>`; covers tagged CTAs **and** untagged nav/footer wa.me/tel links on these pages |
| Duplicate content | ✅ per-city copy is data-authored and unique; only shared global components repeat (ProcessStrip/EeatBlock/FinalCta/Reviews — same as service pages); validator rejects cross-city FAQ duplication |
| Accessibility basics | ✅ one H1 per page, logical H2/H3, breadcrumb `<nav aria-label>`, native `<details>` FAQ (keyboard-safe, zero-JS), color pairs from existing approved system |

## Notes & known trade-offs
1. **Sitewide files touched:** `Footer.astro` (Service Areas column now links hub + published cities; Company column gains "Areas Served"), `Nav.astro` (Areas Served item, desktop + mobile), `schema-constants.ts` (`areaServed` on both business entities now mirrors the 16-market GBP list instead of a single "Greater Toronto Area" node), about/contact pages (one contextual link each). Everything else is additive.
2. Nav now has 8 items — worth a quick look on ~768–1100px widths; it fit fine in testing at 1280px and mobile.
3. Build warnings `Astro.request.headers … prerendered` pre-exist on `main` (middleware); not introduced by this work.
4. Lighthouse not run locally (no meaningful CWV signal from a dev build); the pages are static HTML with the same lazy-GTM/pixel pattern and fewer JS islands than service pages (only `GoogleReviews`), so CWV risk is below existing pages. Run PageSpeed on the Vercel preview URL after push.

## Claims/proof verification
- Every rendered proof item is verifiable: the Richmond Hill HQ fact and live blog URLs. No client names, cities, statistics, or testimonials were invented; the one previously-published local statistic (Vaughan 16% / "York Region Business Census") was **not** reused on the new pages.
- Client-city associations verified from public client websites are stored `approved: false` and render nothing.

## Remaining editorial tasks (MJ decisions)
1. Approve/decline public client-city attribution → flips Markham (and strengthens Thornhill/Bolton).
2. Decide Thornhill publish basis (named proof vs market-knowledge) — the demand gap is proven.
3. Aurora / Newmarket / North York: supply any city-level proof when it exists; pages are ready.
4. Approve Scarborough as the next build (Tier 2A; only unbuilt market with real impressions).
5. Consolidate the older Richmond Hill blog post into the 2026 version (cannibalization).
6. Confirm/fix the privacy-policy street address (69 Cartier Crescent vs 131 Golf Club Ct) and the stale `defaults.ts` fallback phone `+1 (905) 884-5060` / `hello@cicon.ca`.
7. In GTM, add GA4 event tags for the new `area_*` / `get_in_touch_click` events (container-side; not in repo).
8. After go-live: GA4 annotation for launch date; GSC indexation check at 7–14 days.
