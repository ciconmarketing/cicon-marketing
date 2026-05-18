import { defineType, defineField, defineArrayMember } from 'sanity'

/**
 * mapCheckPage — singleton document for /check-google-map-visibility-for-free/
 * Tab structure mirrors servicePage: Identity & Workflow | SEO & Meta | Hero | Content Blocks | Internal Linking | Schema.org
 */
export default defineType({
  name: 'mapCheckPage',
  title: 'Free Map Check Page',
  type: 'document',
  icon: () => '🗺️',

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
      initialValue: 'Check Your Google Map Visibility for Free',
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      group: 'identity',
      options: { source: 'title', maxLength: 96 },
      description: 'Must stay "check-google-map-visibility-for-free" — do not change (SEO equity)',
      validation: Rule => Rule.required(),
      initialValue: { current: 'check-google-map-visibility-for-free' },
    }),
    defineField({
      name: 'pageType',
      title: 'Page Type',
      type: 'string',
      group: 'identity',
      readOnly: true,
      initialValue: 'tool',
      options: { list: [{ title: 'Free Tool / Lead Magnet', value: 'tool' }] },
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
      description: 'Keep under 60 characters. Do NOT change — SEO equity.',
      validation: Rule => Rule.max(60),
      initialValue: 'Free Google Maps Visibility Check | Local Ranking Heat Map',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 2,
      group: 'seo',
      description: 'Keep under 160 characters. Do NOT change — SEO equity.',
      validation: Rule => Rule.max(160),
      initialValue: 'Is your business invisible on Google Maps? Use our free local ranking tool to see exactly where you rank. Get a real-time heat map today.',
    }),
    defineField({
      name: 'canonical',
      title: 'Canonical URL',
      type: 'url',
      group: 'seo',
      initialValue: 'https://cicon.ca/check-google-map-visibility-for-free/',
    }),
    defineField({
      name: 'ogImage',
      title: 'OG Image',
      type: 'image',
      group: 'seo',
      options: { hotspot: true },
      description: 'Social share image. Current: Google-Map-Visibility-for-Free-3-3.jpg',
    }),
    defineField({
      name: 'ogImageUrl',
      title: 'OG Image URL (external, if not uploaded above)',
      type: 'url',
      group: 'seo',
      description: 'Use this if the image lives on WordPress CDN',
      initialValue: 'https://cicon.ca/wp-content/uploads/2026/03/Google-Map-Visibility-for-Free-3-3.jpg',
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
      initialValue: 'Free Local SEO Tool',
    }),
    defineField({
      name: 'heroHeadline',
      title: 'Hero Headline (H1)',
      type: 'string',
      group: 'hero',
      description: 'Do NOT change — SEO equity',
      validation: Rule => Rule.required(),
      initialValue: 'Check Your Google Map Visibility for Free',
    }),
    defineField({
      name: 'heroDescription1',
      title: 'Hero Body Paragraph 1',
      type: 'text',
      rows: 3,
      group: 'hero',
      initialValue: 'Check Your Google Map Visibility for Free and discover the truth about your local reach. Most businesses think they\'re #1 because they see themselves at the top when searching from their own office, but their customers often see something completely different.',
    }),
    defineField({
      name: 'heroDescription2',
      title: 'Hero Body Paragraph 2',
      type: 'text',
      rows: 3,
      group: 'hero',
      initialValue: 'Don\'t let a "false positive" search result cost you sales. Enter your business name below to get a real-time heat map of your local rankings and see exactly how you appear to customers across every corner of your city.',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      group: 'hero',
      options: { hotspot: true },
      description: 'Heat map screenshot. Leave blank to use the hardcoded CDN URL below.',
    }),
    defineField({
      name: 'heroImageUrl',
      title: 'Hero Image URL (external)',
      type: 'url',
      group: 'hero',
      description: 'Used if Hero Image above is not uploaded. Points to WordPress CDN.',
      initialValue: 'https://cicon.ca/wp-content/uploads/2026/03/google-maps-visibility-heat-map-audit-1-768x355.jpg',
    }),
    defineField({
      name: 'heroImageAlt',
      title: 'Hero Image Alt Text',
      type: 'string',
      group: 'hero',
      initialValue: 'Dashboard interface of a local SEO rank tracking tool showing a geographical Position Map with circular heat map markers in green and orange, indicating search ranking positions across a city area.',
    }),
    defineField({
      name: 'showHeroCta',
      title: 'Show Hero CTA Button',
      type: 'boolean',
      group: 'hero',
      description: 'Default false — the Localo scanner IS the CTA on this page',
      initialValue: false,
    }),

    // ── CONTENT BLOCKS ────────────────────────────────────────────────────────

    // 1. Scanner Block
    defineField({
      name: 'scannerBlock',
      title: '① Localo Scanner Widget',
      type: 'object',
      group: 'content',
      description: 'The Localo iframe embed. Edit embedCode to update the widget without code changes.',
      fields: [
        defineField({ name: 'sectionHeader', title: 'Section Header (optional)', type: 'string' }),
        defineField({
          name: 'embedCode',
          title: 'Embed Code (iframe HTML)',
          type: 'text',
          rows: 6,
          description: 'Full iframe HTML tag. Edit src URL here without touching code.',
          initialValue: '<iframe src="https://app.localo.com/_demo/place-import" allow="geolocation" loading="lazy" title="Free Google Maps local ranking heat map scanner — enter your business name to see your visibility" style="border:none;height:400px;width:100%;border-radius:16px;min-height:200px;display:block;"></iframe>',
          validation: Rule => Rule.required(),
        }),
        defineField({ name: 'loadingText',        title: 'Loading Text',           type: 'string', initialValue: 'Loading scanner…' }),
        defineField({ name: 'containerMaxWidth',  title: 'Container Max Width (px)', type: 'number', initialValue: 900 }),
      ],
    }),

    // 2. Results Explainer
    defineField({
      name: 'resultsExplainerBlock',
      title: '② Results Explainer',
      type: 'object',
      group: 'content',
      fields: [
        defineField({ name: 'sectionHeader', title: 'Section Header', type: 'string', initialValue: 'Did you see Red or Orange dots?' }),
        defineField({ name: 'leadLine',      title: 'Lead Line (bold callout)', type: 'string', initialValue: 'If you aren\'t in the Top 3, you are losing 75% of local mobile clicks.' }),
        defineField({
          name: 'explainerItems',
          title: 'Dot Colour Explainers (2–4)',
          type: 'array',
          of: [defineArrayMember({
            type: 'object',
            name: 'dotExplainer',
            fields: [
              defineField({
                name: 'dotColor',
                title: 'Dot Colour',
                type: 'string',
                options: { list: [
                  { title: 'Red',    value: 'red' },
                  { title: 'Orange', value: 'orange' },
                  { title: 'Yellow', value: 'yellow' },
                  { title: 'Green',  value: 'green' },
                ]},
              }),
              defineField({ name: 'label',       title: 'Label',       type: 'string' }),
              defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
            ],
            preview: { select: { title: 'label', subtitle: 'dotColor' } },
          })],
          validation: Rule => Rule.min(2).max(4),
          initialValue: [
            { _key: 'e1', dotColor: 'red',    label: 'Red Dots',    description: 'Your business is buried on page 2 or 3. Customers can\'t find you. You\'re effectively invisible to anyone not searching from directly outside your door.' },
            { _key: 'e2', dotColor: 'orange', label: 'Orange Dots', description: 'You\'re close, but a competitor is currently taking your leads. Positions 4–10 capture a fraction of the clicks that positions 1–3 do. Close is not close enough.' },
          ],
        }),
      ],
    }),

    // 3. Lead Capture Block
    defineField({
      name: 'leadCaptureBlock',
      title: '③ Lead Capture Form',
      type: 'object',
      group: 'content',
      description: 'Form logic lives in code (ContactForm component). This block controls the surrounding copy and form metadata.',
      fields: [
        defineField({ name: 'sectionHeader',   title: 'Section Header',       type: 'string', initialValue: 'Want to know how to fix it?' }),
        defineField({ name: 'leadCopy',        title: 'Lead Copy',            type: 'text', rows: 3, initialValue: 'Enter your details below and we\'ll manually analyse your heat map results, benchmark your top 3 competitors, and send you a personalised 90-day Local Dominance Strategy — free.' }),
        defineField({ name: 'formSourceTag',   title: 'Form Source Tag',      type: 'string', initialValue: 'Google Map Visibility Audit', description: 'Tags submissions for CRM tracking' }),
        defineField({ name: 'formSubmitLabel', title: 'Form Submit Label',    type: 'string', initialValue: 'Get My Free Audit' }),
        defineField({ name: 'successMessage',  title: 'Success Message',      type: 'text', rows: 2, initialValue: 'We\'ve received your request! Our team will review your heat map and send your 90-day strategy within 1 business day.' }),
        defineField({ name: 'showFormImage',   title: 'Show Image Below Form', type: 'boolean', initialValue: false, description: 'Keep off — brief explicitly excludes second image in form section' }),
      ],
    }),

    // 4. Social Proof Block
    defineField({
      name: 'socialProofBlock',
      title: '④ Social Proof',
      type: 'object',
      group: 'content',
      fields: [
        defineField({
          name: 'useHomePageComponent',
          title: 'Use Home Page GoogleReviews Component',
          type: 'boolean',
          initialValue: true,
          description: 'When true, the page reuses the same Google Reviews widget as the homepage',
        }),
        defineField({
          name: 'overrideSectionHeader',
          title: 'Override Section Header (optional)',
          type: 'string',
          description: 'Leave blank to use the component\'s default header',
        }),
      ],
    }),

    // 5. FAQ Block
    defineField({
      name: 'faqBlock',
      title: '⑤ FAQ',
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
              defineField({ name: 'answerHtml', title: 'Answer Contains HTML Links', type: 'boolean', initialValue: false, description: 'Set true if answer contains <a> tags rendered as raw HTML' }),
            ],
            preview: { select: { title: 'question' } },
          })],
          validation: Rule => Rule.min(4).max(8),
          initialValue: [
            { _key: 'q1', question: 'Is this map check really free?', answer: 'Yes, 100%. There is no cost to run the scan. If you request the follow-up manual audit and 90-day roadmap from our team, that initial consultation is also free.', answerHtml: false },
            { _key: 'q2', question: 'Why do my search results look different when I check on my phone at the office?', answer: 'Google personalizes search results based on a user\'s exact location and search history. If you frequently search for your own business while standing at your business, Google learns to show it to you. This tool bypasses that bias to show you what an average customer sees from different points across the city.', answerHtml: false },
            { _key: 'q3', question: 'My map shows a lot of red and orange—is it too late to fix?', answer: 'Absolutely not. In fact, that\'s why we built this tool. Red and orange simply mean your competitors are currently out-optimizing you. Knowing where you are losing is the first step. By optimizing your Google Business Profile, gathering reviews, and improving local relevance, you can expand your "Green Zone."', answerHtml: false },
            { _key: 'q4', question: 'What happens after I fill out the form for the "Dominance Strategy"?', answer: 'We don\'t just send you a generic automated PDF. One of our local SEO specialists will manually review your heat map results, analyze your top three nearest competitors, and draft a specific 90-day roadmap with actionable steps. We will then email you to schedule a brief 15-minute call to review those findings together.', answerHtml: false },
          ],
        }),
      ],
    }),

    // 6. Final CTA Block
    defineField({
      name: 'finalCtaBlock',
      title: '⑥ Final CTA',
      type: 'object',
      group: 'content',
      fields: [
        defineField({ name: 'sectionHeader',       title: 'Section Header',         type: 'string', initialValue: 'Ready to claim your territory?' }),
        defineField({ name: 'trustLine',           title: 'Trust Line (optional)',  type: 'string' }),
        defineField({ name: 'primaryCtaLabel',     title: 'Primary CTA Label',      type: 'string', initialValue: 'Chat on WhatsApp' }),
        defineField({ name: 'primaryCtaUrl',       title: 'Primary CTA URL',        type: 'url',    initialValue: 'https://wa.me/16475840800' }),
        defineField({ name: 'secondaryCtaLabel',   title: 'Secondary CTA Label',    type: 'string', initialValue: 'Contact Us' }),
        defineField({ name: 'secondaryCtaUrl',     title: 'Secondary CTA URL',      type: 'string', initialValue: '/contact-us/' }),
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
          { title: 'WebPage (recommended)',  value: 'WebPage' },
          { title: 'Service',               value: 'Service' },
          { title: 'FAQPage (auto from FAQ)', value: 'FAQPage' },
        ],
      },
      initialValue: 'WebPage',
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
      return { title: title ?? 'Free Map Check Page', subtitle: `${icons[status] ?? '•'} ${status}` }
    },
  },
})
