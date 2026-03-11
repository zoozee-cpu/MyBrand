/* ============================================================
   ZKS FRAGRANCES — CHECKOUT.JS
   WhatsApp message builder, pre-checkout modal,
   backend POST, cart clear + thank-you screen
   ============================================================ */

'use strict';

// ─── WHATSAPP MESSAGE BUILDER ────────────────────────────────
function buildWhatsAppMessage(cart) {
  const items = cart.map(item =>
    `• ${item.name} (${item.size || '50ml'}) × ${item.qty} = Rs ${(item.price * item.qty).toLocaleString()}`
  ).join('\n');

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const orderId = `ZKS-${Date.now()}`;

  const message =
    `🌿 *ZKS Fragrances — New Order*\n` +
    `Order ID: ${orderId}\n\n` +
    `*Items Ordered:*\n${items}\n\n` +
    `*Total: Rs ${total.toLocaleString()}*\n\n` +
    `Please share your:\n` +
    `👤 Full Name:\n` +
    `📍 Delivery Address:\n` +
    `📦 Preferred Delivery Time (if any):\n\n` +
    `Thank you for choosing ZKS Fragrances! 🌿`;

  return { message, orderId, total };
}

// ─── BACKEND ORDER POST ───────────────────────────────────────
async function postOrderToBackend(orderId, cart, total) {
  try {
    // Determine backend URL — use env-defined or relative
    const backendUrl = window.ZKS_BACKEND_URL || '/api';

    const response = await fetch(`${backendUrl}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId,
        items: cart.map(item => ({
          id:        item.id,
          name:      item.name,
          price:     item.price,
          qty:       item.qty,
          lineTotal: item.price * item.qty
        })),
        total,
        timestamp: new Date().toISOString(),
        source:    'whatsapp'
      })
    });

    if (!response.ok) {
      console.warn(`Order POST failed (${response.status}) — WhatsApp message still sent.`);
      return false;
    }

    return true;
  } catch (err) {
    // Non-blocking — WhatsApp order still goes through
    console.warn('Backend order post failed:', err.message);
    return false;
  }
}

// ─── OPEN WHATSAPP ────────────────────────────────────────────
function openWhatsApp(encodedMessage) {
  window.open(`https://wa.me/923407122385?text=${encodedMessage}`, '_blank', 'noopener,noreferrer');
}

// ─── PRE-CHECKOUT MODAL ───────────────────────────────────────
function showCheckoutModal() {
  const cart = (typeof getCart === 'function') ? getCart() : [];
  if (cart.length === 0) return;

  const { message, orderId, total } = buildWhatsAppMessage(cart);
  const encoded = encodeURIComponent(message);

  // Build summary lines
  const summaryLines = cart.map(i =>
    `${i.name} × ${i.qty} — Rs ${(i.price * i.qty).toLocaleString()}`
  ).join('<br>');

  const overlay = document.getElementById('checkout-modal-overlay');
  const summaryEl = document.getElementById('checkout-modal-summary');
  if (!overlay) return;

  if (summaryEl) {
    summaryEl.innerHTML = `
      <strong style="display:block;margin-bottom:8px;color:var(--color-text-primary)">Your order:</strong>
      ${summaryLines}
      <hr style="margin:12px 0;border-color:var(--color-border)">
      <strong style="color:var(--color-gold-primary)">Total: Rs ${total.toLocaleString()}</strong>
    `;
  }

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Confirm button
  const confirmBtn = document.getElementById('checkout-confirm-btn');
  if (confirmBtn) {
    // Remove previous listeners
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

    newConfirmBtn.addEventListener('click', async () => {
      newConfirmBtn.textContent = 'Opening WhatsApp…';
      newConfirmBtn.disabled = true;

      // Open WhatsApp first (must be synchronous in click handler)
      openWhatsApp(encoded);

      // Post to backend (non-blocking)
      postOrderToBackend(orderId, cart, total).then(success => {
        if (success) {
          if (typeof clearCart === 'function') clearCart();
          if (typeof showThankYou === 'function') showThankYou();
        } else {
          // Still show thank you — order went to WhatsApp
          if (typeof clearCart === 'function') clearCart();
          if (typeof showThankYou === 'function') showThankYou();
        }
      });

      closeCheckoutModal();
    });
  }

  // Cancel button
  const cancelBtn = document.getElementById('checkout-cancel-btn');
  if (cancelBtn) {
    const newCancelBtn = cancelBtn.cloneNode(true);
    cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
    newCancelBtn.addEventListener('click', closeCheckoutModal);
  }
}

function closeCheckoutModal() {
  const overlay = document.getElementById('checkout-modal-overlay');
  if (overlay) {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// ─── INIT ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', showCheckoutModal);
  }

  const closeBtn = document.getElementById('checkout-modal-close');
  if (closeBtn) closeBtn.addEventListener('click', closeCheckoutModal);

  // Click outside modal to close
  const overlay = document.getElementById('checkout-modal-overlay');
  if (overlay) {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeCheckoutModal();
    });
  }
});
