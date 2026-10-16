import React, { useState, useEffect } from 'react';
import { withBase } from '../../utils/url';

export interface HudSmartImageProps {
  src?: string;
  alt?: string;
  className?: string;
  containerClassName?: string;
  sku?: string;
  code?: string;
  category?: string;
  aspect?: string;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'auto' | 'high' | 'low';
  objectFit?: 'cover' | 'contain';
  grayscale?: boolean;
  style?: React.CSSProperties;
}

export const HudSmartImage: React.FC<HudSmartImageProps> = ({
  src,
  alt = 'Industrial equipment blueprint',
  className = '',
  containerClassName = '',
  sku,
  code,
  category,
  aspect = 'aspect-[16/10]',
  loading = 'lazy',
  fetchPriority = 'auto',
  objectFit = 'cover',
  grayscale = false,
  style = {},
}) => {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  const resolvedSrc = src ? withBase(src) : '';

  useEffect(() => {
    if (!resolvedSrc) {
      setStatus('error');
      return;
    }
    setStatus('loading');
    const img = new Image();
    img.src = resolvedSrc;
    img.onload = () => setStatus('loaded');
    img.onerror = () => setStatus('error');
  }, [resolvedSrc]);

  const identifier = sku || code || 'RT-ITEM';
  const categoryLabel = category || 'PRECISION HARDWARE';

  return (
    <div
      className={`relative w-full overflow-hidden select-none bg-[#D4D8DC] ${aspect} ${containerClassName}`}
      style={style}
    >
      {/* 1. SKELETON / GENERATIVE HUD BLUEPRINT FALLBACK */}
      {status === 'error' || !resolvedSrc ? (
        <div className="absolute inset-0 flex flex-col justify-between p-3 font-mono text-[#0A0A0A] bg-[#D4D8DC]">
          {/* Subtle CAD coordinate grid pattern */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" aria-hidden="true">
            <defs>
              <pattern id={`hud-grid-${identifier}`} width="16" height="16" patternUnits="userSpaceOnUse">
                <path d="M 16 0 L 0 0 0 16" fill="none" stroke="#0A0A0A" strokeWidth="0.75" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#hud-grid-${identifier})`} />
          </svg>

          {/* Precision Corner Brackets */}
          <span className="absolute top-2 left-2 text-[10px] leading-none text-[#0A0A0A] font-bold">┌</span>
          <span className="absolute top-2 right-2 text-[10px] leading-none text-[#0A0A0A] font-bold">┐</span>
          <span className="absolute bottom-2 left-2 text-[10px] leading-none text-[#0A0A0A] font-bold">└</span>
          <span className="absolute bottom-2 right-2 text-[10px] leading-none text-[#0A0A0A] font-bold">┘</span>

          {/* Top Bar: Telemetry / Status */}
          <div className="relative z-10 flex items-center justify-between text-[9px] tracking-wider text-[#4A5056] border-b border-[#0A0A0A]/20 pb-1">
            <span className="flex items-center gap-1.5 font-bold text-[#0A0A0A]">
              <span className="w-1.5 h-1.5 bg-emerald-600 inline-block animate-pulse"></span>
              OPTICAL_FEED // READY
            </span>
            <span className="text-[#0A0A0A]/40">CAD.1:1</span>
          </div>

          {/* Center: Reticle Crosshair & SKU */}
          <div className="relative z-10 flex flex-col items-center justify-center my-auto text-center py-2">
            <div className="relative w-16 h-16 flex items-center justify-center mb-1.5">
              <div className="absolute inset-0 border border-[#0A0A0A]/30 rounded-full" />
              <div className="absolute w-20 h-px bg-[#0A0A0A]/40" />
              <div className="absolute h-20 w-px bg-[#0A0A0A]/40" />
              <div className="w-2 h-2 bg-[#0A0A0A]" />
            </div>
            <div className="text-xs sm:text-sm font-bold tracking-tight text-[#0A0A0A] uppercase">
              {identifier}
            </div>
            <div className="text-[10px] text-[#4A5056] uppercase tracking-wider truncate max-w-[90%]">
              {categoryLabel}
            </div>
          </div>

          {/* Bottom Bar: Calibration Stamp */}
          <div className="relative z-10 flex items-center justify-between text-[9px] text-[#4A5056] pt-1 border-t border-[#0A0A0A]/20">
            <span>INDEX B2-2097</span>
            <span className="font-bold text-[#0A0A0A]">QC: PASS 100%</span>
          </div>
        </div>
      ) : (
        /* 2. REAL LOADED IMAGE WITH SMOOTH FADE-IN */
        <>
          {/* Subtle loading placeholder while image is fetching */}
          {status === 'loading' && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#D4D8DC] font-mono text-[10px] text-[#4A5056]">
              <span className="animate-pulse">LOADING_FEED // ...</span>
            </div>
          )}

          <img
            src={resolvedSrc}
            alt={alt}
            loading={loading}
            fetchPriority={fetchPriority}
            decoding="async"
            onLoad={() => setStatus('loaded')}
            onError={() => setStatus('error')}
            className={`w-full h-full transition-opacity duration-500 ease-out ${
              status === 'loaded' ? 'opacity-100' : 'opacity-0'
            } ${objectFit === 'contain' ? 'object-contain' : 'object-cover'} ${
              grayscale ? 'grayscale-[0.2] contrast-[1.04]' : ''
            } ${className}`}
          />
        </>
      )}
    </div>
  );
};

export default HudSmartImage;
