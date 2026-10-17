import React from 'react';
import {AbsoluteFill} from 'remotion';
import {useCurrentFrame} from '../lib/frame';
import {Backdrop, Particles} from '../kit/Atmos';
import {Mascot} from '../kit/Mascot';
import {Label} from '../kit/Type';
import {ease, prog, track} from '../lib/anim';
import {COLORS, H, W} from '../lib/timeline';

export const Scene05: React.FC = () => {
  const f = useCurrentFrame();
  const slow = track(f, [{f: 0, v: 1}, {f: 60, v: 0.08, e: ease.out}]); // chart & partikel melambat
  const settle = prog(f, 0, 70, ease.out);
  const t1 = prog(f, 22, 40, ease.out), t1out = 1 - prog(f, 54, 62, ease.in);
  const t2 = prog(f, 62, 80, ease.out);
  const black = prog(f, 110, 119, ease.inOut);
  const edge = prog(f, 90, 116, ease.soft) * 0.55;
  return (
    <AbsoluteFill style={{background: '#030304'}}>
      <Backdrop gy={42} glow="rgba(176,138,58,0.10)" />
      <svg width={W} height={H} style={{position: 'absolute', opacity: 1 - prog(f, 40, 90) * 0.7}}>
        {Array.from({length: 9}).map((_, i) => {
          const y0 = 560 + i * 100, drift = (1 - settle) * 70 * Math.sin(i * 1.7 + f * 0.04 * slow);
          return <line key={i} x1={80} x2={W - 80} y1={y0 + drift} y2={y0 - drift * 0.4} stroke="#9aa0a6" strokeWidth={1} opacity={0.22} />;
        })}
      </svg>
      <Particles n={30} seed={63} speed={0.5 * slow} opacity={1 - prog(f, 50, 100) * 0.6} />
      <div style={{position: 'absolute', left: W / 2 - 160, top: 480}}>
        <Mascot size={320} morph={1 - prog(f, 6, 56, ease.inOut)} reveal={prog(f, 6, 40, ease.out)} />
      </div>
      <div style={{opacity: t1out}}>
        <Label text="BUKAN SEKADAR MENEBAK." role="display" weight={400} size={92} p={t1} y={1020} tracking={0.05} />
      </div>
      <Label text="BELAJAR MENGELOLA" role="display" weight={400} size={120} p={t2} y={950} color={COLORS.text} tracking={0.05} />
      <Label text="RISIKO." role="display" weight={400} size={240} p={prog(f, 92, 108, ease.out)} y={1070} color={COLORS.red} tracking={0.05} />
      <AbsoluteFill style={{boxShadow: `inset 0 0 160px rgba(201,162,74,${edge})`, pointerEvents: 'none'}} />
      <AbsoluteFill style={{background: '#000', opacity: black}} />
    </AbsoluteFill>
  );
};
