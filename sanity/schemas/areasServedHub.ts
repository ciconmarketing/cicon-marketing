import { defineType, defineField, defineArrayMember } from 'sanity'

function wordCount(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length
}

export default defineType({
  name: 'areasServedHub',
  title: 'Areas Served Hub',
  type: 'document',
  // Singleton: prevent create/delete, only update + publish — same pattern as Services Hub Page.
  __experimental_actions: ['update', 'publish'],

  groups: [
    { name: 'identity', title: 'Identity & Workflow', default: true },
    { name: 'seo',      title: 'SEO & Meta' },
    { name: 'hero',     title: 'Hero' },
    { name: 'content',  title: 'Content Blocks' },
  ],

  fields: [

    // ── Identity & Workflow ───────────────────────────────────────────────────
    defineField({
      name: 'internalNotes',
      title: 'Internal Notes',
      type: 'text',
      rows: 3,
      group: 'identity',
      description: 'Private notes for the team. Never shown on the website.',
    }),
    defineField({
      name: 'lastReviewed',
      title: 'Last Reviewed',
      type: 'date',
      group: 'identity',
      description: 'Used as the sitemap lastmod for /areas-served/.',
    }),

    // ── SEO & Meta ────────────────────────────────────────────────────────────
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      group: 'seo',
      description: 'Required: 50–60 characters (CiCon editorial standard).',
      validation: (Rule) => Rule.required().min(50).max(60)
        .error('SEO title must be 50–60 characters for Google SERP.'),
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Meta Description',
      type: 'text',
      rows: 3,
      group: 'seo',
      description: 'Required: 130–140 characters (CiCon editorial standard).',
      validation: (Rule) => Rule.required().min(130).max(140)
        .error('Meta description must be 130–140 characters for Google SERP.'),
    }),
    defineField({
      name: 'ogImage',
      title: 'Social Share Image (og:image)',
      type: 'image',
      group: 'seo',
      description: 'Optional. Falls back to the site default (logo-cicon.jpg). Recommended: 1200×630px.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'canonicalOverride',
      title: 'Canonical URL Override',
      type: 'url',
      group: 'seo',
      description: 'Leave blank to use https://cicon.ca/areas-served/.',
    }),

    // ── Hero ──────────────────────────────────────────────────────────────────
    defineField({
      name: 'heroEyebrow',
      title: 'Hero Eyebrow',
      type: 'string',
      group: 'hero',
      description: 'e.g. "Richmond Hill Based · Serving the GTA"',
    }),
    defineField({
      name: 'heroHeadline',
      title: 'Hero Headline (H1)',
      type: 'string',
      group: 'hero',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroSubheadline',
      title: 'Hero Value Proposition',
      type: 'text',
      rows: 3,
      group: 'hero',
      description: '1–2 sentences directly under the headline.',
    }),
    defineField({
      name: 'answerFirstIntro',
      title: 'Answer-First Introduction',
      type: 'text',
      rows: 4,
      group: 'hero',
      description: '40–80 words. A standalone passage answering who CiCon serves and where — written to be quoted by AI search. Do not mechanically repeat every location.',
      validation: (Rule) => Rule.required().custom((value) => {
        if (!value) return true
        const words = wordCount(value)
        if (words < 40 || words > 80) return `Should be 40–80 words (currently ${words}).`
        return true
      }),
    }),

    // ── Content Blocks ────────────────────────────────────────────────────────
    defineField({
      name: 'supportingSections',
      title: 'Supporting Content Sections',
      type: 'array',
      group: 'content',
      description: '"Why local market knowledge matters" style cards.',
      of: [defineArrayMember({
        type: 'object',
        name: 'supportingSection',
        fields: [
          defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (Rule) => Rule.required() }),
          defineField({ name: 'body', title: 'Body', type: 'text', rows: 3, validation: (Rule) => Rule.required() }),
        ],
        preview: { select: { title: 'heading', subtitle: 'body' } },
      })],
    }),
    defineField({
      name: 'geographicGroups',
      title: 'Geographic Groups',
      type: 'array',
      group: 'content',
      description: 'How the areas grid on the hub is organized. Add areas by reference — do not duplicate city names or content here.',
      of: [defineArrayMember({
        type: 'object',
        name: 'geographicGroup',
        fields: [
          defineField({ name: 'heading', title: 'Group Heading', type: 'string', validation: (Rule) => Rule.required() }),
          defineField({ name: 'note', title: 'Group Note (optional)', type: 'text', rows: 2 }),
          defineField({
            name: 'areas',
            title: 'Areas in This Group',
            type: 'array',
            of: [defineArrayMember({ type: 'reference', to: [{ type: 'serviceArea' }] })],
            validation: (Rule) => Rule.min(1).error('Add at least one area.'),
          }),
        ],
        preview: {
          select: { title: 'heading', areasCount: 'areas.length' },
          prepare: ({ title, areasCount }: { title?: string; areasCount?: number }) => ({
            title,
            subtitle: `${areasCount ?? 0} area(s)`,
          }),
        },
      })],
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: 'featuredServices',
      title: 'Featured Services (max 6)',
      type: 'array',
      group: 'content',
      description: 'Canonical service pages linked from the hub.',
      of: [defineArrayMember({
        type: 'object',
        name: 'hubFeaturedService',
        fields: [
          defineField({ name: 'service', title: 'Service', type: 'reference', to: [{ type: 'servicePage' }], validation: (Rule) => Rule.required() }),
          defineField({ name: 'angle', title: 'GTA-Wide Angle (1 line)', type: 'string', validation: (Rule) => Rule.required() }),
        ],
        preview: { select: { title: 'service.title', subtitle: 'angle' } },
      })],
      validation: (Rule) => Rule.max(6),
    }),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({
        type: 'object',
        name: 'hubFaqItem',
        fields: [
          defineField({ name: 'question', title: 'Question', type: 'string', validation: (Rule) => Rule.required() }),
          defineField({ name: 'answer', title: 'Answer', type: 'text', rows: 4, validation: (Rule) => Rule.required() }),
        ],
        preview: { select: { title: 'question' } },
      })],
      validation: (Rule) => Rule.min(3),
    }),
    defineField({
      name: 'finalCta',
      title: 'Final CTA',
      type: 'object',
      group: 'content',
      fields: [
        defineField({ name: 'headline', title: 'Headline', type: 'string' }),
        defineField({ name: 'body', title: 'Body', type: 'text', rows: 3 }),
      ],
    }),

  ],

  preview: {
    prepare() {
      return { title: 'Areas Served Hub', subtitle: 'Singleton — /areas-served/' }
    },
  },
})
