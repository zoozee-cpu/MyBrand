/* ============================================================
   ZKS FRAGRANCES — PRODUCT.JS
   Product detail page: URL param read, gallery, pyramid,
   add-to-cart, WhatsApp share
   ============================================================ */

'use strict';

// ─── READ PRODUCT FROM URL ────────────────────────────────────
function getProductFromURL() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  return PRODUCTS.find(p => p.id === id) || null;
}

// ─── POPULATE PAGE META ───────────────────────────────────────
function populateMeta(product) {
  document.title = `${product.name} — ZKS Fragrances`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.content = product.description;
}

// ─── POPULATE PRODUCT INFO ────────────────────────────────────
function populateProductInfo(product) {
  // Families
  const familiesEl = document.getElementById('pd-families');
  if (familiesEl) {
    familiesEl.innerHTML = product.scentFamily
      .map(f => `<span class="badge badge-outline">${f}</span>`)
      .join(' ');
  }

  // Name
  const nameEl = document.getElementById('pd-name');
  if (nameEl) nameEl.textContent = product.name;

  // Price
  const priceEl = document.getElementById('pd-price');
  if (priceEl) priceEl.textContent = `${product.currency} ${product.price.toLocaleString()} / ${product.size}`;

  // Short description
  const descEl = document.getElementById('pd-description');
  if (descEl) descEl.textContent = product.description;

  // Long description
  const longEl = document.getElementById('pd-long-description');
  if (longEl) longEl.textContent = product.longDescription;

  // Badge
  const badgeEl = document.getElementById('pd-badge');
  if (badgeEl) {
    if (product.badge) {
      badgeEl.textContent = product.badge;
      badgeEl.style.display = 'inline-block';
    } else {
      badgeEl.style.display = 'none';
    }
  }

  // Gender / occasion tags
  const tagsEl = document.getElementById('pd-tags');
  if (tagsEl) {
    const tags = [product.gender, ...product.occasion];
    tagsEl.innerHTML = tags.map(t => `<span class="scent-tag">${t}</span>`).join('');
  }

  // WhatsApp share link
  const waBtn = document.getElementById('pd-wa-share');
  if (waBtn) {
    const msg = encodeURIComponent(`I'm interested in ${product.name} by ZKS Fragrances.`);
    waBtn.href = `https://wa.me/923407122385?text=${msg}`;
  }
}

// ─── GALLERY ─────────────────────────────────────────────────
function initGallery(product) {
  const mainImg = document.getElementById('gallery-main-img');
  const thumbsContainer = document.getElementById('gallery-thumbs');
  if (!mainImg || !thumbsContainer) return;

  const images = product.images.gallery.length > 0
    ? product.images.gallery
    : [product.images.primary, product.images.hover];

  // Set main image
  mainImg.src = images[0];
  mainImg.alt = `${product.name} by ZKS Fragrances`;

  // Handle missing image
  mainImg.onerror = function () {
    this.onerror = null;
    const wrap = document.getElementById('gallery-main');
    if (wrap) {
      wrap.innerHTML = `<div class="product-card-placeholder">${product.name.split(' ').map(w=>w[0]).join('').slice(0,2)}</div>`;
    }
  };

  // Render thumbnails
  thumbsContainer.innerHTML = images.map((src, i) => `
    <div class="gallery-thumb ${i === 0 ? 'active' : ''}" data-src="${src}" data-index="${i}">
      <img src="${src}" alt="${product.name} view ${i + 1}" loading="lazy">
    </div>
  `).join('');

  // Thumb click
  thumbsContainer.querySelectorAll('.gallery-thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      const src = thumb.dataset.src;
      mainImg.style.opacity = '0';
      setTimeout(() => {
        mainImg.src = src;
        mainImg.style.opacity = '1';
      }, 200);
      thumbsContainer.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
    });
  });
}

// ─── SCENT PYRAMID ───────────────────────────────────────────
const pyramidDescriptions = {
  top:   "Top notes are the first impression — the bright, fleeting opening burst that you smell immediately upon application. They typically last 15–30 minutes before evolving.",
  heart: "Heart notes form the soul of the fragrance. Emerging after the top notes dissipate, they define the character of the scent and last for several hours.",
  base:  "Base notes are the foundation — the deep, long-lasting elements that anchor the fragrance to your skin. They develop fully after 30 minutes and can last all day."
};

function initPyramid(product) {
  const pyramidEl = document.getElementById('scent-pyramid');
  if (!pyramidEl) return;

  const layers = [
    { key: 'top',   label: 'Top Notes',   cls: 'top',   delay: 0 },
    { key: 'heart', label: 'Heart Notes', cls: 'heart', delay: 0.4 },
    { key: 'base',  label: 'Base Notes',  cls: 'base',  delay: 0.8 }
  ];

  pyramidEl.innerHTML = layers.map(layer => `
    <div class="pyramid-layer ${layer.cls}" data-layer="${layer.key}" style="transition-delay: ${layer.delay}s">
      <div class="pyramid-layer-indicator"></div>
      <div class="pyramid-layer-label">${layer.label}</div>
      <div class="pyramid-layer-notes">${product.pyramid[layer.key].join(', ')}</div>
      <div class="pyramid-layer-expand">▾</div>
    </div>
    <div class="pyramid-layer-detail" data-detail="${layer.key}">
      ${pyramidDescriptions[layer.key]}
    </div>
  `).join('');

  // Toggle expand
  pyramidEl.querySelectorAll('.pyramid-layer').forEach(layer => {
    layer.addEventListener('click', () => {
      const key = layer.dataset.layer;
      const detail = pyramidEl.querySelector(`[data-detail="${key}"]`);
      const isExpanded = layer.classList.toggle('expanded');
      if (detail) detail.style.display = isExpanded ? 'block' : 'none';
    });
  });

  // Animate pyramid layers on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        pyramidEl.querySelectorAll('.pyramid-layer').forEach(l => l.classList.add('visible'));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  observer.observe(pyramidEl);
}

// ─── QUANTITY SELECTOR ────────────────────────────────────────
let currentQty = 1;

function initQtySelector() {
  const display = document.getElementById('qty-display');
  const minusBtn = document.getElementById('qty-minus');
  const plusBtn  = document.getElementById('qty-plus');
  if (!display || !minusBtn || !plusBtn) return;

  const update = () => { display.textContent = currentQty; };

  minusBtn.addEventListener('click', () => {
    if (currentQty > 1) { currentQty--; update(); }
  });

  plusBtn.addEventListener('click', () => {
    if (currentQty < 10) { currentQty++; update(); }
  });
}

// ─── ADD TO CART ──────────────────────────────────────────────
function initAddToCart(product) {
  const btn = document.getElementById('add-to-cart-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    for (let i = 0; i < currentQty; i++) {
      addToCart(product.id);
    }
    showToast(`✓ ${product.name} × ${currentQty} added to cart`, 'View Cart', 'cart.html');

    // Button feedback
    const original = btn.textContent;
    btn.textContent = '✓ Added!';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
    }, 1500);
  });
}

// ─── RELATED PRODUCTS ─────────────────────────────────────────
function renderRelated(product) {
  const container = document.getElementById('related-products');
  if (!container) return;

  const related = PRODUCTS
    .filter(p => p.id !== product.id)
    .filter(p => p.scentFamily.some(f => product.scentFamily.includes(f)))
    .slice(0, 3);

  if (related.length === 0) {
    container.closest('section') && (container.closest('section').style.display = 'none');
    return;
  }

  // Use renderProductCard from shop.js if available
  container.innerHTML = related.map(p => {
    if (typeof renderProductCard === 'function') return renderProductCard(p);
    return `<a href="product.html?id=${p.id}" class="btn btn-outline">${p.name}</a>`;
  }).join('');

  container.querySelectorAll('.product-card').forEach((card, i) => {
    card.setAttribute('data-animate', 'fade-up');
    card.style.transitionDelay = `${i * 0.1}s`;
  });
}

// ─── SHOW 404 ─────────────────────────────────────────────────
function show404() {
  const container = document.getElementById('product-detail-container');
  if (container) {
    container.innerHTML = `
      <div class="empty-state" style="padding: 120px 24px; text-align:center">
        <span class="empty-state-icon">🌿</span>
        <h3>Fragrance not found</h3>
        <p>The scent you're looking for may have moved.</p>
        <a href="shop.html" class="btn btn-outline mt-3">Browse All Fragrances</a>
      </div>
    `;
  }
}

// ─── INIT ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const product = getProductFromURL();
  if (!product) { show404(); return; }

  populateMeta(product);
  populateProductInfo(product);
  initGallery(product);
  initPyramid(product);
  initQtySelector();
  initAddToCart(product);
  renderRelated(product);

  // Add to breadcrumb if exists
  const breadcrumbName = document.getElementById('breadcrumb-product-name');
  if (breadcrumbName) breadcrumbName.textContent = product.name;
});
