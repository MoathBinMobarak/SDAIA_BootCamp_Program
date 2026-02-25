// ── Category Products Page (i18n) ─────────────────────────────

async function renderCategoryProductsPage(slug) {
  const app = $('#app');
  app.innerHTML = `<div class="page-content"><div class="container">${renderPageLoader()}</div></div>`;

  try {
    const result = await API.get(`/categories/${slug}/products`);
    const catName = I18n.isAr() ? result.category?.nameAr : (result.category?.nameEn || result.category?.nameAr || slug);

    app.innerHTML = `
      <div class="page-content page-enter">
        <div class="container">
          <nav class="breadcrumb mb-6">
            <a href="#/">${I18n.isAr() ? 'الرئيسية' : 'Home'}</a>
            <span class="breadcrumb__sep">›</span>
            <a href="#/categories">${I18n.t('categories.title')}</a>
            <span class="breadcrumb__sep">›</span>
            <span class="text-muted">${catName}</span>
          </nav>
          <div class="flex items-center gap-4 mb-8">
            <span style="font-size:2.5rem;" class="float">${getCategoryIcon(result.category?.icon)}</span>
            <div>
              <h1 class="text-2xl font-bold">${catName}</h1>
              <span class="text-muted text-sm">${result.meta?.total || 0} ${I18n.t('categories.product')}</span>
            </div>
          </div>
          <div id="category-products">${renderProductGrid(result.data)}</div>
          <div id="category-pagination">${renderPagination(result.meta)}</div>
        </div>
      </div>
    `;
    attachPaginationHandlers(async (page) => {
      const res = await API.get(`/categories/${slug}/products?page=${page}`);
      $('#category-products').innerHTML = renderProductGrid(res.data);
      $('#category-pagination').innerHTML = renderPagination(res.meta);
      attachPaginationHandlers(arguments.callee);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  } catch (err) {
    app.innerHTML = `<div class="page-content"><div class="container">${renderEmptyState(I18n.t('categories.noCategories'), err.message, Icons.folder(48), I18n.t('categories.title'), '/categories')}</div></div>`;
  }
}
