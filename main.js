// ── CART STATE ──
const cart = {
  items: [],

  add(name, price) {
    const existing = this.items.find(i => i.name === name);
    if (existing) {
      existing.qty += 1;
    } else {
      this.items.push({ name, price, qty: 1 });
    }
    this.updateBadge();
    this.showToast(`Added "${name}" to cart`);
  },

  get count() {
    return this.items.reduce((sum, i) => sum + i.qty, 0);
  },

  updateBadge() {
    const badge = document.querySelector('.cart-badge');
    if (badge) badge.textContent = this.count;
  },

  showToast(message) {
    let toast = document.getElementById('cart-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'cart-toast';
      toast.style.cssText = `
        position: fixed; bottom: 28px; right: 28px; z-index: 999;
        background: #2D6A4F; color: #fff;
        padding: 12px 20px; border-radius: 8px;
        font-size: 13.5px; font-weight: 500;
        box-shadow: 0 4px 16px rgba(0,0,0,0.18);
        transition: opacity 0.3s, transform 0.3s;
        opacity: 0; transform: translateY(8px);
        font-family: 'Inter', system-ui, sans-serif;
      `;
      document.body.appendChild(toast);
    }
    toast.textContent = '🛒 ' + message;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
    }, 2500);
  }
};

// ── ADD TO CART BUTTONS ──
function initAddToCartButtons() {
  document.querySelectorAll('.btn-add').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.product-card');
      const name = card.querySelector('.product-name').textContent.trim();
      const priceText = card.querySelector('.product-price').textContent.trim();
      const price = parseFloat(priceText.replace('$', ''));
      cart.add(name, price);
    });
  });
}

// ── CATEGORY PILL ACTIVE STATE ──
function initCategoryPills() {
  document.querySelectorAll('.category-pill').forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });
}

// ── SEARCH BAR ──
function initSearch() {
  const searchBtn = document.querySelector('.search-bar button');
  const searchInput = document.querySelector('.search-bar input');

  if (!searchBtn || !searchInput) return;

  const doSearch = () => {
    const query = searchInput.value.trim();
    if (query) {
      cart.showToast(`Searching for "${query}"…`);
    }
  };

  searchBtn.addEventListener('click', doSearch);
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') doSearch();
  });
}

// ── STICKY NAV SHADOW ──
function initStickyNav() {
  const nav = document.querySelector('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      nav.style.boxShadow = '0 2px 12px rgba(0,0,0,0.07)';
    } else {
      nav.style.boxShadow = 'none';
    }
  }, { passive: true });
}

// ── SCROLL REVEAL ──
function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.product-card, .feature-card, .testimonial-card, .cat-tile, .hero-card'
  );

  const style = document.createElement('style');
  style.textContent = `
    .reveal { opacity: 0; transform: translateY(16px); transition: opacity 0.45s ease, transform 0.45s ease; }
    .reveal.visible { opacity: 1; transform: translateY(0); }
  `;
  document.head.appendChild(style);

  targets.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  targets.forEach(el => observer.observe(el));
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  initAddToCartButtons();
  initCategoryPills();
  initSearch();
  initStickyNav();
  initScrollReveal();
});
