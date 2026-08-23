/**
 * Update these in one place — they propagate to every AggregateRating node
 * sitewide (nested on Organization and LocalBusiness below) and to the
 * visible rating line on the homepage reviews section.
 */
export const RATING_VALUE = '5.0'
// Google Business Profile review count. Re-verified against live GBP data
// (Localo sync + place.latestPlaceSnapshot.reviewsCount) on 2026-08-15: 8.
// A prior commit (ea45c9c) set this to 9, but that no longer matches Google's
// own public count on the listing — must stay in sync with the actual
// REVIEWS array in RReviews.astro / GoogleReviews.tsx (currently 8 cards).
export const REVIEW_COUNT = 8

/**
 * areaServed for the sitewide business entities. Mirrors the active GBP
 * service-area list (updated 2026-07-24 — Whitby intentionally removed).
 * Bolton is a community within Caledon; North York, Scarborough, and
 * Etobicoke are districts of Toronto — all are distinct search markets.
 */
const AREA_SERVED_GBP = [
  { '@type': 'AdministrativeArea', name: 'Greater Toronto Area' },
  { '@type': 'City', name: 'Richmond Hill' },
  { '@type': 'City', name: 'Markham' },
  { '@type': 'City', name: 'Vaughan' },
  { '@type': 'Place', name: 'Thornhill' },
  { '@type': 'City', name: 'Aurora' },
  { '@type': 'City', name: 'Newmarket' },
  { '@type': 'Place', name: 'North York' },
  { '@type': 'AdministrativeArea', name: 'King' },
  { '@type': 'City', name: 'Whitchurch-Stouffville' },
  { '@type': 'City', name: 'East Gwillimbury' },
  { '@type': 'City', name: 'Toronto' },
  { '@type': 'City', name: 'Mississauga' },
  { '@type': 'Place', name: 'Etobicoke' },
  { '@type': 'City', name: 'Pickering' },
  { '@type': 'Place', name: 'Scarborough' },
  { '@type': 'Place', name: 'Bolton' },
] as const

/**
 * Deliberately NO AggregateRating on Organization / LocalBusiness.
 *
 * These would be reviews CiCon publishes about itself, on its own site, which
 * Google classes as self-serving: "If the entity that's being reviewed controls
 * the reviews about itself, their pages that use LocalBusiness or any other type
 * of Organization structured data are ineligible for star review feature."
 * (developers.google.com/search/docs/appearance/structured-data/review-snippet)
 *
 * So it never earned a star snippet, and shipping it sitewide was live exposure
 * to a structured-data manual action. Removed 2026-08-23.
 *
 * RATING_VALUE / REVIEW_COUNT above are still exported and still correct — they
 * drive the *visible* "5.0 star average from N Google Reviews" line in the
 * review sections. Please don't re-add an aggregateRating property here.
 */

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
  areaServed: AREA_SERVED_GBP,
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
  areaServed: AREA_SERVED_GBP,
  sameAs: ['https://www.facebook.com/ciconmarketing/', 'https://www.instagram.com/ciconmktg/', 'https://linkedin.com/company/cicon-marketing/', 'https://www.youtube.com/@CiConMarketing'],
} as const

export const WEBSITE_CICON = {
  '@type': 'WebSite',
  '@id': 'https://cicon.ca/#website',
  url: 'https://cicon.ca/',
  name: 'CiCon Marketing',
  description: 'Boutique digital marketing and media production agency serving the Greater Toronto Area.',
  publisher: { '@id': 'https://cicon.ca/#organization' },
  inLanguage: 'en-CA',
} as const
