import React, { useState, useEffect } from 'react';
import { CadInspector } from './CadInspector';
import { withBase } from '../../utils/url';
import type { Lang } from '../../i18n/ui';

interface Props {
  sku: string;
  title: string;
  title_uz?: string;
  title_en?: string;
  gost: string;
  subsystem: string;
  subsystem_uz?: string;
  subsystem_en?: string;
  specs: string;
  specs_uz?: string;
  specs_en?: string;
  drawingNumber?: string;
  modelType?: 'bogie' | 'container' | 'network' | 'hypercube';
  image?: string;
}

export const ProductMediaGallery: React.FC<Props> = ({
  sku,
  title,
  title_uz,
  title_en,
  gost,
  subsystem,
  subsystem_uz,
  subsystem_en,
  specs,
  specs_uz,
  specs_en,
  drawingNumber,
  modelType = 'bogie',
  image,
}) => {
  const [lang, setLang] = useState<Lang>('ru');
  const [activeTab, setActiveTab] = useState<'PHOTO' | 'BLUEPRINT' | '3D_CAD'>('PHOTO');

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

  const curTitle = lang === 'uz' ? (title_uz || title) : lang === 'en' ? (title_en || title) : title;
  const curSubsystem = lang === 'uz' ? (subsystem_uz || subsystem) : lang === 'en' ? (subsystem_en || subsystem) : subsystem;
  const curSpecs = lang === 'uz' ? (specs_uz || specs) : lang === 'en' ? (specs_en || specs) : specs;

  // Realistic drawing number fallback based on SKU
  const resolvedDrawing = drawingNumber || (
    sku === 'RT-RS-118' ? 'Чертеж 100.00.000-0сб' :
    sku === 'RT-RS-102' ? 'Чертеж РУ1Ш-957-Г (ГОСТ 4835)' :
    sku === 'RT-RS-208' ? 'Чертеж 106.01.000-0сб' :
    sku === 'RT-RS-305' ? 'Чертеж 25610-Н (ГОСТ 30249)' :
    sku === 'RT-SCB-001' ? 'Чертеж СП-6М ТУ 32 ЦШ 2045-98' :
    sku === 'RT-SCB-014' ? 'Чертеж ПОБС-2А ТУ 32 ЦШ 2038-95' :
    sku === 'RT-TRK-401' ? 'Чертеж Скрепление КБ-65 ЦП-328' :
    sku === 'RT-TRK-419' ? 'Чертеж Башмак 8739.000' :
    sku === 'RT-KIP-045' ? 'Формуляр ПР-УПМ ТУ 32 ЦШ 45-2018' :
    'Чертеж ПС-70Е ГОСТ 6490-93'
  );

  return (
    <div className="border-2 border-[#0A0A0A] bg-[#D4D8DC] font-mono select-none">
      {/* Media Navigation Tabs */}
      <div className="border-b border-[#0A0A0A] px-3 py-2 bg-[#C8CDD2] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-1 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('PHOTO')}
            className={`border border-[#0A0A0A] px-3 py-1 font-bold transition-colors cursor-pointer ${
              activeTab === 'PHOTO'
                ? 'bg-[#0A0A0A] text-white'
                : 'bg-white text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white'
            }`}
          >
            {lang === 'uz' ? '📷 MAHSULOT FOTOSI' : lang === 'en' ? '📷 PRODUCT PHOTO' : '📷 ФОТО ИЗДЕЛИЯ'}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('BLUEPRINT')}
            className={`border border-[#0A0A0A] px-3 py-1 font-bold transition-colors cursor-pointer ${
              activeTab === 'BLUEPRINT'
                ? 'bg-[#0A0A0A] text-white'
                : 'bg-white text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white'
            }`}
          >
            {lang === 'uz' ? '📐 GOST CHIZMASI' : lang === 'en' ? '📐 BLUEPRINT DRAWING' : '📐 ЧЕРТЕЖ ПО ГОСТ'}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('3D_CAD')}
            className={`border border-[#0A0A0A] px-3 py-1 font-bold transition-colors cursor-pointer ${
              activeTab === '3D_CAD'
                ? 'bg-[#0A0A0A] text-white'
                : 'bg-white text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white'
            }`}
          >
            🎲 3D CAD
          </button>
        </div>

        <div className="text-[10px] text-[#4A5056] hidden sm:block">
          {resolvedDrawing}
        </div>
      </div>

      {/* Main Display Area */}
      <div className="relative min-h-[360px] md:min-h-[420px] bg-[#E2E6EA] flex items-center justify-center p-4 overflow-hidden">
        {/* TAB 1: PRODUCT PHOTO & FACTORY SPECIMEN */}
        {activeTab === 'PHOTO' && (
          <div className="w-full h-full flex flex-col items-center justify-between">
            <div className="relative w-full max-w-lg aspect-video bg-[#D0D6DC] border border-[#0A0A0A] p-6 flex flex-col items-center justify-center shadow-inner">
              {image ? (
                <img
                  src={withBase(image)}
                  alt={curTitle}
                  className="max-h-48 max-w-full object-contain mx-auto"
                />
              ) : (
                <svg className="w-full h-48 text-[#0A0A0A]" viewBox="0 0 400 220" fill="none" stroke="currentColor">
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(10,10,10,0.08)" strokeWidth="0.8" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  <rect x="30" y="30" width="340" height="160" stroke="#0A0A0A" strokeWidth="2" strokeDasharray="4 4" />
                  <line x1="200" y1="20" x2="200" y2="200" stroke="#0A0A0A" strokeWidth="1" strokeDasharray="2 2" />
                  <line x1="20" y1="110" x2="380" y2="110" stroke="#0A0A0A" strokeWidth="1" strokeDasharray="2 2" />
                  <circle cx="200" cy="110" r="50" stroke="#0A0A0A" strokeWidth="2" />
                  <text x="200" y="115" textAnchor="middle" fill="#0A0A0A" fontSize="12" fontFamily="monospace" fontWeight="bold">
                    {sku}
                  </text>
                  <text x="200" y="175" textAnchor="middle" fill="#4A5056" fontSize="10" fontFamily="monospace">
                    {gost}
                  </text>
                </svg>
              )}

              {/* Watermark / Calibration stamp */}
              <div className="absolute bottom-2 right-2 border border-[#0A0A0A] px-2 py-0.5 bg-[#C8CDD2]/90 text-[9px] font-mono font-bold text-[#0A0A0A]">
                {lang === 'uz' ? 'OTK NAZORATI: 100%' : lang === 'en' ? 'QC VERIFIED: 100%' : 'ОТК КОНТРОЛЬ: 100%'}
              </div>
            </div>

            <div className="w-full mt-4 flex items-center justify-between text-[11px] text-[#4A5056] px-2">
              <div>
                <span>{lang === 'uz' ? 'STANDART:' : lang === 'en' ? 'STANDARD:' : 'СТАНДАРТ:'} </span>
                <span className="font-bold text-[#0A0A0A]">{gost}</span>
              </div>
              <div>
                <span>{lang === 'uz' ? 'BOJXONA:' : lang === 'en' ? 'HS CODE:' : 'ТАМОЖНЯ:'} </span>
                <span className="font-bold text-[#0A0A0A]">DDP Tashkent (12% VAT)</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TECHNICAL BLUEPRINT */}
        {activeTab === 'BLUEPRINT' && (
          <div className="w-full h-full flex flex-col justify-between">
            <div className="border border-[#0A0A0A] bg-[#2D3748] p-4 text-[#D4D8DC] font-mono text-xs shadow-inner">
              <div className="border-b border-zinc-600 pb-2 mb-3 flex justify-between items-center text-[11px]">
                <span className="text-zinc-400">{lang === 'uz' ? 'STANDART // TEXNIK CHIZMA' : lang === 'en' ? 'ESKD // ENGINEERING BLUEPRINT' : 'ЕСКД // ТЕХНИЧЕСКИЙ ЧЕРТЕЖ'}</span>
                <span className="text-white font-bold">{resolvedDrawing}</span>
              </div>

              <div className="space-y-2 text-[11px] leading-relaxed text-zinc-300">
                <div className="flex justify-between border-b border-zinc-700 pb-1">
                  <span className="text-zinc-400">{lang === 'uz' ? 'Chizma belgisi:' : lang === 'en' ? 'Drawing designation:' : 'Обозначение чертежа:'}</span>
                  <span className="font-bold text-white">{resolvedDrawing}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-700 pb-1">
                  <span className="text-zinc-400">{lang === 'uz' ? 'Koleya kengligi:' : lang === 'en' ? 'Track gauge:' : 'Ширина колеи:'}</span>
                  <span className="font-bold text-white">1520 mm ({gost})</span>
                </div>
                <div className="flex justify-between border-b border-zinc-700 pb-1">
                  <span className="text-zinc-400">{lang === 'uz' ? 'Parametrlar:' : lang === 'en' ? 'Parameters:' : 'Параметры и допуски:'}</span>
                  <span className="text-white">{curSpecs}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-700 pb-1">
                  <span className="text-zinc-400">{lang === 'uz' ? 'Material / Qotishma:' : lang === 'en' ? 'Material / Alloy:' : 'Материал / Сплав:'}</span>
                  <span className="text-white">Сталь 20ГЛ / 20ФЛ ГОСТ 977-88</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">{lang === 'uz' ? 'Sifat nazorati:' : lang === 'en' ? 'Quality control:' : 'Контроль качества:'}</span>
                  <span className="text-emerald-400 font-bold">{lang === 'uz' ? '100% UZD defektoskopiya nazorati' : lang === 'en' ? '100% Ultrasonic non-destructive test' : '100% УЗК контроль литья и осей'}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-[#4A5056] gap-2">
              <span>{lang === 'uz' ? 'Zavod chizmasi DWG / PDF formatida mavjud' : lang === 'en' ? 'Factory blueprint available in DWG / PDF' : 'Заводской чертеж доступен в формате DWG / PDF'}</span>
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent('open-lead-modal', {
                      detail: { subject: `Запрос чертежа ${resolvedDrawing} для ${curTitle} (${sku})` },
                    })
                  );
                }}
                className="border border-[#0A0A0A] bg-[#0A0A0A] text-white px-3 py-1 font-bold hover:bg-transparent hover:text-[#0A0A0A] transition-colors cursor-pointer"
              >
                {lang === 'uz' ? '[ DWG / PDF CHIZMASINI SO\'RASH ]' : lang === 'en' ? '[ REQUEST DWG / PDF BLUEPRINT ]' : '[ ЗАПРОСИТЬ ЧЕРТЕЖ DWG / PDF ]'}
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: 3D CAD INSPECTOR */}
        {activeTab === '3D_CAD' && (
          <div className="w-full">
            <CadInspector
              modelType={modelType}
              title={`${sku} // 3D CAD`}
              subtitle={lang === 'uz' ? '1:1 KO\'LAMDAGI MUHANDISLIK 3D-YIG\'MASI' : lang === 'en' ? '1:1 SCALE ENGINEERING 3D ASSEMBLY' : 'ИНЖЕНЕРНАЯ 3D-СБОРКА В МАСШТАБЕ 1:1'}
            />
          </div>
        )}
      </div>

      {/* Footer Status */}
      <div className="border-t border-[#0A0A0A] px-4 py-2 bg-[#C8CDD2] flex flex-wrap items-center justify-between text-[11px] text-[#4A5056] gap-2">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 bg-emerald-600 inline-block"></span>
          <span>
            {lang === 'uz' ? 'KIRISH NAZORATI: O\'ZBEKISTONDA SERTIFIKATLANGAN // ' : lang === 'en' ? 'INCOMING QC: CERTIFIED IN UZBEKISTAN // ' : 'ВХОДНОЙ КОНТРОЛЬ: СЕРТИФИЦИРОВАНО В РУЗ // '}
            {curSubsystem.toUpperCase()}
          </span>
        </div>
        <div>
          <span>{lang === 'uz' ? 'HAQIQIY OMBOR: ' : lang === 'en' ? 'PHYSICAL HUB: ' : 'ФАКТИЧЕСКИЙ СКЛАД: '}</span>
          <span className="text-[#0A0A0A] font-bold">ТАШКЕНТ (INDEX B2-2097)</span>
        </div>
      </div>
    </div>
  );
};
