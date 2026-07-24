/**
 * areas-served.ts — single source of truth for the /areas-served/ hub and
 * /areas-served/{city}/ pages. Same pattern as services-nav.ts: repo-side
 * typed data, validated at build time.
 *
 * Publishing rules (enforced by validateAreaPages, called from getStaticPaths
 * and covered by scripts/__tests__/areas-served.test.mjs):
 *   - status 'draft'      → page is generated but noindexed, never linked,
 *                           never in the sitemap. For MJ review on prod URL.
 *   - status 'published' + indexable → in areas-sitemap.xml, linked from hub,
 *                           footer, and nearby-area modules.
 *   - indexable: true requires real, approved local proof. Placeholder proof
 *     (approved: false) never renders and never satisfies the gate.
 *   - Whitby was removed from the GBP service-area list on 2026-07-24 and is
 *     hard-banned here. Do not re-add without an explicit business decision.
 */

export type ProofItem = {
  kind: 'fact' | 'blog' | 'client' | 'testimonial'
  label: string
  href?: string
  /** Only approved items render. Client/testimonial items require MJ sign-off. */
  approved: boolean
}

export type AreaFaq = { question: string; answer: string }

export type FeaturedService = {
  /** Must match a slug in SERVICES_NAV */
  slug: string
  title: string
  angle: string
}

export type ServiceAreaPage = {
  slug: string
  cityName: string
  /** Official municipal name when it differs from the display name */
  officialName?: string
  region: 'Home Market' | 'York Region' | 'Toronto' | 'Durham Region' | 'Peel Region' | 'Caledon'
  tier: 1 | 2 | 3
  status: 'draft' | 'published'
  indexable: boolean
  title: string // 55–62 chars (CiCon SEO standard)
  metaDescription: string // 130–160 chars (CiCon SEO standard)
  eyebrow: string
  h1: string
  /** 40–80 word answer-first standalone passage */
  summary: string
  localContext: string[]
  bestFitIndustries: { name: string; note: string }[]
  featuredServices: FeaturedService[]
  localProof: ProofItem[]
  /** Slugs of nearby area pages; only published+indexable targets render as links */
  nearbyAreas: string[]
  faqs: AreaFaq[]
  lastReviewed: string
}

/** Coverage areas shown on the hub that have no dedicated page (yet). */
export type CoverageArea = {
  name: string
  region: ServiceAreaPage['region'] | 'Northwest GTA' | 'Western GTA'
  line: string
}

// ── Hard bans ────────────────────────────────────────────────────────────────
// Removed from the GBP service-area list 2026-07-24. Never generate.
export const BANNED_AREAS = ['whitby'] as const

// ── City pages ───────────────────────────────────────────────────────────────

export const AREA_PAGES: ServiceAreaPage[] = [
  // ── Richmond Hill — home market ────────────────────────────────────────────
  {
    slug: 'richmond-hill',
    cityName: 'Richmond Hill',
    region: 'Home Market',
    tier: 1,
    status: 'published',
    indexable: true,
    title: 'Digital Marketing Agency in Richmond Hill, Ontario | CiCon',
    metaDescription:
      'Boutique digital marketing agency headquartered in Richmond Hill. Senior-led local SEO, Google Ads, and dental marketing for local businesses. Chat on WhatsApp.',
    eyebrow: 'Richmond Hill · Home Base',
    h1: 'Digital Marketing Agency in Richmond Hill, Ontario',
    summary:
      'CiCon Marketing is a boutique digital marketing agency headquartered at 131 Golf Club Court in Richmond Hill, Ontario. We build local SEO, Google Ads, and lead-generation systems for Richmond Hill businesses and dental clinics — with a senior strategist on every account, not a junior handoff. This is our home market: the search results we optimize here are the ones we see every day.',
    localContext: [
      'Richmond Hill sits in one of the most competitive local-search corridors in the GTA. Along Yonge Street and around major plazas, dental clinics, med-spas, home-improvement companies, and professional services all compete for the same Map Pack positions — and most searches that matter here include "near me" or a neighbourhood name, not just a city name.',
      'Because CiCon is based in Richmond Hill, this is the market where our own visibility is on the line. The same Google Business Profile discipline, review strategy, and landing-page standards we sell are the ones we apply to ourselves — you can literally look us up and check.',
      'Richmond Hill buyers tend to compare several providers before contacting anyone, which makes review depth, photo quality, and a fast answer to "do you serve my area?" decisive. Campaigns we run here are built around that comparison behaviour rather than raw click volume.',
    ],
    bestFitIndustries: [
      { name: 'Dental clinics', note: 'Our flagship specialization — patient acquisition across search, Maps, and paid channels.' },
      { name: 'Home improvement & trades', note: 'Seasonal demand curves and quote-driven sales cycles we plan around, not against.' },
      { name: 'Professional services', note: 'Clinics, legal, accounting, and consultancies competing on trust signals.' },
      { name: 'Showrooms & local retail', note: 'Foot-traffic businesses that live or die on Maps visibility and photos.' },
    ],
    featuredServices: [
      { slug: 'local-seo-optimization', title: 'Local SEO', angle: 'Own the Richmond Hill Map Pack for the searches that produce calls.' },
      { slug: 'paid-advertising-services', title: 'Paid Advertising', angle: 'Google and Meta campaigns tuned to Richmond Hill cost-per-click realities.' },
      { slug: 'dental-marketing-services', title: 'Dental Marketing', angle: 'Patient acquisition systems for Richmond Hill and York Region clinics.' },
      { slug: 'website-development', title: 'Website Development', angle: 'Fast, conversion-first sites that turn local traffic into inquiries.' },
      { slug: 'media-content-production', title: 'Media Production', angle: 'On-location photo and video — we are minutes away, not a courier away.' },
    ],
    localProof: [
      {
        kind: 'fact',
        label: 'Headquartered at 131 Golf Club Ct, Richmond Hill — this is our own Google Business Profile market.',
        approved: true,
      },
      {
        kind: 'blog',
        label: 'Google Business Profile Optimization in Richmond Hill (2026 guide)',
        href: '/blog/google-business-profile-optimization-richmond-hill-2026/',
        approved: true,
      },
      {
        kind: 'blog',
        label: 'Choosing a Digital Marketing Agency in Richmond Hill (2026)',
        href: '/blog/digital-marketing-agency-in-richmond-hill-2026/',
        approved: true,
      },
    ],
    nearbyAreas: ['thornhill', 'vaughan', 'markham', 'aurora'],
    faqs: [
      {
        question: 'Where is CiCon Marketing located in Richmond Hill?',
        answer:
          'Our office is at 131 Golf Club Ct, Richmond Hill, ON L4C 5E1. We meet clients remotely or in person, and we handle on-location photo and video shoots across Richmond Hill and the surrounding area.',
      },
      {
        question: 'Do you only work with Richmond Hill businesses?',
        answer:
          'No — Richmond Hill is our home base, but we serve businesses across York Region, Toronto, and selected GTA markets. Local SEO and Google Business Profile work benefits most from local knowledge, which is strongest in and around our home market.',
      },
      {
        question: 'What does a Richmond Hill business typically start with?',
        answer:
          'Most engagements start with a Google Business Profile and local SEO audit, because Map Pack visibility is usually the fastest path to qualified calls here. From there we layer in Google Ads, landing pages, or CRM follow-up depending on where leads are leaking.',
      },
      {
        question: 'Can you help a new Richmond Hill clinic that has no reviews yet?',
        answer:
          'Yes. New clinics need a compliant review-generation process, a complete profile, and a site that converts the small early traffic they get. We build that foundation first, then scale paid acquisition once the conversion path is proven.',
      },
    ],
    lastReviewed: '2026-07-24',
  },

  // ── Vaughan ────────────────────────────────────────────────────────────────
  {
    slug: 'vaughan',
    cityName: 'Vaughan',
    region: 'York Region',
    tier: 1,
    status: 'published',
    indexable: true,
    title: 'Digital Marketing Agency Serving Vaughan, Ontario | CiCon',
    metaDescription:
      'Richmond Hill–based digital marketing agency serving Vaughan contractors, showrooms, and clinics. Google Ads, local SEO, and lead systems that convert.',
    eyebrow: 'Vaughan · GTA',
    h1: 'Digital Marketing Agency Serving Vaughan, Ontario',
    summary:
      'CiCon Marketing is a boutique digital marketing agency based in Richmond Hill, serving businesses throughout Vaughan — Woodbridge, Maple, Concord, and Kleinburg included. We build Google Ads, local SEO, and lead-follow-up systems for Vaughan contractors, showrooms, dental clinics, and B2B service companies, with a senior strategist running every account.',
    localContext: [
      'Vaughan is one of the GTA\'s most competitive markets for home improvement and construction-adjacent search. Contractors, renovators, and showrooms bid aggressively on the same Google Ads keywords, which pushes cost-per-click up and punishes campaigns that send traffic to weak landing pages. In this market, the follow-up system matters as much as the ad.',
      'The city is also geographically wide — Woodbridge, Maple, and Concord behave like distinct local markets in Maps results. A single "Vaughan" listing rarely wins all three; service-area strategy and review velocity decide who shows where.',
      'We publish our Vaughan-specific thinking openly: our guides on AI search for Vaughan small businesses and social media strategy for Vaughan brands are linked below, so you can judge the depth of the local work before you ever contact us.',
    ],
    bestFitIndustries: [
      { name: 'Contractors & home improvement', note: 'High-ticket, quote-driven — campaigns built for lead quality and speed-to-call.' },
      { name: 'Showrooms (kitchen, bath, lighting, flooring)', note: 'Maps visibility plus the photo/video assets showroom buyers expect.' },
      { name: 'Dental clinics', note: 'Vaughan patients search across clinic-dense corridors; differentiation is earned, not claimed.' },
      { name: 'B2B services', note: 'Lead systems and CRM follow-up for service companies selling to other businesses.' },
    ],
    featuredServices: [
      { slug: 'paid-advertising-services', title: 'Paid Advertising', angle: 'Google Ads built for Vaughan\'s high-CPC trades and showroom keywords.' },
      { slug: 'local-seo-optimization', title: 'Local SEO', angle: 'Service-area strategy across Woodbridge, Maple, and Concord — not one generic pin.' },
      { slug: 'ai-seo-and-seo', title: 'AI SEO', angle: 'Show up when Vaughan buyers ask ChatGPT and Google AI who to hire.' },
      { slug: 'crm-integration', title: 'CRM Integration', angle: 'Quote-driven sales cycles need follow-up automation, not just clicks.' },
      { slug: 'dental-marketing-services', title: 'Dental Marketing', angle: 'Patient acquisition for clinics in Vaughan\'s competitive corridors.' },
    ],
    localProof: [
      {
        kind: 'blog',
        label: 'AI SEO for Small Businesses in Vaughan (2026 guide)',
        href: '/blog/ai-seo-small-businesses-vaughan-2026/',
        approved: true,
      },
      {
        kind: 'blog',
        label: '7 Social Media Marketing Strategies for Vaughan Businesses',
        href: '/blog/social-media-marketing-vaughan-7-strategies-2026/',
        approved: true,
      },
      // 2026-07-24 roster check found no client with a publicly stated Vaughan
      // address; this page stands on the two live Vaughan guides above.
      {
        kind: 'client',
        label: 'Vaughan-area client reference — none verified on roster yet; add when available.',
        approved: false,
      },
    ],
    nearbyAreas: ['richmond-hill', 'thornhill', 'markham'],
    faqs: [
      {
        question: 'Does CiCon Marketing have an office in Vaughan?',
        answer:
          'No — we are based in Richmond Hill, about 15–20 minutes from most of Vaughan. We work with Vaughan clients remotely and on location, including on-site photo and video production when a project calls for it.',
      },
      {
        question: 'Why are Google Ads so expensive for Vaughan contractors?',
        answer:
          'Home-improvement and construction keywords in Vaughan attract heavy bidding from both local companies and GTA-wide lead brokers. The fix is rarely a bigger budget — it is tighter keyword intent, better landing pages, and follow-up fast enough to win the quote before competitors call back.',
      },
      {
        question: 'Can you improve Maps rankings in Woodbridge specifically?',
        answer:
          'Often, yes — but honestly: Maps visibility depends on proximity, relevance, and prominence, and no agency controls proximity. What we control is profile completeness, review velocity, category strategy, and local content, which together decide who wins the visibility that is realistically available to you.',
      },
      {
        question: 'Do you work with Vaughan businesses outside home improvement?',
        answer:
          'Yes — dental clinics, showrooms, professional services, and B2B companies are all a fit. We are not a fit for businesses that need the cheapest possible provider or a big-agency army; every CiCon account is senior-run and deliberately boutique.',
      },
    ],
    lastReviewed: '2026-07-24',
  },

  // ── Thornhill — published 2026-07-24 (MJ approved client-city attribution) ─
  {
    slug: 'thornhill',
    cityName: 'Thornhill',
    region: 'York Region',
    tier: 1,
    status: 'published',
    indexable: true,
    title: 'Digital Marketing Agency Serving Thornhill, Ontario | CiCon',
    metaDescription:
      'Digital marketing for Thornhill businesses from a boutique agency based next door in Richmond Hill. Local SEO, Google Ads, and dental marketing that convert.',
    eyebrow: 'Thornhill · GTA',
    h1: 'Digital Marketing Agency Serving Thornhill, Ontario',
    summary:
      'CiCon Marketing is a boutique digital marketing agency based in Richmond Hill, directly north of Thornhill. We help Thornhill clinics, local service businesses, and professional practices win local search visibility and turn it into booked appointments and qualified calls. Thornhill spans both Vaughan and Markham, and we build campaigns that respect how Google actually maps that boundary.',
    localContext: [
      'Thornhill is a community, not a municipality — it straddles the Vaughan–Markham boundary along Yonge Street. That confuses a lot of location targeting: businesses on the west side compete in Vaughan\'s Maps ecosystem while the east side competes in Markham\'s, and campaigns that ignore the split waste budget on the wrong geography.',
      'For clinics and service businesses along the Yonge, Bathurst, and Centre Street corridors, the practical competition is often Richmond Hill and North York providers as much as other Thornhill businesses. Positioning here is about being the convenient, credible choice across that overlap.',
      'CiCon is based minutes away in Richmond Hill, so Thornhill is home turf for the local-search patterns we monitor daily.',
    ],
    bestFitIndustries: [
      { name: 'Dental & healthcare clinics', note: 'Dense clinic corridors along Yonge and Bathurst reward review depth and profile discipline.' },
      { name: 'Local service businesses', note: 'HVAC, plumbing, cleaning, and repair companies serving both sides of the Vaughan–Markham line.' },
      { name: 'Professional practices', note: 'Legal, accounting, and consulting practices competing on trust and proximity.' },
    ],
    featuredServices: [
      { slug: 'local-seo-optimization', title: 'Local SEO', angle: 'Targeting that respects Thornhill\'s Vaughan–Markham split instead of fighting it.' },
      { slug: 'dental-marketing-services', title: 'Dental Marketing', angle: 'Patient acquisition for one of the GTA\'s densest clinic corridors.' },
      { slug: 'paid-advertising-services', title: 'Paid Advertising', angle: 'Geo-targeted Google Ads that don\'t leak budget across the boundary.' },
      { slug: 'social-media-marketing-services', title: 'Social Media Marketing', angle: 'Community-level presence for neighbourhood-driven businesses.' },
    ],
    localProof: [
      // City locations verified from the clients' own public websites
      // 2026-07-24; MJ approved restrained city attribution the same day.
      // All three logos already appear in cicon.ca's Trusted-By marquee.
      // Keep wording factual: name + city + relationship. No results, metrics,
      // or project scope.
      {
        kind: 'client',
        label: 'Joseph Kitchen and Bath — Thornhill kitchen and bath showroom on our client roster.',
        approved: true,
      },
      {
        kind: 'client',
        label: 'AM Group Studio — Thornhill-based design-build studio we work with.',
        approved: true,
      },
      {
        kind: 'client',
        label: 'Artistry Homes — Thornhill-based custom home builder on our client roster.',
        approved: true,
      },
      {
        kind: 'blog',
        label: 'What Good Local SEO Looks Like in 2026 (includes Thornhill clinic scenarios)',
        href: '/blog/local-seo-results-without-wasting-budget-2026/',
        approved: true,
      },
    ],
    nearbyAreas: ['richmond-hill', 'vaughan', 'markham', 'north-york'],
    faqs: [
      {
        question: 'Is Thornhill part of Vaughan or Markham for local SEO?',
        answer:
          'Both. Thornhill spans the two cities along Yonge Street, and Google treats each side according to its municipality. We set up your Google Business Profile, service areas, and ad geo-targeting based on where your address actually sits and where your customers actually come from.',
      },
      {
        question: 'How close is CiCon to Thornhill?',
        answer:
          'Our Richmond Hill office is directly north of Thornhill — typically a 10–15 minute drive. In-person meetings and on-location photo or video shoots in Thornhill are easy to arrange.',
      },
      {
        question: 'What marketing works best for Thornhill clinics?',
        answer:
          'Usually a complete Google Business Profile with a steady review process, a site that answers insurance and service questions clearly, and tightly geo-targeted ads. Thornhill patients often compare providers across Thornhill, Richmond Hill, and North York, so trust signals decide the click.',
      },
    ],
    lastReviewed: '2026-07-24',
  },

  // ── Markham — published 2026-07-24 (MJ approved client-city attribution) ──
  {
    slug: 'markham',
    cityName: 'Markham',
    region: 'York Region',
    tier: 1,
    status: 'published',
    indexable: true,
    title: 'Digital Marketing Agency Serving Markham, Ontario | CiCon',
    metaDescription:
      'Digital marketing for Markham showrooms, home-improvement companies, and clinics. Boutique, senior-led strategy from nearby Richmond Hill. Chat on WhatsApp.',
    eyebrow: 'Markham · GTA',
    h1: 'Digital Marketing Agency Serving Markham, Ontario',
    summary:
      'CiCon Marketing is a boutique digital marketing agency based in Richmond Hill, serving businesses across Markham — from Unionville and Markham Village to the commercial corridors along Highway 7 and Woodbine. We build local SEO, paid advertising, and content systems for Markham showrooms, home-improvement companies, professional services, and dental clinics.',
    localContext: [
      'Markham\'s commercial landscape is showroom-heavy: kitchen and bath, lighting, flooring, and furniture retailers cluster along its arterial corridors. For these businesses, buyers research visually before they visit — which makes photography, video, and a well-maintained profile as important as rankings.',
      'Markham is also one of Canada\'s most multilingual major markets. We approach that carefully: language-specific campaigns can be genuinely useful when a business actually serves customers in those languages, and we build them only on that basis — never on demographic assumptions.',
      'Being based in neighbouring Richmond Hill means on-location shoots and in-person strategy sessions in Markham are trivial to arrange, and the local search results we optimize are ones we can verify from inside the market.',
    ],
    bestFitIndustries: [
      { name: 'Showrooms & retail', note: 'Visual-first buying journeys need media production, not just rankings.' },
      { name: 'Home improvement', note: 'Renovators and trades competing across Markham\'s large residential base.' },
      { name: 'Professional services', note: 'Advisory, financial, and consulting firms in the Highway 7 corridor.' },
      { name: 'Dental clinics', note: 'Clinic-dense neighbourhoods where review strategy separates winners.' },
    ],
    featuredServices: [
      { slug: 'media-content-production', title: 'Media Production', angle: 'On-location photo and video for Markham showrooms — minutes from our base.' },
      { slug: 'local-seo-optimization', title: 'Local SEO', angle: 'Maps visibility across Unionville, Markham Village, and the Highway 7 corridor.' },
      { slug: 'paid-advertising-services', title: 'Paid Advertising', angle: 'Campaigns matched to Markham\'s showroom and service-business economics.' },
      { slug: 'website-development', title: 'Website Development', angle: 'Sites that carry a visual inventory without collapsing on mobile.' },
      { slug: 'dental-marketing-services', title: 'Dental Marketing', angle: 'Patient acquisition in one of the GTA\'s most competitive clinic markets.' },
    ],
    localProof: [
      // City locations verified from the clients' own public websites
      // 2026-07-24; MJ approved restrained city attribution the same day.
      // All three logos already appear in cicon.ca's Trusted-By marquee.
      // Keep wording factual: name + city + relationship. No results, metrics,
      // or project scope.
      {
        kind: 'client',
        label: 'Sparkle Light — Markham-based lighting brand on our active client roster.',
        approved: true,
      },
      {
        kind: 'client',
        label: 'Bethel International — lighting manufacturer with its Canadian head office in Markham; a CiCon client.',
        approved: true,
      },
      {
        kind: 'client',
        label: 'Venizzi Kitchen and Bath — Markham kitchen and bath showroom we work with.',
        approved: true,
      },
      {
        kind: 'blog',
        label: 'Dental SEO Services & CDCP Renewal in the GTA (Markham scenarios included)',
        href: '/blog/dental-seo-services-cdcp-renewal-gta/',
        approved: true,
      },
    ],
    nearbyAreas: ['richmond-hill', 'thornhill', 'vaughan'],
    faqs: [
      {
        question: 'Does CiCon do on-location photo and video in Markham?',
        answer:
          'Yes. Media production is one of our core services, and Markham is next door to our Richmond Hill base — showroom shoots, project documentation, and short-form video for social are all regular work.',
      },
      {
        question: 'Can you run campaigns in languages other than English for Markham?',
        answer:
          'When it genuinely fits your business, yes. We build language-specific campaigns only where you actually serve customers in that language and can handle inquiries in it — otherwise the leads frustrate everyone involved.',
      },
      {
        question: 'What should a Markham showroom prioritize first?',
        answer:
          'Usually the visual layer: current photography, a clean Google Business Profile with accurate categories, and a site that presents inventory credibly. Rankings without a convincing visual presence produce visits that don\'t convert — in showroom retail the two have to move together.',
      },
    ],
    lastReviewed: '2026-07-24',
  },

  // ── Aurora — DRAFT until proof exists ─────────────────────────────────────
  {
    slug: 'aurora',
    cityName: 'Aurora',
    region: 'York Region',
    tier: 1,
    status: 'draft',
    indexable: false,
    title: 'Digital Marketing Agency Serving Aurora, Ontario | CiCon',
    metaDescription:
      'Digital marketing for Aurora home-service companies, clinics, and local businesses. Qualified leads over vanity traffic — senior-led from Richmond Hill.',
    eyebrow: 'Aurora · York Region',
    h1: 'Digital Marketing Agency Serving Aurora, Ontario',
    summary:
      'CiCon Marketing is a boutique digital marketing agency based in Richmond Hill, a short drive south of Aurora. We help Aurora home-service companies, clinics, and local businesses generate qualified leads — not vanity traffic — through local SEO, Google Ads, and conversion-focused websites, with a senior strategist on every account.',
    localContext: [
      'Aurora\'s market skews toward established residential neighbourhoods with premium home-service demand — landscaping, renovation, HVAC, and specialty trades. Ticket sizes are higher and buyers vet providers more carefully, so review quality and portfolio presentation move the needle more than raw ad volume.',
      'Search volume in Aurora is smaller than in Richmond Hill or Vaughan, which changes the strategy: instead of fighting for broad keywords, the winning approach is owning the specific services and neighbourhoods where you genuinely excel, and converting a higher share of a smaller pool.',
      'Aurora businesses often serve Newmarket and King as one territory. We plan service-area targeting around that real operating footprint rather than municipal lines.',
    ],
    bestFitIndustries: [
      { name: 'Premium home services', note: 'Landscaping, renovation, and specialty trades serving Aurora\'s residential base.' },
      { name: 'Clinics & wellness', note: 'Dental, physio, and wellness practices where trust signals decide bookings.' },
      { name: 'Local professional services', note: 'Firms serving Aurora–Newmarket–King as a single territory.' },
    ],
    featuredServices: [
      { slug: 'local-seo-optimization', title: 'Local SEO', angle: 'Own the Aurora searches that matter instead of chasing GTA-wide volume.' },
      { slug: 'paid-advertising-services', title: 'Paid Advertising', angle: 'Smaller-market budgets need tighter intent — no spray-and-pray.' },
      { slug: 'crm-integration', title: 'CRM Integration', angle: 'Higher-ticket sales cycles live or die on follow-up speed.' },
      { slug: 'website-development', title: 'Website Development', angle: 'Portfolio-quality sites for businesses selling premium work.' },
    ],
    localProof: [
      {
        kind: 'client',
        label: 'Aurora-area client reference — required before this page is published.',
        approved: false,
      },
    ],
    nearbyAreas: ['newmarket', 'richmond-hill'],
    faqs: [
      {
        question: 'Is Aurora too small a market for paid advertising?',
        answer:
          'No, but it punishes sloppy targeting. With lower search volume, broad keywords burn budget fast; tightly matched service and neighbourhood intent, paired with a strong landing page, can produce excellent cost-per-lead in Aurora precisely because fewer competitors run disciplined campaigns.',
      },
      {
        question: 'Do you treat Aurora and Newmarket as one market?',
        answer:
          'Only if your business does. Google Maps treats them as separate cities, and so do we for profile strategy — but ad targeting and content can cover your real service territory when you operate across both.',
      },
      {
        question: 'What does CiCon consider a qualified lead for an Aurora home-service company?',
        answer:
          'A homeowner in your service area, asking for a service you actually offer, with contact details that let you respond the same day. We report on those — not on impressions or clicks — because that is what pays for the campaign.',
      },
    ],
    lastReviewed: '2026-07-24',
  },

  // ── Newmarket — DRAFT until proof exists ──────────────────────────────────
  {
    slug: 'newmarket',
    cityName: 'Newmarket',
    region: 'York Region',
    tier: 1,
    status: 'draft',
    indexable: false,
    title: 'Digital Marketing Agency Serving Newmarket, Ontario | CiCon',
    metaDescription:
      'Digital marketing for Newmarket trades, clinics, and professional services. Local SEO, Google Ads, and honest reporting from a boutique Richmond Hill agency.',
    eyebrow: 'Newmarket · York Region',
    h1: 'Digital Marketing Agency Serving Newmarket, Ontario',
    summary:
      'CiCon Marketing is a boutique digital marketing agency based in Richmond Hill, serving businesses across Newmarket and northern York Region. We build local SEO, Google Ads, and social media systems for Newmarket trades, clinics, and professional services — reported transparently, run by a senior strategist, and measured on qualified leads.',
    localContext: [
      'Newmarket functions as northern York Region\'s commercial anchor: its retail corridors and Main Street draw customers from East Gwillimbury, Aurora, and beyond. Local businesses here compete for a catchment that is meaningfully larger than the town itself, and service-area strategy should reflect that.',
      'The market mixes long-established local businesses with newer arrivals following residential growth. For the established, the opportunity is usually modernizing a neglected digital presence; for the new, it is building review credibility fast enough to compete with twenty-year incumbents.',
      'Healthcare and clinic demand is significant given the regional hospital presence, and clinic marketing here rewards clear insurance, booking, and wait-time answers over generic branding.',
    ],
    bestFitIndustries: [
      { name: 'Trades & home services', note: 'Serving Newmarket plus the East Gwillimbury growth corridor.' },
      { name: 'Clinics & healthcare', note: 'Practices competing in a regional healthcare hub.' },
      { name: 'Professional services', note: 'Firms drawing clients from across northern York Region.' },
      { name: 'Main Street retail', note: 'Local retailers whose customers check Maps before visiting.' },
    ],
    featuredServices: [
      { slug: 'local-seo-optimization', title: 'Local SEO', angle: 'Capture the northern York Region catchment, not just the town line.' },
      { slug: 'paid-advertising-services', title: 'Paid Advertising', angle: 'Regional targeting for businesses that draw from three municipalities.' },
      { slug: 'social-media-marketing-services', title: 'Social Media Marketing', angle: 'Community-rooted presence for Main Street and neighbourhood brands.' },
      { slug: 'marketing-consultant', title: 'Marketing Consultant', angle: 'Senior strategy for established businesses modernizing their digital presence.' },
    ],
    localProof: [
      {
        kind: 'client',
        label: 'Newmarket-area client reference — required before this page is published.',
        approved: false,
      },
    ],
    nearbyAreas: ['aurora', 'richmond-hill'],
    faqs: [
      {
        question: 'My Newmarket customers come from several towns — how does that change marketing?',
        answer:
          'It changes almost everything: your Google Business Profile service areas, your ad geo-targeting, and your content should match the real catchment — Newmarket plus East Gwillimbury, Aurora, or wherever your invoices actually come from. We set that up from your customer data, not guesses.',
      },
      {
        question: 'Can an established Newmarket business catch up digitally without starting over?',
        answer:
          'Usually, yes. Established businesses typically have the hardest assets to fake — years of customers and reputation. The work is converting that into reviews, an accurate profile, and a site that reflects current quality. That is renovation, not reconstruction.',
      },
      {
        question: 'Does CiCon meet Newmarket clients in person?',
        answer:
          'Yes, when it is useful — our Richmond Hill office is about 20–25 minutes away. Most ongoing reporting happens remotely, with on-location visits for kickoffs, shoots, and periodic strategy sessions.',
      },
    ],
    lastReviewed: '2026-07-24',
  },

  // ── North York — DRAFT until proof exists ─────────────────────────────────
  {
    slug: 'north-york',
    cityName: 'North York',
    region: 'Toronto',
    tier: 1,
    status: 'draft',
    indexable: false,
    title: 'Digital Marketing Agency Serving North York, Toronto | CiCon',
    metaDescription:
      'Digital marketing for North York clinics, professional services, and home-improvement companies. Boutique senior-led strategy, not generic Toronto playbooks.',
    eyebrow: 'North York · Toronto',
    h1: 'Digital Marketing Agency Serving North York',
    summary:
      'CiCon Marketing is a boutique digital marketing agency based in Richmond Hill, serving businesses across North York — from the Yonge–Sheppard and Yonge–Finch corridors to Don Mills and Downsview. We build local SEO, paid advertising, and conversion systems for North York clinics, professional services, and home-improvement companies competing in one of Toronto\'s densest local markets.',
    localContext: [
      'North York is part of the City of Toronto but behaves as its own search market: patients and customers search "dentist north york" or "plumber north york", and the businesses competing in those results are concentrated along a handful of corridors. Generic "Toronto" campaigns consistently underprice this specificity.',
      'Density cuts both ways here. There are more potential customers per kilometre than almost anywhere we work — and more competitors per search result. Winning positions go to businesses with disciplined review generation, precise categories, and pages that answer the exact question searched.',
      'For Richmond Hill–corridor businesses, North York is the natural southern expansion market along Yonge Street, and we plan campaigns that treat that corridor as the connected market it actually is.',
    ],
    bestFitIndustries: [
      { name: 'Dental & medical clinics', note: 'Corridor-dense competition where profile discipline decides the Map Pack.' },
      { name: 'Professional services', note: 'Legal, accounting, and consulting firms near the Yonge corridor office clusters.' },
      { name: 'Home improvement', note: 'Renovators serving North York\'s aging housing stock.' },
      { name: 'Local retail & wellness', note: 'Neighbourhood businesses competing block-by-block on Maps.' },
    ],
    featuredServices: [
      { slug: 'dental-marketing-services', title: 'Dental Marketing', angle: 'Patient acquisition in clinic-saturated corridors — differentiation required.' },
      { slug: 'local-seo-optimization', title: 'Local SEO', angle: 'Block-level Maps competition rewards precision, not volume.' },
      { slug: 'paid-advertising-services', title: 'Paid Advertising', angle: 'Dense-market campaigns where tight geo-targeting protects budget.' },
      { slug: 'conversion-rate-optimization', title: 'Conversion Rate Optimization', angle: 'High traffic costs make every landing-page percentage point count.' },
    ],
    localProof: [
      {
        kind: 'client',
        label: 'North York client reference — required before this page is published.',
        approved: false,
      },
    ],
    nearbyAreas: ['thornhill', 'richmond-hill', 'vaughan'],
    faqs: [
      {
        question: 'Is North York a different market from Toronto for SEO?',
        answer:
          'For local search, effectively yes. People search "near me" or name the district, and Google\'s Map Pack reflects North York\'s own competitive set. A campaign targeting "Toronto" broadly will underperform one built for the actual corridors where your customers search.',
      },
      {
        question: 'How does CiCon handle North York\'s clinic competition?',
        answer:
          'By refusing to pretend a new clinic can outrank a twenty-review incumbent overnight. We sequence it: profile and category precision first, a compliant review engine second, then paid acquisition once the conversion path proves itself. Honest sequencing beats optimistic promises.',
      },
      {
        question: 'Do you serve businesses in both North York and York Region?',
        answer:
          'Yes — the Yonge Street corridor from North York up through Thornhill and Richmond Hill is our core geography. Many clients serve customers across that whole corridor, and we build their targeting accordingly.',
      },
    ],
    lastReviewed: '2026-07-24',
  },
]

// ── Hub-only coverage areas (no dedicated page) ──────────────────────────────

export const COVERAGE_AREAS: CoverageArea[] = [
  { name: 'King', region: 'York Region', line: 'Premium custom-home, design-build, and professional services across King Township.' },
  { name: 'Whitchurch–Stouffville', region: 'York Region', line: 'Local SEO and lead generation for Stouffville businesses serving eastern York Region.' },
  { name: 'East Gwillimbury', region: 'York Region', line: 'Growing residential market north of Newmarket — trades and local services.' },
  { name: 'Toronto', region: 'Toronto', line: 'GTA-wide strategy and dental marketing for clinics across the City of Toronto.' },
  { name: 'Scarborough', region: 'Toronto', line: 'Eastern Toronto clinics, contractors, and local businesses — a market we are actively expanding into.' },
  { name: 'Etobicoke', region: 'Toronto', line: 'Western Toronto coverage for paid advertising, SEO, and remote-friendly engagements.' },
  { name: 'Pickering', region: 'Durham Region', line: 'Eastern GTA corridor coverage for dental, home-service, and professional businesses.' },
  // Bolton stays hub-only this release; Direct Air Systems attribution
  // approved by MJ 2026-07-24 (restrained wording, no results/metrics).
  { name: 'Bolton', region: 'Caledon', line: 'Home services, HVAC, and trades in Bolton and the Caledon area — home of Direct Air Systems, an HVAC company on our client roster.' },
  { name: 'Mississauga', region: 'Peel Region', line: 'Western GTA coverage for paid advertising, SEO, and dental marketing engagements.' },
]

// ── Helpers ──────────────────────────────────────────────────────────────────

export function getPublishedAreas(): ServiceAreaPage[] {
  return AREA_PAGES.filter((p) => p.status === 'published' && p.indexable)
}

export function getBuildableAreas(): ServiceAreaPage[] {
  // Drafts are generated (noindexed) so they can be reviewed on the prod URL.
  return AREA_PAGES
}

export function getAreaBySlug(slug: string): ServiceAreaPage | undefined {
  return AREA_PAGES.find((p) => p.slug === slug)
}

/** Word count for the 40–80 word summary rule. */
function wordCount(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length
}

/**
 * Quality gate. Throws with a list of violations — called at build time from
 * getStaticPaths so invalid data can never deploy.
 */
export function validateAreaPages(pages: ServiceAreaPage[] = AREA_PAGES): void {
  const errors: string[] = []
  const seenSlugs = new Set<string>()
  const seenFaqs = new Map<string, string>()

  for (const p of pages) {
    const id = `[${p.slug}]`

    if (BANNED_AREAS.includes(p.slug as (typeof BANNED_AREAS)[number]) || /whitby/i.test(p.slug + p.cityName)) {
      errors.push(`${id} is a banned area (removed from GBP service areas) and must not exist.`)
    }
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.slug)) errors.push(`${id} slug must be lowercase kebab-case.`)
    if (seenSlugs.has(p.slug)) errors.push(`${id} duplicate slug.`)
    seenSlugs.add(p.slug)

    if (p.title.length < 55 || p.title.length > 62)
      errors.push(`${id} title must be 55–62 chars (is ${p.title.length}).`)
    if (p.metaDescription.length < 130 || p.metaDescription.length > 160)
      errors.push(`${id} metaDescription must be 130–160 chars (is ${p.metaDescription.length}).`)

    const sw = wordCount(p.summary)
    if (sw < 40 || sw > 80) errors.push(`${id} summary must be 40–80 words (is ${sw}).`)

    if (p.localContext.length < 2) errors.push(`${id} needs >=2 localContext paragraphs.`)
    if (p.featuredServices.length < 3 || p.featuredServices.length > 6)
      errors.push(`${id} needs 3–6 featuredServices (has ${p.featuredServices.length}).`)
    if (p.faqs.length < 3 || p.faqs.length > 6) errors.push(`${id} needs 3–6 FAQs (has ${p.faqs.length}).`)
    if (p.bestFitIndustries.length < 2) errors.push(`${id} needs >=2 bestFitIndustries.`)

    for (const f of p.faqs) {
      const key = f.question.trim().toLowerCase()
      const owner = seenFaqs.get(key)
      if (owner && owner !== p.slug) errors.push(`${id} FAQ duplicated across cities: "${f.question}" (also in [${owner}]).`)
      seenFaqs.set(key, p.slug)
    }

    for (const n of p.nearbyAreas) {
      if (!pages.some((q) => q.slug === n)) errors.push(`${id} nearbyAreas references unknown slug "${n}".`)
      if (n === p.slug) errors.push(`${id} nearbyAreas must not reference itself.`)
    }

    // The core anti-doorway rule: indexable requires approved proof.
    if (p.indexable) {
      if (p.status !== 'published') errors.push(`${id} indexable pages must have status "published".`)
      const approvedProof = p.localProof.filter((x) => x.approved)
      if (approvedProof.length === 0)
        errors.push(`${id} indexable requires >=1 APPROVED localProof item — none found. Keep it draft or supply proof.`)
    }

    // No page may imply a false office. Only the home market may claim an address.
    if (p.slug !== 'richmond-hill') {
      const all = [p.summary, ...p.localContext, ...p.faqs.map((f) => f.answer)].join(' ')
      if (new RegExp(`our\\s+${p.cityName.replace(/[-–]/g, '[-–]')}\\s+office`, 'i').test(all))
        errors.push(`${id} implies a local office — not allowed.`)
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(p.lastReviewed)) errors.push(`${id} lastReviewed must be YYYY-MM-DD.`)
  }

  if (errors.length) {
    throw new Error(`areas-served validation failed:\n- ${errors.join('\n- ')}`)
  }
}
