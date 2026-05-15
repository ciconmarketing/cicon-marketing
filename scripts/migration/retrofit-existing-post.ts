/**
 * retrofit-existing-post.ts
 * Pipeline A: scrape a live cicon.ca post, transform to full Portable Text,
 * and patch the existing Sanity stub with rich content.
 *
 * Usage:
 *   npx tsx scripts/migration/retrofit-existing-post.ts <url>
 *
 * Example:
 *   npx tsx scripts/migration/retrofit-existing-post.ts https://cicon.ca/local-seo-agency-toronto-guide-2026/
 */

import * as cheerio from 'cheerio'
import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { randomUUID } from 'crypto'

// ── Sanity client ─────────────────────────────────────────────────────────────

const sanity = createClient({
  projectId: '26ol0sqj',
  dataset: 'cicon-marketing',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
})

// ── Entity dictionary ─────────────────────────────────────────────────────────

interface Entity {
  term: string
  schemaType?: string
  aliases: string[]
  wikipedia: string | null
}

interface EntityDict {
  brands_products: Entity[]
  geographic: Entity[]
  industry_concepts: Entity[]
  dental_vertical: Entity[]
}

const ENTITIES_PATH = resolve(process.cwd(), 'src/lib/entities.json')
const entityDict: EntityDict = JSON.parse(readFileSync(ENTITIES_PATH, 'utf-8'))
const allEntities: Entity[] = [
  ...entityDict.brands_products,
  ...entityDict.geographic,
  ...entityDict.industry_concepts,
  ...entityDict.dental_vertical,
]

// ── Elementor content selectors ──────────────────────────────────────────────
// cicon.ca is built on Elementor. Article content lives in these two widget types
// inside main#content — everything outside this scope is nav/footer/scripts/nonces.

const CONTENT_SELECTOR =
  'main#content .elementor-widget-text-editor, main#content .elementor-widget-heading'

interface ContentWidget {
  type: 'heading' | 'text'
  text: string   // plain text — safe for regex / entity scoring
  html: string   // inner HTML — used for PT conversion
  headingLevel?: 2 | 3
}

/**
 * Boilerplate patterns injected by the WordPress/Elementor template.
 * These appear as visible text in the DOM but are not article content.
 */
function isBoilerplate(text: string): boolean {
  return (
    /^Last Updated:?\s/i.test(text) ||
    /^Published:?\s/i.test(text) ||
    /^By\s+\w+/i.test(text)
  )
}

/**
 * Walk main#content in document order and collect every heading and
 * text-editor widget as a flat, ordered array.
 * Boilerplate widgets are silently dropped here so nothing downstream sees them.
 */
function collectWidgets($: cheerio.CheerioAPI): ContentWidget[] {
  const widgets: ContentWidget[] = []

  $(CONTENT_SELECTOR).each((_, el) => {
    const $el = $(el)

    if ($el.hasClass('elementor-widget-heading')) {
      // Pick the heading element (h2 or h3); fall back to any heading tag
      const hEl = $el.find('h2, h3, h4').first()
      const tag = (hEl.get(0) as cheerio.Element)?.tagName?.toLowerCase() ?? 'h2'
      const level: 2 | 3 = tag === 'h3' || tag === 'h4' ? 3 : 2
      const text = hEl.text().trim()
      if (text && !isBoilerplate(text)) {
        widgets.push({ type: 'heading', text, html: hEl.html() ?? text, headingLevel: level })
      }
    } else {
      // text-editor widget: Elementor nests content inside .elementor-text-editor
      // (inside .elementor-widget-container). Try from innermost out.
      // NOTE: on cicon.ca both inner selectors return empty — only $el.html() works.
      const inner =
        $el.find('.elementor-text-editor').html()?.trim() ||
        $el.find('.elementor-widget-container').html()?.trim() ||
        $el.html()?.trim() ||
        ''
      let text = $el.text().trim()
      if (!text) return

      if (isBoilerplate(text)) {
        // SHORT widget that IS boilerplate (e.g. standalone "Last Updated: May 2026") → drop entirely.
        // LONG widget that merely STARTS with boilerplate (e.g. post #9 where the entire
        // article is one widget beginning with "Last Updated: April 2026Quick Answer…") → strip
        // the date prefix and keep the rest.
        if (text.length < 120) return  // short → pure boilerplate, skip

        // Strip leading "Last Updated: Month YYYY" or "Published: …" prefix.
        // The date token may be glued directly to the next word (no space), e.g.
        // "Last Updated: April 2026Quick Answer…"
        text = text
          .replace(/^(?:Last Updated|Published):?\s*\w+\s+\d{4}/i, '')
          .replace(/^By\s+\w+[^\n]*/i, '')
          .trim()
        if (!text) return
      }

      widgets.push({ type: 'text', text, html: inner })
    }
  })

  return widgets
}

/**
 * Build a clean HTML string from the widget list, skipping:
 *  - the FAQ section (handled separately)
 *  - the Quick Answer source widget (already extracted into its own field)
 *
 * @param quickAnswerSource - exact .text() of the widget used as Quick Answer;
 *   pass '' if Quick Answer came from a pattern match rather than a dedicated widget.
 */
function buildBodyHtml(widgets: ContentWidget[], quickAnswerSource: string = ''): string {
  const parts: string[] = []
  let inFaqSection = false

  for (const widget of widgets) {
    if (widget.type === 'heading') {
      if (/frequently asked questions|faqs?|common questions/i.test(widget.text)) {
        inFaqSection = true
        continue
      }
      if (inFaqSection) inFaqSection = false // new heading ends FAQ section
      parts.push(`<h${widget.headingLevel}>${widget.html}</h${widget.headingLevel}>`)
    } else if (!inFaqSection) {
      // Skip the widget that was extracted as Quick Answer
      if (quickAnswerSource && widget.text === quickAnswerSource) continue
      // Use the inner HTML; fall back to a plain paragraph
      parts.push(widget.html || `<p>${widget.text}</p>`)
    }
  }

  return parts.join('\n')
}

// ── Category map (slug pattern → Sanity category _id) ────────────────────────
// IDs confirmed from Sanity seed

const CATEGORY_IDS: Record<string, string> = {
  'local-seo': 'b4fcd607-9037-473d-8de3-90602f6aff14',
  'paid-advertising': 'c3e88af0-d332-4322-a01d-87802f5489b7',
  'dental-marketing': '977a12da-2e32-4826-8a47-38c8ebe58464',
  'content-seo': '4ec165c0-6671-405c-a2ff-0f278942c1d4',
  'strategy-growth': '443c883b-d0dd-4b11-96ab-edf1d4ba7bff',
  'social-media': 'e527bc40-9962-4c24-b10c-cbb5eae0dfe2',
}

function mapSlugToCategory(slug: string): string {
  if (/^(local-seo|seo-optimization-near-me|cafe-for-working|why-local-seo)/.test(slug))
    return CATEGORY_IDS['local-seo']
  if (/^(meta-ads|google-ads)/.test(slug))
    return CATEGORY_IDS['paid-advertising']
  if (/^dental-/.test(slug))
    return CATEGORY_IDS['dental-marketing']
  if (/^social-media/.test(slug))
    return CATEGORY_IDS['social-media']
  if (/^digital-marketing-agency/.test(slug))
    return CATEGORY_IDS['strategy-growth']
  return CATEGORY_IDS['strategy-growth'] // fallback
}

// ── Portable Text block builders ──────────────────────────────────────────────

type PTBlock = {
  _type: string
  _key: string
  [key: string]: unknown
}

let _keyCounter = 0
function key(): string {
  return `k${Date.now()}${(_keyCounter++).toString(36)}`
}

function textBlock(text: string, style: string = 'normal', listItem?: string, level?: number): PTBlock {
  const block: PTBlock = {
    _type: 'block',
    _key: key(),
    style,
    children: [{ _type: 'span', _key: key(), text, marks: [] }],
    markDefs: [],
  }
  if (listItem) {
    block.listItem = listItem
    block.level = level ?? 1
  }
  return block
}

function richBlock(children: unknown[], style: string = 'normal', markDefs: unknown[] = [], listItem?: string, level?: number): PTBlock {
  const block: PTBlock = {
    _type: 'block',
    _key: key(),
    style,
    children,
    markDefs,
  }
  if (listItem) {
    block.listItem = listItem
    block.level = level ?? 1
  }
  return block
}

// ── Parse inline HTML spans (strong, em, a) to PT children ───────────────────

function parseInlineChildren(
  $el: cheerio.Cheerio<cheerio.AnyNode>,
  $: cheerio.CheerioAPI
): { children: unknown[]; markDefs: unknown[] } {
  const children: unknown[] = []
  const markDefs: unknown[] = []

  $el.contents().each((_, node) => {
    if (node.type === 'text') {
      const text = (node as cheerio.Text).data ?? ''
      if (text) children.push({ _type: 'span', _key: key(), text, marks: [] })
    } else if (node.type === 'tag') {
      const el = $(node)
      const tag = (node as cheerio.Element).tagName?.toLowerCase()
      if (tag === 'strong' || tag === 'b') {
        const text = el.text()
        if (text) children.push({ _type: 'span', _key: key(), text, marks: ['strong'] })
      } else if (tag === 'em' || tag === 'i') {
        const text = el.text()
        if (text) children.push({ _type: 'span', _key: key(), text, marks: ['em'] })
      } else if (tag === 'a') {
        const href = el.attr('href') ?? ''
        const linkKey = key()
        markDefs.push({ _type: 'link', _key: linkKey, href })
        const text = el.text()
        if (text) children.push({ _type: 'span', _key: key(), text, marks: [linkKey] })
      } else {
        const text = el.text()
        if (text) children.push({ _type: 'span', _key: key(), text, marks: [] })
      }
    }
  })

  return { children, markDefs }
}

// ── GEO Rule 1: detect enumerative paragraphs and convert to bullets ──────────

function shouldConvertToBullets(text: string): string[] | null {
  const ENUM_SIGNALS = ['such as', 'including', 'for example', 'like', 'namely']
  const hasSignal = ENUM_SIGNALS.some(s => text.toLowerCase().includes(s))
  const commaChunks = text.split(/,\s*/)
  if (commaChunks.length >= 3 && hasSignal) {
    // Extract the intro and the items
    const colonIdx = text.indexOf(':')
    if (colonIdx > -1) {
      return text
        .slice(colonIdx + 1)
        .split(/[,;]\s*/)
        .map(s => s.replace(/\s+and\s+/i, '').trim())
        .filter(s => s.length > 2)
    }
  }
  // Semicolon-delimited items without a signal phrase
  const semiChunks = text.split(/;\s*/)
  if (semiChunks.length >= 3 && semiChunks.every(c => c.trim().length > 0)) {
    return semiChunks.map(s => s.trim()).filter(Boolean)
  }
  return null
}

// ── GEO Rule 2: entity bolding within a section ───────────────────────────────

interface EntityBoldResult {
  text: string
  entities: string[]
}

function boldEntitiesInText(
  text: string,
  usedInSection: Set<string>
): EntityBoldResult {
  let result = text
  const boldedHere: string[] = []

  // Sort by term length desc so longer matches take precedence
  const sorted = [...allEntities].sort((a, b) => b.term.length - a.term.length)

  for (const entity of sorted) {
    const allTerms = [entity.term, ...entity.aliases]
    for (const term of allTerms) {
      const termKey = entity.term.toLowerCase()
      if (usedInSection.has(termKey)) break
      const regex = new RegExp(`\\b(${escapeRegex(term)})\\b`, 'i')
      if (regex.test(result)) {
        result = result.replace(regex, `__BOLD_START__$1__BOLD_END__`)
        usedInSection.add(termKey)
        boldedHere.push(term)
        break
      }
    }
  }

  return { text: result, entities: boldedHere }
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function parseTextWithBolding(
  raw: string,
  usedInSection: Set<string>
): { children: unknown[]; markDefs: unknown[]; bolded: string[] } {
  const { text, entities: bolded } = boldEntitiesInText(raw, usedInSection)

  const children: unknown[] = []
  const parts = text.split(/(__BOLD_START__|__BOLD_END__)/)
  let inBold = false

  for (const part of parts) {
    if (part === '__BOLD_START__') { inBold = true; continue }
    if (part === '__BOLD_END__') { inBold = false; continue }
    if (part) {
      children.push({
        _type: 'span', _key: key(),
        text: part,
        marks: inBold ? ['strong'] : [],
      })
    }
  }

  return { children, markDefs: [], bolded }
}

// ── Main HTML → Portable Text converter ──────────────────────────────────────

interface ConversionResult {
  blocks: PTBlock[]
  bulletConversions: number
  entityBoldCount: number
  notes: string[]
}

function htmlToPortableText(html: string): ConversionResult {
  const $ = cheerio.load(html)
  const blocks: PTBlock[] = []
  const notes: string[] = []
  let bulletConversions = 0
  let entityBoldCount = 0
  let usedInSection = new Set<string>()

  // Walk top-level elements
  $('body').children().each((_, el) => {
    const tag = (el as cheerio.Element).tagName?.toLowerCase()
    const $el = $(el)

    // ── Headings reset section entity tracking ────────────────────────────────
    if (tag === 'h2') {
      usedInSection = new Set()
      const text = $el.text().trim()
      if (text) blocks.push(textBlock(text, 'h2'))
      return
    }
    if (tag === 'h3') {
      const text = $el.text().trim()
      if (text) blocks.push(textBlock(text, 'h3'))
      return
    }

    // ── Paragraphs ────────────────────────────────────────────────────────────
    if (tag === 'p') {
      const text = $el.text().trim()
      if (!text) return

      // GEO Rule 1: check for bullet conversion
      const bulletItems = shouldConvertToBullets(text)
      if (bulletItems && bulletItems.length >= 3) {
        bulletConversions++
        notes.push(`GEO Rule 1: converted paragraph to ${bulletItems.length} bullets: "${text.slice(0, 60)}…"`)
        for (const item of bulletItems) {
          const { children, markDefs, bolded } = parseTextWithBolding(item, usedInSection)
          entityBoldCount += bolded.length
          blocks.push(richBlock(children, 'normal', markDefs, 'bullet', 1))
        }
        return
      }

      // GEO Rule 2: entity bolding
      const { children, markDefs, bolded } = parseTextWithBolding(text, usedInSection)
      entityBoldCount += bolded.length
      // Check if original had strong tags — if yes, use original inline parse
      if ($el.find('strong, b, a, em').length > 0) {
        const { children: richChildren, markDefs: richDefs } = parseInlineChildren($el, $)
        blocks.push(richBlock(richChildren, 'normal', richDefs))
      } else {
        blocks.push(richBlock(children, 'normal', markDefs))
      }
      return
    }

    // ── Unordered lists ───────────────────────────────────────────────────────
    if (tag === 'ul' || tag === 'ol') {
      const listItem = tag === 'ul' ? 'bullet' : 'number'
      $el.find('li').each((_, li) => {
        const text = $(li).text().trim()
        if (!text) return
        const { children, markDefs, bolded } = parseTextWithBolding(text, usedInSection)
        entityBoldCount += bolded.length
        blocks.push(richBlock(children, 'normal', markDefs, listItem, 1))
      })
      return
    }

    // ── Blockquote → pullQuote block ──────────────────────────────────────────
    if (tag === 'blockquote') {
      const quote = $el.text().trim()
      if (quote) {
        blocks.push({
          _type: 'pullQuote',
          _key: key(),
          quote,
          attribution: '',
        })
      }
      return
    }

    // ── Tables → comparisonTabs block ─────────────────────────────────────────
    if (tag === 'table') {
      const headers: string[] = []
      $el.find('thead th').each((_, th) => headers.push($(th).text().trim()))

      if (headers.length >= 2) {
        const tabs = headers.map((title, colIdx) => {
          const rows: unknown[] = []
          $el.find('tbody tr').each((_, tr) => {
            const cell = $(tr).find('td').eq(colIdx).text().trim()
            if (cell) {
              rows.push({
                _type: 'block',
                _key: key(),
                style: 'normal',
                children: [{ _type: 'span', _key: key(), text: cell, marks: [] }],
                markDefs: [],
              })
            }
          })
          return { _key: key(), title, body: rows }
        })

        blocks.push({
          _type: 'comparisonTabs',
          _key: key(),
          heading: '',
          tabs,
        })
        notes.push(`GEO: converted table with ${headers.length} columns to comparisonTabs`)
      }
      return
    }

    // ── Inline images ─────────────────────────────────────────────────────────
    if (tag === 'figure' || tag === 'img') {
      const img = tag === 'figure' ? $el.find('img').first() : $el
      const src = img.attr('src') ?? img.attr('data-src') ?? ''
      const alt = img.attr('alt') ?? ''
      const caption = $el.find('figcaption').text().trim()
      if (src && src.includes('cicon.ca')) {
        blocks.push({
          _type: 'inlineImage',
          _key: key(),
          url: src,
          alt,
          caption,
          tilt: blocks.filter(b => b._type === 'inlineImage').length % 2 === 0 ? 'left' : 'right',
        })
      }
      return
    }

    // ── Div containers — recurse into children ────────────────────────────────
    if (tag === 'div' || tag === 'section' || tag === 'article') {
      const inner = $el.html() ?? ''
      if (inner.trim()) {
        const nested = htmlToPortableText(inner)
        blocks.push(...nested.blocks)
        bulletConversions += nested.bulletConversions
        entityBoldCount += nested.entityBoldCount
        notes.push(...nested.notes)
      }
    }
  })

  return { blocks, bulletConversions, entityBoldCount, notes }
}

// ── Rule 2: Quick Answer extraction ──────────────────────────────────────────
// Scoped to article content widgets — never touches nav/footer/scripts.
// Returns sourceText so buildBodyHtml() can exclude the source widget from body.

function extractQuickAnswer(widgets: ContentWidget[]): { answer: string; weak: boolean; sourceText: string } {
  const articleText = widgets.map(w => w.text).join(' ')

  // Pattern 1: a widget whose text starts with "Quick Answer:" (explicit prefix)
  for (const widget of widgets) {
    if (widget.type === 'text' && /^quick answer:/i.test(widget.text)) {
      return {
        answer: widget.text.replace(/^quick answer:\s*/i, '').trim().slice(0, 500),
        weak: false,
        sourceText: widget.text,  // ← used by buildBodyHtml to skip this widget
      }
    }
  }

  // Pattern 2: "Quick Answer:" phrase anywhere in article text
  const m = articleText.match(/quick answer[:\s]+(.{80,400}?)(?:\.|$)/i)
  if (m) return { answer: m[1].trim().slice(0, 500), weak: false, sourceText: '' }

  // Pattern 3: first text widget with 80–400 chars (intro paragraph — weak)
  const textWidgets = widgets.filter(w => w.type === 'text')
  for (const widget of textWidgets.slice(0, 6)) {
    const p = widget.text
    if (p.length >= 80 && p.length <= 400) {
      return { answer: p.slice(0, 500), weak: true, sourceText: '' }
    }
    if (p.length > 400) {
      const sentences = p.match(/[^.!?]+[.!?]+/g) ?? []
      let built = ''
      for (const s of sentences) {
        if ((built + s).length > 400) break
        built += s + ' '
      }
      if (built.trim()) return { answer: built.trim().slice(0, 500), weak: true, sourceText: '' }
    }
  }

  if (textWidgets.length >= 1) {
    return { answer: textWidgets[0].text.slice(0, 500), weak: true, sourceText: '' }
  }

  return { answer: '', weak: true, sourceText: '' }
}

// ── Rule 8: FAQ extraction ────────────────────────────────────────────────────
// cicon.ca uses Elementor: each FAQ Q&A lives in its own .elementor-widget-text-editor
// widget. The question is the first sentence ending with "?" and the answer is
// everything after it — all in a single plain-text blob, no h3 or details/summary.

interface FaqItem {
  _key: string
  _type: 'faqItem'
  question: string
  answer: string
}

function extractFaqs(widgets: ContentWidget[]): { faqs: FaqItem[]; found: boolean } {
  const faqs: FaqItem[] = []
  let inFaqSection = false
  let found = false

  for (const widget of widgets) {
    if (widget.type === 'heading') {
      if (/frequently asked questions|faqs?|common questions/i.test(widget.text)) {
        inFaqSection = true
        found = true
        continue
      }
      if (inFaqSection) break // next heading ends the FAQ section
      continue
    }

    if (!inFaqSection) continue

    // This text-editor widget is one FAQ item.
    // Format: "QuestionText?Answer starts here…"
    const text = widget.text.trim()
    if (!text) continue

    const qMark = text.indexOf('?')
    if (qMark === -1) continue

    const question = text.slice(0, qMark + 1).trim()
    const answer = text.slice(qMark + 1).trim()

    if (question.length > 5 && answer.length > 10) {
      faqs.push({
        _key: randomUUID(),
        _type: 'faqItem',
        question: question.slice(0, 200),
        answer: answer.slice(0, 600),
      })
    }
  }

  return { faqs, found }
}

// ── Rule 9: End CTA stat detection ────────────────────────────────────────────
// Priority: % > $ > multiplier (x) > time span.
// Prefers stats in the first 30% of sentences (thesis stats appear early).
// Extracts the full sentence as context — rejects fragments / garbled extractions.
// Extracts source attribution when the sentence cites one.

interface StatResult {
  number: string
  context: string
  source: string
}

function detectStat(text: string): StatResult | null {
  // Split into individual sentences
  const sentences = text.match(/[^.!?\n]+[.!?]+/g) ?? []
  const total = sentences.length || 1

  interface Candidate {
    number: string
    context: string
    source: string
    priority: number   // lower = better (1=%, 2=$, 3=x, 4=time)
    position: number   // 0–1 fraction through article
  }

  const patterns: { regex: RegExp; priority: number }[] = [
    // NOTE: % is not a word char so trailing \b is omitted — it would never match.
    { regex: /\b(\d{1,3}(?:\.\d+)?%)(?!\d)/, priority: 1 },
    { regex: /(\$\d{1,3}(?:,\d{3})*(?:\+|\s*(?:per|\/)\s*\w+)?)/, priority: 2 },
    { regex: /\b(\d+x)\b/i, priority: 3 },
    { regex: /\b(\d+[-–]\d+\s+(?:months?|weeks?|days?))\b/i, priority: 4 },
  ]

  const candidates: Candidate[] = []

  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i].trim()
    if (!sentence) continue

    // Reject sentences that look like URLs, code, or nonces
    if (/https?:\/\/|[a-f0-9]{10,}|wp-content|elementor/i.test(sentence)) continue

    for (const { regex, priority } of patterns) {
      const m = sentence.match(regex)
      if (!m) continue

      // Full sentence is the context (stat included — no stripping)
      const context = sentence.slice(0, 160).trim()

      // Reject if the context doesn't contain the matched stat (sanity check)
      if (!context.includes(m[1])) continue

      // Reject obviously fragmented / comma-only contexts
      if (context.split(/\s+/).length < 5) continue

      // Extract source attribution (e.g. "According to Google…", "BrightLocal found…")
      const sourceMatch = sentence.match(
        /(?:according to|per |from |reported by|data from|study by|survey (?:by|from)|found by)\s+([A-Z][^,\.]{2,40})/i
      )
      const source = sourceMatch ? sourceMatch[1].trim() : ''

      candidates.push({
        number: m[1],
        context,
        source,
        priority,
        position: i / total,
      })
      break // one match per sentence
    }
  }

  if (!candidates.length) return null

  // Sort: priority asc, then early-article bias (first 30% wins ties)
  candidates.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority
    const aEarly = a.position <= 0.3 ? 0 : 1
    const bEarly = b.position <= 0.3 ? 0 : 1
    if (aEarly !== bEarly) return aEarly - bEarly
    return a.position - b.position
  })

  const best = candidates[0]
  return { number: best.number, context: best.context, source: best.source }
}

// ── Rule 10: About/Mentions entity frequency ──────────────────────────────────

interface EntityScore {
  entity: Entity
  count: number
}

function scoreEntities(text: string): EntityScore[] {
  const scores: EntityScore[] = []
  for (const entity of allEntities) {
    if (!entity.wikipedia) continue // spec: only entities with Wikipedia URLs
    const allTerms = [entity.term, ...entity.aliases]
    let count = 0
    for (const term of allTerms) {
      const regex = new RegExp(`\\b${escapeRegex(term)}\\b`, 'gi')
      const matches = text.match(regex)
      count += matches?.length ?? 0
    }
    if (count > 0) scores.push({ entity, count })
  }
  return scores.sort((a, b) => b.count - a.count)
}

// ── Rule 11: Related posts ────────────────────────────────────────────────────

async function findRelatedPosts(
  currentId: string,
  categoryId: string
): Promise<Array<{ _type: string; _ref: string; _key: string }>> {
  // Same category, newest 2
  const sameCat = await sanity.fetch<Array<{ _id: string }>>(`
    *[_type == "blogPost" && _id != $id && category._ref == $cat] | order(publishedAt desc)[0..1] { _id }
  `, { id: currentId, cat: categoryId })

  // Different category, newest 1
  const diffCat = await sanity.fetch<Array<{ _id: string }>>(`
    *[_type == "blogPost" && _id != $id && category._ref != $cat] | order(publishedAt desc)[0..0] { _id }
  `, { id: currentId, cat: categoryId })

  const refs = [...sameCat, ...diffCat].slice(0, 3).map(p => ({
    _type: 'reference',
    _ref: p._id,
    _key: key(),
  }))

  // Pad to 3 if needed
  if (refs.length < 3) {
    const more = await sanity.fetch<Array<{ _id: string }>>(`
      *[_type == "blogPost" && _id != $id && !(_id in $existing)] | order(publishedAt desc)[0..${2 - refs.length}] { _id }
    `, { id: currentId, existing: refs.map(r => r._ref) })
    more.forEach(p => refs.push({ _type: 'reference', _ref: p._id, _key: key() }))
  }

  return refs.slice(0, 3)
}

// ── Return type for batch runner ─────────────────────────────────────────────

export interface RetrofitResult {
  slug: string
  title: string
  sanityId: string
  wordCount: number
  readTime: number
  bodyBlocks: number
  faqCount: number
  bulletConversions: number
  entityBoldCount: number
  statNumber: string
  statContext: string
  statSource: string
  aboutEntities: string[]
  mentionsCount: number
  relatedPosts: number
  qaWeak: boolean
  notes: string[]
  error?: string
}

// ── Main per-post transformation ──────────────────────────────────────────────

export async function retrofitPost(url: string): Promise<RetrofitResult> {
  const slug = url.replace(/\/$/, '').split('/').pop() ?? ''
  console.log(`\n${'═'.repeat(60)}`)
  console.log(`POST: ${slug}`)
  console.log(`URL:  ${url}`)
  console.log(`${'═'.repeat(60)}`)

  // ── Step 1: Fetch HTML ─────────────────────────────────────────────────────
  console.log('\n① Fetching HTML…')
  const resp = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) CiCon/1.0 Retrofit' }
  })
  if (!resp.ok) throw new Error(`HTTP ${resp.status} for ${url}`)
  const html = await resp.text()
  const $ = cheerio.load(html)

  // ── Step 2: Extract metadata ───────────────────────────────────────────────
  console.log('② Extracting metadata…')
  const title = $('h1').first().text().trim() || $('title').text().trim()
  const ogImage = $('meta[property="og:image"]').attr('content') ?? ''
  const ogImageAlt = $('meta[property="og:image:alt"]').attr('content') ?? title
  const publishedAt = $('meta[property="article:published_time"]').attr('content')?.slice(0, 10) ?? ''
  const metaDesc = $('meta[name="description"]').attr('content') ?? ''

  // ── Step 3: Collect Elementor content widgets (scoped to main#content) ───────
  // Avoids nav, footer, JS nonces, and sidebar that pollute $('body').text().
  console.log('③ Collecting content widgets…')
  const widgets = collectWidgets($)
  const articleText = widgets.map(w => w.text).join(' ')
  console.log(`   Widgets collected: ${widgets.length} (article text: ${articleText.length} chars)`)

  // ── Step 4: Quick Answer extraction ───────────────────────────────────────
  console.log('④ Extracting Quick Answer…')
  const { answer: quickAnswer, weak: qaWeak, sourceText: qaSourceText } = extractQuickAnswer(widgets)

  // ── Step 5: FAQ extraction ─────────────────────────────────────────────────
  console.log('⑤ Extracting FAQs…')
  const { faqs, found: faqFound } = extractFaqs(widgets)
  console.log(`   FAQs found: ${faqs.length}`)

  // ── Step 6: HTML → Portable Text (body only; QA source + FAQ excluded) ─────
  console.log('⑥ Converting body → Portable Text…')
  const cleanBodyHtml = buildBodyHtml(widgets, qaSourceText)
  const { blocks, bulletConversions, entityBoldCount, notes: convNotes } = htmlToPortableText(cleanBodyHtml)

  // ── Step 7: Word count & read time (scoped to article widgets) ────────────
  const wordCount = articleText.trim().split(/\s+/).length
  const readTime = Math.ceil(wordCount / 225)

  // ── Step 8: End CTA stat detection (scoped to article text) ───────────────
  console.log('⑦ Detecting End CTA stat…')
  const statResult = detectStat(articleText)

  // ── Step 9: Entity scoring (scoped to article text) ───────────────────────
  console.log('⑧ Scoring entities…')
  const scores = scoreEntities(articleText)
  const aboutEntities = scores.slice(0, 3).map(s => ({
    _key: key(),
    _type: 'entityReference',
    name: s.entity.term,
    type: inferSchemaOrgType(s.entity),
    sameAs: s.entity.wikipedia!,
  }))
  const mentionsEntities = scores.slice(3, 11).map(s => ({
    _key: key(),
    _type: 'entityReference',
    name: s.entity.term,
    type: inferSchemaOrgType(s.entity),
    sameAs: s.entity.wikipedia!,
  }))

  // ── Step 10: Related posts ─────────────────────────────────────────────────
  console.log('⑨ Finding related posts…')
  const categoryId = mapSlugToCategory(slug)

  // Get existing Sanity doc _id
  const existing = await sanity.fetch<{ _id: string } | null>(
    `*[_type == "blogPost" && slug.current == $slug][0] { _id }`,
    { slug }
  )
  if (!existing) throw new Error(`No Sanity stub found for slug: ${slug}`)

  const relatedPosts = await findRelatedPosts(existing._id, categoryId)

  // ── Step 11: Build notes array ────────────────────────────────────────────
  const notes: string[] = []
  if (qaWeak) notes.push('Quick Answer auto-extracted — verify quality.')
  if (!faqFound) notes.push('No FAQ section detected in source — consider adding 4–6 Q&A items for E-E-A-T.')
  if (!statResult) notes.push('No stat detected — editor must add manually for End CTA block.')
  if (faqFound && faqs.length < 4) notes.push(`Only ${faqs.length} FAQ items extracted — consider adding more for E-E-A-T.`)
  notes.push(...convNotes)

  // ── Step 12: Validate ──────────────────────────────────────────────────────
  console.log('⑩ Validating…')
  const validationErrors: string[] = []
  if (!title) validationErrors.push('FAIL: title is empty')
  if (!quickAnswer) validationErrors.push('FAIL: quickAnswer is empty')
  if (blocks.length === 0) validationErrors.push('FAIL: body is empty')
  if (aboutEntities.length < 2) validationErrors.push(`WARN: only ${aboutEntities.length} aboutEntities (need 2–3)`)
  if (mentionsEntities.length < 3) validationErrors.push(`WARN: only ${mentionsEntities.length} mentionsEntities`)
  if (relatedPosts.length < 3) notes.push(`WARN: only ${relatedPosts.length} related posts found`)

  if (validationErrors.some(e => e.startsWith('FAIL'))) {
    console.error('\n❌ VALIDATION FAILED — skipping Sanity write:')
    validationErrors.forEach(e => console.error(`   ${e}`))
    return {
      slug, title, sanityId: existing._id, wordCount, readTime,
      bodyBlocks: blocks.length, faqCount: faqs.length,
      bulletConversions, entityBoldCount,
      statNumber: '', statContext: '', statSource: '',
      aboutEntities: aboutEntities.map(e => e.name),
      mentionsCount: mentionsEntities.length,
      relatedPosts: relatedPosts.length,
      qaWeak, notes,
      error: validationErrors.join('; '),
    }
  }

  // ── Step 13: Patch Sanity stub ─────────────────────────────────────────────
  console.log('⑪ Patching Sanity document…')
  await sanity
    .patch(existing._id)
    .set({
      quickAnswer,
      body: blocks,
      faqs,
      ...(statResult ? { endCtaStat: statResult } : {}),
      aboutEntities,
      mentionsEntities,
      ...(relatedPosts.length > 0 ? { relatedPosts } : {}),
      ...(publishedAt ? { publishedAt } : {}),
      ...(metaDesc ? { metaDescription: metaDesc } : {}),
      readTime,
      heroImage: ogImage ? {
        _type: 'externalImage',
        url: ogImage,
        alt: ogImageAlt,
      } : undefined,
      status: 'ready-for-review',
      notes,
    })
    .commit()

  const result: RetrofitResult = {
    slug, title, sanityId: existing._id, wordCount, readTime,
    bodyBlocks: blocks.length, faqCount: faqs.length,
    bulletConversions, entityBoldCount,
    statNumber: statResult?.number ?? '',
    statContext: statResult?.context ?? '',
    statSource: statResult?.source ?? '',
    aboutEntities: aboutEntities.map(e => e.name),
    mentionsCount: mentionsEntities.length,
    relatedPosts: relatedPosts.length,
    qaWeak, notes,
  }

  // ── Terminal report ────────────────────────────────────────────────────────
  console.log('\n✅ PATCH COMPLETE')
  console.log(`   Sanity ID:         ${existing._id}`)
  console.log(`   Title:             ${title}`)
  console.log(`   Word count:        ${wordCount}`)
  console.log(`   Read time:         ${readTime} min`)
  console.log(`   Quick Answer:      "${quickAnswer.slice(0, 120)}…" ${qaWeak ? '⚠️ (weak — verify)' : '✓'}`)
  console.log(`   Body blocks:       ${blocks.length}`)
  console.log(`   FAQ items:         ${faqs.length} ${!faqFound ? '⚠️ (none found)' : ''}`)
  console.log(`   Bullets converted: ${bulletConversions}`)
  console.log(`   Entities bolded:   ${entityBoldCount}`)
  console.log(`   End CTA stat:      ${statResult ? `${statResult.number} — "${statResult.context.slice(0, 60)}…"` : '⚠️ none detected'}`)
  console.log(`   About entities:    ${aboutEntities.map(e => e.name).join(', ')}`)
  console.log(`   Mentions entities: ${mentionsEntities.map(e => e.name).join(', ')}`)
  console.log(`   Related posts:     ${relatedPosts.length} refs`)
  if (notes.length) {
    console.log('\n   NOTES / WARNINGS:')
    notes.forEach(n => console.log(`   ⚠️  ${n}`))
  }
  console.log()

  return result
}

// ── Schema.org type inference ─────────────────────────────────────────────────

function inferSchemaOrgType(entity: Entity): string {
  // Look up schemaType from entity dictionary (source of truth)
  const found = allEntities.find(e => e.term === entity.term)
  if (found?.schemaType) return found.schemaType
  // Fallback for any entity not in the dictionary
  const geo = entityDict.geographic.find(e => e.term === entity.term)
  if (geo) return 'Place'
  return 'Thing'
}

// ── Entry point (only when run directly, not imported by batch script) ───────

const isMain = Boolean(
  process.argv[1]?.endsWith('retrofit-existing-post.ts') ||
  process.argv[1]?.endsWith('retrofit-existing-post.js')
)

if (isMain) {

const url = process.argv[2]
if (!url) {
  console.error('Usage: npx tsx scripts/migration/retrofit-existing-post.ts <url>')
  process.exit(1)
}

if (!process.env.SANITY_TOKEN) {
  console.error('ERROR: SANITY_TOKEN environment variable not set.')
  console.error('Get a write token from https://sanity.io/manage → project → API → Tokens')
  process.exit(1)
}

retrofitPost(url).catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})

} // end isMain
