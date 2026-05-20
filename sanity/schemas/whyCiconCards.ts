import { defineType, defineField, defineArrayMember } from 'sanity'

/**
 * whyCiconCards — singleton
 * "Three things every account gets" — shared section used on both
 * the Homepage and the About Us page.
 * Edit once → updates both pages automatically.
 */
export default defineType({
  name: 'whyCiconCards',
  title: 'Why CiCon Cards (Homepage + About Us)',
  type: 'document',
  icon: () => '⭐',
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow Label',
      type: 'string',
      initialValue: 'WHY CICON',
    }),
    defineField({
      name: 'heading',
      title: 'Section Heading',
      type: 'string',
      initialValue: 'Three things every account gets',
    }),
    defineField({
      name: 'cards',
      title: 'Cards (exactly 3)',
      type: 'array',
      validation: r => r.min(3).max(3),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'card',
          title: 'Card',
          fields: [
            defineField({ name: 'label', title: 'Card Label (e.g. "THE OPERATOR")', type: 'string', validation: r => r.required() }),
            defineField({ name: 'heading', title: 'Card Heading', type: 'string', validation: r => r.required() }),
            defineField({ name: 'body', title: 'Card Body Copy', type: 'text', rows: 3, validation: r => r.required() }),
          ],
          preview: { select: { title: 'label', subtitle: 'heading' } },
        }),
      ],
      initialValue: [
        {
          _key: 'c1',
          label: 'THE OPERATOR',
          heading: 'Senior strategy on every account',
          body: "You get direct access to the strategist who built your system — not an account coordinator reading dashboards. Senior-level thinking, every call, every quarter.",
        },
        {
          _key: 'c2',
          label: 'THE METHOD',
          heading: 'A documented 90-day system',
          body: "Every engagement runs on a documented 90-day cycle: audit, roadmap, build, and quarterly business review. No guesswork, no scope creep, no surprises.",
        },
        {
          _key: 'c3',
          label: 'THE FOOTPRINT',
          heading: 'Local GTA market knowledge',
          body: "14+ years operating in GTA markets means the campaigns we build reflect real local search behaviour — not borrowed playbooks written for other cities.",
        },
      ],
    }),
  ],
  preview: { prepare() { return { title: 'Why CiCon Cards' } } },
})
