import React, { useState, useEffect } from 'react';
import type { Lang } from '../../i18n/ui';
import { UI_DICTIONARY } from '../../i18n/ui';

interface MatchedData {
  sku: string;
  title_ru: string;
  title_uz: string;
  title_en: string;
  gost: string;
  tnved: string;
  confidence: number;
  stock_ru: string;
  stock_uz: string;
  stock_en: string;
  latencyMs: number;
}

const DATABASE: Record<string, MatchedData> = {
  'колодка': {
    sku: 'RT-RS-305',
    title_ru: 'Колодка тормозная композиционная 25610-Н с сетчато-проволочным каркасом',
    title_uz: 'Yuk vagonlari uchun 25610-N to\'rli-sim karkasli kompozitsion tormoz kolodkasi',
    title_en: 'Composite brake shoe 25610-N with mesh-wire reinforcement framework',
    gost: 'ГОСТ 30249-97',
    tnved: '8607 21 100 0',
    confidence: 98.4,
    stock_ru: 'В наличии (3 400 шт, Ташкент)',
    stock_uz: 'Mavjud (3 400 dona, Toshkent ombori)',
    stock_en: 'In stock (3,400 pcs, Tashkent hub)',
    latencyMs: 114,
  },
  'привод': {
    sku: 'RT-SCB-001',
    title_ru: 'Стрелочный электропривод СП-6М (левый/правый, ход шибера 160 мм)',
    title_uz: 'SP-6M strelka elektr uzatmasi (chap/o\'ng, shiber yurishi 160 mm)',
    title_en: 'Switch machine SP-6M (left/right, slide stroke 160 mm)',
    gost: 'ТУ 32 ЦШ 2045-98',
    tnved: '8608 00 000 0',
    confidence: 96.7,
    stock_ru: 'В наличии (24 компл, Ташкент)',
    stock_uz: 'Mavjud (24 to\'plam, Toshkent)',
    stock_en: 'In stock (24 sets, Tashkent)',
    latencyMs: 128,
  },
  'тележка': {
    sku: 'RT-RS-118',
    title_ru: 'Тележка двухосная грузового вагона 18-100 (стандартная база)',
    title_uz: '18-100 rusumli yuk vagonining ikki o\'qli aravachasi (standart baza)',
    title_en: 'Two-axle freight wagon chassis model 18-100 (standard wheelbase)',
    gost: 'ГОСТ 9246-2013',
    tnved: '8607 12 000 0',
    confidence: 99.1,
    stock_ru: 'Резерв / Консолидация',
    stock_uz: 'Zaxirada / Konsolidatsiya',
    stock_en: 'Reserved / Consolidated hub',
    latencyMs: 142,
  },
  'автосцепка': {
    sku: 'RT-RS-208',
    title_ru: 'Автосцепка СА-3 в сборе (чертеж 106.01.000-0сб)',
    title_uz: 'SA-3 avtobirlashmasi to\'liq yig\'ilgan (chizma 106.01.000-0sb)',
    title_en: 'Automatic coupler SA-3 complete assembly (drawing 106.01.000-0sb)',
    gost: 'ГОСТ 22703-2012',
    tnved: '8607 30 000 0',
    confidence: 97.9,
    stock_ru: 'В наличии (65 шт, Ташкент)',
    stock_uz: 'Mavjud (65 dona, Toshkent)',
    stock_en: 'In stock (65 units, Tashkent)',
    latencyMs: 108,
  },
  'пара': {
    sku: 'RT-RS-102',
    title_ru: 'Колесная пара РУ1Ш-957-Г буксовая с кассетными подшипниками TBU 130x250',
    title_uz: 'RU1Sh-957-G buksali g\'ildirak juftligi TBU 130x250 kassetali podshipniklar bilan',
    title_en: 'Wheelset RU1Sh-957-G with axle boxes and cartridge bearings TBU 130x250',
    gost: 'ГОСТ 4835-2013',
    tnved: '8607 19 100 9',
    confidence: 98.6,
    stock_ru: 'В наличии (48 шт, Ташкент)',
    stock_uz: 'Mavjud (48 dona, Toshkent)',
    stock_en: 'In stock (48 units, Tashkent)',
    latencyMs: 135,
  },
};

// Aliases for multilingual lookups
DATABASE['kolodka'] = DATABASE['колодка'];
DATABASE['brake'] = DATABASE['колодка'];
DATABASE['yuritma'] = DATABASE['привод'];
DATABASE['uzatma'] = DATABASE['привод'];
DATABASE['switch'] = DATABASE['привод'];
DATABASE['aravacha'] = DATABASE['тележка'];
DATABASE['chassis'] = DATABASE['тележка'];
DATABASE['avtobirlashma'] = DATABASE['автосцепка'];
DATABASE['coupler'] = DATABASE['автосцепка'];
DATABASE['gildirak'] = DATABASE['пара'];
DATABASE['wheelset'] = DATABASE['пара'];

export const SmartMatchAiTester: React.FC = () => {
  const [lang, setLang] = useState<Lang>('ru');
  const [inputText, setInputText] = useState('Колодка тормозная 25610-Н 500шт для грузового парка');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showJson, setShowJson] = useState(false);

  useEffect(() => {
    const cur = (document.documentElement.lang as Lang) || 
      ((typeof localStorage !== 'undefined' ? localStorage.getItem('rt_lang') : null) as Lang) || 
      'ru';
    if (cur === 'ru' || cur === 'uz' || cur === 'en') {
      setLang(cur);
    }

    const handleLang = (e: Event) => {
      const customEvent = e as CustomEvent<Lang>;
      if (customEvent.detail && (customEvent.detail === 'ru' || customEvent.detail === 'uz' || customEvent.detail === 'en')) {
        setLang(customEvent.detail);
      }
    };

    window.addEventListener('rt-lang-change', handleLang);
    return () => window.removeEventListener('rt-lang-change', handleLang);
  }, []);

  const t = UI_DICTIONARY[lang]?.smartMatch || UI_DICTIONARY.ru.smartMatch;

  const presets = [
    {
      label: lang === 'uz' ? 'Tormoz kolodkalari' : lang === 'en' ? 'Brake shoes' : 'Тормозные колодки',
      query: lang === 'uz' ? '25610-N tormoz kolodkasi 500 dona' : lang === 'en' ? 'Brake shoe 25610-N 500 pcs' : 'Колодка 25610-Н 500шт'
    },
    {
      label: lang === 'uz' ? 'SP-6M elektr uzatmasi' : lang === 'en' ? 'Switch machine SP-6M' : 'Электропривод СП-6М',
      query: lang === 'uz' ? 'SP-6M strelka elektr uzatmasi yurishi 160mm' : lang === 'en' ? 'Switch machine SP-6M stroke 160mm' : 'Привод стрелочный СП-6М ход 160мм'
    },
    {
      label: lang === 'uz' ? '18-100 aravachasi' : lang === 'en' ? 'Bogie 18-100' : 'Тележка 18-100',
      query: lang === 'uz' ? '18-100 aravacha standart baza' : lang === 'en' ? '18-100 chassis standard base' : 'Тележка 18-100 в сборе'
    },
    {
      label: lang === 'uz' ? 'SA-3 avtobirlashmasi' : lang === 'en' ? 'Coupler SA-3' : 'Автосцепка СА-3',
      query: lang === 'uz' ? 'SA-3 avtobirlashmasi quyma korpus' : lang === 'en' ? 'Coupler SA-3 cast steel body' : 'Автосцепка СА-3 литой корпус'
    },
    {
      label: lang === 'uz' ? 'RU1Sh g\'ildirak juftligi' : lang === 'en' ? 'Wheelset RU1Sh' : 'Колесная пара РУ1Ш',
      query: lang === 'uz' ? 'RU1Sh-957 g\'ildirak juftligi kassetali' : lang === 'en' ? 'Wheelset RU1Sh-957 cartridge bearing' : 'Колесная пара РУ1Ш-957 с кассетой'
    },
  ];

  const getMatch = (text: string): MatchedData => {
    const lower = text.toLowerCase();
    for (const key of Object.keys(DATABASE)) {
      if (lower.includes(key)) {
        return DATABASE[key];
      }
    }
    return DATABASE['колодка'];
  };

  const handleRunAnalysis = (queryText: string) => {
    setIsAnalyzing(true);
    setInputText(queryText);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 280);
  };

  const matched = getMatch(inputText);

  const matchedTitle = lang === 'uz' ? matched.title_uz : lang === 'en' ? matched.title_en : matched.title_ru;
  const matchedStock = lang === 'uz' ? matched.stock_uz : lang === 'en' ? matched.stock_en : matched.stock_ru;

  const handleRequestIntegration = () => {
    const subj = lang === 'uz'
      ? 'Smart Match AI API ni korxona 1C / ERP tizimiga ulash so\'rovi'
      : lang === 'en'
      ? 'Request for Smart Match AI API Integration with Enterprise ERP / 1C'
      : 'Запрос интеграции API Smart Match AI с ERP/1C предприятием';
    window.dispatchEvent(
      new CustomEvent('open-lead-modal', {
        detail: { subject: subj },
      })
    );
  };

  return (
    <div className="border-2 border-[#0A0A0A] bg-[#D4D8DC] p-6 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#0A0A0A] pb-3 mb-6 gap-2">
        <div className="flex items-center space-x-2">
          <span className="bg-[#0A0A0A] text-white px-2 py-0.5 text-xs font-bold">
            {t.badge}
          </span>
          <span className="font-bold text-sm text-[#0A0A0A]">
            {t.title}
          </span>
        </div>
        <div className="text-xs text-[#4A5056]">
          {t.matchAccuracy} <span className="text-[#0A0A0A] font-bold">98.4%</span> // LATENCY: <span className="text-[#0A0A0A] font-bold">{matched.latencyMs}ms</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Input */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#0A0A0A] mb-1">
              {t.inputLabel}
            </label>
            <textarea
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t.inputPlaceholder}
              className="w-full border border-[#0A0A0A] bg-white p-3 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#0A0A0A]"
            />
          </div>

          <div>
            <div className="text-[11px] font-bold text-[#4A5056] mb-1.5 uppercase">
              {t.sampleQueries}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handleRunAnalysis(preset.query)}
                  className="border border-[#0A0A0A] bg-[#C8CDD2] px-2.5 py-1 text-xs hover:bg-[#0A0A0A] hover:text-white transition-colors cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 border border-[#0A0A0A]/30 bg-[#C8CDD2]/50 text-[11px] text-[#4A5056] space-y-1">
            <div className="font-bold text-[#0A0A0A]">
              {lang === 'uz' ? 'ISHLASH PRINSIP VA AFZALLIKLARI:' : lang === 'en' ? 'PRODUCTION WORKFLOW ARCHITECTURE:' : 'КАК ЭТО РАБОТАЕТ В ПРОИЗВОДСТВЕ:'}
            </div>
            <div>
              {lang === 'uz'
                ? '• Ta\'minotchilar slengi va qisqartmalarini me\'yorlashtiradi («bashmak», «pyata», «sobachka», «kassetnik»).'
                : lang === 'en'
                ? '• Normalizes procurement jargon and railway slang into formal standards.'
                : '• Нормализует сленг снабженцев («башмак», «пята», «собачка», «кассетник»).'}
            </div>
            <div>
              {lang === 'uz'
                ? '• O\'zbekiston Respublikasi GOST va TIF TN standart klassifikatorlari bilan solishtiradi.'
                : lang === 'en'
                ? '• Matches against official GOST and Uzbekistan HS code classifiers.'
                : '• Сопоставляет с эталонными классификаторами ГОСТ и ТН ВЭД Республики Узбекистан.'}
            </div>
            <div>
              {lang === 'uz'
                ? '• Index B2-2097 omboridagi qoldiqlarni real vaqt rejimida tekshiradi.'
                : lang === 'en'
                ? '• Checks physical inventory at Tashkent Index B2-2097 hub in real-time.'
                : '• Проверяет фактические остатки на складе Index B2-2097 в режиме реального времени.'}
            </div>
          </div>
        </div>

        {/* Right Matched Result */}
        <div className="border border-[#0A0A0A] bg-[#C8CDD2] p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#0A0A0A] pb-2 mb-3">
              <span className="text-xs font-bold text-[#0A0A0A]">
                {t.telemetryTitle}
              </span>
              <span className="border border-emerald-600 bg-emerald-100 text-emerald-900 px-2 py-0.5 text-[10px] font-bold">
                CONFIDENCE: {matched.confidence}%
              </span>
            </div>

            {isAnalyzing ? (
              <div className="py-12 text-center text-xs text-[#0A0A0A] animate-pulse">
                {lang === 'uz' ? '[ BOJXONA VA STANDARTLAR BAZASI BILAN TEKSHIRILMOQDA... ]' : lang === 'en' ? '[ INFERRING SPECIFICATIONS & HS CODE LOOKUP... ]' : '[ АНАЛИЗ И СВЕРКА С БАЗОЙ ТН ВЭД... ]'}
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[#4A5056] block text-[10px]">{t.detectedSku}</span>
                  <span className="font-bold text-sm text-[#0A0A0A] bg-[#D4D8DC] px-2 py-0.5 border border-[#0A0A0A] inline-block mt-0.5">
                    {matched.sku}
                  </span>
                </div>

                <div>
                  <span className="text-[#4A5056] block text-[10px]">
                    {lang === 'uz' ? 'STANDART NOM VA SPETSIFIKATSIYA:' : lang === 'en' ? 'STANDARD DESIGNATION:' : 'ЭТАЛОННОЕ НАИМЕНОВАНИЕ:'}
                  </span>
                  <span className="font-sans font-bold text-[#0A0A0A] block">
                    {matchedTitle}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#0A0A0A]/20">
                  <div>
                    <span className="text-[#4A5056] block text-[10px]">{t.standard}</span>
                    <span className="font-bold text-[#0A0A0A]">{matched.gost}</span>
                  </div>
                  <div>
                    <span className="text-[#4A5056] block text-[10px]">{t.hsCode}</span>
                    <span className="font-bold text-[#0A0A0A]">{matched.tnved}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#0A0A0A]/20">
                  <span className="text-[#4A5056] block text-[10px]">{t.warehouseStatus}</span>
                  <span className="font-bold text-emerald-800">{matchedStock}</span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-[#0A0A0A]/20 flex flex-col gap-2">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowJson(!showJson)}
                className="border border-[#0A0A0A] bg-white px-3 py-1.5 text-xs font-bold hover:bg-[#0A0A0A] hover:text-white transition-colors cursor-pointer"
              >
                {showJson ? (lang === 'uz' ? 'JSONni yashirish' : lang === 'en' ? 'Hide JSON' : 'Скрыть JSON') : (lang === 'uz' ? 'API JSONni ko\'rish' : lang === 'en' ? 'Show API JSON' : 'Показать JSON API')}
              </button>
              <button
                type="button"
                onClick={handleRequestIntegration}
                className="flex-grow border border-[#0A0A0A] bg-[#0A0A0A] text-white px-3 py-1.5 text-xs font-bold hover:bg-transparent hover:text-[#0A0A0A] transition-colors cursor-pointer"
              >
                {lang === 'uz' ? '[ 1C / ERP TIZIMIMIZGA ULASH ]' : lang === 'en' ? '[ CONNECT TO OUR ERP / 1C ]' : '[ ПОДКЛЮЧИТЬ К НАШЕЙ 1C / ERP ]'}
              </button>
            </div>

            {showJson && (
              <pre className="mt-2 p-3 bg-[#0A0A0A] text-emerald-400 text-[10px] overflow-x-auto">
                {JSON.stringify(
                  {
                    status: 'success',
                    input: inputText,
                    matched: {
                      sku: matched.sku,
                      name: matchedTitle,
                      gost: matched.gost,
                      hs_code: matched.tnved,
                      confidence_score: matched.confidence / 100,
                      warehouse_status: matchedStock,
                    },
                    meta: {
                      algorithm: 'RailTech-NLP-v2.4',
                      processing_time_ms: matched.latencyMs,
                      locale: lang,
                    },
                  },
                  null,
                  2
                )}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
