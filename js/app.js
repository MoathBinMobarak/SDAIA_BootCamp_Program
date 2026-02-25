// ── App Entry Point ───────────────────────────────────────────

(function initApp() {
    // ── Theme Management ─────────────────────────────────
    const savedTheme = localStorage.getItem('gc_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    function toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('gc_theme', next);
        updateFABs();
    }

    function toggleLang() {
        I18n.toggle();
        // Re-render everything
        renderNavbar();
        renderFooter();
        updateFABs();
        Router.resolve();
    }

    function updateFABs() {
        const theme = document.documentElement.getAttribute('data-theme') || 'dark';
        const langBtn = $('#fab-lang');
        const themeBtn = $('#fab-theme');
        if (langBtn) langBtn.textContent = I18n.t('lang.toggle');
        if (themeBtn) themeBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
    }

    // ── Route Definitions ──────────────────────────────────────

    // Public
    Router.add('/', () => renderHomePage());
    Router.add('/explore', () => renderExplorePage());
    Router.add('/product/:slug', (params) => renderProductDetailPage(params.slug));
    Router.add('/company/:slug', (params) => renderCompanyProfilePage(params.slug));
    Router.add('/categories', () => renderCategoriesPage());
    Router.add('/categories/:slug', (params) => renderCategoryProductsPage(params.slug));
    Router.add('/search', () => renderSearchResultsPage());

    // Auth
    Router.add('/auth/login', () => {
        if (Store.isLoggedIn()) { Router.navigate('/'); return; }
        renderLoginPage();
    });
    Router.add('/auth/register', () => {
        if (Store.isLoggedIn()) { Router.navigate('/'); return; }
        renderRegisterPage();
    });

    // User
    Router.add('/bookmarks', () => renderBookmarksPage());

    // Admin (requires admin role)
    const adminGuard = (render) => (...args) => {
        if (!Store.isLoggedIn()) { Router.navigate('/auth/login'); return; }
        if (!Store.isAdmin()) { Router.navigate('/'); Toast.error(I18n.isAr() ? 'ليس لديك صلاحية' : 'Access denied'); return; }
        render(...args);
    };

    Router.add('/admin', adminGuard(() => renderAdminDashboard()));
    Router.add('/admin/products', adminGuard(() => renderAdminProductList()));
    Router.add('/admin/products/new', adminGuard(() => renderAdminProductForm(null)));
    Router.add('/admin/products/:id', adminGuard((params) => renderAdminProductForm(params.id)));
    Router.add('/admin/companies', adminGuard(() => renderAdminCompanyList()));
    Router.add('/admin/categories', adminGuard(() => renderAdminCategoryList()));
    Router.add('/admin/plans', adminGuard(() => renderAdminPlanList()));
    Router.add('/admin/users', adminGuard(() => renderAdminUserList()));

    // ── Init ───────────────────────────────────────────────────
    renderNavbar();
    renderFooter();
    updateFABs();
    Router.init();

    // ── Load Bookmarks ─────────────────────────────────────────
    if (Store.isLoggedIn()) {
        API.get('/me/bookmarks')
            .then(bm => Store.set('bookmarks', bm))
            .catch(() => { });
    }

    // ── Listen for auth changes ────────────────────────────────
    Store.on('user', () => {
        renderNavbar();
        renderFooter();
    });

    // ── FAB Event Listeners ────────────────────────────────────
    const fabLang = $('#fab-lang');
    const fabTheme = $('#fab-theme');
    const fabTop = $('#fab-top');

    if (fabLang) fabLang.addEventListener('click', toggleLang);
    if (fabTheme) fabTheme.addEventListener('click', toggleTheme);
    if (fabTop) fabTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // Back-to-top visibility
    window.addEventListener('scroll', () => {
        if (fabTop) fabTop.classList.toggle('visible', window.scrollY > 400);
    });

    // ── Navbar Scroll Effect ───────────────────────────────────
    window.addEventListener('scroll', () => {
        const navbar = $('#navbar');
        if (navbar) navbar.classList.toggle('navbar--scrolled', window.scrollY > 20);
    });

    // ── Button Ripple Effect ───────────────────────────────────
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-ripple');
        if (!btn) return;
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
})();
