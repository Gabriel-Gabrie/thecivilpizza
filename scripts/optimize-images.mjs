// Compress every image in public/images/ in place. Targets:
//  - max width 1600px (anything wider gets resized)
//  - JPEG quality 78, progressive, mozjpeg
//  - WebP quality 80
//  - PNG: keep PNG, palette-based recompress
// Idempotent: if a file is already smaller than its optimized size, leave it.
//
// Run: node scripts/optimize-images.mjs

import { promises as fs } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve('public/images');
const MAX_WIDTH = 1600;

const fmtKb = (b) => (b / 1024).toFixed(1) + ' KB';

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      // Skip the source folder — those are unlabeled originals.
      if (e.name === 'source') continue;
      yield* walk(p);
    } else {
      yield p;
    }
  }
}

async function processOne(file) {
  const ext = path.extname(file).toLowerCase();
  if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) return null;

  const before = (await fs.stat(file)).size;
  const buf = await fs.readFile(file);
  const img = sharp(buf, { failOn: 'none' });
  const meta = await img.metadata();
  let pipeline = img.rotate();
  if ((meta.width ?? 0) > MAX_WIDTH) {
    pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }

  let out;
  if (ext === '.png') {
    out = await pipeline.png({ quality: 80, compressionLevel: 9, palette: true }).toBuffer();
  } else if (ext === '.webp') {
    out = await pipeline.webp({ quality: 80, effort: 6 }).toBuffer();
  } else {
    out = await pipeline.jpeg({ quality: 78, mozjpeg: true, progressive: true }).toBuffer();
  }

  if (out.length < before) {
    await fs.writeFile(file, out);
    return { file, before, after: out.length };
  }
  return { file, before, after: before, skipped: true };
}

async function main() {
  let totalBefore = 0;
  let totalAfter = 0;
  let count = 0;
  for await (const file of walk(ROOT)) {
    const r = await processOne(file);
    if (!r) continue;
    count += 1;
    totalBefore += r.before;
    totalAfter += r.after;
    const tag = r.skipped ? 'skip' : 'ok  ';
    const rel = path.relative(ROOT, r.file);
    const saved = ((1 - r.after / r.before) * 100).toFixed(0);
    console.log(`${tag}  ${rel.padEnd(48)}  ${fmtKb(r.before).padStart(10)} → ${fmtKb(r.after).padStart(10)}  (-${saved}%)`);
  }
  const ratio = ((1 - totalAfter / totalBefore) * 100).toFixed(1);
  console.log(`\n${count} files · ${fmtKb(totalBefore)} → ${fmtKb(totalAfter)}  (-${ratio}% overall)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
