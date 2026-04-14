import { createClient } from '@sanity/client';
import type { HomepageData } from './types';

const rawId  = import.meta.env.PUBLIC_SANITY_PROJECT_ID ?? '';
const dataset = import.meta.env.PUBLIC_SANITY_DATASET ?? 'production';

// Sanity only accepts a-z, 0-9, and dashes — skip if placeholder/unset
const isValidId = /^[a-z0-9-]+$/.test(rawId);
const projectId = isValidId ? rawId : null;

const HOMEPAGE_QUERY = `
  *[_type == "homepage"][0]{
    hero{
      headline,
      subheadline,
      ctaText,
      ctaLink
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
      industries[]{title, description, icon}
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
      address
    }
  }
`;

export async function getHomepage(): Promise<HomepageData | null> {
  if (!projectId) return null;
  try {
    const client = createClient({
      projectId,
      dataset,
      useCdn: true,
      apiVersion: '2024-01-01',
    });
    return await client.fetch<HomepageData>(HOMEPAGE_QUERY);
  } catch {
    return null;
  }
}
