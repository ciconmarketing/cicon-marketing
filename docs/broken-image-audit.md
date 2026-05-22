# Broken Image Audit — Post-DNS-Cutover
**Date:** 2026-05-21  
**Root cause:** WordPress media library at `cicon.ca/wp-content/uploads/` is gone after DNS cutover to Astro/Vercel. All images that were stored in WP (or referenced via the old domain) now 404.

---

## Summary

| Location | Count | Type |
|---|---|---|
| Sanity — `blogPost.heroImage.url` | **12** | Visible hero images (broken on every blog post card + post page) |
| Repo — in-page `<img>` | **1** | Visible image on Free Map Check hero |
| Repo — OG/Twitter meta tags | **3** | Broken social share previews |
| Repo — JSON-LD schema | **1** | Organization logo in structured data (invisible, but bots 404) |
| Repo — fallback data (Sanity-down only) | **2** | Only shown if Sanity is completely unreachable |
| **TOTAL REFERENCES** | **19** | 13 visible · 3 meta · 1 JSON-LD · 2 fallback-only |

**No WP image URLs were found in:** Sanity body content (all 13 posts have clean body), service pages, homepage, contact page, about page, servicesHub, freeMapCheckPage Sanity document.

**Same image referenced multiple times:**
- `journalist2Fa6c9972a…thumbnail-1024x576.jpeg` → Sanity post `local-seo-agency-toronto-guide-2026` **+** `blog-fallback.ts` **+** `blog/index.astro` og:image fallback (3 refs, 1 underlying image)
- `journalist2Fd88e642a…thumbnail-1024x576.jpeg` → Sanity post `meta-ads-agency-how-to-use` **+** `blog-fallback.ts` (2 refs, 1 underlying image)

---

## Section 1 — Sanity Documents

All 12 broken references are in `blogPost` documents, field: `heroImage.url` (a plain URL string field, **not** a Sanity asset reference). These show as broken images on:
- The blog index card grid
- The blog post `<og:image>` / `<twitter:image>` meta
- The blog post hero section

| # | Document slug | Sanity `_id` | Broken URL (filename only) |
|---|---|---|---|
| 1 | `google-ads-management-gta-trades-spring-checklist` | `1ed98220-…` | `Google-Ads-Management-for-GTA-Trades-7.jpg` |
| 2 | `cafe-for-working-near-me` | `579ad57e-…` | `journalist2Fe12267fe-…/thumbnail.jpeg` |
| 3 | `dental-marketin-canada-guide-2026` | `590111b1-…` | `408514bb-f12b-40c3-8628-8e80279cb3de.png` |
| 4 | `marketing-for-dental-clinics-a-practical-growth-playbook` | `59e37ac6-…` | `90f89f70-4c0b-46e2-a619-dce5734c9bae.jpg` |
| 5 | `dental-seo-services-cdcp-renewal-gta` | `69a30d51-…` | `The-CDCP-renewal-window-opens-April-15-2026-…jpg` |
| 6 | `social-media-marketing-for-canadian-business-owners-2026-guide` | `7533247b-…` | `journalist2Fa66925e8-…/thumbnail.jpeg` |
| 7 | `why-local-seo-is-important-and-how-to-do-it-in-2026` | `a3d433b5-…` | `The-2026-Visibility-Crisis-.jpg` |
| 8 | `local-seo-agency-toronto-guide-2026` | `bc23e88d-…` | `journalist2Fa6c9972a-…/thumbnail-1024x576.jpeg` ⚠️ ×3 |
| 9 | `digital-marketing-agency-in-richmond-hill-2026` | `c342ee7b-…` | `The-CiCon-Marketing-Advantage.jpg` |
| 10 | `digital-marketing-agency-strategies-2026` | `ccda8266-…` | `journalist2F40f3f197-…/thumbnail-1.jpeg` |
| 11 | `seo-optimization-near-me-2026` | `e55515a9-…` | `users2F307f6e6d-…/SEO20Optimization20Near20Me202.jpg` |
| 12 | `meta-ads-agency-how-to-use` | `f07ce703-…` | `journalist2Fd88e642a-…/thumbnail-1024x576.jpeg` ⚠️ ×2 |

**1 post with a working image (no action needed):**
- `how-to-make-landing-page-design-work-in-2026-budget-guide` (`XegcMa4U…`) — uses a Vercel Blob Storage URL ✅

**Full WP URLs for reference:**
```
1.  https://cicon.ca/wp-content/uploads/2026/03/Google-Ads-Management-for-GTA-Trades-7.jpg
2.  https://cicon.ca/wp-content/uploads/2026/04/journalist2Fe12267fe-5e1b-4d0c-8a36-cd2c9aca6b4c2Fthumbnail.jpeg
3.  https://cicon.ca/wp-content/uploads/2026/04/408514bb-f12b-40c3-8628-8e80279cb3de.png
4.  https://cicon.ca/wp-content/uploads/2026/03/90f89f70-4c0b-46e2-a619-dce5734c9bae.jpg
5.  https://cicon.ca/wp-content/uploads/2026/03/The-CDCP-renewal-window-opens-April-15-2026-e1773865069103.jpg
6.  https://cicon.ca/wp-content/uploads/2026/04/journalist2Fa66925e8-3a80-402c-9f68-54c15bd0ab1a2Fthumbnail.jpeg
7.  https://cicon.ca/wp-content/uploads/2026/03/The-2026-Visibility-Crisis-.jpg
8.  https://cicon.ca/wp-content/uploads/2026/05/journalist2Fa6c9972a-093d-40f0-a397-a8e4d4795e602Fthumbnail-1024x576.jpeg
9.  https://cicon.ca/wp-content/uploads/2026/03/The-CiCon-Marketing-Advantage.jpg
10. https://cicon.ca/wp-content/uploads/2026/04/journalist2F40f3f197-a414-4766-b886-cd773a1703b22Fthumbnail-1.jpeg
11. https://cicon.ca/wp-content/uploads/2026/04/users2F307f6e6d-4afe-4722-8da1-9af85f6facd82Flibrary2F95f06145-fead-4f7f-92ec-b4a53610b8ed2FSEO20Optimization20Near20Me202.jpg
12. https://cicon.ca/wp-content/uploads/2026/05/journalist2Fd88e642a-6533-4fba-bd59-1b624bce75052Fthumbnail-1024x576.jpeg
```

---

## Section 2 — Repo Files

### 2a. Visible broken image — HIGH priority

**File:** `src/pages/check-google-map-visibility-for-free.astro`  
**Line:** 227  
**Type:** `<img>` tag — visible in the page hero, above the fold  
**Alt text:** "Dashboard interface of a local SEO rank tracking tool showing a geographical Position Map with circular heat map markers in green and orange, indicating search ranking positions across a city area."  
**Broken URL:**
```
https://cicon.ca/wp-content/uploads/2026/03/google-maps-visibility-heat-map-audit-1-768x355.jpg
```

---

### 2b. Broken OG/Twitter meta images — MEDIUM priority

Social share previews will show broken image or nothing.

| File | Line | Tag | Broken URL |
|---|---|---|---|
| `src/pages/check-google-map-visibility-for-free.astro` | 147 | `og:image` | `Google-Map-Visibility-for-Free-3-3.jpg` |
| `src/pages/check-google-map-visibility-for-free.astro` | 151 | `twitter:image` | `Google-Map-Visibility-for-Free-3-3.jpg` |
| `src/pages/blog/index.astro` | 83 | `og:image` fallback | `journalist2Fa6c9972a-…/thumbnail-1024x576.jpeg` (only used if Sanity returns no featured post) |

---

### 2c. JSON-LD schema — LOW priority

Not a visible image but Google may 404 on it when validating structured data.

**File:** `src/lib/schema-constants.ts`  
**Line:** 23  
**Field:** `ORG_CICON.logo.url`  
**Broken URL:**
```
https://cicon.ca/wp-content/uploads/2025/12/primary-color-icon.svg
```
**Fix:** Replace with `/logo-cicon.jpg` (already in `public/`) or upload logo SVG to Sanity/Vercel Blob.

---

### 2d. Fallback data — LOW priority (only fires if Sanity is down)

**File:** `src/lib/blog-fallback.ts`  
| Line | Post slug | Broken URL |
|---|---|---|
| 9 | `local-seo-agency-toronto-guide-2026` | `journalist2Fa6c9972a-…/thumbnail-1024x576.jpeg` |
| 19 | `meta-ads-agency-how-to-use` | `journalist2Fd88e642a-…/thumbnail-1024x576.jpeg` |

---

## Section 3 — Recommended Replacement Strategy (for your decision)

The 12 Sanity hero images fall into two categories:

**Category A — Original branded/editorial images (7 posts):** Filenames suggest these were real photos or graphics created for CiCon content (`Google-Ads-Management-for-GTA-Trades-7.jpg`, `The-CDCP-renewal-window-opens-April-15-2026.jpg`, `The-2026-Visibility-Crisis-.jpg`, `The-CiCon-Marketing-Advantage.jpg`, `408514bb-…png`, `90f89f70-…jpg`, `SEO20Optimization20Near20Me202.jpg`). **Best option:** recover originals from old WP media library export if available, or regenerate.

**Category B — AI/journalist-sourced thumbnails (5 posts):** Filenames contain `journalist2F` and `users2F` patterns — these were AI-generated/stock images proxied through an external service. Original source URLs are URL-encoded in the WP path. **Best option:** regenerate with AI (Gemini, DALL-E) or use royalty-free stock (Unsplash/Pexels).

**Options ranked by effort:**
1. **AI regeneration** (recommended) — generate new hero images per post with consistent brand style; upload to Sanity as proper assets
2. **Stock photos** — grab relevant Unsplash photos for each post topic; quick but generic  
3. **Placeholder banner** — add a branded placeholder per category (dental, SEO, paid ads) as a stop-gap while real images are sourced

---

## Action Checklist (post-audit)

- [ ] Decide on replacement strategy (AI / stock / placeholder)
- [ ] Replace 12 Sanity `heroImage.url` fields — one by one in Studio or via bulk patch
- [ ] Replace visible `<img>` in `check-google-map-visibility-for-free.astro:227`
- [ ] Fix OG/Twitter meta on `check-google-map-visibility-for-free.astro` (lines 147, 151)
- [ ] Fix `ORG_CICON.logo` in `schema-constants.ts` → `/logo-cicon.jpg`
- [ ] Update `blog-fallback.ts` hero URLs to point to replacements (or use `/logo-cicon.jpg` as stopgap)
- [ ] Update `blog/index.astro:83` og:image fallback
