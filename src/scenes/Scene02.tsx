import React, {useMemo} from 'react';
import {AbsoluteFill} from 'remotion';
import {useCurrentFrame} from '../lib/frame';
import {Backdrop, Particles} from '../kit/Atmos';
import {Candle, MarketDefs} from '../kit/Candle';
import {Cuboid, metal} from '../kit/Cuboid';
import {Label} from '../kit/Type';
import {candlesFrom, ease, prog, track, walk} from '../lib/anim';
import {COLORS, H, W} from '../lib/timeline';

const N = 24, SPACING = 62, BASE = 1260;

export const Scene02: React.FC = () => {
  const f = useCurrentFrame();
  const closes = useMemo(() => walk(N, 5, 150, 15, 34), []);
  const candles = useMemo(() => candlesFrom(closes, 9, 150), [closes]);
  const camX = track(f, [{f: 0, v: 160}, {f: 100, v: -300, e: ease.soft}, {f: 180, v: -300}]);
  const camY = track(f, [{f: 125, v: 0}, {f: 180, v: 260, e: ease.inOut}]);
  const lineT = prog(f, 0, 22, ease.out);
  const chartT = prog(f, 14, 130, ease.soft);
  const chartPts = closes.map((c, i) => `${i ? 'L' : 'M'}${70 + i * SPACING + 15} ${BASE - c - 220}`).join(' ');
  return (
    <AbsoluteFill style={{background: '#030304'}}>
      <Backdrop gy={55} glow="rgba(176,138,58,0.07)" />
      {/* garis perak yang menjadi grid */}
      <svg width={W} height={H} style={{position: 'absolute'}}>
        <line x1={0} x2={W * lineT} y1={960} y2={960} stroke="#c4c8ce" strokeWidth={2} opacity={1 - prog(f, 14, 40)} />
        {Array.from({length: 14}).map((_, i) => (
          <line key={i} x1={0} x2={W} y1={420 + i * 70} y2={420 + i * 70} stroke="#9aa0a6" strokeWidth={1}
            opacity={0.14 * prog(f, 10 + i, 34 + i)} />
        ))}
      </svg>
      {/* background: blok arsitektural + chart (parallax 0.4x) */}
      <AbsoluteFill style={{transform: `translate(${camX * 0.4}px, ${camY * 0.4}px)`, opacity: 0.55, filter: 'blur(1.5px)'}}>
        <div style={{position: 'absolute', left: 0, top: 0, width: 1700, height: H, perspective: 1600}}>
          {[0, 1, 2, 3, 4].map((i) => {
            const rise = prog(f, 18 + i * 8, 60 + i * 8, ease.out);
            const h = (180 + i * 90) * rise;
            return (
              <div key={i} style={{position: 'absolute', left: 120 + i * 300, top: 760 - h, transform: 'rotateX(-6deg) rotateY(-24deg)', transformStyle: 'preserve-3d'}}>
                <Cuboid w={130} h={Math.max(2, h)} d={130} front={metal('graphite', 35)} side={metal('graphite', 15)} top={metal('graphite', 55)} />
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      {/* midground: candles + chart */}
      <AbsoluteFill style={{transform: `translate(${camX}px, ${camY}px)`}}>
        <svg width={1700} height={H} style={{position: 'absolute'}}>
          <MarketDefs />
          <path d={`${chartPts} L${70 + (N - 1) * SPACING + 15} ${BASE} L85 ${BASE} Z`} fill="url(#gArea)" opacity={chartT * 0.7} />
          <path d={chartPts} pathLength={1} fill="none" stroke="#f3d58a" strokeWidth={3} strokeLinecap="round"
            strokeDasharray={1} strokeDashoffset={1 - chartT} filter="url(#fGlow)" />
          {candles.map((c, i) => (
            <Candle key={i} c={c} x={70 + i * SPACING} base={BASE} w={30} start={24 + i * 4} />
          ))}
          <line x1={0} x2={1700} y1={BASE} y2={BASE} stroke="#6b7078" strokeWidth={1.5} />
        </svg>
      </AbsoluteFill>
      <Particles n={26} seed={31} speed={0.6} opacity={0.7} />
      {/* foreground: candle buram melintas cepat (parallax 1.7x) */}
      <AbsoluteFill style={{transform: `translateX(${camX * 1.7}px)`, filter: 'blur(7px)', opacity: 0.55}}>
        {[0, 1].map((i) => (
          <div key={i} style={{position: 'absolute', left: 900 + i * 900, top: 1500, perspective: 1200}}>
            <div style={{transform: 'rotateY(-25deg)', transformStyle: 'preserve-3d'}}>
              <Cuboid w={90} h={560} d={90} style={{position: 'absolute', left: -45, top: -560}}
                front={metal('gold', 40)} side={metal('gold', 15)} top={metal('gold', 60)} />
            </div>
          </div>
        ))}
      </AbsoluteFill>
      <Label text="SAHAM" role="display" weight={400} size={300} p={prog(f, 12, 40, ease.out)} y={230} tracking={0.06} />
      <Label text="NILAI" role="head" weight={700} size={40} p={prog(f, 62, 84, ease.out)} x={120} y={560} align="left" color={COLORS.goldHi} tracking={0.3} />
      <Label text="PERTUMBUHAN" role="head" weight={700} size={40} p={prog(f, 90, 112, ease.out)} x={960} y={640} align="right" color={COLORS.silver} tracking={0.3} />
      <Label text="ILUSTRASI — BUKAN JAMINAN HASIL" role="head" weight={600} size={26} p={prog(f, 40, 60) * 0.75} y={140} color={COLORS.silver} tracking={0.2} />
    </AbsoluteFill>
  );
};
