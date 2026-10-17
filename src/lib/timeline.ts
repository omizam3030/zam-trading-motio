import cfg from './config.json';

export const {fps: FPS, width: W, height: H, durationInFrames: DURATION} = cfg;
export const SCENES = cfg.scenes;
export const scene = (id: 's1' | 's2' | 's3' | 's4' | 's5') => {
  const s = SCENES.find((x) => x.id === id)!;
  return {from: s.from, to: s.to, dur: s.to - s.from, rate: s.base / (s.to - s.from)};
};

export const COLORS = {
  obsidian: '#030304', graphite: '#111317', silver: '#a9aeb5', gold: '#c9a24a',
  goldHi: '#f3d58a', crimson: '#a3202c', red: '#d2323f', text: '#ecebe6',
};

/**
 * Subtitle: waktu (detik) diukur dari file VO asli (silencedetect), relatif terhadap awal klip.
 * Frasa panjang dibagi proporsional jumlah kata. voStart = frame mulai klip (lihat audio-plan.json).
 */
type Seg = {text: string; t0: number; t1: number; kw?: string[]};
const SUBS: {voStart: number; role: 'editorial' | 'head'; segs: Seg[]}[] = [
  {voStart: 10, role: 'editorial', segs: [
    {text: 'Di balik pergerakan pasar,', t0: 0, t1: 1.63},
    {text: 'ada peluang…', t0: 2.04, t1: 2.79, kw: ['peluang…']},
    {text: 'dan risiko', t0: 3.42, t1: 4.4, kw: ['risiko']},
    {text: 'yang tak terlihat.', t0: 4.4, t1: 5.88}]},
  {voStart: 212, role: 'head', segs: [
    {text: 'Saham.', t0: 0, t1: 0.56, kw: ['Saham.']},
    {text: 'Kamu membeli bagian', t0: 1.2, t1: 2.79},
    {text: 'dari sebuah perusahaan,', t0: 2.79, t1: 4.37},
    {text: 'berharap nilainya tumbuh.', t0: 4.37, t1: 5.96, kw: ['tumbuh.']}]},
  {voStart: 416, role: 'head', segs: [
    {text: 'Emas.', t0: 0, t1: 0.58, kw: ['Emas.']},
    {text: 'Aset yang pergerakannya', t0: 1.09, t1: 2.61},
    {text: 'dipengaruhi dolar,', t0: 2.61, t1: 3.62, kw: ['dolar,']},
    {text: 'suku bunga,', t0: 3.92, t1: 4.99, kw: ['suku', 'bunga,']},
    {text: 'dan ketidakpastian dunia.', t0: 4.99, t1: 6.59}]},
  {voStart: 647, role: 'head', segs: [
    {text: 'Forex.', t0: 0, t1: 0.73, kw: ['Forex.']},
    {text: 'Pasar pertukaran mata uang,', t0: 1.26, t1: 2.79},
    {text: 'bergerak mengikuti ekonomi', t0: 3.23, t1: 4.85},
    {text: 'dan kebijakan bank sentral.', t0: 4.85, t1: 7.0}]},
  {voStart: 883, role: 'editorial', segs: [
    {text: 'Ingat…', t0: 0, t1: 0.57},
    {text: 'pasar bukan tempat menebak.', t0: 1.02, t1: 2.75},
    {text: 'Tapi tempat belajar', t0: 3.14, t1: 4.92},
    {text: 'mengelola risiko.', t0: 4.92, t1: 6.11, kw: ['risiko.']}]},
];

export type Sub = {from: number; to: number; text: string; kw: string[]; role: 'editorial' | 'head'};
export const SUBTITLES: Sub[] = SUBS.flatMap((s) =>
  s.segs.map((g) => ({
    from: s.voStart + Math.round(g.t0 * FPS),
    to: s.voStart + Math.round(g.t1 * FPS) + 4,
    text: g.text, kw: g.kw ?? [], role: s.role,
  })));
