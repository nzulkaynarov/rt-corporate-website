import React, { useState, useEffect, useRef } from 'react';
import { withBase } from '../../utils/url';
import { HudSmartImage } from './HudSmartImage';
import type { Lang } from '../../i18n/ui';

interface Props {
  sku: string;
  title: string;
  title_uz?: string;
  title_en?: string;
  category?: string;
  category_uz?: string;
  category_en?: string;
  status?: string;
  status_uz?: string;
  status_en?: string;
  specs?: string;
  specs_uz?: string;
  specs_en?: string;
  image?: string;
  gallery?: string[];
}

const pad4 = (n: number) => String(Math.floor(n)).padStart(4, '0');

export const ProductMediaGallery: React.FC<Props> = ({
  sku,
  title,
  title_uz,
  title_en,
  category = 'Оборудование',
  category_uz,
  category_en,
  status = 'В наличии',
  status_uz,
  status_en,
  image,
  gallery = [],
}) => {
  const [lang, setLang] = useState<Lang>('ru');
  const [activeIdx, setActiveIdx] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: 260, y: 150 });
  const [reticleOffset, setReticleOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  // Sync language
  useEffect(() => {
    const cur =
      (document.documentElement.lang as Lang) ||
      ((typeof localStorage !== 'undefined' ? localStorage.getItem('rt_lang') : null) as Lang) ||
      'ru';
    if (cur === 'ru' || cur === 'uz' || cur === 'en') {
      setLang(cur);
    }

    const handleLang = (e: Event) => {
      const customEvent = e as CustomEvent<Lang>;
      if (
        customEvent.detail &&
        (customEvent.detail === 'ru' || customEvent.detail === 'uz' || customEvent.detail === 'en')
      ) {
        setLang(customEvent.detail);
      }
    };

    window.addEventListener('rt-lang-change', handleLang);
    return () => window.removeEventListener('rt-lang-change', handleLang);
  }, []);

  const curTitle = lang === 'uz' ? title_uz || title : lang === 'en' ? title_en || title : title;
  const curCategory =
    lang === 'uz' ? category_uz || category : lang === 'en' ? category_en || category : category;
  const curStatus = lang === 'uz' ? status_uz || status : lang === 'en' ? status_en || status : status;

  // Build photo list (main image + gallery, or fallback to main image)
  const allImages = React.useMemo(() => {
    const list: string[] = [];
    if (image) list.push(image);
    if (gallery && gallery.length > 0) {
      gallery.forEach((g) => {
        if (g && !list.includes(g)) list.push(g);
      });
    }
    if (list.length === 0) {
      list.push(`/images/catalog/${sku.toLowerCase()}.svg`);
    }
    return list;
  }, [image, gallery, sku]);

  const activeImage = allImages[activeIdx] || allImages[0];

  const handleSelectImage = (idx: number) => {
    setActiveIdx(idx);
    setIsScanning(true);
  };

  useEffect(() => {
    if (!isScanning) return;
    const t = window.setTimeout(() => setIsScanning(false), 400);
    return () => window.clearTimeout(t);
  }, [isScanning, activeIdx]);

  // Live mouse telemetry inside frame
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const relY = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
    setCoords({ x: relX, y: relY });

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const dx = Math.max(-6, Math.min(6, ((relX - centerX) / centerX) * 6));
    const dy = Math.max(-6, Math.min(6, ((relY - centerY) / centerY) * 6));
    setReticleOffset({ x: dx, y: dy });
  };

  const handleMouseLeave = () => {
    setReticleOffset({ x: 0, y: 0 });
  };

  return (
    <div className="flex flex-col space-y-4 font-mono select-none">
      {/* Top Telemetry Row */}
      <div className="flex items-center justify-between text-[11px] text-[#4A5056] border-b border-[#0A0A0A]/20 pb-2">
        <span className="flex items-center gap-1.5 font-bold text-[#0A0A0A]">
          <span className="w-2 h-2 bg-emerald-600 inline-block animate-pulse"></span>
          ITEM // {sku}
        </span>
        <span className="truncate max-w-[45%] uppercase text-right">
          CAT // {curCategory}
        </span>
      </div>

      {/* Main Viewport Frame */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="hud-viewport-frame relative overflow-hidden"
      >
        <span className="hud-vf-outline" aria-hidden="true"></span>

        <div className="hud-viewport-inner relative min-h-[300px] sm:min-h-[360px] flex items-center justify-center bg-[#D4D8DC]">
          {/* Smart Image with generative blueprint on error */}
          <HudSmartImage
            key={`prod-img-${activeIdx}-${sku}`}
            src={activeImage}
            alt={curTitle}
            sku={sku}
            category={curCategory}
            aspect="aspect-[16/10] w-full h-full"
            loading="eager"
            fetchPriority="high"
            className="w-full h-full object-contain p-2"
          />

          {/* Isometric grid overlay */}
          <div className="absolute inset-0 cad-grid-bg opacity-30 pointer-events-none" aria-hidden="true" />

          {/* Crosshair Reticle with soft damping parallax */}
          <svg
            className="absolute left-1/2 top-1/2 w-28 sm:w-36 h-28 sm:h-36 text-white pointer-events-none transition-transform duration-100 ease-out"
            style={{
              transform: `translate(calc(-50% + ${reticleOffset.x}px), calc(-50% + ${reticleOffset.y}px))`,
              transformOrigin: 'center',
              mixBlendMode: 'difference',
            }}
            viewBox="0 0 160 160"
            aria-hidden="true"
          >
            <g fill="none" stroke="currentColor" strokeWidth="1">
              <circle cx="80" cy="80" r="44" />
              <circle cx="80" cy="80" r="2" fill="currentColor" />
              <path d="M80 0v50M80 110v50M0 80h50M110 80h50" />
            </g>
          </svg>

          {/* Top-Right Micro Telemetry: Coordinates & Status */}
          <div className="absolute top-2.5 right-3 font-mono text-[9px] tracking-[0.16em] text-white/90 mix-blend-difference pointer-events-none flex items-center gap-2">
            <span className="hidden sm:inline tabular-nums">
              X: {pad4(coords.x)} // Y: {pad4(coords.y)}
            </span>
            <span className="border border-white/40 px-1 py-0.5 bg-black/40">
              {isScanning ? 'HUD_SCAN: RECALIBRATING...' : 'STATUS // ONLINE'}
            </span>
          </div>

          {/* Scanline Sweep on image change */}
          {isScanning && (
            <div className="hud-scanline" aria-hidden="true">
              <div className="absolute bottom-0 left-0 right-0 h-px bg-white/90 shadow-[0_0_8px_white]" />
            </div>
          )}

          {/* Bottom Stamp Plate */}
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
            <span className="border border-[#0A0A0A] px-2 py-0.5 bg-[#D4D8DC]/90 text-[10px] font-bold text-[#0A0A0A] backdrop-blur-sm">
              INDEX B2-2097 // UZ
            </span>
            <span className="border border-[#0A0A0A] px-2 py-0.5 bg-[#0A0A0A] text-[10px] font-bold text-white">
              {curStatus.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Thumbnails row (if multiple images) */}
      {allImages.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
          {allImages.map((imgUrl, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSelectImage(i)}
              className={`relative flex-none w-16 h-12 border transition-all cursor-pointer overflow-hidden ${
                activeIdx === i
                  ? 'border-2 border-[#0A0A0A] bg-white'
                  : 'border-[#0A0A0A]/40 bg-[#C8CDD2] opacity-75 hover:opacity-100'
              }`}
            >
              <img
                src={withBase(imgUrl)}
                alt={`${sku} view ${i + 1}`}
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {/* Bottom Status / Order Dispatch Bar */}
      <div className="hud-glass-card p-3 flex flex-wrap items-center justify-between text-xs gap-2">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-[#0A0A0A]">
            {lang === 'uz' ? 'YUKLASH: ' : lang === 'en' ? 'DISPATCH: ' : 'ОТГРУЗКА: '}
          </span>
          <span className="text-[#4A5056]">
            {lang === 'uz' ? 'Index B2-2097 omboridan' : lang === 'en' ? 'Direct from Index B2-2097' : 'Со склада Index B2-2097'}
          </span>
        </div>
        <div className="font-bold text-[#0A0A0A]">
          12% {lang === 'uz' ? 'QQS kiritilgan' : lang === 'en' ? 'VAT included' : 'НДС включен'}
        </div>
      </div>
    </div>
  );
};

export default ProductMediaGallery;
