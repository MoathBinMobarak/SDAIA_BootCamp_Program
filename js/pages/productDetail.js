// ── Product Detail Page (i18n + Animations) ───────────────────

async function renderProductDetailPage(slug) {
  const app = $('#app');
  app.innerHTML = `<div class="page-content"><div class="container">${renderPageLoader()}</div></div>`;

  try {
    const product = await API.get(`/products/${slug}`);
    const name = I18n.isAr() ? product.nameAr : (product.nameEn || product.nameAr);
    const companyName = I18n.isAr() ? product.company?.nameAr : (product.company?.nameEn || product.company?.nameAr || '');
    const catName = I18n.isAr() ? product.category?.nameAr : (product.category?.nameEn || product.category?.nameAr || '');
    const isBookmarked = Store.isLoggedIn() && Store.get('bookmarks').some(b => b.productId === product.id);

    app.innerHTML = `
      <div class="page-content page-enter">
        <div class="container">

          <!-- Breadcrumb -->
          <nav class="breadcrumb mb-6">
            <a href="#/">${I18n.isAr() ? 'الرئيسية' : 'Home'}</a>
            <span class="breadcrumb__sep">›</span>
            <a href="#/categories/${product.category?.slug}">${catName}</a>
            <span class="breadcrumb__sep">›</span>
            <span class="text-muted">${name}</span>
          </nav>

          <div class="product-detail__header slide-up">
            <div class="product-detail__logo glow-pulse">
              ${product.logoUrl ? `<img src="${product.logoUrl}" alt="${name}">` : getInitials(name)}
            </div>
            <div class="product-detail__info">
              <h1>${name}</h1>
              ${product.nameEn && I18n.isAr() ? `<div class="text-muted text-sm mb-2">${product.nameEn}</div>` : ''}
              ${product.nameAr && !I18n.isAr() ? `<div class="text-muted text-sm mb-2">${product.nameAr}</div>` : ''}
              <div class="product-detail__tagline">${product.taglineAr || ''}</div>
              <div class="flex gap-3 flex-wrap mb-4">
                <a href="#/company/${product.company?.slug}" class="badge badge-primary" style="text-decoration:none;">
                  ${companyName}
                  ${product.company?.isVerified ? ` ${Icons.verified(14)}` : ''}
                </a>
                <a href="#/categories/${product.category?.slug}" class="chip" style="font-size:0.8rem;text-decoration:none;">
                  ${getCategoryIcon(product.category?.icon)} ${catName}
                </a>
                ${product.previewType !== 'none' ? `<span class="badge badge-preview">${getPreviewLabel(product.previewType)}</span>` : ''}
              </div>
              <div class="product-detail__actions">
                ${product.website ? `<a href="${product.website}" target="_blank" rel="noopener" class="btn btn-primary btn-ripple">${I18n.t('product.visit')}</a>` : ''}
                ${product.previewType !== 'none' ? `<button class="btn btn-accent btn-ripple" onclick="document.getElementById('preview-section').scrollIntoView({behavior:'smooth'})">${I18n.t('product.tryIt')}</button>` : ''}
                ${Store.isLoggedIn() ? `
                  <button class="btn btn-secondary" id="bookmark-btn" data-id="${product.id}">
                    ${isBookmarked ? I18n.t('product.saved') : I18n.t('product.save')}
                  </button>
                ` : ''}
              </div>
            </div>
          </div>

          ${product.descriptionAr ? `
            <div class="card p-6 mb-8 slide-up" style="animation-delay:0.1s;">
              <h2 class="text-xl font-bold mb-4">${I18n.t('product.about')}</h2>
              <p class="text-secondary" style="line-height:1.8;">${product.descriptionAr}</p>
            </div>
          ` : ''}

          <div id="preview-section">
            ${renderPreviewPanel(product)}
          </div>

          ${product.productPlans?.length > 0 ? `
            <div class="mt-8 slide-up" style="animation-delay:0.2s;">
              <h2 class="text-xl font-bold mb-6 text-center">${I18n.t('product.plans')}</h2>
              ${renderPlanCards(product.productPlans)}
            </div>
          ` : ''}
        </div>
      </div>
    `;

    // Bookmark handler
    const bookmarkBtn = $('#bookmark-btn');
    if (bookmarkBtn) {
      bookmarkBtn.addEventListener('click', async () => {
        try {
          if (isBookmarked) {
            const bookmark = Store.get('bookmarks').find(b => b.productId === product.id);
            if (bookmark) {
              await API.del(`/me/bookmarks/${bookmark.id}`);
              Store.set('bookmarks', Store.get('bookmarks').filter(b => b.id !== bookmark.id));
              bookmarkBtn.innerHTML = I18n.t('product.save');
              Toast.success(I18n.t('product.removedNotify'));
            }
          } else {
            const newBookmark = await API.post('/me/bookmarks', { productId: product.id });
            Store.set('bookmarks', [...Store.get('bookmarks'), newBookmark]);
            bookmarkBtn.innerHTML = I18n.t('product.saved');
            Toast.success(I18n.t('product.savedNotify'));
          }
        } catch (err) {
          Toast.error(err.message);
        }
      });
    }
  } catch (err) {
    app.innerHTML = `<div class="page-content"><div class="container">${renderEmptyState(I18n.t('product.notFound'), err.message, Icons.search(48), I18n.t('general.backHome'), '/')}</div></div>`;
  }
}
