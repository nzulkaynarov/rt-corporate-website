import React, { useCallback, useEffect, useRef, useState } from 'react';
import { withBase } from '../../utils/url';

type Lang = 'ru' | 'uz' | 'en';

export interface HudSlide {
  image: string;
  title: string;
  title_uz?: string;
  title_en?: string;
  description?: string;
  description_uz?: string;
  description_en?: string;
  tag?: string;
  link?: string;
  href?: string;
}

interface Props {
  slides: HudSlide[];
  intervalMs?: number;
}

const GLYPHS = '#%&@$/\\<>01_=+*';

function pick(slide: HudSlide, field: 'title' | 'description', lang: Lang): string {
  if (lang !== 'ru') {
    const v = (slide as any)[`${field}_${lang}`];
    if (v && String(v).trim()) return v;
  }
  return (slide as any)[field] || '';
}

/** Scrambles a string into its final value over ~250ms (HUD "decode" effect). */
function useDecode(target: string, trigger: number): string {
  const [out, setOut] = useState(target);
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setOut(target);
      return;
    }
    let frame = 0;
    const total = 10;
    const id = window.setInterval(() => {
      frame++;
      const revealed = Math.floor((frame / total) * target.length);
      setOut(
        target
          .split('')
          .map((ch, i) => (i < revealed || ch === ' ' || ch === '/' ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
          .join('')
      );
      if (frame >= total) {
        window.clearInterval(id);
        setOut(target);
      }
    }, 24);
    return () => window.clearInterval(id);
  }, [target, trigger]);
  return out;
}

const pad = (n: number) => String(n).padStart(2, '0');
const pad4 = (n: number) => String(Math.floor(n)).padStart(4, '0');

export const HudMediaSlider: React.FC<Props> = ({ slides, intervalMs = 6500 }) => {
  const [active, setActive] = useState(0);
  const [tick, setTick] = useState(0); // re-triggers animations
  const [lang, setLang] = useState<Lang>('ru');
  const [paused, setPaused] = useState(false);
  const [isRecalibrating, setIsRecalibrating] = useState(false);
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: 340, y: 180 });
  const [reticleOffset, setReticleOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const reticleRef = useRef<SVGSVGElement>(null);
  const touchStartX = useRef<number | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const count = slides.length;

  const go = useCallback(
    (i: number) => {
      if (!count) return;
      setActive(((i % count) + count) % count);
      setTick((t) => t + 1);
      setIsRecalibrating(true);
    },
    [count]
  );

  // Recalibration timer (400ms scan sweep effect)
  useEffect(() => {
    if (!isRecalibrating) return;
    const timer = window.setTimeout(() => {
      setIsRecalibrating(false);
    }, 400);
    return () => window.clearTimeout(timer);
  }, [isRecalibrating, tick]);

  // Language sync with Header switcher
  useEffect(() => {
    const l = document.documentElement.lang as Lang;
    if (l === 'uz' || l === 'en' || l === 'ru') setLang(l);
    const onLang = (e: Event) => {
      const d = (e as CustomEvent<Lang>).detail;
      if (d === 'ru' || d === 'uz' || d === 'en') setLang(d);
    };
    window.addEventListener('rt-lang-change', onLang);
    return () => window.removeEventListener('rt-lang-change', onLang);
  }, []);

  // External control: left-column "Modes" dispatch `hud-slide-go`
  useEffect(() => {
    const onGo = (e: Event) => {
      const idx = Number((e as CustomEvent<number>).detail);
      if (!Number.isNaN(idx)) go(idx);
    };
    window.addEventListener('hud-slide-go', onGo);
    return () => window.removeEventListener('hud-slide-go', onGo);
  }, [go]);

  // Broadcast active slide so the left column can highlight the mode
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('hud-slide-changed', { detail: active }));
  }, [active]);

  // Autoplay
  useEffect(() => {
    if (paused || count < 2) return;
    const id = window.setTimeout(() => go(active + 1), intervalMs);
    return () => window.clearTimeout(id);
  }, [active, paused, count, intervalMs, go]);

  // Reticle pulse
  useEffect(() => {
    const el = reticleRef.current;
    if (!el) return;
    el.classList.remove('is-pulsing');
    void el.getBoundingClientRect();
    el.classList.add('is-pulsing');
  }, [tick]);

  // Live cursor telemetry inside viewport frame (desktop only)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = viewportRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const relY = Math.max(0, Math.min(rect.height, e.clientY - rect.top));

    setCoords({ x: relX, y: relY });

    // Damped parallax for the reticle (±6px)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const dx = Math.max(-6, Math.min(6, ((relX - centerX) / centerX) * 6));
    const dy = Math.max(-6, Math.min(6, ((relY - centerY) / centerY) * 6));
    setReticleOffset({ x: dx, y: dy });
  };

  const handleMouseLeave = () => {
    setPaused(false);
    setReticleOffset({ x: 0, y: 0 });
  };

  // Mobile touch swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartX.current;
    touchStartX.current = null;
    if (diff > 45) {
      go(active - 1);
    } else if (diff < -45) {
      go(active + 1);
    }
  };

  const indexLabel = useDecode(`SLIDE // ${pad(active + 1)} OF ${pad(count)}`, tick);

  if (!count) return null;
  const slide = slides[active];
  const title = pick(slide, 'title', lang);
  const desc = pick(slide, 'description', lang);
  const more = lang === 'uz' ? 'Batafsil' : lang === 'en' ? 'Learn more' : 'Подробнее';

  const scanStatusText = isRecalibrating
    ? 'HUD_SCAN: RECALIBRATING...'
    : paused
    ? 'HUD_SCAN: HOLD'
    : 'HUD_SCAN: ACTIVE';

  return (
    <div
      className="flex flex-col h-full w-full max-w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={handleMouseLeave}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(active + 1);
        if (e.key === 'ArrowLeft') go(active - 1);
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-roledescription="carousel"
      aria-label="RailTech HUD media slider"
    >
      {/* Callouts above the frame (responsive and truncated) */}
      <div className="flex items-center justify-between mb-2 sm:mb-3 min-h-[16px] text-xs">
        <span className="hud-callout truncate max-w-[55%]" aria-live="polite">
          <i></i>
          <span className="tabular-nums font-mono text-[10px]">{indexLabel}</span>
        </span>
        <span className="hud-callout text-[10px] font-mono" aria-live="polite">
          <i className="hidden sm:inline-block"></i>
          <span className={isRecalibrating ? 'text-amber-800 font-bold' : ''}>
            {scanStatusText}
          </span>
        </span>
      </div>

      {/* Viewport frame */}
      <div
        ref={viewportRef}
        onMouseMove={handleMouseMove}
        className="hud-viewport-frame flex-1 relative overflow-hidden"
      >
        <span className="hud-vf-outline" aria-hidden="true"></span>

        <div className="hud-viewport-inner h-[260px] sm:h-[350px] lg:h-[420px] relative w-full">
          {/* Active slide real photo */}
          <img
            key={`img-${active}`}
            src={withBase(slide.image)}
            alt={title}
            loading={active === 0 ? 'eager' : 'lazy'}
            fetchPriority={active === 0 ? 'high' : 'auto'}
            decoding="async"
            className="hud-slide-img absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              const target = e.currentTarget;
              const fallback = withBase('/images/hero/warehouse.jpg');
              if (target.src !== fallback) {
                target.src = fallback;
              }
            }}
          />

          {/* Subtle grid over photo */}
          <div className="absolute inset-0 cad-grid-bg opacity-35 pointer-events-none" aria-hidden="true" />

          {/* Crosshair reticle with smooth cursor parallax */}
          <svg
            ref={reticleRef}
            className="hud-reticle absolute left-1/2 top-1/2 w-32 sm:w-40 h-32 sm:h-40 text-white pointer-events-none transition-transform duration-100 ease-out"
            style={{
              transform: `translate(calc(-50% + ${reticleOffset.x}px), calc(-50% + ${reticleOffset.y}px))`,
              transformOrigin: 'center',
              mixBlendMode: 'difference',
            }}
            viewBox="0 0 160 160"
            aria-hidden="true"
          >
            <g fill="none" stroke="currentColor" strokeWidth="1">
              <circle cx="80" cy="80" r="46" />
              <circle cx="80" cy="80" r="2" fill="currentColor" />
              <path d="M80 0v54M80 106v54M0 80h54M106 80h54" />
              <path d="M20 20h14M20 20v14M140 20h-14M140 20v14M20 140h14M20 140v-14M140 140h-14M140 140v-14" />
            </g>
          </svg>

          {/* Top-Right Corner Telemetry: Tag & Live Coordinates */}
          <div className="absolute top-2.5 right-3 font-mono text-[9px] tracking-[0.16em] text-white/90 mix-blend-difference pointer-events-none flex items-center gap-2">
            <span className="hidden sm:inline tabular-nums">
              X: {pad4(coords.x)} // Y: {pad4(coords.y)}
            </span>
            <span className="border border-white/40 px-1 py-0.5 bg-black/30">
              {slide.tag || 'RT.MEDIA'}
            </span>
          </div>

          {/* Scanline sweep on slide switch */}
          <div key={`scan-${tick}`} className="hud-scanline" aria-hidden="true">
            <div className="absolute bottom-0 left-0 right-0 h-px bg-white/90 shadow-[0_0_8px_white]" />
          </div>

          {/* Frosted caption plate */}
          <div
            key={`cap-${active}-${lang}`}
            className="absolute left-2.5 right-2.5 bottom-2.5 sm:left-4 sm:right-auto sm:max-w-[80%] p-3 sm:p-4 text-[#0A0A0A]"
            style={{
              background: 'rgba(212, 216, 220, 0.78)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              boxShadow: 'inset 0 0 0 1px rgba(10,10,10,0.3)',
              clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)',
            }}
          >
            <div className="font-mono text-[9px] sm:text-[10px] tracking-[0.16em] text-[#4A5056] mb-0.5">
              {pad(active + 1)} // {slide.tag}
            </div>
            <div className="font-sans font-bold text-base sm:text-lg leading-tight tracking-tight text-[#0A0A0A]">
              {title}
            </div>
            {desc && (
              <p className="text-[12px] sm:text-[13px] text-[#4A5056] mt-1 leading-snug line-clamp-2">
                {desc}
              </p>
            )}
            {(slide.href || slide.link) && (
              <a
                href={withBase(slide.href || slide.link)}
                className="inline-flex items-center gap-1 mt-1.5 font-mono text-[10px] sm:text-[11px] font-bold text-[#0A0A0A] hover:underline underline-offset-4"
              >
                {more} ↗
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Controls  [ ←  ■ 01  □ 02  □ 03  □ 04  → ] */}
      <div className="mt-3 flex items-center justify-center gap-1 font-mono text-xs select-none">
        <span className="text-[#4A5056]">[</span>
        <button
          type="button"
          onClick={() => go(active - 1)}
          className="min-w-[32px] min-h-[32px] sm:min-w-[28px] sm:min-h-[28px] flex items-center justify-center px-1.5 py-1 hover:bg-[#0A0A0A] hover:text-white transition-colors cursor-pointer"
          aria-label="Previous slide"
          id="hud-slider-prev"
        >
          ←
        </button>
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => go(i)}
            id={`hud-slider-dot-${i + 1}`}
            aria-label={`Slide ${i + 1}`}
            aria-current={i === active}
            className={`min-h-[32px] sm:min-h-[28px] px-2 py-1 transition-colors cursor-pointer text-xs ${
              i === active
                ? 'bg-[#0A0A0A] text-white font-bold'
                : 'text-[#0A0A0A] hover:bg-[#0A0A0A]/10'
            }`}
          >
            {i === active ? '■' : '□'} {pad(i + 1)}
          </button>
        ))}
        <button
          type="button"
          onClick={() => go(active + 1)}
          className="min-w-[32px] min-h-[32px] sm:min-w-[28px] sm:min-h-[28px] flex items-center justify-center px-1.5 py-1 hover:bg-[#0A0A0A] hover:text-white transition-colors cursor-pointer"
          aria-label="Next slide"
          id="hud-slider-next"
        >
          →
        </button>
        <span className="text-[#4A5056]">]</span>
      </div>

      {/* Micro-telemetry status below slider */}
      <div className="mt-1 flex items-center justify-between text-[10px] text-[#4A5056] font-mono">
        <span className="hud-callout text-[9px]">
          <i></i>OPTICAL_FEED // OK
        </span>
        <span className="hidden sm:inline">SWIPE / ARROWS: NAVIGATE</span>
      </div>
    </div>
  );
};

export default HudMediaSlider;
