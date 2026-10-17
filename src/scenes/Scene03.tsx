import React, {useMemo} from 'react';
import {AbsoluteFill} from 'remotion';
import {useCurrentFrame} from '../lib/frame';
import {Backdrop, Particles, Sweep} from '../kit/Atmos';
import {MarketDefs} from '../kit/Candle';
import {Cuboid, metal} from '../kit/Cuboid';
import {Label} from '../kit/Type';
import {Pt, ease, lerpPts, prog, ptsToPath, track, walk} from '../lib/anim';
import {COLORS, H, W} from '../lib/timeline';

const CX = W / 2, CY = 940, NP = 60;
const RING: Pt[] = Array.from({length: NP}, (_, i) => {
  const a = (i / (NP - 1)) * Math.PI * 2 - Math.PI / 2;
  return [CX + Math.cos(a) * 300, CY + Math.sin(a) * 120] as Pt;
});

export const Scene03: React.FC = () => {
  const f = useCurrentFrame();
  const ys = useMemo(() => walk(NP, 21, 0, 0, 38, -200), []);
  const chart: Pt[] = useMemo(() => ys.map((y, i) => [90 + (i / (NP - 1)) * 900, 560 - y * 0.8 - i * 1.2] as Pt), [ys]);
  const reveal = prog(f, 4, 26, ease.out);
  const orbit = track(f, [{f: 0, v: -60}, {f: 150, v: 70, e: ease.soft}]);
  const sheen = 50 + orbit * 0.6;
  const ringScale = prog(f, 40, 80, ease.out);
  const morph = prog(f, 78, 118, ease.inOut);
  const ringPts = lerpPts(RING.map(([x, y]) => [CX + (x - CX) * (0.3 + 0.7 * ringScale), CY + (y - CY) * (0.3 + 0.7 * ringScale)] as Pt), chart, morph);
  const link = (a: number) => prog(f, a, a + 18, ease.out);
  const lbls: {t: string; x: number; y: number; s: number; col: string}[] = [
    {t: 'DOLAR', x: 120, y: 700, s: 56, col: COLORS.goldHi},
    {t: 'SUKU BUNGA', x: 960, y: 1110, s: 56, col: COLORS.text},
    {t: 'KETIDAKPASTIAN', x: 540, y: 1320, s: 52, col: COLORS.silver},
  ];
  return (
    <AbsoluteFill style={{background: '#030304'}}>
      <Backdrop gy={50} glow="rgba(201,162,74,0.12)" haze={0.5} />
      {/* celah cahaya emas yang membuka gelap */}
      <div style={{position: 'absolute', left: CX - 3 - (1 - reveal) * 0, top: 0, width: 6 + reveal * 8, height: H,
        background: 'linear-gradient(180deg, transparent, #fff1bd, transparent)', opacity: 1 - prog(f, 14, 34), filter: 'blur(3px)'}} />
      <div style={{position: 'absolute', left: 0, top: CY + 190, width: W, height: 320,
        background: 'radial-gradient(ellipse 45% 40% at 50% 0%, rgba(201,162,74,0.22), transparent 70%)', opacity: reveal}} />
      <div style={{position: 'absolute', left: CX, top: CY, perspective: 1500, opacity: reveal, clipPath: `inset(0 ${(1 - reveal) * 50}% 0 ${(1 - reveal) * 50}%)`}}>
        <div style={{transformStyle: 'preserve-3d', transform: `translateY(${Math.sin(f / 26) * 10}px) rotateX(-16deg) rotateY(${orbit}deg)`}}>
          <Cuboid w={520} h={150} d={250} style={{position: 'absolute', left: -260, top: -75}}
            front={metal('gold', sheen)} side={metal('gold', 100 - sheen, 80)} top={metal('gold', sheen + 10, 90)} />
        </div>
      </div>
      <svg width={W} height={H} style={{position: 'absolute'}}>
        <MarketDefs />
        <path d={ptsToPath(ringPts, morph < 0.02)} fill="none" stroke="#f3d58a" strokeWidth={2.5}
          opacity={prog(f, 40, 56) * 0.95} filter="url(#fGlow)" />
        {lbls.map((l, i) => {
          const a = 56 + i * 20, t = link(a);
          const x2 = l.x + (CX - l.x) * t * 0.55, y2 = l.y + 30 + (CY - l.y - 30) * t * 0.55;
          return <g key={i}>
            <line x1={l.x} y1={l.y + 30} x2={x2} y2={y2} stroke="#c9a24a" strokeWidth={1} opacity={0.6} />
            <circle cx={x2} cy={y2} r={4 * t} fill="#f3d58a" />
          </g>;
        })}
      </svg>
      <Label text="EMAS" role="display" weight={400} size={300} p={prog(f, 8, 34, ease.out)} y={210} color={COLORS.goldHi} tracking={0.06} />
      {lbls.map((l, i) => (
        <Label key={i} text={l.t} role="head" weight={700} size={l.s} p={prog(f, 56 + i * 20, 76 + i * 20, ease.out)} x={l.x} y={l.y}
          align={i === 0 ? 'left' : i === 1 ? 'right' : 'center'} color={l.col} tracking={0.18} />
      ))}
      <Particles n={22} seed={44} speed={0.4} color="#f3d58a" opacity={0.7} />
      <Sweep t={prog(f, 124, 149, ease.inOut)} peak={0.85} />
    </AbsoluteFill>
  );
};
