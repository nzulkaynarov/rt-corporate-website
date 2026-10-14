import React, { useState } from 'react';

interface MatchedData {
  sku: string;
  title: string;
  gost: string;
  tnved: string;
  confidence: number;
  stock: string;
  latencyMs: number;
}

const DATABASE: Record<string, MatchedData> = {
  'колодка': {
    sku: 'RT-RS-305',
    title: 'Колодка тормозная композиционная 25610-Н с сетчато-проволочным каркасом',
    gost: 'ГОСТ 30249-97',
    tnved: '8607 21 100 0',
    confidence: 98.4,
    stock: 'В наличии (3 400 шт, Ташкент)',
    latencyMs: 114,
  },
  'привод': {
    sku: 'RT-SCB-001',
    title: 'Стрелочный электропривод СП-6М (левый/правый, ход шибера 160 мм)',
    gost: 'ТУ 32 ЦШ 2045-98',
    tnved: '8608 00 000 0',
    confidence: 96.7,
    stock: 'В наличии (24 компл, Ташкент)',
    latencyMs: 128,
  },
  'тележка': {
    sku: 'RT-RS-118',
    title: 'Тележка двухосная грузового вагона 18-100 (колея 1520 мм)',
    gost: 'ГОСТ 9246-2013',
    tnved: '8607 12 000 0',
    confidence: 99.1,
    stock: 'Резерв / Консолидация',
    latencyMs: 142,
  },
  'автосцепка': {
    sku: 'RT-RS-208',
    title: 'Автосцепка СА-3 в сборе (чертеж 106.01.000-0сб)',
    gost: 'ГОСТ 22703-2012',
    tnved: '8607 30 000 0',
    confidence: 97.9,
    stock: 'В наличии (65 шт, Ташкент)',
    latencyMs: 108,
  },
  'пара': {
    sku: 'RT-RS-102',
    title: 'Колесная пара РУ1Ш-957-Г буксовая с кассетными подшипниками TBU 130x250',
    gost: 'ГОСТ 4835-2013',
    tnved: '8607 19 100 9',
    confidence: 98.6,
    stock: 'В наличии (48 шт, Ташкент)',
    latencyMs: 135,
  },
};

export const SmartMatchAiTester: React.FC = () => {
  const [inputText, setInputText] = useState('Колодка тормозная 25610-Н 500шт для грузового парка');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showJson, setShowJson] = useState(false);

  const presets = [
    { label: 'Тормозные колодки', query: 'Колодка 25610-Н 500шт' },
    { label: 'Электропривод СП-6М', query: 'Привод стрелочный СП-6М ход 160мм' },
    { label: 'Тележка 18-100', query: 'Тележка 18-100 в сборе колея 1520' },
    { label: 'Автосцепка СА-3', query: 'Автосцепка СА-3 литой корпус' },
    { label: 'Колесная пара РУ1Ш', query: 'Колесная пара РУ1Ш-957 с кассетой' },
  ];

  const getMatch = (text: string): MatchedData => {
    const lower = text.toLowerCase();
    for (const key of Object.keys(DATABASE)) {
      if (lower.includes(key)) {
        return DATABASE[key];
      }
    }
    // Default fallback
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

  const handleRequestIntegration = () => {
    window.dispatchEvent(
      new CustomEvent('open-lead-modal', {
        detail: {
          subject: 'Запрос интеграции API Smart Match AI с ERP/1C предприятием',
        },
      })
    );
  };

  return (
    <div className="border-2 border-[#0A0A0A] bg-[#D4D8DC] p-6 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#0A0A0A] pb-3 mb-6 gap-2">
        <div className="flex items-center space-x-2">
          <span className="bg-[#0A0A0A] text-white px-2 py-0.5 text-xs font-bold">
            SMART MATCH AI v2.4
          </span>
          <span className="font-bold text-sm text-[#0A0A0A]">
            ИНТЕРАКТИВНЫЙ NLP-ПАРСЕР СПЕЦИФИКАЦИЙ
          </span>
        </div>
        <div className="text-xs text-[#4A5056]">
          ТОЧНОСТЬ: <span className="text-[#0A0A0A] font-bold">98.4%</span> // LATENCY: <span className="text-[#0A0A0A] font-bold">{matched.latencyMs}ms</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Input */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#0A0A0A] mb-1">
              ВХОДНАЯ НЕСТРУКТУРИРОВАННАЯ СТРОКА ЗАЯВКИ СНАБЖЕНИЯ:
            </label>
            <textarea
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Введите произвольный текст из заявки или опросного листа..."
              className="w-full border border-[#0A0A0A] bg-white p-3 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#0A0A0A]"
            />
          </div>

          <div>
            <div className="text-[11px] font-bold text-[#4A5056] mb-1.5 uppercase">
              Тестовые пресеты из реальных заявок:
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
            <div className="font-bold text-[#0A0A0A]">КАК ЭТО РАБОТАЕТ В ПРОИЗВОДСТВЕ:</div>
            <div>• Нормализует сленг снабженцев («башмак», «пята», «собачка», «кассетник»).</div>
            <div>• Сопоставляет с эталонными классификаторами ГОСТ и ТН ВЭД Республики Узбекистан.</div>
            <div>• Проверяет фактические остатки на складе Index B2-2097 в режиме реального времени.</div>
          </div>
        </div>

        {/* Right Matched Result */}
        <div className="border border-[#0A0A0A] bg-[#C8CDD2] p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#0A0A0A] pb-2 mb-3">
              <span className="text-xs font-bold text-[#0A0A0A]">
                РЕЗУЛЬТАТ РАСПОЗНАВАНИЯ В БАЗЕ RAILTECH
              </span>
              <span className="border border-emerald-600 bg-emerald-100 text-emerald-900 px-2 py-0.5 text-[10px] font-bold">
                CONFIDENCE: {matched.confidence}%
              </span>
            </div>

            {isAnalyzing ? (
              <div className="py-12 text-center text-xs text-[#0A0A0A] animate-pulse">
                [ АНАЛИЗ И СВЕРКА С БАЗОЙ ТН ВЭД... ]
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[#4A5056] block text-[10px]">НАЙДЕННЫЙ АРТИКУЛ (SKU):</span>
                  <span className="font-bold text-sm text-[#0A0A0A] bg-[#D4D8DC] px-2 py-0.5 border border-[#0A0A0A] inline-block mt-0.5">
                    {matched.sku}
                  </span>
                </div>

                <div>
                  <span className="text-[#4A5056] block text-[10px]">ЭТАЛОННОЕ НАИМЕНОВАНИЕ:</span>
                  <span className="font-sans font-bold text-[#0A0A0A] block">
                    {matched.title}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#0A0A0A]/20">
                  <div>
                    <span className="text-[#4A5056] block text-[10px]">СТАНДАРТ:</span>
                    <span className="font-bold text-[#0A0A0A]">{matched.gost}</span>
                  </div>
                  <div>
                    <span className="text-[#4A5056] block text-[10px]">КОД ТН ВЭД РУЗ:</span>
                    <span className="font-bold text-[#0A0A0A]">{matched.tnved}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#0A0A0A]/20">
                  <span className="text-[#4A5056] block text-[10px]">ДОСТУПНОСТЬ В ТАШКЕНТЕ:</span>
                  <span className="font-bold text-emerald-800">{matched.stock}</span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-[#0A0A0A]/20 flex flex-col gap-2">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowJson(!showJson)}
                className="border border-[#0A0A0A] bg-white px-3 py-1.5 text-xs font-bold hover:bg-[#0A0A0A] hover:text-white transition-colors"
              >
                {showJson ? 'Скрыть JSON' : 'Показать JSON API'}
              </button>
              <button
                type="button"
                onClick={handleRequestIntegration}
                className="flex-grow border border-[#0A0A0A] bg-[#0A0A0A] text-white px-3 py-1.5 text-xs font-bold hover:bg-transparent hover:text-[#0A0A0A] transition-colors"
              >
                [ ПОДКЛЮЧИТЬ К НАШЕЙ 1C / ERP ]
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
                      name: matched.title,
                      gost: matched.gost,
                      hs_code: matched.tnved,
                      confidence_score: matched.confidence / 100,
                      warehouse_status: matched.stock,
                    },
                    meta: {
                      algorithm: 'RailTech-NLP-v2.4',
                      processing_time_ms: matched.latencyMs,
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
