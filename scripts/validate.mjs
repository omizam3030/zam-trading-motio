import fs from 'fs';
import {spawnSync} from 'child_process';

const cfg = JSON.parse(fs.readFileSync('src/lib/config.json', 'utf8'));
const plan = JSON.parse(fs.readFileSync('src/lib/audio-plan.json', 'utf8'));
let errors = 0, warns = 0;
const err = (m) => { errors++; console.error('✗ ' + m); };
const warn = (m) => { warns++; console.warn('! ' + m); };
const ok = (m) => console.log('✓ ' + m);

// 1. Durasi, dimensi, fps, rentang scene
if (cfg.width !== 1080 || cfg.height !== 1920) err('Dimensi harus 1080x1920'); else ok('Dimensi 1080x1920');
if (cfg.fps !== 30) err('FPS harus 30'); else ok('FPS 30');
if (cfg.durationInFrames !== 750) warn(`Durasi ${cfg.durationInFrames} frame = ${(cfg.durationInFrames / cfg.fps).toFixed(1)} dtk (bukan 25 dtk; mengikuti VO asli)`); else ok('750 frame = 25 detik');
let cursor = 0;
for (const s of cfg.scenes) {
  if (s.from !== cursor) err(`Scene ${s.id} mulai ${s.from}, seharusnya ${cursor}`);
  cursor = s.to;
}
if (cursor !== cfg.durationInFrames) err(`Scene berakhir di ${cursor}, bukan ${cfg.durationInFrames}`); else ok('Rentang scene berurutan tanpa celah');

// 1b. Font (daftar diambil dari src/lib/fonts.ts)
const fontSrc = fs.readFileSync('src/lib/fonts.ts', 'utf8');
for (const m of fontSrc.matchAll(/file: '([^']+)'/g)) {
  fs.existsSync('public/' + m[1]) ? ok('font: ' + m[1]) : err('FONT HILANG: public/' + m[1] + ' (akan memakai fallback)');
}

// 2. Aset audio
const check = (kind, file) => {
  if (fs.existsSync('public/' + file)) ok(`${kind}: ${file}`);
  else warn(`${kind} HILANG (dilewati saat render): public/${file}`);
};
check('musik', plan.music.file);
plan.voice.forEach((v) => check('VO', v.file));
[...new Set(plan.sfx.map((s) => s.file))].forEach((f) => check('SFX', f));
for (const s of plan.sfx) if (s.from + s.dur > cfg.durationInFrames) err(`SFX ${s.file} melewati frame 750`);
for (const v of plan.voice) {
  const sc = cfg.scenes.find((x) => v.from >= x.from && v.from < x.to);
  if (!sc || v.windowEnd > sc.to) err(`VO ${v.id} melewati batas scene (${v.windowEnd})`);
}

// 2b. Durasi VO asli vs jendela scene
for (const vo of plan.voice) {
  if (!fs.existsSync('public/' + vo.file)) continue;
  const q = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', 'public/' + vo.file], {encoding: 'utf8'});
  if (q.status !== 0) continue;
  const frames = Math.ceil(parseFloat(q.stdout) * cfg.fps);
  frames > vo.windowEnd - vo.from ? err(`VO ${vo.id} ${frames} frame > jendela ${vo.windowEnd - vo.from}`) : ok(`VO ${vo.id} ${frames} frame muat`);
}

// 3. TypeScript
if (fs.existsSync('node_modules/.bin/tsc')) {
  const r = spawnSync('npx', ['tsc', '--noEmit'], {stdio: 'inherit'});
  r.status === 0 ? ok('TypeScript bersih') : err('Ada error TypeScript');
} else warn('node_modules belum ada — jalankan npm install lalu validate lagi');

// 4. Output MP4 (jika sudah dirender)
const out = 'out/trading-intro.mp4';
if (fs.existsSync(out)) {
  const p = spawnSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height,r_frame_rate,codec_name,nb_frames:format=duration', '-of', 'json', out], {encoding: 'utf8'});
  if (p.status === 0) {
    const j = JSON.parse(p.stdout), st = j.streams[0];
    st.width === 1080 && st.height === 1920 ? ok('MP4 1080x1920') : err('MP4 dimensi salah');
    st.r_frame_rate === '30/1' ? ok('MP4 30 fps') : err('MP4 fps ' + st.r_frame_rate);
    st.codec_name === 'h264' ? ok('Codec h264') : err('Codec ' + st.codec_name);
    Math.abs(parseFloat(j.format.duration) - cfg.durationInFrames / cfg.fps) < 0.05 ? ok('Durasi sesuai config') : err('Durasi ' + j.format.duration);
  } else warn('ffprobe tidak tersedia; cek MP4 manual');
}
console.log(`\nSelesai: ${errors} error, ${warns} peringatan`);
process.exit(errors ? 1 : 0);
