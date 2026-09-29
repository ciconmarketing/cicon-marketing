# Staged Sanity content changes — service pricing (2026-09-28)

Generated from `sanity-patches.json`. Each row shows the published text and the staged replacement.


## servicesHub:112974c8-fc1b-4f52-b063-441d98183ef7

**`heroDescription`**

- Before: CiCon is a boutique digital marketing agency serving GTA businesses and dental clinics. We run 8 interconnected services — from paid ads and SEO to video production and CRM — all managed by the same senior strategist. No account managers. No rotating contacts.
- After: CiCon is a boutique digital marketing agency serving GTA businesses and dental clinics. We run 14 interconnected services — from paid ads and SEO to video production and CRM — all managed by the same senior strategist. No account managers. No rotating contacts.

**`seoDescription`**

- Before: Paid ads, SEO, social, video, and CRM — 8 interconnected services for GTA businesses, all run by one senior strategist. No account managers.
- After: Paid ads, SEO, social, video, CRM and more: 14 interconnected services for GTA businesses, all run by one senior strategist. No account managers.

**`heroStats[_key=="hs1"].value`**

- Before: 8
- After: 14

**`antiPitchItems[_key=="ap3"]`**

- Before: `{"_key": "ap3", "_type": "antiPitchItem", "disqualifier": "Your budget is under $1,500/month all-in.", "explanation": "Below that threshold, fees eat the spend. We can’t move the needle responsibly at that level."}`
- After: _(removed)_


## contactPage:contact-us

**`faqs[_key=="94da8cf5f7c5"].answer`**

- Before: Our smallest engagements start around $1,500/month for focused work like Google Business Profile management or local SEO. Full-service builds — paid ads, SEO, content, creative — typically start at $3,000–$5,000/month. We’d rather under-promise than oversell a retainer you don’t need yet.
- After: Our lowest starting prices are $499 CAD per month (CRM Integration) and $500 CAD one-time (Marketing Consultant). Every service has its own published starting price on our services page, and final pricing depends on the agreed scope. Ad spend is always excluded from our service fees.


## servicePage:dental-seo

**`pricingHeadline`**

- Before: Transparent pricing for dental SEO
- After: _(removed)_

**`pricingIntro`**

- Before: We publish our pricing because clinic owners comparing agencies deserve clarity, not "contact us for a quote".
- After: _(removed)_

**`pricingNote`**

- Before: No setup fees. No cancellation fees. No hidden costs.
- After: _(removed)_

**`pricingTiers`**

- Before: `[{"_key": "tier1", "_type": "pricingTier", "audience": "Single-location practices", "cadence": "/month", "includes": ["Google Business Profile optimization", "Technical SEO audit and fixes", "NAP citation cleanup", "On-page SEO for core service pages", "Review collection strategy", "Monthly reporting"], "name": "Starter", "price": "$1,500"}, {"_key": "tier2", "_type": "pricingTier", "audience": "Multi-location or competitive markets", "cadence": "/month", "includes": ["Everything in Starter", "Location-specific service pages", "CDCP content creation", "Content marketing and link building", "On`
- After: _(removed)_

**`faqs[_key=="faq7"].answer`**

- Before: Yes. Each location gets its own verified Google Business Profile, its own location service page, and separate citation management — with consolidated reporting so ownership sees the full picture across clinics.
- After: Yes. Each location can get its own verified Google Business Profile, its own location service page, and separate citation management — with consolidated reporting so ownership sees the full picture across clinics. We confirm which locations your plan covers in your quote.

**`paaQuestions[_key=="paa5"].answer`**

- Before: Yes. Each location gets its own verified Google Business Profile, its own service-area page and consolidated reporting so ownership sees performance across every clinic.
- After: Yes. Each location can get its own verified Google Business Profile, its own service-area page and consolidated reporting so ownership sees performance across every clinic. Your quote confirms which locations the plan covers.


## servicePage:dental-marketing-services

**`heroDescription`**

- Before: We run full-service digital marketing for GTA dental clinics — Google Ads, Local SEO, social media, and patient testimonial videos. Every campaign is built around your clinic's growth goals and tracked to booked appointments, not impressions.
- After: We run digital marketing for GTA dental clinics across Google Ads, Local SEO, social media, and patient testimonial videos, scoped to what your clinic needs. Every campaign is built around your clinic's growth goals and tracked to booked appointments, not impressions.

**`antiPitchItems[_key=="ap3"].disqualifier`**

- Before: Your all-in budget is under $1,500/month.
- After: You want one fee that also covers your ad budget.

**`antiPitchItems[_key=="ap3"].explanation`**

- Before: Below that threshold, fees eat the ad spend. We can't move the needle responsibly at that level.
- After: Our retainer covers the marketing services agreed for your clinic. Your advertising budget is separate, and we confirm the channels, work and ad budget in your quote.

**`faqs[_key=="faq1"]`**

- Before: `{"_key": "faq1", "_type": "faqItem", "answer": "Our dental marketing engagements start at $1,500/month all-in — that includes strategy, management fees, and ad spend. The right budget depends on your clinic size, target procedures, and local market competitiveness. We scope every engagement on a free 30-minute call before any commitment.", "question": "How much does dental marketing cost in the GTA?"}`
- After: _(removed)_

**`paaQuestions[_key=="paa1"]`**

- Before: `{"_key": "paa1", "_type": "paaItem", "answer": "Dental marketing engagements at CiCon start at $1,500/month all-in. The right budget depends on your clinic size, local competition, and target procedures. We scope every engagement on a free 30-minute strategy call.", "question": "How much does dental marketing cost in the GTA?"}`
- After: _(removed)_

**`capabilitiesHeadline`**

- Before: Full-service dental marketing — under one roof
- After: Dental marketing channels, scoped to your clinic

**`capabilitiesIntro`**

- Before: From the first Google search to the booked appointment, we manage every channel that brings patients through your door.
- After: These are the channels we can run for your clinic, from the first Google search to the booked appointment. Your quote confirms which channels and work your monthly retainer covers, and ad spend is always separate.

**`capabilities[_key=="cap1"].description`**

- Before: We optimize site architecture, on-page content, and authority signals for 'dentist near me', 'emergency dental [city]', and CDCP-specific searches. Includes monthly content updates and technical audits.
- After: We optimize site architecture, on-page content, and authority signals for 'dentist near me', 'emergency dental [city]', and CDCP-specific searches. Can include monthly content updates and technical audits.

**`capabilities[_key=="cap5"].description`**

- Before: GBP optimization, citation building across 50+ directories, review generation strategy, and map pack ranking improvements. We also manage your review responses — professionally and promptly.
- After: GBP optimization, citation building across relevant directories, review generation strategy, and map pack ranking improvements. Review response management can be part of the scope.

**`capabilities[_key=="cap6"].description`**

- Before: Call tracking, form tracking, and CRM setup that shows you exactly which campaign, ad, and keyword produced each patient inquiry. Includes a reporting dashboard built for clinic owners.
- After: Call tracking, form tracking, and CRM setup that shows you exactly which campaign, ad, and keyword produced each patient inquiry. Can include a reporting dashboard built for clinic owners.


## servicePage:paid-advertising-services

**`antiPitchItems[_key=="ap1"].disqualifier`**

- Before: You want to set a $300/month ad budget and expect customers.
- After: You expect results without a realistic ad budget.

**`antiPitchItems[_key=="ap1"].explanation`**

- Before: Competitive GTA markets require meaningful spend. Below $1,500/month all-in, fees eat the budget and we can't move the needle responsibly.
- After: Competitive GTA markets need enough ad spend to produce useful data. Ad spend is separate from our management fee, and we agree the ad budget and management scope in your quote.

**`paaQuestions[_key=="paa1"]`**

- Before: `{"_key": "paa1", "_type": "paaItem", "answer": "CiCon's paid advertising engagements start at $1,500/month all-in (management fee + ad spend). The right budget depends on your industry, competition level, and target CPA. We scope every engagement on a free 30-minute strategy call.", "question": "How much does Google Ads management cost in the GTA?"}`
- After: _(removed)_

**`paaQuestions[_key=="paa4"].answer`**

- Before: We set up call tracking, form tracking, and CRM integration so every lead is attributed to its source campaign, ad group, and keyword. You'll see cost per lead, cost per customer, and ROAS — not just clicks and impressions.
- After: We can set up call tracking, form tracking, and CRM integration so every lead is attributed to its source campaign, ad group, and keyword. Tracking setup is scoped in your quote. You'll see cost per lead, cost per customer, and ROAS — not just clicks and impressions.

**`faqs[_key=="a7f13c1b58ab"].answer`**

- Before: We measure success using KPIs: click-through rate (CTR), conversion rate, cost per acquisition (CPA), and return on ad spend (ROAS). Every CiCon engagement includes call tracking, form tracking, and a monthly report that shows cost per lead and revenue impact — not just platform metrics.
- After: We measure success using KPIs: click-through rate (CTR), conversion rate, cost per acquisition (CPA), and return on ad spend (ROAS). Our monthly reports show cost per lead and revenue impact — not just platform metrics. Call and form tracking setup is agreed in your quote.

**`capabilitiesIntro`**

- Before: We manage paid advertising across Google and Meta — built for GTA businesses that track to revenue.
- After: We manage paid advertising across Google and Meta — built for GTA businesses that track to revenue. Google Ads and Meta Ads management each have a published starting price. LinkedIn, TikTok, Pinterest, and Microsoft Ads management is quoted separately for your scope.

**`capabilities[_key=="f6bbdd0254d7"].description`**

- Before: Sponsored posts, text ads, and message ads delivered directly to decision-makers' inboxes. Best for B2B lead generation, professional service firms, and campaigns where connecting with industry professionals is the goal.
- After: Sponsored posts, text ads, and message ads delivered directly to decision-makers' inboxes. Best for B2B lead generation, professional service firms, and campaigns where connecting with industry professionals is the goal. Management is quoted separately for your scope.

**`capabilities[_key=="6eacf7b7921e"].description`**

- Before: In-feed ads, branded hashtag challenges, and branded effects. TikTok's algorithm enables precise targeting based on user behavior and interests — effective for brand awareness, engagement, and product promotion in a creative, authentic format.
- After: In-feed ads, branded hashtag challenges, and branded effects. TikTok's algorithm enables precise targeting based on user behavior and interests — effective for brand awareness, engagement, and product promotion in a creative, authentic format. Management is quoted separately for your scope.

**`capabilities[_key=="864ccdb1a58a"].description`**

- Before: Interest, keyword, demographic, and customer list targeting. Especially effective for lifestyle, fashion, home decor, and DIY businesses looking to increase brand awareness and drive website traffic from high-intent browsers.
- After: Interest, keyword, demographic, and customer list targeting. Especially effective for lifestyle, fashion, home decor, and DIY businesses looking to increase brand awareness and drive website traffic from high-intent browsers. Management is quoted separately for your scope.

**`capabilities[_key=="e6679522931b"].description`**

- Before: Search ads, shopping ads, and audience targeting by demographics, location, and device. Integrates seamlessly with Google Ads for easy campaign import. A cost-effective complement to Google Ads that captures a unique segment of high-intent searchers.
- After: Search ads, shopping ads, and audience targeting by demographics, location, and device. Integrates seamlessly with Google Ads for easy campaign import. A cost-effective complement to Google Ads that captures a unique segment of high-intent searchers. Management is quoted separately for your scope.


## servicePage:local-seo-optimization

**`heroSubheadline`**

- Before: Google Business Profile optimization, citation building, and review management — handled.
- After: Google Business Profile management first. Citation building and review management scoped to your plan.

**`heroStats[_key=="hs2"].value`**

- Before: 50+
- After: Scoped

**`heroStats[_key=="hs2"].label`**

- Before: Citation directories covered
- After: Citation work matched to your plan

**`eeatStats[_key=="es2"]`**

- Before: `{"_key": "es2", "_type": "eeatStatItem", "label": "Citation directories covered", "value": "50+"}`
- After: _(removed)_

**`antiPitchItems[_key=="ap3"].disqualifier`**

- Before: Your budget is under $1,500/month all-in.
- After: You expect the entry plan to cover every local SEO task.

**`antiPitchItems[_key=="ap3"].explanation`**

- Before: Below that threshold, fees eat the work. We can't execute a proper Local SEO program at that level responsibly.
- After: The entry plan focuses on your Google Business Profile. Citation building, extra locations, and website page work are scoped separately in your quote.

**`capabilitiesHeadline`**

- Before: Every Local SEO signal — covered
- After: Local SEO capabilities, scoped to your business

**`capabilitiesIntro`**

- Before: Google uses dozens of signals to rank local businesses. We optimize all of them.
- After: Google uses dozens of signals to rank local businesses. Google Business Profile management is where the service starts; the wider local SEO work below is scoped to your business in your quote.

**`capabilities[_key=="cap1"].description`**

- Before: We optimize every GBP field — categories, service areas, hours, photos, Q&A, and posts. Regular weekly updates signal activity to Google's local algorithm and keep your profile competitive.
- After: We optimize every GBP field — categories, service areas, hours, photos, Q&A, and posts. Regular updates signal activity to Google's local algorithm and keep your profile competitive.

**`capabilities[_key=="cap2"].description`**

- Before: We audit your existing citations for NAP inconsistencies (a common ranking killer), then build accurate listings across 50+ directories including Yelp, Apple Business Connect, Bing Places, and industry-specific directories.
- After: We audit your existing citations for NAP inconsistencies (a common ranking killer), then build accurate listings across relevant directories, including Yelp, Apple Business Connect, Bing Places, and industry-specific directories.

**`capabilities[_key=="cap5"].description`**

- Before: We track your Maps rankings across 20+ target keywords, identify ranking blockers, and systematically improve your position through GBP authority, proximity optimization, and review velocity.
- After: We track your Maps rankings across your target keywords, identify ranking blockers, and systematically improve your position through GBP authority, proximity optimization, and review velocity.

**`faqs[_key=="faq3"].answer`**

- Before: We focus on the 20–40 most valuable local keywords for your business — typically '[service] [city]' and '[service] near me' variations. We track ranking progress monthly and report on impressions, clicks, and direction requests.
- After: We focus on the most valuable local keywords for your business — typically '[service] [city]' and '[service] near me' variations — and agree the keyword set in your quote. We track ranking progress monthly and report on impressions, clicks, and direction requests.

**`faqs[_key=="faq4"].answer`**

- Before: Yes. For multi-location businesses, we optimize a GBP for each physical location. For service-area businesses, we optimize your single GBP for all relevant GTA cities in your coverage zone.
- After: Yes. For multi-location businesses, we can optimize a GBP for each physical location, and additional locations are scoped in your quote. For service-area businesses, we optimize your single GBP for all relevant GTA cities in your coverage zone.

**`faqs[_key=="faq5"].answer`**

- Before: We monitor your rankings weekly. If a competitor gains ground, we investigate what changed — whether that's a new review surge, a GBP update, or a backlink push — and respond with a counter-strategy.
- After: We monitor your rankings regularly. If a competitor gains ground, we investigate what changed — whether that's a new review surge, a GBP update, or a backlink push — and respond with a counter-strategy.

**`faqs[_key=="faq2"].answer`**

- Before: You need a verified Google Business Profile, which typically requires a physical address (or a service-area business designation). We'll guide you through the setup and verification process if you don't have one yet.
- After: You need a verified Google Business Profile, which typically requires a physical address (or a service-area business designation). We'll guide you through the setup and verification process if you don't have one yet. Profile setup is quoted separately from the monthly service.

**`processSteps[_key=="ps3"].description`**

- Before: GBP fully optimized, citations built and cleaned, review funnel live
- After: GBP optimized, plus any citation cleanup and review funnel work agreed in your plan

**`processSteps[_key=="ps4"].description`**

- Before: Ongoing GBP updates, citation monitoring, review response management, and ranking reports
- After: Ongoing GBP updates and ranking reports, plus any agreed citation monitoring and review response management


## servicePage:ai-seo

**`capabilities[_key=="cap4"].description`**

- Before: We build keyword sets across three tiers — high-intent commercial terms (your money pages), informational long-tail terms (your authority builders), and AI-citation candidates (terms where AI Overviews currently dominate and you can replace the cited source). We track 100-300 keywords per client and report rank movement monthly.
- After: We build keyword sets across three tiers — high-intent commercial terms (your money pages), informational long-tail terms (your authority builders), and AI-citation candidates (terms where AI Overviews currently dominate and you can replace the cited source). We track an agreed keyword set and report rank movement monthly.

**`capabilities[_key=="c68d71696e0c"].description`**

- Before: We focus exclusively on Tier 1 and Tier 2 sources — industry publications, local news, .ca government and association sites, directory profiles the answer engines actually cite, and editorial placements in your vertical. No PBNs, no link farms, no comment spam. We target 4-8 high-DR backlinks per quarter, with full transparency on every placement.
- After: We focus exclusively on Tier 1 and Tier 2 sources — industry publications, local news, .ca government and association sites, directory profiles the answer engines actually cite, and editorial placements in your vertical. No PBNs, no link farms, no comment spam. Link-building targets are agreed in your quote, with full transparency on every placement.

**`faqs[_key=="43767efb5264"].answer`**

- Before: AI-powered tools assist in generating keyword suggestions, analyzing competitor content, and identifying emerging search trends. They help create content optimized for both search engines and AI answer engines — ensuring your pages rank in AI Overviews and traditional SERPs. They also monitor brand visibility across multiple AI platforms for continuous improvement.
- After: AI-powered tools assist in generating keyword suggestions, analyzing competitor content, and identifying emerging search trends. They help create content optimized for both search engines and AI answer engines — improving your chances of appearing in AI Overviews and traditional search results. They also monitor brand visibility across multiple AI platforms for continuous improvement.

**`faqs[_key=="93431d254fd0"].answer`**

- Before: AI search engines like ChatGPT, Perplexity, and Google AI prioritize precise, contextually relevant answers — often through AI-generated summaries. This requires SEO strategies to focus on answer engine optimization and structured data to appear in AI-driven results. CiCon Marketing tailors content for these evolving platforms to ensure sustained organic traffic growth.
- After: AI search engines like ChatGPT, Perplexity, and Google AI prioritize precise, contextually relevant answers — often through AI-generated summaries. This requires SEO strategies to focus on answer engine optimization and structured data to appear in AI-driven results. CiCon Marketing tailors content for these evolving platforms to support sustained organic traffic growth.

**`capabilitiesIntro`**

- Before: Two systems now decide whether customers find you: Google's index, and the AI answer engines built on top of it. We work both — and report on them separately, because the results are rarely the same.
- After: Two systems now decide whether customers find you: Google's index, and the AI answer engines built on top of it. We work both — and report on them separately, because the results are rarely the same. Your monthly plan covers the work we agree in your quote.


## servicePage:social-media-marketing-services

**`faqs[_key=="9f71b757b581"]`**

- Before: `{"_key": "9f71b757b581", "_type": "faqItem", "answer": "Most SMBs allocate 10–20% of their marketing budget to social. For paid social, a minimum of $1,500–$3,000/month per platform is needed to generate statistically useful data and see consistent lead flow.", "question": "How much should I budget for social media marketing in Canada?"}`
- After: _(removed)_

**`faqs[_key=="35f276fe1e49"].answer`**

- Before: Yes. Every social media engagement at CiCon includes platform strategy, content calendar, creative direction, and performance reporting — managed by a senior strategist, not a junior coordinator.
- After: Yes. Every social media engagement at CiCon covers the platform strategy, content calendar, creative direction, and performance reporting agreed in your plan — managed by a senior strategist, not a junior coordinator.

**`faqs[_key=="d50d5e083397"].answer`**

- Before: Consistency beats frequency. For most Canadian businesses, 3–5 posts per week on your primary platform is a sustainable baseline. Quality and timing matter more than raw volume — posting at 2am daily helps no one.
- After: Consistency beats frequency. For most Canadian businesses, 3–5 posts per week on your primary platform is a sustainable baseline. Quality and timing matter more than raw volume — posting at 2am daily helps no one. Your CiCon plan sets the posting volume for each platform before the service starts.

**`paaQuestions[_key=="paa3"].answer`**

- Before: Our standard packages include 3–5 posts per week depending on the platform mix. Volume is secondary to consistency and quality — we'd rather post three strong pieces of content than five generic ones.
- After: We agree on posting volume for each platform before the service starts. Volume is secondary to consistency and quality — we'd rather post three strong pieces of content than five generic ones.

**`capabilitiesHeadline`**

- Before: Full-service social media management
- After: Social media management, scoped to your platforms

**`capabilitiesIntro`**

- Before: We handle every part of your social media presence so you can focus on running your business.
- After: We agree on the platforms and monthly work before the service starts. These are the platforms we can cover for your business.

**`heroStats[_key=="hs2"].label`**

- Before: Full platform coverage
- After: Platforms we manage

**`capabilities[_key=="9c38ea327415"].description`**

- Before: We manage Facebook Pages, Meta Business Suite campaigns, audience building, and retargeting. From organic content to paid reach, we optimize every touchpoint in the Meta ecosystem.
- After: We manage Facebook Pages, Meta Business Suite campaigns, audience building, and retargeting. From organic content to paid reach, we optimize every touchpoint in the Meta ecosystem. Paid campaigns and ad spend are scoped separately.

**`capabilities[_key=="af64b0ac0866"].description`**

- Before: We develop TikTok content strategies that match platform culture — not repurposed Instagram clips. Organic growth tactics combined with TikTok Ads for accelerated reach and measurable ROI.
- After: We develop TikTok content strategies that match platform culture — not repurposed Instagram clips. Organic growth tactics combined with TikTok Ads for accelerated reach and measurable ROI. TikTok Ads management and ad spend are scoped separately.


## servicePage:website-development

**`paaQuestions[_key=="paa1"]`**

- Before: `{"_key": "paa1", "_type": "paaItem", "answer": "CiCon web projects start at $3,500 for a 5–8 page conversion-optimized site and $1,200 for a single landing page. Pricing depends on scope, number of pages, and whether the project includes copywriting and SEO setup. We scope every project on a free call.", "question": "How much does a website cost for a GTA business?"}`
- After: _(removed)_

**`paaQuestions[_key=="paa2"].answer`**

- Before: A standard 5–8 page business website takes 4–6 weeks from approved wireframes to launch. Single landing pages take 1–2 weeks. Timelines depend on how quickly you can provide content and feedback — we keep a project tracker so nothing stalls.
- After: A multi-page business website typically takes 4–6 weeks from approved wireframes to launch. Single landing pages take 1–2 weeks. Timelines depend on how quickly you can provide content and feedback — we keep a project tracker so nothing stalls.

**`faqs[_key=="e254067a3791"].answer`**

- Before: Every site launch includes GA4, Google Tag Manager, and Google Search Console setup. You get full visibility into traffic, user behaviour, and conversion paths from day one — no guesswork.
- After: We can set up GA4, Google Tag Manager, and Google Search Console as part of your build, and the tracking work is agreed in your quote. For the Multi-Page + Full SEO build, tracking setup is scoped into the build so you have visibility into traffic, user behaviour, and conversion paths from launch.

**`faqs[_key=="9d081d6c9dd4"].answer`**

- Before: On-page SEO is built in — clean URL structure, proper heading hierarchy, metadata, schema markup, and page speed optimization. Ongoing SEO campaigns are a separate service that picks up where development ends.
- After: Every build includes basic on-page SEO foundations: clean URL structure, proper heading hierarchy, metadata, and page speed optimization. The Multi-Page + Full SEO build adds technical and on-page SEO work scoped into the build, which can include schema markup and keyword research. Ongoing SEO campaigns are a separate service that picks up where development ends.

**`capabilities[_key=="cap3"].description`**

- Before: Every site we build hits the green threshold on all three Core Web Vitals (LCP, INP, CLS) on both mobile and desktop. We use static-first frameworks, optimize every image to next-gen formats, lazy-load below-the-fold content, and measure speed against your top 3 competitors monthly. Slow sites lose ad quality scores and rankings — we don't ship slow sites.
- After: Every site we build hits the green threshold on all three Core Web Vitals (LCP, INP, CLS) on both mobile and desktop. We use static-first frameworks, optimize every image to next-gen formats, lazy-load below-the-fold content, and verify speed before launch. Slow sites lose ad quality scores and rankings — we don't ship slow sites.

**`capabilities[_key=="cap4"].description`**

- Before: Every site ships with full schema.org coverage (Organization, Service, FAQ, Article, BreadcrumbList), semantic HTML, optimized internal linking, and a clean URL structure. We also wire in Google Analytics 4, Google Tag Manager, conversion tracking, and Search Console verification before launch. Day 1 of your site live, every analytics signal is already flowing.
- After: Every site ships with semantic HTML, optimized internal linking, and a clean URL structure. Full schema.org coverage (Organization, Service, FAQ, Article, BreadcrumbList) and the wiring for Google Analytics 4, Google Tag Manager, conversion tracking, and Search Console can be scoped into your build — this work is central to the Multi-Page + Full SEO build.

**`capabilities[_key=="2113fb206ac8"].description`**

- Before: We don't hand off a website without conversion tracking wired end-to-end. Every form connects to your CRM (GoHighLevel, HubSpot, Salesforce — whatever you run), every phone number routes through call tracking with source attribution, and every action fires to GA4 and your ad platforms for optimization. You'll know which ads drive which leads, by source, by campaign, every day.
- After: Conversion tracking can be wired end-to-end as part of your build: forms connected to your CRM (GoHighLevel, HubSpot, Salesforce — whatever you run), phone numbers routed through call tracking with source attribution, and actions firing to GA4 and your ad platforms for optimization. We agree the tracking scope in your quote, so you know which ads drive which leads, by source and by campaign.

**`capabilities[_key=="cap2"].description`**

- Before: We build dedicated landing pages for your Google Ads, Meta Ads, and email campaigns — each with its own headline, social proof, offer, and form. Built in Astro for sub-1-second load times, structured for A/B testing, and wired into your CRM so every lead lands where it should. Most clients run 4-12 active landing pages per campaign season.
- After: We build dedicated landing pages for your Google Ads, Meta Ads, and email campaigns — each with its own headline, social proof, offer, and form. Built in Astro for sub-1-second load times, structured for A/B testing, and wired into your CRM so every lead lands where it should. Most clients run 4-12 active landing pages per campaign season. Campaign landing pages are quoted separately.

**`processSteps[_key=="ps4"].description`**

- Before: Site goes live, training on CMS updates provided, and 30-day post-launch support included
- After: Site goes live, and the post-launch support window agreed in your quote begins


## servicePage:website-development-richmond-hill

**`pricingHeadline`**

- Before: Transparent pricing for Richmond Hill web design
- After: _(removed)_

**`pricingIntro`**

- Before: We publish fixed-fee packages because business owners comparing agencies deserve clarity, not "contact us for a quote". Every proposal separates design, development, SEO and hosting so you can compare us line by line.
- After: _(removed)_

**`pricingNote`**

- Before: Both packages include hosting setup, SSL, CMS training, and full asset ownership — you own your code and your domain. No hidden fees.
- After: _(removed)_

**`pricingTiers`**

- Before: `[{"_key": "t1", "_type": "pricingTier", "audience": "Solo professionals and new businesses", "cadence": "CAD", "includes": ["One-page custom design", "Responsive across all devices", "Basic on-page SEO", "Speed optimization", "CMS with content-update training", "Hosting setup and SSL"], "name": "Starter Site", "price": "$800–$1,200"}, {"_key": "t2", "_type": "pricingTier", "audience": "Established businesses — 10 to 15 pages", "cadence": "CAD", "includes": ["10–15 custom-designed pages", "Basic on-page SEO", "Speed optimization", "Lead generation forms", "Responsive across all devices", "CMS w`
- After: _(removed)_

**`faqs[_key=="faq7"]`**

- Before: `{"_key": "faq7", "_type": "faqItem", "answer": "A one-page site is $800–$1,200 CAD. A 10–15 page custom build with basic SEO and lead generation runs $2,000–$3,000, and the same build with full technical and on-page SEO, schema markup and GA4, Search Console and Tag Manager configured is $6,500–$9,500+. E-commerce and high-feature builds start around $10,000. What moves the number is page count, whether you need e-commerce or booking integrations, and how much content and photography already exists. Every proposal is fixed-fee and itemises design, development, SEO and hosting separately so you`
- After: _(removed)_

**`paaQuestions[_key=="paa2"]`**

- Before: `{"_key": "paa2", "_type": "paaItem", "answer": "In Richmond Hill, a one-page site runs $800–$1,200 CAD. A 10–15 page custom build with basic SEO and lead generation is $2,000–$3,000, and the same build with full technical SEO, schema and analytics configured is $6,500–$9,500+. E-commerce starts around $10,000.", "question": "How much does web design cost in Richmond Hill?"}`
- After: _(removed)_

**`heroDescription`**

- Before: We are a marketing company that builds websites — not a web shop that dabbles in marketing. Every Richmond Hill site we build is designed around how customers actually find and choose you, and it ships fully SEO and AI-SEO optimized on launch day rather than months later.
- After: We are a marketing company that builds websites — not a web shop that dabbles in marketing. Every Richmond Hill site we build is designed around how customers actually find and choose you and starts with SEO foundations. With our Multi-Page + Full SEO build, technical and on-page SEO is in place on launch day rather than months later.

**`heroStats[_key=="hs2"].label`**

- Before: SEO and AI-SEO live at launch
- After: SEO foundations live at launch

**`capabilities[_key=="cap2"].description`**

- Before: Schema markup, semantic HTML, clean internal linking, crawlable structure, Core Web Vitals headroom, and content structured so AI search engines can quote it. Most agencies launch sites carrying a backlog of SEO problems that then cost money to fix. Ours go live clean, which is why they start earning visibility immediately rather than six months later.
- After: Every build starts with SEO foundations: semantic HTML, clean internal linking, crawlable structure and Core Web Vitals headroom. The Multi-Page + Full SEO build scopes technical and on-page SEO into the build, which can include schema markup, keyword and competitor research, and content structured so AI search engines can quote it. Most agencies launch sites carrying a backlog of SEO problems that then cost money to fix; we build the foundations in from the start.

**`capabilities[_key=="cap4"].description`**

- Before: Theme development from scratch or a starter framework stripped to essentials for speed — never a bloated commercial theme. Your team gets a CMS they can actually use to update content without touching code, plus recorded training and documentation at handoff.
- After: Theme development from scratch or a starter framework stripped to essentials for speed — never a bloated commercial theme. Your team gets a CMS they can actually use to update content without touching code, plus documentation at handoff.

**`capabilities[_key=="cap6"].description`**

- Before: Dental clinics and healthcare: booking integrations, patient intake, AODA-compliant accessible design. Home improvement and trades: project galleries, service request forms, service-area pages. Showrooms and retailers: catalogues, e-commerce and payment gateways. B2B services: intake workflows, lead magnets and case study templates.
- After: Dental clinics and healthcare: booking integrations, patient intake, AODA-compliant accessible design. Home improvement and trades: project galleries, service request forms, service-area pages. Showrooms and retailers: catalogues. B2B services: intake workflows, lead magnets and case study templates.

**`faqs[_key=="faq2"].answer`**

- Before: Yes — fully, for both traditional search and AI answer engines. Schema markup, semantic HTML, internal linking, crawlability and Core Web Vitals are handled during development. Most agencies launch sites with SEO problems already built in, which then cost time and money to fix later.
- After: Every build includes basic on-page SEO foundations. If you choose the Multi-Page + Full SEO build, technical and on-page SEO for both traditional search and AI answer engines is scoped into the build, so it is in place when the site goes live. Ongoing SEO after launch is a separate service.

**`paaQuestions[_key=="paa4"].answer`**

- Before: Yes. Schema markup, semantic HTML, Core Web Vitals, internal linking and AI-search readiness are built during development, not retrofitted. Most sites launch with SEO problems already baked in — ours do not.
- After: Every build includes SEO foundations, built during development rather than retrofitted. The Multi-Page + Full SEO build scopes technical and on-page SEO into the build, which can include AI-search readiness, so it is in place at launch.

**`faqs[_key=="faq3"].answer`**

- Before: Three to ten pages takes two to five weeks. Sites with a blog, booking or e-commerce take five to eight weeks. Complex multi-region builds run longer. Timelines depend mostly on how quickly you can deliver content and approvals.
- After: Three to ten pages takes two to five weeks. Sites with a blog or booking take five to eight weeks. Complex multi-region builds run longer. Timelines depend mostly on how quickly you can deliver content and approvals.

**`paaQuestions[_key=="paa3"].answer`**

- Before: A custom site of three to ten pages takes two to five weeks once discovery and content are ready. Builds with a blog, multiple service areas or e-commerce take five to eight weeks. Content delivery is almost always the bottleneck, not development.
- After: A custom site of three to ten pages takes two to five weeks once discovery and content are ready. Builds with a blog or multiple service areas take five to eight weeks. Content delivery is almost always the bottleneck, not development.

**`faqs[_key=="faq4"].answer`**

- Before: Yes. Both packages include hosting setup and a post-launch support window. Ongoing monthly maintenance covers CMS and plugin updates, security monitoring, backups, uptime checks and performance reviews.
- After: Yes. Your quote confirms hosting setup and the post-launch support window for your build. Ongoing monthly maintenance is quoted separately and can cover CMS and plugin updates, security monitoring, backups, uptime checks and performance reviews.

**`faqs[_key=="faq6"].answer`**

- Before: Both packages include a post-launch support window. After that we offer monthly retainers or per-request support. You can also update content yourself through the CMS — we train your team during handoff and leave you a recorded walkthrough.
- After: Your quote sets the post-launch support window for your build. After that, we offer monthly retainers or per-request support, quoted separately. You can also update content yourself through the CMS.

**`processSteps[_key=="ps4"].description`**

- Before: We go live, verify indexing, confirm analytics, and train your team on the CMS with a recorded walkthrough and documentation
- After: We go live, verify indexing, confirm analytics, and hand over documentation for your CMS

**`eeatBody`**

- Before: CiCon is based in Richmond Hill, and a senior strategist works directly on every build — no handoff to a junior developer after the sales call.

The distinction that matters: most web designers build a site and treat marketing as a separate job for someone else. We are a marketing company first, so the site is designed around lead generation from the first conversation and ships fully SEO and AI-SEO optimized on launch day. Most agencies put a site live carrying SEO problems that then take months and money to unpick.

Recent Richmond Hill and GTA builds include Atlas Value Builders, a modular four-season housing manufacturer, and Maison Opes, a home renovation company serving Toronto and the GTA. We work with businesses along the Yonge Street and Bayview corridors and across York Region — and we stay involved after launch rather than disappearing.
- After: CiCon is based in Richmond Hill, and a senior strategist works directly on every build — no handoff to a junior developer after the sales call.

The distinction that matters: most web designers build a site and treat marketing as a separate job for someone else. We are a marketing company first, so the site is designed around lead generation from the first conversation, every build starts with SEO foundations, and our Multi-Page + Full SEO build goes live with technical and on-page SEO in place. Most agencies put a site live carrying SEO problems that then take months and money to unpick.

Recent Richmond Hill and GTA builds include Atlas Value Builders, a modular four-season housing manufacturer, and Maison Opes, a home renovation company serving Toronto and the GTA. We work with businesses along the Yonge Street and Bayview corridors and across York Region — and we stay involved after launch rather than disappearing.

**`metaDescription`**

- Before: Marketing-first web design for Richmond Hill businesses. Fast sites, SEO and AI-SEO ready from day one, built to generate real inquiries.
- After: Marketing-first web design for Richmond Hill businesses. Websites from $1,000 CAD, SEO foundations in every build, and full SEO builds available.


## servicePage:media-content-production

**`faqs[_key=="faq2"].answer`**

- Before: Yes — on-location shooting is our default for most projects. We bring our own equipment, manage setup and breakdown, and require access to your space for typically half a day to a full day depending on scope.
- After: Yes — on-location shooting is our default for most projects. We bring our own equipment, manage setup and breakdown, and need access to your space for the shoot. A standard session is 2–3 hours of shooting; larger productions can need more time on site, which we agree in your quote.

**`faqs[_key=="faq3"].answer`**

- Before: Short-form social video packages (4–8 clips) take 2–3 weeks from brief to delivery. Long-form brand films or testimonial productions take 4–6 weeks including editing and revision rounds.
- After: Short-form social video projects take about 2–3 weeks from brief to delivery. Long-form brand films or testimonial productions take 4–6 weeks including editing and revision rounds.

**`paaQuestions[_key=="paa2"].answer`**

- Before: A typical short-form social video package (4–8 clips) takes 2–3 weeks from brief to delivery. Long-form brand films or testimonial productions take 4–6 weeks including editing and revisions.
- After: A typical short-form social video project takes 2–3 weeks from brief to delivery. Long-form brand films or testimonial productions take 4–6 weeks including editing and revisions.

**`faqs[_key=="faq5"].answer`**

- Before: Video projects include two rounds of revisions at the editing stage. Photography includes one round of selects review. Additional revisions are available at an hourly rate. Most clients approve within the included rounds.
- After: We agree the number of revision rounds in your quote, along with the final assets and delivery schedule. Additional revisions are available at an hourly rate.

**`faqs[_key=="faq6"].answer`**

- Before: Yes — scripting is included in all video production packages. We write and get your approval on the script before any shooting begins. For short-form social video, we also provide a content brief and talking points if you prefer an interview-style approach.
- After: Yes — when a production needs a script, we write it and get your approval before any shooting begins. Scripting is agreed as part of your brief. For short-form social video, we can also provide a content brief and talking points if you prefer an interview-style approach.

**`capabilities[_key=="cap2"].description`**

- Before: Scripted or documentary-style short-form videos (15–90 seconds) designed for social media feeds. Includes scripting, shooting, editing, captions, and delivery in platform-specific formats. Packages of 4, 8, or 12 clips monthly.
- After: Scripted or documentary-style short-form videos (15–90 seconds) designed for social media feeds. Scripting, shooting, editing, captions, and delivery in platform-specific formats, with clip volume agreed in your quote.

**`capabilitiesIntro`**

- Before: We produce all the content formats that modern marketing runs on — from a single photoshoot to a full content system.
- After: We produce the content formats modern marketing runs on — from a single photoshoot to a full content system. Photo and video sessions have a published starting price; editing, written content, and larger productions are scoped in your quote.

**`processSteps[_key=="ps4"].description`**

- Before: Edited, formatted, and delivered in every format you need — ready to publish or hand to your ad team
- After: Edited, formatted, and delivered in the formats agreed in your brief — ready to publish or hand to your ad team


## servicePage:crm-integration

**`faqs[_key=="faq2"].answer`**

- Before: A standard CRM integration — website forms, phone tracking, and Google Ads connection — takes 2–4 weeks. More complex setups with multi-stage automation sequences and multi-location pipelines take 4–8 weeks. We'll give you a specific timeline after the audit.
- After: A standard CRM integration — website forms, phone tracking, and Google Ads connection — takes 2–4 weeks. More complex setups with multi-stage automation sequences and multi-location pipelines take 4–8 weeks. We'll give you a specific timeline after the audit. Setup is quoted separately from the monthly service.

**`faqs[_key=="faq4"].answer`**

- Before: Yes — we include a team training session as part of every CRM integration. We also create a written standard operating procedure (SOP) for how your team should log activity, manage pipeline stages, and interpret reports.
- After: Yes — team training and a written standard operating procedure (SOP) for how your team should log activity, manage pipeline stages, and interpret reports can be part of your CRM setup, which is quoted separately.

**`paaQuestions[_key=="paa1"].answer`**

- Before: We work with GoHighLevel, HubSpot, and Zoho CRM — chosen based on your business size, budget, and existing tech stack. We set up, configure, and integrate the CRM with your marketing channels and website.
- After: We work with GoHighLevel, HubSpot, and Zoho CRM — chosen based on your business size, budget, and existing tech stack. Initial setup, configuration, and integration with your marketing channels and website are quoted separately from the monthly service.

**`capabilitiesIntro`**

- Before: We build and integrate CRM systems that connect your marketing spend to actual revenue — not vanity metrics.
- After: We build and integrate CRM systems that connect your marketing spend to actual revenue — not vanity metrics. Initial setup is quoted separately; the monthly service covers the ongoing work we agree in your quote.

**`processSteps[_key=="ps1"].description`**

- Before: We audit your current lead flow, identify where leads are being lost, and map out your ideal CRM architecture
- After: Initial setup: we audit your current lead flow, identify where leads are being lost, and map out your ideal CRM architecture

**`processSteps[_key=="ps2"].description`**

- Before: CRM configured, integrations built, call tracking live, and pipeline stages mapped to your actual sales process
- After: Initial setup: cRM configured, integrations built, call tracking live, and pipeline stages mapped to your actual sales process

**`processSteps[_key=="ps3"].description`**

- Before: Automation sequences built and tested with real lead scenarios — nothing goes live until we've verified it works
- After: Initial setup: automation sequences built and tested with real lead scenarios — nothing goes live until we've verified it works

**`processSteps[_key=="ps4"].description`**

- Before: Monthly reporting on pipeline performance, lead source attribution, and automation improvements
- After: Monthly service: monthly reporting on pipeline performance, lead source attribution, and automation improvements


## servicePage:conversion-rate-optimization

**`paaQuestions[_key=="paa1"]`**

- Before: `{"_key": "paa1", "answer": "CRO engagements at CiCon start at $2,000 for a one-time audit and $3,500/month for ongoing testing programs. The investment typically pays for itself within 60-90 days through improved conversion rates on existing traffic.", "question": "How much does conversion rate optimization cost in the GTA?"}`
- After: _(removed)_

**`faqs[_key=="faq5"].answer`**

- Before: Both. A one-time audit ($2,000) gives you a prioritized list of fixes you or your team can implement. An ongoing program ($3,500+/month) means we run the audit, ship the fixes, run continuous testing, and report results monthly. Most clients start with the audit and decide based on what we find.
- After: Both. A one-time engagement covers the review and optimization work we agree before the project starts. Ongoing testing and optimization need a separate retainer, quoted for your scope. Most clients start with a one-time engagement and decide based on what we find.

**`faqs[_key=="faq6"].answer`**

- Before: CRO compounds. Every percentage point of conversion lift makes every future ad dollar more profitable. A 30% conversion improvement on $10,000/month in ad spend effectively gives you $3,000/month in additional revenue — without spending another dollar on traffic. That math doesn't reverse when you turn off the ads.
- After: CRO compounds. Every percentage point of conversion lift makes future ad spend more productive, because more of the traffic you already pay for turns into leads. That gain doesn't reverse when you turn off the ads.

**`capabilities[_key=="cap2"].description`**

- Before: We run continuous testing programs on the elements that move revenue most — headlines, CTAs, form fields, page layouts, pricing displays. Every test is hypothesis-led, statistically valid, and run long enough to produce real results. No vanity tests.
- After: With an ongoing CRO retainer, we run continuous testing on the elements that move revenue most — headlines, CTAs, form fields, page layouts, pricing displays. Every test is hypothesis-led, statistically valid, and run long enough to produce real results. No vanity tests.

**`capabilities[_key=="cap4"].description`**

- Before: Forms are where most conversion paths break. We audit field-by-field abandonment, eliminate unnecessary fields, add inline validation that catches errors before submission, and test multi-step versus single-page formats. Typical result: 30-50% reduction in form abandonment.
- After: Forms are where many conversion paths break. We audit where visitors leave, remove unnecessary fields, add clear validation, and test changes against your current completion rate. We report the measured result for your site, without promising a fixed lift.

**`paaQuestions[_key=="paa3"].answer`**

- Before: First measurable wins typically land within 30-60 days from initial tests. Compound results — where multiple optimizations stack — show up in the 90-180 day window. CRO is a continuous program, not a one-time fix.
- After: First measurable wins typically land within 30-60 days from initial changes. Compound results — where multiple optimizations stack — show up in the 90-180 day window with ongoing optimization, which runs under a separate retainer.

**`processSteps[_key=="step4"].description`**

- Before: Monthly reviews with the numbers that matter
- After: A results report at the end of the project. Monthly reviews continue only with an ongoing CRO retainer

**`heroStats[_key=="hs1"].value`**

- Before: 2-5×
- After: Baseline-first

**`heroStats[_key=="hs1"].label`**

- Before: Typical conversion lift
- After: Changes measured against your current rate

**`antiPitchItems[_key=="ap2"].explanation`**

- Before: Realistic CRO programs lift conversion 20-50% in the first 90 days. Anyone promising 10× is selling you on the upside of a single lucky test, not a sustainable program.
- After: No one can promise a specific lift before seeing your data. We measure your current conversion rate first, then report what each change actually does. Anyone promising 10× is selling you on the upside of a single lucky test, not a sustainable program.


## servicePage:content-marketing

**`paaQuestions[_key=="paa1"]`**

- Before: `{"_key": "paa1", "answer": "A standard content marketing program at CiCon starts at $1,500/month for 4 long-form blog posts plus distribution. Comprehensive programs with video, multimedia, and topical authority sprints run $5,000-$10,000/month depending on scope. We don't sell content packages by word count — we sell editorial outcomes.", "question": "How much does content marketing cost in the GTA?"}`
- After: _(removed)_

**`heroStats[_key=="stat1"].value`**

- Before: 4-8/month
- After: Scoped content

**`heroStats[_key=="stat1"].label`**

- Before: Long-form pieces
- After: Volume matched to your plan

**`capabilities[_key=="cap1"].description`**

- Before: We start every engagement with a content audit and topic-cluster map. Which subjects do your customers search around your services? Which clusters have under-developed competition you can dominate? What's the right sequence of pieces to build topical authority in 90-180 days? Deliverable: a written strategy and 12-month editorial calendar tied to commercial outcomes.
- After: We start every engagement with a content audit and topic-cluster map. Which subjects do your customers search around your services? Which clusters have under-developed competition you can dominate? What's the right sequence of pieces to build topical authority in 90-180 days? Deliverable: a written strategy and an editorial calendar tied to commercial outcomes.

**`capabilities[_key=="cap2"].description`**

- Before: We write 4-8 long-form blog posts per month for your business — typically 1,500-2,500 words each, deeply researched, optimized for AI Overview citation and internal linking. Every piece written by humans (AI-assisted research only), edited by a senior strategist, and matched to a specific stage in your customer journey.
- After: We write long-form blog posts at the volume agreed in your plan — typically 1,500-2,500 words each, deeply researched, optimized for AI Overview citation and internal linking. Every piece written by humans (AI-assisted research only), edited by a senior strategist, and matched to a specific stage in your customer journey.

**`capabilities[_key=="cap3"].description`**

- Before: Two to four long-form pieces per quarter — definitive guides, original research, in-depth tutorials — built to be the best resource on the internet for their topic. These are the pieces that rank for the most competitive keywords, earn backlinks naturally, and get cited as sources by both AI engines and other publishers.
- After: When your plan includes them, long-form pillar pieces — definitive guides, original research, in-depth tutorials — built to be the best resource on the internet for their topic. These are the pieces that rank for the most competitive keywords, earn backlinks naturally, and get cited as sources by both AI engines and other publishers.

**`capabilities[_key=="cap4"].description`**

- Before: We script, structure, and direct video content tied to your editorial calendar — typically 2-4 pieces per month. Most video work is repurposed long-form blog content reformatted for YouTube, LinkedIn, and embedded in your articles. (Note: for dedicated brand video or ad production, see our Media Production service.)
- After: When your plan includes video, we script, structure, and direct video content tied to your editorial calendar. Most video work is repurposed long-form blog content reformatted for YouTube, LinkedIn, and embedded in your articles. (Note: for dedicated brand video or ad production, see our Media Production service.)

**`capabilitiesIntro`**

- Before: Great content marketing is editorial discipline applied to commercial outcomes. Every piece earns its place in your strategy — and earns a citation, a click, or a customer. Here's how we deliver that for GTA businesses.
- After: Great content marketing is editorial discipline applied to commercial outcomes. Every piece earns its place in your strategy — and earns a citation, a click, or a customer. Here's how we deliver that for GTA businesses. Your quote sets the formats and content volume.


## servicePage:marketing-consultant

**`antiPitchItems[_key=="ap3"].explanation`**

- Before: Our minimum engagement is $1,000. If price is the deciding factor, you'll get better results from a marketing course than a consultant.
- After: Our standalone consultations have a published starting price, and we agree the scope before work starts. If price is the only deciding factor, a marketing course may serve you better than a consultant.

**`paaQuestions[_key=="paa1"]`**

- Before: `{"_key": "paa1", "answer": "Most strategic consulting engagements start at $1,000 for a one-time audit or $2,500/month for ongoing advisory. We don't charge by the hour — we charge by the outcome you're trying to reach.", "question": "How much does a marketing consultant cost in the GTA?"}`
- After: _(removed)_

**`paaQuestions[_key=="paa4"].question`**

- Before: What does a marketing consultant actually deliver in 30 days?
- After: What does a standalone marketing consultation deliver?

**`paaQuestions[_key=="paa4"].answer`**

- Before: A strategic audit of your current state, a prioritized roadmap of what to fix first, a KPI framework so you can measure progress, and a recommendation on which channels (paid, SEO, content, CRM) to invest in next.
- After: Clear advice, or the deliverable we agree before work starts, focused on the question you need answered. Broader strategic audits, roadmaps, and KPI frameworks are scoped separately.

**`faqs[_key=="faq1"].answer`**

- Before: A strategic audit takes 2-3 weeks. The roadmap delivery is 1 week after that. Ongoing advisory engagements run monthly with quarterly strategy resets. Most clients see meaningful results from the roadmap within 30-60 days.
- After: A standalone consultation is scoped to one agreed question, and we confirm the timeline before work starts. Larger strategic audits, roadmaps, and ongoing advisory are scoped separately.

**`faqs[_key=="faq3"].answer`**

- Before: No. The strategic audit is a one-time engagement. Ongoing advisory is month-to-month with a 30-day notice. We don't believe in locking clients into contracts to keep them — we keep them by delivering results.
- After: No. A standalone consultation is a one-time engagement. Ongoing advisory is month-to-month with a 30-day notice. We don't believe in locking clients into contracts to keep them — we keep them by delivering results.

**`capabilities[_key=="cap5"].description`**

- Before: After the audit and roadmap, most clients want a senior brain in the room monthly. We review what's working, what's not, and what to change — without taking over execution. Think of it as having a CMO on retainer, without the full-time salary.
- After: After the audit and roadmap, most clients want a senior brain in the room monthly. We review what's working, what's not, and what to change — without taking over execution. Think of it as having a CMO on retainer, without the full-time salary. Ongoing advisory is scoped and quoted separately.

**`capabilitiesIntro`**

- Before: A consultant's job is to find what's broken, what's wasted, and what's missing — then build the plan to fix it. Here's how we do that for GTA businesses.
- After: A consultant's job is to find what's broken, what's wasted, and what's missing — then build the plan to fix it. A standalone consultation focuses on one question we agree up front; the larger audits, roadmaps, and tracking work below are scoped separately.

**`processSteps[_key=="step1"].label`**

- Before: Discovery
- After: Agree the problem

**`processSteps[_key=="step1"].description`**

- Before: Audit your current state, identify gaps, define KPIs
- After: We agree on the question to address and the advice or deliverable you need

**`processSteps[_key=="step2"].label`**

- Before: Strategy
- After: Review

**`processSteps[_key=="step2"].description`**

- Before: Build the plan — channels, budget, creative direction
- After: We review the relevant information — your accounts, data, and current plans

**`processSteps[_key=="step3"].label`**

- Before: Execute
- After: Advise

**`processSteps[_key=="step3"].description`**

- Before: Launch campaigns, ship assets, track every action
- After: You get clear advice or the agreed deliverable

**`processSteps[_key=="step4"].label`**

- Before: Report
- After: Next steps

**`processSteps[_key=="step4"].description`**

- Before: Monthly reviews with the numbers that matter
- After: We agree on next steps. Any further work is scoped separately


## servicePage:marketing-technology-setup

**`antiPitchItems[_key=="ap1"].disqualifier`**

- Before: You want a one-time setup with no ongoing maintenance.
- After: You expect a one-time setup to stay accurate forever.

**`antiPitchItems[_key=="ap1"].explanation`**

- Before: MarTech stacks break when tools update, integrations expire, or new tracking requirements emerge. We can do one-time setups, but expect to revisit them every 6-12 months. The 'set it and forget it' marketing stack is a myth.
- After: MarTech stacks break when tools update, integrations expire, or new tracking requirements emerge. One-time setups are welcome — plan to revisit yours every 6-12 months. Any ongoing maintenance is scoped separately.

**`paaQuestions[_key=="paa1"]`**

- Before: `{"_key": "paa1", "answer": "A standard MarTech setup engagement at CiCon starts at $3,500 for foundational tracking (GA4, GTM, conversion tracking, basic CRM hookups). Full-stack integration with custom reporting dashboards runs $6,500-$12,000 depending on tool count and complexity.", "question": "How much does marketing technology setup cost in the GTA?"}`
- After: _(removed)_

**`faqs[_key=="faq4"].answer`**

- Before: Both. One-time setups start at $3,500. Ongoing maintenance (monthly tracking audits, integration fixes when tools update, new event tracking as campaigns evolve) runs $1,200-$2,500/month. Most clients start with setup and add maintenance after 60 days when they see how much breaks.
- After: Both. Setup is a one-time project. Any ongoing maintenance — monthly tracking audits, integration fixes when tools update, new event tracking as campaigns evolve — is scoped separately. Most clients start with setup and decide on maintenance once they see how their stack behaves.

**`capabilities[_key=="cap3"].description`**

- Before: We deploy Meta Pixel, Google Ads conversion tracking, LinkedIn Insight Tag, and TikTok Pixel — all configured for offline conversion uploads and server-side tracking where supported. Includes Stape or equivalent server-side container setup to recover the 20-40% of data lost to client-side tracking failures.
- After: We deploy Meta Pixel, Google Ads conversion tracking, LinkedIn Insight Tag, and TikTok Pixel — all configured for offline conversion uploads and server-side tracking where supported. Can include Stape or equivalent server-side container setup to recover the 20-40% of data lost to client-side tracking failures.

**`capabilitiesIntro`**

- Before: Marketing technology is the plumbing under everything else. When it's right, every campaign is measurable. When it's wrong, every decision is a guess. Here's the stack we build for GTA businesses.
- After: Marketing technology is the plumbing under everything else. When it's right, every campaign is measurable. When it's wrong, every decision is a guess. Each project covers the tools, tracking, and integrations we agree before work starts.

**`processSteps[_key=="step1"].label`**

- Before: Discovery
- After: Scope

**`processSteps[_key=="step1"].description`**

- Before: Audit your current state, identify gaps, define KPIs
- After: Audit your current tools and tracking, then agree the tools, tracking, and integrations in scope

**`processSteps[_key=="step2"].label`**

- Before: Strategy
- After: Setup

**`processSteps[_key=="step2"].description`**

- Before: Build the plan — channels, budget, creative direction
- After: Configure the agreed tracking, tags, and integrations

**`processSteps[_key=="step3"].label`**

- Before: Execute
- After: Checks

**`processSteps[_key=="step3"].description`**

- Before: Launch campaigns, ship assets, track every action
- After: Test every event, conversion, and data flow before sign-off

**`processSteps[_key=="step4"].label`**

- Before: Report
- After: Handoff

**`processSteps[_key=="step4"].description`**

- Before: Monthly reviews with the numbers that matter
- After: Document the setup and hand it over. Any ongoing maintenance is scoped separately


## blogPost:google-ads-management-toronto-cost-process-2026

**`body[_key=="g008"].children[_key=="gs008"].text`**

- Before: CiCon Marketing recommends a minimum all-in budget of approximately $1,500 CAD/month (ads + management) to generate meaningful data and qualified leads. In competitive Toronto niches like dentists, movers, and home services, cost per lead ranges from $25–$120 depending on vertical and geography.
- After: At CiCon Marketing, Google Ads management starts at $900 CAD per month. That is a management retainer: ad spend is excluded, and setup is not included. In competitive Toronto niches like dentists, movers, and home services, cost per lead ranges from $25–$120 depending on vertical and geography.


## blogPost:meta-ads-vs-in-house-marketing-2026

**`body[_key=="c1e2f3a4b5d6"].children[_key=="c1e2f3a4b5d7"].text`**

- Before: Meta ads with a specialist agency (e.g., CiCon): 
- After: Meta ads with a specialist agency: 

**`body[_key=="c1e2f3a4b5d6"].children[_key=="c1e2f3a4b5d8"].text`**

- Before: $3,500–$8,000/month covering ad spend and management — full campaign setup, creative, tracking, weekly reporting, and landing page guidance.
- After: typically $3,500–$8,000/month in combined ad spend and management — full campaign setup, creative, tracking, weekly reporting, and landing page guidance. At CiCon, Meta Ads management starts at $700 CAD/month; ad spend is excluded and setup is not included.


## blogPost:how-to-fix-dental-marketing-2026

**`body[_key=="b090"].children[_key=="s090a"].text`**

- Before: Underinvesting leads to inconsistent results — a budget under ~$1,500/month rarely generates enough data to optimise. CiCon Marketing structures engagements with strategy-first discovery, clear KPIs around booked appointments, monthly retainers starting around $1,500, and direct access to a senior strategist rather than junior account layers.
- After: Underinvesting leads to inconsistent results — a budget under ~$1,500/month rarely generates enough data to optimise. CiCon Marketing structures engagements with strategy-first discovery, clear KPIs around booked appointments, and direct access to a senior strategist rather than junior account layers. Our dental marketing retainer starts at $1,500 CAD per month, and ad spend is excluded.


## blogPost:google-business-profile-optimization-richmond-hill-2026

**`faqs[_key=="gbpfaq3"].answer`**

- Before: Agency fees for monthly GBP management in the Greater Toronto Area typically range from $500 to $2,000+ per month, depending on the scope of work. CiCon Marketing offers transparent, fixed-rate packages based on specific deliverables.
- After: Agency fees for monthly GBP management in the Greater Toronto Area typically range from $500 to $2,000+ per month, depending on the scope of work. At CiCon Marketing, Google Business Profile management and optimization starts at $800 CAD per month. Setup is not included, and we confirm the profile coverage and ongoing work in your quote.


## blogPost:best-dental-marketing-small-businesses-toronto-2026

**`body[_key=="bdm26-p8"].children[_key=="bdm26-s34"].text`**

- Before: Transparent pricing remains a critical issue for Toronto dentists burned by overpriced, underperforming marketing contracts. CiCon's 2026 benchmarks reveal what to expect across the most common dental marketing investments:
- After: Transparent pricing remains a critical issue for Toronto dentists burned by overpriced, underperforming marketing contracts. CiCon's 2026 benchmarks show typical market fees across the most common dental marketing investments. These are market ranges, not CiCon's prices: CiCon's own dental marketing retainer starts at $1,500 CAD per month, and ad spend is excluded.


## blogPost:website-development-toronto-small-businesses-2026

**`body[_key=="b08"].children[_key=="b08s1"].text`**

- Before: Security, speed, and search readiness are non-negotiable in 2026. Data from the Canadian Internet Registration Authority shows that Canadian small business sites with regular technical audits and SSL encryption experience 37% fewer service disruptions and 27% higher customer trust scores. CiCon Marketing's approach includes monthly technical health checks, analytics integration, and managed hosting — rare for boutique agencies.
- After: Security, speed, and search readiness are non-negotiable in 2026. Data from the Canadian Internet Registration Authority shows that Canadian small business sites with regular technical audits and SSL encryption experience 37% fewer service disruptions and 27% higher customer trust scores. CiCon Marketing can include analytics integration and hosting setup in a build, and monthly technical health checks are available as a separate ongoing service.

**`body[_key=="b11"].children[_key=="b11s2"].text`**

- Before:  — Senior-led strategy (14+ years, GTA-specialised), 100% custom design, full AI & traditional SEO integration, in-house ongoing support. Starting at $3,800 CAD.
- After:  — Senior-led strategy (14+ years, GTA-specialised), custom design, SEO foundations in every build with full SEO builds available, and support options scoped in your quote. Website projects start at $1,000 CAD (Starter Site), $2,500 CAD (Multi-Page Site), and $7,500 CAD (Multi-Page + Full SEO), as one-time starting prices.

**`body[_key=="b19"].children[_key=="b19s1"].text`**

- Before: CiCon Marketing points of difference: Every project is run by senior strategist Majid Behzad, never a rotating junior account manager. Service includes analytics, ad creative, landing pages, CRM integration, and monthly reporting — not just a website, but a growth platform. In contrast, template providers offer speed and price, but lack guarantees on strategy, scaling, or ongoing care. With hundreds of successful Toronto-area launches, CiCon's approach is cited by clients for its clarity and accountability.
- After: CiCon Marketing points of difference: Every project is run by senior strategist Majid Behzad, never a rotating junior account manager. Projects can add analytics, ad creative, landing pages, CRM integration, and monthly reporting, each scoped and quoted separately — so the website can become part of a growth platform, not just a brochure. In contrast, template providers offer speed and price, but lack guarantees on strategy, scaling, or ongoing care. With hundreds of successful Toronto-area launches, CiCon's approach is cited by clients for its clarity and accountability.

**`body[_key=="b25"].children[_key=="b25s2"].text`**

- Before: Every build includes technical SEO (schema, speed, CDN), on-page AI/SEO, and security. CiCon goes beyond basic best practices, embedding Google Analytics 4 and CRM integration natively.
- After: Every build includes SEO foundations, speed optimization, and SSL. The Multi-Page + Full SEO build adds technical and on-page SEO scoped into the build, which can include schema markup. Google Analytics 4 and CRM integration can be added and are confirmed in your quote.

**`body[_key=="b26"].children[_key=="b26s2"].text`**

- Before: In-house photographers and videographers capture original, copyright-cleared assets — rare in agencies. Combined with conversion copywriting, sites launch with an advantage over stock-heavy competitors.
- After: In-house photographers and videographers capture original, copyright-cleared assets — rare in agencies. Photo and video shoots are scoped separately from the website build. Combined with conversion copywriting, sites launch with an advantage over stock-heavy competitors.

**`body[_key=="b27"].children[_key=="b27s1"].text`**

- Before: Testing, Launch, and Reporting: 
- After: Testing, Launch, and Handoff: 

**`body[_key=="b27"].children[_key=="b27s2"].text`**

- Before: Extensive device and browser testing prevents post-launch issues. CiCon's launches include training, escalation response (average ticket resolution under 8 hours), and clear monthly ROI reporting.
- After: Extensive device and browser testing prevents post-launch issues. Each launch includes the post-launch support window set in your quote. Ongoing support and monthly reporting are quoted separately.

**`body[_key=="b28"].children[_key=="b28s2"].text`**

- Before: Website performance is tracked; landing pages, CTAs, and speed are updated as Google and user behaviour evolve. CiCon's boutique model ensures site owners always get senior attention, not helpdesk queues.
- After: Website performance can be tracked, and landing pages, CTAs, and speed updated as Google and user behaviour evolve. Ongoing optimisation is a separate monthly service. CiCon's boutique model ensures site owners always get senior attention, not helpdesk queues.

**`faqs[_key=="faq01"].answer`**

- Before: The starting range for a professionally developed small business website is $3,800 to $6,500 in Toronto. Template-based options may be cheaper initially, but typically require extra spending for custom features and long-term support.
- After: The starting range for a professionally developed small business website is $3,800 to $6,500 in Toronto. Template-based options may be cheaper initially, but typically require extra spending for custom features and long-term support. At CiCon Marketing, website projects start at $1,000 CAD for a Starter Site, $2,500 CAD for a Multi-Page Site, and $7,500 CAD for a Multi-Page + Full SEO build, as one-time starting prices.

**`faqs[_key=="faq03"].answer`**

- Before: WordPress remains the most flexible and future-proof platform, especially when paired with managed hosting and integrated CRMs. Shopify is optimal for e-commerce sites. CiCon builds with both, depending on the business model.
- After: WordPress remains the most flexible and future-proof platform, especially when paired with managed hosting and integrated CRMs. Shopify is optimal for e-commerce sites. CiCon builds business websites on WordPress or a static framework such as Astro, depending on the business model.

**`faqs[_key=="faq04"].answer`**

- Before: At CiCon Marketing, monthly technical audits, security patches, analytics reporting, and ad creative refreshes are included. Many low-cost providers offer little ongoing care, putting security and rankings at risk by year two post-launch.
- After: At CiCon Marketing, website projects are one-time fees. Ongoing maintenance — technical audits, security patches, and analytics reporting — is quoted separately as a monthly service. Many low-cost providers offer little ongoing care, putting security and rankings at risk by year two post-launch.
