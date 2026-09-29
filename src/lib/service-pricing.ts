/**
 * SERVICE_PRICING — the single source of truth for CiCon's published
 * starting prices (owner-approved list, 2026-09-28).
 *
 * Every price the site shows or marks up comes from here: the services hub
 * cards, the hero price line and #pricing section on each service page, the
 * cost FAQ (visible + FAQPage JSON-LD), and the Service/Offer JSON-LD.
 * Do not type prices into components or Sanity copy — change them here.
 *
 * Rules baked into the data:
 * - All amounts are CAD starting prices ("From"), never fixed totals.
 * - `month` offers are monthly retainers; `one-time` offers are project fees;
 *   `session` is a single photo/video shoot.
 * - Ad spend is always excluded from CiCon service fees.
 */

export type BillingUnit = 'month' | 'one-time' | 'session'

export interface ServiceOffer {
  /** Stable offer identity, reused wherever the same offer appears. */
  id: string
  /** Full offer name (JSON-LD, pricing section). */
  name: string
  /** Short row label on multi-offer services (e.g. "Google Ads"). */
  label?: string
  /** Starting price in whole CAD. */
  amount: number
  unit: BillingUnit
  /** What the JSON-LD unit is ("month", "project", "engagement", "session"). */
  unitNoun: 'month' | 'project' | 'engagement' | 'session'
  /** Show "Ad spend excluded" beside this price. */
  adSpendExcluded?: boolean
  /** Show "Setup is not included" beside this price. */
  setupNotIncluded?: boolean
  /** One-line tier description (website tiers). */
  description?: string
  /** Short qualifier shown directly below the price (e.g. session length). */
  qualifier?: string
}

export interface ServicePricing {
  slug: string
  offers: ServiceOffer[]
  /** Pricing section heading. */
  headline: string
  /** Owner-approved starting-price explanation (also the cost FAQ answer). */
  explanation: string
  /** Cost question shown first in the page FAQ and in FAQPage JSON-LD. */
  costQuestion: string
  /** Extra supporting lines in the pricing section. */
  notes?: string[]
  /** Optional list of work that can be scoped into the plan. */
  scopeHeading?: string
  scopeItems?: string[]
}

export const CURRENCY = 'CAD'

// ── Offers ───────────────────────────────────────────────────────────────────

const WEBSITE_OFFERS: ServiceOffer[] = [
  {
    id: 'website-starter-site',
    name: 'Starter Site',
    label: 'Starter Site',
    amount: 1000,
    unit: 'one-time',
    unitNoun: 'project',
    description: 'A focused website for a simple business presence. The page count and features are agreed before work starts.',
  },
  {
    id: 'website-multi-page-site',
    name: 'Multi-Page Site',
    label: 'Multi-Page Site',
    amount: 2500,
    unit: 'one-time',
    unitNoun: 'project',
    description: 'A website with separate pages for your business and services. The page count and features are agreed in your quote.',
  },
  {
    id: 'website-multi-page-full-seo',
    name: 'Multi-Page + Full SEO',
    label: 'Multi-Page + Full SEO',
    amount: 7500,
    unit: 'one-time',
    unitNoun: 'project',
    description: 'A multi-page website with technical and on-page SEO work scoped into the build. Your quote defines the content, research, tracking, and launch work.',
  },
]

const WEBSITE_EXPLANATION =
  'Website projects start at $1,000 CAD for a Starter Site, $2,500 CAD for a Multi-Page Site, and $7,500 CAD for a Multi-Page + Full SEO build. These are one-time project starting prices. We confirm the page count, content, features, and SEO work in your quote.'

const WEBSITE_NOTES = [
  'Every build includes basic on-page SEO foundations. The Multi-Page + Full SEO build adds technical and on-page SEO work scoped into the build.',
  'Ongoing SEO, maintenance, and campaign landing pages are separate services, quoted for your scope.',
]

export const SERVICE_PRICING: Record<string, ServicePricing> = {
  'dental-seo': {
    slug: 'dental-seo',
    headline: 'Dental SEO pricing',
    offers: [{ id: 'dental-seo', name: 'Dental SEO', amount: 1500, unit: 'month', unitNoun: 'month' }],
    explanation:
      'Dental SEO starts at $1,500 CAD per month. This is a monthly retainer for a dental SEO plan matched to your practice. We confirm the locations, priorities, and monthly work in your quote.',
    costQuestion: 'How much does dental SEO cost?',
    notes: ['Your quote sets out the agreed scope and fees.'],
    scopeHeading: 'Work we can scope into your plan',
    scopeItems: [
      'Google Business Profile optimization',
      'Technical SEO audit and fixes',
      'NAP citation cleanup',
      'On-page SEO for core service pages',
      'Review collection strategy',
      'Location-specific service pages',
      'CDCP content creation',
      'Content marketing and link building',
      'Ongoing keyword research',
      'Advanced schema markup',
      'Competitive tracking across York Region',
      'Monthly reporting',
    ],
  },
  'dental-marketing-services': {
    slug: 'dental-marketing-services',
    headline: 'Dental marketing pricing',
    offers: [{
      id: 'dental-marketing', name: 'Dental Marketing', amount: 1500, unit: 'month', unitNoun: 'month', adSpendExcluded: true,
    }],
    explanation:
      'Dental marketing starts at $1,500 CAD per month. Ad spend is excluded. The monthly retainer covers the marketing services agreed for your clinic. Your advertising budget is separate. We confirm the channels and work in your quote.',
    costQuestion: 'How much does dental marketing cost?',
  },
  'paid-advertising-services': {
    slug: 'paid-advertising-services',
    headline: 'Paid advertising pricing',
    offers: [
      {
        id: 'google-ads-management', name: 'Google Ads management', label: 'Google Ads',
        amount: 900, unit: 'month', unitNoun: 'month', adSpendExcluded: true, setupNotIncluded: true,
      },
      {
        id: 'meta-ads-management', name: 'Meta Ads management', label: 'Meta Ads',
        amount: 700, unit: 'month', unitNoun: 'month', adSpendExcluded: true, setupNotIncluded: true,
      },
    ],
    explanation:
      'Google Ads management starts at $900 CAD per month. Meta Ads management starts at $700 CAD per month. These are separate monthly management retainers. Ad spend is excluded. Setup is not included.',
    costQuestion: 'How much does Google Ads or Meta Ads management cost?',
    notes: ['LinkedIn, TikTok, Pinterest, and Microsoft Ads management is quoted separately for your scope.'],
  },
  'local-seo-optimization': {
    slug: 'local-seo-optimization',
    headline: 'Local SEO pricing',
    offers: [{
      id: 'local-seo-gbp-management',
      name: 'Local SEO: Google Business Profile management and optimization',
      label: 'Google Business Profile management and optimization',
      amount: 800, unit: 'month', unitNoun: 'month', setupNotIncluded: true,
    }],
    explanation:
      'Google Business Profile management and optimization starts at $800 CAD per month. This is a monthly retainer. Setup is not included. We confirm the profile coverage and ongoing work in your quote.',
    costQuestion: 'How much does local SEO cost?',
    notes: ['Wider local SEO work, such as citation building, extra locations, and website page work, is scoped separately in your quote.'],
  },
  'ai-seo': {
    slug: 'ai-seo',
    headline: 'AI SEO pricing',
    offers: [{ id: 'ai-seo', name: 'AI SEO', amount: 1500, unit: 'month', unitNoun: 'month' }],
    explanation:
      'AI SEO starts at $1,500 CAD per month. The monthly plan focuses on the agreed work to improve search visibility and measure your presence in AI answers. We confirm the scope in your quote. Rankings and AI recommendations are not guaranteed.',
    costQuestion: 'How much does AI SEO cost?',
  },
  'social-media-marketing-services': {
    slug: 'social-media-marketing-services',
    headline: 'Social media marketing pricing',
    offers: [{
      id: 'social-media-marketing', name: 'Social Media', amount: 600, unit: 'month', unitNoun: 'month',
      adSpendExcluded: true, setupNotIncluded: true,
    }],
    explanation:
      'Social media marketing starts at $600 CAD per month. We agree on the platforms, content volume, and monthly work before the service starts. Setup is not included. Paid advertising and original photo or video shoots are scoped separately.',
    costQuestion: 'How much does social media marketing cost?',
    notes: ['If you run paid social ads, your ad budget is separate from this fee.'],
  },
  'website-development': {
    slug: 'website-development',
    headline: 'Website development pricing',
    offers: WEBSITE_OFFERS,
    explanation: WEBSITE_EXPLANATION,
    costQuestion: 'How much does a website cost?',
    notes: WEBSITE_NOTES,
  },
  'website-development-richmond-hill': {
    slug: 'website-development-richmond-hill',
    headline: 'Richmond Hill web design pricing',
    offers: WEBSITE_OFFERS,
    explanation: WEBSITE_EXPLANATION,
    costQuestion: 'How much does a website cost in Richmond Hill?',
    notes: WEBSITE_NOTES,
  },
  'media-content-production': {
    slug: 'media-content-production',
    headline: 'Photo and video production pricing',
    offers: [{
      id: 'media-content-production-session', name: 'Media Content Production', amount: 1500, unit: 'session', unitNoun: 'session',
      qualifier: '2–3 hour professional photo and video shoot',
    }],
    explanation:
      'Professional photo and video shoots start at $1,500 CAD per session. A session lasts 2–3 hours. We agree on the brief, final assets, editing, and delivery schedule in your quote.',
    costQuestion: 'How much does a photo and video shoot cost?',
    notes: [
      'The 2–3 hours is shooting time on location. Editing and post-production happen after the shoot and are planned in your quote.',
      'Larger productions, extra shoot time, and written content are scoped separately.',
    ],
  },
  'crm-integration': {
    slug: 'crm-integration',
    headline: 'CRM integration pricing',
    offers: [{
      id: 'crm-integration', name: 'CRM Integration', amount: 499, unit: 'month', unitNoun: 'month', setupNotIncluded: true,
    }],
    explanation:
      'CRM integration services start at $499 CAD per month for the agreed ongoing work. Setup is not included. We confirm the systems, support, and monthly scope in your quote.',
    costQuestion: 'How much does CRM integration cost?',
    notes: ['Initial CRM configuration, integrations, and automation builds are setup work, quoted separately from the monthly service.'],
  },
  'conversion-rate-optimization': {
    slug: 'conversion-rate-optimization',
    headline: 'Conversion rate optimization pricing',
    offers: [{
      id: 'conversion-rate-optimization', name: 'CRO', amount: 1500, unit: 'one-time', unitNoun: 'engagement',
      qualifier: 'Ongoing CRO is quoted separately.',
    }],
    explanation:
      'Conversion rate optimization starts at $1,500 CAD for a one-time engagement. We agree on the review and optimization work before the project starts. Ongoing testing and optimization require a separate retainer, quoted for your scope.',
    costQuestion: 'How much does conversion rate optimization cost?',
  },
  'content-marketing': {
    slug: 'content-marketing',
    headline: 'Content marketing pricing',
    offers: [{ id: 'content-marketing', name: 'Content Marketing', amount: 1000, unit: 'month', unitNoun: 'month' }],
    explanation:
      'Content marketing starts at $1,000 CAD per month. We agree on the topics, formats, content volume, and monthly work in your quote.',
    costQuestion: 'How much does content marketing cost?',
  },
  'marketing-consultant': {
    slug: 'marketing-consultant',
    headline: 'Marketing consultant pricing',
    offers: [{ id: 'marketing-consultant', name: 'Marketing Consultant', amount: 500, unit: 'one-time', unitNoun: 'engagement' }],
    explanation:
      'Marketing consulting starts at $500 CAD for a standalone engagement. This is a one-time fee. We agree on the question to address and the advice or deliverable before work starts. Further work is scoped separately.',
    costQuestion: 'How much does a marketing consultant cost?',
  },
  'marketing-technology-setup': {
    slug: 'marketing-technology-setup',
    headline: 'Marketing technology setup pricing',
    offers: [{
      id: 'marketing-technology-setup', name: 'Marketing Technology Setup', amount: 2500, unit: 'one-time', unitNoun: 'project',
    }],
    explanation:
      'Marketing technology setup starts at $2,500 CAD as a one-time project. We agree on the tools, tracking, and integrations before work starts. Any ongoing maintenance is scoped separately.',
    costQuestion: 'How much does marketing technology setup cost?',
  },
}

/** Hub note, shown next to the services grid. */
export const HUB_PRICING_NOTE =
  'All prices are in CAD. Monthly fees are retainers. One-time fees and session fees are labelled. Ad spend is always excluded from our service fees. Final pricing depends on the agreed scope.'

export const AD_SPEND_NOTE = 'Ad spend excluded'
export const SETUP_NOTE = 'Setup is not included'

export function getServicePricing(slug: string): ServicePricing | null {
  return SERVICE_PRICING[slug] ?? null
}

/** True when any offer on the service is a monthly retainer. */
export function hasRetainer(pricing: ServicePricing | null): boolean {
  return !!pricing?.offers.some((o) => o.unit === 'month')
}

// ── Display ──────────────────────────────────────────────────────────────────

export function formatAmount(amount: number): string {
  return `$${amount.toLocaleString('en-CA')}`
}

/** "$1,500 CAD" */
export function amountText(offer: ServiceOffer): string {
  return `${formatAmount(offer.amount)} ${CURRENCY}`
}

/** "/month", " · one-time", "/session" */
export function unitSuffix(unit: BillingUnit): string {
  if (unit === 'month') return '/month'
  if (unit === 'session') return '/session'
  return ' · one-time'
}

/** "From $900 CAD/month" | "From $1,000 CAD · one-time" | "From $1,500 CAD/session" */
export function priceText(offer: ServiceOffer): string {
  return `From ${formatAmount(offer.amount)} ${CURRENCY}${unitSuffix(offer.unit)}`
}

/** Supporting notes for one offer, in display order. */
export function offerNotes(offer: ServiceOffer): string[] {
  const notes: string[] = []
  if (offer.qualifier) notes.push(offer.qualifier)
  if (offer.adSpendExcluded) notes.push(AD_SPEND_NOTE)
  if (offer.setupNotIncluded) notes.push(SETUP_NOTE)
  return notes
}

// ── Structured data ──────────────────────────────────────────────────────────

const ORG_ID = 'https://cicon.ca/#organization'
const OFFER_ID_BASE = 'https://cicon.ca/marketing-services/#offer-'

function unitDescription(offer: ServiceOffer): string {
  if (offer.unit === 'month') return 'Monthly retainer.'
  if (offer.unit === 'session') return 'Per session.'
  return 'One-time fee.'
}

/**
 * Schema.org Offer for one starting price. The minimum is expressed as
 * priceSpecification.minPrice (no maxPrice, no exact `price`), so it is never
 * read as a fixed total. Offer @ids are shared across pages that sell the
 * same offer (both website pages, the hub catalog).
 */
export function offerJsonLd(offer: ServiceOffer) {
  const description = [
    'Starting price.',
    unitDescription(offer),
    ...(offer.qualifier ? [offer.qualifier.endsWith('.') ? offer.qualifier : `${offer.qualifier}.`] : []),
    ...(offer.adSpendExcluded ? ['Ad spend excluded.'] : []),
    ...(offer.setupNotIncluded ? ['Setup is not included.'] : []),
    'Final pricing depends on the agreed scope.',
  ].join(' ')

  const priceSpecification =
    offer.unit === 'month'
      ? {
          '@type': 'UnitPriceSpecification',
          minPrice: offer.amount,
          priceCurrency: CURRENCY,
          unitCode: 'MON',
          unitText: 'month',
          referenceQuantity: { '@type': 'QuantitativeValue', value: 1, unitCode: 'MON' },
        }
      : {
          '@type': 'UnitPriceSpecification',
          minPrice: offer.amount,
          priceCurrency: CURRENCY,
          unitText: offer.unitNoun,
          referenceQuantity: { '@type': 'QuantitativeValue', value: 1, unitText: offer.unitNoun },
        }

  return {
    '@type': 'Offer',
    '@id': `${OFFER_ID_BASE}${offer.id}`,
    name: offer.name,
    description,
    priceCurrency: CURRENCY,
    priceSpecification,
    offeredBy: { '@id': ORG_ID },
  }
}

/** Lowest monthly and one-time starting offers, for site-wide "from" answers. */
export function lowestStartingOffers() {
  const all = Object.values(SERVICE_PRICING).flatMap((p) => p.offers)
  const lowest = (unit: BillingUnit) =>
    all.filter((o) => o.unit === unit).reduce((a, b) => (b.amount < a.amount ? b : a))
  return { monthly: lowest('month'), oneTime: lowest('one-time') }
}
