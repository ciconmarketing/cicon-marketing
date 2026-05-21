import { defineType, defineField, defineArrayMember } from 'sanity'

export default defineType({
  name: 'servicesHub',
  title: 'Services Hub Page',
  type: 'document',
  // Singleton: prevent create/delete, only update + publish
  __experimental_actions: ['update', 'publish'],
  fields: [

    // ── Hero ──────────────────────────────────────────────────────────────────
    defineField({
      name: 'heroHeadline',
      title: 'Hero Headline',
      type: 'string',
    }),
    defineField({
      name: 'heroSubheadline',
      title: 'Hero Sub-headline',
      type: 'string',
    }),
    defineField({
      name: 'heroDescription',
      title: 'Hero Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      description: 'Main image displayed on the right side of the Services Hub hero. Recommended: 16:9, at least 1200×675px.',
      options: { hotspot: true },
    }),

    defineField({
      name: 'heroStats',
      title: 'Hero Stats',
      type: 'array',
      of: [defineArrayMember({
        type: 'object',
        name: 'heroStatItem',
        fields: [
          defineField({ name: 'value', title: 'Value', type: 'string' }),
          defineField({ name: 'label', title: 'Label', type: 'string' }),
        ],
        preview: { select: { title: 'value', subtitle: 'label' } },
      })],
    }),

    // ── Anti-Pitch ────────────────────────────────────────────────────────────
    defineField({
      name: 'antiPitchHeadline',
      title: 'Anti-Pitch Headline',
      type: 'string',
      initialValue: "We're not for everyone. Here's who we're for.",
    }),
    defineField({
      name: 'antiPitchItems',
      title: 'Anti-Pitch Items',
      type: 'array',
      of: [defineArrayMember({
        type: 'object',
        name: 'antiPitchItem',
        fields: [
          defineField({ name: 'disqualifier', title: 'Disqualifier', type: 'string' }),
          defineField({ name: 'explanation', title: 'Explanation', type: 'string' }),
        ],
        preview: { select: { title: 'disqualifier' } },
      })],
    }),

    // ── Service Router ────────────────────────────────────────────────────────
    defineField({
      name: 'routerHeadline',
      title: 'Router Headline',
      type: 'string',
      initialValue: 'Which service do you actually need?',
    }),
    defineField({
      name: 'routerIntro',
      title: 'Router Intro',
      type: 'text',
      rows: 2,
    }),

    // ── Final CTA ─────────────────────────────────────────────────────────────
    defineField({
      name: 'finalCtaHeadline',
      title: 'Final CTA Headline',
      type: 'string',
    }),
    defineField({
      name: 'finalCtaBody',
      title: 'Final CTA Body',
      type: 'text',
      rows: 3,
    }),

    // Services grid is auto-populated from all servicePage docs — no manual config

    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      description: 'Page title for search engines. 50–60 characters recommended.',
      validation: (Rule) => Rule.max(60).warning('Keep under 60 characters for best SEO'),
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Meta Description',
      type: 'text',
      rows: 3,
      description: '135–145 characters recommended.',
      validation: (Rule) => Rule.max(155).warning('Keep under 155 characters'),
    }),
    defineField({
      name: 'ogImage',
      title: 'Social Share Image (og:image)',
      type: 'image',
      description: 'Optional. Falls back to site-wide default (logo-cicon.jpg). Recommended: 1200×630px.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'canonicalOverride',
      title: 'Canonical URL Override',
      type: 'url',
      description: 'Only set if this page has a non-standard canonical URL. Leave blank to use the default page URL.',
    }),

  ],

  preview: {
    prepare() {
      return { title: 'Services Hub Page', subtitle: 'Singleton — edit hero, anti-pitch, router, CTA' }
    },
  },
})
