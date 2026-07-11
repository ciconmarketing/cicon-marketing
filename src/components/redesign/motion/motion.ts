/**
 * Redesign Tier 2 — shared motion runtime for /redesign-preview.
 *
 * One consistent language across every section:
 *  - Lenis smooth scroll (shared singleton, also used by the hero scene)
 *  - Section-entry reveals: batched, staggered fade + short translate-up,
 *    fire once (.rd-r elements)
 *  - Kinetic headers: one masked line-rise treatment (.rd-k / .rd-k-in)
 *  - Step connector line draw (.rd-steps-line)
 *  - Count-ups to the real values already server-rendered in the markup
 *    (.rd-count with data-rd-target / data-rd-suffix)
 *  - Magnetic primary buttons (.rd-mag) — desktop fine-pointer only
 *
 * The page boots this module only when prefers-reduced-motion is NOT set;
 * with reduced motion the <html> never gets .rd-motion, all content is
 * fully visible statically and nothing here runs.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getLenis } from './lenis-shared';

export function initMotion() {
  gsap.registerPlugin(ScrollTrigger);
  getLenis(); // no-op on touch; shared with the hero scene on desktop

  /* ── Kinetic section headers — masked line rise, once ──
     CSS parks .rd-k-in at translateY(112%); the tween ends on an inline
     transform of 0 which stays put (clearing it would let the CSS
     hide-rule re-apply). */
  gsap.utils.toArray<HTMLElement>('.rd-k-in').forEach((el) => {
    gsap.to(el, {
      y: 0,
      duration: 0.75,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });

  /* ── Batched section reveals — fade + short rise, once ── */
  ScrollTrigger.batch('.rd-r', {
    start: 'top 90%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.08,
        overwrite: true,
      }),
  });

  /* ── How-it-works connector line draw ── */
  gsap.utils.toArray<HTMLElement>('.rd-steps-line').forEach((line) => {
    gsap.to(line, {
      scaleX: 1,
      duration: 1.4,
      ease: 'power2.inOut',
      scrollTrigger: { trigger: line, start: 'top 85%', once: true },
    });
  });

  /* ── Count-ups to the server-rendered real values ── */
  gsap.utils.toArray<HTMLElement>('.rd-count').forEach((el) => {
    const target = parseFloat(el.dataset.rdTarget ?? '');
    const suffix = el.dataset.rdSuffix ?? '';
    if (!Number.isFinite(target)) return;
    const state = { v: 0 };
    el.textContent = `0${suffix}`;
    gsap.to(state, {
      v: target,
      duration: 2,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      onUpdate: () => {
        el.textContent = `${Math.round(state.v)}${suffix}`;
      },
    });
  });

  /* ── Magnetic buttons — desktop only, subtle pull ── */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    gsap.utils.toArray<HTMLElement>('.rd-mag').forEach((btn) => {
      const toX = gsap.quickTo(btn, 'x', { duration: 0.35, ease: 'power3.out' });
      const toY = gsap.quickTo(btn, 'y', { duration: 0.35, ease: 'power3.out' });
      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        toX((e.clientX - (r.left + r.width / 2)) * 0.18);
        toY((e.clientY - (r.top + r.height / 2)) * 0.22);
      });
      btn.addEventListener('pointerleave', () => {
        toX(0);
        toY(0);
      });
    });
  }

  /* Late layout shifts (fonts, video poster) — re-measure pins/triggers */
  window.setTimeout(() => ScrollTrigger.refresh(), 400);

  if (import.meta.env.DEV) {
    // dev-only handle so the motion system can be driven from the console
    (window as unknown as Record<string, unknown>).__rd = { gsap, ScrollTrigger };
  }
}
