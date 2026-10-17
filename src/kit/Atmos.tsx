import React from 'react';
import {AbsoluteFill} from 'remotion';
import {useCurrentFrame} from '../lib/frame';
import {rand} from '../lib/anim';
import {W, H} from '../lib/timeline';

export const Backdrop: React.FC<{intensity?: number; glow?: string; gx?: number; gy?: number; haze?: number}> =
  ({intensity = 1, glow = 'rgba(176,138,58,0.10)', gx = 50, gy = 40, haze = 1}) => {
    const f = useCurrentFrame();
    const dx = Math.sin(f / 90) * 6, dy = Math.cos(f / 110) * 4;
    return (
      <AbsoluteFill style={{opacity: intensity}}>
        <AbsoluteFill style={{background: `radial-gradient(ellipse 70% 45% at ${gx + dx}% ${gy + dy}%, ${glow}, transparent 70%), radial-gradient(ellipse 120% 80% at 50% 110%, #14161a 0%, #07080a 55%, #020203 100%)`}} />
        <AbsoluteFill style={{opacity: 0.5 * haze, filter: 'blur(30px)', background: `radial-gradient(circle at ${30 + Math.sin(f / 70) * 12}% 70%, rgba(120,130,145,.10), transparent 40%), radial-gradient(circle at ${75 + Math.cos(f / 85) * 10}% 30%, rgba(120,130,145,.08), transparent 45%)`}} />
      </AbsoluteFill>
    );
  };

/** Partikel logam: posisi = fungsi deterministik dari frame + seed */
export const Particles: React.FC<{n: number; seed: number; speed?: number; color?: string; opacity?: number}> =
  ({n, seed, speed = 1, color = '#d8c58a', opacity = 1}) => {
    const f = useCurrentFrame();
    return (
      <AbsoluteFill style={{opacity}}>
        {Array.from({length: n}).map((_, i) => {
          const r1 = rand(seed + i * 1.7), r2 = rand(seed + i * 2.9), r3 = rand(seed + i * 4.3);
          const x = (r1 * W + Math.sin(f / 60 + i) * 14) % W;
          const y = ((r2 * H - f * speed * (0.3 + r3 * 0.8)) % H + H) % H;
          const s = 1.5 + r3 * 3.5;
          return <div key={i} style={{position: 'absolute', left: x, top: y, width: s, height: s, borderRadius: '50%',
            background: color, opacity: 0.25 + r1 * 0.5, boxShadow: `0 0 ${s * 3}px ${color}`}} />;
        })}
      </AbsoluteFill>
    );
  };

export const Vignette: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none', background: 'radial-gradient(ellipse 85% 70% at 50% 50%, transparent 45%, rgba(0,0,0,0.7) 100%)'}} />
);

/** Film grain halus; seed berganti per frame (deterministik) */
export const Grain: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'overlay', opacity: 0.1}}>
      <svg width="100%" height="100%">
        <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={f % 7} /></filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};

/** Sapuan cahaya emas diagonal. t: 0..1 */
export const Sweep: React.FC<{t: number; peak?: number}> = ({t, peak = 0.6}) => (
  <AbsoluteFill style={{pointerEvents: 'none', overflow: 'hidden', opacity: Math.sin(Math.PI * Math.min(1, Math.max(0, t))) * peak, mixBlendMode: 'screen'}}>
    <div style={{position: 'absolute', top: -200, height: H + 400, width: 380, left: -600 + t * (W + 1200),
      transform: 'skewX(-20deg)', filter: 'blur(14px)',
      background: 'linear-gradient(90deg, transparent, rgba(255,226,150,0.75), transparent)'}} />
  </AbsoluteFill>
);
