// ── Admin Dashboard ───────────────────────────────────────────

async function renderAdminDashboard() {
  const app = $('#app');
  app.innerHTML = renderAdminLayout(`
    <h1 class="text-2xl font-bold mb-8">لوحة التحكم</h1>
    <div class="stats-grid" id="admin-stats">${renderLoader(4)}</div>
    <div class="card p-6">
      <h2 class="text-lg font-bold mb-4">مرحبًا بك في لوحة التحكم</h2>
      <p class="text-secondary">من هنا يمكنك إدارة المنتجات والشركات والتصنيفات وخطط الاشتراك.</p>
    </div>
  `, 'dashboard');

  try {
    const [products, companies, categories, users] = await Promise.all([
      API.get('/admin/products?limit=1'),
      API.get('/admin/companies'),
      API.get('/categories'),
      API.get('/admin/users'),
    ]);

    $('#admin-stats').innerHTML = `
      <div class="stat-card">
        <div class="stat-card__value">${products.meta?.total || 0}</div>
        <div class="stat-card__label">المنتجات</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__value">${companies.length || 0}</div>
        <div class="stat-card__label">الشركات</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__value">${categories.length || 0}</div>
        <div class="stat-card__label">التصنيفات</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__value">${users.length || 0}</div>
        <div class="stat-card__label">المستخدمين</div>
      </div>
    `;
  } catch (err) {
    Toast.error(err.message);
  }
}

function renderAdminLayout(content, activePage = '') {
  const menuItems = [
    { label: 'لوحة التحكم', icon: Icons.barChart(18), route: '/admin', key: 'dashboard' },
    { label: 'المنتجات', icon: Icons.package(18), route: '/admin/products', key: 'products' },
    { label: 'الشركات', icon: Icons.building(18), route: '/admin/companies', key: 'companies' },
    { label: 'التصنيفات', icon: Icons.folder(18), route: '/admin/categories', key: 'categories' },
    { label: 'خطط الاشتراك', icon: Icons.creditCard(18), route: '/admin/plans', key: 'plans' },
    { label: 'المستخدمون', icon: Icons.user(18), route: '/admin/users', key: 'users' },
  ];

  return `
    <div class="admin-layout">
      <aside class="admin-sidebar" id="admin-sidebar">
        ${menuItems.map(item => `
          <div class="admin-sidebar__item ${activePage === item.key ? 'active' : ''}" onclick="Router.navigate('${item.route}')">
            <span>${item.icon}</span>
            <span>${item.label}</span>
          </div>
        `).join('')}
      </aside>
      <div class="admin-content">
        ${content}
      </div>
    </div>
  `;
}
