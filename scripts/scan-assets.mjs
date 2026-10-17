import fs from 'fs';
import path from 'path';
const root = path.resolve('public');
const out = [];
const walk = (d) => {
  if (!fs.existsSync(d)) return;
  for (const e of fs.readdirSync(d, {withFileTypes: true})) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(mp3|wav|m4a|ogg)$/i.test(e.name)) out.push(path.relative(root, p).split(path.sep).join('/'));
  }
};
walk(root);
fs.writeFileSync('src/lib/assets.generated.ts',
  `// Dibuat otomatis oleh scripts/scan-assets.mjs — jangan edit manual.\nexport const AVAILABLE: string[] = ${JSON.stringify(out.sort(), null, 2)};\n`);
console.log('Audio tersedia:', out);
