export const PERSON_MAJID = {
  '@type': 'Person',
  '@id': 'https://cicon.ca/#majid-behzad',
  name: 'Majid Behzad',
  givenName: 'Majid',
  familyName: 'Behzad',
  jobTitle: 'Founder & Senior Digital Marketing Strategist',
  description: "14+ years building data-driven marketing systems for GTA businesses. Google-certified, Master's in Engineering, Postgraduate in Marketing Management.",
  url: 'https://cicon.ca/about-us/',
  image: 'https://cicon.ca/majid-behzad.jpg',
  worksFor: { '@id': 'https://cicon.ca/#organization' },
  knowsAbout: ['Local Search Engine Optimization','Google Business Profile Optimization','Pay-Per-Click Advertising','Conversion Rate Optimization','Dental Marketing Strategy'],
  alumniOf: [{ '@type': 'EducationalOrganization', name: "Master's in Engineering" },{ '@type': 'EducationalOrganization', name: 'Postgraduate Diploma in Marketing Management' }],
  sameAs: ['https://linkedin.com/in/majidlm/','https://instagram.com/mbehzadpix/'],
} as const

export const ORG_CICON = {
  '@type': 'Organization',
  '@id': 'https://cicon.ca/#organization',
  name: 'CiCon Marketing',
  alternateName: 'CiCon Digital Marketing',
  url: 'https://cicon.ca/',
  logo: { '@type': 'ImageObject', url: 'https://cicon.ca/logo-cicon.jpg', width: 800, height: 800 },
  description: 'Boutique digital marketing and media production agency based in Richmond Hill, Ontario, serving businesses and dental clinics across the Greater Toronto Area.',
  foundingDate: '2023',
  founder: { '@id': 'https://cicon.ca/#majid-behzad' },
  areaServed: { '@type': 'AdministrativeArea', name: 'Greater Toronto Area' },
  address: {
    '@type': 'PostalAddress',
    streetAddress: '131 Golf Club Ct',
    addressLocality: 'Richmond Hill',
    addressRegion: 'ON',
    postalCode: 'L4C 5E1',
    addressCountry: 'CA',
  },
  telephone: '+1-289-807-1020',
  email: 'info@cicon.ca',
  sameAs: ['https://www.facebook.com/ciconmarketing/','https://www.instagram.com/ciconmktg/','https://linkedin.com/company/cicon-marketing/','https://www.youtube.com/@CiConMarketing'],
} as const

/**
 * Canonical LocalBusiness entity — rendered sitewide via Footer.astro so every
 * page (blog posts, service pages, utility pages, etc.) carries NAP schema.
 * Uses its own @id (distinct from ORG_CICON's '#organization') so the two can
 * coexist on pages that include both without an @id/@type collision.
 * Pages that define their own page-specific LocalBusiness block (home,
 * about-us, contact-us) pass `includeLocalBusinessSchema={false}` to <Footer />
 * to avoid a duplicate.
 */
export const LOCAL_BUSINESS_CICON = {
  '@type': 'LocalBusiness',
  '@id': 'https://cicon.ca/#local-business',
  name: 'CiCon Marketing',
  url: 'https://cicon.ca/',
  logo: { '@type': 'ImageObject', url: 'https://cicon.ca/logo-cicon.jpg' },
  image: 'https://cicon.ca/logo-cicon.jpg',
  description: 'Boutique digital marketing and media production agency based in Richmond Hill, Ontario, serving businesses and dental clinics across the Greater Toronto Area.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '131 Golf Club Ct',
    addressLocality: 'Richmond Hill',
    addressRegion: 'ON',
    postalCode: 'L4C 5E1',
    addressCountry: 'CA',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 43.8828,
    longitude: -79.4403,
  },
  telephone: '+1-289-807-1020',
  email: 'info@cicon.ca',
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '18:00',
    },
  ],
  priceRange: '$$',
  areaServed: { '@type': 'AdministrativeArea', name: 'Greater Toronto Area' },
  sameAs: ['https://www.facebook.com/ciconmarketing/', 'https://www.instagram.com/ciconmktg/', 'https://linkedin.com/company/cicon-marketing/', 'https://www.youtube.com/@CiConMarketing'],
} as const

/** Update this number in one place — it propagates to all service page AggregateRating schemas. */
export const REVIEW_COUNT = 47

export const WEBSITE_CICON = {
  '@type': 'WebSite',
  '@id': 'https://cicon.ca/#website',
  url: 'https://cicon.ca/',
  name: 'CiCon Marketing',
  description: 'Boutique digital marketing and media production agency serving the Greater Toronto Area.',
  publisher: { '@id': 'https://cicon.ca/#organization' },
  inLanguage: 'en-CA',
} as const
