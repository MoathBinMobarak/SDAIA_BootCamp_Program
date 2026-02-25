// ── Admin Product List ─────────────────────────────────────────

async function renderAdminProductList() {
  const app = $('#app');
  app.innerHTML = renderAdminLayout(`
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-bold">إدارة المنتجات</h1>
      <button class="btn btn-primary" onclick="Router.navigate('/admin/products/new')">+ إضافة منتج</button>
    </div>
    <div id="admin-products-table">${renderPageLoader()}</div>
  `, 'products');

  try {
    const result = await API.get('/admin/products?limit=50');
    const container = $('#admin-products-table');

    if (result.data.length === 0) {
      container.innerHTML = renderEmptyState('لا توجد منتجات', 'أضف أول منتج للبدء', Icons.package(48), 'إضافة منتج', '/admin/products/new');
      return;
    }

    container.innerHTML = `
      <table class="admin-table">
        <thead>
          <tr>
            <th>المنتج</th>
            <th>الشركة</th>
            <th>التصنيف</th>
            <th>الحالة</th>
            <th>المعاينة</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          ${result.data.map(p => {
      const status = getStatusLabel(p.status);
      return `
              <tr>
                <td class="font-medium">${p.nameAr}</td>
                <td class="text-secondary">${p.company?.nameAr || '—'}</td>
                <td class="text-secondary">${p.category?.nameAr || '—'}</td>
                <td><span class="badge ${status.class}">${status.text}</span></td>
                <td>${p.previewType !== 'none' ? `<span class="badge badge-preview">${getPreviewLabel(p.previewType)}</span>` : '—'}</td>
                <td class="admin-table__actions">
                  <button class="btn btn-ghost btn-sm" onclick="Router.navigate('/admin/products/${p.id}')">تعديل</button>
                  <button class="btn btn-ghost btn-sm" style="color:var(--color-error);" onclick="deleteProduct('${p.id}', '${p.nameAr}')">حذف</button>
                </td>
              </tr>
            `;
    }).join('')}
        </tbody>
      </table>
    `;
  } catch (err) {
    Toast.error(err.message);
  }
}

async function deleteProduct(id, name) {
  if (!confirm(`هل أنت متأكد من حذف "${name}"؟`)) return;
  try {
    await API.del(`/admin/products/${id}`);
    Toast.success('تم حذف المنتج');
    renderAdminProductList();
  } catch (err) {
    Toast.error(err.message);
  }
}
