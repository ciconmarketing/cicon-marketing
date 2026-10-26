/**
 * Visible Google rating, used by the review sections and by the service-page
 * stats (via syncReviewStats). There is no AggregateRating schema anywhere —
 * see the note above PERSON_MAJID.
 */
// Live Google Business Profile rating. Re-verified on Google Maps 2026-10-26:
// 5.0 from 15 reviews. The site no longer shows a review *count*: a hard-coded
// count went stale after every new review (14 on the site vs 15 on Google in
// the 2026-10 audit). The review sections link to the live listing instead.
export const RATING_VALUE = '5.0'

// Live CiCon Marketing listing on Google Maps, where every review and the
// current count are shown. CID taken from the place URL (0xf0ecdf8b7b227761).
export const GOOGLE_REVIEWS_URL = 'https://www.google.com/maps?cid=17360496453765724001'

/**
 * Sanity stores some page stats as free text ({ value: '14', label: 'Verified
 * 5-star reviews' }). Those drifted from the real count more than once, so any
 * stat whose label is about reviews is rewritten at build time to the Google
 * rating, with no count.
 */
export function syncReviewStats<T extends { value?: string; label?: string }>(stats?: T[] | null): T[] | undefined {
  return stats?.map((s) => (/\breviews?\b/i.test(s?.label ?? '') ? { ...s, value: RATING_VALUE, label: 'Rating on Google' } : s))
}

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
 * RATING_VALUE above still drives the *visible* "5.0 ★ on Google" line in the
 * review sections. Please don't re-add an aggregateRating property here.
 */

export const PERSON_MAJID = {
  '@type': 'Person',
  '@id': 'https://cicon.ca/#majid-behzad',
  name: 'Majid Behzad',
  givenName: 'Majid',
  familyName: 'Behzad',
  jobTitle: 'Founder & Senior Digital Marketing Strategist',
  description: "14+ years building data-driven marketing systems for GTA businesses. Google-certified, Master's in Engineering, Postgraduate in Marketing Management. Also a landscape photographer and digital content creator (@mbehzadpix on Instagram) and a NiSi Filters ambassador.",
  url: 'https://cicon.ca/about-us/',
  image: 'https://cicon.ca/majid-behzad.jpg',
  worksFor: { '@id': 'https://cicon.ca/#organization' },
  knowsAbout: ['Local Search Engine Optimization','Google Business Profile Optimization','Pay-Per-Click Advertising','Conversion Rate Optimization','Dental Marketing Strategy','Landscape Photography','Photo and Video Production'],
  alumniOf: [{ '@type': 'EducationalOrganization', name: "Master's in Engineering" },{ '@type': 'EducationalOrganization', name: 'Postgraduate Diploma in Marketing Management' }],
  // Order matters: blog author box renders [0] (LinkedIn) and [1] (Instagram).
  sameAs: [
    'https://linkedin.com/in/majidlm/',
    'https://www.instagram.com/mbehzadpix/',
    'https://1x.com/l1m1a',
    'https://500px.com/p/bhzad',
    'https://x.com/mbehzadpix',
    'https://www.facebook.com/mbehzadpix/',
    'https://www.shutterstock.com/g/Majid+Behzad',
  ],
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
    streetAddress: '30 Via Renzo Drive, Suite 259',
    addressLocality: 'Richmond Hill',
    addressRegion: 'ON',
    postalCode: 'L4S 0B8',
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
    streetAddress: '30 Via Renzo Drive, Suite 259',
    addressLocality: 'Richmond Hill',
    addressRegion: 'ON',
    postalCode: 'L4S 0B8',
    addressCountry: 'CA',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 43.8910487,
    longitude: -79.3917475,
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
