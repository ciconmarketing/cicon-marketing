import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'caseStudy',
  title: 'Case Study',
  type: 'document',
  // Hidden 2026-05 — case studies not publicly disclosed during growth stage
  hidden: () => true,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'workflow', title: 'Workflow' },
  ],
  fields: [
    defineField({
      name: 'clientName',
      title: 'Client Name',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'serviceType',
      title: 'Service Type',
      type: 'string',
      group: 'content',
      options: {
        list: [
          { title: 'Dental Marketing',      value: 'dental' },
          { title: 'Paid Advertising',      value: 'paid-ads' },
          { title: 'AI SEO',                value: 'seo' },
          { title: 'Local SEO',             value: 'local-seo' },
          { title: 'Social Media',          value: 'social' },
          { title: 'Website Development',   value: 'web-dev' },
          { title: 'Media Production',      value: 'media' },
          { title: 'CRM Integration',       value: 'crm' },
        ],
      },
    }),
    defineField({
      name: 'isPlaceholder',
      title: 'Placeholder (awaiting real client data)',
      type: 'boolean',
      group: 'workflow',
      description: 'True until MJ has client approval to publish real data',
      initialValue: true,
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 4,
      group: 'content',
      description: '3 sentences max: situation → challenge → outcome',
    }),
    defineField({
      name: 'heroStat',
      title: 'Hero Stat',
      type: 'object',
      group: 'content',
      fields: [
        defineField({ name: 'value', title: 'Value (e.g. "+340%")', type: 'string' }),
        defineField({ name: 'label', title: 'Label (e.g. "Organic Traffic")', type: 'string' }),
      ],
    }),
    defineField({
      name: 'placeholderImage',
      title: 'Placeholder Image',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
    }),
  ],

  preview: {
    select: { title: 'clientName', serviceType: 'serviceType', placeholder: 'isPlaceholder' },
    prepare({ title, serviceType, placeholder }: { title: string; serviceType: string; placeholder: boolean }) {
      return {
        title,
        subtitle: `${placeholder ? '🔒 Placeholder · ' : '✅ Live · '}${serviceType ?? 'unknown'}`,
      }
    },
  },
})
