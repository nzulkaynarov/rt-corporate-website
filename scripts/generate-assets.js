import fs from 'fs';
import path from 'path';

const dirs = [
  'public/images',
  'public/images/hero',
  'public/images/catalog',
  'public/images/services',
  'public/images/projects',
];

dirs.forEach((d) => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

function createSvg({ title, code, subtitle, type, details = [] }) {
  const width = 800;
  const height = 500;
  
  // Choose visual motif based on type
  let motifSvg = '';
  if (type === 'warehouse') {
    motifSvg = `
      <!-- Isometric Warehouse / Shelving Matrix -->
      <g stroke="#0A0A0A" stroke-width="1.2" fill="none" opacity="0.85">
        <!-- Ground isometric grid -->
        <path d="M 120 380 L 400 470 L 680 380 L 400 290 Z" fill="#C4C9CE" opacity="0.5" />
        <path d="M 160 365 L 400 440 L 640 365" stroke-dasharray="3 3" opacity="0.6" />
        <path d="M 200 350 L 400 410 L 600 350" stroke-dasharray="3 3" opacity="0.6" />
        
        <!-- Bay 01 Rack Structure -->
        <path d="M 240 180 L 340 140 L 340 340 L 240 380 Z" fill="#D4D8DC" />
        <path d="M 340 140 L 440 180 L 440 380 L 340 340 Z" fill="#B8BDC2" />
        <line x1="240" y1="230" x2="340" y2="190" />
        <line x1="340" y1="190" x2="440" y2="230" />
        <line x1="240" y1="280" x2="340" y2="240" />
        <line x1="340" y1="240" x2="440" y2="280" />
        <line x1="240" y1="330" x2="340" y2="290" />
        <line x1="340" y1="290" x2="440" y2="330" />
        
        <!-- Bay 02 Pallets -->
        <path d="M 460 210 L 560 170 L 560 370 L 460 410 Z" fill="#D4D8DC" />
        <path d="M 560 170 L 660 210 L 660 410 L 560 370 Z" fill="#B8BDC2" />
        <line x1="460" y1="260" x2="560" y2="220" />
        <line x1="560" y1="220" x2="660" y2="260" />
        <line x1="460" y1="310" x2="560" y2="270" />
        <line x1="560" y1="270" x2="660" y2="310" />
        <line x1="460" y1="360" x2="560" y2="320" />
        <line x1="560" y1="320" x2="660" y2="360" />

        <!-- Overhead Crane Rail -->
        <line x1="140" y1="90" x2="660" y2="90" stroke-width="2" />
        <line x1="140" y1="98" x2="660" y2="98" stroke-dasharray="4 4" />
        <rect x="360" y="80" width="80" height="26" fill="#0A0A0A" />
        <text x="400" y="97" fill="#FFF" font-size="9" font-family="monospace" text-anchor="middle" font-weight="bold">CRANE 15T</text>
        <line x1="400" y1="106" x2="400" y2="180" stroke-width="1.5" stroke-dasharray="2 2" />
      </g>
    `;
  } else if (type === 'logistics') {
    motifSvg = `
      <!-- Intermodal Transport & Supply Route Vector -->
      <g stroke="#0A0A0A" stroke-width="1.2" fill="none" opacity="0.85">
        <!-- World Route Nodes & Arc -->
        <circle cx="200" cy="300" r="8" fill="#0A0A0A" />
        <circle cx="200" cy="300" r="18" stroke-dasharray="2 2" />
        <text x="200" y="335" fill="#0A0A0A" font-size="10" font-family="monospace" text-anchor="middle" font-weight="bold">HUB // CHINA / EU</text>

        <circle cx="600" cy="220" r="8" fill="#0A0A0A" />
        <circle cx="600" cy="220" r="18" stroke-dasharray="2 2" />
        <text x="600" y="255" fill="#0A0A0A" font-size="10" font-family="monospace" text-anchor="middle" font-weight="bold">TASHKENT DDP // INDEX</text>

        <!-- Dynamic Transit Arc -->
        <path d="M 200 300 Q 400 90 600 220" stroke-width="2.5" stroke="#0A0A0A" />
        <path d="M 200 300 Q 400 130 600 220" stroke-dasharray="5 4" opacity="0.6" />

        <!-- 40ft Intermodal Container Wireframe -->
        <g transform="translate(320, 240)">
          <polygon points="0,40 100,0 200,40 100,80" fill="#C4C9CE" stroke="#0A0A0A" stroke-width="1.5" />
          <polygon points="0,40 100,80 100,160 0,120" fill="#D4D8DC" stroke="#0A0A0A" stroke-width="1.5" />
          <polygon points="100,80 200,40 200,120 100,160" fill="#A8ADB2" stroke="#0A0A0A" stroke-width="1.5" />
          <!-- Corrugation lines -->
          <line x1="20" y1="48" x2="20" y2="128" opacity="0.6" />
          <line x1="40" y1="56" x2="40" y2="136" opacity="0.6" />
          <line x1="60" y1="64" x2="60" y2="144" opacity="0.6" />
          <line x1="80" y1="72" x2="80" y2="152" opacity="0.6" />
          <text x="140" y="110" fill="#0A0A0A" font-size="10" font-family="monospace" font-weight="bold">DDP 40'HC</text>
        </g>
      </g>
    `;
  } else if (type === 'software') {
    motifSvg = `
      <!-- Neural Topology / Platform Architecture Graph -->
      <g stroke="#0A0A0A" stroke-width="1.2" fill="none" opacity="0.85">
        <!-- Center Neural Hub -->
        <circle cx="400" cy="250" r="45" fill="#D4D8DC" stroke-width="2" />
        <circle cx="400" cy="250" r="55" stroke-dasharray="3 3" />
        <text x="400" y="247" fill="#0A0A0A" font-size="11" font-family="monospace" text-anchor="middle" font-weight="bold">SMART MATCH</text>
        <text x="400" y="262" fill="#4A5056" font-size="9" font-family="monospace" text-anchor="middle">AI ENGINE 98.4%</text>

        <!-- Connected Satellites -->
        <g>
          <line x1="400" y1="205" x2="400" y2="110" stroke-width="1.5" />
          <rect x="330" y="70" width="140" height="40" fill="#C4C9CE" stroke="#0A0A0A" stroke-width="1.5" />
          <text x="400" y="94" fill="#0A0A0A" font-size="9" font-family="monospace" text-anchor="middle" font-weight="bold">ERP / 1C INTERFACE</text>

          <line x1="445" y1="250" x2="570" y2="250" stroke-width="1.5" />
          <rect x="570" y="230" width="140" height="40" fill="#C4C9CE" stroke="#0A0A0A" stroke-width="1.5" />
          <text x="640" y="254" fill="#0A0A0A" font-size="9" font-family="monospace" text-anchor="middle" font-weight="bold">DIDOX E-INVOICE</text>

          <line x1="400" y1="295" x2="400" y2="390" stroke-width="1.5" />
          <rect x="330" y="390" width="140" height="40" fill="#C4C9CE" stroke="#0A0A0A" stroke-width="1.5" />
          <text x="400" y="414" fill="#0A0A0A" font-size="9" font-family="monospace" text-anchor="middle" font-weight="bold">B2B.RAILTECH.UZ</text>

          <line x1="355" y1="250" x2="230" y2="250" stroke-width="1.5" />
          <rect x="90" y="230" width="140" height="40" fill="#C4C9CE" stroke="#0A0A0A" stroke-width="1.5" />
          <text x="160" y="254" fill="#0A0A0A" font-size="9" font-family="monospace" text-anchor="middle" font-weight="bold">WMS TELEMETRY</text>
        </g>
      </g>
    `;
  } else if (type === 'engineering' || type === 'art') {
    motifSvg = `
      <!-- Precision Engineering Blueprint & Golden Ratio -->
      <g stroke="#0A0A0A" stroke-width="1.2" fill="none" opacity="0.85">
        <!-- Concentric technical circles -->
        <circle cx="400" cy="250" r="140" stroke-dasharray="4 4" opacity="0.4" />
        <circle cx="400" cy="250" r="100" stroke-width="1.5" />
        <circle cx="400" cy="250" r="60" stroke-dasharray="2 2" />
        <circle cx="400" cy="250" r="20" fill="#0A0A0A" />

        <!-- 30-60-90 Engineering Protractor Lines -->
        <line x1="160" y1="250" x2="640" y2="250" stroke-width="1" />
        <line x1="400" y1="50" x2="400" y2="450" stroke-width="1" />
        <line x1="220" y1="120" x2="580" y2="380" stroke-dasharray="3 3" opacity="0.6" />
        <line x1="220" y1="380" x2="580" y2="120" stroke-dasharray="3 3" opacity="0.6" />

        <!-- Caliper dimension arrows -->
        <g transform="translate(180, 110)">
          <line x1="0" y1="0" x2="440" y2="0" stroke-width="1" />
          <line x1="0" y1="-8" x2="0" y2="8" stroke-width="1.5" />
          <line x1="440" y1="-8" x2="440" y2="8" stroke-width="1.5" />
          <rect x="180" y="-12" width="80" height="24" fill="#0A0A0A" />
          <text x="220" y="3" fill="#FFF" font-size="10" font-family="monospace" text-anchor="middle" font-weight="bold">Ø 280.00 ± 0.02</text>
        </g>
      </g>
    `;
  } else {
    // Default precision CAD schematic
    motifSvg = `
      <!-- Technical Assembly Blueprint -->
      <g stroke="#0A0A0A" stroke-width="1.2" fill="none" opacity="0.85">
        <rect x="220" y="160" width="360" height="180" fill="#D4D8DC" stroke-width="2" />
        <rect x="260" y="200" width="280" height="100" stroke-dasharray="4 3" />
        <circle cx="400" cy="250" r="36" stroke-width="1.5" fill="#C4C9CE" />
        <circle cx="400" cy="250" r="4" fill="#0A0A0A" />
        
        <!-- Crosshairs -->
        <line x1="180" y1="250" x2="620" y2="250" stroke-dasharray="3 3" opacity="0.7" />
        <line x1="400" y1="120" x2="400" y2="380" stroke-dasharray="3 3" opacity="0.7" />
        
        <!-- Corner precision notches -->
        <path d="M 230 170 h 16 M 230 170 v 16" stroke-width="2" />
        <path d="M 570 170 h -16 M 570 170 v 16" stroke-width="2" />
        <path d="M 230 330 h 16 M 230 330 v -16" stroke-width="2" />
        <path d="M 570 330 h -16 M 570 330 v -16" stroke-width="2" />
      </g>
    `;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <!-- 20px CAD Grid -->
    <pattern id="grid-${code}" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(10,10,10,0.06)" stroke-width="0.8" />
    </pattern>
    <!-- Major 100px Grid -->
    <pattern id="grid-major-${code}" width="100" height="100" patternUnits="userSpaceOnUse">
      <rect width="100" height="100" fill="url(#grid-${code})" />
      <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(10,10,10,0.12)" stroke-width="1" />
    </pattern>
  </defs>

  <!-- Background Matte Titanium Canvas -->
  <rect width="100%" height="100%" fill="#D4D8DC" />
  <rect width="100%" height="100%" fill="url(#grid-major-${code})" />

  <!-- Outer HUD Frame -->
  <rect x="24" y="24" width="${width - 48}" height="${height - 48}" fill="none" stroke="#0A0A0A" stroke-width="1.5" />
  
  <!-- Optical Corner Crosshairs -->
  <path d="M 16 36 L 36 36 L 36 16" fill="none" stroke="#0A0A0A" stroke-width="2.5" />
  <path d="M ${width - 16} 36 L ${width - 36} 36 L ${width - 36} 16" fill="none" stroke="#0A0A0A" stroke-width="2.5" />
  <path d="M 16 ${height - 36} L 36 ${height - 36} L 36 ${height - 16}" fill="none" stroke="#0A0A0A" stroke-width="2.5" />
  <path d="M ${width - 16} ${height - 36} L ${width - 36} ${height - 36} L ${width - 36} ${height - 16}" fill="none" stroke="#0A0A0A" stroke-width="2.5" />

  <!-- Central Technical Graphics Motif -->
  ${motifSvg}

  <!-- Header Banner Plate -->
  <g transform="translate(40, 42)">
    <rect x="0" y="0" width="220" height="24" fill="#0A0A0A" />
    <text x="10" y="16" fill="#FFF" font-size="10" font-family="'JetBrains Mono', monospace" font-weight="bold" letter-spacing="1">
      RT // ${code.toUpperCase()}
    </text>
    <rect x="230" y="0" width="180" height="24" fill="#C4C9CE" stroke="#0A0A0A" stroke-width="1" />
    <text x="240" y="16" fill="#0A0A0A" font-size="9" font-family="'JetBrains Mono', monospace" font-weight="bold">
      STATUS // VERIFIED 100%
    </text>
  </g>

  <!-- Title & Description Telemetry Plaque -->
  <g transform="translate(40, ${height - 100})">
    <rect x="0" y="0" width="${width - 80}" height="64" fill="rgba(212, 216, 220, 0.9)" stroke="#0A0A0A" stroke-width="1" />
    <text x="16" y="24" fill="#0A0A0A" font-size="14" font-family="'Plus Jakarta Sans', Inter, sans-serif" font-weight="bold" letter-spacing="-0.02em">
      ${title.toUpperCase()}
    </text>
    <text x="16" y="44" fill="#4A5056" font-size="10" font-family="'JetBrains Mono', monospace">
      ${subtitle || 'ИНЖЕНЕРНЫЙ ПАСПОРТ ИЗДЕЛИЯ // ОФИЦИАЛЬНАЯ СКЛАДСКАЯ ПРОГРАММА ТАШКЕНТ'}
    </text>
    <!-- Right Badge -->
    <rect x="${width - 250}" y="14" width="150" height="36" fill="#0A0A0A" />
    <text x="${width - 175}" y="36" fill="#FFF" font-size="9" font-family="'JetBrains Mono', monospace" font-weight="bold" text-anchor="middle">
      INDEX B2-2097 // UZ
    </text>
  </g>

  <!-- Calibration Crosshair in center -->
  <g transform="translate(${width / 2}, ${height / 2})" stroke="#0A0A0A" stroke-width="0.8" opacity="0.35">
    <circle cx="0" cy="0" r="18" fill="none" />
    <line x1="-28" y1="0" x2="28" y2="0" />
    <line x1="0" y1="-28" x2="0" y2="28" />
  </g>
</svg>`;
}

// 1. Hero / Slider SVGs
const heroSlides = [
  {
    file: 'public/images/slider-01.svg',
    heroFile: 'public/images/hero/slider-01.svg',
    code: 'SEC.01 // WAREHOUSE',
    title: 'Складской комплекс Index B2-2097 в Ташкенте',
    subtitle: 'Постоянный неснижаемый запас продукции · Отгрузка 24 часа · Прямой подъездной путь',
    type: 'warehouse',
  },
  {
    file: 'public/images/slider-02.svg',
    heroFile: 'public/images/hero/slider-02.svg',
    code: 'SEC.02 // LOGISTICS',
    title: 'Контрактные поставки ВЭД под ключ (DDP Ташкент)',
    subtitle: 'Прямой импорт с 86+ заводов · Фиксация цены в сумах · НДС 12% в ЭСФ Didox',
    type: 'logistics',
  },
  {
    file: 'public/images/slider-03.svg',
    heroFile: 'public/images/hero/slider-03.svg',
    code: 'SEC.03 // DIGITAL',
    title: 'Цифровая платформа b2b.railtech.uz и Smart Match AI',
    subtitle: 'Парсинг спецификаций 98.4% · ERP/1C интеграция · Интеллектуальный поиск номенклатуры',
    type: 'software',
  },
  {
    file: 'public/images/slider-04.svg',
    heroFile: 'public/images/hero/slider-04.svg',
    code: 'SEC.04 // ART LAB',
    title: 'Инженерный трансфер технологий & RailTech Art Lab',
    subtitle: 'Локализация документации · Полигонные испытания · Индустриальная графика и архитектура',
    type: 'engineering',
  },
];

heroSlides.forEach((s) => {
  const content = createSvg(s);
  fs.writeFileSync(s.file, content);
  fs.writeFileSync(s.heroFile, content);
  console.log(`Generated: ${s.file}`);
});

// 2. Catalog Items SVGs
const catalogItems = [
  { sku: 'rt-rs-118', title: 'Тележка двухосная грузовая модель 18-100', cat: 'Подвижной состав', type: 'engineering' },
  { sku: 'rt-rs-102', title: 'Колесная пара РУ1Ш-957 с буксовыми узлами', cat: 'Подвижной состав', type: 'engineering' },
  { sku: 'rt-rs-208', title: 'Автосцепка СА-3 в сборе с тяговым хомутом', cat: 'Подвижной состав', type: 'engineering' },
  { sku: 'rt-rs-305', title: 'Колодка тормозная композиционная 25610-Н', cat: 'Подвижной состав', type: 'engineering' },
  { sku: 'rt-scb-001', title: 'Электропривод стрелочный невзрезной СП-6М', cat: 'Системы СЦБ', type: 'engineering' },
  { sku: 'rt-scb-014', title: 'Трансформатор путевой сигнальный ПОБС-2А', cat: 'Системы СЦБ', type: 'engineering' },
  { sku: 'rt-trk-401', title: 'Комплект промежуточного скрепления КБ-65', cat: 'Верхнее строение пути', type: 'engineering' },
  { sku: 'rt-trk-419', title: 'Башмак искробезопасный накаточный 8739.000', cat: 'Верхнее строение пути', type: 'engineering' },
  { sku: 'rt-elc-502', title: 'Реле штепсельное сигнальное электромагнитное НМШ1-1440', cat: 'Электрооборудование', type: 'software' },
  { sku: 'rt-kip-045', title: 'Прибор контроля параметров путевых реле ПР-УПМ', cat: 'КИПиА и диагностика', type: 'software' },
];

catalogItems.forEach((item) => {
  const filePath = `public/images/catalog/${item.sku}.svg`;
  const content = createSvg({
    title: item.title,
    code: `SKU // ${item.sku.toUpperCase()}`,
    subtitle: `КАТЕГОРИЯ: ${item.cat.toUpperCase()} · БАЗИС: ТАШКЕНТ (INDEX B2-2097) · НДС 12%`,
    type: item.type,
  });
  fs.writeFileSync(filePath, content);
  console.log(`Generated catalog item: ${filePath}`);
});

// 3. Services SVGs
const services = [
  { slug: 'turnkey-import-ddp', title: 'Контрактные поставки ВЭД под ключ (DDP Ташкент)', type: 'logistics' },
  { slug: 'custom-software', title: 'Заказная разработка B2B/B2G порталов и алгоритмов AI', type: 'software' },
  { slug: 'sourcing-procurement', title: 'Комплексный сорсинг и поиск редкого оборудования', type: 'warehouse' },
  { slug: 'brand-representation', title: 'Официальное торговое представительство и дистрибуция', type: 'engineering' },
];

services.forEach((srv) => {
  const filePath = `public/images/services/${srv.slug}.svg`;
  const content = createSvg({
    title: srv.title,
    code: `SERVICE // ${srv.slug.toUpperCase()}`,
    subtitle: 'КОМПЛЕКСНОЕ ОБСЛУЖИВАНИЕ ДЛЯ ПРЕДПРИЯТИЙ РЕСПУБЛИКИ УЗБЕКИСТАН',
    type: srv.type,
  });
  fs.writeFileSync(filePath, content);
  console.log(`Generated service: ${filePath}`);
});

// 4. Projects SVGs
const projects = [
  { slug: 'proj-01', title: 'Локализация и поставка комплектующих для депо Ташкента', type: 'warehouse' },
  { slug: 'proj-02', title: 'Модернизация систем стрелочных переводов на карьерах', type: 'engineering' },
  { slug: 'proj-03', title: 'Кураторская программа RailTech Art Lab', type: 'art' },
  { slug: 'proj-04', title: 'Внедрение платформы b2b.railtech.uz и NLP-парсера', type: 'software' },
  { slug: 'proj-05', title: 'Мультимодальный импорт партий тяжелого машиностроения', type: 'logistics' },
];

projects.forEach((prj) => {
  const filePath = `public/images/projects/${prj.slug}.svg`;
  const content = createSvg({
    title: prj.title,
    code: `PROJECT // ${prj.slug.toUpperCase()}`,
    subtitle: 'РЕАЛИЗОВАННЫЙ КЕЙС // ТАШКЕНТ // УЗБЕКИСТАН',
    type: prj.type,
  });
  fs.writeFileSync(filePath, content);
  console.log(`Generated project: ${filePath}`);
});

console.log('All vector assets generated successfully.');
