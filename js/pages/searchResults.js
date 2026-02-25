// ── Search Results Page (i18n) ─────────────────────────────────

async function renderSearchResultsPage() {
    const app = $('#app');
    const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
    const query = params.get('q') || '';

    app.innerHTML = `
    <div class="page-content page-enter">
      <div class="container">
        <h1 class="text-2xl font-bold mb-2">${I18n.t('search.title')}</h1>
        <p class="text-muted mb-8">${I18n.t('search.for')} "${query}"</p>
        <div id="search-results">${renderLoader(6)}</div>
        <div id="search-pagination"></div>
      </div>
    </div>
  `;

    if (!query) {
        $('#search-results').innerHTML = renderEmptyState(I18n.t('search.enterQuery'), '', Icons.search(48));
        return;
    }

    try {
        const result = await API.get(`/products?search=${encodeURIComponent(query)}&limit=12`);
        if (result.data.length === 0) {
            $('#search-results').innerHTML = renderEmptyState(I18n.t('search.noResults'), `${I18n.t('search.tryDifferent')}`, Icons.search(48), I18n.t('search.browseAll'), '/explore');
        } else {
            $('#search-results').innerHTML = renderProductGrid(result.data);
        }
        $('#search-pagination').innerHTML = renderPagination(result.meta);
        attachPaginationHandlers(async (page) => {
            const res = await API.get(`/products?search=${encodeURIComponent(query)}&page=${page}&limit=12`);
            $('#search-results').innerHTML = renderProductGrid(res.data);
            $('#search-pagination').innerHTML = renderPagination(res.meta);
            attachPaginationHandlers(arguments.callee);
        });
    } catch (err) {
        $('#search-results').innerHTML = renderEmptyState(I18n.t('general.error'), err.message, Icons.alertCircle(48));
    }
}
