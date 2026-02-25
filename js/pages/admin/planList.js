// ── Admin Plan List ───────────────────────────────────────────

async function renderAdminPlanList() {
    const app = $('#app');
    app.innerHTML = renderAdminLayout(`
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-bold">إدارة خطط الاشتراك</h1>
      <button class="btn btn-primary" onclick="renderAdminPlanFormModal()">+ إضافة خطة</button>
    </div>
    <div id="admin-plans-table">${renderPageLoader()}</div>
  `, 'plans');

    try {
        const plans = await API.get('/plans');
        const container = $('#admin-plans-table');

        container.innerHTML = `
      <table class="admin-table">
        <thead><tr><th>الخطة</th><th>بالإنجليزية</th><th>المستوى</th><th>الإجراءات</th></tr></thead>
        <tbody>
          ${plans.map(p => `
            <tr>
              <td class="font-medium">${p.nameAr}</td>
              <td class="text-secondary">${p.nameEn || '—'}</td>
              <td class="text-secondary">${p.tier}</td>
              <td>
                <button class="btn btn-ghost btn-sm" onclick="renderAdminPlanFormModal('${p.id}')">تعديل</button>
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

async function renderAdminPlanFormModal(planId) {
    const isEdit = !!planId;
    let plan = null;
    if (isEdit) {
        try {
            const plans = await API.get('/plans');
            plan = plans.find(p => p.id === planId);
        } catch { }
    }

    Modal.open(`
    <div class="modal__header">
      <h2 class="modal__title">${isEdit ? 'تعديل الخطة' : 'إضافة خطة'}</h2>
      <button class="btn btn-ghost btn-icon" onclick="Modal.close()">✕</button>
    </div>
    <form id="plan-modal-form">
      <div class="form-group"><label class="form-label">الاسم بالعربية *</label><input type="text" id="plf-nameAr" required value="${plan?.nameAr || ''}"></div>
      <div class="form-group"><label class="form-label">الاسم بالإنجليزية</label><input type="text" id="plf-nameEn" value="${plan?.nameEn || ''}" dir="ltr"></div>
      <div class="form-group"><label class="form-label">المستوى *</label><input type="number" id="plf-tier" required value="${plan?.tier ?? 0}" min="0" dir="ltr"></div>
      <div id="plf-error" class="form-error mb-4" style="display:none;"></div>
      <div class="flex gap-4">
        <button type="submit" class="btn btn-primary">${isEdit ? 'حفظ' : 'إنشاء'}</button>
        <button type="button" class="btn btn-ghost" onclick="Modal.close()">إلغاء</button>
      </div>
    </form>
  `);

    $('#plan-modal-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            nameAr: $('#plf-nameAr').value,
            nameEn: $('#plf-nameEn').value || undefined,
            tier: parseInt($('#plf-tier').value),
        };
        try {
            if (isEdit) { await API.put(`/admin/plans/${planId}`, data); Toast.success('تم تحديث الخطة'); }
            else { await API.post('/admin/plans', data); Toast.success('تم إنشاء الخطة'); }
            Modal.close();
            renderAdminPlanList();
        } catch (err) {
            $('#plf-error').textContent = err.message;
            $('#plf-error').style.display = 'block';
        }
    });
}
