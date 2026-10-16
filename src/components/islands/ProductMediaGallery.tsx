import React, { useState, useEffect, useRef, useMemo } from 'react';
import { withBase } from '../../utils/url';
import { HudSmartImage } from './HudSmartImage';
import { useLang } from '../../utils/useLang';

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
  images?: string[];
  gallery?: string[];
}

const pad4 = (n: number) => String(Math.floor(n)).padStart(4, '0');
const pad2 = (n: number) => String(Math.floor(n)).padStart(2, '0');

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
  images = [],
  gallery = [],
}) => {
  const lang = useLang();
  const [activeIdx, setActiveIdx] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: 260, y: 150 });
  const [reticleOffset, setReticleOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const curTitle = lang === 'uz' ? title_uz || title : lang === 'en' ? title_en || title : title;
  const curCategory =
    lang === 'uz' ? category_uz || category : lang === 'en' ? category_en || category : category;
  const curStatus = lang === 'uz' ? status_uz || status : lang === 'en' ? status_en || status : status;

  // Build clean photo list from image, images, and legacy gallery
  const allImages = useMemo(() => {
    const rawList: (string | undefined)[] = [image, ...(images || []), ...(gallery || [])];
    const uniqueList: string[] = [];
    rawList.forEach((item) => {
      if (item && typeof item === 'string' && item.trim()) {
        const trimmed = item.trim();
        if (!uniqueList.includes(trimmed)) {
          uniqueList.push(trimmed);
        }
      }
    });

    if (uniqueList.length === 0) {
      uniqueList.push(`/images/catalog/${sku.toLowerCase()}.jpg`);
    }
    return uniqueList;
  }, [image, images, gallery, sku]);

  // Keep index within range
  const safeIdx = activeIdx >= allImages.length ? 0 : activeIdx;
  const activeImage = allImages[safeIdx] || allImages[0];

  const handleSelectImage = (idx: number) => {
    setActiveIdx(idx);
    setIsScanning(true);
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
    setIsScanning(true);
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
    setIsScanning(true);
  };

  // Touch swipe support on mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      touchStartX.current = e.touches[0].clientX;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || e.changedTouches.length === 0) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (deltaX > 45) {
      // Swiped right -> previous image
      handlePrev();
    } else if (deltaX < -45) {
      // Swiped left -> next image
      handleNext();
    }
    touchStartX.current = null;
  };

  useEffect(() => {
    if (!isScanning) return;
    const t = window.setTimeout(() => setIsScanning(false), 350);
    return () => window.clearTimeout(t);
  }, [isScanning, safeIdx]);

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
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="hud-viewport-frame relative overflow-hidden"
      >
        <span className="hud-vf-outline" aria-hidden="true"></span>

        <div className="hud-viewport-inner relative min-h-[300px] sm:min-h-[360px] flex items-center justify-center bg-[#D4D8DC]">
          {/* Smart Image with generative blueprint on error */}
          <HudSmartImage
            key={`prod-img-${safeIdx}-${sku}`}
            src={activeImage}
            alt={curTitle}
            sku={sku}
            category={curCategory}
            aspect="aspect-[16/10] w-full h-full"
            loading="eager"
            objectFit="cover"
            className="w-full h-full object-cover"
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

      {/* Multi-Photo Controls: Thumbnails, Counter & Navigation (when 2+ images) */}
      {allImages.length > 1 && (
        <div className="flex flex-col space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs font-mono text-[#4A5056] border-b border-[#0A0A0A]/15 pb-1">
            <span className="font-bold text-[#0A0A0A] tracking-wider">
              FRAME // {pad2(safeIdx + 1)} OF {pad2(allImages.length)}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePrev}
                className="px-2 py-0.5 border border-[#0A0A0A]/40 hover:bg-[#0A0A0A] hover:text-white transition-colors cursor-pointer text-[11px]"
                aria-label="Previous image"
              >
                &lt; {lang === 'uz' ? 'OLDINGI' : lang === 'en' ? 'PREV' : 'ПРЕД'}
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="px-2 py-0.5 border border-[#0A0A0A]/40 hover:bg-[#0A0A0A] hover:text-white transition-colors cursor-pointer text-[11px]"
                aria-label="Next image"
              >
                {lang === 'uz' ? 'KEYINGI' : lang === 'en' ? 'NEXT' : 'СЛЕД'} &gt;
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 scrollbar-thin">
            {allImages.map((imgUrl, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSelectImage(i)}
                className={`relative flex-none w-[64px] h-[48px] border transition-all cursor-pointer overflow-hidden ${
                  safeIdx === i
                    ? 'border-2 border-[#0A0A0A] bg-white ring-1 ring-[#0A0A0A]'
                    : 'border-[#0A0A0A]/30 bg-[#C8CDD2] opacity-75 hover:opacity-100'
                }`}
                title={`View ${i + 1}`}
              >
                <img
                  src={withBase(imgUrl)}
                  alt={`${sku} frame ${i + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
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
