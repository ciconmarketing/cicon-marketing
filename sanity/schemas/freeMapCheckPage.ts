import { defineType, defineField, defineArrayMember } from 'sanity'

export default defineType({
  name: 'freeMapCheckPage',
  title: 'Free Map Check Page',
  type: 'document',
  icon: () => '📍',
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({
      name: 'hero',
      title: '① Hero Section',
      type: 'object',
      fields: [
        defineField({ name: 'headline', title: 'Headline (H1)', type: 'text', rows: 2,
          initialValue: 'Check Your Google Map Visibility for Free' }),
        defineField({ name: 'badge', title: 'Badge Text (small label above headline)', type: 'string',
          initialValue: 'Free Local SEO Tool' }),
        defineField({ name: 'subheadline', title: 'First Description Paragraph', type: 'text', rows: 3,
          initialValue: "Check Your Google Map Visibility for Free and discover the truth about your local reach. Most businesses think they're #1 because they see themselves at the top when searching from their own office, but their customers often see something completely different." }),
        defineField({ name: 'description', title: 'Second Description Paragraph', type: 'text', rows: 3,
          initialValue: 'Don\'t let a "false positive" search result cost you sales. Enter your business name below to get a real-time heat map of your local rankings and see exactly how you appear to customers across every corner of your city.' }),
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
        { _key: 'faq1', question: 'Is this map check really free?', answer: 'Yes, 100%. There is no cost to run the scan. If you request the follow-up manual audit and 90-day roadmap from our team, that initial consultation is also free.' },
        { _key: 'faq2', question: 'Why do my search results look different when I check on my phone at the office?', answer: "Google personalizes search results based on a user's exact location and search history. If you frequently search for your own business while standing at your business, Google learns to show it to you. This tool bypasses that bias to show you what an average customer sees from different points across the city." },
        { _key: 'faq3', question: "My map shows a lot of red and orange—is it too late to fix?", answer: "Absolutely not. In fact, that's why we built this tool. Red and orange simply mean your competitors are currently out-optimizing you. Knowing where you are losing is the first step. By optimizing your Google Business Profile, gathering reviews, and improving local relevance, you can expand your \"Green Zone.\"" },
        { _key: 'faq4', question: 'What happens after I fill out the form for the "Dominance Strategy"?', answer: "We don't just send you a generic automated PDF. One of our local SEO specialists will manually review your heat map results, analyze your top three nearest competitors, and draft a specific 90-day roadmap with actionable steps. We will then email you to schedule a brief 15-minute call to review those findings together." },
      ],
    }),
    defineField({
      name: 'finalCta',
      title: '③ Final CTA Section',
      type: 'object',
      fields: [
        defineField({ name: 'headline', title: 'Headline', type: 'string',
          initialValue: 'Ready to grow with a boutique marketing partner?' }),
        defineField({ name: 'body', title: 'Body Text', type: 'text', rows: 3 }),
      ],
    }),
  ],
  preview: { prepare() { return { title: 'Free Map Check Page' } } },
})
