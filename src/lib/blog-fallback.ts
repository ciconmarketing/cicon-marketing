import type { BlogPost, BlogCategory } from './sanity'

export const FALLBACK_POSTS: BlogPost[] = [
  {
    _id: 'post-1',
    title: 'How to Choose a Local SEO Agency in Toronto (2026 Guide)',
    slug: 'local-seo-agency-toronto-guide-2026',
    dek: 'Verify their track record with GTA businesses, demand transparent reporting on lead generation and conversion rates, and avoid any firm that guarantees rankings.',
    heroImage: { url: 'https://cicon.ca/logo-cicon.jpg', alt: 'How to choose a local SEO agency in Toronto 2026' },
    readTime: 11,
    publishedAt: '2026-05-10',
    category: { name: 'Local SEO', slug: 'local-seo' },
  },
  {
    _id: 'post-2',
    title: 'Meta Ads Agency Richmond Hill 2026: How to Choose & What to Avoid',
    slug: 'meta-ads-agency-how-to-use',
    dek: 'Choosing the right Meta Ads agency in Richmond Hill requires scrutinizing their track record with local businesses and their reporting transparency.',
    heroImage: { url: 'https://cicon.ca/logo-cicon.jpg', alt: 'Meta Ads agency Richmond Hill 2026' },
    readTime: 9,
    publishedAt: '2026-05-05',
    category: { name: 'Paid Advertising', slug: 'paid-advertising' },
  },
  {
    _id: 'post-3',
    title: 'SEO Optimization Near Me: GTA Local Search Rankings 2026',
    slug: 'seo-optimization-near-me-2026',
    dek: 'To rank in local near me searches across the Greater Toronto Area, businesses must prioritize a fully optimized Google Business Profile, consistent local citations, and positive customer reviews.',
    heroImage: { url: 'https://contenu.nyc3.cdn.digitaloceanspaces.com/users%2F307f6e6d-4afe-4722-8da1-9af85f6facd8%2Flibrary%2F67c6003f-a717-4a47-876b-57558a95c4f1%2FSEO%20Optimization%20Near%20Me%204.jpg', alt: 'SEO optimization near me GTA 2026' },
    readTime: 9,
    publishedAt: '2026-04-20',
    category: { name: 'Local SEO', slug: 'local-seo' },
  },
  {
    _id: 'post-4',
    title: 'Dental Marketing Canada: A Complete Guide for 2026',
    slug: 'dental-marketin-canada-guide-2026',
    dek: 'Effective dental marketing in Canada requires a multi-channel approach focused on Local SEO, Google Ads, and patient-centric content to grow your practice.',
    heroImage: { url: 'https://contenu.nyc3.cdn.digitaloceanspaces.com/journalist%2F72d0d857-578d-4633-9974-0f846c9a7d00%2Fthumbnail.jpeg', alt: 'Dental marketing Canada complete guide 2026' },
    readTime: 10,
    publishedAt: '2026-04-10',
    category: { name: 'Dental Marketing', slug: 'dental-marketing' },
  },
]

export const FALLBACK_CATEGORIES: BlogCategory[] = [
  { _id: 'cat-1', name: 'Local SEO', slug: 'local-seo', description: 'Dominate local search results and the Google Map Pack for your GTA service area.', postCount: 2 },
  { _id: 'cat-2', name: 'Paid Advertising', slug: 'paid-advertising', description: 'High-ROI Meta Ads and Google Ads strategies for GTA businesses.', postCount: 1 },
  { _id: 'cat-3', name: 'Dental Marketing', slug: 'dental-marketing', description: 'Patient acquisition and practice growth strategies for Canadian dental clinics.', postCount: 1 },
  { _id: 'cat-4', name: 'Content & SEO', slug: 'content-seo', description: 'Content strategy and technical SEO for authority building.', postCount: 0 },
  { _id: 'cat-5', name: 'Strategy & Growth', slug: 'strategy-growth', description: 'Marketing systems and growth frameworks for GTA service businesses.', postCount: 0 },
]
