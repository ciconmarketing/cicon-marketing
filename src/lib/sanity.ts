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
