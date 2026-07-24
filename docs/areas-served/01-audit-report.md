# CiCon Areas-Served — Audit Report (Deliverable 1)

**Date:** 2026-07-24 · **Repo:** `ciconmarketing/cicon-marketing` (production = `main`) · **Work branch:** `feature/areas-served-hub` in worktree `~/dev/cicon-areas-served`

---

## 1. Existing state

### Stack & rendering
- Astro 5 `output: 'static'` + Vercel adapter, `site: https://cicon.ca`. Blog pagination and previews are SSR; everything else prerendered — fully crawlable HTML.
- **No shared Layout/SEO component exists.** Every page hand-rolls its full `<head>` (title, description, canonical, robots, OG/Twitter, JSON-LD, GTM `GTM-NH5ZSMKJ`, Meta Pixel, `:root` tokens). New pages must copy the boilerplate — the service template `src/pages/marketing-services/[slug].astro` is the closest model.
- Trailing slash is the de-facto convention (every internal link/canonical/sitemap URL ends in `/`) but is **not enforced** by config.
- No `404.astro` exists (Vercel default 404 serves).

### Routes & sitemaps
- 14 routes; service spokes (12) and blog are Sanity-driven; static pages hardcoded.
- Sitemaps are hand-rolled endpoints: `/sitemap.xml` is an index over `page-`, `services-`, `post-sitemap.xml`. **Any new URL group must be registered manually** in `src/pages/sitemap.xml.ts`. Draft Sanity content is already excluded by query (`status != "draft"` / `status == "published"`), which gives us the exact precedent for gating city pages.
- `robots.txt` is a static file; disallows `/thank-you/`, `/privacy-policy/`, `/terms-and-conditions-sms/`. Preview deployments get sitewide `noindex` via per-page `VERCEL_ENV` check + `X-Robots-Tag` middleware on non-cicon.ca hosts.
- `/areas-served/*` is completely unclaimed — no route, no redirect conflicts. (Note: `/local-seo/` 301s to the Local SEO service page, so a `/local-seo/{city}/` pattern would collide; `/areas-served/{city}/` does not.)

### Structured data
- Canonical entities in `src/lib/schema-constants.ts`: `ORG_CICON` (`#organization`), `LOCAL_BUSINESS_CICON` (`#local-business`, emitted sitewide via Footer), `WEBSITE_CICON`, `PERSON_MAJID`. Service pages emit a `@graph` (Org + Person + WebSite + Service + FAQPage + BreadcrumbList) — the exact pattern to reuse for city pages, with `provider: {'@id': '#organization'}` and `areaServed` City nodes.
- **areaServed today is inconsistent** — four shapes: sitewide single `AdministrativeArea: Greater Toronto Area`; about-us 5-city array (the only one with Mississauga); service-page 6-city default; 4 service pages with 8 cities (adds Aurora, Newmarket). GTA is even typed `City` on service pages.
- Pre-existing `@id` collisions to avoid worsening: `#local-business` vs `#localbusiness` (about-us) vs contact-us using `#organization` on a `LocalBusiness` type; two different geo coordinates; `hello@` vs `info@`.

### Design system & conversion
- Service-page kit is the right base: `ServiceHero`, `PaaBlock`, `AntiPitch`, `CapabilitiesGrid`, `ProcessStrip`, `EeatBlock`, `ServiceFaq`, `RelatedServices`, `RelatedPosts`, `GoogleReviews`, `FinalCta`. Tone: blunt, anti-agency, disqualifying, concrete.
- CTA hierarchy already matches the mandate everywhere: WhatsApp green solid (`wa.me/16475840800`) → outline secondary → plain-text tel. "Book a Free Strategy Call" survives only as stale Sanity initialValues (the target page no longer exists — would 404 if an editor re-applied them).
- Contact form = 4-step qualifier POSTing to a GoHighLevel webhook, then `/thank-you/`.
- Analytics = GTM dataLayer shim (no in-repo GA4 config). Existing event names: `contact_form_step_view/complete`, `contact_form_submit`, `contact_path_select`, `phone_click`, `whatsapp_click`, `thank_you_view`. **Gap:** WhatsApp/phone clicks tracked on only 2 pages; 30+ WhatsApp links fire no event.
- No dark/light theme system — dark sections are hardcoded. No sticky CTA except a mobile WhatsApp FAB on `/contact-us/`.

### Existing location signals
- Footer "Service Areas" column: **plain unlinked text** — Richmond Hill, North York, Thornhill, Markham, Vaughan, Aurora, Newmarket.
- FAQ page names Vaughan, Markham, Aurora, Newmarket, North York, Toronto. About page claims "clients across Richmond Hill, Markham, Vaughan, North York, Mississauga."
- City-targeted blog posts: Richmond Hill ×3 (+1 Meta-ads RH post), Vaughan ×2, Toronto ×4, GTA-dental ×2, GTA-trades ×1, GTA-local-SEO ×2.
- **Whitby appears nowhere** in repo or Sanity — nothing to clean up. Pickering, Bolton, King, Stouffville, East Gwillimbury, Scarborough (beyond entity lists/passing blog mentions), Etobicoke: effectively absent.

### Local proof (the constraint that shapes everything)
- Case studies: 8 Sanity docs, 7 are `[Client Name — Placeholder]`; only "Dentistry on Guelph" is real (Guelph — outside the GTA service area). The schema is deliberately **hidden in Studio** ("case studies not publicly disclosed during growth stage") and none render on the live site. → City pages must not surface hidden case-study material without MJ's approval.
- Testimonials (5, hardcoded): none states a city. Client logos (12): no cities attached. No city-specific imagery exists anywhere in `public/` or Sanity.
- Client-location verification from the clients' own public websites is running separately; results feed the location matrix as *pending-approval* proof only.

## 2. Search-demand evidence (GSC, 90 days to 2026-07-24)

Site totals: 69 clicks / 25.3k impressions / avg pos 24.6. City signal:

| Market | Evidence | Read |
|---|---|---|
| Richmond Hill | "digital marketing agency richmond hill" 366 impr pos 14.5 (+ ~350 more across variants); homepage already ranks | Strongest real demand; home market |
| Thornhill | "digital marketing thornhill" 138 impr **pos 48.6**, no page | Clear supply gap — best ROI candidate |
| Vaughan | "google maps seo vaughan" 131 impr pos 23; dental-SEO vaughan ~35 impr; "contractor marketing agency vaughan" | Maps/dental/trades intent, page-worthy |
| GTA (region) | "google ads services gta" 204 impr; "digital marketing gta" 46; "gta seo" 36+22 | Hub-level target |
| Toronto | Large but almost entirely **dental-service** intent ("dental marketing toronto" 282, dozens more) | Serve via dental service page + hub, not a generic Toronto page |
| Mississauga | "canadian dental seo mississauga" 97, "dental seo marketing mississauga" 65 | Dental intent only — hub-only confirmed |
| Scarborough | "local seo scarborough" 32 impr pos 32.9 | Real early signal, supports Tier 2A |
| Etobicoke | "local seo etobicoke" 14 impr | Weak; hub-only confirmed |
| Markham | ~9 impr ("meta ads markham") | Near-zero current visibility despite proximity |
| Aurora, Newmarket, North York, Pickering, Bolton, King, Stouffville, E. Gwillimbury | zero / single-digit impressions | No current demand capture; publish only on proof |
| Whitby | 1 impression in 90 days | Removal from GBP is well-founded |

## 3. Opportunities
1. `/areas-served/` hub can immediately consolidate the scattered location claims (footer text, FAQ, about) into one crawlable, linkable surface — and the footer column converts from dead text to real links.
2. Richmond Hill & Thornhill & Vaughan are adjacent, credible, and demand-backed — a coherent home-turf cluster.
3. The Sanity draft-status sitemap gating pattern already exists; replicating it in a repo-side content model gives a build-time quality gate for free.
4. Adding `whatsapp_click`/`phone_click` tracking on new pages closes part of a sitewide measurement gap using established event names.
5. The `areaServed` schema inconsistency can be rationalized as part of this work (single source of truth).

## 4. Risks
1. **Doorway risk** is real if all 7 Tier 1 pages ship at once with placeholder proof — mitigated by the quality gate: only proof-passing pages get `indexable: true`.
2. **Cannibalization — Richmond Hill:** the homepage title is literally "Digital Marketing Agency, Richmond Hill GTA", and two near-duplicate RH blog posts exist (`digital-marketing-agency-richmond-hill` and `…-in-richmond-hill-2026`). A RH city page makes a 4-way overlap. Mitigation: city page targets local-intent + NAP depth (address, directions, home-market proof); recommend consolidating the older RH blog post later.
3. **Client confidentiality:** case studies were intentionally hidden. City pages must not name clients or attach cities to them without MJ's explicit approval — even where the client's location is publicly verifiable.
4. **No layout component** means head-boilerplate duplication; a typo in one copy diverges silently. Kept identical to service template; noted for future refactor.
5. Footer already *claims* Aurora/Newmarket/etc. as service areas — dropping them from the footer could feel like a regression to MJ; instead the hub represents them honestly as coverage without dedicated pages.
6. Existing entity hygiene issues (privacy-policy shows a different street address — 69 Cartier Crescent vs 131 Golf Club Ct; `defaults.ts` fallback phone `+1 (905) 884-5060`; `hello@` vs `info@`; geo drift) — flagged for MJ, not silently changed.

## 5. Recommended architecture (implemented)
- Hub `/areas-served/` + spokes `/areas-served/{city-slug}/`, driven by a single typed data module (`src/lib/areas-served.ts`) with a build-time quality gate; only `status: "published" && indexable` pages enter the sitemap (new `areas-sitemap.xml` registered in the index) and receive hub/footer links.
- Schema: per-city `Service` node (`provider` → existing `#organization`), `areaServed` as `City`, BreadcrumbList + FAQPage, **no** per-city PostalAddress/geo, no new LocalBusiness entities.
- CTAs: WhatsApp primary, form second, tel third — matching the sitewide pattern, with dataLayer events.

## 6. Missing inputs (MJ decisions needed)
1. **Client-city associations:** may CiCon publicly attach any client names to cities (e.g. on a Markham or Bolton page)? Case studies are currently hidden as policy.
2. **Thornhill proof:** one Thornhill-area client reference or approval to publish the page on market-knowledge basis alone (demand gap is proven: 138 impr @ pos 49).
3. Whether Aurora/Newmarket/North York pages should wait for proof (current recommendation) despite being in the footer today.
4. Approval to consolidate the older Richmond Hill blog post (`digital-marketing-agency-richmond-hill`) into the 2026 version to reduce RH cannibalization.
5. Confirm the privacy-policy street address (69 Cartier Crescent vs 131 Golf Club Ct) — likely stale, but not changed without confirmation.
