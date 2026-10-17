import React from 'react';
import {useCurrentFrame} from '../lib/frame';
import {CandleData, ease, prog} from '../lib/anim';

export const MarketDefs: React.FC = () => (
  <defs>
    <linearGradient id="gGold" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#6b4d14" /><stop offset="0.45" stopColor="#f3d58a" />
      <stop offset="1" stopColor="#8a6620" />
    </linearGradient>
    <linearGradient id="gSilver" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#3a3e44" /><stop offset="0.5" stopColor="#c4c8ce" />
      <stop offset="1" stopColor="#4a4f56" />
    </linearGradient>
    <linearGradient id="gCrim" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#4a0d13" /><stop offset="0.5" stopColor="#b22a36" />
      <stop offset="1" stopColor="#5a1018" />
    </linearGradient>
    <linearGradient id="gArea" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#c9a24a" stopOpacity="0.28" /><stop offset="1" stopColor="#c9a24a" stopOpacity="0" />
    </linearGradient>
    <filter id="fGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="6" result="b" />
      <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
    </filter>
  </defs>
);

/** Candle 2.5D. Badan dan sumbu (wick) dianimasikan independen, tumbuh dari dasar. */
export const Candle: React.FC<{
  c: CandleData; x: number; base: number; w: number; start: number; dur?: number; reflect?: boolean; opacity?: number;
}> = ({c, x, base, w, start, dur = 26, reflect = true, opacity = 1}) => {
  const f = useCurrentFrame();
  const wt = prog(f, start, start + dur * 0.85, ease.out);
  const bt = prog(f, start + dur * 0.12, start + dur, ease.overshoot);
  if (f < start) return null;
  const up = c.close >= c.open;
  const fill = up ? 'url(#gGold)' : 'url(#gCrim)';
  const lo = Math.min(c.open, c.close) * bt;
  const hi = Math.max(c.open, c.close) * bt + 3;
  const d = w * 0.32;
  const draw = () => (
    <>
      <rect x={x + w / 2 - 1.5} y={base - c.high * wt} width={3} height={Math.max(0, (c.high - c.low) * wt)}
        fill="#b9bec5" opacity={0.85} />
      <polygon points={`${x + w},${base - hi} ${x + w + d},${base - hi - d * 0.5} ${x + w + d},${base - lo - d * 0.5} ${x + w},${base - lo}`}
        fill={up ? '#5a4210' : '#3a0b10'} />
      <polygon points={`${x},${base - hi} ${x + d},${base - hi - d * 0.5} ${x + w + d},${base - hi - d * 0.5} ${x + w},${base - hi}`}
        fill={up ? '#f3d58a' : '#c24a55'} opacity={0.85} />
      <rect x={x} y={base - hi} width={w} height={Math.max(2, hi - lo)} fill={fill} />
    </>
  );
  return (
    <g opacity={opacity}>
      {draw()}
      {reflect ? <g transform={`translate(0 ${2 * base}) scale(1 -1)`} opacity={0.14}>{draw()}</g> : null}
    </g>
  );
};
