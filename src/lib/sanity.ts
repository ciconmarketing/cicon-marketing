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
      "heroImageUrl": heroImage.asset->url
    },
    whyCicon{
      headline,
      stats[]{value, label},
      description
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
        "imageUrl": image.asset->url
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
      ctaLink
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
