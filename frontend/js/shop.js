/* ============================================================
   ZKS FRAGRANCES — SHOP.JS
   Filter engine, product grid renderer, URL param sync,
   sort functionality
   ============================================================ */

'use strict';

// ─── STATE ───────────────────────────────────────────────────
const ShopState = {
  filters: {
    price: [],
    family: [],
    occasion: [],
    gender: []
  },
  sort: 'default',
  results: []
};

// ─── FILTER ENGINE ────────────────────────────────────────────
function applyFilters(products) {
  let results = [...products];

  const { price, family, occasion, gender } = ShopState.filters;

  if (price.length) {
    results = results.filter(p => {
      return price.some(range => {
        if (range === 'under-2100') return p.price < 2100;
        if (range === '2100-2500')  return p.price >= 2100 && p.price <= 2500;
        return false;
      });
    });
  }

  if (family.length) {
    results = results.filter(p =>
      family.some(f => p.scentFamily.map(s => s.toLowerCase()).includes(f.toLowerCase()))
    );
  }

  if (occasion.length) {
    results = results.filter(p =>
      occasion.some(o => p.occasion.map(oc => oc.toLowerCase()).includes(o.toLowerCase()))
    );
  }

  if (gender.length) {
    results = results.filter(p =>
      gender.some(g => p.gender.toLowerCase() === g.toLowerCase())
    );
  }

  // Sort
  if (ShopState.sort === 'price-asc') {
    results.sort((a, b) => a.price - b.price);
  } else if (ShopState.sort === 'price-desc') {
    results.sort((a, b) => b.price - a.price);
  }

  return results;
}

// ─── RENDER PRODUCT CARD ──────────────────────────────────────
function renderProductCard(product) {
  const hasImage = true; // actual images may not exist yet, handled via onerror
  const badgeHtml = product.badge
    ? `<span class="badge badge-gold product-card-badge">${product.badge}</span>`
    : '';

  return `
    <div class="product-card" data-product-id="${product.id}" onclick="window.location.href='product.html?id=${product.id}'">
      <div class="product-card-image-wrap">
        ${badgeHtml}
        <img
          class="product-card-img"
          src="${product.images.primary}"
          alt="${product.name} by ZKS Fragrances"
          loading="lazy"
          onerror="this.onerror=null;this.parentElement.innerHTML=generatePlaceholder('${product.name}', '${product.id}')"
        >
        <img
          class="product-card-img-hover"
          src="${product.images.hover}"
          alt="${product.name} alternate view"
          loading="lazy"
        >
      </div>
      <div class="product-card-body">
        <div class="product-card-families">${product.scentFamily.join(' · ')}</div>
        <h3 class="product-card-name">${product.name}</h3>
        <div class="product-card-price">${product.currency} ${product.price.toLocaleString()}</div>
        <hr class="product-card-rule">
        <div class="product-card-actions">
          <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); quickAdd('${product.id}')">Quick Add</button>
          <a class="btn btn-ghost btn-sm" href="product.html?id=${product.id}" onclick="event.stopPropagation()">View →</a>
        </div>
      </div>
    </div>
  `;
}

function generatePlaceholder(name, id) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const colors = {
    'aqua-ember':   '#1A3320',
    'aqua-bloom':   '#1A332A',
    'dark-ember':   '#1A1A20',
    'golden-hours': '#1A2A20',
    'illusion':     '#0D2020',
    'zks-tulip':    '#1A2A28',
    'ultra-man':    '#1A2018',
    'velvet-soul':  '#201A20'
  };
  const bg = colors[id] || '#132614';
  return `<div class="product-card-placeholder" style="background:${bg}">${initials}</div>`;
}

// ─── RENDER GRID ──────────────────────────────────────────────
function renderGrid(products) {
  const grid = document.getElementById('product-grid');
  const countEl = document.getElementById('product-count');
  if (!grid) return;

  grid.classList.add('loading');

  setTimeout(() => {
    if (products.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1">
          <span class="empty-state-icon">🌿</span>
          <h3>No fragrances found</h3>
          <p>"Every scent tells a story — try broadening your search."</p>
          <button class="btn btn-outline" onclick="clearAllFilters()">Clear All Filters</button>
        </div>
      `;
    } else {
      grid.innerHTML = products.map(renderProductCard).join('');
      // Stagger animate
      grid.querySelectorAll('.product-card').forEach((card, i) => {
        card.setAttribute('data-animate', 'fade-up');
        card.style.transitionDelay = `${i * 0.07}s`;
      });
      if (typeof initScrollObserver === 'function') initScrollObserver();
    }

    grid.classList.remove('loading');

    if (countEl) {
      countEl.textContent = `${products.length} Fragrance${products.length !== 1 ? 's' : ''}`;
    }
  }, 150);
}

// ─── QUICK ADD ────────────────────────────────────────────────
function quickAdd(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  addToCart(productId);
  showToast(`✓ ${product.name} added to cart`, 'View Cart', 'cart.html');
}

// ─── FILTER CHANGE HANDLER ────────────────────────────────────
function onFilterChange() {
  // Read all checked boxes
  ShopState.filters.price    = getChecked('[data-filter="price"]');
  ShopState.filters.family   = getChecked('[data-filter="family"]');
  ShopState.filters.occasion = getChecked('[data-filter="occasion"]');
  ShopState.filters.gender   = getChecked('[data-filter="gender"]');

  const results = applyFilters(PRODUCTS);
  ShopState.results = results;
  renderGrid(results);
  syncURLParams();
  updateMobileFilterBadge();
}

function getChecked(selector) {
  return Array.from(document.querySelectorAll(`${selector}:checked`)).map(el => el.value);
}

function clearAllFilters() {
  document.querySelectorAll('[data-filter]').forEach(el => { el.checked = false; });
  ShopState.filters = { price: [], family: [], occasion: [], gender: [] };
  renderGrid(PRODUCTS);
  syncURLParams();
  updateMobileFilterBadge();
}

// ─── SORT ─────────────────────────────────────────────────────
function onSortChange(value) {
  ShopState.sort = value;
  const results = applyFilters(PRODUCTS);
  renderGrid(results);
}

// ─── URL PARAM SYNC ───────────────────────────────────────────
function syncURLParams() {
  const params = new URLSearchParams();
  const { price, family, occasion, gender } = ShopState.filters;
  if (family.length)   params.set('family',   family.join(','));
  if (occasion.length) params.set('occasion', occasion.join(','));
  if (gender.length)   params.set('gender',   gender.join(','));
  if (price.length)    params.set('price',    price.join(','));
  const newUrl = params.toString()
    ? `${window.location.pathname}?${params.toString()}`
    : window.location.pathname;
  window.history.replaceState({}, '', newUrl);
}

function readURLParams() {
  const params = new URLSearchParams(window.location.search);
  const setFilter = (key, el_attr) => {
    const val = params.get(key);
    if (!val) return;
    val.split(',').forEach(v => {
      const el = document.querySelector(`[data-filter="${el_attr}"][value="${v}"]`);
      if (el) el.checked = true;
    });
  };
  setFilter('family',   'family');
  setFilter('occasion', 'occasion');
  setFilter('gender',   'gender');
  setFilter('price',    'price');
  onFilterChange();
}

// ─── MOBILE FILTER BADGE ──────────────────────────────────────
function updateMobileFilterBadge() {
  const badge = document.getElementById('mobile-filter-count');
  if (!badge) return;
  const total = Object.values(ShopState.filters).flat().length;
  badge.textContent = total > 0 ? total : '';
  badge.style.display = total > 0 ? 'inline-flex' : 'none';
}

// ─── MOBILE FILTER TOGGLE ─────────────────────────────────────
function initMobileFilterToggle() {
  const btn = document.getElementById('filter-toggle-btn');
  const sidebar = document.getElementById('filter-sidebar');
  if (!btn || !sidebar) return;

  btn.addEventListener('click', () => {
    const isOpen = sidebar.classList.toggle('mobile-open');
    btn.textContent = isOpen ? 'Hide Filters' : 'Filters';
  });
}

// ─── INIT ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('product-grid')) return;

  // Bind filter checkboxes
  document.querySelectorAll('[data-filter]').forEach(el => {
    el.addEventListener('change', onFilterChange);
  });

  // Bind sort
  const sortEl = document.getElementById('sort-select');
  if (sortEl) sortEl.addEventListener('change', e => onSortChange(e.target.value));

  // Bind clear
  const clearBtn = document.getElementById('clear-filters-btn');
  if (clearBtn) clearBtn.addEventListener('click', clearAllFilters);

  // Mobile filter toggle
  initMobileFilterToggle();

  // Read URL params, then render
  readURLParams();

  // Initial render (if no params)
  if (!window.location.search) renderGrid(PRODUCTS);
});
