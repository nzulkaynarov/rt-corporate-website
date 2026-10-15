import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const outputPath = path.join(rootDir, 'public', 'og-cover.png');

const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 630' width='1200' height='630'>
  <defs>
    <pattern id='cadGrid' width='24' height='24' patternUnits='userSpaceOnUse'>
      <path d='M 24 0 L 0 0 0 24' fill='none' stroke='#0A0A0A' stroke-width='0.75' stroke-opacity='0.08'/>
    </pattern>
    <pattern id='majorGrid' width='96' height='96' patternUnits='userSpaceOnUse'>
      <path d='M 96 0 L 0 0 0 96' fill='none' stroke='#0A0A0A' stroke-width='1.2' stroke-opacity='0.15'/>
    </pattern>
  </defs>

  <rect width='1200' height='630' fill='#C8CDD2'/>
  <rect width='1200' height='630' fill='url(#cadGrid)'/>
  <rect width='1200' height='630' fill='url(#majorGrid)'/>

  <!-- Outer Frame -->
  <rect x='24' y='24' width='1152' height='582' fill='none' stroke='#0A0A0A' stroke-width='2'/>
  <rect x='32' y='32' width='1136' height='566' fill='none' stroke='#0A0A0A' stroke-width='1' stroke-dasharray='6 4' stroke-opacity='0.4'/>

  <!-- Corner Marks -->
  <g stroke='#0A0A0A' stroke-width='2'>
    <line x1='16' y1='24' x2='32' y2='24'/>
    <line x1='24' y1='16' x2='24' y2='32'/>
    <line x1='1168' y1='24' x2='1184' y2='24'/>
    <line x1='1176' y1='16' x2='1176' y2='32'/>
    <line x1='16' y1='606' x2='32' y2='606'/>
    <line x1='24' y1='598' x2='24' y2='614'/>
    <line x1='1168' y1='606' x2='1184' y2='606'/>
    <line x1='1176' y1='598' x2='1176' y2='614'/>
  </g>

  <!-- Top Strip -->
  <rect x='48' y='48' width='1104' height='36' fill='#D4D8DC' stroke='#0A0A0A' stroke-width='1'/>
  <text x='64' y='71' font-family='Arial, Helvetica, sans-serif' font-size='12' font-weight='700' fill='#0A0A0A' letter-spacing='2'>
    REF: UZ-RAILTECH-DOC-2026 // NODE: TASHKENT (INDEX B2-2097) // VAT 12% CERTIFIED
  </text>
  <text x='1136' y='71' text-anchor='end' font-family='Arial, Helvetica, sans-serif' font-size='12' font-weight='700' fill='#0A0A0A' letter-spacing='1'>
    B2B.RAILTECH.UZ
  </text>

  <!-- Left Block -->
  <g transform='translate(64, 125)'>
    <!-- Header Brand Box -->
    <rect x='0' y='0' width='230' height='50' fill='#0A0A0A'/>
    <text x='16' y='36' font-family='Arial, Helvetica, sans-serif' font-size='32' font-weight='900' fill='#FFFFFF' letter-spacing='5'>
      RAILTECH
    </text>
    <text x='245' y='22' font-family='Arial, Helvetica, sans-serif' font-size='11' font-weight='700' fill='#4A5056' letter-spacing='2'>
      ENGINEERING &amp; RAILWAY LOGISTICS
    </text>
    <text x='245' y='42' font-family='Arial, Helvetica, sans-serif' font-size='13' font-weight='700' fill='#0A0A0A' letter-spacing='1'>
      РЕСПУБЛИКА УЗБЕКИСТАН // B2B &amp; B2G
    </text>

    <!-- Main Title -->
    <text x='0' y='115' font-family='Arial, Helvetica, sans-serif' font-size='38' font-weight='900' fill='#0A0A0A' letter-spacing='-0.5'>
      RAILTECH // ООО «RAILTECH»
    </text>

    <!-- Subtitle / Signature -->
    <text x='0' y='160' font-family='Arial, Helvetica, sans-serif' font-size='17' font-weight='700' fill='#0A0A0A' letter-spacing='0.5'>
      ПРОМЫШЛЕННЫЕ И ЖД ПОСТАВКИ · ВЭД DDP · IT-РЕШЕНИЯ · ТАШКЕНТ, INDEX B2-2097
    </text>

    <!-- Description -->
    <text x='0' y='205' font-family='Arial, Helvetica, sans-serif' font-size='16' fill='#4A5056'>
      Складской комплекс Index B2-2097 · Снабжение подвижного состава (18-100, СА-3)
    </text>
    <text x='0' y='232' font-family='Arial, Helvetica, sans-serif' font-size='16' fill='#4A5056'>
      Контрактный ВЭД под ключ с НДС 12% · Платформа b2b.railtech.uz
    </text>

    <!-- Metrics -->
    <g transform='translate(0, 275)'>
      <rect x='0' y='0' width='145' height='55' fill='#D4D8DC' stroke='#0A0A0A' stroke-width='1.5'/>
      <text x='12' y='20' font-family='Arial, Helvetica, sans-serif' font-size='10' font-weight='700' fill='#4A5056'>СКЛАД ТАШКЕНТ</text>
      <text x='12' y='44' font-family='Arial, Helvetica, sans-serif' font-size='18' font-weight='900' fill='#0A0A0A'>1 247+ SKU</text>

      <rect x='155' y='0' width='145' height='55' fill='#D4D8DC' stroke='#0A0A0A' stroke-width='1.5'/>
      <text x='167' y='20' font-family='Arial, Helvetica, sans-serif' font-size='10' font-weight='700' fill='#4A5056'>ЗАВОДЫ-ИЗГОТ.</text>
      <text x='167' y='44' font-family='Arial, Helvetica, sans-serif' font-size='18' font-weight='900' fill='#0A0A0A'>86+ ПАРТН.</text>

      <rect x='310' y='0' width='145' height='55' fill='#D4D8DC' stroke='#0A0A0A' stroke-width='1.5'/>
      <text x='322' y='20' font-family='Arial, Helvetica, sans-serif' font-size='10' font-weight='700' fill='#4A5056'>КОЛЕЯ Ж/Д</text>
      <text x='322' y='44' font-family='Arial, Helvetica, sans-serif' font-size='18' font-weight='900' fill='#0A0A0A'>1520 ММ</text>

      <rect x='465' y='0' width='145' height='55' fill='#0A0A0A' stroke='#0A0A0A' stroke-width='1.5'/>
      <text x='477' y='20' font-family='Arial, Helvetica, sans-serif' font-size='10' font-weight='700' fill='#D4D8DC'>НАЛОГОВЫЙ ЗАЧЕТ</text>
      <text x='477' y='44' font-family='Arial, Helvetica, sans-serif' font-size='18' font-weight='900' fill='#FFFFFF'>НДС 12%</text>
    </g>
  </g>

  <!-- Right CAD Diagram -->
  <g transform='translate(770, 140)'>
    <rect x='0' y='0' width='370' height='370' fill='#D4D8DC' fill-opacity='0.6' stroke='#0A0A0A' stroke-width='2'/>
    <line x1='0' y1='0' x2='370' y2='370' stroke='#0A0A0A' stroke-width='0.5' stroke-dasharray='4 4' stroke-opacity='0.3'/>
    <line x1='370' y1='0' x2='0' y2='370' stroke='#0A0A0A' stroke-width='0.5' stroke-dasharray='4 4' stroke-opacity='0.3'/>

    <circle cx='185' cy='185' r='155' fill='none' stroke='#0A0A0A' stroke-width='1' stroke-opacity='0.3'/>
    <circle cx='185' cy='185' r='115' fill='none' stroke='#0A0A0A' stroke-width='1.5'/>
    <circle cx='185' cy='185' r='55' fill='none' stroke='#0A0A0A' stroke-width='2'/>
    <circle cx='185' cy='185' r='18' fill='#0A0A0A'/>

    <!-- Isometric Bogie -->
    <g stroke='#0A0A0A' stroke-width='2' fill='none'>
      <line x1='30' y1='280' x2='340' y2='280' stroke-width='4'/>
      <line x1='30' y1='300' x2='340' y2='300' stroke-width='3'/>
      <ellipse cx='85' cy='225' rx='34' ry='55' stroke-width='2.5'/>
      <ellipse cx='85' cy='225' rx='12' ry='22' stroke-width='1.5'/>
      <ellipse cx='285' cy='225' rx='34' ry='55' stroke-width='2.5'/>
      <ellipse cx='285' cy='225' rx='12' ry='22' stroke-width='1.5'/>
      <line x1='85' y1='225' x2='285' y2='225' stroke-width='5'/>
      <polygon points='55,185 315,185 295,155 75,155' stroke-width='2.5' fill='#C8CDD2' fill-opacity='0.8'/>
      <rect x='145' y='125' width='80' height='40' stroke-width='2.5' fill='#0A0A0A'/>
      <line x1='160' y1='165' x2='160' y2='185' stroke-width='3'/>
      <line x1='175' y1='165' x2='175' y2='185' stroke-width='3'/>
      <line x1='195' y1='165' x2='195' y2='185' stroke-width='3'/>
      <line x1='210' y1='165' x2='210' y2='185' stroke-width='3'/>
    </g>

    <text x='185' y='345' text-anchor='middle' font-family='Arial, Helvetica, sans-serif' font-size='11' font-weight='700' fill='#0A0A0A' letter-spacing='1'>
      BOGIE 18-100 // CAD SCHEMATIC
    </text>
  </g>

  <!-- Bottom Footer -->
  <rect x='48' y='546' width='1104' height='36' fill='#0A0A0A'/>
  <text x='64' y='569' font-family='Arial, Helvetica, sans-serif' font-size='12' font-weight='700' fill='#D4D8DC' letter-spacing='2'>
    © 2026 ООО «RAILTECH» // ТАШКЕНТ // ТЕЛ: +998 90 118-90-00 // INFO@RAILTECH.UZ
  </text>
  <text x='1136' y='569' text-anchor='end' font-family='Arial, Helvetica, sans-serif' font-size='12' font-weight='700' fill='#FFFFFF' letter-spacing='2'>
    B2B.RAILTECH.UZ ↗
  </text>
</svg>`;

const buffer = Buffer.from(svg);
await sharp(buffer)
  .resize(1200, 630)
  .png({ quality: 95, compressionLevel: 9 })
  .toFile(outputPath);

console.log('og-cover.png regenerated at:', outputPath);
