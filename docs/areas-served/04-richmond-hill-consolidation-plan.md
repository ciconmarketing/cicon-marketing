# Richmond Hill Cannibalization — Consolidation Recommendation (NOT YET EXECUTED)

**Date:** 2026-07-24 · Status: awaiting MJ review. No blog redirect has been created.

## The problem, in numbers (GSC, 180 days to 2026-07-24, query "digital marketing agency richmond hill" + close variants)

Google is splitting the money query across **seven** URLs:

| URL | Impr. (head query) | Avg pos | Role today |
|---|---|---|---|
| `/` (homepage) | 536 | 18.9 | De-facto RH page (title says "Richmond Hill GTA") |
| `/marketing-services/` | 148 | 39.4 | Accidental |
| `/blog/digital-marketing-agency-richmond-hill/` | 75 | **5.6** | Older post — best position of any URL |
| `/contact-us/` | 58 | 66.3 | Accidental |
| `/digital-marketing-agency-in-richmond-hill-2026/` (flat legacy URL) | 37 | 46.1 | Already 301s to the 2026 blog post, but still surfacing |
| `/about-us/` | 21 | 55.3 | Accidental |
| `/blog/digital-marketing-agency-in-richmond-hill-2026/` | 7 | 10.4 | Newer post (more total impressions page-wide: 415 @ 14.7 over 90d, vs 595 @ 9.5 for the older post) |

When Google can't decide which page answers a query, none of them wins — 0 clicks on the head query outside the homepage in 180 days.

**Backlink evidence:** cicon.ca has DA 9 and 12 referring domains total (9,079 backlinks, almost all from those few domains). Neither blog post has meaningful page-level link equity, so consolidation direction can be chosen purely on performance + slug quality — no equity constraint.

## Recommendation

**Retain:** `/blog/digital-marketing-agency-richmond-hill/`
- Best average position on the head query (5.6 vs 10.4)
- More page-level impressions (595 vs 415 over 90 days)
- Evergreen slug — no baked-in year to go stale every January

**Merge in from the 2026 post:** its updated frameworks/sections, any FAQs not present in the older post, and the fresher metadata angle. After the merge, update the retained post's `metaTitle`/`metaDescription` (55–62 / 130–160 chars) and Sanity `_updatedAt` so lastmod reflects the refresh.

**Reframe the survivor as informational**, e.g. "How to Choose a Digital Marketing Agency in Richmond Hill (2026 Guide)" — it should win the research intent and hand commercial intent to the area page, not compete with it.

**Proposed redirects (2 rules, on execution only):**
1. `/blog/digital-marketing-agency-in-richmond-hill-2026/` → 301 → `/blog/digital-marketing-agency-richmond-hill/`
2. Update the existing rule `/digital-marketing-agency-in-richmond-hill-2026/` → currently points at the 2026 blog URL → repoint **directly** at `/blog/digital-marketing-agency-richmond-hill/` (avoids a 2-hop chain; the flat URL still gets ~37 impressions).

**Keyword intent per surviving URL:**
| URL | Assigned intent |
|---|---|
| `/areas-served/richmond-hill/` | **Commercial:** "digital marketing agency richmond hill", "digital advertising * richmond hill on" cluster, near-me variants. The NAP-backed conversion surface. |
| `/` | Brand + "boutique marketing agency GTA". Longer term: soften the homepage title's "Richmond Hill" emphasis once the area page holds rankings (do not change now). |
| `/blog/digital-marketing-agency-richmond-hill/` (merged) | **Informational:** choosing/evaluating an agency in Richmond Hill. |
| `/blog/google-business-profile-optimization-richmond-hill-2026/` | GBP-specific intent — untouched. |

**Internal-link changes on execution:**
- Merged post: primary in-content CTA links point to `/areas-served/richmond-hill/` (commercial handoff) + Local SEO service page.
- `/areas-served/richmond-hill/` proof section: swap its link from the 2026 post to the merged survivor.
- Any other internal links to the 2026 URL (none found in repo code; check Sanity post bodies before executing) get updated to the survivor.

**Sequencing:** execute 2–4 weeks **after** the areas-served launch, once GSC shows the area page entering the results — one consolidation variable at a time.

## Execution checklist (for when approved)
1. Merge content in Sanity (survivor post), update metadata, set 2026 post to draft.
2. Add/update the two `vercel.json` redirect rules above.
3. Update the area-page proof link in `src/lib/areas-served.ts`.
4. Deploy, then request re-crawl of both URLs in GSC.
5. Annotate in GA4; review the head query's page split after 30 days.
