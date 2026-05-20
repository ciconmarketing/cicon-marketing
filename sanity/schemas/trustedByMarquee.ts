import { defineType, defineField, defineArrayMember } from 'sanity'

/**
 * trustedByMarquee — Singleton document for the "Trusted By" client logo marquee.
 * Displayed on the homepage after the Services section.
 * Logos are served from /public/clients-logo/ — store filename only (e.g. "sparkle-light.png").
 */
export default defineType({
  name: 'trustedByMarquee',
  title: 'Trusted By — Client Logo Marquee',
  type: 'document',
  icon: () => '🏢',
  // Singleton — only one document of this type should exist
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({
      name: 'enabled',
      title: 'Show Marquee on Homepage',
      type: 'boolean',
      initialValue: true,
      description: 'Toggle the entire section on or off without deleting data.',
    }),
    defineField({
      name: 'heading',
      title: 'Section Heading',
      type: 'string',
      initialValue: 'Trusted by GTA businesses and dental clinics',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading (optional)',
      type: 'text',
      rows: 2,
      initialValue: 'From single-location clinics to multi-location practices and growth-stage businesses across the Greater Toronto Area',
    }),
    defineField({
      name: 'logos',
      title: 'Client Logos',
      type: 'array',
      description: 'Logos are served from /public/clients-logo/. Enter the exact filename including extension.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'clientLogo',
          title: 'Client Logo',
          fields: [
            defineField({
              name: 'clientName',
              title: 'Client Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
              description: 'Used as alt text: "[Client Name] logo"',
            }),
            defineField({
              name: 'logoFilename',
              title: 'Logo Filename',
              type: 'string',
              validation: (Rule) => Rule.required(),
              description: 'Exact filename in /public/clients-logo/ — e.g. "sparkle-light.png"',
              placeholder: 'sparkle-light.png',
            }),
            defineField({
              name: 'order',
              title: 'Display Order',
              type: 'number',
              description: 'Lower numbers appear first in the marquee.',
            }),
            defineField({
              name: 'scale',
              title: 'Logo Scale Override',
              type: 'number',
              description: 'Optional per-logo scale adjustment (default 1.0). Use values above 1.0 to enlarge logos that look small (e.g. 1.2 for square logos with internal whitespace). Use values below 1.0 to shrink overly dominant logos. Leave at 1.0 if the logo looks balanced.',
              initialValue: 1.0,
              validation: (Rule) => Rule.min(0.7).max(1.4),
            }),
          ],
          preview: {
            select: { title: 'clientName', subtitle: 'logoFilename' },
          },
        }),
      ],
      initialValue: [
        { _key: 'cl01', clientName: 'Sparkle Light',            logoFilename: 'sparkle-light.png',            order: 1,  scale: 1.25 },
        { _key: 'cl02', clientName: 'Bethel International',     logoFilename: 'bethel-international.jpg',     order: 2,  scale: 1.2  },
        { _key: 'cl03', clientName: 'Joseph Kitchen and Bath',  logoFilename: 'joseph-kitchen-and-bath.png',  order: 3,  scale: 1.0  },
        { _key: 'cl04', clientName: 'Dentistry on Guelph',      logoFilename: 'dentistry-on-guelph.png',      order: 4,  scale: 1.15 },
        { _key: 'cl05', clientName: 'First Electrical Supply',  logoFilename: 'first-electrical-supply.png',  order: 5,  scale: 1.0  },
        { _key: 'cl06', clientName: 'Smiles on Sparks',         logoFilename: 'smiles-on-sparks.png',         order: 6,  scale: 1.3  },
        { _key: 'cl07', clientName: 'Smile Express',            logoFilename: 'smile-express.png',            order: 7,  scale: 1.0  },
        { _key: 'cl08', clientName: 'AM Group Studio',          logoFilename: 'am-group-studio.jpg',          order: 8,  scale: 1.0  },
        { _key: 'cl09', clientName: 'Direct Air Systems',       logoFilename: 'direct-air-systems.png',       order: 9,  scale: 1.0  },
        { _key: 'cl10', clientName: 'Maison Opes',              logoFilename: 'maison-opes.png',              order: 10, scale: 1.0  },
        { _key: 'cl11', clientName: 'Nootk',                    logoFilename: 'nootk.svg',                    order: 11, scale: 1.2  },
        { _key: 'cl12', clientName: 'Venizzi Kitchen and Bath', logoFilename: 'venizzi-kitchen-and-bath.jpg', order: 12, scale: 1.0  },
      ],
    }),
    defineField({
      name: 'marqueeSpeed',
      title: 'Scroll Speed',
      type: 'string',
      initialValue: 'medium',
      options: {
        list: [
          { title: 'Slow (60 s)',   value: 'slow'   },
          { title: 'Medium (40 s)', value: 'medium' },
          { title: 'Fast (25 s)',   value: 'fast'   },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'direction',
      title: 'Scroll Direction',
      type: 'string',
      initialValue: 'left',
      options: {
        list: [
          { title: 'Left (default)', value: 'left'  },
          { title: 'Right',          value: 'right' },
        ],
        layout: 'radio',
      },
    }),
  ],

  preview: {
    select: { enabled: 'enabled', heading: 'heading' },
    prepare({ enabled, heading }: { enabled: boolean; heading: string }) {
      return {
        title: heading ?? 'Trusted By Marquee',
        subtitle: enabled ? '✅ Visible on homepage' : '🚫 Hidden',
      }
    },
  },
})
