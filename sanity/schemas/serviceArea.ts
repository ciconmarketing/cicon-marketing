import { defineType, defineField, defineArrayMember } from 'sanity'

// Word-count helper for the answer-first summary (mirrors the retired
// build-time gate in src/lib/areas-served.ts).
function wordCount(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length
}

// Whitby was removed from the active GBP service-area list on 2026-07-24.
// Block it at the CMS layer so a document can never be created for it.
function rejectWhitby(value: string | undefined) {
  if (value && /whitby/i.test(value)) {
    return 'Whitby was removed from the active GBP service-area list (2026-07-24) and is prohibited.'
  }
  return true
}

const hasPage = (document: any) => !!document?.hasDedicatedPage

export default defineType({
  name: 'serviceArea',
  title: 'Areas Served',
  type: 'document',

  groups: [
    { name: 'identity', title: 'Identity & Workflow', default: true },
    { name: 'seo',      title: 'SEO & Meta' },
    { name: 'hero',     title: 'Hero' },
    { name: 'content',  title: 'Content Blocks' },
    { name: 'proof',    title: 'Local Proof' },
    { name: 'linking',  title: 'Internal Linking' },
  ],

  orderings: [
    { title: 'City Name A–Z', name: 'cityNameAsc', by: [{ field: 'cityName', direction: 'asc' }] },
    { title: 'Tier, then City Name', name: 'tierAsc', by: [{ field: 'tier', direction: 'asc' }, { field: 'cityName', direction: 'asc' }] },
  ],

  fields: [

    // ── Identity & Workflow ───────────────────────────────────────────────────
    defineField({
      name: 'cityName',
      title: 'City / Area Name',
      type: 'string',
      group: 'identity',
      description: 'Display name used in headings, cards, and copy — e.g. "Richmond Hill".',
      validation: (Rule) => Rule.required().custom(rejectWhitby),
    }),
    defineField({
      name: 'officialName',
      title: 'Official Name (if different)',
      type: 'string',
      group: 'identity',
      description: 'e.g. "Whitchurch–Stouffville" as the official municipality name, when the display name is a shorter natural form.',
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      group: 'identity',
      options: { source: 'cityName', maxLength: 96 },
      description: 'Used as /areas-served/{slug}/ when Has Dedicated Page is Yes. Lowercase, kebab-case.',
      validation: (Rule) => Rule.required().custom((value) => {
        const current = value?.current
        const whitby = rejectWhitby(current)
        if (whitby !== true) return whitby
        if (current && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(current)) {
          return 'Slug must be lowercase kebab-case (letters, numbers, single hyphens).'
        }
        return true
      }),
    }),
    defineField({
      name: 'region',
      title: 'Region',
      type: 'string',
      group: 'identity',
      options: {
        list: [
          { title: 'Home Market',    value: 'Home Market' },
          { title: 'York Region',    value: 'York Region' },
          { title: 'Toronto',        value: 'Toronto' },
          { title: 'Durham Region',  value: 'Durham Region' },
          { title: 'Peel Region',    value: 'Peel Region' },
          { title: 'Caledon',        value: 'Caledon' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tier',
      title: 'Tier',
      type: 'number',
      group: 'identity',
      options: {
        list: [
          { title: 'Tier 1 — Launch First',        value: 1 },
          { title: 'Tier 2 — Next-Priority',        value: 2 },
          { title: 'Tier 3 — Hub-Only Until Justified', value: 3 },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Editorial Status',
      type: 'string',
      group: 'identity',
      options: {
        list: [
          { title: 'Draft',     value: 'draft' },
          { title: 'Published', value: 'published' },
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'hasDedicatedPage',
      title: 'Has Dedicated Page',
      type: 'boolean',
      group: 'identity',
      description: 'When Yes, this area generates /areas-served/{slug}/ and the Hero / Content Blocks / Internal Linking fields below apply. When No, this area appears only as a coverage card on the hub.',
      initialValue: false,
    }),
    defineField({
      name: 'indexable',
      title: 'Indexable',
      type: 'boolean',
      group: 'identity',
      description: 'Controls robots meta + XML sitemap inclusion for this area’s dedicated page. Only takes effect when Status = Published and Has Dedicated Page = Yes, and requires at least one APPROVED item in Local Proof below. A page is in /areas-sitemap.xml only when all of those are true.',
      initialValue: false,
      validation: (Rule) => Rule.custom((value, context) => {
        if (!value) return true
        const doc = context.document as any
        if (doc?.status !== 'published') return 'Indexable requires Editorial Status = Published.'
        if (!doc?.hasDedicatedPage) return 'Indexable requires Has Dedicated Page = Yes.'
        const proof = (doc?.localProof as Array<{ approved?: boolean }> | undefined) ?? []
        if (!proof.some((p) => p?.approved)) {
          return 'Indexable requires at least one APPROVED item in Local Proof — add one or keep this Off.'
        }
        return true
      }),
    }),
    defineField({
      name: 'lastReviewed',
      title: 'Last Reviewed',
      type: 'date',
      group: 'identity',
      description: 'Used as the sitemap lastmod for this area’s page.',
    }),
    defineField({
      name: 'internalNotes',
      title: 'Internal Notes',
      type: 'text',
      rows: 3,
      group: 'identity',
      description: 'Private editorial notes — proof status, approval history, follow-ups. Never shown on the website.',
    }),

    // ── SEO & Meta (only meaningful once a page exists) ─────────────────────────
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      group: 'seo',
      hidden: ({ document }) => !hasPage(document),
      description: 'Required: 50–60 characters (CiCon editorial standard).',
      validation: (Rule) => Rule.custom((value, context) => {
        if (!hasPage(context.document)) return true
        if (!value) return 'Required once Has Dedicated Page is Yes.'
        const len = value.length
        if (len < 50 || len > 60) return `Meta title must be 50–60 characters for Google SERP (currently ${len}).`
        return true
      }),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      group: 'seo',
      hidden: ({ document }) => !hasPage(document),
      description: 'Required: 130–140 characters (CiCon editorial standard).',
      validation: (Rule) => Rule.custom((value, context) => {
        if (!hasPage(context.document)) return true
        if (!value) return 'Required once Has Dedicated Page is Yes.'
        const len = value.length
        if (len < 130 || len > 140) return `Meta description must be 130–140 characters for Google SERP (currently ${len}).`
        return true
      }),
    }),
    defineField({
      name: 'canonicalOverride',
      title: 'Canonical URL Override',
      type: 'url',
      group: 'seo',
      hidden: ({ document }) => !hasPage(document),
      description: 'Leave blank to use https://cicon.ca/areas-served/{slug}/.',
    }),
    defineField({
      name: 'ogImage',
      title: 'Social Share Image (og:image)',
      type: 'image',
      group: 'seo',
      hidden: ({ document }) => !hasPage(document),
      description: 'Optional. Falls back to the site default (logo-cicon.jpg). Recommended: 1200×630px.',
      options: { hotspot: true },
    }),

    // ── Hero ──────────────────────────────────────────────────────────────────
    defineField({
      name: 'hubCardLine',
      title: 'Hub Card Line',
      type: 'string',
      group: 'hero',
      description: 'Short one-line description shown on the /areas-served/ hub grid card for this area — used whether or not it has a dedicated page.',
      validation: (Rule) => Rule.required().max(140),
    }),
    defineField({
      name: 'eyebrow',
      title: 'Hero Eyebrow',
      type: 'string',
      group: 'hero',
      hidden: ({ document }) => !hasPage(document),
      description: 'e.g. "Richmond Hill · Home Base"',
    }),
    defineField({
      name: 'h1',
      title: 'Hero Headline (H1)',
      type: 'string',
      group: 'hero',
      hidden: ({ document }) => !hasPage(document),
      validation: (Rule) => Rule.custom((value, context) => {
        if (hasPage(context.document) && !value) return 'Required once Has Dedicated Page is Yes.'
        return true
      }),
    }),
    defineField({
      name: 'summary',
      title: 'Answer-First Summary',
      type: 'text',
      rows: 4,
      group: 'hero',
      hidden: ({ document }) => !hasPage(document),
      description: '40–80 words. A standalone passage answering what CiCon does, who it serves here, where CiCon is based, and why it’s relevant — written to be quoted by AI search.',
      validation: (Rule) => Rule.custom((value, context) => {
        if (!hasPage(context.document)) return true
        if (!value) return 'Required once Has Dedicated Page is Yes.'
        const words = wordCount(value)
        if (words < 40 || words > 80) return `Should be 40–80 words (currently ${words}).`
        if (!/cicon marketing/i.test(value)) return 'Must name "CiCon Marketing" so the passage stands alone.'
        if (!/richmond hill/i.test(value)) return 'Must disclose the Richmond Hill base so the passage stands alone.'
        return true
      }),
    }),

    // ── Content Blocks ────────────────────────────────────────────────────────
    defineField({
      name: 'localContext',
      title: 'Local Market Context (paragraphs)',
      type: 'array',
      group: 'content',
      hidden: ({ document }) => !hasPage(document),
      of: [defineArrayMember({ type: 'text', rows: 3 })],
      description: 'Original, defensible paragraphs about this market. No fabricated statistics.',
      validation: (Rule) => Rule.custom((value, context) => {
        if (!hasPage(context.document)) return true
        if (!value || value.length < 2) return 'At least 2 paragraphs required once Has Dedicated Page is Yes.'
        return true
      }),
    }),
    defineField({
      name: 'bestFitIndustries',
      title: 'Best-Fit Industries',
      type: 'array',
      group: 'content',
      hidden: ({ document }) => !hasPage(document),
      of: [defineArrayMember({
        type: 'object',
        name: 'bestFitIndustry',
        fields: [
          defineField({ name: 'name', title: 'Industry', type: 'string', validation: (Rule) => Rule.required() }),
          defineField({ name: 'note', title: 'Note', type: 'text', rows: 2 }),
        ],
        preview: { select: { title: 'name', subtitle: 'note' } },
      })],
      validation: (Rule) => Rule.custom((value, context) => {
        if (!hasPage(context.document)) return true
        if (!value || value.length < 2) return 'At least 2 industries required once Has Dedicated Page is Yes.'
        return true
      }),
    }),
    defineField({
      name: 'featuredServices',
      title: 'Featured Services (3–6)',
      type: 'array',
      group: 'content',
      hidden: ({ document }) => !hasPage(document),
      of: [defineArrayMember({
        type: 'object',
        name: 'areaFeaturedService',
        fields: [
          defineField({ name: 'service', title: 'Service', type: 'reference', to: [{ type: 'servicePage' }], validation: (Rule) => Rule.required() }),
          defineField({ name: 'angle', title: 'City-Specific Angle (1 line)', type: 'string', validation: (Rule) => Rule.required() }),
        ],
        preview: { select: { title: 'service.title', subtitle: 'angle' } },
      })],
      validation: (Rule) => Rule.custom((value, context) => {
        if (!hasPage(context.document)) return true
        const n = value?.length ?? 0
        if (n < 3 || n > 6) return `3–6 featured services required once Has Dedicated Page is Yes (currently ${n}).`
        return true
      }),
    }),
    defineField({
      name: 'faqs',
      title: 'FAQs (3–6)',
      type: 'array',
      group: 'content',
      hidden: ({ document }) => !hasPage(document),
      of: [defineArrayMember({
        type: 'object',
        name: 'areaFaqItem',
        fields: [
          defineField({ name: 'question', title: 'Question', type: 'string', validation: (Rule) => Rule.required() }),
          defineField({ name: 'answer', title: 'Answer', type: 'text', rows: 4, validation: (Rule) => Rule.required() }),
        ],
        preview: { select: { title: 'question' } },
      })],
      description: 'Must be unique to this city — do not reuse question text from another area.',
      validation: (Rule) => Rule.custom((value, context) => {
        if (!hasPage(context.document)) return true
        const n = value?.length ?? 0
        if (n < 3 || n > 6) return `3–6 FAQs required once Has Dedicated Page is Yes (currently ${n}).`
        return true
      }),
    }),

    // ── Local Proof ───────────────────────────────────────────────────────────
    defineField({
      name: 'localProof',
      title: 'Local Proof',
      type: 'array',
      group: 'proof',
      description: 'Only APPROVED items render on the live site. Client/testimonial attributions require explicit MJ approval — name + city + relationship only, never results, metrics, or scope, and never a claim of a local office.',
      of: [defineArrayMember({
        type: 'object',
        name: 'proofItem',
        fields: [
          defineField({
            name: 'kind',
            title: 'Kind',
            type: 'string',
            options: {
              list: [
                { title: 'Fact',        value: 'fact' },
                { title: 'Blog Post',   value: 'blog' },
                { title: 'Client',      value: 'client' },
                { title: 'Testimonial', value: 'testimonial' },
              ],
            },
            validation: (Rule) => Rule.required(),
          }),
          defineField({ name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required() }),
          defineField({ name: 'href', title: 'Link (optional)', type: 'url' }),
          defineField({
            name: 'approved',
            title: 'Approved for Publication',
            type: 'boolean',
            initialValue: false,
            description: 'Must be explicitly turned on by an editor after MJ approval. Unapproved items never render.',
          }),
        ],
        preview: {
          select: { title: 'label', kind: 'kind', approved: 'approved' },
          prepare: ({ title, kind, approved }: { title?: string; kind?: string; approved?: boolean }) => ({
            title,
            subtitle: `${approved ? '✅ approved' : '⏸ not approved'} · ${kind ?? ''}`,
          }),
        },
      })],
    }),

    // ── Internal Linking ──────────────────────────────────────────────────────
    defineField({
      name: 'nearbyAreas',
      title: 'Nearby Areas (max 5)',
      type: 'array',
      group: 'linking',
      hidden: ({ document }) => !hasPage(document),
      of: [defineArrayMember({
        type: 'reference',
        to: [{ type: 'serviceArea' }],
        options: {
          filter: ({ document }: any) => {
            const id = document?._id?.replace(/^drafts\./, '')
            return { filter: '_id != $id && _id != $draftId', params: { id, draftId: `drafts.${id}` } }
          },
        },
      })],
      description: 'Only areas that are Published + Indexable render as links on the live page — others are silently skipped.',
      validation: (Rule) => Rule.max(5),
    }),

  ],

  preview: {
    select: {
      title: 'cityName',
      region: 'region',
      status: 'status',
      hasDedicatedPage: 'hasDedicatedPage',
      indexable: 'indexable',
    },
    prepare({ title, region, status, hasDedicatedPage, indexable }: {
      title: string; region?: string; status?: string; hasDedicatedPage?: boolean; indexable?: boolean
    }) {
      const statusIcon = status === 'published' ? '✅' : '📝'
      return {
        title,
        subtitle: `${region ?? '—'} · ${statusIcon} ${status ?? 'draft'} · Page: ${hasDedicatedPage ? 'Yes' : 'No'} · Indexable: ${indexable ? 'Yes' : 'No'}`,
      }
    },
  },
})
