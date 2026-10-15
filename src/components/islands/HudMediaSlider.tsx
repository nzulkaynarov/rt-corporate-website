import React, { useCallback, useEffect, useRef, useState } from 'react';

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

/** Scrambles a string into its final value over ~400ms (HUD "decode" effect). */
function useDecode(target: string, trigger: number): string {
  const [out, setOut] = useState(target);
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setOut(target);
      return;
    }
    let frame = 0;
    const total = 14;
    const id = window.setInterval(() => {
      frame++;
      const revealed = Math.floor((frame / total) * target.length);
      setOut(
        target
          .split('')
          .map((ch, i) => (i < revealed || ch === ' ' ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
          .join('')
      );
      if (frame >= total) {
        window.clearInterval(id);
        setOut(target);
      }
    }, 28);
    return () => window.clearInterval(id);
  }, [target, trigger]);
  return out;
}

const pad = (n: number) => String(n).padStart(2, '0');

export const HudMediaSlider: React.FC<Props> = ({ slides, intervalMs = 6500 }) => {
  const [active, setActive] = useState(0);
  const [tick, setTick] = useState(0); // re-triggers animations
  const [lang, setLang] = useState<Lang>('ru');
  const [paused, setPaused] = useState(false);
  const reticleRef = useRef<SVGSVGElement>(null);
  const count = slides.length;

  const go = useCallback(
    (i: number) => {
      if (!count) return;
      setActive(((i % count) + count) % count);
      setTick((t) => t + 1);
    },
    [count]
  );

  // language sync with Header switcher
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

  // external control: left-column "Modes" dispatch `hud-slide-go`
  useEffect(() => {
    const onGo = (e: Event) => {
      const idx = Number((e as CustomEvent<number>).detail);
      if (!Number.isNaN(idx)) go(idx);
    };
    window.addEventListener('hud-slide-go', onGo);
    return () => window.removeEventListener('hud-slide-go', onGo);
  }, [go]);

  // broadcast active slide so the left column can highlight the mode
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('hud-slide-changed', { detail: active }));
  }, [active]);

  // autoplay
  useEffect(() => {
    if (paused || count < 2) return;
    const id = window.setTimeout(() => go(active + 1), intervalMs);
    return () => window.clearTimeout(id);
  }, [active, paused, count, intervalMs, go]);

  // reticle pulse
  useEffect(() => {
    const el = reticleRef.current;
    if (!el) return;
    el.classList.remove('is-pulsing');
    void el.getBoundingClientRect();
    el.classList.add('is-pulsing');
  }, [tick]);

  const indexLabel = useDecode(`SLIDE // ${pad(active + 1)} OF ${pad(count)}`, tick);

  if (!count) return null;
  const slide = slides[active];
  const title = pick(slide, 'title', lang);
  const desc = pick(slide, 'description', lang);
  const more = lang === 'uz' ? 'Batafsil' : lang === 'en' ? 'Learn more' : 'Подробнее';

  return (
    <div
      className="flex flex-col h-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(active + 1);
        if (e.key === 'ArrowLeft') go(active - 1);
      }}
      role="region"
      aria-roledescription="carousel"
      aria-label="RailTech HUD media slider"
    >
      {/* Callouts above the frame */}
      <div className="flex items-center justify-between mb-3 min-h-[14px]">
        <span className="hud-callout" aria-live="polite">
          <i></i>
          <span className="tabular-nums">{indexLabel}</span>
        </span>
        <span className="hud-callout hidden sm:inline-flex">
          <i></i>HUD_SCAN: {paused ? 'HOLD' : 'ACTIVE'}
        </span>
      </div>

      {/* Viewport frame */}
      <div className="hud-viewport-frame flex-1">
        <span className="hud-vf-outline" aria-hidden="true"></span>
        <div className="hud-viewport-inner h-full min-h-[300px] sm:min-h-[380px] lg:min-h-[440px]">
          <img
            key={`img-${active}-${tick}`}
            src={slide.image}
            alt={title}
            className="hud-slide-img absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'grayscale(0.25) contrast(1.03)' }}
            loading={active === 0 ? 'eager' : 'lazy'}
            fetchPriority={active === 0 ? 'high' : 'auto'}
            decoding="async"
          />

          {/* Subtle grid over photo */}
          <div className="absolute inset-0 cad-grid-bg opacity-40 pointer-events-none" aria-hidden="true" />

          {/* Crosshair reticle (25% opacity) */}
          <svg
            ref={reticleRef}
            className="hud-reticle absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 text-white pointer-events-none"
            style={{ transformOrigin: 'center', mixBlendMode: 'difference' }}
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

          {/* Corner telemetry */}
          <div className="absolute top-3 right-4 font-mono text-[9px] tracking-[0.18em] text-white/80 mix-blend-difference pointer-events-none">
            {slide.tag || 'RT.MEDIA'}
          </div>

          {/* Scanline sweep */}
          <div key={`scan-${tick}`} className="hud-scanline" aria-hidden="true">
            <div className="absolute bottom-0 left-0 right-0 h-px bg-white/90" />
          </div>

          {/* Frosted caption plate */}
          <div
            key={`cap-${active}-${lang}`}
            className="absolute left-3 right-3 bottom-3 sm:left-4 sm:right-auto sm:max-w-[78%] p-4 text-[#0A0A0A]"
            style={{
              background: 'rgba(212, 216, 220, 0.72)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              boxShadow: 'inset 0 0 0 1px rgba(10,10,10,0.25)',
              clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)',
            }}
          >
            <div className="font-mono text-[10px] tracking-[0.16em] text-[#4A5056] mb-1">
              {pad(active + 1)} // {slide.tag}
            </div>
            <div className="font-sans font-bold text-lg sm:text-xl leading-tight tracking-tight">{title}</div>
            {desc && <p className="text-[13px] text-[#4A5056] mt-1.5 leading-snug line-clamp-2">{desc}</p>}
            {slide.link && (
              <a
                href={slide.link}
                className="inline-flex items-center gap-1 mt-2 font-mono text-[11px] font-bold text-[#0A0A0A] hover:underline underline-offset-4"
              >
                {more} ↗
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Controls  [ ←  ■ 01  □ 02  □ 03  □ 04  → ] */}
      <div className="mt-4 flex items-center justify-center gap-1 font-mono text-[11px] select-none">
        <span className="text-[#4A5056]">[</span>
        <button
          type="button"
          onClick={() => go(active - 1)}
          className="px-2 py-1 hover:bg-[#0A0A0A] hover:text-white transition-colors cursor-pointer"
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
            className={`px-2 py-1 transition-colors cursor-pointer ${
              i === active ? 'bg-[#0A0A0A] text-white font-bold' : 'text-[#0A0A0A] hover:bg-[#0A0A0A]/10'
            }`}
          >
            {i === active ? '■' : '□'} {pad(i + 1)}
          </button>
        ))}
        <button
          type="button"
          onClick={() => go(active + 1)}
          className="px-2 py-1 hover:bg-[#0A0A0A] hover:text-white transition-colors cursor-pointer"
          aria-label="Next slide"
          id="hud-slider-next"
        >
          →
        </button>
        <span className="text-[#4A5056]">]</span>
      </div>

      <div className="mt-2 flex justify-start">
        <span className="hud-callout">
          <i></i>CMS_MEDIA
        </span>
      </div>
    </div>
  );
};

export default HudMediaSlider;
