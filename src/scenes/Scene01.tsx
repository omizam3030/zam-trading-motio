import React from 'react';
import {AbsoluteFill} from 'remotion';
import {useCurrentFrame} from '../lib/frame';
import {Backdrop, Particles} from '../kit/Atmos';
import {Cuboid, metal} from '../kit/Cuboid';
import {Mascot} from '../kit/Mascot';
import {MorphWords} from '../kit/Type';
import {ease, prog, track} from '../lib/anim';
import {H, W} from '../lib/timeline';

export const Scene01: React.FC = () => {
  const f = useCurrentFrame();
  const fade = prog(f, 0, 30, ease.soft);
  // dolly lambat lalu speed ramp ke scene berikutnya
  const cam = track(f, [{f: 0, v: 1}, {f: 95, v: 1.14, e: ease.soft}, {f: 149, v: 3.4, e: ease.in}]);
  const rot = track(f, [{f: 0, v: -35}, {f: 149, v: 140, e: ease.soft}]);
  const bob = Math.sin(f / 22) * 14;
  const lineT = (i: number) => prog(f, 6 + i * 3, 46 + i * 3, ease.out);
  const wordT = prog(f, 80, 100, ease.inOut);
  const pulse = f >= 98 ? Math.exp(-(f - 98) / 7) : 0;
  const mascotIn = prog(f, 20, 46, ease.out);
  const mascotOut = 1 - prog(f, 62, 76);
  return (
    <AbsoluteFill style={{background: '#030304'}}>
      <Backdrop intensity={fade} gy={46} />
      <AbsoluteFill style={{transform: `scale(${cam})`, transformOrigin: '50% 50%'}}>
        <svg width={W} height={H} style={{position: 'absolute'}}>
          {Array.from({length: 11}).map((_, i) => {
            const y = 360 + i * 120, half = (W / 2 + 80) * lineT(i);
            return <line key={i} x1={W / 2 - half} x2={W / 2 + half} y1={y + (i - 5) * 6} y2={y - (i - 5) * 6}
              stroke="#9aa0a6" strokeWidth={1} opacity={0.32 * fade} />;
          })}
          {Array.from({length: 5}).map((_, i) => (
            <line key={`v${i}`} x1={140 + i * 200} x2={140 + i * 200} y1={H / 2 - 700 * lineT(i)} y2={H / 2 + 700 * lineT(i)}
              stroke="#9aa0a6" strokeWidth={1} opacity={0.14 * fade} />
          ))}
        </svg>
        <Particles n={46} seed={11} speed={0.8} opacity={fade} />
        <div style={{position: 'absolute', left: W / 2, top: 860, perspective: 1700, opacity: prog(f, 10, 40)}}>
          <div style={{transformStyle: 'preserve-3d', transform: `translateY(${bob}px) rotateX(-12deg) rotateY(${rot}deg)`}}>
            <Cuboid w={14} h={620} d={14} style={{position: 'absolute', left: -7, top: -310}}
              front={metal('silver', 50)} side={metal('graphite', 40)} top={metal('silver', 60)} />
            <Cuboid w={130} h={320} d={130} style={{position: 'absolute', left: -65, top: -160}}
              front={metal('gold', 30 + ((rot + 35) / 175) * 50)} side={metal('gold', 70 - ((rot + 35) / 175) * 40, 80)}
              top={metal('gold', 60)} />
          </div>
        </div>
      </AbsoluteFill>
      <div style={{position: 'absolute', left: W / 2 - 100, top: 330, opacity: mascotOut}}>
        <Mascot size={200} morph={prog(f, 40, 64)} reveal={mascotIn} rotate={(1 - mascotIn) * -8} />
      </div>
      <MorphWords a="PELUANG" b="RISIKO" t={wordT} revealA={prog(f, 40, 68, ease.out)} size={230} y={1190} pulse={pulse} />
    </AbsoluteFill>
  );
};
