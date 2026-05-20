import { createClient } from '@sanity/client';
import type { HomepageData, TrustedByMarqueeData } from './types';

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
    heroHeadline, heroSubheadline, heroDescription,
    heroStats[]{ value, label },
    heroImage{ asset->{ _id, url } },
    antiPitchHeadline, antiPitchItems[]{ disqualifier, explanation },
    routerHeadline, routerIntro,
    finalCtaHeadline, finalCtaBody
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
  heroHeadline?: string
  heroSubheadline?: string
  heroDescription?: string
  heroStats?: Array<{ value: string; label: string }>
  heroImage?: { asset?: { _id: string; url: string } } | null
  antiPitchHeadline?: string
  antiPitchItems?: Array<{ disqualifier: string; explanation?: string }>
  routerHeadline?: string
  routerIntro?: string
  finalCtaHeadline?: string
  finalCtaBody?: string
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

// ── Trusted By Marquee ────────────────────────────────────────────────────────

export const TRUSTED_BY_MARQUEE_QUERY = `
  *[_type == "trustedByMarquee"][0]{
    enabled, heading, subheading,
    logos[]{ clientName, logoFilename, order } | order(order asc),
    marqueeSpeed, direction
  }
`

export async function getTrustedByMarquee(): Promise<TrustedByMarqueeData | null> {
  const client = getSanityClient()
  if (!client) return null
  try {
    return await client.fetch<TrustedByMarqueeData>(TRUSTED_BY_MARQUEE_QUERY)
  } catch {
    return null
  }
}

// ── Page schemas ─────────────────────────────────────────────────────────────

export const CONTACT_PAGE_QUERY = `
  *[_type == "contactPage"][0]{
    hero{ headline, subheadline },
    faqs[]{ question, answer },
    seoCopy{ headline, body }
  }
`

export const ABOUT_PAGE_QUERY = `
  *[_type == "aboutPage"][0]{
    hero{ headline, subheadline },
    whySection{ headline, body },
    stackTools[]{ name, category, purpose },
    proof{ metricValue, metricLabel, testimonialQuote, testimonialAuthor, testimonialBusiness },
    values[]{ text },
    dentalSection{ headline, body },
    localSection{ headline, body },
    faqs[]{ question, answer },
    finalCta{ headline, trustLine }
  }
`

export const FREE_MAP_CHECK_PAGE_QUERY = `
  *[_type == "freeMapCheckPage"][0]{
    hero{ headline, badge, subheadline, description },
    faqs[]{ question, answer },
    finalCta{ headline, body }
  }
`

export const THANK_YOU_PAGE_QUERY = `
  *[_type == "thankYouPage"][0]{
    headline, paragraph1, paragraph2,
    nurtureLinkLabel, nurtureLinkUrl
  }
`

export const PRIVACY_POLICY_PAGE_QUERY = `
  *[_type == "privacyPolicyPage"][0]{
    pageTitle, lastReviewed, content
  }
`

export const SMS_TERMS_PAGE_QUERY = `
  *[_type == "smsTermsPage"][0]{
    pageTitle, lastReviewed, content
  }
`

export async function getContactPage() {
  const client = getSanityClient()
  if (!client) return null
  try { return await client.fetch(CONTACT_PAGE_QUERY) } catch { return null }
}

export async function getAboutPage() {
  const client = getSanityClient()
  if (!client) return null
  try { return await client.fetch(ABOUT_PAGE_QUERY) } catch { return null }
}

export async function getFreeMapCheckPage() {
  const client = getSanityClient()
  if (!client) return null
  try { return await client.fetch(FREE_MAP_CHECK_PAGE_QUERY) } catch { return null }
}

export async function getThankYouPage() {
  const client = getSanityClient()
  if (!client) return null
  try { return await client.fetch(THANK_YOU_PAGE_QUERY) } catch { return null }
}

export async function getPrivacyPolicyPage() {
  const client = getSanityClient()
  if (!client) return null
  try { return await client.fetch(PRIVACY_POLICY_PAGE_QUERY) } catch { return null }
}

export async function getSmsTermsPage() {
  const client = getSanityClient()
  if (!client) return null
  try { return await client.fetch(SMS_TERMS_PAGE_QUERY) } catch { return null }
}
