import React, {CSSProperties} from 'react';

/** Kotak 3D asli (CSS 3D transforms). Orbit/rotasi dilakukan oleh parent: deterministik terhadap frame. */
export const Cuboid: React.FC<{
  w: number; h: number; d: number; front: string; side: string; top: string; style?: CSSProperties;
}> = ({w, h, d, front, side, top, style}) => {
  const face = (bg: string, t: string, fw: number, fh: number, l: number, tp: number): CSSProperties => ({
    position: 'absolute', background: bg, transform: t, width: fw, height: fh, left: l, top: tp,
    backfaceVisibility: 'hidden',
  });
  return (
    <div style={{position: 'relative', width: w, height: h, transformStyle: 'preserve-3d', ...style}}>
      <div style={face(front, `translateZ(${d / 2}px)`, w, h, 0, 0)} />
      <div style={face(side, `rotateY(180deg) translateZ(${d / 2}px)`, w, h, 0, 0)} />
      <div style={face(side, `rotateY(90deg) translateZ(${w / 2}px)`, d, h, (w - d) / 2, 0)} />
      <div style={face(side, `rotateY(-90deg) translateZ(${w / 2}px)`, d, h, (w - d) / 2, 0)} />
      <div style={face(top, `rotateX(90deg) translateZ(${h / 2}px)`, w, d, 0, (h - d) / 2)} />
      <div style={face('#050505', `rotateX(-90deg) translateZ(${h / 2}px)`, w, d, 0, (h - d) / 2)} />
    </div>
  );
};

/** Material logam: highlight (sheen) bergerak sesuai posisi p (0..100) */
export const metal = (kind: 'gold' | 'silver' | 'graphite', p: number, angle = 105) => {
  const c = {
    gold: ['#3d2c0c', '#9a7424', '#fff1bd'],
    silver: ['#25282c', '#7d838b', '#f1f3f5'],
    graphite: ['#0b0c0e', '#23262b', '#6a7078'],
  }[kind];
  const a = Math.max(2, p - 18), b = Math.min(98, p + 18);
  return `linear-gradient(${angle}deg, ${c[0]} 0%, ${c[1]} ${a}%, ${c[2]} ${p}%, ${c[1]} ${b}%, ${c[0]} 100%)`;
};
