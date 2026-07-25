import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: () => '⚙️',
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      initialValue: 'CiCon Marketing',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'siteUrl',
      title: 'Production URL',
      type: 'url',
      initialValue: 'https://cicon.ca',
    }),
    defineField({
      name: 'defaultOgImage',
      title: 'Default Social Share Image',
      type: 'image',
      description: 'Used on pages without a specific og:image. Recommended: 1200×630px.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'organizationName',
      title: 'Organization Name',
      type: 'string',
      initialValue: 'CiCon Marketing',
    }),
    defineField({
      name: 'telephone',
      title: 'Primary Phone',
      type: 'string',
      initialValue: '+1-289-807-1020',
    }),
    defineField({
      name: 'email',
      title: 'Primary Email',
      type: 'string',
      initialValue: 'info@cicon.ca',
    }),
    defineField({
      name: 'address',
      title: 'Business Address',
      type: 'object',
      fields: [
        defineField({ name: 'street', title: 'Street', type: 'string', initialValue: '131 Golf Club Ct' }),
        defineField({ name: 'city', title: 'City', type: 'string', initialValue: 'Richmond Hill' }),
        defineField({ name: 'province', title: 'Province', type: 'string', initialValue: 'ON' }),
        defineField({ name: 'postalCode', title: 'Postal Code', type: 'string', initialValue: 'L4C 5E1' }),
        defineField({ name: 'country', title: 'Country', type: 'string', initialValue: 'CA' }),
      ],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'object',
      fields: [
        defineField({ name: 'facebook', type: 'url', title: 'Facebook', initialValue: 'https://www.facebook.com/ciconmarketing/' }),
        defineField({ name: 'instagram', type: 'url', title: 'Instagram', initialValue: 'https://www.instagram.com/ciconmktg/' }),
        defineField({ name: 'linkedin', type: 'url', title: 'LinkedIn', initialValue: 'https://linkedin.com/company/cicon-marketing/' }),
        defineField({ name: 'youtube', type: 'url', title: 'YouTube', initialValue: 'https://www.youtube.com/@CiConMarketing' }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Site Settings', subtitle: 'cicon.ca' }
    },
  },
})
