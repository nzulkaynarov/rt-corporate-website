/**
 * Site motion (bundled into every page by BaseLayout.astro). Everything here is progressive: without JavaScript or
 * with «reduce motion» turned on in the system, the site works and shows all content without animation.
 *
 * 1. Smooth wheel scrolling (Lenis). Touch screens keep native scrolling; nested scroll areas scroll on their own.
 * 2. Header shadow once the page is scrolled (`.hdr--scrolled`).
 * 3. Counters: `[data-count="250+"]` counts from 0 to the number once it comes into view; text around the number
 *    («+», «24/7») is kept. The element is aria-hidden; the final value is in a visually hidden twin next to it.
 * Scroll reveal of section blocks is pure CSS (global.css, `animation-timeline: view()`), no script.
 */
import Lenis from 'lenis';

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

/* 1. Smooth scrolling */
let lenis: Lenis | null = null;
const headerOffset = () => -((document.querySelector('.hdr') as HTMLElement | null)?.offsetHeight ?? 0) - 16;

function startLenis() {
  if (lenis || reduce.matches) return;
  lenis = new Lenis({
    lerp: 0.12,
    smoothWheel: true,
    autoRaf: true,
    allowNestedScroll: true,
    stopInertiaOnNavigate: true,
    anchors: { offset: headerOffset() },
  });
}
function stopLenis() {
  lenis?.destroy();
  lenis = null;
}
startLenis();
reduce.addEventListener('change', () => (reduce.matches ? stopLenis() : startLenis()));

/* 2. Header state */
const hdr = document.querySelector('.hdr');
if (hdr) {
  let ticking = false;
  const update = () => {
    hdr.classList.toggle('hdr--scrolled', window.scrollY > 4);
    ticking = false;
  };
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  update();
}

/* 3. Counters */
const counters = Array.from(document.querySelectorAll<HTMLElement>('[data-count]'));
if (counters.length && !reduce.matches && 'IntersectionObserver' in window) {
  const DURATION = 1600;
  const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
  const run = (el: HTMLElement) => {
    const final = el.dataset.count || '';
    const m = final.match(/^(\D*)(\d+)(.*)$/s);
    if (!m) return;
    const [, before, digits, after] = m;
    const target = Number(digits);
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1);
      el.textContent = `${before}${Math.round(target * easeOut(t))}${after}`;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        io.unobserve(e.target);
        run(e.target as HTMLElement);
      }
    },
    { threshold: 0.6 },
  );
  for (const el of counters) {
    // Below the fold: start from 0 so the count is seen; already on screen: count right away.
    const m = (el.dataset.count || '').match(/^(\D*)(\d+)(.*)$/s);
    if (m && el.getBoundingClientRect().top > window.innerHeight) el.textContent = `${m[1]}0${m[3]}`;
    io.observe(el);
  }
}
