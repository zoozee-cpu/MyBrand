/* ============================================================
   ZKS FRAGRANCES — QUIZ.JS
   Fragrance Finder modal: 3-question quiz + recommendation
   engine using weighted profile matching
   ============================================================ */

'use strict';

// ─── QUIZ DATA ────────────────────────────────────────────────
const QUIZ_QUESTIONS = [
  {
    id: 'timeOfDay',
    step: 'Question 1 of 3',
    question: 'When do you reach for a new scent?',
    options: [
      { letter: 'A', text: 'Morning — I want to feel refreshed', value: 'day' },
      { letter: 'B', text: 'Evening — I dress to impress',       value: 'night' },
      { letter: 'C', text: 'Both — it depends on my mood',       value: 'both' }
    ]
  },
  {
    id: 'profile',
    step: 'Question 2 of 3',
    question: 'Which profile speaks to you most?',
    options: [
      { letter: 'A', text: 'Sweet & Warm — comforting, dessert-like',     value: 'sweet' },
      { letter: 'B', text: 'Woody & Smoky — deep, mysterious, earthy',    value: 'woody' },
      { letter: 'C', text: 'Fresh & Clean — light, airy, uplifting',      value: 'fresh' }
    ]
  },
  {
    id: 'occasion',
    step: 'Question 3 of 3',
    question: "What's the occasion?",
    options: [
      { letter: 'A', text: 'My everyday signature', value: 'everyday' },
      { letter: 'B', text: 'Special evenings & events', value: 'special' }
    ]
  }
];

// ─── STATE ───────────────────────────────────────────────────
const QuizState = {
  currentStep: 0,
  answers: { timeOfDay: null, profile: null, occasion: null }
};

// ─── RECOMMENDATION ENGINE ────────────────────────────────────
function scoreProduct(product, answers) {
  let score = 0;
  const qp = product.quizProfile;

  // Time-of-day match (weight: 30)
  if (answers.timeOfDay) {
    if (qp.timeOfDay === answers.timeOfDay) score += 30;
    else if (qp.timeOfDay === 'both' || answers.timeOfDay === 'both') score += 15;
  }

  // Profile match (weight: 40)
  if (answers.profile) {
    if (qp.profile.includes(answers.profile)) score += 40;
    else if (answers.profile === 'woody' && qp.profile.includes('smoky')) score += 20;
    else if (answers.profile === 'fresh' && qp.profile.includes('sweet')) score += 10;
  }

  // Occasion match (weight: 30)
  if (answers.occasion) {
    if (qp.occasion === answers.occasion) score += 30;
    else score += 10; // partial match
  }

  return score;
}

function getRecommendations(answers) {
  const scored = (typeof PRODUCTS !== 'undefined' ? PRODUCTS : [])
    .map(p => ({ product: p, score: scoreProduct(p, answers) }))
    .sort((a, b) => b.score - a.score);

  // Return top 2, ensuring at least 2 results
  return scored.slice(0, 2).map(s => s.product);
}

// ─── RENDER ───────────────────────────────────────────────────
function getProgressPercent() {
  return Math.round(((QuizState.currentStep + 1) / (QUIZ_QUESTIONS.length + 1)) * 100);
}

function renderQuizStep() {
  const inner = document.getElementById('quiz-inner');
  const progressBar = document.getElementById('quiz-progress-bar');
  if (!inner) return;

  const q = QUIZ_QUESTIONS[QuizState.currentStep];
  if (!q) return;

  if (progressBar) progressBar.style.width = `${getProgressPercent()}%`;

  inner.innerHTML = `
    <span class="quiz-step-label">${q.step}</span>
    <h2 class="quiz-question">${q.question}</h2>
    <div class="quiz-options">
      ${q.options.map(opt => `
        <button class="quiz-option" data-value="${opt.value}" onclick="selectQuizOption(this, '${q.id}', '${opt.value}')">
          <span class="quiz-option-letter">${opt.letter}</span>
          <span class="quiz-option-text">${opt.text}</span>
        </button>
      `).join('')}
    </div>
  `;

  inner.classList.remove('quiz-step-enter');
  void inner.offsetWidth;
  inner.classList.add('quiz-step-enter');
}

function renderQuizResult() {
  const inner = document.getElementById('quiz-inner');
  const progressBar = document.getElementById('quiz-progress-bar');
  if (!inner) return;

  if (progressBar) progressBar.style.width = '100%';

  const recommendations = getRecommendations(QuizState.answers);

  inner.innerHTML = `
    <span class="quiz-step-label">Your Signature Scents</span>
    <h2 class="quiz-question" style="font-size:clamp(1.25rem,3vw,1.75rem)">We found your perfect match.</h2>
    <div class="quiz-result-cards">
      ${recommendations.map(p => `
        <div class="product-card" style="cursor:default">
          <div class="product-card-image-wrap">
            ${p.badge ? `<span class="badge badge-gold product-card-badge">${p.badge}</span>` : ''}
            <img class="product-card-img" src="${p.images.primary}" alt="${p.name}"
              onerror="this.parentElement.innerHTML='<div class=\\'product-card-placeholder\\'>${p.name.split(' ').map(w=>w[0]).join('').slice(0,2)}</div>'">
          </div>
          <div class="product-card-body">
            <div class="product-card-families">${p.scentFamily.join(' · ')}</div>
            <h3 class="product-card-name">${p.name}</h3>
            <p style="font-size:0.8rem;color:var(--color-text-muted);margin-bottom:var(--space-2);font-family:var(--font-body)">${p.description.slice(0,90)}…</p>
            <div class="product-card-price">${p.currency} ${p.price.toLocaleString()}</div>
            <hr class="product-card-rule">
            <div class="product-card-actions">
              <button class="btn btn-outline btn-sm" onclick="quizQuickAdd('${p.id}','${p.name}')">Add to Cart</button>
              <a class="btn btn-ghost btn-sm" href="product.html?id=${p.id}" onclick="closeQuiz()">View →</a>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
    <button class="btn btn-ghost btn-sm" onclick="resetQuiz()">↺ Retake Quiz</button>
  `;

  inner.classList.remove('quiz-step-enter');
  void inner.offsetWidth;
  inner.classList.add('quiz-step-enter');
}

// ─── ACTIONS ─────────────────────────────────────────────────
function selectQuizOption(el, questionId, value) {
  // Highlight selected
  el.closest('.quiz-options').querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');

  // Store answer
  QuizState.answers[questionId] = value;

  // Advance after short delay
  setTimeout(() => {
    QuizState.currentStep++;
    if (QuizState.currentStep < QUIZ_QUESTIONS.length) {
      renderQuizStep();
    } else {
      renderQuizResult();
    }
  }, 350);
}

function quizQuickAdd(productId, name) {
  if (typeof addToCart === 'function') addToCart(productId);
  if (typeof showToast === 'function') showToast(`✓ ${name} added to cart`, 'View Cart', 'cart.html');
}

function resetQuiz() {
  QuizState.currentStep = 0;
  QuizState.answers = { timeOfDay: null, profile: null, occasion: null };
  renderQuizStep();
  const progressBar = document.getElementById('quiz-progress-bar');
  if (progressBar) progressBar.style.width = '33%';
}

function closeQuiz() {
  const modal = document.querySelector('.quiz-modal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// ─── MODAL INIT ───────────────────────────────────────────────
function initQuizModal() {
  const modal = document.querySelector('.quiz-modal');
  if (!modal) return;

  // Close button
  const closeBtn = modal.querySelector('.quiz-close');
  if (closeBtn) closeBtn.addEventListener('click', closeQuiz);

  // Click outside (on backdrop)
  modal.addEventListener('click', e => {
    if (e.target === modal) closeQuiz();
  });

  // ESC key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeQuiz();
  });

  // Open event
  if (typeof EventBus !== 'undefined') {
    EventBus.on('quizOpen', () => {
      resetQuiz();
      renderQuizStep();
    });
  }

  // Also init for direct open links
  document.querySelectorAll('[data-quiz-open]').forEach(btn => {
    btn.addEventListener('click', () => {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      resetQuiz();
      renderQuizStep();
    });
  });
}

// ─── INIT ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', initQuizModal);
