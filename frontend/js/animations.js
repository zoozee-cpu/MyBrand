/* ============================================================
   ZKS FRAGRANCES — ANIMATIONS.JS
   IntersectionObserver scroll-reveal, stagger effects,
   all page animation initialization
   ============================================================ */

'use strict';

// ─── SCROLL REVEAL OBSERVER ──────────────────────────────────
function initScrollObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('[data-animate]').forEach(el => {
    // Don't re-observe already visible elements
    if (!el.classList.contains('is-visible')) {
      observer.observe(el);
    }
  });
}

// ─── STAGGER GRID ITEMS ───────────────────────────────────────
function staggerItems(containerSelector, itemSelector, animationType = 'fade-up') {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  container.querySelectorAll(itemSelector).forEach((el, i) => {
    el.setAttribute('data-animate', animationType);
    el.style.transitionDelay = `${i * 0.1}s`;
  });

  initScrollObserver();
}

// ─── HERO STATS COUNTER ───────────────────────────────────────
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        let current = 0;
        const increment = Math.ceil(target / 40);
        const timer = setInterval(() => {
          current = Math.min(current + increment, target);
          el.textContent = current + (el.dataset.suffix || '');
          if (current >= target) clearInterval(timer);
        }, 40);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));
}

// ─── PARALLAX HERO (desktop only) ────────────────────────────
function initHeroParallax() {
  const hero = document.querySelector('.hero-section');
  if (!hero) return;

  // Disable on mobile
  if (window.matchMedia('(max-width: 767px)').matches) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const rate = scrollY * 0.4;
        hero.style.backgroundPositionY = `calc(50% + ${rate}px)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// ─── PRODUCT CARD HOVER: disable on touch ────────────────────
function detectTouch() {
  if (window.matchMedia('(hover: none)').matches) {
    document.documentElement.classList.add('touch-device');
  }
}

// ─── SECTION STAGGER ON LOAD ─────────────────────────────────
function initSectionAnimations() {
  // Featured products grid
  staggerItems('#featured-grid', '.product-card', 'fade-up');
  staggerItems('#product-grid',  '.product-card', 'fade-up');

  // Stats
  document.querySelectorAll('[data-animate="scale-up"]').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.15}s`;
  });
}

// ─── IMAGE LAZY LOAD FALLBACK ─────────────────────────────────
function initLazyImages() {
  if ('loading' in HTMLImageElement.prototype) return; // native support

  const images = document.querySelectorAll('img[loading="lazy"]');
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) img.src = img.dataset.src;
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));
}

// ─── PAGE LOAD FADE IN ────────────────────────────────────────
function initPageTransition() {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.4s ease';
  window.addEventListener('load', () => {
    document.body.style.opacity = '1';
  });
}

// ─── INIT ALL ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  detectTouch();
  initScrollObserver();
  initSectionAnimations();
  initCounters();
  initHeroParallax();
  initLazyImages();
});
