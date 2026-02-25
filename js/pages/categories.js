// ── Categories Page (i18n + Animations) ───────────────────────

async function renderCategoriesPage() {
  const app = $('#app');
  app.innerHTML = `<div class="page-content page-enter"><div class="container"><h1 class="text-2xl font-bold mb-8">${I18n.t('categories.title')}</h1><div id="categories-grid">${renderLoader(5)}</div></div></div>`;

  try {
    const categories = await API.get('/categories');
    const grid = $('#categories-grid');
    const catName = (cat) => I18n.isAr() ? cat.nameAr : (cat.nameEn || cat.nameAr);

    if (categories.length > 0) {
      grid.innerHTML = `
        <div class="categories-grid stagger-in">
          ${categories.map(cat => `
            <div class="category-card card-3d" onclick="Router.navigate('/categories/${cat.slug}')">
              <div class="category-card__icon float">${getCategoryIcon(cat.icon)}</div>
              <div class="category-card__name">${catName(cat)}</div>
              <div class="category-card__count">${cat._count?.products || 0} ${I18n.t('categories.product')}</div>
              ${cat.children?.length > 0 ? `<div class="text-muted text-sm mt-2">${cat.children.map(c => catName(c)).join('، ')}</div>` : ''}
            </div>
          `).join('')}
        </div>
      `;
    } else {
      grid.innerHTML = renderEmptyState(I18n.t('categories.noCategories'), '', '📁');
    }
  } catch (err) {
    Toast.error(err.message);
  }
}
