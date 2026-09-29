/**
 * Rendered-HTML checks for the published service prices.
 *
 * Fetches pages from a running server and compares what a visitor (and a
 * crawler) actually receives against SERVICE_PRICING:
 *   - the hub shows 14 cards with the right offers, units and notes;
 *   - every service page has a hero price beside the CTA, a #pricing section,
 *     a matching cost FAQ, and Offer JSON-LD that matches the visible price;
 *   - no page in the sitemap still carries a retired CiCon price or claim.
 *
 * Run against the local content preview:
 *   npm run dev:local-content -- --port 4400      (in another terminal)
 *   PRICING_TEST_BASE_URL=http://localhost:4400 npm run test:pricing
 */
import { test, describe, before } from 'node:test'
import assert from 'node:assert/strict'
import * as cheerio from 'cheerio'
import {
  SERVICE_PRICING, HUB_PRICING_NOTE, AD_SPEND_NOTE, SETUP_NOTE,
  priceText, amountText, type ServiceOffer,
} from '../../src/lib/service-pricing'

const BASE = (process.env.PRICING_TEST_BASE_URL ?? 'http://localhost:4400').replace(/\/$/, '')
const SLUGS = Object.keys(SERVICE_PRICING)
const norm = (s: string) => s.replace(/\s+/g, ' ').trim()

const pages = new Map<string, { status: number; html: string }>()
async function get(path: string) {
  if (!pages.has(path)) {
    const res = await fetch(BASE + path, { redirect: 'manual' })
    pages.set(path, { status: res.status, html: res.status === 200 ? await res.text() : '' })
  }
  return pages.get(path)!
}

function jsonLd($: cheerio.CheerioAPI): any[] {
  const nodes: any[] = []
  $('script[type="application/ld+json"]').each((_, el) => {
    const data = JSON.parse($(el).text()) // throws on invalid JSON-LD
    const graph = Array.isArray(data) ? data : data['@graph'] ?? [data]
    nodes.push(...graph)
  })
  return nodes
}

function expectedNotes(offer: ServiceOffer): string[] {
  return [
    ...(offer.qualifier ? [offer.qualifier] : []),
    ...(offer.adSpendExcluded ? [AD_SPEND_NOTE] : []),
    ...(offer.setupNotIncluded ? [SETUP_NOTE] : []),
  ]
}

function assertOfferJsonLd(node: any, offer: ServiceOffer, where: string) {
  assert.equal(node['@type'], 'Offer', `${where}: @type`)
  assert.ok(node['@id'].endsWith(`#offer-${offer.id}`), `${where}: @id ${node['@id']}`)
  assert.equal(node.price, undefined, `${where}: must not set an exact price`)
  assert.equal(node.priceCurrency, 'CAD', `${where}: priceCurrency`)
  const spec = node.priceSpecification
  assert.equal(spec.minPrice, offer.amount, `${where}: minPrice`)
  assert.equal(spec.maxPrice, undefined, `${where}: no invented maxPrice`)
  assert.equal(spec.priceCurrency, 'CAD', `${where}: spec currency`)
  assert.equal(spec.billingDuration, undefined, `${where}: billingDuration is not a contract term`)
  if (offer.unit === 'month') assert.equal(spec.unitCode, 'MON', `${where}: monthly unit`)
  else assert.equal(spec.unitText, offer.unitNoun, `${where}: unit ${offer.unit}`)
  assert.match(node.description, /^Starting price\./, `${where}: says starting price`)
  if (offer.adSpendExcluded) assert.match(node.description, /Ad spend excluded\./, `${where}: ad spend note`)
  if (offer.setupNotIncluded) assert.match(node.description, /Setup is not included\./, `${where}: setup note`)
  else assert.doesNotMatch(node.description, /Setup/, `${where}: no unrequested setup note`)
}

// ── Hub ─────────────────────────────────────────────────────────────────────
describe('services hub', () => {
  let $: cheerio.CheerioAPI
  before(async () => {
    const page = await get('/marketing-services/')
    assert.equal(page.status, 200)
    $ = cheerio.load(page.html)
  })

  test('shows 14 cards, one per priced service, in a full-card link', () => {
    const cards = $('[data-service-card]')
    assert.equal(cards.length, 14)
    const slugs = cards.map((_, el) => $(el).attr('data-service-card')).get().sort()
    assert.deepEqual(slugs, [...SLUGS].sort())
    cards.each((_, el) => {
      assert.equal(el.tagName, 'a')
      assert.equal($(el).find('a, button').length, 0, 'no nested links or buttons in a card')
    })
  })

  test('each card shows its offers, units and notes after the title', () => {
    $('[data-service-card]').each((_, el) => {
      const card = $(el)
      const slug = card.attr('data-service-card')!
      const pricing = SERVICE_PRICING[slug]
      const children = card.children().toArray()
      const titleIdx = children.findIndex((c) => c.tagName === 'h3')
      const priceIdx = children.findIndex((c) => $(c).find('[data-price-summary]').length > 0)
      assert.ok(titleIdx >= 0 && priceIdx === titleIdx + 1, `${slug}: price block directly after title`)
      const rows = card.find('[data-offer]')
      assert.equal(rows.length, pricing.offers.length, `${slug}: offer rows`)
      pricing.offers.forEach((offer, i) => {
        const row = rows.eq(i)
        assert.equal(row.attr('data-offer'), offer.id)
        assert.equal(norm(row.find('.ps-price').text()), priceText(offer), `${slug}: ${offer.id} price`)
        assert.deepEqual(row.find('.ps-note').map((_, n) => norm($(n).text())).get(), expectedNotes(offer), `${slug}: ${offer.id} notes`)
        if (pricing.offers.length > 1) assert.equal(norm(row.find('.ps-label').text()), offer.label, `${slug}: row label`)
      })
    })
  })

  test('pricing note, 14-service count, and no blanket budget rejection', () => {
    const text = norm($('body').text())
    assert.ok(text.includes(HUB_PRICING_NOTE), 'hub pricing note')
    assert.ok(text.includes('Your budget needs a focused plan. We help you choose a service and scope that fit your priorities.'))
    assert.ok(text.includes('14 services. One senior strategist.'))
    assert.ok(text.includes('We run 14 interconnected services'))
    assert.match(text, /14 Services under one roof/)
    assert.doesNotMatch(text, /\b8 services|\b8 interconnected|all-in/i)
    assert.match($('meta[name="description"]').attr('content') ?? '', /14 interconnected services/)
  })

  test('OfferCatalog JSON-LD matches the cards', () => {
    const nodes = jsonLd($)
    const catalog = nodes.find((n) => n['@type'] === 'OfferCatalog')
    assert.ok(catalog, 'OfferCatalog present')
    const org = nodes.find((n) => n['@type'] === 'Organization')
    assert.equal(org.hasOfferCatalog['@id'], catalog['@id'])
    assert.equal(catalog.itemListElement.length, 14)
    for (const svc of catalog.itemListElement) {
      const slug = svc.url.match(/marketing-services\/([^/]+)\//)[1]
      const pricing = SERVICE_PRICING[slug]
      assert.equal(svc.offers.length, pricing.offers.length, `${slug}: offers`)
      pricing.offers.forEach((o, i) => assertOfferJsonLd(svc.offers[i], o, `hub ${slug}`))
    }
  })
})

// ── Service pages ───────────────────────────────────────────────────────────
describe('service pages', () => {
  for (const slug of SLUGS) {
    const pricing = SERVICE_PRICING[slug]
    test(slug, async () => {
      const page = await get(`/marketing-services/${slug}/`)
      assert.equal(page.status, 200, 'route renders')
      const $ = cheerio.load(page.html)

      // Hero: price summary sits before the main WhatsApp CTA.
      const hero = $('#hero')
      const heroPrice = hero.find('[data-price-summary]')
      assert.equal(heroPrice.length, 1, 'hero price present')
      const heroHtml = hero.html()!
      assert.ok(heroHtml.indexOf('data-price-summary') < heroHtml.indexOf('wa.me/16475840800'), 'hero price precedes CTA')
      pricing.offers.forEach((offer, i) => {
        assert.equal(norm(heroPrice.find('.ps-price').eq(i).text()), priceText(offer), `hero ${offer.id}`)
      })

      // #pricing section: prices, units, notes, explanation, CTA.
      const section = $('section#pricing')
      assert.equal(section.length, 1, '#pricing section')
      const cards = section.find('[data-offer]')
      assert.equal(cards.length, pricing.offers.length)
      pricing.offers.forEach((offer, i) => {
        const card = cards.eq(i)
        assert.equal(norm(card.find('.pricing-price').text()), priceText(offer), `section ${offer.id}`)
        assert.deepEqual(card.find('ul li').map((_, n) => norm($(n).text())).get(), expectedNotes(offer), `section notes ${offer.id}`)
        if (offer.description) assert.ok(norm(card.text()).includes(offer.description))
      })
      const sectionText = norm(section.text())
      assert.ok(sectionText.includes(pricing.explanation), 'approved explanation shown')
      assert.ok(section.find('a[href="https://wa.me/16475840800"]').length === 1, 'WhatsApp CTA')
      assert.ok(section.find('a[href="tel:+12898071020"]').length === 1, 'phone CTA')
      for (const m of sectionText.matchAll(/\$[\d,]+(?!\d)/g)) {
        assert.equal(sectionText.slice(m.index!, m.index! + m[0].length + 4), `${m[0]} CAD`, `CAD after ${m[0]}`)
      }
      const anySetup = pricing.offers.some((o) => o.setupNotIncluded)
      assert.equal(/Setup is not included/.test(sectionText), anySetup, 'setup note only where specified')

      // Cost FAQ leads the visible FAQ and FAQPage JSON-LD, with the same text.
      const firstFaq = $('#faq details').first()
      assert.equal(norm(firstFaq.find('summary').text()), pricing.costQuestion)
      assert.ok(norm(firstFaq.text()).includes(pricing.explanation))
      assert.ok(firstFaq.is('[open]'), 'cost answer is open by default')
      const nodes = jsonLd($)
      const faqPage = nodes.find((n) => n['@type'] === 'FAQPage')
      assert.equal(faqPage.mainEntity[0].name, pricing.costQuestion)
      assert.equal(faqPage.mainEntity[0].acceptedAnswer.text, pricing.explanation)
      const visibleQs = $('#faq summary').map((_, el) => norm($(el).text())).get()
      assert.deepEqual(faqPage.mainEntity.map((q: any) => q.name), visibleQs, 'FAQ JSON-LD = visible FAQ')
      const costFaqs = visibleQs.filter((q) => /\b(cost|price|pricing|budget)\b/i.test(q))
      assert.deepEqual(costFaqs, [pricing.costQuestion], 'one cost question in the FAQ')
      const paaQs = $('details').not('#faq details').map((_, el) => norm($(el).find('summary').text())).get()
      assert.equal(paaQs.filter((q) => /\bhow much\b|\bcost\b/i.test(q)).length, 0, 'no duplicate cost answer in Quick Answers')

      // Service JSON-LD offers match the visible prices; no price-0 offer.
      const service = nodes.find((n) => n['@type'] === 'Service')
      assert.equal(service.provider['@id'], 'https://cicon.ca/#organization')
      assert.equal(service.offers.length, pricing.offers.length)
      pricing.offers.forEach((o, i) => assertOfferJsonLd(service.offers[i], o, slug))
      assert.doesNotMatch(page.html, /"price":\s*0/, 'no price-0 Offer')

      // Monthly vs one-time wording never swaps.
      const pageText = norm($('body').text())
      for (const o of pricing.offers) {
        const bad = o.unit === 'month' ? `${amountText(o)} · one-time` : `${amountText(o)}/month`
        assert.ok(!pageText.includes(bad), `wrong unit: ${bad}`)
      }
    })
  }
})

// ── Site-wide sweep ─────────────────────────────────────────────────────────
// Retired CiCon offers and claims that must not appear on any public page.
const RETIRED: Array<[RegExp, string]> = [
  [/all-in \(management fee \+ ad spend\)/i, 'paid ads $1,500 all-in'],
  [/includes strategy, management fees, and ad spend/i, 'dental all-in'],
  [/start at \$1,500\/month all-in/i, 'dental/paid all-in'],
  [/budget is under \$1,500\/month all-in/i, 'budget rejection'],
  [/Below \$1,500\/month all-in/i, 'budget rejection'],
  [/minimum all-in budget/i, 'blog all-in minimum'],
  [/\(e\.g\., CiCon\)/, 'CiCon price incl. ad spend'],
  [/covering ad spend and management/i, 'fee covering ad spend'],
  [/Starting at \$3,800/i, 'old website price'],
  [/\$3,500 for a 5.8 page/i, 'old website price'],
  [/\$1,200 for a single landing page/i, 'old landing page price'],
  [/\$800.\$1,200 CAD/, 'old starter range'],
  [/\$2,000.\$3,000, and the same build|\$6,500.\$9,500/, 'old web tiers'],
  [/E-Commerce & High-Feature|e-commerce and payment gateways|E-commerce and high-feature builds/i, 'ecommerce web offer'],
  [/content-update training|recorded training|recorded walkthrough|train your team (during|on the CMS)|training on CMS/i, 'CMS training promise'],
  [/Both packages/i, 'two-package wording'],
  [/\$2,000\) gives you|\$3,500\+\/month/i, 'old CRO prices'],
  [/start at \$2,000 for a one-time audit/i, 'old CRO prices'],
  [/\$10,000\/month in ad spend effectively gives you/i, 'faulty CRO example'],
  [/minimum engagement is \$1,000|\$2,500\/month for ongoing advisory|start at \$1,000 for a one-time audit/i, 'old consultant prices'],
  [/One-time setups start at \$3,500|starts at \$3,500 for foundational|runs \$1,200-\$2,500\/month/i, 'old martech prices'],
  [/starts at \$1,500\/month for 4 long-form|\$5,000-\$10,000\/month depending on scope/i, 'old content prices'],
  [/4-8 long-form blog posts per month|4-8\/month/i, 'content quota'],
  [/Our standard packages include 3.5 posts/i, 'social quota'],
  [/Packages of 4, 8, or 12 clips/i, 'media clip packages'],
  [/100-300 keywords per client|4-8 high-DR backlinks/i, 'AI SEO quotas'],
  [/smallest engagements start around \$1,500/i, 'old contact minimum'],
  [/fixed-rate packages/i, 'fixed-rate claim'],
  [/monthly retainers starting around \$1,500/i, 'dental retainer without ad-spend rule'],
  [/No setup fees\. No cancellation fees/i, 'unapproved fee policy'],
  [/\b8 services\b|\b8 interconnected|13 interconnected/i, 'old service count'],
  [/CiCon builds with both/i, 'Shopify ecommerce offer'],
  [/"price":\s*0\b/, 'price-0 Offer'],
  [/2.5× Typical conversion lift|Typical conversion lift|lift conversion 20.50%/i, 'unsourced CRO lift claim'],
  [/Typical result:\s*30.50% reduction in form abandonment/i, 'unsourced CRO form-abandonment claim'],
]

describe('site-wide sweep (every sitemap URL + key pages)', () => {
  let paths: string[] = []
  before(async () => {
    const index = await get('/sitemap.xml')
    assert.equal(index.status, 200)
    const childMaps = [...index.html.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname)
    const found = new Set<string>(['/', '/marketing-services/', '/contact-us/', '/faq/', '/about-us/'])
    for (const map of childMaps) {
      const xml = await get(map)
      for (const m of xml.html.matchAll(/<loc>([^<]+)<\/loc>/g)) found.add(new URL(m[1]).pathname)
    }
    paths = [...found].sort()
  })

  test('every page renders, has valid JSON-LD, and carries no retired price or claim', async () => {
    assert.ok(paths.length > 40, `sitemap coverage (${paths.length})`)
    const problems: string[] = []
    for (const path of paths) {
      const page = await get(path)
      if (page.status !== 200) { problems.push(`${path}: HTTP ${page.status}`); continue }
      const $ = cheerio.load(page.html)
      try { jsonLd($) } catch (e) { problems.push(`${path}: invalid JSON-LD (${(e as Error).message})`) }
      $('script:not([type="application/ld+json"]), style').remove()
      const haystack = norm($.root().text()) + ' ' + page.html.match(/<head[\s\S]*?<\/head>/)?.[0]
      for (const [re, why] of RETIRED) if (re.test(haystack)) problems.push(`${path}: ${why} (${re})`)
    }
    assert.deepEqual(problems, [])
  })

  test('contact and FAQ cost answers match the price list', async () => {
    const lowestMonthly = Math.min(...Object.values(SERVICE_PRICING).flatMap((p) => p.offers).filter((o) => o.unit === 'month').map((o) => o.amount))
    const lowestOneTime = Math.min(...Object.values(SERVICE_PRICING).flatMap((p) => p.offers).filter((o) => o.unit === 'one-time').map((o) => o.amount))
    for (const path of ['/contact-us/', '/faq/']) {
      const $ = cheerio.load((await get(path)).html)
      const text = norm($('body').text())
      assert.ok(text.includes(`$${lowestMonthly.toLocaleString('en-CA')} CAD per month`), `${path}: lowest monthly`)
      assert.ok(text.includes(`$${lowestOneTime.toLocaleString('en-CA')} CAD`), `${path}: lowest one-time`)
      assert.ok(text.includes('ad spend is always excluded') || text.includes('Ad spend is always excluded'), `${path}: ad spend rule`)
      const faq = jsonLd($).find((n) => n['@type'] === 'FAQPage')
      const costQ = faq.mainEntity.find((q: any) => /minimum engagement|How much does it cost/i.test(q.name))
      assert.ok(costQ, `${path}: cost question in JSON-LD`)
      assert.ok(text.includes(norm(costQ.acceptedAnswer.text)), `${path}: JSON-LD answer is visible`)
    }
  })
})
