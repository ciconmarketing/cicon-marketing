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

  ],

  preview: {
    prepare() {
      return { title: 'Services Hub Page', subtitle: 'Singleton — edit hero, anti-pitch, router, CTA' }
    },
  },
})
