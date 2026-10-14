import React, { useState } from 'react';
import { WireframeViewport } from './WireframeViewport';

interface Props {
  modelType?: 'bogie' | 'container' | 'network' | 'hypercube';
  title?: string;
  subtitle?: string;
  initialPitch?: number;
  initialRotation?: number;
}

export const CadInspector: React.FC<Props> = ({
  modelType = 'bogie',
  title = 'ИНЖЕНЕРНАЯ CAD-СБОРКА В МАСШТАБЕ 1:1',
  subtitle = 'ИНТЕРАКТИВНАЯ ТЕХНИЧЕСКАЯ МОДЕЛЬ // ВРАЩЕНИЕ МЫШЬЮ',
  initialPitch = 18,
  initialRotation = 38,
}) => {
  const [rotationDeg, setRotationDeg] = useState(initialRotation);
  const [pitchDeg, setPitchDeg] = useState(initialPitch);
  const [isExploded, setIsExploded] = useState(false);

  const setViewIso = () => {
    setRotationDeg(38);
    setPitchDeg(18);
  };

  const setViewTop = () => {
    setRotationDeg(0);
    setPitchDeg(90);
  };

  const setViewFront = () => {
    setRotationDeg(0);
    setPitchDeg(0);
  };

  return (
    <div className="border-2 border-[#0A0A0A] bg-[#D4D8DC] font-mono select-none">
      {/* CAD Header */}
      <div className="border-b border-[#0A0A0A] px-4 py-2.5 bg-[#C8CDD2] flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="text-xs font-bold text-[#0A0A0A] tracking-wider flex items-center space-x-2">
            <span className="w-2 h-2 bg-[#0A0A0A] inline-block"></span>
            <span>{title}</span>
          </div>
          <div className="text-[10px] text-[#4A5056]">{subtitle}</div>
        </div>

        {/* Orthographic Controls */}
        <div className="flex items-center space-x-1 text-[11px]">
          <span className="text-[#4A5056] mr-1 hidden sm:inline">ВИД:</span>
          <button
            type="button"
            onClick={setViewIso}
            className={`border border-[#0A0A0A] px-2 py-0.5 font-bold transition-colors ${
              pitchDeg === 18 && rotationDeg === 38 ? 'bg-[#0A0A0A] text-white' : 'bg-white hover:bg-[#0A0A0A] hover:text-white'
            }`}
          >
            ISO
          </button>
          <button
            type="button"
            onClick={setViewTop}
            className={`border border-[#0A0A0A] px-2 py-0.5 font-bold transition-colors ${
              pitchDeg === 90 ? 'bg-[#0A0A0A] text-white' : 'bg-white hover:bg-[#0A0A0A] hover:text-white'
            }`}
          >
            TOP
          </button>
          <button
            type="button"
            onClick={setViewFront}
            className={`border border-[#0A0A0A] px-2 py-0.5 font-bold transition-colors ${
              pitchDeg === 0 && rotationDeg === 0 ? 'bg-[#0A0A0A] text-white' : 'bg-white hover:bg-[#0A0A0A] hover:text-white'
            }`}
          >
            FRONT
          </button>
          {modelType === 'bogie' && (
            <button
              type="button"
              onClick={() => setIsExploded(!isExploded)}
              className={`border border-[#0A0A0A] px-2 py-0.5 font-bold ml-1 transition-colors ${
                isExploded ? 'bg-[#0A0A0A] text-white' : 'bg-white text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white'
              }`}
            >
              {isExploded ? 'СБОРКА' : 'ВЗРЫВ-СХЕМА'}
            </button>
          )}
        </div>
      </div>

      {/* 3D Viewport Frame */}
      <div className="relative h-[360px] md:h-[440px] bg-gradient-to-b from-[#D4D8DC] to-[#C4C9CE] cursor-grab active:cursor-grabbing overflow-hidden">
        <WireframeViewport
          modelType={modelType}
          rotationDeg={rotationDeg}
          pitchDeg={pitchDeg}
          onRotationChange={(deg) => setRotationDeg(Math.round(deg))}
          onPitchChange={(p) => setPitchDeg(Math.round(p))}
          isExploded={isExploded}
        />

        {/* Viewport Overlay Markers */}
        <div className="absolute top-3 left-3 pointer-events-none text-[10px] text-[#4A5056] font-mono space-y-0.5">
          <div>SCALE: 1:1 CALIBRATED</div>
          <div>DATUM: WGS-84 / GAUGE 1520</div>
          <div>GLB SUPPORT: /public/models/{modelType}.glb</div>
        </div>

        <div className="absolute bottom-3 left-3 pointer-events-none text-[10px] text-[#4A5056] font-mono">
          <span>ROT: <span className="text-[#0A0A0A] font-bold">{rotationDeg}°</span></span>
          <span className="mx-2">|</span>
          <span>PITCH: <span className="text-[#0A0A0A] font-bold">{pitchDeg}°</span></span>
        </div>

        <div className="absolute bottom-3 right-3 pointer-events-none text-[10px] text-[#4A5056] font-mono">
          [ ЗАЖМИТЕ ЛКМ ДЛЯ ВРАЩЕНИЯ ]
        </div>
      </div>

      {/* CAD Telemetry Footer */}
      <div className="border-t border-[#0A0A0A] px-4 py-2 bg-[#C8CDD2] flex items-center justify-between text-[11px] text-[#4A5056]">
        <div>
          СЕРТИФИКАЦИЯ: <span className="text-[#0A0A0A] font-bold">ТР ТС 001/2011 // ГОСТ 9246-2013</span>
        </div>
        <button
          type="button"
          onClick={() => {
            window.dispatchEvent(
              new CustomEvent('open-lead-modal', {
                detail: { subject: `Запрос чертежей и 3D CAD моделей: ${title}` },
              })
            );
          }}
          className="text-[#0A0A0A] font-bold hover:underline cursor-pointer"
        >
          [ ЗАПРОСИТЬ ЧЕРТЕЖИ AUTOCAD / STEP ↗ ]
        </button>
      </div>
    </div>
  );
};
