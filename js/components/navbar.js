// ── Navbar Component (Premium Design + SVG Icons) ────────────

function renderNavbar() {
  const navbar = $('#navbar');
  const isLoggedIn = Store.isLoggedIn();
  const isAdmin = Store.isAdmin();
  const user = Store.get('user');

  navbar.innerHTML = `
    <div class="navbar__inner">
      <a href="#/" class="navbar__logo" style="text-decoration:none;">
        <span class="navbar__logo-icon">${Icons.shoppingCart(22)}</span>
        <span class="navbar__logo-text gradient-text">SoftMarket</span>
      </a>

      <div class="navbar__center">
        <div class="navbar__links" id="navbar-links">
          <a href="#/" class="navbar__link hover-underline" data-route="/">
            <span class="navbar__link-icon">${Icons.home(16)}</span>
            ${I18n.isAr() ? 'الرئيسية' : 'Home'}
          </a>
          <a href="#/showcase" class="navbar__link navbar__link--showcase hover-underline" data-route="/showcase">
            <span class="navbar__link-dot"></span>
            ${I18n.t('showcase.nav')}
          </a>
          <a href="#/explore" class="navbar__link hover-underline" data-route="/explore">
            <span class="navbar__link-icon">${Icons.compass(16)}</span>
            ${I18n.t('nav.explore')}
          </a>
          <a href="#/categories" class="navbar__link hover-underline" data-route="/categories">
            <span class="navbar__link-icon">${Icons.folder(16)}</span>
            ${I18n.t('nav.categories')}
          </a>
          <a href="#/submit" class="navbar__link navbar__link--submit hover-underline" data-route="/submit">
            <span class="navbar__link-icon">${Icons.sparkles(16)}</span>
            ${I18n.t('submit.nav')}
          </a>
          ${isAdmin ? `<a href="#/admin" class="navbar__link hover-underline" data-route="/admin">
            <span class="navbar__link-icon">${Icons.shield(16)}</span>
            ${I18n.t('nav.admin')}
          </a>` : ''}
        </div>
      </div>

      <div class="navbar__search">
        <label for="navbar-search" class="navbar__search-icon">${Icons.search(16)}</label>
        <input type="search" id="navbar-search" name="search" placeholder="${I18n.t('nav.search')}\u2026" autocomplete="off" aria-label="Search products">
        <div class="search-dropdown hidden" id="search-dropdown" role="listbox" aria-label="Search results"></div>
      </div>

      <div class="navbar__actions">
        ${isLoggedIn
      ? `<a href="#/bookmarks" class="navbar__action-btn" aria-label="${I18n.t('nav.bookmarks')}">${Icons.bookmark(18)}</a>
             <div class="navbar__user">
               <span class="navbar__user-avatar">${user?.name?.charAt(0) || 'U'}</span>
               <button class="btn btn-ghost btn-sm" id="logout-btn">
                 ${Icons.logOut(14)}
                 <span>${I18n.t('nav.logout')}</span>
               </button>
             </div>`
      : `<a href="#/auth/login" class="btn btn-sm navbar__login-btn">
             ${Icons.logIn(14)}
             <span>${I18n.t('nav.login')}</span>
           </a>`}
      </div>

      <button class="navbar__menu-btn" id="menu-toggle" aria-label="Menu" aria-expanded="false">
        <span class="navbar__hamburger">
          <span></span><span></span><span></span>
        </span>
      </button>
    </div>
  `;

  // Search handler
  const searchInput = $('#navbar-search');
  let searchAbortController = null;

  searchInput.addEventListener('input', debounce(async (e) => {
    const query = e.target.value.trim();
    if (query.length < 2) {
      $('#search-dropdown').classList.add('hidden');
      return;
    }
    // Search demo data first, then API
    const demoResults = DemoData.searchProducts(query);
    if (demoResults.length > 0) {
      renderSearchDropdown(demoResults, query, true);
      return;
    }
    try {
      if (searchAbortController) searchAbortController.abort();
      searchAbortController = new AbortController();
      const result = await API.get(`/products?search=${encodeURIComponent(query)}&limit=5`);
      renderSearchDropdown(result.data, query, false);
    } catch (err) {
      if (err.name !== 'AbortError') renderSearchDropdown([], query, false);
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

  // Close dropdown on outside click (use { once: false } to avoid leaking)
  const closeDropdown = (e) => {
    if (!e.target.closest('.navbar__search')) {
      $('#search-dropdown')?.classList.add('hidden');
    }
  };
  document.removeEventListener('click', closeDropdown);
  document.addEventListener('click', closeDropdown);

  // Mobile menu toggle
  const menuToggle = $('#menu-toggle');
  menuToggle.addEventListener('click', () => {
    const links = $('#navbar-links');
    const hamburger = $('.navbar__hamburger');
    const isOpen = links.classList.toggle('open');
    hamburger?.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', isOpen);
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
    if (route && hash.startsWith(route) && (route !== '/' || hash === '/')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

function renderSearchDropdown(products, query, isDemo = false) {
  const dropdown = $('#search-dropdown');
  if (products.length === 0) {
    dropdown.innerHTML = `<div class="search-dropdown__item text-muted text-sm" role="option">${I18n.t('general.noResults')}: "${query}"</div>`;
  } else {
    dropdown.innerHTML = products.map(p => `
      <a href="#${isDemo ? '/showcase/' : '/product/'}${p.slug}" class="search-dropdown__item" role="option">
        <div class="product-card__logo" style="width:36px;height:36px;font-size:0.85rem;">${p.logoUrl ? `<img src="${p.logoUrl}" alt="${I18n.isAr() ? p.nameAr : (p.nameEn || p.nameAr)}" width="36" height="36">` : getCategoryIcon(p.category?.icon)}</div>
        <div>
          <div class="font-medium text-sm">${I18n.isAr() ? p.nameAr : (p.nameEn || p.nameAr)}</div>
          <div class="text-muted" style="font-size:0.7rem;">${I18n.isAr() ? p.company?.nameAr : (p.company?.nameEn || p.company?.nameAr || '')}</div>
        </div>
      </a>
    `).join('');
  }
  dropdown.classList.remove('hidden');
}
