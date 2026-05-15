import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'meta', title: 'SEO & Meta' },
    { name: 'workflow', title: 'Workflow' },
  ],
  fields: [
    defineField({
      name: 'status', title: 'Status', type: 'string', group: 'workflow',
      options: { list: [
        { title: 'Draft', value: 'draft' },
        { title: 'Published', value: 'published' },
        { title: 'Archived', value: 'archived' },
      ]},
      initialValue: 'draft',
    }),
    defineField({ name: 'title', title: 'Title (H1)', type: 'string', group: 'content', validation: (Rule) => Rule.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', group: 'content', options: { source: 'title', maxLength: 96 }, validation: (Rule) => Rule.required() }),
    defineField({ name: 'dek', title: 'Subtitle / Dek', type: 'text', rows: 2, group: 'content' }),
    defineField({ name: 'category', title: 'Category', type: 'reference', to: [{ type: 'blogCategory' }], group: 'content' }),
    defineField({ name: 'heroImage', title: 'Hero Image', type: 'image', options: { hotspot: true }, group: 'content', fields: [{ name: 'alt', type: 'string', title: 'Alt Text' }] }),
    defineField({ name: 'readTime', title: 'Read Time (minutes)', type: 'number', group: 'content' }),
    defineField({ name: 'publishedAt', title: 'Published At', type: 'datetime', group: 'content' }),
    defineField({ name: 'metaDescription', title: 'Meta Description', type: 'text', rows: 2, group: 'meta' }),
    defineField({ name: 'keywords', title: 'Keywords (comma-separated)', type: 'string', group: 'meta' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'status', media: 'heroImage' },
  },
})
