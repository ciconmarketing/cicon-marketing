import type { HomepageData } from './types';

export const defaultHomepageData: HomepageData = {
  hero: {
    headline: "Your marketing isn't broken.\nYour lead system is leaking.",
    subheadline:
      'CiCon Marketing helps GTA businesses fix the hidden gaps between ads, landing pages, calls, CRM, and reporting — so more traffic turns into real customers.',
    ctaText: 'Give Me a Local Preview',
    ctaLink: '/book-a-strategy-call-with-cicon-marketing/',
  },

  whyCicon: {
    headline: 'Why Businesses in the GTA Trust CiCon Marketing',
    stats: [
      { value: '250+', label: 'Projects Completed' },
      { value: '100+', label: 'Happy Clients' },
      { value: '15+',  label: 'Years of Experience' },
      { value: '40%',  label: 'More Dental Leads' },
    ],
    description:
      'For over 15 years, CiCon Marketing has helped local businesses, dental clinics, home improvement contractors, and service providers across the GTA grow their customer base. We combine data-driven strategy with creative execution—delivering real, measurable results that matter to your bottom line.',
  },

  services: {
    headline: 'What We Do',
    items: [
      {
        title: 'Paid Advertising',
        description:
          'Drive targeted traffic and leads with expertly managed Google Ads, Meta Ads, Bing Ads, and Pinterest Ads campaigns—every dollar optimized for your ROI.',
        icon: 'megaphone',
      },
      {
        title: 'AI SEO & Traditional SEO',
        description:
          'Dominate search rankings with our blend of AI-powered optimization and proven traditional SEO strategies that drive long-term organic growth.',
        icon: 'search',
      },
      {
        title: 'Specialized Dental Marketing',
        description:
          'Purpose-built marketing for dental practices—attracting new patients, filling appointment books, and growing your practice profitably.',
        icon: 'tooth',
      },
      {
        title: 'Social Media Marketing',
        description:
          'Build brand awareness, engage your community, and convert followers into customers with strategic social media management and content creation.',
        icon: 'social',
      },
      {
        title: 'Website Development',
        description:
          'High-converting, fast-loading websites built for performance—designed to turn visitors into leads and reflect your brand at its best.',
        icon: 'code',
      },
      {
        title: 'CRM & Customer Relationship Management',
        description:
          'Streamline your sales pipeline, automate follow-ups, and never let a lead slip through the cracks with smart CRM setup and management.',
        icon: 'crm',
      },
      {
        title: 'Online Directory Listings',
        description:
          'Get found everywhere your customers search—Google Business Profile, Yelp, and dozens of high-traffic directories, fully optimized for visibility.',
        icon: 'map',
      },
      {
        title: 'Media Production',
        description:
          'Tell your brand story with professional brand videos, commercial photo shoots, and creative content that stops the scroll and drives action.',
        icon: 'video',
      },
    ],
  },

  whoWeServe: {
    headline: 'Who We Serve',
    subheadline:
      'We partner with growth-minded businesses across the GTA who are serious about results.',
    industries: [
      {
        title: 'Dental Clinics',
        description:
          'From general dentistry to orthodontics and implant clinics—we fill schedules and grow practices with proven patient acquisition strategies.',
        icon: 'tooth',
      },
      {
        title: 'Home Improvement & Trades',
        description:
          'Roofers, HVAC, plumbers, landscapers—we generate steady, qualified leads year-round so your crews stay busy.',
        icon: 'home',
      },
      {
        title: 'Showrooms & Retailers',
        description:
          'Kitchens, flooring, furniture, and specialty retail—we drive foot traffic, online inquiries, and walk-in consultations.',
        icon: 'store',
      },
      {
        title: 'B2B Service Providers',
        description:
          'Professional services, consultants, and B2B companies looking to generate high-quality leads and grow their client base.',
        icon: 'briefcase',
      },
    ],
  },

  howItWorks: {
    headline: 'How It Works',
    subheadline: 'A clear, proven process designed to deliver results from day one.',
    steps: [
      {
        stepNumber: '01',
        title: 'Discovery & Audit',
        description:
          "We dive deep into your business, competitors, and current marketing performance to understand exactly where you are and where you need to go. No guesswork—just data.",
      },
      {
        stepNumber: '02',
        title: 'Strategy & Roadmap',
        description:
          "We build a custom digital marketing strategy tailored to your goals, budget, and market. You'll know exactly what we're doing, why we're doing it, and what results to expect.",
      },
      {
        stepNumber: '03',
        title: 'Implementation & Creative',
        description:
          "Our team executes your strategy with precision—launching campaigns, building assets, and creating content that represents your brand and converts your ideal customers.",
      },
      {
        stepNumber: '04',
        title: 'Optimize, Report & Scale',
        description:
          "We monitor, test, and refine continuously. You receive clear, jargon-free reports showing real results—and we use that data to scale what works and cut what doesn't.",
      },
    ],
  },

  problemsSolved: {
    headline: 'Problems We Solve',
    subheadline: 'Sound familiar? We solve these every single day.',
    problems: [
      {
        problem: 'Wasting Ad Spend With Nothing to Show',
        solution:
          "Stop burning budget on campaigns that don't convert. We audit your accounts, eliminate waste, and rebuild around what actually drives leads and revenue.",
        icon: 'money',
      },
      {
        problem: 'No Idea What\'s Actually Working',
        solution:
          "If you can't measure it, you can't improve it. We set up proper tracking, clean reporting, and give you a dashboard that shows exactly what's driving results.",
        icon: 'chart',
      },
      {
        problem: 'Getting Crushed by Bigger Competitors',
        solution:
          "You don't need a massive budget to outperform the competition. We find the gaps, target the right audiences, and use strategy to punch above your weight class.",
        icon: 'boxing',
      },
      {
        problem: 'Website That Doesn\'t Convert Visitors',
        solution:
          "Traffic means nothing without conversions. We optimize your website to turn visitors into leads—improving speed, user experience, and calls to action.",
        icon: 'web',
      },
      {
        problem: 'Inconsistent or Unpredictable Lead Flow',
        solution:
          "Feast or famine is not a growth strategy. We build diversified, always-on marketing systems that deliver a consistent stream of qualified leads every month.",
        icon: 'trend',
      },
      {
        problem: 'No Time to Manage Your Own Marketing',
        solution:
          "You're busy running your business. Hand your marketing to a team that treats your budget like their own—so you can focus on delivering great work to your clients.",
        icon: 'clock',
      },
    ],
  },

  readyToGrow: {
    headline: 'Ready to Grow Your Business?',
    subheadline:
      "Let's build a marketing strategy that actually works for your business. Book a free strategy call and see exactly how CiCon Marketing can help you grow.",
    ctaText: 'Schedule a Free Strategy Call',
    ctaLink: '/book-a-strategy-call-with-cicon-marketing/',
  },

  contact: {
    headline: 'Get In Touch',
    email: 'hello@cicon.ca',
    phone: '+1 (905) 884-5060',
    address: 'Richmond Hill, ON, Canada',
  },
};
