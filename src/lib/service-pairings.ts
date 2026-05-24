/**
 * SERVICE_PAIRINGS — internal linking map for spoke pages.
 * Each key is a service slug; value is the two slugs shown in RelatedServices.
 * Sanity `relatedServices` references are the source of truth at runtime —
 * this map is the canonical reference for manual updates in Sanity Studio.
 *
 * Keep in sync with Sanity `relatedServices` fields on each servicePage doc.
 */
export const SERVICE_PAIRINGS: Record<string, [string, string]> = {
  'dental':               ['local-seo',    'paid-advertising'],
  'paid-advertising':     ['ai-seo',       'marketing-consultant'],
  'ai-seo':               ['local-seo',    'paid-advertising'],
  'local-seo':            ['dental',       'ai-seo'],
  'social-media-marketing': ['media-production', 'paid-advertising'],
  'website-development':  ['paid-advertising', 'crm-integration'],
  'media-production':     ['social-media-marketing', 'dental'],
  'crm-integration':      ['paid-advertising', 'marketing-consultant'],
  'marketing-consultant': ['website-development', 'ai-seo'],
}
