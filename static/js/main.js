/* ═══════════════════════════════════════════════════════════════
   RailTech Corporate — Main JavaScript
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── Header scroll effect ──────────────────────────────── */
  const header = document.getElementById('site-header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ─── Mobile menu toggle ────────────────────────────────── */
  const toggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
      mobileMenu.setAttribute('aria-hidden', !isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        mobileMenu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        toggle.focus();
      }
    });
  }

  /* ─── Smooth scroll for anchor links ────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = header ? header.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ─── Intersection Observer for animations ──────────────── */
  const animateOnScroll = () => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll(
      '.card, .stat-item, .advantage-card, .platform-card, .timeline-item, .contact-item, .faq-item'
    ).forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(el);
    });
  };

  // Add CSS for animation
  const style = document.createElement('style');
  style.textContent = '.animate-in { opacity: 1 !important; transform: translateY(0) !important; }';
  document.head.appendChild(style);

  if ('IntersectionObserver' in window) {
    animateOnScroll();
  }

  /* ─── Stats counter animation ───────────────────────────── */
  const animateCounters = () => {
    const counters = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const text = el.textContent.trim();
            const match = text.match(/(\d+)/);
            if (match) {
              const target = parseInt(match[1], 10);
              const suffix = text.replace(match[1], '');
              let current = 0;
              const increment = Math.max(1, Math.floor(target / 40));
              const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                  current = target;
                  clearInterval(timer);
                }
                el.textContent = current + suffix;
              }, 30);
            }
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((c) => observer.observe(c));
  };

  if ('IntersectionObserver' in window) {
    animateCounters();
  }

  /* ─── Copy link button ──────────────────────────────────── */
  document.querySelectorAll('.share-copy').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const url = btn.dataset.url;
      try {
        await navigator.clipboard.writeText(url);
        const svg = btn.innerHTML;
        btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>';
        setTimeout(() => { btn.innerHTML = svg; }, 2000);
      } catch {
        // Fallback
        const input = document.createElement('input');
        input.value = url;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
    });
  });

  /* ─── FAQ accordion: close others ───────────────────────── */
  document.querySelectorAll('.faq-item').forEach((item) => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        document.querySelectorAll('.faq-item').forEach((other) => {
          if (other !== item && other.open) other.open = false;
        });
      }
    });
  });

  /* ─── Theme Toggle ─────────────────────────────────────── */
  const themeToggle = document.getElementById('theme-toggle');
  const docEl = document.documentElement;

  if (themeToggle) {
    const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    docEl.setAttribute('data-theme', savedTheme);

    const updateToggleUI = (theme) => {
      const isDark = theme === 'dark';
      themeToggle.setAttribute('aria-label', isDark ? themeToggle.dataset.labelLight : themeToggle.dataset.labelDark);
      themeToggle.setAttribute('title', isDark ? themeToggle.dataset.labelLight : themeToggle.dataset.labelDark);
    };

    themeToggle.addEventListener('click', () => {
      const currentTheme = docEl.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      docEl.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateToggleUI(newTheme);
    });

    // Handle OS preference change
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        docEl.setAttribute('data-theme', newTheme);
        updateToggleUI(newTheme);
      }
    });
  }

  /* ─── Search Overlay ────────────────────────────────────── */
  const searchToggle = document.querySelector('.search-toggle');
  const searchOverlay = document.createElement('div');
  searchOverlay.className = 'search-overlay';
  searchOverlay.innerHTML = `
    <div class="search-container">
      <button class="search-close" aria-label="Close search">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
      <input type="text" class="search-input" placeholder="Что вы ищете?" aria-label="Search site">
      <div class="search-results"></div>
    </div>
  `;
  document.body.appendChild(searchOverlay);

  const searchInput = searchOverlay.querySelector('.search-input');
  const searchClose = searchOverlay.querySelector('.search-close');

  const toggleSearch = (state) => {
    searchOverlay.classList.toggle('active', state);
    document.body.style.overflow = state ? 'hidden' : '';
    if (state) setTimeout(() => searchInput.focus(), 100);
  };

  if (searchToggle) {
    searchToggle.addEventListener('click', () => toggleSearch(true));
  }
  searchClose.addEventListener('click', () => toggleSearch(false));
  searchOverlay.addEventListener('click', (e) => {
    if (e.target === searchOverlay) toggleSearch(false);
  });

  /* ─── Mobile Dropdowns ──────────────────────────────────── */
  document.querySelectorAll('.has-dropdown > .nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const parent = link.parentElement;
        parent.classList.toggle('active');
      }
    });
  });

  /* ─── Optimized Ticker Animation ────────────────────────── */
  const initTicker = () => {
    const ticker = document.getElementById('hero-ticker');
    const track = document.getElementById('ticker-track');
    if (!ticker || !track) return;

    let x = 0;
    let animationId = null;
    let isVisible = false;

    const animate = () => {
      if (!isVisible) return;
      x -= 0.5; // speed
      if (Math.abs(x) >= track.offsetWidth / 2) {
        x = 0;
      }
      track.style.transform = `translateX(${x}px)`;
      animationId = requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          animate();
        } else if (animationId) {
          cancelAnimationFrame(animationId);
        }
      });
    }, { threshold: 0.1 });

    observer.observe(ticker);
  };

  initTicker();

  // Close search on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (searchOverlay.classList.contains('active')) toggleSearch(false);
    }
  });

})();
