// ── Explore Page (i18n + Animations) ──────────────────────────

async function renderExplorePage() {
  const app = $('#app');
  app.innerHTML = `
    <div class="page-content page-enter">
      <div class="container">
        <h1 class="text-2xl font-bold mb-8">${I18n.t('explore.title')}</h1>
        <div class="explore-layout">
          <aside class="filter-sidebar card" id="filter-sidebar" style="padding:var(--space-6);">
            <div id="filter-categories" class="filter-section">
              <div class="filter-section__title">${I18n.t('explore.category')}</div>
            </div>
            <div class="filter-section">
              <div class="filter-section__title">${I18n.t('explore.planType')}</div>
              <label class="filter-checkbox"><input type="checkbox" value="free" name="plan"> ${I18n.t('explore.free')}</label>
              <label class="filter-checkbox"><input type="checkbox" value="paid" name="plan"> ${I18n.t('explore.paid')}</label>
            </div>
            <div class="filter-section">
              <div class="filter-section__title">${I18n.t('explore.preview')}</div>
              <label class="filter-checkbox"><input type="checkbox" value="preview" name="preview" id="filter-preview"> ${I18n.t('explore.hasPreview')}</label>
            </div>
            <button class="btn btn-ghost btn-sm mt-4" style="width:100%;" onclick="clearExploreFilters()">${I18n.t('explore.clearFilters')}</button>
          </aside>
          <div>
            <div id="explore-results-count" class="text-sm text-muted mb-4"></div>
            <div id="explore-products">${renderLoader(6)}</div>
            <div id="explore-pagination"></div>
          </div>
        </div>
      </div>
    </div>
  `;

  try {
    const categories = await API.get('/categories');
    const filterCat = $('#filter-categories');
    const catName = (cat) => I18n.isAr() ? cat.nameAr : (cat.nameEn || cat.nameAr);
    categories.forEach(cat => {
      filterCat.innerHTML += `
        <label class="filter-checkbox">
          <input type="checkbox" value="${cat.slug}" name="category"> ${getCategoryIcon(cat.icon)} ${catName(cat)}
        </label>
      `;
    });
  } catch { }

  await loadExploreProducts(1);

  $$('input[name="category"], input[name="plan"], #filter-preview').forEach(input => {
    input.addEventListener('change', () => loadExploreProducts(1));
  });
}

function clearExploreFilters() {
  $$('input[name="category"], input[name="plan"], #filter-preview').forEach(el => el.checked = false);
  loadExploreProducts(1);
}

async function loadExploreProducts(page) {
  const productsContainer = $('#explore-products');
  const paginationContainer = $('#explore-pagination');
  const resultsCount = $('#explore-results-count');

  const selectedCategories = $$('input[name="category"]:checked').map(el => el.value);
  const selectedPlans = $$('input[name="plan"]:checked').map(el => el.value);
  const previewOnly = $('#filter-preview')?.checked;

  let url = `/products?page=${page}&limit=12`;
  if (selectedCategories.length === 1) url += `&category=${selectedCategories[0]}`;

  try {
    productsContainer.innerHTML = renderLoader(6);
    const result = await API.get(url);

    let products = result.data;

    if (selectedCategories.length > 1) {
      products = products.filter(p => selectedCategories.includes(p.category?.slug));
    }
    if (selectedPlans.includes('free') && !selectedPlans.includes('paid')) {
      products = products.filter(p => p.productPlans?.some(pp => pp.priceMonthly === 0));
    }
    if (selectedPlans.includes('paid') && !selectedPlans.includes('free')) {
      products = products.filter(p => p.productPlans?.some(pp => pp.priceMonthly > 0));
    }
    if (previewOnly) {
      products = products.filter(p => p.previewType && p.previewType !== 'none');
    }

    if (resultsCount) resultsCount.textContent = `${result.meta?.total || products.length} ${I18n.t('explore.results')}`;
    productsContainer.innerHTML = renderProductGrid(products);
    paginationContainer.innerHTML = renderPagination(result.meta, loadExploreProducts);
    attachPaginationHandlers(loadExploreProducts);
  } catch (err) {
    productsContainer.innerHTML = renderEmptyState(I18n.t('general.error'), err.message, '⚠️');
  }
}
