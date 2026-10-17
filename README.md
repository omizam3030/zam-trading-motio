# Trading Intro — Remotion (25 detik, 9:16)

Dokumenter finansial sinematik, 30 fps, 1080×1920. **Durasi saat ini 1087 frame (~36,2 dtk)** karena VO asli total ±31,9 dtk — durasi scene mengikuti VO (aturan brief: VO dulu, visual menyesuaikan). Animasi tiap scene direntangkan otomatis (`base` di config.json). Semua animasi = `f(frame)` (tanpa Math.random / jam real-time; partikel & chart memakai seed deterministik).

## Mulai
```bash
npm install
npm run start        # Remotion Studio
npm run render       # out/trading-intro.mp4 (H.264, CRF 16, AAC)
npm run render:draft # pratinjau 50% cepat
npm run validate     # cek durasi/dimensi/fps, aset hilang, TypeScript, dan MP4 (ffprobe)
```
`render` otomatis menjalankan `scan-assets` (membuat `src/lib/assets.generated.ts`). Setelah menambah/mengganti file audio saat Studio berjalan, jalankan `npm run scan-assets`.

## Struktur
- `src/lib/config.json` — fps, ukuran, rentang 5 scene (sekarang 0–202–406–637–873–1087). Overlap Sequence = 0; transisi ada di dalam scene.
- `src/lib/anim.ts` — easing cubic-bezier, `prog`, `track` (keyframe), `rand` (seeded), morph titik.
- `src/lib/timeline.ts` — warna, font, **data subtitle** (waktu dihitung dari jumlah kata × `fpw`).
- `src/lib/audio-plan.json` — **timeline audio**: musik, VO, SFX (path, frame mulai, volume).
- `src/kit/` — Cuboid 3D (CSS 3D), Candle, Mascot, Atmos (haze/partikel/grain/sweep), Type, AudioMix.
- `src/scenes/Scene01..05.tsx` — lima scene.

## Mengganti audio
1. Taruh file di `public/` sesuai path di `audio-plan.json` (mis. `public/vo/scene1.mp3`, `public/music/bed.mp3`).
2. `npm run scan-assets`, lalu `npm run validate`.
3. Ubah `from`/`dur`/`volume` di `audio-plan.json` bila perlu. Musik otomatis di-duck ke `duckTo` saat jendela VO (`from`→`windowEnd`) aktif.

**Selaraskan setelah VO asli ada:** ukur durasi tiap klip, perbarui `windowEnd` di audio-plan dan `start`/`fpw` di `SUBS` (timeline.ts) agar subtitle persis dengan ucapan.

## Aset yang belum ada (dilewati, tidak dipalsukan)
Musik (`music/bed.mp3`), lima VO (`vo/scene1-5.mp3`), dan SFX: drone-sub, whoosh-reverse, whoosh, whoosh-wide, tick, impact-soft, shimmer, riser. Hanya `sfx/vine-boom.mp3` yang dipakai dari empat file unggahan (volume rendah, 2 titik impact). `faaah`, `999-social-credit-siren`, `ack` tidak dipetakan karena karakternya meme — tidak cocok dengan arahan dokumenter premium.

## Catatan teknis jujur
- 3D = CSS 3D transforms + 2.5D (tanpa Three.js), supaya render cloud stabil. Batang emas berupa balok, bukan model fotorealistik; untuk fotorealisme asli ganti dengan render/aset 3D berlisensi.
- Font: konfigurasi terpusat di `src/lib/fonts.ts` (file di `public/fonts`, dimuat dengan FontFace + delayRender; gagal → peringatan `[fonts]` di log + fallback). Peran: **display** Bebas Neue (judul kapital: SAHAM/EMAS/FOREX, PELUANG→RISIKO, pernyataan akhir), **editorial** Playfair Display Italic (subtitle scene 1 & 5), **tech** Space Grotesk (USD/EUR, EKONOMI, BANK SENTRAL), **head** Montserrat (label pendukung & subtitle scene 2–4). Gunakan lewat `roleFont(role, weight)`; bobot dipetakan ke varian yang tersedia.
- Timing narasi: lima klip VO (5,9 / 6,0 / 6,8 / 7,0 / 6,1 dtk) tidak muat dalam 25 dtk, jadi durasi diperpanjang. Untuk kembali ke 25 dtk: buat VO lebih pendek/ringkas, lalu ubah `scenes` di config.json.
- Chart bersifat ilustrasi; ada label “ILUSTRASI — BUKAN JAMINAN HASIL” di scene Saham.

## Render lewat GitHub Actions
1. Push seluruh isi folder ini ke repo GitHub (branch `main`). Pastikan `.github/workflows/render.yml`, `public/` (font, vo, sfx) ikut ter-commit.
2. Buka tab **Actions → Render video → Run workflow** (atau otomatis saat push ke `main`).
3. Setelah selesai, unduh **trading-intro-mp4** dari bagian *Artifacts* di halaman run (disimpan 30 hari).
