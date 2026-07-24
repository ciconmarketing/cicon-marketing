/**
 * Quality-gate tests for the areas-served content model.
 * Run: npm run test:areas
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  AREA_PAGES,
  COVERAGE_AREAS,
  getPublishedAreas,
  validateAreaPages,
  type ServiceAreaPage,
} from '../../src/lib/areas-served'

function clone(p: ServiceAreaPage): ServiceAreaPage {
  return JSON.parse(JSON.stringify(p))
}

test('real data passes the quality gate', () => {
  assert.doesNotThrow(() => validateAreaPages())
})

test('only proof-backed pages are published and indexable', () => {
  const published = getPublishedAreas()
  assert.deepEqual(
    published.map((p) => p.slug).sort(),
    ['richmond-hill', 'vaughan'],
    'published set changed — update this test only alongside a deliberate publish decision'
  )
  for (const p of published) {
    assert.ok(p.localProof.some((x) => x.approved), `${p.slug} must have approved proof`)
  }
})

test('draft pages are never indexable', () => {
  for (const p of AREA_PAGES.filter((x) => x.status === 'draft')) {
    assert.equal(p.indexable, false, `${p.slug} is draft and must not be indexable`)
  }
})

test('Whitby is banned everywhere', () => {
  const everything = JSON.stringify({ AREA_PAGES, COVERAGE_AREAS }).toLowerCase()
  assert.ok(!everything.includes('whitby'), 'Whitby was removed from GBP service areas 2026-07-24')

  const bad = clone(AREA_PAGES[0])
  bad.slug = 'whitby'
  bad.cityName = 'Whitby'
  assert.throws(() => validateAreaPages([...AREA_PAGES, bad]), /banned area/)
})

test('gate rejects indexable page without approved proof', () => {
  const bad = clone(AREA_PAGES.find((p) => p.slug === 'thornhill')!)
  bad.slug = 'testville'
  bad.cityName = 'Testville'
  bad.status = 'published'
  bad.indexable = true
  bad.localProof = [{ kind: 'client', label: 'placeholder', approved: false }]
  bad.title = 'Digital Marketing Agency Serving Testville, ON | CiCon x'.padEnd(56, 'x').slice(0, 56)
  bad.faqs = bad.faqs.map((f, i) => ({ ...f, question: `Testville unique question ${i}?` }))
  assert.throws(() => validateAreaPages([...AREA_PAGES, bad]), /APPROVED localProof/)
})

test('gate rejects out-of-range metadata lengths', () => {
  const bad = clone(AREA_PAGES[0])
  bad.slug = 'badmeta'
  bad.cityName = 'Badmeta'
  bad.status = 'draft'
  bad.indexable = false
  bad.title = 'Too short'
  bad.faqs = bad.faqs.map((f, i) => ({ ...f, question: `Badmeta unique question ${i}?` }))
  assert.throws(() => validateAreaPages([...AREA_PAGES, bad]), /title must be 55–62/)
})

test('gate rejects FAQ text duplicated across cities', () => {
  const bad = clone(AREA_PAGES.find((p) => p.slug === 'aurora')!)
  bad.slug = 'dupe-faq'
  bad.cityName = 'Dupe'
  bad.status = 'draft'
  bad.indexable = false
  // keep aurora's FAQ questions verbatim → cross-city duplicate
  assert.throws(() => validateAreaPages([...AREA_PAGES, bad]), /duplicated across cities/)
})

test('gate rejects unknown nearbyAreas slugs', () => {
  const bad = clone(AREA_PAGES[0])
  bad.slug = 'badnearby'
  bad.cityName = 'Badnearby'
  bad.status = 'draft'
  bad.indexable = false
  bad.nearbyAreas = ['atlantis']
  bad.faqs = bad.faqs.map((f, i) => ({ ...f, question: `Badnearby unique question ${i}?` }))
  assert.throws(() => validateAreaPages([...AREA_PAGES, bad]), /unknown slug/)
})

test('no page implies a local office outside Richmond Hill', () => {
  for (const p of AREA_PAGES.filter((x) => x.slug !== 'richmond-hill')) {
    const all = [p.summary, ...p.localContext, ...p.faqs.map((f) => f.answer)].join(' ').toLowerCase()
    assert.ok(!all.includes(`our ${p.cityName.toLowerCase()} office`), `${p.slug} implies an office`)
  }
})

test('summaries are standalone (name the business and the base)', () => {
  for (const p of AREA_PAGES) {
    assert.ok(p.summary.includes('CiCon Marketing'), `${p.slug} summary must name the business`)
    assert.ok(/richmond hill/i.test(p.summary), `${p.slug} summary must disclose the Richmond Hill base`)
  }
})
