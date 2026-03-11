/* ============================================================
   ZKS FRAGRANCES — CART.JS
   Cart state manager: localStorage operations, UI rendering,
   dispatch cartUpdated events
   ============================================================ */

'use strict';

const CART_KEY = 'zks_cart';

// ─── CORE CART OPERATIONS ─────────────────────────────────────
function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  // Dispatch custom event so navbar badge updates
  document.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart } }));
  if (typeof EventBus !== 'undefined') EventBus.emit('cartUpdated', { cart });
}

function addToCart(productId) {
  const product = (typeof PRODUCTS !== 'undefined' ? PRODUCTS : []).find(p => p.id === productId);
  if (!product) return;

  const cart = getCart();
  const existing = cart.find(i => i.id === productId);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id:    product.id,
      name:  product.name,
      price: product.price,
      size:  product.size,
      qty:   1,
      image: product.images.primary
    });
  }

  saveCart(cart);
}

function removeFromCart(productId) {
  const cart = getCart().filter(i => i.id !== productId);
  saveCart(cart);
}

function updateQty(productId, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(productId);
    return;
  }
  saveCart(cart);
}

function getCartTotal() {
  return getCart().reduce((sum, i) => sum + i.price * i.qty, 0);
}

function getCartCount() {
  return getCart().reduce((sum, i) => sum + i.qty, 0);
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
  document.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart: [] } }));
  if (typeof EventBus !== 'undefined') EventBus.emit('cartUpdated', { cart: [] });
}

// ─── CART PAGE RENDERER ───────────────────────────────────────
function renderCartPage() {
  const listEl    = document.getElementById('cart-list');
  const emptyEl   = document.getElementById('cart-empty');
  const summaryEl = document.getElementById('cart-summary');
  const thankyouEl = document.getElementById('cart-thankyou');

  if (!listEl) return;

  // Hide thank-you screen
  if (thankyouEl) thankyouEl.style.display = 'none';

  const cart = getCart();

  if (cart.length === 0) {
    listEl.style.display    = 'none';
    if (summaryEl) summaryEl.style.display = 'none';
    if (emptyEl)   emptyEl.style.display   = 'flex';
    return;
  }

  if (emptyEl)   emptyEl.style.display   = 'none';
  listEl.style.display    = 'block';
  if (summaryEl) summaryEl.style.display = 'block';

  // Render line items
  listEl.innerHTML = cart.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <img
        class="cart-item-img"
        src="${item.image}"
        alt="${item.name}"
        onerror="this.src='';this.style.display='none'"
      >
      <div class="cart-item-body">
        <h3 class="cart-item-name">${item.name}</h3>
        <p class="cart-item-size">${item.size || '50ml'}</p>
        <div class="cart-item-footer">
          <div class="qty-selector">
            <button class="qty-btn" onclick="cartUpdateQty('${item.id}', -1)">−</button>
            <span class="qty-display">${item.qty}</span>
            <button class="qty-btn" onclick="cartUpdateQty('${item.id}', 1)">+</button>
          </div>
          <span class="price price-large">Rs ${(item.price * item.qty).toLocaleString()}</span>
          <button class="cart-item-remove" onclick="cartRemove('${item.id}')">Remove</button>
        </div>
      </div>
    </div>
  `).join('');

  // Render summary
  renderOrderSummary(cart);
}

function renderOrderSummary(cart) {
  const subtotalEl = document.getElementById('cart-subtotal');
  const totalEl    = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkout-btn');

  const total = getCartTotal();

  if (subtotalEl) subtotalEl.textContent = `Rs ${total.toLocaleString()}`;
  if (totalEl)    totalEl.textContent    = `Rs ${total.toLocaleString()}`;

  if (checkoutBtn) {
    checkoutBtn.disabled = cart.length === 0;
    checkoutBtn.style.opacity = cart.length === 0 ? '0.5' : '1';
  }
}

// ─── CART PAGE ACTIONS ────────────────────────────────────────
function cartUpdateQty(productId, delta) {
  updateQty(productId, delta);
  renderCartPage();
  updateCartBadge();
}

function cartRemove(productId) {
  removeFromCart(productId);
  renderCartPage();
  updateCartBadge();
}

function updateCartBadge() {
  const count = getCartCount();
  document.querySelectorAll('.cart-badge').forEach(badge => {
    badge.textContent = count > 0 ? count : '';
    badge.style.display = count > 0 ? 'flex' : 'none';
  });
}

// ─── THANK YOU SCREEN ─────────────────────────────────────────
function showThankYou() {
  const listEl     = document.getElementById('cart-list');
  const summaryEl  = document.getElementById('cart-summary');
  const emptyEl    = document.getElementById('cart-empty');
  const thankyouEl = document.getElementById('cart-thankyou');

  if (listEl)    listEl.style.display    = 'none';
  if (summaryEl) summaryEl.style.display = 'none';
  if (emptyEl)   emptyEl.style.display   = 'none';
  if (thankyouEl) {
    thankyouEl.style.display = 'flex';
    thankyouEl.scrollIntoView({ behavior: 'smooth' });
  }
}

// ─── INIT ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Update badge on every page
  updateCartBadge();

  // If on cart page, render cart
  if (document.getElementById('cart-list')) {
    renderCartPage();
  }

  // Listen for cart updates
  document.addEventListener('cartUpdated', () => {
    updateCartBadge();
    if (document.getElementById('cart-list')) renderCartPage();
  });
});
