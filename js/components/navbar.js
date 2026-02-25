// ── Navbar Component (i18n + Theme) ──────────────────────────

function renderNavbar() {
    const navbar = $('#navbar');
    const isLoggedIn = Store.isLoggedIn();
    const isAdmin = Store.isAdmin();
    const user = Store.get('user');

    navbar.innerHTML = `
    <div class="navbar__inner">
      <a href="#/" class="navbar__logo gradient-text" style="font-size:1.25rem;font-weight:700;text-decoration:none;">
        <span style="margin-inline-end:6px;">🛒</span>SoftMarket
      </a>
      <div class="navbar__search">
        <span class="navbar__search-icon">🔍</span>
        <input type="text" id="navbar-search" placeholder="${I18n.t('nav.search')}" autocomplete="off" aria-label="Search">
        <div class="search-dropdown hidden" id="search-dropdown"></div>
      </div>
      <div class="navbar__links" id="navbar-links">
        <a href="#/explore" class="navbar__link hover-underline" data-route="/explore">${I18n.t('nav.explore')}</a>
        <a href="#/categories" class="navbar__link hover-underline" data-route="/categories">${I18n.t('nav.categories')}</a>
        ${isAdmin ? `<a href="#/admin" class="navbar__link hover-underline" data-route="/admin">${I18n.t('nav.admin')}</a>` : ''}
        ${isLoggedIn
            ? `<a href="#/bookmarks" class="navbar__link hover-underline" data-route="/bookmarks">${I18n.t('nav.bookmarks')}</a>
             <div class="flex items-center gap-3">
               <span class="text-sm text-secondary">${user.name}</span>
               <button class="btn btn-ghost btn-sm" id="logout-btn">${I18n.t('nav.logout')}</button>
             </div>`
            : `<a href="#/auth/login" class="btn btn-primary btn-sm btn-ripple">${I18n.t('nav.login')}</a>`}
      </div>
      <button class="navbar__menu-btn" id="menu-toggle" aria-label="Menu">☰</button>
    </div>
  `;

    // Search handler
    const searchInput = $('#navbar-search');
    searchInput.addEventListener('input', debounce(async (e) => {
        const query = e.target.value.trim();
        if (query.length < 2) {
            $('#search-dropdown').classList.add('hidden');
            return;
        }
        try {
            const result = await API.get(`/products?search=${encodeURIComponent(query)}&limit=5`);
            renderSearchDropdown(result.data, query);
        } catch (err) {
            console.error(err);
        }
    }, 300));

    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const query = e.target.value.trim();
            if (query) {
                $('#search-dropdown').classList.add('hidden');
                Router.navigate(`/search?q=${encodeURIComponent(query)}`);
            }
        }
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar__search')) {
            $('#search-dropdown').classList.add('hidden');
        }
    });

    // Mobile menu toggle
    $('#menu-toggle').addEventListener('click', () => {
        $('#navbar-links').classList.toggle('open');
    });

    // Logout
    const logoutBtn = $('#logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await API.post('/auth/logout', { refreshToken: Store.get('refreshToken') });
            } catch { }
            Store.logout();
            renderNavbar();
            Router.navigate('/');
            Toast.success(I18n.t('auth.loggedOut'));
        });
    }

    highlightActiveLink();
}

function highlightActiveLink() {
    const hash = window.location.hash.replace('#', '') || '/';
    $$('.navbar__link').forEach(link => {
        const route = link.dataset.route;
        if (route && hash.startsWith(route)) link.classList.add('active');
        else link.classList.remove('active');
    });
}

function renderSearchDropdown(products, query) {
    const dropdown = $('#search-dropdown');
    if (products.length === 0) {
        dropdown.innerHTML = `<div class="search-dropdown__item text-muted text-sm">${I18n.t('general.noResults')}: "${query}"</div>`;
    } else {
        dropdown.innerHTML = products.map(p => `
      <div class="search-dropdown__item" data-slug="${p.slug}">
        <div class="product-card__logo" style="width:36px;height:36px;font-size:0.85rem;">${getInitials(I18n.isAr() ? p.nameAr : (p.nameEn || p.nameAr))}</div>
        <div>
          <div class="font-medium text-sm">${I18n.isAr() ? p.nameAr : (p.nameEn || p.nameAr)}</div>
          <div class="text-muted" style="font-size:0.7rem;">${I18n.isAr() ? p.company?.nameAr : (p.company?.nameEn || p.company?.nameAr || '')}</div>
        </div>
      </div>
    `).join('');

        dropdown.querySelectorAll('.search-dropdown__item').forEach(item => {
            item.addEventListener('click', () => {
                dropdown.classList.add('hidden');
                Router.navigate(`/product/${item.dataset.slug}`);
            });
        });
    }
    dropdown.classList.remove('hidden');
}
