import { defineType, defineField, defineArrayMember } from 'sanity'

/**
 * contactPage — singleton document for /contact-us/
 * Tab structure mirrors servicePage: Identity & Workflow | SEO & Meta | Hero | Content Blocks | Internal Linking | Schema.org
 */
export default defineType({
  name: 'contactPage',
  title: 'Contact Us Page',
  type: 'document',
  icon: () => '📬',

  groups: [
    { name: 'identity', title: 'Identity & Workflow', default: true },
    { name: 'seo',      title: 'SEO & Meta' },
    { name: 'hero',     title: 'Hero' },
    { name: 'content',  title: 'Content Blocks' },
    { name: 'linking',  title: 'Internal Linking' },
    { name: 'schema',   title: 'Schema.org' },
  ],

  fields: [

    // ── IDENTITY & WORKFLOW ───────────────────────────────────────────────────
    defineField({
      name: 'title',
      title: 'Page Name (H1)',
      type: 'string',
      group: 'identity',
      validation: Rule => Rule.required(),
      initialValue: 'Contact CiCon Marketing',
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      group: 'identity',
      options: { source: 'title', maxLength: 96 },
      description: 'Must stay "contact-us" — do not change (SEO equity)',
      validation: Rule => Rule.required(),
      initialValue: { current: 'contact-us' },
    }),
    defineField({
      name: 'pageType',
      title: 'Page Type',
      type: 'string',
      group: 'identity',
      readOnly: true,
      initialValue: 'contact',
      options: { list: [{ title: 'Contact Page', value: 'contact' }] },
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
      initialValue: 'published',
    }),
    defineField({
      name: 'needsRewrite',
      title: 'Needs Rewrite',
      type: 'boolean',
      group: 'identity',
      initialValue: false,
    }),
    defineField({
      name: 'rewriteNotes',
      title: 'Rewrite Notes',
      type: 'text',
      rows: 4,
      group: 'identity',
    }),

    // ── SEO & META ────────────────────────────────────────────────────────────
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      group: 'seo',
      validation: Rule => Rule.max(60),
      initialValue: 'Contact CiCon Marketing | GTA Digital Marketing Agency',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 2,
      group: 'seo',
      validation: Rule => Rule.max(160),
      initialValue: 'Talk to a senior marketing strategist at CiCon Marketing. We respond within 1 business hour. Serving dental clinics and local businesses across the GTA.',
    }),
    defineField({
      name: 'canonical',
      title: 'Canonical URL',
      type: 'url',
      group: 'seo',
      initialValue: 'https://cicon.ca/contact-us/',
    }),
    defineField({
      name: 'ogImage',
      title: 'OG Image',
      type: 'image',
      group: 'seo',
      options: { hotspot: true },
    }),
    defineField({
      name: 'ogTitle',
      title: 'OG Title (override)',
      type: 'string',
      group: 'seo',
      description: 'Leave blank to inherit Meta Title',
    }),
    defineField({
      name: 'ogDescription',
      title: 'OG Description (override)',
      type: 'text',
      rows: 2,
      group: 'seo',
      description: 'Leave blank to inherit Meta Description',
    }),
    defineField({
      name: 'twitterCardType',
      title: 'Twitter Card Type',
      type: 'string',
      group: 'seo',
      options: { list: [
        { title: 'Summary Large Image', value: 'summary_large_image' },
        { title: 'Summary',             value: 'summary' },
      ]},
      initialValue: 'summary_large_image',
    }),
    defineField({
      name: 'robotsIndex',
      title: 'Allow Search Indexing',
      type: 'boolean',
      group: 'seo',
      initialValue: true,
    }),
    defineField({
      name: 'robotsFollow',
      title: 'Allow Link Following',
      type: 'boolean',
      group: 'seo',
      initialValue: true,
    }),

    // ── HERO ──────────────────────────────────────────────────────────────────
    defineField({
      name: 'heroBadge',
      title: 'Hero Eyebrow Badge',
      type: 'string',
      group: 'hero',
      initialValue: 'Get in touch',
    }),
    defineField({
      name: 'heroHeadline',
      title: 'Hero Headline (H1)',
      type: 'string',
      group: 'hero',
      validation: Rule => Rule.required(),
      initialValue: 'Talk to a senior strategist — not a sales script.',
    }),
    defineField({
      name: 'heroSubheadline',
      title: 'Hero Sub-headline',
      type: 'text',
      rows: 3,
      group: 'hero',
      initialValue: 'Every inquiry goes directly to Majid, our lead strategist. No intake form hand-offs, no junior coordinator triage. You describe your business and goals; we tell you honestly what we can do and whether we\'re the right fit.',
    }),

    // ── CONTENT BLOCKS ────────────────────────────────────────────────────────

    // 1. Intro Block
    defineField({
      name: 'introBlock',
      title: '① Intro',
      type: 'object',
      group: 'content',
      fields: [
        defineField({ name: 'sectionHeader', title: 'Section Header', type: 'string', initialValue: 'Let\'s talk' }),
        defineField({
          name: 'body',
          title: 'Body',
          type: 'text',
          rows: 3,
          initialValue: 'Whether you\'re a dental clinic looking to fill your schedule, a local business tired of burning ad spend with nothing to show, or an established GTA company ready to invest in a proper growth system — this is where you start.',
        }),
      ],
    }),

    // 2. Contact Form Block
    defineField({
      name: 'contactFormBlock',
      title: '② Contact Form Metadata',
      type: 'object',
      group: 'content',
      description: 'Form fields/validation live in code. This block controls the editable metadata around the form.',
      fields: [
        defineField({ name: 'formHeader',      title: 'Form Header',       type: 'string', initialValue: 'Send us a message' }),
        defineField({ name: 'formDescription', title: 'Form Description',  type: 'text', rows: 2, initialValue: 'Fill in your details and we\'ll be in touch within 1 business hour.' }),
        defineField({ name: 'submitButtonLabel', title: 'Submit Button Label', type: 'string', initialValue: 'Send it →' }),
        defineField({ name: 'successMessage',  title: 'Success Message',   type: 'text', rows: 2, initialValue: 'Thank you! We\'ll be in touch within 1 business hour.' }),
        defineField({ name: 'errorMessage',    title: 'Error Message',     type: 'text', rows: 2, initialValue: 'Something went wrong. Please email us directly at info@cicon.ca.' }),
        defineField({
          name: 'destinationCRM',
          title: 'Destination CRM',
          type: 'string',
          description: 'Backend routing reference — for developer use',
          options: { list: [
            { title: 'GoHighLevel',  value: 'gohighlevel' },
            { title: 'Email',        value: 'email' },
            { title: 'Sanity',       value: 'sanity' },
            { title: 'Custom',       value: 'custom' },
          ]},
          initialValue: 'gohighlevel',
        }),
        defineField({
          name: 'sourceTag',
          title: 'Source Tag',
          type: 'string',
          description: 'Tags submissions for CRM pipeline tracking',
          initialValue: 'Contact Page',
        }),
      ],
    }),

    // 3. Contact Methods
    defineField({
      name: 'contactMethodsBlock',
      title: '③ Contact Methods',
      type: 'object',
      group: 'content',
      fields: [
        defineField({ name: 'sectionHeader', title: 'Section Header', type: 'string', initialValue: 'Other ways to reach us' }),
        defineField({
          name: 'methods',
          title: 'Contact Methods (max 6)',
          type: 'array',
          of: [defineArrayMember({
            type: 'object',
            name: 'contactMethod',
            fields: [
              defineField({
                name: 'methodType',
                title: 'Method Type',
                type: 'string',
                options: { list: [
                  { title: 'Phone',     value: 'phone' },
                  { title: 'Email',     value: 'email' },
                  { title: 'WhatsApp',  value: 'whatsapp' },
                  { title: 'Address',   value: 'address' },
                  { title: 'Hours',     value: 'hours' },
                  { title: 'Social',    value: 'social' },
                ]},
              }),
              defineField({ name: 'label',        title: 'Label',           type: 'string' }),
              defineField({ name: 'value',        title: 'Display Value',   type: 'string' }),
              defineField({ name: 'clickAction',  title: 'Click Action URL', type: 'string', description: 'e.g. tel:+12898071020 or https://wa.me/...' }),
              defineField({ name: 'displayOrder', title: 'Display Order',   type: 'number' }),
            ],
            preview: { select: { title: 'label', subtitle: 'value' } },
          })],
          validation: Rule => Rule.max(6),
          initialValue: [
            { _key: 'cm1', methodType: 'phone',    label: 'Phone',     value: '+1 (289) 807-1020',       clickAction: 'tel:+12898071020',          displayOrder: 1 },
            { _key: 'cm2', methodType: 'whatsapp', label: 'WhatsApp',  value: 'Message us on WhatsApp',  clickAction: 'https://wa.me/16475840800', displayOrder: 2 },
            { _key: 'cm3', methodType: 'email',    label: 'Email',     value: 'info@cicon.ca',            clickAction: 'mailto:info@cicon.ca',       displayOrder: 3 },
            { _key: 'cm4', methodType: 'address',  label: 'Address',   value: '131 Golf Club Ct, Richmond Hill, ON L4C 5E1', clickAction: 'https://maps.google.com/?q=131+Golf+Club+Ct+Richmond+Hill+ON', displayOrder: 4 },
            { _key: 'cm5', methodType: 'hours',    label: 'Hours',     value: 'Mon–Fri 9:00 AM – 6:00 PM ET',               clickAction: '',                             displayOrder: 5 },
          ],
        }),
      ],
    }),

    // 4. Map Block
    defineField({
      name: 'mapBlock',
      title: '④ Map (optional)',
      type: 'object',
      group: 'content',
      fields: [
        defineField({ name: 'showMap',   title: 'Show Map', type: 'boolean', initialValue: true }),
        defineField({
          name: 'embedUrl',
          title: 'Google Maps Embed URL',
          type: 'url',
          description: 'Conditional: only used when Show Map is enabled',
          initialValue: 'https://www.google.com/maps?q=131+Golf+Club+Ct,+Richmond+Hill,+ON+L4C+5E1&output=embed',
          hidden: ({ parent }) => !parent?.showMap,
        }),
        defineField({ name: 'address',   title: 'Address Text', type: 'string', initialValue: '131 Golf Club Ct, Richmond Hill, ON L4C 5E1' }),
        defineField({ name: 'mapHeight', title: 'Map Height (px)', type: 'number', initialValue: 350 }),
      ],
    }),

    // 5. Business Hours
    defineField({
      name: 'businessHoursBlock',
      title: '⑤ Business Hours',
      type: 'object',
      group: 'content',
      fields: [
        defineField({ name: 'sectionHeader', title: 'Section Header', type: 'string', initialValue: 'Office hours' }),
        defineField({
          name: 'hours',
          title: 'Hours by Day',
          type: 'array',
          of: [defineArrayMember({
            type: 'object',
            name: 'dayHours',
            fields: [
              defineField({ name: 'dayName',   title: 'Day',       type: 'string' }),
              defineField({ name: 'openTime',  title: 'Open',      type: 'string' }),
              defineField({ name: 'closeTime', title: 'Close',     type: 'string' }),
              defineField({ name: 'isClosed',  title: 'Closed',    type: 'boolean', initialValue: false }),
            ],
            preview: { select: { title: 'dayName', subtitle: 'openTime' } },
          })],
          initialValue: [
            { _key: 'd1', dayName: 'Monday',    openTime: '9:00 AM', closeTime: '6:00 PM', isClosed: false },
            { _key: 'd2', dayName: 'Tuesday',   openTime: '9:00 AM', closeTime: '6:00 PM', isClosed: false },
            { _key: 'd3', dayName: 'Wednesday', openTime: '9:00 AM', closeTime: '6:00 PM', isClosed: false },
            { _key: 'd4', dayName: 'Thursday',  openTime: '9:00 AM', closeTime: '6:00 PM', isClosed: false },
            { _key: 'd5', dayName: 'Friday',    openTime: '9:00 AM', closeTime: '6:00 PM', isClosed: false },
            { _key: 'd6', dayName: 'Saturday',  openTime: '',        closeTime: '',         isClosed: true },
            { _key: 'd7', dayName: 'Sunday',    openTime: '',        closeTime: '',         isClosed: true },
          ],
        }),
        defineField({ name: 'timezone', title: 'Timezone', type: 'string', initialValue: 'Eastern Time (ET)' }),
        defineField({ name: 'notes',    title: 'Notes (optional)', type: 'text', rows: 2 }),
      ],
    }),

    // 6. FAQ
    defineField({
      name: 'faqBlock',
      title: '⑥ FAQ (optional)',
      type: 'object',
      group: 'content',
      fields: [
        defineField({ name: 'sectionHeader', title: 'Section Header', type: 'string', initialValue: 'Common questions' }),
        defineField({
          name: 'questions',
          title: 'Questions (4–8)',
          type: 'array',
          of: [defineArrayMember({
            type: 'object',
            name: 'faqItem',
            fields: [
              defineField({ name: 'question', title: 'Question', type: 'string', validation: Rule => Rule.required() }),
              defineField({ name: 'answer',   title: 'Answer',   type: 'text', rows: 4, validation: Rule => Rule.required() }),
            ],
            preview: { select: { title: 'question' } },
          })],
          validation: Rule => Rule.min(4).max(8),
          initialValue: [
            { _key: 'q1', question: 'How fast do you actually respond?', answer: 'Within 1 business hour, Monday to Friday, 9am – 6pm ET. Submissions after hours or on weekends get a reply first thing the next business day. No exceptions, no auto-replies pretending to be us.' },
            { _key: 'q2', question: 'Do I need a minimum ad budget?', answer: 'For paid advertising engagements, we recommend a minimum media budget of $2,000/month — less than that and the data doesn\'t accumulate fast enough to optimize properly. For SEO and organic work, there\'s no media budget floor.' },
            { _key: 'q3', question: 'Do you offer project work or only retainers?', answer: 'Both. Monthly retainers for ongoing marketing management. Project-based for audits, website builds, and one-time campaigns. We\'ll tell you which model makes more sense after understanding your situation.' },
            { _key: 'q4', question: 'Can I see examples of your work before we talk?', answer: 'Yes. We share case studies and relevant examples during our first call — after we understand your business context so we can show you what\'s actually relevant, not a generic portfolio.' },
          ],
        }),
      ],
    }),

    // 7. Final CTA
    defineField({
      name: 'finalCtaBlock',
      title: '⑦ Final CTA',
      type: 'object',
      group: 'content',
      fields: [
        defineField({ name: 'sectionHeader',    title: 'Section Header',       type: 'string', initialValue: 'Prefer a direct line?' }),
        defineField({ name: 'trustLine',        title: 'Trust Line (optional)', type: 'string' }),
        defineField({ name: 'primaryCtaLabel',  title: 'Primary CTA Label',   type: 'string', initialValue: 'Chat on WhatsApp' }),
        defineField({ name: 'primaryCtaUrl',    title: 'Primary CTA URL',     type: 'url',    initialValue: 'https://wa.me/16475840800' }),
      ],
    }),

    // ── INTERNAL LINKING ──────────────────────────────────────────────────────
    defineField({
      name: 'relatedServices',
      title: 'Related Service Pages (max 3)',
      type: 'array',
      group: 'linking',
      of: [{ type: 'reference', to: [{ type: 'servicePage' }] }],
      validation: Rule => Rule.max(3),
    }),
    defineField({
      name: 'relatedPosts',
      title: 'Related Blog Posts (max 3)',
      type: 'array',
      group: 'linking',
      of: [{ type: 'reference', to: [{ type: 'blogPost' }] }],
      validation: Rule => Rule.max(3),
    }),
    defineField({
      name: 'footerCtaOverride',
      title: 'Footer CTA Override',
      type: 'text',
      rows: 2,
      group: 'linking',
    }),

    // ── SCHEMA.ORG ────────────────────────────────────────────────────────────
    defineField({
      name: 'schemaType',
      title: 'Primary Schema Type',
      type: 'string',
      group: 'schema',
      options: {
        list: [
          { title: 'ContactPage (recommended)', value: 'ContactPage' },
          { title: 'LocalBusiness',             value: 'LocalBusiness' },
        ],
      },
      initialValue: 'ContactPage',
    }),
    defineField({
      name: 'customJsonLd',
      title: 'Custom JSON-LD (advanced override)',
      type: 'text',
      rows: 8,
      group: 'schema',
    }),

  ],

  preview: {
    select: { title: 'title', status: 'status' },
    prepare({ title, status }: { title: string; status: string }) {
      const icons: Record<string, string> = { published: '✅', 'ready-for-review': '🔍', 'needs-review': '✏️', draft: '📝' }
      return { title: title ?? 'Contact Us Page', subtitle: `${icons[status] ?? '•'} ${status}` }
    },
  },
})
