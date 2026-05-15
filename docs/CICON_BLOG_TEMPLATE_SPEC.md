# CICON BLOG TEMPLATE SPEC

**Version:** 1.0 (Locked)
**Last Updated:** May 2026
**Owner:** Majid Behzad / CiCon Marketing
**Purpose:** Single canonical reference for every CiCon blog post — applies to retrofitted legacy posts AND new Arvow-generated posts. Claude Code reads this document at the start of every blog-related session.

---

## TABLE OF CONTENTS

1. [Stack & Architecture](#1-stack--architecture)
2. [Design System (Locked Tokens)](#2-design-system-locked-tokens)
3. [Page Structure (11 Sections)](#3-page-structure-11-sections)
4. [The 5 Micro-Interactions](#4-the-5-micro-interactions)
5. [GEO Formatting Rules](#5-geo-formatting-rules)
6. [CiCon Entity Dictionary](#6-cicon-entity-dictionary)
7. [Connected Graph Schema Template](#7-connected-graph-schema-template)
8. [Sanity Schema (`blogPost` Document Type)](#8-sanity-schema-blogpost-document-type)
9. [Shared Constants File (`schema-constants.ts`)](#9-shared-constants-file-schema-constantsts)
10. [Pipeline A — Retrofit Existing Posts](#10-pipeline-a--retrofit-existing-posts)
11. [Pipeline B — New Arvow Posts](#11-pipeline-b--new-arvow-posts)
12. [Validation Checklist](#12-validation-checklist)
13. [Per-Post Variables (What Changes vs What Stays Constant)](#13-per-post-variables)
14. [Anti-Patterns (Do NOT Do These)](#14-anti-patterns)

---

## 1. STACK & ARCHITECTURE

### Production Stack (Locked — Never Change)

| Layer | Technology |
|---|---|
| Framework | Astro 5+ (latest stable) |
| Styling | Tailwind CSS + custom CSS for design tokens |
| CMS | Sanity.io (headless) |
| Icons | Lucide (inline SVGs) |
| Animations | AOS for section reveals; vanilla JS for micro-interactions; Framer Motion only for hero/key interactive islands |
| Deployment | Vercel + GitHub |
| Language | TypeScript throughout |
| Domain | cicon.ca |

### Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    NEW POSTS (Pipeline B)                       │
│                                                                 │
│  Arvow generates markdown → publishes to Sanity (via API)       │
│       ↓                                                         │
│  Sanity webhook triggers Claude Code GitHub Action              │
│       ↓                                                         │
│  Claude Code post-processor:                                    │
│    • Parses markdown                                            │
│    • Applies GEO rules (bullets, bold entities, freshness)      │
│    • Extracts about/mentions entities from Entity Dictionary    │
│    • Transforms into Portable Text with custom blocks           │
│    • Writes back to Sanity as "ready-for-review" status         │
│       ↓                                                         │
│  Human review in Sanity Studio → publish                        │
│       ↓                                                         │
│  Vercel rebuilds → Astro renders with interactive islands       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                  EXISTING POSTS (Pipeline A)                    │
│                                                                 │
│  WordPress export (XML) or scraped HTML from cicon.ca           │
│       ↓                                                         │
│  Migration script imports raw posts to Sanity                   │
│       ↓                                                         │
│  Claude Code post-processor (same as Pipeline B)                │
│       ↓                                                         │
│  Human review in Sanity Studio → publish (preserve original URL)│
│       ↓                                                         │
│  Vercel rebuilds → live                                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. DESIGN SYSTEM (LOCKED TOKENS)

### Color Palette

| Token | Hex | Role |
|---|---|---|
| `--amber` | `#FFCF00` | High-energy accent. ≤3% surface area. CTA fills (non-WhatsApp), reading progress bar, active TOC border, sliding tab underline, count-up stat numbers, gold accent rules, focus rings. |
| `--goldenrod` | `#9D833E` | Everyday accent (dominant). Eyebrow labels, category chip borders/text, hairlines, inline link color, deep dive question numbers, 4px border on Quick Answer card, glassmorphism border ring, social icon hover. |
| `--shadow` | `#212129` | Dark surface color. Hero band, End CTA band, stat callout strips, footer. |
| `--alabaster` | `#E7E7E7` | Neutral light grey. Secondary card backgrounds, dividers, "WHY THIS MATTERS" sub-cards. |
| `--black` | `#000000` | Primary headings (H1, H2, H3, card titles). |
| `--off-white` | `#FAFAFA` | Page background. |
| `--white` | `#FFFFFF` | Card backgrounds, text on dark sections. |
| `--charcoal` | `#3A3A3A` | Body prose text. |
| `--glass-bg` | `rgba(255, 255, 255, 0.65)` | Glassmorphism backgrounds. |
| `--glass-border` | `rgba(157, 131, 62, 0.3)` | Glassmorphism borders. |
| `--hairline` | `rgba(157, 131, 62, 0.15)` | 1px borders, dividers. |
| `--whatsapp-bright` | `#25D366` | WhatsApp CTA on light backgrounds (header, sidebar). |
| `--whatsapp-deep` | `#128C7E` | WhatsApp CTA on dark backgrounds (End CTA block). |
| `--whatsapp-bright-hover` | `#1FB855` | Hover state for bright WhatsApp. |
| `--whatsapp-deep-hover` | `#0E6E62` | Hover state for deep WhatsApp. |

### Color Application Rules

**Amber `#FFCF00` is reserved for action and motion** — never as large surface fill. Permitted uses only:
- Primary CTA fills (non-WhatsApp)
- Reading progress bar
- Sliding tab underline
- Active TOC sidebar border
- Count-up stat numbers
- 60px gold accent rule below hero H1
- Mobile floating TOC trigger
- On-hover transitions of primary links/chips
- Focus-visible outlines

**Goldenrod `#9D833E` is the dominant accent** for everything quieter:
- All eyebrow labels (uppercase Montserrat 600, letter-spacing 0.15em)
- Category chip borders + text
- 4px left border on Quick Answer glassmorphism card
- Deep Dive accordion question numbers
- Inline link color in body prose (1px underline at 40% opacity → 100% amber on hover)
- All hairline dividers
- Social icon hover state

**Decision rule:** When in doubt, use goldenrod. Amber is the exception, goldenrod is the rule.

### Typography

| Use | Font | Weight | Size | Letter-Spacing |
|---|---|---|---|---|
| H1 | Montserrat | 700 | `clamp(2.5rem, 5vw, 4rem)` | -0.02em |
| H2 | Montserrat | 700 | `clamp(1.75rem, 3vw, 2.5rem)` | -0.01em |
| H3 | Montserrat | 600 | 1.375rem | normal |
| Body prose | Inter | 400 | 1.0625rem (17px) | normal, line-height 1.7 |
| Bold inline (entities) | Inter | 600 | inherit | normal |
| Captions | Inter italic | 400 | 14px | normal |
| Eyebrow labels | Montserrat | 600 | 10–11px uppercase | 0.15em |
| CTAs | Montserrat | 600 | 14px | normal |
| Stat numbers | Montserrat | 700 | `clamp(5rem, 9vw, 8rem)` | -0.04em |

Load Inter and Montserrat from Google Fonts with `display: swap`.

### Spacing

- Base unit: 8px
- Section vertical padding: 96px desktop, 56px mobile
- Container max-width: 1280px
- Prose column max-width: 720px (~70ch)
- Side padding: 24px

### Motion

- All transitions: `300ms cubic-bezier(0.4, 0, 0.2, 1)`
- Tab crossfades: 200ms opacity
- Accordion expand: 400ms
- Stat count-up: 1500ms with ease-out `t * (2 - t)`
- **No bouncy easings. No parallax. No animated backgrounds. No cursor effects.**
- Respect `prefers-reduced-motion`: disable count-up, tab slides, accordion height transitions.

---

## 3. PAGE STRUCTURE (11 SECTIONS)

Build in this exact order. Every CiCon blog post — retrofit or new — has all 11 sections.

### 3.1 Slim Sticky Header

- 64px height, `--off-white` with `backdrop-filter: blur(12px)` and `rgba(250,250,250,0.85)` when scrolled past 80px.
- Left: CiCon logo (text or SVG), Montserrat 600, `--black` color.
- Center: nav links — "Services", "Blog", "About", "Contact" — Inter 500, charcoal.
- Right: WhatsApp pill button. Background `--whatsapp-bright`, white text + 16px white WhatsApp SVG icon, 8px radius, 12px/20px padding. `href="https://wa.me/12898071020"`, `target="_blank"`, `rel="noopener noreferrer"`. Label: "Chat on WhatsApp".
- Below header (visible when article body in view): **horizontal reading progress bar**, 3px tall, full-width, `--amber` fill, grows left-to-right with scroll.

### 3.2 Hero Block

- Full-bleed `--shadow` background, 480px tall desktop / 360px mobile.
- Container max-width 1280px, 24px side padding.
- Inside (top to bottom):
  - Category chip: uppercase Montserrat 600, 11px letter-spacing 0.1em, `--goldenrod` text on transparent bg with 1px goldenrod border, 6px/14px padding, 100px radius.
  - 16px gap.
  - H1: white text, max-width 900px.
  - 20px gap.
  - Dek: Inter 400 italic, 1.25rem, white at 80% opacity, max-width 700px.
  - 32px gap.
  - Meta row: Inter 500, 14px, white at 70% opacity. Format: `By [Author] · [N] min read · Last updated [dynamic date]`. Use thin dot separator. **Date span has `data-freshness-date` attribute** (filled dynamically).
  - 24px gap.
  - 60px × 2px `--amber` accent rule, left-aligned.
- **Featured image card** floats off bottom edge, overlapping next section by ~80px:
  - 1024×576 image, rotated `-1.5deg`.
  - Shadow: `0 30px 60px -20px rgba(33,33,41,0.4), 0 10px 30px -10px rgba(0,0,0,0.2)`.
  - 1px inner `--goldenrod` hairline.
  - 8px border radius.
  - Max-width 880px, centered.
  - `loading="eager"`, `fetchpriority="high"`, explicit width/height.
  - Caption below: Inter italic 14px charcoal at 70%.

### 3.3 Quick Answer Card (Glassmorphism)

- 80px gap below featured image. Centered, max-width 880px.
- Background `--glass-bg` with `backdrop-filter: blur(16px)`.
- 1px solid `--glass-border` all around. **4px solid `--goldenrod` left border.**
- 8px border radius. 32px / 40px padding.
- Box-shadow: `0 0 0 1px rgba(157,131,63,0.25), 0 20px 40px -20px rgba(33,33,41,0.18)`.
- Inside:
  - Top row: "QUICK ANSWER" label (Montserrat 600, 11px letter-spacing 0.15em, `--goldenrod`) + small copy icon button on right (16px Lucide-style SVG, charcoal at 50% → 100% on hover). Click copies answer text + shows "Copied!" tooltip.
  - 12px gap.
  - Answer text: Inter 500, 1.125rem, line-height 1.6, charcoal. **Class: `.quick-answer__body`** (referenced by `speakable` schema).

### 3.4 Asymmetric Anti-Grid Body Layout

**Desktop (≥1024px):** CSS Grid 12-col, 32px gap:
- Cols 1–3: Left gutter (pull quotes, stat callouts, margin notes) — mostly whitespace.
- Cols 4–10: Main prose column (7/12). Max prose width 70ch.
- Cols 11–12: Sticky right sidebar (TOC + tiny CTA), `position: sticky; top: 96px`.

**Tablet (768–1023px):** Prose full-width, sidebar collapses, gutter content moves inline.

**Mobile (<768px):** Single column. No sidebar, no gutter. Floating TOC trigger replaces sidebar.

### 3.5 Sticky Right Sidebar (Desktop ≥1024px Only)

- Transparent column, no background, no border.
- Top: "ON THIS PAGE" label (Montserrat 600, 11px letter-spacing 0.15em, `--goldenrod`, 16px bottom margin).
- TOC list, auto-generated from H2s:
  - Inter 500, 14px, charcoal at 70% opacity.
  - 10px vertical padding per item.
  - 2px left border (transparent default, `--amber` when active via scroll-spy).
  - Hover/active: text becomes 100% charcoal, slight 8px left padding shift.
  - Smooth scroll on click, `-80px` offset for sticky header.
- 32px gap, 1px `--hairline` divider, 24px gap.
- **Tiny WhatsApp CTA pill** (Montserrat 600, 12px, white text + 12px icon on `--whatsapp-bright`, 6px/16px padding, full sidebar width). Label: "Chat on WhatsApp →".

### 3.6 Article Body Content (Inside Main Prose Column)

- Intro paragraphs (2 paragraphs typical).
- H2 sections with IDs matching TOC anchors.
- Body prose interspersed with custom blocks (Portable Text in production):
  - **Pull quotes** in left gutter (desktop only).
  - **Stat callout strips** full-bleed within main column: `--shadow` background, 64px vertical padding. Two columns: giant number (Montserrat 700, 5rem, `--amber`) + context (Inter 500, 1rem, white). Number counts up from 0 on scroll-into-view.
  - **Deep Dive accordions** for technical question/answer sets: gold question numbers, "WHY THIS MATTERS" sub-card with `--alabaster` background.
  - **Tabbed comparison components** with animated sliding `--amber` underline. Mobile → collapses to accordion.
  - **Inline images:** tilted (-1.5° or +1.5°), layered shadow, 1px goldenrod hairline. Hover: straighten + translateY(-4px).
- **GEO formatting applied throughout** (see Section 5).

### 3.7 End-of-Article CTA Block (Full-Bleed)

- Full-bleed `--shadow` background, 120px vertical padding.
- Container max-width 1080px.
- Desktop: 2-column 8/12 + 4/12 split.

**Left column (8/12):**
- "READY TO GROW?" label (Montserrat 600, 11px letter-spacing 0.15em, `--goldenrod`).
- H2 (white, Montserrat 700, `clamp(2rem, 4vw, 3rem)`): "Stop guessing. Start growing."
- Dek (Inter 400, 1.125rem, white at 80%, max-width 520px, line-height 1.6).
- Button row (24px gap):
  - Primary: WhatsApp pill (Montserrat 600, 14px, white text + 18px white WhatsApp icon on `--whatsapp-deep`, 14px/28px padding, 100px radius). Label: "Chat on WhatsApp". `href="https://wa.me/12898071020"`.
  - Secondary: ghost link "Or call (289) 807-1020 →" (white at 80%, Inter 500, 14px). `href="tel:2898071020"`.

**Right column (4/12) — Stylized Pull-Stat:**
- "BY THE NUMBERS" label (Montserrat 600, 10px letter-spacing 0.15em, `--goldenrod`). 16px bottom margin.
- Stat number (Montserrat 700, `clamp(5rem, 9vw, 8rem)`, line-height 0.95, `--amber`, letter-spacing -0.04em). `text-shadow: 0 4px 24px rgba(255,207,0,0.25)`. **Class: `.end-cta__stat-number`** (referenced by `speakable`). 16px bottom margin.
- Context line (Inter 400 italic, 1rem, line-height 1.5, white at 75%, max-width 280px). **Class: `.end-cta__stat-context`** (referenced by `speakable`). 12px bottom margin.
- Divider: 32px × 1px, `--amber` at 60% opacity. 12px bottom margin.
- Source attribution (Inter 500, 11px letter-spacing 0.05em, white at 50% opacity, uppercase).

**Mobile (<768px):** Stack to single column. Stat above headline (reduced to `clamp(4rem, 14vw, 6rem)`), center-aligned. 48px gap between stat and headline.

### 3.8 Author Bio Card

- `--off-white` section, 96px vertical padding.
- Card centered, max-width 880px:
  - Horizontal layout: 160px circular photo left, text right. 32px gap.
  - Background white, 8px radius, 1px hairline border, subtle navy/charcoal-at-3% gradient.
  - 32px padding.
  - Mobile: stack vertical, photo centered above.
- Content:
  - Photo (or initials placeholder).
  - "ABOUT THE AUTHOR" label (Montserrat 600, 10px letter-spacing 0.15em, `--goldenrod`).
  - Name (Montserrat 700, 1.5rem, `--black`).
  - Title (Inter 500, 14px, charcoal at 70%).
  - 16px gap.
  - 2-line bio (Inter 400, 1rem, line-height 1.6).
  - 16px gap.
  - Social row: LinkedIn + Instagram icons (Lucide SVGs, 18px, charcoal 60% → `--goldenrod` on hover) + "More from [Author] →" link (Inter 500, 14px, `--goldenrod`).

### 3.9 Related Posts Section

- `--off-white` background, 96px top / 120px bottom padding.
- Container max-width 1280px.
- Header: "CONTINUE READING" label + H2 "More on [category] →" (Montserrat 700, 2rem, `--black`).
- 3 cards in **staggered (anti-grid) layout**: CSS Grid 3 cols with manual margin-top offsets (card 1: 0, card 2: 48px, card 3: 0).
- Card structure:
  - 16:9 image (8px radius, overflow hidden).
  - Category chip (`--goldenrod` border).
  - Card title (Montserrat 600, 1.25rem, `--black`, line-height 1.3, max 3 lines ellipsis).
  - Meta line (Inter 400, 13px, charcoal at 60%): "[N] min read · [Month Year]".
- Hover: image scales 1.05 over 400ms, `--amber` 2px underline draws left-to-right under title via `::after` pseudo.

### 3.10 Slim Footer

- `--shadow` background, 64px vertical padding.
- 2-column desktop: left = "CiCon Marketing © [year]" + Privacy + Terms links. Right = social icons.
- All text white at 60% opacity.

### 3.11 Mobile Floating TOC Trigger (Mobile <1024px Only)

- Fixed bottom-right, 24px from edges.
- 56px `--amber` circle, white list icon (Lucide SVG, 24px) centered.
- Shadow: `0 8px 24px rgba(255,207,0,0.5)`.
- Visible only after user scrolls past hero.
- Tap: opens bottom sheet (slides up 400ms) covering bottom 50%:
  - `--off-white` background, top corners 16px radius.
  - Header: "Jump to Section" + X close button.
  - List of H2 sections, each tappable, smooth-scrolls + closes sheet.
- Backdrop: `rgba(0,0,0,0.4)` with `backdrop-filter: blur(8px)`.

---

## 4. THE 5 MICRO-INTERACTIONS

Vanilla JS only — no libraries.

### 4.1 Reading Progress Bar

- Throttled scroll listener with `requestAnimationFrame`.
- Calculate `(scrollTop / (articleHeight - viewportHeight)) * 100`.
- Update width of `--amber` bar in header.
- Active only when article body is in view.

### 4.2 Scroll-Spy TOC Highlighting

- `IntersectionObserver` watching all H2 elements in article body.
- When H2 enters top 30% of viewport, mark corresponding TOC item active (`.active` class adds `--amber` left border, 100% opacity text).
- Smooth scroll on TOC click, `-80px` offset.

### 4.3 Stat Count-Up Animation

- `IntersectionObserver` triggers when stat callout enters viewport.
- Animate number from 0 to target over 1500ms via `requestAnimationFrame`.
- Ease-out: `t * (2 - t)`.
- Runs once per page load.

### 4.4 Image Straighten on Hover

- Pure CSS, no JS.
- Default: `transform: rotate(-1.5deg)` (or +1.5° for alternating).
- Hover: `transform: rotate(0deg) translateY(-4px)`.
- Transition: 300ms cubic-bezier(0.4, 0, 0.2, 1).

### 4.5 Smooth Scroll on Anchor Click

- Override default anchor click behavior.
- `window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' })`.

### Additional Required JS

- Tab switching with sliding underline (comparison component).
- Accordion toggle for Deep Dive and FAQ (with proper ARIA).
- Copy-to-clipboard for Quick Answer card.
- Mobile TOC bottom sheet open/close.
- Dynamic date injection into schema and visible meta row (see Section 5.3).

---

## 5. GEO FORMATTING RULES

Generative Engine Optimization — makes every CiCon article maximally parseable by AI crawlers (Google AI Overviews, Perplexity, ChatGPT, Claude). Every post conforms to these three rules.

### 5.1 Rule 1 — Bullet-Heavy Structure

- Any paragraph that enumerates 3+ items, characteristics, examples, or signals must be converted to a bulleted list.
- Add a 3-bullet "Bottom line:" or "What you'll learn:" summary at the end of each major H2 section where it adds value.
- Bullet styling:
  - Custom marker: `▪` character in `--goldenrod`.
  - Inter 400, 1.0625rem, line-height 1.7, charcoal.
  - `padding-left: 28px` on `<li>`.
  - `margin-bottom: 12px` between bullets.

### 5.2 Rule 2 — Bold Entity Terms

Wrap key entities in semantic `<strong>` tags so AI crawlers and human scanners instantly identify subject matter.

**Bold each entity ONCE per H2 section** (first mention only).

**Entity categories to bold** (see Section 6 for full Entity Dictionary):
- Brand/product names
- Geographic entities
- Industry-specific terms (when subject of sentence)
- Quantitative facts

**Critical rules:**
- Never bold full sentences or clauses — only the entity noun phrase.
- If a sentence has 3+ candidate entities, bold only the most important.
- Never bold inside H1/H2/H3 headings, accordion question text, tab labels, or button text.
- Bolding exclusive to body prose, FAQ answers, and bullet content.

### 5.3 Rule 3 — Freshness Signals

- `datePublished`: ISO 8601 with timezone, set at publish time.
- `dateModified`: ISO 8601 with timezone, updated on every edit.
- Visible "Last Updated" line in hero meta row, dynamically driven from `dateModified`.

**Astro/Sanity production implementation:**
- Dates come from Sanity's `_createdAt` and `_updatedAt` fields.
- Injected into schema at build time by Astro component.
- Webhook-triggered rebuilds keep `dateModified` current.
- No client-side date injection needed in production (the static-prototype script is replaced).

### Rationale

AI Overviews and generative search engines preferentially cite sources that are: (a) structurally scannable, (b) entity-rich, and (c) demonstrably fresh. These three rules optimize for all three without compromising human reading experience.

---

## 6. CICON ENTITY DICTIONARY

Stored as JSON at `src/lib/entities.json`. The Claude Code post-processor scans every article and auto-wraps first-mention-per-H2-section in `<strong>` tags. Editor reviews in Sanity Studio before publish.

> **`schemaType` field (added May 2026):** Each entry now carries an explicit `schemaType`
> that maps to a Schema.org type. The permitted values are `"Thing"`, `"Place"`, and
> `"Organization"`. **`SoftwareApplication` is never used** — software/platform mentions in
> CiCon articles are article references, not products being sold; they do not carry the
> `offers`/`aggregateRating`/`operatingSystem` fields that `SoftwareApplication` requires.
> Pipeline B's post-processor reads `schemaType` directly; `[slug].astro` further enforces
> this by whitelisting only `Place` and `Organization`, coercing everything else to `Thing`.

```json
{
  "brands_products": [
    { "term": "Google Business Profile", "schemaType": "Thing", "aliases": ["GBP", "Google My Business", "GMB"], "wikipedia": "https://en.wikipedia.org/wiki/Google_Business_Profile" },
    { "term": "Google Map Pack", "schemaType": "Thing", "aliases": ["Map Pack", "Local Pack"], "wikipedia": "https://en.wikipedia.org/wiki/Google_Maps" },
    { "term": "Google Analytics 4", "schemaType": "Thing", "aliases": ["GA4"], "wikipedia": "https://en.wikipedia.org/wiki/Google_Analytics" },
    { "term": "Google Ads", "schemaType": "Thing", "aliases": [], "wikipedia": "https://en.wikipedia.org/wiki/Google_Ads" },
    { "term": "Google Tag Manager", "schemaType": "Thing", "aliases": ["GTM"], "wikipedia": "https://en.wikipedia.org/wiki/Google_Tag_Manager" },
    { "term": "Meta Ads", "schemaType": "Thing", "aliases": ["Facebook Ads"], "wikipedia": "https://en.wikipedia.org/wiki/Meta_Platforms" },
    { "term": "BrightLocal", "schemaType": "Thing", "aliases": [], "wikipedia": null },
    { "term": "Ahrefs", "schemaType": "Thing", "aliases": [], "wikipedia": "https://en.wikipedia.org/wiki/Ahrefs" },
    { "term": "SEMrush", "schemaType": "Thing", "aliases": ["Semrush"], "wikipedia": "https://en.wikipedia.org/wiki/Semrush" },
    { "term": "WordPress", "schemaType": "Thing", "aliases": [], "wikipedia": "https://en.wikipedia.org/wiki/WordPress" },
    { "term": "Shopify", "schemaType": "Thing", "aliases": [], "wikipedia": "https://en.wikipedia.org/wiki/Shopify" },
    { "term": "Sanity.io", "schemaType": "Thing", "aliases": ["Sanity"], "wikipedia": null },
    { "term": "CiCon Marketing", "schemaType": "Organization", "aliases": ["CiCon"], "wikipedia": null }
  ],

  "geographic": [
    { "term": "Toronto", "schemaType": "Place", "aliases": [], "wikipedia": "https://en.wikipedia.org/wiki/Toronto" },
    { "term": "Greater Toronto Area", "schemaType": "Place", "aliases": ["GTA"], "wikipedia": "https://en.wikipedia.org/wiki/Greater_Toronto_Area" },
    { "term": "Richmond Hill", "schemaType": "Place", "aliases": ["Richmond Hill, Ontario"], "wikipedia": "https://en.wikipedia.org/wiki/Richmond_Hill,_Ontario" },
    { "term": "North York", "schemaType": "Place", "aliases": [], "wikipedia": "https://en.wikipedia.org/wiki/North_York" },
    { "term": "Vaughan", "schemaType": "Place", "aliases": [], "wikipedia": "https://en.wikipedia.org/wiki/Vaughan" },
    { "term": "Markham", "schemaType": "Place", "aliases": ["Markham, Ontario"], "wikipedia": "https://en.wikipedia.org/wiki/Markham,_Ontario" },
    { "term": "Scarborough", "schemaType": "Place", "aliases": [], "wikipedia": "https://en.wikipedia.org/wiki/Scarborough,_Toronto" },
    { "term": "Etobicoke", "schemaType": "Place", "aliases": [], "wikipedia": "https://en.wikipedia.org/wiki/Etobicoke" },
    { "term": "Mississauga", "schemaType": "Place", "aliases": [], "wikipedia": "https://en.wikipedia.org/wiki/Mississauga" },
    { "term": "Brampton", "schemaType": "Place", "aliases": [], "wikipedia": "https://en.wikipedia.org/wiki/Brampton" },
    { "term": "Oakville", "schemaType": "Place", "aliases": [], "wikipedia": "https://en.wikipedia.org/wiki/Oakville,_Ontario" },
    { "term": "Yonge and Eglinton", "schemaType": "Place", "aliases": ["Yonge & Eglinton"], "wikipedia": null },
    { "term": "Financial District", "schemaType": "Place", "aliases": ["Toronto Financial District"], "wikipedia": "https://en.wikipedia.org/wiki/Financial_District,_Toronto" },
    { "term": "Ontario", "schemaType": "Place", "aliases": [], "wikipedia": "https://en.wikipedia.org/wiki/Ontario" },
    { "term": "Canada", "schemaType": "Place", "aliases": [], "wikipedia": "https://en.wikipedia.org/wiki/Canada" }
  ],

  "industry_concepts": [
    { "term": "local SEO", "schemaType": "Thing", "aliases": ["local search engine optimization", "local search optimization"], "wikipedia": "https://en.wikipedia.org/wiki/Local_search_(Internet)" },
    { "term": "search engine optimization", "schemaType": "Thing", "aliases": ["SEO"], "wikipedia": "https://en.wikipedia.org/wiki/Search_engine_optimization" },
    { "term": "conversion rate optimization", "schemaType": "Thing", "aliases": ["CRO"], "wikipedia": "https://en.wikipedia.org/wiki/Conversion_rate_optimization" },
    { "term": "pay-per-click", "schemaType": "Thing", "aliases": ["PPC"], "wikipedia": "https://en.wikipedia.org/wiki/Pay-per-click" },
    { "term": "return on investment", "schemaType": "Thing", "aliases": ["ROI"], "wikipedia": "https://en.wikipedia.org/wiki/Return_on_investment" },
    { "term": "lifetime value", "schemaType": "Thing", "aliases": ["LTV", "customer lifetime value", "CLV"], "wikipedia": "https://en.wikipedia.org/wiki/Customer_lifetime_value" },
    { "term": "cost per lead", "schemaType": "Thing", "aliases": ["CPL"], "wikipedia": null },
    { "term": "cost per acquisition", "schemaType": "Thing", "aliases": ["CPA"], "wikipedia": "https://en.wikipedia.org/wiki/Cost_per_action" },
    { "term": "key performance indicator", "schemaType": "Thing", "aliases": ["KPI", "KPIs"], "wikipedia": "https://en.wikipedia.org/wiki/Performance_indicator" },
    { "term": "schema markup", "schemaType": "Thing", "aliases": ["structured data"], "wikipedia": "https://en.wikipedia.org/wiki/Schema.org" },
    { "term": "Generative Engine Optimization", "schemaType": "Thing", "aliases": ["GEO"], "wikipedia": null },
    { "term": "content marketing", "schemaType": "Thing", "aliases": [], "wikipedia": "https://en.wikipedia.org/wiki/Content_marketing" },
    { "term": "lead generation", "schemaType": "Thing", "aliases": [], "wikipedia": "https://en.wikipedia.org/wiki/Lead_generation" }
  ],

  "dental_vertical": [
    { "term": "dental marketing", "schemaType": "Thing", "aliases": [], "wikipedia": null },
    { "term": "dental SEO", "schemaType": "Thing", "aliases": [], "wikipedia": null },
    { "term": "patient acquisition", "schemaType": "Thing", "aliases": [], "wikipedia": null },
    { "term": "dental clinic", "schemaType": "Thing", "aliases": ["dental practice"], "wikipedia": null }
  ]
}
```

### How the Post-Processor Uses This

1. Loads `entities.json` at runtime.
2. For each H2 section in the article, scans paragraphs left-to-right.
3. First match of any `term` or `alias` (case-insensitive) → wraps in `<strong>` and marks that section's entity-used flag for that term.
4. Subsequent matches of the same term in the same section stay unbolded.
5. New H2 → reset section flags. Same entity can re-bold in the next section.
6. Entities with a non-null `wikipedia` field are also candidates for the schema's `about` or `mentions` arrays (see Section 7).

---

## 7. CONNECTED GRAPH SCHEMA TEMPLATE

Every CiCon blog post has a single `<script type="application/ld+json" id="article-schema">` block in `<head>` containing a 7-node Connected Graph.

### Structure

```json
{
  "@context": "https://schema.org",
  "@graph": [
    { /* BlogPosting */ },
    { /* WebPage */ },
    { /* WebSite (constant) */ },
    { /* BreadcrumbList */ },
    { /* Person — Majid Behzad (constant) */ },
    { /* Organization — CiCon Marketing (constant) */ },
    { /* FAQPage */ }
  ]
}
```

### Full Template (Reference v4 prompt for verbatim per-node JSON)

The complete node-by-node JSON is documented in `/mnt/user-data/outputs/claude_code_prompt_blog_prototype_v4.md` (Change 1, lines 32–214). That JSON is the authoritative template — copy verbatim and adapt only the per-post variables (see Section 13).

### Critical Rules

1. **One script block only.** All nodes in a single `@graph`. Never split into separate scripts.
2. **`@id` values are constant across all CiCon posts** for Person (`https://cicon.ca/#majid-behzad`) and Organization (`https://cicon.ca/#organization`). This is what builds Knowledge Graph authority over time.
3. **FAQPage `mainEntity` must mirror on-page FAQ accordion 1:1.** Straight quotes only (JSON).
4. **`about` vs `mentions`:**
   - `about` = 2–3 core entities the article is fundamentally about.
   - `mentions` = 5–10 secondary entities referenced.
   - No overlap between the two arrays.
5. **Entity `@type` — default is `Thing`.**
   - `Place` for geographic entries.
   - `Organization` for named companies/agencies (e.g., CiCon Marketing).
   - **`Thing` for everything else** — tools, platforms, concepts, software products.
   - **`SoftwareApplication` is never used.** It requires `offers`/`aggregateRating`/`operatingSystem` which don't apply to article mentions. `[slug].astro` enforces this by whitelisting only `Place` and `Organization`; any other value coerces to `Thing`.
6. **`sameAs` URLs must resolve.** If Wikipedia page doesn't exist, omit the entity rather than guess. Use the `wikipedia` field from `entities.json`.
6. **`speakable` CSS selectors must match real DOM classes:**
   - `.quick-answer__body`
   - `.end-cta__stat-number`
   - `.end-cta__stat-context`
7. **Person and Organization nodes are imported from `src/lib/schema-constants.ts`** (see Section 9), never duplicated per post.

---

## 8. SANITY SCHEMA (`blogPost` DOCUMENT TYPE)

### Document Type Definition

```typescript
// sanity/schemas/blogPost.ts
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'meta', title: 'SEO & Meta' },
    { name: 'schema', title: 'Schema Enrichment' },
    { name: 'workflow', title: 'Workflow' },
  ],
  fields: [
    // ── Workflow ──
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'workflow',
      options: {
        list: [
          { title: 'Arvow Imported (Raw)', value: 'arvow-imported' },
          { title: 'Processing', value: 'processing' },
          { title: 'Ready for Review', value: 'ready-for-review' },
          { title: 'Published', value: 'published' },
        ],
      },
      initialValue: 'arvow-imported',
    }),

    // ── Content ──
    defineField({
      name: 'title',
      title: 'Title (H1)',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required().min(30).max(100),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'dek',
      title: 'Subtitle / Dek',
      type: 'text',
      rows: 2,
      group: 'content',
      validation: (Rule) => Rule.required().max(220),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'blogCategory' }],
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero / Featured Image',
      type: 'image',
      options: { hotspot: true },
      group: 'content',
      fields: [
        { name: 'alt', type: 'string', title: 'Alt Text' },
        { name: 'caption', type: 'string', title: 'Caption' },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'readTime',
      title: 'Read Time (minutes)',
      type: 'number',
      group: 'content',
    }),
    defineField({
      name: 'quickAnswer',
      title: 'Quick Answer (Glassmorphism Card)',
      type: 'text',
      rows: 4,
      group: 'content',
      validation: (Rule) => Rule.required().max(500),
    }),
    defineField({
      name: 'body',
      title: 'Article Body',
      type: 'array',
      group: 'content',
      of: [
        { type: 'block' },
        { type: 'statCallout' },
        { type: 'comparisonTabs' },
        { type: 'deepDive' },
        { type: 'pullQuote' },
        { type: 'inlineImage' },
      ],
    }),
    defineField({
      name: 'faqs',
      title: 'FAQ Items',
      type: 'array',
      group: 'content',
      of: [{ type: 'faqItem' }],
    }),
    defineField({
      name: 'endCtaStat',
      title: 'End CTA Stat Block',
      type: 'object',
      group: 'content',
      fields: [
        { name: 'number', type: 'string', title: 'Stat (e.g., "76%")' },
        { name: 'context', type: 'string', title: 'Context Line' },
        { name: 'source', type: 'string', title: 'Source Attribution' },
      ],
    }),
    defineField({
      name: 'relatedPosts',
      title: 'Related Posts (3)',
      type: 'array',
      group: 'content',
      of: [{ type: 'reference', to: [{ type: 'blogPost' }] }],
      validation: (Rule) => Rule.length(3),
    }),

    // ── Meta ──
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      group: 'meta',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 2,
      group: 'meta',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'keywords',
      title: 'Target Keywords',
      type: 'array',
      group: 'meta',
      of: [{ type: 'string' }],
    }),

    // ── Schema Enrichment ──
    defineField({
      name: 'aboutEntities',
      title: 'About (Core Entities — 2-3)',
      type: 'array',
      group: 'schema',
      of: [{ type: 'entityReference' }],
      validation: (Rule) => Rule.min(2).max(3),
    }),
    defineField({
      name: 'mentionsEntities',
      title: 'Mentions (Secondary Entities — 5-10)',
      type: 'array',
      group: 'schema',
      of: [{ type: 'entityReference' }],
      validation: (Rule) => Rule.min(5).max(10),
    }),
  ],
  preview: {
    select: { title: 'title', status: 'status', media: 'heroImage' },
    prepare({ title, status, media }) {
      return {
        title,
        subtitle: `Status: ${status}`,
        media,
      }
    },
  },
})
```

### Supporting Object Types (Required)

- `statCallout` — number, label, source
- `comparisonTabs` — array of tabs (title + Portable Text body)
- `deepDive` — title, body, whyItMatters
- `pullQuote` — quote text, attribution
- `inlineImage` — image, caption, tilt direction
- `faqItem` — question, answer
- `entityReference` — name, type (Thing/Place/Organization — **never SoftwareApplication**), sameAs URL
- `author` — name, jobTitle, bio, photo, knowsAbout (array), social links
- `blogCategory` — name, slug, color override (optional)

---

## 9. SHARED CONSTANTS FILE (`schema-constants.ts`)

Single source of truth for Person and Organization nodes. Imported by every blog post template. Never duplicated.

```typescript
// src/lib/schema-constants.ts

export const PERSON_MAJID = {
  '@type': 'Person',
  '@id': 'https://cicon.ca/#majid-behzad',
  name: 'Majid Behzad',
  givenName: 'Majid',
  familyName: 'Behzad',
  jobTitle: 'Founder & Senior Digital Marketing Strategist',
  description: "Over 15 years building data-driven marketing systems for GTA businesses. Google-certified, Master's in Engineering, Postgraduate in Marketing Management.",
  url: 'https://cicon.ca/about-us/',
  image: 'https://cicon.ca/wp-content/uploads/majid-behzad-headshot.jpg',
  worksFor: { '@id': 'https://cicon.ca/#organization' },
  knowsAbout: [
    'Local Search Engine Optimization',
    'Google Business Profile Optimization',
    'Pay-Per-Click Advertising',
    'Conversion Rate Optimization',
    'Dental Marketing Strategy',
  ],
  alumniOf: [
    { '@type': 'EducationalOrganization', name: "Master's in Engineering" },
    { '@type': 'EducationalOrganization', name: 'Postgraduate Diploma in Marketing Management' },
  ],
  sameAs: [
    'https://linkedin.com/in/majidlm/',
    'https://instagram.com/mbehzadpix/',
  ],
} as const

export const ORG_CICON = {
  '@type': 'Organization',
  '@id': 'https://cicon.ca/#organization',
  name: 'CiCon Marketing',
  alternateName: 'CiCon Digital Marketing',
  url: 'https://cicon.ca/',
  logo: {
    '@type': 'ImageObject',
    url: 'https://cicon.ca/wp-content/uploads/2025/12/primary-color-icon.svg',
    width: 512,
    height: 512,
  },
  description: 'Boutique digital marketing and media production agency based in Richmond Hill, Ontario, serving businesses and dental clinics across the Greater Toronto Area.',
  foundingDate: '2018',
  founder: { '@id': 'https://cicon.ca/#majid-behzad' },
  areaServed: {
    '@type': 'AdministrativeArea',
    name: 'Greater Toronto Area',
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: '131 Golf Club Crt',
    addressLocality: 'Richmond Hill',
    addressRegion: 'ON',
    addressCountry: 'CA',
  },
  telephone: '+1-289-807-1020',
  email: 'info@cicon.ca',
  sameAs: [
    'https://www.facebook.com/ciconmarketing/',
    'https://www.instagram.com/ciconmktg/',
    'https://linkedin.com/company/cicon-marketing/',
  ],
} as const

export const WEBSITE_CICON = {
  '@type': 'WebSite',
  '@id': 'https://cicon.ca/#website',
  url: 'https://cicon.ca/',
  name: 'CiCon Marketing',
  description: 'Boutique digital marketing and media production agency serving the Greater Toronto Area.',
  publisher: { '@id': 'https://cicon.ca/#organization' },
  inLanguage: 'en-CA',
} as const
```

**MJ to confirm before deploy:** logo URL, founding date, LinkedIn company URL, author headshot URL.

---

## 10. PIPELINE A — RETROFIT EXISTING POSTS

For all posts currently on cicon.ca that need migration to the new system while preserving URLs and SEO equity.

### Step-by-Step Workflow

**Step 1 — Export existing posts from WordPress.**
- Use WordPress's built-in export (Tools → Export → All content → XML).
- Save as `cicon-wordpress-export.xml` in `scripts/migration/`.

**Step 2 — Run the migration script.**

Claude Code builds `scripts/migration/import-wordpress.ts`:
- Parses the WordPress XML export.
- For each post: extracts title, slug, content (HTML), categories, tags, publish date, modified date, featured image URL, author.
- Downloads featured images, uploads to Sanity asset library, gets Sanity asset IDs.
- Converts HTML content to raw Portable Text (initial pass — no enrichment yet).
- Creates a `blogPost` document in Sanity with `status: 'arvow-imported'` (treated identically to new Arvow posts from this point forward).
- Preserves original slug exactly (URL continuity is non-negotiable).
- Preserves original `publishedAt` date.

**Step 3 — Claude Code post-processor runs (same as Pipeline B Step 4).**

Each imported post is enriched:
- HTML-style headings normalized to Portable Text blocks with proper IDs.
- 3+ enumerative paragraphs converted to bulleted lists.
- Entity dictionary scan + first-mention-per-section `<strong>` wrapping.
- Tables detected and converted to `comparisonTabs` blocks.
- Numbered Q&A lists detected and converted to `deepDive` arrays.
- FAQ sections (heading text "Frequently Asked Questions") extracted to `faqs` array.
- Stat patterns (e.g., "76% of...", "$1,500 to $5,000") flagged for editor to convert to `statCallout` or `endCtaStat`.
- About/mentions entities pre-populated from Entity Dictionary matches.
- Status updated to `ready-for-review`.

**Step 4 — Editor review in Sanity Studio.**
- Verify hero image renders correctly.
- Confirm Quick Answer card copy is set (extract from intro if missing).
- Confirm FAQ items extracted correctly.
- Confirm End CTA stat is set (manually pick a stat from the article if post-processor didn't flag one).
- Confirm relatedPosts (3) are linked.
- Confirm about/mentions entities are correct (override if needed).
- Set `dateModified` to current timestamp.
- Change status to `published`.

**Step 5 — Vercel rebuilds, post goes live at original URL with full new template.**

**Step 6 — Set up 301 redirects for any URL changes (should be zero for proper migration).**

### Recommended Migration Order

1. **Top 10 highest-traffic posts first** — these get the most editorial attention and benefit from the new template most.
2. Posts with FAQ sections next (easy wins for schema).
3. Posts with comparison tables next (transform to tabbed components).
4. Everything else in batches of 10–20 per week.

### Migration Estimated Effort

- Top 10 posts: 30–45 min of editor review per post = 5–8 hours total.
- Remaining catalog: 10–15 min of editor review per post (assuming clean Arvow-style content).

---

## 11. PIPELINE B — NEW ARVOW POSTS

For all future blog content generated through Arvow.

### Step-by-Step Workflow

**Step 1 — Arvow generates article.**
- Existing Arvow workflow unchanged. 50-topic monthly batch, 5 articles/week.
- Output is markdown.

**Step 2 — Arvow publishes to Sanity via API (not WordPress).**
- Create a Sanity document of type `blogPost` with `status: 'arvow-imported'`.
- Body is raw markdown (will be converted by post-processor).
- Hero image uploaded to Sanity assets, referenced in heroImage field.
- Author defaults to Majid Behzad reference.
- Category set per Arvow's topic mapping.

**Step 3 — Sanity webhook triggers GitHub Action.**
- Webhook fires on document create or status change to `arvow-imported`.
- GitHub Action invokes Claude Code post-processor.

**Step 4 — Claude Code post-processor runs.**

Script: `scripts/post-processor/transform-arvow-post.ts`

For each document with status `arvow-imported`:
1. Set status to `processing`.
2. Parse markdown body into AST (use `unified` + `remark-parse`).
3. Detect first `> Quick Answer:` blockquote → move text to `quickAnswer` field, remove from body.
4. Scan all paragraphs:
   - If paragraph contains 3+ comma-separated enumerations → convert to `<ul>` block.
5. Run entity dictionary scan:
   - For each H2 section, find first match of any term/alias → wrap in `<strong>`.
6. Detect markdown tables → convert to `comparisonTabs` block (each column = tab).
7. Detect numbered lists under H2 with "questions" in heading → convert to `deepDive` array.
8. Detect "Frequently Asked Questions" section → extract Q&A pairs into `faqs` array, remove from body.
9. Detect stat patterns (regex: `\b\d{1,3}%\b`, `\$\d{1,3}(,\d{3})*(\+|\.\d{2})?`, etc.) → suggest top stat for `endCtaStat`.
10. Pre-populate `aboutEntities` (3 entities most-mentioned) and `mentionsEntities` (next 5–10 most-mentioned) from Entity Dictionary matches.
11. Convert final markdown AST to Portable Text via `@portabletext/markdown`.
12. Write enriched document back to Sanity.
13. Set status to `ready-for-review`.
14. Send Slack notification (optional): "[Post Title] ready for review in Sanity Studio."

**Step 5 — Editor review in Sanity Studio.**
- Spot-check entity bolding for accuracy.
- Verify Quick Answer is set.
- Approve or override About/Mentions entities.
- Confirm End CTA stat is appropriate (or pick a different one).
- Link 3 related posts.
- Set status to `published`.

**Step 6 — Vercel rebuilds, post goes live.**

### Why This Pipeline Works

- Arvow does what it does best: generates clean keyword-targeted markdown at volume.
- Claude Code does the heavy lifting Arvow cannot: GEO formatting, entity extraction, schema enrichment, Portable Text transformation.
- Editor does the final quality pass that's required for E-E-A-T compliance and brand voice.
- Sanity Studio is the single editing surface — same workflow for retrofitted posts and new posts.

---

## 12. VALIDATION CHECKLIST

Before any post (Pipeline A retrofit or Pipeline B new) moves from `ready-for-review` to `published`, the editor confirms:

### Content
- [ ] Title is unique, ≤100 chars, includes primary keyword.
- [ ] Slug is unique, lowercase, hyphenated, no trailing slash.
- [ ] Dek is ≤220 chars, summarizes article value.
- [ ] Hero image has alt text and caption.
- [ ] Quick Answer is set and ≤500 chars.
- [ ] At least 3 H2 sections.
- [ ] Bullet-heavy formatting applied (Rule 1).
- [ ] Entity bolding applied (Rule 2) — first mention per H2 section.
- [ ] FAQ section has ≥4 items, each Q&A ≤300 chars.
- [ ] End CTA stat is set.
- [ ] 3 related posts linked.

### Schema
- [ ] About entities = 2–3 items, all have `sameAs` URLs.
- [ ] Mentions entities = 5–10 items, all have `sameAs` URLs, no overlap with About.
- [ ] FAQPage `mainEntity` count matches on-page FAQ count exactly.
- [ ] Person `@id` is `https://cicon.ca/#majid-behzad`.
- [ ] Organization `@id` is `https://cicon.ca/#organization`.
- [ ] `speakable` selectors match real DOM classes.

### Technical
- [ ] Schema passes Google Rich Results Test (zero errors).
- [ ] Schema passes Schema.org Validator (zero errors).
- [ ] Lighthouse Performance ≥ 90.
- [ ] Lighthouse Accessibility ≥ 95.
- [ ] Lighthouse SEO ≥ 95.
- [ ] Lighthouse Best Practices ≥ 95.
- [ ] CLS (Cumulative Layout Shift) ≤ 0.1.
- [ ] LCP (Largest Contentful Paint) ≤ 2.0s.
- [ ] All images have explicit width/height.
- [ ] Hero image is `loading="eager"` + `fetchpriority="high"`. All others `loading="lazy"`.

### URL & Redirects
- [ ] (Pipeline A) Original cicon.ca URL preserved exactly.
- [ ] (Pipeline B) New URL follows pattern `/[slug]/`.
- [ ] (Both) Canonical URL set correctly.

---

## 13. PER-POST VARIABLES

Everything that changes per post vs everything that stays constant.

### PER-POST (Set in Sanity)
- Title, slug, dek, category, hero image, read time
- Quick Answer text
- Article body (Portable Text)
- FAQ items
- End CTA stat (number, context, source)
- Related posts (3 references)
- Meta title, meta description, keywords
- About entities (2–3)
- Mentions entities (5–10)
- `datePublished` (set on first publish)
- `dateModified` (updated on every edit)

### CONSTANT (Imported from `schema-constants.ts`)
- Person node (Majid Behzad) — `@id`, name, jobTitle, knowsAbout, sameAs, alumniOf, etc.
- Organization node (CiCon Marketing) — `@id`, address, telephone, email, logo, sameAs, etc.
- WebSite node — `@id`, url, name, publisher reference.
- All design tokens (colors, fonts, spacing).
- All 11 page sections structure.
- All 5 micro-interactions.
- All GEO formatting rules.
- Sticky header WhatsApp CTA link.
- Footer content.
- `speakable` CSS selectors.

### TEMPLATE-LEVEL (Hardcoded in Astro Component)
- Page structure (11 sections in order)
- Sidebar TOC behavior (auto-generated from H2s)
- Reading progress bar
- Mobile floating TOC trigger
- All component styling
- Dynamic schema injection from Sanity data

---

## 14. ANTI-PATTERNS (DO NOT DO THESE)

### Design
- ❌ Use amber `#FFCF00` as a large background fill (>3% surface area).
- ❌ Add parallax, animated gradients, cursor effects, or showcase tricks beyond the 5 micro-interactions.
- ❌ Hide primary article content behind tabs that require interaction to read.
- ❌ Use `opacity: 0` or animation-gated states for primary content.
- ❌ Add cookie banners, popups, exit-intent modals, or conversion gimmicks.
- ❌ Use lorem ipsum anywhere.

### Schema
- ❌ Split JSON-LD into multiple `<script>` tags. One `@graph` per page.
- ❌ Duplicate Person or Organization data per post. Import from `schema-constants.ts`.
- ❌ Use different `@id` values for Majid or CiCon across posts.
- ❌ Put entities in both `about` and `mentions` arrays.
- ❌ Invent Wikipedia URLs that don't exist. Omit the entity instead.
- ❌ Mismatch FAQPage schema text with on-page FAQ text.
- ❌ Use smart quotes in JSON (use straight quotes).

### GEO
- ❌ Bold full sentences or clauses — only entity noun phrases.
- ❌ Bold the same entity multiple times in the same H2 section.
- ❌ Bold inside headings, accordion question text, tab labels, or buttons.
- ❌ Skip bullet conversion for paragraphs with 3+ enumerations.
- ❌ Hardcode `datePublished` or `dateModified` in source files. Always dynamic from Sanity.

### Pipeline
- ❌ Skip the `ready-for-review` status step. Editor review is mandatory.
- ❌ Change a post's slug after publish without setting up a 301 redirect.
- ❌ Publish a post without 3 related posts linked.
- ❌ Add posts to GA4's "unwanted referrals" list (breaks attribution).
- ❌ Use Cowork/computer-use for unattended publishing. Always supervised.

### Stack
- ❌ Add CSS frameworks beyond Tailwind. No Bootstrap, no Bulma, no Material UI.
- ❌ Add JS libraries beyond what's specified. No jQuery, no Alpine, no Vue.
- ❌ Use icon fonts. Inline SVGs only (Lucide style).
- ❌ Share Sanity projects between CiCon and clients. One project per entity.
- ❌ Hardcode any content in Astro components. Everything comes from Sanity.

---

## VERSION HISTORY

- **v1.0 (May 2026)** — Initial locked spec. Consolidates prototypes v1–v4 + Connected Graph schema + GEO rules + Entity Dictionary + both pipeline workflows.

## NEXT ACTIONS

After this spec is approved:

1. **Astro 5 + Tailwind + Sanity scaffold** per CiCon website-builder skill, adapted for blog template.
2. **Build `src/lib/schema-constants.ts`** with Person, Organization, WebSite constants.
3. **Build `src/lib/entities.json`** with the full Entity Dictionary.
4. **Build all blog template components** per Sections 3–4 of this spec.
5. **Build the Arvow → Portable Text post-processor** at `scripts/post-processor/transform-arvow-post.ts` per Section 11.
6. **Build the WordPress migration script** at `scripts/migration/import-wordpress.ts` per Section 10.
7. **Wire up Sanity webhook → GitHub Action → Vercel rebuild.**
8. **Test pipeline with 3 sample posts** (1 retrofit, 2 new Arvow) end-to-end.
9. **Begin top-10 retrofit batch.**
10. **Activate Arvow → Sanity publishing for new posts.**
