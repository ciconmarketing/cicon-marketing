/**
 * areas-served.ts — quality gate for the /areas-served/ hub and
 * /areas-served/{city}/ pages.
 *
 * Content itself lives in Sanity (`serviceArea` documents + the
 * `areasServedHub` singleton — see src/lib/sanity.ts for the fetch layer and
 * sanity/schemas/serviceArea.ts + areasServedHub.ts for the CMS schema).
 * This module only validates what comes back, so invalid CMS data can never
 * reach a build:
 *
 *   - status 'draft'      → page is generated but noindexed, never linked,
 *                           never in the sitemap. For MJ review on prod URL.
 *   - status 'published' + hasDedicatedPage + indexable → in areas-sitemap.xml,
 *                           linked from hub, footer, and nearby-area modules.
 *   - indexable: true requires real, approved local proof (also enforced by
 *     the Sanity schema itself — this is the build-time backstop).
 *   - Whitby was removed from the GBP service-area list on 2026-07-24 and is
 *     hard-banned here. Do not re-add without an explicit business decision.
 */

import type { ServiceAreaData } from './sanity'

// ── Hard bans ────────────────────────────────────────────────────────────────
// Removed from the GBP service-area list 2026-07-24. Never generate.
export const BANNED_AREAS = ['whitby'] as const

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Areas with a live, indexable page — the only ones linked or sitemapped. */
export function getPublishedAreas(areas: ServiceAreaData[]): ServiceAreaData[] {
  return areas.filter((p) => p.hasDedicatedPage && p.status === 'published' && p.indexable)
}

/** Areas that generate a route at all (drafts included, for MJ review). */
export function getBuildableAreas(areas: ServiceAreaData[]): ServiceAreaData[] {
  return areas.filter((p) => p.hasDedicatedPage)
}

export function getAreaBySlug(areas: ServiceAreaData[], slug: string): ServiceAreaData | undefined {
  return areas.find((p) => p.slug === slug)
}

/** Word count for the 40–80 word summary rule. */
function wordCount(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length
}

/**
 * Quality gate. Throws with a list of violations — called at build time from
 * getStaticPaths so invalid Sanity data can never deploy. Mirrors (and
 * backstops) the validation already enforced in the Sanity schema itself.
 */
export function validateAreaPages(areas: ServiceAreaData[]): void {
  const errors: string[] = []
  const seenSlugs = new Set<string>()
  const seenFaqs = new Map<string, string>()

  for (const p of areas) {
    const id = `[${p.slug}]`

    if (
      BANNED_AREAS.includes(p.slug as (typeof BANNED_AREAS)[number]) ||
      /whitby/i.test(`${p.slug}${p.cityName}`)
    ) {
      errors.push(`${id} is a banned area (removed from GBP service areas) and must not exist.`)
    }
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.slug)) errors.push(`${id} slug must be lowercase kebab-case.`)
    if (seenSlugs.has(p.slug)) errors.push(`${id} duplicate slug.`)
    seenSlugs.add(p.slug)

    if (!p.hasDedicatedPage) continue // hub-only areas need no page-content validation

    if (!p.metaTitle || p.metaTitle.length < 55 || p.metaTitle.length > 62)
      errors.push(`${id} metaTitle must be 55–62 chars (is ${p.metaTitle?.length ?? 0}).`)
    if (!p.metaDescription || p.metaDescription.length < 130 || p.metaDescription.length > 160)
      errors.push(`${id} metaDescription must be 130–160 chars (is ${p.metaDescription?.length ?? 0}).`)

    const sw = wordCount(p.summary ?? '')
    if (sw < 40 || sw > 80) errors.push(`${id} summary must be 40–80 words (is ${sw}).`)
    if (p.summary && !/cicon marketing/i.test(p.summary)) errors.push(`${id} summary must name "CiCon Marketing".`)
    if (p.summary && !/richmond hill/i.test(p.summary)) errors.push(`${id} summary must disclose the Richmond Hill base.`)

    if (!p.localContext || p.localContext.length < 2) errors.push(`${id} needs >=2 localContext paragraphs.`)
    const fs = p.featuredServices?.length ?? 0
    if (fs < 3 || fs > 6) errors.push(`${id} needs 3–6 featuredServices (has ${fs}).`)
    const faqCount = p.faqs?.length ?? 0
    if (faqCount < 3 || faqCount > 6) errors.push(`${id} needs 3–6 FAQs (has ${faqCount}).`)
    if (!p.bestFitIndustries || p.bestFitIndustries.length < 2) errors.push(`${id} needs >=2 bestFitIndustries.`)

    for (const f of p.faqs ?? []) {
      const key = f.question.trim().toLowerCase()
      const owner = seenFaqs.get(key)
      if (owner && owner !== p.slug) errors.push(`${id} FAQ duplicated across cities: "${f.question}" (also in [${owner}]).`)
      seenFaqs.set(key, p.slug)
    }

    for (const n of p.nearbyAreas ?? []) {
      if (n.slug === p.slug) errors.push(`${id} nearbyAreas must not reference itself.`)
    }

    // The core anti-doorway rule: indexable requires approved proof.
    if (p.indexable) {
      if (p.status !== 'published') errors.push(`${id} indexable pages must have status "published".`)
      const approvedProof = (p.localProof ?? []).filter((x) => x.approved)
      if (approvedProof.length === 0)
        errors.push(`${id} indexable requires >=1 APPROVED localProof item — none found. Keep it draft or supply proof.`)
    }

    // No page may imply a false office. Only the home market may claim an address.
    if (p.slug !== 'richmond-hill') {
      const all = [p.summary ?? '', ...(p.localContext ?? []), ...(p.faqs ?? []).map((f) => f.answer)].join(' ')
      if (new RegExp(`our\\s+${p.cityName.replace(/[-–]/g, '[-–]')}\\s+office`, 'i').test(all))
        errors.push(`${id} implies a local office — not allowed.`)
    }

    if (p.lastReviewed && !/^\d{4}-\d{2}-\d{2}$/.test(p.lastReviewed))
      errors.push(`${id} lastReviewed must be YYYY-MM-DD.`)
  }

  if (errors.length) {
    throw new Error(`areas-served validation failed:\n- ${errors.join('\n- ')}`)
  }
}
