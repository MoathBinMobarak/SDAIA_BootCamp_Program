// ── Showcase Page (Demo Product Gallery) ─────────────────────
// A dedicated page showcasing demo products, accessible from the navbar.

function renderShowcasePage() {
  const app = $('#app');
  const products = DemoData.getProducts();
  const categories = DemoData.getCategories();

  app.innerHTML = `
    <div class="page-content page-enter">
      <!-- Showcase Hero -->
      <section class="showcase-hero">
        <div class="container">
          <div class="showcase-hero__badge">${I18n.t('showcase.badge')}</div>
          <h1 class="showcase-hero__title gradient-text">${I18n.t('showcase.title')}</h1>
          <p class="showcase-hero__subtitle">${I18n.t('showcase.subtitle')}</p>
          <div class="showcase-hero__stats">
            <div class="showcase-stat">
              <span class="showcase-stat__value">${products.length}</span>
              <span class="showcase-stat__label">${I18n.t('hero.stat.products')}</span>
            </div>
            <div class="showcase-stat">
              <span class="showcase-stat__value">${categories.length}</span>
              <span class="showcase-stat__label">${I18n.t('hero.stat.categories')}</span>
            </div>
            <div class="showcase-stat">
              <span class="showcase-stat__value">${DemoData.getCompanies().length}</span>
              <span class="showcase-stat__label">${I18n.t('hero.stat.companies')}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Category Filter -->
      <section class="container">
        <div class="showcase-filters" id="showcase-filters">
          <button class="chip active" data-cat="all">${I18n.t('home.viewAll')}</button>
          ${categories.map(cat => {
    const name = I18n.isAr() ? cat.nameAr : cat.nameEn;
    return `<button class="chip" data-cat="${cat.slug}">${getCategoryIcon(cat.icon)} ${name}</button>`;
  }).join('')}
        </div>
      </section>

      <!-- Product Grid -->
      <section class="container mt-6">
        <div class="grid grid-auto-fill stagger-in" id="showcase-grid">
          ${products.map(renderShowcaseCard).join('')}
        </div>
      </section>

      <!-- Showcase CTA -->
      <section class="container mt-8 mb-8">
        <div class="cta-banner">
          <div class="cta-banner__content">
            <h2 class="text-2xl font-bold mb-2">${I18n.t('showcase.cta.title')}</h2>
            <p class="text-secondary mb-6">${I18n.t('showcase.cta.subtitle')}</p>
          </div>
        </div>
      </section>
    </div>
  `;

  // Category filter handler
  const filterBtns = $$('#showcase-filters .chip');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;
      const filtered = cat === 'all' ? products : DemoData.getProductsByCategory(cat);
      const grid = $('#showcase-grid');
      grid.innerHTML = filtered.length > 0
        ? filtered.map(renderShowcaseCard).join('')
        : renderEmptyState(I18n.t('general.noResults'), '', Icons.package(48));
      // Re-trigger stagger animation
      grid.classList.remove('stagger-in');
      void grid.offsetWidth;
      grid.classList.add('stagger-in');
    });
  });

  // Product click handlers
  document.addEventListener('click', function showcaseClick(e) {
    const card = e.target.closest('.showcase-product-card');
    if (card) {
      const slug = card.dataset.slug;
      Router.navigate(`/showcase/${slug}`);
    }
  });
}

function renderShowcaseCard(product) {
  const name = I18n.isAr() ? product.nameAr : product.nameEn;
  const companyName = I18n.isAr() ? product.company.nameAr : product.company.nameEn;
  const tagline = I18n.isAr() ? product.taglineAr : product.taglineEn;
  const catName = I18n.isAr() ? product.category.nameAr : product.category.nameEn;
  const lowestPrice = product.productPlans.length > 0
    ? Math.min(...product.productPlans.map(pp => pp.priceMonthly))
    : null;

  return `
    <div class="card card-3d showcase-product-card" data-slug="${product.slug}">
      <div class="product-card__header">
        <div class="product-card__logo showcase-logo">${getProductEmoji(product.category.icon)}</div>
        <div class="product-card__info">
          <div class="product-card__name">${name}</div>
          <div class="product-card__company">
            ${companyName}
            ${product.company.isVerified ? `<span class="badge badge-verified" title="Verified">${Icons.verified(14)}</span>` : ''}
          </div>
        </div>
      </div>
      <div class="product-card__tagline">${tagline}</div>
      <div class="product-card__footer">
        <div class="product-card__meta">
          <span class="chip" style="pointer-events:none;padding:2px 8px;font-size:0.7rem;">${getCategoryIcon(product.category.icon)} ${catName}</span>
          ${product.previewType !== 'none' ? `<span class="badge badge-preview">${getPreviewLabel(product.previewType)}</span>` : ''}
        </div>
        <div>
          ${lowestPrice !== null
      ? `<span class="font-semibold text-sm">${lowestPrice === 0 ? I18n.t('general.free') : formatCurrency(lowestPrice) + I18n.t('product.monthlyPrice')}</span>`
      : ''}
        </div>
      </div>
    </div>
  `;
}

function getProductEmoji(catIcon) {
  const map = {
    'project': Icons.clipboard(18),
    'finance': Icons.creditCard(18),
    'analytics': Icons.barChart(18),
    'security': Icons.shield(18),
    'communication': Icons.messageCircle(18),
  };
  return map[catIcon] || Icons.package(18);
}


// ── Showcase Product Detail Page ──────────────────────────────

function renderShowcaseDetailPage(slug) {
  const app = $('#app');
  const product = DemoData.getProduct(slug);

  if (!product) {
    app.innerHTML = `<div class="page-content"><div class="container">${renderEmptyState(I18n.t('product.notFound'), '', Icons.search(48), I18n.t('general.backHome'), '/showcase')}</div></div>`;
    return;
  }

  const name = I18n.isAr() ? product.nameAr : product.nameEn;
  const companyName = I18n.isAr() ? product.company.nameAr : product.company.nameEn;
  const catName = I18n.isAr() ? product.category.nameAr : product.category.nameEn;
  const description = I18n.isAr() ? product.descriptionAr : product.descriptionEn;

  app.innerHTML = `
    <div class="page-content page-enter">
      <div class="container">

        <!-- Breadcrumb -->
        <nav class="breadcrumb mb-6">
          <a href="#/showcase">${I18n.t('showcase.nav')}</a>
          <span class="breadcrumb__sep">›</span>
          <span class="text-muted">${name}</span>
        </nav>

        <div class="product-detail__header slide-up">
          <div class="product-detail__logo glow-pulse">
            <span style="font-size:2.5rem">${getProductEmoji(product.category.icon)}</span>
          </div>
          <div class="product-detail__info">
            <h1>${name}</h1>
            ${product.nameEn && I18n.isAr() ? `<div class="text-muted text-sm mb-2">${product.nameEn}</div>` : ''}
            ${product.nameAr && !I18n.isAr() ? `<div class="text-muted text-sm mb-2">${product.nameAr}</div>` : ''}
            <div class="product-detail__tagline">${I18n.isAr() ? product.taglineAr : product.taglineEn}</div>
            <div class="flex gap-3 flex-wrap mb-4">
              <span class="badge badge-primary" style="text-decoration:none;">
                ${companyName}
                ${product.company.isVerified ? ` ${Icons.verified(14)}` : ''}
              </span>
              <span class="chip" style="font-size:0.8rem;">
                ${getCategoryIcon(product.category.icon)} ${catName}
              </span>
              ${product.previewType !== 'none' ? `<span class="badge badge-preview">${getPreviewLabel(product.previewType)}</span>` : ''}
            </div>
            <div class="product-detail__actions">
              ${product.website ? `<a href="${product.website}" target="_blank" rel="noopener" class="btn btn-primary btn-ripple">${I18n.t('product.visit')}</a>` : ''}
              ${product.previewType !== 'none' ? `<button class="btn btn-accent btn-ripple" onclick="document.getElementById('preview-section').scrollIntoView({behavior:'smooth'})">${I18n.t('product.tryIt')}</button>` : ''}
            </div>
          </div>
        </div>

        ${description ? `
          <div class="card p-6 mb-8 slide-up" style="animation-delay:0.1s;">
            <h2 class="text-xl font-bold mb-4">${I18n.t('product.about')}</h2>
            <p class="text-secondary" style="line-height:1.8;">${description}</p>
          </div>
        ` : ''}

        <div id="preview-section">
          ${renderPreviewPanel(product)}
        </div>

        ${product.productPlans.length > 0 ? `
          <div class="mt-8 slide-up" style="animation-delay:0.2s;">
            <h2 class="text-xl font-bold mb-6 text-center">${I18n.t('product.plans')}</h2>
            ${renderPlanCards(product.productPlans)}
          </div>
        ` : ''}

        <!-- Related showcase products -->
        <div class="mt-8 mb-8 slide-up" style="animation-delay:0.3s;">
          <h2 class="text-xl font-bold mb-6">${I18n.t('product.related')}</h2>
          <div class="grid grid-auto-fill stagger-in">
            ${DemoData.getProducts()
      .filter(p => p.category.id === product.category.id && p.id !== product.id)
      .slice(0, 3)
      .map(renderShowcaseCard).join('') ||
    DemoData.getProducts().filter(p => p.id !== product.id).slice(0, 3).map(renderShowcaseCard).join('')
    }
          </div>
        </div>
      </div>
    </div>
  `;
}
