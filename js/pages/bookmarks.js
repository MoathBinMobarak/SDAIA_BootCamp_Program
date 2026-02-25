// ── Bookmarks Page (i18n) ─────────────────────────────────────

async function renderBookmarksPage() {
    if (!Store.isLoggedIn()) { Router.navigate('/auth/login'); return; }

    const app = $('#app');
    app.innerHTML = `<div class="page-content page-enter"><div class="container"><h1 class="text-2xl font-bold mb-8">${I18n.t('bookmarks.title')}</h1><div id="bookmarks-list">${renderLoader(4)}</div></div></div>`;

    try {
        const bookmarks = await API.get('/me/bookmarks');
        Store.set('bookmarks', bookmarks);
        const container = $('#bookmarks-list');

        if (bookmarks.length === 0) {
            container.innerHTML = renderEmptyState(I18n.t('bookmarks.empty'), I18n.t('bookmarks.emptyText'), '🤍', I18n.t('search.browseAll'), '/explore');
            return;
        }

        container.innerHTML = renderProductGrid(bookmarks.map(b => b.product));
    } catch (err) {
        Toast.error(err.message);
    }
}
