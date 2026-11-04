/**
 * Social preview image public/og-cover.png (1200×630) in the «Мост» style (docs/DESIGN.md).
 * Texts come from the CMS (company.json, home.json). Run after changing them: `make og`.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const company = read('src/data/cms/company.json');
const home = read('src/data/cms/home.json');
// Service titles in their order (src/content/services/*.md front matter).
const services = fs
  .readdirSync(path.join(root, 'src/content/services'))
  .map((f) => fs.readFileSync(path.join(root, 'src/content/services', f), 'utf8'))
  .map((md) => ({ order: Number(md.match(/^order:\s*(\d+)/m)?.[1] || 99), title: md.match(/^title:\s*"?(.+?)"?\s*$/m)?.[1] || '' }))
  .sort((a, b) => a.order - b.order)
  .map((s) => s.title);
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Splits a headline into lines of at most `max` characters. */
function lines(text, max) {
  const out = [];
  let line = '';
  for (const word of text.split(' ')) {
    if ((line + ' ' + word).trim().length > max) {
      out.push(line.trim());
      line = word;
    } else line += ' ' + word;
  }
  if (line.trim()) out.push(line.trim());
  return out;
}

const title = lines(home.hero.title, 24);
const C = { ink: '#2D3E50', muted: '#5A6876', brand: '#35819B', brandMid: '#A7CED9', brandSoft: '#E3F0F4', accent: '#E8833A', line: '#DDE5EA' };
const font = "Montserrat, 'Segoe UI', Arial, Helvetica, sans-serif";

const mark = (x, y, s) => `
  <g transform="translate(${x} ${y}) scale(${s / 655})">
    <polygon fill="${C.brand}" points="327.5 0 655 327.5 327.5 655 0 327.5"/>
    <g transform="translate(185 157)" stroke="#FFFFFF" stroke-linecap="round" stroke-width="20" fill="none">
      <path d="M170.176222,267.355023 C204.768507,239.937358 226.974943,197.437049 226.974943,149.724068 C226.974943,67.0337488 160.276589,0 78,0 M78.3416856,131.523666 L78.3416856,0.343403827 M170.529527,267.943507 L228,341" stroke-linejoin="round"/>
      <path d="M77.6578947,170.304659 L77.6578947,339.695341 M0.342105263,170.342742 L155.657895,170.342742"/>
    </g>
  </g>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="disc" cx="35%" cy="30%" r="75%">
      <stop offset="0%" stop-color="${C.brandMid}"/>
      <stop offset="100%" stop-color="${C.brandSoft}"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#FFFFFF"/>
  <circle cx="930" cy="315" r="250" fill="none" stroke="${C.line}" stroke-width="2"/>
  <circle cx="930" cy="315" r="205" fill="url(#disc)"/>
  <circle cx="930" cy="315" r="92" fill="#FFFFFF"/>
  ${mark(880, 265, 100)}
  <circle cx="1088" cy="137" r="14" fill="${C.accent}"/>
  <circle cx="690" cy="420" r="7" fill="${C.ink}"/>

  ${mark(72, 64, 44)}
  <text x="128" y="96" font-family="${font}" font-size="30" font-weight="700" fill="${C.ink}">${esc(company.brandName)}</text>

  <text font-family="${font}" font-size="54" font-weight="800" fill="${C.ink}" letter-spacing="-1">
    ${title.map((l, i) => `<tspan x="72" y="${232 + i * 64}">${esc(l)}</tspan>`).join('')}
  </text>
  <rect x="72" y="${262 + title.length * 64 - 30}" width="64" height="4" fill="${C.accent}"/>
  <text x="72" y="${262 + title.length * 64 + 16}" font-family="${font}" font-size="20" font-weight="600" fill="${C.muted}">${esc(services.join(' · '))}</text>

  <text x="72" y="580" font-family="${font}" font-size="20" font-weight="600" fill="${C.muted}">${esc(company.siteDomain)} · ${esc(company.city)} · ${esc(company.phone)}</text>
</svg>`;

await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(path.join(root, 'public', 'og-cover.png'));
console.log('og-cover.png regenerated');
