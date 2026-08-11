/**
 * SERVICES_NAV — single source of truth for the service spokes.
 * Used by Nav.astro dropdown, Footer.astro and services/index.astro grid.
 * Order: Dental flagship first, then alphabetical.
 *
 * `inNav: false` keeps an entry out of the header dropdown while still
 * surfacing it in the footer and the services grid. Used for sub-services
 * that belong under a flagship rather than beside it — the dropdown stays
 * scannable, and the page keeps its internal links.
 */
export const SERVICES_NAV = [
  { slug: 'dental-marketing-services',        title: 'Dental Marketing',       icon: '🦷', isFlagship: true,  inNav: true  },
  { slug: 'dental-seo',                       title: 'Dental SEO',             icon: '🦷', isFlagship: false, inNav: false },
  { slug: 'ai-seo',                   title: 'AI SEO',                         icon: '🔍', isFlagship: false, inNav: true  },
  { slug: 'content-marketing',                title: 'Content Marketing',              icon: '✍️', isFlagship: false, inNav: true  },
  { slug: 'conversion-rate-optimization',     title: 'Conversion Rate Optimization',   icon: '📈', isFlagship: false, inNav: true  },
  { slug: 'crm-integration',                  title: 'CRM Integration',                icon: '🔗', isFlagship: false, inNav: true  },
  { slug: 'local-seo-optimization',           title: 'Local SEO',              icon: '📍', isFlagship: false, inNav: true  },
  { slug: 'marketing-technology-setup',       title: 'Marketing Technology Setup', icon: '⚙️', isFlagship: false, inNav: true  },
  { slug: 'marketing-consultant',             title: 'Marketing Consultant',   icon: '🧭', isFlagship: false, inNav: true  },
  { slug: 'media-content-production',         title: 'Media Production',       icon: '🎥', isFlagship: false, inNav: true  },
  { slug: 'paid-advertising-services',        title: 'Paid Advertising',       icon: '📢', isFlagship: false, inNav: true  },
  { slug: 'social-media-marketing-services',  title: 'Social Media Marketing', icon: '💬', isFlagship: false, inNav: true  },
  { slug: 'website-development',              title: 'Website Development',    icon: '</>', isFlagship: false, inNav: true  },
] as const

/** Entries shown in the header dropdown (desktop + mobile). */
export const SERVICES_NAV_HEADER = SERVICES_NAV.filter((s) => s.inNav)
