import { defineType, defineField, defineArrayMember } from 'sanity'

/**
 * aboutPage — singleton document for /about-us/
 * Tab structure mirrors servicePage: Identity & Workflow | SEO & Meta | Hero | Content Blocks | Internal Linking | Schema.org
 */
export default defineType({
  name: 'aboutPage',
  title: 'About Us Page',
  type: 'document',
  icon: () => '👤',

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
      description: 'Used as the H1 headline on the page',
      validation: Rule => Rule.required(),
      initialValue: 'About CiCon Marketing',
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      group: 'identity',
      options: { source: 'title', maxLength: 96 },
      description: 'Must stay "about-us" — do not change (SEO equity)',
      validation: Rule => Rule.required(),
      initialValue: { current: 'about-us' },
    }),
    defineField({
      name: 'pageType',
      title: 'Page Type',
      type: 'string',
      group: 'identity',
      readOnly: true,
      initialValue: 'about',
      options: { list: [{ title: 'About Page', value: 'about' }] },
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
      description: 'Flag if copy needs a full rewrite pass',
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

    // ── SEO & META ────────────────────────────────────────────────────────────
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      group: 'seo',
      description: 'Browser tab + Google result title. Keep under 60 characters.',
      validation: Rule => Rule.max(60),
      initialValue: 'About CiCon Marketing | Boutique Digital Agency in Richmond Hill, GTA',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 2,
      group: 'seo',
      description: 'Google snippet. Keep under 160 characters.',
      validation: Rule => Rule.max(160),
      initialValue: 'CiCon is a boutique AI-augmented digital marketing studio in Richmond Hill, GTA — building compounding growth systems for local businesses and dental clinics.',
    }),
    defineField({
      name: 'canonical',
      title: 'Canonical URL',
      type: 'url',
      group: 'seo',
      description: 'Override only if needed. Default: https://cicon.ca/about-us/',
      initialValue: 'https://cicon.ca/about-us/',
    }),
    defineField({
      name: 'ogImage',
      title: 'OG Image',
      type: 'image',
      group: 'seo',
      options: { hotspot: true },
      description: 'Social share image. Recommended: 1200×630px',
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
      description: 'Set to false to add noindex directive',
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
      description: 'Small label above H1, e.g. "About CiCon Marketing"',
      initialValue: 'About CiCon Marketing',
    }),
    defineField({
      name: 'heroHeadline',
      title: 'Hero Headline (H1)',
      type: 'string',
      group: 'hero',
      validation: Rule => Rule.required(),
      initialValue: 'A boutique GTA marketing studio building AI-augmented growth systems for local businesses and dental clinics.',
    }),
    defineField({
      name: 'heroSubheadline',
      title: 'Hero Sub-headline',
      type: 'text',
      rows: 3,
      group: 'hero',
      description: 'Supporting sentence shown under H1. Can include founding context.',
      initialValue: 'Operating across the Greater Toronto Area — founded by a Google-certified strategist with a Master\'s in Engineering and 15+ years building data-driven growth systems.',
    }),
    defineField({
      name: 'heroPrimaryCtaLabel',
      title: 'Hero Primary CTA Label',
      type: 'string',
      group: 'hero',
      initialValue: 'Chat on WhatsApp',
    }),
    defineField({
      name: 'heroPrimaryCtaUrl',
      title: 'Hero Primary CTA URL',
      type: 'url',
      group: 'hero',
      initialValue: 'https://wa.me/16475840800',
    }),
    defineField({
      name: 'heroSecondaryCtaLabel',
      title: 'Hero Secondary CTA Label',
      type: 'string',
      group: 'hero',
      initialValue: 'See our services',
    }),
    defineField({
      name: 'heroSecondaryCtaUrl',
      title: 'Hero Secondary CTA URL',
      type: 'string',
      group: 'hero',
      initialValue: '/services/',
    }),

    // ── CONTENT BLOCKS ────────────────────────────────────────────────────────

    // 1. Why we exist
    defineField({
      name: 'whyWeExist',
      title: '① Why We Exist',
      type: 'object',
      group: 'content',
      fields: [
        defineField({
          name: 'sectionHeader',
          title: 'Section Header',
          type: 'string',
          initialValue: 'Why CiCon exists',
        }),
        defineField({
          name: 'paragraph',
          title: 'Body Paragraph',
          type: 'text',
          rows: 5,
          description: 'Single tight paragraph, max 600 characters',
          validation: Rule => Rule.max(600),
          initialValue: 'Most agencies sell hours and report on impressions. CiCon was built as a reaction to that model. We don\'t invoice for meetings; we build compounding visibility engines — local search infrastructure, content systems, and paid acquisition funnels that earn more over time, not less. The GTA is not a generic market, and "best practices" from a playbook written for nationwide brands will lose to a competitor who actually understands Richmond Hill, Markham, and the specific search behaviour of a GTA patient or homeowner looking for a local provider. We stay small on purpose so we can stay sharp on your account.',
        }),
      ],
    }),

    // 2. AI Transparency
    defineField({
      name: 'aiTransparencyBlock',
      title: '② AI Transparency — "How we work"',
      type: 'object',
      group: 'content',
      fields: [
        defineField({ name: 'sectionHeader', title: 'Section Header', type: 'string', initialValue: 'AI-augmented, human-owned' }),
        defineField({ name: 'introLine',     title: 'Intro Line',     type: 'string', initialValue: 'We\'re upfront about our stack. Here\'s how the work actually gets done.' }),
        defineField({
          name: 'aiAcceleratesColumn',
          title: 'AI Accelerates Column',
          type: 'object',
          fields: [
            defineField({ name: 'header', title: 'Column Header', type: 'string', initialValue: 'AI accelerates' }),
            defineField({ name: 'body',   title: 'Column Body',   type: 'text', rows: 4, initialValue: 'Keyword clustering, content drafts, predictive bid adjustments, rank tracking, reporting automation. AI cuts what used to take days to hours — and scales output without scaling headcount.' }),
          ],
        }),
        defineField({
          name: 'humansOwnColumn',
          title: 'Humans Own Column',
          type: 'object',
          fields: [
            defineField({ name: 'header', title: 'Column Header', type: 'string', initialValue: 'Humans own' }),
            defineField({ name: 'body',   title: 'Column Body',   type: 'text', rows: 4, initialValue: 'Strategy, creative direction, client relationship, account decisions, and every external communication. AI doesn\'t understand your business context, your competitor\'s local reputation, or why a patient in Markham behaves differently from one in Etobicoke. That judgment lives with your strategist.' }),
          ],
        }),
        defineField({
          name: 'clientsGetBackColumn',
          title: 'Clients Get Back Column',
          type: 'object',
          fields: [
            defineField({ name: 'header', title: 'Column Header', type: 'string', initialValue: 'Clients get back' }),
            defineField({ name: 'body',   title: 'Column Body',   type: 'text', rows: 4, initialValue: 'Lower customer acquisition costs because we\'re not billing for busywork. More senior attention on strategy because the gruntwork is automated. Faster turnaround on deliverables. You pay for outcomes, not for the hours it took to get there.' }),
          ],
        }),
      ],
    }),

    // 3. Stack Block
    defineField({
      name: 'stackBlock',
      title: '③ Our Stack',
      type: 'object',
      group: 'content',
      fields: [
        defineField({ name: 'sectionHeader', title: 'Section Header', type: 'string', initialValue: 'The stack behind every CiCon campaign' }),
        defineField({ name: 'introLine',     title: 'Intro Line',     type: 'string', initialValue: 'We don\'t hide our tools. Every platform below is active on client accounts today.' }),
        defineField({
          name: 'tools',
          title: 'Tools (max 12)',
          type: 'array',
          of: [defineArrayMember({
            type: 'object',
            name: 'tool',
            fields: [
              defineField({ name: 'toolName',     title: 'Tool Name',        type: 'string', validation: Rule => Rule.required() }),
              defineField({ name: 'category',     title: 'Category',         type: 'string', description: 'e.g. SEO, AI, CRM, Analytics, Video' }),
              defineField({ name: 'purpose',      title: 'Purpose (1 line)', type: 'string', description: 'What we use this tool for' }),
              defineField({ name: 'logo',         title: 'Logo (optional)',   type: 'image', options: { hotspot: true } }),
              defineField({ name: 'displayOrder', title: 'Display Order',    type: 'number' }),
            ],
            preview: { select: { title: 'toolName', subtitle: 'category' } },
          })],
          validation: Rule => Rule.max(12),
          initialValue: [
            { _key: 't1', toolName: 'Ahrefs',         category: 'SEO',      purpose: 'Backlink analysis, keyword research, rank tracking', displayOrder: 1 },
            { _key: 't2', toolName: 'Surfer SEO',      category: 'SEO',      purpose: 'On-page content optimisation and NLP scoring',       displayOrder: 2 },
            { _key: 't3', toolName: 'Ubersuggest',     category: 'SEO',      purpose: 'Local keyword discovery and competitor gap analysis', displayOrder: 3 },
            { _key: 't4', toolName: 'Arvow',           category: 'Ads',      purpose: 'Google Ads automation and bid management',            displayOrder: 4 },
            { _key: 't5', toolName: 'Localo',          category: 'Local SEO','purpose': 'GBP optimisation and local rank heat mapping',      displayOrder: 5 },
            { _key: 't6', toolName: 'RankPrompt',      category: 'AI SEO',   purpose: 'AI-driven content strategy and search intent mapping',displayOrder: 6 },
            { _key: 't7', toolName: 'GoHighLevel',     category: 'CRM',      purpose: 'Pipeline management, lead nurturing, and automation',  displayOrder: 7 },
            { _key: 't8', toolName: 'Claude · ChatGPT · Gemini', category: 'AI', purpose: 'Research, content drafts, analysis, and automation', displayOrder: 8 },
            { _key: 't9', toolName: 'Higgsfield',      category: 'Video AI', purpose: 'AI-assisted video content production',                displayOrder: 9 },
          ],
        }),
      ],
    }),

    // 4. Proof Cluster
    defineField({
      name: 'proofCluster',
      title: '④ Proof Cluster',
      type: 'object',
      group: 'content',
      fields: [
        defineField({ name: 'sectionHeader', title: 'Section Header', type: 'string', initialValue: 'The numbers behind the work' }),
        defineField({
          name: 'numericalResult',
          title: 'Numerical Result',
          type: 'object',
          fields: [
            defineField({ name: 'metric',  title: 'Metric (e.g. "3.2×")',      type: 'string' }),
            defineField({ name: 'context', title: 'Context (e.g. "avg. ROAS")', type: 'string' }),
          ],
        }),
        defineField({
          name: 'testimonial',
          title: 'Testimonial',
          type: 'object',
          fields: [
            defineField({ name: 'quote',        title: 'Quote',          type: 'text', rows: 3 }),
            defineField({ name: 'clientName',   title: 'Client Name',   type: 'string' }),
            defineField({ name: 'businessName', title: 'Business Name', type: 'string' }),
            defineField({ name: 'clientPhoto',  title: 'Client Photo',  type: 'image', options: { hotspot: true } }),
          ],
        }),
        defineField({
          name: 'clientLogos',
          title: 'Client Logos (max 7)',
          type: 'array',
          of: [defineArrayMember({
            type: 'object',
            name: 'clientLogo',
            fields: [
              defineField({ name: 'logo', title: 'Logo', type: 'image', options: { hotspot: true } }),
              defineField({ name: 'alt',  title: 'Alt Text', type: 'string' }),
            ],
            preview: { select: { title: 'alt', media: 'logo' } },
          })],
          validation: Rule => Rule.max(7),
        }),
      ],
    }),

    // 5. Process Block
    defineField({
      name: 'processBlock',
      title: '⑤ Process',
      type: 'object',
      group: 'content',
      fields: [
        defineField({ name: 'sectionHeader', title: 'Section Header', type: 'string', initialValue: 'How a CiCon engagement actually works' }),
        defineField({
          name: 'stages',
          title: 'Stages (exactly 4)',
          type: 'array',
          of: [defineArrayMember({
            type: 'object',
            name: 'stage',
            fields: [
              defineField({ name: 'stageNumber',  title: 'Stage Number',             type: 'number' }),
              defineField({ name: 'stageName',    title: 'Stage Name',               type: 'string', validation: Rule => Rule.required() }),
              defineField({ name: 'duration',     title: 'Duration (e.g. "Week 1")', type: 'string' }),
              defineField({ name: 'description',  title: 'Description (one line)',   type: 'string' }),
            ],
            preview: { select: { title: 'stageName', subtitle: 'duration' } },
          })],
          validation: Rule => Rule.length(4),
          initialValue: [
            { _key: 's1', stageNumber: 1, stageName: 'Discovery',    duration: 'Week 1–2',   description: 'Full audit: accounts, competitors, search footprint, conversion gaps' },
            { _key: 's2', stageNumber: 2, stageName: 'Strategy',     duration: 'Week 2–3',   description: 'Channel plan, 90-day KPI targets, creative direction, budget allocation' },
            { _key: 's3', stageNumber: 3, stageName: 'Build & Launch',duration: 'Week 3–4',  description: 'Campaigns go live, assets shipped, tracking verified' },
            { _key: 's4', stageNumber: 4, stageName: 'Optimise',     duration: 'Ongoing',    description: 'Monthly reviews, continuous testing, quarterly business reviews' },
          ],
        }),
      ],
    }),

    // 6. Values Block
    defineField({
      name: 'valuesBlock',
      title: '⑥ Values',
      type: 'object',
      group: 'content',
      fields: [
        defineField({ name: 'sectionHeader', title: 'Section Header', type: 'string', initialValue: 'What we stand for' }),
        defineField({
          name: 'values',
          title: 'Values (exactly 3)',
          type: 'array',
          of: [{ type: 'string' }],
          validation: Rule => Rule.length(3),
          initialValue: [
            'Transparency over polish — you see the numbers, the methodology, and the honest interpretation every time',
            'Senior attention on every account — no hand-offs to junior coordinators, no templated playbooks',
            'Local depth over national breadth — GTA market context is baked into everything we build',
          ],
        }),
      ],
    }),

    // 7. Dental Callout
    defineField({
      name: 'dentalCalloutBlock',
      title: '⑦ Dental Callout',
      type: 'object',
      group: 'content',
      fields: [
        defineField({ name: 'sectionHeader', title: 'Section Header', type: 'string', initialValue: 'Dentists and healthcare practices' }),
        defineField({
          name: 'body',
          title: 'Body',
          type: 'text',
          rows: 4,
          initialValue: 'A meaningful part of our practice is dedicated to dental and healthcare marketing. We understand the CDCP landscape, the referral dynamics of multi-location practices, and the compliance boundaries around health marketing.',
        }),
        defineField({
          name: 'microProofPoints',
          title: 'Micro Proof Points (3 bullets)',
          type: 'array',
          of: [{ type: 'string' }],
          validation: Rule => Rule.length(3),
          initialValue: [
            'Patient acquisition campaigns that comply with RCDSO advertising guidelines',
            'New patient growth across general and specialty dental practices',
            'Dedicated dental marketing hub at dental.cicon.ca',
          ],
        }),
        defineField({ name: 'ctaLabel', title: 'CTA Label', type: 'string', initialValue: 'See dental marketing →' }),
        defineField({ name: 'ctaLink',  title: 'CTA Link',  type: 'url',    initialValue: 'https://dental.cicon.ca' }),
      ],
    }),

    // 8. Local Anchor Block
    defineField({
      name: 'localAnchorBlock',
      title: '⑧ Local Anchor',
      type: 'object',
      group: 'content',
      fields: [
        defineField({ name: 'sectionHeader', title: 'Section Header', type: 'string', initialValue: 'Built for the Greater Toronto Area' }),
        defineField({
          name: 'body',
          title: 'Body (50–70 words)',
          type: 'text',
          rows: 4,
          description: 'Local credibility paragraph. Target 50–70 words.',
          initialValue: 'Our team operates across Richmond Hill, Markham, Toronto, Vaughan, and Mississauga. Local search intent, regional competitive dynamics, and the specific behaviour of a GTA consumer are built into every campaign we run — not bolted on as an afterthought. We don\'t manage accounts remotely from a different province; we\'re in the same markets as your customers.',
        }),
      ],
    }),

    // 9. FAQ Block
    defineField({
      name: 'faqBlock',
      title: '⑨ FAQ',
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
            { _key: 'q1', question: 'Why work with a boutique agency instead of a large one?', answer: 'Large agencies spread attention across hundreds of accounts. At CiCon, every account gets a senior strategist — not a junior coordinator running templated playbooks. You\'re getting direct access to the people who built the systems, not an account manager reading from a dashboard. Smaller roster means faster pivots and real ownership of your results.' },
            { _key: 'q2', question: 'How does CiCon use AI in client work?', answer: 'We use AI where it compounds speed without sacrificing accuracy: keyword research, content production at scale, predictive analytics, and reporting automation. We\'re transparent about this because it\'s how we keep customer acquisition costs down for clients. Human judgment drives every strategy call, creative brief, and quarterly review — AI accelerates the groundwork.' },
            { _key: 'q3', question: 'What\'s included in your reporting?', answer: 'Quarterly business reviews covering traffic, rankings, lead volume, cost per acquisition, and channel ROI — not vanity metrics. You\'ll see what moved, what didn\'t, and what the next 90 days look like.' },
            { _key: 'q4', question: 'Do you work with clinics and businesses outside the GTA?', answer: 'Our core geography is the Greater Toronto Area — Richmond Hill, Toronto, Markham, Vaughan, Mississauga, and surrounding communities. For dental clinics specifically, we\'ve worked with practices across Ontario; reach out and we\'ll tell you honestly if it\'s a fit.' },
            { _key: 'q5', question: 'How quickly do you respond to clients?', answer: 'Within the next business hour for anything urgent, and same business day for general questions. You\'ll have a direct WhatsApp line to your strategist — not a ticket queue.' },
            { _key: 'q6', question: 'What size businesses do you typically work with?', answer: 'Local service businesses and professional practices doing between $500K and $10M in annual revenue who are serious about growth infrastructure.' },
          ],
        }),
      ],
    }),

    // 10. Final CTA
    defineField({
      name: 'finalCtaBlock',
      title: '⑩ Final CTA',
      type: 'object',
      group: 'content',
      fields: [
        defineField({ name: 'sectionHeader', title: 'Section Header', type: 'string', initialValue: 'Ready to build something that compounds?' }),
        defineField({ name: 'trustLine',     title: 'Trust Line (optional)', type: 'string', description: 'Short credibility line below the headline' }),
        defineField({ name: 'primaryCtaLabel', title: 'Primary CTA Label', type: 'string', initialValue: 'Chat on WhatsApp' }),
        defineField({ name: 'primaryCtaUrl',   title: 'Primary CTA URL',   type: 'url',    initialValue: 'https://wa.me/16475840800' }),
        defineField({ name: 'secondaryCtaLabel', title: 'Secondary CTA Label', type: 'string', initialValue: 'Contact us' }),
        defineField({ name: 'secondaryCtaUrl',   title: 'Secondary CTA URL',   type: 'string', initialValue: '/contact-us/' }),
        defineField({ name: 'displayPhone', title: 'Show Phone Number', type: 'boolean', initialValue: true }),
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
      description: 'Service pages to reference in internal links',
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
      description: 'Custom footer CTA text for this page. Leave blank to use site default.',
    }),

    // ── SCHEMA.ORG ────────────────────────────────────────────────────────────
    defineField({
      name: 'schemaType',
      title: 'Primary Schema Type',
      type: 'string',
      group: 'schema',
      options: {
        list: [
          { title: 'AboutPage (recommended)', value: 'AboutPage' },
          { title: 'Organization',            value: 'Organization' },
          { title: 'LocalBusiness',           value: 'LocalBusiness' },
        ],
      },
      initialValue: 'AboutPage',
    }),
    defineField({
      name: 'customJsonLd',
      title: 'Custom JSON-LD (advanced override)',
      type: 'text',
      rows: 8,
      group: 'schema',
      description: 'Optional raw JSON-LD to inject alongside the auto-generated schema. Must be valid JSON.',
    }),

  ],

  preview: {
    select: { title: 'title', status: 'status' },
    prepare({ title, status }: { title: string; status: string }) {
      const icons: Record<string, string> = { published: '✅', 'ready-for-review': '🔍', 'needs-review': '✏️', draft: '📝' }
      return { title: title ?? 'About Us Page', subtitle: `${icons[status] ?? '•'} ${status}` }
    },
  },
})
