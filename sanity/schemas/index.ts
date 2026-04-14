// ─────────────────────────────────────────────────────────────────────────────
// CiCon Marketing – Sanity Schema
//
// SETUP INSTRUCTIONS:
//   1. In your Sanity Studio project (created with `npm create sanity@latest`),
//      open the file: schemas/index.ts  (or schemaTypes/index.ts)
//   2. Replace the entire contents with THIS file.
//   3. Run `npx sanity dev` to start Sanity Studio.
//   4. Go to "Homepage" in the Studio sidebar.
//   5. Click "+ Create" to create the homepage document.
//      All fields will be pre-filled with the CiCon content.
//   6. Click "Publish". Done!
// ─────────────────────────────────────────────────────────────────────────────

import { defineType, defineField, defineArrayMember } from 'sanity';

// ── Shared sub-types ──────────────────────────────────────────────────────────

const statItem = defineArrayMember({
  type: 'object',
  name: 'statItem',
  title: 'Stat',
  fields: [
    defineField({ name: 'value', title: 'Value (e.g. "250+")', type: 'string' }),
    defineField({ name: 'label', title: 'Label (e.g. "Projects Completed")', type: 'string' }),
  ],
  preview: {
    select: { title: 'value', subtitle: 'label' },
  },
});

const serviceItem = defineArrayMember({
  type: 'object',
  name: 'serviceItem',
  title: 'Service',
  fields: [
    defineField({ name: 'title', title: 'Service Title', type: 'string' }),
    defineField({ name: 'description', title: 'Short Description', type: 'text', rows: 3 }),
    defineField({
      name: 'icon',
      title: 'Icon Key',
      type: 'string',
      description: 'Use one of: megaphone, search, tooth, social, code, crm, map, video',
      options: {
        list: [
          { title: '📢 Megaphone (Paid Ads)',    value: 'megaphone' },
          { title: '🔍 Search (SEO)',             value: 'search' },
          { title: '🦷 Tooth (Dental)',           value: 'tooth' },
          { title: '💬 Social (Social Media)',    value: 'social' },
          { title: '</> Code (Web Dev)',           value: 'code' },
          { title: '👥 CRM',                      value: 'crm' },
          { title: '📍 Map (Directories)',        value: 'map' },
          { title: '🎥 Video (Media)',            value: 'video' },
        ],
      },
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'description' },
  },
});

const industryItem = defineArrayMember({
  type: 'object',
  name: 'industryItem',
  title: 'Industry',
  fields: [
    defineField({ name: 'title', title: 'Industry Name', type: 'string' }),
    defineField({ name: 'description', title: 'Short Description', type: 'text', rows: 2 }),
    defineField({
      name: 'icon',
      title: 'Icon Key',
      type: 'string',
      options: {
        list: [
          { title: '🦷 Tooth', value: 'tooth' },
          { title: '🏠 Home', value: 'home' },
          { title: '🛍️ Store', value: 'store' },
          { title: '💼 Briefcase', value: 'briefcase' },
        ],
      },
    }),
  ],
  preview: { select: { title: 'title' } },
});

const stepItem = defineArrayMember({
  type: 'object',
  name: 'stepItem',
  title: 'Step',
  fields: [
    defineField({ name: 'stepNumber', title: 'Step Number (e.g. "01")', type: 'string' }),
    defineField({ name: 'title', title: 'Step Title', type: 'string' }),
    defineField({ name: 'description', title: 'Step Description', type: 'text', rows: 4 }),
  ],
  preview: {
    select: { title: 'stepNumber', subtitle: 'title' },
    prepare({ title, subtitle }: { title: string; subtitle: string }) {
      return { title: `Step ${title}: ${subtitle}` };
    },
  },
});

const problemItem = defineArrayMember({
  type: 'object',
  name: 'problemItem',
  title: 'Problem',
  fields: [
    defineField({ name: 'problem', title: 'Problem Statement', type: 'string' }),
    defineField({ name: 'solution', title: 'Our Solution', type: 'text', rows: 3 }),
    defineField({
      name: 'icon',
      title: 'Icon Key',
      type: 'string',
      options: {
        list: [
          { title: '💸 Money (Ad Spend)',        value: 'money' },
          { title: '📊 Chart (Analytics)',       value: 'chart' },
          { title: '⚡ Lightning (Competition)', value: 'boxing' },
          { title: '🌐 Web (Website)',           value: 'web' },
          { title: '📈 Trend (Lead Flow)',       value: 'trend' },
          { title: '🕐 Clock (Time)',            value: 'clock' },
        ],
      },
    }),
  ],
  preview: { select: { title: 'problem' } },
});

// ── Homepage document type ────────────────────────────────────────────────────

const homepage = defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  icon: () => '🏠',
  fields: [

    // ── HERO ─────────────────────────────────────────────────────────────────
    defineField({
      name: 'hero',
      title: '① Hero Section',
      type: 'object',
      fields: [
        defineField({
          name: 'headline',
          title: 'Main Headline',
          type: 'string',
          validation: r => r.required().max(100),
          initialValue: 'Boutique Digital Marketing Agency in Richmond Hill',
        }),
        defineField({
          name: 'subheadline',
          title: 'Subheadline',
          type: 'text',
          rows: 3,
          initialValue: 'CiCon Marketing is a boutique digital marketing agency delivering measurable growth across the GTA—turning ad spend into real leads, calls, and customers.',
        }),
        defineField({
          name: 'ctaText',
          title: 'CTA Button Text',
          type: 'string',
          initialValue: 'Schedule a Strategy Call',
        }),
        defineField({
          name: 'ctaLink',
          title: 'CTA Button URL',
          type: 'string',
          initialValue: '/book-a-strategy-call-with-cicon-marketing/',
        }),
      ],
    }),

    // ── WHY CICON ─────────────────────────────────────────────────────────────
    defineField({
      name: 'whyCicon',
      title: '② Why CiCon Section',
      type: 'object',
      fields: [
        defineField({
          name: 'headline',
          title: 'Section Headline',
          type: 'string',
          initialValue: 'Why Businesses in the GTA Trust CiCon Marketing',
        }),
        defineField({
          name: 'stats',
          title: 'Stats (3 recommended)',
          type: 'array',
          of: [statItem],
          initialValue: [
            { _key: 'stat1', value: '250+', label: 'Projects Completed' },
            { _key: 'stat2', value: '100+', label: 'Happy Clients' },
            { _key: 'stat3', value: '14+',  label: 'Years of Experience' },
          ],
        }),
        defineField({
          name: 'description',
          title: 'Description Paragraph',
          type: 'text',
          rows: 4,
          initialValue: 'For over 14 years, CiCon Marketing has helped local businesses, dental clinics, home improvement contractors, and service providers across the GTA grow their customer base. We combine data-driven strategy with creative execution—delivering real, measurable results that matter to your bottom line.',
        }),
      ],
    }),

    // ── SERVICES ──────────────────────────────────────────────────────────────
    defineField({
      name: 'services',
      title: '③ Services Section',
      type: 'object',
      fields: [
        defineField({
          name: 'headline',
          title: 'Section Headline',
          type: 'string',
          initialValue: 'What We Do',
        }),
        defineField({
          name: 'items',
          title: 'Service Cards',
          type: 'array',
          of: [serviceItem],
          initialValue: [
            { _key: 's1', title: 'Paid Advertising', description: 'Drive targeted traffic and leads with expertly managed Google Ads, Meta Ads, Bing Ads, and Pinterest Ads campaigns—every dollar optimized for your ROI.', icon: 'megaphone' },
            { _key: 's2', title: 'AI SEO & Traditional SEO', description: 'Dominate search rankings with our blend of AI-powered optimization and proven traditional SEO strategies that drive long-term organic growth.', icon: 'search' },
            { _key: 's3', title: 'Specialized Dental Marketing', description: 'Purpose-built marketing for dental practices—attracting new patients, filling appointment books, and growing your practice profitably.', icon: 'tooth' },
            { _key: 's4', title: 'Social Media Marketing', description: 'Build brand awareness, engage your community, and convert followers into customers with strategic social media management and content creation.', icon: 'social' },
            { _key: 's5', title: 'Website Development', description: 'High-converting, fast-loading websites built for performance—designed to turn visitors into leads and reflect your brand at its best.', icon: 'code' },
            { _key: 's6', title: 'CRM & Customer Relationship Management', description: 'Streamline your sales pipeline, automate follow-ups, and never let a lead slip through the cracks with smart CRM setup and management.', icon: 'crm' },
            { _key: 's7', title: 'Online Directory Listings', description: 'Get found everywhere your customers search—Google Business Profile, Yelp, and dozens of high-traffic directories, fully optimized for visibility.', icon: 'map' },
            { _key: 's8', title: 'Media Production', description: 'Tell your brand story with professional brand videos, commercial photo shoots, and creative content that stops the scroll and drives action.', icon: 'video' },
          ],
        }),
      ],
    }),

    // ── WHO WE SERVE ──────────────────────────────────────────────────────────
    defineField({
      name: 'whoWeServe',
      title: '④ Who We Serve Section',
      type: 'object',
      fields: [
        defineField({ name: 'headline', type: 'string', title: 'Section Headline', initialValue: 'Who We Serve' }),
        defineField({ name: 'subheadline', type: 'string', title: 'Subheadline', initialValue: 'We partner with growth-minded businesses across the GTA who are serious about results.' }),
        defineField({
          name: 'industries',
          title: 'Industry Cards',
          type: 'array',
          of: [industryItem],
          initialValue: [
            { _key: 'i1', title: 'Dental Clinics', description: 'From general dentistry to orthodontics and implant clinics—we fill schedules and grow practices with proven patient acquisition strategies.', icon: 'tooth' },
            { _key: 'i2', title: 'Home Improvement & Trades', description: 'Roofers, HVAC, plumbers, landscapers—we generate steady, qualified leads year-round so your crews stay busy.', icon: 'home' },
            { _key: 'i3', title: 'Showrooms & Retailers', description: 'Kitchens, flooring, furniture, and specialty retail—we drive foot traffic, online inquiries, and walk-in consultations.', icon: 'store' },
            { _key: 'i4', title: 'B2B Service Providers', description: 'Professional services, consultants, and B2B companies looking to generate high-quality leads and grow their client base.', icon: 'briefcase' },
          ],
        }),
      ],
    }),

    // ── HOW IT WORKS ──────────────────────────────────────────────────────────
    defineField({
      name: 'howItWorks',
      title: '⑤ How It Works Section',
      type: 'object',
      fields: [
        defineField({ name: 'headline', type: 'string', title: 'Section Headline', initialValue: 'How It Works' }),
        defineField({ name: 'subheadline', type: 'string', title: 'Subheadline', initialValue: 'A clear, proven process designed to deliver results from day one.' }),
        defineField({
          name: 'steps',
          title: 'Process Steps',
          type: 'array',
          of: [stepItem],
          initialValue: [
            { _key: 'step1', stepNumber: '01', title: 'Discovery & Audit', description: "We dive deep into your business, competitors, and current marketing performance to understand exactly where you are and where you need to go. No guesswork—just data." },
            { _key: 'step2', stepNumber: '02', title: 'Strategy & Roadmap', description: "We build a custom digital marketing strategy tailored to your goals, budget, and market. You'll know exactly what we're doing, why we're doing it, and what results to expect." },
            { _key: 'step3', stepNumber: '03', title: 'Implementation & Creative', description: "Our team executes your strategy with precision—launching campaigns, building assets, and creating content that represents your brand and converts your ideal customers." },
            { _key: 'step4', stepNumber: '04', title: 'Optimize, Report & Scale', description: "We monitor, test, and refine continuously. You receive clear, jargon-free reports showing real results—and we use that data to scale what works and cut what doesn't." },
          ],
        }),
      ],
    }),

    // ── PROBLEMS WE SOLVE ─────────────────────────────────────────────────────
    defineField({
      name: 'problemsSolved',
      title: '⑥ Problems We Solve Section',
      type: 'object',
      fields: [
        defineField({ name: 'headline', type: 'string', title: 'Section Headline', initialValue: 'Problems We Solve' }),
        defineField({ name: 'subheadline', type: 'string', title: 'Subheadline', initialValue: 'Sound familiar? We solve these every single day.' }),
        defineField({
          name: 'problems',
          title: 'Problem–Solution Cards',
          type: 'array',
          of: [problemItem],
          initialValue: [
            { _key: 'p1', problem: 'Wasting Ad Spend With Nothing to Show', solution: "Stop burning budget on campaigns that don't convert. We audit your accounts, eliminate waste, and rebuild around what actually drives leads and revenue.", icon: 'money' },
            { _key: 'p2', problem: "No Idea What's Actually Working", solution: "If you can't measure it, you can't improve it. We set up proper tracking, clean reporting, and give you a dashboard that shows exactly what's driving results.", icon: 'chart' },
            { _key: 'p3', problem: 'Getting Crushed by Bigger Competitors', solution: "You don't need a massive budget to outperform the competition. We find the gaps, target the right audiences, and use strategy to punch above your weight class.", icon: 'boxing' },
            { _key: 'p4', problem: "Website That Doesn't Convert Visitors", solution: "Traffic means nothing without conversions. We optimize your website to turn visitors into leads—improving speed, user experience, and calls to action.", icon: 'web' },
            { _key: 'p5', problem: 'Inconsistent or Unpredictable Lead Flow', solution: "Feast or famine is not a growth strategy. We build diversified, always-on marketing systems that deliver a consistent stream of qualified leads every month.", icon: 'trend' },
            { _key: 'p6', problem: 'No Time to Manage Your Own Marketing', solution: "You're busy running your business. Hand your marketing to a team that treats your budget like their own—so you can focus on delivering great work to your clients.", icon: 'clock' },
          ],
        }),
      ],
    }),

    // ── READY TO GROW ─────────────────────────────────────────────────────────
    defineField({
      name: 'readyToGrow',
      title: '⑦ Ready to Grow CTA Section',
      type: 'object',
      fields: [
        defineField({ name: 'headline', type: 'string', title: 'Headline', initialValue: 'Ready to Grow Your Business?' }),
        defineField({ name: 'subheadline', type: 'text', title: 'Subheadline', rows: 3, initialValue: "Let's build a marketing strategy that actually works for your business. Book a free strategy call and see exactly how CiCon Marketing can help you grow." }),
        defineField({ name: 'ctaText', type: 'string', title: 'CTA Button Text', initialValue: 'Schedule a Free Strategy Call' }),
        defineField({ name: 'ctaLink', type: 'string', title: 'CTA Button URL', initialValue: '/book-a-strategy-call-with-cicon-marketing/' }),
      ],
    }),

    // ── CONTACT ───────────────────────────────────────────────────────────────
    defineField({
      name: 'contact',
      title: '⑧ Contact Section',
      type: 'object',
      fields: [
        defineField({ name: 'headline', type: 'string', title: 'Section Headline', initialValue: 'Get In Touch' }),
        defineField({ name: 'email', type: 'string', title: 'Email Address', initialValue: 'hello@cicon.ca' }),
        defineField({ name: 'phone', type: 'string', title: 'Phone Number', initialValue: '+1 (905) 884-5060' }),
        defineField({ name: 'address', type: 'string', title: 'Location / Address', initialValue: 'Richmond Hill, ON, Canada' }),
      ],
    }),

  ],

  preview: {
    select: { title: 'hero.headline' },
    prepare({ title }: { title?: string }) {
      return { title: title ?? 'Homepage', media: () => '🏠' };
    },
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// Export – paste this into your Sanity project's schemas/index.ts
// ─────────────────────────────────────────────────────────────────────────────
export const schemaTypes = [homepage];
