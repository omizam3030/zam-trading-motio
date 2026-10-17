import React, {useMemo} from 'react';
import {AbsoluteFill} from 'remotion';
import {useCurrentFrame} from '../lib/frame';
import {Backdrop} from '../kit/Atmos';
import {Candle, MarketDefs} from '../kit/Candle';
import {Label} from '../kit/Type';
import {candlesFrom, ease, prog, track, walk} from '../lib/anim';
import {COLORS, H, W} from '../lib/timeline';
import {roleFont} from '../lib/fonts';
import {Sweep} from '../kit/Atmos';

const N = 20, SP = 78, BASE = 1220;

const Currency: React.FC<{text: string; y: number; p: number}> = ({text, y, p}) => (
  <div style={{position: 'absolute', left: 0, width: W, top: y, textAlign: 'center', ...roleFont('tech', 700),
    fontSize: 150, lineHeight: 1, letterSpacing: '0.08em', opacity: p, transform: `translateY(${(1 - p) * 30}px)`,
    background: 'linear-gradient(100deg, #6b7078 0%, #f1f3f5 45%, #8a9099 100%)', WebkitBackgroundClip: 'text',
    color: 'transparent', filter: 'drop-shadow(0 10px 24px rgba(0,0,0,0.7))'}}>{text}</div>
);

export const Scene04: React.FC = () => {
  const f = useCurrentFrame();
  const closes = useMemo(() => walk(N, 77, 180, 2, 52), []);
  const candles = useMemo(() => candlesFrom(closes, 13, 180), [closes]);
  const zoom = track(f, [{f: 0, v: 1}, {f: 60, v: 1.22, e: ease.soft}, {f: 149, v: 1.08, e: ease.inOut}]);
  const panX = track(f, [{f: 55, v: 200}, {f: 125, v: -240, e: ease.soft}]);
  const roll = track(f, [{f: 50, v: 0}, {f: 85, v: -2.5, e: ease.soft}, {f: 125, v: 0, e: ease.soft}]);
  const line = prog(f, 0, 30, ease.out);
  const rate = closes.map((c, i) => `${i ? 'L' : 'M'}${40 + i * 80} ${BASE - c - 120}`).join(' ');
  const conv = prog(f, 104, 148, ease.inOut);
  const ends = [[0, 300], [W, 420], [0, 1500], [W, 1380], [200, 0], [880, H], [W, 900]];
  return (
    <AbsoluteFill style={{background: '#030304'}}>
      <Backdrop gy={52} glow="rgba(130,150,190,0.08)" />
      <AbsoluteFill style={{transform: `scale(${zoom}) rotateZ(${roll}deg)`}}>
        <svg width={W} height={H} style={{position: 'absolute'}}>
          <MarketDefs />
          <line x1={0} x2={W * line} y1={960} y2={960} stroke="#f3d58a" strokeWidth={2} opacity={(1 - prog(f, 22, 48)) * 0.95} filter="url(#fGlow)" />
        </svg>
        <AbsoluteFill style={{transform: `translateX(${panX}px)`}}>
          <svg width={1700} height={H} style={{position: 'absolute'}}>
            <MarketDefs />
            <path d={rate} pathLength={1} fill="none" stroke="#c4c8ce" strokeWidth={2} strokeDasharray={1}
              strokeDashoffset={1 - prog(f, 20, 100, ease.soft)} opacity={0.75} />
            {candles.map((c, i) => <Candle key={i} c={c} x={40 + i * SP} base={BASE} w={34} start={26 + i * 3} />)}
            {[0, 1, 2].map((i) => {
              const t = prog(f, 70 + i * 10, 100 + i * 10, ease.out);
              const x = 300 + i * 420;
              return <g key={i} opacity={0.6}>
                <line x1={x} y1={560 + i * 40} x2={x + 220 * t} y2={560 + i * 40 - (i % 2 ? -60 : 60) * t} stroke="#c9a24a" strokeWidth={1.5} />
                <circle cx={x + 220 * t} cy={560 + i * 40 - (i % 2 ? -60 : 60) * t} r={4} fill="#f3d58a" />
              </g>;
            })}
          </svg>
        </AbsoluteFill>
      </AbsoluteFill>
      <div style={{perspective: 1200}}>
        <Currency text="USD" y={500} p={prog(f, 12, 40, ease.out)} />
        <Currency text="EUR" y={690} p={prog(f, 24, 52, ease.out)} />
      </div>
      <svg width={W} height={H} style={{position: 'absolute'}}>
        <line x1={W / 2 - 120} x2={W / 2 + 120} y1={672} y2={672} stroke="#c9a24a" strokeWidth={1} opacity={prog(f, 40, 56)} />
        {ends.map(([x, y], i) => (
          <line key={i} x1={x + (W / 2 - x) * conv * 0.92} y1={y + (960 - y) * conv * 0.92} x2={x + (W / 2 - x) * Math.min(1, conv * 1.05)}
            y2={y + (960 - y) * Math.min(1, conv * 1.05)} stroke="#f3d58a" strokeWidth={1.5} opacity={conv * 0.9} />
        ))}
        <circle cx={W / 2} cy={960} r={4 + conv * 18} fill="#fff1bd" opacity={conv} filter="url(#fGlow)" />
      </svg>
      <Label text="FOREX" role="display" weight={400} size={300} p={prog(f, 8, 34, ease.out)} y={170} tracking={0.06} />
      <Label text="EKONOMI" role="tech" weight={500} size={36} p={prog(f, 80, 100, ease.out)} x={120} y={900} align="left" color={COLORS.goldHi} tracking={0.28} />
      <Label text="BANK SENTRAL" role="tech" weight={500} size={36} p={prog(f, 108, 128, ease.out)} x={960} y={1400} align="right" color={COLORS.silver} tracking={0.28} />
      <Sweep t={prog(f, 0, 24, ease.out)} peak={0.8} />
    </AbsoluteFill>
  );
};
