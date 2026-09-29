# Service pricing update — release record (2026-09-29)

Status: **Live on `https://cicon.ca` as of 2026-09-29.** The 22 Sanity documents
were published. Git commit `6de7ec5` was pushed to `main`. Vercel production
deployment `dpl_kb8biR2Z4h5k64168KTFEbuznXWN` reached Ready and serves the
live domain.

The page copy for the service pages, services hub, contact page and six blog
posts lives in Sanity (project `26ol0sqj`, dataset `cicon-marketing`). The
changes for this update were published from these reviewed patches:

| File | What it is |
|---|---|
| `sanity-patches.json` | 22 Sanity `patch` mutations (171 field changes). Each patch carries `ifRevisionID`, so it only applies to the exact document revision that was reviewed. |
| `content-changes.md` | Human-readable before/after for every field in the patches. |

Prices themselves are **not** in Sanity. They live in `src/lib/service-pricing.ts`,
which drives the hub cards, the hero price line, the `#pricing` section, the
cost FAQ and the Offer JSON-LD on every service page. The patches only remove
old prices from CMS copy and fix copy that conflicted with the new offers.

## Local preview method used before release

```bash
npm run content:snapshot     # read-only export of the published dataset
npm run dev:local-content    # applies these patches to a local copy and serves it
```

`dev:local-content` points `@sanity/client` at a read-only local stand-in
(`scripts/local-content/local-sanity-client.mjs`) via a Vite alias in
`astro.config.mjs`. Nothing is written to Sanity; write methods throw.
The alias is inactive unless `LOCAL_CONTENT_DATASET` is set, and never on Vercel.
The revision guards in `sanity-patches.json` now reject a fresh published
snapshot because the content has already been published. Use `npm run dev` to
view current published content.

## Release record

1. A fresh published-content snapshot matched all 22 original revisions.
   The patches were saved as 22 Sanity drafts and then all 22 were published.
   No unrelated drafts were touched.
2. The tested code was committed, pushed to the release branch, and then
   pushed to `main`. Vercel built the production site. The live hub, all 14
   service routes, FAQs and structured data passed 20/20 pricing checks.
   The live CRO page has no unsupported 2–5×, 20–50%, or 30–50% lift claim.
3. Contact forms (code change, not Sanity): the GoHighLevel side is done.
   Workflow "Interactive Lead Form" → Create Contact maps `budgetPeriod` →
   Budget Period, `budget` → Budget Range (text, accepts `under_1k`), and
   `budgetLabel` → Budget Details, plus the existing fields. The live contact
   page includes these fields and the separate ad-spend note.
4. The controlled test sent 4 contacts. Payloads were recorded for all 4;
   an HTTP 200 was recorded for test 1 only. All 4 contacts, their budget
   fields, and their opportunities were independently checked in the CRM.
   After release, a CRM search found no `CiCon Pricing Test` contacts or
   opportunities. The New Client stage had 13 opportunities.
