/**
 * Shared Lenis singleton for the redesign preview page.
 *
 * Both the hero WebGL scene (leak-scene/mount.tsx) and the page motion
 * runtime (motion.ts) import this module, so whichever loads first creates
 * the one instance and the other reuses it — one smooth-scroll loop for the
 * whole page, driven by GSAP's ticker, with ScrollTrigger kept in sync.
 *
 * Only instantiated on fine-pointer devices without reduced-motion; on touch
 * Lenis is inert anyway, so callers get null and native scrolling stands.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

let instance: Lenis | null = null;
let started = false;

export function getLenis(): Lenis | null {
  if (started) return instance;
  started = true;

  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const motionOK = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
  if (!finePointer || !motionOK) return null;

  gsap.registerPlugin(ScrollTrigger);
  instance = new Lenis({ duration: 1.15 });
  instance.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    instance?.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
  return instance;
}
