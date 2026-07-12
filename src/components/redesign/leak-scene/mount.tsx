/**
 * "The Leak, Sealed" — scroll-driven WebGL particle field.
 *
 * One THREE.Points mesh (~6,000 particles). Every particle carries three
 * "homes": a scattered/leaking state, an ordered pipeline state and an upward
 * stream state. A single scroll progress value (0→1) drives the choreography
 * in the vertex shader:
 *
 *   Phase A (0 → ~0.35)  scattered, drifting, a subset leaks off bottom-left
 *   Phase B (~0.35→0.7)  pulled into a converging left→right pipeline
 *   Phase C (~0.7 → 1)   tightens into a rising amber stream + DOM metric
 *
 * Render path: React Three Fiber v9 custom root (createRoot on the existing
 * <canvas>) — no react-dom, which keeps the chunk meaningfully lighter than a
 * <Canvas> tree. frameloop is 'never'; GSAP's ticker drives Lenis and R3F's
 * advance() from one loop, and skips rendering while the hero is off-screen
 * or the tab is backgrounded.
 */
import * as React from 'react';
import { createRoot, advance, useFrame, useThree } from '@react-three/fiber';
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  MathUtils,
  Points,
  ShaderMaterial,
  Vector2,
} from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getLenis } from '../motion/lenis-shared';

const COUNT = 6000;
const FOV = 50;
const CAM_Z = 14;
const PIN_LENGTH = '+=175%'; // hero stays pinned for 1.75 extra viewports
const METRIC_MAX = 184;

interface Driver {
  target: number;          // raw scroll progress from ScrollTrigger
  progress: number;        // damped value fed to the shader
  ndc: Vector2;            // pointer in normalized device coords
  pointerWorld: Vector2;   // pointer on the z=0 plane, world units
  pointerOn: number;
}

/* ── Shaders ─────────────────────────────────────────────────────────── */

const VERT = /* glsl */ `
  attribute vec3 aPipe;
  attribute vec3 aStream;   // x: lateral offset, y: flow phase [0,15), z: depth
  attribute vec4 aSeed;     // x: rand, y: size mult, z: color mix, w: leak flag

  uniform float uProgress;
  uniform float uTime;
  uniform vec2  uPointer;
  uniform float uPointerOn;
  uniform float uPR;
  uniform float uSize;

  varying vec3  vColor;
  varying float vAlpha;

  const vec3 AMBER = vec3(1.0, 0.812, 0.0);     // #FFCF00
  const vec3 GOLD  = vec3(0.616, 0.514, 0.243); // #9D833E

  void main() {
    float p    = uProgress;
    float rest = 1.0 - smoothstep(0.18, 0.42, p);
    float pb   = smoothstep(0.35, 0.70, p);
    float pc   = smoothstep(0.70, 1.00, p);
    // per-particle stagger so the states resolve organically, not as one blob
    float pbi = smoothstep(0.0, 1.0, clamp((pb - aSeed.x * 0.22) / 0.78, 0.0, 1.0));
    float pci = smoothstep(0.0, 1.0, clamp((pc - aSeed.x * 0.18) / 0.82, 0.0, 1.0));

    vec3 pos = position;

    // ambient drift while scattered
    pos += vec3(
      sin(uTime * 0.32 + aSeed.x * 43.0),
      cos(uTime * 0.27 + aSeed.x * 71.0),
      sin(uTime * 0.21 + aSeed.x * 89.0)
    ) * 0.38 * rest;

    // the leak — flagged particles bleed off the bottom-left edge on a loop
    float leak = aSeed.w * rest;
    float lt = fract(uTime * 0.045 + aSeed.x * 5.0);
    pos += vec3(-15.0, -10.0, 0.0) * (lt * lt) * leak;
    float leakFade = 1.0 - smoothstep(0.45, 0.9, lt) * aSeed.w;
    leakFade = mix(1.0, leakFade, rest);

    // gentle cursor repulsion at rest (scene only mounts on fine pointers)
    vec2 dp = pos.xy - uPointer;
    float pdist = length(dp);
    float rep = (1.0 - smoothstep(0.0, 2.8, pdist)) * rest * uPointerOn;
    pos.xy += (dp / max(pdist, 0.001)) * rep * 1.15;

    // Phase B — converging pipeline with a slight transverse shimmer
    vec3 pipe = aPipe;
    pipe.y += sin(uTime * 1.3 + aSeed.x * 31.0 + pipe.x * 0.7) * 0.07;
    pos = mix(pos, pipe, pbi);

    // Phase C — upward stream, tightening into a rising line
    float flowSpeed = 0.9 + aSeed.x * 1.6;
    float yPhase = mod(aStream.y + uTime * flowSpeed * pci, 15.0);
    vec3 stream;
    stream.x = 3.9 + aStream.x * mix(1.0, 0.14, pci);
    stream.y = yPhase - 7.5;
    stream.z = aStream.z * mix(1.0, 0.25, pci);
    pos = mix(pos, stream, pci);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * aSeed.y * uPR * (14.0 / max(0.1, -mv.z)) * mix(1.0, 0.85, pci);

    float streamEdgeFade = 1.0 - smoothstep(5.9, 7.4, abs(stream.y));
    vAlpha = mix(1.0, streamEdgeFade, pci) * leakFade;

    // duller gold while leaking → brighter amber once ordered
    float glow = mix(aSeed.z * 0.62, 0.4 + aSeed.z * 0.6, max(pbi, pci));
    vColor = mix(GOLD, AMBER, glow);
  }
`;

const FRAG = /* glsl */ `
  precision mediump float;
  varying vec3  vColor;
  varying float vAlpha;

  void main() {
    // soft round sprite, shader-based — no texture fetch
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.10, d);
    if (a < 0.003) discard;
    gl_FragColor = vec4(vColor, a * vAlpha * 0.85);
  }
`;

/* ── Geometry ────────────────────────────────────────────────────────── */

function buildParticles() {
  const scatter = new Float32Array(COUNT * 3);
  const pipe = new Float32Array(COUNT * 3);
  const stream = new Float32Array(COUNT * 3);
  const seed = new Float32Array(COUNT * 4);

  for (let i = 0; i < COUNT; i++) {
    const i3 = i * 3;
    const i4 = i * 4;

    // scattered/leaking home — a wide, loose slab
    scatter[i3 + 0] = (Math.random() * 2 - 1) * 13;
    scatter[i3 + 1] = (Math.random() * 2 - 1) * 7.4;
    scatter[i3 + 2] = (Math.random() * 2 - 1) * 3.2 - 0.5;

    // ordered pipeline home — six lanes converging left→right, dipping
    // slightly toward the stream intake
    const t = Math.random();
    const lane = Math.floor(Math.random() * 6);
    const laneY = (lane - 2.5) * 1.35;
    pipe[i3 + 0] = -11 + t * 16;
    pipe[i3 + 1] = laneY * (1 - 0.85 * t) + (Math.random() - 0.5) * 0.18 - 0.6 * t;
    pipe[i3 + 2] = (Math.random() * 2 - 1) * 0.7;

    // stream home — lateral offset, vertical flow phase, depth
    stream[i3 + 0] = (Math.random() * 2 - 1) * 0.55;
    stream[i3 + 1] = Math.random() * 15;
    stream[i3 + 2] = (Math.random() * 2 - 1) * 0.5;

    seed[i4 + 0] = Math.random();                       // rand
    seed[i4 + 1] = 0.6 + Math.random() * 0.9;           // size mult
    seed[i4 + 2] = Math.random();                       // color mix
    seed[i4 + 3] = Math.random() < 0.26 ? 1 : 0;        // leak flag
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(scatter, 3));
  geometry.setAttribute('aPipe', new BufferAttribute(pipe, 3));
  geometry.setAttribute('aStream', new BufferAttribute(stream, 3));
  geometry.setAttribute('aSeed', new BufferAttribute(seed, 4));

  const material = new ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: {
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uPointer: { value: new Vector2(0, -100) },
      uPointerOn: { value: 0 },
      uPR: { value: Math.min(window.devicePixelRatio || 1, 2) },
      uSize: { value: 2.6 },
    },
  });

  const points = new Points(geometry, material);
  points.frustumCulled = false; // vertices move in the shader
  return { points, material, geometry };
}

/* ── Scene component ─────────────────────────────────────────────────── */

function Scene({ driver }: { driver: Driver }) {
  const camera = useThree((s) => s.camera);
  const { points, material, geometry } = React.useMemo(buildParticles, []);

  React.useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.05);
    driver.progress = MathUtils.damp(driver.progress, driver.target, 5, d);

    const u = material.uniforms;
    u.uProgress.value = driver.progress;
    u.uTime.value += d;
    (u.uPointer.value as Vector2).lerp(driver.pointerWorld, 1 - Math.exp(-8 * d));
    u.uPointerOn.value = MathUtils.damp(u.uPointerOn.value, driver.pointerOn, 6, d);

    // whole-field parallax at rest only
    const restWeight = 1 - MathUtils.smoothstep(driver.progress, 0.15, 0.4);
    camera.position.x = MathUtils.damp(camera.position.x, driver.ndc.x * 0.55 * restWeight, 4, d);
    camera.position.y = MathUtils.damp(camera.position.y, driver.ndc.y * 0.35 * restWeight, 4, d);
    camera.lookAt(0, 0, 0);
  });

  return <primitive object={points} />;
}

/* ── Mount / teardown ────────────────────────────────────────────────── */

export function mountHeroScene() {
  const section = document.getElementById('ch-01') ?? document.getElementById('hls');
  const canvas = document.getElementById('hls-canvas') as HTMLCanvasElement | null;
  const stage = document.getElementById('hls-stage');
  const metric = document.getElementById('hls-metric');
  const metricValue = document.getElementById('hls-metric-value');
  const hint = document.getElementById('hls-hint');
  if (!section || !canvas) return;

  gsap.registerPlugin(ScrollTrigger);

  const driver: Driver = {
    target: 0,
    progress: 0,
    ndc: new Vector2(0, 0),
    pointerWorld: new Vector2(0, -100),
    pointerOn: 0,
  };

  /* R3F custom root on the existing canvas */
  const root = createRoot(canvas);
  const sizeOf = () => ({
    width: section.clientWidth,
    height: section.clientHeight,
    top: 0,
    left: 0,
  });
  const configure = () =>
    root.configure({
      frameloop: 'never',
      dpr: Math.min(window.devicePixelRatio || 1, 2),
      camera: { fov: FOV, near: 0.1, far: 80, position: [0, 0, CAM_Z] },
      gl: {
        antialias: false,
        alpha: true,
        powerPreference: 'high-performance',
        failIfMajorPerformanceCaveat: true,
      },
      size: sizeOf(),
    });

  try {
    configure();
    root.render(<Scene driver={driver} />);
  } catch (err) {
    console.warn('[hls] WebGL init failed, keeping CSS fallback', err);
    section.classList.add('hls-static');
    return;
  }

  /* pointer → world coords on the z=0 plane */
  let halfH = Math.tan((FOV / 2) * (Math.PI / 180)) * CAM_Z;
  let halfW = halfH * (section.clientWidth / Math.max(1, section.clientHeight));
  const onPointerMove = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
    const ny = -(((e.clientY - r.top) / r.height) * 2 - 1);
    driver.ndc.set(nx, ny);
    driver.pointerWorld.set(nx * halfW, ny * halfH);
    driver.pointerOn = 1;
  };
  const onPointerOut = () => {
    driver.pointerOn = 0;
  };
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  document.documentElement.addEventListener('mouseleave', onPointerOut);

  /* resize — also re-measures the pin: some environments (background tabs,
     embedded webviews) never fire window resize, so RO is the reliable signal */
  let refreshTimer = 0;
  const onResize = () => {
    configure();
    root.render(<Scene driver={driver} />);
    halfW = halfH * (section.clientWidth / Math.max(1, section.clientHeight));
    window.clearTimeout(refreshTimer);
    refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 80);
  };
  const ro = new ResizeObserver(onResize);
  ro.observe(section);

  /* Lenis smooth scroll — page-wide singleton shared with the Tier 2
     motion runtime (whichever module loads first creates it) */
  getLenis();

  /* scroll choreography */
  const st = ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: PIN_LENGTH,
    pin: true,
    anticipatePin: 1,
    onUpdate(self) {
      const p = self.progress;
      driver.target = p;
      if (hint) hint.style.opacity = String(Math.max(0, 1 - p * 12));
      if (metric && metricValue) {
        const on = p > 0.72;
        metric.classList.toggle('is-on', on);
        if (on) {
          const t = MathUtils.clamp((p - 0.72) / 0.26, 0, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          metricValue.textContent = `+${Math.round(eased * METRIC_MAX)}%`;
        }
      }
    },
  });

  /* pause rendering when the hero is off-screen or the tab is backgrounded */
  let inView = true;
  const io = new IntersectionObserver(
    (entries) => {
      inView = entries[0]?.isIntersecting ?? true;
    },
    { rootMargin: '120px' },
  );
  io.observe(section);

  /* GSAP's ticker drives the WebGL frame (Lenis rides the same ticker via
     the shared singleton) */
  const tickRender = () => {
    if (inView && !document.hidden) advance(performance.now());
  };
  gsap.ticker.add(tickRender);
  gsap.ticker.lagSmoothing(0);

  /* reveal the canvas after the first real frame — opacity only, no layout */
  requestAnimationFrame(() => {
    advance(performance.now());
    stage?.classList.add('is-live');
  });

  const destroy = () => {
    gsap.ticker.remove(tickRender);
    st.kill();
    io.disconnect();
    ro.disconnect();
    window.removeEventListener('pointermove', onPointerMove);
    document.documentElement.removeEventListener('mouseleave', onPointerOut);
    root.unmount(); // unmounts Scene → disposes geometry/material via effect
  };
  document.addEventListener('astro:before-swap', destroy, { once: true });
  if (import.meta.hot) import.meta.hot.dispose(destroy);

  if (import.meta.env.DEV) {
    // dev-only handle so the scene can be driven/inspected from the console
    (window as unknown as Record<string, unknown>).__hls = {
      driver,
      st,
      advanceFrame: () => advance(performance.now()),
    };
  }

  return destroy;
}
