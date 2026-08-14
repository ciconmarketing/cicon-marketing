import { SITE_URL } from './sitemap-xml'

/**
 * Guarantees an absolute https://cicon.ca/... URL, regardless of what a CMS
 * override field contains.
 *
 * `sanityValue ?? fallback` looks safe but isn't: `??` only catches
 * null/undefined, so a non-empty-but-wrong value (an editor pasting a
 * relative path into a "canonical URL" field in Sanity Studio) sails
 * straight through. That happened on the "Website Development Services"
 * page — `canonical` was set to `/marketing-services/website-development/`
 * — and propagated into <link rel="canonical">, og:url, and the
 * BreadcrumbList's @id and final itemListElement.item, which Search
 * Console flagged as an "Invalid URL in field id" structured-data issue.
 */
export function toAbsoluteUrl(value: string | null | undefined, fallback: string): string {
  if (!value) return fallback
  if (/^https?:\/\//i.test(value)) return value
  return `${SITE_URL}${value.startsWith('/') ? '' : '/'}${value}`
}
