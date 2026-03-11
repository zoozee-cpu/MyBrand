/* ============================================================
   ZKS FRAGRANCES — MAIN.JS
   Shared utilities: navbar scroll, cart badge, event bus,
   toast system, mobile nav, active nav link
   ============================================================ */

'use strict';

// ─── EVENT BUS ───────────────────────────────────────────────
const EventBus = {
  _listeners: {},
  on(event, cb) {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(cb);
  },
  emit(event, data) {
    (this._listeners[event] || []).forEach(cb => cb(data));
  },
  off(event, cb) {
    if (!this._listeners[event]) return;
    this._listeners[event] = this._listeners[event].filter(fn => fn !== cb);
  }
};

// ─── NAVBAR SCROLL BEHAVIOR ───────────────────────────────────
function initNavbar() {
  const nav = document.querySelector('.navbar');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 80);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run on load
}

// ─── MOBILE NAV ───────────────────────────────────────────────
function initMobileNav() {
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-nav a');

  if (!hamburger || !mobileNav) return;

  const toggle = () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  hamburger.addEventListener('click', toggle);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ─── ACTIVE NAV LINK ─────────────────────────────────────────
function setActiveNavLink() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-links a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// ─── CART BADGE ───────────────────────────────────────────────
function updateCartBadge() {
  const badges = document.querySelectorAll('.cart-badge');
  const count = getCartCount();
  badges.forEach(badge => {
    badge.textContent = count > 0 ? count : '';
    badge.style.display = count > 0 ? 'flex' : 'none';
  });
}

function pulseCartBadge() {
  document.querySelectorAll('.cart-badge').forEach(badge => {
    badge.classList.remove('pulse');
    void badge.offsetWidth; // reflow
    badge.classList.add('pulse');
    setTimeout(() => badge.classList.remove('pulse'), 500);
  });
}

// Listen for cart changes
EventBus.on('cartUpdated', () => {
  updateCartBadge();
  pulseCartBadge();
});

// ─── TOAST NOTIFICATION SYSTEM ───────────────────────────────
function showToast(message, linkText = null, linkHref = '#') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <div class="toast-icon">✓</div>
    <div class="toast-content">
      <span class="toast-message">${message}</span>
      ${linkText ? `<a href="${linkHref}" class="toast-link">${linkText} →</a>` : ''}
    </div>
  `;

  container.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });

  // Auto-dismiss
  const dismiss = () => {
    toast.classList.add('hide');
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 450);
  };

  setTimeout(dismiss, 3000);
  toast.addEventListener('click', dismiss);
}

// ─── HELPERS ─────────────────────────────────────────────────
function formatPrice(price, currency = 'Rs') {
  return `${currency} ${price.toLocaleString('en-PK')}`;
}

function getProductById(id) {
  return (typeof PRODUCTS !== 'undefined' ? PRODUCTS : []).find(p => p.id === id) || null;
}

function debounce(fn, delay = 150) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function getCartCount() {
  try {
    const cart = JSON.parse(localStorage.getItem('zks_cart') || '[]');
    return cart.reduce((t, i) => t + i.qty, 0);
  } catch { return 0; }
}

// ─── QUIZ MODAL TRIGGER ──────────────────────────────────────
function initQuizTriggers() {
  document.querySelectorAll('[data-quiz-open]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = document.querySelector('.quiz-modal');
      if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
        EventBus.emit('quizOpen');
      }
    });
  });
}

// ─── SMOOTH SCROLL ANCHORS ────────────────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ─── IMAGE ERROR FALLBACK ─────────────────────────────────────
function initImageFallbacks() {
  document.querySelectorAll('img[data-fallback-text]').forEach(img => {
    img.addEventListener('error', function () {
      const parent = this.parentElement;
      if (parent) {
        const placeholder = document.createElement('div');
        placeholder.className = 'product-card-placeholder';
        placeholder.textContent = this.dataset.fallbackText || 'ZKS';
        parent.replaceChild(placeholder, this);
      }
    });
  });
}

// ─── DOM READY INIT ───────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileNav();
  setActiveNavLink();
  updateCartBadge();
  initQuizTriggers();
  initSmoothScroll();
  initImageFallbacks();
});
