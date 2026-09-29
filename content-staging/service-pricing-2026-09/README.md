# Service pricing update — staged Sanity content (2026-09-28)

Status: **staged locally for owner review. Not applied to Sanity. Not deployed.**

The page copy for the service pages, services hub, contact page and six blog
posts lives in Sanity (project `26ol0sqj`, dataset `cicon-marketing`). The
changes for this update are staged here instead of being written to the CMS:

| File | What it is |
|---|---|
| `sanity-patches.json` | 22 Sanity `patch` mutations (171 field changes). Each patch carries `ifRevisionID`, so it only applies to the exact document revision that was reviewed. |
| `content-changes.md` | Human-readable before/after for every field in the patches. |

Prices themselves are **not** in Sanity. They live in `src/lib/service-pricing.ts`,
which drives the hub cards, the hero price line, the `#pricing` section, the
cost FAQ and the Offer JSON-LD on every service page. The patches only remove
old prices from CMS copy and fix copy that conflicted with the new offers.

## Preview locally

```bash
npm run content:snapshot     # read-only export of the published dataset
npm run dev:local-content    # applies these patches to a local copy and serves it
```

`dev:local-content` points `@sanity/client` at a read-only local stand-in
(`scripts/local-content/local-sanity-client.mjs`) via a Vite alias in
`astro.config.mjs`. Nothing is written to Sanity; write methods throw.
The alias is inactive unless `LOCAL_CONTENT_DATASET` is set, and never on Vercel.

## Release (only after owner approval — not done)

1. Re-run `npm run content:snapshot && npm run content:build`. If any patch
   reports a revision mismatch, someone edited that document after review:
   re-review it before continuing.
2. Confirm again that no services-hub draft exists. The owner discarded the
   hub drafts; a read-only check on 2026-09-28 found only the published hub
   document (`_rev Pm9wd3LBrJ0tz0cHr6JtVm`, the revision these patches expect).
   Other drafts (3 blog posts, 1 map-check page) are unrelated and untouched.
3. Apply `sanity-patches.json` to the dataset (for example with the Sanity HTTP
   mutate API or a Sanity Content Release), publish, then deploy the code.
   Code and content must go live together: the code removes the old CMS pricing
   fields from the page, and the patches remove the old prices from the copy.
   The site is static, so content changes appear on the next build. If a Sanity
   publish triggers a production rebuild (deploy hook), publish the content in
   the same window as the code deploy — otherwise production briefly runs the
   old code against the new copy.
4. Contact forms (code change, not Sanity): the GoHighLevel side is done
   (2026-09-29). Workflow "Interactive Lead Form" → Create Contact maps
   `budgetPeriod` → Budget Period, `budget` → Budget Range (text, accepts
   `under_1k`), `budgetLabel` → Budget Details, plus the existing name, email,
   phone, website and message. Keep the payload keys exactly `budget`,
   `budgetPeriod`, `budgetLabel`. Controlled test on 2026-09-29: 4 test
   contacts sent; payloads recorded for all 4; HTTP 200 recorded for test 1
   only; all 4 opportunities confirmed in the CRM by the owner (screenshot).
   Contact budget fields were owner-reported, not independently checked.
   Remove the 4 test contacts and opportunities before release.
5. Verify the live hub, all 14 service routes, the contact and FAQ pages, the
   six blog posts, the area pages and the three contact forms (see the review
   checklist).
