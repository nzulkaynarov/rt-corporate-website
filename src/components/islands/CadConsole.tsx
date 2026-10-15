import React, { useState, useMemo, useEffect } from 'react';
import type { AppMode, Locale } from '../../store/modeStore';
import {
  MODES_DATA,
  SKU_CATALOG,
  CONTRACT_STEPS,
  DIGITAL_PRODUCTS,
  PROJECTS_PORTFOLIO,
  UI_STRINGS,
} from '../../store/modeStore';
import { WireframeViewport } from './WireframeViewport';
import { LeadModal } from './LeadModal';

export const CadConsole: React.FC = () => {
  const [locale, setLocale] = useState<Locale>('ru');
  const [activeMode, setActiveMode] = useState<AppMode>('SUPPLY');
  const [activeToolIdx, setActiveToolIdx] = useState<number>(0);
  const [rotationDeg, setRotationDeg] = useState<number>(38);
  const [pitchDeg, setPitchDeg] = useState<number>(18);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSkuCode, setSelectedSkuCode] = useState<string>('RT-RS-102');

  // Landed Cost Calculator state (.CONTRACT mode)
  const [invoiceUsd, setInvoiceUsd] = useState<number>(35000);
  const [dutyRate, setDutyRate] = useState<number>(5);
  const [vatEnabled, setVatEnabled] = useState<boolean>(true);

  // Smart Match AI Interactive Sandbox state (.DIGITAL mode)
  const [aiSampleInput, setAiSampleInput] = useState<string>('Колодка тормозная 25610-Н 500шт');
  const [aiMatchedResult, setAiMatchedResult] = useState<{
    matchedSku: string;
    matchedTitle: string;
    confidence: number;
    gost: string;
  } | null>({
    matchedSku: 'RT-RS-305',
    matchedTitle: 'Колодка тормозная композиционная 25610-Н',
    confidence: 97.4,
    gost: 'ГОСТ 30249-97',
  });

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalSubject, setModalSubject] = useState<string>('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('railtech_locale') as Locale | null;
      if (saved && (saved === 'ru' || saved === 'uz' || saved === 'en')) {
        setLocale(saved);
      }
    } catch {
      // Ignore
    }
  }, []);

  const handleLocaleChange = (newLocale: Locale) => {
    setLocale(newLocale);
    try {
      localStorage.setItem('railtech_locale', newLocale);
    } catch {
      // Ignore
    }
  };

  const t = UI_STRINGS[locale];
  const currentModes = MODES_DATA[locale];
  const currentConfig = currentModes[activeMode];
  const activeTool = currentConfig.tools[activeToolIdx] || currentConfig.tools[0];

  // Landed Cost calculation DDP Tashkent
  const logisticsCost = Math.round(invoiceUsd * 0.08);
  const dutyAmount = Math.round((invoiceUsd + logisticsCost) * (dutyRate / 100));
  const vatAmount = vatEnabled ? Math.round((invoiceUsd + logisticsCost + dutyAmount) * 0.12) : 0;
  const totalDdpUsd = invoiceUsd + logisticsCost + dutyAmount + vatAmount;
  const totalDdpUzs = totalDdpUsd * 12850;

  // Catalog filtered by category and search
  const currentCatalog = SKU_CATALOG[locale];
  const filteredSkus = useMemo(() => {
    return currentCatalog.filter((item) => {
      const matchesCategory =
        activeTool.filterKey === 'ALL' ||
        item.subsystem.toLowerCase().includes(activeTool.filterKey.toLowerCase()) ||
        activeTool.name.toLowerCase().includes(item.subsystem.toLowerCase());

      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.sku.toLowerCase().includes(query) ||
        item.gost.toLowerCase().includes(query) ||
        item.tnved.includes(query) ||
        item.specs.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [activeTool, searchQuery, currentCatalog]);

  const selectedItem = useMemo(() => {
    return currentCatalog.find((it) => it.sku === selectedSkuCode) || currentCatalog[0];
  }, [currentCatalog, selectedSkuCode]);

  const handleRunAiMatch = (text: string) => {
    setAiSampleInput(text);
    const lower = text.toLowerCase();
    if (lower.includes('колодк') || lower.includes('25610')) {
      setAiMatchedResult({
        matchedSku: 'RT-RS-305',
        matchedTitle: 'Колодка тормозная композиционная 25610-Н',
        confidence: 97.4,
        gost: 'ГОСТ 30249-97',
      });
    } else if (lower.includes('стрел') || lower.includes('сп-6') || lower.includes('привод')) {
      setAiMatchedResult({
        matchedSku: 'RT-SCB-001',
        matchedTitle: 'Электропривод стрелочный СП-6М',
        confidence: 96.1,
        gost: 'ГОСТ 12.2.007.0-75',
      });
    } else if (lower.includes('колес') || lower.includes('ру1ш') || lower.includes('пара')) {
      setAiMatchedResult({
        matchedSku: 'RT-RS-102',
        matchedTitle: 'Колесная пара РУ1Ш-957-Г в сборе с буксами',
        confidence: 98.6,
        gost: 'ГОСТ 4835-2013',
      });
    } else {
      setAiMatchedResult({
        matchedSku: 'RT-RS-118',
        matchedTitle: 'Тележка двухосная грузового вагона 18-100',
        confidence: 95.2,
        gost: 'ГОСТ 9246-2013',
      });
    }
  };

  const openRequestWithSubject = (subj: string) => {
    setModalSubject(subj);
    setModalOpen(true);
  };

  const availableModes: AppMode[] = ['SUPPLY', 'CONTRACT', 'DIGITAL', 'PROJECTS'];

  return (
    <div className="min-h-screen cad-grid-bg text-[#0A0A0A] flex flex-col justify-between selection:bg-[#0A0A0A] selection:text-white">
      {/* 1. TOP STATUS & TRUST STRIP */}
      <header className="border-b border-[#0A0A0A] px-4 md:px-8 py-2.5 flex flex-wrap justify-between items-center text-xs font-mono bg-[#D4D8DC] sticky top-0 z-40">
        <div className="flex items-center gap-3 md:gap-5 flex-wrap">
          <span className="font-bold tracking-tight text-sm">ООО «RailTech»</span>
          <span className="text-[#4A5056]">—</span>
          <span className="font-medium">Ташкент, Узбекистан</span>
          <span className="hidden md:inline text-[#4A5056]">·</span>
          <span className="hidden md:inline font-mono text-[11px] text-[#4A5056]">Комплекс Index, Блок B2-2097</span>
          <span className="border border-[#0A0A0A] px-1.5 py-0.5 text-[10px] bg-white font-bold tracking-wider">
            Резидент РУз · НДС 12%
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-6 mt-1 sm:mt-0 flex-wrap">
          {/* Language Selector */}
          <div className="flex items-center border border-[#0A0A0A] p-0.5 bg-white/70">
            {(['ru', 'uz', 'en'] as const).map((loc) => {
              const isCurrent = locale === loc;
              return (
                <button
                  key={loc}
                  onClick={() => handleLocaleChange(loc)}
                  className={`px-2.5 py-0.5 text-[10px] font-mono uppercase transition-colors ${
                    isCurrent
                      ? 'bg-[#0A0A0A] text-white font-bold'
                      : 'bg-transparent text-[#0A0A0A] hover:bg-[#0A0A0A]/10'
                  }`}
                >
                  {loc.toUpperCase()}
                </button>
              );
            })}
          </div>

          <a
            href="https://b2b.railtech.uz"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-[#0A0A0A] px-3 py-1 bg-white hover:bg-[#0A0A0A] hover:text-white transition-colors font-bold text-[11px]"
          >
            B2B.RAILTECH.UZ ↗
          </a>
          <a href="tel:+998901189000" className="text-[#0A0A0A] font-bold text-xs hover:underline">
            +998 90 118-90-00
          </a>
        </div>
      </header>

      {/* 2. HERO STATEMENT & MAIN NAVIGATION TABS */}
      <section className="px-4 md:px-8 pt-8 pb-6 border-b border-[#0A0A0A]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
            <div className="max-w-4xl">
              <div className="font-mono text-xs uppercase text-[#4A5056] tracking-wider mb-2">
                B2B & B2G ЖЕЛЕЗНОДОРОЖНЫЙ ОПЕРАТОР В РЕСПУБЛИКЕ УЗБЕКИСТАН
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-[#0A0A0A]">
                Поставки ЖД оборудования, контрактный ВЭД и цифровые системы
              </h1>
              <p className="text-sm md:text-base text-[#4A5056] mt-3 leading-relaxed">
                Собственный распределительный склад в Ташкенте (комплекс Index, B2-2097). 1 240+ позиций номенклатуры в наличии, расчет Landed Cost DDP в сумах с НДС 12%, прямые контракты с 86+ заводами Китая, ЕС и СНГ.
              </p>
            </div>

            {/* Quick Spec Upload CTA */}
            <div className="shrink-0 space-y-2">
              <button
                onClick={() => openRequestWithSubject('Экспресс-расчет спецификации')}
                className="w-full sm:w-auto px-6 py-3.5 bg-[#0A0A0A] text-white font-mono text-xs uppercase font-bold tracking-wider hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <span>+ Загрузить ведомость (.XLSX / .PDF)</span>
                <span>↗</span>
              </button>
              <div className="text-[10px] font-mono text-[#4A5056] text-center sm:text-right">
                Оценка КП и подбор аналогов за 30-48 минут
              </div>
            </div>
          </div>

          {/* 4 HIGH-IMPACT MODE TABS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 border-t border-[#0A0A0A]/20 pt-4">
            {availableModes.map((modeKey, idx) => {
              const isActive = activeMode === modeKey;
              const mode = currentModes[modeKey];
              return (
                <button
                  key={modeKey}
                  onClick={() => {
                    setActiveMode(modeKey);
                    setActiveToolIdx(0);
                  }}
                  className={`p-3.5 text-left border transition-all ${
                    isActive
                      ? 'border-[#0A0A0A] bg-[#0A0A0A] text-white shadow-md'
                      : 'border-[#0A0A0A]/40 bg-white/50 hover:bg-white hover:border-[#0A0A0A] text-[#0A0A0A]'
                  }`}
                >
                  <div className="flex justify-between items-center font-mono text-[11px] mb-1">
                    <span className="font-bold">0{idx + 1} // {mode.label}</span>
                    <span className={isActive ? 'text-white' : 'text-[#4A5056]'}>→</span>
                  </div>
                  <div className="text-sm font-bold truncate">{mode.shortTitle}</div>
                  <div className={`text-[11px] mt-1 line-clamp-1 ${isActive ? 'text-white/70' : 'text-[#4A5056]'}`}>
                    {mode.topBarStatus}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. ACTIVE UNIFIED WORKSTATION WORKBENCH */}
      <section className="px-4 md:px-8 py-8 border-b border-[#0A0A0A]">
        <div className="max-w-7xl mx-auto">
          {/* ==================== A. WORKSPACE FOR .SUPPLY (СКЛАД ТАШКЕНТ) ==================== */}
          {activeMode === 'SUPPLY' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column (5 cols): 3D CAD/Blueprint Assembly Viewport */}
              <div className="lg:col-span-5 border border-[#0A0A0A] bg-[#DCE0E4]/60 p-4 space-y-4">
                <div className="flex justify-between items-center font-mono text-xs border-b border-[#0A0A0A]/20 pb-2">
                  <span className="font-bold">{currentConfig.modelName}</span>
                  <span className="text-[#4A5056]">{currentConfig.modelScale}</span>
                </div>

                {/* 3D Canvas */}
                <div className="bg-[#D4D8DC] border border-[#0A0A0A]/30">
                  <WireframeViewport
                    modelType={currentConfig.modelType}
                    rotationDeg={rotationDeg}
                    onRotationChange={setRotationDeg}
                    pitchDeg={pitchDeg}
                    onPitchChange={setPitchDeg}
                    selectedHotspotId={selectedSkuCode}
                  />
                </div>

                {/* Selected Part Technical Card */}
                <div className="border border-[#0A0A0A] bg-white p-3.5 space-y-2 font-mono text-xs">
                  <div className="flex justify-between items-center text-[10px] text-[#4A5056] border-b border-[#0A0A0A]/15 pb-1">
                    <span>КАРТОЧКА ДЕТАЛИ СО СКЛАДА INDEX</span>
                    <span className="bg-[#0A0A0A] text-white px-1.5 py-0.5 font-bold">
                      {selectedItem.sku}
                    </span>
                  </div>
                  <div className="font-sans text-base font-bold text-[#0A0A0A]">
                    {selectedItem.title}
                  </div>
                  <div className="text-xs text-[#4A5056]">
                    {selectedItem.specs}
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#0A0A0A]/15 text-[11px]">
                    <div>
                      <span className="text-[#4A5056]">Стандарт:</span>{' '}
                      <span className="font-bold">{selectedItem.gost}</span>
                    </div>
                    <div>
                      <span className="text-[#4A5056]">ТН ВЭД:</span>{' '}
                      <span className="font-bold">{selectedItem.tnved}</span>
                    </div>
                    <div>
                      <span className="text-[#4A5056]">Склад:</span>{' '}
                      <span className="font-bold">{selectedItem.warehouse}</span>
                    </div>
                    <div>
                      <span className="text-[#4A5056]">Наличие:</span>{' '}
                      <span className="font-bold text-green-700">{selectedItem.status}</span>
                    </div>
                  </div>
                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={() =>
                        openRequestWithSubject(
                          `Запрос счета на ${selectedItem.sku} — ${selectedItem.title}`
                        )
                      }
                      className="w-full py-2 bg-[#0A0A0A] text-white font-mono text-xs uppercase font-bold hover:opacity-90"
                    >
                      Выставить счет с НДС 12% ↗
                    </button>
                  </div>
                </div>

                {/* Trust Information */}
                <div className="font-mono text-[10px] text-[#4A5056] space-y-1">
                  <div>✓ Официальный плательщик НДС 12% в РУз (Резидент РУз)</div>
                  <div>✓ Прямой договор поставки в сумах (UZS) со склада в Ташкенте</div>
                  <div>✓ Паспорта заводов-изготовителей и сертификаты соответствия «Узстандарт»</div>
                </div>
              </div>

              {/* Right Column (7 cols): Full Interactive Inventory Table & Filter */}
              <div className="lg:col-span-7 space-y-4">
                {/* Category Tool Pills */}
                <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                  {currentConfig.tools.map((tool, idx) => {
                    const isSelected = activeToolIdx === idx;
                    return (
                      <button
                        key={tool.code}
                        onClick={() => setActiveToolIdx(idx)}
                        className={`px-3 py-1.5 border transition-all text-xs ${
                          isSelected
                            ? 'bg-[#0A0A0A] text-white border-[#0A0A0A] font-bold shadow-xs'
                            : 'bg-white/70 text-[#0A0A0A] border-[#0A0A0A]/40 hover:border-[#0A0A0A]'
                        }`}
                      >
                        [{tool.code}] {tool.name}
                      </button>
                    );
                  })}
                </div>

                {/* Search Bar */}
                <div className="flex items-center border border-[#0A0A0A] bg-white">
                  <span className="px-3 font-mono text-xs text-[#4A5056]">ПОИСК //</span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Поиск по артикулу (напр. РУ1Ш, 18-100, СП-6М), ГОСТ или названию..."
                    className="w-full py-2.5 pr-3 bg-transparent text-xs font-mono focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="px-3 font-mono text-xs text-[#4A5056] hover:text-[#0A0A0A]"
                    >
                      ✕
                    </button>
                  )}
                  <span className="px-3 text-[10px] font-mono text-[#4A5056] border-l border-[#0A0A0A]/20">
                    {filteredSkus.length} ПОЗИЦИЙ
                  </span>
                </div>

                {/* High-Density Catalog Table */}
                <div className="overflow-x-auto border border-[#0A0A0A] bg-white">
                  <table className="w-full text-left border-collapse font-mono text-xs">
                    <thead>
                      <tr className="border-b border-[#0A0A0A] bg-[#0A0A0A] text-white uppercase text-[11px]">
                        <th className="py-2.5 px-3">Код SKU</th>
                        <th className="py-2.5 px-3">Наименование детали / узла</th>
                        <th className="py-2.5 px-3">ГОСТ / ТУ</th>
                        <th className="py-2.5 px-3">ТН ВЭД</th>
                        <th className="py-2.5 px-3">Статус</th>
                        <th className="py-2.5 px-3 text-right">Действие</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#0A0A0A]/15">
                      {filteredSkus.map((sku) => {
                        const isSelected = selectedSkuCode === sku.sku;
                        return (
                          <tr
                            key={sku.sku}
                            onClick={() => setSelectedSkuCode(sku.sku)}
                            className={`cursor-pointer transition-colors ${
                              isSelected ? 'bg-[#DCE0E4] font-medium' : 'hover:bg-[#F0F2F4]'
                            }`}
                          >
                            <td className="py-2.5 px-3 font-bold text-[#0A0A0A]">
                              <span className={isSelected ? 'underline' : ''}>{sku.sku}</span>
                            </td>
                            <td className="py-2.5 px-3 font-sans">
                              <div className="font-bold leading-snug">{sku.title}</div>
                              <div className="text-[11px] font-mono text-[#4A5056]">{sku.specs}</div>
                            </td>
                            <td className="py-2.5 px-3 text-[11px]">{sku.gost}</td>
                            <td className="py-2.5 px-3 text-[11px]">{sku.tnved}</td>
                            <td className="py-2.5 px-3">
                              <span
                                className={`inline-block px-1.5 py-0.5 text-[10px] uppercase border border-[#0A0A0A] ${
                                  sku.statusKey === 'in_stock'
                                    ? 'bg-[#0A0A0A] text-white'
                                    : 'bg-transparent text-[#0A0A0A]'
                                }`}
                              >
                                {sku.status}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openRequestWithSubject(`Запрос счета на ${sku.sku}: ${sku.title}`);
                                }}
                                className="underline hover:no-underline font-bold text-[11px]"
                              >
                                [Счет с НДС]
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between items-center text-[11px] font-mono text-[#4A5056]">
                  <span>Складской комплекс Index, офис B2-2097 (г. Ташкент)</span>
                  <span>* Цены и наличие подтверждаются за 15 минут</span>
                </div>
              </div>
            </div>
          )}

          {/* ==================== B. WORKSPACE FOR .CONTRACT (ВЭД ПОД КЛЮЧ) ==================== */}
          {activeMode === 'CONTRACT' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column (5 cols): 3D Container & Sourcing Network */}
              <div className="lg:col-span-5 border border-[#0A0A0A] bg-[#DCE0E4]/60 p-4 space-y-4">
                <div className="flex justify-between items-center font-mono text-xs border-b border-[#0A0A0A]/20 pb-2">
                  <span className="font-bold">{currentConfig.modelName}</span>
                  <span className="text-[#4A5056]">{currentConfig.modelScale}</span>
                </div>

                <div className="bg-[#D4D8DC] border border-[#0A0A0A]/30">
                  <WireframeViewport
                    modelType={currentConfig.modelType}
                    rotationDeg={rotationDeg}
                    onRotationChange={setRotationDeg}
                    pitchDeg={pitchDeg}
                    onPitchChange={setPitchDeg}
                  />
                </div>

                <div className="border border-[#0A0A0A] bg-white p-3.5 space-y-2.5 font-mono text-xs">
                  <div className="font-bold uppercase border-b border-[#0A0A0A]/15 pb-1">
                    ГЕОГРАФИЯ И ТРАНСПОРТНЫЕ КОРИДОРЫ
                  </div>
                  <div className="text-[11px] text-[#4A5056] leading-relaxed">
                    Прямые выходы на 86+ заводов-производителей Китая, стран ЕС, СНГ и Турции. Организуем доставку 40ft контейнерами, автотралами и спецвагонами с таможенной очисткой на посту «Арк-Булок» в Ташкенте.
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px] pt-1 border-t border-[#0A0A0A]/15">
                    <div>Срок сорсинга: <strong>48 часов</strong></div>
                    <div>Таможня: <strong>1-2 дня</strong></div>
                    <div>Валюта: <strong>UZS с НДС 12%</strong></div>
                    <div>Страхование: <strong>100% груза</strong></div>
                  </div>
                </div>
              </div>

              {/* Right Column (7 cols): Landed Cost Calculator & 4 Turnkey Stages */}
              <div className="lg:col-span-7 space-y-6">
                {/* Landed Cost Interactive Box */}
                <div className="border border-[#0A0A0A] bg-white p-5 space-y-4">
                  <div className="flex justify-between items-center border-b border-[#0A0A0A] pb-3">
                    <div>
                      <div className="font-mono text-xs text-[#4A5056] uppercase">ИНТЕРАКТИВНЫЙ КАЛЬКУЛЯТОР ВЭД</div>
                      <div className="text-xl font-bold">Расчет Landed Cost DDP Ташкент (НДС 12%)</div>
                    </div>
                    <span className="border border-[#0A0A0A] px-2 py-1 text-xs font-mono font-bold bg-[#D4D8DC]">
                      ИНКОТЕРМС 2020: DDP
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 font-mono text-xs">
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-[#4A5056]">Инвойсная стоимость ($):</span>
                        <span className="font-bold">${invoiceUsd.toLocaleString()} USD</span>
                      </div>
                      <input
                        type="range"
                        min="2000"
                        max="250000"
                        step="1000"
                        value={invoiceUsd}
                        onChange={(e) => setInvoiceUsd(Number(e.target.value))}
                        className="cad-slider"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-[#4A5056]">Таможенная пошлина:</span>
                        <span className="font-bold">{dutyRate}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="20"
                        value={dutyRate}
                        onChange={(e) => setDutyRate(Number(e.target.value))}
                        className="cad-slider"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-b border-[#0A0A0A]/15 py-2 font-mono text-xs">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={vatEnabled}
                        onChange={(e) => setVatEnabled(e.target.checked)}
                        className="accent-[#0A0A0A] w-4 h-4 cursor-pointer"
                      />
                      <span className="font-semibold">Учитывать НДС 12% Республики Узбекистан</span>
                    </label>
                    <span className="text-[10px] text-[#4A5056]">Официальный вычет НДС</span>
                  </div>

                  {/* Cost Breakdown */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-center text-xs">
                    <div className="border border-[#0A0A0A]/20 p-2 bg-[#DCE0E4]/40">
                      <div className="text-[10px] text-[#4A5056]">ИНВОЙС</div>
                      <div className="font-bold mt-1">${invoiceUsd.toLocaleString()}</div>
                    </div>
                    <div className="border border-[#0A0A0A]/20 p-2 bg-[#DCE0E4]/40">
                      <div className="text-[10px] text-[#4A5056]">ФРАХТ (~8%)</div>
                      <div className="font-bold mt-1">${logisticsCost.toLocaleString()}</div>
                    </div>
                    <div className="border border-[#0A0A0A]/20 p-2 bg-[#DCE0E4]/40">
                      <div className="text-[10px] text-[#4A5056]">ПОШЛИНА</div>
                      <div className="font-bold mt-1">${dutyAmount.toLocaleString()}</div>
                    </div>
                    <div className="border border-[#0A0A0A]/20 p-2 bg-[#DCE0E4]/40">
                      <div className="text-[10px] text-[#4A5056]">НДС 12%</div>
                      <div className="font-bold mt-1">${vatAmount.toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="border border-[#0A0A0A] p-3.5 bg-[#DCE0E4] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="text-[10px] font-mono uppercase text-[#4A5056]">
                        ИТОГОВАЯ ТВЕРДАЯ ЦЕНА DDP ТАШКЕНТ С ДОСТАВКОЙ:
                      </div>
                      <div className="text-2xl font-bold font-sans text-[#0A0A0A]">
                        ${totalDdpUsd.toLocaleString()} USD
                      </div>
                      <div className="text-xs font-mono text-[#4A5056]">
                        ≈ {totalDdpUzs.toLocaleString()} UZS (по курсу ЦБ РУз)
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        openRequestWithSubject(
                          `Расчет DDP Ташкент на партию $${invoiceUsd} (пошлина ${dutyRate}%)`
                        )
                      }
                      className="px-5 py-3 bg-[#0A0A0A] text-white font-mono text-xs uppercase font-bold hover:opacity-90 transition-opacity shrink-0"
                    >
                      Получить коммерческое предложение ↗
                    </button>
                  </div>
                </div>

                {/* 4 Execution Steps */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {CONTRACT_STEPS[locale].map((step) => (
                    <div key={step.code} className="border border-[#0A0A0A] p-3.5 bg-white space-y-1.5">
                      <div className="flex justify-between text-[10px] font-mono text-[#4A5056]">
                        <span className="font-bold text-[#0A0A0A]">{step.code}</span>
                        <span>{step.tag}</span>
                      </div>
                      <div className="font-bold text-xs">{step.title}</div>
                      <div className="text-[11px] text-[#4A5056] leading-snug">{step.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==================== C. WORKSPACE FOR .DIGITAL (IT-ПРОДУКТЫ & AI) ==================== */}
          {activeMode === 'DIGITAL' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column (5 cols): 3D Network Topology & Stack */}
              <div className="lg:col-span-5 border border-[#0A0A0A] bg-[#DCE0E4]/60 p-4 space-y-4">
                <div className="flex justify-between items-center font-mono text-xs border-b border-[#0A0A0A]/20 pb-2">
                  <span className="font-bold">{currentConfig.modelName}</span>
                  <span className="text-[#4A5056]">{currentConfig.modelScale}</span>
                </div>

                <div className="bg-[#D4D8DC] border border-[#0A0A0A]/30">
                  <WireframeViewport
                    modelType={currentConfig.modelType}
                    rotationDeg={rotationDeg}
                    onRotationChange={setRotationDeg}
                    pitchDeg={pitchDeg}
                    onPitchChange={setPitchDeg}
                  />
                </div>

                <div className="border border-[#0A0A0A] bg-white p-3.5 space-y-2 font-mono text-xs">
                  <div className="font-bold uppercase border-b border-[#0A0A0A]/15 pb-1">
                    ТЕХНИЧЕСКИЙ СТЕК РАЗРАБОТКИ
                  </div>
                  <div className="text-[11px] text-[#4A5056] leading-relaxed">
                    Проектируем и запускаем защищенные корпоративные порталы, WMS-системы и калькуляторы ВЭД. Полная интеграция с 1C (CommerceML), Soliq.uz, Didox и Telegram.
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1 text-[10px]">
                    <span className="border border-[#0A0A0A] px-1.5 py-0.5">TypeScript</span>
                    <span className="border border-[#0A0A0A] px-1.5 py-0.5">React / Next.js</span>
                    <span className="border border-[#0A0A0A] px-1.5 py-0.5">Python / FastAPI</span>
                    <span className="border border-[#0A0A0A] px-1.5 py-0.5">PostgreSQL</span>
                    <span className="border border-[#0A0A0A] px-1.5 py-0.5">Docker / K8s</span>
                  </div>
                </div>
              </div>

              {/* Right Column (7 cols): Flagship Products & Smart Match AI Demo */}
              <div className="lg:col-span-7 space-y-6">
                {/* Flagship B2B Platform */}
                <div className="border border-[#0A0A0A] bg-white p-5 space-y-3">
                  <div className="flex justify-between items-center border-b border-[#0A0A0A] pb-2.5">
                    <span className="bg-[#0A0A0A] text-white px-2 py-0.5 font-mono text-xs font-bold">
                      PROD 01 // PRODUCTION SAAS
                    </span>
                    <span className="text-xs font-mono font-bold text-green-700">● LIVE IN PRODUCTION</span>
                  </div>
                  <h3 className="text-xl font-bold">Цифровая экосистема B2B.RailTech.uz</h3>
                  <p className="text-xs text-[#4A5056] leading-relaxed">
                    Собственная промышленная B2B-платформа управления закупками и снабжением. 1 200+ позиций ЖД номенклатуры в базе, онлайн-калькулятор Landed Cost, KYC-верификация партнеров в РУз и автогенерация коммерческих предложений за 1 клик.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-3">
                    <a
                      href="https://b2b.railtech.uz"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 bg-[#0A0A0A] text-white font-mono text-xs uppercase font-bold hover:opacity-90 inline-block"
                    >
                      Открыть B2B.RailTech.uz ↗
                    </a>
                    <button
                      onClick={() => openRequestWithSubject('Демо-доступ к B2B платформе')}
                      className="px-4 py-2.5 border border-[#0A0A0A] font-mono text-xs uppercase font-bold hover:bg-[#0A0A0A] hover:text-white transition-colors"
                    >
                      Запросить презентацию
                    </button>
                  </div>
                </div>

                {/* Smart Match AI Live Tester */}
                <div className="border border-[#0A0A0A] bg-white p-5 space-y-3">
                  <div className="flex justify-between items-center border-b border-[#0A0A0A]/20 pb-2">
                    <span className="font-mono text-xs font-bold text-[#0A0A0A]">
                      PROD 02 // SMART MATCH AI PARSER
                    </span>
                    <span className="font-mono text-xs text-[#4A5056]">ТОЧНОСТЬ: 94.2%</span>
                  </div>
                  <div className="text-xs text-[#4A5056]">
                    Интеллектуальный парсинг неструктурированных Excel ведомостей и текстовых заявок сопоставляет позиции с каталогом ГОСТ:
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={aiSampleInput}
                      onChange={(e) => setAiSampleInput(e.target.value)}
                      placeholder="Введите неструктурированный текст ТЗ..."
                      className="w-full bg-[#DCE0E4] border border-[#0A0A0A] px-3 py-2 text-xs font-mono focus:outline-none focus:bg-white"
                    />
                    <button
                      onClick={() => handleRunAiMatch(aiSampleInput)}
                      className="px-4 py-2 bg-[#0A0A0A] text-white font-mono text-xs uppercase font-bold hover:opacity-90 shrink-0"
                    >
                      Распознать
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
                    <span className="text-[#4A5056]">Примеры для теста:</span>
                    <button
                      onClick={() => handleRunAiMatch('Колодка тормозная 25610-Н 500шт')}
                      className="border border-[#0A0A0A] px-2 py-0.5 hover:bg-[#0A0A0A] hover:text-white"
                    >
                      Колодки 25610
                    </button>
                    <button
                      onClick={() => handleRunAiMatch('Привод СП-6М стрелочный перевод')}
                      className="border border-[#0A0A0A] px-2 py-0.5 hover:bg-[#0A0A0A] hover:text-white"
                    >
                      Привод СП-6М
                    </button>
                    <button
                      onClick={() => handleRunAiMatch('Колесная пара РУ1Ш-957-Г под вагон')}
                      className="border border-[#0A0A0A] px-2 py-0.5 hover:bg-[#0A0A0A] hover:text-white"
                    >
                      Колесная пара
                    </button>
                  </div>

                  {aiMatchedResult && (
                    <div className="border border-[#0A0A0A] p-3 bg-[#DCE0E4] space-y-1 font-mono text-xs">
                      <div className="flex justify-between">
                        <span className="font-bold text-[#0A0A0A]">{aiMatchedResult.matchedSku}</span>
                        <span className="bg-[#0A0A0A] text-white px-1.5 py-0.2 text-[10px] font-bold">
                          СОВПАДЕНИЕ: {aiMatchedResult.confidence}%
                        </span>
                      </div>
                      <div className="font-sans font-bold text-sm text-[#0A0A0A]">
                        {aiMatchedResult.matchedTitle}
                      </div>
                      <div className="text-[11px] text-[#4A5056]">{aiMatchedResult.gost}</div>
                    </div>
                  )}

                  <button
                    onClick={() => openRequestWithSubject('Интеграция Smart Match AI в нашу систему')}
                    className="w-full py-2 border border-[#0A0A0A] font-mono text-xs uppercase font-bold hover:bg-[#0A0A0A] hover:text-white transition-colors"
                  >
                    Заказать интеграцию ИИ-парсера в вашу 1С / ERP ↗
                  </button>
                </div>

                {/* Additional Enterprise Services from DIGITAL_PRODUCTS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {DIGITAL_PRODUCTS[locale].slice(2).map((prod) => (
                    <div key={prod.code} className="border border-[#0A0A0A] p-3.5 bg-white space-y-1.5 font-mono text-xs">
                      <div className="flex justify-between text-[10px] text-[#4A5056]">
                        <span className="font-bold text-[#0A0A0A]">{prod.code}</span>
                        <span>{prod.tag}</span>
                      </div>
                      <div className="font-bold text-xs font-sans">{prod.title}</div>
                      <div className="text-[11px] text-[#4A5056] leading-snug">{prod.description}</div>
                      <button
                        onClick={() => openRequestWithSubject(`Запрос услуги: ${prod.title}`)}
                        className="text-[11px] font-bold underline hover:no-underline pt-1 inline-block"
                      >
                        Запросить ТЗ ↗
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==================== D. WORKSPACE FOR .PROJECTS (СПЕЦПРОЕКТЫ & АРТ) ==================== */}
          {activeMode === 'PROJECTS' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column (5 cols): 3D Hypercube Installation */}
              <div className="lg:col-span-5 border border-[#0A0A0A] bg-[#DCE0E4]/60 p-4 space-y-4">
                <div className="flex justify-between items-center font-mono text-xs border-b border-[#0A0A0A]/20 pb-2">
                  <span className="font-bold">{currentConfig.modelName}</span>
                  <span className="text-[#4A5056]">{currentConfig.modelScale}</span>
                </div>

                <div className="bg-[#D4D8DC] border border-[#0A0A0A]/30">
                  <WireframeViewport
                    modelType={currentConfig.modelType}
                    rotationDeg={rotationDeg}
                    onRotationChange={setRotationDeg}
                    pitchDeg={pitchDeg}
                    onPitchChange={setPitchDeg}
                  />
                </div>

                <div className="border border-[#0A0A0A] bg-white p-3.5 space-y-2 font-mono text-xs">
                  <div className="font-bold uppercase border-b border-[#0A0A0A]/15 pb-1">
                    ФИЛОСОФИЯ ИНЖИНИРИНГА И ИСКУССТВА
                  </div>
                  <p className="text-[11px] text-[#4A5056] leading-relaxed">
                    Мы убеждены, что точная инженерия и высокое визуальное искусство строятся на одних и тех же фундаментальных законах пропорций, баланса и формы. RailTech инвестирует ресурсы в сохранение культурного наследия и меценатство.
                  </p>
                </div>
              </div>

              {/* Right Column (7 cols): Projects Showcase */}
              <div className="lg:col-span-7 space-y-4">
                {PROJECTS_PORTFOLIO[locale].map((proj) => (
                  <div key={proj.code} className="border border-[#0A0A0A] bg-white p-5 space-y-2.5">
                    <div className="flex justify-between items-center font-mono text-xs text-[#4A5056] border-b border-[#0A0A0A]/15 pb-2">
                      <span className="font-bold text-[#0A0A0A]">{proj.code}</span>
                      <span>{proj.tag}</span>
                    </div>
                    <h3 className="text-lg font-bold">{proj.title}</h3>
                    <div className="text-xs font-mono text-[#4A5056]">{proj.subtitle}</div>
                    <p className="text-xs text-[#0A0A0A]/90 leading-relaxed">{proj.description}</p>
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#0A0A0A]/10 font-mono text-[10px]">
                      {proj.metrics.map((m) => (
                        <span key={m} className="border border-[#0A0A0A] px-2 py-0.5 bg-[#D4D8DC]">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => openRequestWithSubject('Сотрудничество по спецпроектам и арт-лаборатории')}
                  className="w-full py-3 bg-[#0A0A0A] text-white font-mono text-xs uppercase font-bold hover:opacity-90 transition-opacity"
                >
                  Предложить проект / Связаться с куратором ↗
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4. TECHNICAL FOOTER & CONTACTS */}
      <footer className="px-4 md:px-8 py-8 font-mono text-xs bg-[#C8CDD2]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <div className="font-bold text-sm mb-1.5">ООО «RailTech»</div>
            <p className="text-[#4A5056] text-[11px] leading-relaxed">
              {t.footer.companyDesc}
            </p>
            <div className="mt-2 text-[10px] text-[#0A0A0A] font-bold">
              Резидент РУз · Плательщик НДС 12%
            </div>
          </div>
          <div>
            <div className="uppercase text-[#4A5056] mb-1.5">{t.footer.headquarters}</div>
            <div>{t.footer.hqAddress1}</div>
            <div>{t.footer.hqAddress2}</div>
            <div className="mt-1">{t.footer.phoneLabel} +998 90 118-90-00</div>
            <div>{t.footer.emailLabel} info@railtech.uz</div>
          </div>
          <div>
            <div className="uppercase text-[#4A5056] mb-1.5">{t.footer.ecosystem}</div>
            <ul className="space-y-1">
              <li>
                <a href="https://b2b.railtech.uz" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline font-bold">
                  {t.footer.b2bPortal} ↗
                </a>
              </li>
              <li>
                <a href="/admin/" className="underline hover:no-underline">
                  {t.footer.cmsAdmin}
                </a>
              </li>
            </ul>
          </div>
          <div className="md:text-right flex flex-col justify-between">
            <div>
              <span className="border border-[#0A0A0A] px-2 py-1 text-[10px] bg-white font-bold">
                {t.footer.systemStatus}
              </span>
            </div>
            <div className="text-[#4A5056] text-[10px] mt-4">
              {t.footer.copyright}
            </div>
          </div>
        </div>
      </footer>

      {/* Modal Window */}
      <LeadModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialSubject={modalSubject}
        locale={locale}
      />
    </div>
  );
};
