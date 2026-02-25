// ── Admin Category List ───────────────────────────────────────

async function renderAdminCategoryList() {
    const app = $('#app');
    app.innerHTML = renderAdminLayout(`
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-bold">إدارة التصنيفات</h1>
      <button class="btn btn-primary" onclick="renderAdminCategoryFormModal()">+ إضافة تصنيف</button>
    </div>
    <div id="admin-categories-table">${renderPageLoader()}</div>
  `, 'categories');

    try {
        const categories = await API.get('/categories');
        const container = $('#admin-categories-table');
        const flat = [];
        categories.forEach(cat => {
            flat.push(cat);
            if (cat.children) cat.children.forEach(c => flat.push({ ...c, _isChild: true }));
        });

        container.innerHTML = `
      <table class="admin-table">
        <thead><tr><th>التصنيف</th><th>الأيقونة</th><th>المنتجات</th><th>الترتيب</th><th>الإجراءات</th></tr></thead>
        <tbody>
          ${flat.map(c => `
            <tr>
              <td class="font-medium">${c._isChild ? '↳ ' : ''}${c.nameAr}</td>
              <td>${getCategoryIcon(c.icon)}</td>
              <td class="text-secondary">${c._count?.products || '—'}</td>
              <td class="text-secondary">${c.sortOrder}</td>
              <td class="admin-table__actions">
                <button class="btn btn-ghost btn-sm" onclick="renderAdminCategoryFormModal('${c.id}')">تعديل</button>
                <button class="btn btn-ghost btn-sm" style="color:var(--color-error);" onclick="deleteCategory('${c.id}', '${c.nameAr}')">حذف</button>
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

async function deleteCategory(id, name) {
    if (!confirm(`هل أنت متأكد من حذف تصنيف "${name}"؟`)) return;
    try {
        await API.del(`/admin/categories/${id}`);
        Toast.success('تم حذف التصنيف');
        renderAdminCategoryList();
    } catch (err) {
        Toast.error(err.message);
    }
}

async function renderAdminCategoryFormModal(catId) {
    const isEdit = !!catId;
    let category = null;
    let categories = [];

    try {
        categories = await API.get('/categories');
        if (isEdit) {
            const flat = [];
            categories.forEach(c => { flat.push(c); if (c.children) flat.push(...c.children); });
            category = flat.find(c => c.id === catId);
        }
    } catch { }

    Modal.open(`
    <div class="modal__header">
      <h2 class="modal__title">${isEdit ? 'تعديل التصنيف' : 'إضافة تصنيف'}</h2>
      <button class="btn btn-ghost btn-icon" onclick="Modal.close()">✕</button>
    </div>
    <form id="cat-modal-form">
      <div class="form-group"><label class="form-label">الاسم بالعربية *</label><input type="text" id="catf-nameAr" required value="${category?.nameAr || ''}"></div>
      <div class="form-group"><label class="form-label">الاسم بالإنجليزية</label><input type="text" id="catf-nameEn" value="${category?.nameEn || ''}" dir="ltr"></div>
      <div class="form-group"><label class="form-label">الاسم المختصر *</label><input type="text" id="catf-slug" required value="${category?.slug || ''}" dir="ltr"></div>
      <div class="form-group"><label class="form-label">الأيقونة</label><input type="text" id="catf-icon" value="${category?.icon || ''}" placeholder="clipboard, users, calculator..." dir="ltr"></div>
      <div class="form-group"><label class="form-label">الترتيب</label><input type="number" id="catf-order" value="${category?.sortOrder || 0}" dir="ltr"></div>
      <div id="catf-error" class="form-error mb-4" style="display:none;"></div>
      <div class="flex gap-4">
        <button type="submit" class="btn btn-primary">${isEdit ? 'حفظ' : 'إنشاء'}</button>
        <button type="button" class="btn btn-ghost" onclick="Modal.close()">إلغاء</button>
      </div>
    </form>
  `);

    $('#cat-modal-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            nameAr: $('#catf-nameAr').value,
            nameEn: $('#catf-nameEn').value || undefined,
            slug: $('#catf-slug').value,
            icon: $('#catf-icon').value || undefined,
            sortOrder: parseInt($('#catf-order').value) || 0,
        };
        try {
            if (isEdit) { await API.put(`/admin/categories/${catId}`, data); Toast.success('تم تحديث التصنيف'); }
            else { await API.post('/admin/categories', data); Toast.success('تم إنشاء التصنيف'); }
            Modal.close();
            renderAdminCategoryList();
        } catch (err) {
            $('#catf-error').textContent = err.message;
            $('#catf-error').style.display = 'block';
        }
    });
}
