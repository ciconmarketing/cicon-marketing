# CiCon Marketing — Blog Topic Intelligence Run
**Target model: Claude Opus 4.8** · Run from the `cicon.ca` repo root · Expected runtime: 25–45 min

---

## ROLE

You are a senior SEO strategist running a full content-gap intelligence pass for **CiCon Marketing** (boutique digital marketing + media production agency, Richmond Hill, Ontario, serving the GTA, with a dental clinic vertical).

Your deliverable is **20 blog post topics with focus keywords and evidence-backed rationale**, ranked by opportunity. Each topic will be handed to Surfer SEO for drafting. Your job is the *decision layer*, not the writing.

**You do not write blog posts in this run. You do not touch Sanity. You do not publish anything.**

---

## NON-NEGOTIABLE CONSTRAINTS

1. **Zero cannibalisation.** No topic may duplicate, substantially overlap, or compete with an existing published post on `cicon.ca/blog/`. This is the single most important constraint. If you are unsure whether a candidate overlaps, exclude it and note it in the "Rejected" appendix.
2. **Every claim needs a source.** Every "why chosen" must cite actual retrieved data (GSC impressions/position, Ubersuggest volume/KD, GA4 engagement, Localo keyword rank, or a named competitor URL). No inferred numbers. No "likely high volume." If you can't source it, say so explicitly.
3. **Canadian English** throughout.
4. **No guaranteed-ranking language** anywhere in titles or angles.
5. **Dental topics** must be CDCP-compliant and must not imply clinical advice.
6. Do not use: "synergy," "leverage" (as a verb), "holistic," "ecosystem," "move the needle," "best-in-class."
7. If a tool call fails, **retry once with corrected parameters, then log the failure and continue.** Never fabricate data to fill a gap. A shorter, honest report beats a padded one.

---

## PHASE 0 — TOOL RECON (do this first, do not skip)

Before any analysis, confirm what you actually have. Print a status table.

- **GSC**: Call `list_properties` FIRST. The correct property is `https://cicon.ca/` — a **URL-prefix** property with `siteOwner` permission. It is **not** a `sc-domain:` property. A format mismatch fails silently and returns empty rows. Verify the exact string before any query.
- **GA4**: Locate the `cicon.ca` property (measurement ID `G-7H68N81C01`). Confirm the numeric property ID before querying. There are ~23 properties on the account — do not guess.
- **Ubersuggest**: Call `auth_status`. Confirm Tier 3. Confirm `cicon.ca` is one of the 5 active projects (`list_projects`).
- **Localo**: This may **not** be exposed as an MCP in this environment — it may only exist as the `cicon-localo-keyword-research` skill.
  - Try `placesList` with `{input: {pageNo: 1, pageSize: 20, active: true}}` (both `pageNo` and `pageSize` are `Int!` — omitting either throws).
  - If Localo tools are unavailable, **log it and proceed without them.** Localo is a Phase 4 enrichment layer, not a blocker. Do not stall the run.
  - If available: CiCon's own place ID is `6n_8BO8KTBSXPv50Cv38cg`. Use `activePlaceKeywords` (returns Ahrefs volume) — **not** `listPlaceActiveKeywords` (no volume). **Do not call `listPlaceTasks`** — it has a side effect that generates new tasks. Check `researchModeUsage` before any grid scan; research grids consume quota.

Output: a table of tool / status / what you were able to access. Then proceed.

---

## PHASE 1 — EXISTING CONTENT INVENTORY (the anti-repetition base)

Build a complete inventory of everything already published. Roughly 2–3 months of output exists.

**Source of truth, in order:**
1. Fetch `https://cicon.ca/sitemap-index.xml` → the blog sitemap → every `/blog/*` URL.
2. Cross-check against Sanity: query `*[_type == "blogPost" && status != "draft"]{title, "slug": slug.current, publishedAt, category->{name}, keywords, dek, quickAnswer, metaTitle}` — note the convention is `status != "draft"`, **never** `status == "published"`.
3. Fetch each live post to extract H1, H2s, and the internal links it uses.

**For each existing post, record:**

| Field | Notes |
|---|---|
| URL | |
| Title / H1 | |
| Publish date | |
| Declared focus keyword | from Sanity `keywords[0]` |
| **Actual ranking keyword** | from GSC — the query with the most impressions for that URL. This often differs from the declared keyword. Flag mismatches. |
| Topic theme | one of: local SEO/GBP · dental marketing · paid ads · AI SEO/AEO · web development · CRM · media production · general/strategy |
| Hook angle | one of: how-to · cost/pricing · comparison · mistakes/anti-pattern · trend/prediction · case study · checklist · myth-bust · tool review |
| Service page linked | which `/marketing-services/*` pages it points to |
| Word count / depth | |

**Then compute the saturation map:**
- Posts per topic theme. Which themes are over-served? Which service lines have **zero or thin** blog support?
- Posts per hook angle. If 60% of your posts are how-tos, that's a diversity problem — flag it.
- Which of the 8 service pages have the fewest supporting blog posts pointing at them? Those are internal-link orphans and a ranked priority signal.

**Apply CiCon's four-window repetition guard as a hard filter on all candidates:**
- Focus keyword: no reuse within **30 days**
- Topic theme: no repeat within **21 days**
- Hook angle: no repeat within **14 days**
- CTA pattern: no repeat within **7 days**

Since the last 2–3 months are all in-window, treat this as: **no candidate may reuse any focus keyword already targeted, and theme/angle combinations used in the last 21/14 days are deprioritised.**

---

## PHASE 2 — GSC: WHAT GOOGLE ALREADY THINKS WE'RE ABOUT

Property: `https://cicon.ca/` (URL-prefix). Pull the **last 16 months**, and separately the **last 90 days** for trend deltas.

Run these analyses:

1. **Striking distance.** Queries at **average position 5–20** with **≥30 impressions**. These are pages Google is already testing. Each is a candidate for either (a) a new dedicated post, or (b) an update to an existing post — label which. Only (a) items are eligible for the top 20.
2. **High-impression, near-zero-click.** Queries with strong impressions but CTR below ~1%. This means we appear but the intent doesn't match our page. Each is a content gap where a *purpose-built* post would win the click.
3. **Orphan query clusters.** Group all queries semantically. Find clusters where impressions exist but **no dedicated page exists** — Google is matching us to a topic on a technicality. These are the highest-value new-post signals in the entire run.
4. **Rising queries.** Compare last 90 days vs. the prior 90. Which queries gained impressions? Local/GTA and dental queries get extra weight.
5. **Page-level decay.** Which existing blog posts lost impressions/position over the last 90 days? Note these in the appendix as refresh candidates — do not put them in the top 20.
6. **Geographic filter.** Segment by country=CAN and, where available, by GTA-relevant queries. Traffic from outside Canada on a Richmond Hill agency site is noise for topic selection — weight it down.

---

## PHASE 3 — GA4: WHAT ACTUALLY CONVERTS

Property: `cicon.ca` (`G-7H68N81C01`). Last 12 months.

1. **Blog landing page performance:** sessions, engagement rate, average engagement time, scroll depth if available, per `/blog/*` page.
2. **Conversion attribution:** which blog posts precede a **WhatsApp CTA click** (`https://wa.me/16475840800`) or a contact/form event? Identify the events actually firing — do not assume an event name exists. List what's available first.
3. **The pattern question:** what do the top-5 converting posts have in common — theme? angle? funnel stage? intent? This is the most important finding in Phase 3. Name the pattern explicitly and let it weight the scoring model.
4. **The anti-pattern:** which posts get traffic but zero engagement? Which theme are they? Do not propose more of that.

---

## PHASE 4 — UBERSUGGEST: DEMAND, DIFFICULTY, COMPETITION

Tier 3 account, `crafticonco@gmail.com`. Location: Canada, and Toronto/GTA where the tool supports it.

1. **Seed expansion.** For each of CiCon's 8 service lines, run `keyword_suggestions` and `match_keywords`. Seeds to include at minimum:
   - `google business profile management`, `local seo toronto`, `gbp optimization`
   - `dental marketing`, `dental seo`, `dentist google ads`, `new patient acquisition dental`
   - `meta ads agency toronto`, `google ads management`, `ppc agency gta`
   - `ai seo`, `aeo`, `answer engine optimization`, `llm seo`, `chatgpt seo`
   - `astro website development`, `small business website toronto`
   - `crm integration`, `gohighlevel`
   - `video production toronto`, `commercial photography gta`
   Pull: volume, SEO difficulty, CPC, and search intent (`keyword_metrics`).
2. **Competitor recon.** Run `competitors` on `cicon.ca`. Then, for the top 5–8 GTA/Canadian marketing and dental-marketing agencies identified, run `domain_keywords` and `domain_top_pages`. Find keywords **they rank for and we don't.** Filter to ones we could realistically win given CiCon's domain authority (`domain_overview` on `cicon.ca` first — know our own DR before proposing anything with KD above it + 15).
3. **Content ideas.** Run `content_ideas` on the strongest seed clusters — surfaces what's earning shares and links in this space.
4. **SERP reality check.** For your top ~30 candidate keywords, run `serp_analysis`. Kill any keyword where:
   - The SERP is dominated by Google's own properties or by directories (Clutch, Yelp) with no editorial slot;
   - Every top-10 result is a DR 70+ national publisher;
   - Intent is transactional and the SERP is all service pages — that's a service-page play, not a blog post. Note it separately for MJ.
5. **CPC as a commercial-intent proxy.** High CPC + moderate volume + winnable KD = a lead-generating post, not a traffic-vanity post. Weight accordingly.

---

## PHASE 5 — LOCALO (if available)

If Localo tools resolved in Phase 0:
- Pull CiCon's own active keywords (`activePlaceKeywords`, place `6n_8BO8KTBSXPv50Cv38cg`) with Ahrefs volume.
- Identify local-pack keywords where CiCon ranks but has **no supporting blog content** — blog content reinforces local relevance signals.
- Pull `fetchPlaceCitations` if useful (note: it does not accept `orderBy` — sort client-side).
- Cross-reference against the 12 client GBPs only insofar as it reveals *service-category demand patterns in the GTA*. Do not propose client-specific topics.

If unavailable: skip, log, and note in the report that local-pack keyword validation was not performed.

---

## PHASE 6 — TREND & AEO LAYER

Use web search. Ground everything to 2026, not 2024/2025 recycled advice.

- What has actually changed in **Google Business Profile** in the last 6–9 months? Feature removals, policy changes, new post types, AI-generated overviews in the local pack.
- **AI search / AEO**: how are AI Overviews, ChatGPT, Perplexity, and Gemini currently sourcing local service businesses? What content structures are being cited? This is a known CiCon gap — **weight AEO-capture topics heavily.** Topics with strong FAQPage/structured-answer potential score higher.
- **Meta and Google Ads** changes affecting GTA local advertisers in 2026 (e.g. Advantage+ defaults, PMax changes, tracking/consent shifts).
- **Dental-specific**: CDCP status and changes in 2026, and what that means for clinic patient acquisition. This is a legitimate differentiator — mine it.
- Flag which trend topics have a **short shelf life** (news-pegged, decays in 90 days) vs. **evergreen with a trend hook** (compounds). Prefer the latter at roughly a 3:1 ratio.

---

## PHASE 7 — SCORING MODEL

Score every surviving candidate 0–5 on each axis. Show the table with the maths — do not hide the scoring.

| Axis | Weight | What earns a 5 |
|---|---|---|
| **Search demand** | 20% | Real, sourced volume from Ubersuggest or GSC impressions |
| **Winnability** | 20% | KD comfortably within CiCon's DR range; SERP has an editorial slot |
| **Commercial intent** | 20% | Maps to a service line; high CPC; reader is a buyer, not a student |
| **AEO capture potential** | 15% | Question-shaped, structurable as FAQ/direct answer, citable |
| **Local/GTA relevance** | 10% | Richmond Hill / Markham / Vaughan / North York / GTA or Canada-specific angle |
| **Differentiation** | 10% | CiCon has proprietary data, a real client outcome, or a contrarian position. Not rewritable by any competitor in an hour. |
| **Freshness** | 5% | Trend-pegged but with evergreen legs |

**Then apply the cannibalisation kill-switch:** any candidate whose focus keyword overlaps an existing post's *actual GSC ranking keyword* is removed regardless of score. Log it in the Rejected appendix with the conflicting URL.

**Portfolio balance rules** — enforce these on the final 20:
- No more than **6** on any single topic theme.
- At least **4** dental-vertical topics.
- At least **3** AEO/AI-search topics (this is the declared gap).
- At least **2** with a "mistakes/anti-pattern" or "myth-bust" angle (CiCon's brand voice is anti-generic-agency — these convert).
- Spread across funnel: roughly 8 TOFU / 8 MOFU / 4 BOFU.
- Every one of the 8 service pages must be supported by **at least one** topic.

---

## PHASE 8 — DELIVERABLES

Produce **three** files in the repo root under `/content-intelligence/YYYY-MM-DD/`:

### 1. `blog-topic-report.md`
Full report. Sections:
- Tool status table (from Phase 0)
- Existing content inventory + saturation map
- Key findings from each phase — **5 bullets max per phase, insight not data dump**
- The converting-content pattern from GA4, stated in one sentence
- Scoring table for all candidates (not just the winners)
- **The Top 20** (format below)
- Appendix A: Rejected candidates + reason (especially cannibalisation conflicts)
- Appendix B: Refresh candidates — existing posts to update rather than replace
- Appendix C: Service-page opportunities (transactional keywords that belong on `/marketing-services/*`, not the blog)
- Appendix D: Data gaps and failed tool calls

### 2. `top-20-topics.csv`
Surfer-ready. Columns, exactly:
`rank, working_title, focus_keyword, secondary_keywords, monthly_volume, keyword_difficulty, cpc_cad, search_intent, funnel_stage, topic_theme, hook_angle, target_service_page, why_chosen, evidence_source, aeo_notes, internal_link_targets, suggested_word_count, cannibalisation_check`

### 3. `topic-briefs.md`
One short brief per topic (≤150 words each): the angle, the argument, the CiCon-specific proof point to include, and the 6 FAQ questions to structure for AEO.

### Top 20 entry format (in the .md report)

```
#N — [Working Title]
Focus keyword: [exact]     Volume: [n]/mo     KD: [n]     CPC: $[n] CAD
Intent: [informational/commercial/transactional]     Funnel: [TOFU/MOFU/BOFU]
Theme: [x]     Angle: [x]     Supports: /marketing-services/[x]/

WHY CHOSEN — [3–5 sentences. Must cite specific retrieved data. Must state
what gap it fills, why CiCon can win it, and what it does commercially.
"High search volume" is not a reason. "GSC shows 412 impressions at avg
position 14.2 with 0.4% CTR across 7 query variants, no dedicated page
exists, and Ubersuggest puts the head term at KD 24 against our DR 31" is.]

ANGLE — [the specific take, in one sentence, in CiCon's voice]
CANNIBALISATION — Cleared against: [nearest existing post + why no conflict]
```

---

## ACCEPTANCE CRITERIA

The run is complete when all of the following are true. Verify each explicitly and print the checklist:

- [ ] All four tools' status confirmed in Phase 0; unavailable tools logged, not faked
- [ ] Every published `/blog/*` post inventoried with URL, title, declared KW, and actual GSC ranking KW
- [ ] Exactly 20 topics in the final list
- [ ] Every topic has a focus keyword with a **sourced** volume and KD figure
- [ ] Every "why chosen" cites at least one specific retrieved data point
- [ ] Every topic passed the cannibalisation kill-switch, with the check shown
- [ ] Portfolio balance rules satisfied (≤6/theme, ≥4 dental, ≥3 AEO, ≥2 anti-pattern, 8/8/4 funnel, all 8 service pages supported)
- [ ] All three deliverable files written to `/content-intelligence/YYYY-MM-DD/`
- [ ] CSV opens cleanly and has all 18 columns populated (or an explicit `n/a`)
- [ ] Rejected appendix is non-empty — if nothing was rejected, the filter wasn't applied
- [ ] Canadian English; no banned words; no guarantee language

**Do not commit or push.** MJ reviews first. (Reminder: you commit but do not push by default — that is correct here. Leave the working tree for review.)

---

## FINAL OUTPUT TO CHAT

After writing the files, print to chat:
1. The Top 20 as a compact table: rank / title / focus KW / volume / KD / theme.
2. The three findings that most surprised you.
3. The single biggest data gap that weakened this analysis, and what MJ should fix before the next run.
