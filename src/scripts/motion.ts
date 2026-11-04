/**
 * Site motion (bundled into every page by BaseLayout.astro). Everything here is progressive: without JavaScript or
 * with «reduce motion» turned on in the system, the site works and shows all content without animation.
 *
 * 1. Smooth wheel scrolling (Lenis). Touch screens keep native scrolling; nested scroll areas scroll on their own.
 * 2. Scroll reveal: direct children of `.section > .wrap` and any `[data-reveal]` rise in once when they come into view.
 *    CSS (global.css, `.rv …`) hides them only while `html.rv` is set by the inline script in <head>.
 * 3. Header shadow once the page is scrolled (`.hdr--scrolled`).
 */
import Lenis from 'lenis';

const root = document.documentElement;
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

/* 2. Scroll reveal */
const REVEAL = '.section > .wrap > *, [data-reveal]';

function reveal() {
  if (!root.classList.contains('rv')) return;
  root.classList.add('rv-on');
  const items = Array.from(document.querySelectorAll<HTMLElement>(REVEAL));
  const set = new Set<Element>(items);
  const showAll = () => items.forEach((el) => el.classList.add('is-in'));
  if (reduce.matches || !('IntersectionObserver' in window)) return showAll();

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0 },
  );
  for (const el of items) {
    // Neighbouring blocks of one section come in one after another (at most 4 steps of delay).
    const siblings = el.parentElement ? Array.from(el.parentElement.children).filter((c) => set.has(c)) : [el];
    el.style.setProperty('--rv-i', String(Math.min(siblings.indexOf(el), 4)));
    // Already scrolled past (back/forward navigation, #anchor): show at once, no animation off-screen.
    if (el.getBoundingClientRect().bottom < 0) el.classList.add('is-in');
    else io.observe(el);
  }
}
reveal();

/* 3. Header state */
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
