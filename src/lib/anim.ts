import {Easing, interpolate, spring} from 'remotion';

export type Ease = (t: number) => number;
export type Pt = [number, number];

/** Kurva easing reusable (setara graph editor): cubic-bezier */
export const ease = {
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  out: Easing.bezier(0.16, 1, 0.3, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
  soft: Easing.bezier(0.45, 0, 0.15, 1),
  overshoot: Easing.bezier(0.34, 1.25, 0.64, 1),
  linear: (t: number) => t,
};

/** progress 0..1 dari frame a ke b, extrapolasi di-clamp secara eksplisit */
export const prog = (f: number, a: number, b: number, e: Ease = ease.inOut) =>
  interpolate(f, [a, b], [0, 1], {easing: e, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Keyframe track: easing segmen = easing milik keyframe tujuan */
export type KF = {f: number; v: number; e?: Ease};
export const track = (f: number, kfs: KF[]): number => {
  if (f <= kfs[0].f) return kfs[0].v;
  for (let i = 1; i < kfs.length; i++) {
    if (f <= kfs[i].f) {
      const a = kfs[i - 1], b = kfs[i];
      return lerp(a.v, b.v, prog(f, a.f, b.f, b.e ?? ease.inOut));
    }
  }
  return kfs[kfs.length - 1].v;
};

/** Random deterministik (seeded) */
export const rand = (seed: number) => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

export const sp = (frame: number, fps: number, delay: number, damping = 18) =>
  spring({frame: frame - delay, fps, config: {damping, stiffness: 120, mass: 0.9}});

export const walk = (n: number, seed: number, start: number, drift: number, vol: number, min = 30) => {
  const out: number[] = [];
  let v = start;
  for (let i = 0; i < n; i++) {
    v = Math.max(min, v + drift + (rand(seed + i * 7.13) - 0.5) * 2 * vol);
    out.push(v);
  }
  return out;
};

export type CandleData = {open: number; close: number; high: number; low: number};
export const candlesFrom = (closes: number[], seed: number, start: number): CandleData[] =>
  closes.map((c, i) => {
    const o = i === 0 ? start : closes[i - 1];
    return {
      open: o, close: c,
      high: Math.max(o, c) + rand(seed + i * 3.7) * 26 + 6,
      low: Math.max(8, Math.min(o, c) - rand(seed + i * 5.1) * 26 - 6),
    };
  });

export const lerpPts = (a: Pt[], b: Pt[], t: number): Pt[] =>
  a.map((p, i) => [lerp(p[0], b[i][0], t), lerp(p[1], b[i][1], t)] as Pt);
export const ptsToPath = (p: Pt[], close = false) =>
  p.map((q, i) => `${i ? 'L' : 'M'}${q[0].toFixed(2)} ${q[1].toFixed(2)}`).join(' ') + (close ? ' Z' : '');
