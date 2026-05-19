import { createClient } from '@sanity/client';
import type { HomepageData } from './types';

// Trim whitespace to guard against copy-paste or env var newline issues
const rawId  = (import.meta.env.PUBLIC_SANITY_PROJECT_ID ?? '').trim();
const dataset = (import.meta.env.PUBLIC_SANITY_DATASET ?? 'production').trim();

// Sanity only accepts a-z, 0-9, and dashes — skip if placeholder/unset
const isValidId = /^[a-z0-9-]+$/.test(rawId);
const projectId = isValidId ? rawId : null;

console.log(`[Sanity] projectId="${rawId}" valid=${isValidId} dataset="${dataset}"`);

// GROQ query — fetches all homepage sections.
// Images are resolved to direct CDN URLs via asset->url projection.
const HOMEPAGE_QUERY = `
  *[_type == "homepage"][0]{
    hero{
      headline,
      subheadline,
      ctaText,
      ctaLink,
      "heroImageUrl": heroImage.asset->url,
      "heroImageAlt": heroImage.alt,
      "heroImageCaption": heroImage.caption
    },
    whyCicon{
      headline,
      stats[]{value, label},
      description,
      "featureImageUrl": featureImage.asset->url,
      "featureImageAlt": featureImage.alt,
      "featureImageCaption": featureImage.caption
    },
    services{
      headline,
      items[]{title, description, icon}
    },
    whoWeServe{
      headline,
      subheadline,
      industries[]{
        title,
        description,
        icon,
        "imageUrl": image.asset->url,
        "imageAlt": image.alt
      }
    },
    howItWorks{
      headline,
      subheadline,
      steps[]{stepNumber, title, description}
    },
    problemsSolved{
      headline,
      subheadline,
      problems[]{problem, solution, icon}
    },
    readyToGrow{
      headline,
      subheadline,
      ctaText,
      ctaLink,
      "backgroundImageUrl": backgroundImage.asset->url,
      "backgroundImageAlt": backgroundImage.alt
    },
    contact{
      headline,
      email,
      phone,
      address,
      socialLinks[]{platform, url}
    }
  }
`;

// ── Blog index GROQ queries ──────────────────────────────────────────────────

export const FEATURED_POST_QUERY = `
  *[_type == "blogPost" && status == "published"] | order(publishedAt desc)[0] {
    _id, title, "slug": slug.current, dek,
    heroImage{ url, alt, caption },
    readTime, publishedAt,
    "category": category->{ name, "slug": slug.current }
  }
`

export const BLOG_INDEX_POSTS_QUERY = `
  *[_type == "blogPost" && status == "published" && _id != $featuredId]
  | order(publishedAt desc) [$start...$end] {
    _id, title, "slug": slug.current, dek,
    heroImage{ url, alt, caption },
    readTime, publishedAt,
    "category": category->{ name, "slug": slug.current }
  }
`

export const BLOG_POST_COUNT_QUERY = `
  count(*[_type == "blogPost" && status == "published"])
`

export const ALL_CATEGORIES_QUERY = `
  *[_type == "blogCategory"] | order(sortOrder asc, name asc) {
    _id, name, "slug": slug.current, description,
    "postCount": count(*[_type == "blogPost" && references(^._id) && status == "published"])
  }
`

export const ALL_POSTS_SEARCH_QUERY = `
  *[_type == "blogPost" && status == "published"] {
    _id, title, "slug": slug.current, dek,
    "category": category->slug.current,
    keywords
  }
`

// Shared Sanity client factory — call this when projectId is available
function getSanityClient() {
  const rawId = (import.meta.env.PUBLIC_SANITY_PROJECT_ID ?? '').trim()
  const dataset = (import.meta.env.PUBLIC_SANITY_DATASET ?? 'production').trim()
  const isValid = /^[a-z0-9-]+$/.test(rawId)
  if (!isValid) return null
  return createClient({ projectId: rawId, dataset, useCdn: false, apiVersion: '2024-01-01' })
}

export type BlogPost = {
  _id: string
  title: string
  slug: string
  dek: string
  heroImage: { url: string; alt: string; caption?: string } | null
  readTime: number
  publishedAt: string
  author?: { name: string; slug: string }
  category: { name: string; slug: string } | null
}

export type BlogCategory = {
  _id: string
  name: string
  slug: string
  description: string
  postCount: number
}

export async function getBlogIndexData(page = 1, perPage = 12): Promise<{
  featured: BlogPost | null
  posts: BlogPost[]
  categories: BlogCategory[]
  totalPosts: number
}> {
  const client = getSanityClient()
  if (!client) return { featured: null, posts: [], categories: [], totalPosts: 0 }
  try {
    const featured = await client.fetch<BlogPost>(FEATURED_POST_QUERY)
    const start = (page - 1) * perPage
    const end = start + perPage
    const [posts, totalPosts, categories] = await Promise.all([
      client.fetch<BlogPost[]>(BLOG_INDEX_POSTS_QUERY, { featuredId: featured?._id ?? '', start, end }),
      client.fetch<number>(BLOG_POST_COUNT_QUERY),
      client.fetch<BlogCategory[]>(ALL_CATEGORIES_QUERY),
    ])
    return { featured, posts, categories, totalPosts }
  } catch (err) {
    console.error('[Sanity] Blog index fetch failed:', err)
    return { featured: null, posts: [], categories: [], totalPosts: 0 }
  }
}

export async function getAllPostsForSearch(): Promise<Array<{ _id: string; title: string; slug: string; dek: string; category: string; keywords: string }>> {
  const client = getSanityClient()
  if (!client) return []
  try {
    return await client.fetch(ALL_POSTS_SEARCH_QUERY)
  } catch {
    return []
  }
}

// ── Service page GROQ queries ────────────────────────────────────────────────

const SERVICE_PAGE_FIELDS = `
  _id, title, "slug": slug.current, serviceType, status,
  metaTitle, metaDescription, canonical,
  heroBadge, heroHeadline, heroSubheadline, heroDescription,
  heroStats[]{ value, label },
  heroImage{ asset->{ _id, url } },
  paaQuestions[]{ question, answer },
  antiPitchHeadline, antiPitchItems[]{ disqualifier, explanation },
  caseStudyTop->{ clientName, serviceType, isPlaceholder, summary, heroStat{ value, label }, placeholderImage{ asset->{ _id, url } } },
  caseStudyBottom->{ clientName, serviceType, isPlaceholder, summary, heroStat{ value, label }, placeholderImage{ asset->{ _id, url } } },
  capabilitiesHeadline, capabilitiesIntro,
  capabilities[]{ title, definition, description, icon },
  processSteps[]{ number, label, description },
  eeatHeadline, eeatBody, eeatStats[]{ value, label },
  faqs[]{ question, answer },
  cdcpBlock{ headline, body, bullets },
  patientChannels[]{ channel, description },
  relatedServices[]->{ title, "slug": slug.current, serviceType, heroSubheadline },
  relatedPosts[]->{ title, "slug": slug.current, dek, publishedAt,
    heroImage{ url, alt }, "category": category->{ name, "slug": slug.current } },
  serviceTypeSchema,
  areaServed
`

export const ALL_SERVICE_PAGES_QUERY = `
  *[_type == "servicePage" && status != "draft"] | order(serviceType asc) {
    _id, title, "slug": slug.current, serviceType,
    heroSubheadline, heroDescription,
    heroStats[]{ value, label }
  }
`

export const ALL_SERVICE_SLUGS_QUERY = `
  *[_type == "servicePage" && status != "draft"]{ "slug": slug.current }
`

export const SERVICE_PAGE_QUERY = `
  *[_type == "servicePage" && slug.current == $slug][0]{ ${SERVICE_PAGE_FIELDS} }
`

export const SERVICES_HUB_QUERY = `
  *[_type == "servicesHub"][0]{
    title, status,
    metaTitle, metaDescription, canonical,
    ogImage{ asset->{ _id, url } },
    ogTitle, ogDescription, twitterCardType,
    robotsIndex, robotsFollow,
    heroBadge,
    heroHeadline, heroSubheadline, heroDescription,
    heroImage{ asset->{ _id, url } },
    heroStats[]{ value, label },
    heroPrimaryCtaLabel, heroPrimaryCtaUrl,
    heroSecondaryCtaLabel, heroSecondaryCtaUrl,
    servicesGridHeadline, servicesGridSubhead,
    routerHeadline, routerIntro,
    antiPitchHeadline, antiPitchItems[]{ disqualifier, explanation },
    reviewsHeadline,
    finalCtaHeadline, finalCtaBody,
    finalCtaPrimaryLabel, finalCtaPrimaryUrl,
    footerCtaOverride{ headline, body, ctaLabel, ctaUrl },
    schemaType, customJsonLd
  }
`

export type ServicePageData = {
  _id: string
  title: string
  slug: string
  serviceType: string
  status: string
  metaTitle?: string
  metaDescription?: string
  canonical?: string
  heroBadge?: string
  heroHeadline: string
  heroSubheadline?: string
  heroDescription?: string
  heroStats?: Array<{ value: string; label: string }>
  heroImage?: { asset?: { _id: string; url: string } } | null
  paaQuestions?: Array<{ question: string; answer: string }>
  antiPitchHeadline?: string
  antiPitchItems?: Array<{ disqualifier: string; explanation?: string }>
  caseStudyTop?: { clientName: string; isPlaceholder: boolean; summary: string; heroStat: { value: string; label: string }; placeholderImage?: any } | null
  caseStudyBottom?: { clientName: string; isPlaceholder: boolean; summary: string; heroStat: { value: string; label: string }; placeholderImage?: any } | null
  capabilitiesHeadline?: string
  capabilitiesIntro?: string
  capabilities?: Array<{ title: string; definition?: string; description?: string; icon?: string }>
  processSteps?: Array<{ number: number; label: string; description: string }>
  eeatHeadline?: string
  eeatBody?: string
  eeatStats?: Array<{ value: string; label: string }>
  faqs?: Array<{ question: string; answer: string }>
  cdcpBlock?: { headline: string; body: string; bullets: string[] } | null
  patientChannels?: Array<{ channel: string; description: string }>
  relatedServices?: Array<{ title: string; slug: string; serviceType: string; heroSubheadline?: string }>
  relatedPosts?: Array<{ title: string; slug: string; dek?: string; publishedAt?: string; heroImage?: { url: string; alt: string } | null; category?: { name: string; slug: string } | null }>
  serviceTypeSchema?: string
  areaServed?: string[]
}

export type ServicesHubData = {
  title?: string
  status?: string
  metaTitle?: string
  metaDescription?: string
  canonical?: string
  ogImage?: { asset?: { _id: string; url: string } } | null
  ogTitle?: string
  ogDescription?: string
  twitterCardType?: string
  robotsIndex?: boolean
  robotsFollow?: boolean
  heroBadge?: string
  heroHeadline?: string
  heroSubheadline?: string
  heroDescription?: string
  heroImage?: { asset?: { _id: string; url: string } } | null
  heroStats?: Array<{ value: string; label: string }>
  heroPrimaryCtaLabel?: string
  heroPrimaryCtaUrl?: string
  heroSecondaryCtaLabel?: string
  heroSecondaryCtaUrl?: string
  servicesGridHeadline?: string
  servicesGridSubhead?: string
  routerHeadline?: string
  routerIntro?: string
  antiPitchHeadline?: string
  antiPitchItems?: Array<{ disqualifier: string; explanation?: string }>
  reviewsHeadline?: string
  finalCtaHeadline?: string
  finalCtaBody?: string
  finalCtaPrimaryLabel?: string
  finalCtaPrimaryUrl?: string
  footerCtaOverride?: { headline?: string; body?: string; ctaLabel?: string; ctaUrl?: string } | null
  schemaType?: string
  customJsonLd?: string
}

export async function getServicePage(slug: string): Promise<ServicePageData | null> {
  const client = getSanityClient()
  if (!client) return null
  try {
    return await client.fetch<ServicePageData>(SERVICE_PAGE_QUERY, { slug })
  } catch (err) {
    console.error('[Sanity] Service page fetch failed:', err)
    return null
  }
}

export async function getAllServicePages(): Promise<ServicePageData[]> {
  const client = getSanityClient()
  if (!client) return []
  try {
    return await client.fetch<ServicePageData[]>(ALL_SERVICE_PAGES_QUERY)
  } catch {
    return []
  }
}

export async function getServicesHub(): Promise<ServicesHubData | null> {
  const client = getSanityClient()
  if (!client) return null
  try {
    return await client.fetch<ServicesHubData>(SERVICES_HUB_QUERY)
  } catch {
    return null
  }
}

// ── Singleton page GROQ queries ──────────────────────────────────────────────

const ABOUT_PAGE_QUERY = `
  *[_type == "aboutPage"][0]{
    title, status,
    metaTitle, metaDescription, canonical, ogImageUrl, ogTitle, ogDescription,
    twitterCardType, robotsIndex, robotsFollow,
    heroBadge, heroHeadline, heroSubheadline,
    heroPrimaryCtaLabel, heroPrimaryCtaUrl, heroSecondaryCtaLabel, heroSecondaryCtaUrl,
    whyWeExist{ sectionHeader, paragraph },
    founderBlock{
      sectionBadge, headline, bodyText,
      founderName, founderTitle, founderImageUrl,
      credentials, linkedInUrl,
      stats[]{ value, label }
    },
    aiTransparencyBlock{ sectionHeader, introLine, aiAcceleratesColumn, humansOwnColumn, clientsGetBackColumn },
    stackBlock{ sectionHeader, introLine, tools[]{ toolName, category, purpose, displayOrder } },
    proofCluster{ sectionHeader, numericalResult, testimonial },
    processBlock{ sectionHeader, stages[]{ stageNumber, stageName, duration, description } },
    valuesBlock{ sectionHeader, values },
    dentalCalloutBlock{ sectionHeader, body, microProofPoints, ctaLabel, ctaLink },
    localAnchorBlock{ sectionHeader, body },
    faqBlock{ sectionHeader, questions[]{ question, answer } },
    finalCtaBlock{ sectionHeader, trustLine, primaryCtaLabel, primaryCtaUrl, secondaryCtaLabel, secondaryCtaUrl, displayPhone },
    schemaType, customJsonLd
  }
`

const CONTACT_PAGE_QUERY = `
  *[_type == "contactPage"][0]{
    title, status,
    metaTitle, metaDescription, canonical, ogTitle, ogDescription,
    twitterCardType, robotsIndex, robotsFollow,
    heroBadge, heroHeadline, heroSubheadline,
    introBlock{ sectionHeader, body },
    contactFormBlock{ formHeader, formDescription, submitButtonLabel, successMessage, errorMessage, sourceTag },
    contactMethodsBlock{ sectionHeader, methods[]{ methodType, label, value, clickAction, displayOrder } },
    mapBlock{ showMap, embedUrl, address, mapHeight },
    businessHoursBlock{ sectionHeader, hours[]{ dayName, openTime, closeTime, isClosed }, timezone, notes },
    faqBlock{ sectionHeader, questions[]{ question, answer } },
    finalCtaBlock{ sectionHeader, trustLine, primaryCtaLabel, primaryCtaUrl },
    schemaType, customJsonLd
  }
`

const MAP_CHECK_PAGE_QUERY = `
  *[_type == "mapCheckPage"][0]{
    title, status,
    metaTitle, metaDescription, canonical, ogImageUrl, ogTitle, ogDescription,
    twitterCardType, robotsIndex, robotsFollow,
    heroBadge, heroHeadline, heroDescription1, heroDescription2,
    heroImageUrl, heroImageAlt, showHeroCta,
    scannerBlock{ sectionHeader, embedCode, loadingText, containerMaxWidth },
    resultsExplainerBlock{ sectionHeader, leadLine, explainerItems[]{ dotColor, label, description } },
    leadCaptureBlock{ sectionHeader, leadCopy, formSourceTag, formSubmitLabel, successMessage },
    socialProofBlock{ useHomePageComponent, overrideSectionHeader },
    faqBlock{ sectionHeader, questions[]{ question, answer, answerHtml } },
    finalCtaBlock{ sectionHeader, trustLine, primaryCtaLabel, primaryCtaUrl, secondaryCtaLabel, secondaryCtaUrl },
    schemaType, customJsonLd
  }
`

// ── Types for singleton pages ─────────────────────────────────────────────────

export type AboutPageData = {
  title?: string
  metaTitle?: string
  metaDescription?: string
  canonical?: string
  heroBadge?: string
  heroHeadline?: string
  heroSubheadline?: string
  heroPrimaryCtaLabel?: string
  heroPrimaryCtaUrl?: string
  heroSecondaryCtaLabel?: string
  heroSecondaryCtaUrl?: string
  whyWeExist?: { sectionHeader?: string; paragraph?: string }
  founderBlock?: {
    sectionBadge?: string
    headline?: string
    bodyText?: string
    founderName?: string
    founderTitle?: string
    founderImageUrl?: string
    credentials?: string[]
    linkedInUrl?: string
    stats?: Array<{ value: string; label: string }>
  }
  aiTransparencyBlock?: {
    sectionHeader?: string; introLine?: string
    aiAcceleratesColumn?: { header?: string; body?: string }
    humansOwnColumn?: { header?: string; body?: string }
    clientsGetBackColumn?: { header?: string; body?: string }
  }
  stackBlock?: { sectionHeader?: string; introLine?: string; tools?: Array<{ toolName: string; category?: string; purpose?: string; displayOrder?: number }> }
  processBlock?: { sectionHeader?: string; stages?: Array<{ stageNumber: number; stageName: string; duration?: string; description?: string }> }
  valuesBlock?: { sectionHeader?: string; values?: string[] }
  dentalCalloutBlock?: { sectionHeader?: string; body?: string; microProofPoints?: string[]; ctaLabel?: string; ctaLink?: string }
  localAnchorBlock?: { sectionHeader?: string; body?: string }
  faqBlock?: { sectionHeader?: string; questions?: Array<{ question: string; answer: string }> }
  finalCtaBlock?: { sectionHeader?: string; trustLine?: string; primaryCtaLabel?: string; primaryCtaUrl?: string; secondaryCtaLabel?: string; secondaryCtaUrl?: string; displayPhone?: boolean }
  schemaType?: string
}

export type ContactPageData = {
  title?: string
  metaTitle?: string
  metaDescription?: string
  canonical?: string
  heroBadge?: string
  heroHeadline?: string
  heroSubheadline?: string
  introBlock?: { sectionHeader?: string; body?: string }
  contactFormBlock?: { formHeader?: string; formDescription?: string; submitButtonLabel?: string; successMessage?: string; errorMessage?: string; sourceTag?: string }
  contactMethodsBlock?: { sectionHeader?: string; methods?: Array<{ methodType: string; label: string; value: string; clickAction?: string; displayOrder?: number }> }
  mapBlock?: { showMap?: boolean; embedUrl?: string; address?: string; mapHeight?: number }
  faqBlock?: { sectionHeader?: string; questions?: Array<{ question: string; answer: string }> }
  finalCtaBlock?: { sectionHeader?: string; primaryCtaLabel?: string; primaryCtaUrl?: string }
}

export type MapCheckPageData = {
  title?: string
  metaTitle?: string
  metaDescription?: string
  canonical?: string
  ogImageUrl?: string
  heroBadge?: string
  heroHeadline?: string
  heroDescription1?: string
  heroDescription2?: string
  heroImageUrl?: string
  heroImageAlt?: string
  scannerBlock?: { embedCode?: string; containerMaxWidth?: number }
  resultsExplainerBlock?: { sectionHeader?: string; leadLine?: string; explainerItems?: Array<{ dotColor: string; label: string; description?: string }> }
  leadCaptureBlock?: { sectionHeader?: string; leadCopy?: string; formSourceTag?: string; formSubmitLabel?: string }
  faqBlock?: { sectionHeader?: string; questions?: Array<{ question: string; answer: string; answerHtml?: boolean }> }
  finalCtaBlock?: { sectionHeader?: string; primaryCtaLabel?: string; primaryCtaUrl?: string; secondaryCtaLabel?: string; secondaryCtaUrl?: string }
}

// ── Fetch functions ───────────────────────────────────────────────────────────

export async function getAboutPage(): Promise<AboutPageData | null> {
  const client = getSanityClient()
  if (!client) return null
  try {
    return await client.fetch<AboutPageData>(ABOUT_PAGE_QUERY)
  } catch (err) {
    console.error('[Sanity] About page fetch failed:', err)
    return null
  }
}

export async function getContactPage(): Promise<ContactPageData | null> {
  const client = getSanityClient()
  if (!client) return null
  try {
    return await client.fetch<ContactPageData>(CONTACT_PAGE_QUERY)
  } catch (err) {
    console.error('[Sanity] Contact page fetch failed:', err)
    return null
  }
}

export async function getMapCheckPage(): Promise<MapCheckPageData | null> {
  const client = getSanityClient()
  if (!client) return null
  try {
    return await client.fetch<MapCheckPageData>(MAP_CHECK_PAGE_QUERY)
  } catch (err) {
    console.error('[Sanity] Map check page fetch failed:', err)
    return null
  }
}

export async function getHomepage(): Promise<HomepageData | null> {
  if (!projectId) {
    console.warn('[Sanity] No valid projectId — using fallback content.');
    return null;
  }
  try {
    const client = createClient({
      projectId,
      dataset,
      useCdn: false, // disable CDN for build-time fetches to get latest data
      apiVersion: '2024-01-01',
    });
    console.log('[Sanity] Fetching homepage...');
    const result = await client.fetch<HomepageData>(HOMEPAGE_QUERY);
    if (result) {
      console.log('[Sanity] ✅ Fetched. Hero headline:', result?.hero?.headline);
    } else {
      console.warn('[Sanity] ⚠️ Query returned null — no published homepage document?');
    }
    return result;
  } catch (err) {
    console.error('[Sanity] ❌ Fetch failed:', err);
    return null;
  }
}
