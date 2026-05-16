export const PERSON_MAJID = {
  '@type': 'Person',
  '@id': 'https://cicon.ca/#majid-behzad',
  name: 'Majid Behzad',
  givenName: 'Majid',
  familyName: 'Behzad',
  jobTitle: 'Founder & Senior Digital Marketing Strategist',
  description: "Over 15 years building data-driven marketing systems for GTA businesses. Google-certified, Master's in Engineering, Postgraduate in Marketing Management.",
  url: 'https://cicon.ca/about-us/',
  image: 'https://cicon.ca/wp-content/uploads/majid-behzad-headshot.jpg',
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
  logo: { '@type': 'ImageObject', url: 'https://cicon.ca/wp-content/uploads/2025/12/primary-color-icon.svg', width: 512, height: 512 },
  description: 'Boutique digital marketing and media production agency based in Richmond Hill, Ontario, serving businesses and dental clinics across the Greater Toronto Area.',
  foundingDate: '2018',
  founder: { '@id': 'https://cicon.ca/#majid-behzad' },
  areaServed: { '@type': 'AdministrativeArea', name: 'Greater Toronto Area' },
  address: { '@type': 'PostalAddress', streetAddress: '131 Golf Club Crt', addressLocality: 'Richmond Hill', addressRegion: 'ON', addressCountry: 'CA' },
  telephone: '+1-289-807-1020',
  email: 'info@cicon.ca',
  sameAs: ['https://www.facebook.com/ciconmarketing/','https://www.instagram.com/ciconmktg/','https://linkedin.com/company/cicon-marketing/'],
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
