import React from 'react';
import {Pt, lerpPts, ptsToPath} from '../lib/anim';

const SHIELD: Pt[] = [[100, 10], [190, 45], [190, 140], [100, 230], [10, 140], [10, 45], [55, 27.5]];
const ARROW: Pt[] = [[100, 10], [190, 110], [140, 110], [140, 230], [60, 230], [60, 110], [10, 110]];

/** Emblem pasar 2D: candlestick + perisai/panah. morph 0=perisai, 1=panah. reveal 0..1 = masking dari bawah. */
export const Mascot: React.FC<{size: number; morph: number; reveal: number; rotate?: number; opacity?: number}> =
  ({size, morph, reveal, rotate = 0, opacity = 1}) => {
    const d = ptsToPath(lerpPts(SHIELD, ARROW, morph), true);
    return (
      <svg width={size} height={size * 1.2} viewBox="0 0 200 240"
        style={{transform: `rotate(${rotate}deg)`, opacity, filter: 'drop-shadow(0 0 18px rgba(201,162,74,0.25))', overflow: 'visible'}}>
        <defs>
          <linearGradient id="mSil" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#e9ebee" /><stop offset="0.45" stopColor="#7d838b" />
            <stop offset="1" stopColor="#2a2d32" />
          </linearGradient>
          <clipPath id="mClip"><rect x="-10" y={250 - 260 * reveal} width="220" height="260" /></clipPath>
        </defs>
        <g clipPath="url(#mClip)">
          <path d={d} fill="url(#mSil)" stroke="#c9a24a" strokeWidth="2" strokeLinejoin="miter" />
          <rect x="98" y="52" width="4" height="150" fill="#c9a24a" />
          <rect x="78" y="92" width="44" height="78" fill="#0b0c0e" stroke="#c9a24a" strokeWidth="2" />
          <rect x="84" y="98" width="32" height="6" fill="#f3d58a" opacity="0.8" />
        </g>
      </svg>
    );
  };
