import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'blogCategory',
  title: 'Blog Category',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Category Name', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name', maxLength: 96 }, validation: (Rule) => Rule.required() }),
    defineField({ name: 'description', title: 'Description (1 sentence)', type: 'text', rows: 2, description: 'Used in Category Spotlight rows on the blog index.' }),
    defineField({ name: 'sortOrder', title: 'Sort Order', type: 'number', description: 'Lower numbers appear first in category filters.', initialValue: 100 }),
  ],
  preview: { select: { title: 'name' } },
})
