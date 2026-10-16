export type AppMode = 'SUPPLY' | 'CONTRACT' | 'DIGITAL' | 'PROJECTS';
export type Locale = 'ru' | 'uz' | 'en';

export interface ToolItem {
  code: string;
  name: string;
  filterKey: string;
  description: string;
}

export interface SkuItem {
  sku: string;
  title: string;
  subsystem: string;
  gost: string;
  tnved: string;
  warehouse: string;
  status: 'В наличии' | 'Резерв' | 'Под заказ' | 'Mavjud' | 'Zaxirada' | 'Buyurtma asosida' | 'In Stock' | 'Reserved' | 'On Order';
  statusKey: 'in_stock' | 'reserved' | 'on_order';
  specs: string;
}

export interface ProjectCard {
  code: string;
  tag: string;
  title: string;
  subtitle: string;
  metrics: string[];
  description: string;
  link?: string;
}

export interface ModeConfig {
  id: AppMode;
  label: string;
  shortTitle: string;
  topBarStatus: string;
  modelType: 'mechanism' | 'container' | 'network' | 'hypercube';
  modelName: string;
  modelScale: string;
  tools: ToolItem[];
  hud: {
    section1Label: string;
    section1Title: string;
    section1Meta: string;
    section2Label: string;
    section2Title: string;
    section2Check1: string;
    section2Check2: string;
    section3Label: string;
    section3Title: string;
    section3Sub: string;
  };
  contentHeader: {
    indexCode: string;
    title: string;
    subtitle: string;
  };
}

export interface UiTranslations {
  orgSubtitle: string;
  modesLabel: string;
  toolsLabel: string;
  cmdLabel: string;
  searchPlaceholder: string;
  goButton: string;
  rotationLabel: string;
  pitchLabel: string;
  vatCheckbox: string;
  vatActive: string;
  dutyRateLabel: string;
  invoiceLabel: string;
  ddpCalcTitle: string;
  ddpWithVat: string;
  ddpWithoutVat: string;
  requestKpButton: string;
  uploadSpecButton: string;
  activeFilterPrefix: string;
  supplyTable: {
    sku: string;
    name: string;
    subsystem: string;
    standard: string;
    hsCode: string;
    warehouse: string;
    status: string;
    action: string;
    requestInvoice: string;
  };
  actions: {
    openPlatform: string;
    requestEstimate: string;
  };
  footer: {
    companyDesc: string;
    headquarters: string;
    hqAddress1: string;
    hqAddress2: string;
    phoneLabel: string;
    emailLabel: string;
    ecosystem: string;
    b2bPortal: string;
    cmsAdmin: string;
    systemStatus: string;
    copyright: string;
  };
  modal: {
    badge: string;
    title: string;
    locationMeta: string;
    nameLabel: string;
    namePlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    companyLabel: string;
    companyPlaceholder: string;
    innLabel: string;
    innPlaceholder: string;
    taskLabel: string;
    taskPlaceholder: string;
    fileLabel: string;
    fileButton: string;
    fileDefault: string;
    cancelButton: string;
    submitButton: string;
    sendingButton: string;
    successBadge: string;
    successMessage: string;
    errorMessage: string;
  };
}

export const SKU_CATALOG: Record<Locale, SkuItem[]> = {
  ru: [
    {
      sku: 'RT-SCB-001',
      title: 'Электропривод стрелочный СП-6М',
      subsystem: 'СЦБ и автоматика',
      gost: 'ГОСТ 12.2.007.0-75',
      tnved: '8530 10 000 0',
      warehouse: 'Ташкент, Index B2-2097',
      status: 'В наличии',
      statusKey: 'in_stock',
      specs: '160В, 6000Н, ход шибера 154 мм',
    },
    {
      sku: 'RT-SCB-014',
      title: 'Трансформатор путевой ПОБС-2А',
      subsystem: 'СЦБ и автоматика',
      gost: 'ТУ 32 ЦШ 390-84',
      tnved: '8504 31 800 7',
      warehouse: 'Ташкент, Index B2-2097',
      status: 'В наличии',
      statusKey: 'in_stock',
      specs: 'Мощность 300 ВА, частота 50 Гц, масса 16 кг',
    },
    {
      sku: 'RT-RS-102',
      title: 'Колесная пара РУ1Ш-957-Г в сборе с буксами',
      subsystem: 'Подвижной состав',
      gost: 'ГОСТ 4835-2013',
      tnved: '8607 19 100 0',
      warehouse: 'Ташкент, Index B2-2097',
      status: 'В наличии',
      statusKey: 'in_stock',
      specs: 'Диаметр колеса 957 мм, нагрузка 23.5 тс',
    },
    {
      sku: 'RT-RS-118',
      title: 'Тележка двухосная грузового вагона 18-100',
      subsystem: 'Подвижной состав',
      gost: 'ГОСТ 9246-2013',
      tnved: '8607 12 000 0',
      warehouse: 'Ташкент / Консолидация',
      status: 'Резерв',
      statusKey: 'reserved',
      specs: 'База 1850 мм, расчетная нагрузка 23.5 тс, тара 4.85 т',
    },
    {
      sku: 'RT-RS-208',
      title: 'Автосцепка СА-3 (корпус + механизм)',
      subsystem: 'Подвижной состав',
      gost: 'ГОСТ 21447-75',
      tnved: '8607 30 000 0',
      warehouse: 'Ташкент, Index B2-2097',
      status: 'В наличии',
      statusKey: 'in_stock',
      specs: 'Сталь 20ГФЛ, ударно-тяговый контур',
    },
    {
      sku: 'RT-RS-305',
      title: 'Колодка тормозная композиционная 25610-Н',
      subsystem: 'Подвижной состав',
      gost: 'ГОСТ 30249-97',
      tnved: '8607 29 000 0',
      warehouse: 'Ташкент, Index B2-2097',
      status: 'В наличии',
      statusKey: 'in_stock',
      specs: 'С сетчатым каркасом, партия от 500 шт.',
    },
    {
      sku: 'RT-TRK-401',
      title: 'Клемма упругая рельсового скрепления ЖБР-65',
      subsystem: 'Путевое хозяйство',
      gost: 'ТУ 1293-061-01124323',
      tnved: '7302 40 000 0',
      warehouse: 'Ташкент, Index B2-2097',
      status: 'В наличии',
      statusKey: 'in_stock',
      specs: 'Пружинная сталь 60С2А, усилие прижатия 10 кН',
    },
    {
      sku: 'RT-TRK-419',
      title: 'Шуруповерт путевой бензиновый ШПБ-2',
      subsystem: 'Путевое хозяйство',
      gost: 'ГОСТ Р 54772-2011',
      tnved: '8467 89 000 0',
      warehouse: 'Ташкент, Index B2-2097',
      status: 'В наличии',
      statusKey: 'in_stock',
      specs: 'Крутящий момент 650 Н·м, масса 21 кг',
    },
    {
      sku: 'RT-KIP-045',
      title: 'Дефектоскоп ультразвуковой рельсовый РДМ-22',
      subsystem: 'КИП и диагностика',
      gost: 'ГОСТ Р 50.05.02',
      tnved: '9031 80 340 0',
      warehouse: 'Под заказ (Склад РУз)',
      status: 'Под заказ',
      statusKey: 'on_order',
      specs: 'Сплошной контроль обоих рельсов, -40..+50 °C',
    },
    {
      sku: 'RT-ELC-502',
      title: 'Разъединитель контактной сети РКЖ-3.3 кВ',
      subsystem: 'Энергетика',
      gost: 'ГОСТ 689-90',
      tnved: '8535 30 100 0',
      warehouse: 'Ташкент, Index B2-2097',
      status: 'В наличии',
      statusKey: 'in_stock',
      specs: 'Номинальный ток 3000 А, моторный привод УМП',
    },
  ],
  uz: [
    {
      sku: 'RT-SCB-001',
      title: 'SP-6M strelka elektr uzatmasi (yuritmasi)',
      subsystem: 'ISB va avtomatika',
      gost: 'GOST 12.2.007.0-75',
      tnved: '8530 10 000 0',
      warehouse: 'Toshkent, Index B2-2097',
      status: 'Mavjud',
      statusKey: 'in_stock',
      specs: '160V, 6000N, shiber yurishi 154 mm',
    },
    {
      sku: 'RT-SCB-014',
      title: 'POBS-2A yo‘l transformatori',
      subsystem: 'ISB va avtomatika',
      gost: 'TU 32 CSh 390-84',
      tnved: '8504 31 800 7',
      warehouse: 'Toshkent, Index B2-2097',
      status: 'Mavjud',
      statusKey: 'in_stock',
      specs: 'Quvvati 300 VA, chastota 50 Hz, og‘irligi 16 kg',
    },
    {
      sku: 'RT-RS-102',
      title: 'RU1SH-957-G g‘ildirak juftligi buksalar bilan',
      subsystem: 'Harakatdagi tarkib',
      gost: 'GOST 4835-2013',
      tnved: '8607 19 100 0',
      warehouse: 'Toshkent, Index B2-2097',
      status: 'Mavjud',
      statusKey: 'in_stock',
      specs: 'G‘ildirak diametri 957 mm, yuklama 23.5 ts',
    },
    {
      sku: 'RT-RS-118',
      title: '18-100 rusumli yuk vagonining ikki o‘qli aravachasi',
      subsystem: 'Harakatdagi tarkib',
      gost: 'GOST 9246-2013',
      tnved: '8607 12 000 0',
      warehouse: 'Toshkent / Konsolidatsiya',
      status: 'Zaxirada',
      statusKey: 'reserved',
      specs: 'Baza 1850 mm, hisoblangan yuk 23.5 ts, og‘irligi 4.85 t',
    },
    {
      sku: 'RT-RS-208',
      title: 'SA-3 avtobirikmasi (korpus + mexanizm)',
      subsystem: 'Harakatdagi tarkib',
      gost: 'GOST 21447-75',
      tnved: '8607 30 000 0',
      warehouse: 'Toshkent, Index B2-2097',
      status: 'Mavjud',
      statusKey: 'in_stock',
      specs: 'Po‘lat 20GFL, zarb-tortuvchi kontur',
    },
    {
      sku: 'RT-RS-305',
      title: '25610-N kompozitsion tormoz kolodkasi',
      subsystem: 'Harakatdagi tarkib',
      gost: 'GOST 30249-97',
      tnved: '8607 29 000 0',
      warehouse: 'Toshkent, Index B2-2097',
      status: 'Mavjud',
      statusKey: 'in_stock',
      specs: 'To‘r karkasli, partiya hajmi 500 donadan',
    },
    {
      sku: 'RT-TRK-401',
      title: 'JBR-65 rels birikmasining egiluvchan klemmalari',
      subsystem: 'Yo‘l xo‘jaligi',
      gost: 'TU 1293-061-01124323',
      tnved: '7302 40 000 0',
      warehouse: 'Toshkent, Index B2-2097',
      status: 'Mavjud',
      statusKey: 'in_stock',
      specs: 'Prujinali po‘lat 60S2A, siqish kuchi 10 kN',
    },
    {
      sku: 'RT-TRK-419',
      title: 'SHPB-2 benzinli yo‘l gayka buragichi',
      subsystem: 'Yo‘l xo‘jaligi',
      gost: 'GOST R 54772-2011',
      tnved: '8467 89 000 0',
      warehouse: 'Toshkent, Index B2-2097',
      status: 'Mavjud',
      statusKey: 'in_stock',
      specs: 'Aylanish momenti 650 N·m, massasi 21 kg',
    },
    {
      sku: 'RT-KIP-045',
      title: 'RDM-22 ultratovushli rels defektoskopi',
      subsystem: 'NO‘A va diagnostika',
      gost: 'GOST R 50.05.02',
      tnved: '9031 80 340 0',
      warehouse: 'Buyurtma asosida (O‘zR ombori)',
      status: 'Buyurtma asosida',
      statusKey: 'on_order',
      specs: 'Ikkala relsni uzluksiz nazorat qilish, -40..+50 °C',
    },
    {
      sku: 'RT-ELC-502',
      title: 'RKJ-3.3 kV kontakt tarmog‘i ajratgichi',
      subsystem: 'Energetika',
      gost: 'GOST 689-90',
      tnved: '8535 30 100 0',
      warehouse: 'Toshkent, Index B2-2097',
      status: 'Mavjud',
      statusKey: 'in_stock',
      specs: 'Nominal tok 3000 A, motorli yuritma UMP',
    },
  ],
  en: [
    {
      sku: 'RT-SCB-001',
      title: 'Switch Point Machine SP-6M',
      subsystem: 'Signalling & Automation',
      gost: 'GOST 12.2.007.0-75',
      tnved: '8530 10 000 0',
      warehouse: 'Tashkent, Index B2-2097',
      status: 'In Stock',
      statusKey: 'in_stock',
      specs: '160V, 6000N, stroke travel 154 mm',
    },
    {
      sku: 'RT-SCB-014',
      title: 'Track Signal Transformer POBS-2A',
      subsystem: 'Signalling & Automation',
      gost: 'TU 32 CSH 390-84',
      tnved: '8504 31 800 7',
      warehouse: 'Tashkent, Index B2-2097',
      status: 'In Stock',
      statusKey: 'in_stock',
      specs: 'Rated 300 VA, frequency 50 Hz, mass 16 kg',
    },
    {
      sku: 'RT-RS-102',
      title: 'Wheelset RU1SH-957-G Complete with Axleboxes',
      subsystem: 'Rolling Stock',
      gost: 'GOST 4835-2013',
      tnved: '8607 19 100 0',
      warehouse: 'Tashkent, Index B2-2097',
      status: 'In Stock',
      statusKey: 'in_stock',
      specs: 'Wheel diameter 957 mm, axle load 23.5 tf',
    },
    {
      sku: 'RT-RS-118',
      title: 'Freight Wagon Two-Axle Bogie 18-100',
      subsystem: 'Rolling Stock',
      gost: 'GOST 9246-2013',
      tnved: '8607 12 000 0',
      warehouse: 'Tashkent / Consolidation',
      status: 'Reserved',
      statusKey: 'reserved',
      specs: 'Wheelbase 1850 mm, axle load 23.5 tf, tare 4.85 t',
    },
    {
      sku: 'RT-RS-208',
      title: 'Automatic Coupler SA-3 (Housing + Lock Mechanism)',
      subsystem: 'Rolling Stock',
      gost: 'GOST 21447-75',
      tnved: '8607 30 000 0',
      warehouse: 'Tashkent, Index B2-2097',
      status: 'In Stock',
      statusKey: 'in_stock',
      specs: 'Steel 20GFL, heavy draft contour',
    },
    {
      sku: 'RT-RS-305',
      title: 'Composite Railway Brake Shoe 25610-N',
      subsystem: 'Rolling Stock',
      gost: 'GOST 30249-97',
      tnved: '8607 29 000 0',
      warehouse: 'Tashkent, Index B2-2097',
      status: 'In Stock',
      statusKey: 'in_stock',
      specs: 'Wire mesh frame reinforcement, batch from 500 pcs',
    },
    {
      sku: 'RT-TRK-401',
      title: 'Elastic Rail Fastening Clip ZhBR-65',
      subsystem: 'Track Infrastructure',
      gost: 'TU 1293-061-01124323',
      tnved: '7302 40 000 0',
      warehouse: 'Tashkent, Index B2-2097',
      status: 'In Stock',
      statusKey: 'in_stock',
      specs: 'Spring steel 60S2A, clamping force 10 kN',
    },
    {
      sku: 'RT-TRK-419',
      title: 'Petrol Engine Track Wrench SHPB-2',
      subsystem: 'Track Infrastructure',
      gost: 'GOST R 54772-2011',
      tnved: '8467 89 000 0',
      warehouse: 'Tashkent, Index B2-2097',
      status: 'In Stock',
      statusKey: 'in_stock',
      specs: 'Max torque 650 N·m, dry weight 21 kg',
    },
    {
      sku: 'RT-KIP-045',
      title: 'Ultrasonic Rail Flaw Detector RDM-22',
      subsystem: 'Testing & Diagnostics',
      gost: 'GOST R 50.05.02',
      tnved: '9031 80 340 0',
      warehouse: 'On Order (Uzbekistan Hub)',
      status: 'On Order',
      statusKey: 'on_order',
      specs: 'Dual-rail continuous scanning, -40..+50 °C',
    },
    {
      sku: 'RT-ELC-502',
      title: 'Overhead Catenary Disconnector RKZh-3.3 kV',
      subsystem: 'Power & Electrification',
      gost: 'GOST 689-90',
      tnved: '8535 30 100 0',
      warehouse: 'Tashkent, Index B2-2097',
      status: 'In Stock',
      statusKey: 'in_stock',
      specs: 'Rated current 3000 A, motorized drive UMP',
    },
  ],
};

export const CONTRACT_STEPS: Record<Locale, ProjectCard[]> = {
  ru: [
    {
      code: 'STEP 01',
      tag: 'SOURCING & AUDIT',
      title: 'Проектный сорсинг и верификация завода',
      subtitle: 'Прямой выход на 86+ производителей Китая, ЕС и СНГ',
      metrics: ['0% посредников', 'Инженерный аудит ТЗ', 'Подбор аналогов за 48ч'],
      description: 'Заводы, девелоперы и госзаказчики передают нам спецификацию или опросный лист. Мы проводим технический аудит, связываемся напрямую с заводами-изготовителями и согласуем заводские квоты.',
    },
    {
      code: 'STEP 02',
      tag: 'LANDED COST DDP',
      title: 'Фиксация конечной цены в Узбекистане (НДС 12%)',
      subtitle: 'Прозрачное ценообразование в сумах (UZS) или валюте',
      metrics: ['Таможня + Пошлины', 'НДС 12% включен', 'Страхование груза 100%'],
      description: 'Рассчитываем точный Landed Cost до склада клиента в Ташкенте или регионе РУз. Вы получаете твердую цену по прямому договору с резидентом РУз ООО «RailTech» без валютных и таможенных рисков.',
    },
    {
      code: 'STEP 03',
      tag: 'LOGISTICS & CUSTOMS',
      title: 'Международная логистика и таможенная очистка',
      subtitle: 'Ж/Д контейнеры, автотралы и мультимодальные коридоры',
      metrics: ['Коды ТН ВЭД', 'Сертификаты Узстандарт', 'Выпуск ГТД за 1-2 дня'],
      description: 'Формируем полный пакет разрешительной документации, оформляем сертификаты соответствия требованиям Республики Узбекистан и производим таможенную очистку груза.',
    },
    {
      code: 'STEP 04',
      tag: 'HANDOVER & WARRANTY',
      title: 'Сдача оборудования на объекте и гарантия',
      subtitle: 'Инженерное сопровождение и шеф-монтаж',
      metrics: ['Официальная гарантия', 'ЭДО / Счет-фактура', 'Сервисная поддержка'],
      description: 'Доставляем оборудование на ваш завод или строительную площадку, подписываем акты приема-передачи через систему электронного документооборота и обеспечиваем гарантийное обслуживание.',
    },
  ],
  uz: [
    {
      code: 'STEP 01',
      tag: 'SOURCING & AUDIT',
      title: 'Loyiha sorsingi va zavodlarni tekshirish',
      subtitle: 'Xitoy, Yevropa Ittifoqi va MDHdagi 86+ ishlab chiqaruvchilar bilan to‘g‘ridan-to‘g‘ri aloqa',
      metrics: ['0% vositachilar', 'Texnik topshiriq auditi', '48 soatda muqobillar'],
      description: 'Zavodlar, korxonalar va buyurtmachilar bizga texnik spetsifikatsiyani taqdim etadi. Biz muhandislik ekspertizasini o‘tkazamiz, ishlab chiqaruvchi zavodlar bilan to‘g‘ridan-to‘g‘ri kvotalarni kelishamiz.',
    },
    {
      code: 'STEP 02',
      tag: 'LANDED COST DDP',
      title: 'O‘zbekistondagi yakuniy narxni belgilash (12% QQS)',
      subtitle: 'So‘mda (UZS) yoki xorijiy valyutada shaffof narx belgilash',
      metrics: ['Bojxona + Bojlar', '12% QQS kiritilgan', '100% yuk sug‘urtasi'],
      description: 'Toshkent yoki viloyatlardagi buyurtmachi omborigacha aniq Landed Cost hisoblanadi. O‘zbekiston rezidenti ООО «RailTech» bilan to‘g‘ridan-to‘g‘ri shartnoma orqali valyuta va bojxona xatarlarisiz qat’iy narxga ega bo‘lasiz.',
    },
    {
      code: 'STEP 03',
      tag: 'LOGISTICS & CUSTOMS',
      title: 'Xalqaro logistika va bojxona rasmiylashtiruvi',
      subtitle: 'Temir yo‘l konteynerlari, avtotrallar va multimodal transport yo‘laklari',
      metrics: ['TIF TN kodlari', 'O‘zstandart sertifikati', '1-2 kunda BYD chiqarish'],
      description: 'Ruxsat beruvchi hujjatlarning to‘liq paketini shakllantiramiz, O‘zbekiston talablariga mos muvofiqlik sertifikatlarini rasmiylashtiramiz va to‘liq bojxona tozalashini bajaramiz.',
    },
    {
      code: 'STEP 04',
      tag: 'HANDOVER & WARRANTY',
      title: 'Uskunalarni ob’ektda topshirish va kafolat',
      subtitle: 'Muhandislik nazorati va shef-montaj ko‘magi',
      metrics: ['Rasmiy kafolat', 'E-Hujjat / Hisob-faktura', 'Servis xizmati'],
      description: 'Uskunalarni zavodingizga yoki qurilish maydonchasiga yetkazib beramiz, elektron hujjat aylanishi (EDO) orqali dalolatnomalarni imzolaymiz va kafolatli servisni ta’minlaymiz.',
    },
  ],
  en: [
    {
      code: 'STEP 01',
      tag: 'SOURCING & AUDIT',
      title: 'Turnkey Project Sourcing & Factory Audit',
      subtitle: 'Direct engagement with 86+ qualified manufacturers across China, EU, and CIS',
      metrics: ['0% middlemen', 'Engineering spec audit', 'Analogues matched in 48h'],
      description: 'Industrial plants, developers, and public contractors supply technical requirements. We verify manufacturer capabilities, audit quality standards, and negotiate direct factory allocation.',
    },
    {
      code: 'STEP 02',
      tag: 'LANDED COST DDP',
      title: 'Fixed Landed Cost DDP Tashkent (12% VAT Included)',
      subtitle: 'Transparent all-inclusive pricing in UZS or contract currency',
      metrics: ['Customs & duties paid', '12% VAT included', '100% cargo insurance'],
      description: 'We compute precise Landed Cost directly to your job site in Tashkent or regions across Uzbekistan. Work with resident legal entity OOO «RailTech» without FX or tariff liabilities.',
    },
    {
      code: 'STEP 03',
      tag: 'LOGISTICS & CUSTOMS',
      title: 'Multimodal Freight Logistics & Customs Clearance',
      subtitle: 'Rail containers, heavy-haul trailers, and bonded transit corridors',
      metrics: ['HS code classification', 'Uzstandard certificate', 'Declaration in 1-2 days'],
      description: 'We prepare complete regulatory dossiers, obtain national certifications of conformity for the Republic of Uzbekistan, and process full customs clearance.',
    },
    {
      code: 'STEP 04',
      tag: 'HANDOVER & WARRANTY',
      title: 'Site Delivery, Acceptance & Full Warranty',
      subtitle: 'Field engineering supervision and commissioning support',
      metrics: ['Official factory warranty', 'Electronic invoicing', 'Local technical service'],
      description: 'We deliver equipment to your facility or construction perimeter, finalize acceptance protocols via digital document exchange, and guarantee ongoing support.',
    },
  ],
};

export const DIGITAL_PRODUCTS: Record<Locale, ProjectCard[]> = {
  ru: [
    {
      code: 'PROD 01',
      tag: 'PRODUCTION SAAS // B2B',
      title: 'Цифровая экосистема B2B.RailTech.uz',
      subtitle: 'Собственная промышленная B2B-платформа управления закупками',
      metrics: ['1 200+ SKU в базе', 'KYC верификация', '1-Click PDF КП'],
      description: 'Разработанная нашей командой закрытая система полного цикла: онлайн-каталог с фильтрацией по ГОСТ и ТН ВЭД, автокалькулятор Landed Cost с НДС 12%, личный кабинет партнера и встроенная CRM сделок.',
      link: 'https://b2b.railtech.uz',
    },
    {
      code: 'PROD 02',
      tag: 'AI ENGINE // NLP',
      title: 'Smart Import & AI Nomenclature Matcher',
      subtitle: 'Алгоритм автоматического распознавания спецификаций из Excel',
      metrics: ['Точность Smart Match 94.2%', 'Парсинг за 3 секунды', 'Анализ ГОСТ / ТУ'],
      description: 'Клиент загружает неструктурированный Excel-файл со списком деталей. ИИ-модуль автоматически очищает данные, находит соответствия в номенклатуре склада и формирует готовое коммерческое предложение.',
    },
    {
      code: 'SERV 03',
      tag: 'CUSTOM DEV // ENTERPRISE',
      title: 'Контрактная разработка ПО и цифровизация',
      subtitle: 'Создаем корпоративные системы для реального сектора и торговли',
      metrics: ['ERP / WMS / CRM', 'B2B Кабинеты дилеров', 'AI & Telegram Боты'],
      description: 'Проектируем и разрабатываем высоконагруженные веб-платформы, системы складского и логистического учета, кастомные калькуляторы ВЭД и внутренние корпоративные порталы на стеке TypeScript, React, Python, Node.js.',
    },
    {
      code: 'SERV 04',
      tag: 'IT CONSULTING // AUDIT',
      title: 'Технический и архитектурный IT-консалтинг',
      subtitle: 'Трансформация бизнес-процессов снабжения и дистрибьюции',
      metrics: ['Аудит IT-инфраструктуры', 'Оцифровка складов', 'Интеграция 1С / API'],
      description: 'Помогаем производственным и торговым компаниям Узбекистана уйти от ручных таблиц к автоматизированным пайплайнам продаж, закупок и финансового контроля.',
    },
  ],
  uz: [
    {
      code: 'PROD 01',
      tag: 'PRODUCTION SAAS // B2B',
      title: 'B2B.RailTech.uz raqamli ekotizimi',
      subtitle: 'Xaridlarni boshqarish bo‘yicha xususiy sanoat B2B platformasi',
      metrics: ['1 200+ SKU bazada', 'KYC verifikatsiya', '1-Click PDF Tijorat taklifi'],
      description: 'Jamoamiz tomonidan yaratilgan to‘liq siklli yopiq tizim: GOST va TIF TN bo‘yicha filtratsiyali onlayn katalog, 12% QQS bilan Landed Cost avto-kalkulyatori, hamkor shaxsiy kabineti va CRM.',
      link: 'https://b2b.railtech.uz',
    },
    {
      code: 'PROD 02',
      tag: 'AI ENGINE // NLP',
      title: 'Smart Import & AI Nomenclature Matcher',
      subtitle: 'Excel fayllaridan spetsifikatsiyalarni avtomatik aniqlovchi AI algoritmi',
      metrics: ['Smart Match aniqligi 94.2%', '3 soniyada tahlil', 'GOST / TU tahlili'],
      description: 'Mijoz detallar ro‘yxati ko‘rsatilgan nostandart Excel faylini yuklaydi. AI moduli ma’lumotlarni saralaydi, ombor nomenklaturasi bilan moslashtiradi va tayyor tijorat taklifini shakllantiradi.',
    },
    {
      code: 'SERV 03',
      tag: 'CUSTOM DEV // ENTERPRISE',
      title: 'Buyurtma asosida dasturlash va raqamlashtirish',
      subtitle: 'Ishlab chiqarish va savdo sohasi uchun korporativ tizimlar yaratish',
      metrics: ['ERP / WMS / CRM', 'Dilerlar B2B kabineti', 'AI & Telegram Botlar'],
      description: 'Yuqori yuklamali veb-platformalar, ombor va logistika hisobi tizimlari, tashqi iqtisodiy faoliyat kalkulyatorlari hamda korporativ portallarni TypeScript, React, Python va Node.js stekida ishlab chiqamiz.',
    },
    {
      code: 'SERV 04',
      tag: 'IT CONSULTING // AUDIT',
      title: 'Texnik va me’moriy IT-konsalting',
      subtitle: 'Ta’minot va distribyutsiya biznes jarayonlarini transformatsiya qilish',
      metrics: ['IT infratuzilma auditi', 'Omborlarni raqamlashtirish', '1C / API integratsiyasi'],
      description: 'O‘zbekiston ishlab chiqarish va savdo korxonalariga qo‘lda to‘ldiriladigan jadvallardan xaridlar, sotuvlar va moliyaviy nazoratning avtomatlashtirilgan tizimiga o‘tishda ko‘maklashamiz.',
    },
  ],
  en: [
    {
      code: 'PROD 01',
      tag: 'PRODUCTION SAAS // B2B',
      title: 'Digital Ecosystem B2B.RailTech.uz',
      subtitle: 'Proprietary industrial B2B procurement and supply chain management platform',
      metrics: ['1 200+ SKU database', 'KYC verification', '1-Click PDF Quotations'],
      description: 'Full-cycle closed enterprise portal created by our in-house engineering team: catalog search by GOST/HS codes, live Landed Cost computation with 12% VAT, partner accounts, and automated deal pipeline.',
      link: 'https://b2b.railtech.uz',
    },
    {
      code: 'PROD 02',
      tag: 'AI ENGINE // NLP',
      title: 'Smart Import & AI Nomenclature Matcher',
      subtitle: 'Machine learning parser matching messy Excel spec sheets to warehouse catalog',
      metrics: ['94.2% Match Accuracy', '3s Parsing Latency', 'GOST/Specs parsing'],
      description: 'Clients upload unstructured spreadsheets. Our semantic AI engine cleans messy line items, resolves technical aliases against live inventory, and outputs an instant formal commercial quotation.',
    },
    {
      code: 'SERV 03',
      tag: 'CUSTOM DEV // ENTERPRISE',
      title: 'Custom Enterprise Software & Automation',
      subtitle: 'Engineering robust corporate software for manufacturing, logistics, and trade',
      metrics: ['ERP / WMS / CRM', 'B2B Dealer Hubs', 'AI & Telegram Bots'],
      description: 'We architect and build high-throughput web applications, inventory management systems, customs duty engines, and corporate portals using modern TypeScript, React, Python, and Node.js.',
    },
    {
      code: 'SERV 04',
      tag: 'IT CONSULTING // AUDIT',
      title: 'Technical & Architecture IT Consulting',
      subtitle: 'Supply chain transformation and business process modernization',
      metrics: ['Infra Security Audit', 'Warehouse Digitization', '1C & REST API Integrations'],
      description: 'We guide industrial companies across Uzbekistan away from manual spreadsheet friction toward automated, audited pipelines for procurement, fulfillment, and financial control.',
    },
  ],
};

export const PROJECTS_PORTFOLIO: Record<Locale, ProjectCard[]> = {
  ru: [
    {
      code: 'LAB 01',
      tag: 'TECH TRANSFER // R&D',
      title: 'Локализация производства и дилерство вендоров',
      subtitle: 'Представительство интересов международных заводов в Узбекистане',
      metrics: ['86+ брендов-партнеров', 'Адаптация к нормам РУз', 'Опытные испытания'],
      description: 'Выступаем официальным локальным партнером для зарубежных производителей оборудования: организуем сертификацию, пилотные испытания на инфраструктурных объектах и крупноузловую сборку в РУз.',
    },
    {
      code: 'LAB 02',
      tag: 'ART & CULTURE // CURATION',
      title: 'Арт-проекты, выставки и современная живопись',
      subtitle: 'Культурные инициативы и эстетические спецпроекты команды RailTech',
      metrics: ['Арт-продюсирование', 'Коллекционная живопись', 'Кураторские проекты'],
      description: 'Мы убеждены, что высокая инженерия и искусство строятся на одних законах гармонии и формы. Наша команда инвестирует ресурсы и компетенции в организацию художественных проектов, работу с картинами и поддержку искусства.',
    },
    {
      code: 'LAB 03',
      tag: 'INDUSTRIAL DESIGN // SPACE',
      title: 'Индустриальная эстетика и оформление пространств',
      subtitle: 'Синтез инженерной мысли, архитектуры и визуального искусства',
      metrics: ['Концептуальный дизайн', 'Арт-консалтинг для офисов', 'Инсталляции'],
      description: 'Разрабатываем концепции визуального оформления современных технопарков, штаб-квартир и общественных пространств на стыке брутализма, параметрической геометрии и живописи.',
    },
  ],
  uz: [
    {
      code: 'LAB 01',
      tag: 'TECH TRANSFER // R&D',
      title: 'Ishlab chiqarishni mahalliylashtirish va vodorlar dilerligi',
      subtitle: 'Xalqaro zavodlarning O‘zbekistondagi rasmiy manfaatlarini ifodalash',
      metrics: ['86+ hamkor brendlar', 'O‘zR me’yorlariga moslash', 'Sinov tajribalari'],
      description: 'Xorijiy uskunalar ishlab chiqaruvchilari uchun rasmiy mahalliy hamkor sifatida harakat qilamiz: sertifikatlashtirish, infratuzilma ob’ektlarida sinovlar va yirik uzelli yig‘ishni tashkil qilamiz.',
    },
    {
      code: 'LAB 02',
      tag: 'ART & CULTURE // CURATION',
      title: 'Art-loyihalar, ko‘rgazmalar va zamonaviy rassomlik',
      subtitle: 'RailTech jamoasining madaniy tashabbuslari va estetik maxsus loyihalari',
      metrics: ['Art-prodyuserlik', 'Kolleksiya rangtasviri', 'Kuratorlik loyihalari'],
      description: 'Biz oliy muhandislik va san’at mutanosiblik hamda shaklning yagona qonunlariga tayanishiga ishonamiz. Jamoamiz badiiy ko‘rgazmalarni tashkil etish, kartinalar bilan ishlash va san’atni qo‘llab-quvvatlashga o‘z resurslarini ajratadi.',
    },
    {
      code: 'LAB 03',
      tag: 'INDUSTRIAL DESIGN // SPACE',
      title: 'Sanoat estetikasi va makonlarni loyihalash',
      subtitle: 'Muhandislik tafakkuri, arxitektura va tasviriy san’at sintezi',
      metrics: ['Konseptual dizayn', 'Ofislar uchun art-konsalting', 'Installyatsiyalar'],
      description: 'Zamonaviy texnoparklar, bosh ofislar va jamoat maydonlari uchun brutalizm, parametrik geometriya va tasviriy san’at tutashuvidagi vizual konsepsiyalarni ishlab chiqamiz.',
    },
  ],
  en: [
    {
      code: 'LAB 01',
      tag: 'TECH TRANSFER // R&D',
      title: 'Industrial Localization & Factory Distributorship',
      subtitle: 'Authorized market representation for international heavy engineering vendors',
      metrics: ['86+ Partner Brands', 'Uzbekistan Regulatory Fit', 'Field Pilot Trials'],
      description: 'We act as the official in-country operating partner for foreign manufacturers: navigating certification, hosting pilot trials on railway lines, and setting up CKD/SKD assembly in Uzbekistan.',
    },
    {
      code: 'LAB 02',
      tag: 'ART & CULTURE // CURATION',
      title: 'Art Initiatives, Exhibitions & Fine Painting',
      subtitle: 'Cultural production and aesthetic special projects curated by RailTech',
      metrics: ['Art Production', 'Curated Fine Art', 'Cultural Sponsorship'],
      description: 'We believe rigorous engineering and fine art share identical principles of balance, structure, and material honesty. Our team directs resources toward curating exhibitions, collector paintings, and patronizing artistic expression.',
    },
    {
      code: 'LAB 03',
      tag: 'INDUSTRIAL DESIGN // SPACE',
      title: 'Industrial Aesthetics & Spatial Architecture',
      subtitle: 'Synthesis of engineering clarity, brutalist architecture, and spatial form',
      metrics: ['Conceptual Design', 'Corporate Art Advisory', 'Bespoke Installations'],
      description: 'We conceive architectural and interior aesthetics for technology parks, corporate headquarters, and civic spaces bridging industrial brutalism, geometric wireframes, and classical painting.',
    },
  ],
};

export const MODES_DATA: Record<Locale, Record<AppMode, ModeConfig>> = {
  ru: {
    SUPPLY: {
      id: 'SUPPLY',
      label: '.SUPPLY',
      shortTitle: 'Складская программа (Ташкент)',
      topBarStatus: 'B2B/B2G Склад и поставки ЖД оборудования',
      modelType: 'mechanism',
      modelName: 'ASSEMBLY // CAD MODEL 18-100',
      modelScale: 'SCALE 1:12 // GOST 9246-2013',
      tools: [
        { code: '00', name: 'Все категории склада', filterKey: 'ALL', description: 'Полная складская матрица в Ташкенте' },
        { code: '01', name: 'Подвижной состав', filterKey: 'Подвижной состав', description: 'Колесные пары, тележки, автосцепки, колодки' },
        { code: '02', name: 'СЦБ и автоматика', filterKey: 'СЦБ и автоматика', description: 'Приводы СП-6М, трансформаторы ПОБС, реле' },
        { code: '03', name: 'Путевое хозяйство', filterKey: 'Путевое хозяйство', description: 'Скрепления ЖБР, путевой инструмент' },
        { code: '04', name: 'КИП и диагностика', filterKey: 'КИП и диагностика', description: 'Ультразвуковые дефектоскопы, измерители' },
        { code: '05', name: 'Энергетика', filterKey: 'Энергетика', description: 'Разъединители, контактная сеть, подстанции' },
      ],
      hud: {
        section1Label: 'Inventory Hub',
        section1Title: 'Склад: Ташкент Index B2-2097',
        section1Meta: '1 240+ SKU · Отгрузка за 24 часа',
        section2Label: 'Clearance & Tax',
        section2Title: 'Таможня и НДС 12% РУз',
        section2Check1: 'Официальный плательщик НДС 12%',
        section2Check2: 'Сертификат соответствия Узстандарт',
        section3Label: 'Dispatch',
        section3Title: 'Логистика DDP / EXW Ташкент',
        section3Sub: 'Прямые договоры B2B и государственные закупки B2G',
      },
      contentHeader: {
        indexCode: 'SECTION 01 // WAREHOUSE INVENTORY',
        title: 'СКЛАДСКАЯ ПРОГРАММА И ЖЕЛЕЗНОДОРОЖНОЕ ОБОРУДОВАНИЕ',
        subtitle: 'Позиции в наличии на распределительном складе в Ташкенте (комплекс Index, B2-2097) и под регулярный контрактный график.',
      },
    },
    CONTRACT: {
      id: 'CONTRACT',
      label: '.CONTRACT',
      shortTitle: 'Контрактные поставки ВЭД',
      topBarStatus: 'Проектный сорсинг и ВЭД под ключ',
      modelType: 'container',
      modelName: 'CONTAINER // 40FT INTERMODAL UNIT',
      modelScale: 'ISO 668 // DDP TASHKENT CORRIDOR',
      tools: [
        { code: '01', name: 'Проектный сорсинг', filterKey: 'SOURCING', description: 'Поиск оборудования у 86+ мировых заводов' },
        { code: '02', name: 'Расчет Landed Cost', filterKey: 'CALC', description: 'Инвойс + Логистика + Пошлина + НДС 12%' },
        { code: '03', name: 'Таможенная очистка', filterKey: 'CUSTOMS', description: 'ТН ВЭД, сертификация и выпуск ГТД' },
        { code: '04', name: 'Для заводов и девелоперов', filterKey: 'DEV', description: 'Комплектация строящихся объектов под ключ' },
      ],
      hud: {
        section1Label: 'Sourcing Network',
        section1Title: '86+ проверенных заводов',
        section1Meta: 'Китай · Евросоюз · СНГ · Турция',
        section2Label: 'Contract Formula',
        section2Title: 'DDP Узбекистан под ключ',
        section2Check1: 'Фиксация цены в UZS с НДС 12%',
        section2Check2: 'Полное закрытие валютного и таможенного контура',
        section3Label: 'Smart Import',
        section3Title: 'Авторасчет по спецификации Excel',
        section3Sub: 'Загрузите ведомость оборудования для расчета КП',
      },
      contentHeader: {
        indexCode: 'SECTION 02 // TURNKEY CONTRACT SUPPLY',
        title: 'КОНТРАКТНЫЕ ПОСТАВКИ ПОД ЗАКАЗ ДЛЯ ЗАВОДОВ И ДЕВЕЛОПЕРОВ',
        subtitle: 'Находим, проверяем, привозим и растамаживаем сложное промышленное и строительное оборудование под ваш проект.',
      },
    },
    DIGITAL: {
      id: 'DIGITAL',
      label: '.DIGITAL',
      shortTitle: 'IT-решения и Разработка ПО',
      topBarStatus: 'Корпоративное ПО, B2B платформы и ИИ-инжиниринг',
      modelType: 'network',
      modelName: 'TOPOLOGY // NEURAL B2B CORE V2.4',
      modelScale: 'NODES: 64 // SMART MATCH 94.2%',
      tools: [
        { code: '01', name: 'Платформа B2B.RailTech', filterKey: 'B2B', description: 'Собственная система управления сделками и КП' },
        { code: '02', name: 'Smart Match AI Engine', filterKey: 'AI', description: 'ИИ-распознавание номенклатуры из Excel' },
        { code: '03', name: 'Заказная разработка ПО', filterKey: 'DEV', description: 'ERP, WMS, B2B-порталы, веб-сервисы' },
        { code: '04', name: 'IT-консалтинг и аудит', filterKey: 'CONSULT', description: 'Автоматизация торговли и логистики' },
      ],
      hud: {
        section1Label: 'Flagship Product',
        section1Title: 'b2b.railtech.uz [ONLINE]',
        section1Meta: 'Uptime 99.95% · 230+ активных компаний',
        section2Label: 'Engineering Stack',
        section2Title: 'Команда полного цикла разработки',
        section2Check1: 'TypeScript / React / Next.js / Astro',
        section2Check2: 'Python / Node.js / PostgreSQL / AI LLM',
        section3Label: 'Custom Software',
        section3Title: 'Контрактная IT-разработка и консалтинг',
        section3Sub: 'Оцифруем ваши закупки, склад и дилерскую сеть',
      },
      contentHeader: {
        indexCode: 'SECTION 03 // RAILTECH DIGITAL & AI',
        title: 'СОБСТВЕННЫЕ IT-ПРОДУКТЫ И КОНТРАКТНАЯ РАЗРАБОТКА ПО',
        subtitle: 'Практическая экспертиза автоматизации реального сектора: от нашей флагманской B2B-платформы до разработки корпоративного софта под ключ.',
      },
    },
    PROJECTS: {
      id: 'PROJECTS',
      label: '.PROJECTS',
      shortTitle: 'Инжиниринг и Арт-лаборатория',
      topBarStatus: 'Трансфер технологий, R&D и культурные инициативы',
      modelType: 'hypercube',
      modelName: 'GEOMETRY // ISOMETRIC HYPERCUBE 013',
      modelScale: 'AXIS X-Y-Z // INDUSTRIAL + ART LAB',
      tools: [
        { code: '01', name: 'Дилерство и локализация', filterKey: 'LOCAL', description: 'Представительство мировых заводов в РУз' },
        { code: '02', name: 'Арт-проекты и Живопись', filterKey: 'ART', description: 'Выставки, картины, культурное меценатство' },
        { code: '03', name: 'Индустриальный дизайн', filterKey: 'DESIGN', description: 'Эстетика пространств и арт-объекты' },
      ],
      hud: {
        section1Label: 'Multidisciplinary Identity',
        section1Title: 'Синергия инженерии и искусства',
        section1Meta: 'Технологические и культурные проекты в РУз',
        section2Label: 'Directions',
        section2Title: 'От заводов до галерей',
        section2Check1: 'Трансфер технологий и локализация сборки',
        section2Check2: 'Продюсирование арт-проектов и живописи',
        section3Label: 'Partnership',
        section3Title: 'Открыты к коллаборациям',
        section3Sub: 'Совместные проекты с вендорами, кураторами и бизнесом',
      },
      contentHeader: {
        indexCode: 'SECTION 04 // SPECIAL PROJECTS & ART LAB',
        title: 'СПЕЦПРОЕКТЫ, ЛОКАЛИЗАЦИЯ И КУЛЬТУРНЫЕ ИНИЦИАТИВЫ',
        subtitle: 'Уникальный профиль ООО «RailTech»: мы объединяем тяжелый инжиниринг с высоким искусством и продюсированием культурных проектов.',
      },
    },
  },
  uz: {
    SUPPLY: {
      id: 'SUPPLY',
      label: '.SUPPLY',
      shortTitle: 'Ombor dasturi (Toshkent)',
      topBarStatus: 'B2B/B2G Ombor va temir yo‘l ta’minoti',
      modelType: 'mechanism',
      modelName: 'ASSEMBLY // CAD MODEL 18-100',
      modelScale: 'SCALE 1:12 // GOST 9246-2013',
      tools: [
        { code: '00', name: 'Barcha ombor toifalari', filterKey: 'ALL', description: 'Toshkentdagi to‘liq ombor matritsasi' },
        { code: '01', name: 'Harakatdagi tarkib', filterKey: 'Подвижной состав', description: 'G‘ildirak juftliklari, aravachalar, avtoulagichlar' },
        { code: '02', name: 'ISB va avtomatika', filterKey: 'СЦБ и автоматика', description: 'SP-6M yuritmalar, POBS transformatorlar, relelar' },
        { code: '03', name: 'Yo‘l xo‘jaligi', filterKey: 'Путевое хозяйство', description: 'JBR rels birikmalari, yo‘l asboblari' },
        { code: '04', name: 'NO‘A va diagnostika', filterKey: 'КИП и диагностика', description: 'Ultratovushli defektoskoplar, o‘lchagichlar' },
        { code: '05', name: 'Energetika', filterKey: 'Энергетика', description: 'Ajratgichlar, kontakt tarmog‘i, nimstansiyalar' },
      ],
      hud: {
        section1Label: 'Inventory Hub',
        section1Title: 'Ombor: Toshkent Index B2-2097',
        section1Meta: '1 240+ SKU · 24 soat ichida yuklash',
        section2Label: 'Clearance & Tax',
        section2Title: 'Bojxona va O‘zR 12% QQS',
        section2Check1: 'Rasmiy 12% QQS to‘lovchisi',
        section2Check2: 'O‘zstandart muvofiqlik sertifikati',
        section3Label: 'Dispatch',
        section3Title: 'Logistika DDP / EXW Toshkent',
        section3Sub: 'To‘g‘ridan-to‘g‘ri B2B shartnomalar va B2G davlat xaridlari',
      },
      contentHeader: {
        indexCode: 'SECTION 01 // WAREHOUSE INVENTORY',
        title: 'OMBOR DASTURI VA TEMIR YO‘L USKUNALARI',
        subtitle: 'Toshkentdagi taqsimlash omborida (Index majmuasi, B2-2097) mavjud pozitsiyalar va muntazam shartnoma grafigi asosidagi ta’minot.',
      },
    },
    CONTRACT: {
      id: 'CONTRACT',
      label: '.CONTRACT',
      shortTitle: 'Tashqi iqtisodiy shartnomaviy ta’minot',
      topBarStatus: 'Loyiha sorsingi va tayyor tashqi iqtisodiy ta’minot',
      modelType: 'container',
      modelName: 'CONTAINER // 40FT INTERMODAL UNIT',
      modelScale: 'ISO 668 // DDP TASHKENT CORRIDOR',
      tools: [
        { code: '01', name: 'Loyiha sorsingi', filterKey: 'SOURCING', description: '86+ xalqaro zavodlardan uskunalarni topish' },
        { code: '02', name: 'Landed Cost hisobi', filterKey: 'CALC', description: 'Invoys + Logistika + Boj + 12% QQS' },
        { code: '03', name: 'Bojxona rasmiylashtiruvi', filterKey: 'CUSTOMS', description: 'TIF TN, sertifikatsiya va BYD chiqarish' },
        { code: '04', name: 'Zavodlar va dasturchilar uchun', filterKey: 'DEV', description: 'Qurilayotgan ob’ektlarni tayyor holatda butlash' },
      ],
      hud: {
        section1Label: 'Sourcing Network',
        section1Title: '86+ tekshirilgan zavodlar',
        section1Meta: 'Xitoy · Yevropa Ittifoqi · MDH · Turkiya',
        section2Label: 'Contract Formula',
        section2Title: 'DDP O‘zbekiston tayyor holda',
        section2Check1: 'So‘mda 12% QQS bilan narxni qat’iy belgilash',
        section2Check2: 'Valyuta va bojxona konturini to‘liq yopish',
        section3Label: 'Smart Import',
        section3Title: 'Excel spetsifikatsiyasi bo‘yicha avtohisob',
        section3Sub: 'Tijorat taklifini hisoblash uchun spetsifikatsiyani yuklang',
      },
      contentHeader: {
        indexCode: 'SECTION 02 // TURNKEY CONTRACT SUPPLY',
        title: 'ZAVODLAR VA DEVELOPERLAR UCHUN SHARTNOMA ASOSIDA YETKAZISH',
        subtitle: 'Loyihangiz uchun murakkab sanoat va qurilish uskunalarini topamiz, tekshiramiz, keltiramiz va bojxonadan tozalaymiz.',
      },
    },
    DIGITAL: {
      id: 'DIGITAL',
      label: '.DIGITAL',
      shortTitle: 'IT-yechimlar va dasturiy ta’minot',
      topBarStatus: 'Korporativ dasturlar, B2B platformalar va AI-muhandislik',
      modelType: 'network',
      modelName: 'TOPOLOGY // NEURAL B2B CORE V2.4',
      modelScale: 'NODES: 64 // SMART MATCH 94.2%',
      tools: [
        { code: '01', name: 'B2B.RailTech platformasi', filterKey: 'B2B', description: 'Bitimlar va tijorat takliflarini boshqarish tizimi' },
        { code: '02', name: 'Smart Match AI Engine', filterKey: 'AI', description: 'Excel-dan nomenklaturani AI orqali aniqlash' },
        { code: '03', name: 'Buyurtma asosida dasturlash', filterKey: 'DEV', description: 'ERP, WMS, B2B portallar, veb-servislar' },
        { code: '04', name: 'IT-konsalting va audit', filterKey: 'CONSULT', description: 'Savdo va logistika jarayonlarini avtomatlashtirish' },
      ],
      hud: {
        section1Label: 'Flagship Product',
        section1Title: 'b2b.railtech.uz [ONLINE]',
        section1Meta: 'Uptime 99.95% · 230+ faol korxonalar',
        section2Label: 'Engineering Stack',
        section2Title: 'To‘liq siklli dasturlash jamoasi',
        section2Check1: 'TypeScript / React / Next.js / Astro',
        section2Check2: 'Python / Node.js / PostgreSQL / AI LLM',
        section3Label: 'Custom Software',
        section3Title: 'Shartnomaviy IT-ishlab chiqish va konsalting',
        section3Sub: 'Xaridlaringiz, omboringiz va dilerlik tarmog‘ingizni raqamlashtiramiz',
      },
      contentHeader: {
        indexCode: 'SECTION 03 // RAILTECH DIGITAL & AI',
        title: 'XUSUSIY IT-MAHSULOTLAR VA BUYURTMA ASOSIDA DASTURLASH',
        subtitle: 'Real sektorni avtomatlashtirish bo‘yicha amaliy ekspertiza: yetakchi B2B platformamizdan tortib korporativ tizimlarni noldan yaratishgacha.',
      },
    },
    PROJECTS: {
      id: 'PROJECTS',
      label: '.PROJECTS',
      shortTitle: 'Muhandislik va Art-laboratoriya',
      topBarStatus: 'Texnologiyalar transferi, R&D va madaniy tashabbuslar',
      modelType: 'hypercube',
      modelName: 'GEOMETRY // ISOMETRIC HYPERCUBE 013',
      modelScale: 'AXIS X-Y-Z // INDUSTRIAL + ART LAB',
      tools: [
        { code: '01', name: 'Dilerlik va mahalliylashtirish', filterKey: 'LOCAL', description: 'O‘zbekistonda xalqaro zavodlar vakilligi' },
        { code: '02', name: 'Art-loyihalar va Rassomlik', filterKey: 'ART', description: 'Ko‘rgazmalar, kartinalar, madaniy homiylik' },
        { code: '03', name: 'Sanoat dizayni', filterKey: 'DESIGN', description: 'Makonlar estetikasi va art-ob’ektlar' },
      ],
      hud: {
        section1Label: 'Multidisciplinary Identity',
        section1Title: 'Muhandislik va san’at sinergiyasi',
        section1Meta: 'O‘zbekistondagi texnologik va madaniy loyihalar',
        section2Label: 'Directions',
        section2Title: 'Zavodlardan galereyalargacha',
        section2Check1: 'Texnologiyalar transferi va yig‘ishni mahalliylashtirish',
        section2Check2: 'Art-loyihalar va tasviriy san’atni prodyuserlik qilish',
        section3Label: 'Partnership',
        section3Title: 'Hamkorlik uchun ochiqmiz',
        section3Sub: 'Ishlab chiqaruvchilar, kuratorlar va biznes bilan qo‘shma loyihalar',
      },
      contentHeader: {
        indexCode: 'SECTION 04 // SPECIAL PROJECTS & ART LAB',
        title: 'MAXSUS LOYIHALAR, MAHALLIYLASHTIRISH VA MADANIY TASHABBUSLAR',
        subtitle: 'ООО «RailTech» ning o‘ziga xos qiyofasi: biz og‘ir muhandislikni nafis san’at va madaniy loyihalarni prodyuserlik qilish bilan uyg‘unlashtiramiz.',
      },
    },
  },
  en: {
    SUPPLY: {
      id: 'SUPPLY',
      label: '.SUPPLY',
      shortTitle: 'Warehouse Supply (Tashkent)',
      topBarStatus: 'B2B/B2G Warehouse & Railway Supply',
      modelType: 'mechanism',
      modelName: 'ASSEMBLY // CAD MODEL 18-100',
      modelScale: 'SCALE 1:12 // GOST 9246-2013',
      tools: [
        { code: '00', name: 'All Inventory Categories', filterKey: 'ALL', description: 'Complete warehouse matrix in Tashkent' },
        { code: '01', name: 'Rolling Stock', filterKey: 'Подвижной состав', description: 'Wheelsets, assemblies, couplers, brake shoes' },
        { code: '02', name: 'Signalling & Automation', filterKey: 'СЦБ и автоматика', description: 'SP-6M point machines, POBS transformers, relays' },
        { code: '03', name: 'Track Infrastructure', filterKey: 'Путевое хозяйство', description: 'ZhBR rail fastenings, track maintenance tools' },
        { code: '04', name: 'Testing & Diagnostics', filterKey: 'КИП и диагностика', description: 'Ultrasonic flaw detectors, gauges' },
        { code: '05', name: 'Power & Electrification', filterKey: 'Энергетика', description: 'Disconnectors, catenary systems, substations' },
      ],
      hud: {
        section1Label: 'Inventory Hub',
        section1Title: 'Stock: Tashkent Index B2-2097',
        section1Meta: '1 240+ SKU · Dispatch within 24 hours',
        section2Label: 'Clearance & Tax',
        section2Title: 'Customs & 12% VAT Uzbekistan',
        section2Check1: 'Official 12% VAT resident entity',
        section2Check2: 'Uzstandard certificate of conformity',
        section3Label: 'Dispatch',
        section3Title: 'Logistics DDP / EXW Tashkent',
        section3Sub: 'Direct B2B contracts and B2G government procurement',
      },
      contentHeader: {
        indexCode: 'SECTION 01 // WAREHOUSE INVENTORY',
        title: 'WAREHOUSE SUPPLY & RAILWAY EQUIPMENT',
        subtitle: 'Available inventory at our central distribution hub in Tashkent (Index complex, B2-2097) and scheduled contract pipeline.',
      },
    },
    CONTRACT: {
      id: 'CONTRACT',
      label: '.CONTRACT',
      shortTitle: 'Turnkey Contract Procurement',
      topBarStatus: 'Global Sourcing & Turnkey Procurement',
      modelType: 'container',
      modelName: 'CONTAINER // 40FT INTERMODAL UNIT',
      modelScale: 'ISO 668 // DDP TASHKENT CORRIDOR',
      tools: [
        { code: '01', name: 'Project Sourcing', filterKey: 'SOURCING', description: 'Equipment discovery across 86+ global factories' },
        { code: '02', name: 'Landed Cost Calculation', filterKey: 'CALC', description: 'Invoice + Freight + Customs + 12% VAT' },
        { code: '03', name: 'Customs Clearance', filterKey: 'CUSTOMS', description: 'HS codes, certification and customs declaration' },
        { code: '04', name: 'For Factories & Developers', filterKey: 'DEV', description: 'Turnkey outfitting for industrial & infrastructure projects' },
      ],
      hud: {
        section1Label: 'Sourcing Network',
        section1Title: '86+ Verified Factories',
        section1Meta: 'China · European Union · CIS · Turkey',
        section2Label: 'Contract Formula',
        section2Title: 'Turnkey DDP Uzbekistan',
        section2Check1: 'Fixed price in UZS with 12% VAT included',
        section2Check2: 'Full absorption of currency & customs compliance',
        section3Label: 'Smart Import',
        section3Title: 'Instant Excel Spec Calculator',
        section3Sub: 'Upload equipment schedule for immediate quotation',
      },
      contentHeader: {
        indexCode: 'SECTION 02 // TURNKEY CONTRACT SUPPLY',
        title: 'CONTRACT SUPPLY & IMPORT FOR FACTORIES AND DEVELOPERS',
        subtitle: 'We source, verify, ship, and clear heavy industrial and railway hardware tailored to your project specs.',
      },
    },
    DIGITAL: {
      id: 'DIGITAL',
      label: '.DIGITAL',
      shortTitle: 'Digital Products & Custom Dev',
      topBarStatus: 'Enterprise Software, B2B Platforms & AI Engineering',
      modelType: 'network',
      modelName: 'TOPOLOGY // NEURAL B2B CORE V2.4',
      modelScale: 'NODES: 64 // SMART MATCH 94.2%',
      tools: [
        { code: '01', name: 'B2B.RailTech Platform', filterKey: 'B2B', description: 'Proprietary procurement and quotation system' },
        { code: '02', name: 'Smart Match AI Engine', filterKey: 'AI', description: 'AI parsing and nomenclature matching from Excel' },
        { code: '03', name: 'Custom Software Development', filterKey: 'DEV', description: 'ERP, WMS, B2B portals, enterprise web services' },
        { code: '04', name: 'IT Consulting & Audit', filterKey: 'CONSULT', description: 'Digital supply chain and trading automation' },
      ],
      hud: {
        section1Label: 'Flagship Product',
        section1Title: 'b2b.railtech.uz [ONLINE]',
        section1Meta: 'Uptime 99.95% · 230+ active enterprise accounts',
        section2Label: 'Engineering Stack',
        section2Title: 'Full-Cycle Software Team',
        section2Check1: 'TypeScript / React / Next.js / Astro',
        section2Check2: 'Python / Node.js / PostgreSQL / AI LLM',
        section3Label: 'Custom Software',
        section3Title: 'Contract Software Dev & Consulting',
        section3Sub: 'Digitize your procurement, warehouse, and dealer network',
      },
      contentHeader: {
        indexCode: 'SECTION 03 // RAILTECH DIGITAL & AI',
        title: 'IN-HOUSE DIGITAL PRODUCTS & CONTRACT SOFTWARE ENGINEERING',
        subtitle: 'Real-sector automation expertise: from our flagship industrial B2B portal to custom enterprise infrastructure from the ground up.',
      },
    },
    PROJECTS: {
      id: 'PROJECTS',
      label: '.PROJECTS',
      shortTitle: 'Special Projects & Art Lab',
      topBarStatus: 'Technology Transfer, R&D & Cultural Art Initiatives',
      modelType: 'hypercube',
      modelName: 'GEOMETRY // ISOMETRIC HYPERCUBE 013',
      modelScale: 'AXIS X-Y-Z // INDUSTRIAL + ART LAB',
      tools: [
        { code: '01', name: 'Dealership & Localization', filterKey: 'LOCAL', description: 'Global factory representation in Uzbekistan' },
        { code: '02', name: 'Art Projects & Painting', filterKey: 'ART', description: 'Exhibitions, fine art, cultural curatorship' },
        { code: '03', name: 'Industrial Design', filterKey: 'DESIGN', description: 'Space aesthetics and custom art installations' },
      ],
      hud: {
        section1Label: 'Multidisciplinary Identity',
        section1Title: 'Engineering + Art Synergy',
        section1Meta: 'High-tech and cultural endeavors in Uzbekistan',
        section2Label: 'Directions',
        section2Title: 'From factories to galleries',
        section2Check1: 'Technology transfer and localized assembly',
        section2Check2: 'Curating art exhibitions and fine paintings',
        section3Label: 'Partnership',
        section3Title: 'Open to Collaborations',
        section3Sub: 'Joint ventures with vendors, curators, and businesses',
      },
      contentHeader: {
        indexCode: 'SECTION 04 // SPECIAL PROJECTS & ART LAB',
        title: 'SPECIAL PROJECTS, LOCALIZATION & CULTURAL INITIATIVES',
        subtitle: 'The unique signature of OOO «RailTech»: unifying heavy engineering rigor with fine art and cultural production.',
      },
    },
  },
};

export const UI_STRINGS: Record<Locale, UiTranslations> = {
  ru: {
    orgSubtitle: 'Юридическое лицо РУз · B2B / B2G Оператор',
    modesLabel: 'Modes',
    toolsLabel: 'Tools',
    cmdLabel: 'CMD //',
    searchPlaceholder: 'Быстрый фильтр по артикулу, ГОСТ, коду ТН ВЭД или задаче...',
    goButton: 'Перейти ↓',
    rotationLabel: 'Rotation',
    pitchLabel: 'PITCH',
    vatCheckbox: 'Учитывать НДС 12% РУз',
    vatActive: 'ACTIVE',
    dutyRateLabel: 'Rate (Пошлина)',
    invoiceLabel: 'Инвойс партии ($):',
    ddpCalcTitle: 'Расчет DDP Ташкент:',
    ddpWithVat: 'С НДС 12%',
    ddpWithoutVat: 'БЕЗ НДС',
    requestKpButton: 'Запросить КП / Консультацию ↗',
    uploadSpecButton: '+ Загрузить спецификацию (.XLSX / .PDF)',
    activeFilterPrefix: 'АКТИВНЫЙ ФИЛЬТР:',
    supplyTable: {
      sku: 'Код SKU',
      name: 'Наименование узла / Оборудования',
      subsystem: 'Подсистема',
      standard: 'ГОСТ / Стандарт',
      hsCode: 'Код ТН ВЭД',
      warehouse: 'Складской базис',
      status: 'Статус',
      action: 'Действие',
      requestInvoice: '[Запросить счет]',
    },
    actions: {
      openPlatform: 'Открыть платформу b2b.railtech.uz ↗',
      requestEstimate: 'Запросить оценку разработки ↗',
    },
    footer: {
      companyDesc: 'Официальное юридическое лицо в Республике Узбекистан. B2B и B2G поставки, складской резерв, контрактный ВЭД и разработка цифровых решений.',
      headquarters: 'Штаб-квартира и Склад',
      hqAddress1: 'Республика Узбекистан, г. Ташкент',
      hqAddress2: 'Комплекс Index, Офис B2-2097',
      phoneLabel: 'Тел:',
      emailLabel: 'Email:',
      ecosystem: 'Цифровая экосистема',
      b2bPortal: 'B2B Портал (b2b.railtech.uz)',
      cmsAdmin: 'Панель управления контентом (CMS)',
      systemStatus: 'SYSTEM STATUS: OPERATIONAL',
      copyright: '© 2021–2026 ООО «RailTech». Все права защищены.',
    },
    modal: {
      badge: 'FORM // B2B & B2G REQUEST DISPATCH',
      title: 'ОТПРАВКА ЗАЯВКИ В ИНЖЕНЕРНЫЙ ОТДЕЛ',
      locationMeta: 'OOO «RailTech» · Tashkent, Index B2-2097',
      nameLabel: 'Ваше имя и должность *',
      namePlaceholder: 'Алишер Каримов, Гл. инженер',
      phoneLabel: 'Телефон (Узбекистан / СНГ) *',
      phonePlaceholder: '+998 90 118-90-00',
      companyLabel: 'Организация *',
      companyPlaceholder: 'АО / ООО / СП',
      innLabel: 'ИНН компании (для КП с НДС 12%)',
      innPlaceholder: '308XXXXXX',
      taskLabel: 'Задача / Номенклатура / ТЗ',
      taskPlaceholder: 'Укажите артикулы, коды ГОСТ/ТН ВЭД или опишите задачу на IT-разработку...',
      fileLabel: 'Прикрепить спецификацию (.XLSX, .PDF, .DOCX)',
      fileButton: 'Upload',
      fileDefault: '+ Выбрать файл ведомости или ТЗ (до 25 МБ)',
      cancelButton: 'Отмена',
      submitButton: 'Отправить в инженерный отдел ↗',
      sendingButton: '[ ОТПРАВКА ДАННЫХ... ]',
      successBadge: '[ ЗАЯВКА ЗАРЕГИСТРИРОВАНА В СИСТЕМЕ ]',
      successMessage: 'Инженерный отдел ООО «RailTech» свяжется с вами в течение 30 минут.',
      errorMessage: 'Ошибка при отправке. Пожалуйста, позвоните нам: +998 90 118-90-00',
    },
  },
  uz: {
    orgSubtitle: 'O‘zR yuridik shaxsi · B2B / B2G Operatori',
    modesLabel: 'Modes',
    toolsLabel: 'Tools',
    cmdLabel: 'CMD //',
    searchPlaceholder: 'Artikul, GOST, TIF TN kodi yoki vazifa bo‘yicha tezkor qidiruv...',
    goButton: 'O‘tish ↓',
    rotationLabel: 'Rotation',
    pitchLabel: 'PITCH',
    vatCheckbox: 'O‘zR 12% QQSni hisobga olish',
    vatActive: 'ACTIVE',
    dutyRateLabel: 'Rate (Boj to‘lovi)',
    invoiceLabel: 'Partiya invoysi ($):',
    ddpCalcTitle: 'DDP Toshkent hisobi:',
    ddpWithVat: '12% QQS BILAN',
    ddpWithoutVat: 'QQS-SIZ',
    requestKpButton: 'Tijorat taklifi / Maslahat so‘rash ↗',
    uploadSpecButton: '+ Spetsifikatsiya yuklash (.XLSX / .PDF)',
    activeFilterPrefix: 'FAOL FILTR:',
    supplyTable: {
      sku: 'SKU Kodi',
      name: 'Tugun / Uskuna nomi',
      subsystem: 'Kichik tizim',
      standard: 'GOST / Standart',
      hsCode: 'TIF TN kodi',
      warehouse: 'Ombor bazisi',
      status: 'Holati',
      action: 'Amal',
      requestInvoice: '[Hisob so‘rash]',
    },
    actions: {
      openPlatform: 'b2b.railtech.uz platformasini ochish ↗',
      requestEstimate: 'Dasturlash bahosini so‘rash ↗',
    },
    footer: {
      companyDesc: 'O‘zbekiston Respublikasidagi rasmiy yuridik shaxs. B2B va B2G ta’minot, ombor zaxirasi, shartnomaviy TIF va raqamli yechimlarni ishlab chiqish.',
      headquarters: 'Bosh ofis va Ombor',
      hqAddress1: 'O‘zbekiston Respublikasi, Toshkent shahri',
      hqAddress2: 'Index majmuasi, B2-2097 ofisi',
      phoneLabel: 'Tel:',
      emailLabel: 'Email:',
      ecosystem: 'Raqamli ekotizim',
      b2bPortal: 'B2B Portal (b2b.railtech.uz)',
      cmsAdmin: 'Kontent boshqaruv paneli (CMS)',
      systemStatus: 'SYSTEM STATUS: OPERATIONAL',
      copyright: '© 2021–2026 ООО «RailTech». Barcha huquqlar himoyalangan.',
    },
    modal: {
      badge: 'FORM // B2B & B2G REQUEST DISPATCH',
      title: 'MUHANDISLIK BO‘LIMIGA SO‘ROV YUBORISH',
      locationMeta: 'OOO «RailTech» · Toshkent, Index B2-2097',
      nameLabel: 'Ismingiz va lavozimingiz *',
      namePlaceholder: 'Alisher Karimov, Bosh muhandis',
      phoneLabel: 'Telefon (O‘zbekiston / MDH) *',
      phonePlaceholder: '+998 90 118-90-00',
      companyLabel: 'Tashkilot nomi *',
      companyPlaceholder: 'AJ / MChJ / QK',
      innLabel: 'Kompaniya STIR/INN (12% QQSli tijorat taklifi uchun)',
      innPlaceholder: '308XXXXXX',
      taskLabel: 'Vazifa / Nomenklatura / Texnik topshiriq',
      taskPlaceholder: 'Artikullar, GOST/TIF TN kodlarini ko‘rsating yoki IT-vazifani yozing...',
      fileLabel: 'Spetsifikatsiyani biriktirish (.XLSX, .PDF, .DOCX)',
      fileButton: 'Upload',
      fileDefault: '+ Spetsifikatsiya yoki TT faylini tanlang (25 MB gacha)',
      cancelButton: 'Bekor qilish',
      submitButton: 'Muhandislik bo‘limiga yuborish ↗',
      sendingButton: '[ MA’LUMOTLAR YUBORILMOQDA... ]',
      successBadge: '[ ARIZA TIZIMDA RO‘YXATGA OLINDI ]',
      successMessage: 'ООО «RailTech» muhandislik bo‘limi 30 daqiqa ichida siz bilan bog‘lanadi.',
      errorMessage: 'Yuborishda xatolik yuz berdi. Iltimos, bizga qo‘ng‘iroq qiling: +998 90 118-90-00',
    },
  },
  en: {
    orgSubtitle: 'Legal entity of Uzbekistan · B2B / B2G Operator',
    modesLabel: 'Modes',
    toolsLabel: 'Tools',
    cmdLabel: 'CMD //',
    searchPlaceholder: 'Quick search by SKU, GOST, HS code or requirement...',
    goButton: 'Go to ↓',
    rotationLabel: 'Rotation',
    pitchLabel: 'PITCH',
    vatCheckbox: 'Include 12% Uzbekistan VAT',
    vatActive: 'ACTIVE',
    dutyRateLabel: 'Rate (Duty)',
    invoiceLabel: 'Batch Invoice ($):',
    ddpCalcTitle: 'DDP Tashkent Calculation:',
    ddpWithVat: 'WITH 12% VAT',
    ddpWithoutVat: 'WITHOUT VAT',
    requestKpButton: 'Request Quotation / Consultation ↗',
    uploadSpecButton: '+ Upload Specification (.XLSX / .PDF)',
    activeFilterPrefix: 'ACTIVE FILTER:',
    supplyTable: {
      sku: 'SKU Code',
      name: 'Part / Equipment Name',
      subsystem: 'Subsystem',
      standard: 'GOST / Standard',
      hsCode: 'HS Code',
      warehouse: 'Warehouse Basis',
      status: 'Status',
      action: 'Action',
      requestInvoice: '[Request Invoice]',
    },
    actions: {
      openPlatform: 'Open b2b.railtech.uz platform ↗',
      requestEstimate: 'Request Dev Estimate ↗',
    },
    footer: {
      companyDesc: 'Official legal entity in the Republic of Uzbekistan. B2B and B2G supply, warehouse inventory reserve, turnkey foreign trade, and enterprise software engineering.',
      headquarters: 'Headquarters & Warehouse',
      hqAddress1: 'Republic of Uzbekistan, Tashkent',
      hqAddress2: 'Index Complex, Office B2-2097',
      phoneLabel: 'Tel:',
      emailLabel: 'Email:',
      ecosystem: 'Digital Ecosystem',
      b2bPortal: 'B2B Portal (b2b.railtech.uz)',
      cmsAdmin: 'Content Management (CMS)',
      systemStatus: 'SYSTEM STATUS: OPERATIONAL',
      copyright: '© 2021–2026 OOO «RailTech». All rights reserved.',
    },
    modal: {
      badge: 'FORM // B2B & B2G REQUEST DISPATCH',
      title: 'DISPATCH REQUEST TO ENGINEERING TEAM',
      locationMeta: 'OOO «RailTech» · Tashkent, Index B2-2097',
      nameLabel: 'Your Name and Title *',
      namePlaceholder: 'Alisher Karimov, Chief Engineer',
      phoneLabel: 'Phone (Uzbekistan / International) *',
      phonePlaceholder: '+998 90 118-90-00',
      companyLabel: 'Organization *',
      companyPlaceholder: 'JSC / LLC / JV',
      innLabel: 'Tax ID / INN (for 12% VAT invoice)',
      innPlaceholder: '308XXXXXX',
      taskLabel: 'Task / Nomenclature / Technical Specs',
      taskPlaceholder: 'Specify SKUs, GOST / HS codes, or describe your custom IT development requirement...',
      fileLabel: 'Attach specification (.XLSX, .PDF, .DOCX)',
      fileButton: 'Upload',
      fileDefault: '+ Select schedule or spec file (up to 25 MB)',
      cancelButton: 'Cancel',
      submitButton: 'Dispatch to Engineering Team ↗',
      sendingButton: '[ TRANSMITTING DISPATCH... ]',
      successBadge: '[ REQUEST REGISTERED IN SYSTEM ]',
      successMessage: 'The RailTech engineering department will contact you within 30 minutes.',
      errorMessage: 'Transmission error. Please call our direct line: +998 90 118-90-00',
    },
  },
};
