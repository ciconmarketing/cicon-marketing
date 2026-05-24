/**
 * SERVICES_NAV — single source of truth for the 8 service spokes.
 * Used by Nav.astro dropdown and services/index.astro grid.
 * Order: Dental flagship first, then alphabetical.
 */
export const SERVICES_NAV = [
  { slug: 'dental-marketing-services',        title: 'Dental Marketing',       icon: '🦷', isFlagship: true  },
  { slug: 'ai-seo-and-seo',                   title: 'AI SEO',                 icon: '🔍', isFlagship: false },
  { slug: 'crm-integration',                  title: 'CRM Integration',        icon: '🔗', isFlagship: false },
  { slug: 'local-seo-optimization',           title: 'Local SEO',              icon: '📍', isFlagship: false },
  { slug: 'marketing-consultant',             title: 'Marketing Consultant',   icon: '🧭', isFlagship: false },
  { slug: 'media-content-production',         title: 'Media Production',       icon: '🎥', isFlagship: false },
  { slug: 'paid-advertising-services',        title: 'Paid Advertising',       icon: '📢', isFlagship: false },
  { slug: 'social-media-marketing-services',  title: 'Social Media Marketing', icon: '💬', isFlagship: false },
  { slug: 'website-development',              title: 'Website Development',    icon: '</>', isFlagship: false },
] as const
