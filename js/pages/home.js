// ── Home Page (i18n + Animations + Sections) ──────────────────

function createParticles(count = 20) {
  let html = '';
  const colors = ['var(--color-primary)', 'var(--color-accent)', 'var(--color-primary-light)'];
  for (let i = 0; i < count; i++) {
    const size = Math.random() * 6 + 3;
    const left = Math.random() * 100;
    const delay = Math.random() * 15;
    const duration = Math.random() * 15 + 10;
    const color = colors[Math.floor(Math.random() * colors.length)];
    html += `<div class="particle" style="width:${size}px;height:${size}px;left:${left}%;animation-delay:${delay}s;animation-duration:${duration}s;background:${color};"></div>`;
  }
  return `<div class="particles">${html}</div>`;
}

async function renderHomePage() {
  const app = $('#app');
  app.innerHTML = `
    <div class="page-enter">
      <!-- Hero -->
      <section class="hero dot-pattern" style="position:relative;">
        ${createParticles(25)}
        <div class="container" style="position:relative;z-index:1;">
          <h1 class="hero__title gradient-text">${I18n.t('hero.title')}</h1>
          <p class="hero__subtitle">${I18n.t('hero.subtitle')}</p>
          <div class="hero__search">
            <span class="hero__search-icon">🔍</span>
            <input type="text" id="hero-search" placeholder="${I18n.t('hero.search')}" aria-label="Search">
          </div>
          <div class="hero__stats" id="hero-stats">
            <div class="hero__stat"><span class="hero__stat-value counter" data-target="0">0</span><span class="hero__stat-label">${I18n.t('hero.stat.products')}</span></div>
            <div class="hero__stat"><span class="hero__stat-value counter" data-target="0">0</span><span class="hero__stat-label">${I18n.t('hero.stat.companies')}</span></div>
            <div class="hero__stat"><span class="hero__stat-value counter" data-target="0">0</span><span class="hero__stat-label">${I18n.t('hero.stat.categories')}</span></div>
          </div>
        </div>
      </section>

      <!-- Categories -->
      <section class="container" style="margin-top:-2rem;position:relative;z-index:2;">
        <div class="section-header">
          <h2 class="section-title">${I18n.t('home.categories')}</h2>
          <a href="#/categories" class="btn btn-ghost btn-sm hover-underline">${I18n.t('home.viewAll')}</a>
        </div>
        <div id="home-categories">${renderLoader(5)}</div>
      </section>

      <!-- Featured Products -->
      <section class="container mt-8">
        <div class="section-header">
          <h2 class="section-title">${I18n.t('home.featured')}</h2>
          <a href="#/explore" class="btn btn-ghost btn-sm hover-underline">${I18n.t('home.viewAll')}</a>
        </div>
        <div id="home-featured">${renderLoader(6)}</div>
      </section>

      <!-- How It Works -->
      <section class="container mt-8">
        <h2 class="section-title text-center mb-8">${I18n.t('home.howItWorks')}</h2>
        <div class="grid grid-3 stagger-in" id="how-it-works">
          <div class="card card-3d text-center" style="padding:var(--space-10);">
            <div style="font-size:3rem;margin-bottom:var(--space-4);">🔍</div>
            <h3 class="font-bold text-lg mb-2">${I18n.t('home.step1.title')}</h3>
            <p class="text-secondary text-sm">${I18n.t('home.step1.desc')}</p>
          </div>
          <div class="card card-3d text-center border-gradient" style="padding:var(--space-10);">
            <div style="font-size:3rem;margin-bottom:var(--space-4);">⚡</div>
            <h3 class="font-bold text-lg mb-2">${I18n.t('home.step2.title')}</h3>
            <p class="text-secondary text-sm">${I18n.t('home.step2.desc')}</p>
          </div>
          <div class="card card-3d text-center" style="padding:var(--space-10);">
            <div style="font-size:3rem;margin-bottom:var(--space-4);">✅</div>
            <h3 class="font-bold text-lg mb-2">${I18n.t('home.step3.title')}</h3>
            <p class="text-secondary text-sm">${I18n.t('home.step3.desc')}</p>
          </div>
        </div>
      </section>

      <!-- Latest Products -->
      <section class="container mt-8">
        <div class="section-header">
          <h2 class="section-title">${I18n.t('home.latest')}</h2>
        </div>
        <div id="home-latest">${renderLoader(6)}</div>
      </section>

      <!-- CTA Banner -->
      <section class="container mt-8 mb-8">
        <div class="cta-banner">
          <div class="cta-banner__content">
            <h2 class="text-2xl font-bold mb-2">${I18n.t('home.cta.title')}</h2>
            <p class="text-secondary mb-6">${I18n.t('home.cta.subtitle')}</p>
            <a href="#/auth/register" class="btn btn-accent btn-lg btn-ripple">${I18n.t('home.cta.btn')}</a>
          </div>
        </div>
      </section>
    </div>
  `;

  // Hero search
  $('#hero-search').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      Router.navigate(`/search?q=${encodeURIComponent(e.target.value.trim())}`);
    }
  });

  // Load data
  try {
    const [categoriesRes, featuredRes, latestRes] = await Promise.all([
      API.get('/categories'),
      API.get('/products?featured=true&limit=6'),
      API.get('/products?limit=6'),
    ]);

    // Animate counters
    const counters = $$('.counter');
    if (counters[0]) animateCounter(counters[0], featuredRes.meta?.total || 10);
    if (counters[1]) animateCounter(counters[1], categoriesRes.length || 3);
    if (counters[2]) animateCounter(counters[2], categoriesRes.length || 5);

    // Categories
    const catContainer = $('#home-categories');
    if (categoriesRes.length > 0) {
      const catName = (cat) => I18n.isAr() ? cat.nameAr : (cat.nameEn || cat.nameAr);
      catContainer.innerHTML = `
        <div class="categories-grid stagger-in">
          ${categoriesRes.map(cat => `
            <div class="category-card card-3d" onclick="Router.navigate('/categories/${cat.slug}')">
              <div class="category-card__icon float">${getCategoryIcon(cat.icon)}</div>
              <div class="category-card__name">${catName(cat)}</div>
              <div class="category-card__count">${cat._count?.products || 0} ${I18n.t('categories.product')}</div>
            </div>
          `).join('')}
        </div>
      `;
    } else {
      catContainer.innerHTML = renderEmptyState(I18n.t('categories.noCategories'), '', '📁');
    }

    // Featured products
    $('#home-featured').innerHTML = renderProductGrid(featuredRes.data);

    // Latest products
    $('#home-latest').innerHTML = renderProductGrid(latestRes.data);

  } catch (err) {
    Toast.error(err.message);
  }
}

function animateCounter(el, target) {
  let current = 0;
  const step = Math.ceil(target / 40);
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = current;
  }, 30);
}
