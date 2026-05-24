import { defineType, defineField, defineArrayMember } from 'sanity'

// Shared stat object — value + label pair
const statField = (name: string, title: string) =>
  defineArrayMember({
    type: 'object',
    name,
    title,
    fields: [
      defineField({ name: 'value', title: 'Value (e.g. "14+ yrs")', type: 'string' }),
      defineField({ name: 'label', title: 'Label (e.g. "GTA dental experience")', type: 'string' }),
    ],
    preview: { select: { title: 'value', subtitle: 'label' } },
  })

export default defineType({
  name: 'servicePage',
  title: 'Service Page',
  type: 'document',
  groups: [
    { name: 'identity',     title: 'Identity & Workflow', default: true },
    { name: 'seo',          title: 'SEO & Meta' },
    { name: 'hero',         title: 'Hero' },
    { name: 'content',      title: 'Content Blocks' },
    { name: 'dental',       title: 'Dental-Only' },
    { name: 'linking',      title: 'Internal Linking' },
    { name: 'schema',       title: 'Schema.org' },
  ],
  fields: [

    // ── Identity & Workflow ───────────────────────────────────────────────────
    defineField({
      name: 'title',
      title: 'Service Name (H1)',
      type: 'string',
      group: 'identity',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      group: 'identity',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'serviceType',
      title: 'Service Type',
      type: 'string',
      group: 'identity',
      options: {
        list: [
          { title: 'Dental Marketing (Flagship)',  value: 'dental' },
          { title: 'Paid Advertising',             value: 'paid-ads' },
          { title: 'AI SEO',                       value: 'seo' },
          { title: 'Local SEO',                    value: 'local-seo' },
          { title: 'Social Media Marketing',       value: 'social' },
          { title: 'Website Development',          value: 'web-dev' },
          { title: 'Media Production',             value: 'media' },
          { title: 'CRM Integration',              value: 'crm' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'identity',
      options: {
        list: [
          { title: 'Draft',             value: 'draft' },
          { title: 'Needs Review',      value: 'needs-review' },
          { title: 'Ready for Review',  value: 'ready-for-review' },
          { title: 'Published',         value: 'published' },
        ],
      },
      initialValue: 'draft',
    }),
    defineField({
      name: 'needsRewrite',
      title: 'Needs Rewrite',
      type: 'boolean',
      group: 'identity',
      description: 'True if scraped content is structurally weak and needs MJ rewrite',
      initialValue: false,
    }),
    defineField({
      name: 'rewriteNotes',
      title: 'Rewrite Notes',
      type: 'text',
      rows: 4,
      group: 'identity',
      description: 'Which sections need rewriting and why',
    }),

    // ── SEO & Meta ────────────────────────────────────────────────────────────
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      group: 'seo',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 2,
      group: 'seo',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'canonical',
      title: 'Canonical URL',
      type: 'url',
      group: 'seo',
    }),

    // ── Hero ──────────────────────────────────────────────────────────────────
    defineField({
      name: 'heroBadge',
      title: 'Hero Badge',
      type: 'string',
      group: 'hero',
      description: 'e.g. "Dental Vertical · Patient Acquisition"',
    }),
    defineField({
      name: 'heroHeadline',
      title: 'Hero Headline',
      type: 'string',
      group: 'hero',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroSubheadline',
      title: 'Hero Sub-headline',
      type: 'string',
      group: 'hero',
      description: '1-line claim-first promise',
    }),
    defineField({
      name: 'heroDescription',
      title: 'Hero Description',
      type: 'text',
      rows: 3,
      group: 'hero',
      description: 'Supporting paragraph, 2-3 sentences max',
    }),
    defineField({
      name: 'heroStats',
      title: 'Hero Stats (max 4)',
      type: 'array',
      group: 'hero',
      of: [statField('heroStatItem', 'Stat')],
      validation: (Rule) => Rule.max(4),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      group: 'hero',
      description: 'PLACEHOLDER — MJ replaces in Sanity Studio later',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Describe the image for screen readers and SEO',
          validation: (Rule) => Rule.required().error('Alt text is required for accessibility and SEO'),
        }),
      ],
    }),

    // ── PAA Block ─────────────────────────────────────────────────────────────
    defineField({
      name: 'paaQuestions',
      title: 'PAA Questions (4–6)',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({
        type: 'object',
        name: 'paaItem',
        fields: [
          defineField({ name: 'question', title: 'Question', type: 'string', validation: (Rule) => Rule.required() }),
          defineField({ name: 'answer', title: 'Answer (1-2 sentences, snippet-optimized)', type: 'text', rows: 3, validation: (Rule) => Rule.required() }),
        ],
        preview: { select: { title: 'question' } },
      })],
      validation: (Rule) => Rule.min(4).max(6),
    }),

    // ── Anti-Pitch ────────────────────────────────────────────────────────────
    defineField({
      name: 'antiPitchHeadline',
      title: 'Anti-Pitch Headline',
      type: 'string',
      group: 'content',
      initialValue: "This isn't for you if...",
    }),
    defineField({
      name: 'antiPitchItems',
      title: 'Anti-Pitch Items (3–4)',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({
        type: 'object',
        name: 'antiPitchItem',
        fields: [
          defineField({ name: 'disqualifier', title: 'Disqualifier', type: 'string', validation: (Rule) => Rule.required() }),
          defineField({ name: 'explanation', title: 'Explanation', type: 'string' }),
        ],
        preview: { select: { title: 'disqualifier' } },
      })],
      validation: (Rule) => Rule.min(3).max(4),
    }),

    // ── Case Studies ──────────────────────────────────────────────────────────
    // Hidden 2026-05 — case studies not publicly disclosed during growth stage
    defineField({
      name: 'caseStudyTop',
      title: 'Case Study (Top — proof near hero)',
      type: 'reference',
      group: 'content',
      to: [{ type: 'caseStudy' }],
      description: 'Social proof card shown near the top of the page',
      hidden: true,
    }),
    defineField({
      name: 'caseStudyBottom',
      title: 'Case Study (Bottom — closer near FAQ)',
      type: 'reference',
      group: 'content',
      to: [{ type: 'caseStudy' }],
      description: 'Social proof card shown near the bottom of the page',
      hidden: true,
    }),

    // ── Capabilities ──────────────────────────────────────────────────────────
    defineField({
      name: 'capabilitiesHeadline',
      title: 'Capabilities Headline',
      type: 'string',
      group: 'content',
      initialValue: 'What we actually do',
    }),
    defineField({
      name: 'capabilitiesIntro',
      title: 'Capabilities Intro',
      type: 'text',
      rows: 3,
      group: 'content',
    }),
    defineField({
      name: 'capabilities',
      title: 'Capabilities (4–6)',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({
        type: 'object',
        name: 'capability',
        fields: [
          defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
          defineField({ name: 'definition', title: 'Definition (first sentence = crisp, citable)', type: 'string', description: 'First sentence = crisp definition for AI Overview citation' }),
          defineField({ name: 'description', title: 'Description', type: 'text', rows: 4, description: 'Specific deliverables, not vague capabilities' }),
          defineField({ name: 'icon', title: 'Lucide Icon Name', type: 'string', description: 'e.g. "search", "bar-chart-2", "target"' }),
        ],
        preview: { select: { title: 'title', subtitle: 'definition' } },
      })],
      validation: (Rule) => Rule.min(4).max(6),
    }),

    // ── Process ───────────────────────────────────────────────────────────────
    defineField({
      name: 'processSteps',
      title: 'Process Steps (exactly 4)',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({
        type: 'object',
        name: 'processStep',
        fields: [
          defineField({ name: 'number', title: 'Step Number', type: 'number' }),
          defineField({ name: 'label', title: 'Step Label', type: 'string' }),
          defineField({ name: 'description', title: 'Description', type: 'string' }),
        ],
        preview: { select: { title: 'label', subtitle: 'description' } },
      })],
      validation: (Rule) => Rule.length(4),
      initialValue: [
        { _key: 'step1', number: 1, label: 'Discovery',  description: 'Audit your current state, identify gaps, define KPIs' },
        { _key: 'step2', number: 2, label: 'Strategy',   description: 'Build the plan — channels, budget, creative direction' },
        { _key: 'step3', number: 3, label: 'Execute',    description: 'Launch campaigns, ship assets, track every action' },
        { _key: 'step4', number: 4, label: 'Report',     description: 'Monthly reviews with the numbers that matter' },
      ],
    }),

    // ── E-E-A-T Block ─────────────────────────────────────────────────────────
    defineField({
      name: 'eeatHeadline',
      title: 'E-E-A-T Headline',
      type: 'string',
      group: 'content',
      initialValue: 'Senior strategist on every account',
    }),
    defineField({
      name: 'eeatBody',
      title: 'E-E-A-T Body',
      type: 'text',
      rows: 4,
      group: 'content',
      description: 'Human-in-the-loop language — no junior handoffs',
      initialValue: `Every campaign at CiCon is run by Majid, our senior strategist with 14+ years in performance marketing. No junior account managers. No rotating points of contact. You get senior strategy on every call, every report, every decision.\n\nThat's what "boutique" actually means.`,
    }),
    defineField({
      name: 'eeatStats',
      title: 'E-E-A-T Stats',
      type: 'array',
      group: 'content',
      of: [statField('eeatStatItem', 'E-E-A-T Stat')],
    }),

    // ── FAQ ───────────────────────────────────────────────────────────────────
    defineField({
      name: 'faqs',
      title: 'FAQs (6–8)',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({
        type: 'object',
        name: 'faqItem',
        fields: [
          defineField({ name: 'question', title: 'Question', type: 'string', validation: (Rule) => Rule.required() }),
          defineField({ name: 'answer', title: 'Answer', type: 'text', rows: 4, validation: (Rule) => Rule.required() }),
        ],
        preview: { select: { title: 'question' } },
      })],
      validation: (Rule) => Rule.min(6).max(8),
    }),

    // ── Dental-Only ───────────────────────────────────────────────────────────
    defineField({
      name: 'cdcpBlock',
      title: 'CDCP Block (Dental only)',
      type: 'object',
      group: 'dental',
      hidden: ({ document }) => document?.serviceType !== 'dental',
      fields: [
        defineField({ name: 'headline', title: 'Headline', type: 'string', initialValue: 'Built for the CDCP era' }),
        defineField({ name: 'body', title: 'Body', type: 'text', rows: 5 }),
        defineField({ name: 'bullets', title: 'Bullets', type: 'array', of: [{ type: 'string' }] }),
      ],
    }),
    defineField({
      name: 'patientChannels',
      title: 'Patient Channels (Dental only)',
      type: 'array',
      group: 'dental',
      hidden: ({ document }) => document?.serviceType !== 'dental',
      of: [defineArrayMember({
        type: 'object',
        name: 'patientChannel',
        fields: [
          defineField({ name: 'channel', title: 'Channel Name', type: 'string' }),
          defineField({ name: 'description', title: 'Description', type: 'string' }),
        ],
        preview: { select: { title: 'channel', subtitle: 'description' } },
      })],
    }),

    // ── Internal Linking ──────────────────────────────────────────────────────
    defineField({
      name: 'relatedServices',
      title: 'Related Services (max 2)',
      type: 'array',
      group: 'linking',
      of: [{ type: 'reference', to: [{ type: 'servicePage' }] }],
      validation: (Rule) => Rule.max(2),
      description: 'Adjacent services this pairs with — use exact-match anchor text',
    }),
    defineField({
      name: 'relatedPosts',
      title: 'Related Blog Posts (max 3)',
      type: 'array',
      group: 'linking',
      of: [{ type: 'reference', to: [{ type: 'blogPost' }] }],
      validation: (Rule) => Rule.max(3),
      description: 'Blog posts that support this service',
    }),

    // ── Schema.org ────────────────────────────────────────────────────────────
    defineField({
      name: 'serviceTypeSchema',
      title: 'Schema.org Service Type',
      type: 'string',
      group: 'schema',
      description: 'e.g. "DigitalMarketingService", "SearchEngineOptimizationService"',
    }),
    defineField({
      name: 'areaServed',
      title: 'Area Served',
      type: 'array',
      group: 'schema',
      of: [{ type: 'string' }],
      initialValue: ['Richmond Hill', 'Toronto', 'Markham', 'Vaughan', 'North York', 'Greater Toronto Area'],
    }),

  ],

  preview: {
    select: { title: 'title', serviceType: 'serviceType', status: 'status', needsRewrite: 'needsRewrite' },
    prepare({ title, serviceType, status, needsRewrite }: {
      title: string; serviceType: string; status: string; needsRewrite: boolean
    }) {
      const statusIcons: Record<string, string> = {
        published:        '✅',
        'ready-for-review': '🔍',
        'needs-review':   '✏️',
        draft:            '📝',
      }
      return {
        title,
        subtitle: `${statusIcons[status] ?? '•'} ${status} · ${serviceType}${needsRewrite ? ' ⚠️ needs rewrite' : ''}`,
      }
    },
  },
})
