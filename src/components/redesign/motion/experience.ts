/**
 * "The System, Sealed" — experience runtime.
 *
 * Extends the shared Tier-2 motion runtime (reveals, kinetic headers,
 * count-ups, magnetic buttons, Lenis) with the chapter instruments:
 *  - spine progress fill + SYS.PRESSURE readout
 *  - active-chapter tracking (spine nodes + readout name)
 *  - fault log status flips (LEAKING → SEALED)
 *  - module index live tick + MODULE n/12 counter
 *  - method rail scrubbed line draw
 *  - seal line + ring scrubbed draw with completion glow
 *  - nav frost toggle
 *
 * Loaded only when prefers-reduced-motion is NOT set; every state it drives
 * has a complete static default in CSS/markup.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initMotion } from './motion';

export function initExperience() {
  initMotion();
  gsap.registerPlugin(ScrollTrigger);

  /* ── Nav frost — transparent over the hero, frosted after ── */
  const nav = document.getElementById('x-nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('is-solid', window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ── Spine fill + pressure readout ── */
  const fill = document.getElementById('x-spine-fill');
  const pct = document.getElementById('x-readout-pct');
  if (fill || pct) {
    ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate(self) {
        if (fill) fill.style.transform = `scaleY(${self.progress})`;
        if (pct) pct.textContent = `${String(Math.round(self.progress * 100)).padStart(3, '0')}%`;
      },
    });
  }

  /* ── Active chapter → spine node + readout name ── */
  const chName = document.getElementById('x-readout-ch');
  const nodes = new Map(
    Array.from(document.querySelectorAll<HTMLElement>('.x-spine-node')).map((n) => [
      n.dataset.spine,
      n,
    ]),
  );
  document.querySelectorAll<HTMLElement>('[data-ch]').forEach((sec) => {
    ScrollTrigger.create({
      trigger: sec,
      start: 'top 50%',
      end: 'bottom 50%',
      onToggle(self) {
        if (!self.isActive) return;
        nodes.forEach((n) => n.classList.remove('is-active'));
        nodes.get(sec.id)?.classList.add('is-active');
        if (chName && sec.dataset.ch && sec.dataset.chname) {
          chName.textContent = `CH/${sec.dataset.ch} — ${sec.dataset.chname}`;
        }
      },
    });
  });

  /* ── Fault log: rows flip LEAKING → SEALED as they pass ── */
  document.querySelectorAll<HTMLElement>('.x-fault').forEach((f) => {
    ScrollTrigger.create({
      trigger: f,
      start: 'top 62%',
      once: true,
      onEnter: () => f.classList.add('is-sealed'),
    });
  });

  /* ── Module index: live tick + counter ── */
  const counter = document.getElementById('x-mod-counter');
  document.querySelectorAll<HTMLElement>('.x-mod').forEach((m, i) => {
    ScrollTrigger.create({
      trigger: m,
      start: 'top 58%',
      end: 'bottom 58%',
      onToggle(self) {
        m.classList.toggle('is-live', self.isActive);
        if (self.isActive && counter) counter.textContent = String(i + 1).padStart(2, '0');
      },
    });
  });

  /* ── Method rail: scrubbed line draw ── */
  const railFill = document.getElementById('x-rail-fill');
  if (railFill) {
    gsap.fromTo(
      railFill,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: railFill.closest('.x-rail') as HTMLElement,
          start: 'top 72%',
          end: 'bottom 55%',
          scrub: 0.4,
        },
      },
    );
  }

  /* ── The seal: line descends, ring closes, glow on completion ── */
  const sealLine = document.getElementById('x-seal-line') as SVGPathElement | null;
  const sealRing = document.getElementById('x-seal-ring') as SVGCircleElement | null;
  const sealNode = document.getElementById('x-seal-node');
  const sealCh = document.getElementById('ch-07');
  if (sealLine && sealRing && sealCh) {
    const lineLen = sealLine.getTotalLength();
    const ringLen = 2 * Math.PI * 142;
    gsap.set(sealLine, { strokeDasharray: lineLen, strokeDashoffset: lineLen });
    gsap.set(sealRing, {
      strokeDasharray: ringLen,
      strokeDashoffset: ringLen,
      rotate: -90,
      transformOrigin: '50% 50%',
    });
    if (sealNode) gsap.set(sealNode, { opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sealCh,
        start: 'top 80%',
        end: 'top 18%',
        scrub: 0.5,
        onLeave: () => sealCh.classList.add('is-sealed'),
        onEnterBack: () => sealCh.classList.remove('is-sealed'),
      },
    });
    tl.to(sealLine, { strokeDashoffset: 0, ease: 'none', duration: 0.3 }, 0);
    if (sealNode) tl.to(sealNode, { opacity: 1, duration: 0.06 }, 0.28);
    tl.to(sealRing, { strokeDashoffset: 0, ease: 'none', duration: 0.64 }, 0.34);
  }
}
