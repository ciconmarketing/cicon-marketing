/**
 * Quality-gate tests for the areas-served content, fetched live from Sanity
 * (`serviceArea` documents + the `areasServedHub` singleton — content is
 * CMS-backed, not repo-side literals). Run: npm run test:areas
 */
import { test, before } from 'node:test'
import assert from 'node:assert/strict'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@sanity/client'
import { validateAreaPages, type ServiceAreaData } from '../../src/lib/areas-served'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '../../')

function loadDotEnv() {
  const envPath = path.join(ROOT, '.env.local')
  if (!fs.existsSync(envPath)) return
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '')
    if (!process.env[key]) process.env[key] = val
  }
}
loadDotEnv()

const projectId = (process.env.PUBLIC_SANITY_PROJECT_ID ?? '').trim()
const dataset = (process.env.PUBLIC_SANITY_DATASET ?? 'production').trim()

const SERVICE_AREA_FIELDS = `
  _id, cityName, officialName, "slug": slug.current, region, tier, status,
  hasDedicatedPage, indexable, lastReviewed,
  metaTitle, metaDescription, "canonical": canonicalOverride, "ogImageUrl": ogImage.asset->url,
  hubCardLine, eyebrow, h1, summary,
  localContext,
  bestFitIndustries[]{ name, note },
  featuredServices[]{ "slug": service->slug.current, "title": service->title, angle },
  faqs[]{ question, answer },
  localProof[]{ kind, label, href, approved },
  nearbyAreas[]->{ "slug": slug.current, cityName, status, hasDedicatedPage, indexable }
`

let areas: ServiceAreaData[] = []

before(async () => {
  if (!projectId) throw new Error('PUBLIC_SANITY_PROJECT_ID missing — check .env.local')
  const client = createClient({ projectId, dataset, useCdn: false, apiVersion: '2024-01-01' })
  areas = await client.fetch<ServiceAreaData[]>(`*[_type == "serviceArea"] | order(cityName asc){ ${SERVICE_AREA_FIELDS} }`)
})

test('Sanity returned all 16 GBP-list areas', () => {
  assert.equal(areas.length, 16, `expected 16 serviceArea docs, got ${areas.length}`)
})

test('live data passes the quality gate', () => {
  assert.doesNotThrow(() => validateAreaPages(areas))
})

test('only proof-backed pages are published and indexable', () => {
  const published = areas.filter((p) => p.hasDedicatedPage && p.status === 'published' && p.indexable)
  assert.deepEqual(
    published.map((p) => p.slug).sort(),
    // markham + thornhill published 2026-07-24 with MJ-approved client-city
    // attribution; aurora/newmarket/north-york remain drafts.
    ['markham', 'richmond-hill', 'thornhill', 'vaughan'],
    'published set changed in Sanity — update this test only alongside a deliberate publish decision'
  )
  for (const p of published) {
    assert.ok((p.localProof ?? []).some((x) => x.approved), `${p.slug} must have approved proof`)
  }
})

test('draft pages are never indexable', () => {
  for (const p of areas.filter((x) => x.hasDedicatedPage && x.status === 'draft')) {
    assert.equal(p.indexable, false, `${p.slug} is draft and must not be indexable`)
  }
})

test('Whitby is banned everywhere', () => {
  const everything = JSON.stringify(areas).toLowerCase()
  assert.ok(!everything.includes('whitby'), 'Whitby was removed from GBP service areas 2026-07-24')

  const bad: ServiceAreaData = {
    ...areas[0],
    _id: 'test-whitby',
    slug: 'whitby',
    cityName: 'Whitby',
  }
  assert.throws(() => validateAreaPages([...areas, bad]), /banned area/)
})

test('gate rejects indexable page without approved proof', () => {
  const template = areas.find((p) => p.slug === 'thornhill')!
  const bad: ServiceAreaData = {
    ...template,
    _id: 'test-testville',
    slug: 'testville',
    cityName: 'Testville',
    status: 'published',
    indexable: true,
    localProof: [{ kind: 'client', label: 'placeholder', approved: false }],
    faqs: (template.faqs ?? []).map((f, i) => ({ ...f, question: `Testville unique question ${i}?` })),
  }
  assert.throws(() => validateAreaPages([...areas, bad]), /APPROVED localProof/)
})

test('gate rejects out-of-range metadata lengths', () => {
  const template = areas[0]
  const bad: ServiceAreaData = {
    ...template,
    _id: 'test-badmeta',
    slug: 'badmeta',
    cityName: 'Badmeta',
    status: 'draft',
    indexable: false,
    metaTitle: 'Too short',
    faqs: (template.faqs ?? []).map((f, i) => ({ ...f, question: `Badmeta unique question ${i}?` })),
  }
  assert.throws(() => validateAreaPages([...areas, bad]), /metaTitle must be 55–62/)
})

test('gate rejects FAQ text duplicated across cities', () => {
  const template = areas.find((p) => p.slug === 'aurora')!
  const bad: ServiceAreaData = {
    ...template,
    _id: 'test-dupe-faq',
    slug: 'dupe-faq',
    cityName: 'Dupe',
    status: 'draft',
    indexable: false,
    // keep aurora's FAQ questions verbatim -> cross-city duplicate
  }
  assert.throws(() => validateAreaPages([...areas, bad]), /duplicated across cities/)
})

test('no page implies a local office outside Richmond Hill', () => {
  for (const p of areas.filter((x) => x.hasDedicatedPage && x.slug !== 'richmond-hill')) {
    const all = [p.summary ?? '', ...(p.localContext ?? []), ...(p.faqs ?? []).map((f) => f.answer)]
      .join(' ')
      .toLowerCase()
    assert.ok(!all.includes(`our ${p.cityName.toLowerCase()} office`), `${p.slug} implies an office`)
  }
})

test('summaries are standalone (name the business and the base)', () => {
  for (const p of areas.filter((x) => x.hasDedicatedPage)) {
    assert.ok(p.summary?.includes('CiCon Marketing'), `${p.slug} summary must name the business`)
    assert.ok(/richmond hill/i.test(p.summary ?? ''), `${p.slug} summary must disclose the Richmond Hill base`)
  }
})

test('hub-only areas render no page-content fields', () => {
  for (const p of areas.filter((x) => !x.hasDedicatedPage)) {
    assert.ok(p.hubCardLine, `${p.slug} needs a hubCardLine`)
    assert.equal(p.indexable, false, `${p.slug} is hub-only and must not be indexable`)
  }
})
