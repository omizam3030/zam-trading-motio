import React from 'react';
import {AbsoluteFill} from 'remotion';
import {useCurrentFrame} from '../lib/frame';
import {COLORS, SUBTITLES, W} from '../lib/timeline';
import {Role, roleFont} from '../lib/fonts';
import {ease, prog} from '../lib/anim';

/** Label bertipografi berbasis peran (lihat lib/fonts.ts). Posisi memakai koordinat layar 1080x1920. */
export const Label: React.FC<{
  text: string; size: number; p: number; role?: Role; weight?: number; color?: string; tracking?: number;
  x?: number; y?: number; align?: 'center' | 'left' | 'right';
}> = ({text, size, p, role = 'head', weight = 700, color = COLORS.text, tracking = 0.2, x = W / 2, y = 0, align = 'center'}) => {
  const tx = align === 'center' ? '-50%' : align === 'right' ? '-100%' : '0';
  return (
    <div style={{
      position: 'absolute', left: x, top: y, transform: `translate(${tx}, ${(1 - p) * 24}px)`, opacity: p,
      ...roleFont(role, weight), fontSize: size, lineHeight: role === 'display' ? 0.95 : 1.2,
      letterSpacing: `${tracking * (2 - p)}em`, color, whiteSpace: 'nowrap', textShadow: '0 4px 24px rgba(0,0,0,0.6)',
      clipPath: `inset(0 ${(1 - p) * 40}% 0 0)`,
    }}>{text}</div>
  );
};

/** Kata A berubah menjadi kata B lewat wipe bermask + displacement terkontrol (Bebas Neue). */
export const MorphWords: React.FC<{a: string; b: string; t: number; revealA: number; size: number; y: number; pulse?: number}> =
  ({a, b, t, revealA, size, y, pulse = 0}) => {
    const dispScale = 40 * Math.sin(Math.PI * t);
    const base: React.CSSProperties = {
      position: 'absolute', left: 0, width: W, top: y, textAlign: 'center', ...roleFont('display'),
      fontSize: size, lineHeight: 0.95, whiteSpace: 'nowrap',
    };
    return (
      <>
        <svg width="0" height="0" style={{position: 'absolute'}}>
          <filter id="morphDisp">
            <feTurbulence type="fractalNoise" baseFrequency="0.01 0.05" numOctaves={2} seed={3} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale={dispScale} />
          </filter>
        </svg>
        <div style={{...base, opacity: revealA * (1 - prog(t, 0.7, 1)), color: COLORS.text, letterSpacing: `${0.1 + (1 - revealA) * 0.4}em`,
          filter: `url(#morphDisp) blur(${(1 - revealA) * 8}px)`, clipPath: `inset(0 0 0 ${t * 100}%)`}}>{a}</div>
        <div style={{...base, color: COLORS.red, letterSpacing: '0.1em', clipPath: `inset(0 ${(1 - t) * 100}% 0 0)`,
          transform: `scale(${1 + pulse * 0.04})`, textShadow: `0 0 ${12 + pulse * 20}px rgba(210,50,63,${0.25 + pulse * 0.3})`,
          filter: 'url(#morphDisp)'}}>{b}</div>
        <div style={{position: 'absolute', top: y, left: W * 0.08 + t * W * 0.84, width: 2, height: size * 0.95,
          background: COLORS.goldHi, opacity: Math.sin(Math.PI * t) * 0.9}} />
      </>
    );
  };

/** Subtitle burn-in (frame global). Scene 1 & 5 = Playfair Italic (kutipan), lainnya = Montserrat. Zona aman bawah ≥ 330px. */
export const Subtitles: React.FC = () => {
  const f = useCurrentFrame();
  const s = SUBTITLES.find((x) => f >= x.from && f < x.to);
  if (!s) return null;
  const pin = prog(f, s.from, s.from + 6, ease.out);
  const pout = 1 - prog(f, s.to - 5, s.to, ease.in);
  const words = s.text.split(' ');
  const editorial = s.role === 'editorial';
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 330, pointerEvents: 'none'}}>
      <div style={{opacity: pin * pout, transform: `translateY(${(1 - pin) * 14}px)`, textAlign: 'center', maxWidth: W - 160,
        fontSize: editorial ? 58 : 48, lineHeight: 1.25, letterSpacing: editorial ? '0.01em' : '0.005em',
        textShadow: '0 2px 16px rgba(0,0,0,0.9)'}}>
        {words.map((w, i) => {
          const key = s.kw.includes(w);
          return (
            <span key={i} style={{...roleFont(editorial ? 'editorial' : 'head', key ? (editorial ? 500 : 800) : (editorial ? 400 : 600)),
              color: key ? COLORS.goldHi : COLORS.text}}>{w}{i < words.length - 1 ? ' ' : ''}</span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
