/**
 * Seed script: Marketing Technology Setup service page
 * Run from project root: node scripts/seed-martech-setup.mjs
 */
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: '26ol0sqj',
  dataset: 'cicon-marketing',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
})

const doc = {
  _type: 'servicePage',
  title: 'Marketing Technology Setup',
  slug: { _type: 'slug', current: 'marketing-technology-setup' },
  serviceType: 'marketing-technology-setup',
  status: 'needs-review',
  needsRewrite: false,
  rewriteNotes: "Built from scratch per skill conventions. SEO-optimized for 'marketing technology setup Richmond Hill / Toronto / GTA'. CRM capability deliberately framed as 'CRM Data Hookups' to differentiate from the standalone CRM Integration service page. MJ to review brand voice tightness then flip to ready-for-review.",

  // SEO
  metaTitle: 'Marketing Technology Setup Richmond Hill | CiCon Marketing',
  metaDescription: 'GA4, GTM, pixel tracking, and CRM data integration for GTA businesses. Get the marketing measurement infrastructure that turns your data into decisions.',
  canonical: 'https://cicon.ca/marketing-services/marketing-technology-setup/',

  // Hero
  heroBadge: 'For GTA Service Businesses',
  heroHeadline: "Your marketing tools don't talk to each other. We fix that.",
  heroSubheadline: 'GA4, GTM, conversion tracking, and CRM data integration for GTA businesses ready to stop flying blind.',
  heroDescription: "Most businesses run 5-10 marketing tools that never share data. The result: campaigns you can't attribute, leads you can't track, and decisions made on guesswork. We build the measurement infrastructure that connects every tool, tracks every action, and reports what actually drives revenue.",
  heroStats: [
    { _key: 'stat1', value: '10+',             label: 'Tools we integrate' },
    { _key: 'stat2', value: 'Full attribution', label: 'Lead-to-revenue tracking' },
    { _key: 'stat3', value: 'GA4 + GTM',       label: 'Certified specialist' },
    { _key: 'stat4', value: '30-day',           label: 'Standard setup window' },
  ],

  // PAA
  paaQuestions: [
    {
      _key: 'paa1',
      question: 'How much does marketing technology setup cost in the GTA?',
      answer: 'A standard MarTech setup engagement at CiCon starts at $3,500 for foundational tracking (GA4, GTM, conversion tracking, basic CRM hookups). Full-stack integration with custom reporting dashboards runs $6,500-$12,000 depending on tool count and complexity.',
    },
    {
      _key: 'paa2',
      question: "What's the difference between marketing technology setup and CRM integration?",
      answer: 'MarTech setup is the measurement layer — tracking, analytics, attribution, and data flow between tools. CRM integration is the CRM platform itself plus the automation workflows inside it. Most businesses need both, but they\'re separate services solving different problems.',
    },
    {
      _key: 'paa3',
      question: 'How long does GA4 and GTM setup take?',
      answer: 'Foundational GA4 + GTM setup with conversion tracking typically takes 2-3 weeks. Full attribution setup connecting GA4, ad platforms, CRM, and call tracking takes 4-6 weeks. Timelines depend on how many tools need to be integrated and access permissions.',
    },
    {
      _key: 'paa4',
      question: 'Do I really need server-side tracking in 2026?',
      answer: "Yes, if you're running paid ads or doing serious conversion tracking. iOS privacy changes and third-party cookie deprecation have made client-side tracking unreliable — typically 20-40% data loss. Server-side tracking via GA4 and tools like Stape recovers most of that data and is the 2026 standard.",
    },
  ],

  // Anti-pitch
  antiPitchHeadline: "This isn't for you if...",
  antiPitchItems: [
    {
      _key: 'ap1',
      disqualifier: 'You want a one-time setup with no ongoing maintenance.',
      explanation: "MarTech stacks break when tools update, integrations expire, or new tracking requirements emerge. We can do one-time setups, but expect to revisit them every 6-12 months. The 'set it and forget it' marketing stack is a myth.",
    },
    {
      _key: 'ap2',
      disqualifier: "You're not willing to give access to your accounts.",
      explanation: "We need admin access to your ad platforms, GA4, GTM, CRM, and any tools we're integrating. If access is restricted or shared via 'I'll log in and show you,' the work doesn't get done. Real measurement requires real access.",
    },
    {
      _key: 'ap3',
      disqualifier: 'You want pretty dashboards before fixing data quality.',
      explanation: "Most agencies sell dashboards as the deliverable. We sell working data first, dashboards second. A beautiful dashboard built on broken tracking is worse than no dashboard — it makes wrong decisions look credible.",
    },
  ],

  // Capabilities
  capabilitiesHeadline: 'What we actually do',
  capabilitiesIntro: "Marketing technology is the plumbing under everything else. When it's right, every campaign is measurable. When it's wrong, every decision is a guess. Here's the stack we build for GTA businesses.",
  capabilities: [
    {
      _key: 'cap1',
      title: 'GA4 & GTM Setup',
      definition: 'GA4 and GTM setup is the foundational analytics implementation that captures user behavior, conversions, and revenue events on your website and apps.',
      description: "We rebuild your Google Analytics 4 property from the ground up — enhanced measurement, custom events, conversion tracking, audience definitions, and Google Tag Manager containers structured for maintainability. Every event you'll ever need to optimize against, tracked from day one.",
      icon: 'bar-chart-3',
    },
    {
      _key: 'cap2',
      title: 'CRM Data Hookups',
      definition: 'CRM data hookups are the integrations that connect your CRM into your analytics, ad platforms, and reporting layer — making every lead attributable end-to-end.',
      description: "We connect your existing CRM (GoHighLevel, HubSpot, Salesforce, Pipedrive, or any platform with an API) into GA4, Meta, Google Ads, and your reporting dashboards. Result: you can trace every closed customer back to the exact ad, keyword, or campaign that drove them. (Note: if you need full CRM platform setup or automation workflows, see our CRM Integration service.)",
      icon: 'git-merge',
    },
    {
      _key: 'cap3',
      title: 'Pixel & Conversion Tracking',
      definition: 'Pixel and conversion tracking is the implementation of ad platform tracking pixels (Meta, Google Ads, LinkedIn, TikTok) and server-side conversion APIs that feed conversion data back to ad platforms for optimization.',
      description: 'We deploy Meta Pixel, Google Ads conversion tracking, LinkedIn Insight Tag, and TikTok Pixel — all configured for offline conversion uploads and server-side tracking where supported. Includes Stape or equivalent server-side container setup to recover the 20-40% of data lost to client-side tracking failures.',
      icon: 'target',
    },
    {
      _key: 'cap4',
      title: 'Reporting Dashboards',
      definition: 'Marketing reporting dashboards are unified views that pull data from every channel and tool into a single interface showing what\'s working, what\'s not, and where to invest next.',
      description: "We build custom dashboards in Looker Studio (free) or Whatagraph/AgencyAnalytics (paid) that combine GA4, ad platforms, CRM, and call tracking into one view. Updated daily, segmented by channel and campaign, and built around the 4-5 metrics that actually drive your business — not the 47 vanity metrics most agencies report.",
      icon: 'layout-dashboard',
    },
    {
      _key: 'cap5',
      title: 'Tool Stack Architecture',
      definition: 'Tool stack architecture is the strategic decision of which marketing tools your business actually needs, how they should connect, and which ones to remove.',
      description: "We audit your current tool stack — most businesses pay for 3-5 tools they don't need and lack 2-3 they do. We recommend a streamlined stack matched to your business model, design the data flow between tools, and document the architecture so future agencies or in-house teams can maintain it without rebuilding everything.",
      icon: 'layers',
    },
  ],

  // Process — default initialValue from schema
  processSteps: [
    { _key: 'step1', number: 1, label: 'Discovery',  description: 'Audit your current state, identify gaps, define KPIs' },
    { _key: 'step2', number: 2, label: 'Strategy',   description: 'Build the plan — channels, budget, creative direction' },
    { _key: 'step3', number: 3, label: 'Execute',    description: 'Launch campaigns, ship assets, track every action' },
    { _key: 'step4', number: 4, label: 'Report',     description: 'Monthly reviews with the numbers that matter' },
  ],

  // E-E-A-T
  eeatHeadline: 'Senior strategist on every engagement',
  eeatBody: "Every MarTech engagement at CiCon is run by Majid Behzad, our founder and senior strategist with 14+ years implementing marketing measurement for GTA businesses. We've built tracking infrastructure for 250+ businesses across paid search, organic, and direct traffic — and we know which integrations break under load versus which ones scale.",
  eeatStats: [
    { _key: 'eeat1', value: '14+',   label: 'Years building MarTech stacks' },
    { _key: 'eeat2', value: '250+',  label: 'GTA tracking implementations' },
    { _key: 'eeat3', value: 'GA4 + GTM', label: 'Certified specialist' },
  ],

  // FAQs
  faqs: [
    {
      _key: 'faq1',
      question: 'Which marketing tools do you specialize in?',
      answer: 'Our core stack: Google Analytics 4, Google Tag Manager, Google Ads, Meta Ads, LinkedIn Ads, GoHighLevel, HubSpot, Salesforce, Looker Studio, Stape (server-side), Hotjar, Microsoft Clarity, and CallRail. We integrate beyond this list when needed but stay deep in the tools that handle 90% of GTA marketing workflows.',
    },
    {
      _key: 'faq2',
      question: 'Can you migrate me from Universal Analytics to GA4?',
      answer: "Universal Analytics sunset in July 2023. If you're still running it, you've already lost 2+ years of data. We can build GA4 from scratch, configure historical comparisons where possible, and document what data was lost in the transition. Start the migration now — every month of delay is more data gone.",
    },
    {
      _key: 'faq3',
      question: 'How do you handle server-side tracking and iOS privacy changes?',
      answer: 'We deploy server-side Google Tag Manager containers (typically via Stape or Google Cloud), implement Conversion API for Meta and Google Ads, and use first-party data wherever third-party cookies fail. Result: 80-95% data accuracy versus the 60-80% most client-side-only setups achieve in 2026.',
    },
    {
      _key: 'faq4',
      question: 'Do you offer ongoing MarTech maintenance or just one-time setups?',
      answer: "Both. One-time setups start at $3,500. Ongoing maintenance (monthly tracking audits, integration fixes when tools update, new event tracking as campaigns evolve) runs $1,200-$2,500/month. Most clients start with setup and add maintenance after 60 days when they see how much breaks.",
    },
    {
      _key: 'faq5',
      question: 'Will I be locked into expensive paid tools?',
      answer: "No. Our default stack is built around free tools (GA4, GTM, Looker Studio) and paid tools you'd use anyway (your CRM, your ad platforms). We only recommend paid measurement tools when the free alternatives genuinely don't solve the problem — typically Stape for server-side ($25-100/month) or Whatagraph for client reporting ($199+/month).",
    },
    {
      _key: 'faq6',
      question: 'What happens if my tools change after you set everything up?',
      answer: "Marketing tools change constantly — platforms update APIs, tracking pixels evolve, integrations break. Our documentation and architecture is built to be maintainable by future teams (us or someone else). If you switch agencies, you don't have to rebuild the stack from scratch. That's a deliberate design choice.",
    },
  ],

  // Schema.org
  serviceTypeSchema: 'MarketingTechnologyService',
  areaServed: [
    'Richmond Hill',
    'Toronto',
    'Markham',
    'Vaughan',
    'North York',
    'Aurora',
    'Newmarket',
    'Greater Toronto Area',
  ],
}

async function main() {
  // relatedServices references
  const CRM_DOC_ID = 'a2f1c0ec-77c4-42fc-ab36-5a6a7b545d2f'
  const PAID_ADS_DOC_ID = '7d012bda-41ab-4dfa-8601-0cc6f27878fb'

  const docWithRefs = {
    ...doc,
    relatedServices: [
      { _key: 'rs1', _type: 'reference', _ref: CRM_DOC_ID },
      { _key: 'rs2', _type: 'reference', _ref: PAID_ADS_DOC_ID },
    ],
  }

  console.log('Creating Marketing Technology Setup servicePage document...')
  const result = await client.create(docWithRefs)
  console.log('Created draft with ID:', result._id)

  // Publish: patch the published doc
  const docId = result._id.replace('drafts.', '')
  await client
    .patch(`drafts.${docId}`)
    .set({ _id: docId })
    .commit()
    .catch(() => {})

  // Use mutations API to publish
  const tx = client.transaction()
  tx.createOrReplace({ ...docWithRefs, _id: docId })
  await tx.commit()
  console.log('Published document ID:', docId)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
