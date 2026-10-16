import React, { useState, useEffect, useRef } from 'react';

const GLYPHS = '#%&@$/\\<>01_=+*';

/**
 * Scrambles a string into its final value over ~250ms (HUD index decipher effect).
 */
export function useScramble(target: string, trigger: any = 0, durationMs: number = 250): string {
  const [out, setOut] = useState(target);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setOut(target);
      return;
    }
    let frame = 0;
    const totalFrames = 10;
    const stepTime = Math.max(16, Math.floor(durationMs / totalFrames));

    const id = window.setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const revealed = Math.floor(progress * target.length);

      setOut(
        target
          .split('')
          .map((ch, i) => {
            if (i < revealed || ch === ' ' || ch === '/' || ch === ':') return ch;
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join('')
      );

      if (frame >= totalFrames) {
        window.clearInterval(id);
        setOut(target);
      }
    }, stepTime);

    return () => window.clearInterval(id);
  }, [target, trigger, durationMs]);

  return out;
}

export interface HudCounterProps {
  value: string;
  durationMs?: number;
  className?: string;
}

/**
 * Parses numeric strings like "1 200+", "86+", "12%" and counts smoothly from 0 to target over durationMs
 * upon entering the viewport.
 */
export const HudCounter: React.FC<HudCounterProps> = ({
  value,
  durationMs = 850,
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState<string>('0');
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayValue(value);
      return;
    }

    const cleanNumStr = value.replace(/[^0-9.]/g, '');
    const targetNum = parseFloat(cleanNumStr);
    if (Number.isNaN(targetNum)) {
      setDisplayValue(value);
      return;
    }

    // Extract prefix and suffix (e.g. "+" or "%" or " SKU")
    const match = value.match(/^([^0-9]*)([\d\s.,]+)(.*)$/);
    const prefix = match ? match[1] : '';
    const suffix = match ? match[3] : '';
    const hasSpaceSeparator = value.includes(' ');

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const startTime = performance.now();

          const update = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(1, elapsed / durationMs);
            // Ease out cubic
            const ease = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(targetNum * ease);

            let formatted = current.toString();
            if (hasSpaceSeparator && current >= 1000) {
              formatted = current.toLocaleString('ru-RU');
            }
            setDisplayValue(`${prefix}${formatted}${suffix}`);

            if (progress < 1) {
              requestAnimationFrame(update);
            } else {
              setDisplayValue(value);
            }
          };

          requestAnimationFrame(update);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, durationMs, hasAnimated]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {displayValue}
    </span>
  );
};

export interface HudScrambleTextProps {
  text: string;
  trigger?: any;
  className?: string;
  onHover?: boolean;
}

export const HudScrambleText: React.FC<HudScrambleTextProps> = ({
  text,
  trigger = 0,
  className = '',
  onHover = true,
}) => {
  const [localTrigger, setLocalTrigger] = useState(0);
  const scrambled = useScramble(text, trigger + localTrigger, 240);

  return (
    <span
      className={className}
      onMouseEnter={() => {
        if (onHover) setLocalTrigger((t) => t + 1);
      }}
    >
      {scrambled}
    </span>
  );
};

export default HudCounter;
