import { defineType, defineField, defineArrayMember } from 'sanity'

export default defineType({
  name: 'privacyPolicyPage',
  title: 'Privacy Policy',
  type: 'document',
  icon: () => '🔒',
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({ name: 'pageTitle', title: 'Page Title', type: 'string', initialValue: 'Privacy Policy' }),
    defineField({ name: 'lastReviewed', title: 'Last Reviewed', type: 'string',
      description: 'e.g. "May 2026" — shown under the title.',
      initialValue: 'May 2026' }),
    defineField({
      name: 'content',
      title: 'Page Content',
      description: 'Full policy body. Use "Heading 2" for section headings, bullets for lists.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Paragraph', value: 'normal' },
            { title: 'Heading 2', value: 'h2' },
            { title: 'Heading 3', value: 'h3' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
            ],
            annotations: [
              defineArrayMember({
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  defineField({ name: 'href', type: 'string', title: 'URL' }),
                ],
              }),
            ],
          },
          lists: [{ title: 'Bullet', value: 'bullet' }],
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'pageTitle', subtitle: 'lastReviewed' },
    prepare({ title, subtitle }: { title: string; subtitle: string }) {
      return { title: title ?? 'Privacy Policy', subtitle: subtitle ? `Last reviewed: ${subtitle}` : '' }
    },
  },
})
