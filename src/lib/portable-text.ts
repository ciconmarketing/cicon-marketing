/**
 * portable-text.ts
 * Server-side Portable Text → HTML renderer for CiCon blog posts.
 * No external dependencies — pure TypeScript, runs at Astro build time.
 */

// ── Types ─────────────────────────────────────────────────────────────────────

export interface PTSpan {
  _key?: string
  _type: 'span'
  text: string
  marks?: string[]
}

export interface PTMarkDef {
  _key: string
  _type: string
  href?: string
}

export interface PTBlock {
  _key?: string
  _type: 'block'
  style?: 'normal' | 'h2' | 'h3' | 'blockquote'
  listItem?: 'bullet' | 'number'
  level?: number
  children?: PTSpan[]
  markDefs?: PTMarkDef[]
}

export interface PTStatCallout {
  _key?: string
  _type: 'statCallout'
  number?: string
  label?: string
  source?: string
}

export interface PTPullQuote {
  _key?: string
  _type: 'pullQuote'
  quote?: string
  attribution?: string
}

export interface PTInlineImage {
  _key?: string
  _type: 'inlineImage'
  url?: string
  alt?: string
  caption?: string
  tilt?: 'left' | 'right'
}

export interface PTComparisonTab {
  _key?: string
  title?: string
  body?: PTBlock[]
}

export interface PTComparisonTabs {
  _key?: string
  _type: 'comparisonTabs'
  heading?: string
  tabs?: PTComparisonTab[]
}

export interface PTDeepDive {
  _key?: string
  _type: 'deepDive'
  title?: string
  body?: PTBlock[]
  whyItMatters?: string
}

export interface PTTableRow {
  _key?: string
  cells?: string[]
}

export interface PTSimpleTable {
  _key?: string
  _type: 'simpleTable'
  caption?: string
  headers?: string[]
  rows?: PTTableRow[]
}

export type PTNode = PTBlock | PTStatCallout | PTPullQuote | PTInlineImage | PTComparisonTabs | PTDeepDive | PTSimpleTable

// ── Helpers ───────────────────────────────────────────────────────────────────

function esc(str: string): string {
  return (str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function renderSpans(children: PTSpan[], markDefs: PTMarkDef[]): string {
  return (children ?? []).map(span => {
    if (span._type !== 'span') return ''
    let text = esc(span.text ?? '')
    const marks = [...(span.marks ?? [])].reverse() // apply outer marks last

    for (const mark of marks) {
      if (mark === 'strong') {
        text = `<strong>${text}</strong>`
      } else if (mark === 'em') {
        text = `<em>${text}</em>`
      } else if (mark === 'code') {
        text = `<code class="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-[#c7253e]">${text}</code>`
      } else {
        const def = markDefs.find(d => d._key === mark)
        if (def?._type === 'link' && def.href) {
          text = `<a href="${esc(def.href)}" class="text-[var(--goldenrod)] underline underline-offset-2 decoration-[rgba(157,131,62,0.4)] hover:text-[var(--amber)] hover:decoration-[var(--amber)] transition-colors duration-200" rel="noopener">${text}</a>`
        }
      }
    }
    return text
  }).join('')
}

function renderBlocks(blocks: PTBlock[]): string {
  const result: string[] = []
  let i = 0

  while (i < blocks.length) {
    const block = blocks[i]

    // List grouping
    if (block.listItem) {
      const listType = block.listItem
      const tag = listType === 'number' ? 'ol' : 'ul'
      const cls = listType === 'number'
        ? 'list-decimal list-outside pl-7 space-y-3 my-6 text-[var(--charcoal)] text-[1.0625rem] leading-[1.7]'
        : 'list-none pl-7 space-y-3 my-6 text-[var(--charcoal)] text-[1.0625rem] leading-[1.7]'
      const marker = listType === 'bullet' ? 'before:content-["▪"] before:text-[var(--goldenrod)] before:absolute before:-left-5 relative' : ''
      const items: string[] = []

      while (i < blocks.length && (blocks[i] as PTBlock).listItem === listType) {
        const b = blocks[i] as PTBlock
        const inner = renderSpans(b.children ?? [], b.markDefs ?? [])
        items.push(`<li class="${marker} text-[var(--charcoal)]">${inner}</li>`)
        i++
      }

      result.push(`<${tag} class="${cls}">${items.join('')}</${tag}>`)
      continue
    }

    // Non-list block
    const markDefs = block.markDefs ?? []
    const inner = renderSpans(block.children ?? [], markDefs)

    switch (block.style) {
      case 'h2':
        result.push(`<h2 class="font-display font-bold text-[var(--black)] mt-12 mb-6 leading-tight scroll-mt-24" style="font-size:clamp(1.75rem,3vw,2.5rem);letter-spacing:-0.01em" id="${slugify(plainText(block.children))}">${inner}</h2>`)
        break
      case 'h3':
        result.push(`<h3 class="font-display font-semibold text-[var(--black)] mt-8 mb-4 text-[1.375rem] leading-snug scroll-mt-24">${inner}</h3>`)
        break
      case 'blockquote':
        result.push(`<blockquote class="border-l-4 border-[var(--goldenrod)] pl-6 py-2 my-8 italic text-[var(--charcoal)] text-[1.125rem] leading-relaxed">${inner}</blockquote>`)
        break
      default:
        if (inner.trim()) {
          result.push(`<p class="text-[var(--charcoal)] text-[1.0625rem] leading-[1.7] mb-5">${inner}</p>`)
        }
    }

    i++
  }

  return result.join('\n')
}

function plainText(children?: PTSpan[]): string {
  return (children ?? []).map(s => s.text ?? '').join('')
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

// ── Custom block renderers ────────────────────────────────────────────────────

function renderStatCallout(block: PTStatCallout): string {
  const num = esc(block.number ?? '')
  const label = esc(block.label ?? '')
  const source = esc(block.source ?? '')
  return `
<div class="stat-callout-block my-10 -mx-4 sm:mx-0 rounded-xl overflow-hidden" style="background:var(--shadow)">
  <div class="px-8 py-12 sm:py-16 flex flex-col sm:flex-row items-center sm:items-start gap-6">
    <div class="text-center sm:text-left">
      <div class="stat-count-up font-display font-bold leading-none mb-4"
           data-target="${num}"
           style="font-size:clamp(4rem,8vw,7rem);color:var(--amber);letter-spacing:-0.04em;text-shadow:0 4px 24px rgba(255,207,0,0.25)">
        0
      </div>
      ${label ? `<p class="text-white/75 text-[1rem] leading-relaxed italic max-w-xs">${label}</p>` : ''}
      ${source ? `<p class="text-white/50 text-[11px] uppercase tracking-wider mt-3">${source}</p>` : ''}
    </div>
  </div>
</div>`
}

function renderPullQuote(block: PTPullQuote): string {
  const quote = esc(block.quote ?? '')
  const attr = esc(block.attribution ?? '')
  return `
<aside class="pull-quote my-10 border-l-4 border-[var(--goldenrod)] pl-6 py-2">
  <blockquote class="font-display font-semibold text-[var(--black)] text-xl leading-relaxed italic mb-3">"${quote}"</blockquote>
  ${attr ? `<cite class="text-[var(--charcoal)] text-sm not-italic opacity-70">— ${attr}</cite>` : ''}
</aside>`
}

function renderInlineImage(block: PTInlineImage, index: number): string {
  if (!block.url) return ''
  const rotate = block.tilt === 'right' ? '1.5deg' : '-1.5deg'
  const caption = esc(block.caption ?? '')
  const alt = esc(block.alt ?? '')
  return `
<figure class="inline-image-block my-10 text-center" data-index="${index}">
  <img
    src="${esc(block.url)}"
    alt="${alt}"
    loading="lazy"
    class="inline-img max-w-full rounded-lg mx-auto"
    style="transform:rotate(${rotate});box-shadow:0 20px 40px -15px rgba(33,33,41,0.35),0 8px 24px -8px rgba(0,0,0,0.15);border:1px solid rgba(157,131,62,0.25);transition:transform 300ms cubic-bezier(0.4,0,0.2,1)"
    onmouseover="this.style.transform='rotate(0deg) translateY(-4px)'"
    onmouseout="this.style.transform='rotate(${rotate})'"
  />
  ${caption ? `<figcaption class="text-[var(--charcoal)] text-sm italic opacity-70 mt-3">${caption}</figcaption>` : ''}
</figure>`
}

let tabGroupIndex = 0

function renderComparisonTabs(block: PTComparisonTabs): string {
  const idx = tabGroupIndex++
  const tabs = block.tabs ?? []
  if (tabs.length === 0) return ''

  const heading = esc(block.heading ?? '')
  const tabButtons = tabs.map((tab, i) => `
    <button
      class="tab-btn relative px-5 py-3 font-display font-semibold text-sm transition-colors duration-200 whitespace-nowrap"
      data-tab-group="${idx}"
      data-tab-index="${i}"
      role="tab"
      aria-selected="${i === 0 ? 'true' : 'false'}"
      aria-controls="tab-panel-${idx}-${i}"
      id="tab-btn-${idx}-${i}"
    >${esc(tab.title ?? `Tab ${i + 1}`)}</button>`).join('')

  const tabPanels = tabs.map((tab, i) => {
    const bodyHtml = tab.body ? renderBlocks(tab.body) : ''
    return `
    <div
      class="tab-panel ${i === 0 ? '' : 'hidden'}"
      id="tab-panel-${idx}-${i}"
      role="tabpanel"
      aria-labelledby="tab-btn-${idx}-${i}"
    >${bodyHtml}</div>`
  }).join('')

  return `
<div class="comparison-tabs-block my-10 rounded-xl overflow-hidden border border-[var(--hairline)]" data-tab-group="${idx}">
  ${heading ? `<h3 class="px-6 pt-6 pb-0 font-display font-semibold text-[var(--black)] text-[1.25rem]">${heading}</h3>` : ''}
  <div class="tab-nav relative flex overflow-x-auto border-b border-[var(--hairline)] bg-white" role="tablist">
    <div class="tab-underline absolute bottom-0 h-0.5 bg-[var(--amber)] transition-all duration-200" style="left:0;width:0"></div>
    ${tabButtons}
  </div>
  <div class="tab-panels p-6 bg-white">
    ${tabPanels}
  </div>
</div>`
}

let deepDiveIndex = 0

function renderDeepDive(block: PTDeepDive): string {
  const idx = deepDiveIndex++
  const title = esc(block.title ?? '')
  const bodyHtml = block.body ? renderBlocks(block.body) : ''
  const whyItMatters = esc(block.whyItMatters ?? '')

  return `
<div class="deep-dive-block my-6 rounded-xl border border-[var(--hairline)] overflow-hidden">
  <button
    class="deep-dive-toggle w-full flex items-start gap-4 px-6 py-5 text-left bg-white hover:bg-[var(--off-white)] transition-colors duration-200"
    aria-expanded="false"
    aria-controls="deep-dive-body-${idx}"
  >
    <span class="font-display font-bold text-[var(--goldenrod)] text-lg leading-tight flex-shrink-0 mt-0.5">${String(idx + 1).padStart(2, '0')}</span>
    <span class="font-display font-semibold text-[var(--black)] text-[1.0625rem] leading-snug flex-1">${title}</span>
    <svg class="deep-dive-chevron w-5 h-5 text-[var(--goldenrod)] flex-shrink-0 mt-0.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
    </svg>
  </button>
  <div id="deep-dive-body-${idx}" class="deep-dive-body hidden overflow-hidden">
    <div class="px-6 pb-6 pt-2 bg-white border-t border-[var(--hairline)]">
      ${bodyHtml}
      ${whyItMatters ? `
      <div class="mt-6 p-5 rounded-lg" style="background:var(--alabaster)">
        <p class="font-display font-semibold text-[var(--goldenrod)] text-[10px] uppercase tracking-widest mb-2">Why This Matters</p>
        <p class="text-[var(--charcoal)] text-[1rem] leading-relaxed">${whyItMatters}</p>
      </div>` : ''}
    </div>
  </div>
</div>`
}

// ── Simple Table ──────────────────────────────────────────────────────────────

function renderSimpleTable(node: PTSimpleTable): string {
  const headers = node.headers ?? []
  const rows = node.rows ?? []
  const caption = node.caption ?? ''

  const headerRow = headers.length > 0
    ? `<thead><tr>${headers.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead>`
    : ''

  const bodyRows = rows.map(row => {
    const cells = row.cells ?? []
    return `<tr>${cells.map((c, i) => i === 0 ? `<td><strong>${esc(c)}</strong></td>` : `<td>${esc(c)}</td>`).join('')}</tr>`
  }).join('')

  return `
<div class="table-wrapper overflow-x-auto my-8 rounded-xl border border-[var(--hairline)]">
  ${caption ? `<p class="table-caption text-sm text-[var(--muted)] px-4 pt-3 pb-1 font-medium">${esc(caption)}</p>` : ''}
  <table class="simple-table w-full text-[0.9375rem] leading-normal border-collapse">
    ${headerRow}
    <tbody>${bodyRows}</tbody>
  </table>
</div>`
}

// ── Main export ───────────────────────────────────────────────────────────────

export function renderPortableText(nodes: PTNode[]): string {
  // Reset counters for each call (one call per page at build time)
  tabGroupIndex = 0
  deepDiveIndex = 0

  const result: string[] = []
  let blockBuffer: PTBlock[] = []

  function flushBlocks() {
    if (blockBuffer.length > 0) {
      result.push(renderBlocks(blockBuffer))
      blockBuffer = []
    }
  }

  let inlineImgIndex = 0

  for (const node of (nodes ?? [])) {
    if (node._type === 'block') {
      blockBuffer.push(node as PTBlock)
    } else {
      flushBlocks()
      switch (node._type) {
        case 'statCallout':
          result.push(renderStatCallout(node as PTStatCallout))
          break
        case 'pullQuote':
          result.push(renderPullQuote(node as PTPullQuote))
          break
        case 'inlineImage':
          result.push(renderInlineImage(node as PTInlineImage, inlineImgIndex++))
          break
        case 'simpleTable':
          result.push(renderSimpleTable(node as PTSimpleTable))
          break
        case 'comparisonTabs':
          result.push(renderComparisonTabs(node as PTComparisonTabs))
          break
        case 'deepDive':
          result.push(renderDeepDive(node as PTDeepDive))
          break
      }
    }
  }

  flushBlocks()
  return result.join('\n')
}

/**
 * Extract H2 headings from a Portable Text block array for TOC generation.
 */
export function extractH2s(nodes: PTNode[]): Array<{ id: string; text: string }> {
  return (nodes ?? [])
    .filter(n => n._type === 'block' && (n as PTBlock).style === 'h2')
    .map(n => {
      const block = n as PTBlock
      const text = plainText(block.children)
      return { id: slugify(text), text }
    })
    .filter(h => h.text.trim())
}
