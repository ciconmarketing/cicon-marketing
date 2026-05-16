/**
 * SERVICES_NAV — single source of truth for the 8 service spokes.
 * Used by Nav.astro dropdown and services/index.astro grid.
 * Order: Dental flagship first, then alphabetical.
 */
export const SERVICES_NAV = [
  { slug: 'dental',                 title: 'Dental Marketing',       icon: '🦷', isFlagship: true  },
  { slug: 'ai-seo',                 title: 'AI SEO',                 icon: '🔍', isFlagship: false },
  { slug: 'crm-integration',        title: 'CRM Integration',        icon: '🔗', isFlagship: false },
  { slug: 'local-seo',              title: 'Local SEO',              icon: '📍', isFlagship: false },
  { slug: 'media-production',       title: 'Media Production',       icon: '🎥', isFlagship: false },
  { slug: 'paid-advertising',       title: 'Paid Advertising',       icon: '📢', isFlagship: false },
  { slug: 'social-media-marketing', title: 'Social Media Marketing', icon: '💬', isFlagship: false },
  { slug: 'website-development',    title: 'Website Development',    icon: '</>', isFlagship: false },
] as const
