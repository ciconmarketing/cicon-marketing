import { defineType, defineField, defineArrayMember } from 'sanity'

// ── Supporting object types ───────────────────────────────────────────────────

export const externalImageType = defineType({
  name: 'externalImage',
  title: 'External Image',
  type: 'object',
  fields: [
    defineField({ name: 'url', title: 'Image URL (CDN)', type: 'url', validation: (Rule) => Rule.required() }),
    defineField({ name: 'alt', title: 'Alt Text', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'caption', title: 'Caption (optional)', type: 'string' }),
  ],
  preview: {
    select: { title: 'alt', subtitle: 'url' },
  },
})

export const faqItemType = defineType({
  name: 'faqItem',
  title: 'FAQ Item',
  type: 'object',
  fields: [
    defineField({ name: 'question', title: 'Question', type: 'string', validation: (Rule) => Rule.required().max(200) }),
    defineField({ name: 'answer', title: 'Answer', type: 'text', rows: 4, validation: (Rule) => Rule.required().max(600) }),
  ],
  preview: {
    select: { title: 'question' },
  },
})

export const entityReferenceType = defineType({
  name: 'entityReference',
  title: 'Entity Reference',
  type: 'object',
  fields: [
    defineField({ name: 'name', title: 'Entity Name', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'type',
      title: 'Schema.org Type',
      type: 'string',
      options: {
        list: [
          { title: 'Thing', value: 'Thing' },
          { title: 'Place', value: 'Place' },
          { title: 'Organization', value: 'Organization' },
          { title: 'SoftwareApplication', value: 'SoftwareApplication' },
          { title: 'MedicalOrganization', value: 'MedicalOrganization' },
          { title: 'LocalBusiness', value: 'LocalBusiness' },
        ],
      },
      initialValue: 'Thing',
    }),
    defineField({ name: 'sameAs', title: 'Wikipedia URL (sameAs)', type: 'url' }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'type' },
  },
})

export const statCalloutType = defineType({
  name: 'statCallout',
  title: 'Stat Callout',
  type: 'object',
  fields: [
    defineField({ name: 'number', title: 'Stat / Number (e.g. "76%")', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'label', title: 'Context Label', type: 'string' }),
    defineField({ name: 'source', title: 'Source Attribution', type: 'string' }),
  ],
  preview: {
    select: { title: 'number', subtitle: 'label' },
  },
})

export const pullQuoteType = defineType({
  name: 'pullQuote',
  title: 'Pull Quote',
  type: 'object',
  fields: [
    defineField({ name: 'quote', title: 'Quote Text', type: 'text', rows: 3, validation: (Rule) => Rule.required() }),
    defineField({ name: 'attribution', title: 'Attribution (optional)', type: 'string' }),
  ],
  preview: {
    select: { title: 'quote' },
    prepare({ title }: { title: string }) {
      return { title: `"${title?.slice(0, 60)}…"` }
    },
  },
})

export const inlineImageType = defineType({
  name: 'inlineImage',
  title: 'Inline Image',
  type: 'object',
  fields: [
    defineField({ name: 'url', title: 'Image URL (CDN)', type: 'url', validation: (Rule) => Rule.required() }),
    defineField({ name: 'alt', title: 'Alt Text', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'caption', title: 'Caption', type: 'string' }),
    defineField({
      name: 'tilt',
      title: 'Tilt Direction',
      type: 'string',
      options: { list: [{ title: '-1.5°', value: 'left' }, { title: '+1.5°', value: 'right' }] },
      initialValue: 'left',
    }),
  ],
  preview: {
    select: { title: 'alt', subtitle: 'caption' },
  },
})

export const inlineVideoType = defineType({
  name: 'inlineVideo',
  title: 'Inline Video',
  type: 'object',
  description:
    'Silent explainer animation. Plays once when scrolled into view, then stops. Nothing downloads until the reader reaches it.',
  fields: [
    defineField({
      name: 'url',
      title: 'MP4 URL',
      type: 'string',
      description: 'H.264 MP4. Site-relative (e.g. /video/name.mp4) or absolute CDN URL.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'webmUrl',
      title: 'WebM URL (optional)',
      type: 'string',
      description: 'VP9 WebM served first when the browser supports it — usually 20–30% smaller.',
    }),
    defineField({
      name: 'posterUrl',
      title: 'Poster Image URL',
      type: 'string',
      description: 'Shown before playback and to reduced-motion visitors. Required so nothing renders empty.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'alt',
      title: 'Accessible Description',
      type: 'string',
      description: 'Describes what the animation shows, for screen readers.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'caption', title: 'Caption', type: 'string' }),
  ],
  preview: {
    select: { title: 'alt', subtitle: 'caption' },
  },
})

export const comparisonTabsType = defineType({
  name: 'comparisonTabs',
  title: 'Comparison Tabs',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Section Heading', type: 'string' }),
    defineField({
      name: 'tabs',
      title: 'Tabs',
      type: 'array',
      of: [defineArrayMember({
        type: 'object',
        name: 'tab',
        fields: [
          defineField({ name: 'title', title: 'Tab Label', type: 'string', validation: (Rule) => Rule.required() }),
          defineField({ name: 'body', title: 'Tab Content', type: 'array', of: [{ type: 'block' }] }),
        ],
        preview: { select: { title: 'title' } },
      })],
    }),
  ],
  preview: {
    select: { title: 'heading' },
  },
})

export const simpleTableType = defineType({
  name: 'simpleTable',
  title: 'Comparison Table',
  type: 'object',
  fields: [
    defineField({ name: 'caption', title: 'Caption (optional)', type: 'string' }),
    defineField({
      name: 'headers',
      title: 'Column Headers',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'rows',
      title: 'Rows',
      type: 'array',
      of: [defineArrayMember({
        type: 'object',
        name: 'tableRow',
        fields: [
          defineField({ name: 'cells', title: 'Cells', type: 'array', of: [{ type: 'string' }] }),
        ],
        preview: { select: { title: 'cells' } },
      })],
    }),
  ],
  preview: {
    select: { title: 'caption', subtitle: 'headers' },
    prepare({ title, subtitle }) {
      return { title: title || 'Comparison Table', subtitle: Array.isArray(subtitle) ? subtitle.join(' | ') : '' }
    },
  },
})

export const deepDiveType = defineType({
  name: 'deepDive',
  title: 'Deep Dive Accordion',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Question / Title', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'body', title: 'Answer Body', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'whyItMatters', title: '"Why This Matters" Sub-card', type: 'text', rows: 3 }),
  ],
  preview: {
    select: { title: 'title' },
  },
})

// ── Main blogPost document type ───────────────────────────────────────────────

export default defineType({
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'meta', title: 'SEO & Meta' },
    { name: 'schema', title: 'Schema Enrichment' },
    { name: 'workflow', title: 'Workflow' },
  ],
  fields: [

    // ── Workflow ──────────────────────────────────────────────────────────────
    defineField({
      name: 'status', title: 'Status', type: 'string', group: 'workflow',
      options: {
        list: [
          { title: 'Arvow Imported (Raw)', value: 'arvow-imported' },
          { title: 'Processing', value: 'processing' },
          { title: 'Ready for Review', value: 'ready-for-review' },
          { title: 'Published', value: 'published' },
        ],
      },
      initialValue: 'arvow-imported',
      validation: (Rule) =>
        Rule.custom((status, ctx) => {
          const doc = ctx.document as Record<string, unknown> | undefined
          if (status === 'published' && doc?.enrichmentRequired === true) {
            return 'Cannot publish: run `npm run enrich-arvow` first to complete enrichment.'
          }
          return true
        }),
    }),
    defineField({
      name: 'notes', title: 'Migration Notes', type: 'array',
      group: 'workflow',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'needsFaqAddition',
      title: 'Needs FAQ Addition',
      type: 'boolean',
      group: 'workflow',
      description: 'Flag: this post has no FAQ section on the source page. Add 4–6 Q&A items manually during the content-enrichment sprint.',
      initialValue: false,
    }),

    // ── Arvow ingestion metadata ──────────────────────────────────────────────
    defineField({
      name: 'enrichmentRequired',
      title: 'Enrichment Required',
      type: 'boolean',
      group: 'workflow',
      description: 'Set to true automatically when Arvow imports a post. Cleared by the enrich-arvow script. Publishing is blocked while this is true.',
      initialValue: false,
    }),
    defineField({
      name: 'arvowId',
      title: 'Arvow Article ID',
      type: 'string',
      group: 'workflow',
      description: 'Unique ID assigned by Arvow. Used for idempotency — prevents duplicate imports.',
      readOnly: true,
    }),
    defineField({
      name: 'arvowBatchId',
      title: 'Arvow Batch ID',
      type: 'string',
      group: 'workflow',
      description: 'Batch / campaign identifier from Arvow (e.g. "may-2026-dental").',
      readOnly: true,
    }),
    defineField({
      name: 'arvowCampaignId',
      title: 'Arvow Campaign ID',
      type: 'string',
      group: 'workflow',
      description: 'Arvow campaign_id field from the webhook payload.',
      readOnly: true,
    }),
    defineField({
      name: 'arvowCampaignName',
      title: 'Arvow Campaign Name',
      type: 'string',
      group: 'workflow',
      description: 'Arvow campaign_name field from the webhook payload.',
      readOnly: true,
    }),
    defineField({
      name: 'arvowReceivedAt',
      title: 'Arvow Received At',
      type: 'datetime',
      group: 'workflow',
      description: 'UTC timestamp when the webhook payload arrived.',
      readOnly: true,
    }),
    defineField({
      name: 'arvowRawPayload',
      title: 'Arvow Raw Payload (debug)',
      type: 'text',
      rows: 6,
      group: 'workflow',
      description: 'Full raw JSON payload received from Arvow. Stored for debugging only — not used in rendering.',
      readOnly: true,
    }),

    // ── Core identity ─────────────────────────────────────────────────────────
    defineField({ name: 'title', title: 'Title (H1)', type: 'string', group: 'content', validation: (Rule) => Rule.required().min(20).max(100) }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', group: 'content', options: { source: 'title', maxLength: 96 }, validation: (Rule) => Rule.required() }),
    defineField({ name: 'dek', title: 'Subtitle / Dek', type: 'text', rows: 2, group: 'content', validation: (Rule) => Rule.max(220) }),
    defineField({ name: 'category', title: 'Category', type: 'reference', to: [{ type: 'blogCategory' }], group: 'content' }),
    defineField({ name: 'readTime', title: 'Read Time (minutes)', type: 'number', group: 'content' }),
    defineField({ name: 'publishedAt', title: 'Published At (original date)', type: 'date', group: 'content' }),

    // ── Hero image (external CDN URL — never uploaded to Sanity) ─────────────
    defineField({
      name: 'heroImage',
      title: 'Hero / Featured Image',
      type: 'externalImage',
      group: 'content',
    }),

    // ── Quick Answer card (legacy — superseded by Key Takeaways below) ────────
    defineField({
      name: 'quickAnswer',
      title: 'Quick Answer (Legacy — use Key Takeaways for new posts)',
      type: 'text',
      rows: 4,
      group: 'content',
      validation: (Rule) => Rule.max(500),
    }),

    // ── Key Takeaways card (bulleted list, replaces Quick Answer going forward) ─
    defineField({
      name: 'keyTakeaways',
      title: 'Key Takeaways (Bulleted List)',
      type: 'array',
      group: 'content',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.max(6),
    }),

    // ── Article body (Portable Text + custom blocks) ──────────────────────────
    defineField({
      name: 'body',
      title: 'Article Body',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'block',
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Code', value: 'code' },
            ],
            annotations: [
              { name: 'link', type: 'object', title: 'Link', fields: [{ name: 'href', type: 'url', title: 'URL' }] },
            ],
          },
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
        },
        { type: 'statCallout' },
        { type: 'simpleTable' },
        { type: 'comparisonTabs' },
        { type: 'deepDive' },
        { type: 'pullQuote' },
        { type: 'inlineImage' },
        { type: 'inlineVideo' },
      ],
    }),

    // ── FAQ items ─────────────────────────────────────────────────────────────
    defineField({
      name: 'faqs',
      title: 'FAQ Items',
      type: 'array',
      group: 'content',
      of: [{ type: 'faqItem' }],
    }),

    // ── End CTA stat ──────────────────────────────────────────────────────────
    defineField({
      name: 'endCtaStat',
      title: 'End CTA Stat Block',
      type: 'object',
      group: 'content',
      fields: [
        { name: 'number', type: 'string', title: 'Stat (e.g., "76%")' },
        { name: 'context', type: 'string', title: 'Context Line' },
        { name: 'source', type: 'string', title: 'Source Attribution' },
      ],
    }),

    // ── Related posts ─────────────────────────────────────────────────────────
    defineField({
      name: 'relatedPosts',
      title: 'Related Posts (3)',
      type: 'array',
      group: 'content',
      of: [{ type: 'reference', to: [{ type: 'blogPost' }] }],
    }),

    // ── SEO & Meta ────────────────────────────────────────────────────────────
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      group: 'meta',
      description: 'Target: 50-61 characters. Current length appears in real-time.',
      validation: (Rule) => Rule.required()
        .min(50).max(61)
        .error('Meta title must be 50-61 characters for Google SERP. Current length will be shown in Studio.'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 2,
      group: 'meta',
      description: 'Target: 140-150 characters. Current length appears in real-time.',
      // Warning, not error: 17 of the 27 posts published before this standard
      // sit at 130-139 or 151 characters. A hard rule would block republishing
      // them mid-edit for a legacy length. The nudge still steers new posts to
      // 140-150; tighten this to .error() once the back catalogue is reflowed.
      validation: (Rule) => Rule.required()
        .min(140).max(150)
        .warning('Aim for 140-150 characters for Google SERP.'),
    }),
    defineField({ name: 'keywords', title: 'Target Keywords', type: 'array', group: 'meta', of: [{ type: 'string' }] }),

    // ── Schema enrichment ─────────────────────────────────────────────────────
    defineField({
      name: 'aboutEntities',
      title: 'About (Core Entities — 2–3)',
      type: 'array',
      group: 'schema',
      of: [{ type: 'entityReference' }],
    }),
    defineField({
      name: 'mentionsEntities',
      title: 'Mentions (Secondary Entities — 5–10)',
      type: 'array',
      group: 'schema',
      of: [{ type: 'entityReference' }],
    }),

  ],

  preview: {
    select: { title: 'title', status: 'status' },
    prepare({ title, status }: { title: string; status: string }) {
      const icons: Record<string, string> = {
        'published': '✅',
        'ready-for-review': '🔍',
        'processing': '⚙️',
        'arvow-imported': '📥',
      }
      return { title, subtitle: `${icons[status] ?? '•'} ${status}` }
    },
  },
})
