// One-off generator of the raster site icons from the brand mark (public/favicon.svg):
//   public/favicon.ico          16 + 32 + 48 px, for browsers, bookmarks and search results that ignore SVG icons
//   public/apple-touch-icon.png 180 px on white, for «На экран Домой» on iPhone/iPad (iOS does not use SVG icons)
// Run again only when the mark changes: `node scripts/make-icons.mjs`. The files are committed.
import fs from 'node:fs';
import sharp from 'sharp';

const svg = fs.readFileSync('public/favicon.svg', 'utf8');
// At 16–48 px the 20-unit strokes of the 655-unit mark are thinner than a pixel: draw them bolder.
const bold = svg.replace(/stroke-width="20"/g, 'stroke-width="44"');

const png = (source, size) => sharp(Buffer.from(source), { density: 600 }).resize(size, size).png().toBuffer();

// ICO with PNG payloads (supported by every current browser): 6-byte header, 16-byte entry per image, then the data.
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map((s) => png(bold, s)));
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(images.length, 4);
let offset = 6 + 16 * images.length;
const entries = images.map((img, i) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(sizes[i] % 256, 0);
  e.writeUInt8(sizes[i] % 256, 1);
  e.writeUInt16LE(1, 4); // colour planes
  e.writeUInt16LE(32, 6); // bits per pixel
  e.writeUInt32LE(img.length, 8);
  e.writeUInt32LE(offset, 12);
  offset += img.length;
  return e;
});
fs.writeFileSync('public/favicon.ico', Buffer.concat([header, ...entries, ...images]));

// Apple touch icon: iOS fills transparency with black and rounds the corners itself, so the mark sits on white.
const mark = await png(svg, 136);
const touch = await sharp({ create: { width: 180, height: 180, channels: 4, background: '#ffffff' } })
  .composite([{ input: mark, left: 22, top: 22 }])
  .png()
  .toBuffer();
fs.writeFileSync('public/apple-touch-icon.png', touch);
console.log('favicon.ico', fs.statSync('public/favicon.ico').size, 'B; apple-touch-icon.png', touch.length, 'B');
