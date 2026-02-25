// ── Admin Company List ────────────────────────────────────────

async function renderAdminCompanyList() {
    const app = $('#app');
    app.innerHTML = renderAdminLayout(`
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-bold">إدارة الشركات</h1>
      <button class="btn btn-primary" onclick="renderAdminCompanyFormModal()">+ إضافة شركة</button>
    </div>
    <div id="admin-companies-table">${renderPageLoader()}</div>
  `, 'companies');

    try {
        const companies = await API.get('/admin/companies');
        const container = $('#admin-companies-table');

        if (companies.length === 0) {
            container.innerHTML = renderEmptyState('لا توجد شركات', 'أضف أول شركة للبدء', '🏢');
            return;
        }

        container.innerHTML = `
      <table class="admin-table">
        <thead><tr><th>الشركة</th><th>الدولة</th><th>المنتجات</th><th>موثّقة</th><th>الإجراءات</th></tr></thead>
        <tbody>
          ${companies.map(c => `
            <tr>
              <td class="font-medium">${c.nameAr}</td>
              <td class="text-secondary">${c.country || '—'}</td>
              <td class="text-secondary">${c._count?.products || 0}</td>
              <td>${c.isVerified ? '<span class="badge badge-success">موثّقة</span>' : '<span class="badge badge-warning">غير موثّقة</span>'}</td>
              <td class="admin-table__actions">
                <button class="btn btn-ghost btn-sm" onclick="renderAdminCompanyFormModal('${c.id}')">تعديل</button>
                <button class="btn btn-ghost btn-sm" style="color:var(--color-error);" onclick="deleteCompany('${c.id}', '${c.nameAr}')">حذف</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    } catch (err) {
        Toast.error(err.message);
    }
}

async function deleteCompany(id, name) {
    if (!confirm(`هل أنت متأكد من حذف شركة "${name}"؟ سيتم حذف جميع منتجاتها.`)) return;
    try {
        await API.del(`/admin/companies/${id}`);
        Toast.success('تم حذف الشركة');
        renderAdminCompanyList();
    } catch (err) {
        Toast.error(err.message);
    }
}
