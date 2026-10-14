import React, { useState } from 'react';
import { CadInspector } from './CadInspector';

interface Props {
  sku: string;
  title: string;
  gost: string;
  subsystem: string;
  specs: string;
  drawingNumber?: string;
  modelType?: 'bogie' | 'container' | 'network' | 'hypercube';
  image?: string;
}

export const ProductMediaGallery: React.FC<Props> = ({
  sku,
  title,
  gost,
  subsystem,
  specs,
  drawingNumber,
  modelType = 'bogie',
  image,
}) => {
  const [activeTab, setActiveTab] = useState<'PHOTO' | 'BLUEPRINT' | '3D_CAD'>('PHOTO');

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
            📷 ФОТО ИЗДЕЛИЯ
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
            📐 ЧЕРТЕЖ ПО ГОСТ
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
            {/* Visual Technical Canvas */}
            <div className="relative w-full max-w-lg aspect-video bg-[#D0D6DC] border border-[#0A0A0A] p-6 flex flex-col items-center justify-center shadow-inner">
              {image ? (
                <img
                  src={image}
                  alt={title}
                  className="max-h-48 max-w-full object-contain mx-auto"
                />
              ) : (
                <svg className="w-full h-48 text-[#0A0A0A]" viewBox="0 0 400 220" fill="none" stroke="currentColor">
                {/* Background coordinate grid */}
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(10,10,10,0.08)" strokeWidth="0.8" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Technical Product Graphic depending on SKU */}
                {sku === 'RT-RS-102' ? (
                  // Wheelset drawing
                  <g strokeWidth="1.5">
                    <line x1="40" y1="110" x2="360" y2="110" strokeDasharray="6,4" stroke="#4A5056" />
                    <rect x="70" y="40" width="30" height="140" fill="#B0B6BC" stroke="#0A0A0A" />
                    <rect x="300" y="40" width="30" height="140" fill="#B0B6BC" stroke="#0A0A0A" />
                    <line x1="100" y1="95" x2="300" y2="95" strokeWidth="2.5" />
                    <line x1="100" y1="125" x2="300" y2="125" strokeWidth="2.5" />
                    <rect x="55" y="85" width="15" height="50" fill="#8E969E" />
                    <rect x="330" y="85" width="15" height="50" fill="#8E969E" />
                    {/* Gauge callout */}
                    <line x1="100" y1="195" x2="300" y2="195" stroke="#0A0A0A" />
                    <path d="M 100 190 L 100 200 M 300 190 L 300 200" stroke="#0A0A0A" />
                    <text x="200" y="190" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#0A0A0A">
                      КОЛЕЯ 1520 мм (±3)
                    </text>
                  </g>
                ) : sku === 'RT-RS-208' ? (
                  // Coupler SA-3
                  <g strokeWidth="1.5">
                    <path d="M 80 120 L 160 120 L 190 90 L 260 90 L 290 120 L 320 100 L 320 140 L 280 150 L 160 150 L 80 140 Z" fill="#B0B6BC" />
                    <circle cx="120" cy="130" r="14" fill="#E2E6EA" />
                    <rect x="230" y="105" width="40" height="30" fill="#8E969E" />
                    <line x1="70" y1="130" x2="330" y2="130" strokeDasharray="4,4" stroke="#4A5056" />
                    <text x="200" y="185" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#0A0A0A">
                      КОРПУС СА-3 (ЧЕРТЕЖ 106.01.000-0сб)
                    </text>
                  </g>
                ) : sku === 'RT-RS-305' ? (
                  // Brake Shoe
                  <g strokeWidth="1.5">
                    <path d="M 100 80 Q 200 40 300 80 L 290 140 Q 200 110 110 140 Z" fill="#6A727A" />
                    <rect x="180" y="130" width="40" height="25" fill="#B0B6BC" />
                    <line x1="120" y1="95" x2="280" y2="95" stroke="#D4D8DC" strokeWidth="2" strokeDasharray="4,2" />
                    <text x="200" y="185" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#0A0A0A">
                      КОЛОДКА 25610-Н (КОМПОЗИЦИЯ)
                    </text>
                  </g>
                ) : sku === 'RT-SCB-001' ? (
                  // Switch actuator SP-6M
                  <g strokeWidth="1.5">
                    <rect x="100" y="70" width="180" height="90" fill="#8E969E" />
                    <rect x="280" y="105" width="50" height="20" fill="#B0B6BC" />
                    <circle cx="150" cy="115" r="22" fill="#6A727A" />
                    <line x1="290" y1="115" x2="350" y2="115" stroke="#0A0A0A" strokeWidth="3" />
                    <text x="200" y="185" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#0A0A0A">
                      ПРИВОД СП-6М // ХОД 160 ММ
                    </text>
                  </g>
                ) : (
                  // General bogie / assembly graphic
                  <g strokeWidth="1.5">
                    <rect x="60" y="80" width="280" height="40" fill="#8E969E" />
                    <circle cx="110" cy="140" r="32" fill="#B0B6BC" />
                    <circle cx="290" cy="140" r="32" fill="#B0B6BC" />
                    <rect x="170" y="60" width="60" height="25" fill="#6A727A" />
                    <text x="200" y="195" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#0A0A0A">
                      УЗЕЛ ТЕЛЕЖКИ 18-100 В СБОРЕ
                    </text>
                  </g>
                )}
              </svg>
            )}

            {/* OTK Quality Acceptance Stamp */}
              <div className="absolute top-3 right-3 border-2 border-emerald-800 bg-emerald-50 text-emerald-950 px-2 py-1 text-[9px] font-bold uppercase tracking-widest transform rotate-2">
                [ ОТК: ПРИЕМКА ПРОЙДЕНА ]
              </div>

              {/* Warehouse tag */}
              <div className="absolute bottom-3 left-3 bg-[#0A0A0A] text-white px-2 py-0.5 text-[9px] font-bold">
                ТАШКЕНТ // INDEX B2-2097
              </div>
            </div>

            {/* Photo Metadata Caption */}
            <div className="w-full mt-4 pt-3 border-t border-[#0A0A0A]/20 flex flex-wrap items-center justify-between text-xs text-[#4A5056] gap-2">
              <div>
                <span>ФОТОФИКСАЦИЯ ИЗДЕЛИЯ: </span>
                <span className="font-bold text-[#0A0A0A]">{title}</span>
              </div>
              <div className="text-[11px]">
                СТАНДАРТ: <span className="font-bold text-[#0A0A0A]">{gost}</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TECHNICAL BLUEPRINT */}
        {activeTab === 'BLUEPRINT' && (
          <div className="w-full h-full flex flex-col justify-between">
            <div className="border border-[#0A0A0A] bg-[#2D3748] p-4 text-[#D4D8DC] font-mono text-xs shadow-inner">
              <div className="border-b border-zinc-600 pb-2 mb-3 flex justify-between items-center text-[11px]">
                <span className="text-zinc-400">ЕСКД // ТЕХНИЧЕСКИЙ ЧЕРТЕЖ</span>
                <span className="text-white font-bold">{resolvedDrawing}</span>
              </div>

              <div className="space-y-2 text-[11px] leading-relaxed text-zinc-300">
                <div className="flex justify-between border-b border-zinc-700 pb-1">
                  <span className="text-zinc-400">Обозначение чертежа:</span>
                  <span className="font-bold text-white">{resolvedDrawing}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-700 pb-1">
                  <span className="text-zinc-400">Ширина колеи:</span>
                  <span className="font-bold text-white">1520 мм (ГОСТ 9246-2013)</span>
                </div>
                <div className="flex justify-between border-b border-zinc-700 pb-1">
                  <span className="text-zinc-400">Параметры и допуски:</span>
                  <span className="text-white">{specs}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-700 pb-1">
                  <span className="text-zinc-400">Материал / Сплав:</span>
                  <span className="text-white">Сталь 20ГЛ / 20ФЛ ГОСТ 977-88</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Контроль качества:</span>
                  <span className="text-emerald-400 font-bold">100% УЗК контроль литья и осей</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-[#4A5056]">
              <span>Заводской чертеж доступен в формате DWG / PDF</span>
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent('open-lead-modal', {
                      detail: { subject: `Запрос полного чертежа ${resolvedDrawing} для ${title} (${sku})` },
                    })
                  );
                }}
                className="border border-[#0A0A0A] bg-[#0A0A0A] text-white px-3 py-1 font-bold hover:bg-transparent hover:text-[#0A0A0A] transition-colors cursor-pointer"
              >
                [ ЗАПРОСИТЬ ЧЕРТЕЖ DWG / PDF ]
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
              subtitle="ИНЖЕНЕРНАЯ 3D-СБОРКА В МАСШТАБЕ 1:1"
            />
          </div>
        )}
      </div>

      {/* Footer Status */}
      <div className="border-t border-[#0A0A0A] px-4 py-2 bg-[#C8CDD2] flex flex-wrap items-center justify-between text-[11px] text-[#4A5056] gap-2">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 bg-emerald-600 inline-block"></span>
          <span>ВХОДНОЙ КОНТРОЛЬ: СЕРТИФИЦИРОВАНО В РУЗ // {subsystem.toUpperCase()}</span>
        </div>
        <div>
          ФАКТИЧЕСКИЙ СКЛАД: <span className="text-[#0A0A0A] font-bold">ТАШКЕНТ (INDEX B2-2097)</span>
        </div>
      </div>
    </div>
  );
};
