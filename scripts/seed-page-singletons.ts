/**
 * scripts/seed-page-singletons.ts
 *
 * Creates the three singleton documents (aboutPage, contactPage, mapCheckPage)
 * in Sanity with initial content matching the current Astro hardcoded values.
 *
 * Usage:
 *   npx ts-node --project tsconfig.json scripts/seed-page-singletons.ts
 *   OR
 *   npx tsx scripts/seed-page-singletons.ts
 *
 * The script uses createOrReplace, so it is safe to run multiple times.
 * Existing content will be overwritten with the seed defaults.
 *
 * IMPORTANT: Run from the repo root. Requires PUBLIC_SANITY_PROJECT_ID and
 * SANITY_API_TOKEN (write token) in environment or .env.local
 */

import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load .env.local from repo root
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID?.trim()
const dataset   = process.env.PUBLIC_SANITY_DATASET?.trim() ?? 'production'
const token     = process.env.SANITY_API_TOKEN?.trim()

if (!projectId) {
  console.error('❌  PUBLIC_SANITY_PROJECT_ID is not set. Add it to .env.local')
  process.exit(1)
}
if (!token) {
  console.error('❌  SANITY_API_TOKEN is not set. Add a write token to .env.local')
  console.error('   Get one at: https://www.sanity.io/manage → API → Tokens')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  token,
  useCdn: false,
  apiVersion: '2024-01-01',
})

// ── Fixed document IDs (must match sanity.config.ts SINGLETON_DOCUMENT_IDS) ──
const ABOUT_ID    = 'about-page-singleton'
const CONTACT_ID  = 'contact-page-singleton'
const MAP_ID      = 'map-check-page-singleton'

// ─────────────────────────────────────────────────────────────────────────────
// ABOUT PAGE
// ─────────────────────────────────────────────────────────────────────────────
const aboutPageDoc = {
  _id:  ABOUT_ID,
  _type: 'aboutPage',
  title: 'About CiCon Marketing',
  slug:  { _type: 'slug', current: 'about-us' },
  pageType: 'about',
  status: 'published',
  needsRewrite: false,
  metaTitle: 'About CiCon Marketing | Boutique Digital Agency in Richmond Hill, GTA',
  metaDescription: 'CiCon is a boutique AI-augmented digital marketing studio in Richmond Hill, GTA — building compounding growth systems for local businesses and dental clinics.',
  canonical: 'https://cicon.ca/about-us/',
  twitterCardType: 'summary_large_image',
  robotsIndex: true,
  robotsFollow: true,
  heroBadge: 'About CiCon Marketing',
  heroHeadline: 'A boutique GTA marketing studio building AI-augmented growth systems for local businesses and dental clinics.',
  heroSubheadline: "Operating across the Greater Toronto Area — founded by a Google-certified strategist with a Master's in Engineering and 15+ years building data-driven growth systems.",
  heroPrimaryCtaLabel: 'Chat on WhatsApp',
  heroPrimaryCtaUrl: 'https://wa.me/16475840800',
  heroSecondaryCtaLabel: 'See our services',
  heroSecondaryCtaUrl: '/services/',
  whyWeExist: {
    _type: 'object',
    sectionHeader: 'Why CiCon exists',
    paragraph: "Most agencies sell hours and report on impressions. CiCon was built as a reaction to that model. We don't invoice for meetings; we build compounding visibility engines — local search infrastructure, content systems, and paid acquisition funnels that earn more over time, not less. The GTA is not a generic market, and \"best practices\" from a playbook written for nationwide brands will lose to a competitor who actually understands Richmond Hill, Markham, and the specific search behaviour of a GTA patient or homeowner looking for a local provider. We stay small on purpose so we can stay sharp on your account.",
  },
  aiTransparencyBlock: {
    sectionHeader: 'AI-augmented, human-owned',
    introLine: "We're upfront about our stack. Here's how the work actually gets done.",
    aiAcceleratesColumn: {
      header: 'AI accelerates',
      body: "Keyword clustering, content drafts, predictive bid adjustments, rank tracking, reporting automation. AI cuts what used to take days to hours — and scales output without scaling headcount.",
    },
    humansOwnColumn: {
      header: 'Humans own',
      body: "Strategy, creative direction, client relationship, account decisions, and every external communication. AI doesn't understand your business context, your competitor's local reputation, or why a patient in Markham behaves differently from one in Etobicoke. That judgment lives with your strategist.",
    },
    clientsGetBackColumn: {
      header: 'Clients get back',
      body: "Lower customer acquisition costs because we're not billing for busywork. More senior attention on strategy because the gruntwork is automated. Faster turnaround on deliverables. You pay for outcomes, not for the hours it took to get there.",
    },
  },
  stackBlock: {
    sectionHeader: 'The stack behind every CiCon campaign',
    introLine: "We don't hide our tools. Every platform below is active on client accounts today.",
    tools: [
      { _key: 't1', toolName: 'Ahrefs',                   category: 'SEO',      purpose: 'Backlink analysis, keyword research, rank tracking',       displayOrder: 1 },
      { _key: 't2', toolName: 'Surfer SEO',               category: 'SEO',      purpose: 'On-page content optimisation and NLP scoring',             displayOrder: 2 },
      { _key: 't3', toolName: 'Ubersuggest',              category: 'SEO',      purpose: 'Local keyword discovery and competitor gap analysis',       displayOrder: 3 },
      { _key: 't4', toolName: 'Arvow',                    category: 'Ads',      purpose: 'Google Ads automation and bid management',                  displayOrder: 4 },
      { _key: 't5', toolName: 'Localo',                   category: 'Local SEO',purpose: 'GBP optimisation and local rank heat mapping',              displayOrder: 5 },
      { _key: 't6', toolName: 'RankPrompt',               category: 'AI SEO',   purpose: 'AI-driven content strategy and search intent mapping',     displayOrder: 6 },
      { _key: 't7', toolName: 'GoHighLevel',              category: 'CRM',      purpose: 'Pipeline management, lead nurturing, and automation',        displayOrder: 7 },
      { _key: 't8', toolName: 'Claude · ChatGPT · Gemini',category: 'AI',       purpose: 'Research, content drafts, analysis, and automation',       displayOrder: 8 },
      { _key: 't9', toolName: 'Higgsfield',               category: 'Video AI', purpose: 'AI-assisted video content production',                     displayOrder: 9 },
    ],
  },
  processBlock: {
    sectionHeader: 'How a CiCon engagement actually works',
    stages: [
      { _key: 's1', stageNumber: 1, stageName: 'Discovery',     duration: 'Week 1–2',  description: 'Full audit: accounts, competitors, search footprint, conversion gaps' },
      { _key: 's2', stageNumber: 2, stageName: 'Strategy',      duration: 'Week 2–3',  description: 'Channel plan, 90-day KPI targets, creative direction, budget allocation' },
      { _key: 's3', stageNumber: 3, stageName: 'Build & Launch', duration: 'Week 3–4', description: 'Campaigns go live, assets shipped, tracking verified' },
      { _key: 's4', stageNumber: 4, stageName: 'Optimise',      duration: 'Ongoing',   description: 'Monthly reviews, continuous testing, quarterly business reviews' },
    ],
  },
  valuesBlock: {
    sectionHeader: 'What we stand for',
    values: [
      'Transparency over polish — you see the numbers, the methodology, and the honest interpretation every time',
      'Senior attention on every account — no hand-offs to junior coordinators, no templated playbooks',
      'Local depth over national breadth — GTA market context is baked into everything we build',
    ],
  },
  dentalCalloutBlock: {
    sectionHeader: 'Dentists and healthcare practices',
    body: 'A meaningful part of our practice is dedicated to dental and healthcare marketing. We understand the CDCP landscape, the referral dynamics of multi-location practices, and the compliance boundaries around health marketing.',
    microProofPoints: [
      'Patient acquisition campaigns that comply with RCDSO advertising guidelines',
      'New patient growth across general and specialty dental practices',
      'Dedicated dental marketing hub at dental.cicon.ca',
    ],
    ctaLabel: 'See dental marketing →',
    ctaLink: 'https://dental.cicon.ca',
  },
  localAnchorBlock: {
    sectionHeader: 'Built for the Greater Toronto Area',
    body: "Our team operates across Richmond Hill, Markham, Toronto, Vaughan, and Mississauga. Local search intent, regional competitive dynamics, and the specific behaviour of a GTA consumer are built into every campaign we run — not bolted on as an afterthought. We don't manage accounts remotely from a different province; we're in the same markets as your customers.",
  },
  faqBlock: {
    sectionHeader: 'Common questions',
    questions: [
      { _key: 'q1', question: 'Why work with a boutique agency instead of a large one?', answer: "Large agencies spread attention across hundreds of accounts. At CiCon, every account gets a senior strategist — not a junior coordinator running templated playbooks. You're getting direct access to the people who built the systems, not an account manager reading from a dashboard." },
      { _key: 'q2', question: 'How does CiCon use AI in client work?', answer: "We use AI where it compounds speed without sacrificing accuracy: keyword research, content production at scale, predictive analytics, and reporting automation. Human judgment drives every strategy call, creative brief, and quarterly review — AI accelerates the groundwork." },
      { _key: 'q3', question: "What's included in your reporting?", answer: "Quarterly business reviews covering traffic, rankings, lead volume, cost per acquisition, and channel ROI — not vanity metrics. You'll see what moved, what didn't, and what the next 90 days look like." },
      { _key: 'q4', question: 'Do you work with clinics and businesses outside the GTA?', answer: "Our core geography is the Greater Toronto Area — Richmond Hill, Toronto, Markham, Vaughan, Mississauga, and surrounding communities. For dental clinics specifically, we've worked with practices across Ontario; reach out and we'll tell you honestly if it's a fit." },
      { _key: 'q5', question: 'How quickly do you respond to clients?', answer: "Within the next business hour for anything urgent, and same business day for general questions. You'll have a direct WhatsApp line to your strategist — not a ticket queue." },
      { _key: 'q6', question: 'What size businesses do you typically work with?', answer: "Local service businesses and professional practices doing between $500K and $10M in annual revenue who are serious about growth infrastructure." },
    ],
  },
  finalCtaBlock: {
    sectionHeader: 'Ready to build something that compounds?',
    primaryCtaLabel: 'Chat on WhatsApp',
    primaryCtaUrl: 'https://wa.me/16475840800',
    secondaryCtaLabel: 'Contact us',
    secondaryCtaUrl: '/contact-us/',
    displayPhone: true,
  },
  schemaType: 'AboutPage',
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTACT PAGE
// ─────────────────────────────────────────────────────────────────────────────
const contactPageDoc = {
  _id:  CONTACT_ID,
  _type: 'contactPage',
  title: 'Contact CiCon Marketing',
  slug:  { _type: 'slug', current: 'contact-us' },
  pageType: 'contact',
  status: 'published',
  needsRewrite: false,
  metaTitle: 'Contact CiCon Marketing | GTA Digital Marketing Agency',
  metaDescription: 'Talk to a senior marketing strategist at CiCon Marketing. We respond within 1 business hour. Serving dental clinics and local businesses across the GTA.',
  canonical: 'https://cicon.ca/contact-us/',
  twitterCardType: 'summary_large_image',
  robotsIndex: true,
  robotsFollow: true,
  heroBadge: 'Get in touch',
  heroHeadline: 'Talk to a senior strategist — not a sales script.',
  heroSubheadline: "Every inquiry goes directly to Majid, our lead strategist. No intake form hand-offs, no junior coordinator triage. You describe your business and goals; we tell you honestly what we can do and whether we're the right fit.",
  introBlock: {
    sectionHeader: "Let's talk",
    body: "Whether you're a dental clinic looking to fill your schedule, a local business tired of burning ad spend with nothing to show, or an established GTA company ready to invest in a proper growth system — this is where you start.",
  },
  contactFormBlock: {
    formHeader: 'Send us a message',
    formDescription: "Fill in your details and we'll be in touch within 1 business hour.",
    submitButtonLabel: 'Send it',
    successMessage: "Thank you! We'll be in touch within 1 business hour.",
    errorMessage: 'Something went wrong. Please email us directly at info@cicon.ca.',
    destinationCRM: 'gohighlevel',
    sourceTag: 'Contact Page',
  },
  contactMethodsBlock: {
    sectionHeader: 'Other ways to reach us',
    methods: [
      { _key: 'cm1', methodType: 'phone',    label: 'Phone',     value: '+1 (289) 807-1020',       clickAction: 'tel:+12898071020',          displayOrder: 1 },
      { _key: 'cm2', methodType: 'whatsapp', label: 'WhatsApp',  value: 'Message us on WhatsApp',  clickAction: 'https://wa.me/16475840800', displayOrder: 2 },
      { _key: 'cm3', methodType: 'email',    label: 'Email',     value: 'info@cicon.ca',            clickAction: 'mailto:info@cicon.ca',       displayOrder: 3 },
      { _key: 'cm4', methodType: 'address',  label: 'Address',   value: '131 Golf Club Ct, Richmond Hill, ON L4C 5E1', clickAction: '', displayOrder: 4 },
      { _key: 'cm5', methodType: 'hours',    label: 'Hours',     value: 'Mon–Fri 9:00 AM – 6:00 PM ET', clickAction: '', displayOrder: 5 },
    ],
  },
  mapBlock: {
    showMap: true,
    embedUrl: 'https://www.google.com/maps?q=131+Golf+Club+Ct,+Richmond+Hill,+ON+L4C+5E1&output=embed',
    address: '131 Golf Club Ct, Richmond Hill, ON L4C 5E1',
    mapHeight: 350,
  },
  businessHoursBlock: {
    sectionHeader: 'Office hours',
    hours: [
      { _key: 'd1', dayName: 'Monday',    openTime: '9:00 AM', closeTime: '6:00 PM', isClosed: false },
      { _key: 'd2', dayName: 'Tuesday',   openTime: '9:00 AM', closeTime: '6:00 PM', isClosed: false },
      { _key: 'd3', dayName: 'Wednesday', openTime: '9:00 AM', closeTime: '6:00 PM', isClosed: false },
      { _key: 'd4', dayName: 'Thursday',  openTime: '9:00 AM', closeTime: '6:00 PM', isClosed: false },
      { _key: 'd5', dayName: 'Friday',    openTime: '9:00 AM', closeTime: '6:00 PM', isClosed: false },
      { _key: 'd6', dayName: 'Saturday',  openTime: '',        closeTime: '',         isClosed: true },
      { _key: 'd7', dayName: 'Sunday',    openTime: '',        closeTime: '',         isClosed: true },
    ],
    timezone: 'Eastern Time (ET)',
  },
  faqBlock: {
    sectionHeader: 'Common questions',
    questions: [
      { _key: 'q1', question: 'How fast do you actually respond?', answer: "Within 1 business hour, Monday to Friday, 9am – 6pm ET. Submissions after hours or on weekends get a reply first thing the next business day." },
      { _key: 'q2', question: 'Do I need a minimum ad budget?', answer: "For paid advertising engagements, we recommend a minimum media budget of $2,000/month — less than that and the data doesn't accumulate fast enough to optimize properly." },
      { _key: 'q3', question: 'Do you offer project work or only retainers?', answer: "Both. Monthly retainers for ongoing marketing management. Project-based for audits, website builds, and one-time campaigns." },
      { _key: 'q4', question: 'Can I see examples of your work before we talk?', answer: "Yes. We share case studies and relevant examples during our first call — after we understand your business context so we can show you what's actually relevant." },
    ],
  },
  finalCtaBlock: {
    sectionHeader: 'Prefer a direct line?',
    primaryCtaLabel: 'Chat on WhatsApp',
    primaryCtaUrl: 'https://wa.me/16475840800',
  },
  schemaType: 'ContactPage',
}

// ─────────────────────────────────────────────────────────────────────────────
// MAP CHECK PAGE
// ─────────────────────────────────────────────────────────────────────────────
const mapCheckPageDoc = {
  _id:  MAP_ID,
  _type: 'mapCheckPage',
  title: 'Check Your Google Map Visibility for Free',
  slug:  { _type: 'slug', current: 'check-google-map-visibility-for-free' },
  pageType: 'tool',
  status: 'published',
  needsRewrite: false,
  metaTitle: 'Free Google Maps Visibility Check | Local Ranking Heat Map',
  metaDescription: 'Is your business invisible on Google Maps? Use our free local ranking tool to see exactly where you rank. Get a real-time heat map today.',
  canonical: 'https://cicon.ca/check-google-map-visibility-for-free/',
  ogImageUrl: 'https://cicon.ca/wp-content/uploads/2026/03/Google-Map-Visibility-for-Free-3-3.jpg',
  twitterCardType: 'summary_large_image',
  robotsIndex: true,
  robotsFollow: true,
  heroBadge: 'Free Local SEO Tool',
  heroHeadline: 'Check Your Google Map Visibility for Free',
  heroDescription1: "Check Your Google Map Visibility for Free and discover the truth about your local reach. Most businesses think they're #1 because they see themselves at the top when searching from their own office, but their customers often see something completely different.",
  heroDescription2: "Don't let a \"false positive\" search result cost you sales. Enter your business name below to get a real-time heat map of your local rankings and see exactly how you appear to customers across every corner of your city.",
  heroImageUrl: 'https://cicon.ca/wp-content/uploads/2026/03/google-maps-visibility-heat-map-audit-1-768x355.jpg',
  heroImageAlt: 'Dashboard interface of a local SEO rank tracking tool showing a geographical Position Map with circular heat map markers in green and orange, indicating search ranking positions across a city area.',
  showHeroCta: false,
  scannerBlock: {
    embedCode: '<iframe src="https://app.localo.com/_demo/place-import" allow="geolocation" loading="lazy" title="Free Google Maps local ranking heat map scanner — enter your business name to see your visibility" style="border:none;height:400px;width:100%;border-radius:16px;min-height:200px;display:block;"></iframe>',
    loadingText: 'Loading scanner…',
    containerMaxWidth: 900,
  },
  resultsExplainerBlock: {
    sectionHeader: 'Did you see Red or Orange dots?',
    leadLine: "If you aren't in the Top 3, you are losing 75% of local mobile clicks.",
    explainerItems: [
      { _key: 'e1', dotColor: 'red',    label: 'Red Dots',    description: "Your business is buried on page 2 or 3. Customers can't find you. You're effectively invisible to anyone not searching from directly outside your door." },
      { _key: 'e2', dotColor: 'orange', label: 'Orange Dots', description: "You're close, but a competitor is currently taking your leads. Positions 4–10 capture a fraction of the clicks that positions 1–3 do. Close is not close enough." },
    ],
  },
  leadCaptureBlock: {
    sectionHeader: 'Want to know how to fix it?',
    leadCopy: "Enter your details below and we'll manually analyse your heat map results, benchmark your top 3 competitors, and send you a personalised 90-day Local Dominance Strategy — free.",
    formSourceTag: 'Google Map Visibility Audit',
    formSubmitLabel: 'Get My Free Audit',
    successMessage: "We've received your request! Our team will review your heat map and send your 90-day strategy within 1 business day.",
    showFormImage: false,
  },
  socialProofBlock: {
    useHomePageComponent: true,
  },
  faqBlock: {
    sectionHeader: 'Common questions',
    questions: [
      { _key: 'q1', question: 'Is this map check really free?', answer: 'Yes, 100%. There is no cost to run the scan. If you request the follow-up manual audit and 90-day roadmap from our team, that initial consultation is also free.', answerHtml: false },
      { _key: 'q2', question: 'Why do my search results look different when I check on my phone at the office?', answer: "Google personalizes search results based on a user's exact location and search history. If you frequently search for your own business while standing at your business, Google learns to show it to you. This tool bypasses that bias.", answerHtml: false },
      { _key: 'q3', question: 'My map shows a lot of red and orange—is it too late to fix?', answer: "Absolutely not. Red and orange simply mean your competitors are currently out-optimizing you. By optimizing your Google Business Profile, gathering reviews, and improving local relevance, you can expand your \"Green Zone.\"", answerHtml: false },
      { _key: 'q4', question: 'What happens after I fill out the form for the "Dominance Strategy"?', answer: "We don't just send you a generic automated PDF. One of our local SEO specialists will manually review your heat map results, analyze your top three nearest competitors, and draft a specific 90-day roadmap with actionable steps.", answerHtml: false },
    ],
  },
  finalCtaBlock: {
    sectionHeader: 'Ready to claim your territory?',
    primaryCtaLabel: 'Chat on WhatsApp',
    primaryCtaUrl: 'https://wa.me/16475840800',
    secondaryCtaLabel: 'Contact Us',
    secondaryCtaUrl: '/contact-us/',
  },
  schemaType: 'WebPage',
}

// ─────────────────────────────────────────────────────────────────────────────
// SEED
// ─────────────────────────────────────────────────────────────────────────────
async function seed() {
  console.log(`\n🌱  Seeding singleton pages to Sanity (project: ${projectId}, dataset: ${dataset})\n`)

  const docs = [
    { id: ABOUT_ID,   label: 'aboutPage   → /about-us/',                            doc: aboutPageDoc },
    { id: CONTACT_ID, label: 'contactPage → /contact-us/',                          doc: contactPageDoc },
    { id: MAP_ID,     label: 'mapCheckPage → /check-google-map-visibility-for-free/', doc: mapCheckPageDoc },
  ]

  for (const { id, label, doc } of docs) {
    try {
      await client.createOrReplace(doc as any)
      console.log(`  ✅  ${label}`)
    } catch (err: any) {
      console.error(`  ❌  ${label}`)
      console.error(`      ${err?.message ?? err}`)
    }
  }

  console.log('\n🎉  Seed complete! Open Sanity Studio → Pages to verify.\n')
  console.log('   Direct links (replace YOUR_PROJECT_ID):')
  console.log(`   About:   https://YOUR_PROJECT_ID.sanity.studio/studio/aboutPage`)
  console.log(`   Contact: https://YOUR_PROJECT_ID.sanity.studio/studio/contactPage`)
  console.log(`   Map:     https://YOUR_PROJECT_ID.sanity.studio/studio/mapCheckPage`)
  console.log('')
}

seed().catch((err) => {
  console.error('Fatal:', err)
  process.exit(1)
})
