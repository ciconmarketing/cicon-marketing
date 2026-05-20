import { defineType, defineField, defineArrayMember } from 'sanity'

export default defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  icon: () => '📞',
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({
      name: 'hero',
      title: '① Hero Section',
      type: 'object',
      fields: [
        defineField({ name: 'headline', title: 'Headline (H1)', type: 'string',
          initialValue: "Talk to a senior strategist — not a sales funnel." }),
        defineField({ name: 'subheadline', title: 'Subheadline', type: 'text', rows: 3,
          initialValue: "Tell us about your clinic or local business and you'll hear back within 1 business hour, Monday to Friday. No discovery-call gauntlet. No junior account manager." }),
      ],
    }),
    defineField({
      name: 'faqs',
      title: '② FAQ Section',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object', name: 'faqItem', title: 'FAQ',
          fields: [
            defineField({ name: 'question', title: 'Question', type: 'string', validation: r => r.required() }),
            defineField({ name: 'answer', title: 'Answer', type: 'text', rows: 4, validation: r => r.required() }),
          ],
          preview: { select: { title: 'question' } },
        }),
      ],
      initialValue: [
        { _key: 'faq1', question: 'How fast do you actually respond?', answer: 'Within 1 business hour, Monday to Friday, 9am – 6pm ET. Submissions after hours or on weekends get a reply first thing the next business day. No exceptions, no auto-replies pretending to be us.' },
        { _key: 'faq2', question: "What's your minimum engagement?", answer: "Our smallest engagements start around $1,500/month for focused work like Google Business Profile management or local SEO. Full-service builds — paid ads, SEO, content, creative — typically start at $3,000–$5,000/month. We'd rather under-promise than oversell a retainer you don't need yet." },
        { _key: 'faq3', question: 'Do you work with businesses outside the GTA?', answer: "Most of our clients are GTA-based because local SEO and Google Business Profile work benefit from us knowing the territory. We do take on remote clients for paid ads, SEO, and content — but if you need physical photo/video production or in-person strategy, GTA-only." },
        { _key: 'faq4', question: "What if I'm already working with another agency?", answer: "Two options. We can run a no-strings audit of what they're doing — sometimes the answer is 'they're doing fine, stay put.' Or, if you're already decided to switch, we handle the offboarding so you don't have to fight for assets and access. Either way, no awkwardness — we've been on both sides of that conversation." },
      ],
    }),
    defineField({
      name: 'seoCopy',
      title: '③ SEO Copy Block',
      type: 'object',
      description: 'Bottom section for search engine visibility.',
      fields: [
        defineField({ name: 'headline', title: 'Headline', type: 'string',
          initialValue: 'Marketing that earns its keep — for clinics and local businesses across the GTA' }),
        defineField({ name: 'body', title: 'Body Text', type: 'text', rows: 4,
          initialValue: 'CiCon Marketing is a boutique digital agency based in Richmond Hill, Ontario. We work with dental clinics, local service businesses, and retail across the Greater Toronto Area on Google Ads, Meta Ads, local SEO, Google Business Profile management, social media, and professional photo and video production. Every engagement is run by a senior strategist — no junior handoff, no template playbook. Reach out using the form above, by phone at +1 (289) 807-1020, or on WhatsApp.' }),
      ],
    }),
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
  preview: { prepare() { return { title: 'Contact Page' } } },
})
