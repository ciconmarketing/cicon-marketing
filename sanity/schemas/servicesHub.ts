import { defineType, defineField, defineArrayMember } from 'sanity'

export default defineType({
  name: 'servicesHub',
  title: 'Services Hub Page',
  type: 'document',

  groups: [
    { name: 'identity', title: 'Identity & Workflow', default: true },
    { name: 'seo',      title: 'SEO & Meta' },
    { name: 'hero',     title: 'Hero' },
    { name: 'content',  title: 'Content Blocks' },
    { name: 'linking',  title: 'Internal Linking' },
    { name: 'schema',   title: 'Schema.org' },
  ],

  fields: [

    // ── Identity & Workflow ───────────────────────────────────────────────────
    defineField({
      name: 'title',
      title: 'Page Title (internal)',
      type: 'string',
      group: 'identity',
      initialValue: 'Services Hub Page',
      description: 'Studio label only — not rendered on the page.',
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      group: 'identity',
      options: { source: 'title' },
      initialValue: { current: 'services' },
      description: 'Do not change — SEO equity is on /services/',
    }),
    defineField({
      name: 'pageType',
      title: 'Page Type',
      type: 'string',
      group: 'identity',
      readOnly: true,
      initialValue: 'services-hub',
    }),
    defineField({
      name: 'status',
      title: 'Content Status',
      type: 'string',
      group: 'identity',
      options: {
        list: [
          { title: 'Published', value: 'published' },
          { title: 'Draft',     value: 'draft' },
          { title: 'Needs Review', value: 'needs-review' },
        ],
        layout: 'radio',
      },
      initialValue: 'published',
    }),
    defineField({
      name: 'needsRewrite',
      title: 'Flag for Rewrite',
      type: 'boolean',
      group: 'identity',
      initialValue: false,
    }),
    defineField({
      name: 'rewriteNotes',
      title: 'Rewrite Notes',
      type: 'text',
      rows: 3,
      group: 'identity',
      hidden: ({ document }) => !document?.needsRewrite,
      description: 'Visible only when "Flag for Rewrite" is on.',
    }),

    // ── SEO & Meta ────────────────────────────────────────────────────────────
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      group: 'seo',
      description: 'Recommended: 50–60 characters.',
      initialValue: 'Digital Marketing Services for GTA Businesses | CiCon Marketing',
      validation: (Rule) => Rule.max(60).warning('Keep under 60 characters'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      group: 'seo',
      description: 'Recommended: 140–160 characters.',
      initialValue: 'Boutique digital marketing services for GTA businesses and dental clinics. Paid ads, SEO, social media, web development, and more — managed by one senior strategist.',
      validation: (Rule) => Rule.max(160).warning('Keep under 160 characters'),
    }),
    defineField({
      name: 'canonical',
      title: 'Canonical URL',
      type: 'url',
      group: 'seo',
      initialValue: 'https://cicon.ca/services/',
    }),
    defineField({
      name: 'ogImage',
      title: 'OG / Social Share Image',
      type: 'image',
      group: 'seo',
      options: { hotspot: true },
      description: 'Recommended: 1200×630px.',
    }),
    defineField({
      name: 'ogTitle',
      title: 'OG Title (overrides Meta Title if set)',
      type: 'string',
      group: 'seo',
    }),
    defineField({
      name: 'ogDescription',
      title: 'OG Description (overrides Meta Description if set)',
      type: 'text',
      rows: 2,
      group: 'seo',
    }),
    defineField({
      name: 'twitterCardType',
      title: 'Twitter Card Type',
      type: 'string',
      group: 'seo',
      options: {
        list: [
          { title: 'Summary Large Image', value: 'summary_large_image' },
          { title: 'Summary',             value: 'summary' },
        ],
        layout: 'radio',
      },
      initialValue: 'summary_large_image',
    }),
    defineField({
      name: 'robotsIndex',
      title: 'Allow indexing (robots: index)',
      type: 'boolean',
      group: 'seo',
      initialValue: true,
    }),
    defineField({
      name: 'robotsFollow',
      title: 'Allow link following (robots: follow)',
      type: 'boolean',
      group: 'seo',
      initialValue: true,
    }),

    // ── Hero ──────────────────────────────────────────────────────────────────
    defineField({
      name: 'heroBadge',
      title: 'Hero Badge Text',
      type: 'string',
      group: 'hero',
      initialValue: 'Full-Service Marketing',
      description: 'Small eyebrow label above the H1.',
    }),
    defineField({
      name: 'heroHeadline',
      title: 'Hero Headline (H1)',
      type: 'string',
      group: 'hero',
      initialValue: 'Every service your business needs to grow',
    }),
    defineField({
      name: 'heroSubheadline',
      title: 'Hero Sub-headline',
      type: 'string',
      group: 'hero',
      initialValue: 'One senior strategist. No junior handoffs. Real results.',
    }),
    defineField({
      name: 'heroDescription',
      title: 'Hero Description',
      type: 'text',
      rows: 4,
      group: 'hero',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image (right column)',
      type: 'image',
      group: 'hero',
      options: { hotspot: true },
      description: 'Displayed in the right column of the hero grid on desktop.',
    }),
    defineField({
      name: 'heroStats',
      title: 'Hero Stats',
      type: 'array',
      group: 'hero',
      of: [defineArrayMember({
        type: 'object',
        name: 'heroStatItem',
        fields: [
          defineField({ name: 'value', title: 'Value (e.g. "8")',         type: 'string' }),
          defineField({ name: 'label', title: 'Label (e.g. "Services under one roof")', type: 'string' }),
        ],
        preview: { select: { title: 'value', subtitle: 'label' } },
      })],
    }),
    defineField({
      name: 'heroPrimaryCtaLabel',
      title: 'Primary CTA Label',
      type: 'string',
      group: 'hero',
      initialValue: 'Chat on WhatsApp',
    }),
    defineField({
      name: 'heroPrimaryCtaUrl',
      title: 'Primary CTA URL',
      type: 'url',
      group: 'hero',
      initialValue: 'https://wa.me/16475840800',
    }),
    defineField({
      name: 'heroSecondaryCtaLabel',
      title: 'Secondary CTA Label',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroSecondaryCtaUrl',
      title: 'Secondary CTA URL',
      type: 'string',
      group: 'hero',
    }),

    // ── Content Blocks ────────────────────────────────────────────────────────

    // Services Grid labels
    defineField({
      name: 'servicesGridHeadline',
      title: 'Services Grid — Section Headline',
      type: 'string',
      group: 'content',
      initialValue: '8 services. One senior strategist.',
    }),
    defineField({
      name: 'servicesGridSubhead',
      title: 'Services Grid — Section Sub-headline',
      type: 'string',
      group: 'content',
      description: 'Optional. Displayed beneath the services grid headline.',
    }),

    // Service Router
    defineField({
      name: 'routerHeadline',
      title: 'Service Router — Headline',
      type: 'string',
      group: 'content',
      initialValue: 'Which service do you actually need?',
    }),
    defineField({
      name: 'routerIntro',
      title: 'Service Router — Intro Copy',
      type: 'text',
      rows: 2,
      group: 'content',
    }),

    // Anti-Pitch
    defineField({
      name: 'antiPitchHeadline',
      title: 'Anti-Pitch — Headline',
      type: 'string',
      group: 'content',
      initialValue: "This isn't for every business",
    }),
    defineField({
      name: 'antiPitchItems',
      title: 'Anti-Pitch — Disqualifier Items',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({
        type: 'object',
        name: 'antiPitchItem',
        fields: [
          defineField({ name: 'disqualifier', title: 'Disqualifier',  type: 'string' }),
          defineField({ name: 'explanation',  title: 'Explanation',   type: 'string' }),
        ],
        preview: { select: { title: 'disqualifier', subtitle: 'explanation' } },
      })],
    }),

    // Reviews / Social Proof
    defineField({
      name: 'reviewsHeadline',
      title: 'Reviews Section — Headline',
      type: 'string',
      group: 'content',
      initialValue: '5.0 stars across 47+ reviews',
      description: 'Update the review count here when it changes.',
    }),

    // Final CTA
    defineField({
      name: 'finalCtaHeadline',
      title: 'Final CTA — Headline',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'finalCtaBody',
      title: 'Final CTA — Body Copy',
      type: 'text',
      rows: 3,
      group: 'content',
    }),
    defineField({
      name: 'finalCtaPrimaryLabel',
      title: 'Final CTA — Primary Button Label',
      type: 'string',
      group: 'content',
      initialValue: 'Chat on WhatsApp',
    }),
    defineField({
      name: 'finalCtaPrimaryUrl',
      title: 'Final CTA — Primary Button URL',
      type: 'url',
      group: 'content',
      initialValue: 'https://wa.me/16475840800',
    }),

    // ── Internal Linking ──────────────────────────────────────────────────────
    defineField({
      name: 'relatedPosts',
      title: 'Featured Blog Posts',
      type: 'array',
      group: 'linking',
      description: 'Optional: pin specific blog posts to display on this page.',
      of: [defineArrayMember({
        type: 'reference',
        to: [{ type: 'blogPost' }],
      })],
    }),
    defineField({
      name: 'footerCtaOverride',
      title: 'Footer CTA Override',
      type: 'object',
      group: 'linking',
      description: 'Leave blank to use the site-wide footer CTA.',
      fields: [
        defineField({ name: 'headline', title: 'Headline', type: 'string' }),
        defineField({ name: 'body',     title: 'Body',     type: 'text', rows: 2 }),
        defineField({ name: 'ctaLabel', title: 'CTA Label', type: 'string' }),
        defineField({ name: 'ctaUrl',   title: 'CTA URL',   type: 'string' }),
      ],
    }),

    // ── Schema.org ────────────────────────────────────────────────────────────
    defineField({
      name: 'schemaType',
      title: 'Primary Schema Type',
      type: 'string',
      group: 'schema',
      options: {
        list: [
          { title: 'Service',       value: 'Service' },
          { title: 'WebPage',       value: 'WebPage' },
          { title: 'CollectionPage', value: 'CollectionPage' },
        ],
        layout: 'radio',
      },
      initialValue: 'CollectionPage',
    }),
    defineField({
      name: 'customJsonLd',
      title: 'Custom JSON-LD Override',
      type: 'text',
      rows: 8,
      group: 'schema',
      description: 'Paste raw JSON-LD here to override the auto-generated schema. Leave blank to use defaults.',
    }),

  ],

  preview: {
    prepare() {
      return {
        title: 'Services Hub Page',
        subtitle: 'Singleton — /services/',
      }
    },
  },
})
