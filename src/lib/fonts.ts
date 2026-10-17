import type {CSSProperties} from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';

/**
 * Konfigurasi font terpusat. Hanya varian yang BENAR-BENAR ada di public/fonts yang didaftarkan;
 * bobot lain dipetakan ke bobot terdekat yang tersedia (tidak ada faux-bold).
 */
type FontFile = {family: string; file: string; weight: number; style: 'normal' | 'italic'};
export const FONT_FILES: FontFile[] = [
  {family: 'Bebas Neue', file: 'fonts/BebasNeue-Regular.ttf', weight: 400, style: 'normal'},
  {family: 'Playfair Display', file: 'fonts/PlayfairDisplay-Italic.ttf', weight: 400, style: 'italic'},
  {family: 'Playfair Display', file: 'fonts/PlayfairDisplay-MediumItalic.ttf', weight: 500, style: 'italic'},
  {family: 'Space Grotesk', file: 'fonts/SpaceGrotesk-Regular.ttf', weight: 400, style: 'normal'},
  {family: 'Space Grotesk', file: 'fonts/SpaceGrotesk-Medium.ttf', weight: 500, style: 'normal'},
  {family: 'Space Grotesk', file: 'fonts/SpaceGrotesk-Bold.ttf', weight: 700, style: 'normal'},
  {family: 'Montserrat', file: 'fonts/Montserrat-Regular.ttf', weight: 400, style: 'normal'},
  {family: 'Montserrat', file: 'fonts/Montserrat-SemiBold.ttf', weight: 600, style: 'normal'},
  {family: 'Montserrat', file: 'fonts/Montserrat-Bold.ttf', weight: 700, style: 'normal'},
  {family: 'Montserrat', file: 'fonts/Montserrat-ExtraBold.ttf', weight: 800, style: 'normal'},
];

/**
 * Peran tipografi (satu fungsi = satu font):
 *  display   Bebas Neue         judul kapital besar (SAHAM, EMAS, FOREX, PELUANG/RISIKO, pernyataan akhir)
 *  editorial Playfair Italic    kutipan/narasi filosofis (subtitle scene 1 & 5) — tidak untuk paragraf panjang
 *  tech      Space Grotesk      label teknis, kode mata uang, anotasi data trading
 *  head      Montserrat         headline pendukung, kata penting, subtitle
 */
export type Role = 'display' | 'editorial' | 'tech' | 'head';
const ROLES: Record<Role, {family: string; fallback: string; style: 'normal' | 'italic'}> = {
  display: {family: 'Bebas Neue', fallback: "Impact, 'Arial Narrow', sans-serif", style: 'normal'},
  editorial: {family: 'Playfair Display', fallback: "Georgia, 'Times New Roman', serif", style: 'italic'},
  tech: {family: 'Space Grotesk', fallback: "'Helvetica Neue', Arial, sans-serif", style: 'normal'},
  head: {family: 'Montserrat', fallback: "'Helvetica Neue', Arial, sans-serif", style: 'normal'},
};

export const availableWeights = (family: string, style: 'normal' | 'italic') =>
  FONT_FILES.filter((f) => f.family === family && f.style === style).map((f) => f.weight);

export const roleFont = (role: Role, weight = 700): CSSProperties => {
  const r = ROLES[role];
  const ws = availableWeights(r.family, r.style);
  const w = ws.reduce((best, x) => (Math.abs(x - weight) < Math.abs(best - weight) ? x : best), ws[0]);
  return {fontFamily: `'${r.family}', ${r.fallback}`, fontWeight: w, fontStyle: r.style};
};

/** Memuat semua font sebelum frame dirender. Gagal → peringatan di log + fallback. */
export const loadFonts = () => {
  if (typeof document === 'undefined') return;
  const handle = delayRender('fonts', {timeoutInMilliseconds: 30000});
  const failed: string[] = [];
  Promise.all(
    FONT_FILES.map(async (f) => {
      try {
        const face = new FontFace(f.family, `url(${staticFile(f.file)})`, {weight: String(f.weight), style: f.style});
        await face.load();
        document.fonts.add(face);
      } catch (e) {
        failed.push(f.file);
        console.warn(`[fonts] GAGAL memuat ${f.file} → memakai fallback (${ROLES[Object.keys(ROLES).find((k) => ROLES[k as Role].family === f.family) as Role].fallback})`);
      }
    })
  ).finally(() => {
    console.info(`[fonts] ${FONT_FILES.length - failed.length}/${FONT_FILES.length} font termuat${failed.length ? `, gagal: ${failed.join(', ')}` : ''}`);
    continueRender(handle);
  });
};
