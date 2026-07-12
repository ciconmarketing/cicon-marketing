# ASSET MANIFEST — "The System, Sealed" (/redesign-preview)

Every media slot in the redesigned homepage, its current state, and a ready-to-run
generation prompt where an asset is still to be produced. **Every slot ships with a
coded placeholder/fallback — the page is fully functional and reviewable with zero
generated assets.**

Design rule: no stock imagery, ever. Slots either use CiCon's real client media,
generated originals, or a coded composition.

---

## 1. Hero fallback poster — `public/redesign/hero-poster.jpg`

| | |
|---|---|
| **Role** | Atmospheric backdrop under the CSS glow for contexts that never get WebGL (mobile, reduced-motion, no-GL). Desktop WebGL renders the live particle field instead. |
| **Placement** | `ChLeak.astro` → `.hls-bg` layer (opacity ≈ 0.4, `object-fit: cover`) |
| **Dimensions** | 2560 × 1440 (16:9), crop-safe to 9:16 centre |
| **Format / size** | JPEG quality ~70 → **target ≤ 180 KB** (run through `squoosh`/`sharp` before commit) |
| **Status** | ✅ Generated via Higgsfield · GPT Image 2 (job `5e23c182-2322-448f-9d19-ad83e635efbc`) |
| **Coded fallback** | Layered radial-gradient amber glow on void (already live) |

**Prompt (GPT Image 2, 16:9, 2k, high):**
> Ultra-dark abstract macro photograph: thousands of tiny molten-amber light particles (hex #FFCF00) drifting diagonally through a near-black charcoal void (hex #0E0E14), a loose stream of golden sparks scattering and leaking toward the lower-left corner, faint depth-of-field bokeh on individual sparks, very subtle dark-goldenrod haze in the upper-right third, cinematic contrast, pitch-black negative space dominating 65% of the frame, premium moody atmosphere. No text, no logos, no recognizable objects — pure atmospheric particle field.

---

## 2. Showreel — `public/real-client-results.mp4` + poster

| | |
|---|---|
| **Role** | CH/06 "What We Capture" media frame (`REEL/01 — CLIENT RESULTS`) |
| **Placement** | `ChProof.astro` → `.x-media-frame` |
| **Dimensions** | 16:9, 1920 × 1080 |
| **Format / size** | H.264 MP4, poster JPEG ≤ 150 KB |
| **Status** | ✅ Real client footage already in repo — authentic beats generated; keep. |
| **Coded fallback** | Poster-first, `preload="none"`, autoplay only in-view + motion-allowed |

**Optional future upgrade (Seedance 2.0, 8s loop, 16:9, no audio):**
> Cinematic interior b-roll montage, luxury custom home at dusk: slow dolly past a two-storey staircase with sculptural amber pendant lights, warm practical lighting against deep charcoal shadows, shallow depth of field, gentle 24fps motion cadence, colour palette anchored on molten amber #FFCF00 against near-black, premium real-estate film look, no people, no text, seamless loop.

---

## 3. Industry panels × 4 — Sanity CDN (`whoWeServe[].imageUrl`)

| | |
|---|---|
| **Role** | CH/05 "Who We Serve" segment panels (SEG/01–04) |
| **Placement** | `ChWho.astro` → `.x-seg img`, duotone-treated in CSS (grayscale + amber scrim) |
| **Dimensions** | 1000 × 750 (4:3) |
| **Format / size** | JPEG/WebP ≤ 120 KB each |
| **Status** | ✅ Real client images flow from Sanity (same source as live site) |
| **Coded fallback** | `.x-seg--ph` schematic amber iso-grid panel renders when no image is set |

**Regeneration prompts (GPT Image 2, 4:3, 1k, medium) — only if Sanity images are ever retired:**
1. *Dental Clinics* — "Minimal premium dental operatory at night, single amber accent light washing over matte charcoal walls, brushed-steel chair silhouette in shadow, moody editorial architecture photograph, no people, no text."
2. *Home Improvement & Trades* — "Macro of a brass level tool and carpenter pencil on dark walnut, dramatic amber rim-light against near-black background, premium tool-brand editorial photograph, no hands, no text."
3. *Showrooms & Retailers* — "Dark luxury kitchen showroom vignette, one amber pendant glowing over a waterfall-edge island, deep charcoal shadows, architectural digest editorial mood, no people, no text."
4. *B2B Service Providers* — "Abstract glass office facade at night reflecting scattered amber window lights against a black sky, moody minimal corporate editorial photograph, no people, no text."

---

## 4. Client logo marquee — `public/clients-logo/*`

12 real client logos on light legibility chips. ✅ In repo, verbatim from live site. No generation.

## 5. Tool-stack marquee — `public/logos/tools/*.svg`

9 real platform logos (Google Ads, Meta, GBP, GA4, WordPress, GoHighLevel, Shopify, Ahrefs, Bing). ✅ In repo. Trademark property of their owners — never regenerate.

## 6. Brand mark — `public/logo-cicon-120.webp`

Nav + footer. ✅ In repo (same asset the live site serves).

---

## 7. OG / social card — `public/redesign/og-system-sealed.jpg` (deferred)

| | |
|---|---|
| **Role** | Social share card if/when the redesign ships to production (`og:image`) |
| **Dimensions** | 1200 × 630 |
| **Format / size** | JPEG ≤ 200 KB |
| **Status** | ⏳ Deferred — preview page is `noindex`, card is production-day work |
| **Recommended build** | Code it (Clash Display headline on void + amber particle band from asset #1) rather than generating type — brand font fidelity matters more than AI text rendering. |

**Prompt if generated anyway (GPT Image 2, 3:2 → crop 1200×630, 1k, high):**
> Dark premium marketing banner background: near-black charcoal (#0E0E14) with a thin horizontal stream of molten-amber light particles flowing left to right across the lower third, subtle blueprint grid barely visible, generous black negative space in the upper two-thirds for headline typography to be composited later, no text, no logos.
