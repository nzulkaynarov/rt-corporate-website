import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

/**
 * Image pipeline (runs before `astro build` via prebuild; `npm run images` to run it alone).
 *
 * For every JPG/PNG under public/images and public/uploads (incl. photos uploaded via the CMS):
 *  1. Originals wider than 1600 px or heavier than 350 KB are recompressed in place
 *     (they remain the <img src> fallback and the Open Graph image).
 *  2. Responsive WebP variants are written next to the original:
 *       rt-rs-118.jpg → rt-rs-118.w480.webp, .w800.webp, .w1200.webp   (never upscaled)
 *     src/utils/images.ts references them in `srcset`. They are build artefacts (.gitignore)
 *     and are regenerated only when the original is newer.
 *
 * A failure here fails the build: a missing variant would be a broken image in the browser.
 * scripts/check-build.mjs additionally verifies that every srcset file exists in dist/.
 */
const ROOT = process.cwd();
const DIRS = ['public/images', 'public/uploads'].map((d) => path.join(ROOT, d));
const RASTER = /\.(jpe?g|png)$/i;
const VARIANT = /\.w\d+\.webp$/i;

/** Keep in sync with IMAGE_WIDTHS in src/utils/images.ts */
const WIDTHS = [480, 800, 1200];
const WEBP = { quality: 72, effort: 5, smartSubsample: true };
const MAX_WIDTH = 1600;
const MAX_BYTES = 350 * 1024;

const walk = (dir) =>
  fs.existsSync(dir)
    ? fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
        const p = path.join(dir, e.name);
        return e.isDirectory() ? walk(p) : RASTER.test(e.name) ? [p] : [];
      })
    : [];

const rel = (p) => path.relative(ROOT, p);
const kb = (n) => `${(n / 1024).toFixed(0)} KB`;

// Settings fingerprint: changing WIDTHS or WEBP options regenerates every variant.
const STAMP = path.join(ROOT, 'public', '.webp-variants.json');
const settings = JSON.stringify({ WIDTHS, WEBP });
const settingsChanged = !fs.existsSync(STAMP) || fs.readFileSync(STAMP, 'utf8') !== settings;

let originalsOptimized = 0;
let variantsWritten = 0;
let variantsBytes = 0;
const errors = [];

for (const file of DIRS.flatMap(walk)) {
  try {
    // 1. Keep originals reasonable (they are still served as fallback / OG image).
    let stat = fs.statSync(file);
    const meta = await sharp(file).metadata();
    if ((meta.width || 0) > MAX_WIDTH || stat.size > MAX_BYTES) {
      let t = sharp(file).rotate().resize({ width: MAX_WIDTH, withoutEnlargement: true });
      t = /\.png$/i.test(file) ? t.png({ compressionLevel: 9, palette: true }) : t.jpeg({ quality: 82, progressive: true, mozjpeg: true });
      const buf = await t.toBuffer();
      if (buf.length < stat.size * 0.95) {
        fs.writeFileSync(file, buf);
        originalsOptimized++;
        console.log(`[images] recompressed ${rel(file)} ${kb(stat.size)} → ${kb(buf.length)}`);
        stat = fs.statSync(file);
      }
    }

    // 2. WebP variants, regenerated only when missing or older than the original.
    const stem = file.replace(RASTER, '');
    for (const w of WIDTHS) {
      const out = `${stem}.w${w}.webp`;
      if (!settingsChanged && fs.existsSync(out) && fs.statSync(out).mtimeMs >= stat.mtimeMs) continue;
      const info = await sharp(file).rotate().resize({ width: w, withoutEnlargement: true }).webp(WEBP).toFile(out);
      variantsWritten++;
      variantsBytes += info.size;
    }
  } catch (err) {
    errors.push(`${rel(file)}: ${err?.message || err}`);
  }
}

// Remove variants whose original was deleted (e.g. a photo removed in the CMS).
for (const dir of DIRS) {
  const stale = (d) =>
    fs.existsSync(d)
      ? fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => {
          const p = path.join(d, e.name);
          return e.isDirectory() ? stale(p) : VARIANT.test(e.name) ? [p] : [];
        })
      : [];
  for (const v of stale(dir)) {
    const stem = v.replace(VARIANT, '');
    if (!['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG'].some((ext) => fs.existsSync(stem + ext))) fs.unlinkSync(v);
  }
}

if (errors.length) {
  fs.rmSync(STAMP, { force: true });
  console.error(`[images] ${errors.length} image(s) failed:`);
  errors.forEach((e) => console.error(`  - ${e}`));
  process.exit(1);
}
fs.writeFileSync(STAMP, settings);
console.log(
  `[images] OK — originals recompressed: ${originalsOptimized}, WebP variants written: ${variantsWritten}` +
    (variantsWritten ? ` (${kb(variantsBytes)} in total)` : ' (all up to date)'),
);
